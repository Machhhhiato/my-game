import { advanceNationKernelDays, startOperation, validateNationKernel } from '../src/v2/nationKernel';
import { createUnifiedNationSave } from '../src/v2/nationKernel/saveFixtures';
import type { FacilityState, NationKernelState, OperationState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function add(state: NationKernelState, operation: OperationState): NationKernelState { return { ...state, operations: { ...state.operations, [operation.id]: operation } }; }
function start(state: NationKernelState, id: string): NationKernelState { const next = startOperation(state, id); assert(next !== state && next.operations[id]?.status === 'active', `operation did not start: ${id}`); return next; }
const playerId = 'polity.player';
const polityScope = { kind: 'polity' as const, id: playerId };
const authority: FacilityState['authority'] = { ownerId: playerId, operatorId: playerId, maintenanceOwnerId: playerId, commandAuthorityId: playerId, serviceScopes: [polityScope] };
const operation = (id: string, kind: OperationState['kind'], workRequired: number, effects: OperationState['effects'], extras: Partial<OperationState> = {}): OperationState => ({ id, definitionId: id, kind, polityId: playerId, scope: polityScope, status: 'planned', staffRequired: 20_000, workRequired, workDone: 0, elapsedDays: 0, startDemands: [], effects, ...extras });

let state = createUnifiedNationSave().state;
state = add(state, operation('operation.r28.precision-assembly', 'research', 3, [
  { kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.r28.precision-assembly', maturity: 'replicable', sourceIds: ['operation.r28.precision-assembly'] }, reasonKey: 'r28.precision-assembly.verified' },
]));
state = start(state, 'operation.r28.precision-assembly');
state = advanceNationKernelDays(state, 3);

state = add(state, operation('operation.r28.standard-guard-kit', 'design', 3, [
  { kind: 'design', timing: 'onComplete', design: { id: 'design.r28.guard-kit', polityId: playerId, kind: 'weapon', status: 'standardized', requiredCapabilityIds: ['capability.r28.precision-assembly'], tags: ['defense', 'standardized'], productionCost: 1, maintenanceLoad: 0.1, sourceIds: ['operation.r28.standard-guard-kit'] }, reasonKey: 'r28.guard-kit.standardized' },
], { prerequisites: { capabilityIds: ['capability.r28.precision-assembly'] } }));
state = start(state, 'operation.r28.standard-guard-kit');
state = advanceNationKernelDays(state, 3);

state = add(state, operation('operation.r28.guard-stockpile', 'engineering', 1, [
  { kind: 'stockpile', timing: 'onComplete', stockpile: { id: 'stockpile.r28.guard-kit', polityId: playerId, kind: 'equipment', designId: 'design.r28.guard-kit', quantity: 0, reserved: 0, capacity: 40, sourceFacilityIds: ['facility.r28.guard-armory'] }, reasonKey: 'r28.guard-kit.stockpile-created' },
]));
state = start(state, 'operation.r28.guard-stockpile');
state = advanceNationKernelDays(state, 1);

state = add(state, operation('operation.r28.guard-armory', 'engineering', 3, [
  { kind: 'facility', timing: 'onComplete', facility: { id: 'facility.r28.guard-armory', moduleId: 'module.r28.military-assembly', polityId: playerId, hostCityId: 'city.north-core', authority, lifecycle: { status: 'operating', condition: 88, maintenanceBacklog: 0 }, maintenanceStaffRequired: 2_000, recurringEffects: [] }, reasonKey: 'r28.guard-armory.commissioned' },
], { startDemands: [{ target: polityScope, quantityId: 'construction.ndu', amount: 10 }] }));
state = start(state, 'operation.r28.guard-armory');
state = advanceNationKernelDays(state, 3);

state = add(state, operation('operation.r28.guard-production', 'production', 1, [
  { kind: 'productionLine', timing: 'onComplete', productionLine: { id: 'production-line.r28.guard-kit', polityId: playerId, facilityId: 'facility.r28.guard-armory', designId: 'design.r28.guard-kit', stockpileId: 'stockpile.r28.guard-kit', status: 'operating', dailyOutput: 2, efficiency: 0.75, capacityRequired: 1 }, reasonKey: 'r28.guard-kit.line-opened' },
], { prerequisites: { facilityIds: ['facility.r28.guard-armory'], designIds: ['design.r28.guard-kit'] } }));
state = start(state, 'operation.r28.guard-production');
state = advanceNationKernelDays(state, 6);
assert((state.stockpiles['stockpile.r28.guard-kit']?.quantity ?? 0) >= 7, 'standardized design and operating line did not produce a usable equipment stockpile');

state = add(state, operation('operation.r28.border-guard', 'military', 2, [
  { kind: 'formation', timing: 'onComplete', formation: { id: 'formation.r28.border-guard', polityId: playerId, role: 'garrison', personnel: 8_000, training: 62, readiness: 74, equipment: [{ stockpileId: 'stockpile.r28.guard-kit', required: 6 }], homeRegionId: 'region.north', mission: 'border-security' }, reasonKey: 'r28.border-guard.deployed' },
], { startStockpileDemands: [{ stockpileId: 'stockpile.r28.guard-kit', amount: 6 }], prerequisites: { designIds: ['design.r28.guard-kit'] } }));
state = start(state, 'operation.r28.border-guard');
state = advanceNationKernelDays(state, 2);
assert(state.formations['formation.r28.border-guard'] != null, 'stockpiled equipment did not become a persistent military formation');

state = add(state, operation('operation.r28.orbital-observer-design', 'design', 2, [
  { kind: 'design', timing: 'onComplete', design: { id: 'design.r28.orbital-observer', polityId: playerId, kind: 'spaceVehicle', status: 'standardized', requiredCapabilityIds: ['capability.r28.precision-assembly'], tags: ['observation', 'orbital'], productionCost: 3, maintenanceLoad: 0.2, sourceIds: ['operation.r28.orbital-observer-design'] }, reasonKey: 'r28.orbital-observer.standardized' },
], { prerequisites: { capabilityIds: ['capability.r28.precision-assembly'] } }));
state = start(state, 'operation.r28.orbital-observer-design');
state = advanceNationKernelDays(state, 2);
state = add(state, operation('operation.r28.launch-kit', 'production', 1, [
  { kind: 'stockpile', timing: 'onComplete', stockpile: { id: 'stockpile.r28.launch-kit', polityId: playerId, kind: 'spaceComponent', designId: 'design.r28.orbital-observer', quantity: 1, reserved: 0, capacity: 3, sourceFacilityIds: ['facility.r28.launch-complex'] }, reasonKey: 'r28.launch-kit.assembled' },
]));
state = start(state, 'operation.r28.launch-kit');
state = advanceNationKernelDays(state, 1);
state = add(state, operation('operation.r28.launch-complex', 'engineering', 2, [
  { kind: 'facility', timing: 'onComplete', facility: { id: 'facility.r28.launch-complex', moduleId: 'module.r28.launch-complex', polityId: playerId, hostCityId: 'city.central', authority, lifecycle: { status: 'operating', condition: 90, maintenanceBacklog: 0 }, maintenanceStaffRequired: 1_500, recurringEffects: [] }, reasonKey: 'r28.launch-complex.commissioned' },
]));
state = start(state, 'operation.r28.launch-complex');
state = advanceNationKernelDays(state, 2);
state = add(state, operation('operation.r28.orbital-observation', 'space', 4, [
  { kind: 'spaceMission', timing: 'onStart', spaceMission: { id: 'mission.r28.orbital-observation', polityId: playerId, kind: 'observation', status: 'active', originFacilityId: 'facility.r28.launch-complex', targetRef: { kind: 'world', id: 'world.primary' }, vehicleDesignId: 'design.r28.orbital-observer' }, reasonKey: 'r28.orbital-observation.launched' },
  { kind: 'spaceMission', timing: 'onComplete', spaceMission: { id: 'mission.r28.orbital-observation', polityId: playerId, kind: 'observation', status: 'completed', originFacilityId: 'facility.r28.launch-complex', targetRef: { kind: 'world', id: 'world.primary' }, vehicleDesignId: 'design.r28.orbital-observer' }, reasonKey: 'r28.orbital-observation.completed' },
  { kind: 'spaceAsset', timing: 'onComplete', spaceAsset: { id: 'space-asset.r28.observer', polityId: playerId, kind: 'satellite', designId: 'design.r28.orbital-observer', lifecycle: { status: 'operating', condition: 100, maintenanceBacklog: 0 }, personnel: 0 }, reasonKey: 'r28.orbital-observer.operating' },
], { prerequisites: { facilityIds: ['facility.r28.launch-complex'], designIds: ['design.r28.orbital-observer'] }, startStockpileDemands: [{ stockpileId: 'stockpile.r28.launch-kit', amount: 1 }] }));
state = start(state, 'operation.r28.orbital-observation');
state = advanceNationKernelDays(state, 4);

assert(state.spaceMissions['mission.r28.orbital-observation']?.status === 'completed', 'space mission did not retain its lifecycle');
assert(state.spaceAssets['space-asset.r28.observer']?.lifecycle.status === 'operating', 'completed mission did not create an operating space asset');
assert(state.ledger.some((entry) => entry.target === 'design:design.r28.guard-kit.status'), 'design completion is absent from causal ledger');
assert(state.ledger.some((entry) => entry.reasonKey === 'productionLine.output'), 'production output is absent from causal ledger');
assert(state.ledger.some((entry) => entry.target === 'formation:formation.r28.border-guard.status'), 'formation deployment is absent from causal ledger');
assert(validateNationKernel(state).ok, `R28 core state invalid: ${validateNationKernel(state).errors.join(', ')}`);

console.log(JSON.stringify({ ok: true, day: state.calendar.day, designs: Object.keys(state.designs), stockpiles: Object.fromEntries(Object.entries(state.stockpiles).map(([id, stockpile]) => [id, stockpile.quantity])), formations: Object.keys(state.formations), productionLines: Object.keys(state.productionLines), spaceMission: state.spaceMissions['mission.r28.orbital-observation']?.status, spaceAssets: Object.keys(state.spaceAssets), ledgerEntries: state.ledger.length }, null, 2));
