import { installStage1Catalog } from './content';
import { installExplorationTargets } from './exploration';
import type { Stage1CatalogSource } from './content';
import type { TextExplorationTarget } from './types';

/**
 * 可试玩首阶段不是正式剧本，也不借用河谷专名。
 * 它是 R10 的最小通用路径：维持生活 → 建立设施 → 自动化 → 稳定聚居。
 */
const STARTER_SOURCE: Stage1CatalogSource = {
  techs: [
    { id: 'starter.tech.water-survey', domain: 'water', tier: 1, class: 'breakthrough', prerequisites: [], discoveryPrerequisites: ['discovery.knowledge.water-sample'], playerCopyKey: 'starter.tech.water-survey', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可辨认安全取水点，并按固定流程检验水源。', automationEligible: false } } },
    { id: 'starter.tech.food-preservation', domain: 'food', tier: 1, class: 'breakthrough', prerequisites: [], discoveryPrerequisites: ['discovery.knowledge.stores'], playerCopyKey: 'starter.tech.food-preservation', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可用简易保藏和轮换制度降低食物损耗。', automationEligible: false } } },
    { id: 'starter.tech.tool-recovery', domain: 'industry', tier: 1, class: 'breakthrough', prerequisites: [], discoveryPrerequisites: ['discovery.knowledge.components'], playerCopyKey: 'starter.tech.tool-recovery', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可检修常用工具，并按故障优先级安排维修。', automationEligible: false } } },
    { id: 'starter.tech.water-routine', domain: 'water', tier: 2, class: 'branch', prerequisites: ['starter.tech.water-survey'], playerCopyKey: 'starter.tech.water-routine', runtime: { time: { workDays: 10, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '建立取水、检验和储存的例行操作规程。', automationEligible: false } } },
    { id: 'starter.tech.maintenance-routine', domain: 'industry', tier: 2, class: 'branch', prerequisites: ['starter.tech.tool-recovery'], playerCopyKey: 'starter.tech.maintenance-routine', runtime: { time: { workDays: 10, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '建立维修值守和备件登记规程。', automationEligible: false } } },
    { id: 'starter.tech.automatic-duty', domain: 'admin', tier: 2, class: 'refinement', prerequisites: ['starter.tech.water-routine', 'starter.tech.maintenance-routine'], engineeringPrerequisites: ['starter.project.water-station', 'starter.project.repair-workshop'], playerCopyKey: 'starter.tech.automatic-duty', runtime: { time: { workDays: 12, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'high' }, result: { capability: '将重复取水、巡视和维修交给固定值守班次。', automationEligible: true } } },
  ],
  projects: [
    { id: 'starter.project.water-station', domain: 'water', kind: 'facility', prerequisites: ['starter.tech.water-survey'], discoveryPrerequisites: ['discovery.site.intake-axis'], playerCopyKey: 'starter.project.water-station', runtime: { time: { workDays: 12, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 8, maintenanceLoad: 'low' }, result: { reserveOutput: { water: 0.30 }, metricEffects: { livelihood: 0.42 }, facilityState: '投用', mapClass: 'water-service', automationFacility: false } } },
    { id: 'starter.project.storage-shed', domain: 'food', kind: 'facility', prerequisites: ['starter.tech.food-preservation'], discoveryPrerequisites: ['discovery.site.storehouse'], playerCopyKey: 'starter.project.storage-shed', runtime: { time: { workDays: 12, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 8, maintenanceLoad: 'low' }, result: { reserveOutput: { food: 0.30 }, metricEffects: { livelihood: 0.32 }, facilityState: '投用', mapClass: 'food-service', automationFacility: false } } },
    { id: 'starter.project.repair-workshop', domain: 'industry', kind: 'facility', prerequisites: ['starter.tech.tool-recovery'], discoveryPrerequisites: ['discovery.site.salvage-yard'], playerCopyKey: 'starter.project.repair-workshop', runtime: { time: { workDays: 14, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 10, maintenanceLoad: 'medium' }, result: { reserveOutput: { repair: 0.32 }, metricEffects: { industry: 0.46 }, facilityState: '投用', mapClass: 'repair-workshop', automationFacility: false } } },
    { id: 'starter.project.intake-rig', domain: 'water', kind: 'facility', prerequisites: ['starter.tech.water-routine', 'starter.tech.automatic-duty'], playerCopyKey: 'starter.project.intake-rig', runtime: { time: { workDays: 16, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 12, maintenanceLoad: 'medium' }, result: { reserveOutput: { water: 0.20, repair: 0.08 }, metricEffects: { livelihood: 0.50, industry: 0.20 }, facilityState: '投用', mapClass: 'intake-rig', automationFacility: true } } },
  ],
  policies: [
    { id: 'starter.policy.water-duty', familyId: 'starter.policy.water-duty', theme: 'livelihood', prerequisites: ['starter.tech.water-routine'], playerCopyKey: 'starter.policy.water-duty', runtime: { time: { durationDays: 21, milestones: [100] }, staffing: { administrators: 1 }, demand: { coordinationLoad: 1 }, result: { reserveOutput: { water: 0.10 }, metricEffects: { livelihood: 0.20 }, cooldownDays: 21 } } },
    { id: 'starter.policy.repair-rota', familyId: 'starter.policy.repair-rota', theme: 'industry', prerequisites: ['starter.tech.maintenance-routine'], playerCopyKey: 'starter.policy.repair-rota', runtime: { time: { durationDays: 21, milestones: [100] }, staffing: { administrators: 1 }, demand: { coordinationLoad: 1 }, result: { reserveOutput: { repair: 0.10 }, metricEffects: { industry: 0.18 }, cooldownDays: 21 } } },
  ],
  copy: {
    technology: [
      { key: 'starter.tech.water-survey', title: '安全取水勘察', summary: '确认可用水源、污染风险和取水路线。完成后才能建设供水设施。' },
      { key: 'starter.tech.food-preservation', title: '食物保藏', summary: '用储存、轮换和检验减少食物在等待中的损耗。' },
      { key: 'starter.tech.tool-recovery', title: '工具修复', summary: '建立最基本的检修顺序，避免小故障拖垮日常维护。' },
      { key: 'starter.tech.water-routine', title: '供水例行规程', summary: '把取水、检验和储存编成可交接的日常流程。' },
      { key: 'starter.tech.maintenance-routine', title: '维修值守规程', summary: '把维修、备件登记和巡查改为稳定的值守工作。' },
      { key: 'starter.tech.automatic-duty', title: '固定值守自动化', summary: '让已经验证的供水与维修流程交给固定班次持续执行。' },
    ],
    project: [
      { key: 'starter.project.water-station', title: '简易净水站', summary: '把取水、过滤和储存集中到一个可维护的公共设施。' },
      { key: 'starter.project.storage-shed', title: '保藏棚', summary: '建立通风、遮蔽和轮换区，减少食物在储存期的损耗。' },
      { key: 'starter.project.repair-workshop', title: '维修工场', summary: '为工具检查、拆修和零件归位提供固定工作场所。' },
      { key: 'starter.project.intake-rig', title: '半自动取水装置', summary: '将已验证的取水与值守流程接入简易机械装置，减少重复人力。' },
    ],
    policy: [
      { key: 'starter.policy.water-duty', title: '供水轮值', summary: '在一个执行周期内优先安排取水、检验和储存交接。' },
      { key: 'starter.policy.repair-rota', title: '维修轮班', summary: '在一个执行周期内优先处理影响供给的故障和备件登记。' },
    ],
  },
};

const STARTER_EXPLORATION_TARGETS: TextExplorationTarget[] = [
  { id: 'starter.explore.north', direction: '北侧高地', name: '断层水线', summary: '沿高地落差寻找可持续取水点，并记录可能的引水位置。', mapPosition: [160, 24], coordinateRef: 'geo.demo.north-ridge.01', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.water-sample', kind: 'knowledge', coordinateRef: 'geo.demo.north-ridge.01', label: '水样与水文记录' }, { id: 'discovery.site.intake-axis', kind: 'engineering-site', coordinateRef: 'geo.demo.north-ridge.01', label: '取水工程候选地' }] },
  { id: 'starter.explore.east', direction: '东侧旧区', name: '封闭仓间', summary: '检查旧建筑的遮蔽、通风和可回收保藏材料。', mapPosition: [270, 122], coordinateRef: 'geo.demo.east-old-quarter.01', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.stores', kind: 'knowledge', coordinateRef: 'geo.demo.east-old-quarter.01', label: '保藏记录与可用材料' }, { id: 'discovery.site.storehouse', kind: 'engineering-site', coordinateRef: 'geo.demo.east-old-quarter.01', label: '仓储工程候选地' }] },
  { id: 'starter.explore.west', direction: '西侧残骸带', name: '维护残件区', summary: '清点尚可拆修的构件，确认安全作业范围。', mapPosition: [50, 122], coordinateRef: 'geo.demo.west-debris.01', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.components', kind: 'knowledge', coordinateRef: 'geo.demo.west-debris.01', label: '可回收部件记录' }, { id: 'discovery.site.salvage-yard', kind: 'engineering-site', coordinateRef: 'geo.demo.west-debris.01', label: '维修工程候选地' }] },
];

export function installStarterContent(): void {
  installStage1Catalog(STARTER_SOURCE);
  installExplorationTargets(STARTER_EXPLORATION_TARGETS);
}

export const STARTER_CONTENT_COUNTS = {
  technologies: STARTER_SOURCE.techs.length,
  projects: STARTER_SOURCE.projects.length,
  policies: STARTER_SOURCE.policies.length,
};
