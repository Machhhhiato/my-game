export const M0_STATE_VERSION = 1 as const;

export type ResourceId = 'water' | 'food' | 'commonParts' | 'engineeringComponents' | 'alloy' | 'precisionParts';
export type DailyLineId = 'water' | 'food' | 'maintenance' | 'logistics';
export type WorkMode = 'minimum' | 'standard' | 'accelerated';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type PauseReason = 'safety_line' | 'hard_floor' | 'staffing_shortage' | null;
export type ReturnTo = DailyLineId | 'development' | 'standby' | null;

export interface Stock {
  locationId: 'hq';
  capacity: number;
  amount: number;
  locked: number;
  reserved: number;
  consumed: number;
}

export type Stocks = Record<ResourceId, Stock>;

export interface Population {
  normal: number;
  unableToWork: number;
  critical: number;
  deceased: number;
  waterDebt: number;
  foodDebt: number;
}

export interface DailyModes {
  water: WorkMode;
  food: WorkMode;
  maintenance: WorkMode;
  logistics: WorkMode;
}

export interface Workforce {
  basicDuty: number;
  water: number;
  food: number;
  maintenance: number;
  logistics: number;
  development: number;
  standby: number;
  workable: number;
}

export interface ProjectStaffing {
  planned: number;
  actual: number;
  source: 'daily_water' | 'development';
  returnTo: ReturnTo;
}

export interface Project {
  id: string;
  name: string;
  priority: Priority;
  queueOrder: number;
  status: 'active' | 'paused' | 'waiting_confirmation' | 'complete';
  production: boolean;
  testOnly: boolean;
  directRecovery: boolean;
  autoResume: boolean;
  pausedReason: PauseReason;
  safeActiveDays: number;
  staffing: ProjectStaffing;
  workDone: number;
  workRequired: number;
  lockedCost: Partial<Record<ResourceId, number>>;
}

export interface SafetyLine {
  hardDays: number;
  safetyDays: number;
}

export type SafetyLines = Record<'water' | 'food' | 'commonParts', SafetyLine>;

export interface StaffingShortage {
  required: number;
  workable: number;
  message: string;
}

export interface ResourceFlow {
  locationId: 'hq';
  start: number;
  inflow: number;
  outflow: number;
  overflow: number;
  end: number;
}

export interface ProjectEvent {
  projectId: string;
  projectName: string;
  status: Project['status'];
  reason: PauseReason;
}

export interface DayLedger {
  day: number;
  resources: Record<ResourceId, ResourceFlow>;
  maintenanceBacklogStart: number;
  maintenanceBacklogEnd: number;
  waterworksWorkStart: number;
  waterworksWorkEnd: number;
  oldRepairablePartsStart: number;
  oldRepairablePartsEnd: number;
  headquartersSalvageStart: number;
  headquartersSalvageEnd: number;
  logisticsProjectCapacity: number;
  warnings: string[];
  projectEvents: ProjectEvent[];
}

export interface M0State {
  version: typeof M0_STATE_VERSION;
  day: number;
  clock: {
    running: boolean;
    elapsedMs: number;
    millisecondsPerDay: number;
  };
  population: Population;
  dailyModes: DailyModes;
  workforce: Workforce;
  staffingShortage: StaffingShortage | null;
  safetyLines: SafetyLines;
  feedback: string | null;
  stocks: Stocks;
  maintenanceBacklog: number;
  oldRepairableParts: number;
  headquartersSalvage: {
    approved: boolean;
    dismantledItems: number;
  };
  waterworks: {
    repaired: boolean;
    workDone: number;
    workRequired: number;
  };
  projects: Project[];
  warnings: string[];
  ledger: DayLedger[];
}

export const RESOURCE_IDS: ResourceId[] = ['water', 'food', 'commonParts', 'engineeringComponents', 'alloy', 'precisionParts'];
