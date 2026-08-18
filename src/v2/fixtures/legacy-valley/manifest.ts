// ============ Legacy Valley Fixture（旧河谷测试夹具）清单 ============
//
// 依 D-044 / STANDARDIZATION_AND_SCENARIO_SEPARATION.md，旧“第 07 号—翡翠河谷—旧渡口”
// 内容只作为回归测试与文案样本保留，不再作为默认战役或新系统的输入。
//
// 本文件是旧专名在新代码中唯一允许出现的位置。通用 contracts、world generator、
// renderer 与 UI 不得 import 本文件。

export interface LegacyValleyFixtureManifest {
  id: 'fixture.legacy-valley';
  status: 'legacy';
  /** 旧节点/区域/工程/科研 ID（仅用于迁移映射与回归回归，不作为通用逻辑前置） */
  legacyNodeIds: string[];
  legacyRegionIds: string[];
  legacyProjectIds: string[];
  legacyResearchIds: string[];
  legacyDisplayNames: string[];
  note: string;
}

export const LEGACY_VALLEY_FIXTURE: LegacyValleyFixtureManifest = {
  id: 'fixture.legacy-valley',
  status: 'legacy',
  legacyNodeIds: ['facility_07', 'valley_outpost', 'old_ferry_camp'],
  legacyRegionIds: ['emerald_valley', 'old_ferry', 'south_acid'],
  legacyProjectIds: ['water_life', 'seed_protein', 'workshop_calib', 'archive_beacon'],
  legacyResearchIds: ['membrane_reuse', 'field_methods', 'maintenance_training'],
  legacyDisplayNames: ['翡翠河谷', '第 07 号深层存续设施', '翡翠河谷外拓营', '旧渡口行旅营', '南部酸雨带'],
  note: 'LEGACY FIXTURE — 禁止 import 进通用 contracts / world generator / renderer / UI。',
};
