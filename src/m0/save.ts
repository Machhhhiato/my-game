import { compareGameDates, daysInMonth, gameDateOrdinal, isValidGameDate, nextGameDate, nextMonthStart } from './calendar';
import { refreshMonthlyProjection } from './economy';
import { M0_DAY_MS, M0_SAVE_KEY, MODE_STAFF, createInitialM0State } from './state';
import { createLocalMap, nextIntelStage, normalizeMapRotation, refreshMapIntel, surveyWorkRequired } from './map';
import { enabledResearchCapacity, technologies } from './progression';
import { unifiedWorkablePopulation } from './populationAccounting';
import {
  M0_STATE_VERSION,
  RESOURCE_IDS,
  type GameDate,
  type M0Event,
  type M0State,
  type Project,
  type ResourceId,
} from './types';

export const M0_LEGACY_SAVE_KEY = 'always-game-m0-v7';
export const M0_V8_SAVE_KEY = 'always-game-m0-v8';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const PROJECT_STATUSES = ['active', 'paused', 'waiting_confirmation', 'complete'];
const PAUSE_REASONS = [
  'safety_line',
  'hard_floor',
  'staffing_shortage',
  'player_pause',
  'day_limit',
  'route_choice',
  'research_prerequisite',
  null,
];
const STAFFING_SOURCES = ['daily_water', 'development'];
const RETURN_TARGETS = ['water', 'food', 'maintenance', 'logistics', 'development', 'standby', null];
const EVENT_KINDS = ['project_status', 'project_complete', 'resource_shortage', 'resource_restored'];
const GAME_SPEEDS = [1, 2, 4];
const INTEL_STAGES = ['direction', 'area', 'route', 'site'];
const CELL_INTEL = ['unknown', 'known', 'candidate', 'route', 'site'];
const RESEARCH_DOMAINS = ['manufacturing', 'surveying', 'engineering'];
const SURVEY_TARGETS = ['ruin-a', 'ruin-b'];

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

function isMapRotation(value: unknown): boolean {
  if (!isRecord(value)
    || !hasExactKeys(value, ['yaw', 'pitch'])
    || !isFiniteNumber(value.yaw)
    || !isFiniteNumber(value.pitch)) return false;
  const normalized = normalizeMapRotation({ yaw: value.yaw, pitch: value.pitch });
  return normalized.yaw === value.yaw && normalized.pitch === value.pitch;
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

function isProductionState(value: unknown, openingRequired: boolean): boolean {
  const expectedIds = openingRequired
    ? ['common-parts-remanufacturing', 'precision-parts', 'survey-drone']
    : ['precision-parts', 'survey-drone'];
  if (!isRecord(value)
    || !hasExactKeys(value, ['totalFactories', 'lines'])
    || !isNonNegativeInteger(value.totalFactories)
    || !Array.isArray(value.lines)
    || value.lines.length !== expectedIds.length) return false;
  const ids = value.lines.map((line) => isRecord(line) ? line.id : null);
  if (new Set(ids).size !== expectedIds.length || expectedIds.some((id) => !ids.includes(id))) return false;
  const allocated = value.lines.reduce<number>((sum, line) => sum + (isRecord(line) && isNonNegativeInteger(line.allocatedFactories) ? Number(line.allocatedFactories) : 0), 0);
  if (allocated > Number(value.totalFactories)) return false;
  return value.lines.every((line) => isRecord(line)
    && hasExactKeys(line, ['id', 'allocatedFactories', 'progress', 'workRequired', 'batchesCompleted', 'blockedReason'])
    && expectedIds.includes(line.id as string)
    && isNonNegativeInteger(line.allocatedFactories)
    && Number(line.allocatedFactories) <= Number(value.totalFactories)
    && isNonNegativeNumber(line.progress)
    && isNonNegativeNumber(line.workRequired)
    && Number(line.workRequired) > 0
    && Number(line.progress) < Number(line.workRequired)
    && isNonNegativeInteger(line.batchesCompleted)
    && ['facility-unavailable', 'technology-locked', 'input-shortage', 'asset-limit', null].includes(line.blockedReason as string | null));
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
    && ((value.status === 'active' || value.status === 'complete')
      ? value.pausedReason === null
      : value.pausedReason !== null)
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

function isCapabilityState(value: unknown, projects: Project[]): boolean {
  if (!isRecord(value) || !isRecord(value.map) || !isRecord(value.research)) return false;
  const map = value.map;
  const research = value.research;
  const expectedMap = createLocalMap();
  if (!hasExactKeys(map, ['cells', 'routes', 'selectedCellId', 'surveys'])
    || !Array.isArray(map.cells)
    || map.cells.length !== expectedMap.cells.length
    || !Array.isArray(map.routes)
    || !Array.isArray(map.surveys)
    || typeof map.selectedCellId !== 'string') return false;

  const mapCells = map.cells as unknown[];
  const mapSurveys = map.surveys as unknown[];
  const cellIds = mapCells.map((cell) => isRecord(cell) ? cell.id : null);
  if (cellIds.some((id) => typeof id !== 'string')
    || new Set(cellIds).size !== cellIds.length
    || !cellIds.includes(map.selectedCellId)) return false;
  for (const expectedCell of expectedMap.cells) {
    const cell = mapCells.find((candidate) => isRecord(candidate) && candidate.id === expectedCell.id);
    if (!isRecord(cell)
      || !hasExactKeys(cell, ['id', 'q', 'r', 'terrain', 'neighbors', 'occupation', 'water', 'resource', 'risk', 'intel'])
      || !CELL_INTEL.includes(cell.intel as string)
      || !isStringArray(cell.neighbors)
      || new Set(cell.neighbors).size !== cell.neighbors.length
      || cell.neighbors.some((id) => !cellIds.includes(id))
      || JSON.stringify({
        id: cell.id,
        q: cell.q,
        r: cell.r,
        terrain: cell.terrain,
        neighbors: cell.neighbors,
        occupation: cell.occupation,
        water: cell.water,
        resource: cell.resource,
        risk: cell.risk,
      }) !== JSON.stringify({
        id: expectedCell.id,
        q: expectedCell.q,
        r: expectedCell.r,
        terrain: expectedCell.terrain,
        neighbors: expectedCell.neighbors,
        occupation: expectedCell.occupation,
        water: expectedCell.water,
        resource: expectedCell.resource,
        risk: expectedCell.risk,
      })) return false;
  }
  for (const cell of mapCells) {
    if (!isRecord(cell) || !isStringArray(cell.neighbors)) return false;
    for (const neighborId of cell.neighbors) {
      const neighbor = mapCells.find((candidate) => isRecord(candidate) && candidate.id === neighborId);
      if (!isRecord(neighbor) || !Array.isArray(neighbor.neighbors) || !neighbor.neighbors.includes(cell.id)) return false;
    }
  }
  if (JSON.stringify(map.routes) !== JSON.stringify(expectedMap.routes)) return false;

  const surveyIds = mapSurveys.map((survey) => isRecord(survey) ? survey.targetId : null);
  if (surveyIds.length !== SURVEY_TARGETS.length
    || new Set(surveyIds).size !== surveyIds.length
    || SURVEY_TARGETS.some((targetId) => !surveyIds.includes(targetId))) return false;
  for (const targetId of SURVEY_TARGETS) {
    const survey: unknown = mapSurveys.find((candidate) => isRecord(candidate) && candidate.targetId === targetId);
    if (!isRecord(survey)
      || !hasExactKeys(survey, [
        'targetId', 'projectId', 'stage', 'workDone', 'approved', 'workers',
        'paused', 'pauseReason', 'maximumDays', 'daysWorked', 'useDrone',
        'droneAppliedStages', 'selectedRouteId',
      ])
      || survey.projectId !== `survey-${targetId}`
      || !INTEL_STAGES.includes(survey.stage as string)
      || !isNonNegativeNumber(survey.workDone)
      || !isBoolean(survey.approved)
      || ![2, 4, 6].includes(survey.workers as number)
      || !isBoolean(survey.paused)
      || !['player', 'day-limit', 'route-choice', 'staffing', 'safety', null].includes(survey.pauseReason as string | null)
      || (survey.maximumDays !== null && (!isNonNegativeInteger(survey.maximumDays) || Number(survey.maximumDays) < 1))
      || !isNonNegativeInteger(survey.daysWorked)
      || !isBoolean(survey.useDrone)
      || !isStringArray(survey.droneAppliedStages)
      || new Set(survey.droneAppliedStages).size !== survey.droneAppliedStages.length
      || survey.droneAppliedStages.some((stage) => !['area', 'route', 'site'].includes(stage))
      || (survey.selectedRouteId !== null
        && !expectedMap.routes.some((route) => route.id === survey.selectedRouteId && route.targetId === targetId))) return false;
    const allowedAppliedStages = survey.stage === 'direction' ? []
      : survey.stage === 'area' ? ['area']
        : survey.stage === 'route' ? ['area', 'route'] : ['area', 'route', 'site'];
    if (survey.droneAppliedStages.some((stage) => !allowedAppliedStages.includes(stage))
      || (survey.stage === 'direction' && survey.selectedRouteId !== null)
      || ((survey.stage === 'route' || survey.stage === 'site') && survey.selectedRouteId === null)) return false;
    const nextStage = nextIntelStage[survey.stage as keyof typeof nextIntelStage];
    if (nextStage && Number(survey.workDone) > surveyWorkRequired[nextStage]) return false;
    const project = projects.find((candidate) => candidate.id === survey.projectId);
    if (survey.approved !== Boolean(project)) return false;
    if (project) {
      const expectedPauseReason = project.status === 'active' || project.status === 'complete' ? null
        : project.pausedReason === 'route_choice' ? 'route-choice'
          : project.pausedReason === 'day_limit' ? 'day-limit'
            : project.pausedReason === 'player_pause' ? 'player'
              : project.pausedReason === 'staffing_shortage' ? 'staffing'
                : project.pausedReason === 'safety_line' || project.pausedReason === 'hard_floor' ? 'safety' : undefined;
      if (project.priority !== 'P2'
        || project.staffing.planned !== survey.workers
        || (survey.stage === 'site' ? project.workDone !== project.workRequired : project.workDone !== survey.workDone)
        || (nextStage !== null && project.workRequired !== surveyWorkRequired[nextStage])
        || (survey.stage === 'site') !== (project.status === 'complete')
        || expectedPauseReason === undefined
        || survey.pauseReason !== expectedPauseReason
        || survey.paused !== (expectedPauseReason !== null)) return false;
    } else if (survey.paused || survey.pauseReason !== null || survey.selectedRouteId !== null) {
      return false;
    }
  }

  const normalizedMap = JSON.parse(JSON.stringify(map)) as M0State['map'];
  refreshMapIntel(normalizedMap);
  if (normalizedMap.cells.some((cell, index) => cell.intel !== (mapCells[index] as Record<string, unknown>).intel)) return false;

  const technologyIds = technologies.map((technology) => technology.id);
  if (!hasExactKeys(research, [
    'mode', 'manualQueue', 'domainOrder', 'automaticDomains', 'completed', 'facilities',
    'currentProjectId', 'currentSource', 'roundTarget', 'blockedProjectId', 'blockedReason',
  ])
    || !['manual', 'automatic'].includes(research.mode as string)
    || !isStringArray(research.manualQueue)
    || new Set(research.manualQueue).size !== research.manualQueue.length
    || research.manualQueue.some((id) => !technologyIds.includes(id))
    || !isStringArray(research.domainOrder)
    || research.domainOrder.length !== RESEARCH_DOMAINS.length
    || new Set(research.domainOrder).size !== RESEARCH_DOMAINS.length
    || research.domainOrder.some((domain) => !RESEARCH_DOMAINS.includes(domain))
    || !isStringArray(research.automaticDomains)
    || new Set(research.automaticDomains).size !== research.automaticDomains.length
    || research.automaticDomains.some((domain) => !RESEARCH_DOMAINS.includes(domain))
    || !isStringArray(research.completed)
    || new Set(research.completed).size !== research.completed.length
    || research.completed.some((id) => !technologyIds.includes(id))
    || !Array.isArray(research.facilities)
    || (research.currentProjectId !== null && !technologyIds.includes(research.currentProjectId as string))
    || !['manual', 'automatic', null].includes(research.currentSource as string | null)
    || (research.roundTarget !== null && !isNonNegativeInteger(research.roundTarget))
    || (research.blockedProjectId !== null && !technologyIds.includes(research.blockedProjectId as string))
    || !['physical-prerequisite', 'manual-choice', 'no-project', null].includes(research.blockedReason as string | null)) return false;
  const facilities = research.facilities as unknown[];
  if (new Set(facilities.map((facility) => isRecord(facility) ? facility.id : null)).size !== facilities.length
    || facilities.some((facility) => !isRecord(facility)
      || !hasExactKeys(facility, ['id', 'name', 'locationId', 'capacity', 'openPositions', 'enabled'])
      || typeof facility.id !== 'string'
      || facility.id.length === 0
      || typeof facility.name !== 'string'
      || facility.name.length === 0
      || facility.locationId !== 'hq'
      || !isNonNegativeInteger(facility.capacity)
      || Number(facility.capacity) < 1
      || !isNonNegativeInteger(facility.openPositions)
      || Number(facility.openPositions) > Number(facility.capacity)
      || !isBoolean(facility.enabled))) return false;
  if ((research.blockedReason === 'physical-prerequisite' || research.blockedReason === 'manual-choice')
    && research.blockedProjectId === null) return false;
  const activeResearch = projects.filter((project) => technologyIds.includes(project.id) && project.status === 'active');
  const enabledFacilityCapacity = facilities.reduce<number>((total, facility) => (
    total + (isRecord(facility) && facility.enabled === true ? Number(facility.openPositions) : 0)
  ), 0);
  if (activeResearch.length > 1
    || (research.currentProjectId === null) !== (research.currentSource === null)
    || (research.currentProjectId === null) !== (activeResearch.length === 0)
    || (research.currentProjectId !== null
      && !activeResearch.some((project) => project.id === research.currentProjectId))
    || projects.some((project) => technologyIds.includes(project.id)
      && project.status !== 'complete'
      && project.staffing.planned !== enabledFacilityCapacity)
    || research.completed.some((id) => projects.find((project) => project.id === id)?.status !== 'complete')) return false;

  if (value.drone === null) return true;
  if (!(isRecord(value.drone)
    && hasExactKeys(value.drone, [
      'id', 'name', 'locationId', 'status', 'assignment', 'maintenance', 'recharge',
      'rechargeApproved', 'connectionWorkDone', 'inspectionWorkDone', 'overnightStartedDay',
    ])
    && value.drone.id === 'multispectral-survey-drone-001'
    && typeof value.drone.name === 'string'
    && value.drone.locationId === 'hq'
    && ['needs-charge', 'charging', 'available', 'assigned'].includes(value.drone.status as string)
    && (value.drone.assignment === null || SURVEY_TARGETS.includes(value.drone.assignment as string))
    && ['inspection-needed', 'ready'].includes(value.drone.maintenance as string)
    && ['connection', 'overnight', 'inspection', 'complete'].includes(value.drone.recharge as string)
    && isBoolean(value.drone.rechargeApproved)
    && isNonNegativeNumber(value.drone.connectionWorkDone)
    && Number(value.drone.connectionWorkDone) <= 2
    && isNonNegativeNumber(value.drone.inspectionWorkDone)
    && Number(value.drone.inspectionWorkDone) <= 1
    && (value.drone.overnightStartedDay === null || isNonNegativeInteger(value.drone.overnightStartedDay))
    && ((value.drone.status === 'assigned') === (value.drone.assignment !== null)))) return false;

  if (value.drone.status === 'needs-charge') {
    return value.drone.assignment === null
      && value.drone.maintenance === 'inspection-needed'
      && value.drone.recharge === 'connection'
      && value.drone.connectionWorkDone < 2
      && value.drone.inspectionWorkDone === 0
      && value.drone.overnightStartedDay === null;
  }
  if (value.drone.status === 'charging') {
    return value.drone.assignment === null
      && value.drone.maintenance === 'inspection-needed'
      && (value.drone.recharge === 'overnight' || value.drone.recharge === 'inspection')
      && value.drone.rechargeApproved === true
      && value.drone.connectionWorkDone === 2
      && value.drone.inspectionWorkDone === 0
      && value.drone.overnightStartedDay !== null;
  }
  return value.drone.maintenance === 'ready'
    && value.drone.recharge === 'complete'
    && value.drone.rechargeApproved === false
    && value.drone.connectionWorkDone === 2
    && value.drone.inspectionWorkDone === 1
    && value.drone.overnightStartedDay === null;
}

function isOpeningState(value: Record<string, unknown>, state: M0State): boolean {
  if (!isRecord(value.settlement)) return false;
  const settlement = value.settlement;
  if (!hasExactKeys(settlement, [
      'id', 'locationCellId', 'population', 'status', 'registeredPopulation',
      'servedPopulation', 'servedSince', 'workforceEligible', 'workforceAssigned', 'basicProductionUnits', 'services',
    ])
    || settlement.id !== 'opening-settlement-01'
    || typeof settlement.locationCellId !== 'string'
    || !isNonNegativeInteger(settlement.population)
    || Number(settlement.population) !== state.scenario.existingSettlementPopulation
    || Number(settlement.population) < 900
    || Number(settlement.population) > 1_200
    || !['uncontacted', 'contacted', 'services-approved', 'ready-to-integrate', 'served'].includes(settlement.status as string)
    || !['registeredPopulation', 'servedPopulation', 'workforceEligible', 'workforceAssigned', 'basicProductionUnits']
      .every((key) => isNonNegativeInteger(settlement[key]))
    || Number(settlement.registeredPopulation) > Number(settlement.population)
    || Number(settlement.servedPopulation) > Number(settlement.registeredPopulation)
    || (settlement.servedSince !== null && !isDate(settlement.servedSince))
    || Number(settlement.workforceAssigned) > Number(settlement.workforceEligible)
    || !state.map.cells.some((cell) => cell.id === settlement.locationCellId && cell.occupation === 'settlement')
    || !isRecord(settlement.services)
    || !hasExactKeys(settlement.services, [
      'water', 'foodSource', 'foodProcessing', 'power', 'sanitation', 'medical', 'housing', 'registrationComplete',
    ])
    || !isBoolean(settlement.services.registrationComplete)) return false;
  const services = settlement.services;
  for (const service of ['water', 'foodSource', 'foodProcessing', 'power', 'sanitation', 'medical', 'housing']) {
    const capacity = services[service];
    if (!isRecord(capacity)
      || !hasExactKeys(capacity, ['capacity', 'operational'])
      || !isNonNegativeInteger(capacity.capacity)
      || !isBoolean(capacity.operational)) return false;
  }
  if (settlement.basicProductionUnits !== 0 && settlement.basicProductionUnits !== 3) return false;
  const atomicResults: Record<string, boolean> = {
    'opening-water-repair': Number((services.water as Record<string, unknown>).capacity) > 0,
    'opening-food-source': Number((services.foodSource as Record<string, unknown>).capacity) > 0,
    'opening-food-processing': Number((services.foodProcessing as Record<string, unknown>).capacity) > 0,
    'opening-critical-power': Number((services.power as Record<string, unknown>).capacity) > 0,
    'opening-sanitation': Number((services.sanitation as Record<string, unknown>).capacity) > 0,
    'opening-basic-medical': Number((services.medical as Record<string, unknown>).capacity) > 0,
    'opening-housing': Number((services.housing as Record<string, unknown>).capacity) > 0,
    'opening-registration': services.registrationComplete === true,
    'opening-basic-industry': settlement.basicProductionUnits === 3,
  };
  for (const [projectId, resultComplete] of Object.entries(atomicResults)) {
    const projectComplete = state.projects.some((project) => project.id === projectId && project.status === 'complete');
    if (projectComplete !== resultComplete) return false;
  }
  const atomicProjects = state.projects.filter((project) => Object.hasOwn(atomicResults, project.id));
  const allAtomicResults = Object.values(atomicResults).every(Boolean);
  if ((settlement.status === 'ready-to-integrate' || settlement.status === 'served') !== allAtomicResults
    || (settlement.status === 'uncontacted' && atomicProjects.length > 0)
    || (settlement.status === 'contacted' && atomicProjects.length > 0)
    || (settlement.status === 'services-approved' && atomicProjects.length === 0)) return false;
  if (settlement.status === 'served') {
    if (settlement.registeredPopulation !== settlement.population
      || settlement.servedPopulation !== settlement.population
      || settlement.servedSince === null
      || compareGameDates(settlement.servedSince as GameDate, state.calendar) > 0
      || settlement.workforceEligible !== Math.floor(Number(settlement.population) * 0.5)
      || settlement.workforceAssigned !== Math.max(0,
        Number(settlement.workforceEligible) - Math.ceil(Number(settlement.population) * 0.05))) return false;
  } else if (settlement.registeredPopulation !== 0
    || settlement.servedPopulation !== 0
    || settlement.servedSince !== null
    || settlement.workforceEligible !== 0
    || settlement.workforceAssigned !== 0) return false;

  if (!isRecord(value.openingLoop)
    || !hasExactKeys(value.openingLoop, ['continuityMonths', 'currentMonth'])
    || !Array.isArray(value.openingLoop.continuityMonths)
    || value.openingLoop.continuityMonths.length > 3) return false;
  const currentMonth = value.openingLoop.currentMonth;
  if (!isRecord(currentMonth)
    || !hasExactKeys(currentMonth, [
      'year', 'month', 'calendarDays', 'servedDays', 'waterGapDays', 'foodGapDays',
      'criticalServiceGapDays', 'maintenanceGapDays',
    ])
    || !['year', 'month', 'calendarDays', 'servedDays', 'waterGapDays', 'foodGapDays',
      'criticalServiceGapDays', 'maintenanceGapDays'].every((key) => isNonNegativeInteger(currentMonth[key]))
    || Number(currentMonth.month) < 1
    || Number(currentMonth.month) > 12
    || Number(currentMonth.year) !== state.calendar.year
    || Number(currentMonth.month) !== state.calendar.month
    || Number(currentMonth.calendarDays) !== daysInMonth(state.calendar.year, state.calendar.month)
    || Number(currentMonth.calendarDays) < 28
    || Number(currentMonth.calendarDays) > 31
    || Number(currentMonth.servedDays) > Number(currentMonth.calendarDays)
    || Number(currentMonth.waterGapDays) > Number(currentMonth.servedDays)
    || Number(currentMonth.foodGapDays) > Number(currentMonth.servedDays)
    || Number(currentMonth.criticalServiceGapDays) > Number(currentMonth.servedDays)
    || Number(currentMonth.maintenanceGapDays) > Number(currentMonth.servedDays)) return false;
  return value.openingLoop.continuityMonths.every((month) => isRecord(month)
    && hasExactKeys(month, [
      'year', 'month', 'waterMet', 'foodMet', 'criticalServicesOperational',
      'maintenanceRecoverable', 'resourceAccountingConserved',
    ])
    && isNonNegativeInteger(month.year)
    && isNonNegativeInteger(month.month)
    && Number(month.month) >= 1
    && Number(month.month) <= 12
    && ['waterMet', 'foodMet', 'criticalServicesOperational', 'maintenanceRecoverable', 'resourceAccountingConserved']
      .every((key) => isBoolean(month[key])));
}

function isM0State(
  value: unknown,
  expectedVersion = Number(M0_STATE_VERSION),
  expectedDayMs = M0_DAY_MS,
  productionRequired = true,
  openingRequired = expectedVersion >= 9,
): value is M0State {
  const topLevelKeys = [
    'version', 'scenario', 'calendar', 'elapsedDays', 'clock', 'population',
    'dailyPositions', 'workforce', 'staffingShortage', 'feedback', 'stocks', 'monthly',
    'resourceShortages', 'maintenanceBacklog', 'oldRepairableParts',
    'headquartersSalvage', 'waterworks', 'projects', 'map', 'research', 'drone', 'warnings', 'events', 'ui',
    'ledger',
  ];
  if (productionRequired) topLevelKeys.push('production');
  if (openingRequired) topLevelKeys.push('settlement', 'openingLoop');
  if (!isRecord(value)
    || !hasExactKeys(value, topLevelKeys)
    || value.version !== expectedVersion
    || !isRecord(value.scenario)
    || !hasExactKeys(value.scenario, openingRequired ? ['id', 'startDate', 'existingSettlementPopulation'] : ['id', 'startDate'])
    || typeof value.scenario.id !== 'string'
    || value.scenario.id.length === 0
    || !isDate(value.scenario.startDate)
    || (openingRequired && (!isNonNegativeInteger(value.scenario.existingSettlementPopulation)
      || Number(value.scenario.existingSettlementPopulation) < 900
      || Number(value.scenario.existingSettlementPopulation) > 1_200))
    || !isDate(value.calendar)
    || compareGameDates(value.calendar, value.scenario.startDate) < 0
    || !isNonNegativeInteger(value.elapsedDays)
    || gameDateOrdinal(value.calendar) - gameDateOrdinal(value.scenario.startDate) !== value.elapsedDays) return false;

  if (!isRecord(value.clock)
    || !hasExactKeys(value.clock, ['running', 'elapsedMs', 'millisecondsPerDay', 'speed'])
    || !isBoolean(value.clock.running)
    || !isNonNegativeNumber(value.clock.elapsedMs)
    || Number(value.clock.elapsedMs) >= expectedDayMs
    || value.clock.millisecondsPerDay !== expectedDayMs
    || !GAME_SPEEDS.includes(value.clock.speed as number)) return false;

  if (!isRecord(value.population)
    || !hasExactKeys(value.population, ['normal', 'unableToWork', 'critical', 'deceased', 'waterDebt', 'foodDebt'])
    || !['normal', 'unableToWork', 'critical', 'deceased', 'waterDebt', 'foodDebt']
      .every((key) => isNonNegativeInteger((value.population as Record<string, unknown>)[key]))) return false;

  if (!isRecord(value.dailyPositions)
    || !hasExactKeys(value.dailyPositions, ['water', 'food', 'maintenance', 'logistics'])
    || !isNonNegativeInteger(value.dailyPositions.water)
    || !isNonNegativeInteger(value.dailyPositions.food)
    || !isNonNegativeInteger(value.dailyPositions.maintenance)
    || !isNonNegativeInteger(value.dailyPositions.logistics)
    || Number(value.dailyPositions.water) > MODE_STAFF.water.accelerated
    || Number(value.dailyPositions.food) > MODE_STAFF.food.accelerated
    || Number(value.dailyPositions.maintenance) > MODE_STAFF.maintenance.accelerated
    || Number(value.dailyPositions.logistics) > MODE_STAFF.logistics.accelerated) return false;

  if (!isRecord(value.workforce)
    || !hasExactKeys(value.workforce, ['basicDuty', 'water', 'food', 'maintenance', 'logistics', 'research', 'development', 'standby', 'workable'])
    || !['basicDuty', 'water', 'food', 'maintenance', 'logistics', 'research', 'development', 'standby', 'workable']
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
  if (productionRequired && !isProductionState(value.production, openingRequired)) return false;
  if (!isCapabilityState(value, value.projects)) return false;
  const projectIds = value.projects.map((project) => project.id);
  if (new Set(projectIds).size !== projectIds.length) return false;

  const projectWorkers = value.projects
    .filter((project) => project.staffing.source === 'development'
      && !technologies.some((technology) => technology.id === project.id))
    .reduce((sum, project) => sum + project.staffing.actual, 0);
  const workforce = value.workforce as Record<string, number>;
  const assignedWorkers = workforce.basicDuty
    + workforce.water
    + workforce.food
    + workforce.maintenance
    + workforce.logistics
    + workforce.research
    + workforce.development
    + workforce.standby
    + projectWorkers;
  if (assignedWorkers !== workforce.workable) return false;

  const state = value as unknown as M0State;
  if (openingRequired && !isOpeningState(value, state)) return false;
  if (state.workforce.workable !== unifiedWorkablePopulation(state)) return false;
  if (productionRequired) {
    const workshopReady = state.projects.some((project) => project.id === 'repair-precision-workshop' && project.status === 'complete');
    const precisionLine = state.production.lines.find((line) => line.id === 'precision-parts');
    const droneLine = state.production.lines.find((line) => line.id === 'survey-drone');
    const remanufacturingLine = state.production.lines.find((line) => line.id === 'common-parts-remanufacturing');
    const openingFactories = openingRequired ? state.settlement.basicProductionUnits : 0;
    if (state.production.totalFactories !== openingFactories + (workshopReady ? 1 : 0)
      || precisionLine?.workRequired !== 12
      || droneLine?.workRequired !== 18
      || (openingRequired && remanufacturingLine?.workRequired !== 6)
      || state.research.mode !== 'manual'
      || state.research.automaticDomains.length !== 0
      || state.research.roundTarget !== null
      || state.map.surveys.some((survey) => survey.workers !== 2
        || survey.maximumDays !== null
        || survey.useDrone !== true
        || survey.pauseReason === 'route-choice'
        || survey.pauseReason === 'day-limit')) return false;
  }
  const activeResearchProject = state.projects.find((project) => (
    technologies.some((technology) => technology.id === project.id)
      && project.status === 'active'
  ));
  if (state.workforce.research > enabledResearchCapacity(state.research)
    || (activeResearchProject && activeResearchProject.staffing.actual !== state.workforce.research)
    || state.projects.some((project) => technologies.some((technology) => technology.id === project.id)
      && project.status !== 'active'
      && project.staffing.actual !== 0)) return false;
  if (!isMonthlyLedger(value.monthly, state)
    || !isStringArray(value.warnings)
    || !Array.isArray(value.events)
    || !value.events.every((event) => isEvent(event, state.scenario.startDate, state.calendar))
    || new Set(value.events.map((event) => event.id)).size !== value.events.length
    || !isRecord(value.ui)
    || !hasExactKeys(value.ui, ['eventWindow', 'mapRotation'])
    || !isEventWindowPosition(value.ui.eventWindow)
    || !isMapRotation(value.ui.mapRotation)
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

function migrateV7State(value: M0State): M0State {
  const migrated = JSON.parse(JSON.stringify(value)) as M0State;
  const legacyProjects = migrated.projects;
  const workshopReady = legacyProjects.some((project) => project.id === 'repair-precision-workshop' && project.status === 'complete');
  const legacyPrecision = legacyProjects.find((project) => project.id === 'prototype-precision-parts');
  const legacyDrone = legacyProjects.find((project) => project.id === 'assemble-survey-drone');
  (migrated as { version: number }).version = 8;
  migrated.clock.millisecondsPerDay = M0_DAY_MS;
  migrated.clock.elapsedMs = 0;
  migrated.research.mode = 'manual';
  migrated.research.manualQueue = [];
  migrated.research.automaticDomains = [];
  migrated.research.currentProjectId = null;
  migrated.research.currentSource = null;
  migrated.research.roundTarget = null;
  migrated.research.blockedProjectId = null;
  migrated.research.blockedReason = 'no-project';
  for (const survey of migrated.map.surveys) {
    survey.workers = 2;
    survey.maximumDays = null;
    survey.useDrone = true;
    if (survey.stage === 'area' && survey.selectedRouteId === null) {
      survey.selectedRouteId = migrated.map.routes.find((route) => route.targetId === survey.targetId)?.id ?? null;
    }
    const project = legacyProjects.find((candidate) => candidate.id === survey.projectId);
    if (project) {
      project.staffing.planned = 2;
      if (survey.pauseReason === 'route-choice' || survey.pauseReason === 'day-limit') {
        survey.paused = false;
        survey.pauseReason = null;
        project.status = 'active';
        project.pausedReason = null;
      }
    }
  }
  migrated.projects = legacyProjects.filter((project) => (
    !technologies.some((technology) => technology.id === project.id) || project.status === 'complete'
  ) && project.id !== 'prototype-precision-parts' && project.id !== 'assemble-survey-drone');
  migrated.production = {
    totalFactories: workshopReady ? 1 : 0,
    lines: [
      {
        id: 'precision-parts', allocatedFactories: legacyPrecision && legacyPrecision.status !== 'complete' && workshopReady ? 1 : 0,
        progress: legacyPrecision && legacyPrecision.status !== 'complete' ? legacyPrecision.workDone : 0,
        workRequired: 12, batchesCompleted: legacyPrecision?.status === 'complete' ? 1 : 0,
        blockedReason: workshopReady ? null : 'facility-unavailable',
      },
      {
        id: 'survey-drone', allocatedFactories: legacyDrone && legacyDrone.status !== 'complete' && workshopReady ? 1 : 0,
        progress: legacyDrone && legacyDrone.status !== 'complete' ? legacyDrone.workDone : 0,
        workRequired: 18, batchesCompleted: migrated.drone ? 1 : 0,
        blockedReason: workshopReady ? (migrated.research.completed.includes('adapt-survey-drone') ? null : 'technology-locked') : 'facility-unavailable',
      },
    ],
  };
  const totalAllocated = migrated.production.lines.reduce((sum, line) => sum + line.allocatedFactories, 0);
  if (totalAllocated > migrated.production.totalFactories) migrated.production.lines[1].allocatedFactories = 0;
  return migrateV8State(migrated);
}

function normalizeLegacyOpeningMap(value: M0State): M0State {
  const normalized = JSON.parse(JSON.stringify(value)) as M0State;
  const expectedMap = createLocalMap();
  const surveys = normalized.map.surveys;
  const selectedCellId = expectedMap.cells.some((cell) => cell.id === normalized.map.selectedCellId)
    ? normalized.map.selectedCellId
    : expectedMap.selectedCellId;
  normalized.map = {
    ...expectedMap,
    selectedCellId,
    surveys,
  };
  refreshMapIntel(normalized.map);
  return normalized;
}

function migrateV8State(value: M0State): M0State {
  const migrated = normalizeLegacyOpeningMap(value);
  const existingSettlementPopulation = 1_000;
  const opening = createInitialM0State({
    id: migrated.scenario.id,
    startDate: migrated.scenario.startDate,
    existingSettlementPopulation,
  });
  migrated.version = M0_STATE_VERSION;
  migrated.scenario = {
    ...migrated.scenario,
    existingSettlementPopulation,
  };
  migrated.settlement = opening.settlement;
  migrated.openingLoop = opening.openingLoop;
  migrated.production.lines.push({
    id: 'common-parts-remanufacturing',
    allocatedFactories: 0,
    progress: 0,
    workRequired: 6,
    batchesCompleted: 0,
    blockedReason: 'facility-unavailable',
  });
  return migrated;
}

export function loadM0State(storage: StorageLike = window.localStorage): M0State {
  const raw = storage.getItem(M0_SAVE_KEY);
  if (raw === null) {
    const v8Raw = storage.getItem(M0_V8_SAVE_KEY);
    if (v8Raw !== null) {
      try {
        const parsedV8: unknown = JSON.parse(v8Raw);
        if (!isRecord(parsedV8)) return createInitialM0State();
        const validationCopy = normalizeLegacyOpeningMap(parsedV8 as unknown as M0State);
        if (!isM0State(validationCopy, 8, 1_000, true, false)) return createInitialM0State();
        const migrated = migrateV8State(parsedV8 as unknown as M0State);
        if (!isM0State(migrated)) return createInitialM0State();
        saveM0State(migrated, storage);
        storage.removeItem(M0_V8_SAVE_KEY);
        storage.removeItem(M0_LEGACY_SAVE_KEY);
        return migrated;
      } catch {
        return createInitialM0State();
      }
    }
    const legacyRaw = storage.getItem(M0_LEGACY_SAVE_KEY);
    if (legacyRaw === null) return createInitialM0State();
    try {
      const legacy: unknown = JSON.parse(legacyRaw);
      if (!isRecord(legacy)) return createInitialM0State();
      const validationCopy = normalizeLegacyOpeningMap(legacy as unknown as M0State);
      if (!isM0State(validationCopy, 7, 20_000, false, false)) return createInitialM0State();
      const migrated = migrateV7State(validationCopy);
      if (!isM0State(migrated)) return createInitialM0State();
      saveM0State(migrated, storage);
      storage.removeItem(M0_LEGACY_SAVE_KEY);
      return migrated;
    } catch {
      return createInitialM0State();
    }
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isM0State(parsed) ? parsed : createInitialM0State();
  } catch {
    return createInitialM0State();
  }
}

export function clearM0State(storage: StorageLike = window.localStorage): void {
  storage.removeItem(M0_SAVE_KEY);
  storage.removeItem(M0_V8_SAVE_KEY);
  storage.removeItem(M0_LEGACY_SAVE_KEY);
}
