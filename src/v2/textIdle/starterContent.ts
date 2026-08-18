import { installStage1Catalog } from './content';
import { installExplorationTargets } from './exploration';
import type { Stage1CatalogSource } from './content';
import type { TextExplorationTarget } from './types';

/**
 * 可试玩首阶段不是正式剧本，也不借用河谷专名。
 * 它是 R10 的最小通用路径：维持生活 → 建立设施 → 自动化 → 稳定聚居。
 */
/** Shared stage-one capability catalog. Campaign templates supply the geography and discovery placement. */
export const STARTER_SOURCE: Stage1CatalogSource = {
  techs: [
    { id: 'starter.tech.water-survey', domain: 'water', tier: 1, class: 'breakthrough', prerequisites: [], discoveryPrerequisites: ['discovery.knowledge.water-sample'], playerCopyKey: 'starter.tech.water-survey', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可辨认安全取水点，并按固定流程检验水源。', automationEligible: false } } },
    { id: 'starter.tech.food-preservation', domain: 'food', tier: 1, class: 'breakthrough', prerequisites: [], discoveryPrerequisites: ['discovery.knowledge.stores'], playerCopyKey: 'starter.tech.food-preservation', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可用简易保藏和轮换制度降低食物损耗。', automationEligible: false } } },
    { id: 'starter.tech.tool-recovery', domain: 'industry', tier: 1, class: 'breakthrough', prerequisites: [], discoveryPrerequisites: ['discovery.knowledge.components'], playerCopyKey: 'starter.tech.tool-recovery', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可检修常用工具，并按故障优先级安排维修。', automationEligible: false } } },
    { id: 'starter.tech.water-routine', domain: 'water', tier: 2, class: 'branch', prerequisites: ['starter.tech.water-survey'], playerCopyKey: 'starter.tech.water-routine', runtime: { time: { workDays: 10, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '建立取水、检验和储存的例行操作规程。', automationEligible: false } } },
    { id: 'starter.tech.maintenance-routine', domain: 'industry', tier: 2, class: 'branch', prerequisites: ['starter.tech.tool-recovery'], playerCopyKey: 'starter.tech.maintenance-routine', runtime: { time: { workDays: 10, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '建立维修值守和备件登记规程。', automationEligible: false } } },
    { id: 'starter.tech.automatic-duty', domain: 'admin', tier: 2, class: 'refinement', prerequisites: ['starter.tech.water-routine', 'starter.tech.maintenance-routine'], engineeringPrerequisites: ['starter.project.water-station', 'starter.project.repair-workshop'], playerCopyKey: 'starter.tech.automatic-duty', runtime: { time: { workDays: 12, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'high' }, result: { capability: '将重复取水、巡视和维修交给固定值守班次。', automationEligible: true } } },
    { id: 'starter.tech.water-observation', domain: 'water', tier: 2, class: 'branch', prerequisites: ['starter.tech.water-survey'], discoveryPrerequisites: ['discovery.knowledge.water-cycle'], playerCopyKey: 'starter.tech.water-observation', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可按季节记录水量变化，把临时取样变成例行观测。', automationEligible: false } } },
    { id: 'starter.tech.field-supply-ledger', domain: 'logistics', tier: 2, class: 'branch', prerequisites: ['starter.tech.food-preservation'], discoveryPrerequisites: ['discovery.knowledge.field-supply-ledger'], playerCopyKey: 'starter.tech.field-supply-ledger', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可把外围补给、轮换和损耗记录为可交接的班次计划。', automationEligible: false } } },
    { id: 'starter.tech.relay-maintenance', domain: 'industry', tier: 2, class: 'branch', prerequisites: ['starter.tech.tool-recovery'], discoveryPrerequisites: ['discovery.knowledge.relay-maintenance'], playerCopyKey: 'starter.tech.relay-maintenance', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { researchers: 2 }, demand: { researchLoad: 'standard' }, result: { capability: '可按通行窗口安排外缘维修、回收与交接。', automationEligible: false } } },
  ],
  projects: [
    { id: 'starter.project.temporary-shelter', domain: 'social', kind: 'facility', prerequisites: [], discoveryPrerequisites: ['discovery.site.storehouse'], playerCopyKey: 'starter.project.temporary-shelter', runtime: { time: { workDays: 8, milestones: [25, 50, 75, 100] }, staffing: { builders: 3 }, demand: { constructionSupply: 5, maintenanceLoad: 'low' }, result: { reserveOutput: {}, metricEffects: { livelihood: 0.20 }, facilityState: '投用', mapClass: 'temporary-shelter', automationFacility: false, housingCapacity: 6 } } },
    { id: 'starter.project.water-station', domain: 'water', kind: 'facility', prerequisites: ['starter.tech.water-survey'], discoveryPrerequisites: ['discovery.site.intake-axis'], playerCopyKey: 'starter.project.water-station', runtime: { time: { workDays: 12, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 8, maintenanceLoad: 'low' }, result: { reserveOutput: { water: 0.30 }, metricEffects: { livelihood: 0.42 }, facilityState: '投用', mapClass: 'water-service', automationFacility: false } } },
    { id: 'starter.project.storage-shed', domain: 'food', kind: 'facility', prerequisites: ['starter.tech.food-preservation'], discoveryPrerequisites: ['discovery.site.storehouse'], playerCopyKey: 'starter.project.storage-shed', runtime: { time: { workDays: 12, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 8, maintenanceLoad: 'low' }, result: { reserveOutput: { food: 0.30 }, metricEffects: { livelihood: 0.32 }, facilityState: '投用', mapClass: 'food-service', automationFacility: false } } },
    { id: 'starter.project.repair-workshop', domain: 'industry', kind: 'facility', prerequisites: ['starter.tech.tool-recovery'], discoveryPrerequisites: ['discovery.site.salvage-yard'], playerCopyKey: 'starter.project.repair-workshop', runtime: { time: { workDays: 14, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 10, maintenanceLoad: 'medium' }, result: { reserveOutput: { repair: 0.32 }, metricEffects: { industry: 0.46 }, facilityState: '投用', mapClass: 'repair-workshop', automationFacility: false } } },
    { id: 'starter.project.intake-rig', domain: 'water', kind: 'facility', prerequisites: ['starter.tech.water-routine', 'starter.tech.automatic-duty'], playerCopyKey: 'starter.project.intake-rig', runtime: { time: { workDays: 16, milestones: [25, 50, 75, 100] }, staffing: { builders: 4 }, demand: { constructionSupply: 12, maintenanceLoad: 'medium' }, result: { reserveOutput: { water: 0.20, repair: 0.08 }, metricEffects: { livelihood: 0.50, industry: 0.20 }, facilityState: '投用', mapClass: 'intake-rig', automationFacility: true } } },
    { id: 'starter.project.water-watch', domain: 'water', kind: 'facility', prerequisites: ['starter.tech.water-observation'], discoveryPrerequisites: ['discovery.site.water-watch'], playerCopyKey: 'starter.project.water-watch', runtime: { time: { workDays: 10, milestones: [25, 50, 75, 100] }, staffing: { builders: 2 }, demand: { constructionSupply: 5, maintenanceLoad: 'low' }, result: { reserveOutput: { water: 0.10 }, metricEffects: { livelihood: 0.14 }, facilityState: '投用', mapClass: 'water-observation', automationFacility: false } } },
    { id: 'starter.project.field-cache', domain: 'logistics', kind: 'facility', prerequisites: ['starter.tech.field-supply-ledger'], discoveryPrerequisites: ['discovery.site.field-cache'], playerCopyKey: 'starter.project.field-cache', runtime: { time: { workDays: 10, milestones: [25, 50, 75, 100] }, staffing: { builders: 2 }, demand: { constructionSupply: 5, maintenanceLoad: 'low' }, result: { reserveOutput: { food: 0.10, repair: 0.08 }, metricEffects: { logistics: 0.18 }, facilityState: '投用', mapClass: 'field-cache', automationFacility: false } } },
    { id: 'starter.project.relay-store', domain: 'industry', kind: 'facility', prerequisites: ['starter.tech.relay-maintenance'], discoveryPrerequisites: ['discovery.site.relay-store'], playerCopyKey: 'starter.project.relay-store', runtime: { time: { workDays: 10, milestones: [25, 50, 75, 100] }, staffing: { builders: 2 }, demand: { constructionSupply: 5, maintenanceLoad: 'low' }, result: { reserveOutput: { repair: 0.12 }, metricEffects: { industry: 0.16 }, facilityState: '投用', mapClass: 'relay-store', automationFacility: false } } },
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
      { key: 'starter.tech.water-observation', title: '水源观测记录', summary: '把复测水样、季节水量和取水风险整理为可交接的观测流程。' },
      { key: 'starter.tech.field-supply-ledger', title: '外缘补给台账', summary: '用固定清单安排外围补给、轮换和损耗，避免临时征集成为常态。' },
      { key: 'starter.tech.relay-maintenance', title: '外缘维修交接', summary: '把通行窗口、构件回收和维修班次衔接为可复核流程。' },
    ],
    project: [
      { key: 'starter.project.temporary-shelter', title: '临时安置棚', summary: '用现有遮蔽材料搭建可登记、可轮换和可维护的临时住处；不需要科研，但必须先勘察确认位置。' },
      { key: 'starter.project.water-station', title: '简易净水站', summary: '把取水、过滤和储存集中到一个可维护的公共设施。' },
      { key: 'starter.project.storage-shed', title: '保藏棚', summary: '建立通风、遮蔽和轮换区，减少食物在储存期的损耗。' },
      { key: 'starter.project.repair-workshop', title: '维修工场', summary: '为工具检查、拆修和零件归位提供固定工作场所。' },
      { key: 'starter.project.intake-rig', title: '半自动取水装置', summary: '将已验证的取水与值守流程接入简易机械装置，减少重复人力。' },
      { key: 'starter.project.water-watch', title: '水源观测点', summary: '在复测确认的位置设置读数、取样和通报设施，提前识别水源变化。' },
      { key: 'starter.project.field-cache', title: '前置补给点', summary: '在已核验的通行点储备轮换物资，缩短外围队伍的补给间隔。' },
      { key: 'starter.project.relay-store', title: '维修转存点', summary: '把可回收构件、检修工具和交接记录集中到可维护的转存设施。' },
    ],
    policy: [
      { key: 'starter.policy.water-duty', title: '供水轮值', summary: '在一个执行周期内优先安排取水、检验和储存交接。' },
      { key: 'starter.policy.repair-rota', title: '维修轮班', summary: '在一个执行周期内优先处理影响供给的故障和备件登记。' },
    ],
  },
};

export const STARTER_EXPLORATION_TARGETS: TextExplorationTarget[] = [
  { id: 'starter.explore.north', direction: '北侧高地', name: '断层水线', summary: '沿高地落差寻找可持续取水点，并记录可能的引水位置。', updates: ['正在核验可通行的取水坡面。', '正在比对样本与沉积层，排除短期积水。'], mapPosition: [160, 24], coordinateRef: 'geo.demo.north-ridge.01', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.water-sample', kind: 'knowledge', coordinateRef: 'geo.demo.north-ridge.01', label: '水样与水文记录' }, { id: 'discovery.site.intake-axis', kind: 'engineering-site', coordinateRef: 'geo.demo.north-ridge.01', label: '取水工程候选地' }] },
  { id: 'starter.explore.east', direction: '东侧旧区', name: '封闭仓间', summary: '检查旧建筑的遮蔽、通风和可回收保藏材料。', updates: ['正在清点遮蔽空间与可修复门窗。', '正在比对通风、湿度和物资轮换条件。'], mapPosition: [270, 122], coordinateRef: 'geo.demo.east-old-quarter.01', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.stores', kind: 'knowledge', coordinateRef: 'geo.demo.east-old-quarter.01', label: '保藏记录与可用材料' }, { id: 'discovery.site.storehouse', kind: 'engineering-site', coordinateRef: 'geo.demo.east-old-quarter.01', label: '仓储工程候选地' }] },
  { id: 'starter.explore.west', direction: '西侧残骸带', name: '维护残件区', summary: '清点尚可拆修的构件，确认安全作业范围。', updates: ['正在划出可安全进入的残件带。', '正在核验构件可回收性与维修风险。'], mapPosition: [50, 122], coordinateRef: 'geo.demo.west-debris.01', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.components', kind: 'knowledge', coordinateRef: 'geo.demo.west-debris.01', label: '可回收部件记录' }, { id: 'discovery.site.salvage-yard', kind: 'engineering-site', coordinateRef: 'geo.demo.west-debris.01', label: '维修工程候选地' }] },
  { id: 'starter.explore.north-recheck', direction: '北侧高地', name: '水线复测', summary: '在首轮样本基础上复核水量变化、沉积物和取水风险。', requirements: { discoveries: ['discovery.knowledge.water-sample'] }, updates: ['正在对照首轮水样设置复测点。', '正在记录水位变化和维护所需的通行窗口。'], mapPosition: [188, 31], coordinateRef: 'geo.demo.north-ridge.01', durationDays: 4, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.water-cycle', kind: 'knowledge', coordinateRef: 'geo.demo.north-ridge.01', label: '季节水量记录' }, { id: 'discovery.site.water-watch', kind: 'engineering-site', coordinateRef: 'geo.demo.north-ridge.01', label: '水源观测点候选地' }] },
  { id: 'starter.explore.east-route', direction: '东侧旧区', name: '补给通道复核', summary: '沿已知仓间外缘核验人员轮换、物资损耗和临时转存条件。', requirements: { discoveries: ['discovery.knowledge.stores'] }, updates: ['正在逐段标记可轮换的遮蔽与停靠条件。', '正在核验转存点的干燥度和补给间隔。'], mapPosition: [282, 92], coordinateRef: 'geo.demo.east-old-quarter.01', durationDays: 4, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.field-supply-ledger', kind: 'knowledge', coordinateRef: 'geo.demo.east-old-quarter.01', label: '外缘补给记录' }, { id: 'discovery.site.field-cache', kind: 'engineering-site', coordinateRef: 'geo.demo.east-old-quarter.01', label: '前置补给点候选地' }] },
  { id: 'starter.explore.west-route', direction: '西侧残骸带', name: '维修通道试走', summary: '以首轮残件清单为基础，确认工具、构件和人员的安全交接路线。', requirements: { discoveries: ['discovery.knowledge.components'] }, updates: ['正在检查工具回收与通行的冲突点。', '正在复核构件转运和夜间交接的风险。'], mapPosition: [38, 92], coordinateRef: 'geo.demo.west-debris.01', durationDays: 4, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.relay-maintenance', kind: 'knowledge', coordinateRef: 'geo.demo.west-debris.01', label: '外缘维修交接记录' }, { id: 'discovery.site.relay-store', kind: 'engineering-site', coordinateRef: 'geo.demo.west-debris.01', label: '维修转存点候选地' }] },
  { id: 'starter.explore.east-rescue', direction: '东侧旧区', name: '避难者联络', summary: '沿已知遮蔽空间寻找仍在等待补给与转移安排的小群体。', requirements: { discoveries: ['discovery.knowledge.stores'] }, updates: ['正在用补给记录核验避难者留下的联络标记。', '正在确认转移所需的饮水与临时安置条件。'], mapPosition: [298, 144], coordinateRef: 'geo.demo.east-old-quarter.02', durationDays: 5, teamRequired: 2, discoveries: [{ id: 'discovery.contact.east-shelter', kind: 'knowledge', coordinateRef: 'geo.demo.east-old-quarter.02', label: '避难者联络记录' }], results: [{ kind: 'survivor-contact', id: 'arrival.east-shelter', label: '旧区避难者', population: 3, dependents: 1, dailyLife: '接纳后会增加劳动力，也需要更多饮水、食物和公共服务。' }] },
  { id: 'starter.explore.west-salvage', direction: '西侧残骸带', name: '构件打捞', summary: '依照已核验的作业边界回收支撑件、紧固件和可修工具。', requirements: { discoveries: ['discovery.knowledge.components'] }, updates: ['正在分批拆除仍可承重的构件。', '正在把可用工具送回共同体检修。'], mapPosition: [22, 140], coordinateRef: 'geo.demo.west-debris.02', durationDays: 5, teamRequired: 2, discoveries: [{ id: 'discovery.cache.west-salvage', kind: 'knowledge', coordinateRef: 'geo.demo.west-debris.02', label: '构件回收清单' }], results: [{ kind: 'materials', id: 'materials.west-salvage', label: '回收构件', construction: 5, reserves: { repair: 2 }, dailyLife: '回收物会补进建设与维修储备，但不会提供永久产出。' }] },
  { id: 'starter.explore.north-outpost', direction: '北侧高地', name: '观测前哨踏勘', summary: '确认高地的轮换窗口、标记方式和小型前哨候选位置。', requirements: { discoveries: ['discovery.knowledge.water-sample'] }, updates: ['正在标记可避险的换班位置。', '正在核验前哨与聚居地之间的往返时间。'], mapPosition: [127, 14], coordinateRef: 'geo.demo.north-ridge.02', durationDays: 5, teamRequired: 2, discoveries: [{ id: 'discovery.route.north-outpost', kind: 'knowledge', coordinateRef: 'geo.demo.north-ridge.02', label: '高地前哨路线记录' }], results: [{ kind: 'route', id: 'route.north-observation', label: '高地观测前哨候选线', dailyLife: '路线记录会改善外围轮换的组织能力，后续仍需维护与建设。' }] },
];

/** Compatibility entry point for the default playable template. */
export function installStarterContent(): void {
  installStage1Catalog(STARTER_SOURCE);
  installExplorationTargets(STARTER_EXPLORATION_TARGETS);
}

export const STARTER_CONTENT_COUNTS = {
  technologies: STARTER_SOURCE.techs.length,
  projects: STARTER_SOURCE.projects.length,
  policies: STARTER_SOURCE.policies.length,
};
