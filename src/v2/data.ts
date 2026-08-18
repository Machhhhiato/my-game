import type {
  DirectionDef,
  MapLayerId,
  MapNode,
  PolicyDef,
  ProjectDef,
  Region,
  ResourceId,
  SecurityPostureId,
} from './types';

// ============ 资源定义（顶栏 7 资源，含库存/趋势/账本） ============
export interface ResourceDef {
  id: ResourceId;
  name: string;
  /** 16px 符号（非 emoji，单字/短标） */
  symbol: string;
  short: string;
}

export const RESOURCE_ORDER: ResourceId[] = [
  'safeWater', 'calories', 'bioLandCapital', 'reclaimedMaterial',
  'precisionParts', 'effectiveLabor', 'publicCredit',
];

export const RESOURCE_DEFS: Record<ResourceId, ResourceDef> = {
  safeWater: { id: 'safeWater', name: '可饮用水', symbol: '水', short: '水' },
  calories: { id: 'calories', name: '食物储备', symbol: '热', short: '热' },
  bioLandCapital: { id: 'bioLandCapital', name: '耕地与种源', symbol: '地', short: '地' },
  reclaimedMaterial: { id: 'reclaimedMaterial', name: '可用材料', symbol: '材', short: '材' },
  precisionParts: { id: 'precisionParts', name: '关键备件', symbol: '件', short: '件' },
  effectiveLabor: { id: 'effectiveLabor', name: '可投入人手', symbol: '劳', short: '劳' },
  publicCredit: { id: 'publicCredit', name: '协作信任', symbol: '信', short: '信' },
};

// ============ 方向（P1-S03A 首局玩家语言） ============
export const DIRECTIONS: Record<string, DirectionDef> = {
  survival: { id: 'survival', name: '供水与食物', desc: '先让所有人有水喝、有饭吃。' },
  balanced: { id: 'balanced', name: '定居与照护', desc: '少冒险，优先安顿、卫生与日常秩序。' },
  science: { id: 'science', name: '学徒与资料', desc: '暂时少一部分人手，换来更会修、更会判断的人。' },
  industry: { id: 'industry', name: '工务与材料', desc: '多回收、多维修，为下一座设施打基础。' },
  military: { id: 'military', name: '护运与警戒', desc: '保护水网、道路和夜间营地，但会占用人手。' },
  space: { id: 'space', name: '远期筹备（不可执行）', desc: '当前年代没有条件；按钮禁用并解释原因。' },
};
export const DIRECTION_ORDER = ['survival', 'balanced', 'science', 'industry', 'military', 'space'] as const;

// ============ 旗舰工程 ============
export const PROJECTS: Record<string, ProjectDef> = {
  water_life: {
    id: 'water_life', name: '河谷净水续命',
    benefit: '安全水、后勤韧性',
    cost: '精密备件、工务负荷',
    risk: '滤芯磨损、泵组故障',
  },
  seed_protein: {
    id: 'seed_protein', name: '种源圃与菌蛋白室',
    benefit: '热量、生物土地资本、社会承受',
    cost: '有效劳力、水',
    risk: '酸雨、病害、用水争议',
  },
  workshop_calib: {
    id: 'workshop_calib', name: '河谷工务所校准',
    benefit: '回收材料、维护、统合能力',
    cost: '热量、教育时间',
    risk: '粉尘伤害、误拆遗产、维修债',
  },
  archive_beacon: {
    id: 'archive_beacon', name: '档案校验与短波信标',
    benefit: '知识、公共信用、事件预警',
    cost: '精密备件、当期产出',
    risk: '数据错误、试验失误、外部接触',
  },
};
export const PROJECT_ORDER = ['water_life', 'seed_protein', 'workshop_calib', 'archive_beacon'] as const;

// ============ 法令 ============
export const POLICIES: Record<string, PolicyDef> = {
  mixed_ration: { id: 'mixed_ration', name: '混合配给', desc: '在生存与劳动之间平衡配给，稳定士气。' },
  cautious_register: { id: 'cautious_register', name: '谨慎登记', desc: '从严登记临时人口，减少住房与信任压力。' },
  apprentice_first: { id: 'apprentice_first', name: '学徒优先', desc: '优先培养技术学徒，长期提升知识与维护能力。' },
  labor_protection: { id: 'labor_protection', name: '基本劳动保护', desc: '限制工务负荷，降低伤病与粉尘伤害。' },
  community_housing: { id: 'community_housing', name: '社区安置', desc: '优先公共住房与社区接续，缓解住房债。' },
};
export const POLICY_ORDER = ['mixed_ration', 'cautious_register', 'apprentice_first', 'labor_protection', 'community_housing'] as const;

// ============ 安全姿态 ============
export const SECURITY_POSTURES: { id: SecurityPostureId; name: string; desc: string }[] = [
  { id: 'low', name: '低戒备', desc: '节省民生劳力，但失窃与渗透风险上升。' },
  { id: 'escort', name: '护运优先', desc: '重点护送水网与道路，兼顾民生与安全。' },
  { id: 'heightened', name: '强化警戒', desc: '提高巡逻强度，压缩失窃与接触风险，占用更多劳力。' },
];

// ============ 地图层 ============
export const MAP_LAYERS: { id: MapLayerId; name: string }[] = [
  { id: 'political', name: '统一治理' },
  { id: 'population', name: '聚居与人口' },
  { id: 'ecology', name: '地形与环境' },
];

// ============ 地区（覆盖层多边形） ============
export const REGIONS: Region[] = [
  {
    id: 'emerald_valley',
    name: '翡翠河谷',
    status: 'direct',
    outline: [
      [35.6, 21.5], [38.6, 20.7], [42.6, 17.5], [42.1, 14.8], [39.9, 14.6], [37.0, 18.0],
    ],
    description: '中央直辖的核心区域，包含第 07 号、外拓营、水网与试验田。',
  },
  {
    id: 'old_ferry',
    name: '旧渡口走廊',
    status: 'compact',
    outline: [
      [42.4, 16.5], [45.4, 15.1], [47.0, 13.4], [46.2, 11.8], [43.8, 12.7], [41.9, 14.6],
    ],
    description: '纳入统一调度的协作走廊，连接行旅营、断续道路与临时住处。',
  },
  {
    id: 'south_acid',
    name: '南部酸雨带',
    status: 'contested',
    outline: [
      [37.0, -11.5], [45.0, -11.0], [47.0, -15.0], [43.0, -22.0], [36.0, -20.0], [34.0, -16.0],
    ],
    description: '暂受风险管制的南部地带；酸雨和污染限制了居住与开垦。',
  },
];

// ============ 三节点（真实锚点，单位：度） ============
export const NODES: MapNode[] = [
  {
    id: 'facility_07',
    name: '第 07 号深层存续设施',
    kind: 'shelter',
    regionId: 'emerald_valley',
    lon: 38.2,
    lat: 18.6,
    politicalStatus: 'direct',
    symbol: 'wellhead',
    statusLine: '中央直辖 · 净水、维修、医疗、档案和后方保障集中于此。',
    facts: [
      '净水、维修、医疗、档案、发电与后方安全六项职能集于一处。',
      '档案室冷却组待修，资料校验已被迫延后。',
      '遗产模块承载旧文明档案，误拆风险需优先规避。',
    ],
    bottleneck: '泵房和冷却组待修：关键备件不足，维修班组已接近负荷上限。',
    nextRisk: '滤材继续消耗会先影响西岸供水，随后迫使公共厨房缩减用水。',
    actions: ['查看净水工程', '勘察井口周边', '安排维护优先序'],
  },
  {
    id: 'valley_outpost',
    name: '翡翠河谷外拓营',
    kind: 'outpost',
    regionId: 'emerald_valley',
    lon: 40.6,
    lat: 16.4,
    politicalStatus: 'direct',
    symbol: 'warmlight',
    statusLine: '中央直辖 · 河谷第一处地表聚居点，居民依赖水网、临时住处和试验田。',
    facts: [
      '登记居民 31 人，其中儿童 6 人；可投入重体力劳动的人手有限。',
      '水网接续尚未完工，饮水和食物仍主要依赖临时安排。',
      '暖金聚居灯火沿河分布，试验田已圈定待种源圃投入。',
    ],
    bottleneck: '临时住处拥挤，供水和食物都没有稳定来源；照护人员无法长期兼任施工。',
    nextRisk: '培养温室继续推迟，会让下一轮酸雨直接压低外拓营的食物保障。',
    actions: ['查看在建设施', '勘察水网接续', '安排安置与照护'],
  },
  {
    id: 'old_ferry_camp',
    name: '旧渡口行旅营',
    kind: 'waypoint',
    regionId: 'old_ferry',
    lon: 45.2,
    lat: 13.8,
    politicalStatus: 'compact',
    symbol: 'waylight',
    statusLine: '统一协作区 · 临时行旅营依靠河谷补给，正在等待接纳与登记安排。',
    facts: [
      '断续道路连接河谷，登记旅团已抵达并请求临时接纳与水源。',
      '临时来访者带来技能和交换机会，也需要床位、饮水和明确的登记安排。',
      '接纳过程若不公开，容易演变成对配给和劳动分配的争议。',
    ],
    bottleneck: '接纳办法尚未确定：登记、短期安置和劳动安排都缺少统一顺序。',
    nextRisk: '若登记争议拖延，行旅营会同时失去补给信心和继续协作的意愿。',
    actions: ['查看接纳安排', '接触行旅营代表', '制定登记与交换方案'],
  },
];
