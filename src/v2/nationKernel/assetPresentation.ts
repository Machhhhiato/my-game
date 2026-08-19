import type { KernelId } from './types';

export interface StrategicAssetPresentation {
  displayName: string;
  roleSummary: string;
  impactSummary: string;
  limitationSummary: string;
  civilizationMeaning: string;
}

export const STRATEGIC_ASSET_PRESENTATIONS: Record<KernelId, StrategicAssetPresentation> = {
  'presentation.r28b.guard-equipment': {
    displayName: '“磐石”通用守备装备体系',
    roleSummary: '面向边境守备、补给节点保护和通道拒止的第一代标准化成套装备。',
    impactSummary: '在地区尺度内，它能压制轻装渗透力量、击毁无重装防护的小型车辆，并使缺乏坚固工事的前沿据点失去继续行动能力。模块化火力、观测和通信组件让守备编制可以沿道路与据点连续展开，而不必等待临时拼装武器。',
    limitationSummary: '它不是突破重型筑垒或对抗正规装甲集群的决战装备；离开补给道路或低于十二日储备后，持续警戒、备件轮换和火力密度都会迅速下降。',
    civilizationMeaning: '它证明国家已经能把统一标准、工厂、产线和训练体系组合成可复制军力，前沿存在从临时人员驻守变成可长期维持的国家资产。',
  },
  'presentation.r29a.mobile-heavy-equipment': {
    displayName: '“雷霆”机动重装装备体系',
    roleSummary: '面向快速增援、机动反击和摧毁中型装甲目标的第一代重装成套装备。',
    impactSummary: '在战区尺度内，它可以沿干线快速集中火力，击穿中型装甲车辆、摧毁临时加固火力点，并在敌方完成集结前打断一支进攻编队的行动节奏。重型动力、火控和通信组件让守备力量第一次具备主动反击能力，而不只是固守道路和据点。',
    limitationSummary: '它需要稳定道路、专业维修设施和高强度补给；复杂动力与火控系统使故障恢复更慢。补给低于十八日或长期脱离维修中心时，机动和火力优势会迅速衰减。',
    civilizationMeaning: '它证明国家已经能够生产和维持跨地区机动作战装备，但也会把更多工业、燃料、备件和维修能力锁定在军事体系中。',
  },
};

export function strategicAssetPresentation(id: KernelId): StrategicAssetPresentation | undefined {
  return STRATEGIC_ASSET_PRESENTATIONS[id];
}
