import { TEXT_POLICIES, TEXT_PROJECTS, TEXT_TECHS } from '../src/v2/textIdle/content';
import { installStarterContent } from '../src/v2/textIdle/starterContent';
import {
  advanceTextIdleDay,
  advanceTextIdleDays,
  availableTextProjects,
  availableTextTechs,
  newTextIdleState,
  startTextPolicy,
  startTextProject,
  startTextResearch,
  textAutomationUnlocked,
  textCanStartPolicy,
} from '../src/v2/textIdle/simulation';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function advanceUntil(state: TextIdleState, predicate: (value: TextIdleState) => boolean, label: string): TextIdleState {
  let next = state;
  for (let day = 0; day < 80 && !predicate(next); day += 1) next = advanceTextIdleDay(next);
  assert(predicate(next), `timed out while waiting for ${label}`);
  return next;
}

function startResearchAndWait(state: TextIdleState, id: string): TextIdleState {
  const next = startTextResearch(state, id);
  assert(next !== state, `could not start research ${id}`);
  return advanceUntil(next, (value) => value.completedTechs.includes(id), id);
}

function startProjectAndWait(state: TextIdleState, id: string): TextIdleState {
  const next = startTextProject(state, id);
  assert(next !== state, `could not start project ${id}`);
  return advanceUntil(next, (value) => value.completedProjects.includes(id), id);
}

function run(): TextIdleState {
  let state = newTextIdleState(515);
  assert(state.developmentStage === 'emergency', 'starter campaign must begin in emergency stage');
  assert(availableTextTechs(state).length === 3, 'starter campaign must offer three clear initial research choices');
  assert(availableTextProjects(state).length === 0, 'starter engineering must wait for completed research');

  state = startResearchAndWait(state, 'starter.tech.water-survey');
  state = startProjectAndWait(state, 'starter.project.water-station');
  state = startResearchAndWait(state, 'starter.tech.food-preservation');
  state = startProjectAndWait(state, 'starter.project.storage-shed');
  state = startResearchAndWait(state, 'starter.tech.tool-recovery');
  state = startProjectAndWait(state, 'starter.project.repair-workshop');
  state = startResearchAndWait(state, 'starter.tech.water-routine');
  state = startResearchAndWait(state, 'starter.tech.maintenance-routine');
  state = startResearchAndWait(state, 'starter.tech.automatic-duty');
  assert(!textAutomationUnlocked(state), 'automation cannot unlock before the required facility is built');
  state = startProjectAndWait(state, 'starter.project.intake-rig');
  state = advanceTextIdleDays(state, 20);

  assert(textAutomationUnlocked(state), 'technology plus facility must unlock automation');
  assert(state.developmentStage === 'settled', 'starter path did not reach stable settlement');
  assert(availableTextTechs(state).every((id) => !state.completedTechs.includes(id)), 'completed technologies returned to selection');
  assert(availableTextProjects(state).every((id) => !state.completedProjects.includes(id)), 'completed projects returned to selection');
  const policyId = 'starter.policy.water-duty';
  assert(textCanStartPolicy(state, policyId), 'completed capability did not unlock a policy');
  const withPolicy = startTextPolicy(state, policyId);
  assert(withPolicy.currentPolicy?.id === policyId, 'policy failed to reserve its short-term execution slot');
  assert(TEXT_TECHS['starter.tech.automatic-duty'].runtime.capability, 'technology has no player-readable result');
  assert(TEXT_PROJECTS['starter.project.intake-rig'].output.water === 0.2, 'project result is missing its daily water output');
  assert(TEXT_POLICIES[policyId].output?.water === 0.1, 'policy result is missing its daily water output');
  return withPolicy;
}

installStarterContent();
const first = run();
installStarterContent();
const second = run();
assert(JSON.stringify(first) === JSON.stringify(second), 'starter route is not deterministic');
console.log(JSON.stringify({
  ok: true,
  day: first.day,
  stage: first.developmentStage,
  completedTechs: first.completedTechs.length,
  completedProjects: first.completedProjects.length,
  reserves: first.reserves,
  policy: first.currentPolicy?.id,
}, null, 2));
