import { advanceNationKernelDays, startOperation } from '../src/v2/nationKernel/simulation';
import { validateNationKernel } from '../src/v2/nationKernel/validate';
import { RIDGE_TEXT_CAMPAIGN_TEMPLATE, installTextCampaignTemplate } from '../src/v2/textIdle/campaignTemplates';
import { createRegionalNationFromTextIdle } from '../src/v2/textIdle/regionalBridge';
import { installRegionalCampaignContent } from '../src/v2/textIdle/regionalCampaign';
import { installUnifiedNationContent, unifiedNationComplete } from '../src/v2/textIdle/unifiedNation';
import { advanceTextIdleDay, newTextIdleState, startTextExploration, startTextProject, startTextResearch } from '../src/v2/textIdle/simulation';
import type { NationKernelState } from '../src/v2/nationKernel/types';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function waitFor(state: TextIdleState, predicate: (value: TextIdleState) => boolean): TextIdleState { let next = state; for (let day = 0; day < 130 && !predicate(next); day += 1) next = advanceTextIdleDay(next); assert(predicate(next), 'text route timed out'); return next; }
function exploreResearchProject(state: TextIdleState, exploration: string, tech: string, project: string): TextIdleState {
  let next = startTextExploration(state, exploration); assert(next !== state, `exploration did not start: ${exploration}`); next = waitFor(next, (value) => value.exploration == null);
  next = startTextResearch(next, tech); assert(next !== state, `research did not start: ${tech}`); next = waitFor(next, (value) => value.completedTechs.includes(tech));
  next = startTextProject(next, project); assert(next !== state, `project did not start: ${project}`); return waitFor(next, (value) => value.completedProjects.includes(project));
}
function start(state: NationKernelState, id: string): NationKernelState { const next = startOperation(state, id); assert(next.operations[id]?.status === 'active', `operation did not start: ${id}`); return next; }

installTextCampaignTemplate(RIDGE_TEXT_CAMPAIGN_TEMPLATE);
let text = newTextIdleState(925, RIDGE_TEXT_CAMPAIGN_TEMPLATE.id);
assert(text.campaignTemplateId === RIDGE_TEXT_CAMPAIGN_TEMPLATE.id, 'new save did not retain template identity');

// This order, target IDs, labels and geo refs intentionally differ from the default fixture.
text = exploreResearchProject(text, 'ridge.scan.components', 'starter.tech.tool-recovery', 'starter.project.repair-workshop');
text = exploreResearchProject(text, 'ridge.scan.shelter', 'starter.tech.food-preservation', 'starter.project.storage-shed');
text = exploreResearchProject(text, 'ridge.scan.cistern', 'starter.tech.water-survey', 'starter.project.water-station');
for (const tech of ['starter.tech.water-routine', 'starter.tech.maintenance-routine', 'starter.tech.automatic-duty']) { const next = startTextResearch(text, tech); assert(next !== text, `research did not start: ${tech}`); text = waitFor(next, (value) => value.completedTechs.includes(tech)); }
const rig = startTextProject(text, 'starter.project.intake-rig'); assert(rig !== text, 'automation project did not start'); text = waitFor(rig, (value) => value.completedProjects.includes('starter.project.intake-rig'));
text = waitFor(text, (value) => value.developmentStage === 'settled');

let state = createRegionalNationFromTextIdle(text);
assert(state != null, 'ridge template did not enter regional campaign');
state = installUnifiedNationContent(installRegionalCampaignContent(state));
for (const id of ['operation.regional.survey', 'operation.regional.relay', 'operation.regional.supply-route', 'operation.regional.compact', 'operation.integration.first-node', 'operation.integration.second-node', 'operation.integration.service-register', 'operation.integration.internal-compact', 'operation.nation.registry-method', 'operation.nation.coordination-office', 'operation.nation.service-trunk', 'operation.nation.service-guarantee', 'operation.nation.unification-charter']) {
  state = start(state, id);
  state = advanceNationKernelDays(state, 16);
}
assert(unifiedNationComplete(state), 'ridge template did not reach unified nation');
assert(state.polities[state.playerPolityId].archetype === 'nationState', 'unified profile missing after ridge route');
assert(validateNationKernel(state).ok, 'ridge template violates nation-kernel validation');

console.log(JSON.stringify({ ok: true, template: text.campaignTemplateId, day: state.calendar.day, explorationTargets: RIDGE_TEXT_CAMPAIGN_TEMPLATE.explorationTargets.map((target) => target.id), archetype: state.polities[state.playerPolityId].archetype }, null, 2));
