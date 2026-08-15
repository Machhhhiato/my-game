import type { Colonist, Skills, TraitDef, TraitId } from '../core/types';

export const TRAITS: Record<TraitId, TraitDef> = {
  industrious: { id: 'industrious', name: '勤勉', desc: '工作速度 +15%' },
  smart: { id: 'smart', name: '聪慧', desc: '研究速度 +30%' },
  tough: { id: 'tough', name: '坚韧', desc: '生命上限 +30,心情 +6' },
  lazy: { id: 'lazy', name: '懒惰', desc: '工作速度 -20%,娱乐消耗更快' },
  glutton: { id: 'glutton', name: '贪吃', desc: '食物消耗 +30%' },
  brave: { id: 'brave', name: '勇敢', desc: '战斗 +2' },
  optimist: { id: 'optimist', name: '乐观', desc: '心情 +12' },
  sickly: { id: 'sickly', name: '体弱', desc: '生命上限 -30,舒适消耗更快' },
};

const NAMES = [
  '张远', '李霜', '王拓', '陈曦', '赵岩', '孙淼', '周瀚', '吴桐',
  '郑航', '冯雪', '蒋晨', '沈星', '韩岚', '杨帆', '许薇', '顾霆',
  '宋毅', '林柯', '秦朗', '江漓',
];

const SKILL_IDS: (keyof Skills)[] = ['build', 'mine', 'farm', 'craft', 'cook', 'research', 'combat', 'medic'];

let nameIdx = 0;
function pickName(): string {
  const n = NAMES[nameIdx % NAMES.length];
  nameIdx++;
  return n;
}

function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function makeColonist(seq: number, id?: string): Colonist {
  const skills = {} as Skills;
  for (const k of SKILL_IDS) skills[k] = Math.round(rnd(1, 5));
  // 保证开局三人中至少有一个会种植、一个会研究
  if (seq === 1) { skills.farm = Math.max(skills.farm, 5); skills.cook = Math.max(skills.cook, 3); }
  if (seq === 2) { skills.research = Math.max(skills.research, 5); skills.craft = Math.max(skills.craft, 3); }
  if (seq === 3) { skills.mine = Math.max(skills.mine, 5); skills.combat = Math.max(skills.combat, 3); }

  const traitIds = Object.keys(TRAITS) as TraitId[];
  const traits: TraitId[] = [];
  const t1 = traitIds[Math.floor(Math.random() * traitIds.length)];
  traits.push(t1);
  if (Math.random() < 0.5) {
    let t2 = traitIds[Math.floor(Math.random() * traitIds.length)];
    if (t2 === t1) t2 = traitIds[(traitIds.indexOf(t1) + 1) % traitIds.length];
    traits.push(t2);
  }

  return {
    id: id ?? `c${Date.now()}_${seq}_${Math.floor(Math.random() * 1e6)}`,
    name: pickName(),
    traits,
    skills,
    needs: { food: 85, rest: 90, recreation: 80, comfort: 80 },
    mood: 65,
    hp: 100,
    state: 'idle',
    x: 3 + Math.random() * 2, y: 6 + Math.random() * 2,
    px: 3, py: 6,
    target: null,
    job: null,
    until: 0,
    breakCd: 0,
    seq,
  };
}

export function maxHp(c: Colonist): number {
  return c.traits.includes('tough') ? 130 : c.traits.includes('sickly') ? 70 : 100;
}

export function traitDescList(c: Colonist): string {
  return c.traits.map(t => TRAITS[t]?.name ?? t).join(' · ');
}
