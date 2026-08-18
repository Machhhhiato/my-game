import type { FocusId, MetricId } from '../types';

export const METRIC_ORDER: MetricId[] = [
  'livelihood', 'industry', 'energy', 'research', 'administration',
  'logistics', 'military', 'stability', 'ecology',
];

/**
 * 国家指标不是无限线性累加的“货币”。initial 是当前时代在没有额外投入时
 * 能维持的基础水平；科技、设施、国策和事件提供相对增减，模拟再逐日向该
 * 条件下的稳定水平收敛。这样长期挂机不会自然滑向全 0 或全 100。
 */
export const METRIC_BASELINE: Record<MetricId, { initial: number }> = {
  livelihood: { initial: 48 },
  industry: { initial: 32 },
  energy: { initial: 52 },
  research: { initial: 12 },
  administration: { initial: 20 },
  logistics: { initial: 28 },
  military: { initial: 11 },
  stability: { initial: 54 },
  ecology: { initial: 58 },
};

/** 一点内容效果对应稳定水平的 0.6 个百分点；首期基础设施改善生活，但不会自然变成满值乌托邦。 */
export const METRIC_EFFECT_TO_TARGET = 60;
/** 单日最多调整 0.4，既能在数周内读出变化，又避免切换国策时跳变。 */
export const METRIC_TARGET_RESPONSE = 0.025;

export const FOCUS_MODIFIERS: Record<FocusId, {
  metrics: Partial<Record<MetricId, number>>;
  projectSpeed: number;
  researchSpeed: number;
  autoProjectOrder: string[];
  autoResearchOrder: string[];
}> = {
  survival: {
    metrics: { livelihood: 0.12, logistics: 0.04 }, projectSpeed: 1.05, researchSpeed: 0.82,
    autoProjectOrder: ['water_main', 'valley_greenhouse', 'ferry_workshop', 'well_radio_tower'],
    autoResearchOrder: ['valley_survey', 'membrane_reuse', 'field_recovery', 'public_health', 'archive_protocols', 'maintenance_training', 'shortwave_protocol', 'night_transit'],
  },
  balanced: {
    metrics: { livelihood: 0.05, administration: 0.06, stability: 0.06 }, projectSpeed: 1, researchSpeed: 1,
    autoProjectOrder: ['water_main', 'valley_greenhouse', 'ferry_workshop', 'well_radio_tower'],
    autoResearchOrder: ['valley_survey', 'field_recovery', 'membrane_reuse', 'archive_protocols', 'public_health', 'maintenance_training', 'shortwave_protocol', 'night_transit'],
  },
  industry: {
    // 工业优先应能积累足以启动实体工程的能力；代价留给生态、民生和施工事故，而不是让方向本身失效。
    metrics: { industry: 0.20, logistics: 0.08, ecology: -0.04, livelihood: -0.05 }, projectSpeed: 1.25, researchSpeed: 0.86,
    autoProjectOrder: ['ferry_workshop', 'water_main', 'valley_greenhouse', 'well_radio_tower'],
    autoResearchOrder: ['valley_survey', 'maintenance_training', 'field_recovery', 'membrane_reuse', 'archive_protocols', 'shortwave_protocol', 'public_health', 'night_transit'],
  },
  science: {
    metrics: { research: 0.12, administration: 0.06, energy: -0.04 }, projectSpeed: 0.84, researchSpeed: 1.35,
    autoProjectOrder: ['well_radio_tower', 'water_main', 'ferry_workshop', 'valley_greenhouse'],
    autoResearchOrder: ['archive_protocols', 'valley_survey', 'shortwave_protocol', 'membrane_reuse', 'field_recovery', 'maintenance_training', 'public_health', 'night_transit'],
  },
  military: {
    metrics: { military: 0.12, logistics: 0.05, stability: -0.06 }, projectSpeed: 0.95, researchSpeed: 0.82,
    autoProjectOrder: ['well_radio_tower', 'ferry_workshop', 'water_main', 'valley_greenhouse'],
    autoResearchOrder: ['valley_survey', 'archive_protocols', 'shortwave_protocol', 'maintenance_training', 'night_transit', 'membrane_reuse', 'field_recovery', 'public_health'],
  },
};

export const TRANSITION_DAYS = 10;
export const TRANSITION_START = 0.65;
export const LDU_START = { water: 0.88, food: 0.76, energy: 1.02, maintenance: 0.82 };
