// P1-S02 无界面模拟：验证计划期结算的关键路线与确定性
// 运行：npx tsx scripts/p1-s02-sim.ts
import { newCampaignV3 } from '../src/v2/state';
import { settlePlanPeriod, previewPlanPeriod } from '../src/v2/simulation';
import type { PlayerCommandState } from '../src/v2/types';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (cond) console.log('  ok: ' + msg);
  else { console.error('  FAIL: ' + msg); failures++; }
}
function deepEq(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const BASE: PlayerCommandState = {
  primaryDirection: 'survival',
  secondaryDirection: null,
  flagshipProjectId: 'water_life',
  policyId: 'mixed_ration',
  securityPosture: 'escort',
};

console.log('== 1. 同局同令确定性 ==');
{
  const a = newCampaignV3();
  const b = structuredClone(a);
  const ra = settlePlanPeriod(a, BASE);
  const rb = settlePlanPeriod(b, BASE);
  assert(deepEq(ra.newState, rb.newState), '1a 状态深度相等');
  assert(deepEq(ra.report, rb.report), '1b 报告深度相等');
  assert(ra.report.seedKey === rb.report.seedKey, '1c seedKey 相等');
}

console.log('== 2. 净水续命 vs 档案信标 ==');
{
  const base = newCampaignV3();
  const waterCmd: PlayerCommandState = { ...BASE, flagshipProjectId: 'water_life' };
  const archiveCmd: PlayerCommandState = { ...BASE, flagshipProjectId: 'archive_beacon' };
  const rw = settlePlanPeriod(structuredClone(base), waterCmd);
  const ra = settlePlanPeriod(structuredClone(base), archiveCmd);
  assert(rw.report.resourceDelta.safeWater > ra.report.resourceDelta.safeWater,
    `2a 安全水 delta 更高（净水 ${rw.report.resourceDelta.safeWater} > 档案 ${ra.report.resourceDelta.safeWater}）`);
  assert(rw.report.resourceDelta.precisionParts < ra.report.resourceDelta.precisionParts,
    `2b 备件 delta 更低（净水 ${rw.report.resourceDelta.precisionParts} < 档案 ${ra.report.resourceDelta.precisionParts}）`);
}

console.log('== 3. 强化警戒 vs 护运优先 ==');
{
  const base = newCampaignV3();
  const esc: PlayerCommandState = { ...BASE, flagshipProjectId: 'archive_beacon', securityPosture: 'escort' };
  const hgt: PlayerCommandState = { ...BASE, flagshipProjectId: 'archive_beacon', securityPosture: 'heightened' };
  const re = settlePlanPeriod(structuredClone(base), esc);
  const rh = settlePlanPeriod(structuredClone(base), hgt);
  assert(rh.report.resourceDelta.effectiveLabor < re.report.resourceDelta.effectiveLabor,
    `3a 有效劳力 delta 更低（警戒 ${rh.report.resourceDelta.effectiveLabor} < 护运 ${re.report.resourceDelta.effectiveLabor}）`);
  assert(rh.report.debtDelta.military > re.report.debtDelta.military,
    `3b 军事债 delta 更高（警戒 ${rh.report.debtDelta.military} > 护运 ${re.report.debtDelta.military}）`);
}

console.log('== 4. 连续净水续命只触发一次 filter_strain ==');
{
  let s = newCampaignV3();
  const cmd: PlayerCommandState = { ...BASE, flagshipProjectId: 'water_life' };
  let filterCount = 0;
  for (let i = 0; i < 4; i++) {
    const r = settlePlanPeriod(s, cmd);
    if (r.report.event?.id === 'filter_strain') filterCount++;
    s = r.newState;
  }
  assert(filterCount === 1, `4 filter_strain 触发次数 = ${filterCount}（预期 1）`);
}

console.log('== 5. 输入不被修改 ==');
{
  const base = newCampaignV3();
  const snapshot = JSON.stringify(base);
  previewPlanPeriod(base, BASE);
  assert(JSON.stringify(base) === snapshot, '5a preview 不改输入');
  settlePlanPeriod(base, BASE);
  assert(JSON.stringify(base) === snapshot, '5b settle 不改输入');
}

console.log('== 6. 日历推进与容量上限 ==');
{
  const s0 = newCampaignV3();
  const r0 = settlePlanPeriod(s0, BASE);
  assert(r0.newState.clock.period === 2 && r0.newState.clock.year === 1, '6a 日历仅推进一期（第 1 期 → 第 2 期）');

  let s = newCampaignV3();
  const cmd: PlayerCommandState = { ...BASE, flagshipProjectId: 'water_life' };
  for (let i = 0; i < 20; i++) s = settlePlanPeriod(s, cmd).newState;
  assert(s.reports.length === 12, `6b 报告最多 12 份（实际 ${s.reports.length}）`);
  assert(s.log.length <= 40, `6c 日志最多 40 条（实际 ${s.log.length}）`);
  assert(s.clock.year === 4, `6d 年份随结算滚动（20 期 → 第 ${s.clock.year} 年，6 期/年）`);
}

console.log(failures === 0 ? '\n全部断言通过' : `\n${failures} 个断言失败`);
if (failures > 0) process.exit(1);
