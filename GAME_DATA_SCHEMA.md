# Always Game 数据模型规格

> **版本**：0.1  
> **状态**：G0-04 核心规格  
> **目的**：为主战役 v2 建立可序列化、可离线结算、可复现随机和可迁移存档的数据边界。字段是产品契约；具体 TypeScript 写法可由 DeepSeek 实现，但不得减少含义。
>
> **适用范围更正（2026-08-16）：** 文中出现的河谷、开局名称和样例字段仅代表旧测试夹具，不能作为通用数据来源。新增数据与实现必须遵守 `STANDARDIZATION_AND_SCENARIO_SEPARATION.md`：世界模板、战役模板、剧本夹具与呈现层分离，显示名称不作为逻辑主键。

## 1. 顶层存档

```ts
CampaignSaveV2 {
  version: 2
  seed: number
  startedAt: timestamp
  clock: { eraId, year, period, elapsed, lastSavedAt, speed }
  player: PlayerCommandState
  nation: NationState
  map: PlanetMapState
  projects: ProjectState[]
  technology: TechnologyState
  events: EventState
  reports: ReportState
  history: HistoryState
}
```

- `seed` 是一局确定的所有程序化地图、名称、随机抽样和事件抛掷的根；禁止在核心结算中直接使用不可复现的随机源。
- `clock` 将真实时间/离线时间转换为计划期进度；叙事年份可压缩，但必须记录时间推进的原因和上限。
- `version` 只增不减；加载旧版本必须迁移、归档为旧模式，或明确提示不可兼容，禁止静默重置。

## 2. 玩家命令：唯一可直接编辑的战略状态

```ts
PlayerCommandState {
  primaryDirection: DirectionId
  secondaryDirection: DirectionId | null
  plan: {
    id: string
    name: string
    startedAt: GameDate
    target: PlanTargetId
    priority: 'stable' | 'focused' | 'emergency'
    inertia: number // 0..100；切换方向/项目留下的组织阻力
  }
  flagshipProjectId: string | null
  policy: {
    rationing: 'survival' | 'labor' | 'mixed'
    admission: 'cautious' | 'quota' | 'open'
    education: 'apprentice' | 'balanced' | 'technical'
    laborProtection: 'emergency' | 'basic' | 'strict'
    housing: 'site' | 'community' | 'public'
  }
  security: {
    posture: 'low' | 'escort' | 'heightened'
    civilianProtection: 'standard' | 'strict'
    mobilization: 'standing' | 'reinforced' | 'emergency'
  }
  pinnedMapLayer: MapLayerId
}
```

`PlayerCommandState` 不能直接含有“建造第 X 格”“派遣第 Y 个居民”“攻击第 Z 个单位”等字段。

## 3. 国家状态：资源、能力与债务

```ts
NationState {
  name: string // 开局：河谷应急协调会
  stage: 'shelter_outreach' | 'settlement' | 'city_state' | ...
  population: PopulationState
  resources: ResourceLedger
  capacities: CapacityState
  debts: DebtState
  institutions: InstitutionState
  military: MilitaryState
  diplomacy: DiplomacyState
}
```

### 3.1 资源账户

```ts
ResourceLedger {
  safeWater, calories, bioLandCapital, reclaimedMaterial,
  precisionParts, effectiveLabor, publicCredit: LedgerValue
}
LedgerValue { stock, income, demand, reserveTarget, trend, notes[] }
```

早期不强制把所有资源拆成几十种物料；若有钢、铜、滤芯等细项，归属在 `reclaimedMaterial` / `precisionParts` 的明细中。UI 首先显示账户和趋势，细项在项目卡、地区报告和科技前置中展开。

### 3.2 六项国家能力与债务

```ts
CapacityState {
  materialBase, knowledgeBase, coerciveCapacity,
  integrationCapacity, socialCapacity, logisticsResilience: Score
}
DebtState {
  maintenance, ecology, housing, trust, military, integration: Score
}
Score { value: 0..100, trend: -1|0|1, causes: CauseRef[] }
```

能力是派生结果；债务是延迟风险池。实现不能允许“提高军力”直接提高全部安全结算，也不能在无维护成本时永久提高能力。

### 3.3 人口与机构

```ts
PopulationState {
  registered, temporary, children, careDependents,
  healthyWorkforce, housingPressure: number
  skills: { maintenance, food, medicine, surveying, education,
            accounting, security, logistics }
  sentiments: { trust, fairness, fatigue, belonging }
}

InstitutionState {
  seats: Record<SeatId, InstitutionUnit>
  laws: LawTag[]
  standards: StandardTag[]
}
InstitutionUnit { capacity, workload, competence, transparency, backlog }
```

`SeatId` 初始固定为统筹与账目、水土与生计、维修与工务、档案与学徒、警戒与救援、接触与调解。后期可演进为部/署/庭，但保留功能映射，以便历史遗产和事件继续生效。

## 4. 星球画布数据

```ts
PlanetMapState {
  seed: number
  macroGrid: MacroGridState
  localPatches: Record<RegionId, LocalPatchDelta>
  regions: RegionState[]
  cities: CityState[]
  networks: NetworkEdge[]
  camera: { zoom, rotation, pitch, selectedId }
  discovered: Set<CellId | RegionId | CityId>
}

MacroGridState {
  width: 512
  height: 256
  terrainSeed: number
  // 紧凑数组；地形可由 seed 推导，动态层按索引存储
  politicalStatusLayer, controllerLayer, regionLayer,
  integrationLayer, discoveryLayer, hazardLayer
}

LocalPatchDelta {
  regionId, seed, origin, cellKm: 1, width: 128, height: 128,
  // 只记录已知/玩家改变的局部状态；未记录部分由种子重建
  discoveries, infrastructureChanges, ecologicalChanges, siteRefs
}
```

`macroGrid` 保留现有球面地图按格命中、迷雾和程序化地形的技术优势，但以 512×256（赤道约 78 km/格）的紧凑战略格取代当前 26×16 的大陆级粗格。它不是玩家摆放建筑的施工网格。渲染层从 `regions`、`cities`、`networks` 聚合信息后显示颜色、纹理、图标和轮廓；地区放大时才读取/生成 `localPatches`。

```ts
RegionState {
  id, name, cellIds, status, controllerId,
  execution: { quality, informationQuality, compliance, localAdaptation },
  integration: { security, registry, services, justice },
  pressures: { housing, ecology, security, resentment },
  focusTags: RegionFocusTag[]
}

CityState {
  id, name, regionId, anchorCellId,
  location: { lon, lat }, footprintKm2,
  type: 'shelter'|'outpost'|'river_valley'|'agricultural'|'mining'|
        'workshop'|'logistics'|'knowledge'|'metropolis',
  tier: 0..5,
  population, housing, services, employment,
  functionClusters: { residential, lifeSupport, industry, food,
                      logistics, knowledge, health, security },
  localIssues: IssueRef[], projectIds: string[]
}
```

`politicalStatus` 取值：`direct | compact | contested | foreign | unknown`。统一后仍保留 `RegionState.integration`，让城市/地区有不同的执行质量和统合压力。`CityState.location` 与 `footprintKm2` 是真实尺度表达；远景图标允许为可读性放大，但近景轮廓按相对占地生成。

```ts
NetworkEdge {
  id, type: 'road'|'rail'|'water'|'power'|'comms'|'supply',
  fromId, toId, level, capacity, condition, securityRisk
}
```

## 5. 项目、科技、势力与战争

```ts
ProjectState {
  id, definitionId, name, ownerScope: 'nation'|'region'|'city',
  stage: 'survey'|'approved'|'building'|'commissioning'|'operating'|'stalled',
  priority, progress, effectiveInput, requiredInputs,
  maintenanceNeed, dependencies, risks, effects
}

TechnologyState {
  nodes: Record<TechId, TechProgress>
  focus: TechClusterId | null
  riskStyle: 'cautious'|'balanced'|'breakthrough'
}
TechProgress {
  maturity: 'theory'|'prototype'|'replicable'|'scaled'|'integrated',
  progress, prerequisites, bottlenecks, maintenanceLoad, unlockedEffects
}

FactionState {
  id, name, color, territoryRegionIds,
  stance: 'contact'|'neutral'|'cooperative'|'tense'|'hostile'|'war',
  interests, capabilities, agreements, trust, grievances
}

MilitaryState {
  posture, mobilization,
  intelligence, readiness, supply, discipline, civilianProtection,
  theatres: TheatreState[]
}
TheatreState { target, objective, status, logistics, civilianImpact, integrationProgress }
```

`FactionState.capabilities` 必须至少包括物资/工业、人口/动员、情报、道路/航线、武装和社会支持；禁止只用单一 `military` 数字判定战争结果。

## 6. 事件、报告与历史遗产

```ts
EventState {
  active: ActiveEvent | null
  scheduledHardNodes: HardNodeState[]
  conditionalPool: EventId[]
  cooldowns: Record<EventId, GameDate>
  latentRisks: LatentRisk[]
}

ReportState {
  currentPeriod: ReportDraft
  archive: Report[]
}
Report {
  id, period, commandSummary, resourceLedger, executionVariance,
  peopleLedger, riskLedger, mapChanges, choices, historicalLegacy
}

HistoryState {
  tags: HistoryTag[]
  milestones: MilestoneId[]
  decisions: DecisionRecord[]
}
```

`latentRisks` 是维护债、生态债、住房债、军政债、统合债等在未来转化为条件事件的记录。每一条必须带有来源、暴露地区、触发条件和可缓解方法，禁止纯随机惩罚。

## 7. 计算边界与离线结算

- 核心模拟只能读写本数据模型，不得依赖 Canvas、React 或 DOM。
- 画布只消费聚合状态；每帧不得重新计算人口、项目、外交和地图地形。
- 离线追赶按固定步长批处理，在最大结算窗口后生成一份压缩报告；若跨越硬节点或危机，暂停并等待玩家选择。
- 随机事件使用 `seed + period + eventStream` 派生，报告记录抽样键，使同一存档可复现和调试。

## 8. v1 原型到 v2 主战役的迁移策略

现有 `GameState` 服务于“三人殖民地—地块扩张—太阳系—银河”的演示，不能静默伪装成新主战役存档。

| v1 数据 | v2 处理 | 原因 |
|---|---|---|
| `colonists`、逐人需求、建筑格 | 不迁入；仅作为开发期技术参考与本地备份数据 | 主战役不逐人微操，且开局人口为 31 人共同体 |
| `resources`（木/钢/零件/食物等） | 映射为资源账户的初始明细；不承诺数值等价 | 新系统以水、热量、备件、劳力与信用为核心 |
| `world.tiles`、地形、道路、据点 | 保留 seed/格地形与道路生成思想，迁为 `PlanetMapState` | 可复用 Canvas 和程序化地图资产 |
| `factions.relation/military` | 迁为势力立场、利益、能力和协议；必要时重新生成 | 单一好感/军力无法支持外交和统合 |
| `research.done` | 映射为科技成熟度参考或归档，不直接给 v2 全部解锁 | 防止旧原型科技破坏新能力链 |
| 旧存档 | 识别版本、原文件备份、显示“旧原型已退役，不能载入新主战役”提示；不提供旧模式入口 | 防止数据丢失，同时避免两套产品循环并存 |

## 9. 第一份实施任务的数据最小集

P1-S01 只实现以下对象的最小可用版本：

- 一个 `CampaignSaveV2`，31 人河谷开局；
- 6 个资源账户、6 项国家能力、5 类债务；
- 1 个核心地区、1 个合作/争议社群、1 个环境风险区、3 个城市/设施节点；
- 五类玩家指令的基础字段；
- 4 个旗舰工程、5 个基础法令、3 层科技成熟度（理论/原型/可复制）；
- 3 个地图层、1 个固定硬节点、3 个条件/环境事件；
- 1 份可存档、可复现的河谷统合报告。

后续系统不得以“预留未来银河”为由提前加入数千星系、完整舰队或全量科技树数据。
