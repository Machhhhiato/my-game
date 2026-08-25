import {
  M0_STATE_VERSION,
  type DailyModes,
  type M0State,
  type Priority,
  type Project,
  type SafetyLines,
  type Stocks,
  type Workforce,
  type WorkMode,
} from './types';

export const M0_SAVE_KEY = 'always-game-m0-v1';
export const M0_DAY_MS = 20_000;

export const MAINLINE_LOCKS = {
  commonParts: 20,
  engineeringComponents: 72,
  alloy: 32,
} as const;

export const MODE_STAFF = {
  water: { minimum: 2, standard: 4, accelerated: 6 },
  food: { minimum: 3, standard: 5, accelerated: 7 },
  maintenance: { minimum: 2, standard: 3, accelerated: 5 },
  logistics: { minimum: 2, standard: 3, accelerated: 5 },
} as const;

const PROJECT_PRIORITY_ORDER: Priority[] = ['P0', 'P1', 'P2', 'P3'];

export function livingPopulation(state: Pick<M0State, 'population'>): number {
  const { normal, unableToWork, critical } = state.population;
  return normal + unableToWork + critical;
}

export function workablePopulation(state: Pick<M0State, 'population'>): number {
  return state.population.normal;
}

export function minimumBasicDuty(state: Pick<M0State, 'population'>): number {
  return Math.ceil(livingPopulation(state) / 4);
}

export function projectDevelopmentDemand(projects: Project[]): number {
  return projects
    .filter((project) => project.status === 'active' && project.staffing.source === 'development')
    .reduce((sum, project) => sum + project.staffing.planned, 0);
}

export function projectStandbyDemand(projects: Project[]): number {
  return projects
    .filter((project) => (
      (project.status === 'paused' || project.status === 'waiting_confirmation')
      && (project.staffing.returnTo === 'standby' || project.staffing.returnTo === null)
    ))
    .reduce((sum, project) => sum + project.staffing.planned, 0);
}

export function requestedWorkers(state: Pick<M0State, 'population' | 'dailyModes' | 'projects'>): number {
  return minimumBasicDuty(state)
    + MODE_STAFF.water[state.dailyModes.water]
    + MODE_STAFF.food[state.dailyModes.food]
    + MODE_STAFF.maintenance[state.dailyModes.maintenance]
    + MODE_STAFF.logistics[state.dailyModes.logistics]
    + projectDevelopmentDemand(state.projects)
    + projectStandbyDemand(state.projects);
}

interface WorkforcePlan {
  workforce: Workforce;
  projectWorkers: Map<string, number>;
}

function calculateWorkforce(state: Pick<M0State, 'population' | 'dailyModes' | 'projects'>): WorkforcePlan {
  const workable = workablePopulation(state);
  let remaining = workable;
  const projectWorkers = new Map<string, number>();

  const take = (wanted: number): number => {
    const actual = Math.max(0, Math.min(wanted, remaining));
    remaining -= actual;
    return actual;
  };

  const basicDuty = take(minimumBasicDuty(state));
  const water = take(MODE_STAFF.water[state.dailyModes.water]);
  const food = take(MODE_STAFF.food[state.dailyModes.food]);
  const maintenance = take(MODE_STAFF.maintenance[state.dailyModes.maintenance]);
  const logistics = take(MODE_STAFF.logistics[state.dailyModes.logistics]);

  const activeDevelopmentProjects = state.projects
    .filter((project) => project.status === 'active' && project.staffing.source === 'development')
    .sort((left, right) => {
      const priorityDifference = PROJECT_PRIORITY_ORDER.indexOf(left.priority) - PROJECT_PRIORITY_ORDER.indexOf(right.priority);
      return priorityDifference !== 0 ? priorityDifference : left.queueOrder - right.queueOrder;
    });

  for (const project of activeDevelopmentProjects) {
    projectWorkers.set(project.id, take(project.staffing.planned));
  }

  const standby = take(projectStandbyDemand(state.projects));

  return {
    workforce: { basicDuty, water, food, maintenance, logistics, development: remaining, standby, workable },
    projectWorkers,
  };
}

export function applyWorkforcePlan(state: M0State): void {
  const plan = calculateWorkforce(state);
  state.workforce = plan.workforce;

  for (const project of state.projects) {
    if (project.staffing.source === 'daily_water') {
      project.staffing.planned = MODE_STAFF.water[state.dailyModes.water];
      project.staffing.actual = project.status === 'active' ? plan.workforce.water : 0;
    } else {
      project.staffing.actual = plan.projectWorkers.get(project.id) ?? 0;
    }
  }
}

function initialStocks(): Stocks {
  const stock = (amount: number, capacity: number, locked = 0) => ({
    locationId: 'hq' as const,
    amount,
    capacity,
    locked,
    reserved: 0,
    consumed: 0,
  });

  return {
    water: stock(280, 420),
    food: stock(560, 840),
    commonParts: stock(45, 90, MAINLINE_LOCKS.commonParts),
    engineeringComponents: stock(80, 120, MAINLINE_LOCKS.engineeringComponents),
    alloy: stock(40, 60, MAINLINE_LOCKS.alloy),
    precisionParts: stock(0, 24),
  };
}

function initialProjects(): Project[] {
  return [{
    id: 'hq-waterworks-restoration',
    name: '总部水务恢复',
    priority: 'P1',
    queueOrder: 1,
    status: 'active',
    production: true,
    testOnly: false,
    directRecovery: true,
    autoResume: true,
    pausedReason: null,
    safeActiveDays: 0,
    staffing: {
      planned: 4,
      actual: 0,
      source: 'daily_water',
      returnTo: 'water',
    },
    workDone: 0,
    workRequired: 24,
    lockedCost: {
      commonParts: 4,
      engineeringComponents: 12,
    },
  }];
}

export function createInitialM0State(): M0State {
  const dailyModes: DailyModes = {
    water: 'standard',
    food: 'standard',
    maintenance: 'standard',
    logistics: 'standard',
  };
  const safetyLines: SafetyLines = {
    water: { hardDays: 2, safetyDays: 5 },
    food: { hardDays: 3, safetyDays: 7 },
    commonParts: { hardDays: 3, safetyDays: 5 },
  };
  const state: M0State = {
    version: M0_STATE_VERSION,
    day: 0,
    clock: { running: false, elapsedMs: 0, millisecondsPerDay: M0_DAY_MS },
    population: {
      normal: 28,
      unableToWork: 0,
      critical: 0,
      deceased: 0,
      waterDebt: 0,
      foodDebt: 0,
    },
    dailyModes,
    workforce: {
      basicDuty: 0,
      water: 0,
      food: 0,
      maintenance: 0,
      logistics: 0,
      development: 0,
      standby: 0,
      workable: 0,
    },
    staffingShortage: null,
    safetyLines,
    feedback: null,
    stocks: initialStocks(),
    maintenanceBacklog: 8,
    oldRepairableParts: 240,
    headquartersSalvage: { approved: false, dismantledItems: 0 },
    waterworks: { repaired: false, workDone: 0, workRequired: 24 },
    projects: initialProjects(),
    warnings: [],
    ledger: [],
  };

  applyWorkforcePlan(state);
  return state;
}

export function setDailyMode(state: M0State, line: keyof DailyModes, mode: WorkMode): M0State {
  const candidate: M0State = {
    ...state,
    dailyModes: { ...state.dailyModes, [line]: mode },
    projects: state.projects.map((project) => ({
      ...project,
      staffing: { ...project.staffing },
      lockedCost: { ...project.lockedCost },
    })),
    feedback: null,
  };
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
  return candidate;
}

export function setSafetyDays(state: M0State, resource: keyof SafetyLines, safetyDays: number): M0State {
  const hardDays = state.safetyLines[resource].hardDays;
  if (!Number.isInteger(safetyDays) || safetyDays < hardDays) {
    return { ...state, feedback: `安全线不能低于硬底线 ${hardDays} 日。` };
  }

  return {
    ...state,
    safetyLines: {
      ...state.safetyLines,
      [resource]: { hardDays, safetyDays },
    },
    feedback: '安全线已更新。',
  };
}

export function setHeadquartersSalvageApproval(state: M0State, approved: boolean): M0State {
  return {
    ...state,
    headquartersSalvage: { ...state.headquartersSalvage, approved },
    feedback: approved ? '已允许普通零件接近安全线时启动低效拆解。' : '已取消低效拆解预授权。',
  };
}
