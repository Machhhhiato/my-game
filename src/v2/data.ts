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
  safeWater: { id: 'safeWater', name: '安全水', symbol: '水', short: '水' },
  calories: { id: 'calories', name: '热量', symbol: '热', short: '热' },
  bioLandCapital: { id: 'bioLandCapital', name: '生物土地资本', symbol: '地', short: '地' },
  reclaimedMaterial: { id: 'reclaimedMaterial', name: '回收材料', symbol: '材', short: '材' },
  precisionParts: { id: 'precisionParts', name: '精密备件', symbol: '件', short: '件' },
  effectiveLabor: { id: 'effectiveLabor', name: '有效劳力', symbol: '劳', short: '劳' },
  publicCredit: { id: 'publicCredit', name: '公共信用', symbol: '信', short: '信' },
};

// ============ 方向 ============
export const DIRECTIONS: Record<string, DirectionDef> = {
  survival: { id: 'survival', name: '生存优先', desc: '集中保障水、热量与劳力，压缩非必需消耗。' },
  balanced: { id: 'balanced', name: '均衡发展', desc: '在生存与建设之间保持均衡，降低单项风险。' },
  science: { id: 'science', name: '科技倾斜', desc: '优先档案校验与短波信标，加速知识与预警。' },
  industry: { id: 'industry', name: '工业倾斜', desc: '优先工务校准与回收材料，扩大物质基础。' },
  military: { id: 'military', name: '军事倾斜', desc: '强化警戒与护运，压缩外部渗透与失窃风险。' },
  space: { id: 'space', name: '航天前瞻', desc: '远期目标；当前年代无轨道能力，仅作远景备案。' },
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
  { id: 'political', name: '政治执行' },
  { id: 'population', name: '城市人口' },
  { id: 'ecology', name: '资源生态' },
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
    description: '直接管辖核心区，含第 07 号、外拓营、水网与试验田；初始镜头与主战场。',
  },
  {
    id: 'old_ferry',
    name: '旧渡口走廊',
    status: 'compact',
    outline: [
      [42.4, 16.5], [45.4, 15.1], [47.0, 13.4], [46.2, 11.8], [43.8, 12.7], [41.9, 14.6],
    ],
    description: '协作契约走廊，含行旅营、断续道路、临时居民与贸易/登记机会。',
  },
  {
    id: 'south_acid',
    name: '南部酸雨带',
    status: 'contested',
    outline: [
      [37.0, -11.5], [45.0, -11.0], [47.0, -15.0], [43.0, -22.0], [36.0, -20.0], [34.0, -16.0],
    ],
    description: '争议/风险区：地表试验地、污染与酸雨事件，不提供自由扩张。',
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
    statusLine: '后方直接管辖的核心设施；遗产模块与维护债并存。',
    facts: [
      '净水、维修、医疗、档案、发电与后方安全六项职能集于一处。',
      '档案室冷却组维护债上升，校验作业被推迟一期。',
      '遗产模块承载旧文明档案，误拆风险需优先规避。',
    ],
    bottleneck: '维护债 38：冷却组与泵组备件不足，工务负荷偏高。',
    nextRisk: '滤芯耗竭——净水续命工程占用的精密备件将使储备进一步低于目标。',
    actions: ['查看净水续命项目', '优先勘测井口环与地下通道', '纳入下期维护预算'],
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
    statusLine: '河谷直接管辖的聚居灯火；人口、住房与净水/热量是当前主线。',
    facts: [
      '登记 31 人、儿童 6、照护负担 4，健康有效劳力 21。',
      '水网接续尚未完工，安全水与热量受净水续命工程挤占。',
      '暖金聚居灯火沿河分布，试验田已圈定待种源圃投入。',
    ],
    bottleneck: '住房债 20 与净水/热量双重缺口，社会承受力承压。',
    nextRisk: '若种源圃与菌蛋白室继续推迟，热量储备将跌向危险线。',
    actions: ['查看旗舰工程', '优先勘测水网接续', '纳入下期人口与住房计划'],
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
    statusLine: '协作契约下的临时灯火；接纳与贸易状态摇摆，信用是主要杠杆。',
    facts: [
      '断续道路连接河谷，登记旅团已抵达并请求临时接纳与水源。',
      '临时人口带来技能与登记机会，也带来住房与信任压力。',
      '公共信用是维持协作的关键，登记争议可能触发信任债。',
    ],
    bottleneck: '接纳政策未定——谨慎登记与开放接纳之间尚未取舍。',
    nextRisk: '登记争议：接纳政策或公共信用阈值将触发临时人口与住房压力。',
    actions: ['查看接纳政策', '优先接触行旅营代表', '纳入下期贸易与登记计划'],
  },
];
