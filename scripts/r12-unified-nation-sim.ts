import { advanceNationKernelDays, startOperation, validateNationKernel } from '../src/v2/nationKernel';
import { createUnifiedNationSave } from '../src/v2/nationKernel/saveFixtures';
import { unifiedNationOperationDefinitions } from '../src/v2/nationKernel/unifiedNationContent';
import type { NationKernelState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function start(state: NationKernelState, id: string): NationKernelState {
  const next = startOperation(state, id);
  assert(next.operations[id]?.status === 'active', `operation did not start: ${id}`);
  return next;
}

let state = createUnifiedNationSave().state;
assert(validateNationKernel(state).ok, 'unified fixture violates R11 contract before vertical-slice test');
const definitions = unifiedNationOperationDefinitions({ polityId: 'polity.player', northCoreCityId: 'city.north-core', northPortCityId: 'city.north-port', centralCityId: 'city.central', coastCoreCityId: 'city.coast-core', coastSatelliteCityId: 'city.coast-satellite' });
assert(definitions.length === 30, `expected 30 content definitions, got ${definitions.length}`);
assert(definitions.filter((definition) => definition.kind === 'research').length === 10, 'research definition count mismatch');
assert(definitions.filter((definition) => definition.kind === 'engineering').length === 10, 'engineering definition count mismatch');
assert(definitions.filter((definition) => definition.kind === 'policy').length === 10, 'policy definition count mismatch');

const rejected = startOperation(state, 'operation.project.national-intertie');
assert(rejected === state && state.operations['operation.project.national-intertie'].status === 'planned', 'engineering bypassed its technology prerequisite');

for (const id of ['operation.tech.grid-dispatch', 'operation.tech.safe-water-standard', 'operation.tech.component-standardisation', 'operation.tech.systems-survey']) state = start(state, id);
state = advanceNationKernelDays(state, 22);
for (const id of ['capability.grid-dispatch', 'capability.safe-water-service', 'capability.industrial-standard', 'capability.systems-survey']) assert(state.polities['polity.player'].capabilities[id] != null, `missing completed capability: ${id}`);

for (const id of ['operation.project.national-intertie', 'operation.project.coast-waterworks', 'operation.project.north-repair-center', 'operation.project.technical-institute']) state = start(state, id);
state = advanceNationKernelDays(state, 38);
assert(state.networks['network.national-intertie']?.lifecycle.status === 'operating', 'intertie did not create a network');
assert(state.facilities['facility.coast-waterworks']?.lifecycle.status === 'operating', 'waterworks did not create a facility');
assert(state.cities['city.coast-core'].facilityIds.includes('facility.coast-waterworks'), 'completed facility was not attached to its city');
assert((state.quantities['city:city.coast-core']['service.waterCoverage']?.current ?? 0) > 77, 'waterworks did not improve city service coverage');
const ledgerHasFacility = state.ledger.some((entry) => entry.target === 'facility:facility.coast-waterworks.status' && entry.after === 'operating');
const ledgerHasCapability = state.ledger.some((entry) => entry.target.includes('capability.capability.grid-dispatch') && entry.after === 'scaled');
assert(ledgerHasFacility && ledgerHasCapability, 'ledger does not preserve capability and facility causes at the time they occur');

for (const id of ['operation.project.central-dispatch', 'operation.tech.network-operations', 'operation.tech.service-registry', 'operation.tech.urban-health-coordination']) state = start(state, id);
state = advanceNationKernelDays(state, 35);
assert(state.facilities['facility.central-dispatch']?.lifecycle.status === 'operating', 'central dispatch did not enter operation');
assert(state.polities['polity.player'].capabilities['capability.network-operations'] != null, 'network operation research did not complete');

for (const id of ['operation.tech.freight-routing', 'operation.project.registry-relay', 'operation.project.metro-clinic-network', 'operation.tech.civil-protection-protocols', 'operation.policy.maintenance-renewal']) state = start(state, id);
state = advanceNationKernelDays(state, 33);
assert(state.networks['network.service-registry-relay']?.lifecycle.status === 'operating', 'registry project did not create a network');
assert(state.facilities['facility.metro-clinic-network']?.lifecycle.status === 'operating', 'clinic project did not create a facility');
assert(state.operations['operation.policy.maintenance-renewal'].status === 'completed', 'finite policy did not finish');

state = start(state, 'operation.project.coastal-freight-corridor');
state = advanceNationKernelDays(state, 40);
assert(state.networks['network.coastal-freight-corridor']?.lifecycle.status === 'operating', 'freight corridor did not create a network');
state = start(state, 'operation.tech.resilience-modeling');
state = advanceNationKernelDays(state, 24);
state = start(state, 'operation.project.coastal-resilience-works');
state = advanceNationKernelDays(state, 36);
assert(state.facilities['facility.coastal-resilience-works']?.lifecycle.status === 'operating', 'resilience project did not create a facility');

assert(validateNationKernel(state).ok, 'unified fixture violates R11 contract after vertical-slice test');
console.log(JSON.stringify({ ok: true, definitions: definitions.length, day: state.calendar.day, facilities: Object.keys(state.facilities).length, networks: Object.keys(state.networks).length, coastWaterCoverage: state.quantities['city:city.coast-core']['service.waterCoverage'].current, maintenanceBacklog: state.quantities['polity:polity.player']['maintenance.backlog'].current, ledgerEntries: state.ledger.length }, null, 2));
