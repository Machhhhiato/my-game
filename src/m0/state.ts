import { createEmptyMonthlyLedger, refreshMonthlyProjection } from './economy';
import {
  M0_STATE_VERSION,
  type DailyModes,
  type EventWindowPosition,
  type MapRotation,
  type M0State,
  type Priority,
  type Project,
  type ScenarioConfig,
  type Stocks,
  type Workforce,
} from './types';
import { createLocalMap, normalizeMapRotation } from './map';

export const M0_SAVE_KEY = 'always-game-m0-v4';
export const M0_DAY_MS = 20_000;

export const DEFAULT_EVENT_WINDOW_POSITION: EventWindowPosition = {
  xRatio: 1,
  yRatio: 0.08,
};

export const DEFAULT_MAP_ROTATION: MapRotation = { yaw: 0, pitch: 0 };

export const DEFAULT_M0_SCENARIO: ScenarioConfig = {
  id: 'm0-core-test-scenario',
  startDate: { year: 2001, month: 1, day: 1 },
};

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
  const stock = (amount: number, capacity: number, consumed = 0) => ({
    locationId: 'hq' as const,
    amount,
    capacity,
    consumed,
  });

  return {
    water: stock(280, 420),
    food: stock(560, 840),
    commonParts: stock(41, 90, 4),
    engineeringComponents: stock(68, 120, 12),
    alloy: stock(40, 60),
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
    investedResources: {
      commonParts: 4,
      engineeringComponents: 12,
    },
  }];
}

export function createInitialM0State(scenario: ScenarioConfig = DEFAULT_M0_SCENARIO): M0State {
  const calendar = { ...scenario.startDate };
  const stocks = initialStocks();
  const dailyModes: DailyModes = {
    water: 'standard',
    food: 'standard',
    maintenance: 'standard',
    logistics: 'standard',
  };
  const state: M0State = {
    version: M0_STATE_VERSION,
    scenario: { id: scenario.id, startDate: { ...scenario.startDate } },
    calendar,
    elapsedDays: 0,
    clock: { running: false, elapsedMs: 0, millisecondsPerDay: M0_DAY_MS, speed: 1 },
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
    feedback: null,
    stocks,
    monthly: createEmptyMonthlyLedger(calendar, stocks),
    resourceShortages: { water: false, food: false },
    maintenanceBacklog: 8,
    oldRepairableParts: 240,
    headquartersSalvage: { approved: false, dismantledItems: 0 },
    waterworks: { repaired: false, workDone: 0, workRequired: 24 },
    projects: initialProjects(),
    map: createLocalMap(),
    research: {
      mode: 'manual',
      manualQueue: [],
      domainOrder: ['manufacturing', 'surveying', 'engineering'],
      automaticDomains: [],
      completed: [],
      workers: 6,
      currentProjectId: null,
      currentSource: null,
      roundTarget: null,
      blockedProjectId: null,
      blockedReason: null,
    },
    drone: null,
    warnings: [],
    events: [],
    ui: {
      eventWindow: { ...DEFAULT_EVENT_WINDOW_POSITION },
      mapRotation: { ...DEFAULT_MAP_ROTATION },
    },
    ledger: [],
  };

  applyWorkforcePlan(state);
  refreshMonthlyProjection(state);
  return state;
}

export function setMapRotation(state: M0State, rotation: MapRotation): M0State {
  return {
    ...state,
    ui: {
      ...state.ui,
      mapRotation: normalizeMapRotation(rotation),
    },
  };
}

export function setEventWindowPosition(
  state: M0State,
  position: EventWindowPosition,
): M0State {
  const safeRatio = (requested: number, current: number, fallback: number): number => {
    if (Number.isFinite(requested)) return Math.max(0, Math.min(1, requested));
    if (Number.isFinite(current)) return Math.max(0, Math.min(1, current));
    return fallback;
  };

  return {
    ...state,
    ui: {
      ...state.ui,
      eventWindow: {
        xRatio: safeRatio(
          position.xRatio,
          state.ui.eventWindow.xRatio,
          DEFAULT_EVENT_WINDOW_POSITION.xRatio,
        ),
        yRatio: safeRatio(
          position.yRatio,
          state.ui.eventWindow.yRatio,
          DEFAULT_EVENT_WINDOW_POSITION.yRatio,
        ),
      },
    },
  };
}
