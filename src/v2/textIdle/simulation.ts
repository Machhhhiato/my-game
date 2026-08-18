import type { MetricId } from '../types';
import { automationGate, TEXT_POLICIES, TEXT_PROJECT_ORDER, TEXT_PROJECTS, TEXT_TECH_ORDER, TEXT_TECHS } from './content';
import type { ReserveId, TextEmergencyOrderId, TextFocusId, TextIdleState, TextPhaseId, TextPolicyId, TextProjectId, TextRequirements, TextSlot, TextTechId } from './types';

const RESERVES: ReserveId[] = ['water', 'food', 'repair'];
const METRICS: MetricId[] = ['livelihood', 'industry', 'energy', 'research', 'administration', 'logistics', 'military', 'stability', 'ecology'];
const DAILY_CONSUMPTION: Record<ReserveId, number> = { water: 0.55, food: 0.55, repair: 0.35 };
const PHASES: TextPhaseId[] = ['early', 'mid', 'late'];
const FAILURE_LIMIT_DAYS = 12;

function clone(state: TextIdleState): TextIdleState { return structuredClone(state) as TextIdleState; }
function clamp(value: number, low = 0, high = 100): number { return Math.max(low, Math.min(high, value)); }
function has<T extends string>(items: readonly T[], required: readonly T[] | undefined): boolean { return !required || required.every((id) => items.includes(id)); }
function requirementsMet(state: TextIdleState, requirements: TextRequirements): boolean {
  return has(state.completedTechs, requirements.techs) && has(state.completedProjects, requirements.operationalProjects);
}
function addReport(state: TextIdleState, kind: TextIdleState['reports'][number]['kind'], copyKey: string, params: Record<string, string | number> = {}): void {
  state.reports.push({ id: `${state.day}.${state.reports.length + 1}`, day: state.day, kind, copyKey, params });
  state.reports = state.reports.slice(-80);
}
function calendarForDay(day: number): TextIdleState['calendar'] {
  const phaseIndex = Math.floor(day / 10) % PHASES.length;
  return { year: Math.floor(day / 360) + 1, month: Math.floor(day / 30) % 12 + 1, phase: PHASES[phaseIndex], dayInPhase: day % 10 + 1, absoluteDay: day };
}
function focusMultiplier(state: TextIdleState, kind: 'research' | 'project' | 'construction'): number {
  if (state.nationalFocus.transitionDays > 0) return 0.72;
  const focus = state.nationalFocus.id;
  if (kind === 'research') return focus === 'learn' ? 1.35 : focus === 'settle' ? 1.08 : 1;
  if (kind === 'project') return focus === 'build' ? 1.35 : focus === 'settle' ? 1.08 : 1;
  return focus === 'build' ? 1.35 : focus === 'settle' ? 1.08 : focus === 'learn' ? 0.88 : 0.95;
}
function facilityCount(state: TextIdleState): number {
  return state.completedProjects.filter((id) => Object.values(TEXT_PROJECTS[id]?.output ?? {}).some((value) => value != null && value > 0)).length;
}
function calculateEssentialStaff(state: TextIdleState): number {
  const automationReduction = textAutomationUnlocked(state) ? 3 : 0;
  return Math.max(8, 15 - Math.min(4, facilityCount(state)) - automationReduction);
}
function refreshWorkforce(state: TextIdleState): void {
  state.workforce.essentialStaff = calculateEssentialStaff(state);
  state.workforce.civicAndSecurityStaff = 3;
  state.workforce.researchStaff = state.research.id ? state.research.teamSize : 0;
  state.workforce.projectStaff = state.project.id ? state.project.teamSize : 0;
  state.workforce.policyStaff = state.currentPolicy?.teamSize ?? 0;
  state.workforce.emergencyStaff = state.emergencyOrder?.teamSize ?? 0;
}

/** UI 只显示这个结果；所有岗位分配都是后台可追溯事实。 */
export function textAvailableWorkforce(state: TextIdleState): number {
  const workforce = state.workforce;
  return Math.max(0, state.population - workforce.dependents - workforce.essentialStaff - workforce.civicAndSecurityStaff - workforce.researchStaff - workforce.projectStaff - workforce.policyStaff - workforce.emergencyStaff);
}
export function textReserveCapacity(state: TextIdleState, reserve: ReserveId): number {
  const capacityGain = state.completedProjects.reduce((sum, id) => sum + ((TEXT_PROJECTS[id]?.output[reserve] ?? 0) > 0 ? 4 : 0), 0);
  return Math.min(60, 18 + capacityGain);
}
export function textAutomationUnlocked(state: TextIdleState): boolean {
  const gate = automationGate();
  return gate != null && state.completedTechs.includes(gate.tech) && state.completedProjects.includes(gate.project);
}
export function textCanStartResearch(state: TextIdleState, id: TextTechId): boolean {
  const technology = TEXT_TECHS[id];
  return technology != null && !state.research.id && requirementsMet(state, technology.requirements) && textAvailableWorkforce(state) >= technology.teamRequired;
}
export function textResearchBlockers(state: TextIdleState, id: TextTechId): string[] {
  const technology = TEXT_TECHS[id];
  if (technology == null) return ['研究资料尚未载入'];
  const blockers: string[] = [];
  if (state.research.id) blockers.push('研究组正在处理另一项研究');
  if (!has(state.completedTechs, technology.requirements.techs)) blockers.push('需要先完成前置研究');
  if (!has(state.completedProjects, technology.requirements.operationalProjects)) blockers.push('需要相关设施已经投用');
  if (textAvailableWorkforce(state) < technology.teamRequired) blockers.push(`需要空出 ${technology.teamRequired} 名研究人员`);
  return blockers;
}
export function textCanStartProject(state: TextIdleState, id: TextProjectId): boolean {
  const project = TEXT_PROJECTS[id];
  return project != null && !state.project.id && requirementsMet(state, project.requirements) && textAvailableWorkforce(state) >= project.teamRequired && state.construction.stock >= project.startCost;
}
export function textProjectBlockers(state: TextIdleState, id: TextProjectId): string[] {
  const project = TEXT_PROJECTS[id];
  if (project == null) return ['工程资料尚未载入'];
  const blockers: string[] = [];
  if (state.project.id) blockers.push('工务队正在建设另一项工程');
  if (!has(state.completedTechs, project.requirements.techs)) blockers.push('需要先完成前置研究');
  if (!has(state.completedProjects, project.requirements.operationalProjects)) blockers.push('需要相关设施已经投用');
  if (state.construction.stock < project.startCost) blockers.push(`还需 ${Number((project.startCost - state.construction.stock).toFixed(1))} 单位建设物资`);
  if (textAvailableWorkforce(state) < project.teamRequired) blockers.push(`需要空出 ${project.teamRequired} 名工务人员`);
  return blockers;
}

export function newTextIdleState(seed = 1): TextIdleState {
  const state: TextIdleState = {
    version: 5, seed, day: 0, calendar: calendarForDay(0), population: 28,
    reserves: { water: 18, food: 18, repair: 12 },
    construction: { stock: 12, capacity: 48, dailyProduction: 0 },
    workforce: { dependents: 4, essentialStaff: 15, civicAndSecurityStaff: 3, researchStaff: 0, projectStaff: 0, policyStaff: 0, emergencyStaff: 0 },
    emergencyOrder: null,
    failure: { level: 'stable', shortageDays: 0, lastChangedOn: 0 },
    developmentStage: 'emergency',
    dailyLedger: { day: 0, reserveNet: { water: 0, food: 0, repair: 0 }, constructionNet: 0, metricDelta: {}, focusId: 'settle' },
    metrics: { livelihood: 46, industry: 35, energy: 28, research: 32, administration: 30, logistics: 26, military: 18, stability: 42, ecology: 52 },
    nationalFocus: { id: 'settle', transitionDays: 0 }, currentPolicy: null, policyCooldowns: {}, completedTechs: [], completedProjects: [],
    research: { mode: 'manual', id: null, work: 0, teamSize: 0, startCost: 0, waitingForUnlock: false },
    project: { mode: 'manual', id: null, work: 0, teamSize: 0, startCost: 0, waitingForUnlock: false }, reports: [],
  };
  refreshWorkforce(state);
  return state;
}

export function availableTextTechs(state: TextIdleState): TextTechId[] {
  return (Object.keys(TEXT_TECHS) as TextTechId[]).filter((id) => !state.completedTechs.includes(id) && requirementsMet(state, TEXT_TECHS[id].requirements));
}
export function availableTextProjects(state: TextIdleState): TextProjectId[] {
  return (Object.keys(TEXT_PROJECTS) as TextProjectId[]).filter((id) => !state.completedProjects.includes(id) && requirementsMet(state, TEXT_PROJECTS[id].requirements));
}
export function availableTextPolicies(state: TextIdleState): TextPolicyId[] {
  return (Object.keys(TEXT_POLICIES) as TextPolicyId[]).filter((id) => !state.policyCooldowns[id] && requirementsMet(state, TEXT_POLICIES[id].requirements));
}
export function textCanStartPolicy(state: TextIdleState, id: TextPolicyId): boolean {
  const policy = TEXT_POLICIES[id];
  return policy != null && state.currentPolicy == null && !state.policyCooldowns[id] && requirementsMet(state, policy.requirements) && textAvailableWorkforce(state) >= policy.teamRequired;
}
export function textPolicyBlockers(state: TextIdleState, id: TextPolicyId): string[] {
  const policy = TEXT_POLICIES[id];
  if (policy == null) return ['政策资料尚未载入'];
  const blockers: string[] = [];
  if (state.currentPolicy) blockers.push('当前已有一项政策正在执行');
  if (state.policyCooldowns[id]) blockers.push(`还需等待 ${state.policyCooldowns[id]} 日后复核`);
  if (!has(state.completedTechs, policy.requirements.techs)) blockers.push('需要先完成前置研究');
  if (!has(state.completedProjects, policy.requirements.operationalProjects)) blockers.push('需要相关设施已经投用');
  if (textAvailableWorkforce(state) < policy.teamRequired) blockers.push(`需要空出 ${policy.teamRequired} 名行政人员`);
  return blockers;
}

/** 临时行动持续一个旬，替代过去每游戏日抢点三次的征集按钮。 */
export function issueEmergencyOrder(state: TextIdleState, id: TextEmergencyOrderId): TextIdleState {
  if (state.failure.level === 'lost') return state;
  const next = clone(state);
  refreshWorkforce(next);
  const available = textAvailableWorkforce(next) + (next.emergencyOrder?.teamSize ?? 0);
  if (available < 2) return state;
  next.emergencyOrder = { id, teamSize: 2, daysRemaining: 10, startedOn: next.day };
  refreshWorkforce(next);
  addReport(next, 'system', 'emergency.order.started', { id });
  return next;
}

/** 旧调用名保留到 UI 完成切换；语义已变为持续的临时行动。 */
export function collectEmergencyReserve(state: TextIdleState, id: ReserveId): TextIdleState { return issueEmergencyOrder(state, id); }

export function setTextFocus(state: TextIdleState, id: TextFocusId): TextIdleState {
  if (state.nationalFocus.id === id || state.failure.level === 'lost') return state;
  const next = clone(state);
  next.nationalFocus = { id, transitionDays: 10 };
  addReport(next, 'system', 'focus.transition.started', { focus: id });
  return next;
}
export function setTextSlotMode(state: TextIdleState, slot: 'research' | 'project', mode: 'manual' | 'auto'): TextIdleState {
  if (mode === 'auto' && !textAutomationUnlocked(state)) return state;
  if (state[slot].mode === mode || state.failure.level === 'lost') return state;
  const next = clone(state);
  next[slot].mode = mode;
  next[slot].waitingForUnlock = false;
  return next;
}
export function startTextResearch(state: TextIdleState, id: TextTechId): TextIdleState {
  if (!textCanStartResearch(state, id) || state.failure.level === 'lost') return state;
  const next = clone(state);
  const technology = TEXT_TECHS[id];
  next.research = { ...next.research, id, work: 0, teamSize: technology.teamRequired, startCost: 0, waitingForUnlock: false };
  refreshWorkforce(next);
  addReport(next, 'system', 'research.started', { id, staff: technology.teamRequired });
  return next;
}
export function startTextProject(state: TextIdleState, id: TextProjectId): TextIdleState {
  if (!textCanStartProject(state, id) || state.failure.level === 'lost') return state;
  const next = clone(state);
  const project = TEXT_PROJECTS[id];
  next.construction.stock = Number((next.construction.stock - project.startCost).toFixed(2));
  next.project = { ...next.project, id, work: 0, teamSize: project.teamRequired, startCost: project.startCost, waitingForUnlock: false };
  refreshWorkforce(next);
  addReport(next, 'system', 'project.started', { id, staff: project.teamRequired, cost: project.startCost });
  return next;
}
export function startTextPolicy(state: TextIdleState, id: TextPolicyId): TextIdleState {
  if (!textCanStartPolicy(state, id) || state.failure.level === 'lost') return state;
  const next = clone(state);
  const policy = TEXT_POLICIES[id];
  next.currentPolicy = { id, daysRemaining: policy.durationDays, teamSize: policy.teamRequired };
  refreshWorkforce(next);
  addReport(next, 'system', 'policy.started', { id, staff: policy.teamRequired });
  return next;
}

function autoChoose<T extends TextTechId | TextProjectId>(state: TextIdleState, slot: TextSlot<T>, candidates: T[], order: readonly T[], kind: 'research' | 'project'): void {
  if (slot.mode !== 'auto' || slot.id) return;
  const eligible = order.find((entry) => candidates.includes(entry) && (kind === 'research' ? textCanStartResearch(state, entry) : textCanStartProject(state, entry)));
  if (!eligible) {
    if (!slot.waitingForUnlock) addReport(state, 'system', `auto.${kind}.waiting`);
    slot.waitingForUnlock = true;
    return;
  }
  if (kind === 'research') {
    const technology = TEXT_TECHS[eligible];
    state.research = { ...state.research, id: eligible, work: 0, teamSize: technology.teamRequired, startCost: 0, waitingForUnlock: false };
  } else {
    const project = TEXT_PROJECTS[eligible];
    state.construction.stock = Number((state.construction.stock - project.startCost).toFixed(2));
    state.project = { ...state.project, id: eligible, work: 0, teamSize: project.teamRequired, startCost: project.startCost, waitingForUnlock: false };
  }
  refreshWorkforce(state);
  addReport(state, 'system', `auto.${kind}.started`, { id: eligible });
}
function projectOutputs(state: TextIdleState): { output: Record<ReserveId, number>; cost: Record<ReserveId, number>; metricEffects: Partial<Record<MetricId, number>> } {
  const output: Record<ReserveId, number> = { water: 0.42, food: 0.42, repair: 0.23 };
  const cost: Record<ReserveId, number> = { ...DAILY_CONSUMPTION };
  const metricEffects: Partial<Record<MetricId, number>> = {};
  if (state.nationalFocus.id === 'settle' && state.nationalFocus.transitionDays === 0) { output.water += 0.04; output.food += 0.04; output.repair += 0.02; }
  if (state.nationalFocus.id === 'build' && state.nationalFocus.transitionDays === 0) { output.water -= 0.03; output.food -= 0.03; }
  for (const id of state.completedProjects) {
    const project = TEXT_PROJECTS[id];
    for (const reserve of RESERVES) output[reserve] += project.output[reserve] ?? 0;
    for (const reserve of RESERVES) cost[reserve] *= project.consumptionMultiplier?.[reserve] ?? 1;
    for (const [metric, value] of Object.entries(project.metricEffects)) metricEffects[metric as MetricId] = (metricEffects[metric as MetricId] ?? 0) + (value ?? 0);
  }
  if (textAutomationUnlocked(state)) { output.water += 0.40; output.food += 0.40; output.repair += 0.25; }
  if (state.currentPolicy) {
    const policy = TEXT_POLICIES[state.currentPolicy.id];
    for (const reserve of RESERVES) output[reserve] += policy.output?.[reserve] ?? 0;
    for (const [metric, value] of Object.entries(policy.metricEffects ?? {})) metricEffects[metric as MetricId] = (metricEffects[metric as MetricId] ?? 0) + (value ?? 0);
  }
  if (state.emergencyOrder) {
    if (state.emergencyOrder.id === 'salvage') output.repair += 0.12;
    else output[state.emergencyOrder.id] += 0.35;
  }
  return { output, cost, metricEffects };
}
function advanceSlot(state: TextIdleState, slot: 'research' | 'project'): void {
  if (slot === 'research') {
    const id = state.research.id;
    if (!id) return;
    const technology = TEXT_TECHS[id];
    state.research.work += (0.8 + state.metrics.research / 100) * focusMultiplier(state, 'research') * (state.research.teamSize / technology.teamRequired);
    if (state.research.work < technology.work) return;
    state.completedTechs.push(id);
    state.research = { ...state.research, id: null, work: 0, teamSize: 0, startCost: 0 };
    refreshWorkforce(state);
    addReport(state, 'completion', 'research.completed', { id });
    return;
  }
  const id = state.project.id;
  if (!id) return;
  const project = TEXT_PROJECTS[id];
  state.project.work += (0.8 + state.metrics.industry / 100) * focusMultiplier(state, 'project') * (state.project.teamSize / project.teamRequired);
  if (state.project.work < project.work) return;
  state.completedProjects.push(id);
  state.project = { ...state.project, id: null, work: 0, teamSize: 0, startCost: 0 };
  refreshWorkforce(state);
  addReport(state, 'completion', 'project.completed', { id });
}
function advanceFailure(state: TextIdleState): void {
  const depleted = RESERVES.find((reserve) => state.reserves[reserve] === 0);
  const previous = state.failure.level;
  if (!depleted) {
    state.failure = { level: 'stable', shortageDays: 0, lastChangedOn: state.day };
    if (previous === 'critical') addReport(state, 'system', 'failure.recovered');
    return;
  }
  const shortageDays = state.failure.shortageDays + 1;
  const level = shortageDays >= FAILURE_LIMIT_DAYS ? 'lost' : shortageDays >= 5 ? 'critical' : 'strained';
  state.failure = { level, shortageDays, failedReserve: depleted, lastChangedOn: previous === level ? state.failure.lastChangedOn : state.day };
  if (level !== previous) addReport(state, 'warning', `failure.${level}`, { reserve: depleted, days: shortageDays });
}

function refreshDevelopmentStage(state: TextIdleState): void {
  const previous = state.developmentStage;
  const reservesSafe = RESERVES.every((reserve) => state.reserves[reserve] >= 10);
  const settled = state.failure.level === 'stable'
    && textAutomationUnlocked(state)
    && state.completedProjects.length >= 3
    && reservesSafe
    && state.metrics.livelihood >= 55;
  state.developmentStage = settled ? 'settled' : state.failure.level === 'stable' ? 'recovery' : 'emergency';
  if (state.developmentStage !== previous && state.developmentStage === 'settled') {
    addReport(state, 'completion', 'stage.settled');
  }
}

export function advanceTextIdleDay(state: TextIdleState): TextIdleState {
  if (state.failure.level === 'lost') return state;
  const next = clone(state);
  next.day += 1;
  next.calendar = calendarForDay(next.day);
  if (next.nationalFocus.transitionDays > 0) next.nationalFocus.transitionDays -= 1;
  for (const id of Object.keys(next.policyCooldowns) as TextPolicyId[]) {
    const remaining = Math.max(0, (next.policyCooldowns[id] ?? 0) - 1);
    if (remaining === 0) delete next.policyCooldowns[id]; else next.policyCooldowns[id] = remaining;
  }
  refreshWorkforce(next);
  autoChoose(next, next.research, availableTextTechs(next), TEXT_TECH_ORDER[next.nationalFocus.id], 'research');
  autoChoose(next, next.project, availableTextProjects(next), TEXT_PROJECT_ORDER[next.nationalFocus.id], 'project');
  const totals = projectOutputs(next);
  const reserveNet: Record<ReserveId, number> = { water: 0, food: 0, repair: 0 };
  for (const reserve of RESERVES) {
    const before = next.reserves[reserve];
    const net = Number((totals.output[reserve] - totals.cost[reserve]).toFixed(2));
    reserveNet[reserve] = net;
    next.reserves[reserve] = clamp(Number((before + net).toFixed(2)), 0, textReserveCapacity(next, reserve));
    if (before > 0 && next.reserves[reserve] === 0) addReport(next, 'warning', 'reserve.depleted', { reserve });
  }
  const constructionProduction = Number(((0.26 + next.metrics.industry / 500 + (next.emergencyOrder?.id === 'salvage' ? 0.46 : 0)) * focusMultiplier(next, 'construction')).toFixed(2));
  const constructionBefore = next.construction.stock;
  next.construction.dailyProduction = constructionProduction;
  next.construction.stock = clamp(Number((constructionBefore + constructionProduction).toFixed(2)), 0, next.construction.capacity);
  const shortage = RESERVES.filter((reserve) => next.reserves[reserve] === 0).length;
  const metricDelta: Partial<Record<MetricId, number>> = {};
  for (const metric of METRICS) {
    const focusEffect = metric === 'livelihood' && next.nationalFocus.id === 'settle' ? 0.06 : metric === 'industry' && next.nationalFocus.id === 'build' ? 0.06 : metric === 'research' && next.nationalFocus.id === 'learn' ? 0.06 : metric === 'military' && next.nationalFocus.id === 'defend' ? 0.06 : 0;
    const recovery = metric === 'livelihood' ? (shortage > 0 ? -shortage * 0.75 : 0.12) : 0.02;
    const effect = (totals.metricEffects[metric] ?? 0) * 0.025;
    const delta = recovery + effect + focusEffect;
    metricDelta[metric] = Number(delta.toFixed(3));
    next.metrics[metric] = clamp(next.metrics[metric] + delta);
  }
  advanceSlot(next, 'project');
  advanceSlot(next, 'research');
  if (next.currentPolicy) {
    next.currentPolicy.daysRemaining -= 1;
    if (next.currentPolicy.daysRemaining <= 0) {
      const id = next.currentPolicy.id;
      next.policyCooldowns[id] = TEXT_POLICIES[id].cooldownDays;
      next.currentPolicy = null;
      refreshWorkforce(next);
      addReport(next, 'system', 'policy.completed', { id });
    }
  }
  if (next.emergencyOrder) {
    next.emergencyOrder.daysRemaining -= 1;
    if (next.emergencyOrder.daysRemaining <= 0) {
      const id = next.emergencyOrder.id;
      next.emergencyOrder = null;
      refreshWorkforce(next);
      addReport(next, 'system', 'emergency.order.completed', { id });
    }
  }
  next.dailyLedger = { day: next.day, reserveNet, constructionNet: Number((next.construction.stock - constructionBefore).toFixed(2)), metricDelta, focusId: next.nationalFocus.id };
  advanceFailure(next);
  refreshDevelopmentStage(next);
  return next;
}

export function advanceTextIdleDays(state: TextIdleState, days: number): TextIdleState {
  let next = state;
  for (let index = 0; index < days && next.failure.level !== 'lost'; index += 1) next = advanceTextIdleDay(next);
  return next;
}
