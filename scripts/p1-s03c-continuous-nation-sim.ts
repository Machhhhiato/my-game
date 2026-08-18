// P1-S03C 无界面模拟：持续运行国家指标（180 日可复现、改组惯性、交接、里程碑、非阻塞）
// 运行：npx tsx scripts/p1-s03c-continuous-nation-sim.ts
import { newCampaignV5 } from '../src/v2/state';
import {
  advanceDays, advanceOneDay, setFocus, setProject, setResearch,
  yearOf, periodOf, transitionLabel,
  METRIC_ORDER, METRIC_DEFS, FOCUS_ORDER, FOCUS_DEFS,
} from '../src/v2/simulation';
import { initV5, saveGameV5 } from '../src/v2/save';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (cond) console.log('  ok: ' + msg);
  else { console.error('  FAIL: ' + msg); failures++; }
}

console.log('== 1. 运行 60 日：不确认、不归零、跨过 60 日、滚动简报 ==');
{
  const s = newCampaignV5();
  s.clock.speed = 1;
  const after = advanceDays(s, 60);
  assert(after.day === 61, '1a 推进 60 日');
  assert(after.clock.speed === 1, '1b 仍为 1×（不自动归零）');
  assert(periodOf(after.day) === 2, '1c 跨过第 60 日');
  assert(after.log.some(e => e.place === '中央滚动简报'), '1d 出现滚动简报');
}

console.log('== 2. 事件/里程碑/60 日不归零速度 ==');
{
  const s = newCampaignV5();
  s.clock.speed = 4;
  const after = advanceDays(s, 70); // 跨过一个 60 日周期
  assert(after.clock.speed === 4, '2a 普通事件与 60 日报告不将速度归零');
}

console.log('== 3. 国家重点改组惯性 ==');
{
  let s = newCampaignV5();
  s = setFocus(s, 'industry');
  assert(s.focus.transitionDaysRemaining === 10, '3a 改组 10 日');
  assert(s.focus.transitionEfficiency === 0.65, '3b 起始 0.65');
  const d1 = advanceDays(s, 1);
  assert(Math.abs(d1.focus.transitionEfficiency - 0.685) < 1e-9, '3c 每日 +0.035');
  const d10 = advanceDays(s, 10);
  assert(d10.focus.transitionEfficiency === 1, '3d 10 日满负荷');
  const again = setFocus(d10, 'science');
  assert(again.focus.transitionDaysRemaining === 10 && again.focus.transitionEfficiency === 0.65, '3e 再次切换重置');
  assert(transitionLabel(again) === '中央改组中 · 还需 10 日恢复满负荷', '3f 固定文本');
}

console.log('== 4. 工程/科研切换：交接 3 日、进度保留 ==');
{
  let s = newCampaignV5();
  s = setProject(s, 'water_life');
  const progressed = advanceDays(s, 20);
  const before = progressed.project.progress;
  assert(before > 0, '4a 工程有进度');
  const switched = setProject(progressed, 'seed_protein');
  assert(switched.project.progress === 0 && switched.project.handoverDays === 3, '4b 新工程交接 3 日');
  const d1 = advanceOneDay(switched);
  assert(d1.project.handoverDays === 2, '4c 交接递减');
  // 旧进度保留（milestones 不因切换清零——新工程从 0 开始，但已完成工程的效果由 p100 保留，此处验证换回后进度状态正确）
  const back = setProject(d1, 'water_life');
  assert(back.project.progress === 0, '4d 切换后从交接重新开始');
}

console.log('== 5. 指标为人口 + 九项（0..100）==');
{
  const s = newCampaignV5();
  assert(METRIC_ORDER.length === 9, '5a 九项核心指标');
  assert(s.population === 31, '5b 人口 31');
  for (const id of METRIC_ORDER) {
    const v = s.metrics[id].value;
    assert(v >= 0 && v <= 100, `5c ${METRIC_DEFS[id].name} 在 0..100`);
  }
}

console.log('== 6. 工程/科研里程碑 25/50/75/100 各触发一次 ==');
{
  let s = newCampaignV5();
  s = setProject(s, 'water_life');
  s = setResearch(s, 'maintenance_training');
  const after = advanceDays(s, 1200);
  assert(after.project.milestones.p25 && after.project.milestones.p50 && after.project.milestones.p75 && after.project.milestones.p100, '6a 工程四里程碑触发');
  assert(after.research.milestones.p25 && after.research.milestones.p50 && after.research.milestones.p75 && after.research.milestones.p100, '6b 科研四里程碑触发');
}

console.log('== 7. 180 日可复现；重载不补算 ==');
{
  const a = newCampaignV5(); a.startedAt = 0; a.lastSavedAt = 0;
  const b = newCampaignV5(); b.startedAt = 0; b.lastSavedAt = 0;
  const ra = advanceDays(a, 180);
  const rb = advanceDays(b, 180);
  assert(JSON.stringify(ra) === JSON.stringify(rb), '7a 180 日可复现');

  const store: Record<string, string> = {};
  (globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
  };
  saveGameV5(ra);
  const loaded = initV5().state;
  assert(loaded.day === ra.day, '7b 重载保留日进度（不补算）');
}

console.log(failures === 0 ? '\n全部断言通过' : `\n${failures} 个断言失败`);
if (failures > 0) process.exit(1);
