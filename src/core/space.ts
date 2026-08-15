import type { GameState, MissionDef, MissionId, ResourceId } from './types';
import { MISSION_MAP } from '../content/spaceProgram';
import { pushLog } from './state';
import { clamp, rndInt } from './util';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 太空设施带来的全局加成 */
export function spaceBonus(s: GameState): { research: number; foodMult: number; moodAdd: number; powerAdd: number } {
  const d = s.space.done;
  return {
    research: 1 + (d.includes('satellite') ? 0.05 : 0) + (d.includes('stationLab') ? 0.10 : 0),
    foodMult: d.includes('lifeorbit') ? 0.95 : 1,
    moodAdd: d.includes('stationHab') ? 5 : 0,
    powerAdd: d.includes('stationPower') ? 2 : 0,
  };
}

/** 成功率: 基础 + 可靠性成长 + 轨道船坞对飞船模块的加成 */
export function missionChance(s: GameState, m: MissionDef): number {
  let c = m.baseChance + s.space.reliability * 0.003; // 可靠度 100 → +30%
  if (s.space.done.includes('dockyard') && m.id.startsWith('ship')) c += 0.10;
  return clamp(c, 0.05, 0.95);
}

export type LaunchResult = 'ok' | 'failed' | 'no-req' | 'no-tech' | 'no-pad' | 'no-res' | 'cooldown' | 'unknown';

const CREWED = new Set<string>(['crewed1', 'eva', 'docking']);

export function launchMission(s: GameState, id: MissionId): LaunchResult {
  const m = MISSION_MAP[id];
  if (!m) return 'unknown';
  if (!m.req.every(r => s.space.done.includes(r))) return 'no-req';
  if (m.techReq && !m.techReq.every(t => s.research.done.includes(t))) return 'no-tech';
  if (m.needLaunchpad && !s.buildings.some(b => b.type === 'launchpad')) return 'no-pad';
  if (s.elapsed < s.space.nextLaunchAt) return 'cooldown';
  for (const [k, v] of Object.entries(m.cost)) {
    if (s.resources[k as ResourceId] < (v ?? 0)) return 'no-res';
  }
  // 扣除发射材料
  for (const [k, v] of Object.entries(m.cost)) s.resources[k as ResourceId] -= v ?? 0;
  s.space.totalLaunches += 1;
  s.space.nextLaunchAt = s.elapsed + rndInt(60, 150);

  const chance = missionChance(s, m);
  if (Math.random() < chance) {
    s.space.done.push(id);
    s.space.reliability = clamp(s.space.reliability + 4, 0, 100);
    pushLog(s, 'good', m.icon, `发射成功 · ${m.name}`, m.logGood);
    return 'ok';
  }
  // 失败: 材料损失 + 士气受挫,但吸取教训
  s.space.failures += 1;
  s.space.reliability = clamp(s.space.reliability + 6, 0, 100);
  if (CREWED.has(id)) {
    const alive = s.colonists.filter(c => c.hp > 0);
    if (alive.length) {
      const victim = alive[Math.floor(Math.random() * alive.length)];
      victim.hp = 20;
      pushLog(s, 'bad', '🕯️', '宇航员重伤', `${victim.name} 在任务中身受重伤,被救援队抢了回来。`);
    }
  }
  for (const c of s.colonists) if (c.hp > 0) c.mood = clamp(c.mood - 8, 0, 100);
  pushLog(s, 'bad', m.icon, `发射失败 · ${m.name}`, pick([
    '火箭在烈焰中解体……工程师们连夜复盘。士气受挫,但可靠性的教训已经记下。',
    '遥测信号在升空后 40 秒突然中断,残骸散落荒野。任务失败,但每一次失败都让下一次更稳。',
    '发动机提前关机,火箭坠回了发射场附近。控制室里一片沉默,复盘报告写满了三页纸。',
    '整流罩分离异常,载荷在稀薄大气中损毁。失败令人沮丧,可靠性却因此 +6%。',
  ]));
  return 'failed';
}
