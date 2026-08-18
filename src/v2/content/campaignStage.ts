import type { CampaignSaveV6 } from '../types';

/** 首局由生存、定居到工务镇；后续历史阶段在此向后追加。 */
export type CampaignStageId = 'survival' | 'settlement' | 'worktown';

export interface CampaignStageStatus {
  id: CampaignStageId;
  name: string;
  summary: string;
  next: string | null;
}

function atLeast(state: CampaignSaveV6, facility: keyof CampaignSaveV6['facilities'], stage: 'trial' | 'operational'): boolean {
  const rank = { locked: 0, planned: 1, construction: 2, trial: 3, operational: 4, damaged: 0 } as const;
  return rank[state.facilities[facility].stage] >= rank[stage];
}

/**
 * 生存危机解除不是“数值满了”，而是水和食物已有可持续设施、日常生活回到可恢复区间。
 * 不要求四项首期工程全完工，避免把“定居”误写成“城市建成”。
 */
export function campaignStage(state: CampaignSaveV6): CampaignStageStatus {
  const settled = atLeast(state, 'water_main', 'operational')
    && atLeast(state, 'valley_greenhouse', 'trial')
    && state.supply.coverage.water >= 1
    && state.supply.coverage.food >= 0.84
    && state.metrics.livelihood.value >= 55;
  const worktown = settled
    && atLeast(state, 'ferry_workshop', 'operational')
    && state.population >= 50
    && state.metrics.logistics.value >= 35;
  if (worktown) return {
    id: 'worktown',
    name: '河谷工务镇',
    summary: '渡口工务、河谷生产和常住人口已连成稳定节点。中央可以开始承担更远距离的调配与外拓成本。',
    next: '下一步：完善通信、教育与区域交通，把工务镇发展为区域城镇网络。',
  };
  if (settled) return {
    id: 'settlement',
    name: '河谷定居成立',
    summary: '净水和食物已有稳定基础。聚居地可以开始把人手投向工务、教育与外拓，而不必每天只为维持生存奔走。',
    next: '下一步：接通渡口工务与通信，形成可持续的区域节点。',
  };
  return {
    id: 'survival',
    name: '外拓维持',
    summary: '聚居地仍受水、食物或日常保障的直接约束。工程优先要让基本生活不再依赖临时拆借。',
    next: '达成：净水干线稳定运行、温室进入试运行，并让民生保障恢复到 55。',
  };
}

/** 可长期维持的人口规模；它由真实设施而非虚构的“住房点”决定。 */
export function sustainablePopulationCapacity(state: CampaignSaveV6): number {
  let capacity = 36;
  if (atLeast(state, 'water_main', 'trial')) capacity += 22;
  if (atLeast(state, 'water_main', 'operational')) capacity += 14;
  if (atLeast(state, 'valley_greenhouse', 'trial')) capacity += 22;
  if (atLeast(state, 'valley_greenhouse', 'operational')) capacity += 12;
  if (atLeast(state, 'ferry_workshop', 'trial')) capacity += 12;
  if (atLeast(state, 'ferry_workshop', 'operational')) capacity += 10;
  if (atLeast(state, 'well_radio_tower', 'trial')) capacity += 6;
  return capacity;
}
