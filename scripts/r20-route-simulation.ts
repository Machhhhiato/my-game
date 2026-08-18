import { TEXT_EXPLORATION_TARGETS } from '../src/v2/textIdle/exploration';
import { installStarterContent } from '../src/v2/textIdle/starterContent';
import {
  advanceTextIdleDay,
  advanceTextIdleDays,
  newTextIdleState,
  setTextFocus,
  startTextExploration,
  startTextProject,
  startTextResearch,
} from '../src/v2/textIdle/simulation';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function waitFor(state: TextIdleState, predicate: (next: TextIdleState) => boolean, label: string): TextIdleState {
  let next = state;
  for (let day = 0; day < 100 && !predicate(next); day += 1) next = advanceTextIdleDay(next);
  assert(predicate(next), `timed out: ${label}`);
  return next;
}

const ROUTE: Record<string, { exploration: string; tech: string; project: string }> = {
  north: { exploration: 'starter.explore.north', tech: 'starter.tech.water-survey', project: 'starter.project.water-station' },
  east: { exploration: 'starter.explore.east', tech: 'starter.tech.food-preservation', project: 'starter.project.storage-shed' },
  west: { exploration: 'starter.explore.west', tech: 'starter.tech.tool-recovery', project: 'starter.project.repair-workshop' },
};

function completeStep(state: TextIdleState, step: { exploration: string; tech: string; project: string }): TextIdleState {
  let next = startTextExploration(state, step.exploration);
  assert(next !== state, `exploration did not start: ${step.exploration}`);
  next = waitFor(next, (value) => value.discoveries.some((discovery) => discovery.targetId === step.exploration), step.exploration);
  const discoveredTarget = TEXT_EXPLORATION_TARGETS[step.exploration];
  assert(discoveredTarget.discoveries.every((fact) => next.discoveries.some((known) => known.id === fact.id && known.coordinateRef === fact.coordinateRef)), `discovery facts missing coordinate: ${step.exploration}`);
  const research = startTextResearch(next, step.tech);
  assert(research !== next, `research did not start after discovery: ${step.tech}`);
  next = waitFor(research, (value) => value.completedTechs.includes(step.tech), step.tech);
  const project = startTextProject(next, step.project);
  assert(project !== next, `site project did not start after its candidate was discovered: ${step.project}`);
  return waitFor(project, (value) => value.completedProjects.includes(step.project), step.project);
}

function run(order: string[], focus: 'settle' | 'learn' | 'build'): TextIdleState {
  let state = setTextFocus(newTextIdleState(711), focus);
  for (const direction of order) state = completeStep(state, ROUTE[direction]);
  return state;
}

installStarterContent();
const initial = newTextIdleState(711);
assert(startTextResearch(initial, 'starter.tech.water-survey') === initial, 'research must be blocked before exploration provides evidence');
const noAction = advanceTextIdleDays(initial, 180);
assert(noAction.failure.level === 'lost', 'a neglected settlement must eventually fail');

const paths = [
  run(['north', 'east', 'west'], 'settle'),
  run(['east', 'west', 'north'], 'learn'),
  run(['west', 'north', 'east'], 'build'),
];
for (const state of paths) {
  assert(state.completedProjects.length === 3, 'route run must complete three basic facilities');
  assert(state.discoveries.length === 6, 'route run must retain both knowledge and site facts for each direction');
  assert(state.failure.level !== 'lost', 'a valid route must not silently fail');
}

console.log(JSON.stringify({
  ok: true,
  neglectedOutcome: noAction.failure.level,
  neglectedDay: noAction.day,
  routes: paths.map((state) => ({ day: state.day, focus: state.nationalFocus.id, discoveries: state.discoveries.length, projects: state.completedProjects.length, reserves: state.reserves })),
}, null, 2));
