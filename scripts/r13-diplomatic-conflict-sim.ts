import { advanceNationKernelDays, startOperation, validateNationKernel } from '../src/v2/nationKernel';
import { createDiplomaticConflictSave } from '../src/v2/nationKernel/saveFixtures';
import { diplomaticConflictOperationDefinitions } from '../src/v2/nationKernel/diplomaticConflictContent';
import type { NationKernelState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function start(state: NationKernelState, id: string): NationKernelState {
  const next = startOperation(state, id);
  assert(next.operations[id]?.status === 'active', `operation did not start: ${id}`);
  return next;
}

function runConflictSlice(): NationKernelState {
  let state = createDiplomaticConflictSave().state;
  assert(validateNationKernel(state).ok, 'conflict fixture violates R11 contract before conflict-slice test');
  for (const id of ['operation.tech.naval-maintenance', 'operation.tech.maritime-sensor-protocols', 'operation.tech.maritime-inspection']) state = start(state, id);
  state = advanceNationKernelDays(state, 22);
  for (const id of ['operation.project.naval-repair-berth', 'operation.project.coastal-sensor-net']) state = start(state, id);
  state = advanceNationKernelDays(state, 30);
  assert(state.fleets['fleet.player-sea'].vessels['vessel.patrol'].ready === 8, 'repair berth did not restore the patrol vessel');
  assert(state.fleets['fleet.player-sea'].vessels['vessel.patrol'].repairing === 0, 'repair berth did not clear patrol repair state');
  assert(state.networks['network.coastal-sensor-net']?.lifecycle.status === 'operating', 'sensor project did not create a network');
  state = start(state, 'operation.project.crisis-command-relay');
  state = advanceNationKernelDays(state, 25);
  for (const id of ['operation.military.convoy-readiness', 'operation.policy.port-maintenance-window', 'operation.diplomacy.incident-hotline', 'operation.diplomacy.transit-inspection']) state = start(state, id);
  state = advanceNationKernelDays(state, 32);
  return state;
}

const definitions = diplomaticConflictOperationDefinitions({ polityId: 'polity.player', neighborPolityId: 'polity.neighbor', northPortCityId: 'city.north-port', centralCityId: 'city.central', playerFleetId: 'fleet.player-sea', relationId: 'relation.player-neighbor' });
assert(definitions.length === 10, `expected 10 conflict definitions, got ${definitions.length}`);
const state = runConflictSlice();
assert(validateNationKernel(state).ok, 'conflict fixture violates R11 contract after conflict-slice test');
const fleet = state.fleets['fleet.player-sea'];
const relation = state.relations['relation.player-neighbor'];
assert(fleet.readiness > 88 && fleet.supplyDays > 33, 'military operations did not improve fleet readiness and supply');
assert(relation.trustAtoB > -24 && relation.trustBtoA >= -38, 'diplomacy operations did not improve bilateral trust');
assert(state.operations['operation.diplomacy.incident-hotline'].status === 'completed', 'finite diplomatic operation did not end');
const repeated = runConflictSlice();
assert(JSON.stringify(state) === JSON.stringify(repeated), 'diplomatic conflict slice is not deterministic');
console.log(JSON.stringify({ ok: true, definitions: definitions.length, day: state.calendar.day, fleet: { readiness: fleet.readiness, supplyDays: fleet.supplyDays, patrol: fleet.vessels['vessel.patrol'] }, relation: { trustAtoB: relation.trustAtoB, trustBtoA: relation.trustBtoA }, sensorNetwork: state.networks['network.coastal-sensor-net'].lifecycle.status, crisisRelay: state.facilities['facility.crisis-command-relay'].lifecycle.status, ledgerEntries: state.ledger.length }, null, 2));
