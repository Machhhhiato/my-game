import type { Faction, TerrainId, WorldResource, WorldState, WorldTile } from '../core/types';

function mulberry(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash3(ix: number, iy: number, iz: number, seed: number): number {
  let h = seed ^ Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 946050911);
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 10000) / 10000;
}

function smooth(t: number): number { return t * t * (3 - 2 * t); }

/** 3D 值噪声(三线性插值) */
function noise3(x: number, y: number, z: number, seed: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const u = smooth(fx), v = smooth(fy), w = smooth(fz);
  let acc = 0;
  for (let di = 0; di < 2; di++) {
    for (let dj = 0; dj < 2; dj++) {
      for (let dk = 0; dk < 2; dk++) {
        const h = hash3(ix + di, iy + dj, iz + dk, seed);
        acc += h * (di ? u : 1 - u) * (dj ? v : 1 - v) * (dk ? w : 1 - w);
      }
    }
  }
  return acc;
}

/** 海拔(多 octave 球面 3D 噪声) */
function fbm(x: number, y: number, z: number, seed: number): number {
  return noise3(x * 1.3, y * 1.3, z * 1.3, seed) * 0.55
    + noise3(x * 2.6, y * 2.6, z * 2.6, seed) * 0.30
    + noise3(x * 5.2, y * 5.2, z * 5.2, seed) * 0.15;
}

/** 湿度(独立噪声, 决定森林/沙漠) */
function moisture(x: number, y: number, z: number, seed: number): number {
  return noise3(x * 1.8 + 41, y * 1.8 + 41, z * 1.8 + 41, seed + 12345) * 0.6
    + noise3(x * 4.0 + 83, y * 4.0 + 83, z * 4.0 + 83, seed + 67890) * 0.4;
}

/** 球面经纬度 → 地形(核心地形逻辑, 渲染与 tile 共用) */
export function terrainAtLonLat(lonRad: number, latDeg: number, seed: number): TerrainId {
  // 极地冰盖
  if (Math.abs(latDeg) > 70) return 'ice';
  const lat = latDeg * Math.PI / 180;
  const x = Math.cos(lat) * Math.cos(lonRad);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.sin(lonRad);
  const e = fbm(x, y, z, seed);
  const SEA = 0.55; // 海平面(约 70% 海洋)
  if (e < SEA) return 'ocean';
  if (e < SEA + 0.015) return 'coast';
  if (e > 0.68) return 'mountain';
  const m = moisture(x, y, z, seed);
  // 副热带沙漠带(约南北纬 15°~35° 且干旱)
  if (Math.abs(latDeg) >= 15 && Math.abs(latDeg) <= 35 && m < 0.42) return 'desert';
  if (m > 0.58) return 'forest';
  if (m < 0.45 && Math.abs(latDeg) < 15) return 'river'; // 赤道湿润带河流
  return 'plains';
}

/** 平面 tile 坐标 → 球面经纬度 → 地形 */
function terrainAt(x: number, y: number, W: number, H: number, seed: number): TerrainId {
  const lon = (x / W) * Math.PI * 2;
  const latDeg = (y / H - 0.5) * 180;
  return terrainAtLonLat(lon, latDeg, seed);
}

const FACTION_NAMES = ['赤焰部族', '苍狼联邦', '翡翠王国', '铁砧联盟', '风沙汗国'];
const FACTION_COLORS = ['#e05a4a', '#5a8ae0', '#4ac27a', '#c2a04a', '#b07ae0'];

const RESOURCE_POOL: WorldResource[] = ['wood', 'steel', 'food'];

export function generateWorld(seed: number): WorldState {
  const W = 160, H = 80; // 2:1, 每格≈地级市尺度(地球基准)
  const rnd = mulberry(seed);
  const tiles: WorldTile[][] = [];
  for (let y = 0; y < H; y++) {
    const row: WorldTile[] = [];
    for (let x = 0; x < W; x++) {
      const terrain = terrainAt(x, y, W, H, seed);
      let resource: WorldResource = 'none';
      let fertile = 0.5;
      if (terrain !== 'ocean' && terrain !== 'coast' && terrain !== 'mountain' && terrain !== 'ice') {
        if (rnd() < 0.12) resource = RESOURCE_POOL[Math.floor(rnd() * 3)];
        fertile = 0.3 + rnd() * 0.7;
        if (terrain === 'forest') fertile += 0.1;
        if (terrain === 'desert') fertile *= 0.4;
      }
      row.push({ x, y, terrain, resource, fertile, ownerId: null, settled: false });
    }
    tiles.push(row);
  }

  // 势力撒点(6 个,含玩家)
  const factionPoints: { x: number; y: number }[] = [];
  let guard = 0;
  while (factionPoints.length < 6 && guard++ < 2000) {
    const x = 5 + Math.floor(rnd() * (W - 10));
    const y = 5 + Math.floor(rnd() * (H - 10));
    const t = tiles[y][x];
    if (t.terrain === 'ocean' || t.terrain === 'mountain' || t.terrain === 'ice') continue;
    if (factionPoints.every(p => Math.hypot(p.x - x, p.y - y) > 30)) factionPoints.push({ x, y });
  }
  while (factionPoints.length < 6) factionPoints.push({ x: Math.floor(rnd() * W), y: Math.floor(rnd() * H) });

  const factions: Faction[] = [];
  const settlements = [];
  // 玩家 = 第 0 个
  factions.push({ id: 'player', name: '你的殖民地', color: '#4da3ff', relation: 100, military: 40, attitude: 'ally', alive: true });
  for (let i = 0; i < 5; i++) {
    factions.push({
      id: `f${i}`, name: FACTION_NAMES[i], color: FACTION_COLORS[i],
      relation: Math.floor(rnd() * 60) - 30, military: 60 + rnd() * 140,
      attitude: 'neutral', alive: true,
    });
  }

  // 各势力初始据点 + 领土(BFS 扩张)
  for (let i = 0; i < 6; i++) {
    const p = factionPoints[i];
    const fid = factions[i].id;
    settlements.push({
      id: `st${i}`, name: i === 0 ? '家园殖民地' : `${factions[i].name}首都`,
      x: p.x, y: p.y, factionId: fid,
      level: i === 0 ? 1 : 2 + Math.floor(rnd() * 2),
      population: i === 0 ? 3 : 12 + Math.floor(rnd() * 18),
    });
    tiles[p.y][p.x].ownerId = fid;
    tiles[p.y][p.x].settled = true;
    // BFS 占领土
    const queue: [number, number][] = [[p.x, p.y]];
    let claimed = 1;
    const target = 120 + Math.floor(rnd() * 160);
    for (let qi = 0; qi < queue.length && claimed < target; qi++) {
      const [cx, cy] = queue[qi];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const t = tiles[ny][nx];
        if (t.ownerId || t.terrain === 'ocean' || t.terrain === 'ice') continue;
        if (rnd() < 0.7) {
          t.ownerId = fid;
          queue.push([nx, ny]);
          claimed++;
          if (claimed >= target) break;
        }
      }
    }
  }

  // 玩家初始视野(据点周围 4 格)
  const reveal: boolean[][] = [];
  for (let y = 0; y < H; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < W; x++) row.push(false);
    reveal.push(row);
  }
  const home = factionPoints[0];
  for (let y = home.y - 4; y <= home.y + 4; y++) {
    for (let x = home.x - 4; x <= home.x + 4; x++) {
      if (x >= 0 && y >= 0 && x < W && y < H) reveal[y][x] = true;
    }
  }

  return {
    w: W, h: H, tiles, factions, settlements, roads: [], reveal,
    playerId: 'player', unified: false,
  };
}

/** 据点等级(1-5)由人口决定 */
export function settlementLevel(population: number): number {
  if (population >= 60) return 5;
  if (population >= 30) return 4;
  if (population >= 15) return 3;
  if (population >= 6) return 2;
  return 1;
}

export const SETTLEMENT_ICONS = ['🛖', '🏘️', '🏰', '🏙️', '🌆'];
export const ROAD_NAMES = ['泥地土路', '石砖路', '混凝土公路', '铁路'];
