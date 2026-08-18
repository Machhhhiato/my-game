import type { CampaignSaveV6, Notification } from '../types';
import { POLICIES, PROJECTS, TECHS } from './definitions';
import type { Requirement, RequirementSet } from './requirements';
import { METRIC_DEFS, FOCUS_DEFS } from '../nation';

/**
 * R6 玩家阅读层。运行内核只写稳定键和参数；这里将其还原为玩家能判断
 * “发生了什么、谁受影响、现在该做什么”的句子。
 */

function projectName(id: string | undefined): string { return id && id in PROJECTS ? PROJECTS[id as keyof typeof PROJECTS].name : '这项工程'; }
function techName(id: string | undefined): string { return id && id in TECHS ? TECHS[id as keyof typeof TECHS].name : '这项研究'; }
function policyName(id: string | undefined): string { return id && id in POLICIES ? POLICIES[id as keyof typeof POLICIES].name : '当前行动'; }

const techMilestone: Record<string, string> = {
  '25': '已得到第一批可用资料，研究组正在核对遗漏。',
  '50': '原理已经能在河谷试验，下一步要验证是否能稳定复现。',
  '75': '试验接近完成，瓶颈转为工具、场地或带教人手。',
  '100': '已投入日常使用；相关工程和行动现在可以启动。',
};

const projectMilestone: Record<string, string> = {
  '25': '施工队已进场，第一段实体设施正在成形。',
  '50': '设施开始试运行，部分居民会先获得服务。',
  '75': '主要结构已完成，正在校正故障和交接维护。',
  '100': '已经投入运行；它会持续改变河谷的日常条件。',
};

const eventCopy: Record<string, { started: string; resolved: string }> = {
  water_wear: { started: '净水设备的磨损加剧，饮水保障正在变差。优先安排净水、维修或配给行动。', resolved: '净水设备的异常磨损已缓解，供水恢复到可控状态。' },
  acid_rain: { started: '南部酸雨带回流，耕地和居住区都可能受影响。尽快推进恢复、温室或卫生行动。', resolved: '酸雨回流的直接影响已被压住，河谷可以继续恢复土地。' },
  ferry_injury: { started: '旧渡口发生传动伤人事故。工务进度会受影响，伤者与施工队都需要照应。', resolved: '旧渡口的伤人风险已处理，工务所恢复了正常作业。' },
  road_ambush: { started: '夜间道路出现袭扰，护运与补给正在受阻。加强通信、护运或道路安排可降低损失。', resolved: '道路袭扰暂时消退，护运队恢复了常规通行。' },
};

export function requirementSummary(requirement: Requirement, state: CampaignSaveV6): string {
  if (requirement.kind === 'tech') return `先完成「${techName(requirement.id)}」`;
  if (requirement.kind === 'facility') return `让「${projectName(requirement.id)}」进入${requirement.stage === 'trial' ? '试运行' : '稳定运行'}`;
  if (requirement.kind === 'project') return `先把「${projectName(requirement.id)}」推进到 ${requirement.milestone}%`;
  const metric = METRIC_DEFS[requirement.id];
  return `先让${metric.name}恢复到 ${requirement.min}（当前 ${Math.round(state.metrics[requirement.id].value)}；主要受${metric.bottleneck}影响）`;
}

export function unmetRequirementsSummary(requirements: RequirementSet, state: CampaignSaveV6): string {
  const all = requirements.all.filter((item) => !requirementMetForCopy(item, state)).map((item) => requirementSummary(item, state));
  const any = requirements.any && !requirements.any.some((item) => requirementMetForCopy(item, state))
    ? `以下任一项即可：${requirements.any.map((item) => requirementSummary(item, state)).join('，或 ')}`
    : null;
  return [...all, any].filter(Boolean).join('；') || '条件已满足';
}

function requirementMetForCopy(requirement: Requirement, state: CampaignSaveV6): boolean {
  if (requirement.kind === 'tech') return state.completed.techs.includes(requirement.id);
  if (requirement.kind === 'metric') return state.metrics[requirement.id].value >= requirement.min;
  if (requirement.kind === 'project') return state.facilities[requirement.id].reachedMilestones.includes(requirement.milestone);
  const rank = { locked: 0, planned: 1, construction: 2, trial: 3, operational: 4, damaged: 0 } as const;
  return rank[state.facilities[requirement.id].stage] >= rank[requirement.stage];
}

export function notificationSummary(entry: Notification): string {
  const parts = entry.copyKey.split('.');
  if (entry.copyKey === 'campaign.begin') return '第 07 号的 31 名居民已离开深层存续设施，在翡翠河谷展开外拓。先完成地形勘查，再决定净水干线的走向。';
  if (parts[0] === 'tech' && parts[1] === 'started') return `研究组开始推进「${techName(String(entry.params.tech))}」，会暂时占用档案、仪器和带教人手。`;
  if (parts[0] === 'tech') return `「${techName(parts[1])}」：${techMilestone[parts[2]] ?? '研究状态已更新。'}`;
  if (parts[0] === 'project' && parts[1] === 'started') return `工程队开始建设「${projectName(String(entry.params.project))}」，前几天仍在交接人手和设备。`;
  if (parts[0] === 'project') return `「${projectName(parts[1])}」：${projectMilestone[parts[2]] ?? '工程状态已更新。'}`;
  if (parts[0] === 'policy') return `「${policyName(parts[1])}」${parts[2] === 'started' ? '开始执行：资源会优先投向这件事。' : parts[2] === 'complete' ? '到期结束，执行结果已记入河谷记录。' : '提前结束，剩余效果不再继续。'}`;
  if (parts[0] === 'event') return eventCopy[parts[1]]?.[parts[2] as 'started' | 'resolved'] ?? '河谷出现了一项需要留意的变化。';
  if (entry.copyKey === 'report.sixty_day') return '过去六十日的重点变化已归档。聚居地没有停表，工程、研究和日常服务仍会继续推进。';
  if (entry.copyKey === 'focus.reorganization.started') return `国策正在改为「${FOCUS_DEFS[String(entry.params.focus) as keyof typeof FOCUS_DEFS]?.name ?? '新方向'}」。接下来的十天，人员和设备要重新交接，效率会先降后回升。`;
  if (entry.copyKey === 'focus.reorganization.complete') return '新的国策已接手日常调度，施工和研究恢复正常效率。';
  if (entry.copyKey.includes('no_candidate')) return '自动推进暂时找不到能开工的下一项；打开对应面板可看到还缺什么。';
  if (entry.copyKey.includes('auto.')) return `自动推进已接手下一项：${parts[1] === 'project' ? projectName(String(entry.params.id)) : techName(String(entry.params.id))}。`;
  if (entry.copyKey === 'system.migrated_to_v6') return '河谷战役已换用新的连续运行规则；旧原型存档已保留，不会被覆盖。';
  if (entry.copyKey === 'stage.settlement.reached') return '河谷定居成立：净水和食物已跨过最危险的门槛。现在可以把更多人手用于工务、教育和外拓，而不必每天只为维持生存奔走。';
  if (entry.copyKey === 'stage.worktown.reached') return '河谷工务镇形成：渡口道路、生产设施和常住人口已连成稳定节点。中央现在能够把调配延伸到更远的地区。';
  return '河谷的执行状态发生变化；可在报告中查看相关工程、研究或风险。';
}

export function notificationSeverity(entry: Notification): 'info' | 'warn' | 'danger' {
  if (entry.kind === 'event') return entry.copyKey.endsWith('.started') ? 'warn' : 'info';
  if (entry.copyKey.includes('cancelled') || entry.copyKey.includes('no_candidate')) return 'warn';
  return 'info';
}
