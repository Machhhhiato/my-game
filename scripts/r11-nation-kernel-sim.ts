import { advanceNationKernelDays, availableWorkforce, rebuildMetroSummaries, startOperation, validateNationKernel } from '../src/v2/nationKernel';
import { createNationKernelFixture } from '../src/v2/nationKernel/fixture';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
let state = createNationKernelFixture();
assert(validateNationKernel(state).ok, 'fixture violates R11 contract');
rebuildMetroSummaries(state);
assert(state.metros['metro.home'].totalPopulation === 35, 'metro did not aggregate member cities');
assert(availableWorkforce(state, 'polity.player') === 4, 'available workforce baseline is wrong');
state = startOperation(state, 'operation.research');
assert(state.operations['operation.research'].status === 'active', 'research did not start');
assert(state.quantities['polity:polity.player']['construction.ldu'].current === 8, 'research did not reserve construction inputs');
assert(availableWorkforce(state, 'polity.player') === 2, 'research team did not occupy workers');
state = startOperation(state, 'operation.policy');
assert(state.operations['operation.policy'].status === 'active', 'policy did not start');
assert(availableWorkforce(state, 'polity.player') === 1, 'policy team did not occupy workers');
state = advanceNationKernelDays(state, 4);
assert(state.operations['operation.research'].status === 'completed', 'research did not complete after required work');
assert(state.operations['operation.policy'].status === 'completed', 'policy did not expire after duration');
assert(state.quantities['polity:polity.player']['capacity.research'].current === 15, 'research completion effect was not applied');
assert(state.quantities['polity:polity.player']['provision.waterDays'].current === 20.2, 'facility and temporary policy effects did not settle correctly');
assert(state.polities['polity.player'].capabilities['capability.testing']?.maturity === 'prototype', 'capability effect was not applied');
assert(state.relations['relation.player-peer'].trustAtoB === 2, 'relation effect was not applied');
assert(state.ledger.some((entry) => entry.sourceId === 'facility.water'), 'facility output has no causal ledger');
const repeated = advanceNationKernelDays(startOperation(startOperation(createNationKernelFixture(), 'operation.research'), 'operation.policy'), 4);
assert(JSON.stringify(state) === JSON.stringify(repeated), 'same fixture and commands are not deterministic');
console.log(JSON.stringify({ ok: true, day: state.calendar.day, metroPopulation: state.metros['metro.home'].totalPopulation, waterDays: state.quantities['polity:polity.player']['provision.waterDays'].current, research: state.quantities['polity:polity.player']['capacity.research'].current, ledgerEntries: state.ledger.length }, null, 2));
