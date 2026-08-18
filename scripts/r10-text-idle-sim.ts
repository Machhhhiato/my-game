import rawPolicies from '../content/r5/stage-1/policy-catalog.json';
import rawProjects from '../content/r5/stage-1/project-catalog.json';
import rawTechs from '../content/r5/stage-1/tech-catalog.json';
import rawCopy from '../content/r6/stage-1/player-copy.json';
import { installStage1Catalog, STAGE_1_CATALOG_COUNTS, TEXT_POLICIES, TEXT_PROJECTS, TEXT_TECHS } from '../src/v2/textIdle/content';
import {
  advanceTextIdleDay, advanceTextIdleDays, availableTextPolicies, availableTextProjects, availableTextTechs,
  issueEmergencyOrder, newTextIdleState, setTextFocus, setTextSlotMode, startTextPolicy, startTextProject,
  startTextResearch, textAutomationUnlocked, textAvailableWorkforce, textCanStartProject,
  textCanStartPolicy,
} from '../src/v2/textIdle/simulation';
import type { ReserveId, TextIdleState, TextTechId } from '../src/v2/textIdle/types';

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const RESERVES: ReserveId[] = ['water', 'food', 'repair'];
const SURVIVAL_AUTOMATION_PATH: TextTechId[] = [
  'w1', 'w1a1', 'w1a2', 'w1a3',
  'f1', 'f1a1', 'f1a2', 'f1a3',
  'i1', 'i1a1', 'i1a2', 'i1a3',
];
const SURVIVAL_PROJECTS = ['w1-p05', 'f1-p05', 'i1-p05'];

installStage1Catalog({ techs: rawTechs, projects: rawProjects, policies: rawPolicies, copy: rawCopy });

for (const [id, tech] of Object.entries(TEXT_TECHS)) {
  assert(tech.name && tech.summary && tech.teamRequired > 0 && tech.runtime.milestones.at(-1) === 100 && tech.runtime.capability, `${id} lacks player copy or runtime staffing`);
  assert((tech.requirements.techs ?? []).every((required) => TEXT_TECHS[required] != null), `${id} has an unknown technology prerequisite`);
  assert((tech.requirements.operationalProjects ?? []).every((required) => TEXT_PROJECTS[required] != null), `${id} has an unknown project prerequisite`);
}
for (const [id, project] of Object.entries(TEXT_PROJECTS)) {
  assert(project.name && project.summary && project.teamRequired > 0 && project.startCost > 0 && project.runtime.milestones.at(-1) === 100 && project.runtime.facilityState, `${id} lacks project runtime data`);
  assert((project.requirements.techs ?? []).every((required) => TEXT_TECHS[required] != null), `${id} has an unknown technology prerequisite`);
}
for (const [id, policy] of Object.entries(TEXT_POLICIES)) assert(policy.name && policy.summary && policy.durationDays > 0 && policy.teamRequired > 0 && policy.runtime.milestones.at(-1) === 100, `${id} has incomplete policy runtime data`);
assert(STAGE_1_CATALOG_COUNTS.technologies === 1000, 'stage 1 technology catalog is incomplete');
assert(STAGE_1_CATALOG_COUNTS.projects === 1000, 'stage 1 project catalog is incomplete');
assert(STAGE_1_CATALOG_COUNTS.policyVersions === 60, 'stage 1 policy catalog is incomplete');

function lowestReserve(state: TextIdleState): ReserveId {
  return RESERVES.reduce((lowest, reserve) => state.reserves[reserve] < state.reserves[lowest] ? reserve : lowest, 'water');
}
function run(seed: number): TextIdleState {
  let state = setTextFocus(newTextIdleState(seed), 'settle');
  for (let day = 0; day < 480 && state.failure.level !== 'lost'; day += 1) {
    if (state.emergencyOrder == null && state.reserves[lowestReserve(state)] < 6) state = issueEmergencyOrder(state, lowestReserve(state));
    if (!state.research.id) {
      const target = SURVIVAL_AUTOMATION_PATH.find((id) => !state.completedTechs.includes(id) && availableTextTechs(state).includes(id));
      if (target) state = startTextResearch(state, target);
    }
    if (!state.project.id) {
      const target = SURVIVAL_PROJECTS.find((id) => !state.completedProjects.includes(id) && textCanStartProject(state, id));
      if (target) state = startTextProject(state, target);
    }
    if (textAutomationUnlocked(state)) {
      state = setTextSlotMode(state, 'research', 'auto');
      state = setTextSlotMode(state, 'project', 'auto');
    }
    state = advanceTextIdleDay(state);
  }
  return state;
}

const fresh = newTextIdleState(410);
assert(fresh.calendar.year === 1 && fresh.calendar.month === 1 && fresh.calendar.phase === 'early', 'new campaign did not start at the first phase');
assert(textAvailableWorkforce(fresh) === 6, 'new community staffing does not expose the expected development workforce');
assert(availableTextTechs(fresh).length >= 3, 'stage 1 should expose several independent starting breakthroughs');
assert(availableTextProjects(fresh).length === 0, 'no project should be available before technology');
assert(!textAutomationUnlocked(fresh), 'automation must not be available at game start');

const ordered = issueEmergencyOrder(fresh, 'water');
assert(ordered.emergencyOrder?.daysRemaining === 10, 'emergency action did not become a ten-day assignment');
assert(ordered.reserves.water === fresh.reserves.water, 'emergency action incorrectly granted immediate inventory');
assert(textAvailableWorkforce(ordered) === 4, 'emergency assignment did not reserve its two-person team');
const afterPhase = advanceTextIdleDays(ordered, 10);
assert(afterPhase.calendar.phase === 'mid' && afterPhase.calendar.dayInPhase === 1, 'calendar did not advance from upper to middle ten-day phase');
assert(afterPhase.emergencyOrder == null, 'emergency assignment did not release staff after one phase');

const doomed = newTextIdleState(411);
doomed.reserves = { water: 0, food: 0, repair: 0 };
const lost = advanceTextIdleDays(doomed, 12);
assert(lost.failure.level === 'lost', 'a prolonged zero-reserve state did not produce campaign failure');

const first = run(410);
const second = run(410);
assert(JSON.stringify(first) === JSON.stringify(second), 'same seed and instruction sequence produced a different text-idle state');
assert(first.day === 480, `expected day 480, got ${first.day}`);
assert(first.failure.level !== 'lost', 'survival route unexpectedly failed');
assert(first.completedTechs.includes('i1a3'), 'automation technology path did not complete');
assert(first.completedProjects.includes('i1-p05'), 'automation facility did not complete');
assert(textAutomationUnlocked(first), 'automation gate did not unlock');
assert(first.research.mode === 'auto' && first.project.mode === 'auto', 'slot automation was not retained');
assert(first.completedTechs.length > SURVIVAL_AUTOMATION_PATH.length, 'automatic research did not continue after the gate');
const waitingReports = first.reports.filter((report) => report.copyKey.includes('.waiting'));
for (let index = 1; index < waitingReports.length; index += 1) {
  const current = waitingReports[index];
  const previous = waitingReports[index - 1];
  assert(current.copyKey !== previous.copyKey || current.day > previous.day, 'automatic slots wrote a duplicate waiting report on the same day');
}
assert(first.reports.length <= 80, 'report history was not bounded');
assert(Object.values(first.reserves).every((value) => value >= 0), 'reserve dropped below zero');
assert(first.construction.stock >= 0 && first.construction.stock <= first.construction.capacity, 'construction stock escaped its declared range');
assert(first.metrics.livelihood >= 55, 'survival route did not leave the emergency phase');
const policyCandidate = availableTextPolicies(first)[0];
assert(policyCandidate != null, 'survival route did not unlock any current policy');
assert(textCanStartPolicy(first, policyCandidate), 'unlocked policy could not reserve its administrative team');
const policyWorkforceBefore = textAvailableWorkforce(first);
const policyState = startTextPolicy(first, policyCandidate);
assert(policyState.currentPolicy?.id === policyCandidate, 'unlocked policy could not enter execution');
assert(policyState.workforce.policyStaff === TEXT_POLICIES[policyCandidate].teamRequired, 'policy did not reserve its administrative team');
assert(textAvailableWorkforce(policyState) === policyWorkforceBefore - TEXT_POLICIES[policyCandidate].teamRequired, 'policy staffing did not reduce available workforce');

console.log(JSON.stringify({
  result: 'ok', day: first.day, calendar: first.calendar, catalog: STAGE_1_CATALOG_COUNTS,
  completedTechs: first.completedTechs.length, completedProjects: first.completedProjects.length,
  reserves: first.reserves, construction: first.construction.stock, livelihood: Number(first.metrics.livelihood.toFixed(2)),
  workforce: first.workforce, reportCount: first.reports.length, automation: { research: first.research.mode, project: first.project.mode },
}, null, 2));
