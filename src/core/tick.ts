import type { Building, BuildingTypeId, Colonist, GameState, ResourceId, TechDef } from './types';
import { BUILDINGS } from '../content/buildings';
import { availableTechs, buildSpeedMult, LINE_META, TECH_MAP } from '../content/techs';
import { directionDef } from '../content/directions';
import { maxHp } from '../content/colonists';
import { clamp } from './util';
import { pushLog, MAP_W, MAP_H } from './state';
import { eventsTick, expireChoice } from './events-run';
import { spaceBonus } from './space';
import { solarTick } from './solar';
import { galaxyTick } from './galaxy';
import { worldTick } from './world';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 需求衰减速率(每秒)
const DECAY = { food: 0.26, rest: 0.18, recreation: 0.28, comfort: 0.08 };
const WALK_SPEED = 1.7;

export interface TechEffects {
  farm2: boolean;
  electric: boolean;
  fridge: boolean;
  machining: boolean;
  med2: boolean;
  advmat: boolean;
}

export function techEffects(s: GameState): TechEffects {
  const d = s.research.done;
  return {
    farm2: d.includes('farm2'),
    electric: d.includes('electric'),
    fridge: d.includes('fridge'),
    machining: d.includes('machining'),
    med2: d.includes('med2'),
    advmat: d.includes('advmat'),
  };
}

export function calcPower(s: GameState): number {
  const te = techEffects(s);
  if (!te.electric) return 1;
  if (s.modifiers.some(m => m.id === 'flare')) return 0;
  let supply = spaceBonus(s).powerAdd, demand = 0;
  for (const b of s.buildings) {
    const def = BUILDINGS[b.type];
    if (def.powerOut) supply += def.powerOut;
    if (def.power) demand += def.power;
  }
  if (demand === 0) return 1;
  return clamp(supply / demand, 0.25, 1);
}

export function calcDefense(s: GameState): number {
  const power = calcPower(s);
  const dir = directionDef(s);
  let def = 0;
  for (const b of s.buildings) {
    const d = BUILDINGS[b.type];
    if (d.defense && power > 0) def += d.defense;
  }
  const rifle = s.research.done.includes('rifle') ? 2 : 0;
  for (const c of s.colonists) {
    if (c.hp <= 0) continue;
    def += (c.skills.combat + rifle) * 1.2 + (c.traits.includes('brave') ? 2 : 0);
  }
  if (dir.stance === 'fight') def *= 1.25;
  return Math.round(def * 10) / 10;
}

function moodOf(c: Colonist, s: GameState): number {
  let m = 56
    + (c.needs.food - 50) * 0.30
    + (c.needs.rest - 50) * 0.25
    + (c.needs.recreation - 50) * 0.20
    + (c.needs.comfort - 50) * 0.25;
  if (c.traits.includes('optimist')) m += 12;
  if (c.traits.includes('tough')) m += 6;
  if (c.traits.includes('sickly')) m -= 6;
  if (s.modifiers.some(x => x.id === 'fallout') && !s.research.done.includes('hazmat')) m -= 12;
  m += spaceBonus(s).moodAdd;
  m -= Math.max(0, maxHp(c) - c.hp) * 0.15;
  return clamp(m, 0, 100);
}

function doorTile(b: Building): { x: number; y: number } {
  return { x: clamp(b.x + b.w / 2, 0.5, 25.5), y: clamp(b.y + b.h + 0.4, 0.5, 15.5) };
}

const DEFAULT_STOCK = { food: 300, wood: 200, steel: 300, components: 60 } as const;

/** 方向储备目标(自适应经济阈值) */
function stockTarget(s: GameState): { food: number; wood: number; steel: number; components: number } {
  const t = directionDef(s).stockTargets ?? {};
  return {
    food: t.food ?? DEFAULT_STOCK.food,
    wood: t.wood ?? DEFAULT_STOCK.wood,
    steel: t.steel ?? DEFAULT_STOCK.steel,
    components: t.components ?? DEFAULT_STOCK.components,
  };
}

/** 岗位重要性(自适应经济 + 方向乘数: 缺什么补什么,方向偏什么干什么) */
function jobWeight(b: Building, s: GameState): number {
  const def = BUILDINGS[b.type];
  const dir = directionDef(s);
  const mult = def.healRate
    ? (dir.jobMult.medbay ?? 1)
    : def.researchRate
      ? (dir.jobMult.research ?? 1)
      : (dir.jobMult[b.type] ?? 1);
  if (def.healRate) return 3.5 * mult;
  if (def.researchRate) return (s.research.current ? 2.0 : 0) * mult;
  if (def.produce) {
    const stock = stockTarget(s);
    switch (b.type) {
      case 'farm':
      case 'kitchen':
        return (s.resources.food < stock.food ? 2.6 : s.resources.food < stock.food * 1.5 ? 1.3 : 0.6) * mult;
      case 'woodcutter':
        return (s.resources.wood < stock.wood ? 2.0 : 1.0) * mult;
      case 'mine':
        return (s.resources.steel < stock.steel ? 1.7 : 1.0) * mult;
      case 'workshop':
        return (s.resources.components < stock.components ? 1.9 : 1.0) * mult;
    }
  }
  return mult;
}

/** 为殖民者挑选工作 */
function findJob(s: GameState, c: Colonist): Building | null {
  let best: Building | null = null;
  let bestScore = -1;
  for (const b of s.buildings) {
    const def = BUILDINGS[b.type];
    if (b.workerId) continue;
    if (def.tech && !s.research.done.includes(def.tech)) continue;
    if (!def.produce && !def.researchRate && !def.healRate) continue;
    // 医疗站: 有伤员才需要人
    if (def.healRate) {
      const injured = s.colonists.some(o => o.id !== c.id && o.hp > 0 && o.hp < maxHp(o) - 1);
      if (!injured) continue;
    }
    const skillId = def.produce ? def.produce.skill : def.healRate ? 'medic' : 'research';
    const w = jobWeight(b, s);
    if (w <= 0) continue;
    const score = c.skills[skillId] * w;
    if (score > bestScore) { bestScore = score; best = b; }
  }
  return best;
}

function startWalk(c: Colonist, tx: number, ty: number): void {
  c.px = c.x; c.py = c.y;
  c.target = { x: tx, y: ty };
  c.state = 'walk';
}

function arrived(c: Colonist): boolean {
  if (!c.target) return true;
  const dx = c.target.x - c.x, dy = c.target.y - c.y;
  return dx * dx + dy * dy < 0.09;
}

/** 需求优先: 吃饭/睡觉/娱乐 会打断工作;返回 true 表示已分配需求行为 */
function tryNeeds(s: GameState, c: Colonist): boolean {
  if (c.needs.food <= (c.traits.includes('glutton') ? 43 : 35) && s.resources.food > 0.3) {
    releaseWorker(s, c.id);
    c.job = 'eat';
    const spot = eatSpotOf(s);
    startWalk(c, spot.x, spot.y);
    return true;
  }
  if (c.needs.rest <= 25) {
    releaseWorker(s, c.id);
    const b = s.buildings.find(x => x.type === 'shelter');
    const spot = b ? doorTile(b) : { x: c.x, y: c.y };
    c.job = 'rest';
    startWalk(c, spot.x, spot.y);
    return true;
  }
  if (c.needs.recreation <= 18) {
    releaseWorker(s, c.id);
    const b = s.buildings.find(x => x.type === 'shelter');
    const spot = b ? { x: b.x + 0.5, y: b.y - 0.5 } : { x: c.x, y: c.y };
    c.job = 'recreate';
    startWalk(c, spot.x, spot.y);
    return true;
  }
  return false;
}

function colonistStep(s: GameState, c: Colonist, eff: number, te: TechEffects): void {
  // ===== 状态持续逻辑 =====
  if (c.state === 'eat') {
    if (s.elapsed >= c.until) {
      const amount = 1 * (te.fridge ? 0.85 : 1) * (c.traits.includes('glutton') ? 1.3 : 1) * spaceBonus(s).foodMult;
      const eaten = Math.min(amount, s.resources.food);
      s.resources.food -= eaten;
      c.needs.food = clamp(c.needs.food + 65 * (eaten / amount), 0, 100);
      s.stats.foodEaten = (s.stats.foodEaten ?? 0) + eaten;
      c.state = 'idle'; c.job = null;
    }
    return;
  }
  if (c.state === 'sleep') {
    c.needs.rest = clamp(c.needs.rest + 2.2 * eff, 0, 100);
    c.needs.comfort = clamp(c.needs.comfort + 0.4 * eff, 0, 100);
    if (c.needs.rest >= 95 || c.needs.food <= 10) { c.state = 'idle'; c.job = null; }
    return;
  }
  if (c.state === 'recreate') {
    if (s.elapsed >= c.until) { c.state = 'idle'; c.job = null; return; }
    c.needs.recreation = clamp(c.needs.recreation + 8 * eff, 0, 100);
    c.needs.comfort = clamp(c.needs.comfort + 0.5 * eff, 0, 100);
    return;
  }
  if (c.state === 'broken') {
    if (s.elapsed >= c.until) c.state = 'idle';
    return;
  }
  if (c.state === 'walk') {
    c.px = c.x; c.py = c.y;
    if (!c.target) { c.state = 'idle'; return; }
    const dx = c.target.x - c.x, dy = c.target.y - c.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.1) {
      c.x = c.target.x; c.y = c.target.y; c.target = null;
      // 到达后进入目标行为
      const job = c.job;
      if (job === 'eat') { c.state = 'eat'; c.until = s.elapsed + 4; return; }
      if (job === 'rest') { c.state = 'sleep'; return; }
      if (job === 'recreate') { c.state = 'recreate'; c.until = s.elapsed + 8; return; }
      const b = s.buildings.find(x => x.id === job);
      if (b) { c.state = 'work'; b.workerId = c.id; return; }
      c.state = 'idle'; c.job = null;
      return;
    }
    const step = Math.min(WALK_SPEED, dist);
    c.x += (dx / dist) * step;
    c.y += (dy / dist) * step;
    return;
  }
  if (c.state === 'work') {
    // 需求优先: 吃饭/睡觉/娱乐会打断工作
    if (tryNeeds(s, c)) return;
    // 工作目标失效则回到空闲
    const b = s.buildings.find(x => x.id === c.job);
    if (!b || b.workerId !== c.id) { c.state = 'idle'; c.job = null; }
    return;
  }

  // ===== 空闲: 决策 =====
  if (tryNeeds(s, c)) return;
  // 工作
  const job = findJob(s, c);
  if (job) {
    job.workerId = c.id;
    c.job = job.id;
    const d = doorTile(job);
    startWalk(c, d.x, d.y);
    return;
  }
  // 闲着: 在避难所附近待着
  const shelter = s.buildings.find(x => x.type === 'shelter');
  if (shelter && (Math.abs(c.x - (shelter.x + 1)) > 3 || Math.abs(c.y - (shelter.y + 1)) > 3)) {
    startWalk(c, shelter.x + 1, shelter.y + 1);
    return;
  }
  c.state = 'idle';
}

function eatSpotOf(s: GameState): { x: number; y: number } {
  const kitchen = s.buildings.find(x => x.type === 'kitchen');
  if (kitchen) return doorTile(kitchen);
  const shelter = s.buildings.find(x => x.type === 'shelter');
  if (shelter) return doorTile(shelter);
  return { x: 3.5, y: 7.5 };
}

/** 每秒生产结算 */
function production(s: GameState, eff: number, te: TechEffects, power: number): void {
  const farmBlight = s.modifiers.some(m => m.id === 'blight');
  // 机器人科技全局生产加成(机器人故障 -20%)
  const robotMult = (1
    + (s.research.done.includes('haulbot') ? 0.10 : 0)
    + (s.research.done.includes('robohub') ? 0.15 : 0)
    + (s.research.done.includes('engdrone') ? 0.10 : 0))
    * (s.modifiers.some(m => m.id === 'malfunction') ? 0.8 : 1);

  // 装配线: 车间无需工人值守(50% 基础速率)
  if (s.research.done.includes('assembly')) {
    for (const b of s.buildings) {
      if (b.type !== 'workshop' || b.workerId) continue;
      const def = BUILDINGS.workshop;
      let rate = def.produce!.rate * 0.5;
      if (te.machining) rate *= 1.5;
      rate *= power * eff * robotMult * (0.5 + 0.5 * b.hp / 100);
      let consume = def.produce!.consume!;
      if (te.machining) consume = { wood: consume.wood! * 0.8, steel: consume.steel! * 0.8 };
      let ok = true;
      for (const k of Object.keys(consume) as ResourceId[]) {
        if (s.resources[k] < consume[k]! * 0.99) { ok = false; break; }
      }
      if (!ok) continue;
      for (const k of Object.keys(consume) as ResourceId[]) s.resources[k] -= consume[k]! * eff;
      s.resources.components += rate;
    }
  }

  // 医疗机器人: 医疗站无需医生(50% 效率)
  if (s.research.done.includes('medibot')) {
    for (const b of s.buildings) {
      if (b.type !== 'medbay' || b.workerId) continue;
      const def = BUILDINGS.medbay;
      let patient: Colonist | null = null;
      for (const o of s.colonists) {
        if (o.hp <= 0) continue;
        if (o.hp < maxHp(o) - 0.5) { patient = o; break; }
      }
      if (!patient) continue;
      let rate = def.healRate! * 0.5;
      if (te.med2) rate *= 1.6;
      rate *= power * eff;
      patient.hp = clamp(patient.hp + rate, 0, maxHp(patient));
    }
  }
  // 维修机器人: 建筑自动修复
  if (s.research.done.includes('repairbot')) {
    for (const b of s.buildings) {
      if (b.hp < 100) b.hp = Math.min(100, b.hp + 0.5 * eff);
    }
  }

  for (const b of s.buildings) {
    const def = BUILDINGS[b.type];
    if (!b.workerId) continue;
    const c = s.colonists.find(x => x.id === b.workerId);
    if (!c || c.state !== 'work' || c.hp <= 0) continue;

    if (def.produce) {
      const skill = c.skills[def.produce.skill];
      let rate = def.produce.rate;
      let skillFactor = 0.55 + skill * 0.09;
      if (c.traits.includes('industrious')) skillFactor *= 1.15;
      if (c.traits.includes('lazy')) skillFactor *= 0.8;
      // 科技加成
      if (b.type === 'farm' && te.farm2) rate *= 1.5;
      if ((b.type === 'woodcutter' || b.type === 'mine') && te.advmat) rate *= 1.4;
      if (b.type === 'workshop' && te.machining) rate *= 1.5;
      if (b.type === 'farm' && farmBlight && !s.research.done.includes('hydroponics')) rate *= 0.5;
      if (def.power) rate *= power;

      let perSec = rate * skillFactor * eff * robotMult * (0.5 + 0.5 * b.hp / 100);
      // 原料消耗检查
      if (def.produce.consume) {
        let consume = def.produce.consume;
        if (b.type === 'workshop' && te.machining) {
          consume = { wood: consume.wood! * 0.8, steel: consume.steel! * 0.8 };
        }
        let ok = true;
        for (const k of Object.keys(consume) as ResourceId[]) {
          if (s.resources[k] < consume[k]! * 0.99) { ok = false; break; }
        }
        if (!ok) continue;
        for (const k of Object.keys(consume) as ResourceId[]) {
          s.resources[k] -= consume[k]! * eff;
        }
      }
      s.resources[def.produce.resource] += perSec;
    }

    if (def.researchRate) {
      const skill = c.skills.research;
      let rate = def.researchRate * (0.5 + skill * 0.1);
      if (c.traits.includes('smart')) rate *= 1.3;
      if (s.research.done.includes('astro')) rate *= 1.1;
      if (s.research.done.includes('beacon')) rate *= 1.05;
      if (s.modifiers.some(m => m.id === 'inspiration')) rate *= 1.5;
      rate *= spaceBonus(s).research;
      rate *= eff;
      if (def.power) rate *= power;
      rate *= (0.5 + 0.5 * b.hp / 100);
      s.resources.rp += rate;
      if (s.research.current) s.research.progress += rate;
    }

    if (def.healRate) {
      let patient: Colonist | null = null;
      for (const o of s.colonists) {
        if (o.hp <= 0 || o.id === c.id) continue;
        if (o.hp < maxHp(o) - 0.5) { patient = o; break; }
      }
      if (!patient) { b.workerId = null; c.state = 'idle'; c.job = null; continue; }
      let rate = def.healRate * (0.7 + c.skills.medic * 0.08);
      if (te.med2) rate *= 1.6;
      rate *= eff;
      if (def.power) rate *= power;
      patient.hp = clamp(patient.hp + rate, 0, maxHp(patient));
    }
  }
}

/** 需求衰减与心情 */
function decayNeeds(c: Colonist, s: GameState, eff: number): void {
  const sick = s.modifiers.some(x => x.id === 'fallout');
  c.needs.food = clamp(c.needs.food - DECAY.food * eff, 0, 100);
  c.needs.rest = clamp(c.needs.rest - DECAY.rest * eff, 0, 100);
  const recMult = c.traits.includes('lazy') ? 1.25 : 1;
  c.needs.recreation = clamp(c.needs.recreation - DECAY.recreation * recMult * eff, 0, 100);
  const comfMult = (c.traits.includes('sickly') ? 1.3 : 1) * (sick ? 3 : 1) * (s.research.done.includes('cleanbot') ? 0.7 : 1);
  c.needs.comfort = clamp(c.needs.comfort - DECAY.comfort * comfMult * eff, 0, 100);
  c.mood = moodOf(c, s);
}

function checkBreak(s: GameState, c: Colonist): void {
  if (c.mood < 15 && s.elapsed >= c.breakCd && c.state !== 'broken') {
    if (Math.random() < 0.006) {
      c.state = 'broken';
      c.until = s.elapsed + 30;
      c.breakCd = s.elapsed + 300;
      c.job = null;
      c.mood = clamp(c.mood + 10, 0, 100);
      releaseWorker(s, c.id);
      s.stats.broke = (s.stats.broke ?? 0) + 1;
      pushLog(s, 'warn', '😵', `${c.name} 精神崩溃`, pick([
        `${c.name} 情绪失控,接下来一段时间将无法工作。`,
        `${c.name} 把自己锁在房间里,拒绝见任何人。`,
        `压垮骆驼的最后一根稻草落下,${c.name} 崩溃了。`,
        `${c.name} 在田里呆坐到天黑,谁也叫不动。`,
      ]));
    }
  }
}

export function releaseWorker(s: GameState, colonistId: string): void {
  for (const b of s.buildings) if (b.workerId === colonistId) b.workerId = null;
}

function checkDeath(s: GameState, c: Colonist): void {
  if (c.hp <= 0 && c.state !== 'dead') {
    c.state = 'dead';
    c.job = null;
    c.target = null;
    releaseWorker(s, c.id);
    pushLog(s, 'bad', '💀', `${c.name} 死亡`, pick([
      '一位殖民者离开了我们。殖民地少了一双手。',
      `${c.name} 永远地闭上了眼睛,大家沉默地举行了告别。`,
      `又一块墓碑立了起来。${c.name} 的名字被刻在了上面。`,
    ]));
    for (const o of s.colonists) {
      if (o.id !== c.id && o.hp > 0) o.mood = clamp(o.mood - 10, 0, 100);
    }
    if (s.colonists.every(x => x.hp <= 0)) {
      s.gameOver = true;
      pushLog(s, 'bad', '🕯️', '殖民地覆灭', '最后一位殖民者倒下了。这颗星球重归寂静。');
    }
  }
}

/** 研究方向选择: 玩家锁定优先,否则按方向偏好加权随机 */
function pickTech(s: GameState): TechDef | null {
  const avail = availableTechs(s);
  if (avail.length === 0) return null;
  if (s.lockedTech) {
    const locked = avail.find(t => t.id === s.lockedTech);
    if (locked) return locked;
    s.lockedTech = null; // 锁定目标已失效,清除
  }
  const pref = directionDef(s).techPref;
  const weights = avail.map(t => 1 + (pref[t.line] ?? 1) * 1.5);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < avail.length; i++) {
    r -= weights[i];
    if (r <= 0) return avail[i];
  }
  return avail[avail.length - 1];
}

function researchTick(s: GameState): void {
  if (!s.research.current) {
    const next = pickTech(s);
    if (next) {
      s.research.current = next.id;
      pushLog(s, 'info', '🔬', '开始研究', `殖民者们开始研究「${next.name}」(${LINE_META[next.line].name}线)。`);
    }
    return;
  }
  const tech = TECH_MAP[s.research.current];
  if (!tech) { s.research.current = null; return; }
  if (s.research.progress >= tech.cost) {
    s.research.done.push(tech.id);
    s.research.progress = 0;
    pushLog(s, 'good', '🧪', '科技完成', `「${tech.name}」研究完成:${tech.desc}。`);
    s.research.current = null;
  }
}

// ===== 自动建造器(自治 A1-A3) =====
const AUTO_MAX: Partial<Record<BuildingTypeId, number>> = {
  shelter: 1, farm: 3, woodcutter: 3, mine: 3, kitchen: 1, workshop: 2,
  research: 2, solar: 4, turret: 4, medbay: 1, armory: 2, launchpad: 1,
};

const PROD_TYPES: BuildingTypeId[] = ['farm', 'woodcutter', 'mine', 'kitchen', 'workshop', 'solar'];

function autoBuild(s: GameState): void {
  const dir = directionDef(s);
  // 所有建筑类型都自动建造(科技解锁后即自动)
  const allowed = new Set<BuildingTypeId>([
    ...PROD_TYPES, 'turret', 'armory', 'medbay', 'launchpad', 'research',
  ]);

  const order: BuildingTypeId[] = [...dir.buildQueue, ...PROD_TYPES, 'research', 'turret', 'armory', 'medbay', 'launchpad'];
  for (const type of order) {
    if (!allowed.has(type)) continue;
    const def = BUILDINGS[type];
    if (def.tech && !s.research.done.includes(def.tech)) continue;
    if (s.buildings.filter(b => b.type === type).length >= (AUTO_MAX[type] ?? 1)) continue;
    let affordable = true;
    for (const [k, v] of Object.entries(def.cost)) {
      if (s.resources[k as ResourceId] < (v ?? 0)) { affordable = false; break; }
    }
    if (!affordable) continue;
    // 找空位
    for (let y = 0; y < MAP_H; y++) {
      let placed = false;
      for (let x = 0; x < MAP_W; x++) {
        if (x + def.w > MAP_W || y + def.h > MAP_H) continue;
        if (s.buildings.some(b => b.x < x + def.w && x < b.x + b.w && b.y < y + def.h && y < b.y + b.h)) continue;
        for (const [k, v] of Object.entries(def.cost)) s.resources[k as ResourceId] -= v ?? 0;
        s.buildings.push({
          id: `auto${s.seq++}`, type, x, y, w: def.w, h: def.h, hp: 100, workerId: null, builtAt: s.elapsed,
        });
        pushLog(s, 'info', '🤖', '自动建造', `机器人按「${dir.name}」方向建成了 ${def.icon}${def.name}。`);
        placed = true;
        break;
      }
      if (placed) return; // 每轮最多自动放一个
    }
  }
}

function expireModifiers(s: GameState): void {
  s.modifiers = s.modifiers.filter(m => m.until > s.elapsed);
}

export function tickSecond(s: GameState, eff = 1): void {
  s.elapsed += 1;
  s.dayPhase = (s.dayPhase + 1 / 300) % 1;

  const te = techEffects(s);
  const power = calcPower(s);

  // 需求衰减 + 心情
  for (const c of s.colonists) {
    if (c.hp <= 0) continue;
    decayNeeds(c, s, eff);
  }
  // 殖民者行为
  for (const c of s.colonists) {
    if (c.hp <= 0) continue;
    colonistStep(s, c, eff, te);
  }
  // 饥饿掉血
  for (const c of s.colonists) {
    if (c.hp <= 0) continue;
    if (c.needs.food <= 0) {
      c.hp -= 0.25 * eff;
      if (s.elapsed % 10 === 0) c.mood = moodOf(c, s);
    }
  }
  // 生产
  production(s, eff, te, power);
  // 研究
  researchTick(s);
  // 精神崩溃判定
  for (const c of s.colonists) {
    if (c.hp <= 0) continue;
    checkBreak(s, c);
    checkDeath(s, c);
  }
  // 事件
  if (!s.gameOver) eventsTick(s);
  expireChoice(s);
  expireModifiers(s);
  // 第二幕结算
  solarTick(s, eff);
  // 第三幕结算
  galaxyTick(s, eff);
  // 第一幕全球争霸结算
  worldTick(s, eff);
  // 自动建造(建造速度由机器人科技决定)
  const buildInterval = Math.max(5, Math.round(15 / buildSpeedMult(s)));
  if (s.elapsed % buildInterval === 0 && !s.gameOver && !s.launched) autoBuild(s);
  // 资源下限保护
  for (const k of Object.keys(s.resources) as ResourceId[]) {
    if (s.resources[k] < 0) s.resources[k] = 0;
  }
}
