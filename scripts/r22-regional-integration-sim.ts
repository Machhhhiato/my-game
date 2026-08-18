import { advanceNationKernelDays, changeRegionalServiceAssignment, startOperation } from '../src/v2/nationKernel/simulation';
import { validateNationKernel } from '../src/v2/nationKernel/validate';
import { createRegionalNationFromTextIdle } from '../src/v2/textIdle/regionalBridge';
import { regionalIntegrationComplete } from '../src/v2/textIdle/regionalCampaign';
import { installStarterContent } from '../src/v2/textIdle/starterContent';
import { advanceTextIdleDay, newTextIdleState, startTextExploration, startTextProject, startTextResearch } from '../src/v2/textIdle/simulation';
import type { NationKernelState } from '../src/v2/nationKernel/types';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function waitFor(state: TextIdleState, predicate: (value: TextIdleState) => boolean): TextIdleState { let next = state; for (let day = 0; day < 100 && !predicate(next); day += 1) next = advanceTextIdleDay(next); assert(predicate(next), 'text route timed out'); return next; }
function exploreResearchProject(state: TextIdleState, exploration: string, tech: string, project: string): TextIdleState {
  let next = startTextExploration(state, exploration); assert(next !== state, `exploration did not start: ${exploration}`); next = waitFor(next, (value) => value.exploration == null);
  next = startTextResearch(next, tech); assert(next !== state, `research did not start: ${tech}`); next = waitFor(next, (value) => value.completedTechs.includes(tech));
  next = startTextProject(next, project); assert(next !== state, `project did not start: ${project}`); return waitFor(next, (value) => value.completedProjects.includes(project));
}
function start(state: NationKernelState, id: string): NationKernelState { const next = startOperation(state, id); assert(next.operations[id]?.status === 'active', `operation did not start: ${id}`); return next; }

installStarterContent();
let text = newTextIdleState(902);
text = exploreResearchProject(text, 'starter.explore.north', 'starter.tech.water-survey', 'starter.project.water-station');
text = exploreResearchProject(text, 'starter.explore.east', 'starter.tech.food-preservation', 'starter.project.storage-shed');
text = exploreResearchProject(text, 'starter.explore.west', 'starter.tech.tool-recovery', 'starter.project.repair-workshop');
for (const tech of ['starter.tech.water-routine', 'starter.tech.maintenance-routine', 'starter.tech.automatic-duty']) { const next = startTextResearch(text, tech); assert(next !== text, `research did not start: ${tech}`); text = waitFor(next, (value) => value.completedTechs.includes(tech)); }
const rig = startTextProject(text, 'starter.project.intake-rig'); assert(rig !== text, 'automation project did not start'); text = waitFor(rig, (value) => value.completedProjects.includes('starter.project.intake-rig'));
text = waitFor(text, (value) => value.developmentStage === 'settled');

let state = createRegionalNationFromTextIdle(text);
assert(state != null, 'stable settlement did not enter regional campaign');
for (const id of ['operation.regional.survey', 'operation.regional.relay', 'operation.regional.supply-route', 'operation.regional.compact', 'operation.integration.first-node', 'operation.integration.second-node', 'operation.integration.service-register', 'operation.integration.internal-compact']) {
  state = start(state, id);
  state = advanceNationKernelDays(state, 16);
}
assert(regionalIntegrationComplete(state), 'regional integration did not complete');
assert(state.cities['city.regional-node-a']?.population === 5 && state.cities['city.regional-node-b']?.population === 4, 'resident transfers were not recorded by node');
state = changeRegionalServiceAssignment(state, 'region.home', 'city.core', -1);
state = changeRegionalServiceAssignment(state, 'region.home', 'city.regional-node-a', 1);
state = advanceNationKernelDays(state, 4);
assert((state.quantities['city:city.regional-node-a']?.['service.waterCoverage']?.current ?? 0) > 0, 'service assignment did not increase node coverage');
assert(validateNationKernel(state).ok, 'integrated regional state violates nation-kernel validation');
console.log(JSON.stringify({ ok: true, day: state.calendar.day, cities: Object.values(state.cities).map((city) => ({ id: city.id, population: city.population })), serviceNodeA: state.quantities['city:city.regional-node-a']['service.waterCoverage'].current, capabilities: Object.keys(state.polities[state.playerPolityId].capabilities).length }, null, 2));
