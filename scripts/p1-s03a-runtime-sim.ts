// P1-S03A 无界面模拟：验证真实时间日/周内核、自动暂停、生活底线与玩家语言
// 运行：npx tsx scripts/p1-s03a-runtime-sim.ts
import { newCampaignV4 } from '../src/v2/state';
import {
  startPlan, advanceOneDay, advanceDays, settlePlanPeriod,
  RESOURCE_IDS, DEBT_IDS, CAPACITY_IDS, RESOURCE_NAMES, DEBT_NAMES, CAPACITY_NAMES,
} from '../src/v2/simulation';
import { saveGameV4, initV4 } from '../src/v2/save';
import { DIRECTIONS, DIRECTION_ORDER } from '../src/v2/data';
import type { PlayerCommandState } from '../src/v2/types';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (cond) console.log('  ok: ' + msg);
  else { console.error('  FAIL: ' + msg); failures++; }
}
function deepEq(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const WATER: PlayerCommandState = { primaryDirection: 'survival', secondaryDirection: null, flagshipProjectId: 'water_life', policyId: 'mixed_ration', securityPosture: 'escort' };
const ARCHIVE: PlayerCommandState = { primaryDirection: 'survival', secondaryDirection: null, flagshipProjectId: 'archive_beacon', policyId: 'mixed_ration', securityPosture: 'escort' };

console.log('== 1. advanceDays(60) 与 settlePlanPeriod 一致 ==');
{
  const a = newCampaignV4();
  const r1 = advanceDays(startPlan(a, ARCHIVE), 60);
  const r2 = settlePlanPeriod(a, ARCHIVE);
  assert(deepEq(r1.newState, r2.newState), '1a 状态深度相等');
  const rep1 = r1.newState.reports[r1.newState.reports.length - 1];
  assert(deepEq(rep1, r2.report), '1b 报告深度相等');
  assert(rep1.seedKey === r2.report!.seedKey, '1c seedKey 相等');
}

console.log('== 2. 暂停不推进；日步与速度无关 ==');
{
  const p = newCampaignV4();
  const pr = advanceDays(p, 5);
  assert(pr.newState.runtime.dayInPeriod === 0, '2a 暂停推进 0 日');

  const s1 = startPlan(newCampaignV4(), WATER); s1.clock.speed = 1;
  const s4 = startPlan(newCampaignV4(), WATER); s4.clock.speed = 4;
  const d1 = advanceDays(s1, 3).newState;
  const d4 = advanceDays(s4, 3).newState;
  assert(d1.runtime.dayInPeriod === 3 && d4.runtime.dayInPeriod === 3, '2b 推进 3 日');
  assert(deepEq(d1.nation, d4.nation) && deepEq(d1.projectProgress, d4.projectProgress), '2c 日步与速度无关');
}

console.log('== 3. 60 日自动暂停并推进一期 ==');
{
  const r = advanceDays(startPlan(newCampaignV4(), ARCHIVE), 60);
  assert(r.periodEnded === true, '3a 60 日自动暂停');
  assert(r.newState.runtime.pausedReason === 'period_end', '3b 期末暂停');
  assert(r.newState.clock.period === 2 && r.newState.clock.year === 1, '3c 推进一期');
  assert(r.newState.reports.length === 1, '3d 生成一份期末报告');
}

console.log('== 4. 滤芯拆借触发一次并自动暂停 ==');
{
  let s = newCampaignV4();
  const r1 = settlePlanPeriod(s, WATER);
  s = r1.newState;
  assert(!s.eventFlags.filter_strain, '4a 第 1 期无滤芯事件');

  const r2 = settlePlanPeriod(s, WATER);
  s = r2.newState;
  assert(s.eventFlags.filter_strain === true, '4b 备件阈值后触发');
  assert(s.runtime.pausedReason === 'event', '4c 事件自动暂停');
  assert(s.runtime.dayInPeriod > 0 && s.runtime.dayInPeriod < 60, '4d 期中止于事件日');

  s.runtime.pausedReason = null;
  s.clock.speed = 1;
  const r3 = advanceDays(s, 60);
  s = r3.newState;
  assert(s.runtime.pausedReason === 'period_end', '4e 恢复后到达期末');

  const r4 = settlePlanPeriod(s, WATER);
  assert(r4.report === null || r4.report.event?.id !== 'filter_strain', '4f 后续不重复触发');
}

console.log('== 5. 重载不补算离线日，生活底线保留 ==');
{
  const store: Record<string, string> = {};
  (globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
  };
  const mid = advanceDays(startPlan(newCampaignV4(), WATER), 20).newState;
  mid.clock.speed = 2;
  saveGameV4(mid);
  const loaded = initV4().state;
  assert(loaded.runtime.dayInPeriod === 20, '5a 重载保留日进度');
  assert(loaded.clock.speed === 0 && loaded.runtime.pausedReason === 'manual', '5b 重载强制暂停（不补算）');
  assert(deepEq(loaded.living, mid.living), '5c 生活底线保留');
}

console.log('== 6. 玩家可见文本无旧术语 ==');
{
  const forbidden = ['住房债', '统合债', '社会承受力', '有效劳力', '安全水', '热量', '生物土地资本', '回收材料', '精密备件', '公共信用', '维护债', '生态债', '信任债', '军事债', '旗舰工程', '主方向'];
  let text = '';
  for (const k of RESOURCE_IDS) text += RESOURCE_NAMES[k] + ' ';
  for (const k of DEBT_IDS) text += DEBT_NAMES[k] + ' ';
  for (const k of CAPACITY_IDS) text += CAPACITY_NAMES[k] + ' ';
  for (const id of DIRECTION_ORDER) text += DIRECTIONS[id].name + ' ';
  const rep = settlePlanPeriod(newCampaignV4(), ARCHIVE).report;
  if (rep) text += rep.reasons.join(' ') + ' ' + (rep.project?.name ?? '');
  assert(!forbidden.some(t => text.includes(t)), `6a 文本无旧术语（命中：${forbidden.filter(t => text.includes(t)).join(',') || '无'}）`);
}

console.log(failures === 0 ? '\n全部断言通过' : `\n${failures} 个断言失败`);
if (failures > 0) process.exit(1);
