import { newCampaignV6 } from '../src/v2/state';
import {
  advanceDaysV6,
  setNationalPolicyV6,
  setSlotModeV6,
  startPolicyV6,
  startProjectV6,
  startResearchV6,
} from '../src/v2/simulationV6';
import { notificationSummary } from '../src/v2/content/copyKeys';

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`R6 Demo 验收失败：${message}`);
}

const forbidden = /LDU|NDU|PDU|SDU|requirement\.|copyKey|状态机|权重|槽位|债务/i;
let state = newCampaignV6();

expect(state.day === 1, '新战役没有从第一日开始');
state = startResearchV6(state, 'valley_survey');
expect(state.researchSlot.id === 'valley_survey', '第一项研究无法手动启动');
state = advanceDaysV6(state, 30);
expect(state.completed.techs.includes('valley_survey'), '河谷地形勘查没有完成');

state = startProjectV6(state, 'water_main');
state = startPolicyV6(state, 'valley_hunt');
expect(state.projectSlot.id === 'water_main', '净水干线没有开工');
expect(state.currentPolicy?.id === 'valley_hunt', '临时政策没有开始');

state = setSlotModeV6(state, 'project', 'auto');
state = setSlotModeV6(state, 'research', 'auto');
state = setNationalPolicyV6(state, 'industry');
expect(state.nationalPolicy.transitionDaysRemaining > 0, '国策切换未出现交接期');
state = advanceDaysV6(state, 220);

expect(state.day === 251, '连续运行的日数不正确');
expect(state.nationalPolicy.transitionDaysRemaining === 0, '交接期没有自然结束');
expect(state.completed.projects.length >= 2, '自动工程没有在完成后继续推进');
expect(state.completed.techs.length >= 3, '自动研究没有在完成后继续推进');
expect(state.currentPolicy === null, '临时政策没有按时结束');
expect(state.notificationHistory.some((entry) => entry.copyKey === 'report.sixty_day'), '连续运行没有生成重点周期报告');
expect(state.notificationHistory.some((entry) => entry.copyKey.includes('auto.project.started')), '自动工程没有留下可读记录');
expect(state.notificationHistory.some((entry) => entry.copyKey.includes('auto.research.started')), '自动研究没有留下可读记录');
expect(state.facilities.water_main.reachedMilestones.length >= 4, '工程里程碑没有写入设施状态');

const visibleNotifications = state.notificationHistory.map(notificationSummary);
for (const line of visibleNotifications) expect(!forbidden.test(line), `通知仍含内部术语：${line}`);

console.log(JSON.stringify({
  result: 'passed',
  day: state.day,
  completedTechs: state.completed.techs,
  completedProjects: state.completed.projects,
  completedPolicy: '河谷狩猎行动',
  facilityMilestones: state.facilities.water_main.reachedMilestones,
  reports: state.notificationHistory.filter((entry) => entry.copyKey === 'report.sixty_day').length,
  visibleNotificationCheck: 'passed',
}, null, 2));
