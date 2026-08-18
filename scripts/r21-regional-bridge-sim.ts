import { createRegionalNationFromTextIdle } from '../src/v2/textIdle/regionalBridge';
import { regionalCampaignComplete } from '../src/v2/textIdle/regionalCampaign';
import { installStarterContent } from '../src/v2/textIdle/starterContent';
import { advanceTextIdleDay, startTextExploration, startTextProject, startTextResearch } from '../src/v2/textIdle/simulation';
import { newTextIdleState } from '../src/v2/textIdle/simulation';
import { validateNationKernel } from '../src/v2/nationKernel/validate';
import { advanceNationKernelDays, startOperation } from '../src/v2/nationKernel/simulation';
import type { NationKernelState } from '../src/v2/nationKernel/types';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function startRegionalOperation(state: NationKernelState, id: string): NationKernelState {
  const next = startOperation(state, id);
  assert(next.operations[id]?.status === 'active', `regional operation did not start: ${id}`);
  return next;
}
function waitFor(state: TextIdleState, predicate: (value: TextIdleState) => boolean): TextIdleState { let next = state; for (let day = 0; day < 100 && !predicate(next); day += 1) next = advanceTextIdleDay(next); assert(predicate(next), 'campaign route timed out'); return next; }
function exploreResearchProject(state: TextIdleState, exploration: string, tech: string, project: string): TextIdleState {
  let next = startTextExploration(state, exploration); assert(next !== state, `exploration did not start: ${exploration}`); next = waitFor(next, (value) => value.exploration == null);
  next = startTextResearch(next, tech); assert(next !== state, `research did not start: ${tech}`); next = waitFor(next, (value) => value.completedTechs.includes(tech));
  next = startTextProject(next, project); assert(next !== state, `project did not start: ${project}`); return waitFor(next, (value) => value.completedProjects.includes(project));
}

installStarterContent();
let state = newTextIdleState(901);
state = exploreResearchProject(state, 'starter.explore.north', 'starter.tech.water-survey', 'starter.project.water-station');
state = exploreResearchProject(state, 'starter.explore.east', 'starter.tech.food-preservation', 'starter.project.storage-shed');
state = exploreResearchProject(state, 'starter.explore.west', 'starter.tech.tool-recovery', 'starter.project.repair-workshop');
for (const tech of ['starter.tech.water-routine', 'starter.tech.maintenance-routine', 'starter.tech.automatic-duty']) { const next = startTextResearch(state, tech); assert(next !== state, `research did not start: ${tech}`); state = waitFor(next, (value) => value.completedTechs.includes(tech)); }
const rig = startTextProject(state, 'starter.project.intake-rig'); assert(rig !== state, 'automation project did not start'); state = waitFor(rig, (value) => value.completedProjects.includes('starter.project.intake-rig'));
state = waitFor(state, (value) => value.developmentStage === 'settled');
let regional = createRegionalNationFromTextIdle(state);
assert(regional != null, 'stable settlement did not enter regional campaign');
assert(validateNationKernel(regional).ok, 'regional bridge produced invalid nation kernel');
assert(regional.polities[regional.playerPolityId].population.residents === state.population, 'population was not preserved');
assert(Object.keys(regional.polities).length === 1, 'regional bridge retained a fixture peer polity');
for (const id of ['operation.regional.survey', 'operation.regional.relay', 'operation.regional.supply-route', 'operation.regional.compact']) {
  regional = startRegionalOperation(regional, id);
  regional = advanceNationKernelDays(regional, 14);
}
assert(regionalCampaignComplete(regional), 'regional operations did not form a completed route');
assert(regional.facilities['facility.regional-relay']?.lifecycle.status === 'operating', 'regional relay was not commissioned');
assert(regional.networks['network.regional-supply-route']?.lifecycle.status === 'operating', 'regional supply route was not commissioned');
assert(validateNationKernel(regional).ok, 'regional campaign violated nation-kernel validation');
console.log(JSON.stringify({ ok: true, day: regional.calendar.day, population: regional.polities[regional.playerPolityId].population.residents, facilities: Object.keys(regional.facilities).length, networks: Object.keys(regional.networks).length, capabilities: Object.keys(regional.polities[regional.playerPolityId].capabilities).length }, null, 2));
