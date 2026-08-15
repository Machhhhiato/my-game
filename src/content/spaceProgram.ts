import type { MissionDef, MissionId } from '../core/types';

// 太空计划任务线 —— 参考真实航天史:
// 探空火箭(戈达德/V-2) → 卫星(斯普特尼克1号) → 生命舱(莱卡) → 载人(东方1号/水星)
// → 舱外活动(双子座4号) → 交会对接(双子座8号) → 空间站(礼炮号/国际空间站)
// → 轨道船坞(和平号经验) → 飞船分段组装(阿耳忒弥斯/星舰风格)
// 文案采用任务简报风格:任务代号 + 目标 + 参考 + 风险提示
export const MISSIONS: MissionDef[] = [
  // ===== 探空火箭阶段: 积累可靠性 =====
  {
    id: 'sounding1', name: '探空火箭 · 首飞', icon: '🎈',
    desc: '任务「萤火-1」:一枚 6 米高的探空火箭,目标是冲出 30 公里高空。参考:戈达德第一枚液体火箭与 V-2 早期试验。风险:发动机熄火、箭体解体。',
    req: [], techReq: ['rocketry'],
    cost: { wood: 60, steel: 40 },
    baseChance: 0.60,
    reward: '开启太空计划,积累可靠性',
    logGood: '点火——火箭拖着细长的尾焰拔地而起,一路爬升到平流层边缘才缓缓坠落。虽然只飞了 30 公里,但这颗星球从此有了火箭。',
  },
  {
    id: 'sounding2', name: '探空火箭 · 高空测量', icon: '📈',
    desc: '任务「萤火-2」:携带大气探针,测量 50 公里以上高空的气压、温度与风场,为轨道计算积累数据。参考:早期探空火箭测量计划。风险:探针回收失败。',
    req: ['sounding1'],
    cost: { wood: 50, steel: 50 },
    baseChance: 0.65,
    reward: '可靠性提升,解锁卫星任务',
    logGood: '探针传回了完整的高空大气剖面数据。工程师们盯着曲线图彻夜未眠——轨道飞行的蓝图,就藏在这些数字里。',
  },
  {
    id: 'sounding3', name: '探空火箭 · 再入试验', icon: '🔥',
    desc: '任务「萤火-3」:验证返回舱再入大气层技术——隔热罩要扛住 2000°C 高温,降落伞要在 5 公里高度准时展开。参考:再入返回试验。风险:烧蚀不足、开伞失败。',
    req: ['sounding2'],
    cost: { wood: 40, steel: 70, components: 5 },
    baseChance: 0.70,
    reward: '再入技术验证,解锁轨道任务',
    logGood: '返回舱拖着火舌坠入大气层,隔热罩烧得黢黑,却护住了舱内的全部仪器。降落伞在预定高度绽放,舱体平稳落海。',
  },
  // ===== 轨道任务阶段 =====
  {
    id: 'satellite', name: '卫星-1 · 首颗轨道卫星', icon: '🛰️',
    desc: '任务「天穹-1」:将 80 公斤级卫星送入 400 公里近地轨道,验证入轨精度与在轨通信。参考:斯普特尼克1号(1957)。风险:整流罩分离失败、入轨偏差。',
    req: ['sounding3'], techReq: ['rocketry'], needLaunchpad: true,
    cost: { steel: 120, components: 15 },
    baseChance: 0.60,
    reward: '研究速度 +5%',
    logGood: '倒计时归零,火箭撕开云层。T+530 秒,遥测确认卫星入轨,轨道倾角误差仅 0.03°。当晚,整个殖民地都听见了那颗星划过天空的声音。',
  },
  {
    id: 'lifeorbit', name: '生命舱 · 轨道生存试验', icon: '🐕',
    desc: '任务「摇篮-1」:把携带生物样本的生命维持舱送入轨道,验证供氧、温控与废物循环能否支撑生命。参考:莱卡与黑猩猩任务。风险:生命维持系统失效。',
    req: ['satellite'], needLaunchpad: true,
    cost: { steel: 150, components: 20, food: 30 },
    baseChance: 0.65,
    reward: '殖民者食物消耗 -5%',
    logGood: '生命舱在轨道上运行了四天,舱内生物进食、休眠、一切正常。回收后的体检报告只有一句话:「可以送人上去了。」',
  },
  {
    id: 'crewed1', name: '水星-1 · 首次载人轨道飞行', icon: '🧑‍🚀',
    desc: '任务「水星-1」:第一名殖民者乘坐单人飞船绕轨一圈。参考:东方1号/水星计划(1961)。风险:生命维持、再入过载——这是太空计划最危险的一步。',
    req: ['lifeorbit'], techReq: ['fridge'], needLaunchpad: true,
    cost: { steel: 200, components: 30, food: 50 },
    baseChance: 0.55,
    reward: '开启载人航天时代',
    logGood: '「报告地面,我看到整颗星球了——它是蓝色的。」宇航员在轨道上的一句话,让控制中心安静了三秒,然后掌声雷动。',
  },
  {
    id: 'eva', name: '双子座-4 · 首次舱外活动', icon: '🌌',
    desc: '任务「双子座-4」:宇航员身穿舱外服走出舱门,在真空中完成设备检查。参考:列昂诺夫太空行走(1965)。风险:舱外服失压、供氧中断。',
    req: ['crewed1'], techReq: ['hazmat'], needLaunchpad: true,
    cost: { steel: 180, components: 25 },
    baseChance: 0.50,
    reward: '解锁空间站组装能力',
    logGood: '舱门开启的瞬间,宇航员漂浮在无垠的黑暗中,下方是缓缓转动的大地。十二分钟的太空行走,为轨道施工撕开了第一道口子。',
  },
  {
    id: 'docking', name: '双子座-8 · 轨道交会对接', icon: '🔗',
    desc: '任务「双子座-8」:两艘飞船以每秒 7.8 公里的速度在轨道上追及、捕获、对接。参考:双子座8号首次对接(1966)。风险:对接速度失控——史上最危险的机动之一。',
    req: ['eva'], techReq: ['beacon'], needLaunchpad: true,
    cost: { steel: 200, components: 30 },
    baseChance: 0.45,
    reward: '解锁轨道组装',
    logGood: '雷达锁定、相对速度归零、对接环咬合——「喀嗒」一声,两艘飞船在深空中连为一体。轨道组装的时代开始了。',
  },
  // ===== 空间站组装阶段: 多次发射 =====
  {
    id: 'stationCore', name: '空间站 · 核心舱', icon: '🧩',
    desc: '任务「天宫-1」:发射空间站核心舱——能源、推进、对接枢纽,整个轨道设施的心脏。参考:礼炮号与 ISS 曙光号功能货舱。风险:太阳翼展开失败。',
    req: ['docking'], needLaunchpad: true,
    cost: { steel: 220, components: 30 },
    baseChance: 0.70,
    reward: '空间站开工(1/4)',
    logGood: '核心舱入轨,两侧太阳能帆板如翅膀般展开,姿态稳定。轨道上的新家园,有了第一块基石。',
  },
  {
    id: 'stationLab', name: '空间站 · 实验舱', icon: '🔬',
    desc: '任务「天宫-2」:对接实验舱——微重力实验室、材料炉与天文观测窗。参考:ISS 命运号实验舱。风险:对接接口对位偏差。',
    req: ['stationCore'], needLaunchpad: true,
    cost: { steel: 240, components: 35 },
    baseChance: 0.72,
    reward: '研究速度 +10%(2/4)',
    logGood: '实验舱与核心舱对接成功,舱内指示灯逐一亮起。第一批微重力晶体在轨道上生长——地面无法复制的实验,从这里开始。',
  },
  {
    id: 'stationHab', name: '空间站 · 居住舱', icon: '🛏️',
    desc: '任务「天宫-3」:对接居住舱——睡眠舱、厨房与运动区,让长期驻留成为可能。参考:ISS 和谐号节点舱。风险:生命维持管路接驳泄漏。',
    req: ['stationLab'], needLaunchpad: true,
    cost: { steel: 250, components: 35 },
    baseChance: 0.75,
    reward: '殖民者心情 +5(3/4)',
    logGood: '居住舱接驳完成,生命维持系统全线贯通。第一批驻留队员飘进舱内,把睡袋绑在了天花板上——谁说睡觉不能飘着。',
  },
  {
    id: 'stationPower', name: '空间站 · 能源桁架', icon: '☀️',
    desc: '任务「天宫-4」:安装 30 米长的太阳能桁架,四片太阳翼总功率 120 千瓦,为全站供电。参考:ISS 桁架结构。风险:桁架展开机构卡死。',
    req: ['stationHab'], needLaunchpad: true,
    cost: { steel: 260, components: 40 },
    baseChance: 0.78,
    reward: '电力供给 +2,空间站完工(4/4)',
    logGood: '桁架缓缓展开,四片太阳能翼在阳光下展开到最大角度,功率读数一路上涨。轨道上的家,正式点亮了所有的灯。',
  },
  // ===== 轨道船坞与飞船组装 =====
  {
    id: 'dockyard', name: '轨道船坞 · 组装平台', icon: '🏗️',
    desc: '任务「船坞-1」:在空间站旁建造干船坞——机械臂、组装桁架与燃料加注站,专为飞船总装而生。参考:和平号空间站的扩建经验。风险:大型构件对接振动。',
    req: ['stationPower'], needLaunchpad: true,
    cost: { steel: 400, components: 60 },
    baseChance: 0.70,
    reward: '解锁飞船组装,飞船模块成功率 +10%',
    logGood: '船坞完工,十八米长的机械臂通过自检,在轨道上划出第一道弧线。这里,将诞生第一艘星际飞船。',
  },
  {
    id: 'spaceElevator', name: '太空电梯 · 天梯', icon: '🛗',
    desc: '任务「天梯-1」:建造从地面直通轨道站的太空电梯,打通地面↔轨道物流,货物不再需要火箭。参考:太空电梯设想。风险:缆绳张力失衡。',
    req: ['dockyard'], needLaunchpad: true,
    cost: { steel: 500, components: 80 },
    baseChance: 0.75,
    reward: '太空电梯建成,进入第二幕的基建门槛之一',
    logGood: '天梯建成!一列列货舱沿着碳纳米管轨道直上云霄,地面与轨道从此连为一体。',
  },
  {
    id: 'shipDrive', name: '科研船 · 推进段', icon: '🔬',
    desc: '任务「远航-1」:组装科研船与工程船的推进系统——核热推进,比冲是化学火箭的 3 倍。参考:核热推进(NERVA)预研。风险:发动机舱吊装偏差。',
    req: ['spaceElevator'], techReq: ['propulsion'], needLaunchpad: true,
    cost: { steel: 300, components: 50 },
    baseChance: 0.75,
    reward: '科研船/工程船组装(1/4)',
    logGood: '推进段在机械臂的引导下就位,四台发动机完成测试点火,淡蓝色的尾焰照亮了整座船坞。',
  },
  {
    id: 'shipFuel', name: '飞船 · 燃料段', icon: '⛽',
    desc: '任务「远航-2」:安装低温燃料贮箱,加注液氢推进剂——飞船将携带足以跨越半个恒星系的燃料。参考:大型低温贮箱技术。风险:加注管路泄漏。',
    req: ['shipDrive'], needLaunchpad: true,
    cost: { steel: 300, components: 45 },
    baseChance: 0.78,
    reward: '飞船组装(2/4)',
    logGood: '燃料段对接完成,加注程序启动。液氢在贮箱中泛起冷雾,巨大的箱体在阳光下像一柄银色的剑。',
  },
  {
    id: 'shipCrew', name: '飞船 · 居住段', icon: '🛋️',
    desc: '任务「远航-3」:安装船员生活舱——水培区、睡眠舱、医疗角与健身房,支持 6 名船员长期航行。参考:长期载人任务的闭环生态。风险:水循环系统故障。',
    req: ['shipFuel'], needLaunchpad: true,
    cost: { steel: 320, components: 55, food: 100 },
    baseChance: 0.72,
    reward: '飞船组装(3/4)',
    logGood: '居住段完工,水培区的第一茬生菜发了芽。未来的船员们将在星光下吃饭、锻炼、写航行日志。',
  },
  {
    id: 'shipCommand', name: '飞船 · 指挥段', icon: '🎛️',
    desc: '任务「远航-4」:安装舰桥——导航计算机、深空通信阵列与全舰控制中枢。参考:任务控制与深空通信体系。风险:导航系统自检异常。',
    req: ['shipCrew'], needLaunchpad: true,
    cost: { steel: 350, components: 70 },
    baseChance: 0.75,
    reward: '飞船组装完成(4/4),可以启航!',
    logGood: '指挥段就位,主屏幕亮起星图,数千个系统逐一自检通过。飞船有了大脑,只等一声令下——目的地:母星系。',
  },
];

export const MISSION_MAP: Record<string, MissionDef> = Object.fromEntries(MISSIONS.map(m => [m.id, m]));

/** 空间站舱段 */
export const STATION_MODULES: MissionId[] = ['stationCore', 'stationLab', 'stationHab', 'stationPower'];
/** 飞船模块 */
export const SHIP_MODULES: MissionId[] = ['shipDrive', 'shipFuel', 'shipCrew', 'shipCommand'];

export function stationProgress(space: { done: MissionId[] }): number {
  return STATION_MODULES.filter(m => space.done.includes(m)).length;
}

export function shipProgress(space: { done: MissionId[] }): number {
  return SHIP_MODULES.filter(m => space.done.includes(m)).length;
}

/** 进入第二幕三门槛: 政治(统一全球) + 科研基建(空间站+船坞+太空电梯) + 星舰(科研船/工程船) */
export function canDepart(space: { done: MissionId[] }, world: { unified: boolean }): boolean {
  if (!world.unified) return false;                                   // 政治门槛
  if (!STATION_MODULES.every(m => space.done.includes(m))) return false; // 空间站 4 舱段
  if (!space.done.includes('dockyard')) return false;                 // 舰船生产能力
  if (!space.done.includes('spaceElevator')) return false;            // 太空电梯
  if (!SHIP_MODULES.every(m => space.done.includes(m))) return false; // 科研船 + 工程船
  return true;
}

/** 进入第二幕缺失门槛(用于提示) */
export function departMissing(space: { done: MissionId[] }, world: { unified: boolean }): string[] {
  const missing: string[] = [];
  if (!world.unified) missing.push('统一全球(政治)');
  if (!STATION_MODULES.every(m => space.done.includes(m))) missing.push('空间站 4 舱段');
  if (!space.done.includes('dockyard')) missing.push('轨道船坞(舰船生产能力)');
  if (!space.done.includes('spaceElevator')) missing.push('太空电梯');
  if (!SHIP_MODULES.every(m => space.done.includes(m))) missing.push('科研船 + 工程船');
  return missing;
}
