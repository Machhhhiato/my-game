import type { FacilityId } from '../types';

/** 地图表现只读设施运行状态；工程、科技、事件都不在渲染层另行判断。 */
export interface FacilityPresentation {
  id: FacilityId;
  anchor: [number, number];
  region: 'emerald_valley' | 'old_ferry';
  /** 中景旗帜下的圆环规模；反映该地标对周边空间的实际占用与调度量。 */
  mapScale: number;
  constructionLine?: [number, number][];
}

export const FACILITY_PRESENTATIONS: Record<FacilityId, FacilityPresentation> = {
  water_main: {
    id: 'water_main', anchor: [39.45, 17.55], region: 'emerald_valley', mapScale: 1.9,
    constructionLine: [[38.2, 18.6], [38.55, 18.3], [39.15, 17.85], [39.75, 17.15], [40.6, 16.4]],
  },
  valley_greenhouse: { id: 'valley_greenhouse', anchor: [40.92, 16.92], region: 'emerald_valley', mapScale: 1.45 },
  ferry_workshop: { id: 'ferry_workshop', anchor: [44.92, 14.02], region: 'old_ferry', mapScale: 1.6 },
  well_radio_tower: { id: 'well_radio_tower', anchor: [38.42, 18.92], region: 'emerald_valley', mapScale: 1.0 },
};
