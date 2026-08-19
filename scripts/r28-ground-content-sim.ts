import { advanceNationKernelDays, startOperation, validateNationKernel } from '../src/v2/nationKernel';
import { installContentPackage } from '../src/v2/nationKernel/contentPackage';
import { R28_GROUND_CONTENT_PACKAGE } from '../src/v2/nationKernel/r28GroundContent';
import { createUnifiedNationSave } from '../src/v2/nationKernel/saveFixtures';
import type { NationKernelState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function start(state: NationKernelState, operationId: string): NationKernelState {
  const next = startOperation(state, operationId);
  assert(next !== state && next.operations[operationId]?.status === 'active', `operation did not start: ${operationId}`);
  return next;
}

function blocked(state: NationKernelState, operationId: string, message: string): void {
  assert(startOperation(state, operationId) === state, message);
}

let state = createUnifiedNationSave().state;
const playerId = state.playerPolityId;
const polityQuantities = state.quantities[`polity:${playerId}`];
const initialDefense = polityQuantities['capacity.defense'].current;

const wrongRole = installContentPackage(state, R28_GROUND_CONTENT_PACKAGE, {
  playerPolity: playerId,
  industrialCoreCity: 'city.north-core',
  borderRegion: 'city.central',
});
assert(!wrongRole.ok && wrongRole.errors.some((error) => error.includes('existing region')), 'role binding accepted a city as the border region');

blocked(state, 'operation.r28b.guard-equipment-design', 'design started before industrial standard capability existed');
blocked(state, 'operation.r29a.mobile-heavy-equipment-design', 'alternative design started before industrial standard capability existed');
blocked(state, 'operation.r28b.military-assembly-works', 'factory started before industrial standard capability existed');
blocked(state, 'operation.r28b.border-guard-formation', 'formation started before design, line and inventory existed');
blocked(state, 'operation.r29a.mobile-heavy-tooling', 'heavy tooling started before design and factory existed');
blocked(state, 'operation.r29a.retool-mobile-heavy-line', 'heavy retool started before tooling and the shared line existed');
blocked(state, 'operation.r29a.mobile-reserve-formation', 'mobile formation started before heavy production and inventory existed');
blocked(state, 'operation.r29a.retool-guard-line', 'return retool started before the shared line had switched to heavy equipment');
blocked(state, 'operation.r28b.frontier-outpost', 'outpost started before the guard formation existed');
blocked(state, 'operation.r28b.frontier-registry', 'registry started before the frontier outpost existed');
blocked(state, 'operation.r28b.frontier-supply-link', 'supply link started before registry capability existed');
blocked(state, 'operation.r28b.frontier-service-mission', 'service mission started before supply network existed');
blocked(state, 'operation.r28b.initial-integration-mandate', 'integration mandate started before registration, supply and services existed');

state = start(state, 'operation.r28b.industrial-standard');
state = advanceNationKernelDays(state, 12);
assert(state.polities[playerId]?.capabilities['capability.r28b.interchangeable-production']?.maturity === 'replicable', 'industrial standard did not create a replicable capability');
blocked(state, 'operation.r28b.military-assembly-works', 'factory started before a standardized equipment design existed');

state = start(state, 'operation.r28b.guard-equipment-design');
state = advanceNationKernelDays(state, 9);
assert(state.designs['design.r28b.guard-equipment']?.status === 'standardized', 'guard equipment design was not standardized');
assert(state.designs['design.r28b.guard-equipment']?.performance?.reliability === 84, 'design trade-off fields were not preserved');
assert(state.designs['design.r28b.guard-equipment']?.identity?.presentationId === 'presentation.r28b.guard-equipment', 'strategic asset identity was not preserved');
assert(state.designs['design.r28b.guard-equipment']?.impact?.destructiveEffects.includes('areaDenial'), 'imaginable impact facts were not preserved');
assert(state.designs['design.r28b.guard-equipment']?.constraints?.minimumSupplyDays === 12, 'asset limitation facts were not preserved');
assert(state.quantities[`polity:${playerId}`]['capacity.defense'].current === initialDefense, 'design completion incorrectly increased defense before production and deployment');

state = start(state, 'operation.r29a.mobile-heavy-equipment-design');
state = advanceNationKernelDays(state, 14);
const mobileHeavyDesign = state.designs['design.r29a.mobile-heavy-equipment'];
assert(mobileHeavyDesign?.performance?.effectiveness === 78 && mobileHeavyDesign.performance.reliability === 55, 'alternative design trade-off was not preserved');
assert(mobileHeavyDesign?.productionCost === 2.1 && mobileHeavyDesign.maintenanceLoad === 0.42, 'alternative design did not carry its industrial burden');
assert(mobileHeavyDesign?.constraints?.minimumSupplyDays === 18 && mobileHeavyDesign.impact?.penetrationClass === 'medium', 'alternative design impact or logistics boundary was not preserved');
assert(state.quantities[`polity:${playerId}`]['capacity.defense'].current === initialDefense, 'alternative paper design incorrectly increased defense before production and deployment');

state = start(state, 'operation.r28b.military-assembly-works');
state = advanceNationKernelDays(state, 15);
assert(state.facilities['facility.r28b.military-assembly-works']?.lifecycle.status === 'operating', 'military assembly works did not become an operating facility');
assert(state.stockpiles['stockpile.r28b.guard-equipment']?.quantity === 0, 'factory completion created free equipment');
assert(state.stockpiles['stockpile.r28b.guard-equipment']?.targetReserve === 24, 'equipment reserve target was not preserved');

state = start(state, 'operation.r28b.guard-equipment-line');
state = advanceNationKernelDays(state, 4);
assert(state.productionLines['production-line.r28b.guard-equipment']?.status === 'operating', 'equipment production line did not start operating');

state = advanceNationKernelDays(state, 18);
const produced = state.stockpiles['stockpile.r28b.guard-equipment']?.quantity ?? 0;
assert(produced >= 16, 'operating line did not produce enough traceable equipment for formation and outpost');
assert(state.productionLines['production-line.r28b.guard-equipment']?.rampUp === 1, 'equipment line did not complete its visible production ramp-up');

const offlineState = structuredClone(state) as NationKernelState;
offlineState.facilities['facility.r28b.military-assembly-works'].lifecycle.status = 'offline';
const offlineBefore = offlineState.stockpiles['stockpile.r28b.guard-equipment'].quantity;
const offlineAfter = advanceNationKernelDays(offlineState, 3);
assert(offlineAfter.stockpiles['stockpile.r28b.guard-equipment'].quantity === offlineBefore, 'offline factory continued producing equipment');

state = start(state, 'operation.r28b.border-guard-formation');
state = advanceNationKernelDays(state, 6);
assert(state.formations['formation.r28b.border-guard']?.homeRegionId === 'region.north', 'guard formation did not bind to the supplied border region role');
assert(state.formations['formation.r28b.border-guard']?.equipmentReadiness === 100 && state.formations['formation.r28b.border-guard']?.supplyDays === 24, 'formation logistics fields were not preserved');
assert(state.stockpiles['stockpile.r28b.guard-equipment'].quantity < produced, 'formation did not consume actual equipment inventory');
assert(state.quantities[`polity:${playerId}`]['capacity.defense'].current === initialDefense + 3, 'defense changed before or beyond actual formation deployment');

state = start(state, 'operation.r28b.frontier-outpost');
state = advanceNationKernelDays(state, 8);
const frontier = state.regions['region.r28b.frontier'];
assert(frontier?.territory?.control === 42, 'frontier outpost did not create limited control');
assert(frontier?.territory?.integration === 8, 'frontier outpost granted excessive integration');
assert(frontier?.territory?.taxBase === 0, 'frontier outpost incorrectly granted immediate tax income');
assert(frontier?.territory?.threat === 61, 'frontier threat was erased by military presence');
assert(state.polities[playerId]?.territoryRegionIds.includes('region.r28b.frontier'), 'new frontier region was not registered in polity territory');
assert(state.facilities['facility.r28b.frontier-outpost']?.lifecycle.status === 'operating', 'frontier outpost did not become a persistent facility');
assert(state.polities[playerId]?.capabilities['capability.r28b.frontier-presence']?.maturity === 'prototype', 'frontier presence capability was not recorded');
assert(frontier?.territory?.taxBase === 0, 'military presence produced tax income before civil integration');

state = start(state, 'operation.r28b.frontier-registry');
state = advanceNationKernelDays(state, 7);
assert(state.polities[playerId]?.capabilities['capability.r28b.frontier-registry']?.maturity === 'replicable', 'frontier registry capability was not established');
assert(state.regions['region.r28b.frontier']?.integration.registry === 30, 'registry work did not improve the administrative fact');
assert(state.regions['region.r28b.frontier']?.territory?.taxBase === 0, 'registration alone produced tax income');

state = start(state, 'operation.r28b.frontier-supply-link');
state = advanceNationKernelDays(state, 12);
assert(state.networks['network.r28b.frontier-supply-link']?.lifecycle.status === 'operating', 'frontier supply link did not become a persistent operating network');
assert(state.networks['network.r28b.frontier-supply-link']?.endpointIds.includes('facility.r28b.frontier-outpost'), 'frontier supply link lost its real outpost endpoint');
assert(state.regions['region.r28b.frontier']?.territory?.development === 11, 'supply link did not improve frontier development conditions');
assert(state.regions['region.r28b.frontier']?.territory?.taxBase === 0, 'supply infrastructure alone produced tax income');

state = start(state, 'operation.r28b.frontier-service-mission');
state = advanceNationKernelDays(state, 10);
assert(state.polities[playerId]?.capabilities['capability.r28b.frontier-service-responsibility']?.maturity === 'prototype', 'service mission did not leave a public responsibility capability');
assert(state.regions['region.r28b.frontier']?.integration.services === 28, 'service mission did not accumulate daily service progress');
assert(state.regions['region.r28b.frontier']?.territory?.taxBase === 0, 'temporary public service mission produced tax income before integration');

state = start(state, 'operation.r28b.initial-integration-mandate');
state = advanceNationKernelDays(state, 6);
const integratedFrontier = state.regions['region.r28b.frontier'];
assert(integratedFrontier?.territory?.control === 62, 'initial integration did not preserve partial control');
assert(integratedFrontier?.territory?.integration === 41, 'initial integration progress is missing or excessive');
assert(integratedFrontier?.territory?.development === 24, 'initial integration development result is incorrect');
assert(integratedFrontier?.territory?.taxBase === 6, 'tax base did not appear only after the complete civil chain');
assert(integratedFrontier?.territory?.threat === 42, 'initial integration erased or failed to reduce frontier threat');
assert(integratedFrontier?.territory?.infrastructure === 32 && integratedFrontier?.territory?.resourcePotential === 42, 'frontier infrastructure or resource potential was not preserved');
assert((state.stockpiles['stockpile.r28b.guard-equipment']?.quantity ?? 0) >= 23.5 && (state.stockpiles['stockpile.r28b.guard-equipment']?.quantity ?? 0) <= 24, 'production and field replenishment did not settle near the strategic reserve target');
assert(state.polities[playerId]?.capabilities['capability.r28b.initial-frontier-integration']?.maturity === 'prototype', 'initial integration capability was not recorded');

state = start(state, 'operation.r29a.mobile-heavy-tooling');
state = advanceNationKernelDays(state, 8);
assert(state.stockpiles['stockpile.r29a.mobile-heavy-equipment']?.quantity === 0, 'tooling preparation created free heavy equipment');
const guardReserveBeforeRetool = state.stockpiles['stockpile.r28b.guard-equipment'].quantity;
state = start(state, 'operation.r29a.retool-mobile-heavy-line');
assert(state.productionLines['production-line.r28b.guard-equipment']?.status === 'retooling', 'shared line did not stop for retooling');
state = advanceNationKernelDays(state, 6);
const sharedLine = state.productionLines['production-line.r28b.guard-equipment'];
assert(sharedLine?.designId === 'design.r29a.mobile-heavy-equipment' && sharedLine.stockpileId === 'stockpile.r29a.mobile-heavy-equipment', 'shared line did not switch to the heavy design and stockpile');
assert(sharedLine?.rampUp === 0.25, 'line conversion did not impose a fresh ramp-up loss');
assert(state.stockpiles['stockpile.r28b.guard-equipment'].quantity <= guardReserveBeforeRetool, 'guard equipment inventory increased while the shared line was retooling');
state = advanceNationKernelDays(state, 25);
assert((state.stockpiles['stockpile.r29a.mobile-heavy-equipment']?.quantity ?? 0) >= 8, 'converted line did not produce enough heavy equipment for a real formation');
state = start(state, 'operation.r29a.mobile-reserve-formation');
state = advanceNationKernelDays(state, 8);
assert(state.formations['formation.r29a.mobile-reserve']?.equipment[0]?.stockpileId === 'stockpile.r29a.mobile-heavy-equipment', 'mobile reserve did not receive actual heavy equipment');
assert(state.quantities[`polity:${playerId}`]['capacity.defense'].current === initialDefense + 8, 'defense did not reflect the two actually equipped formations');
const returnRetoolStartedDay = state.calendar.day;
state = start(state, 'operation.r29a.retool-guard-line');
assert(state.productionLines['production-line.r28b.guard-equipment']?.status === 'retooling', 'shared line did not stop for the return retool');
state = advanceNationKernelDays(state, 5);
assert(state.productionLines['production-line.r28b.guard-equipment']?.designId === 'design.r28b.guard-equipment', 'shared line did not return to guard equipment');
assert(state.productionLines['production-line.r28b.guard-equipment']?.rampUp === 0.4, 'return conversion did not impose a new ramp-up loss');
state = advanceNationKernelDays(state, 3);
assert(!state.ledger.some((entry) => entry.day > returnRetoolStartedDay && entry.target === 'stockpile:stockpile.r29a.mobile-heavy-equipment.quantity' && entry.reasonKey === 'productionLine.output'), 'heavy equipment production continued after the return retool started');
assert(state.ledger.some((entry) => entry.reasonKey === 'productionLine.output'), 'production output is absent from causal ledger');
assert(state.ledger.some((entry) => entry.reasonKey === 'r29a.mobile-reserve.deployed'), 'recent formation deployment is absent from the bounded causal ledger');

const validation = validateNationKernel(state);
assert(validation.ok, `R28-B state invalid: ${validation.errors.join(', ')}`);

console.log(JSON.stringify({
  ok: true,
  day: state.calendar.day,
  capability: state.polities[playerId]?.capabilities['capability.r28b.interchangeable-production']?.maturity,
  design: state.designs['design.r28b.guard-equipment']?.status,
  alternativeDesign: state.designs['design.r29a.mobile-heavy-equipment']?.status,
  factory: state.facilities['facility.r28b.military-assembly-works']?.lifecycle.status,
  line: state.productionLines['production-line.r28b.guard-equipment']?.status,
  remainingEquipment: state.stockpiles['stockpile.r28b.guard-equipment']?.quantity,
  formation: state.formations['formation.r28b.border-guard']?.mission,
  mobileFormation: state.formations['formation.r29a.mobile-reserve']?.mission,
  activeLineDesign: state.productionLines['production-line.r28b.guard-equipment']?.designId,
  frontier: integratedFrontier?.territory,
  civilIntegration: integratedFrontier?.integration,
  ledgerEntries: state.ledger.length,
}, null, 2));
