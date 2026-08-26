import { compareGameDates, gameDateOrdinal, isValidGameDate, nextGameDate, nextMonthStart } from './calendar';
import { refreshMonthlyProjection } from './economy';
import { M0_DAY_MS, M0_SAVE_KEY, createInitialM0State } from './state';
import {
  M0_STATE_VERSION,
  RESOURCE_IDS,
  type GameDate,
  type M0Event,
  type M0State,
  type Project,
  type ResourceId,
} from './types';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const WORK_MODES = ['minimum', 'standard', 'accelerated'];
const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const PROJECT_STATUSES = ['active', 'paused', 'waiting_confirmation', 'complete'];
const PAUSE_REASONS = ['safety_line', 'hard_floor', 'staffing_shortage', null];
const STAFFING_SOURCES = ['daily_water', 'development'];
const RETURN_TARGETS = ['water', 'food', 'maintenance', 'logistics', 'development', 'standby', null];
const EVENT_KINDS = ['project_status', 'project_complete', 'resource_shortage', 'resource_restored'];
const GAME_SPEEDS = [1, 2, 4];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasExactKeys(record: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonNegativeNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && isNonNegativeNumber(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isDate(value: unknown): value is GameDate {
  return isRecord(value)
    && hasExactKeys(value, ['year', 'month', 'day'])
    && isValidGameDate(value as unknown as GameDate);
}

function isEventWindowPosition(value: unknown): boolean {
  return isRecord(value)
    && hasExactKeys(value, ['xRatio', 'yRatio'])
    && isFiniteNumber(value.xRatio)
    && value.xRatio >= 0
    && value.xRatio <= 1
    && isFiniteNumber(value.yRatio)
    && value.yRatio >= 0
    && value.yRatio <= 1;
}

function sameDate(left: GameDate, right: GameDate): boolean {
  return left.year === right.year && left.month === right.month && left.day === right.day;
}

function hasNumbers(record: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => isNonNegativeNumber(record[key]));
}

function isResourceCosts(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([key, amount]) => (
    RESOURCE_IDS.includes(key as ResourceId) && isNonNegativeNumber(amount)
  ));
}

function isProject(value: unknown): value is Project {
  if (!isRecord(value)
    || !hasExactKeys(value, [
      'id', 'name', 'priority', 'queueOrder', 'status', 'production', 'testOnly',
      'directRecovery', 'autoResume', 'pausedReason', 'safeActiveDays', 'staffing',
      'workDone', 'workRequired', 'investedResources',
    ])
    || !isRecord(value.staffing)
    || !hasExactKeys(value.staffing, ['planned', 'actual', 'source', 'returnTo'])) return false;
  const staffing = value.staffing;

  return typeof value.id === 'string'
    && value.id.length > 0
    && typeof value.name === 'string'
    && PRIORITIES.includes(value.priority as string)
    && isNonNegativeInteger(value.queueOrder)
    && PROJECT_STATUSES.includes(value.status as string)
    && isBoolean(value.production)
    && isBoolean(value.testOnly)
    && isBoolean(value.directRecovery)
    && isBoolean(value.autoResume)
    && PAUSE_REASONS.includes(value.pausedReason as string | null)
    && isNonNegativeInteger(value.safeActiveDays)
    && isNonNegativeInteger(staffing.planned)
    && isNonNegativeInteger(staffing.actual)
    && Number(staffing.actual) <= Number(staffing.planned)
    && STAFFING_SOURCES.includes(staffing.source as string)
    && RETURN_TARGETS.includes(staffing.returnTo as string | null)
    && isNonNegativeNumber(value.workDone)
    && isNonNegativeNumber(value.workRequired)
    && Number(value.workDone) <= Number(value.workRequired)
    && isResourceCosts(value.investedResources);
}

function isProjectEvent(value: unknown): boolean {
  return isRecord(value)
    && hasExactKeys(value, ['projectId', 'projectName', 'status', 'reason'])
    && typeof value.projectId === 'string'
    && typeof value.projectName === 'string'
    && PROJECT_STATUSES.includes(value.status as string)
    && PAUSE_REASONS.includes(value.reason as string | null);
}

function isEvent(value: unknown, startDate: GameDate, currentDate: GameDate): value is M0Event {
  return isRecord(value)
    && hasExactKeys(value, ['id', 'date', 'kind', 'message', 'relatedId'])
    && typeof value.id === 'string'
    && value.id.length > 0
    && isDate(value.date)
    && compareGameDates(value.date, startDate) >= 0
    && compareGameDates(value.date, currentDate) < 0
    && EVENT_KINDS.includes(value.kind as string)
    && typeof value.message === 'string'
    && typeof value.relatedId === 'string';
}

function isResourceFlow(value: unknown): boolean {
  return isRecord(value)
    && hasExactKeys(value, ['locationId', 'start', 'inflow', 'outflow', 'overflow', 'end'])
    && value.locationId === 'hq'
    && hasNumbers(value, ['start', 'inflow', 'outflow', 'overflow', 'end']);
}

function isLedgerEntry(value: unknown, startDate: GameDate, currentDate: GameDate, elapsedDays: number): boolean {
  if (!isRecord(value)
    || !hasExactKeys(value, [
      'elapsedDay', 'date', 'resources', 'monthSettled', 'maintenanceBacklogStart',
      'maintenanceBacklogEnd', 'waterworksWorkStart', 'waterworksWorkEnd',
      'oldRepairablePartsStart', 'oldRepairablePartsEnd', 'headquartersSalvageStart',
      'headquartersSalvageEnd', 'logisticsProjectCapacity', 'warnings', 'projectEvents',
    ])
    || !isDate(value.date)
    || compareGameDates(value.date, startDate) < 0
    || compareGameDates(value.date, currentDate) >= 0
    || !isRecord(value.resources)) return false;

  const resources = value.resources as Record<string, unknown>;
  return isNonNegativeInteger(value.elapsedDay)
    && Number(value.elapsedDay) >= 1
    && Number(value.elapsedDay) <= elapsedDays
    && isBoolean(value.monthSettled)
    && RESOURCE_IDS.every((resource) => isResourceFlow(resources[resource]))
    && hasNumbers(value, [
      'maintenanceBacklogStart',
      'maintenanceBacklogEnd',
      'waterworksWorkStart',
      'waterworksWorkEnd',
      'oldRepairablePartsStart',
      'oldRepairablePartsEnd',
      'headquartersSalvageStart',
      'headquartersSalvageEnd',
      'logisticsProjectCapacity',
    ])
    && isStringArray(value.warnings)
    && Array.isArray(value.projectEvents)
    && value.projectEvents.every(isProjectEvent);
}

function isMonthlyLedger(value: unknown, state: M0State): boolean {
  if (!isRecord(value)
    || !hasExactKeys(value, ['year', 'month', 'processedDays', 'settlementDate', 'resources'])
    || value.year !== state.calendar.year
    || value.month !== state.calendar.month
    || value.processedDays !== state.calendar.day - 1
    || !isDate(value.settlementDate)
    || !sameDate(value.settlementDate, nextMonthStart(state.calendar))
    || !isRecord(value.resources)) return false;

  for (const resource of RESOURCE_IDS) {
    const account = value.resources[resource];
    const stock = state.stocks[resource];
    if (!isRecord(account)
      || !hasExactKeys(account, [
        'openingAmount', 'accruedInflow', 'accruedOutflow', 'accruedOverflow',
        'currentDailyInflow', 'currentDailyOutflow', 'projectedRemainingInflow',
        'projectedRemainingOutflow', 'projectedClosingAmount', 'exhaustionDate',
      ])
      || !hasNumbers(account, [
        'openingAmount', 'accruedInflow', 'accruedOutflow', 'accruedOverflow',
        'currentDailyInflow', 'currentDailyOutflow', 'projectedRemainingInflow',
        'projectedRemainingOutflow', 'projectedClosingAmount',
      ])
      || Number(account.openingAmount) > stock.capacity
      || Number(account.projectedClosingAmount) > stock.capacity
      || stock.amount + Number(account.accruedInflow) - Number(account.accruedOutflow) < 0
      || stock.amount + Number(account.accruedInflow) - Number(account.accruedOutflow) > stock.capacity) return false;

    if (account.exhaustionDate !== null) {
      if (!isDate(account.exhaustionDate)
        || compareGameDates(account.exhaustionDate, state.calendar) < 0
        || compareGameDates(account.exhaustionDate, value.settlementDate) >= 0) return false;
    }
  }

  return true;
}

function isM0State(value: unknown): value is M0State {
  if (!isRecord(value)
    || !hasExactKeys(value, [
      'version', 'scenario', 'calendar', 'elapsedDays', 'clock', 'population',
      'dailyModes', 'workforce', 'staffingShortage', 'feedback', 'stocks', 'monthly',
      'resourceShortages', 'maintenanceBacklog', 'oldRepairableParts',
      'headquartersSalvage', 'waterworks', 'projects', 'warnings', 'events', 'ui',
      'ledger',
    ])
    || value.version !== M0_STATE_VERSION
    || !isRecord(value.scenario)
    || !hasExactKeys(value.scenario, ['id', 'startDate'])
    || typeof value.scenario.id !== 'string'
    || value.scenario.id.length === 0
    || !isDate(value.scenario.startDate)
    || !isDate(value.calendar)
    || compareGameDates(value.calendar, value.scenario.startDate) < 0
    || !isNonNegativeInteger(value.elapsedDays)
    || gameDateOrdinal(value.calendar) - gameDateOrdinal(value.scenario.startDate) !== value.elapsedDays) return false;

  if (!isRecord(value.clock)
    || !hasExactKeys(value.clock, ['running', 'elapsedMs', 'millisecondsPerDay', 'speed'])
    || !isBoolean(value.clock.running)
    || !isNonNegativeNumber(value.clock.elapsedMs)
    || Number(value.clock.elapsedMs) >= M0_DAY_MS
    || value.clock.millisecondsPerDay !== M0_DAY_MS
    || !GAME_SPEEDS.includes(value.clock.speed as number)) return false;

  if (!isRecord(value.population)
    || !hasExactKeys(value.population, ['normal', 'unableToWork', 'critical', 'deceased', 'waterDebt', 'foodDebt'])
    || !['normal', 'unableToWork', 'critical', 'deceased', 'waterDebt', 'foodDebt']
      .every((key) => isNonNegativeInteger((value.population as Record<string, unknown>)[key]))) return false;

  if (!isRecord(value.dailyModes)
    || !hasExactKeys(value.dailyModes, ['water', 'food', 'maintenance', 'logistics'])
    || !['water', 'food', 'maintenance', 'logistics']
      .every((key) => WORK_MODES.includes((value.dailyModes as Record<string, unknown>)[key] as string))) return false;

  if (!isRecord(value.workforce)
    || !hasExactKeys(value.workforce, ['basicDuty', 'water', 'food', 'maintenance', 'logistics', 'development', 'standby', 'workable'])
    || !['basicDuty', 'water', 'food', 'maintenance', 'logistics', 'development', 'standby', 'workable']
      .every((key) => isNonNegativeInteger((value.workforce as Record<string, unknown>)[key]))) return false;

  if (value.staffingShortage !== null) {
    if (!isRecord(value.staffingShortage)
      || !hasExactKeys(value.staffingShortage, ['required', 'workable', 'message'])
      || !isNonNegativeInteger(value.staffingShortage.required)
      || !isNonNegativeInteger(value.staffingShortage.workable)
      || typeof value.staffingShortage.message !== 'string') return false;
  }

  if (value.feedback !== null && typeof value.feedback !== 'string') return false;
  if (!isRecord(value.stocks)) return false;
  for (const resource of RESOURCE_IDS) {
    const stock = value.stocks[resource];
    if (!isRecord(stock)
      || !hasExactKeys(stock, ['locationId', 'capacity', 'amount', 'consumed'])
      || stock.locationId !== 'hq'
      || !hasNumbers(stock, ['amount', 'capacity', 'consumed'])
      || Number(stock.amount) > Number(stock.capacity)) return false;
  }

  if (!isRecord(value.resourceShortages)
    || !hasExactKeys(value.resourceShortages, ['water', 'food'])
    || !isBoolean(value.resourceShortages.water)
    || !isBoolean(value.resourceShortages.food)
    || !isNonNegativeNumber(value.maintenanceBacklog)
    || !isNonNegativeNumber(value.oldRepairableParts)
    || !isRecord(value.headquartersSalvage)
    || !hasExactKeys(value.headquartersSalvage, ['approved', 'dismantledItems'])
    || !isBoolean(value.headquartersSalvage.approved)
    || !isNonNegativeInteger(value.headquartersSalvage.dismantledItems)
    || !isRecord(value.waterworks)
    || !hasExactKeys(value.waterworks, ['repaired', 'workDone', 'workRequired'])
    || !isBoolean(value.waterworks.repaired)
    || !hasNumbers(value.waterworks, ['workDone', 'workRequired'])
    || Number(value.waterworks.workDone) > Number(value.waterworks.workRequired)) return false;

  if (!Array.isArray(value.projects) || !value.projects.every(isProject)) return false;
  const projectIds = value.projects.map((project) => project.id);
  if (new Set(projectIds).size !== projectIds.length) return false;

  const projectWorkers = value.projects
    .filter((project) => project.staffing.source === 'development')
    .reduce((sum, project) => sum + project.staffing.actual, 0);
  const workforce = value.workforce as Record<string, number>;
  const assignedWorkers = workforce.basicDuty
    + workforce.water
    + workforce.food
    + workforce.maintenance
    + workforce.logistics
    + workforce.development
    + workforce.standby
    + projectWorkers;
  if (assignedWorkers !== workforce.workable) return false;

  const state = value as unknown as M0State;
  if (!isMonthlyLedger(value.monthly, state)
    || !isStringArray(value.warnings)
    || !Array.isArray(value.events)
    || !value.events.every((event) => isEvent(event, state.scenario.startDate, state.calendar))
    || new Set(value.events.map((event) => event.id)).size !== value.events.length
    || !isRecord(value.ui)
    || !hasExactKeys(value.ui, ['eventWindow'])
    || !isEventWindowPosition(value.ui.eventWindow)
    || !Array.isArray(value.ledger)
    || value.ledger.length > 30
    || !value.ledger.every((entry) => isLedgerEntry(entry, state.scenario.startDate, state.calendar, state.elapsedDays))) return false;

  const waterworksProject = state.projects.find((project) => project.id === 'hq-waterworks-restoration');
  if (!waterworksProject
    || waterworksProject.workDone !== state.waterworks.workDone
    || waterworksProject.workRequired !== state.waterworks.workRequired
    || (waterworksProject.status === 'complete') !== state.waterworks.repaired) return false;

  const projectionCheck = JSON.parse(JSON.stringify(state)) as M0State;
  refreshMonthlyProjection(projectionCheck);
  if (JSON.stringify(projectionCheck.monthly) !== JSON.stringify(state.monthly)) return false;

  for (let index = 0; index < state.ledger.length; index += 1) {
    const entry = state.ledger[index];
    const expectedElapsedDay = state.elapsedDays - state.ledger.length + index + 1;
    if (entry.elapsedDay !== expectedElapsedDay) return false;
    if (index > 0 && !sameDate(entry.date, nextGameDate(state.ledger[index - 1].date))) return false;
  }
  if (state.ledger.length > 0) {
    const latest = state.ledger[state.ledger.length - 1];
    if (!sameDate(nextGameDate(latest.date), state.calendar)) return false;
  }

  return true;
}

export function saveM0State(state: M0State, storage: StorageLike = window.localStorage): void {
  storage.setItem(M0_SAVE_KEY, JSON.stringify(state));
}

export function loadM0State(storage: StorageLike = window.localStorage): M0State {
  const raw = storage.getItem(M0_SAVE_KEY);
  if (raw === null) return createInitialM0State();

  try {
    const parsed: unknown = JSON.parse(raw);
    return isM0State(parsed) ? parsed : createInitialM0State();
  } catch {
    return createInitialM0State();
  }
}

export function clearM0State(storage: StorageLike = window.localStorage): void {
  storage.removeItem(M0_SAVE_KEY);
}
