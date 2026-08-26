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

function enforceStaffing(state: M0State, events: ProjectEvent[]): void {
  let required = requestedWorkers(state);
  const workable = workablePopulation(state);

  if (required > workable) {
    for (const priority of PAUSE_PRIORITIES) {
      const candidates = state.projects
        .filter((project) => project.priority === priority && project.status === 'active' && !project.directRecovery)
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
  const usedHeadquartersSalvage = shouldUseHeadquartersSalvage(state);
  const plan = usedHeadquartersSalvage
    ? { repair: 4, consume: 3, backlogDelta: 0 }
    : maintenancePlan(state);
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
      .filter((project) => project.priority === priority && project.status === 'paused')
      .sort((left, right) => left.queueOrder - right.queueOrder)[0];

    if (candidate && canResume(state, candidate)) {
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

export function advanceOneDay(input: M0State): M0State {
  const state = cloneState(input);
  const processedDate = { ...state.calendar };
  const projectEvents: ProjectEvent[] = [];
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
  } else if (resourceInputsChanged) {
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
  const candidate = cloneState(state);
  candidate.dailyModes[line] = mode;
  candidate.feedback = null;
  const required = requestedWorkers(candidate);
  const workable = workablePopulation(candidate);

  if (required > workable) {
    const modeName = mode === 'accelerated' ? '加速' : mode === 'standard' ? '标准' : '最低';
    return {
      ...state,
      feedback: `无法改为${modeName}：需要 ${required} 人，当前可工作人口只有 ${workable} 人。`,
    };
  }

  applyWorkforcePlan(candidate);
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
