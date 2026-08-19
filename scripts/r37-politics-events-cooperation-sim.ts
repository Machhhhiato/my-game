import {
  advanceNationKernelDays,
  createGlobalUnificationPlaytestState,
  resolveStrategicEvent,
  setPoliticalIdentity,
  startCooperationProject,
  validateNationKernel,
} from '../src/v2/nationKernel';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const initial = createGlobalUnificationPlaytestState();
const initialLegitimacy = initial.civilizationSystems!.politics.legitimacy;
let political = setPoliticalIdentity(initial, 'technocraticDirectorate');
assert(political !== initial && political.civilizationSystems!.identity.authority === 'technocraticDirectorate', 'political identity reform did not apply');
assert(setPoliticalIdentity(political, 'centralCommand') === political, 'political reform cooldown did not reject immediate second reform');

let eventRoute = resolveStrategicEvent(initial, 'event.returning-families', 'event-option.phased-return');
assert(eventRoute.civilizationSystems!.events['event.returning-families'].status === 'resolved', 'event option did not resolve event');
assert(eventRoute.civilizationSystems!.politics.legitimacy > initialLegitimacy, 'event consequence did not change politics');
assert(eventRoute.civilizationSystems!.factions['faction.regions'].satisfaction > initial.civilizationSystems!.factions['faction.regions'].satisfaction, 'event did not change affected faction');

let cooperation = startCooperationProject(initial, 'cooperation.shared-communications');
cooperation = advanceNationKernelDays(cooperation, 720);
const project = cooperation.civilizationSystems!.cooperationProjects['cooperation.shared-communications'];
assert(project.status === 'completed', 'cooperation project did not complete through daily simulation');
assert(cooperation.civilizationSystems!.globalUnification.sharedInfrastructure > initial.civilizationSystems!.globalUnification.sharedInfrastructure, 'space cooperation did not improve shared infrastructure');

for (const state of [political, eventRoute, cooperation]) { const validation = validateNationKernel(state); assert(validation.ok, validation.errors.join(', ')); }
console.log(JSON.stringify({ ok: true, politicalReform: political.civilizationSystems!.identity, event: eventRoute.civilizationSystems!.events['event.returning-families'], regionalFactionSatisfaction: eventRoute.civilizationSystems!.factions['faction.regions'].satisfaction, cooperation: project }, null, 2));
