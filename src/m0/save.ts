import { M0_DAY_MS, M0_SAVE_KEY, createInitialM0State } from './state';
import {
  M0_STATE_VERSION,
  RESOURCE_IDS,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
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
  if (!isRecord(value) || !isRecord(value.staffing)) return false;
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
    && isNonNegativeNumber(staffing.planned)
    && isNonNegativeNumber(staffing.actual)
    && STAFFING_SOURCES.includes(staffing.source as string)
    && RETURN_TARGETS.includes(staffing.returnTo as string | null)
    && isNonNegativeNumber(value.workDone)
    && isNonNegativeNumber(value.workRequired)
    && isResourceCosts(value.lockedCost);
}

function isProjectEvent(value: unknown): boolean {
  return isRecord(value)
    && typeof value.projectId === 'string'
    && typeof value.projectName === 'string'
    && PROJECT_STATUSES.includes(value.status as string)
    && PAUSE_REASONS.includes(value.reason as string | null);
}

function isResourceFlow(value: unknown): boolean {
  return isRecord(value)
    && value.locationId === 'hq'
    && hasNumbers(value, ['start', 'inflow', 'outflow', 'overflow', 'end']);
}

function isLedgerEntry(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.resources)) return false;
  const resources = value.resources;
  return isNonNegativeInteger(value.day)
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

function isM0State(value: unknown): value is M0State {
  if (!isRecord(value) || value.version !== M0_STATE_VERSION) return false;
  if (!isNonNegativeInteger(value.day) || !isRecord(value.clock)) return false;
  if (!isBoolean(value.clock.running)
    || !isNonNegativeNumber(value.clock.elapsedMs)
    || value.clock.millisecondsPerDay !== M0_DAY_MS) return false;

  if (!isRecord(value.population)
    || !hasNumbers(value.population, ['normal', 'unableToWork', 'critical', 'deceased', 'waterDebt', 'foodDebt'])) return false;

  if (!isRecord(value.dailyModes)) return false;
  const dailyModes = value.dailyModes;
  if (!['water', 'food', 'maintenance', 'logistics'].every((key) => WORK_MODES.includes(dailyModes[key] as string))) return false;

  if (!isRecord(value.workforce)
    || !hasNumbers(value.workforce, ['basicDuty', 'water', 'food', 'maintenance', 'logistics', 'development', 'standby', 'workable'])) return false;

  if (value.staffingShortage !== null) {
    if (!isRecord(value.staffingShortage)
      || !hasNumbers(value.staffingShortage, ['required', 'workable'])
      || typeof value.staffingShortage.message !== 'string') return false;
  }

  if (!isRecord(value.safetyLines)) return false;
  for (const resource of ['water', 'food', 'commonParts']) {
    const line = value.safetyLines[resource];
    if (!isRecord(line)
      || !isNonNegativeInteger(line.hardDays)
      || !isNonNegativeInteger(line.safetyDays)
      || line.safetyDays < line.hardDays) return false;
  }

  if (value.feedback !== null && typeof value.feedback !== 'string') return false;
  if (!isRecord(value.stocks)) return false;
  for (const resource of RESOURCE_IDS) {
    const stock = value.stocks[resource];
    if (!isRecord(stock)
      || stock.locationId !== 'hq'
      || !hasNumbers(stock, ['amount', 'capacity', 'locked', 'reserved', 'consumed'])
      || Number(stock.amount) > Number(stock.capacity)
      || Number(stock.locked) + Number(stock.reserved) > Number(stock.amount)) return false;
  }

  if (!isNonNegativeNumber(value.maintenanceBacklog)
    || !isNonNegativeNumber(value.oldRepairableParts)
    || !isRecord(value.headquartersSalvage)
    || !isBoolean(value.headquartersSalvage.approved)
    || !isNonNegativeInteger(value.headquartersSalvage.dismantledItems)
    || !isRecord(value.waterworks)
    || !isBoolean(value.waterworks.repaired)
    || !hasNumbers(value.waterworks, ['workDone', 'workRequired'])) return false;

  if (!Array.isArray(value.projects) || !value.projects.every(isProject)) return false;
  const projectIds = value.projects.map((project) => project.id);
  if (new Set(projectIds).size !== projectIds.length) return false;

  return isStringArray(value.warnings)
    && Array.isArray(value.ledger)
    && value.ledger.every(isLedgerEntry);
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
