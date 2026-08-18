// ============ P1-S03C 固定内容（严格使用规格提供的名称与句式） ============
import type { FocusId, MetricId } from './types';

export const METRIC_ORDER: MetricId[] = [
  'livelihood', 'industry', 'energy', 'research', 'administration',
  'logistics', 'military', 'stability', 'ecology',
];

export interface MetricDef {
  name: string;
  initial: number;
  sources: string[];
  bottleneck: string;
}

export const METRIC_DEFS: Record<MetricId, MetricDef> = {
  livelihood: { name: '日常保障', initial: 48, sources: ['净水站', '配给', '卫生站'], bottleneck: '净水设备磨损' },
  industry: { name: '工务能力', initial: 32, sources: ['工务所', '工具', '设备'], bottleneck: '设备故障' },
  energy: { name: '可用能源', initial: 52, sources: ['旧设施电网', '燃料'], bottleneck: '负荷' },
  research: { name: '研究能力', initial: 12, sources: ['档案', '学徒', '仪器'], bottleneck: '仪器短缺' },
  administration: { name: '统筹能力', initial: 20, sources: ['档案', '调度流程', '通讯'], bottleneck: '通讯' },
  logistics: { name: '运输与补给', initial: 28, sources: ['河谷道路', '水网', '运输队'], bottleneck: '道路' },
  military: { name: '防卫能力', initial: 11, sources: ['守备队', '装备', '后勤'], bottleneck: '装备' },
  stability: { name: '共同体协作', initial: 54, sources: ['民生', '伤亡', '处置方式'], bottleneck: '公平争议' },
  ecology: { name: '土地与环境', initial: 58, sources: ['酸雨', '净化', '耕作方式'], bottleneck: '酸雨' },
};

export const FOCUS_ORDER: FocusId[] = ['survival', 'balanced', 'industry', 'science', 'military'];

export interface FocusDef {
  name: string;
  desc: string;
}

export const FOCUS_DEFS: Record<FocusId, FocusDef> = {
  survival: { name: '民生优先', desc: '将主要人手和运输优先投向供水、食物与基础照护。短期压住生存风险；代价是研究与扩张放缓。' },
  balanced: { name: '定居发展', desc: '在居住、公共服务、工务与登记之间维持均衡投入。没有单项冲刺，但能减少后续失衡。' },
  industry: { name: '工务恢复', desc: '集中回收材料、修复设备并推进施工。设施成形更快；代价是劳动负荷与环境压力上升。' },
  science: { name: '科研攻关', desc: '优先整理档案、试验方法与学徒训练。更快获得新办法；代价是当前施工和能源余量承压。' },
  military: { name: '边境警戒', desc: '优先护运、巡查和应急防卫。道路更安全；代价是生产人手和共同体协作被挤占。' },
};

export interface SlotDef {
  name: string;
  stages: [string, string, string, string];
  effect: string;
}

export const PROJECT_DEFS: Record<string, SlotDef> = {
  water_life: { name: '河谷水网改造', stages: ['勘测', '接通西岸过滤渠', '扩建泵房', '投入运行'], effect: '提高民生保障每日恢复；降低净水故障风险' },
  seed_protein: { name: '种源圃与菌蛋白室', stages: ['整理种源', '建设培养间', '稳定产出', '投入运行'], effect: '提高民生保障与生态承载每日恢复' },
  workshop_calib: { name: '河谷工务所校准', stages: ['清点设备', '校准车间', '工具试制', '投入运行'], effect: '提高工业产能每日恢复；降低设备故障风险' },
  archive_beacon: { name: '档案校验与短波信标', stages: ['解封档案', '校验协议', '建立短波站', '投入运行'], effect: '提高行政承载与后勤效率每日恢复' },
};
export const PROJECT_ORDER = ['water_life', 'seed_protein', 'workshop_calib', 'archive_beacon'];

export const RESEARCH_DEFS: Record<string, SlotDef> = {
  membrane_reuse: { name: '净水膜复用工艺', stages: ['资料校验', '原型验证', '标准化', '已投入使用'], effect: '降低净水故障风险；水网工程更快' },
  field_methods: { name: '河谷田间恢复法', stages: ['资料校验', '小区试验', '规范化', '已投入使用'], effect: '降低酸雨土地损伤；种源工程更快' },
  maintenance_training: { name: '维护学徒制度', stages: ['资料校验', '带教试行', '工序标准化', '已投入使用'], effect: '工业与行政恢复更快；维修事故更少' },
};
export const RESEARCH_ORDER = ['membrane_reuse', 'field_methods', 'maintenance_training'];

/** 未提供的事件正文统一占位 */
export const EVENT_DETAIL_PLACEHOLDER = '现场详情将在画布内容优化阶段补充。';

export const TRANSITION_DAYS = 10;
export const TRANSITION_START = 0.65;
export const TRANSITION_STEP = 0.035;
export const HANDOVER_DAYS = 3;
export const HANDOVER_START = 0.70;
