import type {
  CampaignSaveV6, FacilityId, MetricId, Notification, RunMode, SlotRuntime,
  V6PolicyId, V6ProjectId, V6TechId,
} from './types';
import { FOCUS_MODIFIERS, METRIC_BASELINE, METRIC_EFFECT_TO_TARGET, METRIC_ORDER, METRIC_TARGET_RESPONSE, TRANSITION_DAYS, TRANSITION_START } from './content/metrics';
import { POLICY_IDS, POLICIES, PROJECT_IDS, PROJECTS, TECH_IDS, TECHS, type DefinitionEffect } from './content/definitions';
import { ongoingRequirementsMet, requirementsMet } from './content/requirements';
import { campaignStage, sustainablePopulationCapacity } from './content/campaignStage';
import { PROJECT_MAP_EFFECTS } from './content/projectMapEffects';
import { mapModuleById } from './world/mapModules';
import { evaluateModuleSite } from './world/siteSuitability';

const HANDOVER_DAYS = 3;
const MILESTONES = [25, 50, 75, 100] as const;

function clamp(value: number, low = 0, high = 100): number { return Math.max(low, Math.min(high, value)); }
function copy(state: CampaignSaveV6): CampaignSaveV6 { return structuredClone(state) as CampaignSaveV6; }
function addNotification(state: CampaignSaveV6, kind: Notification['kind'], copyKey: string, params: Notification['params'] = {}): void {
  state.notificationHistory.push({ id: `${state.day}-${state.notificationHistory.length + 1}`, day: state.day, kind, copyKey, params });
  state.notificationHistory = state.notificationHistory.slice(-120);
}

function isCompleted<T extends string>(ids: T[], id: T): boolean { return ids.includes(id); }
function techAvailable(state: CampaignSaveV6, id: V6TechId): boolean { return !isCompleted(state.completed.techs, id) && requirementsMet(TECHS[id].requirements, state); }
function projectAvailable(state: CampaignSaveV6, id: V6ProjectId): boolean { return !isCompleted(state.completed.projects, id) && requirementsMet(PROJECTS[id].requirements, state); }
function policyAvailable(state: CampaignSaveV6, id: V6PolicyId): boolean { return !state.policyCooldowns[id] && requirementsMet(POLICIES[id].requirements, state); }

export function availableTechs(state: CampaignSaveV6): V6TechId[] { return TECH_IDS.filter((id) => techAvailable(state, id)); }
export function availableProjects(state: CampaignSaveV6): V6ProjectId[] { return PROJECT_IDS.filter((id) => projectAvailable(state, id)); }
export function availablePolicies(state: CampaignSaveV6): V6PolicyId[] { return POLICY_IDS.filter((id) => policyAvailable(state, id)); }

function applyEffect(totals: { metrics: Record<MetricId, number>; projectSpeed: number; researchSpeed: number; coverage: Record<keyof CampaignSaveV6['supply']['coverage'], number> }, effect?: DefinitionEffect): void {
  if (!effect) return;
  for (const [id, value] of Object.entries(effect.metrics ?? {})) totals.metrics[id as MetricId] += value ?? 0;
  totals.projectSpeed *= effect.projectSpeed ?? 1;
  totals.researchSpeed *= effect.researchSpeed ?? 1;
  for (const [id, value] of Object.entries(effect.coverage ?? {})) totals.coverage[id as keyof CampaignSaveV6['supply']['coverage']] += value ?? 0;
}

function eventEffect(state: CampaignSaveV6, id: string): DefinitionEffect | undefined {
  const active = state.events.find((event) => event.id === id && event.active && !event.resolved);
  if (!active) return undefined;
  if (id === 'water_wear') return { metrics: { livelihood: -0.08 }, projectSpeed: 0.92, coverage: { water: -0.06 } };
  if (id === 'acid_rain') return { metrics: { ecology: -0.08, livelihood: -0.03 }, coverage: { food: -0.04 } };
  if (id === 'ferry_injury') return { metrics: { industry: -0.06, stability: -0.05 } };
  if (id === 'road_ambush') return { metrics: { logistics: -0.06, military: -0.03, stability: -0.03 } };
  return undefined;
}

function resolveTotals(state: CampaignSaveV6) {
  const totals = {
    metrics: Object.fromEntries(METRIC_ORDER.map((id) => [id, 0])) as Record<MetricId, number>,
    projectSpeed: 1,
    researchSpeed: 1,
    coverage: { water: 0, food: 0, energy: 0, maintenance: 0 },
  };
  const focus = FOCUS_MODIFIERS[state.nationalPolicy.id];
  applyEffect(totals, { metrics: focus.metrics, projectSpeed: focus.projectSpeed, researchSpeed: focus.researchSpeed });
  for (const id of state.completed.techs) applyEffect(totals, TECHS[id].effect);
  for (const id of state.completed.projects) {
    const project = PROJECTS[id];
    for (const milestone of state.facilities[project.facilityId].reachedMilestones) applyEffect(totals, project.milestoneEffects[milestone]);
  }
  if (state.currentPolicy) applyEffect(totals, POLICIES[state.currentPolicy.id].effect);
  for (const event of state.events) applyEffect(totals, eventEffect(state, event.id));

  // 具体物资不以无限库存展示；它们作为日供给覆盖率，对国家指标形成持续压力或支撑。
  const water = clamp(state.supply.coverage.water + totals.coverage.water, 0, 1.25);
  const food = clamp(state.supply.coverage.food + totals.coverage.food, 0, 1.25);
  const energy = clamp(state.supply.coverage.energy + totals.coverage.energy, 0, 1.25);
  const maintenance = clamp(state.supply.coverage.maintenance + totals.coverage.maintenance, 0, 1.25);
  const dailyFloor = Math.min(water, food, energy);
  if (dailyFloor < 1) totals.metrics.livelihood += (dailyFloor - 1) * 0.5;
  if (food < 0.9) totals.metrics.stability += (food - 0.9) * 0.12;
  if (maintenance < 0.9) totals.metrics.industry += (maintenance - 0.9) * 0.15;
  if (energy < 0.85) totals.metrics.energy += (energy - 0.85) * 0.3;

  const efficiency = state.nationalPolicy.transitionEfficiency;
  for (const id of METRIC_ORDER) if (totals.metrics[id] > 0) totals.metrics[id] *= efficiency;
  totals.projectSpeed *= efficiency;
  totals.researchSpeed *= efficiency;
  return totals;
}

function tickEvents(state: CampaignSaveV6): void {
  const desired: Record<string, boolean> = {
    water_wear: state.facilities.water_main.stage !== 'trial' && state.metrics.livelihood.value < 55,
    acid_rain: state.facilities.valley_greenhouse.stage !== 'operational' && state.metrics.ecology.value < 60,
    // 工业优先增加施工压力，但不把“选择工业”本身写成永不消失的事故。
    ferry_injury: state.facilities.ferry_workshop.stage === 'construction',
    road_ambush: state.facilities.well_radio_tower.stage !== 'trial' && state.metrics.logistics.value < 40,
  };
  for (const event of state.events) {
    if (!event.active && desired[event.id]) { event.active = true; addNotification(state, 'event', `event.${event.id}.started`); }
    if (event.active && !desired[event.id]) { event.active = false; event.resolved = true; addNotification(state, 'event', `event.${event.id}.resolved`); }
  }
}

function tickTransition(state: CampaignSaveV6): void {
  if (state.nationalPolicy.transitionDaysRemaining <= 0) { state.nationalPolicy.transitionEfficiency = 1; return; }
  state.nationalPolicy.transitionDaysRemaining -= 1;
  state.nationalPolicy.transitionEfficiency = Math.min(1, TRANSITION_START + (TRANSITION_DAYS - state.nationalPolicy.transitionDaysRemaining) * 0.035);
  if (state.nationalPolicy.transitionDaysRemaining === 0) addNotification(state, 'system', 'focus.reorganization.complete');
}

function chooseAuto<T extends string>(state: CampaignSaveV6, slot: SlotRuntime<T>, order: string[], available: (id: T) => boolean, ids: T[], kind: 'project' | 'research'): void {
  if (slot.mode !== 'auto' || slot.id || slot.autoEligibleDay === null || state.day < slot.autoEligibleDay) return;
  const chosen = order.find((id) => ids.includes(id as T) && available(id as T));
  // 自动槽会等待前置科技/设施达成，而不是第一次没有候选就永久停摆。
  // 日志只按月提示一次，避免把“正在等待”刷成每日噪声。
  if (!chosen) {
    if (!slot.waitingForUnlock) addNotification(state, 'system', `auto.${kind}.no_candidate`);
    slot.waitingForUnlock = true;
    slot.autoEligibleDay = state.day + 1;
    return;
  }
  slot.waitingForUnlock = false;
  slot.id = chosen as T;
  slot.progressWork = 0;
  slot.status = 'active';
  slot.handoverDays = HANDOVER_DAYS;
  slot.autoEligibleDay = null;
  addNotification(state, 'system', `auto.${kind}.started`, { id: chosen });
}

function projectSpeed(state: CampaignSaveV6, modifier: number): number {
  return (0.55 + state.metrics.industry.value * 0.02 + state.metrics.logistics.value * 0.01) * modifier;
}
function researchSpeed(state: CampaignSaveV6, modifier: number): number {
  return (1 + state.metrics.research.value * 0.02 + state.metrics.administration.value * 0.01) * modifier;
}

function facilityStageFor(milestone: number): 'construction' | 'trial' | 'operational' {
  if (milestone >= 100) return 'operational';
  if (milestone >= 50) return 'trial';
  return 'construction';
}

/**
 * 工程地图变化只在达到可见施工节点后写入世界蓝图。
 * 这样地图上的聚居地扩张、道路和管网始终来自同一份可存档事实，
 * 而不是由面板为了“看起来完成”临时画一层图。
 */
function syncProjectTerrainChange(state: CampaignSaveV6, id: V6ProjectId, milestone: number): void {
  if (milestone < 50) return;
  for (const definition of PROJECT_MAP_EFFECTS[id]) {
    const anchor = state.world.siteAnchors.find((entry) => entry.id === definition.anchorId);
    if (!anchor || !evaluateModuleSite(mapModuleById(definition.moduleId), anchor.position[0], anchor.position[1], state.world).eligible) continue;
    const radius = milestone >= 100 ? definition.operationalRadius : definition.trialRadius;
    const existing = state.world.terrainChanges.find((change) => change.id === definition.changeId);
    const data = { milestone, radius, project: id, mapModuleId: definition.moduleId, ...(definition.route ? { route: definition.route } : {}) };
    if (existing) existing.data = data;
    else state.world.terrainChanges.push({ id: definition.changeId, kind: definition.kind, anchorId: definition.anchorId, createdDay: state.day, data });
  }
}

function reachProjectMilestones(state: CampaignSaveV6, id: V6ProjectId): void {
  const project = PROJECTS[id];
  const facility = state.facilities[project.facilityId];
  const progressPercent = state.projectSlot.progressWork / project.work * 100;
  for (const milestone of MILESTONES) {
    if (progressPercent < milestone || facility.reachedMilestones.includes(milestone)) continue;
    facility.reachedMilestones.push(milestone);
    facility.stage = facilityStageFor(milestone);
    const coverage = project.milestoneEffects[milestone]?.coverage;
    if (coverage) for (const [supplyId, value] of Object.entries(coverage)) {
      const key = supplyId as keyof CampaignSaveV6['supply']['coverage'];
      state.supply.coverage[key] = clamp(state.supply.coverage[key] + (value ?? 0), 0, 1.25);
    }
    syncProjectTerrainChange(state, id, milestone);
    addNotification(state, milestone === 100 ? 'completion' : 'milestone', `project.${id}.${milestone}`, { project: id, milestone });
  }
}
function reachResearchMilestones(state: CampaignSaveV6, id: V6TechId, work: number, beforeWork: number): void {
  for (const milestone of MILESTONES) {
    const current = Math.floor(state.researchSlot.progressWork / work * 4);
    const previous = Math.floor(beforeWork / work * 4);
    if (current >= milestone / 25 && previous < milestone / 25) addNotification(state, milestone === 100 ? 'completion' : 'milestone', `tech.${id}.${milestone}`, { tech: id, milestone });
  }
}

function advanceProject(state: CampaignSaveV6, speed: number): void {
  const id = state.projectSlot.id;
  if (!id) return;
  if (!ongoingRequirementsMet(PROJECTS[id].requirements, state)) { state.projectSlot.status = 'stalled'; return; }
  state.projectSlot.status = 'active';
  if (state.projectSlot.handoverDays > 0) state.projectSlot.handoverDays -= 1;
  const handover = state.projectSlot.handoverDays > 0 ? 0.7 : 1;
  state.projectSlot.progressWork += projectSpeed(state, speed) * handover;
  reachProjectMilestones(state, id);
  if (state.projectSlot.progressWork < PROJECTS[id].work) return;
  state.projectSlot.progressWork = PROJECTS[id].work;
  if (!state.completed.projects.includes(id)) state.completed.projects.push(id);
  state.projectSlot.id = null;
  state.projectSlot.status = 'idle';
  state.projectSlot.handoverDays = 0;
  state.projectSlot.waitingForUnlock = false;
  state.projectSlot.autoEligibleDay = state.day + 1;
}
function advanceResearch(state: CampaignSaveV6, speed: number): void {
  const id = state.researchSlot.id;
  if (!id) return;
  if (!requirementsMet(TECHS[id].requirements, state)) { state.researchSlot.status = 'stalled'; return; }
  state.researchSlot.status = 'active';
  if (state.researchSlot.handoverDays > 0) state.researchSlot.handoverDays -= 1;
  const handover = state.researchSlot.handoverDays > 0 ? 0.7 : 1;
  const before = state.researchSlot.progressWork;
  state.researchSlot.progressWork += researchSpeed(state, speed) * handover;
  reachResearchMilestones(state, id, TECHS[id].work, before);
  // Preserve direct threshold detection when an unusually large step crosses several stages.
  if (state.researchSlot.progressWork >= TECHS[id].work && before < TECHS[id].work) {
    if (!state.completed.techs.includes(id)) state.completed.techs.push(id);
    state.researchSlot.id = null;
    state.researchSlot.status = 'idle';
    state.researchSlot.handoverDays = 0;
    state.researchSlot.waitingForUnlock = false;
    state.researchSlot.autoEligibleDay = state.day + 1;
  }
}

function tickPolicy(state: CampaignSaveV6): void {
  if (!state.currentPolicy) return;
  state.currentPolicy.daysRemaining -= 1;
  if (state.currentPolicy.daysRemaining > 0) return;
  const policy = state.currentPolicy.id;
  state.policyCooldowns[policy] = POLICIES[policy].cooldownDays;
  state.currentPolicy = null;
  addNotification(state, 'policy', `policy.${policy}.complete`);
}

/**
 * 人口既不是点击增长也不是一串独立库存：它只在生活已能维持、设施确有余量时缓慢增加。
 * 保障跌破底线时先出现流失；容量不足时不会继续凭空增长。
 */
function advancePopulation(state: CampaignSaveV6, totals: ReturnType<typeof resolveTotals>): void {
  const coverage = {
    water: clamp(state.supply.coverage.water + totals.coverage.water, 0, 1.25),
    food: clamp(state.supply.coverage.food + totals.coverage.food, 0, 1.25),
    energy: clamp(state.supply.coverage.energy + totals.coverage.energy, 0, 1.25),
  };
  const dailyFloor = Math.min(coverage.water, coverage.food, coverage.energy);
  const capacity = sustainablePopulationCapacity(state);
  let delta = 0;
  if (dailyFloor < 0.72 || state.metrics.livelihood.value < 40) {
    delta = -Math.min(0.10, 0.018 + (0.72 - dailyFloor) * 0.13 + Math.max(0, 40 - state.metrics.livelihood.value) * 0.002);
  } else if (state.population < capacity && dailyFloor >= 0.82 && state.metrics.livelihood.value >= 50) {
    const room = Math.max(0, (capacity - state.population) / capacity);
    const stability = Math.max(0, (state.metrics.stability.value - 45) / 55);
    delta = (0.010 + stability * 0.018 + (state.facilities.water_main.stage === 'operational' ? 0.010 : 0)) * room;
  }
  state.population = Math.max(1, Math.min(capacity, state.population + delta));
}

/** 唯一日步入口：批量推进只允许循环调用它。 */
export function advanceOneDayV6(state: CampaignSaveV6): CampaignSaveV6 {
  const next = copy(state);
  const stageBefore = campaignStage(next).id;
  next.day += 1;
  for (const id of POLICY_IDS) if (next.policyCooldowns[id]) next.policyCooldowns[id] = Math.max(0, next.policyCooldowns[id]! - 1) || undefined;
  tickTransition(next);
  chooseAuto(next, next.projectSlot, FOCUS_MODIFIERS[next.nationalPolicy.id].autoProjectOrder, (id) => projectAvailable(next, id), PROJECT_IDS, 'project');
  chooseAuto(next, next.researchSlot, FOCUS_MODIFIERS[next.nationalPolicy.id].autoResearchOrder, (id) => techAvailable(next, id), TECH_IDS, 'research');
  tickEvents(next);
  const totals = resolveTotals(next);
  for (const id of METRIC_ORDER) {
    const target = clamp(METRIC_BASELINE[id].initial + totals.metrics[id] * METRIC_EFFECT_TO_TARGET);
    const delta = clamp((target - next.metrics[id].value) * METRIC_TARGET_RESPONSE, -0.4, 0.4);
    next.metrics[id].dailyRate = delta;
    next.metrics[id].value = clamp(next.metrics[id].value + delta);
  }
  advancePopulation(next, totals);
  advanceProject(next, totals.projectSpeed);
  advanceResearch(next, totals.researchSpeed);
  tickPolicy(next);
  const stageAfter = campaignStage(next).id;
  if (stageAfter !== stageBefore) addNotification(next, 'completion', `stage.${stageAfter}.reached`);
  if (next.day % 60 === 0) addNotification(next, 'report', 'report.sixty_day');
  return next;
}

/** 当前可用覆盖率：基础设施是长期值，当前政策/事件才提供临时偏移。 */
export function effectiveSupplyCoverageV6(state: CampaignSaveV6): CampaignSaveV6['supply']['coverage'] {
  const totals = resolveTotals(state);
  return {
    water: clamp(state.supply.coverage.water + totals.coverage.water, 0, 1.25),
    food: clamp(state.supply.coverage.food + totals.coverage.food, 0, 1.25),
    energy: clamp(state.supply.coverage.energy + totals.coverage.energy, 0, 1.25),
    maintenance: clamp(state.supply.coverage.maintenance + totals.coverage.maintenance, 0, 1.25),
  };
}

export function advanceDaysV6(state: CampaignSaveV6, days: number): CampaignSaveV6 {
  let next = state;
  for (let day = 0; day < days; day += 1) next = advanceOneDayV6(next);
  return next;
}

export function setNationalPolicyV6(state: CampaignSaveV6, id: CampaignSaveV6['nationalPolicy']['id']): CampaignSaveV6 {
  if (state.nationalPolicy.id === id) return state;
  const next = copy(state);
  next.nationalPolicy = { id, transitionDaysRemaining: TRANSITION_DAYS, transitionEfficiency: TRANSITION_START };
  addNotification(next, 'system', 'focus.reorganization.started', { focus: id });
  return next;
}
export function setSlotModeV6(state: CampaignSaveV6, slot: 'project' | 'research', mode: RunMode): CampaignSaveV6 {
  const next = copy(state);
  const runtime = slot === 'project' ? next.projectSlot : next.researchSlot;
  runtime.mode = mode;
  if (mode === 'auto' && !runtime.id) runtime.autoEligibleDay = next.day + 1;
  return next;
}
export function startProjectV6(state: CampaignSaveV6, id: V6ProjectId): CampaignSaveV6 {
  if (state.projectSlot.id || !projectAvailable(state, id)) return state;
  const next = copy(state);
  next.projectSlot = { ...next.projectSlot, id, progressWork: 0, status: 'active', handoverDays: HANDOVER_DAYS, autoEligibleDay: null, waitingForUnlock: false };
  next.facilities[PROJECTS[id].facilityId].stage = 'planned';
  addNotification(next, 'system', 'project.started', { project: id });
  return next;
}
export function startResearchV6(state: CampaignSaveV6, id: V6TechId): CampaignSaveV6 {
  if (state.researchSlot.id || !techAvailable(state, id)) return state;
  const next = copy(state);
  next.researchSlot = { ...next.researchSlot, id, progressWork: 0, status: 'active', handoverDays: HANDOVER_DAYS, autoEligibleDay: null, waitingForUnlock: false };
  addNotification(next, 'system', 'tech.started', { tech: id });
  return next;
}
export function startPolicyV6(state: CampaignSaveV6, id: V6PolicyId): CampaignSaveV6 {
  if (!policyAvailable(state, id)) return state;
  const next = copy(state);
  if (next.currentPolicy) {
    const old = next.currentPolicy.id;
    next.policyCooldowns[old] = POLICIES[old].cooldownDays;
    addNotification(next, 'policy', `policy.${old}.cancelled`);
  }
  next.currentPolicy = { id, daysRemaining: POLICIES[id].durationDays, startedDay: next.day };
  addNotification(next, 'policy', `policy.${id}.started`);
  return next;
}
