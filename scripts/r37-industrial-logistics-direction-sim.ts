import {
  advanceNationKernelDays,
  createGlobalUnificationPlaytestState,
  selectStrategicDirection,
  validateNationKernel,
} from '../src/v2/nationKernel';
import type { NationKernelState } from '../src/v2/nationKernel';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

function route(state: NationKernelState, industry: string, equipment: string, logistics: string): NationKernelState {
  return selectStrategicDirection(selectStrategicDirection(selectStrategicDirection(state, 'industry', industry), 'equipment', equipment), 'logistics', logistics);
}

function preparedProductionState(): NationKernelState {
  const state = createGlobalUnificationPlaytestState();
  const line = Object.values(state.productionLines).find((item) => item.polityId === state.playerPolityId && item.status === 'operating');
  assert(line != null, 'playtest needs an operating player production line');
  const stockpile = state.stockpiles[line.stockpileId];
  stockpile.quantity = 0; stockpile.reserved = 0; stockpile.targetReserve = 100;
  line.efficiency = .42; line.rampUp = .35;
  state.ledger = [];
  return state;
}

function producedInOneDay(state: NationKernelState): number {
  const next = advanceNationKernelDays(state, 1);
  return next.ledger.filter((entry) => entry.reasonKey === 'productionLine.output').reduce((sum, entry) => sum + (Number(entry.after) - Number(entry.before)), 0);
}

const productionBase = preparedProductionState();
const concentratedOutput = producedInOneDay(route(structuredClone(productionBase), 'direction.industry.1', 'direction.equipment.1', 'direction.logistics.1'));
const flexibleOutput = producedInOneDay(route(structuredClone(productionBase), 'direction.industry.2', 'direction.equipment.3', 'direction.logistics.2'));
const baselineOutput = producedInOneDay(structuredClone(productionBase));
assert(concentratedOutput > baselineOutput, 'concentrated industry did not improve existing line output');

const disruptedBase = createGlobalUnificationPlaytestState();
disruptedBase.civilizationSystems!.logistics.disruption = 52;
const trunk = advanceNationKernelDays(route(structuredClone(disruptedBase), 'direction.industry.1', 'direction.equipment.1', 'direction.logistics.1'), 30);
const redundant = advanceNationKernelDays(route(structuredClone(disruptedBase), 'direction.industry.2', 'direction.equipment.2', 'direction.logistics.2'), 30);
assert(redundant.civilizationSystems!.logistics.effectiveCapacity > trunk.civilizationSystems!.logistics.effectiveCapacity, 'redundant logistics did not recover more effective transport under disruption');

const attack = advanceNationKernelDays(route(createGlobalUnificationPlaytestState(), 'direction.industry.1', 'direction.equipment.1', 'direction.logistics.1'), 30);
const protectedRoute = advanceNationKernelDays(route(createGlobalUnificationPlaytestState(), 'direction.industry.4', 'direction.equipment.4', 'direction.logistics.4'), 30);
const attackSystems = attack.civilizationSystems!; const protectedSystems = protectedRoute.civilizationSystems!;
assert(protectedSystems.campaigns['campaign.final-corridor'].attackerPersonnelLosses < attackSystems.campaigns['campaign.final-corridor'].attackerPersonnelLosses, 'protection route did not reduce player campaign casualties');
assert(protectedSystems.economy.civilianAvailability > attackSystems.economy.civilianAvailability, 'civilian-priority route did not improve daily civilian availability');

const horizons = [30, 90, 360, 720].map((days) => {
  const scale = advanceNationKernelDays(route(createGlobalUnificationPlaytestState(), 'direction.industry.1', 'direction.equipment.1', 'direction.logistics.1'), days);
  const resilience = advanceNationKernelDays(route(createGlobalUnificationPlaytestState(), 'direction.industry.2', 'direction.equipment.2', 'direction.logistics.2'), days);
  const care = advanceNationKernelDays(route(createGlobalUnificationPlaytestState(), 'direction.industry.4', 'direction.equipment.4', 'direction.logistics.4'), days);
  [scale, resilience, care].forEach((state) => { const validation = validateNationKernel(state); assert(validation.ok, validation.errors.join(', ')); });
  return {
    days,
    scale: { logistics: scale.civilizationSystems!.logistics.effectiveCapacity, civilian: scale.civilizationSystems!.economy.civilianAvailability, losses: scale.civilizationSystems!.campaigns['campaign.final-corridor'].attackerPersonnelLosses },
    resilience: { logistics: resilience.civilizationSystems!.logistics.effectiveCapacity, civilian: resilience.civilizationSystems!.economy.civilianAvailability, losses: resilience.civilizationSystems!.campaigns['campaign.final-corridor'].attackerPersonnelLosses },
    care: { logistics: care.civilizationSystems!.logistics.effectiveCapacity, civilian: care.civilizationSystems!.economy.civilianAvailability, losses: care.civilizationSystems!.campaigns['campaign.final-corridor'].attackerPersonnelLosses },
  };
});

console.log(JSON.stringify({ ok: true, firstDayProduction: { baselineOutput, concentratedOutput, flexibleOutput }, disruption30: { trunk: trunk.civilizationSystems!.logistics.effectiveCapacity, redundant: redundant.civilizationSystems!.logistics.effectiveCapacity }, horizons }, null, 2));
