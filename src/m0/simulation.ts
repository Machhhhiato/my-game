import {
  applyWorkforcePlan,
  livingPopulation,
  requestedWorkers,
  workablePopulation,
} from './state';
import {
  RESOURCE_IDS,
  type M0State,
  type Priority,
  type Project,
  type ProjectEvent,
  type ResourceFlow,
  type ResourceId,
  type Stock,
} from './types';

type ProtectedResource = 'water' | 'food' | 'commonParts';

const RECOVERY_PRIORITIES: Priority[] = ['P1', 'P2', 'P3'];
const PAUSE_PRIORITIES: Priority[] = ['P3', 'P2', 'P1'];
const PROTECTED_RESOURCES: ProtectedResource[] = ['water', 'food', 'commonParts'];

interface MaintenancePlan {
  repair: number;
  consume: number;
  backlogDelta: number;
}

interface MaintenanceFlow extends MaintenancePlan {
  repaired: number;
  used: number;
  actualBacklogDelta: number;
  usedHeadquartersSalvage: boolean;
}

function cloneState(state: M0State): M0State {
  return JSON.parse(JSON.stringify(state)) as M0State;
}

function resourceFlow(stock: Stock): ResourceFlow {
  return {
    locationId: stock.locationId,
    start: stock.amount,
    inflow: 0,
    outflow: 0,
    overflow: 0,
    end: stock.amount,
  };
}

export function freeAmount(stock: Stock): number {
  return Math.max(0, stock.amount - stock.locked - stock.reserved);
}

function cappedInflow(stock: Stock, desiredInflow: number, plannedOutflow: number): number {
  return Math.max(0, Math.min(desiredInflow, stock.capacity - stock.amount + plannedOutflow));
}

function addFlow(stock: Stock, flow: ResourceFlow, inflow: number, outflow: number): void {
  flow.inflow += inflow;
  flow.outflow += outflow;
  stock.consumed += outflow;
  const raw = stock.amount + inflow - outflow;
  flow.overflow += Math.max(0, raw - stock.capacity);
  stock.amount = Math.max(0, Math.min(stock.capacity, raw));
  flow.end = stock.amount;
}

function waterInflow(state: M0State): number {
  const workers = state.workforce.water;
  if (workers < 2) return 0;
  if (state.waterworks.repaired) return workers >= 6 ? 44 : workers >= 4 ? 36 : 28;
  return workers >= 6 ? 32 : workers >= 4 ? 28 : 24;
}

function foodInflow(state: M0State): number {
  if (state.workforce.food < 3 || state.workforce.logistics < 2) return 0;
  return state.workforce.food >= 7 ? 42 : state.workforce.food >= 5 ? 30 : 20;
}

function maintenancePlan(state: M0State): MaintenancePlan {
  if (state.workforce.maintenance < 2) {
    return { repair: 0, consume: 0, backlogDelta: 6 };
  }
  if (state.workforce.maintenance >= 5) {
    return state.maintenanceBacklog > 0
      ? { repair: 6, consume: 5, backlogDelta: -4 }
      : { repair: 6, consume: 3, backlogDelta: 0 };
  }
  if (state.workforce.maintenance >= 3) {
    return { repair: 3, consume: 3, backlogDelta: 0 };
  }
  return { repair: 1, consume: 2, backlogDelta: 2 };
}

function shouldUseHeadquartersSalvage(state: M0State): boolean {
  if (!state.headquartersSalvage.approved
    || state.oldRepairableParts > 0
    || state.workforce.maintenance < 5) return false;

  const freeParts = freeAmount(state.stocks.commonParts);
  const projectedAfterRoutineMaintenance = freeParts - Math.min(3, freeParts);
  const safetyAmount = state.safetyLines.commonParts.safetyDays * 3;
  return projectedAfterRoutineMaintenance < safetyAmount;
}

function calculateMaintenanceFlow(state: M0State): MaintenanceFlow {
  const usedHeadquartersSalvage = shouldUseHeadquartersSalvage(state);
  const plan = usedHeadquartersSalvage
    ? { repair: 4, consume: 3, backlogDelta: 0 }
    : maintenancePlan(state);
  const stock = state.stocks.commonParts;
  const repairCapacity = Math.max(0, stock.capacity - stock.amount + plan.consume);
  const repairSource = usedHeadquartersSalvage ? plan.repair : state.oldRepairableParts;
  const repaired = Math.min(plan.repair, repairSource, repairCapacity);
  const used = Math.min(plan.consume, freeAmount(stock) + repaired);
  const missingParts = plan.consume - used;

  return {
    ...plan,
    repaired,
    used,
    actualBacklogDelta: plan.backlogDelta + missingParts * 2,
    usedHeadquartersSalvage,
  };
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

function useLockedCost(
  state: M0State,
  project: Project,
  flows: Record<ResourceId, ResourceFlow>,
): void {
  for (const resource of RESOURCE_IDS) {
    const cost = project.lockedCost[resource] ?? 0;
    if (cost === 0) continue;
    const stock = state.stocks[resource];
    stock.amount -= cost;
    stock.locked -= cost;
    stock.consumed += cost;
    flows[resource].outflow += cost;
    flows[resource].end = stock.amount;
  }
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

function dailyUse(resource: ProtectedResource, state: M0State): number {
  return resource === 'commonParts' ? 3 : Math.max(1, livingPopulation(state));
}

export function coverageDays(state: M0State, resource: ProtectedResource): number {
  return freeAmount(state.stocks[resource]) / dailyUse(resource, state);
}

function dailyDeltaFor(state: M0State, resource: ProtectedResource): number {
  if (resource === 'water') return waterInflow(state) - livingPopulation(state);
  if (resource === 'food') return foodInflow(state) - livingPopulation(state);
  const flow = calculateMaintenanceFlow(state);
  return flow.repaired - flow.used;
}

function canResume(state: M0State, project: Project): boolean {
  if (!project.autoResume || project.staffing.returnTo === null) return false;

  const resourcesSafe = PROTECTED_RESOURCES.every((resource) => {
    const unit = dailyUse(resource, state);
    const line = state.safetyLines[resource];
    const available = freeAmount(state.stocks[resource]);
    return available >= (line.safetyDays + 2) * unit
      && available + dailyDeltaFor(state, resource) * 2 >= line.safetyDays * unit;
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
  let atSafetyLine = false;
  let safetyResourceDeclining = false;

  for (const resource of PROTECTED_RESOURCES) {
    const line = state.safetyLines[resource];
    const unit = dailyUse(resource, state);
    const available = freeAmount(state.stocks[resource]);
    const delta = dailyDeltaFor(state, resource);
    const label = resource === 'water' ? '水' : resource === 'food' ? '食物' : '普通零件';

    if (available + delta * 3 < line.safetyDays * unit) {
      warnings.push(`${label}预测会低于安全线`);
    }
    atHardFloor ||= available <= line.hardDays * unit;
    if (available <= line.safetyDays * unit) {
      atSafetyLine = true;
      safetyResourceDeclining ||= delta < 0;
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

  if (atSafetyLine) {
    state.projects
      .filter((project) => project.priority === 'P3')
      .forEach((project) => pauseProject(project, 'safety_line', events));

    if (safetyResourceDeclining) {
      state.projects
        .filter((project) => project.priority === 'P2')
        .forEach((project) => pauseProject(project, 'safety_line', events));
    }

    const hardFloorInTwoDays = PROTECTED_RESOURCES.some((resource) => {
      const unit = dailyUse(resource, state);
      const projected = freeAmount(state.stocks[resource]) + dailyDeltaFor(state, resource) * 2;
      return projected <= state.safetyLines[resource].hardDays * unit;
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

export function advanceOneDay(input: M0State): M0State {
  const state = cloneState(input);
  const projectEvents: ProjectEvent[] = [];
  enforceStaffing(state, projectEvents);

  const flows = Object.fromEntries(
    RESOURCE_IDS.map((resource) => [resource, resourceFlow(state.stocks[resource])]),
  ) as Record<ResourceId, ResourceFlow>;
  const aliveAtStart = livingPopulation(state);
  const oldRepairablePartsStart = state.oldRepairableParts;
  const headquartersSalvageStart = state.headquartersSalvage.dismantledItems;
  const waterworksWorkStart = state.waterworks.workDone;
  const maintenanceBacklogStart = state.maintenanceBacklog;

  const desiredWaterInflow = waterInflow(state);
  const waterUsed = Math.min(aliveAtStart, state.stocks.water.amount + desiredWaterInflow);
  const actualWaterInflow = cappedInflow(state.stocks.water, desiredWaterInflow, waterUsed);
  addFlow(state.stocks.water, flows.water, actualWaterInflow, waterUsed);

  const desiredFoodInflow = foodInflow(state);
  const foodUsed = Math.min(aliveAtStart, state.stocks.food.amount + desiredFoodInflow);
  const actualFoodInflow = cappedInflow(state.stocks.food, desiredFoodInflow, foodUsed);
  addFlow(state.stocks.food, flows.food, actualFoodInflow, foodUsed);

  const maintenance = calculateMaintenanceFlow(state);
  if (maintenance.usedHeadquartersSalvage) {
    state.headquartersSalvage.dismantledItems += 1;
  } else {
    state.oldRepairableParts -= maintenance.repaired;
  }
  addFlow(state.stocks.commonParts, flows.commonParts, maintenance.repaired, maintenance.used);
  state.maintenanceBacklog = Math.max(0, state.maintenanceBacklog + maintenance.actualBacklogDelta);

  const waterworks = projectById(state, 'hq-waterworks-restoration');
  if (waterworks && waterworks.status !== 'complete') {
    const work = state.workforce.water >= 6 ? 6 : state.workforce.water >= 4 ? 3 : 0;
    waterworks.workDone = Math.min(waterworks.workRequired, waterworks.workDone + work);
    state.waterworks.workDone = waterworks.workDone;

    if (waterworks.workDone === waterworks.workRequired) {
      useLockedCost(state, waterworks, flows);
      waterworks.status = 'complete';
      waterworks.staffing.actual = 0;
      state.waterworks.repaired = true;
    }
  }

  applyPopulationDebts(state, waterUsed === aliveAtStart, foodUsed === aliveAtStart);
  enforceStaffing(state, projectEvents);

  for (const project of state.projects) {
    if (project.status === 'active' && !project.directRecovery) {
      project.safeActiveDays += 1;
    }
  }

  const warnings: string[] = [];
  applySafetyAndRecovery(state, warnings, projectEvents);
  state.warnings = warnings;
  state.day += 1;
  state.ledger = [
    ...state.ledger.slice(-29),
    {
      day: state.day,
      resources: flows,
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
  next.clock.elapsedMs += elapsedMs;

  while (next.clock.elapsedMs >= next.clock.millisecondsPerDay) {
    next.clock.elapsedMs -= next.clock.millisecondsPerDay;
    next = advanceOneDay(next);
  }

  return next;
}

export function setRunning(state: M0State, running: boolean): M0State {
  return { ...state, clock: { ...state.clock, running } };
}

export function setProjectAutoResume(state: M0State, projectId: string, autoResume: boolean): M0State {
  const next = cloneState(state);
  const project = projectById(next, projectId);
  if (project) project.autoResume = autoResume;
  return next;
}

export function injectTestProject(state: M0State, project: Project): M0State {
  const next = cloneState(state);
  next.projects.push({
    ...project,
    staffing: { ...project.staffing },
    lockedCost: { ...project.lockedCost },
  });
  enforceStaffing(next, []);
  return next;
}
