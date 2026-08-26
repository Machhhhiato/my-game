export const M0_STATE_VERSION = 4 as const;

export type ResourceId = 'water' | 'food' | 'commonParts' | 'engineeringComponents' | 'alloy' | 'precisionParts';
export type DailyLineId = 'water' | 'food' | 'maintenance' | 'logistics';
export type WorkMode = 'minimum' | 'standard' | 'accelerated';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type PauseReason =
  | 'safety_line'
  | 'hard_floor'
  | 'staffing_shortage'
  | 'player_pause'
  | 'day_limit'
  | 'route_choice'
  | 'research_prerequisite'
  | null;
export type ReturnTo = DailyLineId | 'development' | 'standby' | null;
export type GameSpeed = 1 | 2 | 4;

export interface GameDate {
  year: number;
  month: number;
  day: number;
}

export interface ScenarioConfig {
  id: string;
  startDate: GameDate;
}

export interface Stock {
  locationId: 'hq';
  capacity: number;
  amount: number;
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
  investedResources: Partial<Record<ResourceId, number>>;
}

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

export interface M0Event {
  id: string;
  date: GameDate;
  kind: 'project_status' | 'project_complete' | 'resource_shortage' | 'resource_restored';
  message: string;
  relatedId: string;
}

export interface MonthlyResourceAccount {
  openingAmount: number;
  accruedInflow: number;
  accruedOutflow: number;
  accruedOverflow: number;
  currentDailyInflow: number;
  currentDailyOutflow: number;
  projectedRemainingInflow: number;
  projectedRemainingOutflow: number;
  projectedClosingAmount: number;
  exhaustionDate: GameDate | null;
}

export interface MonthlyLedger {
  year: number;
  month: number;
  processedDays: number;
  settlementDate: GameDate;
  resources: Record<ResourceId, MonthlyResourceAccount>;
}

export interface EventWindowPosition {
  xRatio: number;
  yRatio: number;
}

export interface MapRotation {
  yaw: number;
  pitch: number;
}

export interface M0UiState {
  eventWindow: EventWindowPosition;
  mapRotation: MapRotation;
}

export type IntelStage = 'direction' | 'area' | 'route' | 'site';
export type SurveyTargetId = 'ruin-a' | 'ruin-b';
export type ResearchMode = 'manual' | 'automatic';
export type ResearchDomain = 'manufacturing' | 'surveying' | 'engineering';
export type CellIntel = 'unknown' | 'known' | 'candidate' | 'route' | 'site';
export type TerrainId = 'hardground' | 'mud' | 'slope' | 'shore' | 'plain';
export type OccupationId = 'empty' | 'headquarters' | 'waterworks' | 'food-site' | 'industrial-ruin' | 'future-site';
export type SurveyPauseReason = 'player' | 'day-limit' | 'route-choice' | 'staffing' | 'safety' | null;

export interface LocalMapCell {
  id: string;
  q: number;
  r: number;
  terrain: TerrainId;
  neighbors: string[];
  occupation: OccupationId;
  water: 'dry' | 'near-water' | 'waterlogging';
  resource: 'none' | 'food' | 'engineering-salvage' | 'alloy-salvage' | 'farmland-potential' | 'mineral-sign' | 'shore-potential';
  risk: 'none' | 'heavy-clearing' | 'damaged-passage' | 'future-use-only';
  intel: CellIntel;
}

export interface LocalMapRoute {
  id: string;
  targetId: SurveyTargetId;
  cellIds: string[];
  facts: Array<'stable-old-road' | 'mud-section' | 'damaged-passage'>;
}

export interface SurveyRecord {
  targetId: SurveyTargetId;
  projectId: string;
  stage: IntelStage;
  workDone: number;
  approved: boolean;
  workers: 2 | 4 | 6;
  priority: Exclude<Priority, 'P0'>;
  paused: boolean;
  pauseReason: SurveyPauseReason;
  maximumDays: number | null;
  daysWorked: number;
  useDrone: boolean;
  droneAppliedStages: Array<Exclude<IntelStage, 'direction'>>;
  selectedRouteId: string | null;
}

export interface M0MapState {
  cells: LocalMapCell[];
  routes: LocalMapRoute[];
  selectedCellId: string;
  surveys: SurveyRecord[];
}

export interface ResearchState {
  mode: ResearchMode;
  manualQueue: string[];
  domainOrder: ResearchDomain[];
  automaticDomains: ResearchDomain[];
  completed: string[];
  workers: 2 | 4 | 6;
  currentProjectId: string | null;
  currentSource: ResearchMode | null;
  roundTarget: number | null;
  blockedProjectId: string | null;
  blockedReason: 'physical-prerequisite' | 'manual-choice' | 'no-project' | null;
}

export interface DroneAsset {
  id: 'multispectral-survey-drone-001';
  name: string;
  locationId: 'hq';
  status: 'needs-charge' | 'charging' | 'available' | 'assigned';
  assignment: SurveyTargetId | null;
  maintenance: 'inspection-needed' | 'ready';
  recharge: 'connection' | 'overnight' | 'inspection' | 'complete';
  rechargeApproved: boolean;
  connectionWorkDone: number;
  inspectionWorkDone: number;
  overnightStartedDay: number | null;
}

export interface DayLedger {
  elapsedDay: number;
  date: GameDate;
  resources: Record<ResourceId, ResourceFlow>;
  monthSettled: boolean;
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
  scenario: ScenarioConfig;
  calendar: GameDate;
  elapsedDays: number;
  clock: {
    running: boolean;
    elapsedMs: number;
    millisecondsPerDay: number;
    speed: GameSpeed;
  };
  population: Population;
  dailyModes: DailyModes;
  workforce: Workforce;
  staffingShortage: StaffingShortage | null;
  feedback: string | null;
  stocks: Stocks;
  monthly: MonthlyLedger;
  resourceShortages: Record<'water' | 'food', boolean>;
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
  map: M0MapState;
  research: ResearchState;
  drone: DroneAsset | null;
  warnings: string[];
  events: M0Event[];
  ui: M0UiState;
  ledger: DayLedger[];
}

export const RESOURCE_IDS: ResourceId[] = ['water', 'food', 'commonParts', 'engineeringComponents', 'alloy', 'precisionParts'];
