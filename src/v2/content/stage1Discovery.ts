// 由 scripts/build-r7-discovery-index.mjs 生成；不要手改。

export type DiscoveryCategoryId = 'survival' | 'industry' | 'logistics' | 'security' | 'society' | 'science';

export interface MajorDiscovery {
  id: string;
  categoryId: DiscoveryCategoryId;
  categoryName: string;
  domain: string;
  tier: number;
  title: string;
  summary: string;
  requirements: string[];
  unlocks: string;
  limitation: string;
  nextId: string | null;
  branchCount: number;
  refinementCount: number;
  engineeringRequirements: string[];
}

export interface PolicyLineage {
  id: string;
  theme: string;
  versions: Array<{ version: string; title: string; summary: string; requirements: string[]; duration: string; limitation: string }>;
}

export const DISCOVERY_CATEGORIES: Array<{ id: DiscoveryCategoryId; name: string }> = [
  {
    "id": "survival",
    "name": "生存与资源"
  },
  {
    "id": "industry",
    "name": "工业、能源与基建"
  },
  {
    "id": "logistics",
    "name": "交通、通信与后勤"
  },
  {
    "id": "security",
    "name": "军事与安全"
  },
  {
    "id": "society",
    "name": "社会与治理"
  },
  {
    "id": "science",
    "name": "科学、教育与外拓"
  }
];

export const STAGE_1_MAJOR_DISCOVERIES: MajorDiscovery[] = [
  {
    "id": "w1",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "water",
    "tier": 1,
    "title": "地表与水线测绘",
    "summary": "建立地表与水线测绘所需的共同方法，使安全用水、土地恢复和聚居地供水从临时应对进入可持续建设。",
    "requirements": [],
    "unlocks": "开放「取水线与临时居住点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会占用劳力和土地，并把上游决策的代价传给下游",
    "nextId": "w2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": []
  },
  {
    "id": "w2",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "water",
    "tier": 2,
    "title": "可靠净水",
    "summary": "建立可靠净水所需的共同方法，使安全用水、土地恢复和聚居地供水从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「地表与水线测绘」",
      "先掌握「泉眼与旧管线定位·跨地点复制」",
      "先掌握「污染源与塌陷带判读·跨地点韧性证明」",
      "先掌握「废料识别与分拣」",
      "让「地表与水线测绘·核心设施」投入运行",
      "让「废料识别与分拣·核心设施」投入运行"
    ],
    "unlocks": "开放「净水与配水设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会占用劳力和土地，并把上游决策的代价传给下游",
    "nextId": "w3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "地表与水线测绘·核心设施",
      "废料识别与分拣·核心设施"
    ]
  },
  {
    "id": "w3",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "water",
    "tier": 3,
    "title": "土地恢复",
    "summary": "建立土地恢复所需的共同方法，使安全用水、土地恢复和聚居地供水从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「可靠净水」",
      "先掌握「重力过滤与膜材复用·跨地点复制」",
      "先掌握「消毒、旁路与故障隔离·跨地点韧性证明」",
      "先掌握「配给与保藏」",
      "让「可靠净水·核心设施」投入运行",
      "让「配给与保藏·公共服务点」投入运行"
    ],
    "unlocks": "开放「土地修复与试验田」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会占用劳力和土地，并把上游决策的代价传给下游",
    "nextId": "w4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "可靠净水·核心设施",
      "配给与保藏·公共服务点"
    ]
  },
  {
    "id": "w4",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "water",
    "tier": 4,
    "title": "聚居地供水",
    "summary": "建立聚居地供水所需的共同方法，使安全用水、土地恢复和聚居地供水从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「土地恢复」",
      "先掌握「表土、堆肥与小田改良·跨地点复制」",
      "先掌握「污染隔离与盐碱控制·跨地点韧性证明」",
      "先掌握「安全微电网」",
      "先掌握「公共卫生」",
      "让「土地恢复·标准化改造」投入运行",
      "让「安全微电网·核心设施」投入运行",
      "让「公共卫生·公共服务点」投入运行"
    ],
    "unlocks": "开放「街区供排水网络」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会占用劳力和土地，并把上游决策的代价传给下游",
    "nextId": "w5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "土地恢复·标准化改造",
      "安全微电网·核心设施",
      "公共卫生·公共服务点"
    ]
  },
  {
    "id": "w5",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "water",
    "tier": 5,
    "title": "流域治理",
    "summary": "建立流域治理所需的共同方法，使安全用水、土地恢复和聚居地供水从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「聚居地供水」",
      "先掌握「蓄水、配水与排污分区·跨地点复制」",
      "先掌握「消防、漏损与旱季备用·跨地点韧性证明」",
      "先掌握「修复方法」",
      "先掌握「服务预算」",
      "让「聚居地供水·区域互联枢纽」投入运行",
      "让「修复方法·风险缓解设施」投入运行",
      "让「服务预算·区域互联枢纽」投入运行"
    ],
    "unlocks": "开放「跨镇灌排与滞洪设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会占用劳力和土地，并把上游决策的代价传给下游",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "聚居地供水·区域互联枢纽",
      "修复方法·风险缓解设施",
      "服务预算·区域互联枢纽"
    ]
  },
  {
    "id": "f1",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "food",
    "tier": 1,
    "title": "配给与保藏",
    "summary": "建立配给与保藏所需的共同方法，使食物、种源和抗灾农业从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「地表与水线测绘」",
      "让「地表与水线测绘·公共服务点」投入运行"
    ],
    "unlocks": "开放「保藏与公共配给点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会争夺用水、热量与劳力，并可能压缩野生环境",
    "nextId": "f2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "地表与水线测绘·公共服务点"
    ]
  },
  {
    "id": "f2",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "food",
    "tier": 2,
    "title": "受控栽培",
    "summary": "建立受控栽培所需的共同方法，使食物、种源和抗灾农业从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「配给与保藏」",
      "先掌握「干燥、发酵与损耗压缩·跨地点复制」",
      "先掌握「储备轮换与污染剔除·跨地点韧性证明」",
      "先掌握「可靠净水」",
      "让「可靠净水·核心设施」投入运行",
      "让「负荷清查·储备与缓冲设施」投入运行"
    ],
    "unlocks": "开放「温室与营养液设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会争夺用水、热量与劳力，并可能压缩野生环境",
    "nextId": "f3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "可靠净水·核心设施",
      "负荷清查·储备与缓冲设施"
    ]
  },
  {
    "id": "f3",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "food",
    "tier": 3,
    "title": "种源恢复",
    "summary": "建立种源恢复所需的共同方法，使食物、种源和抗灾农业从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「受控栽培」",
      "先掌握「温室水培与高效营养液·跨地点复制」",
      "先掌握「病害隔离与能源备用·跨地点韧性证明」",
      "先掌握「学徒训练」",
      "让「受控栽培·训练与交接中心」投入运行",
      "让「学徒训练·训练与交接中心」投入运行"
    ],
    "unlocks": "开放「种源库与苗圃」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会争夺用水、热量与劳力，并可能压缩野生环境",
    "nextId": "f4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "受控栽培·训练与交接中心",
      "学徒训练·训练与交接中心"
    ]
  },
  {
    "id": "f4",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "food",
    "tier": 4,
    "title": "区域食品网",
    "summary": "建立区域食品网所需的共同方法，使食物、种源和抗灾农业从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「种源恢复」",
      "先掌握「选种、繁育与地方品种保存·跨地点复制」",
      "先掌握「检疫、隔离与遗传冗余·跨地点韧性证明」",
      "先掌握「道路与桥渡」",
      "先掌握「申诉与裁决」",
      "让「种源恢复·区域互联枢纽」投入运行",
      "让「道路与桥渡·跨区连接线」投入运行",
      "让「申诉与裁决·公共服务点」投入运行"
    ],
    "unlocks": "开放「加工、仓储与交换节点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会争夺用水、热量与劳力，并可能压缩野生环境",
    "nextId": "f5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "种源恢复·区域互联枢纽",
      "道路与桥渡·跨区连接线",
      "申诉与裁决·公共服务点"
    ]
  },
  {
    "id": "f5",
    "categoryId": "survival",
    "categoryName": "生存与资源",
    "domain": "food",
    "tier": 5,
    "title": "抗灾农业",
    "summary": "建立抗灾农业所需的共同方法，使食物、种源和抗灾农业从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「区域食品网」",
      "先掌握「加工、交换与多地专长生产·跨地点复制」",
      "先掌握「仓储备份与运输损耗控制·跨地点韧性证明」",
      "先掌握「邻近聚落接触」",
      "让「区域食品网·区域互联枢纽」投入运行",
      "让「邻近聚落接触·跨区连接线」投入运行"
    ],
    "unlocks": "开放「耐逆农田与复种系统」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会争夺用水、热量与劳力，并可能压缩野生环境",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "区域食品网·区域互联枢纽",
      "邻近聚落接触·跨区连接线"
    ]
  },
  {
    "id": "i1",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "industry",
    "tier": 1,
    "title": "废料识别与分拣",
    "summary": "建立废料识别与分拣所需的共同方法，使材料回收、制造与长期维修从临时应对进入可持续建设。",
    "requirements": [],
    "unlocks": "开放「回收与危险拆解设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会集中危险作业、粉尘与材料分配权",
    "nextId": "i2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": []
  },
  {
    "id": "i2",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "industry",
    "tier": 2,
    "title": "测量与互换件",
    "summary": "建立测量与互换件所需的共同方法，使材料回收、制造与长期维修从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「废料识别与分拣」",
      "先掌握「高价值材料回收·跨地点复制」",
      "先掌握「危险废料隔离与拆解安全·跨地点韧性证明」",
      "先掌握「档案可读化」",
      "让「废料识别与分拣·核心设施」投入运行",
      "让「档案可读化·训练与交接中心」投入运行"
    ],
    "unlocks": "开放「量具、标准件与校准室」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会集中危险作业、粉尘与材料分配权",
    "nextId": "i3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "废料识别与分拣·核心设施",
      "档案可读化·训练与交接中心"
    ]
  },
  {
    "id": "i3",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "industry",
    "tier": 3,
    "title": "修理工务线",
    "summary": "建立修理工务线所需的共同方法，使材料回收、制造与长期维修从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「测量与互换件」",
      "先掌握「量具、螺纹与常用标准件·跨地点复制」",
      "先掌握「校准、误差追溯与失效排查·跨地点韧性证明」",
      "先掌握「安全微电网」",
      "让「测量与互换件·标准化改造」投入运行",
      "让「安全微电网·核心设施」投入运行"
    ],
    "unlocks": "开放「维修工坊与备件周转」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会集中危险作业、粉尘与材料分配权",
    "nextId": "i4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "测量与互换件·标准化改造",
      "安全微电网·核心设施"
    ]
  },
  {
    "id": "i4",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "industry",
    "tier": 4,
    "title": "小批量制造",
    "summary": "建立小批量制造所需的共同方法，使材料回收、制造与长期维修从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「修理工务线」",
      "先掌握「拆检、返工与备件周转·跨地点复制」",
      "先掌握「粉尘、工伤与关键停机保护·跨地点韧性证明」",
      "先掌握「道路与桥渡」",
      "让「修理工务线·核心设施」投入运行",
      "让「道路与桥渡·跨区连接线」投入运行"
    ],
    "unlocks": "开放「模具与机加工车间」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会集中危险作业、粉尘与材料分配权",
    "nextId": "i5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "修理工务线·核心设施",
      "道路与桥渡·跨区连接线"
    ]
  },
  {
    "id": "i5",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "industry",
    "tier": 5,
    "title": "工业维护体系",
    "summary": "建立工业维护体系所需的共同方法，使材料回收、制造与长期维修从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「小批量制造」",
      "先掌握「模具、机加工与工具复制·跨地点复制」",
      "先掌握「材料质控与工艺失误隔离·跨地点韧性证明」",
      "先掌握「服务预算」",
      "先掌握「劳动与居住保护」",
      "让「小批量制造·标准化改造」投入运行",
      "让「服务预算·区域互联枢纽」投入运行",
      "让「劳动与居住保护·公共服务点」投入运行"
    ],
    "unlocks": "开放「区域检验与计划检修网」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会集中危险作业、粉尘与材料分配权",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "小批量制造·标准化改造",
      "服务预算·区域互联枢纽",
      "劳动与居住保护·公共服务点"
    ]
  },
  {
    "id": "e1",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "energy",
    "tier": 1,
    "title": "负荷清查",
    "summary": "建立负荷清查所需的共同方法，使发电、储能和公共能源服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「废料识别与分拣」",
      "让「废料识别与分拣·核心设施」投入运行"
    ],
    "unlocks": "开放「计量与关键负荷点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "需要长期维护，并可能将污染、噪声或限电压力集中在局部",
    "nextId": "e2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "废料识别与分拣·核心设施"
    ]
  },
  {
    "id": "e2",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "energy",
    "tier": 2,
    "title": "安全微电网",
    "summary": "建立安全微电网所需的共同方法，使发电、储能和公共能源服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「负荷清查」",
      "先掌握「用能计量与错峰·跨地点复制」",
      "先掌握「关键负荷识别与应急切断·跨地点韧性证明」",
      "先掌握「测量与互换件」",
      "让「负荷清查·核心设施」投入运行",
      "让「测量与互换件·标准化改造」投入运行"
    ],
    "unlocks": "开放「微电网与配电站」工程簇，并为下一层重大突破提供基础。",
    "limitation": "需要长期维护，并可能将污染、噪声或限电压力集中在局部",
    "nextId": "e3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "负荷清查·核心设施",
      "测量与互换件·标准化改造"
    ]
  },
  {
    "id": "e3",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "energy",
    "tier": 3,
    "title": "热能与储能",
    "summary": "建立热能与储能所需的共同方法，使发电、储能和公共能源服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「安全微电网」",
      "先掌握「小型发电与配电优化·跨地点复制」",
      "先掌握「断路、接地与孤岛运行·跨地点韧性证明」",
      "先掌握「受控栽培」",
      "让「安全微电网·储备与缓冲设施」投入运行",
      "让「受控栽培·公共服务点」投入运行"
    ],
    "unlocks": "开放「蓄热、保温与储能设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "需要长期维护，并可能将污染、噪声或限电压力集中在局部",
    "nextId": "e4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "安全微电网·储备与缓冲设施",
      "受控栽培·公共服务点"
    ]
  },
  {
    "id": "e4",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "energy",
    "tier": 4,
    "title": "分布式供能",
    "summary": "建立分布式供能所需的共同方法，使发电、储能和公共能源服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「热能与储能」",
      "先掌握「蓄热、保温与余热利用·跨地点复制」",
      "先掌握「储能失效、泄漏与冬季备用·跨地点韧性证明」",
      "先掌握「聚居地供水」",
      "让「热能与储能·核心设施」投入运行",
      "让「聚居地供水·公共服务点」投入运行"
    ],
    "unlocks": "开放「地方发电与接入设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "需要长期维护，并可能将污染、噪声或限电压力集中在局部",
    "nextId": "e5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "热能与储能·核心设施",
      "聚居地供水·公共服务点"
    ]
  },
  {
    "id": "e5",
    "categoryId": "industry",
    "categoryName": "工业、能源与基建",
    "domain": "energy",
    "tier": 5,
    "title": "区域公用网调度",
    "summary": "建立区域公用网调度所需的共同方法，使发电、储能和公共能源服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「分布式供能」",
      "先掌握「小水电、风机、沼气等组合·跨地点复制」",
      "先掌握「多源切换与设备抗灾·跨地点韧性证明」",
      "先掌握「公共技术学校」",
      "先掌握「服务预算」",
      "让「分布式供能·区域互联枢纽」投入运行",
      "让「公共技术学校·标准化改造」投入运行",
      "让「服务预算·区域互联枢纽」投入运行"
    ],
    "unlocks": "开放「区域调度与黑启动节点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "需要长期维护，并可能将污染、噪声或限电压力集中在局部",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "分布式供能·区域互联枢纽",
      "公共技术学校·标准化改造",
      "服务预算·区域互联枢纽"
    ]
  },
  {
    "id": "l1",
    "categoryId": "logistics",
    "categoryName": "交通、通信与后勤",
    "domain": "logistics",
    "tier": 1,
    "title": "地面通路测绘",
    "summary": "建立地面通路测绘所需的共同方法，使道路、仓储、运输和统一调度从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「地表与水线测绘」",
      "先掌握「人口与地点登记」",
      "让「地表与水线测绘·现场测量站」投入运行",
      "让「人口与地点登记·公共服务点」投入运行"
    ],
    "unlocks": "开放「路线、路标与巡查点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会改变地表、扩大控制半径，也可能暴露护运队",
    "nextId": "l2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "地表与水线测绘·现场测量站",
      "人口与地点登记·公共服务点"
    ]
  },
  {
    "id": "l2",
    "categoryId": "logistics",
    "categoryName": "交通、通信与后勤",
    "domain": "logistics",
    "tier": 2,
    "title": "护运规程",
    "summary": "建立护运规程所需的共同方法，使道路、仓储、运输和统一调度从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「地面通路测绘」",
      "先掌握「路线分级与最短可行路径·跨地点复制」",
      "先掌握「落石、洪水与伏击风险标注·跨地点韧性证明」",
      "先掌握「风险观察哨」",
      "让「地面通路测绘·核心设施」投入运行",
      "让「风险观察哨·安全控制站」投入运行"
    ],
    "unlocks": "开放「护运、交接与医疗点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会改变地表、扩大控制半径，也可能暴露护运队",
    "nextId": "l3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "地面通路测绘·核心设施",
      "风险观察哨·安全控制站"
    ]
  },
  {
    "id": "l3",
    "categoryId": "logistics",
    "categoryName": "交通、通信与后勤",
    "domain": "logistics",
    "tier": 3,
    "title": "道路与桥渡",
    "summary": "建立道路与桥渡所需的共同方法，使道路、仓储、运输和统一调度从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「护运规程」",
      "先掌握「装载、队形与交接效率·跨地点复制」",
      "先掌握「夜行、撤离、急救与失联处理·跨地点韧性证明」",
      "先掌握「修理工务线」",
      "让「修理工务线·核心设施」投入运行",
      "让「测量与互换件·标准化改造」投入运行"
    ],
    "unlocks": "开放「道路、涵洞与桥渡工程」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会改变地表、扩大控制半径，也可能暴露护运队",
    "nextId": "l4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "修理工务线·核心设施",
      "测量与互换件·标准化改造"
    ]
  },
  {
    "id": "l4",
    "categoryId": "logistics",
    "categoryName": "交通、通信与后勤",
    "domain": "logistics",
    "tier": 4,
    "title": "仓储节点网",
    "summary": "建立仓储节点网所需的共同方法，使道路、仓储、运输和统一调度从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「道路与桥渡」",
      "先掌握「路基、涵洞、桥梁与重载通行·跨地点复制」",
      "先掌握「水毁、塌方与工程抢修·跨地点韧性证明」",
      "先掌握「区域食品网」",
      "先掌握「申诉与裁决」",
      "让「道路与桥渡·跨区连接线」投入运行",
      "让「区域食品网·储备与缓冲设施」投入运行",
      "让「申诉与裁决·公共服务点」投入运行"
    ],
    "unlocks": "开放「分层仓与转运节点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会改变地表、扩大控制半径，也可能暴露护运队",
    "nextId": "l5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "道路与桥渡·跨区连接线",
      "区域食品网·储备与缓冲设施",
      "申诉与裁决·公共服务点"
    ]
  },
  {
    "id": "l5",
    "categoryId": "logistics",
    "categoryName": "交通、通信与后勤",
    "domain": "logistics",
    "tier": 5,
    "title": "区域调度网",
    "summary": "建立区域调度网所需的共同方法，使道路、仓储、运输和统一调度从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「仓储节点网」",
      "先掌握「分层仓、转运与库存轮换·跨地点复制」",
      "先掌握「分散备份、火灾防护与截断预案·跨地点韧性证明」",
      "先掌握「区域公用网调度」",
      "先掌握「区域警戒协作」",
      "让「仓储节点网·区域互联枢纽」投入运行",
      "让「区域公用网调度·区域互联枢纽」投入运行",
      "让「区域警戒协作·跨区连接线」投入运行"
    ],
    "unlocks": "开放「区域运输与救援调度中心」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会改变地表、扩大控制半径，也可能暴露护运队",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "仓储节点网·区域互联枢纽",
      "区域公用网调度·区域互联枢纽",
      "区域警戒协作·跨区连接线"
    ]
  },
  {
    "id": "q1",
    "categoryId": "security",
    "categoryName": "军事与安全",
    "domain": "security",
    "tier": 1,
    "title": "风险观察哨",
    "summary": "建立风险观察哨所需的共同方法，使预警、护运、救援和统一防卫从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「地面通路测绘」",
      "先掌握「灾害与污染勘察」",
      "让「地面通路测绘·现场测量站」投入运行",
      "让「灾害与污染勘察·现场测量站」投入运行"
    ],
    "unlocks": "开放「观察哨与风险通报点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会消耗训练与装备，并有权限扩大、误报和伤害平民的风险",
    "nextId": "q2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "地面通路测绘·现场测量站",
      "灾害与污染勘察·现场测量站"
    ]
  },
  {
    "id": "q2",
    "categoryId": "security",
    "categoryName": "军事与安全",
    "domain": "security",
    "tier": 2,
    "title": "护运训练",
    "summary": "建立护运训练所需的共同方法，使预警、护运、救援和统一防卫从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「风险观察哨」",
      "先掌握「视野、传感与定期巡查·跨地点复制」",
      "先掌握「误报校正与哨所自保·跨地点韧性证明」",
      "先掌握「护运规程」",
      "让「风险观察哨·公共服务点」投入运行",
      "让「护运规程·公共服务点」投入运行"
    ],
    "unlocks": "开放「训练场与护运装备库」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会消耗训练与装备，并有权限扩大、误报和伤害平民的风险",
    "nextId": "q3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "风险观察哨·公共服务点",
      "护运规程·公共服务点"
    ]
  },
  {
    "id": "q3",
    "categoryId": "security",
    "categoryName": "军事与安全",
    "domain": "security",
    "tier": 3,
    "title": "工兵与救援",
    "summary": "建立工兵与救援所需的共同方法，使预警、护运、救援和统一防卫从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「护运训练」",
      "先掌握「队形、装备与协同行动·跨地点复制」",
      "先掌握「撤离、伤员救治与纪律边界·跨地点韧性证明」",
      "先掌握「公共卫生」",
      "让「护运训练·核心设施」投入运行",
      "让「公共卫生·公共服务点」投入运行"
    ],
    "unlocks": "开放「工兵、消防与抢修站」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会消耗训练与装备，并有权限扩大、误报和伤害平民的风险",
    "nextId": "q4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "护运训练·核心设施",
      "公共卫生·公共服务点"
    ]
  },
  {
    "id": "q4",
    "categoryId": "security",
    "categoryName": "军事与安全",
    "domain": "security",
    "tier": 4,
    "title": "区域警戒协作",
    "summary": "建立区域警戒协作所需的共同方法，使预警、护运、救援和统一防卫从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「工兵与救援」",
      "先掌握「排险、架桥、消防与抢修·跨地点复制」",
      "先掌握「大型事故指挥与装备冗余·跨地点韧性证明」",
      "先掌握「可复现实验」",
      "先掌握「申诉与裁决」",
      "让「工兵与救援·标准化改造」投入运行",
      "让「可复现实验·训练与交接中心」投入运行",
      "让「申诉与裁决·公共服务点」投入运行"
    ],
    "unlocks": "开放「联合值守与通报网络」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会消耗训练与装备，并有权限扩大、误报和伤害平民的风险",
    "nextId": "q5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "工兵与救援·标准化改造",
      "可复现实验·训练与交接中心",
      "申诉与裁决·公共服务点"
    ]
  },
  {
    "id": "q5",
    "categoryId": "security",
    "categoryName": "军事与安全",
    "domain": "security",
    "tier": 5,
    "title": "公民防卫体系",
    "summary": "建立公民防卫体系所需的共同方法，使预警、护运、救援和统一防卫从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「区域警戒协作」",
      "先掌握「联合值守、快速通报与巡逻协同·跨地点复制」",
      "先掌握「情报核验、误报处置与泄密防护·跨地点韧性证明」",
      "先掌握「区域行政协同」",
      "先掌握「基层服务网」",
      "让「区域警戒协作·区域互联枢纽」投入运行",
      "让「区域行政协同·区域互联枢纽」投入运行",
      "让「基层服务网·公共服务点」投入运行"
    ],
    "unlocks": "开放「民防、避难与后勤设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会消耗训练与装备，并有权限扩大、误报和伤害平民的风险",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "区域警戒协作·区域互联枢纽",
      "区域行政协同·区域互联枢纽",
      "基层服务网·公共服务点"
    ]
  },
  {
    "id": "a1",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "admin",
    "tier": 1,
    "title": "人口与地点登记",
    "summary": "建立人口与地点登记所需的共同方法，使登记、预算、申诉和统一服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「档案可读化」",
      "让「档案可读化·训练与交接中心」投入运行"
    ],
    "unlocks": "开放「登记点与服务名册」工程簇，并为下一层重大突破提供基础。",
    "limitation": "记录与审查会增加文书负担，也可能造成排斥或权力寻租",
    "nextId": "a2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "档案可读化·训练与交接中心"
    ]
  },
  {
    "id": "a2",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "admin",
    "tier": 2,
    "title": "公共账目",
    "summary": "建立公共账目所需的共同方法，使登记、预算、申诉和统一服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「人口与地点登记」",
      "先掌握「技能、居住和服务需求登记·跨地点复制」",
      "先掌握「隐私、临时身份与错误更正·跨地点韧性证明」",
      "先掌握「测量与互换件」",
      "让「人口与地点登记·公共服务点」投入运行",
      "让「测量与互换件·标准化改造」投入运行"
    ],
    "unlocks": "开放「账目室与公开栏」工程簇，并为下一层重大突破提供基础。",
    "limitation": "记录与审查会增加文书负担，也可能造成排斥或权力寻租",
    "nextId": "a3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "人口与地点登记·公共服务点",
      "测量与互换件·标准化改造"
    ]
  },
  {
    "id": "a3",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "admin",
    "tier": 3,
    "title": "申诉与裁决",
    "summary": "建立申诉与裁决所需的共同方法，使登记、预算、申诉和统一服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「公共账目」",
      "先掌握「供给、工程和劳力账目统一·跨地点复制」",
      "先掌握「审计、损耗追溯与反侵吞·跨地点韧性证明」",
      "先掌握「公共卫生」",
      "让「公共账目·公共服务点」投入运行",
      "让「公共卫生·公共服务点」投入运行"
    ],
    "unlocks": "开放「调解室与巡回听证点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "记录与审查会增加文书负担，也可能造成排斥或权力寻租",
    "nextId": "a4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "公共账目·公共服务点",
      "公共卫生·公共服务点"
    ]
  },
  {
    "id": "a4",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "admin",
    "tier": 4,
    "title": "服务预算",
    "summary": "建立服务预算所需的共同方法，使登记、预算、申诉和统一服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「申诉与裁决」",
      "先掌握「调解、仲裁和损害补偿·跨地点复制」",
      "先掌握「程序期限、证据保护与裁决复核·跨地点韧性证明」",
      "先掌握「热能与储能」",
      "让「申诉与裁决·区域互联枢纽」投入运行",
      "让「热能与储能·核心设施」投入运行"
    ],
    "unlocks": "开放「预算室与公共采购节点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "记录与审查会增加文书负担，也可能造成排斥或权力寻租",
    "nextId": "a5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "申诉与裁决·区域互联枢纽",
      "热能与储能·核心设施"
    ]
  },
  {
    "id": "a5",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "admin",
    "tier": 5,
    "title": "区域行政协同",
    "summary": "建立区域行政协同所需的共同方法，使登记、预算、申诉和统一服务从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「服务预算」",
      "先掌握「维护、建设和救援的长期预算·跨地点复制」",
      "先掌握「财政冲击、欠账和优先级调整·跨地点韧性证明」",
      "先掌握「区域调度网」",
      "先掌握「邻近聚落接触」",
      "让「服务预算·区域互联枢纽」投入运行",
      "让「区域调度网·区域互联枢纽」投入运行",
      "让「邻近聚落接触·跨区连接线」投入运行"
    ],
    "unlocks": "开放「区域办事处与统计站」工程簇，并为下一层重大突破提供基础。",
    "limitation": "记录与审查会增加文书负担，也可能造成排斥或权力寻租",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "服务预算·区域互联枢纽",
      "区域调度网·区域互联枢纽",
      "邻近聚落接触·跨区连接线"
    ]
  },
  {
    "id": "h1",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "social",
    "tier": 1,
    "title": "应急诊疗",
    "summary": "建立应急诊疗所需的共同方法，使诊疗、居住、照护和人口安置从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「地表与水线测绘」",
      "先掌握「人口与地点登记」",
      "让「地表与水线测绘·公共服务点」投入运行",
      "让「人口与地点登记·公共服务点」投入运行"
    ],
    "unlocks": "开放「诊疗与转运点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会提高短期建设和用工成本，并把被忽视的差异暴露出来",
    "nextId": "h2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "地表与水线测绘·公共服务点",
      "人口与地点登记·公共服务点"
    ]
  },
  {
    "id": "h2",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "social",
    "tier": 2,
    "title": "公共卫生",
    "summary": "建立公共卫生所需的共同方法，使诊疗、居住、照护和人口安置从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「应急诊疗」",
      "先掌握「分诊、基础药物与创伤处理·跨地点复制」",
      "先掌握「传染隔离与医疗物资备用·跨地点韧性证明」",
      "先掌握「可靠净水」",
      "让「应急诊疗·公共服务点」投入运行",
      "让「可靠净水·核心设施」投入运行"
    ],
    "unlocks": "开放「清洁、排污与卫生点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会提高短期建设和用工成本，并把被忽视的差异暴露出来",
    "nextId": "h3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "应急诊疗·公共服务点",
      "可靠净水·核心设施"
    ]
  },
  {
    "id": "h3",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "social",
    "tier": 3,
    "title": "劳动与居住保护",
    "summary": "建立劳动与居住保护所需的共同方法，使诊疗、居住、照护和人口安置从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「公共卫生」",
      "先掌握「饮水、清洁和排污日常化·跨地点复制」",
      "先掌握「疫情追踪、隔离与谣言应对·跨地点韧性证明」",
      "先掌握「申诉与裁决」",
      "让「公共卫生·公共服务点」投入运行",
      "让「申诉与裁决·公共服务点」投入运行"
    ],
    "unlocks": "开放「工舍、安全装备与托护点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会提高短期建设和用工成本，并把被忽视的差异暴露出来",
    "nextId": "h4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "公共卫生·公共服务点",
      "申诉与裁决·公共服务点"
    ]
  },
  {
    "id": "h4",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "social",
    "tier": 4,
    "title": "基层服务网",
    "summary": "建立基层服务网所需的共同方法，使诊疗、居住、照护和人口安置从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「劳动与居住保护」",
      "先掌握「工时、工舍与事故补偿·跨地点复制」",
      "先掌握「危险作业、儿童照护与住房抗灾·跨地点韧性证明」",
      "先掌握「可复现实验」",
      "先掌握「仓储节点网」",
      "让「劳动与居住保护·公共服务点」投入运行",
      "让「可复现实验·训练与交接中心」投入运行",
      "让「仓储节点网·公共服务点」投入运行"
    ],
    "unlocks": "开放「学校、诊疗与照护站」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会提高短期建设和用工成本，并把被忽视的差异暴露出来",
    "nextId": "h5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "劳动与居住保护·公共服务点",
      "可复现实验·训练与交接中心",
      "仓储节点网·公共服务点"
    ]
  },
  {
    "id": "h5",
    "categoryId": "society",
    "categoryName": "社会与治理",
    "domain": "social",
    "tier": 5,
    "title": "人口流动与安置",
    "summary": "建立人口流动与安置所需的共同方法，使诊疗、居住、照护和人口安置从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「基层服务网」",
      "先掌握「社区学校、诊疗和照护覆盖·跨地点复制」",
      "先掌握「偏远点服务中断与人员轮替·跨地点韧性证明」",
      "先掌握「区域行政协同」",
      "先掌握「区域食品网」",
      "让「基层服务网·区域互联枢纽」投入运行",
      "让「区域行政协同·区域互联枢纽」投入运行",
      "让「区域食品网·公共服务点」投入运行"
    ],
    "unlocks": "开放「安置点与跨区服务窗口」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会提高短期建设和用工成本，并把被忽视的差异暴露出来",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "基层服务网·区域互联枢纽",
      "区域行政协同·区域互联枢纽",
      "区域食品网·公共服务点"
    ]
  },
  {
    "id": "s1",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "science",
    "tier": 1,
    "title": "档案可读化",
    "summary": "建立档案可读化所需的共同方法，使档案、训练、实验和检验从临时应对进入可持续建设。",
    "requirements": [],
    "unlocks": "开放「档案室与图纸修复点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会抽走熟练劳力，且专业门槛可能形成新的排斥",
    "nextId": "s2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": []
  },
  {
    "id": "s2",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "science",
    "tier": 2,
    "title": "学徒训练",
    "summary": "建立学徒训练所需的共同方法，使档案、训练、实验和检验从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「档案可读化」",
      "先掌握「图纸修复、分类与检索·跨地点复制」",
      "先掌握「危险资料隔离与版本核验·跨地点韧性证明」",
      "先掌握「测量与互换件」",
      "让「档案可读化·训练与交接中心」投入运行",
      "让「测量与互换件·标准化改造」投入运行"
    ],
    "unlocks": "开放「学徒工坊与训练场」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会抽走熟练劳力，且专业门槛可能形成新的排斥",
    "nextId": "s3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "档案可读化·训练与交接中心",
      "测量与互换件·标准化改造"
    ]
  },
  {
    "id": "s3",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "science",
    "tier": 3,
    "title": "可复现实验",
    "summary": "建立可复现实验所需的共同方法，使档案、训练、实验和检验从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「学徒训练」",
      "先掌握「分级技能、实训与考核·跨地点复制」",
      "先掌握「事故教学、错配纠正与安全底线·跨地点韧性证明」",
      "先掌握「土地恢复」",
      "让「学徒训练·训练与交接中心」投入运行",
      "让「土地恢复·核心设施」投入运行"
    ],
    "unlocks": "开放「试验室与样本库」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会抽走熟练劳力，且专业门槛可能形成新的排斥",
    "nextId": "s4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "学徒训练·训练与交接中心",
      "土地恢复·核心设施"
    ]
  },
  {
    "id": "s4",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "science",
    "tier": 4,
    "title": "公共技术学校",
    "summary": "建立公共技术学校所需的共同方法，使档案、训练、实验和检验从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「可复现实验」",
      "先掌握「样本、对照、仪器和记录体系·跨地点复制」",
      "先掌握「失败复盘、数据审查与伦理边界·跨地点韧性证明」",
      "先掌握「劳动与居住保护」",
      "先掌握「申诉与裁决」",
      "让「可复现实验·训练与交接中心」投入运行",
      "让「劳动与居住保护·公共服务点」投入运行",
      "让「申诉与裁决·公共服务点」投入运行"
    ],
    "unlocks": "开放「技术学校与实践基地」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会抽走熟练劳力，且专业门槛可能形成新的排斥",
    "nextId": "s5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "可复现实验·训练与交接中心",
      "劳动与居住保护·公共服务点",
      "申诉与裁决·公共服务点"
    ]
  },
  {
    "id": "s5",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "science",
    "tier": 5,
    "title": "标准与检验机构",
    "summary": "建立标准与检验机构所需的共同方法，使档案、训练、实验和检验从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「公共技术学校」",
      "先掌握「多职业课程、教材与实践基地·跨地点复制」",
      "先掌握「教学质量、辍学与资源失衡处理·跨地点韧性证明」",
      "先掌握「工业维护体系」",
      "先掌握「服务预算」",
      "让「公共技术学校·标准化改造」投入运行",
      "让「工业维护体系·标准化改造」投入运行",
      "让「服务预算·区域互联枢纽」投入运行"
    ],
    "unlocks": "开放「检验所与认证站」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会抽走熟练劳力，且专业门槛可能形成新的排斥",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "公共技术学校·标准化改造",
      "工业维护体系·标准化改造",
      "服务预算·区域互联枢纽"
    ]
  },
  {
    "id": "x1",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "frontier",
    "tier": 1,
    "title": "灾害与污染勘察",
    "summary": "建立灾害与污染勘察所需的共同方法，使环境修复、接触和共同勘探从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「地表与水线测绘」",
      "先掌握「档案可读化」",
      "让「地表与水线测绘·现场测量站」投入运行",
      "让「档案可读化·现场测量站」投入运行"
    ],
    "unlocks": "开放「监测线与风险图点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会限制短期开发并引发资源权、边界和收益分配冲突",
    "nextId": "x2",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "地表与水线测绘·现场测量站",
      "档案可读化·现场测量站"
    ]
  },
  {
    "id": "x2",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "frontier",
    "tier": 2,
    "title": "污染隔离",
    "summary": "建立污染隔离所需的共同方法，使环境修复、接触和共同勘探从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「灾害与污染勘察」",
      "先掌握「地质、资源与风险样本·跨地点复制」",
      "先掌握「预警阈值、个人防护与数据核验·跨地点韧性证明」",
      "先掌握「可靠净水」",
      "让「灾害与污染勘察·安全控制站」投入运行",
      "让「可靠净水·核心设施」投入运行"
    ],
    "unlocks": "开放「封存、拦截与防护设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会限制短期开发并引发资源权、边界和收益分配冲突",
    "nextId": "x3",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "灾害与污染勘察·安全控制站",
      "可靠净水·核心设施"
    ]
  },
  {
    "id": "x3",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "frontier",
    "tier": 3,
    "title": "修复方法",
    "summary": "建立修复方法所需的共同方法，使环境修复、接触和共同勘探从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「污染隔离」",
      "先掌握「封存、拦截与安全处置·跨地点复制」",
      "先掌握「渗漏监控、人员防护与责任追溯·跨地点韧性证明」",
      "先掌握「种源恢复」",
      "先掌握「可复现实验」",
      "让「污染隔离·风险缓解设施」投入运行",
      "让「种源恢复·训练与交接中心」投入运行",
      "让「可复现实验·训练与交接中心」投入运行"
    ],
    "unlocks": "开放「修复区、湿地与工队」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会限制短期开发并引发资源权、边界和收益分配冲突",
    "nextId": "x4",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "污染隔离·风险缓解设施",
      "种源恢复·训练与交接中心",
      "可复现实验·训练与交接中心"
    ]
  },
  {
    "id": "x4",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "frontier",
    "tier": 4,
    "title": "邻近聚落接触",
    "summary": "建立邻近聚落接触所需的共同方法，使环境修复、接触和共同勘探从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「修复方法」",
      "先掌握「覆土、植物修复和湿地拦截·跨地点复制」",
      "先掌握「修复失败、二次污染与长期监测·跨地点韧性证明」",
      "先掌握「道路与桥渡」",
      "先掌握「工兵与救援」",
      "让「修复方法·标准化改造」投入运行",
      "让「道路与桥渡·跨区连接线」投入运行",
      "让「工兵与救援·标准化改造」投入运行"
    ],
    "unlocks": "开放「联络站与互助节点」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会限制短期开发并引发资源权、边界和收益分配冲突",
    "nextId": "x5",
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "修复方法·标准化改造",
      "道路与桥渡·跨区连接线",
      "工兵与救援·标准化改造"
    ]
  },
  {
    "id": "x5",
    "categoryId": "science",
    "categoryName": "科学、教育与外拓",
    "domain": "frontier",
    "tier": 5,
    "title": "区域勘探协约",
    "summary": "建立区域勘探协约所需的共同方法，使环境修复、接触和共同勘探从临时应对进入可持续建设。",
    "requirements": [
      "先掌握「邻近聚落接触」",
      "先掌握「贸易、翻译、医疗互助与信息交换·跨地点复制」",
      "先掌握「疾病、欺诈、渗透与接触事故处理·跨地点韧性证明」",
      "先掌握「区域行政协同」",
      "先掌握「区域警戒协作」",
      "让「邻近聚落接触·区域互联枢纽」投入运行",
      "让「区域行政协同·区域互联枢纽」投入运行",
      "让「区域警戒协作·跨区连接线」投入运行"
    ],
    "unlocks": "开放「联合勘探与协商设施」工程簇，并为下一层重大突破提供基础。",
    "limitation": "会限制短期开发并引发资源权、边界和收益分配冲突",
    "nextId": null,
    "branchCount": 15,
    "refinementCount": 4,
    "engineeringRequirements": [
      "邻近聚落接触·区域互联枢纽",
      "区域行政协同·区域互联枢纽",
      "区域警戒协作·跨区连接线"
    ]
  }
];

export const STAGE_1_POLICY_LINEAGES: PolicyLineage[] = [
  {
    "id": "policy-01",
    "theme": "livelihood",
    "versions": [
      {
        "version": "early",
        "title": "井口配给整顿",
        "summary": "在当前聚居地开展「井口配给整顿」，把有限人手和物资优先投向供给、照护和公共服务。",
        "requirements": [
          "先掌握「可靠净水」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "公共供给排程",
        "summary": "在聚居地与外拓点推行「公共供给排程」，把供给、照护和公共服务交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「可靠净水」",
          "让「可靠净水·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域基本供给章程",
        "summary": "在适用地区执行「区域基本供给章程」，统一供给、照护和公共服务的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域食品网」",
          "让「区域食品网·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-02",
    "theme": "livelihood",
    "versions": [
      {
        "version": "early",
        "title": "饮水与清洁轮值",
        "summary": "在当前聚居地开展「饮水与清洁轮值」，把有限人手和物资优先投向供给、照护和公共服务。",
        "requirements": [
          "先掌握「公共卫生」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "街区卫生服务",
        "summary": "在聚居地与外拓点推行「街区卫生服务」，把供给、照护和公共服务交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「公共卫生」",
          "让「公共卫生·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域公共卫生规程",
        "summary": "在适用地区执行「区域公共卫生规程」，统一供给、照护和公共服务的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「基层服务网」",
          "让「基层服务网·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-03",
    "theme": "livelihood",
    "versions": [
      {
        "version": "early",
        "title": "危险作业临时守则",
        "summary": "在当前聚居地开展「危险作业临时守则」，把有限人手和物资优先投向供给、照护和公共服务。",
        "requirements": [
          "先掌握「劳动与居住保护」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "工务安全与补偿令",
        "summary": "在聚居地与外拓点推行「工务安全与补偿令」，把供给、照护和公共服务交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「劳动与居住保护」",
          "让「劳动与居住保护·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域劳动与居住保障",
        "summary": "在适用地区执行「区域劳动与居住保障」，统一供给、照护和公共服务的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域行政协同」",
          "让「区域行政协同·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-04",
    "theme": "livelihood",
    "versions": [
      {
        "version": "early",
        "title": "临时来访登记",
        "summary": "在当前聚居地开展「临时来访登记」，把有限人手和物资优先投向供给、照护和公共服务。",
        "requirements": [
          "先掌握「人口与地点登记」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "安置与服务接续",
        "summary": "在聚居地与外拓点推行「安置与服务接续」，把供给、照护和公共服务交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「人口与地点登记」",
          "让「人口与地点登记·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "跨区迁入成员章程",
        "summary": "在适用地区执行「跨区迁入成员章程」，统一供给、照护和公共服务的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「人口流动与安置」",
          "让「人口流动与安置·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-05",
    "theme": "production",
    "versions": [
      {
        "version": "early",
        "title": "紧急维修轮班",
        "summary": "在当前聚居地开展「紧急维修轮班」，把有限人手和物资优先投向施工安全、维修、能源和劳动安排。",
        "requirements": [
          "先掌握「修理工务线」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "公共工务队列",
        "summary": "在聚居地与外拓点推行「公共工务队列」，把施工安全、维修、能源和劳动安排交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「修理工务线」",
          "让「修理工务线·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域维护优先级制度",
        "summary": "在适用地区执行「区域维护优先级制度」，统一施工安全、维修、能源和劳动安排的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「工业维护体系」",
          "让「工业维护体系·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-06",
    "theme": "production",
    "versions": [
      {
        "version": "early",
        "title": "现场师傅带训",
        "summary": "在当前聚居地开展「现场师傅带训」，把有限人手和物资优先投向施工安全、维修、能源和劳动安排。",
        "requirements": [
          "先掌握「学徒训练」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "学徒岗位计划",
        "summary": "在聚居地与外拓点推行「学徒岗位计划」，把施工安全、维修、能源和劳动安排交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「学徒训练」",
          "让「学徒训练·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "公共技术教育服务",
        "summary": "在适用地区执行「公共技术教育服务」，统一施工安全、维修、能源和劳动安排的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「公共技术学校」",
          "让「公共技术学校·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-07",
    "theme": "production",
    "versions": [
      {
        "version": "early",
        "title": "回收物交付规则",
        "summary": "在当前聚居地开展「回收物交付规则」，把有限人手和物资优先投向施工安全、维修、能源和劳动安排。",
        "requirements": [
          "先掌握「废料识别与分拣」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "危险拆解许可",
        "summary": "在聚居地与外拓点推行「危险拆解许可」，把施工安全、维修、能源和劳动安排交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「废料识别与分拣」",
          "让「废料识别与分拣·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域材料循环条例",
        "summary": "在适用地区执行「区域材料循环条例」，统一施工安全、维修、能源和劳动安排的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「工业维护体系」",
          "让「工业维护体系·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-08",
    "theme": "production",
    "versions": [
      {
        "version": "early",
        "title": "关键负荷优先表",
        "summary": "在当前聚居地开展「关键负荷优先表」，把有限人手和物资优先投向施工安全、维修、能源和劳动安排。",
        "requirements": [
          "先掌握「负荷清查」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "社区分区保电",
        "summary": "在聚居地与外拓点推行「社区分区保电」，把施工安全、维修、能源和劳动安排交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「负荷清查」",
          "让「负荷清查·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域保供与申诉机制",
        "summary": "在适用地区执行「区域保供与申诉机制」，统一施工安全、维修、能源和劳动安排的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域公用网调度」",
          "让「区域公用网调度·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-09",
    "theme": "governance",
    "versions": [
      {
        "version": "early",
        "title": "公共物资告示",
        "summary": "在当前聚居地开展「公共物资告示」，把有限人手和物资优先投向登记、预算、申诉和公共监督。",
        "requirements": [
          "先掌握「公共账目」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "工程与劳力核账日",
        "summary": "在聚居地与外拓点推行「工程与劳力核账日」，把登记、预算、申诉和公共监督交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「公共账目」",
          "让「公共账目·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域预算公开制度",
        "summary": "在适用地区执行「区域预算公开制度」，统一登记、预算、申诉和公共监督的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「服务预算」",
          "让「服务预算·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-10",
    "theme": "governance",
    "versions": [
      {
        "version": "early",
        "title": "配给争议临时调解",
        "summary": "在当前聚居地开展「配给争议临时调解」，把有限人手和物资优先投向登记、预算、申诉和公共监督。",
        "requirements": [
          "先掌握「申诉与裁决」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "工程损害申诉程序",
        "summary": "在聚居地与外拓点推行「工程损害申诉程序」，把登记、预算、申诉和公共监督交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「申诉与裁决」",
          "让「申诉与裁决·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "巡回裁决与复核制度",
        "summary": "在适用地区执行「巡回裁决与复核制度」，统一登记、预算、申诉和公共监督的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域行政协同」",
          "让「区域行政协同·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-11",
    "theme": "governance",
    "versions": [
      {
        "version": "early",
        "title": "邻里事务会议",
        "summary": "在当前聚居地开展「邻里事务会议」，把有限人手和物资优先投向登记、预算、申诉和公共监督。",
        "requirements": [
          "先掌握「人口与地点登记」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "街区服务委员会",
        "summary": "在聚居地与外拓点推行「街区服务委员会」，把登记、预算、申诉和公共监督交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「人口与地点登记」",
          "让「人口与地点登记·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "有限自治执行章程",
        "summary": "在适用地区执行「有限自治执行章程」，统一登记、预算、申诉和公共监督的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域行政协同」",
          "让「区域行政协同·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-12",
    "theme": "governance",
    "versions": [
      {
        "version": "early",
        "title": "紧急物资询价",
        "summary": "在当前聚居地开展「紧急物资询价」，把有限人手和物资优先投向登记、预算、申诉和公共监督。",
        "requirements": [
          "先掌握「公共账目」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "工务公开采购",
        "summary": "在聚居地与外拓点推行「工务公开采购」，把登记、预算、申诉和公共监督交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「公共账目」",
          "让「公共账目·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域公共采购与检验制度",
        "summary": "在适用地区执行「区域公共采购与检验制度」，统一登记、预算、申诉和公共监督的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「标准与检验机构」",
          "让「标准与检验机构·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-13",
    "theme": "mobility_security",
    "versions": [
      {
        "version": "early",
        "title": "临时同行护送",
        "summary": "在当前聚居地开展「临时同行护送」，把有限人手和物资优先投向道路、护运、巡查和应急防卫。",
        "requirements": [
          "先掌握「护运规程」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "标准护运交接",
        "summary": "在聚居地与外拓点推行「标准护运交接」，把道路、护运、巡查和应急防卫交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「护运规程」",
          "让「护运规程·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域通道安全服务",
        "summary": "在适用地区执行「区域通道安全服务」，统一道路、护运、巡查和应急防卫的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域警戒协作」",
          "让「区域警戒协作·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-14",
    "theme": "mobility_security",
    "versions": [
      {
        "version": "early",
        "title": "灾后互助轮班",
        "summary": "在当前聚居地开展「灾后互助轮班」，把有限人手和物资优先投向道路、护运、巡查和应急防卫。",
        "requirements": [
          "先掌握「工兵与救援」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "专业救援优先序",
        "summary": "在聚居地与外拓点推行「专业救援优先序」，把道路、护运、巡查和应急防卫交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「工兵与救援」",
          "让「工兵与救援·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域救援与恢复协定",
        "summary": "在适用地区执行「区域救援与恢复协定」，统一道路、护运、巡查和应急防卫的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域调度网」",
          "让「区域调度网·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-15",
    "theme": "mobility_security",
    "versions": [
      {
        "version": "early",
        "title": "风险点巡查",
        "summary": "在当前聚居地开展「风险点巡查」，把有限人手和物资优先投向道路、护运、巡查和应急防卫。",
        "requirements": [
          "先掌握「风险观察哨」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "联合值守规则",
        "summary": "在聚居地与外拓点推行「联合值守规则」，把道路、护运、巡查和应急防卫交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「风险观察哨」",
          "让「风险观察哨·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "公民防卫监督规程",
        "summary": "在适用地区执行「公民防卫监督规程」，统一道路、护运、巡查和应急防卫的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「公民防卫体系」",
          "让「公民防卫体系·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-16",
    "theme": "mobility_security",
    "versions": [
      {
        "version": "early",
        "title": "关键设施看护",
        "summary": "在当前聚居地开展「关键设施看护」，把有限人手和物资优先投向道路、护运、巡查和应急防卫。",
        "requirements": [
          "先掌握「护运训练」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "设施故障与破坏响应",
        "summary": "在聚居地与外拓点推行「设施故障与破坏响应」，把道路、护运、巡查和应急防卫交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「护运训练」",
          "让「护运训练·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域关键服务防护制度",
        "summary": "在适用地区执行「区域关键服务防护制度」，统一道路、护运、巡查和应急防卫的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域公用网调度」",
          "让「区域公用网调度·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-17",
    "theme": "ecology_frontier",
    "versions": [
      {
        "version": "early",
        "title": "取水点不破坏约定",
        "summary": "在当前聚居地开展「取水点不破坏约定」，把有限人手和物资优先投向土地恢复、污染处置和环境监测。",
        "requirements": [
          "先掌握「土地恢复」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "街区节水与排污规则",
        "summary": "在聚居地与外拓点推行「街区节水与排污规则」，把土地恢复、污染处置和环境监测交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「土地恢复」",
          "让「土地恢复·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "跨镇流域共同规约",
        "summary": "在适用地区执行「跨镇流域共同规约」，统一土地恢复、污染处置和环境监测的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「流域治理」",
          "让「流域治理·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-18",
    "theme": "ecology_frontier",
    "versions": [
      {
        "version": "early",
        "title": "污染点临时隔离",
        "summary": "在当前聚居地开展「污染点临时隔离」，把有限人手和物资优先投向土地恢复、污染处置和环境监测。",
        "requirements": [
          "先掌握「污染隔离」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "修复工队工作规则",
        "summary": "在聚居地与外拓点推行「修复工队工作规则」，把土地恢复、污染处置和环境监测交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「污染隔离」",
          "让「污染隔离·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域污染责任与补偿制度",
        "summary": "在适用地区执行「区域污染责任与补偿制度」，统一土地恢复、污染处置和环境监测的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「修复方法」",
          "让「修复方法·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-19",
    "theme": "ecology_frontier",
    "versions": [
      {
        "version": "early",
        "title": "外出勘察登记",
        "summary": "在当前聚居地开展「外出勘察登记」，把有限人手和物资优先投向土地恢复、污染处置和环境监测。",
        "requirements": [
          "先掌握「灾害与污染勘察」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "邻近聚落接触准则",
        "summary": "在聚居地与外拓点推行「邻近聚落接触准则」，把土地恢复、污染处置和环境监测交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「灾害与污染勘察」",
          "让「灾害与污染勘察·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域勘探收益与退出协约",
        "summary": "在适用地区执行「区域勘探收益与退出协约」，统一土地恢复、污染处置和环境监测的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「区域勘探协约」",
          "让「区域勘探协约·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  },
  {
    "id": "policy-20",
    "theme": "ecology_frontier",
    "versions": [
      {
        "version": "early",
        "title": "施工损害记录",
        "summary": "在当前聚居地开展「施工损害记录」，把有限人手和物资优先投向土地恢复、污染处置和环境监测。",
        "requirements": [
          "先掌握「土地恢复」"
        ],
        "duration": "执行 21 日，到期后到期复核、续期或归档。",
        "limitation": "挤占未被列入优先序的需求，并需要公开解释"
      },
      {
        "version": "capable",
        "title": "受影响地块修复承诺",
        "summary": "在聚居地与外拓点推行「受影响地块修复承诺」，把土地恢复、污染处置和环境监测交给固定设施和岗位持续安排。",
        "requirements": [
          "先掌握「土地恢复」",
          "让「土地恢复·公共服务点」投入运行"
        ],
        "duration": "执行 45 日，到期后旧版本自动归档；按绩效转入制度版本或撤销。",
        "limitation": "增加维护、记录和申诉处理负担"
      },
      {
        "version": "institutional",
        "title": "区域生态补偿与复核规则",
        "summary": "在适用地区执行「区域生态补偿与复核规则」，统一土地恢复、污染处置和环境监测的服务标准、记录方式和例外申报。",
        "requirements": [
          "先掌握「修复方法」",
          "让「修复方法·区域互联枢纽」投入运行"
        ],
        "duration": "执行 90 日，到期后按区域评估续行、修订或废止。",
        "limitation": "规则过硬会压制现场知识，必须保留复核与例外渠道"
      }
    ]
  }
];

export function majorDiscoveriesFor(categoryId: DiscoveryCategoryId): MajorDiscovery[] {
  return STAGE_1_MAJOR_DISCOVERIES.filter((entry) => entry.categoryId === categoryId);
}
