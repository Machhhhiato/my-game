import {
  daysInMonth,
  isLeapYear,
  nextGameDate,
} from '../src/m0/calendar';
import { refreshMonthlyProjection } from '../src/m0/economy';
import { clearM0State, loadM0State, saveM0State, type StorageLike } from '../src/m0/save';
import {
  advanceOneDay,
  advanceRealTime,
  approveProject,
  availableAmount,
  coverageDays,
  injectTestProject,
  setDailyMode,
  setGameSpeed,
  setHeadquartersSalvageApproval,
  setRunning,
} from '../src/m0/simulation';
import { createInitialM0State, setEventWindowPosition } from '../src/m0/state';
import type { M0State, Project, ScenarioConfig } from '../src/m0/types';

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

function scenario(id: string, year: number, month: number, day = 1): ScenarioConfig {
  return { id, startDate: { year, month, day } };
}

function workforceTotal(state: M0State): number {
  const workforce = state.workforce;
  const projectWorkers = state.projects
    .filter((project) => project.staffing.source === 'development')
    .reduce((sum, project) => sum + project.staffing.actual, 0);
  return workforce.basicDuty
    + workforce.water
    + workforce.food
    + workforce.maintenance
    + workforce.logistics
    + workforce.development
    + workforce.standby
    + projectWorkers;
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
expect(!('safetyLines' in initial), 'player safety lines are absent from state');
expect(!JSON.stringify(initial).includes('lockedCost'), 'project shadow cost is absent from state');
expect(!JSON.stringify(initial).includes('"locked"'), 'locked stock is absent from state');
expect(!JSON.stringify(initial).includes('"reserved"'), 'reserved stock is absent from state');
equal(initial.stocks.commonParts.amount, 41, 'approved waterworks cost immediately deducts common parts');
equal(initial.stocks.engineeringComponents.amount, 68, 'approved waterworks cost immediately deducts engineering components');
equal(initial.projects[0].investedResources.commonParts, 4, 'waterworks records actual invested common parts');
equal(initial.projects[0].investedResources.engineeringComponents, 12, 'waterworks records actual invested components');
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
equal(first.oldRepairableParts, 237, 'standard day one old parts');
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

let rejected = setDailyMode(createInitialM0State(), 'water', 'accelerated');
rejected = setDailyMode(rejected, 'food', 'accelerated');
rejected = setDailyMode(rejected, 'maintenance', 'accelerated');
rejected = setDailyMode(rejected, 'logistics', 'accelerated');
equal(rejected.dailyModes.logistics, 'standard', 'overallocated choice keeps previous mode');
expect(rejected.feedback?.includes('无法改为加速'), 'overallocated choice reports player reason');
equal(rejected.workforce.water, 6, 'accepted accelerated water is fully staffed');
equal(rejected.projects[0].staffing.planned, 6, 'waterworks plan follows selected water staffing');
equal(rejected.projects[0].staffing.actual, 6, 'waterworks actual staffing follows selected water staffing');

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
equal(fullPartsStoreDay.oldRepairableParts, 237, 'only storable same-day repair consumes old parts');

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
equal(survivorDay.workforce.development, 2, 'fifteen survivors retain two recovery workers');
equal(workforceTotal(survivorDay), 15, 'fifteen-survivor workforce is conserved');

const shortage = createInitialM0State();
shortage.stocks.water.amount = 0;
shortage.stocks.food.amount = 0;
shortage.dailyModes.water = 'minimum';
shortage.dailyModes.food = 'minimum';
shortage.dailyModes.logistics = 'minimum';
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

const pausedTime = advanceRealTime(createInitialM0State(), 20_000);
equal(pausedTime.elapsedDays, 0, 'paused time does not advance');
const runningTime = setRunning(createInitialM0State(), true);
equal(advanceRealTime(runningTime, 19_000).elapsedDays, 0, 'nineteen seconds does not settle a day');
equal(advanceRealTime(runningTime, 20_000).elapsedDays, 1, 'twenty seconds settles one day');
const fastBase = setGameSpeed(setRunning(createInitialM0State(), true), 4);
const fastResult = advanceRealTime(fastBase, 20_000);
const sequentialResult = advanceDays(fastBase, 4);
equal(JSON.stringify(fastResult.calendar), JSON.stringify(sequentialResult.calendar), 'four-times speed still advances every calendar day in sequence');
equal(JSON.stringify(fastResult.monthly), JSON.stringify(sequentialResult.monthly), 'four-times speed matches sequential monthly accounting');
equal(JSON.stringify(fastResult.projects), JSON.stringify(sequentialResult.projects), 'four-times speed does not skip project days');
let speedSequence = setRunning(createInitialM0State(), true);
speedSequence = advanceRealTime(setGameSpeed(speedSequence, 1), 10_000);
speedSequence = advanceRealTime(setGameSpeed(speedSequence, 2), 5_000);
speedSequence = advanceRealTime(setGameSpeed(speedSequence, 4), 5_000);
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
storage.values.set('always-game-m0-v2', '{broken');
equal(loadM0State(storage).elapsedDays, 0, 'broken M0 save resets to initial state');
storage.values.set('always-game-m0-v2', JSON.stringify({ version: 2 }));
equal(loadM0State(storage).elapsedDays, 0, 'incomplete same-version save resets to initial state');

const malformedProject = JSON.parse(JSON.stringify(first)) as M0State;
delete (malformedProject.projects[0] as Partial<Project>).staffing;
storage.values.set('always-game-m0-v2', JSON.stringify(malformedProject));
equal(loadM0State(storage).elapsedDays, 0, 'malformed project resets safely');
const invalidMode = JSON.parse(JSON.stringify(first)) as M0State;
invalidMode.dailyModes.water = 'invalid' as M0State['dailyModes']['water'];
storage.values.set('always-game-m0-v2', JSON.stringify(invalidMode));
equal(loadM0State(storage).elapsedDays, 0, 'invalid work mode resets safely');
const invalidCalendar = JSON.parse(JSON.stringify(first)) as M0State;
invalidCalendar.calendar = { year: 2001, month: 2, day: 29 };
storage.values.set('always-game-m0-v2', JSON.stringify(invalidCalendar));
equal(loadM0State(storage).elapsedDays, 0, 'invalid calendar date resets safely');
const invalidMonthly = JSON.parse(JSON.stringify(first)) as M0State;
invalidMonthly.monthly.processedDays = 0;
storage.values.set('always-game-m0-v2', JSON.stringify(invalidMonthly));
equal(loadM0State(storage).elapsedDays, 0, 'calendar and month accumulation mismatch resets safely');
const invalidProjection = JSON.parse(JSON.stringify(first)) as M0State;
invalidProjection.monthly.resources.food.projectedClosingAmount += 1;
storage.values.set('always-game-m0-v2', JSON.stringify(invalidProjection));
equal(loadM0State(storage).elapsedDays, 0, 'corrupt monthly prediction resets safely');
const shadowStock = JSON.parse(JSON.stringify(first)) as M0State;
(shadowStock.stocks.water as unknown as Record<string, unknown>).reserved = 1;
storage.values.set('always-game-m0-v2', JSON.stringify(shadowStock));
equal(loadM0State(storage).elapsedDays, 0, 'same-version shadow stock field is rejected');
const shadowProject = JSON.parse(JSON.stringify(first)) as M0State;
(shadowProject.projects[0] as unknown as Record<string, unknown>).lockedCost = {};
storage.values.set('always-game-m0-v2', JSON.stringify(shadowProject));
equal(loadM0State(storage).elapsedDays, 0, 'same-version shadow project cost is rejected');
const invalidEvents = JSON.parse(JSON.stringify(shortageDay)) as M0State;
invalidEvents.events[0].date = { year: 2001, month: 2, day: 30 };
storage.values.set('always-game-m0-v2', JSON.stringify(invalidEvents));
equal(loadM0State(storage).elapsedDays, 0, 'invalid persisted event date resets safely');
const invalidEventPosition = JSON.parse(JSON.stringify(first)) as M0State;
invalidEventPosition.ui.eventWindow.xRatio = -0.01;
storage.values.set('always-game-m0-v2', JSON.stringify(invalidEventPosition));
equal(JSON.stringify(loadM0State(storage).ui.eventWindow), JSON.stringify({ xRatio: 1, yRatio: 0.08 }), 'out-of-range saved event window position resets safely');
const nonFiniteEventPosition = JSON.parse(JSON.stringify(first)) as M0State;
nonFiniteEventPosition.ui.eventWindow.yRatio = Number.NaN;
storage.values.set('always-game-m0-v2', JSON.stringify(nonFiniteEventPosition));
equal(JSON.stringify(loadM0State(storage).ui.eventWindow), JSON.stringify({ xRatio: 1, yRatio: 0.08 }), 'non-finite saved event window position resets safely');
const savedPopulationPulse = JSON.parse(JSON.stringify(first)) as M0State & { populationDelta?: number };
savedPopulationPulse.populationDelta = -1;
storage.values.set('always-game-m0-v2', JSON.stringify(savedPopulationPulse));
equal(loadM0State(storage).elapsedDays, 0, 'transient population pulse is rejected from the strict save schema');

const oldOnly = new MemoryStorage();
oldOnly.values.set('always-game-m0-v1', JSON.stringify(first));
loadM0State(oldOnly);
expect(oldOnly.reads.every((key) => key === 'always-game-m0-v2'), 'old M0 save key is never read');
const olderOnly = new MemoryStorage();
olderOnly.values.set('always-game-text-idle-v6', JSON.stringify(first));
loadM0State(olderOnly);
expect(olderOnly.reads.every((key) => key === 'always-game-m0-v2'), 'pre-M0 save key is never read');

const timeStorage = new MemoryStorage();
saveM0State(setRunning(createInitialM0State(), true), timeStorage);
equal(loadM0State(timeStorage).elapsedDays, 0, 'save reload has no offline progression');
clearM0State(storage);

console.log('M0 stage A+B checks passed: core accounting, deterministic time, strict saves, UI position, and speed sequencing.');
