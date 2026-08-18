import { DEFAULT_TEXT_CAMPAIGN_TEMPLATE, RIDGE_TEXT_CAMPAIGN_TEMPLATE, installTextCampaignTemplate } from '../src/v2/textIdle/campaignTemplates';
import { advanceTextIdleDay, acceptTextPopulation, newTextIdleState, startTextExploration, startTextProject, startTextResearch, textPopulationCapacity, textReceptionBlockers } from '../src/v2/textIdle/simulation';
import type { TextCampaignTemplate } from '../src/v2/textIdle/campaignTemplates';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function waitFor(state: TextIdleState, predicate: (value: TextIdleState) => boolean, label: string): TextIdleState { let next = state; for (let day = 0; day < 90 && !predicate(next); day += 1) next = advanceTextIdleDay(next); assert(predicate(next), `${label} timed out`); return next; }
function explore(state: TextIdleState, id: string): TextIdleState { const next = startTextExploration(state, id); assert(next !== state, `exploration did not start: ${id}`); return waitFor(next, (value) => value.exploration == null, id); }
function researchProject(state: TextIdleState, tech: string, project: string): TextIdleState {
  let next = startTextResearch(state, tech); assert(next !== state, `research did not start: ${tech}`); next = waitFor(next, (value) => value.completedTechs.includes(tech), tech);
  next = startTextProject(next, project); assert(next !== state, `project did not start: ${project}`); return waitFor(next, (value) => value.completedProjects.includes(project), project);
}

function run(template: TextCampaignTemplate, ids: { east: string; rescue: string; west: string; salvage: string; north: string; outpost: string }): Record<string, unknown> {
  installTextCampaignTemplate(template);
  let state = newTextIdleState(926, template.id);
  const startingPopulation = state.population;

  state = explore(state, ids.east);
  const shelter = startTextProject(state, 'starter.project.temporary-shelter');
  assert(shelter !== state, `${template.id} basic shelter incorrectly required research`);
  state = waitFor(shelter, (value) => value.completedProjects.includes('starter.project.temporary-shelter'), 'temporary shelter');
  state = explore(state, ids.rescue);
  assert(state.pendingPopulation.length === 1, `${template.id} did not create pending population`);
  const arrival = state.pendingPopulation[0];
  assert(textReceptionBlockers(state, arrival).length === 0, `${template.id} arrival should be receivable after storage`);
  const accepted = acceptTextPopulation(state, arrival.id);
  assert(accepted.population === startingPopulation + arrival.population, `${template.id} acceptance did not add population`);
  assert(accepted.workforce.dependents === 4 + arrival.dependents, `${template.id} acceptance did not add care responsibility`);
  const withoutArrival = structuredClone(accepted) as TextIdleState;
  withoutArrival.population -= arrival.population;
  withoutArrival.workforce.dependents -= arrival.dependents;
  const afterAcceptance = advanceTextIdleDay(accepted);
  const withoutArrivalDay = advanceTextIdleDay(withoutArrival);
  assert(afterAcceptance.dailyLedger.reserveNet.food < withoutArrivalDay.dailyLedger.reserveNet.food, `${template.id} population did not increase daily food pressure`);
  state = afterAcceptance;

  state = explore(state, ids.west);
  const constructionBefore = state.construction.stock;
  state = explore(state, ids.salvage);
  assert(state.construction.stock >= constructionBefore + 4, `${template.id} salvage did not add construction material`);

  state = explore(state, ids.north);
  state = explore(state, ids.outpost);
  assert(state.routeFacts.length === 1, `${template.id} outpost exploration did not write route fact`);
  assert(state.routeFacts[0].coordinateRef.startsWith('geo.'), `${template.id} route fact lost stable geography`);
  assert(state.population <= textPopulationCapacity(state), `${template.id} population exceeded capacity`);
  return { template: template.id, day: state.day, population: state.population, capacity: textPopulationCapacity(state), pendingPopulation: state.pendingPopulation.length, construction: state.construction.stock, routes: state.routeFacts.map((route) => route.id) };
}

const defaultResult = run(DEFAULT_TEXT_CAMPAIGN_TEMPLATE, { east: 'starter.explore.east', rescue: 'starter.explore.east-rescue', west: 'starter.explore.west', salvage: 'starter.explore.west-salvage', north: 'starter.explore.north', outpost: 'starter.explore.north-outpost' });
const ridgeResult = run(RIDGE_TEXT_CAMPAIGN_TEMPLATE, { east: 'ridge.scan.shelter', rescue: 'ridge.action.rescue', west: 'ridge.scan.components', salvage: 'ridge.action.salvage', north: 'ridge.scan.cistern', outpost: 'ridge.action.outpost' });
console.log(JSON.stringify({ ok: true, defaultResult, ridgeResult }, null, 2));
