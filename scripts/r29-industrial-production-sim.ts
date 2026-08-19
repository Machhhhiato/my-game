import { advanceNationKernelDays, applyFormationEquipmentLoss, assignProductionFactories, calculateRetooledEfficiency, createIndustrialStrategy, createProductionLine, damageIndustrialFacility, retoolProductionLine, setIndustrialStrategy, setProductionLinePaused, startOperation, validateNationKernel } from '../src/v2/nationKernel';
import { createUnifiedNationSave } from '../src/v2/nationKernel/saveFixtures';
import type { NationKernelState, ProductionLineState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function start(state: NationKernelState, operationId: string): NationKernelState {
  const next = startOperation(state, operationId);
  assert(next !== state && next.operations[operationId]?.status === 'active', `operation did not start: ${operationId}`);
  return next;
}

let state = createUnifiedNationSave().state;
const playerId = state.playerPolityId;
state = advanceNationKernelDays(start(state, 'operation.r28b.industrial-standard'), 12);
state = start(state, 'operation.r28b.guard-equipment-design');
state = start(state, 'operation.r29a.mobile-heavy-equipment-design');
state = advanceNationKernelDays(state, 14);
state = advanceNationKernelDays(start(state, 'operation.r28b.military-assembly-works'), 15);
state = advanceNationKernelDays(start(state, 'operation.r29a.mobile-heavy-tooling'), 8);

const guardLine: ProductionLineState = {
  id: 'production-line.r29b.guard-column', polityId: playerId, facilityId: 'facility.r28b.military-assembly-works',
  designId: 'design.r28b.guard-equipment', stockpileId: 'stockpile.r28b.guard-equipment', status: 'operating', dailyOutput: 0,
  efficiency: 0.35, capacityRequired: 5, assignedFactoryUnits: 5, baseOutputPerFactory: 0.38, efficiencyCap: 0.8,
  efficiencyGainPerDay: 0.018, productionFamilyId: 'production-family.ground-equipment', rampUp: 1, inputAvailability: 0.9, maintenanceLoad: 0.18,
};
const heavyLine: ProductionLineState = {
  id: 'production-line.r29b.mobile-heavy-column', polityId: playerId, facilityId: 'facility.r28b.military-assembly-works',
  designId: 'design.r29a.mobile-heavy-equipment', stockpileId: 'stockpile.r29a.mobile-heavy-equipment', status: 'operating', dailyOutput: 0,
  efficiency: 0.35, capacityRequired: 3, assignedFactoryUnits: 3, baseOutputPerFactory: 0.16, efficiencyCap: 0.8,
  efficiencyGainPerDay: 0.018, productionFamilyId: 'production-family.ground-equipment', rampUp: 1, inputAvailability: 0.78, maintenanceLoad: 0.42,
};
state.productionLines = {};
state = createProductionLine(state, guardLine);
state = createProductionLine(state, heavyLine);
assert(Object.keys(state.productionLines).length === 2, 'reusable commands did not create both production columns');
assert(assignProductionFactories(state, guardLine.id, 6) === state, 'factory allocation command accepted 9/8 factories');
state = setProductionLinePaused(state, heavyLine.id, true);
state = assignProductionFactories(state, guardLine.id, 8);
assert(state.productionLines[guardLine.id].assignedFactoryUnits === 8, 'paused capacity was not released for reassignment');
assert(setProductionLinePaused(state, heavyLine.id, false) === state, 'paused line resumed despite insufficient free factories');
state = assignProductionFactories(state, guardLine.id, 5);
state = setProductionLinePaused(state, heavyLine.id, false);
assert(state.productionLines[heavyLine.id].status === 'operating', 'production column did not resume after capacity became available');
state.stockpiles['stockpile.r28b.guard-equipment'].quantity = 0;
state.stockpiles['stockpile.r29a.mobile-heavy-equipment'].quantity = 0;

const concentrated = createIndustrialStrategy('policy.industry.war-economy', 'technology-route.industry.concentrated');
const flexible = createIndustrialStrategy('policy.industry.war-economy', 'technology-route.industry.flexible');
const civilian = createIndustrialStrategy('policy.industry.civilian-economy', 'technology-route.industry.concentrated');
assert(concentrated != null && flexible != null && civilian != null, 'industrial strategy catalog did not resolve approved policy and routes');

const concentratedState = setIndustrialStrategy(state, concentrated);
const flexibleState = setIndustrialStrategy(state, flexible);
const concentratedFirstDay = advanceNationKernelDays(concentratedState, 1).stockpiles['stockpile.r28b.guard-equipment'].quantity;
const flexibleFirstDay = advanceNationKernelDays(flexibleState, 1).stockpiles['stockpile.r28b.guard-equipment'].quantity;
const civilianState = setIndustrialStrategy(state, civilian);
const civilianFirstDay = advanceNationKernelDays(civilianState, 1).stockpiles['stockpile.r28b.guard-equipment'].quantity;
const concentratedAfter = advanceNationKernelDays(concentratedState, 10);
const flexibleAfter = advanceNationKernelDays(flexibleState, 10);

const concentratedGuard = concentratedAfter.stockpiles['stockpile.r28b.guard-equipment'].quantity;
const flexibleGuard = flexibleAfter.stockpiles['stockpile.r28b.guard-equipment'].quantity;
assert(concentratedFirstDay > flexibleFirstDay, 'concentrated industry did not produce more at equal line efficiency');
assert(concentratedFirstDay > civilianFirstDay, 'war economy did not increase military output over civilian economy');
assert(concentrated.civilianConstructionModifier! < civilian.civilianConstructionModifier!, 'war economy did not carry a civilian construction trade-off');
assert(advanceNationKernelDays(concentratedState, 30).budget.stability < advanceNationKernelDays(civilianState, 30).budget.stability, 'war economy did not accumulate a social stability cost');
assert(flexibleAfter.productionLines[guardLine.id].efficiency > concentratedAfter.productionLines[guardLine.id].efficiency, 'flexible lines did not gain efficiency faster');
assert(calculateRetooledEfficiency(0.8, false, flexible) > calculateRetooledEfficiency(0.8, false, concentrated), 'flexible lines did not retain more efficiency after a cross-family switch');
assert(concentratedAfter.stockpiles['stockpile.r29a.mobile-heavy-equipment'].quantity > 0 && flexibleAfter.stockpiles['stockpile.r29a.mobile-heavy-equipment'].quantity > 0, 'parallel production columns did not both produce equipment');
assert(validateNationKernel(concentratedAfter).ok, 'valid eight-factory allocation failed validation');

const concentratedRetool = retoolProductionLine(concentratedAfter, guardLine.id, { designId: 'design.r29a.mobile-heavy-equipment', stockpileId: 'stockpile.r29a.mobile-heavy-equipment', productionFamilyId: 'production-family.mobile-heavy', baseOutputPerFactory: 0.16, efficiencyCap: 0.8, efficiencyGainPerDay: 0.018, inputAvailability: 0.78, maintenanceLoad: 0.42 });
const flexibleRetool = retoolProductionLine(flexibleAfter, guardLine.id, { designId: 'design.r29a.mobile-heavy-equipment', stockpileId: 'stockpile.r29a.mobile-heavy-equipment', productionFamilyId: 'production-family.mobile-heavy', baseOutputPerFactory: 0.16, efficiencyCap: 0.8, efficiencyGainPerDay: 0.018, inputAvailability: 0.78, maintenanceLoad: 0.42 });
assert(flexibleRetool.productionLines[guardLine.id].efficiency > concentratedRetool.productionLines[guardLine.id].efficiency, 'automatic retool did not apply route-specific retention');
assert((flexibleRetool.productionLines[guardLine.id].retoolingDaysRemaining ?? 99) < (concentratedRetool.productionLines[guardLine.id].retoolingDaysRemaining ?? 0), 'flexible route did not retool faster');

const concentratedDamaged = damageIndustrialFacility(concentratedAfter, 'facility.r28b.military-assembly-works', 20);
const flexibleDamaged = damageIndustrialFacility(flexibleAfter, 'facility.r28b.military-assembly-works', 20);
assert((concentratedDamaged.facilities['facility.r28b.military-assembly-works'].industrialCapacity?.damagedFactoryUnits ?? 0) > (flexibleDamaged.facilities['facility.r28b.military-assembly-works'].industrialCapacity?.damagedFactoryUnits ?? 0), 'concentrated route did not carry higher facility damage risk');
const repaired = advanceNationKernelDays(flexibleDamaged, 5);
assert((repaired.facilities['facility.r28b.military-assembly-works'].industrialCapacity?.damagedFactoryUnits ?? 99) < (flexibleDamaged.facilities['facility.r28b.military-assembly-works'].industrialCapacity?.damagedFactoryUnits ?? 0), 'damaged factories did not recover through maintenance');

const replenishmentState = structuredClone(state) as NationKernelState;
replenishmentState.productionLines[guardLine.id].status = 'paused'; replenishmentState.productionLines[heavyLine.id].status = 'paused';
replenishmentState.stockpiles['stockpile.r28b.guard-equipment'].quantity = 3;
replenishmentState.formations['formation.r29b.priority-high'] = { id: 'formation.r29b.priority-high', polityId: playerId, role: 'field', personnel: 5_000, training: 70, readiness: 70, equipment: [{ stockpileId: 'stockpile.r28b.guard-equipment', required: 10, delivered: 10 }], equipmentReadiness: 100, autoReplenish: true, replenishmentPriority: 3, mission: 'priority-test' };
replenishmentState.formations['formation.r29b.priority-low'] = { id: 'formation.r29b.priority-low', polityId: playerId, role: 'garrison', personnel: 5_000, training: 60, readiness: 60, equipment: [{ stockpileId: 'stockpile.r28b.guard-equipment', required: 10, delivered: 10 }], equipmentReadiness: 100, autoReplenish: true, replenishmentPriority: 0, mission: 'priority-test' };
let lossState = applyFormationEquipmentLoss(replenishmentState, 'formation.r29b.priority-high', 0.5, 'test.frontline-loss');
lossState = applyFormationEquipmentLoss(lossState, 'formation.r29b.priority-low', 0.5, 'test.garrison-loss');
lossState = advanceNationKernelDays(lossState, 1);
assert((lossState.formations['formation.r29b.priority-high'].equipment[0].delivered ?? 0) > 7.9, 'high-priority formation did not receive the limited replacement stock first');
assert((lossState.formations['formation.r29b.priority-low'].equipment[0].delivered ?? 10) < 5, 'low-priority formation consumed stock before the high-priority formation');
assert(lossState.stockpiles['stockpile.r28b.guard-equipment'].quantity === 0, 'automatic replenishment did not consume real inventory');

const wearState = structuredClone(state) as NationKernelState;
for (const line of Object.values(wearState.productionLines)) line.status = 'paused';
wearState.stockpiles['stockpile.r28b.guard-equipment'].quantity = 0; wearState.stockpiles['stockpile.r29a.mobile-heavy-equipment'].quantity = 0;
wearState.formations['formation.r29b.guard-wear'] = { id: 'formation.r29b.guard-wear', polityId: playerId, role: 'garrison', personnel: 4_000, training: 60, readiness: 70, equipment: [{ stockpileId: 'stockpile.r28b.guard-equipment', required: 10, delivered: 10 }], equipmentReadiness: 100, autoReplenish: false, mission: 'wear-test' };
wearState.formations['formation.r29b.heavy-wear'] = { id: 'formation.r29b.heavy-wear', polityId: playerId, role: 'field', personnel: 4_000, training: 60, readiness: 70, equipment: [{ stockpileId: 'stockpile.r29a.mobile-heavy-equipment', required: 10, delivered: 10 }], equipmentReadiness: 100, autoReplenish: false, mission: 'wear-test' };
const worn = advanceNationKernelDays(wearState, 30);
assert((worn.formations['formation.r29b.heavy-wear'].equipment[0].delivered ?? 10) < (worn.formations['formation.r29b.guard-wear'].equipment[0].delivered ?? 0), 'less reliable high-maintenance equipment did not wear faster');

const overallocated = structuredClone(state) as NationKernelState;
overallocated.productionLines[guardLine.id].assignedFactoryUnits = 6;
const invalid = validateNationKernel(overallocated);
assert(!invalid.ok && invalid.errors.some((error) => error.startsWith('overallocated-factory-units:')), 'nine factories were accepted in an eight-factory facility');

console.log(JSON.stringify({
  ok: true,
  factoryPool: state.facilities['facility.r28b.military-assembly-works'].industrialCapacity,
  allocation: { guard: 5, mobileHeavy: 3, total: 8 },
  concentrated: { guardOutputFirstDay: concentratedFirstDay, guardOutput10Days: concentratedGuard, finalEfficiency: concentratedAfter.productionLines[guardLine.id].efficiency, crossFamilyRetention: calculateRetooledEfficiency(0.8, false, concentrated) },
  flexible: { guardOutputFirstDay: flexibleFirstDay, guardOutput10Days: flexibleGuard, finalEfficiency: flexibleAfter.productionLines[guardLine.id].efficiency, crossFamilyRetention: calculateRetooledEfficiency(0.8, false, flexible) },
  overAllocationRejected: true,
  reusableCommands: true,
  retoolingDays: { concentrated: concentratedRetool.productionLines[guardLine.id].retoolingDaysRemaining, flexible: flexibleRetool.productionLines[guardLine.id].retoolingDaysRemaining },
  damagedFactories: { concentrated: concentratedDamaged.facilities['facility.r28b.military-assembly-works'].industrialCapacity?.damagedFactoryUnits, flexible: flexibleDamaged.facilities['facility.r28b.military-assembly-works'].industrialCapacity?.damagedFactoryUnits },
  replenishmentPriority: { high: lossState.formations['formation.r29b.priority-high'].equipment[0].delivered, low: lossState.formations['formation.r29b.priority-low'].equipment[0].delivered },
  policyTradeoff: { warFirstDay: concentratedFirstDay, civilianFirstDay, warStability30Days: advanceNationKernelDays(concentratedState, 30).budget.stability, civilianStability30Days: advanceNationKernelDays(civilianState, 30).budget.stability },
  dailyWear30Days: { guardDelivered: worn.formations['formation.r29b.guard-wear'].equipment[0].delivered, heavyDelivered: worn.formations['formation.r29b.heavy-wear'].equipment[0].delivered },
}, null, 2));
