import type { DirectionDef, DirectionId } from '../core/types';

export const DIRECTIONS: Record<DirectionId, DirectionDef> = {
  survival: {
    id: 'survival', name: '生存优先', icon: '🌿',
    desc: '食物与健康至上:多种地、多做饭,囤粮避险。',
    jobMult: { farm: 1.8, kitchen: 1.8, woodcutter: 1.3, research: 0.6 },
    techPref: { survival: 3 },
    buildQueue: ['farm', 'kitchen', 'shelter', 'woodcutter', 'medbay', 'armory'],
    stance: 'hide',
    stockTargets: { food: 600 },
  },
  balanced: {
    id: 'balanced', name: '均衡发展', icon: '⚖️',
    desc: '按缺口自动调配,全面稳步推进。',
    jobMult: {},
    techPref: { survival: 1, industry: 1, military: 1, robot: 1, space: 1 },
    buildQueue: ['farm', 'woodcutter', 'mine', 'kitchen', 'workshop', 'solar', 'research', 'turret', 'medbay', 'armory', 'launchpad'],
    stance: 'defend',
  },
  science: {
    id: 'science', name: '科技跃进', icon: '🔬',
    desc: '全力研究:研究台优先,快速点亮科技树。',
    jobMult: { research: 2.4, farm: 0.9 },
    techPref: { industry: 1.5, robot: 1.5, space: 1.5 },
    buildQueue: ['research', 'solar', 'workshop', 'farm', 'woodcutter'],
    stance: 'defend',
  },
  industry: {
    id: 'industry', name: '工业扩张', icon: '🏭',
    desc: '矿场与车间优先,囤积钢铁与零件。',
    jobMult: { mine: 1.8, woodcutter: 1.5, workshop: 1.8, farm: 0.8 },
    techPref: { industry: 3 },
    buildQueue: ['mine', 'woodcutter', 'workshop', 'solar', 'farm', 'kitchen'],
    stance: 'defend',
    stockTargets: { steel: 600, components: 100 },
  },
  military: {
    id: 'military', name: '军事备战', icon: '⚔️',
    desc: '筑炮塔、练士兵:主动迎击掠夺者。',
    jobMult: { mine: 1.4, workshop: 1.4, farm: 0.9 },
    techPref: { military: 3 },
    buildQueue: ['turret', 'armory', 'mine', 'workshop', 'solar', 'farm'],
    stance: 'fight',
    stockTargets: { steel: 500 },
  },
  space: {
    id: 'space', name: '航天冲刺', icon: '🚀',
    desc: '一切为了火箭:研究、零件与钢铁全力冲刺。',
    jobMult: { research: 1.8, workshop: 1.8, mine: 1.3, farm: 0.8 },
    techPref: { space: 4, robot: 1.2, industry: 1.2 },
    buildQueue: ['launchpad', 'research', 'workshop', 'solar', 'mine', 'farm', 'armory'],
    stance: 'defend',
    stockTargets: { components: 80, steel: 500 },
  },
};

export function directionDef(s: { direction: DirectionId }): DirectionDef {
  return DIRECTIONS[s.direction] ?? DIRECTIONS.balanced;
}
