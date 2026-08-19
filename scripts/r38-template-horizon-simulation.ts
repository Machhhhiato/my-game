import { advanceNationKernelDays, startOperation } from '../src/v2/nationKernel/simulation';
import { validateNationKernel } from '../src/v2/nationKernel/validate';
import { COAST_TEXT_CAMPAIGN_TEMPLATE, DEFAULT_TEXT_CAMPAIGN_TEMPLATE, RIDGE_TEXT_CAMPAIGN_TEMPLATE, installTextCampaignTemplate, type TextCampaignTemplate } from '../src/v2/textIdle/campaignTemplates';
import { createRegionalNationFromTextIdle } from '../src/v2/textIdle/regionalBridge';
import { geoReferenceForCoordinateRef } from '../src/v2/textIdle/strategicMapModel';
import { installRegionalCampaignContent } from '../src/v2/textIdle/regionalCampaign';
import { installUnifiedNationContent, unifiedNationComplete } from '../src/v2/textIdle/unifiedNation';
import { advanceTextIdleDay, newTextIdleState, startTextExploration, startTextProject, startTextResearch } from '../src/v2/textIdle/simulation';
import type { NationKernelState } from '../src/v2/nationKernel/types';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function waitFor(state: TextIdleState, predicate: (value: TextIdleState) => boolean): TextIdleState { let next = state; for (let day = 0; day < 140 && !predicate(next); day += 1) next = advanceTextIdleDay(next); assert(predicate(next), 'text stage timed out'); return next; }
function completeTriplet(state: TextIdleState, exploration: string, tech: string, project: string): TextIdleState {
  let next = startTextExploration(state, exploration); assert(next !== state, `exploration did not start: ${exploration}`); next = waitFor(next, (value) => value.exploration == null);
  next = startTextResearch(next, tech); assert(next !== state, `research did not start: ${tech}`); next = waitFor(next, (value) => value.completedTechs.includes(tech));
  next = startTextProject(next, project); assert(next !== state, `project did not start: ${project}`); return waitFor(next, (value) => value.completedProjects.includes(project));
}
function start(state: NationKernelState, operationId: string): NationKernelState { const next = startOperation(state, operationId); assert(next.operations[operationId]?.status === 'active', `operation did not start: ${operationId}`); return next; }

const scenarios: Array<{ template: TextCampaignTemplate; seed: number; targets: [string, string, string] }> = [
  { template: DEFAULT_TEXT_CAMPAIGN_TEMPLATE, seed: 1101, targets: ['starter.explore.west', 'starter.explore.east', 'starter.explore.north'] },
  { template: RIDGE_TEXT_CAMPAIGN_TEMPLATE, seed: 1102, targets: ['ridge.scan.components', 'ridge.scan.shelter', 'ridge.scan.cistern'] },
  { template: COAST_TEXT_CAMPAIGN_TEMPLATE, seed: 1103, targets: ['coast.explore.west', 'coast.explore.east', 'coast.explore.north'] },
];

const results = scenarios.map(({ template, seed, targets }) => {
  installTextCampaignTemplate(template);
  let text = newTextIdleState(seed, template.id);
  text = completeTriplet(text, targets[0], 'starter.tech.tool-recovery', 'starter.project.repair-workshop');
  text = completeTriplet(text, targets[1], 'starter.tech.food-preservation', 'starter.project.storage-shed');
  text = completeTriplet(text, targets[2], 'starter.tech.water-survey', 'starter.project.water-station');
  for (const tech of ['starter.tech.water-routine', 'starter.tech.maintenance-routine', 'starter.tech.automatic-duty']) { const next = startTextResearch(text, tech); assert(next !== text, `research did not start: ${tech}`); text = waitFor(next, (value) => value.completedTechs.includes(tech)); }
  const rig = startTextProject(text, 'starter.project.intake-rig'); assert(rig !== text, 'automation project did not start'); text = waitFor(rig, (value) => value.completedProjects.includes('starter.project.intake-rig'));
  text = waitFor(text, (value) => value.developmentStage === 'settled');
  let nation = createRegionalNationFromTextIdle(text); assert(nation != null, 'settled text state did not bridge to regional nation');
  for (const fact of text.facilityFacts) assert(JSON.stringify(nation.facilities[`facility.${fact.projectId}`]?.geoRef) === JSON.stringify(geoReferenceForCoordinateRef(fact.coordinateRef)), `facility geo reference was lost: ${fact.projectId}`);
  nation = installUnifiedNationContent(installRegionalCampaignContent(nation));
  for (const operation of ['operation.regional.survey', 'operation.regional.relay', 'operation.regional.supply-route', 'operation.regional.compact', 'operation.integration.first-node', 'operation.integration.second-node', 'operation.integration.service-register', 'operation.integration.internal-compact', 'operation.nation.registry-method', 'operation.nation.coordination-office', 'operation.nation.service-trunk', 'operation.nation.service-guarantee', 'operation.nation.unification-charter']) { nation = start(nation, operation); nation = advanceNationKernelDays(nation, 16); }
  assert(unifiedNationComplete(nation), 'unified nation milestone was not reached');
  nation = advanceNationKernelDays(nation, 3650);
  assert(validateNationKernel(nation).ok, 'ten-year nation state violates kernel validation');
  return { template: template.id, day: nation.calendar.day, facilities: Object.keys(nation.facilities).length, archetype: nation.polities[nation.playerPolityId].archetype };
});

console.log(JSON.stringify({ ok: true, horizons: results }, null, 2));
