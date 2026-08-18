import type { TerrainChange, V6ProjectId } from '../types';

/** 项目数值效果与地图工程结果分开登记；只保存模块、锚点、里程碑和标准地表增量。 */
export interface ProjectMapEffectDefinition {
  changeId: string;
  moduleId: string;
  anchorId: string;
  kind: TerrainChange['kind'];
  route?: 'water_main' | 'ferry_road';
  trialRadius: number;
  operationalRadius: number;
}

export const PROJECT_MAP_EFFECTS: Record<V6ProjectId, ProjectMapEffectDefinition[]> = {
  water_main: [
    { changeId: 'water-main-utility-corridor', moduleId: 'water_utility', anchorId: 'valley_outpost', kind: 'utility_corridor', route: 'water_main', trialRadius: 0, operationalRadius: 0 },
    { changeId: 'water-main-settlement-growth', moduleId: 'settlement_core', anchorId: 'valley_outpost', kind: 'urban_growth', trialRadius: 0.62, operationalRadius: 0.92 },
  ],
  valley_greenhouse: [
    { changeId: 'greenhouse-settlement-growth', moduleId: 'greenhouse_complex', anchorId: 'valley_outpost', kind: 'urban_growth', trialRadius: 0.48, operationalRadius: 0.76 },
  ],
  ferry_workshop: [
    { changeId: 'ferry-road-connection', moduleId: 'overland_corridor', anchorId: 'old_ferry_camp', kind: 'road', route: 'ferry_road', trialRadius: 0, operationalRadius: 0 },
    { changeId: 'ferry-worktown-growth', moduleId: 'workshop_hub', anchorId: 'old_ferry_camp', kind: 'urban_growth', trialRadius: 0.42, operationalRadius: 0.66 },
  ],
  well_radio_tower: [],
};
