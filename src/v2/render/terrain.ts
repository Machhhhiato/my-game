// ============ 程序化地形：宏观大陆 + 河谷微地形 + 连续色阶，纯地形纹理，河网道路走矢量 ============
import { fbm3, hash2 } from './noise';
import { NODES, REGIONS } from '../data';
import type { ClimateKind, TectonicBoundary, TerrainModuleSlot, WorldBlueprint } from '../types';
import { getGeoGrid } from '../world/geoGrid';

export const TEX_W = 2048;
export const TEX_H = 1024;
export const SEA = 0.5;
export const SKELETON_W = 1024;
export const SKELETON_H = 512;

// L5 全球战略格平均间距约 160 km；512×256 的逻辑高程格已略密于它。
// 原 1024×512 会在载入时做 52 万次多 octave 重建，却不会增加任何可推演地点精度。
// 视觉细节由冻结地貌资产和近景补丁承担，不能靠阻塞主线程的噪声缓存硬堆。
const H_W = 512;
const H_H = 256;
const D2R = Math.PI / 180;

let hCache: Float32Array | null = null;
let mCache: Float32Array | null = null;
let cacheWorldKey = '';

function angularDistDeg(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const dLon = ((lon2 - lon1 + 180) % 360 + 360) % 360 - 180;
  const dLat = lat2 - lat1;
  const a = Math.sin(dLat * D2R / 2) ** 2 +
    Math.cos(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.sin(dLon * D2R / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) / D2R;
}

// ============ 河网（手工锚定：主河 + 两条支流，遵循河谷） ============
export type Polyline = [number, number][];

const MAIN_RIVER: Polyline = [
  [36.5, 22.0], [37.5, 20.5], [38.6, 18.8], [40.3, 16.8], [42.5, 15.0],
  [44.5, 13.5], [46.5, 11.0], [47.2, 8.5], [47.6, 5.5],
];
const TRIBUTARY_WEST: Polyline = [
  [34.0, 21.0], [35.6, 19.4], [37.3, 18.5],
];
const TRIBUTARY_EAST: Polyline = [
  [43.0, 18.8], [42.0, 17.2], [41.0, 16.5],
];

// ============ 大陆形状（连续球面距离场，确定性） ============

// 山系（山脊线）
const NORTHERN_RANGE: Polyline = [[-4, 39], [15, 45], [34, 44], [51, 41], [65, 35]];
const WEST_RIDGE: Polyline = [[34.2, 22.5], [35.2, 19.2], [36.1, 15.5], [37.0, 11.5], [37.6, 8.0]];
const EAST_FOOTHILLS: Polyline = [[43.4, 21.5], [44.0, 18.0], [45.2, 14.5], [46.5, 10.5], [47.4, 7.0]];

export const VALLEY_RIDGES: Polyline[] = [WEST_RIDGE, EAST_FOOTHILLS];

/** 平面近似的折线距离（度，小距离够用，无三角函数开销） */
function distToPolylineDeg(lon: number, lat: number, poly: Polyline): number {
  const cosLat = Math.cos(lat * D2R);
  let best = Infinity;
  for (let i = 0; i < poly.length - 1; i++) {
    const ax = poly[i][0], ay = poly[i][1];
    const bx = poly[i + 1][0], by = poly[i + 1][1];
    const dx = (bx - ax) * cosLat, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 === 0 ? 0 : (((lon - ax) * cosLat) * dx + (lat - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + (bx - ax) * t, cy = ay + (by - ay) * t;
    const px = (lon - cx) * cosLat, py = lat - cy;
    const d = Math.hypot(px, py);
    if (d < best) best = d;
  }
  return best;
}

/** 局部流域的最近距离和沿程位置；用于把“河流”变成真正向出口下降的地形约束。 */
function pathDistanceAndProgress(lon: number, lat: number, poly: Polyline): { distance: number; progress: number } {
  const cosLat = Math.cos(lat * D2R);
  let best = Infinity;
  let progress = 0;
  for (let i = 0; i < poly.length - 1; i++) {
    const ax = poly[i][0], ay = poly[i][1];
    const bx = poly[i + 1][0], by = poly[i + 1][1];
    const dx = (bx - ax) * cosLat, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, (((lon - ax) * cosLat) * dx + (lat - ay) * dy) / len2));
    const cx = ax + (bx - ax) * t, cy = ay + (by - ay) * t;
    const distance = Math.hypot((lon - cx) * cosLat, lat - cy);
    if (distance < best) {
      best = distance;
      progress = (i + t) / (poly.length - 1);
    }
  }
  return { distance: best, progress };
}

function ridge(lon: number, lat: number, poly: Polyline, halfWidth: number, height: number): number {
  const d = distToPolylineDeg(lon, lat, poly);
  const t = 1 - d / halfWidth;
  return t <= 0 ? 0 : t * t * height;
}

function valley(lon: number, lat: number, poly: Polyline, halfWidth: number, depth: number): number {
  const d = distToPolylineDeg(lon, lat, poly);
  const t = 1 - d / halfWidth;
  return t <= 0 ? 0 : -(t * t * depth);
}

function smoothstep(low: number, high: number, value: number): number {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return t * t * (3 - 2 * t);
}

function seedUnit(seed: number, index: number): number {
  return Math.sin(seed * 0.000071 + index * 17.137) * 0.5 + 0.5;
}

/**
 * 单个大陆的球面距离场。海岸由连续的地壳扰动生成，不能再用多边形硬裁出直角边。
 * `WorldBlueprint.landmasses` 是唯一自然事实源；同一参数既存档，也参与高程重建。
 */
function landmassField(lon: number, lat: number, world: WorldBlueprint, index: number): number {
  const mass = world.landmasses[index];
  const dLon = ((lon - mass.center[0] + 180) % 360 + 360) % 360 - 180;
  const dx = dLon * Math.cos((lat + mass.center[1]) * 0.5 * D2R) / mass.radius[0];
  const dy = (lat - mass.center[1]) / mass.radius[1];
  const rotation = (seedUnit(world.seed, index) - 0.5) * 0.78;
  const u = dx * Math.cos(rotation) - dy * Math.sin(rotation);
  const v = dx * Math.sin(rotation) + dy * Math.cos(rotation);
  const angle = Math.atan2(v, u);
  const lonR = lon * D2R, latR = lat * D2R;
  const x = Math.cos(latR) * Math.cos(lonR), y = Math.sin(latR), z = Math.cos(latR) * Math.sin(lonR);
  const phase = seedUnit(world.seed, index + 19) * Math.PI * 2;
  const coastWarp =
    Math.sin(angle * 3 + phase) * 0.105 +
    Math.sin(angle * 5 - phase * 0.7) * 0.055 +
    (fbm3(x * 3 + index * 7, y * 3, z * 3, world.seed + 801 + index, 3) - 0.5) * 0.16;
  // 一个大陆由主克拉通、伸出的半岛和相连的陆块组成；这些都是同一地壳块的连续距离场，
  // 不用多边形裁边，也不会把多个贴片叠成规则圆形岛。
  // 每块大陆从少量“克拉通—半岛”原型中选取；原型决定大尺度形状，种子只改变海岸细节。
  // 这样全景能读出大陆与洋盆，而不是每块陆地都是同一种五瓣花。
  const continentalArchetypes: Array<Array<[number, number, number]>> = [
    // 首局主大陆：北部宽阔、南部收束、东侧有半岛，河谷位于中东部内陆。
    [[0, 0, 0.72], [-0.10, 0.42, 0.53], [0.28, 0.27, 0.43], [0.50, -0.05, 0.30], [-0.13, -0.48, 0.40]],
    // 南北向的狭长大陆，形成远洋航路两侧的对照陆块。
    [[-0.08, 0.34, 0.47], [-0.20, 0.02, 0.36], [-0.05, -0.37, 0.35], [0.26, 0.30, 0.28]],
    // 宽阔的东部大陆，带一条向南伸出的半岛。
    [[0, 0.10, 0.72], [-0.42, 0.18, 0.43], [0.39, 0.24, 0.49], [0.42, -0.24, 0.34], [-0.10, -0.36, 0.31]],
    // 南半球中等大陆：西部高原、东部海湾、南端狭窄。
    [[-0.10, 0.10, 0.58], [-0.38, 0.12, 0.34], [0.30, 0.08, 0.38], [0.06, -0.43, 0.32]],
    // 岛陆与高原块：保持独立，但不用规则圆形。
    [[0, 0.08, 0.52], [-0.34, 0.12, 0.28], [0.30, -0.12, 0.30]],
  ];
  const lobePattern = continentalArchetypes[index % continentalArchetypes.length];
  let field = -Infinity;
  for (let lobe = 0; lobe < lobePattern.length; lobe++) {
    const [ox, oy, radius] = lobePattern[lobe];
    const drift = (seedUnit(world.seed, index * 11 + lobe + 37) - 0.5) * 0.12;
    const lx = u - ox - drift * Math.cos(phase + lobe * 1.7);
    const ly = v - oy - drift * Math.sin(phase + lobe * 1.7);
    // 面积标定到类地球陆地占比；不靠增加一块“大白饼”来补面积。
    field = Math.max(field, radius * 1.24 + coastWarp * (lobe === 0 ? 0.95 : 0.55) - Math.hypot(lx, ly));
  }
  // 海湾是从海向陆的圆滑侵入，不会产生截图中那种笔直的截断带。
  const gulfA = Math.exp(-(((u - 0.18) / 0.30) ** 2 + ((v + 0.47) / 0.23) ** 2));
  const gulfB = Math.exp(-(((u + 0.45) / 0.24) ** 2 + ((v - 0.25) / 0.32) ** 2));
  return (field - gulfA * 0.20 - gulfB * 0.13) * mass.continentalness;
}

/** 宏观陆地场：大陆之间只依靠连续距离场交接，不再出现贴片式截断。 */
function macroLand(lon: number, lat: number, world: WorldBlueprint): number {
  const lonR = lon * D2R, latR = lat * D2R;
  const x = Math.cos(latR) * Math.cos(lonR);
  const y = Math.sin(latR);
  const z = Math.cos(latR) * Math.sin(lonR);
  let field = -1;
  for (let index = 0; index < world.landmasses.length; index++) field = Math.max(field, landmassField(lon, lat, world, index));
  // 只轻微扰动海床，避免在外海随机长出一串规则圆岛。
  return field + (fbm3(x * 1.7, y * 1.7, z * 1.7, world.seed + 557, 3) - 0.5) * 0.055;
}

function baseElevation(lonDeg: number, latDeg: number, world: WorldBlueprint): number {
  const seed = world.seed;
  const lon = lonDeg * D2R, lat = latDeg * D2R;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.sin(lon);
  const continentalField = macroLand(lonDeg, latDeg, world);
  const shelf = smoothstep(-0.58, 0.13, continentalField);
  const continent = smoothstep(-0.08, 0.20, continentalField);
  const oceanFloor = fbm3(x * 1.35, y * 1.35, z * 1.35, seed + 91, 4) - 0.5;
  const landRelief = fbm3(x * 2.2, y * 2.2, z * 2.2, seed + 101, 4) - 0.5;
  // 深洋盆地 → 大陆架 → 低地连续过渡；大陆内部也由低频起伏分出盆地与高原。
  let e = SEA - 0.192 + oceanFloor * 0.040 + shelf * 0.145 + continent * (0.145 + landRelief * 0.072);
  for (const boundary of world.tectonicBoundaries) e += tectonicRelief(lonDeg, latDeg, boundary, continent);
  for (const watershed of world.watersheds) {
    const drainage = pathDistanceAndProgress(lonDeg, latDeg, watershed.path);
    const basinReach = Math.max(0, 1 - drainage.distance / 11);
    // 从源头到出口的整体落差由蓝图流域提供；河槽只在近岸局部切低，避免挖出一条直线沟。
    e += (0.5 - drainage.progress) * 0.105 * basinReach * continent;
    e += valley(lonDeg, latDeg, watershed.path, 0.72, 0.023) * continent;
  }
  e += terrainModuleRelief(lonDeg, latDeg, world, continent);
  return e;
}

function tectonicRelief(lon: number, lat: number, boundary: TectonicBoundary, continent: number): number {
  const width = boundary.width * 2.9;
  if (boundary.kind === 'convergent') return ridge(lon, lat, boundary.path, width, boundary.intensity * 0.62) * continent;
  if (boundary.kind === 'divergent') {
    // 洋中脊抬高海床；大陆张裂则是低缓裂谷。两者由同一边界数据解释。
    const seaRidge = ridge(lon, lat, boundary.path, width * 1.35, boundary.intensity * 0.30) * (1 - continent);
    const rift = valley(lon, lat, boundary.path, width, boundary.intensity * 0.20) * continent;
    return seaRidge + rift;
  }
  // 转换断层更多表现为断块和狭窄谷地，不应画成第二条喜马拉雅山脉。
  return ridge(lon, lat, boundary.path, width * 0.78, boundary.intensity * 0.18) * continent
    + valley(lon, lat, boundary.path, width * 0.42, boundary.intensity * 0.12) * continent;
}

function moistureAt(lonDeg: number, latDeg: number, seed: number): number {
  const lon = lonDeg * D2R, lat = latDeg * D2R;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.sin(lon);
  let m = fbm3(x * 1.7 + 41, y * 1.7 + 41, z * 1.7 + 41, seed + 12345, 4);
  // 副热带干燥带（|lat| 15–35 略干）
  const dry = Math.exp(-(((Math.abs(latDeg) - 25) / 12) ** 2));
  m = m * (1 - dry * 0.22);
  return m;
}

function worldGeometryKey(world: WorldBlueprint): string {
  return JSON.stringify({ seed: world.seed, planet: world.planet, landmasses: world.landmasses, tectonicPlates: world.tectonicPlates, tectonicBoundaries: world.tectonicBoundaries, ranges: world.ranges, watersheds: world.watersheds, terrainModules: world.terrainModules });
}

function buildGrids(world: WorldBlueprint): void {
  hCache = new Float32Array(H_W * H_H);
  mCache = new Float32Array(H_W * H_H);
  for (let gy = 0; gy < H_H; gy++) {
    const lat = 90 - (gy / H_H) * 180;
    for (let gx = 0; gx < H_W; gx++) {
      const lon = (gx / H_W) * 360;
      hCache[gy * H_W + gx] = baseElevation(lon, lat, world);
      mCache[gy * H_W + gx] = moistureAt(lon, lat, world.seed);
    }
  }
  cacheWorldKey = worldGeometryKey(world);
}

function ensureGrids(world: WorldBlueprint): void {
  if (!hCache || cacheWorldKey !== worldGeometryKey(world)) buildGrids(world);
}

/** 双线性采样高程（经度环绕） */
export function sampleHeight(lonDeg: number, latDeg: number, world: WorldBlueprint): number {
  ensureGrids(world);
  const u = (((lonDeg % 360) + 360) % 360) / 360 * H_W;
  let v = (90 - latDeg) / 180 * H_H;
  v = Math.max(0, Math.min(H_H - 0.001, v));
  const x0 = Math.floor(u), y0 = Math.floor(v);
  const fx = u - x0, fy = v - y0;
  const x1 = (x0 + 1) % H_W;
  const y1 = Math.min(H_H - 1, y0 + 1);
  const a = hCache![y0 * H_W + x0], b = hCache![y0 * H_W + x1];
  const c = hCache![y1 * H_W + x0], d = hCache![y1 * H_W + x1];
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

function sampleMoisture(lonDeg: number, latDeg: number, world: WorldBlueprint): number {
  ensureGrids(world);
  const u = (((lonDeg % 360) + 360) % 360) / 360 * H_W;
  let v = (90 - latDeg) / 180 * H_H;
  v = Math.max(0, Math.min(H_H - 0.001, v));
  const x0 = Math.floor(u), y0 = Math.floor(v);
  const fx = u - x0, fy = v - y0;
  const x1 = (x0 + 1) % H_W;
  const y1 = Math.min(H_H - 1, y0 + 1);
  const a = mCache![y0 * H_W + x0], b = mCache![y0 * H_W + x1];
  const c = mCache![y1 * H_W + x0], d = mCache![y1 * H_W + x1];
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

export function isLandAt(lonDeg: number, latDeg: number, world: WorldBlueprint): boolean {
  return sampleHeight(lonDeg, latDeg, world) >= SEA;
}

function pointInPolygon(lon: number, lat: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function inAcidRegion(lonDeg: number, latDeg: number): boolean {
  const r = REGIONS.find(x => x.id === 'south_acid')!;
  return pointInPolygon(lonDeg, latDeg, r.outline);
}

export function inValleyRegion(lonDeg: number, latDeg: number): boolean {
  const r = REGIONS.find(x => x.id === 'emerald_valley')!;
  return pointInPolygon(lonDeg, latDeg, r.outline);
}

export function inRegion(regionId: string, lonDeg: number, latDeg: number): boolean {
  const r = REGIONS.find(x => x.id === regionId);
  return r ? pointInPolygon(lonDeg, latDeg, r.outline) : false;
}

function clampShade(v: number): number {
  return Math.max(0.78, Math.min(1.16, v));
}

function hillshade(lonDeg: number, latDeg: number, world: WorldBlueprint): number {
  const d = 0.5;
  const eC = sampleHeight(lonDeg, latDeg, world);
  const eW = sampleHeight(lonDeg - d, latDeg, world);
  const eN = sampleHeight(lonDeg, latDeg + d, world);
  const gx = (eW - eC) / d;
  const gy = (eN - eC) / d;
  const lx = -0.707, ly = 0.707, lz = 0.707;
  const dot = (lx * gx + ly * gy + lz) / Math.hypot(gx, gy, 1);
  return clampShade(dot * 0.34 + 0.88);
}

// ============ 河网（缓存） ============
let riversCache: Polyline[] | null = null;
let riversKey = '';

export function getRivers(world: WorldBlueprint): Polyline[] {
  const key = `${world.generatorVersion}:${world.seed}:${world.hydrology?.basins.map((basin) => `${basin.id}:${basin.cellIds.join('.')}`).join('|') ?? ''}`;
  if (!riversCache || riversKey !== key) {
    // 首局河谷保持第一条，以便湿润河谷渲染、地点选址和叙事阅读稳定；
    // 其余出海主流由球面水文网络提供，绝不从贴图或镜头位置临时编造。
    const grid = getGeoGrid();
    const generated = world.hydrology?.basins
      .filter((basin) => basin.source === 'generated' && basin.drainage === 'ocean')
      .map((basin) => basin.cellIds.map((id) => {
        const cell = grid.byId.get(id)!;
        return [cell.lon, cell.lat] as [number, number];
      })) ?? [];
    riversCache = [...world.watersheds.map((entry) => entry.path), ...generated];
    riversKey = key;
  }
  return riversCache;
}

// ============ 道路 / 水网（矢量，遵循节点） ============
const n07 = NODES.find(n => n.id === 'facility_07')!;
const nOut = NODES.find(n => n.id === 'valley_outpost')!;
const nFerry = NODES.find(n => n.id === 'old_ferry_camp')!;
export const WATER_NET: [number, number][] = [[n07.lon, n07.lat], [nOut.lon, nOut.lat]];
export const ROAD_NET: [number, number][] = [
  [nOut.lon, nOut.lat], [41.2, 16.0], [42.0, 15.5], [42.8, 15.0],
  [43.7, 14.5], [44.5, 14.0], [nFerry.lon, nFerry.lat],
];

// ============ 分类着色（连续色阶 + 微斑驳） ============
type RGB = [number, number, number];

function lerp3(a: RGB, b: RGB, t: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function lowlandColor(m: number, latDeg: number, lonDeg: number): RGB {
  const aLat = Math.abs(latDeg);
  if (inValleyRegion(lonDeg, latDeg) && m > 0.40) {                 // 河谷草地/耕地
    const rows = Math.sin(latDeg * 22) * Math.cos(lonDeg * 16);
    return [124 + rows * 6, 146 + rows * 6, 92] as RGB;
  }
  const dry = Math.max(0, Math.min(1, (0.48 - m) / 0.22));
  const wet = Math.max(0, Math.min(1, (m - 0.50) / 0.28));
  let base = lerp3([110, 132, 82], [151, 128, 82], dry * 0.82);
  base = lerp3(base, [55, 88, 61], wet * 0.68);
  // 低纬副热带保持偏干，但不产生硬边界的橙色大块。
  if (aLat < 12) base = lerp3(base, [118, 136, 86], 0.18);
  return base;
}

function moduleRadius(slot: TerrainModuleSlot): number {
  // R8 起模块是整片可见地貌，而不是地图上几个小圆形色块。
  // 这些半径让蓝图模块覆盖大陆，边缘仍由多个模块的平滑交接决定。
  if (slot.region === 'mountain') return 38;
  if (slot.region === 'highland') return 30;
  if (slot.region === 'river_valley') return 22;
  if (slot.region === 'coast') return 42;
  if (slot.region === 'plain' || slot.region === 'arid') return 38;
  if (slot.region === 'forest') return 34;
  return 40;
}

/** 供渲染和 R4.1-D 地点校验共享的确定性区域选择；不从图片颜色反推地形。 */
export function terrainModuleAt(world: WorldBlueprint, lon: number, lat: number): { slot: TerrainModuleSlot; weight: number } | null {
  let best: TerrainModuleSlot | null = null;
  let bestWeight = 0;
  for (const slot of world.terrainModules) {
    const d = angularDistDeg(lon, lat, slot.center[0], slot.center[1]);
    const weight = Math.max(0, 1 - d / moduleRadius(slot));
    if (weight > bestWeight) { best = slot; bestWeight = weight; }
  }
  return best ? { slot: best, weight: bestWeight } : null;
}

/**
 * 地貌模块是世界事实，不是仅供贴图挑选颜色的标签。
 * 该函数把模块分类转为连续高程差，供黑白验收图、工程选址和正式地表共同使用。
 */
function terrainModuleRelief(lon: number, lat: number, world: WorldBlueprint, continentalMask: number): number {
  if (continentalMask <= 0.02) return 0;
  let relief = 0;
  // 不能让“最近模块”成为高程事实：那会形成规则的 Voronoi 切面。
  // 每一类地貌都有自己的连续影响半径，边缘自然叠加为山麓、缓坡与过渡带。
  for (const slot of world.terrainModules) {
    const distance = angularDistDeg(lon, lat, slot.center[0], slot.center[1]);
    const weight = Math.max(0, 1 - distance / moduleRadius(slot));
    if (weight <= 0) continue;
    const t = smoothstep(0.06, 0.98, weight) * continentalMask;
    const rugged = fbm3(lon * 0.45, lat * 0.45, world.seed * 0.001, world.seed + slot.variant * 173, 3) - 0.5;
    switch (slot.region) {
      case 'mountain': relief += t * (0.175 + Math.max(0, rugged) * 0.120); break;
      case 'highland': relief += t * (0.042 + rugged * 0.016); break;
      case 'river_valley': relief -= t * 0.018; break;
      case 'plain': relief -= t * 0.008; break;
      case 'forest': relief += t * (0.010 + rugged * 0.012); break;
      case 'arid': relief += t * (0.030 + rugged * 0.025); break;
      case 'tundra': relief += t * (0.055 + rugged * 0.018); break;
      case 'coast': relief -= t * 0.022; break;
    }
  }
  return relief;
}

function climateTint(climate: ClimateKind): RGB {
  if (climate === 'polar') return [190, 202, 205];
  if (climate === 'cold') return [119, 137, 122];
  if (climate === 'arid') return [158, 133, 83];
  if (climate === 'tropical') return [61, 106, 72];
  return [106, 132, 82];
}

function moduleColor(slot: TerrainModuleSlot): RGB {
  if (slot.region === 'mountain') return [101, 108, 104];
  if (slot.region === 'highland') return [111, 116, 94];
  if (slot.region === 'river_valley') return [102, 142, 88];
  if (slot.region === 'forest') return [54, 91, 62];
  if (slot.region === 'arid') return [160, 132, 80];
  if (slot.region === 'tundra') return [160, 173, 169];
  if (slot.region === 'coast') return [126, 126, 95];
  return climateTint(slot.climate);
}

/**
 * templateId 对应稳定的地貌材料配方：河谷耕作条、山地等高脊、林地树冠斑、
 * 荒地风蚀纹等都由同一地貌模块复用。它不反向决定河流或城市位置。
 */
function materialColor(slot: TerrainModuleSlot, lon: number, lat: number, seed: number): RGB {
  const radius = moduleRadius(slot);
  const angle = slot.rotation * D2R;
  const dx = (lon - slot.center[0]) * Math.cos(slot.center[1] * D2R);
  const dy = lat - slot.center[1];
  const u = (dx * Math.cos(angle) - dy * Math.sin(angle)) / radius;
  const v = (dx * Math.sin(angle) + dy * Math.cos(angle)) / radius;
  // 这里必须保持连续。早期的整数格 hash 在中景会放大成规则方块，破坏“真实地貌”的阅读。
  // 仍以模块局部坐标和稳定种子取样，所以存档重开后材料细节不会漂移。
  const grain = fbm3((u + 2) * 2.6, (v + 2) * 2.6, slot.variant * 0.071, seed + slot.variant * 97, 3) - 0.5;
  const base = moduleColor(slot);
  const light: RGB = [Math.min(255, base[0] + 24), Math.min(255, base[1] + 24), Math.min(255, base[2] + 20)];
  const dark: RGB = [base[0] * 0.68, base[1] * 0.70, base[2] * 0.70];
  let material = base;

  if (slot.region === 'mountain' || slot.region === 'highland') {
    const bands = Math.sin((u * 15 + v * 8 + slot.variant) * Math.PI);
    material = bands > 0.50 ? lerp3(base, light, 0.14) : bands < -0.56 ? lerp3(base, dark, 0.12) : base;
  } else if (slot.region === 'river_valley') {
    // 梯田/农田的明确轮廓交给透明贴图；底层只保留非常轻的耕作方向，不能铺成黄绿条带。
    const rows = Math.sin((u * 28 + v * 5 + slot.variant) * Math.PI);
    material = rows > 0.80 ? lerp3(base, [151, 157, 96], 0.11) : rows < -0.80 ? lerp3(base, [92, 126, 75], 0.08) : base;
  } else if (slot.region === 'forest') {
    const canopy = fbm3((u + 2) * 7.1, (v + 2) * 7.1, slot.variant * 0.113, seed + slot.variant * 173, 3);
    material = canopy > 0.62 ? lerp3(base, dark, 0.34) : canopy < 0.22 ? lerp3(base, light, 0.16) : base;
  } else if (slot.region === 'arid') {
    const dunes = Math.sin((u * 17 - v * 10 + slot.variant) * Math.PI);
    material = dunes > 0.42 ? lerp3(base, light, 0.14) : dunes < -0.48 ? lerp3(base, dark, 0.10) : base;
  } else if (slot.region === 'tundra') {
    const frost = fbm3((u + 2) * 8.2, (v + 2) * 8.2, slot.variant * 0.091, seed + slot.variant * 149, 3);
    material = frost > 0.66 ? lerp3(base, [224, 231, 228], 0.42) : base;
  } else if (slot.region === 'coast') {
    const shore = Math.sin((u * 19 + v * 7 + slot.variant) * Math.PI);
    material = shore > 0.55 ? lerp3(base, [181, 166, 122], 0.12) : base;
  } else {
    material = grain > 0.24 ? lerp3(base, light, 0.12) : grain < -0.29 ? lerp3(base, dark, 0.10) : base;
  }
  const fine = 0.94 + grain * 0.12;
  return [material[0] * fine, material[1] * fine, material[2] * fine];
}

function applyBlueprintModule(base: RGB, e: number, world: WorldBlueprint, lonDeg: number, latDeg: number): RGB {
  if (e < SEA + 0.006) return base;
  const match = terrainModuleAt(world, lonDeg, latDeg);
  if (!match) return base;
  const target = materialColor(match.slot, lonDeg, latDeg, world.seed);
  // 模块成为实际底图，噪声只保留材料颗粒与海岸微扰；不再让旧噪声底色主导地球外观。
  const amount = 0.48 + smoothstep(0.08, 0.92, match.weight) * 0.45;
  return lerp3(base, target, amount);
}

/** 已建成工程写入蓝图差异层；底图只读这些差异，不从 UI 状态反推城市。 */
function applyTerrainChanges(base: RGB, world: WorldBlueprint, lonDeg: number, latDeg: number): RGB {
  let current = base;
  for (const change of world.terrainChanges) {
    if (change.kind === 'utility_corridor' && change.data.route === 'water_main') {
      const distance = distToPolylineDeg(lonDeg, latDeg, WATER_NET);
      if (distance < 0.055) current = lerp3(current, [91, 115, 111], (1 - distance / 0.055) * 0.46);
      continue;
    }
    if (change.kind === 'road' && change.data.route === 'ferry_road') {
      const distance = distToPolylineDeg(lonDeg, latDeg, ROAD_NET);
      if (distance < 0.060) current = lerp3(current, [127, 105, 75], (1 - distance / 0.060) * 0.55);
      continue;
    }
    if (change.kind !== 'urban_growth') continue;
    const anchor = world.siteAnchors.find((entry) => entry.id === change.anchorId);
    if (!anchor) continue;
    const radius = Number(change.data.radius ?? 0.7);
    const distance = angularDistDeg(lonDeg, latDeg, anchor.position[0], anchor.position[1]);
    if (distance > radius) continue;
    const parcel = hash2(Math.floor(lonDeg * 31), Math.floor(latDeg * 31), world.seed + change.createdDay);
    if (parcel < 0.58) continue;
    const coverage = (1 - distance / radius) * (parcel > 0.82 ? 0.34 : 0.18);
    current = lerp3(current, parcel > 0.82 ? [184, 157, 102] : [134, 136, 103], coverage);
  }
  return current;
}

/**
 * 山系是世界蓝图的一部分，不是近景临时贴上的一条线。
 * 细采样时以相同的脊线生成岩脊、阴坡和碎坡；远景由同一脊线的表面贴图表达。
 */
function rangeDistanceDeg(lon: number, lat: number, path: [number, number][]): number {
  let best = Infinity;
  const cos = Math.max(0.25, Math.cos(lat * D2R));
  for (let i = 0; i < path.length - 1; i++) {
    const [aLon, aLat] = path[i], [bLon, bLat] = path[i + 1];
    const ax = ((aLon - lon + 180) % 360 + 360) % 360 - 180;
    const bx = ((bLon - lon + 180) % 360 + 360) % 360 - 180;
    const ay = aLat - lat, by = bLat - lat;
    const dx = (bx - ax) * cos, dy = by - ay;
    const t = Math.max(0, Math.min(1, (-(ax * cos) * dx - ay * dy) / Math.max(0.000001, dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot((ax * cos + dx * t), ay + dy * t));
  }
  return best;
}

function applyFrozenRangeRelief(base: RGB, world: WorldBlueprint, lonDeg: number, latDeg: number): RGB {
  let strongest = 0;
  let tone: RGB = [94, 99, 91];
  for (const range of world.ranges) {
    // width 是地理中心脊的实际宽度；3.8 倍形成可读的山麓，而非地图上一根针线。
    const reach = range.width * 3.8;
    const distance = rangeDistanceDeg(lonDeg, latDeg, range.ridge);
    const influence = Math.max(0, 1 - distance / reach);
    if (influence > strongest) {
      strongest = influence;
      tone = range.height >= 0.09 ? [85, 91, 88] : [103, 103, 88];
    }
  }
  if (strongest <= 0) return base;
  const broad = fbm3(lonDeg * 0.34, latDeg * 0.34, world.seed * 0.001, world.seed + 9101, 3);
  const crag = fbm3(lonDeg * 1.35, latDeg * 1.35, world.seed * 0.002, world.seed + 9102, 2);
  // 只用不规则的山体颗粒和阴坡，不能以正弦条带伪造等高线。
  const rock = Math.max(0, strongest * (0.48 + broad * 0.25 + crag * 0.24));
  const shaded: RGB = crag < 0.34 ? [tone[0] * 0.76, tone[1] * 0.79, tone[2] * 0.77] : tone;
  return lerp3(base, shaded, Math.min(0.80, rock));
}

function terrainRGB(e: number, m: number, latDeg: number, lonDeg: number, seed: number, world: WorldBlueprint): RGB {
  const aLat = Math.abs(latDeg);
  let base: RGB;
  const deepTop = SEA - 0.10;    // 深海 #0C2E43
  const shallowTop = SEA - 0.03; // 浅海 #195B73
  if (e < deepTop) { const d = Math.max(0, e / deepTop); return [9 + d * 5, 35 + d * 11, 51 + d * 12]; }
  if (e < shallowTop) return lerp3([14, 48, 65], [24, 78, 94], (e - deepTop) / (shallowTop - deepTop));
  if (e < SEA) return lerp3([24, 78, 94], [60, 119, 130], (e - shallowTop) / (SEA - shallowTop));
  if (e < SEA + 0.012) return [140, 130, 100]; // 海岸/滩
  const low = lowlandColor(m, latDeg, lonDeg);
  if (e < SEA + 0.085) base = low;
  else if (e < SEA + 0.15) base = lerp3(low, [96, 101, 94], (e - SEA - 0.085) / 0.065);
  else if (e < SEA + 0.22) base = [96, 101, 94];
  else if (aLat > 36) base = lerp3([96, 101, 94], [220, 229, 226], Math.min(1, (e - SEA - 0.22) / 0.08));
  else base = [116, 118, 109];
  // 南部酸雨/污染（半透明斑驳）
  if (inAcidRegion(lonDeg, latDeg)) {
    const speck = hash2(Math.floor(lonDeg * 6), Math.floor(latDeg * 6), seed);
    const k = 0.20 + speck * 0.38;
    const p = speck > 0.5 ? [155, 110, 72] : [124, 96, 80];
    base = [
      Math.round(base[0] * (1 - k) + p[0] * k),
      Math.round(base[1] * (1 - k) + p[1] * k),
      Math.round(base[2] * (1 - k) + p[2] * k),
    ] as RGB;
  }
  base = applyBlueprintModule(base, e, world, lonDeg, latDeg);
  base = applyTerrainChanges(base, world, lonDeg, latDeg);
  const grain = hash2(Math.floor(lonDeg * 46), Math.floor(latDeg * 46), seed + 777);
  const gk = 0.95 + grain * 0.10;
  return [base[0] * gk, base[1] * gk, base[2] * gk];
}

// ============ 基础纹理（纯地形，一次生成） ============
export function buildBaseTexture(world: WorldBlueprint): HTMLCanvasElement {
  const seed = world.seed;
  ensureGrids(world);
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d')!;
  const img = g.createImageData(TEX_W, TEX_H);
  const data = img.data;
  for (let py = 0; py < TEX_H; py++) {
    const lat = 90 - (py / TEX_H) * 180;
    for (let px = 0; px < TEX_W; px++) {
      const lon = (px / TEX_W) * 360;
      const e = sampleHeight(lon, lat, world);
      const m = sampleMoisture(lon, lat, world);
      let [r, gg, b] = terrainRGB(e, m, lat, lon, seed, world);
      if (e >= SEA && Math.abs(lat) <= 68) {
        const sh = hillshade(lon, lat, world);
        r = Math.min(255, r * sh);
        gg = Math.min(255, gg * sh);
        b = Math.min(255, b * sh);
      }
      const pole = Math.max(0, (Math.abs(lat) - 62) / 28) * 0.18;
      r *= 1 - pole; gg *= 1 - pole; b *= 1 - pole;
      const i = (py * TEX_W + px) * 4;
      data[i] = r; data[i + 1] = gg; data[i + 2] = b; data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function preciseHillshade(lonDeg: number, latDeg: number, world: WorldBlueprint, eC: number): number {
  const d = 0.16;
  const eW = baseElevation(lonDeg - d, latDeg, world);
  const eN = baseElevation(lonDeg, latDeg + d, world);
  const gx = (eW - eC) / d;
  const gy = (eN - eC) / d;
  const lx = -0.707, ly = 0.707, lz = 0.707;
  const dot = (lx * gx + ly * gy + lz) / Math.hypot(gx, gy, 1);
  return clampShade(dot * 0.62 + 0.78);
}

function inLocalValley(lon: number, lat: number): boolean {
  return lon >= 30 && lon <= 52 && lat >= 2 && lat <= 26;
}

/** 中近景河谷的专用地貌调色：不把全球宏观生物群落放大成色带。 */
function localValleyRGB(lon: number, lat: number, seed: number): RGB {
  const riverDist = distToPolylineDeg(lon, lat, MAIN_RIVER);
  const westDist = distToPolylineDeg(lon, lat, WEST_RIDGE);
  const eastDist = distToPolylineDeg(lon, lat, EAST_FOOTHILLS);
  const n = fbm3(lon * 0.20, lat * 0.20, seed * 0.01, seed + 121, 3);
  const grain = (n - 0.5) * 8;

  if (riverDist < 0.040) return [56 + grain * 0.2, 132 + grain * 0.3, 157 + grain * 0.4];
  if (riverDist < 0.62) {
    const rows = Math.sin(lon * 13 + lat * 4) > 0.46 ? 7 : 0;
    return [111 + rows + grain, 139 + rows + grain, 84 + grain * 0.45];
  }

  const ridgeDist = Math.min(westDist, eastDist);
  if (ridgeDist < 0.30) {
    const t = 1 - ridgeDist / 0.30;
    const rock: RGB = westDist < eastDist ? [78, 87, 76] : [94, 101, 86];
    const grass: RGB = [103, 123, 80];
    const shade = 0.76 + n * 0.20;
    const mixed = lerp3(grass, rock, t * 0.9);
    return [mixed[0] * shade, mixed[1] * shade, mixed[2] * shade];
  }

  // 河谷外缘是低饱和草地与干地的渐变，避免大块纯黄和纯绿。
  const dry = Math.max(0, Math.min(1, (lon - 42) / 11 + (18 - lat) / 30));
  const grass = lerp3([106, 130, 83], [151, 128, 81], dry * 0.55);
  return [grass[0] + grain, grass[1] + grain, grass[2] + grain * 0.45];
}

/** 中近景用：直接从噪声求地形色（不放大低清纹理） */
export function preciseTerrainRGB(lonDeg: number, latDeg: number, world: WorldBlueprint): RGB {
  const seed = world.seed;
  if (inLocalValley(lonDeg, latDeg)) {
    const local = localValleyRGB(lonDeg, latDeg, seed);
    const e = baseElevation(lonDeg, latDeg, world);
    return applyTerrainChanges(applyFrozenRangeRelief(applyBlueprintModule(local, e, world, lonDeg, latDeg), world, lonDeg, latDeg), world, lonDeg, latDeg);
  }
  const e = baseElevation(lonDeg, latDeg, world);
  const m = moistureAt(lonDeg, latDeg, seed);
  let [r, g, b] = terrainRGB(e, m, latDeg, lonDeg, seed, world);
  if (e >= SEA && Math.abs(latDeg) <= 68) {
    const sh = preciseHillshade(lonDeg, latDeg, world, e);
    r = Math.min(255, r * sh);
    g = Math.min(255, g * sh);
    b = Math.min(255, b * sh);
  }
  return applyFrozenRangeRelief([r, g, b], world, lonDeg, latDeg);
}

/**
 * R9 骨架验收调色：只有海深、高程、坡向与稀疏等高线，不使用任何地貌/城市/工程贴图。
 * 黑白图专门用于检查山系、河谷、海岸和道路落点是否来自同一份地理事实。
 */
export function skeletonTerrainRGB(lonDeg: number, latDeg: number, world: WorldBlueprint): RGB {
  const e = sampleHeight(lonDeg, latDeg, world);
  const d = 0.28;
  const eW = sampleHeight(lonDeg - d, latDeg, world);
  const eN = sampleHeight(lonDeg, latDeg + d, world);
  const gx = (eW - e) / d;
  const gy = (eN - e) / d;
  const shade = Math.max(0.64, Math.min(1.16, ((-0.707 * gx + 0.707 * gy + 0.72) / Math.hypot(gx, gy, 1)) * 0.44 + 0.72));
  let value: number;
  if (e < SEA) {
    const depth = Math.min(1, Math.max(0, (SEA - e) / 0.17));
    value = 12 + (1 - depth) * 70;
  } else {
    const height = Math.min(1, Math.max(0, (e - SEA) / 0.25));
    value = 105 + height * 142;
  }
  value = Math.max(0, Math.min(255, Math.round(value * shade)));
  return [value, value, value];
}

let skeletonTexture: HTMLCanvasElement | null = null;
let skeletonTextureKey = '';

export function buildSkeletonTexture(world: WorldBlueprint): HTMLCanvasElement {
  const key = `${world.seed}:${world.skeleton?.version ?? 0}:${world.skeleton?.cellCount ?? 0}`;
  if (skeletonTexture && skeletonTextureKey === key) return skeletonTexture;
  const canvas = document.createElement('canvas');
  canvas.width = SKELETON_W; canvas.height = SKELETON_H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(SKELETON_W, SKELETON_H);
  for (let y = 0; y < SKELETON_H; y++) {
    const lat = 90 - (y / SKELETON_H) * 180;
    for (let x = 0; x < SKELETON_W; x++) {
      const lon = (x / SKELETON_W) * 360;
      const [r, g, b] = skeletonTerrainRGB(lon, lat, world);
      const i = (y * SKELETON_W + x) * 4;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  skeletonTexture = canvas;
  skeletonTextureKey = key;
  return canvas;
}
