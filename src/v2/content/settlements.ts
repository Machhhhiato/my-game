import type { CampaignSaveV6, V6ProjectId } from '../types';

/**
 * 聚居地在战略地图上的演进阶段。
 * 这是城市本体的累计结果；单个工程仍只在近景作为可辨认地标出现。
 */
export type SettlementStage = 'camp' | 'settlement' | 'worktown' | 'city';

export interface SettlementPresentation {
  /** 稳定地图事实键；不能使用具体河流、设施编号或贴图文件名。 */
  id: string;
  /** 实际坐标始终从此节点读取，蓝图重排锚点后城市会一同移动。 */
  nodeId: string;
  name: string;
  /** 仅供没有节点的旧档回退，正常渲染不直接使用它。 */
  anchor: [number, number];
  /** 中远景规模圈的基准半径，而非贴图尺寸。 */
  scaleByStage: Record<SettlementStage, number>;
  /** 每座聚居地的阶段门只写项目 ID；气候、地貌和城市贴图由地图事实另行决定。 */
  stageProjects: {
    foundation: V6ProjectId;
    worktownAll: V6ProjectId[];
    cityAll: V6ProjectId[];
  };
  stagePopulation: { worktown: number; city: number };
}

export const EMERALD_VALLEY: SettlementPresentation = {
  id: 'emerald_valley',
  nodeId: 'valley_outpost',
  name: '翡翠河谷',
  anchor: [40.6, 16.4],
  scaleByStage: { camp: 0.75, settlement: 1, worktown: 1.38, city: 1.78 },
  stageProjects: {
    foundation: 'water_main',
    worktownAll: ['valley_greenhouse', 'ferry_workshop'],
    cityAll: ['water_main', 'valley_greenhouse', 'ferry_workshop', 'well_radio_tower'],
  },
  stagePopulation: { worktown: 50, city: 120 },
};

/** 渲染器从该列表枚举聚居地，避免把“翡翠河谷”写死在地图逻辑里。 */
export const SETTLEMENTS: SettlementPresentation[] = [EMERALD_VALLEY];

/**
 * 城市形态只读取已完成的实体工程，不能被 UI 或地图单独改写。
 * 后续阶段可在这里继续添加人口、行政等级等条件，而不会改动渲染协议。
 */
export function settlementStage(state: Pick<CampaignSaveV6, 'completed' | 'population'>, settlement: SettlementPresentation): SettlementStage {
  const completed = new Set(state.completed.projects);
  if (state.population >= settlement.stagePopulation.city && settlement.stageProjects.cityAll.every((id) => completed.has(id))) return 'city';
  if (state.population >= settlement.stagePopulation.worktown && completed.has(settlement.stageProjects.foundation) && settlement.stageProjects.worktownAll.every((id) => completed.has(id))) return 'worktown';
  if (completed.has(settlement.stageProjects.foundation)) return 'settlement';
  return 'camp';
}

/** 保留旧调用名，避免未迁移的地图/模拟脚本失效。 */
export function emeraldValleyStage(state: Pick<CampaignSaveV6, 'completed' | 'population'>): SettlementStage {
  return settlementStage(state, EMERALD_VALLEY);
}
