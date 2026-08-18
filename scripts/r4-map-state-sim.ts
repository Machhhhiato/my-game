import { emeraldValleyStage } from '../src/v2/content/settlements';
import { newCampaignV6 } from '../src/v2/state';
import type { V6ProjectId } from '../src/v2/types';

function stageAfter(projects: V6ProjectId[]) {
  const state = newCampaignV6(1107);
  state.completed.projects = projects;
  if (projects.length >= 2) state.population = 60;
  if (projects.length >= 4) state.population = 130;
  return emeraldValleyStage(state);
}

const checks = [
  { projects: [] as V6ProjectId[], want: 'camp' },
  { projects: ['water_main'] as V6ProjectId[], want: 'settlement' },
  { projects: ['water_main', 'valley_greenhouse'] as V6ProjectId[], want: 'settlement' },
  { projects: ['water_main', 'valley_greenhouse', 'ferry_workshop'] as V6ProjectId[], want: 'worktown' },
  { projects: ['water_main', 'valley_greenhouse', 'ferry_workshop', 'well_radio_tower'] as V6ProjectId[], want: 'city' },
];

for (const check of checks) {
  const actual = stageAfter(check.projects);
  if (actual !== check.want) throw new Error(`Expected ${check.want}; received ${actual}`);
}

console.log(JSON.stringify({ ok: true, checkedStages: checks.map((entry) => entry.want) }));
