// ============ P1-S01 v2 主战役数据模型（最小可用集） ============
// 字段契约遵循 GAME_DATA_SCHEMA.md 第 8/9 章；本切片只实现 UI 纵切所需的最小集。

export type MapLayerId = 'political' | 'population' | 'ecology';

export type ResourceId =
  | 'safeWater'
  | 'calories'
  | 'bioLandCapital'
  | 'reclaimedMaterial'
  | 'precisionParts'
  | 'effectiveLabor'
  | 'publicCredit';

export type DangerLevel = 'normal' | 'warn' | 'danger';

export interface LedgerValue {
  stock: number;
  /** 每计划期净收入（正=结余，负=缺口） */
  income: number;
  /** 每计划期需求 */
  demand: number;
  /** 储备目标 */
  reserveTarget: number;
  /** -1 下降 / 0 平稳 / +1 上升 */
  trend: -1 | 0 | 1;
  danger: DangerLevel;
  /** 主要来源 */
  sources: string[];
  /** 主要缺口 */
  gaps: string[];
}

export type ResourceLedger = Record<ResourceId, LedgerValue>;

export interface PopulationState {
  registered: number;
  temporary: number;
  children: number;
  careDependents: number;
  healthyWorkforce: number;
  housingPressure: number;
}

export interface Score {
  value: number; // 0..100
  trend: -1 | 0 | 1;
}

export interface CapacityState {
  materialBase: Score;
  knowledgeBase: Score;
  coerciveCapacity: Score;
  integrationCapacity: Score;
  socialCapacity: Score;
  logisticsResilience: Score;
}

export interface DebtState {
  maintenance: Score;
  ecology: Score;
  housing: Score;
  trust: Score;
  military: Score;
  integration: Score;
}

export interface NationState {
  name: string;
  stage: string;
  population: PopulationState;
  resources: ResourceLedger;
  capacities: CapacityState;
  debts: DebtState;
}

export type DirectionId = 'survival' | 'balanced' | 'science' | 'industry' | 'military' | 'space';
export type ProjectId = 'water_life' | 'seed_protein' | 'workshop_calib' | 'archive_beacon';
export type PolicyId = 'mixed_ration' | 'cautious_register' | 'apprentice_first' | 'labor_protection' | 'community_housing';
export type SecurityPostureId = 'low' | 'escort' | 'heightened';

export interface PlayerCommandState {
  primaryDirection: DirectionId;
  secondaryDirection: DirectionId | null;
  flagshipProjectId: ProjectId | null;
  policyId: PolicyId;
  securityPosture: SecurityPostureId;
}

export type NodeKind = 'shelter' | 'outpost' | 'waypoint';
export type PoliticalStatus = 'direct' | 'compact' | 'contested';

export interface MapNode {
  id: string;
  name: string;
  kind: NodeKind;
  regionId: string;
  /** 经度（度，东经为正） */
  lon: number;
  /** 纬度（度，北纬为正） */
  lat: number;
  politicalStatus: PoliticalStatus;
  /** 地图符号：井口环 / 聚居灯火 / 临时灯火 */
  symbol: 'wellhead' | 'warmlight' | 'waylight';
  /** 对象浮窗内容 */
  statusLine: string;
  facts: string[];
  bottleneck: string;
  nextRisk: string;
  actions: string[];
}

export type RegionStatus = 'direct' | 'compact' | 'contested';

export interface Region {
  id: string;
  name: string;
  status: RegionStatus;
  /** 闭合多边形（度），用于政治/生态覆盖层 */
  outline: [number, number][];
  description: string;
}

export interface ProjectDef {
  id: ProjectId;
  name: string;
  benefit: string;
  cost: string;
  risk: string;
}

export interface PolicyDef {
  id: PolicyId;
  name: string;
  desc: string;
}

export interface DirectionDef {
  id: DirectionId;
  name: string;
  desc: string;
}

export type LogSeverity = 'info' | 'warn' | 'danger';

export interface V2LogEntry {
  id: number;
  /** 如 "第 1 期" */
  period: string;
  /** 地点/机构 */
  place: string;
  /** 事实摘要 */
  summary: string;
  severity: LogSeverity;
  /** 关联节点 id（用于点击定位） */
  nodeId?: string;
}

export interface Clock {
  eraId: 'ember';
  year: number;
  period: number;
  /** 已模拟游戏秒（累计） */
  elapsed: number;
  speed: 0 | 1 | 2 | 4;
}

export interface CampaignSaveV2 {
  version: number;
  seed: number;
  startedAt: number;
  lastSavedAt: number;
  clock: Clock;
  player: PlayerCommandState;
  nation: NationState;
  nodes: MapNode[];
  regions: Region[];
  activeLayers: MapLayerId[];
  log: V2LogEntry[];
  logUnread: number;
  /** 是否已展示过旧原型退役提示 */
  retiredNoticeShown: boolean;
}

// ============ P1-S02 计划期结算闭环类型 ============
export type CapacityId = keyof CapacityState;
export type DebtId = keyof DebtState;

export interface PlanPeriodReport {
  year: number;
  period: number;
  command: PlayerCommandState;
  resourceDelta: Record<ResourceId, number>;
  capacityDelta: Record<CapacityId, number>;
  debtDelta: Record<DebtId, number>;
  project: { id: ProjectId; name: string; progressFrom: number; progressTo: number; efficiency: number } | null;
  event: { id: string; name: string; summary: string } | null;
  reasons: string[];
  seedKey: string;
}

export interface CampaignSaveV3 extends CampaignSaveV2 {
  version: number;
  projectProgress: Record<ProjectId, number>;
  reports: PlanPeriodReport[];
  settlementCount: number;
  eventFlags: Record<string, boolean>;
}

export interface SettlementResult {
  newState: CampaignSaveV4;
  report: PlanPeriodReport | null;
  logEntries: V2LogEntry[];
  summary: string;
}

export interface SettlementPreview {
  directionName: string;    // 本期重点
  projectName: string;      // 重点工程
  stressedLiving: { kind: 'water' | 'food' | 'repair'; name: string; detail: string } | null;
  squeezedWork: { name: string; delta: number } | null;
  event: { id: string; name: string } | null;
  summary: string;
}

// ============ P1-S03A 真实时间与玩家语言 ============
export interface PeriodSnapshot {
  resources: Record<ResourceId, number>;
  capacities: Record<CapacityId, number>;
  debts: Record<DebtId, number>;
  projectProgress: Record<ProjectId, number>;
}

/** 冻结在计划开始时的常规修正（P1-S02 步骤 1–4 的期总量），按 60 日均摊 */
export interface PeriodBudget {
  resourceDelta: Record<ResourceId, number>;
  capacityDelta: Record<CapacityId, number>;
  debtDelta: Record<DebtId, number>;
  projectId: ProjectId | null;
  projectStep: number;
  efficiency: number;
}

export type PausedReason = 'awaiting_plan' | 'manual' | 'period_end' | 'event';

export interface RuntimeState {
  activeCommand: PlayerCommandState | null;
  dayInPeriod: number;         // 0..60；0 表示等待计划
  dayRemainder: number;        // 0..1，日推进浮点余量
  weeklyStart: PeriodSnapshot | null;
  periodStart: PeriodSnapshot | null;
  pausedReason: PausedReason | null;   // null = 正在执行
  startedPeriod: { year: number; period: number } | null;
  budget: PeriodBudget | null;
  /** 本期已触发的事件（期末写入报告） */
  periodEvent: { id: string; name: string; summary: string; place: string } | null;
}

export interface LivingState {
  waterDays: number;
  foodDays: number;
  shelteredBeds: number;   // P1-S03A 固定为 31
  repairBacklog: number;   // 映射维护债，0..100
}

export interface CampaignSaveV4 extends CampaignSaveV3 {
  version: 4;
  runtime: RuntimeState;
  living: LivingState;
}

export interface RuntimeStepResult {
  newState: CampaignSaveV4;
  periodEnded: boolean;
}

// ============ P1-S03C 持续运行国家指标 ============
export type MetricId =
  | 'livelihood' | 'industry' | 'energy' | 'research'
  | 'administration' | 'logistics' | 'military' | 'stability' | 'ecology';

export type FocusId = 'survival' | 'balanced' | 'industry' | 'science' | 'military';

export interface MetricValue {
  value: number;        // 0..100
  dailyRate: number;    // 每日变化率（展示用）
  sources: string[];
  bottleneck: string;
}

export interface FocusState {
  id: FocusId;
  transitionDaysRemaining: number;   // 10 → 0
  transitionEfficiency: number;      // 0.65 → 1.00
}

export interface SlotState {
  id: string | null;                 // 工程/科研 ID，或 null = 未指定
  progress: number;                  // 0..100
  handoverDays: number;              // 3 → 0（交接）
  milestones: { p25: boolean; p50: boolean; p75: boolean; p100: boolean };
}

export interface NationEventCard {
  id: string;
  location: string;
  cause: string;
  affectedMetric: MetricId;
  consequence: string;
  suggestion: string;
  warningDay: number;   // 预警日（游戏日）
  active: boolean;
}

export interface CampaignSaveV5 extends CampaignSaveV2 {
  version: 5;
  /** 总游戏日（1 起）；period/year 由它派生，只作报告序号 */
  day: number;
  focus: FocusState;
  project: SlotState;
  research: SlotState;
  metrics: Record<MetricId, MetricValue>;
  population: number;
  events: NationEventCard[];
  /** 仅开发用：迁移旧资源/债务的说明，玩家不显示 */
  migrationNote?: string;
}

// ============ P1-S03 R2：v6 可复现国家内核 ============
// v5 仍供退役界面读取；v6 不复用 v5 的旧资源账、旧债务或单一槽位语义。
export type V6TechId =
  | 'valley_survey' | 'archive_protocols' | 'membrane_reuse' | 'field_recovery'
  | 'maintenance_training' | 'shortwave_protocol' | 'public_health' | 'night_transit';
export type V6ProjectId = 'water_main' | 'valley_greenhouse' | 'ferry_workshop' | 'well_radio_tower';
export type V6PolicyId = 'valley_hunt' | 'well_rationing' | 'public_sanitation' | 'night_convoy';
export type FacilityId = 'water_main' | 'valley_greenhouse' | 'ferry_workshop' | 'well_radio_tower';
export type RunMode = 'manual' | 'auto';
export type WorkStatus = 'locked' | 'available' | 'active' | 'stalled' | 'completed';
export type FacilityStage = 'locked' | 'planned' | 'construction' | 'trial' | 'operational' | 'damaged';
export type NotificationKind = 'milestone' | 'completion' | 'policy' | 'event' | 'system' | 'report';

export interface SlotRuntime<Id extends string> {
  id: Id | null;
  mode: RunMode;
  progressWork: number;
  status: 'idle' | 'active' | 'stalled';
  handoverDays: number;
  /** 完成后的下一日才允许自动选择，避免同日连跳。 */
  autoEligibleDay: number | null;
  /** 自动槽已经告知玩家正在等待前置；在条件变化前不重复刷日志。 */
  waitingForUnlock: boolean;
}

export interface ActivePolicyState {
  id: V6PolicyId;
  daysRemaining: number;
  startedDay: number;
}

export interface FacilityRuntime {
  stage: FacilityStage;
  reachedMilestones: Array<25 | 50 | 75 | 100>;
  damagedBy: string | null;
}

export interface SupplyRuntime {
  scale: { era: 'settlement'; unit: 'LDU'; dailyDemand: number; labelId: string };
  coverage: { water: number; food: number; energy: number; maintenance: number };
}

export interface Notification {
  id: string;
  day: number;
  kind: NotificationKind;
  copyKey: string;
  params: Record<string, string | number>;
}

export interface V6EventRuntime {
  id: string;
  active: boolean;
  resolved: boolean;
}

// ============ R4.1：可存档的地理蓝图 ============
// 蓝图保存“世界为什么长成这样”的少量结构数据；渲染位图永远由它重建，不进入存档。
export type TerrainRegionKind = 'ocean' | 'coast' | 'plain' | 'river_valley' | 'highland' | 'mountain' | 'forest' | 'arid' | 'tundra';
export type ClimateKind = 'polar' | 'cold' | 'temperate' | 'arid' | 'tropical';
export type TerrainEdge = 'ocean' | 'coast' | 'plain' | 'river' | 'ridge' | 'highland' | 'forest' | 'arid' | 'tundra';
export type SiteAnchorKind = 'shelter' | 'settlement' | 'crossing' | 'harbor' | 'dam' | 'mine' | 'farm';

/** 世界生成的物理前提；它是地图、气候、农业与航运数据的共同基准。 */
export interface PlanetProfile {
  radiusKm: number;
  gravityG: number;
  axialTiltDeg: number;
  dayHours: number;
  yearDays: number;
  oceanTarget: number;
  tectonicActivity: 'low' | 'active' | 'high';
}

export interface BlueprintLandmass {
  id: string;
  center: [number, number];
  radius: [number, number];
  continentalness: number;
}

export interface BlueprintRange {
  id: string;
  /** 山系必须能追溯到构造边界；仅用于显示的山脊不允许成为自然事实源。 */
  sourceBoundaryId: string;
  ridge: [number, number][];
  width: number;
  height: number;
}

/** 生成世界时冻结的板块。漂移向量是相对运动方向，用来解释边界类型，而非逐帧移动地图。 */
export interface TectonicPlate {
  id: string;
  crust: 'continental' | 'oceanic';
  center: [number, number];
  drift: [number, number];
}

/** 构造边界是山脉、裂谷和断裂带的唯一自然来源，可被资源、灾害和工程系统查询。 */
export interface TectonicBoundary {
  id: string;
  kind: 'convergent' | 'divergent' | 'transform';
  plates: [string, string];
  path: [number, number][];
  width: number;
  intensity: number;
}

export interface BlueprintWatershed {
  id: string;
  source: [number, number];
  mouth: [number, number];
  path: [number, number][];
  /** 路径各节点的归一化海拔；必须由源头向出口不升高。 */
  elevations: number[];
  drainage: 'ocean' | 'inland_basin';
}

/** 一条可由球面格重建的主要流域；只保存河道格序列，不把整张水文栅格塞入存档。 */
export interface HydrologyBasin {
  id: string;
  source: 'generated' | 'anchored';
  drainage: 'ocean' | 'inland_basin';
  cellIds: string[];
  estimatedDischarge: number;
}

/**
 * 全球水文的冻结索引。每格下泄与汇水量可由 world seed/地形/skeleton 确定性重建；
 * 存档只保留玩家需要看见、工程需要引用的河道、湖泊与主要流域。
 */
export interface HydrologyNetwork {
  version: 1;
  gridSubdivision: 5;
  riverCellIds: string[];
  lakeCellIds: string[];
  basins: HydrologyBasin[];
}

/** 自然生态带由气候、高程和水文派生；它不是地图贴图分类。 */
export type BiomeKind = 'ice' | 'tundra' | 'arid' | 'shrubland' | 'grassland' | 'temperate_forest' | 'tropical_forest' | 'wetland' | 'coast';
export type ResourcePotentialKind = 'freshwater' | 'arable_land' | 'timber' | 'metal_ore' | 'geothermal' | 'harbor';

export interface EcologySample {
  biome: BiomeKind;
  fertility: number;
  freshwater: number;
  timber: number;
  metalOre: number;
  geothermal: number;
  harbor: number;
}

/** 可被工程选址与资源事件引用的区域潜力；位置只保存球面格，不依赖渲染对象。 */
export interface ResourceArea {
  id: string;
  kind: ResourcePotentialKind;
  cellIds: string[];
  quality: number;
}

/** 全格生态可由世界事实重建；存档只冻结用于选址/事件的高价值区域索引。 */
export interface EcologyNetwork {
  version: 1;
  gridSubdivision: 5;
  biomeCoverage: Partial<Record<BiomeKind, number>>;
  resourceAreas: ResourceArea[];
}

/** 自然条件允许形成聚居地的地点；它只是候选，不等于已经出现的城市。 */
export interface SettlementPotential {
  id: string;
  role: 'existing' | 'agricultural' | 'mineral' | 'harbor' | 'river_hub';
  cellId: string;
  sourceId: string;
  suitability: number;
}

/**
 * 已通过模块选址规则的工程候选点。它不是项目、不是已建设施，也不包含道路；
 * 玩家尚未决定开发前，它只是一处可被勘察的空间事实。
 */
export interface EngineeringPotential {
  id: string;
  moduleId: string;
  cellId: string;
  sourceId: string;
  suitability: number;
}

export interface SpatialNetwork {
  version: 2;
  gridSubdivision: 5;
  settlementPotentials: SettlementPotential[];
  engineeringPotentials: EngineeringPotential[];
}

export interface TerrainModuleSlot {
  id: string;
  /** 由模块协议稳定选出的视觉家族；R4.1-C/D 只按此 ID 找素材，不按剧情地点名找图。 */
  templateId: string;
  region: TerrainRegionKind;
  climate: ClimateKind;
  center: [number, number];
  rotation: 0 | 90 | 180 | 270;
  variant: number;
  edges: { north: TerrainEdge; east: TerrainEdge; south: TerrainEdge; west: TerrainEdge };
}

export interface TerrainModuleLink {
  id: string;
  fromId: string;
  fromEdge: 'north' | 'east' | 'south' | 'west';
  toId: string;
  toEdge: 'north' | 'east' | 'south' | 'west';
}

export interface BlueprintSiteAnchor {
  id: string;
  kind: SiteAnchorKind;
  position: [number, number];
  required: Array<'land' | 'freshwater' | 'low_slope' | 'river_crossing' | 'coast' | 'narrow_valley' | 'ore_bearing'>;
}

/** 工程选址的自然约束。它们只读取世界骨架，绝不读取渲染贴图或项目名称。 */
export type SiteRequirement =
  | { kind: 'land' }
  | { kind: 'freshwater'; min: number }
  | { kind: 'fertility'; min: number }
  | { kind: 'metal_ore'; min: number }
  | { kind: 'geothermal'; min: number }
  | { kind: 'harbor'; min: number }
  | { kind: 'slope_max'; max: number }
  | { kind: 'river_crossing'; maxDistance: number }
  | { kind: 'river_drop'; min: number };

export interface TerrainChange {
  id: string;
  kind: 'reservoir' | 'mine_pit' | 'road' | 'canal' | 'utility_corridor' | 'pollution' | 'urban_growth';
  anchorId: string;
  createdDay: number;
  data: Record<string, number | string | boolean>;
}

/**
 * 世界生成时冻结的自然地貌摆放。它描述真实世界坐标与占地，不是某一档镜头的屏幕图标。
 * 缩放层只能从这一份清单取样；城市和工程另走可变的地图增量层。
 */
export interface SurfaceFeaturePlacement {
  id: string;
  assetId: string;
  moduleId: string;
  anchor: [number, number];
  rotation: 0 | 90 | 180 | 270;
  /** 贴图在地表经纬坐标中最长边对应的角度范围。 */
  spanDegrees: number;
  layer: 'macro' | 'regional' | 'local';
}

// ============ R9：球面骨架与工程地图协议 ============
/**
 * 任何可推演的地点都引用球面格，而不是在不同系统里散落一组 lon/lat 常量。
 * point 保留格内坐标给城市、港口等细位置；edge/path/area 为道路、管线与工程范围预留。
 */
export type GeoReference =
  | { kind: 'point'; cellId: string; local: [number, number] }
  | { kind: 'edge'; fromCellId: string; toCellId: string; t: number }
  | { kind: 'path'; cellIds: string[] }
  | { kind: 'area'; cellIds: string[] };

export interface WorldSkeleton {
  version: 1;
  /** 二十面体细分网格；单元几何可由版本、层级和种子确定性重建，不把 2 万个对象塞进存档。 */
  topology: 'icosphere';
  subdivision: 5;
  cellCount: number;
  /** 已知地点绑定稳定格；今后的城市、工程和道路均从这里开始引用。 */
  anchorCells: Record<string, GeoReference>;
}

/** 工程定义库所引用的可复用地理模块；不携带某一局的坐标或进度。 */
export interface MapModuleDefinition {
  id: string;
  kind: 'settlement' | 'road' | 'utility' | 'facility' | 'harbor' | 'dam' | 'mine' | 'service_area';
  compatibleTerrain: TerrainRegionKind[];
  geometry: 'point' | 'edge' | 'path' | 'area';
  phases: Array<'survey' | 'construction' | 'trial' | 'operational'>;
  siteRequirements: SiteRequirement[];
}

/** 某局中由工程产生的标准化地理结果；它与自然骨架、工程定义和贴图实现彼此解耦。 */
export interface WorldEffectInstance {
  id: string;
  sourceProjectId: string;
  moduleId: string;
  geo: GeoReference;
  phase: 'survey' | 'construction' | 'trial' | 'operational' | 'retired';
  createdDay: number;
  data: Record<string, number | string | boolean>;
}

export interface WorldBlueprint {
  generatorVersion: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  seed: number;
  planet: PlanetProfile;
  landmasses: BlueprintLandmass[];
  tectonicPlates: TectonicPlate[];
  tectonicBoundaries: TectonicBoundary[];
  ranges: BlueprintRange[];
  watersheds: BlueprintWatershed[];
  hydrology: HydrologyNetwork;
  ecology: EcologyNetwork;
  spatialNetwork: SpatialNetwork;
  terrainModules: TerrainModuleSlot[];
  moduleLinks: TerrainModuleLink[];
  skeleton: WorldSkeleton;
  surfaceFeatures: SurfaceFeaturePlacement[];
  siteAnchors: BlueprintSiteAnchor[];
  terrainChanges: TerrainChange[];
}

export interface CampaignSaveV6 extends CampaignSaveV2 {
  version: 6;
  day: number;
  nationalPolicy: FocusState;
  currentPolicy: ActivePolicyState | null;
  policyCooldowns: Partial<Record<V6PolicyId, number>>;
  projectSlot: SlotRuntime<V6ProjectId>;
  researchSlot: SlotRuntime<V6TechId>;
  completed: { techs: V6TechId[]; projects: V6ProjectId[] };
  facilities: Record<FacilityId, FacilityRuntime>;
  metrics: Record<MetricId, MetricValue>;
  population: number;
  supply: SupplyRuntime;
  events: V6EventRuntime[];
  notificationHistory: Notification[];
  world: WorldBlueprint;
  migrationNote?: string;
}
