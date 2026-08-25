import { clearM0State, loadM0State, saveM0State, type StorageLike } from '../src/m0/save';
import {
  advanceOneDay,
  advanceRealTime,
  coverageDays,
  injectTestProject,
  setRunning,
} from '../src/m0/simulation';
import {
  createInitialM0State,
  setDailyMode,
  setHeadquartersSalvageApproval,
  setSafetyDays,
} from '../src/m0/state';
import type { M0State, Project } from '../src/m0/types';

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, label: string): void {
  expect(actual === expected, `${label}: expected ${String(expected)}, got ${String(actual)}`);
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
function testProject(id: string, priority: Project['priority'], autoResume = true, returnTo: Project['staffing']['returnTo'] = 'development'): Project {
  return { id, name: id, priority, queueOrder: 1, status: 'active', production: false, testOnly: true, directRecovery: false, autoResume, pausedReason: null, safeActiveDays: 0, staffing: { planned: 2, actual: 0, source: 'development', returnTo }, workDone: 0, workRequired: 0, lockedCost: {} };
}
class MemoryStorage implements StorageLike {
  readonly reads: string[] = [];
  readonly values = new Map<string, string>();
  getItem(key: string): string | null { this.reads.push(key); return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
  removeItem(key: string): void { this.values.delete(key); }
}

const first = advanceOneDay(createInitialM0State());
equal(JSON.stringify(first), JSON.stringify(advanceOneDay(createInitialM0State())), 'deterministic first day');
equal(first.stocks.water.amount, 280, 'standard day one water');
equal(first.stocks.food.amount, 562, 'standard day one food');
equal(first.stocks.commonParts.amount, 45, 'standard day one common parts');
equal(first.waterworks.workDone, 3, 'standard day one waterworks');
equal(first.oldRepairableParts, 237, 'standard day one old parts');
equal(first.stocks.water.consumed, 28, 'standard day one cumulative water use');
equal(first.stocks.food.consumed, 28, 'standard day one cumulative food use');
equal(first.stocks.commonParts.consumed, 3, 'standard day one cumulative parts use');
equal(workforceTotal(first), first.workforce.workable, 'standard workforce conservation');

let minimumFood = setDailyMode(createInitialM0State(), 'food', 'minimum');
const minimumFoodDay = advanceOneDay(minimumFood);
equal(minimumFoodDay.ledger[0].resources.food.inflow, 20, 'minimum food inflow');
let minimumMaintenance = setDailyMode(createInitialM0State(), 'maintenance', 'minimum');
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

const invalidSafety = setSafetyDays(createInitialM0State(), 'water', 1);
equal(invalidSafety.safetyLines.water.safetyDays, 5, 'safety line rejects values below hard floor');
expect(invalidSafety.feedback?.includes('不能低于'), 'safety line rejection is player-visible');
equal(setSafetyDays(createInitialM0State(), 'water', 8).safetyLines.water.safetyDays, 8, 'safety line is stored in state');

let rejected = setDailyMode(createInitialM0State(), 'water', 'accelerated');
rejected = setDailyMode(rejected, 'food', 'accelerated');
rejected = setDailyMode(rejected, 'maintenance', 'accelerated');
rejected = setDailyMode(rejected, 'logistics', 'accelerated');
equal(rejected.dailyModes.logistics, 'standard', 'overallocated choice keeps previous mode');
expect(rejected.feedback?.includes('无法改为加速'), 'overallocated choice reports player reason');
equal(rejected.workforce.water, 6, 'accepted accelerated water is fully staffed');
equal(rejected.projects[0].staffing.planned, 6, 'waterworks plan follows the selected water staffing');
equal(rejected.projects[0].staffing.actual, 6, 'waterworks actual staffing follows the selected water staffing');

const immutableInput = createInitialM0State();
const immutableSnapshot = JSON.stringify(immutableInput);
setDailyMode(immutableInput, 'water', 'accelerated');
equal(JSON.stringify(immutableInput), immutableSnapshot, 'mode change does not mutate its input state');

let locked = setDailyMode(createInitialM0State(), 'maintenance', 'minimum');
for (let day = 0; day < 40; day += 1) locked = advanceOneDay(locked);
expect(locked.stocks.commonParts.amount >= locked.stocks.commonParts.locked + locked.stocks.commonParts.reserved, 'daily maintenance never consumes locked parts');
let completion = createInitialM0State();
for (let day = 0; day < 8; day += 1) completion = advanceOneDay(completion);
equal(completion.waterworks.repaired, true, 'waterworks completes after eight standard days');
equal(completion.stocks.commonParts.locked, 16, 'waterworks consumes only its locked common parts on completion');
equal(completion.stocks.engineeringComponents.locked, 60, 'waterworks consumes only its locked components on completion');

const noFreeParts = createInitialM0State();
noFreeParts.oldRepairableParts = 0;
noFreeParts.stocks.commonParts.reserved = 5;
noFreeParts.stocks.commonParts.amount = noFreeParts.stocks.commonParts.locked + noFreeParts.stocks.commonParts.reserved;
equal(coverageDays(noFreeParts, 'commonParts'), 0, 'reserved parts do not count toward coverage');
const noFreePartsDay = advanceOneDay(noFreeParts);
equal(noFreePartsDay.ledger[0].resources.commonParts.inflow, 0, 'exhausted old parts produce no free parts');
equal(noFreePartsDay.ledger[0].resources.commonParts.outflow, 0, 'routine maintenance cannot consume locked parts');
equal(noFreePartsDay.maintenanceBacklog, 14, 'missing maintenance parts become backlog');
equal(noFreePartsDay.stocks.commonParts.reserved, 5, 'routine maintenance preserves reserved parts');

let approvedSalvage = setDailyMode(createInitialM0State(), 'maintenance', 'accelerated');
approvedSalvage = setHeadquartersSalvageApproval(approvedSalvage, true);
approvedSalvage.oldRepairableParts = 0;
approvedSalvage.maintenanceBacklog = 0;
approvedSalvage.stocks.commonParts.amount = approvedSalvage.stocks.commonParts.locked + 16;
const approvedSalvageDay = advanceOneDay(approvedSalvage);
equal(approvedSalvageDay.ledger[0].resources.commonParts.inflow, 4, 'approved low-efficiency salvage produces four parts');
equal(approvedSalvageDay.ledger[0].resources.commonParts.outflow, 3, 'approved low-efficiency salvage still pays routine maintenance');
equal(approvedSalvageDay.stocks.commonParts.amount, approvedSalvage.stocks.commonParts.amount + 1, 'approved low-efficiency salvage nets one part');
equal(approvedSalvageDay.headquartersSalvage.dismantledItems, 1, 'low-efficiency salvage records the lost headquarters item');

const fullPartsStore = createInitialM0State();
fullPartsStore.stocks.commonParts.amount = fullPartsStore.stocks.commonParts.capacity;
const fullPartsStoreDay = advanceOneDay(fullPartsStore);
equal(fullPartsStoreDay.stocks.commonParts.amount, 90, 'full parts store remains at capacity');
equal(fullPartsStoreDay.ledger[0].resources.commonParts.overflow, 0, 'repair stops instead of discarding overflow');
equal(fullPartsStoreDay.oldRepairableParts, 237, 'only storable same-day repair consumes old parts');

let safety = createInitialM0State();
safety.stocks.water.amount = 140;
safety = injectTestProject(safety, testProject('safety-p1', 'P1'));
safety = injectTestProject(safety, testProject('safety-p2', 'P2'));
safety = injectTestProject(safety, testProject('safety-p3', 'P3'));
const stableSafetyDay = advanceOneDay(safety);
equal(stableSafetyDay.projects.find((project) => project.id === 'safety-p1')?.status, 'active', 'stable safety line keeps P1');
equal(stableSafetyDay.projects.find((project) => project.id === 'safety-p2')?.status, 'active', 'stable safety line keeps P2');
equal(stableSafetyDay.projects.find((project) => project.id === 'safety-p3')?.status, 'paused', 'safety line pauses P3 first');

let decliningSafety = setDailyMode(createInitialM0State(), 'water', 'minimum');
decliningSafety.stocks.water.amount = 144;
decliningSafety = injectTestProject(decliningSafety, testProject('declining-p1', 'P1'));
decliningSafety = injectTestProject(decliningSafety, testProject('declining-p2', 'P2'));
decliningSafety = injectTestProject(decliningSafety, testProject('declining-p3', 'P3'));
const decliningSafetyDay = advanceOneDay(decliningSafety);
equal(decliningSafetyDay.projects.find((project) => project.id === 'declining-p1')?.status, 'active', 'declining safety line keeps P1 above hard-floor forecast');
equal(decliningSafetyDay.projects.find((project) => project.id === 'declining-p2')?.status, 'paused', 'declining safety line also pauses P2');
equal(decliningSafetyDay.projects.find((project) => project.id === 'declining-p3')?.status, 'paused', 'declining safety line pauses P3');

let hardSoon = setDailyMode(createInitialM0State(), 'water', 'minimum');
hardSoon.stocks.water.amount = 65;
hardSoon = injectTestProject(hardSoon, testProject('hard-soon-p1', 'P1'));
const hardSoonDay = advanceOneDay(hardSoon);
equal(hardSoonDay.stocks.water.amount, 61, 'hard-floor forecast fixture remains above the current hard floor');
equal(hardSoonDay.projects.find((project) => project.id === 'hard-soon-p1')?.status, 'paused', 'P1 pauses when two-day forecast reaches hard floor');

let hard = setDailyMode(createInitialM0State(), 'water', 'minimum');
hard.stocks.water.amount = 60;
hard = injectTestProject(hard, testProject('test-p1', 'P1'));
hard = injectTestProject(hard, testProject('test-p2', 'P2'));
hard = injectTestProject(hard, testProject('test-p3', 'P3'));
equal(workforceTotal(hard), hard.workforce.workable, 'active project staff are counted before pause');
const hardDay = advanceOneDay(hard);
for (const id of ['test-p1', 'test-p2', 'test-p3']) equal(hardDay.projects.find((project) => project.id === id)?.status, 'paused', `hard floor pauses ${id}`);
equal(hardDay.projects.find((project) => project.id === 'hq-waterworks-restoration')?.status, 'active', 'direct recovery remains active');
equal(workforceTotal(hardDay), hardDay.workforce.workable, 'paused staff return without ghost workers');

let waiting = setDailyMode(createInitialM0State(), 'water', 'minimum');
waiting.stocks.water.amount = 60;
waiting = injectTestProject(waiting, testProject('test-no-auto', 'P3', false, null));
const waitingDay = advanceOneDay(waiting);
equal(waitingDay.projects.find((project) => project.id === 'test-no-auto')?.status, 'waiting_confirmation', 'missing preauthorization and return plan waits for confirmation');
equal(waitingDay.workforce.standby, 2, 'project without a return plan keeps its people on standby');
equal(workforceTotal(waitingDay), waitingDay.workforce.workable, 'standby people remain in workforce accounting');

let recovery = createInitialM0State();
recovery = injectTestProject(recovery, testProject('recover-p1', 'P1'));
recovery = injectTestProject(recovery, testProject('recover-p2', 'P2'));
recovery = injectTestProject(recovery, testProject('recover-p3', 'P3'));
for (const project of recovery.projects.filter((item) => item.testOnly)) { project.status = 'paused'; project.staffing.actual = 0; }
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
shortage.stocks.water.amount = 0; shortage.stocks.food.amount = 0;
shortage.dailyModes.water = 'minimum'; shortage.dailyModes.food = 'minimum'; shortage.dailyModes.logistics = 'minimum';
const shortageDay = advanceOneDay(shortage);
equal(shortageDay.population.waterDebt, 1, 'water debt'); equal(shortageDay.population.foodDebt, 1, 'food debt'); equal(shortageDay.population.unableToWork, 28, 'water shortage removes working population'); equal(shortageDay.workforce.workable, 0, 'workable population recalculated');

const storage = new MemoryStorage();
saveM0State(first, storage);
const loaded = loadM0State(storage);
equal(JSON.stringify(advanceOneDay(loaded)), JSON.stringify(advanceOneDay(first)), 'save reload deterministic next day');
storage.values.set('always-game-m0-v1', '{broken');
equal(loadM0State(storage).day, 0, 'broken M0 save resets to initial state');
storage.values.set('always-game-m0-v1', JSON.stringify({ version: 1 }));
equal(loadM0State(storage).day, 0, 'incomplete same-version M0 save resets to initial state');
const malformedProject = JSON.parse(JSON.stringify(first)) as M0State;
delete (malformedProject.projects[0] as Partial<Project>).staffing;
storage.values.set('always-game-m0-v1', JSON.stringify(malformedProject));
equal(loadM0State(storage).day, 0, 'malformed project in same-version save resets safely');
const invalidMode = JSON.parse(JSON.stringify(first)) as M0State;
invalidMode.dailyModes.water = 'invalid' as M0State['dailyModes']['water'];
storage.values.set('always-game-m0-v1', JSON.stringify(invalidMode));
equal(loadM0State(storage).day, 0, 'invalid work mode in same-version save resets safely');
const oldOnly = new MemoryStorage();
oldOnly.values.set('always-game-text-idle-v6', JSON.stringify(first));
loadM0State(oldOnly);
expect(oldOnly.reads.every((key) => key === 'always-game-m0-v1'), 'old save key was read');
clearM0State(storage);

const pausedTime = advanceRealTime(createInitialM0State(), 20_000);
equal(pausedTime.day, 0, 'paused time does not advance');
const runningTime = setRunning(createInitialM0State(), true);
equal(advanceRealTime(runningTime, 19_000).day, 0, 'nineteen seconds does not settle a day');
equal(advanceRealTime(runningTime, 20_000).day, 1, 'twenty seconds settles one day');
const timeStorage = new MemoryStorage(); saveM0State(setRunning(createInitialM0State(), true), timeStorage);
equal(loadM0State(timeStorage).day, 0, 'save reload has no offline progression');

console.log('M0 core checks passed: T02, locks, staffing, priorities, safety, save validation, and time.');
