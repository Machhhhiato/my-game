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
  version: 2;
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
