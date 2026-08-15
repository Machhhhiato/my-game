import type { BuildingTypeId, ResourceId, SkillId } from '../core/types';

export interface BuildingDef {
  type: BuildingTypeId;
  name: string;
  desc: string;
  icon: string;
  cost: Partial<Record<ResourceId, number>>;
  w: number;
  h: number;
  /** 需要科技 */
  tech?: string;
  /** 电力需求 */
  power?: number;
  /** 发电量 */
  powerOut?: number;
  /** 防御值 */
  defense?: number;
  /** 需要工人驻守的生产 */
  produce?: {
    resource: ResourceId;
    rate: number; // 每秒产出(基础值)
    skill: SkillId;
    /** 每秒消耗的原料 */
    consume?: Partial<Record<ResourceId, number>>;
  };
  /** 治疗速度(医疗站) */
  healRate?: number;
  /** 研究速度(研究台) */
  researchRate?: number;
}

export const BUILDINGS: Record<BuildingTypeId, BuildingDef> = {
  shelter: {
    type: 'shelter', name: '避难所', icon: '🏠',
    desc: '提供床铺,殖民者在此睡觉休息。',
    cost: { wood: 60 }, w: 3, h: 2,
  },
  farm: {
    type: 'farm', name: '农田', icon: '🌾',
    desc: '需要种植技能,产出食物。',
    cost: { wood: 20 }, w: 3, h: 2,
    produce: { resource: 'food', rate: 0.65, skill: 'farm' },
  },
  woodcutter: {
    type: 'woodcutter', name: '伐木场', icon: '🪓',
    desc: '砍伐树木,产出木材。',
    cost: { wood: 25 }, w: 2, h: 2,
    produce: { resource: 'wood', rate: 0.9, skill: 'farm' },
  },
  mine: {
    type: 'mine', name: '矿场', icon: '⛏️',
    desc: '开采矿脉,产出钢铁。',
    cost: { wood: 50 }, w: 2, h: 2, tech: 'stone',
    produce: { resource: 'steel', rate: 0.45, skill: 'mine' },
  },
  kitchen: {
    type: 'kitchen', name: '厨房', icon: '🍲',
    desc: '集中烹饪,食物产出效率高于野炊。',
    cost: { wood: 60, steel: 10 }, w: 2, h: 2, tech: 'forge',
    produce: { resource: 'food', rate: 0.6, skill: 'cook' },
  },
  workshop: {
    type: 'workshop', name: '车间', icon: '⚙️',
    desc: '消耗木材与钢铁制造零件(需要电力)。',
    cost: { wood: 80, steel: 30 }, w: 3, h: 2, tech: 'forge', power: 1,
    produce: {
      resource: 'components', rate: 0.018, skill: 'craft',
      consume: { wood: 0.1, steel: 0.05 },
    },
  },
  research: {
    type: 'research', name: '研究台', icon: '🔬',
    desc: '殖民者在此研究科技,产出研究点(需要电力)。',
    cost: { wood: 80, steel: 20 }, w: 2, h: 2, power: 1,
    researchRate: 1,
  },
  solar: {
    type: 'solar', name: '太阳能板', icon: '☀️',
    desc: '提供 2 点电力,支撑电力设施运转。',
    cost: { steel: 40, components: 2 }, w: 2, h: 1, tech: 'electric',
    powerOut: 2,
  },
  turret: {
    type: 'turret', name: '自动炮塔', icon: '🛡️',
    desc: '提供 3 点防御,抵御袭击(需要电力)。',
    cost: { steel: 60, components: 5 }, w: 1, h: 1, tech: 'defense', power: 1,
    defense: 3,
  },
  medbay: {
    type: 'medbay', name: '医疗站', icon: '💊',
    desc: '治疗受伤的殖民者(需要电力)。',
    cost: { steel: 50, components: 4 }, w: 2, h: 2, tech: 'medicine', power: 1,
    healRate: 1.5,
  },
  armory: {
    type: 'armory', name: '军械所', icon: '🔫',
    desc: '持续产出 5 点防御值(需要电力)。',
    cost: { steel: 80, components: 8 }, w: 2, h: 2, tech: 'armory', power: 1,
    defense: 5,
  },
  launchpad: {
    type: 'launchpad', name: '火箭发射台', icon: '🚀',
    desc: '殖民者离开摇篮、飞向星辰的第一步。',
    cost: { steel: 150, components: 30 }, w: 4, h: 3, tech: 'rocketry', power: 1,
  },
};

export const BUILD_ORDER: BuildingTypeId[] = [
  'shelter', 'farm', 'woodcutter', 'mine', 'kitchen',
  'workshop', 'research', 'solar', 'turret', 'medbay', 'armory', 'launchpad',
];
