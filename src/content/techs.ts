import type { Era, TechDef, TechLineId } from '../core/types';

export const TECHS: TechDef[] = [
  // ===== 第一幕 · 生存线(7) =====
  { id: 'stone', name: '石器打磨', desc: '解锁矿场', cost: 40, req: [], icon: '🪨', line: 'survival', era: 'colony' },
  { id: 'farm2', name: '耕作改良', desc: '农田产出 +50%', cost: 60, req: ['stone'], icon: '🌾', line: 'survival', era: 'colony' },
  { id: 'fridge', name: '冷藏技术', desc: '食物消耗 -15%', cost: 160, req: ['electric'], icon: '❄️', line: 'survival', era: 'colony' },
  { id: 'hydroponics', name: '水培农业', desc: '室内农场:农田免疫枯萎病', cost: 300, req: ['farm2'], icon: '💧', line: 'survival', era: 'colony' },
  { id: 'medicine', name: '医学入门', desc: '解锁医疗站', cost: 220, req: ['forge'], icon: '💊', line: 'survival', era: 'colony' },
  { id: 'med2', name: '高级医疗', desc: '医疗站治疗速度 +60%', cost: 420, req: ['medicine'], icon: '🩺', line: 'survival', era: 'colony' },
  { id: 'hazmat', name: '环境防护服', desc: '毒雾事件不再降低心情', cost: 350, req: ['medicine'], icon: '🥼', line: 'survival', era: 'colony' },

  // ===== 第一幕 · 工业线(5) =====
  { id: 'forge', name: '锻造冶炼', desc: '解锁厨房与车间', cost: 90, req: ['stone'], icon: '⚒️', line: 'industry', era: 'colony' },
  { id: 'electric', name: '电力时代', desc: '解锁太阳能板;车间/研究台等设施开始耗电', cost: 130, req: ['forge'], icon: '⚡', line: 'industry', era: 'colony' },
  { id: 'machining', name: '精密机械', desc: '车间速度 +50%、零件原料消耗 -20%', cost: 240, req: ['electric'], icon: '⚙️', line: 'industry', era: 'colony' },
  { id: 'advmat', name: '高级材料', desc: '伐木与采矿产出 +40%', cost: 450, req: ['machining'], icon: '🧪', line: 'industry', era: 'colony' },
  { id: 'assembly', name: '装配线', desc: '工厂自动化:车间无需工人值守', cost: 700, req: ['machining'], icon: '🏗️', line: 'industry', era: 'colony' },

  // ===== 第一幕 · 军事线(5) =====
  { id: 'rifle', name: '动能步枪', desc: '全员战斗 +2', cost: 80, req: ['stone'], icon: '🔫', line: 'military', era: 'colony' },
  { id: 'fortify', name: '防御工事', desc: '袭击损失 -30%', cost: 140, req: ['rifle'], icon: '🧱', line: 'military', era: 'colony' },
  { id: 'defense', name: '自动炮塔', desc: '解锁炮塔', cost: 260, req: ['electric'], icon: '🛡️', line: 'military', era: 'colony' },
  { id: 'armory', name: '军械所', desc: '军械所建筑:持续产出 5 点防御', cost: 380, req: ['fortify'], icon: '🔩', line: 'military', era: 'colony' },
  { id: 'bastion', name: '要塞化', desc: '袭击损失再 -30%,击退袭击心情 +3', cost: 600, req: ['armory'], icon: '🏰', line: 'military', era: 'colony' },

  // ===== 第一幕 · 无人化线(8) =====
  { id: 'robot', name: '机器人技术', desc: '机器人时代开启:殖民地迈向自动化', cost: 200, req: ['machining'], icon: '🤖', line: 'robot', era: 'colony' },
  { id: 'cleanbot', name: '清洁机器人', desc: '机器人负责打扫,全员舒适消耗 -30%', cost: 150, req: ['robot'], icon: '🧹', line: 'robot', era: 'colony' },
  { id: 'haulbot', name: '搬运机器人', desc: '搬运机器人接管物流,全员生产 +10%', cost: 250, req: ['robot'], icon: '📦', line: 'robot', era: 'colony' },
  { id: 'buildbot', name: '建造机器人', desc: '建造速度 +50%(自动建造更快)', cost: 400, req: ['haulbot'], icon: '🏗️', line: 'robot', era: 'colony' },
  { id: 'repairbot', name: '维修机器人', desc: '维护无人机巡航,建筑受损自动修复', cost: 450, req: ['buildbot'], icon: '🔧', line: 'robot', era: 'colony' },
  { id: 'medibot', name: '医疗机器人', desc: '医疗站无需医生值守(50% 效率自动治疗)', cost: 650, req: ['robot'], icon: '🩹', line: 'robot', era: 'colony' },
  { id: 'robohub', name: '机器人中枢', desc: '协调全部机器人,全员生产 +15%', cost: 700, req: ['buildbot'], icon: '🛰️', line: 'robot', era: 'colony' },
  { id: 'engdrone', name: '工程无人机', desc: '工程无人机群,全员生产 +10%、建造速度 +50%', cost: 1100, req: ['robohub'], icon: '🚁', line: 'robot', era: 'colony' },

  // ===== 第一幕 · 航天线(5) =====
  { id: 'astro', name: '基础航天学', desc: '研究 +10%', cost: 300, req: ['machining'], icon: '🔭', line: 'space', era: 'colony' },
  { id: 'beacon', name: '深空信标', desc: '监听深空信号,为星际时代做准备;研究 +5%', cost: 400, req: ['astro'], icon: '📡', line: 'space', era: 'colony' },
  { id: 'solidfuel', name: '固体燃料', desc: '推进剂预研:火箭发射材料需求 -10%', cost: 500, req: ['astro'], icon: '⛽', line: 'space', era: 'colony' },
  { id: 'rocketry', name: '火箭工程', desc: '解锁火箭发射台', cost: 900, req: ['advmat'], icon: '🚀', line: 'space', era: 'colony' },
  { id: 'propulsion', name: '太空推进', desc: '允许发射火箭,离开这颗星球', cost: 1600, req: ['rocketry'], icon: '🌌', line: 'space', era: 'colony' },

  // ===== 第二幕 · 轨道线(4) =====
  { id: 'orbitmap', name: '轨道测绘', desc: '绘制母星系完整星图,揭示资源分布', cost: 500, req: [], icon: '🗺️', line: 'orbit', era: 'solar' },
  { id: 'deepscan', name: '深空扫描', desc: '揭示隐藏的小行星带,采矿站 +1 上限', cost: 900, req: ['orbitmap'], icon: '📡', line: 'orbit', era: 'solar' },
  { id: 'orbitfactory', name: '轨道工厂', desc: '合金产量 +50%', cost: 1500, req: ['alloy'], icon: '🏭', line: 'orbit', era: 'solar' },
  { id: 'elevator', name: '太空电梯', desc: '地面↔轨道物流贯通,第二幕生产 +20%', cost: 2500, req: ['orbitfactory'], icon: '🛗', line: 'orbit', era: 'solar' },

  // ===== 第二幕 · 资源线(6) =====
  { id: 'asteroid', name: '小行星采矿', desc: '解锁采矿站:在小行星带产出合金', cost: 600, req: [], icon: '☄️', line: 'resource', era: 'solar' },
  { id: 'alloy', name: '合金熔炼', desc: '采矿站合金产量 +50%', cost: 1200, req: ['asteroid'], icon: '🧱', line: 'resource', era: 'solar' },
  { id: 'moonbase', name: '月面基地', desc: '采矿站 +1 上限,全员舒适 +5', cost: 1000, req: ['asteroid'], icon: '🌙', line: 'resource', era: 'solar' },
  { id: 'gas', name: '气体采集', desc: '解锁燃料精炼站:在气态巨行星产出燃料', cost: 1500, req: ['moonbase'], icon: '🫧', line: 'resource', era: 'solar' },
  { id: 'fuelref', name: '燃料精炼', desc: '燃料产量 +50%', cost: 1800, req: ['gas'], icon: '⛽', line: 'resource', era: 'solar' },
  { id: 'deepbelt', name: '深空矿带', desc: '采矿站合金产量 +50%', cost: 3000, req: ['gas'], icon: '🪨', line: 'resource', era: 'solar' },

  // ===== 第二幕 · 自动化线(5) =====
  { id: 'logistics', name: '物流网络', desc: '第二幕生产 +10%', cost: 800, req: ['asteroid'], icon: '🚚', line: 'automation', era: 'solar' },
  { id: 'hub', name: '中央物流枢纽', desc: '第二幕生产 +15%', cost: 1400, req: ['logistics'], icon: '🏗️', line: 'automation', era: 'solar' },
  { id: 'dronenet', name: '无人机运输网', desc: '生产 +10%,自动建造轨道设施', cost: 2000, req: ['hub'], icon: '🛸', line: 'automation', era: 'solar' },
  { id: 'factorychain', name: '自动化工厂链', desc: '第二幕生产 +20%', cost: 2800, req: ['dronenet'], icon: '⚙️', line: 'automation', era: 'solar' },
  { id: 'aihub', name: 'AI 调度中枢', desc: 'AI 自动调度:自动扩张、贸易、探险', cost: 4000, req: ['factorychain'], icon: '🧠', line: 'automation', era: 'solar' },

  // ===== 第二幕 · 能源线(4) =====
  { id: 'solararray', name: '太阳能阵列', desc: '轨道电力 +4', cost: 700, req: ['asteroid'], icon: '☀️', line: 'energy', era: 'solar' },
  { id: 'fission', name: '裂变反应堆', desc: '轨道电力 +8', cost: 1600, req: ['solararray'], icon: '⚛️', line: 'energy', era: 'solar' },
  { id: 'fusion', name: '聚变堆', desc: '轨道电力 +16', cost: 3200, req: ['fission'], icon: '☢️', line: 'energy', era: 'solar' },
  { id: 'antimatter', name: '反物质发生器', desc: '轨道电力 +32,第二幕生产 +25%', cost: 5000, req: ['fusion'], icon: '✨', line: 'energy', era: 'solar' },

  // ===== 第二幕 · 舰队线(5) =====
  { id: 'hull', name: '舰体工程', desc: '解锁造船厂', cost: 600, req: ['asteroid'], icon: '⚓', line: 'fleet', era: 'solar' },
  { id: 'corvette', name: '护卫舰', desc: '解锁护卫舰(军力 10)', cost: 1200, req: ['hull'], icon: '🚤', line: 'fleet', era: 'solar' },
  { id: 'destroyer', name: '驱逐舰', desc: '解锁驱逐舰(军力 25)', cost: 2400, req: ['corvette'], icon: '🚢', line: 'fleet', era: 'solar' },
  { id: 'fleetlogi', name: '舰队后勤', desc: '舰队总军力 +20%', cost: 3000, req: ['destroyer'], icon: '📦', line: 'fleet', era: 'solar' },
  { id: 'cruiser', name: '巡洋舰', desc: '解锁巡洋舰(军力 60)', cost: 4000, req: ['destroyer'], icon: '🛳️', line: 'fleet', era: 'solar' },
  { id: 'hyperdrive', name: '超空间引擎', desc: '跳跃引擎:解锁跃迁,驶入银河时代(第三幕)', cost: 8000, req: ['cruiser', 'antimatter', 'aihub'], icon: '🌌', line: 'fleet', era: 'solar' },

  // ===== 第三幕 · 物理线(4) =====
  { id: 'iondrive', name: '离子推进', desc: '舰队总军力 +10%', cost: 2000, req: [], icon: '🛰️', line: 'physics', era: 'galaxy' },
  { id: 'plasma', name: '等离子武器', desc: '舰队总军力 +20%', cost: 4000, req: ['iondrive'], icon: '🔫', line: 'physics', era: 'galaxy' },
  { id: 'shieldtech', name: '护盾技术', desc: '舰队总军力 +20%', cost: 6000, req: ['plasma'], icon: '🛡️', line: 'physics', era: 'galaxy' },
  { id: 'antimatter_weapon', name: '反物质武器', desc: '舰队总军力 +30%', cost: 10000, req: ['shieldtech'], icon: '💥', line: 'physics', era: 'galaxy' },

  // ===== 第三幕 · 社会线(4) =====
  { id: 'governance', name: '银河治理', desc: '可占领星系上限 +2', cost: 2000, req: [], icon: '🏛️', line: 'society', era: 'galaxy' },
  { id: 'sector', name: '星域管理', desc: '可占领星系上限 +3', cost: 4000, req: ['governance'], icon: '🗂️', line: 'society', era: 'galaxy' },
  { id: 'diplomacy', name: '银河外交', desc: '占领星系成本 -20%', cost: 6000, req: ['sector'], icon: '🤝', line: 'society', era: 'galaxy' },
  { id: 'empire', name: '银河大统合联邦', desc: '可协调星系上限 +5', cost: 10000, req: ['diplomacy'], icon: '🏛️', line: 'society', era: 'galaxy' },

  // ===== 第三幕 · 工程线(5) =====
  { id: 'battleship', name: '战列舰', desc: '解锁战列舰(军力 150)', cost: 3000, req: [], icon: '🚢', line: 'engineering', era: 'galaxy' },
  { id: 'titan', name: '泰坦', desc: '解锁泰坦(军力 400)', cost: 8000, req: ['battleship'], icon: '🗼', line: 'engineering', era: 'galaxy' },
  { id: 'colossus', name: '巨像', desc: '解锁巨像(军力 1000)', cost: 15000, req: ['titan'], icon: '🌋', line: 'engineering', era: 'galaxy' },
  { id: 'dyson', name: '戴森球', desc: '巨构:合金产量 +100%', cost: 20000, req: ['titan'], icon: '🌞', line: 'engineering', era: 'galaxy' },
  { id: 'ringworld', name: '环世界', desc: '巨构:所有产出 +50%', cost: 30000, req: ['dyson'], icon: '💍', line: 'engineering', era: 'galaxy' },
];

export const TECH_MAP: Record<string, TechDef> = Object.fromEntries(TECHS.map(t => [t.id, t]));

export const LINE_META: Record<TechLineId, { name: string; icon: string }> = {
  survival: { name: '生存', icon: '🌿' },
  industry: { name: '工业', icon: '🏭' },
  military: { name: '军事', icon: '⚔️' },
  robot: { name: '无人化', icon: '🤖' },
  space: { name: '航天', icon: '🚀' },
  orbit: { name: '轨道', icon: '🛰️' },
  resource: { name: '资源', icon: '⛏️' },
  automation: { name: '自动化', icon: '🤖' },
  energy: { name: '能源', icon: '⚡' },
  fleet: { name: '舰队', icon: '🚀' },
  physics: { name: '物理', icon: '🔭' },
  society: { name: '社会', icon: '🏛️' },
  engineering: { name: '工程', icon: '⚙️' },
};

export function techDone(state: { research: { done: string[] } }, id: string): boolean {
  return state.research.done.includes(id);
}

/** 所有可用(前置已满足、当前时代及更早、未完成)的科技 */
export function availableTechs(state: { research: { done: string[] }; era: Era }): TechDef[] {
  const eraRank: Record<Era, number> = { colony: 0, solar: 1, galaxy: 2 };
  const eraOk = (t: TechDef) => eraRank[t.era] <= eraRank[state.era];
  return TECHS.filter(t => !state.research.done.includes(t.id)
    && t.req.every(r => state.research.done.includes(r))
    && eraOk(t));
}

/** 建造速度加成(机器人科技): 自动建造间隔缩短 */
export function buildSpeedMult(state: { research: { done: string[] } }): number {
  const d = state.research.done;
  let m = 1;
  if (d.includes('buildbot')) m += 0.5;
  if (d.includes('engdrone')) m += 0.5;
  return m;
}
