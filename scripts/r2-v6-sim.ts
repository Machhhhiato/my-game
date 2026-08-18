import { newCampaignV6 } from '../src/v2/state';
import {
  advanceDaysV6, advanceOneDayV6, availablePolicies, availableProjects, availableTechs,
  setNationalPolicyV6, setSlotModeV6, startPolicyV6, startProjectV6, startResearchV6,
} from '../src/v2/simulationV6';

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let state = newCampaignV6();
check(availableTechs(state).includes('valley_survey'), '开局应可研究河谷勘查');
check(!availableProjects(state).includes('water_main'), '勘查完成前不应可启动净水干线');
state = startResearchV6(state, 'valley_survey');
state = advanceDaysV6(state, 30);
check(state.completed.techs.includes('valley_survey'), '河谷勘查应在 30 日内完成');
check(availableProjects(state).includes('water_main'), '勘查完成后应解锁净水干线');

state = startProjectV6(state, 'water_main');
state = advanceDaysV6(state, 22);
check(state.facilities.water_main.stage === 'construction' || state.facilities.water_main.stage === 'trial', '净水干线应进入可见施工阶段');
check(availablePolicies(state).includes('well_rationing'), '净水工程 25% 后应解锁配给政策');
state = advanceDaysV6(state, 50);
check(state.completed.projects.includes('water_main'), '净水干线应完成并归档');
check(state.facilities.water_main.stage === 'operational', '净水干线应进入运行状态');
check(!availableProjects(state).includes('water_main'), '已完成工程不能再次选择');

state = startPolicyV6(state, 'well_rationing');
check(state.currentPolicy?.id === 'well_rationing', '可启动已解锁政策');
state = advanceDaysV6(state, 14);
check(state.currentPolicy === null && (state.policyCooldowns.well_rationing ?? 0) > 0, '政策应在 14 日结束并进入冷却');

state = setSlotModeV6(state, 'research', 'auto');
state = startResearchV6(state, 'field_recovery');
state = advanceDaysV6(state, 40);
check(state.completed.techs.includes('field_recovery'), '自动接续前的科研应完成');
const completionDay = state.day;
state = advanceOneDayV6(state);
check(state.day === completionDay + 1, '日步必须连续推进');
check(state.researchSlot.id !== null || state.researchSlot.autoEligibleDay === null, '自动槽下一日应选取候选或记录无候选');

state = setNationalPolicyV6(state, 'industry');
check(state.nationalPolicy.transitionDaysRemaining === 10, '切换国策应进入十日改组');
state = advanceDaysV6(state, 10);
check(state.nationalPolicy.transitionEfficiency === 1, '改组十日后效率应恢复');
state = advanceDaysV6(state, 60 - (state.day % 60));
check(state.notificationHistory.some((entry) => entry.copyKey === 'report.sixty_day'), '60 日应只写历史简报，不中断模拟');
console.log(JSON.stringify({ ok: true, day: state.day, completed: state.completed, facility: state.facilities.water_main.stage, notifications: state.notificationHistory.length }));
