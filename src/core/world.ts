import type { GameState } from './types';
import { directionDef } from '../content/directions';
import { settlementLevel } from '../content/world';
import { pushLog } from './state';

/** 玩家人口 = 殖民者 + 领土加成(每 40 格 +1) */
export function playerPopulation(s: GameState): number {
  const base = s.colonists.filter(c => c.hp > 0).length;
  const territory = Math.floor(s.world.tiles.flat().filter(t => t.ownerId === s.world.playerId).length / 40);
  return base + territory;
}

/** 玩家军力 = 领土规模 + 人口 + 炮塔 */
export function playerMilitary(s: GameState): number {
  const territory = s.world.tiles.flat().filter(t => t.ownerId === s.world.playerId).length;
  const pop = playerPopulation(s);
  const turrets = s.buildings.filter(b => b.type === 'turret').length;
  const rifle = s.research.done.includes('rifle') ? 2 : 0;
  return territory * 1.2 + pop * (3 + rifle) + turrets * 5;
}

/** 同步据点人口与等级(人口 = 玩家人口) */
function syncSettlement(s: GameState): void {
  const home = s.world.settlements.find(st => st.factionId === s.world.playerId);
  if (home) {
    home.population = playerPopulation(s);
    home.level = settlementLevel(home.population);
  }
}

/** 扩张: 占领邻接 tile */
function expand(s: GameState): void {
  if (s.resources.wood < 4) return;
  // 收集玩家领土边缘邻接的未占领陆地 tile
  const W = s.world.w, H = s.world.h;
  const owned = s.world.tiles.flat().filter(t => t.ownerId === s.world.playerId);
  const candidates: { x: number; y: number; resource: boolean }[] = [];
  for (const t of owned) {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = t.x + dx, ny = t.y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const nt = s.world.tiles[ny][nx];
      if (nt.ownerId || nt.terrain === 'ocean' || nt.terrain === 'ice') continue;
      if (candidates.some(c => c.x === nx && c.y === ny)) continue;
      candidates.push({ x: nx, y: ny, resource: nt.resource !== 'none' });
    }
  }
  if (!candidates.length) return;
  // 优先资源 tile
  candidates.sort((a, b) => (b.resource ? 1 : 0) - (a.resource ? 1 : 0));
  const pick = candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];
  s.resources.wood -= 4;
  s.world.tiles[pick.y][pick.x].ownerId = s.world.playerId;
  // 视野揭开
  for (let y = pick.y - 2; y <= pick.y + 2; y++) {
    for (let x = pick.x - 2; x <= pick.x + 2; x++) {
      if (x >= 0 && y >= 0 && x < W && y < H) s.world.reveal[y][x] = true;
    }
  }
}

/** 建立新据点(领土每 30 格一个) */
function buildSettlement(s: GameState): void {
  const playerSt = s.world.settlements.filter(st => st.factionId === s.world.playerId);
  const ownedCount = s.world.tiles.flat().filter(t => t.ownerId === s.world.playerId).length;
  const want = Math.min(5, 1 + Math.floor(ownedCount / 30));
  if (playerSt.length >= want) return;
  // 找领土边缘 tile
  const owned = s.world.tiles.flat().filter(t => t.ownerId === s.world.playerId);
  let best: { x: number; y: number } | null = null;
  for (const t of owned) {
    const neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => {
      const nx = t.x + dx, ny = t.y + dy;
      return nx >= 0 && ny >= 0 && nx < s.world.w && ny < s.world.h && !s.world.tiles[ny][nx].ownerId;
    }).length;
    if (neighbors > 0) { best = { x: t.x, y: t.y }; break; }
  }
  if (!best) return;
  const st = {
    id: `st${s.seq++}`, name: `殖民地${playerSt.length + 1}号`,
    x: best.x, y: best.y, factionId: s.world.playerId,
    level: 1, population: 3,
  };
  s.world.settlements.push(st);
  s.world.tiles[best.y][best.x].settled = true;
  pushLog(s, 'good', '🏘️', '建立新据点', `${st.name} 落成,帝国的版图又向外推进了一步。`);
  // 铺路连接到最近据点
  const other = s.world.settlements.filter(x => x.id !== st.id && x.factionId === s.world.playerId)[0];
  if (other) {
    s.world.roads.push({ id: `r${s.seq++}`, from: { x: other.x, y: other.y }, to: { x: best.x, y: best.y }, level: 1 });
  }
}

/** 两势力领土是否接壤 */
function adjacent(s: GameState, aId: string, bId: string): boolean {
  for (const row of s.world.tiles) {
    for (const t of row) {
      if (t.ownerId !== aId) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = t.x + dx, ny = t.y + dy;
        if (nx < 0 || ny < 0 || nx >= s.world.w || ny >= s.world.h) continue;
        if (s.world.tiles[ny][nx].ownerId === bId) return true;
      }
    }
  }
  return false;
}

/** 势力军力增长 + 关系漂移 + 边境摩擦 */
function factionTick(s: GameState): void {
  for (const f of s.world.factions) {
    if (f.id === 'player' || !f.alive) continue;
    // 军力固定(不随时间增长), 玩家通过扩张领土超越
    // 边境摩擦: 领土接壤则关系持续恶化, 恶化到阈值自动宣战
    if (adjacent(s, s.world.playerId, f.id) && f.attitude !== 'hostile') {
      f.relation = Math.max(-100, f.relation - 1.5);
      if (f.relation < -40) {
        f.attitude = 'hostile';
        f.relation = -80;
        pushLog(s, 'warn', '⚠️', '边境冲突', `领土接壤引发摩擦,「${f.name}」向你宣战!`);
      }
    } else if (f.attitude === 'neutral') {
      f.relation = Math.max(-100, Math.min(100, f.relation + (directionDef(s).id === 'military' ? -1 : 0.2)));
    }
  }
}

/** 战争结算(军事方向宣战 + 边境冲突 + 全球统一冲刺 + 自动吞并) */
function warTick(s: GameState): void {
  const pm = playerMilitary(s);
  const dir = directionDef(s);
  const ownedCount = s.world.tiles.flat().filter(t => t.ownerId === s.world.playerId).length;
  const landTiles = s.world.tiles.flat().filter(t => t.terrain !== 'ocean' && t.terrain !== 'ice').length;
  // 全球统一冲刺: 领土过半后自动宣战所有剩余势力
  if (ownedCount > landTiles * 0.5) {
    for (const f of s.world.factions) {
      if (f.alive && f.id !== 'player' && f.attitude !== 'hostile') {
        f.attitude = 'hostile';
        f.relation = -80;
        pushLog(s, 'warn', '⚔️', '统一战争', `你的帝国已控制过半陆地,向「${f.name}」发起统一战争!`);
      }
    }
  }
  // 军事方向: 对关系最差的势力宣战
  if (dir.id === 'military') {
    const target = s.world.factions
      .filter(f => f.alive && f.id !== 'player' && f.attitude !== 'hostile')
      .sort((a, b) => a.relation - b.relation)[0];
    if (target) {
      target.attitude = 'hostile';
      target.relation = -80;
      pushLog(s, 'warn', '⚔️', '宣战', `你的帝国向「${target.name}」宣战!`);
    }
  }
  // 敌对势力结算
  for (const f of s.world.factions) {
    if (f.id === 'player' || !f.alive || f.attitude !== 'hostile') continue;
    if (pm >= f.military) {
      // 吞并
      for (const st of s.world.settlements) if (st.factionId === f.id) st.factionId = s.world.playerId;
      for (const row of s.world.tiles) for (const t of row) if (t.ownerId === f.id) t.ownerId = s.world.playerId;
      f.alive = false;
      f.attitude = 'dead';
      // 视野揭开被征服领土
      for (let y = 0; y < s.world.h; y++) {
        for (let x = 0; x < s.world.w; x++) {
          if (s.world.tiles[y][x].ownerId === s.world.playerId) s.world.reveal[y][x] = true;
        }
      }
      pushLog(s, 'good', '🏆', '吞并势力', `你的帝国征服了「${f.name}」,它的领土与据点尽归版图。`);
    } else {
      // 战败损失
      const woodLoss = Math.min(s.resources.wood, 30);
      s.resources.wood -= woodLoss;
      pushLog(s, 'bad', '⚔️', '战事失利', `与「${f.name}」的战争陷入僵局,损失 ${Math.round(woodLoss)} 木材。`);
    }
  }
}

/** 是否统一全球 */
export function isUnified(s: GameState): boolean {
  return s.world.factions.filter(f => f.id !== 'player' && f.alive).length === 0;
}

/** 第一幕全球争霸每 tick 结算 */
export function worldTick(s: GameState, eff: number): void {
  if (s.era !== 'colony') return;
  syncSettlement(s);
  if (s.elapsed % 4 === 0) expand(s);
  if (s.elapsed % 30 === 0) { buildSettlement(s); factionTick(s); }
  if (s.elapsed % 60 === 0) warTick(s);
  if (!s.world.unified && isUnified(s)) {
    s.world.unified = true;
    pushLog(s, 'good', '🌍', '全球统一!', '最后一个势力臣服于你的旗帜之下。这颗星球,从此只有一个声音。');
  }
}
