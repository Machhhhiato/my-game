// ============ P1-S03A 首局玩家语言映射（内部 ID 保留，仅替换玩家可见文本） ============
import type { CapacityId, DebtId, DirectionId, ResourceId } from './types';

export const RESOURCE_PLAYER: Record<ResourceId, string> = {
  safeWater: '可饮用水',
  calories: '食物储备',
  bioLandCapital: '耕地与种源',
  reclaimedMaterial: '可用材料',
  precisionParts: '关键备件',
  effectiveLabor: '可投入人手',
  publicCredit: '协作信任',
};

/**
 * 首局的生活底线使用独立的日需求口径；资源账中的 income/demand 仍是
 * 计划期收支，不能拿来直接除库存，否则会把两个月的存量误读成数百天。
 */
export const DAILY_LIVING_NEED = {
  water: 2,
  food: 2,
} as const;

export const DEBT_PLAYER: Record<DebtId, string> = {
  maintenance: '维修积压',
  ecology: '土地损伤',
  housing: '拥挤与安置不足',
  trust: '公平争议',
  military: '警戒负荷',
  integration: '调度阻塞',
};

export const CAPACITY_PLAYER: Record<CapacityId, string> = {
  materialBase: '物质基础',
  knowledgeBase: '知识储备',
  coerciveCapacity: '警戒能力',
  integrationCapacity: '调度能力',
  socialCapacity: '照护能力',
  logisticsResilience: '后勤韧性',
};

export interface DirectionPlayer { name: string; desc: string; disabled?: boolean; disabledReason?: string }

export const DIRECTION_PLAYER: Record<DirectionId, DirectionPlayer> = {
  survival: { name: '供水与食物', desc: '先让所有人有水喝、有饭吃。' },
  balanced: { name: '定居与照护', desc: '少冒险，优先安顿、卫生与日常秩序。' },
  science: { name: '学徒与资料', desc: '暂时少一部分人手，换来更会修、更会判断的人。' },
  industry: { name: '工务与材料', desc: '多回收、多维修，为下一座设施打基础。' },
  military: { name: '护运与警戒', desc: '保护水网、道路和夜间营地，但会占用人手。' },
  space: { name: '远期筹备（不可执行）', desc: '当前年代没有条件；按钮禁用并解释原因。', disabled: true, disabledReason: '当前年代没有轨道与航天条件。' },
};

/** 维修积压 → 玩家可读档位与最先受影响设施 */
export function repairBacklogLevel(v: number): { label: string; facility: string } {
  const facility = '第 07 号净水泵组';
  if (v < 30) return { label: '低', facility };
  if (v < 60) return { label: '注意', facility };
  return { label: '高', facility };
}
