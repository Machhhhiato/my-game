import { TEXT_PROJECTS, TEXT_TECHS } from '../src/v2/textIdle/content';
import { installStarterContent } from '../src/v2/textIdle/starterContent';
import {
  advanceTextIdleDay,
  availableTextExplorationTargets,
  collectEmergencyReserve,
  newTextIdleState,
  startTextExploration,
  startTextProject,
  startTextResearch,
  textEmergencyOrderBlockers,
  textExplorationBlockers,
} from '../src/v2/textIdle/simulation';
import type { TextIdleState } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function advanceUntil(state: TextIdleState, predicate: (value: TextIdleState) => boolean, message: string): TextIdleState { let next = state; for (let day = 0; day < 80 && !predicate(next); day += 1) next = advanceTextIdleDay(next); assert(predicate(next), message); return next; }

installStarterContent();
let state = newTextIdleState(924);
const constructionBefore = state.construction.stock;
state = collectEmergencyReserve(state, 'repair');
assert(state.emergencyOrder?.id === 'repair', 'material collection was not accepted immediately');
assert(textEmergencyOrderBlockers(state)[0]?.includes('已有一支临时队伍'), 'active material collection was not visibly blocked from replacement');
assert(collectEmergencyReserve(state, 'water') === state, 'a second emergency order replaced the active material collection');
state = advanceTextIdleDay(state);
assert(state.construction.stock > constructionBefore, 'material collection did not improve construction-material production on the next daily settlement');

state = advanceUntil(state, (value) => value.emergencyOrder == null, 'emergency order did not finish');
state = startTextExploration(state, 'starter.explore.north');
assert(state.exploration?.targetId === 'starter.explore.north', 'initial water exploration did not start');
state = advanceTextIdleDay(state);
state = advanceTextIdleDay(state);
state = advanceTextIdleDay(state);
assert(state.reports.some((report) => report.copyKey === 'exploration.progress' && report.params.id === 'starter.explore.north'), 'exploration did not record a midpoint update');
state = advanceUntil(state, (value) => value.exploration == null, 'initial exploration did not finish');
assert(availableTextExplorationTargets(state).includes('starter.explore.north-recheck'), 'follow-up exploration did not become visible after initial discovery');
assert(textExplorationBlockers(state, 'starter.explore.north-recheck').length === 0, 'follow-up exploration remained blocked after its prerequisite discovery');
state = startTextExploration(state, 'starter.explore.north-recheck');
state = advanceUntil(state, (value) => value.exploration == null, 'follow-up exploration did not finish');

state = startTextResearch(state, 'starter.tech.water-survey');
state = advanceUntil(state, (value) => value.completedTechs.includes('starter.tech.water-survey'), 'water-survey research did not finish');
state = startTextResearch(state, 'starter.tech.water-observation');
state = advanceUntil(state, (value) => value.completedTechs.includes('starter.tech.water-observation'), 'follow-up exploration did not unlock its research');
state = startTextProject(state, 'starter.project.water-watch');
state = advanceUntil(state, (value) => value.completedProjects.includes('starter.project.water-watch'), 'follow-up research did not unlock its engineering candidate');

assert(TEXT_TECHS['starter.tech.water-observation'] != null && TEXT_PROJECTS['starter.project.water-watch'] != null, 'follow-up exploration content was not installed');
console.log(JSON.stringify({ ok: true, day: state.day, constructionAfterMaterialCollection: state.construction.stock, discoveries: state.discoveries.filter((discovery) => discovery.targetId.includes('north')).map((discovery) => discovery.id), completedTechs: state.completedTechs.filter((id) => id.includes('water')), completedProjects: state.completedProjects.filter((id) => id.includes('water')) }, null, 2));
