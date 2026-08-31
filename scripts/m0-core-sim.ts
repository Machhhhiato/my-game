import {
  daysInMonth,
  isLeapYear,
  nextGameDate,
} from '../src/m0/calendar';
import { dailyResourceRate, refreshMonthlyProjection } from '../src/m0/economy';
import { M0_LEGACY_SAVE_KEY, M0_V8_SAVE_KEY, clearM0State, loadM0State, saveM0State, type StorageLike } from '../src/m0/save';
import {
  advanceOneDay,
  advanceRealTime,
  approveProject,
  approveRecoveryProject,
  approveOpeningProject,
  availableAmount,
  coverageDays,
  injectTestProject,
  moveProjectInQueue,
  setDailyLinePositions,
  setDailyMode,
  setGameSpeed,
  setHeadquartersSalvageApproval,
  approveCapabilityProject,
  approveSurvey,
  configureSurvey,
  completeDroneRecharge,
  contactExistingSettlement,
  integrateExistingSettlement,
  selectSurveyRoute,
  setResearchDomainAutomatic,
  setResearchDomainOrder,
  setResearchFacilityEnabled,
  setResearchFacilityOpenPositions,
  setResearchMode,
  removeResearchTarget,
  setProductionAllocation,
  setProjectPaused,
  setResearchTarget,
  setSurveyPaused,
  setRunning,
  setOpeningServiceOperational,
} from '../src/m0/simulation';
import { M0_SAVE_KEY, createInitialM0State, livingPopulation, setEventWindowPosition, setMapRotation, workablePopulation } from '../src/m0/state';
import type { M0State, OpeningProjectId, Project, ScenarioConfig } from '../src/m0/types';
import {
  LOCATION_CELLS,
  MAP_ROTATION_LIMITS,
  REGION_MAP,
  futureFarmConclusion,
  intelStageName,
  normalizeRegionCamera,
  projectRegionMap,
  surveyConclusion,
  surveyPlanControlState,
  surveyVisibleFacts,
  visibleCellClass,
  visibleCellTitle,
} from '../src/m0/map';
import { automaticSelectionForDefinitions, enabledResearchCapacity, researchDomainName, technologies, technologyName, type TechnologyDefinition } from '../src/m0/progression';
import { OPENING_PROJECT_RULES, OPENING_SETTLEMENT_CELL_ID, RECOVERY_RULES, openingLoopEvidence } from '../src/m0/openingLoop';

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, label: string): void {
  expect(actual === expected, `${label}: expected ${String(expected)}, got ${String(actual)}`);
}

function advanceDays(state: M0State, days: number): M0State {
  let next = state;
  for (let day = 0; day < days; day += 1) next = advanceOneDay(next);
  return next;
}

function minimumDailyStaffing(state: M0State): M0State {
  let next = setDailyMode(state, 'water', 'minimum');
  next = setDailyMode(next, 'food', 'minimum');
  next = setDailyMode(next, 'maintenance', 'minimum');
  return setDailyMode(next, 'logistics', 'minimum');
}

function scenario(id: string, year: number, month: number, day = 1): ScenarioConfig {
  return { id, startDate: { year, month, day } };
}

function workforceTotal(state: M0State): number {
  const workforce = state.workforce;
  const projectWorkers = state.projects
    .filter((project) => project.staffing.source === 'development'
      && !technologies.some((technology) => technology.id === project.id))
    .reduce((sum, project) => sum + project.staffing.actual, 0);
  return workforce.basicDuty
    + workforce.water
    + workforce.food
    + workforce.maintenance
    + workforce.logistics
    + workforce.research
    + workforce.development
    + workforce.standby
    + projectWorkers;
}

function openingAtomicResults(state: M0State): Record<OpeningProjectId, boolean> {
  return {
    'opening-water-repair': state.settlement.services.water.operational,
    'opening-food-source': state.settlement.services.foodSource.operational,
    'opening-food-processing': state.settlement.services.foodProcessing.operational,
    'opening-critical-power': state.settlement.services.power.operational,
    'opening-sanitation': state.settlement.services.sanitation.operational,
    'opening-basic-medical': state.settlement.services.medical.operational,
    'opening-housing': state.settlement.services.housing.operational,
    'opening-registration': state.settlement.services.registrationComplete,
    'opening-basic-industry': state.settlement.basicProductionUnits > 0,
  };
}

function testProject(
  id: string,
  priority: Project['priority'],
  autoResume = true,
  returnTo: Project['staffing']['returnTo'] = 'development',
): Project {
  return {
    id,
    name: id,
    priority,
    queueOrder: 1,
    status: 'active',
    production: false,
    testOnly: true,
    directRecovery: false,
    autoResume,
    pausedReason: null,
    safeActiveDays: 0,
    staffing: { planned: 2, actual: 0, source: 'development', returnTo },
    workDone: 0,
    workRequired: 0,
    investedResources: {},
  };
}

class MemoryStorage implements StorageLike {
  readonly reads: string[] = [];
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    this.reads.push(key);
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

equal(isLeapYear(2000), true, 'year divisible by 400 is leap');
equal(isLeapYear(1900), false, 'century not divisible by 400 is common');
equal(isLeapYear(2004), true, 'year divisible by four is leap');
equal(isLeapYear(2001), false, 'ordinary year is common');
equal(daysInMonth(2001, 2), 28, 'common February length');
equal(daysInMonth(2000, 2), 29, 'leap February length');
equal(daysInMonth(2001, 4), 30, 'thirty-day month length');
equal(daysInMonth(2001, 1), 31, 'thirty-one-day month length');
equal(JSON.stringify(nextGameDate({ year: 2001, month: 12, day: 31 })), JSON.stringify({ year: 2002, month: 1, day: 1 }), 'calendar crosses year');

const initial = createInitialM0State();
equal(JSON.stringify(initial.calendar), JSON.stringify({ year: 2001, month: 1, day: 1 }), 'test scenario supplies a common-year January first');
equal(initial.clock.running, true, 'a new game starts running without a player command');
equal(initial.clock.speed, 1, 'a new game starts at one-times speed');
expect(!('safetyLines' in initial), 'player safety lines are absent from state');
expect(!JSON.stringify(initial).includes('lockedCost'), 'project shadow cost is absent from state');
expect(!JSON.stringify(initial).includes('"locked"'), 'locked stock is absent from state');
expect(!JSON.stringify(initial).includes('"reserved"'), 'reserved stock is absent from state');
equal(initial.stocks.commonParts.amount, 41, 'approved waterworks cost immediately deducts common parts');
equal(initial.stocks.engineeringComponents.amount, 68, 'approved waterworks cost immediately deducts engineering components');
equal(initial.projects[0].investedResources.commonParts, 4, 'waterworks records actual invested common parts');
equal(initial.projects[0].investedResources.engineeringComponents, 12, 'waterworks records actual invested components');
equal(dailyResourceRate(initial, 'water').outflow, 28, 'before settlement integration the unified water demand contains only the action team');
equal(dailyResourceRate(initial, 'food').outflow, 28, 'before settlement integration the unified food demand contains only the action team');
equal(JSON.stringify(initial.ui.eventWindow), JSON.stringify({ xRatio: 1, yRatio: 0.08 }), 'event window defaults to the map right');
expect(!('populationDelta' in initial), 'transient population pulse is absent from game state');
expect(!JSON.stringify(initial).includes('populationDelta'), 'transient population pulse is absent from save data');

const first = advanceOneDay(initial);
equal(JSON.stringify(first), JSON.stringify(advanceOneDay(createInitialM0State())), 'deterministic first day');
equal(JSON.stringify(first.calendar), JSON.stringify({ year: 2001, month: 1, day: 2 }), 'one day advances the calendar');
equal(first.stocks.water.amount, 280, 'water remains unposted during the month');
equal(first.stocks.food.amount, 560, 'food remains unposted during the month');
equal(first.stocks.commonParts.amount, 41, 'parts remain unposted during the month');
equal(availableAmount(first, 'water'), 280, 'standard day one effective water');
equal(availableAmount(first, 'food'), 562, 'standard day one effective food');
equal(availableAmount(first, 'commonParts'), 41, 'standard day one effective common parts');
equal(first.waterworks.workDone, 3, 'standard day one waterworks');
equal(first.oldRepairableParts, 240, 'standard maintenance returns three used parts to the repairable pool after repairing three');
equal(first.ledger[0].resources.water.inflow, 28, 'standard day one water inflow');
equal(first.ledger[0].resources.water.outflow, 28, 'standard day one water use');
equal(first.ledger[0].resources.food.inflow, 30, 'standard day one food inflow');
equal(first.ledger[0].resources.food.outflow, 28, 'standard day one food use');
equal(first.ledger[0].resources.commonParts.inflow, 3, 'standard day one parts repair');
equal(first.ledger[0].resources.commonParts.outflow, 3, 'standard day one parts use');
equal(first.stocks.water.consumed, 28, 'water consumption remains auditable');
equal(first.stocks.commonParts.consumed, 7, 'project and maintenance consumption are both auditable');
equal(workforceTotal(first), first.workforce.workable, 'standard workforce conservation');

const minimumFood = setDailyMode(createInitialM0State(), 'food', 'minimum');
const minimumFoodDay = advanceOneDay(minimumFood);
equal(minimumFoodDay.ledger[0].resources.food.inflow, 20, 'minimum food inflow');

const minimumMaintenance = setDailyMode(createInitialM0State(), 'maintenance', 'minimum');
const minimumMaintenanceDay = advanceOneDay(minimumMaintenance);
equal(minimumMaintenanceDay.ledger[0].resources.commonParts.inflow, 1, 'minimum maintenance repair');
equal(minimumMaintenanceDay.ledger[0].resources.commonParts.outflow, 2, 'minimum maintenance consumption');
equal(minimumMaintenanceDay.maintenanceBacklog, 10, 'minimum maintenance backlog');

let acceleratedMaintenance = setDailyMode(createInitialM0State(), 'maintenance', 'accelerated');
const acceleratedBacklog = advanceOneDay(acceleratedMaintenance);
equal(acceleratedBacklog.ledger[0].resources.commonParts.inflow, 6, 'accelerated repair with backlog');
equal(acceleratedBacklog.ledger[0].resources.commonParts.outflow, 5, 'accelerated consumption with backlog');
equal(acceleratedBacklog.maintenanceBacklog, 4, 'accelerated backlog reduction');
acceleratedMaintenance.maintenanceBacklog = 0;
refreshMonthlyProjection(acceleratedMaintenance);
const acceleratedClear = advanceOneDay(acceleratedMaintenance);
equal(acceleratedClear.ledger[0].resources.commonParts.inflow, 6, 'accelerated repair without backlog');
equal(acceleratedClear.ledger[0].resources.commonParts.outflow, 3, 'accelerated consumption without backlog');

const tooSmall = createInitialM0State();
tooSmall.population.normal = 8;
const tooSmallDay = advanceOneDay(tooSmall);
equal(tooSmallDay.ledger[0].resources.food.inflow, 0, 'below-minimum food has no ghost output');
equal(tooSmallDay.ledger[0].resources.commonParts.inflow, 0, 'below-minimum maintenance has no ghost output');
equal(tooSmallDay.ledger[0].logisticsProjectCapacity, 0, 'below-minimum logistics has no ghost capacity');
equal(tooSmallDay.maintenanceBacklog, 14, 'missing maintenance workers add real backlog');
expect(tooSmallDay.staffingShortage !== null, 'population shortage is explicit');
const oneWorker = createInitialM0State();
oneWorker.population.normal = 1;
equal(advanceOneDay(oneWorker).ledger[0].resources.water.inflow, 0, 'below-minimum water has no ghost output');

let connectedStaffing = setDailyLinePositions(createInitialM0State(), 'food', 6);
equal(connectedStaffing.workforce.research, 5, 'daily staffing can leave one research position vacant');
connectedStaffing = setDailyLinePositions(connectedStaffing, 'water', 3);
equal(connectedStaffing.dailyPositions.water, 3, 'daily staffing changes one person at a time');
equal(connectedStaffing.workforce.water, 3, 'three selected water positions staff three people');
equal(connectedStaffing.workforce.research, 6, 'a worker released from water fills the vacant research position');
equal(connectedStaffing.projects[0].staffing.planned, 3, 'waterworks plan follows selected water positions');
equal(connectedStaffing.projects[0].staffing.actual, 3, 'waterworks actual staffing follows selected water positions');
equal(advanceOneDay(connectedStaffing).ledger[0].resources.water.inflow, 26, 'a third water worker changes output without waiting for another staffing tier');

const immutableInput = createInitialM0State();
const immutableSnapshot = JSON.stringify(immutableInput);
setDailyMode(immutableInput, 'water', 'accelerated');
equal(JSON.stringify(immutableInput), immutableSnapshot, 'mode change does not mutate its input state');

const approvalBase = createInitialM0State();
const approvedProject = approveProject(
  approvalBase,
  testProject('approved-project', 'P2'),
  { commonParts: 2, engineeringComponents: 3 },
);
equal(approvedProject.stocks.commonParts.amount, approvalBase.stocks.commonParts.amount, 'approval does not prematurely settle monthly common parts');
equal(approvedProject.stocks.engineeringComponents.amount, approvalBase.stocks.engineeringComponents.amount, 'approval does not prematurely settle monthly components');
equal(availableAmount(approvedProject, 'commonParts'), availableAmount(approvalBase, 'commonParts') - 2, 'approval immediately lowers actual available common parts');
equal(availableAmount(approvedProject, 'engineeringComponents'), availableAmount(approvalBase, 'engineeringComponents') - 3, 'approval immediately lowers actual available components');
equal(approvedProject.projects.find((project) => project.id === 'approved-project')?.investedResources.commonParts, 2, 'approved project records spent cost');
const rejectedProject = approveProject(approvalBase, testProject('too-expensive', 'P2'), { alloy: 999 });
equal(rejectedProject.projects.some((project) => project.id === 'too-expensive'), false, 'insufficient actual stock rejects approval');
equal(rejectedProject.stocks.alloy.amount, approvalBase.stocks.alloy.amount, 'rejected approval does not deduct stock');

const commandProjectA = { ...testProject('command-project-a', 'P2'), queueOrder: 300, workRequired: 12 };
const commandProjectB = { ...testProject('command-project-b', 'P2'), queueOrder: 301, workRequired: 12 };
let strategicCommands = injectTestProject(injectTestProject(createInitialM0State(), commandProjectA), commandProjectB);
strategicCommands = setProjectPaused(strategicCommands, 'command-project-a', true);
equal(strategicCommands.projects.find((project) => project.id === 'command-project-a')?.status, 'paused', 'player can pause an engineering project without configuring its execution details');
strategicCommands = setProjectPaused(strategicCommands, 'command-project-a', false);
equal(strategicCommands.projects.find((project) => project.id === 'command-project-a')?.status, 'active', 'player can continue an engineering project');
strategicCommands = moveProjectInQueue(strategicCommands, 'command-project-b', -1);
expect(
  (strategicCommands.projects.find((project) => project.id === 'command-project-b')?.queueOrder ?? 0)
    < (strategicCommands.projects.find((project) => project.id === 'command-project-a')?.queueOrder ?? 0),
  'player can change engineering order without assigning people, shifts or process steps',
);
equal(setProjectPaused(strategicCommands, 'hq-waterworks-restoration', true).projects[0].status, 'active', 'system recovery line is not exposed as a player engineering pause control');

let negativeSegment = setDailyMode(createInitialM0State(), 'water', 'minimum');
negativeSegment = advanceDays(negativeSegment, 10);
equal(negativeSegment.stocks.water.amount, 280, 'negative segment keeps month-opening water unposted');
equal(availableAmount(negativeSegment, 'water'), 240, 'negative segment lowers actual available water');
const overdrawnNegative = approveProject(
  negativeSegment,
  testProject('negative-overdraw', 'P2'),
  { water: 260 },
);
equal(overdrawnNegative.projects.some((project) => project.id === 'negative-overdraw'), false, 'negative segment cannot spend month-opening stock twice');
equal(availableAmount(overdrawnNegative, 'water'), 240, 'rejected negative-segment approval preserves exact available water');
const firstNegativeSpend = approveProject(
  negativeSegment,
  testProject('negative-first-spend', 'P2'),
  { water: 230 },
);
equal(availableAmount(firstNegativeSpend, 'water'), 10, 'accepted negative-segment approval has exact available water');
const repeatedNegativeSpend = approveProject(
  firstNegativeSpend,
  testProject('negative-repeat-spend', 'P2'),
  { water: 20 },
);
equal(repeatedNegativeSpend.projects.some((project) => project.id === 'negative-repeat-spend'), false, 'remaining negative-segment balance cannot be spent again');
equal(availableAmount(repeatedNegativeSpend, 'water'), 10, 'rejected repeated spend preserves remaining water');

const positiveSegment = advanceDays(createInitialM0State(), 10);
equal(positiveSegment.stocks.food.amount, 560, 'positive segment keeps month-opening food unposted');
equal(availableAmount(positiveSegment, 'food'), 580, 'positive segment raises actual available food');
const positiveSpend = approveProject(
  positiveSegment,
  testProject('positive-spend', 'P2'),
  { food: 570 },
);
equal(positiveSpend.projects.some((project) => project.id === 'positive-spend'), true, 'positive segment production can fund an immediate project');
equal(positiveSpend.stocks.food.amount, 560, 'positive-segment approval does not prematurely settle food stock');
equal(availableAmount(positiveSpend, 'food'), 10, 'positive-segment approval has exact available food');
equal(positiveSpend.stocks.food.consumed, positiveSegment.stocks.food.consumed + 570, 'immediate project spending updates cumulative consumption');

const completion = advanceDays(createInitialM0State(), 8);
equal(completion.waterworks.repaired, true, 'waterworks completes after eight standard days');
equal(completion.stocks.commonParts.amount, 41, 'completion does not deduct project cost a second time');
equal(completion.stocks.engineeringComponents.amount, 68, 'components were already paid at approval');

const noParts = createInitialM0State();
noParts.oldRepairableParts = 0;
noParts.stocks.commonParts.amount = 0;
refreshMonthlyProjection(noParts);
equal(coverageDays(noParts, 'commonParts'), 0, 'zero actual parts produce zero coverage');
const noPartsDay = advanceOneDay(noParts);
equal(noPartsDay.ledger[0].resources.commonParts.inflow, 0, 'exhausted old parts produce no parts');
equal(noPartsDay.ledger[0].resources.commonParts.outflow, 0, 'routine maintenance cannot consume absent parts');
equal(noPartsDay.maintenanceBacklog, 14, 'missing maintenance parts become backlog');

let approvedSalvage = setDailyMode(createInitialM0State(), 'maintenance', 'accelerated');
approvedSalvage = setHeadquartersSalvageApproval(approvedSalvage, true);
approvedSalvage.oldRepairableParts = 0;
approvedSalvage.maintenanceBacklog = 0;
approvedSalvage.stocks.commonParts.amount = 16;
refreshMonthlyProjection(approvedSalvage);
const approvedSalvageDay = advanceOneDay(approvedSalvage);
equal(approvedSalvageDay.ledger[0].resources.commonParts.inflow, 4, 'approved low-efficiency salvage produces four parts');
equal(approvedSalvageDay.ledger[0].resources.commonParts.outflow, 3, 'approved low-efficiency salvage pays routine maintenance');
equal(availableAmount(approvedSalvageDay, 'commonParts'), 17, 'approved low-efficiency salvage nets one part');
equal(approvedSalvageDay.headquartersSalvage.dismantledItems, 1, 'salvage records lost headquarters item');

const fullPartsStore = createInitialM0State();
fullPartsStore.stocks.commonParts.amount = fullPartsStore.stocks.commonParts.capacity;
refreshMonthlyProjection(fullPartsStore);
const fullPartsStoreDay = advanceOneDay(fullPartsStore);
equal(availableAmount(fullPartsStoreDay, 'commonParts'), 90, 'full parts store remains at capacity');
equal(fullPartsStoreDay.ledger[0].resources.commonParts.overflow, 0, 'repair stops instead of discarding overflow');
equal(fullPartsStoreDay.oldRepairableParts, 240, 'same-day maintenance use returns repaired parts to the repairable pool at a full store');

let stableSafety = createInitialM0State();
stableSafety.stocks.water.amount = 140;
stableSafety = injectTestProject(stableSafety, testProject('safety-p1', 'P1'));
stableSafety = injectTestProject(stableSafety, testProject('safety-p2', 'P2'));
stableSafety = injectTestProject(stableSafety, testProject('safety-p3', 'P3'));
const stableSafetyDay = advanceOneDay(stableSafety);
equal(stableSafetyDay.projects.find((project) => project.id === 'safety-p1')?.status, 'active', 'stable operating guard keeps P1');
equal(stableSafetyDay.projects.find((project) => project.id === 'safety-p2')?.status, 'active', 'stable operating guard keeps P2');
equal(stableSafetyDay.projects.find((project) => project.id === 'safety-p3')?.status, 'paused', 'operating guard pauses P3 first');

let decliningSafety = setDailyMode(createInitialM0State(), 'water', 'minimum');
decliningSafety.stocks.water.amount = 144;
decliningSafety = injectTestProject(decliningSafety, testProject('declining-p1', 'P1'));
decliningSafety = injectTestProject(decliningSafety, testProject('declining-p2', 'P2'));
decliningSafety = injectTestProject(decliningSafety, testProject('declining-p3', 'P3'));
const decliningSafetyDay = advanceOneDay(decliningSafety);
equal(decliningSafetyDay.projects.find((project) => project.id === 'declining-p1')?.status, 'active', 'declining guard keeps P1 above hard forecast');
equal(decliningSafetyDay.projects.find((project) => project.id === 'declining-p2')?.status, 'paused', 'declining guard pauses P2');
equal(decliningSafetyDay.projects.find((project) => project.id === 'declining-p3')?.status, 'paused', 'declining guard pauses P3');

let hardSoon = setDailyMode(createInitialM0State(), 'water', 'minimum');
hardSoon.stocks.water.amount = 65;
hardSoon = injectTestProject(hardSoon, testProject('hard-soon-p1', 'P1'));
const hardSoonDay = advanceOneDay(hardSoon);
equal(availableAmount(hardSoonDay, 'water'), 61, 'hard-floor forecast fixture remains above current hard floor');
equal(hardSoonDay.projects.find((project) => project.id === 'hard-soon-p1')?.status, 'paused', 'P1 pauses when two-day forecast reaches hard floor');

let hard = setDailyMode(createInitialM0State(), 'water', 'minimum');
hard.stocks.water.amount = 60;
hard = injectTestProject(hard, testProject('test-p1', 'P1'));
hard = injectTestProject(hard, testProject('test-p2', 'P2'));
hard = injectTestProject(hard, testProject('test-p3', 'P3'));
equal(workforceTotal(hard), hard.workforce.workable, 'active project staff are counted before pause');
const hardDay = advanceOneDay(hard);
for (const id of ['test-p1', 'test-p2', 'test-p3']) {
  equal(hardDay.projects.find((project) => project.id === id)?.status, 'paused', `hard floor pauses ${id}`);
}
equal(hardDay.projects.find((project) => project.id === 'hq-waterworks-restoration')?.status, 'active', 'direct recovery remains active');
equal(workforceTotal(hardDay), hardDay.workforce.workable, 'paused staff return without ghost workers');

let waiting = setDailyMode(createInitialM0State(), 'water', 'minimum');
waiting.stocks.water.amount = 60;
waiting = injectTestProject(waiting, testProject('test-no-auto', 'P3', false, null));
const waitingDay = advanceOneDay(waiting);
equal(waitingDay.projects.find((project) => project.id === 'test-no-auto')?.status, 'waiting_confirmation', 'missing authorization and return plan waits for confirmation');
equal(waitingDay.workforce.standby, 2, 'project without return plan keeps people on standby');
equal(workforceTotal(waitingDay), waitingDay.workforce.workable, 'standby people remain in workforce accounting');

let recovery = createInitialM0State();
recovery = injectTestProject(recovery, testProject('recover-p1', 'P1'));
recovery = injectTestProject(recovery, testProject('recover-p2', 'P2'));
recovery = injectTestProject(recovery, testProject('recover-p3', 'P3'));
for (const project of recovery.projects.filter((item) => item.testOnly)) {
  project.status = 'paused';
  project.staffing.actual = 0;
}
const recoveryP1 = advanceOneDay(recovery);
equal(recoveryP1.projects.find((project) => project.id === 'recover-p1')?.status, 'active', 'recovery starts P1');
const recoveryP2 = advanceOneDay(recoveryP1);
equal(recoveryP2.projects.find((project) => project.id === 'recover-p2')?.status, 'active', 'recovery waits one daylight then starts P2');
const recoveryP3 = advanceOneDay(recoveryP2);
equal(recoveryP3.projects.find((project) => project.id === 'recover-p3')?.status, 'active', 'recovery waits one daylight then starts P3');
equal(workforceTotal(recoveryP3), recoveryP3.workforce.workable, 'resumed project staff are conserved');

let survivors = createInitialM0State();
survivors = setDailyMode(survivors, 'water', 'minimum');
survivors = setDailyMode(survivors, 'food', 'minimum');
survivors = setDailyMode(survivors, 'maintenance', 'minimum');
survivors = setDailyMode(survivors, 'logistics', 'minimum');
survivors.population.normal = 15;
const survivorDay = advanceOneDay(survivors);
equal(survivorDay.workforce.basicDuty, 4, 'fifteen survivors need four basic-duty workers');
equal(survivorDay.workforce.research, 2, 'fifteen survivors fill two research positions after essential work');
equal(workforceTotal(survivorDay), 15, 'fifteen-survivor workforce is conserved');

const shortage = createInitialM0State();
shortage.stocks.water.amount = 0;
shortage.stocks.food.amount = 0;
shortage.dailyPositions.water = 2;
shortage.dailyPositions.food = 3;
shortage.dailyPositions.logistics = 2;
refreshMonthlyProjection(shortage);
const shortageDay = advanceOneDay(shortage);
equal(shortageDay.population.waterDebt, 1, 'water debt updates on the actual shortage day');
equal(shortageDay.population.foodDebt, 1, 'food debt updates on the actual shortage day');
equal(shortageDay.population.unableToWork, 28, 'water shortage removes working population');
equal(shortageDay.workforce.workable, 0, 'workable population is recalculated');
equal(shortageDay.events.filter((event) => event.kind === 'resource_shortage').length, 2, 'shortage transitions create factual events once');

const january = advanceDays(createInitialM0State(), 31);
equal(JSON.stringify(january.calendar), JSON.stringify({ year: 2001, month: 2, day: 1 }), 'January settles on February first');
equal(january.stocks.water.amount, 420, 'January water applies once at month settlement with capacity');
equal(january.stocks.food.amount, 622, 'January food applies once at month settlement');
equal(january.stocks.commonParts.amount, 41, 'January common parts apply once at month settlement');
equal(january.monthly.processedDays, 0, 'new month starts with an empty accumulation');
equal(january.monthly.resources.food.openingAmount, 622, 'new month records settled opening stock');
equal(january.ledger.at(-1)?.monthSettled, true, 'last January day records month settlement');

equal(JSON.stringify(advanceDays(createInitialM0State(scenario('common-february', 1900, 2)), 28).calendar), JSON.stringify({ year: 1900, month: 3, day: 1 }), 'common-century February advances after 28 days');
equal(JSON.stringify(advanceDays(createInitialM0State(scenario('leap-february', 2000, 2)), 29).calendar), JSON.stringify({ year: 2000, month: 3, day: 1 }), '400-year leap February advances after 29 days');
equal(JSON.stringify(advanceDays(createInitialM0State(scenario('april', 2001, 4)), 30).calendar), JSON.stringify({ year: 2001, month: 5, day: 1 }), 'thirty-day month advances correctly');
equal(JSON.stringify(advanceDays(createInitialM0State(scenario('december', 2001, 12)), 31).calendar), JSON.stringify({ year: 2002, month: 1, day: 1 }), 'December settlement crosses year');

let segmented = advanceDays(createInitialM0State(), 10);
equal(availableAmount(segmented, 'food'), 580, 'first ten standard days accrue before a rate change');
segmented = setDailyMode(segmented, 'food', 'minimum');
equal(segmented.monthly.resources.food.projectedClosingAmount, 412, 'first rate change forecasts only remaining real days');
segmented = advanceDays(segmented, 10);
segmented = setDailyMode(segmented, 'food', 'accelerated');
equal(segmented.monthly.resources.food.projectedClosingAmount, 654, 'second rate change preserves both earlier segments');
segmented = advanceDays(segmented, 11);
equal(segmented.stocks.food.amount, 654, 'two mid-month rate changes settle by actual segment lengths');

let waterExhaustion = setDailyMode(createInitialM0State(), 'water', 'minimum');
waterExhaustion.stocks.water.amount = 8;
refreshMonthlyProjection(waterExhaustion);
equal(JSON.stringify(waterExhaustion.monthly.resources.water.exhaustionDate), JSON.stringify({ year: 2001, month: 1, day: 3 }), 'water predicts the earliest real exhaustion date');
waterExhaustion = advanceDays(waterExhaustion, 2);
equal(waterExhaustion.population.waterDebt, 0, 'water remains sufficient through the day it reaches zero');
waterExhaustion = advanceOneDay(waterExhaustion);
equal(waterExhaustion.population.waterDebt, 1, 'water shortage begins on the predicted day');
equal(waterExhaustion.events.some((event) => event.kind === 'resource_shortage' && event.relatedId === 'water' && event.date.day === 3), true, 'water exhaustion records the correct dated event');

let foodExhaustion = setDailyMode(createInitialM0State(), 'food', 'minimum');
foodExhaustion.stocks.food.amount = 16;
refreshMonthlyProjection(foodExhaustion);
equal(JSON.stringify(foodExhaustion.monthly.resources.food.exhaustionDate), JSON.stringify({ year: 2001, month: 1, day: 3 }), 'food predicts the earliest real exhaustion date');
foodExhaustion = advanceDays(foodExhaustion, 3);
equal(foodExhaustion.population.foodDebt, 1, 'food shortage begins on the predicted day');

const pausedTime = advanceRealTime(setRunning(createInitialM0State(), false), 1_000);
equal(pausedTime.elapsedDays, 0, 'paused time does not advance');
const runningTime = setRunning(pausedTime, true);
equal(advanceRealTime(runningTime, 999).elapsedDays, 0, 'less than one second does not settle a day');
equal(advanceRealTime(runningTime, 1_000).elapsedDays, 1, 'restarting after pause continues one-second daily progression');
const fastBase = setGameSpeed(setRunning(createInitialM0State(), true), 4);
const fastResult = advanceRealTime(fastBase, 1_000);
const sequentialResult = advanceDays(fastBase, 4);
equal(JSON.stringify(fastResult.calendar), JSON.stringify(sequentialResult.calendar), 'four-times speed still advances every calendar day in sequence');
equal(JSON.stringify(fastResult.monthly), JSON.stringify(sequentialResult.monthly), 'four-times speed matches sequential monthly accounting');
equal(JSON.stringify(fastResult.projects), JSON.stringify(sequentialResult.projects), 'four-times speed does not skip project days');
const monthBoundaryFastBase = setGameSpeed(setRunning(createInitialM0State(scenario('month-boundary-fast', 2001, 1, 29)), true), 4);
const monthBoundaryFast = advanceRealTime(monthBoundaryFastBase, 1_000);
const monthBoundarySequential = advanceDays(setRunning(createInitialM0State(scenario('month-boundary-fast', 2001, 1, 29)), true), 4);
equal(JSON.stringify(monthBoundaryFast), JSON.stringify({ ...monthBoundarySequential, clock: monthBoundaryFast.clock }), 'four-times speed crosses natural month settlement exactly like four sequential days');
let speedSequence = setRunning(createInitialM0State(), true);
speedSequence = advanceRealTime(setGameSpeed(speedSequence, 1), 500);
speedSequence = advanceRealTime(setGameSpeed(speedSequence, 2), 250);
speedSequence = advanceRealTime(setGameSpeed(speedSequence, 4), 250);
equal(speedSequence.elapsedDays, 2, 'changing speeds retains partial time and advances two full days');
equal(JSON.stringify(speedSequence.ledger.map((entry) => entry.date)), JSON.stringify([
  { year: 2001, month: 1, day: 1 },
  { year: 2001, month: 1, day: 2 },
]), 'speed changes process every calendar day in order');

const storage = new MemoryStorage();
saveM0State(first, storage);
const loaded = loadM0State(storage);
equal(JSON.stringify(advanceOneDay(loaded)), JSON.stringify(advanceOneDay(first)), 'save reload has deterministic next day');
const positionedStorage = new MemoryStorage();
const positionedState = setEventWindowPosition(first, { xRatio: 0.34, yRatio: 0.61 });
saveM0State(positionedState, positionedStorage);
equal(JSON.stringify(loadM0State(positionedStorage).ui.eventWindow), JSON.stringify({ xRatio: 0.34, yRatio: 0.61 }), 'event window position reloads exactly');
equal(JSON.stringify(advanceOneDay(loadM0State(positionedStorage))), JSON.stringify(advanceOneDay(positionedState)), 'event window position keeps next-day simulation deterministic');
equal(JSON.stringify(setEventWindowPosition(first, { xRatio: -2, yRatio: 5 }).ui.eventWindow), JSON.stringify({ xRatio: 0, yRatio: 1 }), 'runtime event window updates remain within normalized bounds');
equal(JSON.stringify(setEventWindowPosition(positionedState, { xRatio: Number.NaN, yRatio: Number.POSITIVE_INFINITY }).ui.eventWindow), JSON.stringify({ xRatio: 0.34, yRatio: 0.61 }), 'runtime non-finite event window updates retain the last legal position');
const midMonthStorage = new MemoryStorage();
const midMonthState = setDailyMode(advanceDays(createInitialM0State(), 10), 'food', 'minimum');
saveM0State(midMonthState, midMonthStorage);
equal(JSON.stringify(advanceOneDay(loadM0State(midMonthStorage))), JSON.stringify(advanceOneDay(midMonthState)), 'save reload preserves segmented month accounting');
const approvalStorage = new MemoryStorage();
saveM0State(positiveSpend, approvalStorage);
const loadedPositiveSpend = loadM0State(approvalStorage);
equal(availableAmount(loadedPositiveSpend, 'food'), 10, 'save reload preserves immediate mid-month project spending');
const settledPositiveSpend = advanceDays(positiveSpend, 21);
const settledLoadedPositiveSpend = advanceDays(loadedPositiveSpend, 21);
equal(JSON.stringify(settledLoadedPositiveSpend), JSON.stringify(settledPositiveSpend), 'mid-month project spending reloads and settles deterministically');
equal(settledPositiveSpend.stocks.food.amount, 52, 'month settlement applies continuous food segments and immediate spending exactly once');
const exhaustionStorage = new MemoryStorage();
let exhaustionState = setDailyMode(createInitialM0State(), 'water', 'minimum');
exhaustionState.stocks.water.amount = 8;
refreshMonthlyProjection(exhaustionState);
saveM0State(exhaustionState, exhaustionStorage);
equal(JSON.stringify(loadM0State(exhaustionStorage).monthly.resources.water.exhaustionDate), JSON.stringify({ year: 2001, month: 1, day: 3 }), 'save reload preserves deterministic exhaustion node');
storage.values.set(M0_SAVE_KEY, '{broken');
equal(loadM0State(storage).elapsedDays, 0, 'broken M0 save resets to initial state');
storage.values.set(M0_SAVE_KEY, JSON.stringify({ version: 9 }));
equal(loadM0State(storage).elapsedDays, 0, 'incomplete same-version save resets to initial state');

const malformedProject = JSON.parse(JSON.stringify(first)) as M0State;
delete (malformedProject.projects[0] as Partial<Project>).staffing;
storage.values.set(M0_SAVE_KEY, JSON.stringify(malformedProject));
equal(loadM0State(storage).elapsedDays, 0, 'malformed project resets safely');
const invalidPositions = JSON.parse(JSON.stringify(first)) as M0State;
invalidPositions.dailyPositions.water = 99;
storage.values.set(M0_SAVE_KEY, JSON.stringify(invalidPositions));
equal(loadM0State(storage).elapsedDays, 0, 'invalid daily positions reset safely');
const invalidCalendar = JSON.parse(JSON.stringify(first)) as M0State;
invalidCalendar.calendar = { year: 2001, month: 2, day: 29 };
storage.values.set(M0_SAVE_KEY, JSON.stringify(invalidCalendar));
equal(loadM0State(storage).elapsedDays, 0, 'invalid calendar date resets safely');
const invalidMonthly = JSON.parse(JSON.stringify(first)) as M0State;
invalidMonthly.monthly.processedDays = 0;
storage.values.set(M0_SAVE_KEY, JSON.stringify(invalidMonthly));
equal(loadM0State(storage).elapsedDays, 0, 'calendar and month accumulation mismatch resets safely');
const invalidProjection = JSON.parse(JSON.stringify(first)) as M0State;
invalidProjection.monthly.resources.food.projectedClosingAmount += 1;
storage.values.set(M0_SAVE_KEY, JSON.stringify(invalidProjection));
equal(loadM0State(storage).elapsedDays, 0, 'corrupt monthly prediction resets safely');
const shadowStock = JSON.parse(JSON.stringify(first)) as M0State;
(shadowStock.stocks.water as unknown as Record<string, unknown>).reserved = 1;
storage.values.set(M0_SAVE_KEY, JSON.stringify(shadowStock));
equal(loadM0State(storage).elapsedDays, 0, 'same-version shadow stock field is rejected');
const shadowProject = JSON.parse(JSON.stringify(first)) as M0State;
(shadowProject.projects[0] as unknown as Record<string, unknown>).lockedCost = {};
storage.values.set(M0_SAVE_KEY, JSON.stringify(shadowProject));
equal(loadM0State(storage).elapsedDays, 0, 'same-version shadow project cost is rejected');
const invalidEvents = JSON.parse(JSON.stringify(shortageDay)) as M0State;
invalidEvents.events[0].date = { year: 2001, month: 2, day: 30 };
storage.values.set(M0_SAVE_KEY, JSON.stringify(invalidEvents));
equal(loadM0State(storage).elapsedDays, 0, 'invalid persisted event date resets safely');
const invalidEventPosition = JSON.parse(JSON.stringify(first)) as M0State;
invalidEventPosition.ui.eventWindow.xRatio = -0.01;
storage.values.set(M0_SAVE_KEY, JSON.stringify(invalidEventPosition));
equal(JSON.stringify(loadM0State(storage).ui.eventWindow), JSON.stringify({ xRatio: 1, yRatio: 0.08 }), 'out-of-range saved event window position resets safely');
const nonFiniteEventPosition = JSON.parse(JSON.stringify(first)) as M0State;
nonFiniteEventPosition.ui.eventWindow.yRatio = Number.NaN;
storage.values.set(M0_SAVE_KEY, JSON.stringify(nonFiniteEventPosition));
equal(JSON.stringify(loadM0State(storage).ui.eventWindow), JSON.stringify({ xRatio: 1, yRatio: 0.08 }), 'non-finite saved event window position resets safely');
const savedPopulationPulse = JSON.parse(JSON.stringify(first)) as M0State & { populationDelta?: number };
savedPopulationPulse.populationDelta = -1;
storage.values.set(M0_SAVE_KEY, JSON.stringify(savedPopulationPulse));
equal(loadM0State(storage).elapsedDays, 0, 'transient population pulse is rejected from the strict save schema');

const oldOnly = new MemoryStorage();
oldOnly.values.set('always-game-m0-v1', JSON.stringify(first));
loadM0State(oldOnly);
expect(oldOnly.reads.every((key) => key === M0_SAVE_KEY || key === M0_V8_SAVE_KEY || key === M0_LEGACY_SAVE_KEY), 'only current and explicit v8/v7 migration keys are read');
const olderOnly = new MemoryStorage();
olderOnly.values.set('always-game-text-idle-v6', JSON.stringify(first));
loadM0State(olderOnly);
expect(olderOnly.reads.every((key) => key === M0_SAVE_KEY || key === M0_V8_SAVE_KEY || key === M0_LEGACY_SAVE_KEY), 'pre-M0 save key is never read');

const v8Storage = new MemoryStorage();
const v8State = JSON.parse(JSON.stringify(first)) as unknown as Record<string, unknown>;
delete v8State.settlement;
delete v8State.openingLoop;
delete (v8State.scenario as Record<string, unknown>).existingSettlementPopulation;
((v8State.production as Record<string, unknown>).lines as Array<Record<string, unknown>>) = ((v8State.production as Record<string, unknown>).lines as Array<Record<string, unknown>>)
  .filter((line) => line.id !== 'common-parts-remanufacturing');
v8State.version = 8;
const v8SettlementCell = ((v8State.map as Record<string, unknown>).cells as Array<Record<string, unknown>>)
  .find((cell) => cell.id === OPENING_SETTLEMENT_CELL_ID)!;
Object.assign(v8SettlementCell, { terrain: 'plain', occupation: 'empty', water: 'dry', intel: 'unknown' });
v8Storage.values.set(M0_V8_SAVE_KEY, JSON.stringify(v8State));
const migratedV8 = loadM0State(v8Storage);
equal(migratedV8.version, 9, 'strict v8 save migrates to v9');
equal(migratedV8.settlement.population, 1_000, 'v8 migration adds the deterministic opening settlement source');
equal(migratedV8.production.lines.some((line) => line.id === 'common-parts-remanufacturing'), true, 'v8 migration adds the persistent basic-industry production row');
equal(v8Storage.values.has(M0_V8_SAVE_KEY), false, 'successful v8 migration consumes the explicit v8 key');
expect(v8Storage.values.has(M0_SAVE_KEY), 'successful v8 migration writes the strict v9 save');

const legacyStorage = new MemoryStorage();
const legacyState = JSON.parse(JSON.stringify(v8State)) as Record<string, unknown>;
delete legacyState.production;
legacyState.version = 7;
(legacyState.clock as Record<string, unknown>).millisecondsPerDay = 20_000;
legacyStorage.values.set(M0_LEGACY_SAVE_KEY, JSON.stringify(legacyState));
const migratedLegacy = loadM0State(legacyStorage);
equal(migratedLegacy.version, 9, 'strict v7 save migrates through v8 to v9');
equal(migratedLegacy.clock.millisecondsPerDay, 1_000, 'v7 migration adopts the one-second day');
equal(migratedLegacy.research.manualQueue.length, 0, 'v7 migration does not preserve old automatic research authorization');
expect(legacyStorage.values.has(M0_SAVE_KEY), 'successful v7 migration writes the strict v9 save');
equal(legacyStorage.values.has(M0_LEGACY_SAVE_KEY), false, 'successful v7 migration consumes the explicit legacy key');
const corruptLegacyStorage = new MemoryStorage();
const corruptLegacy = JSON.parse(JSON.stringify(legacyState)) as Record<string, unknown>;
corruptLegacy.unrecognizedField = true;
corruptLegacyStorage.values.set(M0_LEGACY_SAVE_KEY, JSON.stringify(corruptLegacy));
equal(JSON.stringify(loadM0State(corruptLegacyStorage)), JSON.stringify(createInitialM0State()), 'v7 migration rejects an old save that fails the exact legacy schema');
equal(corruptLegacyStorage.values.has(M0_SAVE_KEY), false, 'rejected v7 save is never rewritten as v9');

const timeStorage = new MemoryStorage();
saveM0State(setRunning(createInitialM0State(), true), timeStorage);
equal(loadM0State(timeStorage).elapsedDays, 0, 'save reload has no offline progression');
const pausedStorage = new MemoryStorage();
saveM0State(setRunning(createInitialM0State(), false), pausedStorage);
equal(loadM0State(pausedStorage).clock.running, false, 'explicit load preserves a saved paused clock');
const clearStorage = new MemoryStorage();
clearStorage.values.set(M0_SAVE_KEY, JSON.stringify(first));
clearStorage.values.set(M0_V8_SAVE_KEY, JSON.stringify(v8State));
clearStorage.values.set(M0_LEGACY_SAVE_KEY, JSON.stringify(legacyState));
clearM0State(clearStorage);
equal(clearStorage.values.has(M0_SAVE_KEY), false, 'new-game clearing removes the v9 save key');
equal(clearStorage.values.has(M0_V8_SAVE_KEY), false, 'new-game clearing removes the v8 legacy key');
equal(clearStorage.values.has(M0_LEGACY_SAVE_KEY), false, 'new-game clearing removes the v7 legacy key');
const clearedState = loadM0State(clearStorage);
equal(clearedState.elapsedDays, 0, 'cleared storage cannot revive the previous v7 game');
equal(clearedState.clock.running, true, 'a fresh state after clearing resumes default idle progression');

const capabilityMap = createInitialM0State();
equal(capabilityMap.map.cells.length, 469, 'regional map has the accepted standard-cell coverage');
equal(REGION_MAP.kind, 'continuous-region', 'map presentation identifies a continuous region');
equal(REGION_MAP.contentCellCount, 469, 'regional rules layer contains the deterministic radius-twelve grid');
equal(REGION_MAP.spanKm, 24, 'regional map stays inside the accepted twenty-to-thirty kilometre scale');
equal(capabilityMap.map.cells.every((cell) => cell.neighbors.length >= 3 && cell.neighbors.length <= 6), true, 'regional rules layer has stable adjacency');
equal(capabilityMap.map.cells.filter((cell) => cell.occupation === 'industrial-ruin').length, 2, 'two industrial ruins are anchored');
equal(JSON.stringify(createInitialM0State().map), JSON.stringify(createInitialM0State().map), 'regional map is deterministic');
equal(capabilityMap.map.cells.every((cell) => cell.neighbors.every((neighborId) => (
  capabilityMap.map.cells.find((neighbor) => neighbor.id === neighborId)?.neighbors.includes(cell.id)
))), true, 'regional rules-layer adjacency is symmetric');
const regionalProjection = projectRegionMap(capabilityMap.map.cells);
equal(regionalProjection.length, REGION_MAP.contentCellCount, 'every rules cell has one stable regional projection');
equal(regionalProjection.map((cell) => cell.id).join('|'), capabilityMap.map.cells.map((cell) => cell.id).join('|'), 'regional projection preserves stable object ordering and IDs');
const centerProjection = regionalProjection.find((cell) => cell.id === LOCATION_CELLS.headquarters)!;
const centerNeighborProjection = regionalProjection.find((cell) => cell.id === 'local-1-0')!;
equal(centerProjection.points.split(' ').length, 6, 'each regional rules cell projects one standard six-corner outline');
expect(Math.hypot(centerProjection.center.x - centerNeighborProjection.center.x, centerProjection.center.y - centerNeighborProjection.center.y) > 0, 'adjacent regional anchors keep distinct world coordinates');
const mapLogicBeforeCamera = JSON.stringify(capabilityMap.map);
const camera = normalizeRegionCamera({ x: 9_999, y: -9_999, zoom: 99 });
equal(camera.zoom, 2.6, 'continuous regional zoom clamps to the accepted local maximum');
equal(JSON.stringify(capabilityMap.map), mapLogicBeforeCamera, 'camera normalization does not change stable map IDs, anchors, selection or intelligence');
equal(JSON.stringify(projectRegionMap(capabilityMap.map.cells)), JSON.stringify(regionalProjection), 'same seed and state reproduce identical regional positions');
const rotatedMapState = setMapRotation(capabilityMap, { yaw: 99, pitch: -99 });
equal(rotatedMapState.ui.mapRotation.yaw, MAP_ROTATION_LIMITS.yaw, 'legacy v9 camera metadata still clamps during save migration');
equal(rotatedMapState.ui.mapRotation.pitch, -MAP_ROTATION_LIMITS.pitch, 'legacy v9 camera metadata still clamps during save migration');
const rotationStorage = new MemoryStorage();
saveM0State(rotatedMapState, rotationStorage);
equal(JSON.stringify(loadM0State(rotationStorage).ui.mapRotation), JSON.stringify(rotatedMapState.ui.mapRotation), 'legacy camera metadata survives strict v9 save reload');
for (const anchorId of Object.values(LOCATION_CELLS)) {
  equal(capabilityMap.map.cells.some((cell) => cell.id === anchorId), true, `stable location anchor ${anchorId} exists`);
}
const hiddenRuinCells = capabilityMap.map.cells.filter((cell) => cell.occupation === 'industrial-ruin');
equal(hiddenRuinCells.every((cell) => visibleCellClass(cell) === 'unknown'), true, 'opening map does not reveal ruins through cell classes');
equal(hiddenRuinCells.every((cell) => visibleCellTitle(cell) === '尚未确认的地表'), true, 'opening map does not reveal ruins through titles');
equal(surveyVisibleFacts('ruin-a', 'direction').join('').includes('工程构件'), false, 'direction clue does not reveal site resources');
equal(surveyVisibleFacts('ruin-b', 'area').join('').includes('受损通路'), false, 'area confirmation does not reveal route damage');
equal(surveyConclusion('ruin-a', 'route'), null, 'site conclusion stays hidden at route confirmation');
equal(surveyConclusion('ruin-a', 'site')?.label, '适合', 'ruin A site conclusion is suitable');
equal(surveyConclusion('ruin-b', 'site')?.label, '有条件适合', 'ruin B site conclusion requires route work');
equal(futureFarmConclusion('area'), null, 'future farm conclusion stays hidden without site facts');
equal(futureFarmConclusion('site')?.label, '不可用', 'future farm is unusable for a salvage outpost once facts suffice');
equal(capabilityMap.map.cells.find((cell) => cell.id === LOCATION_CELLS.futureFarm)?.intel, 'site', 'known future farm starts with enough local facts for its frozen salvage conclusion');
equal(JSON.stringify(surveyPlanControlState(capabilityMap.map.surveys[0])), JSON.stringify({ editable: true, needsApproval: true, canTogglePause: false }), 'unapproved survey shows editable plan controls and one approval action');
equal(['direction', 'area', 'route', 'site'].map((stage) => intelStageName(stage as M0State['map']['surveys'][number]['stage'])).join('|'), '方向线索|范围确认|路线确认|现场确认', 'player intelligence labels never expose internal stage enums');
equal(['manufacturing', 'surveying', 'engineering'].map((domain) => researchDomainName(domain as M0State['research']['domainOrder'][number])).join('|'), '制造与材料|勘测与地图|工程与后勤', 'player research labels never expose internal domain enums');
equal(technologies.every((technology) => technologyName(technology.id) !== technology.id), true, 'every player-facing research target has a readable name');

const syntheticDefinitions: TechnologyDefinition[] = [
  { id: 'synthetic-manufacturing-1', name: '测试制造入口一', domain: 'manufacturing', stage: 1, stageEntry: true, automatic: true, order: 1, prerequisites: [], physicalPrerequisites: [], work: 1 },
  { id: 'synthetic-surveying-1', name: '测试勘测入口一', domain: 'surveying', stage: 1, stageEntry: true, automatic: true, order: 1, prerequisites: [], physicalPrerequisites: [], work: 1 },
  { id: 'synthetic-manufacturing-ordinary-1', name: '测试制造普通一', domain: 'manufacturing', stage: 1, stageEntry: false, automatic: true, order: 2, prerequisites: [], physicalPrerequisites: [], work: 1 },
  { id: 'synthetic-manufacturing-2', name: '测试制造入口二', domain: 'manufacturing', stage: 2, stageEntry: true, automatic: true, order: 3, prerequisites: [], physicalPrerequisites: [], work: 1 },
  { id: 'synthetic-surveying-2', name: '测试勘测入口二', domain: 'surveying', stage: 2, stageEntry: true, automatic: true, order: 2, prerequisites: ['synthetic-condition'], physicalPrerequisites: [], work: 1 },
  { id: 'synthetic-manufacturing-3', name: '测试制造入口三', domain: 'manufacturing', stage: 3, stageEntry: true, automatic: true, order: 4, prerequisites: [], physicalPrerequisites: [], work: 1 },
];
const syntheticRound = createInitialM0State();
syntheticRound.research.mode = 'automatic';
syntheticRound.research.automaticDomains = ['manufacturing', 'surveying'];
syntheticRound.research.domainOrder = ['surveying', 'manufacturing', 'engineering'];
syntheticRound.research.completed = ['synthetic-manufacturing-1', 'synthetic-surveying-1'];
syntheticRound.research.roundTarget = null;
let syntheticSelection = automaticSelectionForDefinitions(syntheticRound, syntheticDefinitions);
equal(syntheticSelection.id, 'synthetic-manufacturing-ordinary-1', 'automatic round fills allowed ordinary technology before stage two');
equal(syntheticSelection.roundTarget, 1, 'ordinary fill remains in round one even when stage-two entries exist');
syntheticRound.research.completed.push('synthetic-manufacturing-ordinary-1');
syntheticSelection = automaticSelectionForDefinitions(syntheticRound, syntheticDefinitions);
equal(syntheticSelection.id, 'synthetic-manufacturing-2', 'automatic research starts the next round only after ordinary fill');
equal(syntheticSelection.blockedProjectId, 'synthetic-surveying-2', 'blocked higher-order field stays visible while another field catches up in the same round');
syntheticRound.research.completed.push('synthetic-manufacturing-2');
syntheticRound.research.roundTarget = 2;
syntheticSelection = automaticSelectionForDefinitions(syntheticRound, syntheticDefinitions);
equal(syntheticSelection.id, null, 'blocked round cannot skip into a stage-three entry');
equal(syntheticSelection.blockedProjectId, 'synthetic-surveying-2', 'round remains blocked at the unmet stage-two entry');

let researchFacility = minimumDailyStaffing(createInitialM0State());
equal(enabledResearchCapacity(researchFacility.research), 6, 'enabled research facility provides six real jobs');
researchFacility = setResearchTarget(researchFacility, 'restore-precision-manufacturing');
researchFacility = advanceOneDay(researchFacility);
equal(researchFacility.projects.find((project) => project.id === 'restore-precision-manufacturing')?.workDone, 6, 'six staffed facility jobs advance six daylight work');
researchFacility = setResearchFacilityOpenPositions(researchFacility, 'hq-basic-research-room-01', 3);
equal(enabledResearchCapacity(researchFacility.research), 3, 'player can close research positions without changing the building capacity');
equal(researchFacility.projects.find((project) => project.id === 'restore-precision-manufacturing')?.staffing.planned, 3, 'research plan follows open building positions');
const openPositionStorage = new MemoryStorage();
saveM0State(researchFacility, openPositionStorage);
equal(loadM0State(openPositionStorage).research.facilities[0].openPositions, 3, 'open research positions survive strict save reload');
const closedResearchPositions = setResearchFacilityOpenPositions(researchFacility, 'hq-basic-research-room-01', 0);
equal(enabledResearchCapacity(closedResearchPositions.research), 0, 'closing every research position leaves the building enabled without ghost capacity');
equal(advanceOneDay(closedResearchPositions).projects.find((project) => project.id === 'restore-precision-manufacturing')?.workDone, 6, 'an enabled research building with no open positions creates no progress');
researchFacility = setResearchFacilityEnabled(researchFacility, 'hq-basic-research-room-01', false);
equal(enabledResearchCapacity(researchFacility.research), 0, 'stopping the facility removes its research capacity');
researchFacility = advanceOneDay(researchFacility);
equal(researchFacility.projects.find((project) => project.id === 'restore-precision-manufacturing')?.workDone, 6, 'stopped facility cannot create research progress');
researchFacility.population.normal = 17;
researchFacility.population.unableToWork = 11;
researchFacility = setResearchFacilityEnabled(researchFacility, 'hq-basic-research-room-01', true);
researchFacility = setResearchFacilityOpenPositions(researchFacility, 'hq-basic-research-room-01', 6);
equal(researchFacility.projects.find((project) => project.id === 'restore-precision-manufacturing')?.staffing.actual, 1, 'actual employment can stay below building capacity when labor is short');
researchFacility = advanceOneDay(researchFacility);
equal(researchFacility.projects.find((project) => project.id === 'restore-precision-manufacturing')?.workDone, 7, 'one actual researcher advances one daylight work without a player staffing selector');
let scaledResearchFacilities = minimumDailyStaffing(createInitialM0State());
scaledResearchFacilities.research.facilities.push({
  id: 'hq-basic-research-room-02',
  name: '避难所第二研究室',
  locationId: 'hq',
  capacity: 4,
  openPositions: 4,
  enabled: true,
});
scaledResearchFacilities = setResearchTarget(scaledResearchFacilities, 'restore-precision-manufacturing');
equal(scaledResearchFacilities.projects.find((project) => project.id === 'restore-precision-manufacturing')?.staffing.planned, 10, 'additional enabled facility adds its real job capacity');
equal(scaledResearchFacilities.projects.find((project) => project.id === 'restore-precision-manufacturing')?.staffing.actual, 10, 'actual employment fills enabled research jobs from the common workforce');
const disabledResearchFacility = setResearchFacilityEnabled(minimumDailyStaffing(createInitialM0State()), 'hq-basic-research-room-01', false);
const researchFacilityStorage = new MemoryStorage();
saveM0State(disabledResearchFacility, researchFacilityStorage);
equal(JSON.stringify(loadM0State(researchFacilityStorage).research.facilities), JSON.stringify(disabledResearchFacility.research.facilities), 'research facility enable state survives strict save reload');

let automaticResearch = minimumDailyStaffing(createInitialM0State());
automaticResearch = setResearchDomainAutomatic(automaticResearch, 'surveying', true);
automaticResearch = setResearchDomainAutomatic(automaticResearch, 'manufacturing', true);
automaticResearch = setResearchDomainAutomatic(automaticResearch, 'engineering', true);
automaticResearch = setResearchDomainOrder(automaticResearch, ['surveying', 'manufacturing', 'engineering']);
equal(automaticResearch.research.currentProjectId, null, 'legacy automatic-domain fields cannot start research without a player queue');
equal(automaticResearch.research.automaticDomains.length, 0, 'runtime clears legacy automatic-domain authorization');
automaticResearch = advanceOneDay(automaticResearch);
equal(automaticResearch.projects.some((project) => project.id === 'restore-precision-manufacturing'), false, 'an empty queue remains idle across a world day');
automaticResearch = setResearchTarget(automaticResearch, 'adapt-survey-drone');
equal(automaticResearch.research.currentSource, 'manual', 'player can switch from automatic to a distant manual target');
automaticResearch = advanceOneDay(automaticResearch);
equal(automaticResearch.projects.find((project) => project.id === 'restore-precision-manufacturing')?.workDone, 6, 'player-queued research uses the selected six-person daylight line');
automaticResearch = setResearchMode(automaticResearch, 'automatic');
equal(automaticResearch.research.currentSource, 'manual', 'legacy automatic mode cannot replace the player queue');

let removableResearch = minimumDailyStaffing(createInitialM0State());
removableResearch = setResearchTarget(removableResearch, 'adapt-survey-drone');
removableResearch = removeResearchTarget(removableResearch, 'adapt-survey-drone');
equal(JSON.stringify(removableResearch.research.manualQueue), JSON.stringify(['restore-precision-manufacturing']), 'right-click removal preserves the order of other queued research');
removableResearch = advanceOneDay(removableResearch);
equal(removableResearch.projects.find((project) => project.id === 'restore-precision-manufacturing')?.workDone, 6, 'current queued research records unfinished progress before removal');
removableResearch = removeResearchTarget(removableResearch, 'restore-precision-manufacturing');
equal(removableResearch.research.currentProjectId, null, 'removing the current research clears the active selection');
equal(removableResearch.projects.some((project) => project.id === 'restore-precision-manufacturing'), false, 'removing current research deletes its unfinished project and progress');
equal(removableResearch.research.manualQueue.length, 0, 'removing the last queued research leaves an empty queue');
removableResearch = advanceDays(removableResearch, 8);
equal(removableResearch.projects.some((project) => technologies.some((technology) => technology.id === project.id)), false, 'empty research queue remains idle across arbitrary world days');
const removedResearchStorage = new MemoryStorage();
saveM0State(removableResearch, removedResearchStorage);
equal(JSON.stringify(loadM0State(removedResearchStorage)), JSON.stringify(removableResearch), 'removed research and deleted progress reload without resurrection');

let underStaffedWorkshop = createInitialM0State();
underStaffedWorkshop.research.completed.push('restore-precision-manufacturing');
underStaffedWorkshop = approveCapabilityProject(underStaffedWorkshop, 'repair-precision-workshop');
equal(underStaffedWorkshop.projects.find((project) => project.id === 'repair-precision-workshop')?.status, 'paused', 'system protects population supply instead of stripping water or food jobs for an approved engineering project');
equal(underStaffedWorkshop.projects.find((project) => project.id === 'repair-precision-workshop')?.pausedReason, 'staffing_shortage', 'a safely deferred engineering project records its staffing reason');
let workshopResumeGuard = 0;
while ((underStaffedWorkshop.projects.find((project) => project.id === 'repair-precision-workshop')?.workDone ?? 0) === 0 && workshopResumeGuard < 20) {
  underStaffedWorkshop = advanceOneDay(underStaffedWorkshop);
  equal(underStaffedWorkshop.population.waterDebt, 0, 'automatic workshop staffing never borrows from required water supply');
  equal(underStaffedWorkshop.population.foodDebt, 0, 'automatic workshop staffing never borrows from required food supply');
  workshopResumeGuard += 1;
}
equal(underStaffedWorkshop.projects.find((project) => project.id === 'repair-precision-workshop')?.workDone, 9, 'system resumes and staffs the workshop after safe water capacity frees enough labour');

let capability = minimumDailyStaffing(createInitialM0State());
capability = setResearchTarget(capability, 'adapt-survey-drone');
equal(JSON.stringify(capability.research.manualQueue), JSON.stringify(['restore-precision-manufacturing', 'adapt-survey-drone']), 'distant target inserts every necessary prerequisite once');
capability = advanceDays(capability, 4);
equal(capability.research.completed.includes('restore-precision-manufacturing'), true, 'precision manufacturing research completes at six people for four days');
equal(capability.research.currentProjectId, 'adapt-survey-drone', 'second queued research starts without waiting for a production batch');
equal(capability.projects.find((project) => project.id === 'adapt-survey-drone')?.workDone, 0, 'second queued research is selected immediately after the first completes');
equal(capability.research.blockedProjectId, null, 'research does not expose a downstream product as its own prerequisite');
equal(capability.research.blockedReason, null, 'research and production remain separate state machines');
capability = advanceOneDay(capability);
equal(capability.projects.find((project) => project.id === 'adapt-survey-drone')?.workDone, 6, 'second queued research advances on the next settlement day without a workshop or precision parts');
capability = advanceDays(capability, 2);
equal(capability.research.completed.includes('adapt-survey-drone'), true, 'second research completes while the workshop and precision-parts stock are absent');

let lowPartsSurvey = approveSurvey(minimumDailyStaffing(createInitialM0State()), 'ruin-a');
lowPartsSurvey.stocks.commonParts.amount = 0;
lowPartsSurvey.monthly.resources.commonParts.accruedInflow = 0;
lowPartsSurvey.monthly.resources.commonParts.accruedOutflow = 0;
lowPartsSurvey = advanceOneDay(lowPartsSurvey);
equal(lowPartsSurvey.projects.find((project) => project.id === 'survey-ruin-a')?.status, 'active', 'unrelated common-parts pressure cannot pause an approved survey');
equal(lowPartsSurvey.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.pauseReason, null, 'a normally running survey has no unexplained pause reason');

let staffingPausedSurvey = approveSurvey(minimumDailyStaffing(createInitialM0State()), 'ruin-a');
staffingPausedSurvey.population.normal = 14;
staffingPausedSurvey.population.deceased = 14;
staffingPausedSurvey = advanceOneDay(staffingPausedSurvey);
equal(staffingPausedSurvey.projects.find((project) => project.id === 'survey-ruin-a')?.status, 'paused', 'a real staffing shortage can system-pause a survey');
equal(staffingPausedSurvey.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.pauseReason, 'staffing', 'system-paused survey records the concrete staffing reason');
staffingPausedSurvey.population.normal = 28;
staffingPausedSurvey.population.deceased = 0;
staffingPausedSurvey = advanceOneDay(staffingPausedSurvey);
equal(staffingPausedSurvey.projects.find((project) => project.id === 'survey-ruin-a')?.status, 'active', 'survey automatically resumes after the staffing condition recovers');
equal(staffingPausedSurvey.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.pauseReason, null, 'automatic survey resumption clears the system pause reason');

for (const recoveryId of ['floor_common_parts', 'floor_engineering_components', 'floor_alloy'] as const) {
  const resource = recoveryId === 'floor_common_parts' ? 'commonParts'
    : recoveryId === 'floor_engineering_components' ? 'engineeringComponents' : 'alloy';
  const rule = RECOVERY_RULES[recoveryId];
  let recovery = minimumDailyStaffing(createInitialM0State());
  recovery.stocks[resource].amount = 0;
  recovery.monthly.resources[resource].accruedInflow = 0;
  recovery.monthly.resources[resource].accruedOutflow = 0;
  const precisionBefore = availableAmount(recovery, 'precisionParts');
  recovery = approveRecoveryProject(recovery, recoveryId);
  expect(recovery.projects.some((project) => project.id === recoveryId), `${resource} at zero has a player-approved zero-input recovery path`);
  equal(Object.keys(recovery.projects.find((project) => project.id === recoveryId)!.investedResources).length, 0, `${resource} recovery has no material input`);
  recovery = advanceDays(recovery, 6);
  equal(recovery.projects.some((project) => project.id === recoveryId), false, `${resource} recovery leaves the queue after completion`);
  equal(availableAmount(recovery, resource), rule.output, `${resource} recovery enters the unified monthly account`);
  expect(availableAmount(recovery, resource) <= rule.cap, `${resource} recovery cannot exceed its safety cap`);
  equal(availableAmount(recovery, 'precisionParts'), precisionBefore, `${resource} recovery never creates precision parts`);
  const recoveryAtFloor = approveRecoveryProject(recovery, recoveryId);
  equal(recoveryAtFloor.projects.some((project) => project.id === recoveryId), false, `${resource} recovery cannot be approved at or above its floor`);
  const recoveryStorage = new MemoryStorage();
  saveM0State(recovery, recoveryStorage);
  equal(JSON.stringify(loadM0State(recoveryStorage)), JSON.stringify(recovery), `${resource} recovery result reloads deterministically`);
}

const repairPartsBefore = availableAmount(capability, 'commonParts');
const repairComponentsBefore = availableAmount(capability, 'engineeringComponents');
const repairAlloyBefore = availableAmount(capability, 'alloy');
capability = approveCapabilityProject(capability, 'repair-precision-workshop');
equal(availableAmount(capability, 'commonParts'), repairPartsBefore - 5, 'workshop repair immediately consumes five common parts');
equal(availableAmount(capability, 'engineeringComponents'), repairComponentsBefore - 16, 'workshop repair immediately consumes sixteen engineering components');
equal(availableAmount(capability, 'alloy'), repairAlloyBefore - 8, 'workshop repair immediately consumes eight alloy');
equal(capability.projects.find((project) => project.id === 'repair-precision-workshop')?.staffing.planned, 9, 'workshop repair requires exactly nine planned workers');
capability = advanceDays(capability, 4);
equal(capability.projects.find((project) => project.id === 'repair-precision-workshop')?.status, 'complete', 'workshop repair takes nine people for four daylight days');
capability = setDailyMode(capability, 'maintenance', 'standard');
capability = setDailyMode(capability, 'water', 'standard');
capability = setDailyMode(capability, 'food', 'standard');
capability = setDailyMode(capability, 'logistics', 'standard');
const prototypePartsBefore = availableAmount(capability, 'commonParts');
const prototypeComponentsBefore = availableAmount(capability, 'engineeringComponents');
const prototypeAlloyBefore = availableAmount(capability, 'alloy');
capability = setProductionAllocation(capability, 'precision-parts', 1);
equal(capability.production.lines.find((line) => line.id === 'precision-parts')?.allocatedFactories, 1, 'player directly assigns the persistent factory to the fixed precision-parts row');
const overAllocated = setProductionAllocation(capability, 'survey-drone', 1);
equal(overAllocated.production.lines.reduce((sum, line) => sum + line.allocatedFactories, 0), 1, 'factory allocations never exceed the persistent factory pool');
capability = advanceOneDay(capability);
equal(availableAmount(capability, 'commonParts'), prototypePartsBefore - 2, 'precision line consumes two common parts when its batch starts');
equal(availableAmount(capability, 'engineeringComponents'), prototypeComponentsBefore - 4, 'precision line consumes four engineering components when its batch starts');
equal(availableAmount(capability, 'alloy'), prototypeAlloyBefore - 4, 'precision line consumes four alloy when its batch starts');
equal(capability.production.lines.find((line) => line.id === 'precision-parts')?.progress, 6, 'persistent production records partial batch progress');
const partialProductionStorage = new MemoryStorage();
saveM0State(capability, partialProductionStorage);
equal(JSON.stringify(loadM0State(partialProductionStorage).production), JSON.stringify(capability.production), 'factory allocation and partial production progress reload exactly');
equal(JSON.stringify(advanceOneDay(loadM0State(partialProductionStorage))), JSON.stringify(advanceOneDay(capability)), 'partial production reload continues deterministically');
capability = advanceOneDay(capability);
equal(availableAmount(capability, 'precisionParts'), 4, 'prototype batch creates four physical precision parts after two days');
equal(capability.production.lines.find((line) => line.id === 'precision-parts')?.batchesCompleted, 1, 'completed production batch is retained in the persistent line state');
equal(capability.production.lines.find((line) => line.id === 'precision-parts')?.allocatedFactories, 1, 'batch completion retains the player allocation instead of auto-switching');
capability = setProductionAllocation(capability, 'precision-parts', 0);
capability = advanceOneDay(capability);
equal(capability.research.currentProjectId, null, 'finished research stays independent of later production work');
equal(capability.research.completed.includes('adapt-survey-drone'), true, 'precision production does not retroactively control research completion');
const prototypeStorage = new MemoryStorage();
saveM0State(capability, prototypeStorage);
equal(JSON.stringify(loadM0State(prototypeStorage)), JSON.stringify(capability), 'prototype output and automatically resumed research save immediately without a stale projection');
capability = advanceDays(capability, 2);
equal(capability.research.completed.includes('adapt-survey-drone'), true, 'adapt survey drone remains complete without a second target click');
const dronePartsBefore = availableAmount(capability, 'commonParts');
const droneComponentsBefore = availableAmount(capability, 'engineeringComponents');
const droneAlloyBefore = availableAmount(capability, 'alloy');
capability = setProductionAllocation(capability, 'survey-drone', 1);
equal(capability.production.lines.find((line) => line.id === 'survey-drone')?.allocatedFactories, 1, 'player can move the persistent factory to the fixed drone row without a confirmation step');
capability = advanceDays(capability, 3);
equal(availableAmount(capability, 'commonParts'), dronePartsBefore - 3, 'drone line consumes three common parts');
equal(availableAmount(capability, 'engineeringComponents'), droneComponentsBefore - 10, 'drone line consumes ten engineering components');
equal(availableAmount(capability, 'alloy'), droneAlloyBefore - 8, 'drone line consumes eight alloy');
equal(capability.drone?.status, 'needs-charge', 'assembly creates a persistent asset that still needs initial recharge');
equal(availableAmount(capability, 'precisionParts'), 2, 'drone consumes two precision parts and leaves the other two in ordinary inventory');
equal(capability.drone?.rechargeApproved, false, 'first recharge still requires one explicit player approval');
capability = advanceOneDay(capability);
equal(capability.production.lines.find((line) => line.id === 'survey-drone')?.blockedReason, 'asset-limit', 'asset limit stops production without changing the fixed row allocation');
equal(capability.production.lines.find((line) => line.id === 'survey-drone')?.allocatedFactories, 1, 'asset-limit blocking retains the player allocation and never auto-switches');

let inputBlocked = JSON.parse(JSON.stringify(capability)) as M0State;
inputBlocked.drone = null;
inputBlocked.production.lines.find((line) => line.id === 'survey-drone')!.progress = 0;
inputBlocked.stocks.engineeringComponents.amount = 0;
inputBlocked.monthly.resources.engineeringComponents.accruedInflow = 0;
inputBlocked.monthly.resources.engineeringComponents.accruedOutflow = 0;
inputBlocked = advanceOneDay(inputBlocked);
equal(inputBlocked.production.lines.find((line) => line.id === 'survey-drone')?.blockedReason, 'input-shortage', 'missing production input causes a real stopped line');
equal(inputBlocked.production.lines.find((line) => line.id === 'survey-drone')?.allocatedFactories, 1, 'input shortage retains allocation instead of switching production');

const backlogBeforeRecharge = capability.maintenanceBacklog;
capability = completeDroneRecharge(capability);
equal(capability.drone?.status, 'needs-charge', 'recharge approval cannot instantly make the drone available');
equal(capability.drone?.rechargeApproved, true, 'recharge plan records player approval');
capability = advanceOneDay(capability);
equal(capability.drone?.status, 'charging', 'two maintenance workers connect the drone before passive overnight recharge');
equal(capability.drone?.connectionWorkDone, 2, 'drone connection records two maintenance work');
expect(capability.maintenanceBacklog > backlogBeforeRecharge, 'drone connection workers are not also counted as routine maintenance workers');
capability = advanceOneDay(capability);
equal(capability.drone?.status, 'available', 'drone becomes available only after overnight recharge and one maintenance check');
equal(capability.drone?.inspectionWorkDone, 1, 'post-recharge inspection records one maintenance work');

let concurrentSurvey = JSON.parse(JSON.stringify(capability)) as M0State;
concurrentSurvey = approveSurvey(concurrentSurvey, 'ruin-b', 2, null, true);
concurrentSurvey = approveSurvey(concurrentSurvey, 'ruin-a', 6, null, true);
expect(
  (concurrentSurvey.projects.find((project) => project.id === 'survey-ruin-b')?.queueOrder ?? 0)
    < (concurrentSurvey.projects.find((project) => project.id === 'survey-ruin-a')?.queueOrder ?? 0),
  'survey queue order follows approval order instead of target identity',
);
concurrentSurvey = advanceOneDay(concurrentSurvey);
equal(concurrentSurvey.map.surveys.find((survey) => survey.targetId === 'ruin-b')?.droneAppliedStages.includes('area'), true, 'first-approved survey receives the single available drone');
equal(concurrentSurvey.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.droneAppliedStages.length, 0, 'same drone cannot serve a later-approved survey on the same day');
equal(concurrentSurvey.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.workDone, 2, 'later-approved survey still advances with system staffing while approval order controls scarce equipment');

capability = approveSurvey(capability, 'ruin-a', 6, 1, false);
let surveyA = capability.map.surveys.find((survey) => survey.targetId === 'ruin-a')!;
equal(surveyA.workers, 2, 'system fixes survey staffing instead of exposing a player allocation');
equal(surveyA.maximumDays, null, 'system owns survey duration instead of saving a player day limit');
equal(surveyA.useDrone, true, 'system owns available survey equipment use');
const rejectedSurveyMicromanagement = configureSurvey(capability, 'ruin-a', { workers: 6, maximumDays: 1, useDrone: false });
equal(rejectedSurveyMicromanagement.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.workers, 2, 'legacy survey configuration cannot change system staffing');
equal(rejectedSurveyMicromanagement.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.maximumDays, null, 'legacy survey configuration cannot impose a day limit');
capability = advanceOneDay(capability);
surveyA = capability.map.surveys.find((survey) => survey.targetId === 'ruin-a')!;
equal(surveyA.stage, 'area', 'drone can independently cover the six-work direction-to-area jump');
equal(surveyA.selectedRouteId, 'route-hq-ruin-a-old-road', 'system automatically selects the established route after area confirmation');
equal(surveyA.pauseReason, null, 'survey continues without asking the player to choose a route');
equal(surveyA.droneAppliedStages.filter((stage) => stage === 'area').length, 1, 'same drone bonus applies only once in area confirmation');
equal(capability.drone?.rechargeApproved, true, 'an approved drone survey automatically queues return inspection and recharge');
equal(surveyPlanControlState(surveyA).editable, true, 'active survey retains strategic pause control');
equal(surveyPlanControlState(surveyA).needsApproval, false, 'approved survey does not show another plan-approval action');
const automaticRouteSnapshot = JSON.parse(JSON.stringify(capability)) as M0State;
const partialSurveyStorage = new MemoryStorage();
saveM0State(capability, partialSurveyStorage);
equal(JSON.stringify(loadM0State(partialSurveyStorage).map.surveys), JSON.stringify(capability.map.surveys), 'automatic route and partial survey progress reload exactly');
const ignoredRouteCommand = selectSurveyRoute(capability, 'ruin-a', 'route-hq-ruin-b-damaged-road');
equal(JSON.stringify(ignoredRouteCommand.map.surveys), JSON.stringify(capability.map.surveys), 'legacy route command cannot override the system route');
capability = setSurveyPaused(capability, 'ruin-a', true);
const pausedSurveyWork = capability.map.surveys.find((survey) => survey.targetId === 'ruin-a')!.workDone;
capability = advanceDays(capability, 2);
equal(capability.map.surveys.find((survey) => survey.targetId === 'ruin-a')?.workDone, pausedSurveyWork, 'player pause preserves exploration progress');
capability = setSurveyPaused(capability, 'ruin-a', false);
capability = advanceDays(capability, 20);
surveyA = capability.map.surveys.find((survey) => survey.targetId === 'ruin-a')!;
equal(surveyA.stage, 'site', 'system route, equipment and staffing complete all exploration stages after one strategic start');
equal(surveyPlanControlState(surveyA).editable, false, 'completed exploration closes strategic controls');
equal(surveyConclusion('ruin-a', surveyA.stage)?.reason.includes('清理较重'), true, 'site confirmation exposes the frozen ruin A construction fact');

capability = approveSurvey(capability, 'ruin-b', 6, 1, false);
let surveyB = capability.map.surveys.find((survey) => survey.targetId === 'ruin-b')!;
equal(`${surveyB.workers}/${surveyB.maximumDays}/${surveyB.useDrone}`, '2/null/true', 'second exploration start also ignores staffing, duration and equipment inputs');
capability = advanceOneDay(capability);
capability = advanceDays(capability, 20);
surveyB = capability.map.surveys.find((survey) => survey.targetId === 'ruin-b')!;
equal(surveyB.stage, 'site', 'second exploration completes without player route or staffing commands');
equal(surveyVisibleFacts('ruin-b', 'route').join('').includes('受损通路'), true, 'route stage exposes mud and damaged-passage facts');
equal(surveyVisibleFacts('ruin-b', 'site').join('').includes('合金料'), true, 'site stage separately exposes the frozen alloy fact');

let opening = minimumDailyStaffing(createInitialM0State({
  id: 'opening-loop-proof',
  startDate: { year: 2194, month: 1, day: 1 },
  existingSettlementPopulation: 1_000,
}));
equal(opening.settlement.status, 'uncontacted', 'the existing settlement begins as a real but uncontacted population source');
equal(opening.settlement.workforceEligible, 0, 'uncontacted population never becomes player labour');
equal(opening.map.cells.find((cell) => cell.id === OPENING_SETTLEMENT_CELL_ID)?.occupation, 'settlement', 'existing population remains anchored at its map location');
opening = integrateExistingSettlement(opening);
equal(opening.settlement.status, 'uncontacted', 'population cannot be integrated before contact and minimum services');
opening = contactExistingSettlement(opening);
equal(opening.settlement.status, 'contacted', 'the 28-person action team can explicitly contact the existing settlement');
opening = setDailyMode(opening, 'water', 'accelerated');
opening = setDailyMode(opening, 'food', 'standard');
opening = setDailyMode(opening, 'maintenance', 'accelerated');
opening = setHeadquartersSalvageApproval(opening, true);

const openingProjectIds = Object.keys(OPENING_PROJECT_RULES) as OpeningProjectId[];
for (const projectId of openingProjectIds) {
  let atomic = contactExistingSettlement(minimumDailyStaffing(createInitialM0State()));
  atomic = approveOpeningProject(atomic, projectId);
  atomic = advanceDays(atomic, 6);
  const results = openingAtomicResults(atomic);
  equal(results[projectId], true, `${projectId} completes its own atomic result`);
  equal(Object.values(results).filter(Boolean).length, 1, `${projectId} cannot complete any other service or production result`);
}

let openingOrder = contactExistingSettlement(minimumDailyStaffing(createInitialM0State()));
openingOrder = approveOpeningProject(openingOrder, 'opening-water-repair');
openingOrder = approveOpeningProject(openingOrder, 'opening-basic-medical');
openingOrder = moveProjectInQueue(openingOrder, 'opening-basic-medical', -1);
expect(openingOrder.projects.find((project) => project.id === 'opening-basic-medical')!.queueOrder
  < openingOrder.projects.find((project) => project.id === 'opening-water-repair')!.queueOrder,
'player can change the order of atomic settlement projects');

let protectedOpening = contactExistingSettlement(createInitialM0State({
  id: 'opening-default-safety-proof',
  startDate: { year: 2194, month: 1, day: 1 },
  existingSettlementPopulation: 1_000,
}));
for (const projectId of openingProjectIds) protectedOpening = approveOpeningProject(protectedOpening, projectId);
let protectedOpeningGuard = 0;
while (protectedOpening.settlement.status !== 'ready-to-integrate' && protectedOpeningGuard < 120) {
  protectedOpening = advanceOneDay(protectedOpening);
  equal(protectedOpening.population.deceased, 0, 'default safety staffing prevents deaths while all nine settlement projects advance');
  equal(protectedOpening.population.waterDebt, 0, 'default safety staffing never accumulates action-team water debt');
  equal(protectedOpening.population.foodDebt, 0, 'default safety staffing never accumulates action-team food debt');
  protectedOpeningGuard += 1;
}
equal(protectedOpening.settlement.status, 'ready-to-integrate', 'all nine concurrently approved settlement projects complete under default safety staffing');
equal(protectedOpening.population.normal, 28, 'the original action team remains intact at the population-integration gate');
protectedOpening = integrateExistingSettlement(protectedOpening);
equal(protectedOpening.dailyPositions.maintenance, 5, 'integration assigns accelerated maintenance recovery when the construction queue left a backlog');
protectedOpening = advanceDays(protectedOpening, 12);
equal(protectedOpening.population.normal, 28, 'the original action team remains intact after population integration and continued default progression');
equal(protectedOpening.population.deceased, 0, 'normal contact, construction and integration never kills the original action team');
equal(protectedOpening.population.waterDebt, 0, 'normal post-integration progression keeps action-team water debt at zero');
equal(protectedOpening.population.foodDebt, 0, 'normal post-integration progression keeps action-team food debt at zero');

const deliberateOpeningOrder: OpeningProjectId[] = [
  'opening-food-processing',
  'opening-water-repair',
  'opening-basic-medical',
  'opening-food-source',
  'opening-critical-power',
  'opening-sanitation',
  'opening-housing',
  'opening-registration',
  'opening-basic-industry',
];
for (const projectId of deliberateOpeningOrder) {
  opening = approveOpeningProject(opening, projectId);
  opening = advanceDays(opening, 6);
}
equal(opening.settlement.status, 'ready-to-integrate', 'population integration opens only after all nine atomic settlement projects complete');
equal(opening.production.totalFactories, 3, 'the completed basic production site contributes three persistent units to the unified production pool');
equal(opening.map.cells.find((cell) => cell.id === LOCATION_CELLS.openingSettlement)?.occupation, 'settlement', 'completed basic industry remains attached to the existing settlement identity');
const readyOpening = opening;
opening = integrateExistingSettlement(opening);
equal(opening.settlement.status, 'served', 'player explicitly integrates population only after every minimum service is real');
equal(opening.settlement.registeredPopulation, 1_000, 'one thousand existing residents enter the registered population ledger');
equal(opening.settlement.servedPopulation, 1_000, 'one thousand existing residents enter the service ledger');
equal(opening.settlement.locationCellId, OPENING_SETTLEMENT_CELL_ID, 'integrated population remains at the existing settlement instead of moving to headquarters');
equal(opening.settlement.workforceEligible, 500, 'eligible settlement labour is derived from real residents');
equal(opening.settlement.workforceAssigned, 450, 'four hundred fifty eligible residents remain auditable in local routine jobs');
equal(opening.settlement.workforceEligible - opening.settlement.workforceAssigned, 50, 'five percent of served population enters the mobile workforce account');
equal(livingPopulation(opening), 1_028, 'the unified supported population contains the action team and served settlement residents');
equal(workablePopulation(opening), 78, 'the unified workable population contains the action team and fifty mobile settlement workers');
equal(opening.workforce.workable, 78, 'integration immediately refreshes the live workforce ledger');
equal(workforceTotal(opening), 78, 'the refreshed unified workforce remains fully conserved');
equal(opening.dailyPositions.water, 6, 'integration preserves an already accelerated water line');
equal(opening.dailyPositions.food, 5, 'integration restores the routine food line to standard staffing when mobile labour becomes available');
equal(opening.dailyPositions.maintenance, 5, 'integration preserves an already accelerated maintenance line');
equal(opening.dailyPositions.logistics, 3, 'integration restores the routine logistics line to standard staffing when mobile labour becomes available');
equal(dailyResourceRate(opening, 'water').outflow, 1_028, 'integration raises real daily water demand from twenty-eight to one thousand twenty-eight');
equal(dailyResourceRate(opening, 'food').outflow, 1_028, 'integration raises real daily food demand from twenty-eight to one thousand twenty-eight');
expect(dailyResourceRate(opening, 'water').inflow >= 1_028, 'the completed water service enters the unified inflow and covers all supported residents');
expect(dailyResourceRate(opening, 'food').inflow >= 1_028, 'the completed food source and processing services enter unified inflow and cover all supported residents');
equal(dailyResourceRate(opening, 'commonParts').outflow, 5, 'served settlement facilities add two auditable parts of daily maintenance demand');
const unifiedFlowDay = advanceOneDay(opening);
const unifiedFlowLedger = unifiedFlowDay.ledger.at(-1)!;
equal(unifiedFlowLedger.resources.water.outflow, 1_028, 'a real settled day consumes water for all one thousand twenty-eight supported residents');
equal(unifiedFlowLedger.resources.food.outflow, 1_028, 'a real settled day consumes food for all one thousand twenty-eight supported residents');
expect(unifiedFlowLedger.resources.water.inflow >= 1_028, 'a real settled day records settlement water service inflow in the core ledger');
expect(unifiedFlowLedger.resources.food.inflow >= 1_028, 'a real settled day records settlement food service inflow in the core ledger');
equal(unifiedFlowLedger.resources.commonParts.outflow, 5, 'a real settled day records the additional settlement service maintenance burden');

const waterStopped = setOpeningServiceOperational(opening, 'water', false);
expect(dailyResourceRate(waterStopped, 'water').inflow < dailyResourceRate(waterStopped, 'water').outflow, 'stopping the settlement water service creates a real unified water-flow gap');
const waterStoppedDay = advanceOneDay(waterStopped);
equal(waterStoppedDay.resourceShortages.water, true, 'the unified water account records a real shortage when settlement supply is stopped');
equal(waterStoppedDay.openingLoop.currentMonth.waterGapDays, waterStopped.openingLoop.currentMonth.waterGapDays + 1, 'the real water-flow gap enters the natural-month evidence account');
const foodStopped = setOpeningServiceOperational(opening, 'food', false);
expect(dailyResourceRate(foodStopped, 'food').inflow < dailyResourceRate(foodStopped, 'food').outflow, 'stopping either settlement food service creates a real unified food-flow gap');
const foodStoppedDay = advanceOneDay(foodStopped);
equal(foodStoppedDay.resourceShortages.food, true, 'the unified food account records a real shortage when settlement supply is stopped');
equal(foodStoppedDay.openingLoop.currentMonth.foodGapDays, foodStopped.openingLoop.currentMonth.foodGapDays + 1, 'the real food-flow gap enters the natural-month evidence account');

const labourProofBase = testProject('mobile-labour-proof', 'P0');
const labourProofProject = {
  ...labourProofBase,
  staffing: { ...labourProofBase.staffing, planned: 40 },
  workRequired: 100,
};
const actionTeamProjectDay = advanceOneDay(injectTestProject(readyOpening, labourProofProject));
const unifiedProjectDay = advanceOneDay(injectTestProject(opening, labourProofProject));
const actionTeamProjectWork = actionTeamProjectDay.projects.find((project) => project.id === labourProofProject.id)?.workDone ?? 0;
const unifiedProjectWork = unifiedProjectDay.projects.find((project) => project.id === labourProofProject.id)?.workDone ?? 0;
expect(unifiedProjectWork > actionTeamProjectWork, 'the mobile workforce materially accelerates a real approved engineering project');
equal(unifiedProjectWork, 40, 'all forty planned engineering positions can be filled from the unified workforce');

opening = setDailyMode(opening, 'water', 'standard');
opening = setDailyMode(opening, 'maintenance', 'standard');
opening = setResearchTarget(opening, 'adapt-survey-drone');
opening = advanceDays(opening, 8);
expect(opening.research.completed.includes('adapt-survey-drone'), `opening-loop research reaches the industrial milestone without product coupling ${JSON.stringify({ research: opening.research, projects: opening.projects.filter((project) => technologies.some((technology) => technology.id === project.id)), workforce: opening.workforce, population: opening.population, settlement: opening.settlement, rates: { water: dailyResourceRate(opening, 'water'), food: dailyResourceRate(opening, 'food') }, shortages: opening.resourceShortages, warnings: opening.warnings })}`);
opening = approveCapabilityProject(opening, 'repair-precision-workshop');
opening = advanceDays(opening, 4);
equal(opening.projects.find((project) => project.id === 'repair-precision-workshop')?.status, 'complete', 'opening loop includes a real completed production site');
equal(opening.production.totalFactories, 4, 'the three settlement production units and one repaired workshop share one persistent production pool');
opening = setDailyMode(opening, 'water', 'standard');
opening = setDailyMode(opening, 'food', 'standard');
opening = setDailyMode(opening, 'maintenance', 'standard');
opening = setProductionAllocation(opening, 'common-parts-remanufacturing', 1);
opening = setProductionAllocation(opening, 'precision-parts', 1);
equal(opening.production.lines.find((line) => line.id === 'precision-parts')?.allocatedFactories, 1, 'basic industry evidence requires a player allocation on a fixed product row');
equal(opening.production.lines.find((line) => line.id === 'common-parts-remanufacturing')?.allocatedFactories, 1, 'one real basic-industry unit sustains ordinary-parts maintenance from worn parts');
equal(opening.production.lines.reduce((sum, line) => sum + line.allocatedFactories, 0), 2, 'fixed-line allocations remain below the four-unit persistent pool');
const allocationClamp = setProductionAllocation(opening, 'survey-drone', 99);
equal(allocationClamp.production.lines.reduce((sum, line) => sum + line.allocatedFactories, 0), 4, 'production allocation clamps at the unified persistent-unit total');

let continuityGuard = 0;
while (openingLoopEvidence(opening).consecutiveMonths < 3 && continuityGuard < 190) {
  expect(dailyResourceRate(opening, 'water').inflow >= dailyResourceRate(opening, 'water').outflow, 'three-month proof uses the real balanced water account each day');
  expect(dailyResourceRate(opening, 'food').inflow >= dailyResourceRate(opening, 'food').outflow, 'three-month proof uses the real balanced food account each day');
  opening = advanceOneDay(opening);
  continuityGuard += 1;
}
equal(openingLoopEvidence(opening).consecutiveMonths, 3, `three complete natural months retain daily water, food, critical-service, maintenance and conservation evidence ${JSON.stringify(opening.openingLoop)}`);
equal(opening.openingLoop.continuityMonths.length, 3, 'only the latest three complete natural-month proofs are retained');
expect(opening.openingLoop.continuityMonths.every((month) => month.waterMet && month.foodMet
  && month.criticalServicesOperational && month.maintenanceRecoverable
  && month.resourceAccountingConserved), 'all five continuity checks pass in every retained natural month');
equal(opening.projects.some((project) => project.id === 'floor_common_parts'), false, 'the normal three-month industry loop never depends on the zero-input softlock recovery');
expect(opening.oldRepairableParts > 0, 'the real maintenance and remanufacturing loop retains an auditable worn-parts stock after three months');
opening = approveSurvey(opening, 'ruin-a');
const completeOpeningEvidence = openingLoopEvidence(opening);
equal(completeOpeningEvidence.items.length, 9, 'opening loop exposes the nine required evidence identities');
equal(new Set(completeOpeningEvidence.items.map((item) => item.id)).size, 9, 'every opening-loop evidence identity is unique');
equal(completeOpeningEvidence.passed, true, 'population, services, repair, industry, mobile labour and a player-approved idle queue pass together');
const brokenOpening = setOpeningServiceOperational(opening, 'water', false);
expect(dailyResourceRate(brokenOpening, 'water').inflow < dailyResourceRate(brokenOpening, 'water').outflow, 'the evidence failure is derived from the same real water account');
equal(openingLoopEvidence(brokenOpening).items.find((item) => item.id === 'water_repeatable')?.status, 'blocked', 'a real water shutdown immediately blocks the water evidence');
equal(openingLoopEvidence(brokenOpening).items.find((item) => item.id === 'water_repeatable')?.gap, '重复日供水能力未覆盖服务人口', 'blocked water evidence exposes one exact recovery gap');
opening = setOpeningServiceOperational(brokenOpening, 'water', true);
equal(openingLoopEvidence(opening).items.find((item) => item.id === 'water_repeatable')?.status, 'pass', 'restoring the service clears the water gap without changing history');
const openingStorage = new MemoryStorage();
saveM0State(opening, openingStorage);
equal(JSON.stringify(loadM0State(openingStorage)), JSON.stringify(opening), 'settlement services, daily supply month and three-month evidence reload deterministically');

const capabilityStorage = new MemoryStorage();
saveM0State(capability, capabilityStorage);
equal(JSON.stringify(advanceOneDay(loadM0State(capabilityStorage))), JSON.stringify(advanceOneDay(capability)), 'capability map, research queue, asset, and surveys round-trip deterministically');

function expectRejectedCapabilitySave(
  mutator: (state: M0State) => void,
  label: string,
  base: M0State = capability,
): void {
  const invalid = JSON.parse(JSON.stringify(base)) as M0State;
  mutator(invalid);
  const invalidStorage = new MemoryStorage();
  invalidStorage.values.set(M0_SAVE_KEY, JSON.stringify(invalid));
  equal(JSON.stringify(loadM0State(invalidStorage)), JSON.stringify(createInitialM0State()), label);
}

expectRejectedCapabilitySave((state) => { state.map.cells[1].id = state.map.cells[0].id; }, 'duplicate cell ID resets safely');
expectRejectedCapabilitySave((state) => { state.map.cells[0].neighbors[0] = 'missing-cell'; }, 'invalid neighbor reference resets safely');
expectRejectedCapabilitySave((state) => { state.map.selectedCellId = 'missing-cell'; }, 'invalid selected-cell reference resets safely');
expectRejectedCapabilitySave((state) => { state.map.routes[0].cellIds[0] = 'missing-cell'; }, 'invalid route cell reference resets safely');
expectRejectedCapabilitySave((state) => { state.map.routes[1].id = state.map.routes[0].id; }, 'duplicate route ID resets safely');
expectRejectedCapabilitySave((state) => { state.ui.mapRotation.yaw = MAP_ROTATION_LIMITS.yaw + 0.01; }, 'out-of-range spherical rotation resets safely');
expectRejectedCapabilitySave((state) => { state.research.domainOrder[1] = state.research.domainOrder[0]; }, 'duplicate research domain resets safely');
expectRejectedCapabilitySave((state) => { state.research.domainOrder[0] = 'invalid' as M0State['research']['domainOrder'][number]; }, 'invalid research domain enum resets safely');
expectRejectedCapabilitySave((state) => { state.research.manualQueue.push('unknown-technology'); }, 'unknown research queue ID resets safely');
expectRejectedCapabilitySave((state) => { state.research.facilities.push({ ...state.research.facilities[0] }); }, 'duplicate research facility ID resets safely');
expectRejectedCapabilitySave((state) => { state.research.facilities[0].capacity = 0; }, 'zero-capacity research facility resets safely');
expectRejectedCapabilitySave((state) => { state.research.facilities[0].openPositions = 7; }, 'research positions above building capacity reset safely');
expectRejectedCapabilitySave((state) => { state.research.mode = 'automatic'; }, 'v8 save rejects automatic research mode');
expectRejectedCapabilitySave((state) => { state.research.automaticDomains.push('surveying'); }, 'v8 save rejects automatic domain authorization');
expectRejectedCapabilitySave((state) => { state.production.totalFactories += 1; }, 'factory pool must match the persistent completed facility');
expectRejectedCapabilitySave((state) => { state.production.lines[0].workRequired += 1; }, 'fixed production recipe work cannot drift in a save');
expectRejectedCapabilitySave((state) => { state.production.lines[0].allocatedFactories = 1; state.production.lines[1].allocatedFactories = 1; }, 'strict save rejects factory allocation above the total pool');
expectRejectedCapabilitySave((state) => { state.settlement.status = 'ready-to-integrate'; }, 'strict v9 save rejects opening population integration before atomic projects complete');
expectRejectedCapabilitySave((state) => { state.settlement.services.water.capacity = 1_100; }, 'strict v9 save rejects a service result without its completed atomic project');
expectRejectedCapabilitySave((state) => { state.settlement.services.water.capacity = 0; }, 'strict v9 save rejects a completed atomic project whose own result disappeared', opening);
expectRejectedCapabilitySave((state) => { state.workforce.development -= 1; state.workforce.workable -= 1; }, 'strict v9 save rejects a workforce ledger that omits one unified mobile worker', opening);
expectRejectedCapabilitySave((state) => { state.openingLoop.currentMonth.waterGapDays = state.openingLoop.currentMonth.servedDays + 1; }, 'strict v9 save rejects impossible opening-loop daily gap accounting', opening);
expectRejectedCapabilitySave((state) => { state.map.surveys[0].targetId = state.map.surveys[1].targetId; }, 'duplicate survey target resets safely');
expectRejectedCapabilitySave((state) => { state.map.surveys[0].stage = 'invalid' as M0State['map']['surveys'][number]['stage']; }, 'invalid survey stage resets safely');
expectRejectedCapabilitySave((state) => { state.map.surveys[0].projectId = 'missing-project'; }, 'invalid survey project reference resets safely');
expectRejectedCapabilitySave((state) => { state.map.surveys[0].selectedRouteId = state.map.routes[0].id; }, 'direction-stage survey cannot already contain a route choice', createInitialM0State());
expectRejectedCapabilitySave((state) => { state.map.surveys[0].workers = 6; }, 'v8 save rejects player-managed exploration staffing');
expectRejectedCapabilitySave((state) => { state.map.surveys[0].maximumDays = 1; }, 'v8 save rejects player-managed exploration duration');
expectRejectedCapabilitySave((state) => { state.map.surveys[0].useDrone = false; }, 'v8 save rejects player-managed exploration equipment');
expectRejectedCapabilitySave((state) => { state.map.surveys[0].selectedRouteId = state.map.routes[1].id; }, 'automatic survey route must still match its target', automaticRouteSnapshot);
expectRejectedCapabilitySave((state) => { state.projects.find((project) => project.id === 'survey-ruin-a')!.pausedReason = 'player_pause'; }, 'survey pause reason must match its project pause reason', automaticRouteSnapshot);
expectRejectedCapabilitySave((state) => {
  state.research.currentProjectId = null;
  state.research.currentSource = null;
}, 'active research cannot exist without a current-project reference', automaticResearch);
expectRejectedCapabilitySave((state) => { state.projects.push({ ...state.projects[0], staffing: { ...state.projects[0].staffing } }); }, 'duplicate project ID resets safely');
expectRejectedCapabilitySave((state) => { if (state.drone) state.drone.id = 'unstable-drone-id'; }, 'invalid stable drone ID resets safely');
expectRejectedCapabilitySave((state) => { if (state.drone) state.drone.assignment = 'invalid' as M0State['drone'] extends null ? never : 'ruin-a'; }, 'invalid drone task reference resets safely');
expectRejectedCapabilitySave((state) => { if (state.drone) state.drone.rechargeApproved = true; }, 'available drone cannot retain a queued recharge approval');
expectRejectedCapabilitySave((state) => {
  if (state.drone) {
    state.drone.status = 'charging';
    state.drone.recharge = 'connection';
    state.drone.rechargeApproved = true;
  }
}, 'charging drone must be in overnight or inspection phase');

console.log('M0 core checks passed: one-second days, manual research and survey controls, capped recovery, atomic settlement projects, strict v7/v8-to-v9 migration, persistent factory conservation, deterministic saves, and three complete opening-loop months.');
