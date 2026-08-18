import { campaignStage, sustainablePopulationCapacity } from '../src/v2/content/campaignStage';
import { newCampaignV6 } from '../src/v2/state';
import { advanceDaysV6, setNationalPolicyV6, setSlotModeV6, startProjectV6, startResearchV6 } from '../src/v2/simulationV6';

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`人口与定居阶段验收失败：${message}`);
}

let state = newCampaignV6();
state = setSlotModeV6(state, 'research', 'auto');
state = setSlotModeV6(state, 'project', 'auto');
state = advanceDaysV6(state, 720);

const stage = campaignStage(state);
const capacity = sustainablePopulationCapacity(state);
expect(state.completed.projects.includes('water_main'), '自动推进未完成净水干线');
expect(state.completed.projects.includes('valley_greenhouse'), '自动推进未完成河谷温室');
expect(stage.id === 'settlement', '水和食物稳定后没有离开外拓维持阶段');
expect(state.population > 31, '生活条件改善后人口没有发生增长');
expect(state.population <= capacity, '人口超过了现有设施能够长期维持的规模');
expect(state.notificationHistory.some((entry) => entry.copyKey === 'stage.settlement.reached'), '定居成立没有留下可读的阶段通知');

// 模拟玩家在定居后短暂转向工业，取得渡口工务的开工条件；工程启动后回到均衡发展。
state = setNationalPolicyV6(state, 'industry');
state = advanceDaysV6(state, 180);
if (!state.completed.projects.includes('ferry_workshop') && !state.projectSlot.id) state = startProjectV6(state, 'ferry_workshop');
expect(state.projectSlot.id === 'ferry_workshop' || state.completed.projects.includes('ferry_workshop'), '工业转向后无法启动渡口工务');
state = setNationalPolicyV6(state, 'balanced');
state = advanceDaysV6(state, 400);

const worktownStage = campaignStage(state);
expect(state.completed.projects.includes('ferry_workshop'), '渡口工务未能完工');
expect(worktownStage.id === 'worktown', '渡口、人口和后勤齐备后没有形成河谷工务镇');
expect(state.notificationHistory.some((entry) => entry.copyKey === 'stage.worktown.reached'), '工务镇形成没有留下可读的阶段通知');
for (const [id, metric] of Object.entries(state.metrics)) {
  expect(metric.value > 1 && metric.value < 99, `${id} 在长期挂机后不应无理由撞到 0 或 100`);
}

// 自动槽只在首次等待时提示；科技完成后应自行恢复，而不是永久卡在“无候选”。
let waitingState = newCampaignV6();
waitingState = setSlotModeV6(waitingState, 'project', 'auto');
waitingState = advanceDaysV6(waitingState, 120);
expect(waitingState.notificationHistory.filter((entry) => entry.copyKey === 'auto.project.no_candidate').length === 1, '自动工程在等待前置时重复刷日志');
waitingState = startResearchV6(waitingState, 'valley_survey');
waitingState = advanceDaysV6(waitingState, 30);
expect(waitingState.projectSlot.id === 'water_main' || waitingState.completed.projects.includes('water_main'), '前置研究完成后自动工程没有恢复推进');
expect(!waitingState.projectSlot.waitingForUnlock, '自动工程恢复后仍保留等待状态');

console.log(JSON.stringify({
  result: 'passed',
  day: state.day,
  stage: worktownStage.id,
  population: Math.round(state.population * 10) / 10,
  capacity,
  completedProjects: state.completed.projects,
  completedTechs: state.completed.techs,
}));
