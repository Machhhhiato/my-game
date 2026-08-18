import { advanceNationKernelDays, startOperation } from '../src/v2/nationKernel/simulation';
import { validateNationKernel } from '../src/v2/nationKernel/validate';
import { createRegionalNationFromTextIdle } from '../src/v2/textIdle/regionalBridge';
import { installRegionalCampaignContent } from '../src/v2/textIdle/regionalCampaign';
import { installUnifiedNationContent, unifiedNationComplete } from '../src/v2/textIdle/unifiedNation';
import { installStarterContent } from '../src/v2/textIdle/starterContent';
import { advanceTextIdleDay, newTextIdleState, startTextExploration, startTextProject, startTextResearch } from '../src/v2/textIdle/simulation';
import type { NationKernelState } from '../src/v2/nationKernel/types';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function waitFor(state: TextIdleState, predicate: (value: TextIdleState) => boolean): TextIdleState { let next = state; for (let day = 0; day < 120 && !predicate(next); day += 1) next = advanceTextIdleDay(next); assert(predicate(next), 'text route timed out'); return next; }
function exploreResearchProject(state: TextIdleState, exploration: string, tech: string, project: string): TextIdleState {
  let next = startTextExploration(state, exploration); assert(next !== state, `exploration did not start: ${exploration}`); next = waitFor(next, (value) => value.exploration == null);
  next = startTextResearch(next, tech); assert(next !== state, `research did not start: ${tech}`); next = waitFor(next, (value) => value.completedTechs.includes(tech));
  next = startTextProject(next, project); assert(next !== state, `project did not start: ${project}`); return waitFor(next, (value) => value.completedProjects.includes(project));
}
function start(state: NationKernelState, id: string): NationKernelState { const next = startOperation(state, id); assert(next.operations[id]?.status === 'active', `operation did not start: ${id}`); return next; }

installStarterContent();
let text = newTextIdleState(903);
text = exploreResearchProject(text, 'starter.explore.north', 'starter.tech.water-survey', 'starter.project.water-station');
text = exploreResearchProject(text, 'starter.explore.east', 'starter.tech.food-preservation', 'starter.project.storage-shed');
text = exploreResearchProject(text, 'starter.explore.west', 'starter.tech.tool-recovery', 'starter.project.repair-workshop');
for (const tech of ['starter.tech.water-routine', 'starter.tech.maintenance-routine', 'starter.tech.automatic-duty']) { const next = startTextResearch(text, tech); assert(next !== text, `research did not start: ${tech}`); text = waitFor(next, (value) => value.completedTechs.includes(tech)); }
const rig = startTextProject(text, 'starter.project.intake-rig'); assert(rig !== text, 'automation project did not start'); text = waitFor(rig, (value) => value.completedProjects.includes('starter.project.intake-rig'));
text = waitFor(text, (value) => value.developmentStage === 'settled');

let state = createRegionalNationFromTextIdle(text);
assert(state != null, 'stable settlement did not enter regional campaign');
state = installUnifiedNationContent(installRegionalCampaignContent(state));
assert(startOperation(state, 'operation.nation.registry-method') === state, 'national registry started before regional integration');

for (const id of ['operation.regional.survey', 'operation.regional.relay', 'operation.regional.supply-route', 'operation.regional.compact', 'operation.integration.first-node', 'operation.integration.second-node', 'operation.integration.service-register', 'operation.integration.internal-compact']) {
  state = start(state, id);
  state = advanceNationKernelDays(state, 16);
}

const populationBefore = Object.values(state.cities).reduce((sum, city) => sum + city.population, 0);
const geoBefore = JSON.stringify(Object.fromEntries(Object.values(state.cities).map((city) => [city.id, city.geoRef])));
for (const id of ['operation.nation.registry-method', 'operation.nation.coordination-office', 'operation.nation.service-trunk']) {
  state = start(state, id);
  state = advanceNationKernelDays(state, 16);
}
assert(state.regions['region.national-service-district']?.cityIds.includes('city.regional-node-b'), 'registered service district did not retain its city');
assert(state.networks['network.national-service-trunk']?.endpointIds.includes('city.regional-node-b'), 'national trunk does not reference an existing city endpoint');

state = start(state, 'operation.nation.service-guarantee');
state = advanceNationKernelDays(state, 4);
const coveredDuringOrder = state.quantities['city:city.regional-node-b']?.['service.waterCoverage']?.current ?? 0;
assert(coveredDuringOrder >= 45, 'service guarantee did not provide observable cross-region coverage');
state = advanceNationKernelDays(state, 8);
assert(state.operations['operation.nation.service-guarantee']?.status === 'completed', 'service guarantee did not complete');
state = advanceNationKernelDays(state, 3);
const coverageAfterOrder = state.quantities['city:city.regional-node-b']?.['service.waterCoverage']?.current ?? 0;
assert(coverageAfterOrder < coveredDuringOrder, 'expired service guarantee remained a permanent coverage bonus');

state = start(state, 'operation.nation.unification-charter');
state = advanceNationKernelDays(state, 16);
const player = state.polities[state.playerPolityId];
assert(unifiedNationComplete(state), 'unified nation stage did not complete');
assert(player.archetype === 'nationState' && player.simulationTier === 'active', 'polity did not record the unified nation profile');
assert(Object.values(state.cities).reduce((sum, city) => sum + city.population, 0) === populationBefore, 'national transition changed total population');
assert(JSON.stringify(Object.fromEntries(Object.values(state.cities).map((city) => [city.id, city.geoRef]))) === geoBefore, 'national transition rewrote stable geography');
assert(Object.values(state.regions).every((region) => region.polityId === state.playerPolityId), 'national transition created an external polity');
assert(state.ledger.some((entry) => entry.target === `polity:${state.playerPolityId}.profile`), 'national transition is missing from the causal ledger');
assert(validateNationKernel(state).ok, 'unified nation violates nation-kernel validation');

console.log(JSON.stringify({ ok: true, day: state.calendar.day, archetype: player.archetype, regions: Object.values(state.regions).map((region) => ({ id: region.id, cities: region.cityIds })), serviceCoverage: { duringOrder: coveredDuringOrder, afterOrder: coverageAfterOrder }, facilities: Object.keys(state.facilities), networks: Object.keys(state.networks) }, null, 2));
