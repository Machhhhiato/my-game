import { formatGameDate, nextGameDate } from './calendar';
import {
  SYSTEM_GUARD_DAYS,
  availableAmount,
  coverageDays,
  createEmptyMonthlyLedger,
  dailyResourceRate,
  dailyUse,
  foodInflow,
  maintenancePlan,
  refreshMonthlyProjection,
  shouldUseHeadquartersSalvage,
  waterInflow,
  type MaintenancePlan,
  type ProtectedResource,
} from './economy';
import {
  applyWorkforcePlan,
  livingPopulation,
  MODE_STAFF,
  requestedWorkers,
  workablePopulation,
} from './state';
import {
  RESOURCE_IDS,
  type DailyModes,
  type GameSpeed,
  type M0Event,
  type M0State,
  type Priority,
  type Project,
  type ProjectEvent,
  type ResourceFlow,
  type ResourceId,
  type WorkMode,
} from './types';
import {
  nextIntelStage,
  refreshMapIntel,
  surveyFor,
  surveyWorkRequired,
} from './map';
import {
  capabilityPrerequisites,
  enabledResearchCapacity,
  isPrecisionWorkshopProjectId,
  isResearchProjectId,
  projectForCapability,
  queueTarget,
  selectResearch,
  technologies,
} from './progression';
import type { IntelStage, ResearchDomain, ResearchMode, SurveyTargetId } from './types';

export { availableAmount, coverageDays } from './economy';

const RECOVERY_PRIORITIES: Priority[] = ['P1', 'P2', 'P3'];
const PAUSE_PRIORITIES: Priority[] = ['P3', 'P2', 'P1'];
const PROTECTED_RESOURCES: ProtectedResource[] = ['water', 'food', 'commonParts'];

interface MaintenanceFlow extends MaintenancePlan {
  repaired: number;
  used: number;
  actualBacklogDelta: number;
  usedHeadquartersSalvage: boolean;
}

function cloneState(state: M0State): M0State {
  return JSON.parse(JSON.stringify(state)) as M0State;
}

function projectById(state: M0State, id: string): Project | undefined {
  return state.projects.find((project) => project.id === id);
}

function isSurveyProject(project: Project): boolean {
  return project.id === 'survey-ruin-a' || project.id === 'survey-ruin-b';
}

function minimumProjectStaff(project: Project): number {
  if (project.id === 'repair-precision-workshop') return 9;
  if (isPrecisionWorkshopProjectId(project.id)) return 6;
  if (isResearchProjectId(project.id)) return 1;
  if (isSurveyProject(project)) return 2;
  return 0;
}

function synchronizeResearch(state: M0State): void {
  state.research.manualQueue = state.research.manualQueue.filter((id) => !state.research.completed.includes(id));
  if (state.research.mode === 'manual'
    && state.research.manualQueue.length === 0
    && state.research.automaticDomains.length > 0) state.research.mode = 'automatic';
  const selection = selectResearch(state);
  state.research.roundTarget = selection.roundTarget;
  state.research.blockedProjectId = selection.blockedProjectId;
  state.research.blockedReason = selection.blockedReason;

  const facilityCapacity = enabledResearchCapacity(state.research);
  for (const project of state.projects.filter((candidate) => isResearchProjectId(candidate.id) && candidate.status !== 'complete')) {
    project.staffing.planned = facilityCapacity;
    if (project.id === selection.id) {
      if (project.pausedReason === 'player_pause' || project.pausedReason === 'research_prerequisite') {
        project.status = 'active';
        project.pausedReason = null;
      }
    } else if (project.status === 'active') {
      project.status = 'paused';
      project.pausedReason = 'player_pause';
      project.staffing.actual = 0;
    }
  }

  if (selection.id && !state.projects.some((project) => project.id === selection.id)) {
    const project = projectForCapability(selection.id, 'P1', facilityCapacity);
    if (project) state.projects.push(project);
  }
  const selectedProject = selection.id ? projectById(state, selection.id) : undefined;
  state.research.currentProjectId = selectedProject?.status === 'active' ? selectedProject.id : null;
  state.research.currentSource = state.research.currentProjectId ? selection.source : null;
}

function projectStatusForPause(project: Project): 'paused' | 'waiting_confirmation' {
  return project.autoResume && project.staffing.returnTo !== null ? 'paused' : 'waiting_confirmation';
}

function recordProjectEvent(project: Project): ProjectEvent {
  return {
    projectId: project.id,
    projectName: project.name,
    status: project.status,
    reason: project.pausedReason,
  };
}

function pauseProject(
  project: Project,
  reason: NonNullable<Project['pausedReason']>,
  events: ProjectEvent[],
): void {
  if (project.status !== 'active' || project.directRecovery) return;
  project.status = projectStatusForPause(project);
  project.pausedReason = reason;
  project.staffing.actual = 0;
  project.safeActiveDays = 0;
  events.push(recordProjectEvent(project));
}

function synchronizeSurveyPauseState(state: M0State): void {
  for (const survey of state.map.surveys) {
    const project = projectById(state, survey.projectId);
    if (!project || project.status === 'complete' || project.status === 'active') {
      survey.paused = false;
      survey.pauseReason = null;
      continue;
    }
    survey.paused = true;
    survey.pauseReason = project.pausedReason === 'route_choice' ? 'route-choice'
      : project.pausedReason === 'day_limit' ? 'day-limit'
        : project.pausedReason === 'player_pause' ? 'player'
          : project.pausedReason === 'staffing_shortage' ? 'staffing' : 'safety';
  }
}

function enforceStaffing(state: M0State, events: ProjectEvent[]): void {
  let required = requestedWorkers(state);
  const workable = workablePopulation(state);

  if (required > workable) {
    for (const priority of PAUSE_PRIORITIES) {
      const candidates = state.projects
        .filter((project) => project.priority === priority
          && project.status === 'active'
          && !project.directRecovery
          && !isResearchProjectId(project.id))
        .sort((left, right) => right.queueOrder - left.queueOrder);

      for (const project of candidates) {
        pauseProject(project, 'staffing_shortage', events);
        required = requestedWorkers(state);
        if (required <= workable) break;
      }
      if (required <= workable) break;
    }
  }

  applyWorkforcePlan(state);
  synchronizeSurveyPauseState(state);
  const finalRequired = requestedWorkers(state);
  state.staffingShortage = finalRequired > workable
    ? {
        required: finalRequired,
        workable,
        message: `岗位缺口：当前编制需要 ${finalRequired} 人，可工作人口只有 ${workable} 人。`,
      }
    : null;
}

function calculateMaintenanceFlow(state: M0State): MaintenanceFlow {
  const droneMaintenanceDemand = !state.drone?.rechargeApproved
    ? 0
    : state.drone.recharge === 'connection'
      ? 2
      : state.drone.recharge === 'inspection'
        || (state.drone.recharge === 'overnight'
          && state.drone.overnightStartedDay !== null
          && state.elapsedDays > state.drone.overnightStartedDay)
        ? 1
        : 0;
  const routineState = cloneState(state);
  routineState.workforce.maintenance = Math.max(0, state.workforce.maintenance - droneMaintenanceDemand);
  const usedHeadquartersSalvage = shouldUseHeadquartersSalvage(routineState);
  const plan = usedHeadquartersSalvage
    ? { repair: 4, consume: 3, backlogDelta: 0 }
    : maintenancePlan(routineState);
  const stock = state.stocks.commonParts;
  const repairCapacity = Math.max(0, stock.capacity - availableAmount(state, 'commonParts') + plan.consume);
  const repairSource = usedHeadquartersSalvage ? plan.repair : state.oldRepairableParts;
  const repaired = Math.min(plan.repair, repairSource, repairCapacity);
  const used = Math.min(plan.consume, availableAmount(state, 'commonParts') + repaired);
  const missingParts = plan.consume - used;

  return {
    ...plan,
    repaired,
    used,
    actualBacklogDelta: plan.backlogDelta + missingParts * 2,
    usedHeadquartersSalvage,
  };
}

function applyContinuousFlow(
  state: M0State,
  resource: ResourceId,
  desiredInflow: number,
  desiredOutflow: number,
): ResourceFlow {
  const stock = state.stocks[resource];
  const account = state.monthly.resources[resource];
  const start = availableAmount(state, resource);
  const inflow = Math.max(0, Math.min(desiredInflow, stock.capacity - start + desiredOutflow));
  const outflow = Math.max(0, Math.min(desiredOutflow, start + inflow));
  const rawEnd = start + inflow - outflow;
  const overflow = Math.max(0, rawEnd - stock.capacity);
  const end = Math.max(0, Math.min(stock.capacity, rawEnd));

  account.accruedInflow += inflow;
  account.accruedOutflow += outflow;
  account.accruedOverflow += overflow;
  account.projectedRemainingInflow = Math.max(0, account.projectedRemainingInflow - inflow);
  account.projectedRemainingOutflow = Math.max(0, account.projectedRemainingOutflow - outflow);
  stock.consumed += outflow;

  return {
    locationId: stock.locationId,
    start,
    inflow,
    outflow,
    overflow,
    end,
  };
}

function emptyFlow(state: M0State, resource: ResourceId): ResourceFlow {
  const amount = availableAmount(state, resource);
  return {
    locationId: state.stocks[resource].locationId,
    start: amount,
    inflow: 0,
    outflow: 0,
    overflow: 0,
    end: amount,
  };
}

function severity(waterDebt: number, foodDebt: number): 'normal' | 'unable' | 'critical' | 'death' {
  if (waterDebt >= 3 || foodDebt >= 10) return 'death';
  if (waterDebt >= 2 || foodDebt >= 7) return 'critical';
  if (waterDebt >= 1 || foodDebt >= 3) return 'unable';
  return 'normal';
}

function applyPopulationDebts(state: M0State, waterSatisfied: boolean, foodSatisfied: boolean): void {
  const population = state.population;
  population.waterDebt = waterSatisfied ? Math.max(0, population.waterDebt - 1) : population.waterDebt + 1;
  population.foodDebt = foodSatisfied ? Math.max(0, population.foodDebt - 1) : population.foodDebt + 1;

  const alive = livingPopulation(state);
  const level = severity(population.waterDebt, population.foodDebt);
  population.normal = level === 'normal' ? alive : 0;
  population.unableToWork = level === 'unable' ? alive : 0;
  population.critical = level === 'critical' ? alive : 0;

  if (level === 'death') {
    population.deceased += alive;
  }
}

function dailyDeltaFor(state: M0State, resource: ProtectedResource): number {
  const rate = dailyResourceRate(state, resource);
  return rate.inflow - rate.outflow;
}

function canResume(state: M0State, project: Project): boolean {
  if (!project.autoResume || project.staffing.returnTo === null) return false;
  if (project.pausedReason !== null
    && !['safety_line', 'hard_floor', 'staffing_shortage'].includes(project.pausedReason)) return false;

  const resourcesSafe = PROTECTED_RESOURCES.every((resource) => {
    const unit = dailyUse(state, resource);
    const guard = SYSTEM_GUARD_DAYS[resource];
    const available = availableAmount(state, resource);
    return available >= (guard.operating + 2) * unit
      && available + dailyDeltaFor(state, resource) * 2 >= guard.operating * unit;
  });
  if (!resourcesSafe) return false;

  const candidate = cloneState(state);
  const target = projectById(candidate, project.id);
  if (!target) return false;
  target.status = 'active';
  return requestedWorkers(candidate) <= workablePopulation(candidate);
}

function applySafetyAndRecovery(
  state: M0State,
  warnings: string[],
  events: ProjectEvent[],
): void {
  let atHardFloor = false;
  let atOperatingFloor = false;
  let operatingResourceDeclining = false;

  for (const resource of PROTECTED_RESOURCES) {
    const guard = SYSTEM_GUARD_DAYS[resource];
    const unit = dailyUse(state, resource);
    const available = availableAmount(state, resource);
    const delta = dailyDeltaFor(state, resource);
    const label = resource === 'water' ? '水' : resource === 'food' ? '食物' : '普通零件';

    if (available + delta * 3 < guard.operating * unit) {
      warnings.push(`${label}预计会低于系统运行保障量`);
    }
    atHardFloor ||= available <= guard.hard * unit;
    if (available <= guard.operating * unit) {
      atOperatingFloor = true;
      operatingResourceDeclining ||= delta < 0;
    }
  }

  if (atHardFloor) {
    for (const priority of PAUSE_PRIORITIES) {
      state.projects
        .filter((project) => project.priority === priority)
        .forEach((project) => pauseProject(project, 'hard_floor', events));
    }
    enforceStaffing(state, events);
    return;
  }

  if (atOperatingFloor) {
    state.projects
      .filter((project) => project.priority === 'P3')
      .forEach((project) => pauseProject(project, 'safety_line', events));

    if (operatingResourceDeclining) {
      state.projects
        .filter((project) => project.priority === 'P2')
        .forEach((project) => pauseProject(project, 'safety_line', events));
    }

    const hardFloorInTwoDays = PROTECTED_RESOURCES.some((resource) => {
      const unit = dailyUse(state, resource);
      const projected = availableAmount(state, resource) + dailyDeltaFor(state, resource) * 2;
      return projected <= SYSTEM_GUARD_DAYS[resource].hard * unit;
    });
    if (hardFloorInTwoDays) {
      state.projects
        .filter((project) => project.priority === 'P1')
        .forEach((project) => pauseProject(project, 'safety_line', events));
    }

    enforceStaffing(state, events);
    return;
  }

  const projectStillStabilizing = state.projects.some(
    (project) => project.status === 'active' && !project.directRecovery && project.safeActiveDays < 1,
  );
  if (projectStillStabilizing) return;

  for (const priority of RECOVERY_PRIORITIES) {
    const candidate = state.projects
      .filter((project) => project.priority === priority && project.status === 'paused' && canResume(state, project))
      .sort((left, right) => left.queueOrder - right.queueOrder)[0];

    if (candidate) {
      candidate.status = 'active';
      candidate.pausedReason = null;
      candidate.safeActiveDays = 0;
      events.push(recordProjectEvent(candidate));
      enforceStaffing(state, events);
      break;
    }
  }
}

function factualProjectMessage(event: ProjectEvent): string {
  if (event.status === 'active') return `${event.projectName}恢复运行。`;
  if (event.status === 'waiting_confirmation') return `${event.projectName}停止运行，等待确认。`;
  return `${event.projectName}已暂停。`;
}

function appendEvent(state: M0State, event: M0Event): void {
  if (state.events.some((existing) => existing.id === event.id)) return;
  state.events = [...state.events.slice(-99), event];
}

function appendProjectEvents(state: M0State, date: M0State['calendar'], events: ProjectEvent[]): void {
  for (const event of events) {
    appendEvent(state, {
      id: `${formatGameDate(date)}:project:${event.projectId}:${event.status}`,
      date: { ...date },
      kind: 'project_status',
      message: factualProjectMessage(event),
      relatedId: event.projectId,
    });
  }
}

function updateShortageEvent(
  state: M0State,
  date: M0State['calendar'],
  resource: 'water' | 'food',
  satisfied: boolean,
): void {
  const wasShort = state.resourceShortages[resource];
  const isShort = !satisfied;
  if (wasShort === isShort) return;
  state.resourceShortages[resource] = isShort;
  const label = resource === 'water' ? '供水' : '食物供应';
  appendEvent(state, {
    id: `${formatGameDate(date)}:${resource}:${isShort ? 'shortage' : 'restored'}`,
    date: { ...date },
    kind: isShort ? 'resource_shortage' : 'resource_restored',
    message: isShort ? `${label}未能满足当日人口需求。` : `${label}已满足当日人口需求。`,
    relatedId: resource,
  });
}

function settleMonthlyResources(state: M0State): void {
  for (const resource of RESOURCE_IDS) {
    const stock = state.stocks[resource];
    const account = state.monthly.resources[resource];
    stock.amount = Math.max(0, Math.min(
      stock.capacity,
      stock.amount + account.accruedInflow - account.accruedOutflow,
    ));
  }
  state.monthly = createEmptyMonthlyLedger(state.calendar, state.stocks);
}

function completeCapability(state: M0State, project: Project, date: M0State['calendar']): boolean {
  let resourcesChanged = false;
  if (technologies.some((technology) => technology.id === project.id)) {
    if (!state.research.completed.includes(project.id)) state.research.completed.push(project.id);
    state.research.manualQueue = state.research.manualQueue.filter((id) => id !== project.id);
  }
  if (project.id === 'prototype-precision-parts') {
    state.monthly.resources.precisionParts.accruedInflow += 4;
    resourcesChanged = true;
  }
  if (project.id === 'assemble-survey-drone') {
    state.drone = {
      id: 'multispectral-survey-drone-001',
      name: '多光谱勘测无人机组',
      locationId: 'hq',
      status: 'needs-charge',
      assignment: null,
      maintenance: 'inspection-needed',
      recharge: 'connection',
      rechargeApproved: false,
      connectionWorkDone: 0,
      inspectionWorkDone: 0,
      overnightStartedDay: null,
    };
  }
  appendEvent(state, { id: `${formatGameDate(date)}:capability:${project.id}:complete`, date: { ...date }, kind: 'project_complete', message: `${project.name}完成。`, relatedId: project.id });
  return resourcesChanged;
}

function useDroneForSurvey(state: M0State, targetId: SurveyTargetId, stage: Exclude<IntelStage, 'direction'>): void {
  const survey = surveyFor(state.map, targetId);
  if (!state.drone
    || state.drone.status !== 'available'
    || !survey.useDrone
    || survey.droneAppliedStages.includes(stage)) return;
  survey.droneAppliedStages.push(stage);
  survey.workDone += 6;
  state.drone.status = 'needs-charge';
  state.drone.assignment = null;
  state.drone.maintenance = 'inspection-needed';
  state.drone.recharge = 'connection';
  state.drone.rechargeApproved = true;
  state.drone.connectionWorkDone = 0;
  state.drone.inspectionWorkDone = 0;
  state.drone.overnightStartedDay = null;
}

function processDroneRecharge(state: M0State): void {
  const drone = state.drone;
  if (!drone?.rechargeApproved) return;
  if (drone.recharge === 'connection') {
    if (state.workforce.maintenance < 2) return;
    drone.connectionWorkDone = Math.min(2, drone.connectionWorkDone + 2);
    if (drone.connectionWorkDone === 2) {
      drone.recharge = 'overnight';
      drone.status = 'charging';
      drone.overnightStartedDay = state.elapsedDays;
    }
    return;
  }
  if (drone.recharge === 'overnight') {
    if (drone.overnightStartedDay === null || state.elapsedDays <= drone.overnightStartedDay) return;
    drone.recharge = 'inspection';
  }
  if (drone.recharge === 'inspection') {
    if (state.workforce.maintenance < 1) return;
    drone.inspectionWorkDone = Math.min(1, drone.inspectionWorkDone + 1);
    if (drone.inspectionWorkDone === 1) {
      drone.recharge = 'complete';
      drone.status = 'available';
      drone.maintenance = 'ready';
      drone.rechargeApproved = false;
      drone.overnightStartedDay = null;
    }
  }
}

function processSurveyProjects(state: M0State, date: M0State['calendar']): void {
  const records = state.map.surveys.slice().sort((left, right) => {
    const leftProject = projectById(state, left.projectId);
    const rightProject = projectById(state, right.projectId);
    return (leftProject?.queueOrder ?? Number.MAX_SAFE_INTEGER)
      - (rightProject?.queueOrder ?? Number.MAX_SAFE_INTEGER);
  });

  for (const survey of records) {
    const project = projectById(state, survey.projectId);
    const nextStage = nextIntelStage[survey.stage];
    if (!project || !nextStage || project.status !== 'active') continue;
    if (survey.stage === 'area' && survey.selectedRouteId === null) {
      survey.paused = true;
      survey.pauseReason = 'route-choice';
      project.status = 'waiting_confirmation';
      project.pausedReason = 'route_choice';
      project.staffing.actual = 0;
      continue;
    }
    if (survey.maximumDays !== null && survey.daysWorked >= survey.maximumDays) {
      survey.paused = true;
      survey.pauseReason = 'day-limit';
      project.status = 'waiting_confirmation';
      project.pausedReason = 'day_limit';
      project.staffing.actual = 0;
      continue;
    }
    if (project.staffing.actual < 2) continue;

    useDroneForSurvey(state, survey.targetId, nextStage);
    survey.workDone = Math.min(surveyWorkRequired[nextStage], survey.workDone + project.staffing.actual);
    project.workDone = survey.workDone;
    survey.daysWorked += 1;
    if (survey.workDone < surveyWorkRequired[nextStage]) continue;

    survey.stage = nextStage;
    survey.workDone = 0;
    refreshMapIntel(state.map);
    if (nextStage === 'site') {
      project.status = 'complete';
      project.staffing.actual = 0;
      project.workDone = project.workRequired;
      appendEvent(state, {
        id: `${formatGameDate(date)}:survey:${survey.targetId}:site`,
        date: { ...date },
        kind: 'project_complete',
        message: `${survey.targetId === 'ruin-a' ? '工业废墟 A' : '工业废墟 B'}完成现场确认。`,
        relatedId: survey.projectId,
      });
      continue;
    }

    const followingStage = nextIntelStage[nextStage];
    if (followingStage) project.workRequired = surveyWorkRequired[followingStage];
    project.workDone = 0;
    if (nextStage === 'area') {
      survey.paused = true;
      survey.pauseReason = 'route-choice';
      project.status = 'waiting_confirmation';
      project.pausedReason = 'route_choice';
      project.staffing.actual = 0;
    }
  }
}

export function advanceOneDay(input: M0State): M0State {
  const state = cloneState(input);
  const processedDate = { ...state.calendar };
  const projectEvents: ProjectEvent[] = [];
  synchronizeResearch(state);
  enforceStaffing(state, projectEvents);

  const flows = Object.fromEntries(
    RESOURCE_IDS.map((resource) => [resource, emptyFlow(state, resource)]),
  ) as Record<ResourceId, ResourceFlow>;
  const aliveAtStart = livingPopulation(state);
  const oldRepairablePartsStart = state.oldRepairableParts;
  const headquartersSalvageStart = state.headquartersSalvage.dismantledItems;
  const waterworksWorkStart = state.waterworks.workDone;
  const maintenanceBacklogStart = state.maintenanceBacklog;

  flows.water = applyContinuousFlow(state, 'water', waterInflow(state), aliveAtStart);
  flows.food = applyContinuousFlow(state, 'food', foodInflow(state), aliveAtStart);

  const maintenance = calculateMaintenanceFlow(state);
  if (maintenance.usedHeadquartersSalvage) {
    state.headquartersSalvage.dismantledItems += 1;
  } else {
    state.oldRepairableParts -= maintenance.repaired;
  }
  flows.commonParts = applyContinuousFlow(state, 'commonParts', maintenance.repaired, maintenance.used);
  state.maintenanceBacklog = Math.max(0, state.maintenanceBacklog + maintenance.actualBacklogDelta);
  processDroneRecharge(state);

  const waterworks = projectById(state, 'hq-waterworks-restoration');
  if (waterworks && waterworks.status !== 'complete') {
    const work = state.workforce.water >= 6 ? 6 : state.workforce.water >= 4 ? 3 : 0;
    waterworks.workDone = Math.min(waterworks.workRequired, waterworks.workDone + work);
    state.waterworks.workDone = waterworks.workDone;

    if (waterworks.workDone === waterworks.workRequired) {
      waterworks.status = 'complete';
      waterworks.staffing.actual = 0;
      state.waterworks.repaired = true;
      appendEvent(state, {
        id: `${formatGameDate(processedDate)}:project:${waterworks.id}:complete`,
        date: { ...processedDate },
        kind: 'project_complete',
        message: `${waterworks.name}完成。`,
        relatedId: waterworks.id,
      });
    }
  }

  processSurveyProjects(state, processedDate);

  let discreteResourcesChanged = false;
  const capabilityProjects = state.projects.filter((project) => !isSurveyProject(project));
  for (const project of capabilityProjects) {
    if (project.id === 'hq-waterworks-restoration' || project.status !== 'active' || project.workRequired === 0) continue;
    const work = project.staffing.actual;
    if (work < minimumProjectStaff(project)) continue;
    project.workDone = Math.min(project.workRequired, project.workDone + work);
    if (project.workDone !== project.workRequired) continue;
    project.status = 'complete';
    project.staffing.actual = 0;
    discreteResourcesChanged = completeCapability(state, project, processedDate) || discreteResourcesChanged;
  }
  synchronizeResearch(state);

  const waterSatisfied = flows.water.outflow === aliveAtStart;
  const foodSatisfied = flows.food.outflow === aliveAtStart;
  updateShortageEvent(state, processedDate, 'water', waterSatisfied);
  updateShortageEvent(state, processedDate, 'food', foodSatisfied);
  applyPopulationDebts(state, waterSatisfied, foodSatisfied);
  enforceStaffing(state, projectEvents);

  for (const project of state.projects) {
    if (project.status === 'active' && !project.directRecovery) {
      project.safeActiveDays += 1;
    }
  }

  const warnings: string[] = [];
  applySafetyAndRecovery(state, warnings, projectEvents);
  appendProjectEvents(state, processedDate, projectEvents);
  state.warnings = warnings;

  const resourceInputsChanged = RESOURCE_IDS.some((resource) => {
    const rate = dailyResourceRate(state, resource);
    const account = state.monthly.resources[resource];
    return rate.inflow !== account.currentDailyInflow || rate.outflow !== account.currentDailyOutflow;
  });

  state.elapsedDays += 1;
  state.calendar = nextGameDate(processedDate);
  const monthSettled = state.calendar.day === 1;
  if (monthSettled) {
    settleMonthlyResources(state);
    refreshMonthlyProjection(state);
  } else if (resourceInputsChanged || discreteResourcesChanged) {
    refreshMonthlyProjection(state);
  } else {
    state.monthly.processedDays = state.calendar.day - 1;
    for (const resource of ['water', 'food'] as const) {
      const exhaustionDate = state.monthly.resources[resource].exhaustionDate;
      if (exhaustionDate
        && exhaustionDate.year === processedDate.year
        && exhaustionDate.month === processedDate.month
        && exhaustionDate.day === processedDate.day) {
        state.monthly.resources[resource].exhaustionDate = null;
      }
    }
  }

  state.ledger = [
    ...state.ledger.slice(-29),
    {
      elapsedDay: state.elapsedDays,
      date: processedDate,
      resources: flows,
      monthSettled,
      maintenanceBacklogStart,
      maintenanceBacklogEnd: state.maintenanceBacklog,
      waterworksWorkStart,
      waterworksWorkEnd: state.waterworks.workDone,
      oldRepairablePartsStart,
      oldRepairablePartsEnd: state.oldRepairableParts,
      headquartersSalvageStart,
      headquartersSalvageEnd: state.headquartersSalvage.dismantledItems,
      logisticsProjectCapacity: state.workforce.logistics >= 5 ? 6 : state.workforce.logistics >= 3 ? 2 : 0,
      warnings,
      projectEvents,
    },
  ];

  return state;
}

export function advanceRealTime(state: M0State, elapsedMs: number): M0State {
  if (!state.clock.running || elapsedMs <= 0) return state;
  let next = cloneState(state);
  next.clock.elapsedMs += elapsedMs * next.clock.speed;

  while (next.clock.elapsedMs >= next.clock.millisecondsPerDay) {
    next.clock.elapsedMs -= next.clock.millisecondsPerDay;
    next = advanceOneDay(next);
  }

  return next;
}

export function setRunning(state: M0State, running: boolean): M0State {
  return { ...state, clock: { ...state.clock, running } };
}

export function setGameSpeed(state: M0State, speed: GameSpeed): M0State {
  return { ...state, clock: { ...state.clock, speed } };
}

export function setDailyMode(state: M0State, line: keyof DailyModes, mode: WorkMode): M0State {
  return setDailyLinePositions(state, line, MODE_STAFF[line][mode]);
}

export function setDailyLinePositions(state: M0State, line: keyof DailyModes, positions: number): M0State {
  const candidate = cloneState(state);
  const requestedPositions = Number.isFinite(positions)
    ? Math.floor(positions)
    : candidate.dailyPositions[line];
  candidate.dailyPositions[line] = Math.max(0, Math.min(
    MODE_STAFF[line].accelerated,
    requestedPositions,
  ));
  candidate.feedback = null;
  enforceStaffing(candidate, []);
  refreshMonthlyProjection(candidate);
  return candidate;
}

export function setHeadquartersSalvageApproval(state: M0State, approved: boolean): M0State {
  const next = cloneState(state);
  next.headquartersSalvage.approved = approved;
  next.feedback = approved ? '已允许普通零件不足时启动低效拆解。' : '已取消低效拆解预授权。';
  refreshMonthlyProjection(next);
  return next;
}

export function setProjectAutoResume(state: M0State, projectId: string, autoResume: boolean): M0State {
  const next = cloneState(state);
  const project = projectById(next, projectId);
  if (project) project.autoResume = autoResume;
  return next;
}

export function approveProject(
  state: M0State,
  project: Project,
  cost: Partial<Record<ResourceId, number>>,
): M0State {
  const next = cloneState(state);
  if (next.projects.some((existing) => existing.id === project.id)) {
    next.feedback = `项目 ${project.name} 已存在。`;
    return next;
  }

  for (const resource of RESOURCE_IDS) {
    const amount = cost[resource] ?? 0;
    if (!Number.isFinite(amount) || amount < 0 || availableAmount(next, resource) < amount) {
      next.feedback = `${resource} 的实际库存不足，项目未获批准。`;
      return next;
    }
  }

  for (const resource of RESOURCE_IDS) {
    const amount = cost[resource] ?? 0;
    if (amount === 0) continue;
    next.monthly.resources[resource].accruedOutflow += amount;
    next.stocks[resource].consumed += amount;
  }

  next.projects.push({
    ...project,
    staffing: { ...project.staffing },
    investedResources: { ...cost },
  });
  next.feedback = `${project.name}已批准，建设投入已从实际库存扣除。`;
  enforceStaffing(next, []);
  refreshMonthlyProjection(next);
  return next;
}

export function setResearchTarget(state: M0State, technologyId: string): M0State {
  const next = cloneState(state);
  const technology = technologies.find((item) => item.id === technologyId);
  if (!technology || next.research.completed.includes(technologyId)) return next;
  next.research.mode = 'manual';
  next.research.manualQueue = queueTarget(next.research, technologyId);
  synchronizeResearch(next);
  enforceStaffing(next, []);
  next.feedback = `${technology.name}已加入指定科研队列；必要前置会自动接续。`;
  return next;
}

export function setResearchMode(state: M0State, mode: ResearchMode): M0State {
  const next = cloneState(state);
  next.research.mode = mode;
  synchronizeResearch(next);
  enforceStaffing(next, []);
  return next;
}

export function setResearchFacilityEnabled(state: M0State, facilityId: string, enabled: boolean): M0State {
  const next = cloneState(state);
  const facility = next.research.facilities.find((candidate) => candidate.id === facilityId);
  if (!facility) return state;
  facility.enabled = enabled;
  synchronizeResearch(next);
  enforceStaffing(next, []);
  next.feedback = `${facility.name}已${enabled ? '启用' : '停用'}。`;
  return next;
}

export function setResearchFacilityOpenPositions(state: M0State, facilityId: string, openPositions: number): M0State {
  const next = cloneState(state);
  const facility = next.research.facilities.find((candidate) => candidate.id === facilityId);
  if (!facility) return state;
  facility.openPositions = Math.max(0, Math.min(facility.capacity, Math.floor(openPositions)));
  synchronizeResearch(next);
  enforceStaffing(next, []);
  next.feedback = `${facility.name}开放 ${facility.openPositions} 个岗位。`;
  return next;
}

export function setResearchDomainOrder(state: M0State, order: ResearchDomain[]): M0State {
  const expected = ['manufacturing', 'surveying', 'engineering'];
  if (order.length !== expected.length
    || new Set(order).size !== expected.length
    || order.some((domain) => !expected.includes(domain))) return state;
  const next = cloneState(state);
  next.research.domainOrder = [...order];
  next.research.roundTarget = null;
  synchronizeResearch(next);
  enforceStaffing(next, []);
  return next;
}

export function setResearchDomainAutomatic(state: M0State, domain: ResearchDomain, enabled: boolean): M0State {
  const next = cloneState(state);
  next.research.automaticDomains = enabled
    ? [...new Set([...next.research.automaticDomains, domain])]
    : next.research.automaticDomains.filter((candidate) => candidate !== domain);
  next.research.roundTarget = null;
  synchronizeResearch(next);
  enforceStaffing(next, []);
  return next;
}

export function approveCapabilityProject(state: M0State, id: string): M0State {
  const next = cloneState(state);
  const missing = (capabilityPrerequisites[id] ?? []).find((required) => (
    !next.research.completed.includes(required)
      && next.projects.find((project) => project.id === required)?.status !== 'complete'
  ));
  if (missing) return { ...state, feedback: '该工作仍缺少已确认的前置条件。' };
  if (id === 'assemble-survey-drone' && next.drone !== null) return { ...state, feedback: '首套无人机资产已经存在。' };
  if (isPrecisionWorkshopProjectId(id) && next.projects.some((project) => (
    isPrecisionWorkshopProjectId(project.id) && project.status !== 'complete'
  ))) return { ...state, feedback: '精密工坊当前已有一项任务。' };
  const project = projectForCapability(id, 'P1', enabledResearchCapacity(next.research));
  const approved = project ? approveProject(next, project, project.investedResources) : next;
  synchronizeResearch(approved);
  enforceStaffing(approved, []);
  return approved;
}

export function configureSurvey(
  state: M0State,
  targetId: SurveyTargetId,
  settings: {
    workers?: 2 | 4 | 6;
    maximumDays?: number | null;
    useDrone?: boolean;
  },
): M0State {
  const next = cloneState(state);
  const survey = surveyFor(next.map, targetId);
  if (settings.workers !== undefined) survey.workers = settings.workers;
  if (settings.maximumDays !== undefined
    && (settings.maximumDays === null || (Number.isInteger(settings.maximumDays) && settings.maximumDays > 0))) {
    survey.maximumDays = settings.maximumDays;
  }
  if (settings.useDrone !== undefined) survey.useDrone = settings.useDrone;
  const project = projectById(next, survey.projectId);
  if (project) {
    project.staffing.planned = survey.workers;
    if (survey.pauseReason === 'day-limit'
      && (survey.maximumDays === null || survey.daysWorked < survey.maximumDays)) {
      survey.paused = false;
      survey.pauseReason = null;
      project.status = 'active';
      project.pausedReason = null;
    }
  }
  enforceStaffing(next, []);
  return next;
}

export function approveSurvey(
  state: M0State,
  targetId: SurveyTargetId,
  workers: 2 | 4 | 6 = 2,
  maximumDays: number | null = null,
  useDrone = true,
): M0State {
  let next = configureSurvey(state, targetId, { workers, maximumDays, useDrone });
  const survey = surveyFor(next.map, targetId);
  if (survey.stage === 'site') return { ...state, feedback: '该地点已完成现场确认。' };
  if (survey.approved) return { ...state, feedback: '该地点的勘测计划已经获批；阶段会自动接续。' };
  const queueOrder = Math.max(199, ...next.projects
    .filter((candidate) => isSurveyProject(candidate))
    .map((candidate) => candidate.queueOrder)) + 1;
  const project: Project = { id: survey.projectId, name: `${targetId === 'ruin-a' ? '工业废墟 A' : '工业废墟 B'}勘测`, priority: 'P2', queueOrder,
    status: 'active', production: false, testOnly: false, directRecovery: false, autoResume: true, pausedReason: null, safeActiveDays: 0,
    staffing: { planned: workers, actual: 0, source: 'development', returnTo: 'development' }, workDone: survey.workDone,
    workRequired: surveyWorkRequired.area, investedResources: {} };
  next = approveProject(next, project, {});
  const approvedSurvey = surveyFor(next.map, targetId);
  approvedSurvey.approved = true;
  approvedSurvey.paused = false;
  approvedSurvey.pauseReason = null;
  next.feedback = `${targetId === 'ruin-a' ? '工业废墟 A' : '工业废墟 B'}勘测计划已批准；情报阶段会按条件自动接续。`;
  return next;
}

export function selectSurveyRoute(state: M0State, targetId: SurveyTargetId, routeId: string): M0State {
  const next = cloneState(state);
  const survey = surveyFor(next.map, targetId);
  const route = next.map.routes.find((candidate) => candidate.id === routeId && candidate.targetId === targetId);
  const project = projectById(next, survey.projectId);
  if (!route || !project || survey.stage !== 'area') return { ...state, feedback: '当前没有可确认的候选路线。' };
  survey.selectedRouteId = route.id;
  survey.paused = false;
  survey.pauseReason = null;
  project.status = 'active';
  project.pausedReason = null;
  enforceStaffing(next, []);
  return next;
}

export function setSurveyPaused(state: M0State, targetId: SurveyTargetId, paused: boolean): M0State {
  const next = cloneState(state);
  const survey = surveyFor(next.map, targetId);
  const project = projectById(next, survey.projectId);
  if (!project || project.status === 'complete') return state;
  if (!paused && survey.pauseReason === 'route-choice' && survey.selectedRouteId === null) return state;
  if (!paused && survey.pauseReason === 'day-limit'
    && survey.maximumDays !== null && survey.daysWorked >= survey.maximumDays) return state;
  survey.paused = paused;
  survey.pauseReason = paused ? 'player' : null;
  project.status = paused ? 'paused' : 'active';
  project.pausedReason = paused ? 'player_pause' : null;
  enforceStaffing(next, []);
  return next;
}

export function completeDroneRecharge(state: M0State): M0State {
  const next = cloneState(state);
  if (next.drone?.status === 'needs-charge' && next.drone.recharge === 'connection') {
    next.drone.rechargeApproved = true;
    next.feedback = '已安排无人机接入、过夜补能和次日检查。';
  }
  return next;
}

export function selectMapCell(state: M0State, cellId: string): M0State {
  if (!state.map.cells.some((cell) => cell.id === cellId)) return state;
  return { ...state, map: { ...state.map, selectedCellId: cellId } };
}

export function injectTestProject(state: M0State, project: Project): M0State {
  const next = cloneState(state);
  next.projects.push({
    ...project,
    staffing: { ...project.staffing },
    investedResources: { ...project.investedResources },
  });
  enforceStaffing(next, []);
  refreshMonthlyProjection(next);
  return next;
}
