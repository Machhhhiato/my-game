import type { FacilityId, MetricId, V6PolicyId, V6ProjectId, V6TechId } from '../types';
import type { RequirementSet } from './requirements';
import { NO_REQUIREMENTS } from './requirements';

export interface DefinitionEffect { metrics?: Partial<Record<MetricId, number>>; projectSpeed?: number; researchSpeed?: number; coverage?: Partial<Record<'water' | 'food' | 'energy' | 'maintenance', number>>; }
export interface TechDefinition { id: V6TechId; name: string; work: number; requirements: RequirementSet; effect: DefinitionEffect; }
export interface ProjectDefinition { id: V6ProjectId; name: string; facilityId: FacilityId; location: string; work: number; requirements: RequirementSet; milestoneEffects: Partial<Record<25 | 50 | 75 | 100, DefinitionEffect>>; }
export interface PolicyDefinition { id: V6PolicyId; name: string; durationDays: number; cooldownDays: number; requirements: RequirementSet; effect: DefinitionEffect; }

export const TECHS: Record<V6TechId, TechDefinition> = {
  valley_survey: { id: 'valley_survey', name: '河谷地形勘查', work: 22, requirements: NO_REQUIREMENTS, effect: { metrics: { logistics: 0.03, research: 0.03 } } },
  archive_protocols: { id: 'archive_protocols', name: '旧世代档案译读', work: 28, requirements: { all: [{ kind: 'metric', id: 'livelihood', min: 45 }] }, effect: { metrics: { administration: 0.04, research: 0.06 } } },
  membrane_reuse: { id: 'membrane_reuse', name: '滤膜再生工艺', work: 34, requirements: { all: [{ kind: 'tech', id: 'valley_survey' }] }, effect: { metrics: { livelihood: 0.06 } } },
  field_recovery: { id: 'field_recovery', name: '河谷田间恢复法', work: 32, requirements: { all: [{ kind: 'tech', id: 'valley_survey' }] }, effect: { metrics: { ecology: 0.07, research: 0.02 } } },
  maintenance_training: { id: 'maintenance_training', name: '维护学徒制度', work: 36, requirements: { all: [{ kind: 'facility', id: 'ferry_workshop', stage: 'trial' }] }, effect: { metrics: { industry: 0.08, administration: 0.04 } } },
  shortwave_protocol: { id: 'shortwave_protocol', name: '短波通讯协议', work: 34, requirements: { all: [{ kind: 'tech', id: 'archive_protocols' }, { kind: 'facility', id: 'well_radio_tower', stage: 'trial' }] }, effect: { metrics: { logistics: 0.08, military: 0.04 } } },
  public_health: { id: 'public_health', name: '公共卫生流程', work: 38, requirements: { all: [{ kind: 'tech', id: 'membrane_reuse' }, { kind: 'tech', id: 'field_recovery' }] }, effect: { metrics: { livelihood: 0.05, stability: 0.08 } } },
  night_transit: { id: 'night_transit', name: '夜间通行规程', work: 42, requirements: { all: [{ kind: 'tech', id: 'maintenance_training' }, { kind: 'tech', id: 'shortwave_protocol' }] }, effect: { metrics: { logistics: 0.06, military: 0.07 } } },
};

export const PROJECTS: Record<V6ProjectId, ProjectDefinition> = {
  water_main: { id: 'water_main', name: '第 07 号—西岸净水干线', facilityId: 'water_main', location: '第 07 号取水点与西岸过滤渠', work: 62, requirements: { all: [{ kind: 'tech', id: 'valley_survey' }] }, milestoneEffects: { 25: { metrics: { livelihood: 0.02 } }, 50: { metrics: { livelihood: 0.06 }, coverage: { water: 0.08 } }, 75: { metrics: { logistics: 0.03 } }, 100: { metrics: { livelihood: 0.16, logistics: 0.02 }, coverage: { water: 0.16, maintenance: 0.06 } } } },
  valley_greenhouse: { id: 'valley_greenhouse', name: '河谷培养温室', facilityId: 'valley_greenhouse', location: '外拓营北侧温室地基', work: 68, requirements: { all: [{ kind: 'tech', id: 'field_recovery' }] }, milestoneEffects: { 25: { metrics: { ecology: 0.02 } }, 50: { metrics: { livelihood: 0.04 }, coverage: { food: 0.08 } }, 75: { metrics: { ecology: 0.05 } }, 100: { metrics: { livelihood: 0.12, ecology: 0.11 }, coverage: { food: 0.16 } } } },
  ferry_workshop: { id: 'ferry_workshop', name: '旧渡口工务所改造', facilityId: 'ferry_workshop', location: '旧渡口车间', work: 58, requirements: { all: [{ kind: 'tech', id: 'valley_survey' }, { kind: 'metric', id: 'industry', min: 38 }] }, milestoneEffects: { 25: { metrics: { industry: 0.02 } }, 50: { metrics: { industry: 0.06 }, coverage: { maintenance: 0.06 } }, 75: { metrics: { administration: 0.03 } }, 100: { metrics: { industry: 0.14, administration: 0.01 }, coverage: { maintenance: 0.12 } } } },
  well_radio_tower: { id: 'well_radio_tower', name: '第 07 号短波通信塔', facilityId: 'well_radio_tower', location: '第 07 号井口塔址', work: 54, requirements: { all: [{ kind: 'tech', id: 'archive_protocols' }] }, milestoneEffects: { 25: { metrics: { administration: 0.02 } }, 50: { metrics: { logistics: 0.04 } }, 75: { metrics: { military: 0.03 } }, 100: { metrics: { administration: 0.16, logistics: 0.12, military: 0.02 } } } },
};

export const POLICIES: Record<V6PolicyId, PolicyDefinition> = {
  valley_hunt: { id: 'valley_hunt', name: '河谷狩猎行动', durationDays: 14, cooldownDays: 28, requirements: { all: [{ kind: 'tech', id: 'valley_survey' }] }, effect: { metrics: { livelihood: 0.16 }, projectSpeed: 0.85, researchSpeed: 0.85, coverage: { food: 0.08 } } },
  well_rationing: { id: 'well_rationing', name: '井口配给轮值', durationDays: 14, cooldownDays: 21, requirements: { all: [], any: [{ kind: 'tech', id: 'membrane_reuse' }, { kind: 'project', id: 'water_main', milestone: 25 }] }, effect: { metrics: { livelihood: 0.10, stability: -0.07 }, coverage: { water: 0.08 } } },
  public_sanitation: { id: 'public_sanitation', name: '河谷卫生行动', durationDays: 14, cooldownDays: 21, requirements: { all: [], any: [{ kind: 'tech', id: 'public_health' }, { kind: 'project', id: 'valley_greenhouse', milestone: 50 }] }, effect: { metrics: { livelihood: 0.08, stability: 0.08 }, projectSpeed: 0.88 } },
  night_convoy: { id: 'night_convoy', name: '夜间护运', durationDays: 14, cooldownDays: 21, requirements: { all: [], any: [{ kind: 'tech', id: 'night_transit' }, { kind: 'project', id: 'well_radio_tower', milestone: 50 }] }, effect: { metrics: { logistics: 0.10, military: 0.08, stability: -0.04 }, researchSpeed: 0.85 } },
};

export const TECH_IDS = Object.keys(TECHS) as V6TechId[];
export const PROJECT_IDS = Object.keys(PROJECTS) as V6ProjectId[];
export const POLICY_IDS = Object.keys(POLICIES) as V6PolicyId[];
