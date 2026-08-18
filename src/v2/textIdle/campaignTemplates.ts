import { installStage1Catalog } from './content';
import { installExplorationTargets } from './exploration';
import { STARTER_EXPLORATION_TARGETS, STARTER_SOURCE } from './starterContent';
import type { TextExplorationTarget } from './types';

/**
 * A campaign template owns only scenario presentation and stable geographic references.
 * The technology, project, policy and nation-kernel contracts remain shared capabilities.
 */
export interface TextCampaignTemplate {
  id: string;
  explorationTargets: TextExplorationTarget[];
}

export const DEFAULT_TEXT_CAMPAIGN_TEMPLATE_ID = 'campaign.starter-v1';

export const DEFAULT_TEXT_CAMPAIGN_TEMPLATE: TextCampaignTemplate = {
  id: DEFAULT_TEXT_CAMPAIGN_TEMPLATE_ID,
  explorationTargets: STARTER_EXPLORATION_TARGETS,
};

/**
 * Verification fixture with a distinct layout, labels, target IDs and completion order.
 * It deliberately reuses capability discoveries: those are contracts, not map identity.
 */
export const RIDGE_TEXT_CAMPAIGN_TEMPLATE: TextCampaignTemplate = {
  id: 'campaign.ridge-v1',
  explorationTargets: [
    { id: 'ridge.scan.shelter', direction: '背风坡', name: '通风岩棚', summary: '核验遮蔽、干燥度和可轮换的储藏空间。', updates: ['正在测量岩棚内外的湿度差。', '正在标记可维持通风的堆放区。'], mapPosition: [62, 42], coordinateRef: 'geo.ridge.shelter.04', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.stores', kind: 'knowledge', coordinateRef: 'geo.ridge.shelter.04', label: '保藏记录与可用材料' }, { id: 'discovery.site.storehouse', kind: 'engineering-site', coordinateRef: 'geo.ridge.shelter.04', label: '仓储工程候选地' }] },
    { id: 'ridge.scan.cistern', direction: '碎岩缓坡', name: '渗滤洼地', summary: '沿碎岩层核验可持续的渗流、取样条件和取水路径。', updates: ['正在追踪渗流进入洼地的时间。', '正在排除只在降雨后出现的积水。'], mapPosition: [236, 32], coordinateRef: 'geo.ridge.cistern.12', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.water-sample', kind: 'knowledge', coordinateRef: 'geo.ridge.cistern.12', label: '水样与水文记录' }, { id: 'discovery.site.intake-axis', kind: 'engineering-site', coordinateRef: 'geo.ridge.cistern.12', label: '取水工程候选地' }] },
    { id: 'ridge.scan.components', direction: '坡脚散布带', name: '拆解平台', summary: '确认可回收构件、作业边界和安全搬运方式。', updates: ['正在分开可用构件与危险残片。', '正在复核搬运路线与临时支撑点。'], mapPosition: [254, 142], coordinateRef: 'geo.ridge.components.07', durationDays: 6, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.components', kind: 'knowledge', coordinateRef: 'geo.ridge.components.07', label: '可回收部件记录' }, { id: 'discovery.site.salvage-yard', kind: 'engineering-site', coordinateRef: 'geo.ridge.components.07', label: '维修工程候选地' }] },
    { id: 'ridge.recheck.shelter', direction: '背风坡', name: '轮换线路复核', summary: '复核岩棚与外围之间的补给轮换和短暂停靠条件。', requirements: { discoveries: ['discovery.knowledge.stores'] }, updates: ['正在记录不同班次的行程消耗。', '正在核验转存点的干燥和交接条件。'], mapPosition: [44, 73], coordinateRef: 'geo.ridge.shelter.04', durationDays: 4, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.field-supply-ledger', kind: 'knowledge', coordinateRef: 'geo.ridge.shelter.04', label: '外缘补给记录' }, { id: 'discovery.site.field-cache', kind: 'engineering-site', coordinateRef: 'geo.ridge.shelter.04', label: '前置补给点候选地' }] },
    { id: 'ridge.recheck.cistern', direction: '碎岩缓坡', name: '渗流复测', summary: '在首轮样本基础上复核水位变化和维护通行窗口。', requirements: { discoveries: ['discovery.knowledge.water-sample'] }, updates: ['正在对照首轮样本布设复测点。', '正在记录水位与通行条件的同步变化。'], mapPosition: [215, 54], coordinateRef: 'geo.ridge.cistern.12', durationDays: 4, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.water-cycle', kind: 'knowledge', coordinateRef: 'geo.ridge.cistern.12', label: '季节水量记录' }, { id: 'discovery.site.water-watch', kind: 'engineering-site', coordinateRef: 'geo.ridge.cistern.12', label: '水源观测点候选地' }] },
    { id: 'ridge.recheck.components', direction: '坡脚散布带', name: '转运试走', summary: '以首轮构件清单复核工具、材料和人员的交接路线。', requirements: { discoveries: ['discovery.knowledge.components'] }, updates: ['正在检查回收工具与通行的冲突点。', '正在复核夜间交接所需的标记与支撑。'], mapPosition: [274, 110], coordinateRef: 'geo.ridge.components.07', durationDays: 4, teamRequired: 2, discoveries: [{ id: 'discovery.knowledge.relay-maintenance', kind: 'knowledge', coordinateRef: 'geo.ridge.components.07', label: '外缘维修交接记录' }, { id: 'discovery.site.relay-store', kind: 'engineering-site', coordinateRef: 'geo.ridge.components.07', label: '维修转存点候选地' }] },
    { id: 'ridge.action.rescue', direction: '背风坡', name: '岩棚联络', summary: '沿轮换记录接触仍在等待转移安排的避难者。', requirements: { discoveries: ['discovery.knowledge.stores'] }, updates: ['正在确认避难者的健康和携带物资。', '正在比对共同体可提供的饮水与住处。'], mapPosition: [30, 100], coordinateRef: 'geo.ridge.shelter.09', durationDays: 5, teamRequired: 2, discoveries: [{ id: 'discovery.contact.ridge-shelter', kind: 'knowledge', coordinateRef: 'geo.ridge.shelter.09', label: '岩棚避难者联络记录' }], results: [{ kind: 'survivor-contact', id: 'arrival.ridge-shelter', label: '岩棚避难者', population: 2, dependents: 0, dailyLife: '接纳后会增加劳动力，也需要更多饮水、食物和公共服务。' }] },
    { id: 'ridge.action.salvage', direction: '坡脚散布带', name: '平台打捞', summary: '按安全清单回收可用于加固和维修的构件。', requirements: { discoveries: ['discovery.knowledge.components'] }, updates: ['正在拆分能继续使用的构件。', '正在把回收物送往共同体。'], mapPosition: [292, 158], coordinateRef: 'geo.ridge.components.10', durationDays: 5, teamRequired: 2, discoveries: [{ id: 'discovery.cache.ridge-salvage', kind: 'knowledge', coordinateRef: 'geo.ridge.components.10', label: '平台回收清单' }], results: [{ kind: 'materials', id: 'materials.ridge-salvage', label: '平台回收构件', construction: 4, reserves: { repair: 2 }, dailyLife: '回收物会补进建设与维修储备，但不会提供永久产出。' }] },
    { id: 'ridge.action.outpost', direction: '碎岩缓坡', name: '缓坡前哨踏勘', summary: '确认复测点的交接标记、轮换窗口和前哨候选线。', requirements: { discoveries: ['discovery.knowledge.water-sample'] }, updates: ['正在标记可用于换班的遮蔽点。', '正在记录前哨与聚居地的往返条件。'], mapPosition: [195, 16], coordinateRef: 'geo.ridge.cistern.16', durationDays: 5, teamRequired: 2, discoveries: [{ id: 'discovery.route.ridge-outpost', kind: 'knowledge', coordinateRef: 'geo.ridge.cistern.16', label: '缓坡前哨路线记录' }], results: [{ kind: 'route', id: 'route.ridge-observation', label: '缓坡观测前哨候选线', dailyLife: '路线记录会改善外围轮换的组织能力，后续仍需维护与建设。' }] },
  ],
};

export const TEXT_CAMPAIGN_TEMPLATES: Record<string, TextCampaignTemplate> = {
  [DEFAULT_TEXT_CAMPAIGN_TEMPLATE.id]: DEFAULT_TEXT_CAMPAIGN_TEMPLATE,
  [RIDGE_TEXT_CAMPAIGN_TEMPLATE.id]: RIDGE_TEXT_CAMPAIGN_TEMPLATE,
};

export function textCampaignTemplate(id: string | undefined): TextCampaignTemplate {
  return TEXT_CAMPAIGN_TEMPLATES[id ?? ''] ?? DEFAULT_TEXT_CAMPAIGN_TEMPLATE;
}

export function installTextCampaignTemplate(template: TextCampaignTemplate): void {
  installStage1Catalog(STARTER_SOURCE);
  installExplorationTargets(template.explorationTargets);
}

export function installStarterContent(): void {
  installTextCampaignTemplate(DEFAULT_TEXT_CAMPAIGN_TEMPLATE);
}
