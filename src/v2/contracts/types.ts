// ============ S0-A 通用战役数据契约（不含任何专名/剧情/坐标/渲染） ============
import type {
  GeoReference, PlanetProfile, TerrainRegionKind, ClimateKind, BiomeKind, ResourcePotentialKind,
} from '../types';

/** 稳定 ID：只表达类型与关系，不携带显示名、人物、剧情事件名或地点专名。 */
export type ContentId = string;
export type CapabilityTag = string;

// ============ B 层：自然世界模板 ============
export interface WorldTemplate {
  id: string;
  generatorVersion: number;
  planetProfile: PlanetProfile;
  /** 0 表示随机种子；否则为可复现固定种子 */
  worldSeed: number;
  geographyRules: GeographyRules;
  climateRules: ClimateRules;
  ecologyRules: EcologyRules;
}

export interface GeographyRules {
  continents: number;
  /** 0..1，陆地投影占比目标 */
  targetLandFraction: number;
  allowedTerrain: TerrainRegionKind[];
}

export interface ClimateRules {
  allowedClimates: ClimateKind[];
  /** 0..90，雪线纬度 */
  iceLineLatitude: number;
}

export interface EcologyRules {
  allowedBiomes: BiomeKind[];
  resourceKinds: ResourcePotentialKind[];
}

// ============ D 层：战役模板 ============
export interface CampaignTemplate {
  id: string;
  /** 通用时代 ID，如 "era.shelter_outreach" */
  eraId: string;
  startProfile: CampaignStartProfile;
  discoveryRules: DiscoveryRules;
  factionRules: FactionRules;
  initialCapabilities: CapabilityTag[];
  stageGates: StageGate[];
  contentPools: ContentId[];
}

export interface CampaignStartProfile {
  /** [min, max]，不含固定居民数 */
  populationRange: [number, number];
  startingSettlements: number;
}

export interface DiscoveryRules {
  revealRadiusKm: number;
  initialKnownCells: number;
}

export interface FactionRules {
  density: 'sparse' | 'normal' | 'dense';
  externalFactions: number;
}

export interface StageGate {
  id: string;
  condition: StageGateCondition;
  unlocks: ContentId[];
}

export type StageGateCondition =
  | { kind: 'metric_threshold'; metricId: string; threshold: number }
  | { kind: 'capability'; capabilityId: CapabilityTag }
  | { kind: 'population'; threshold: number };

// ============ E 层：剧本/测试夹具（可选） ============
export interface ScenarioFixture {
  id: string;
  worldTemplateId: string;
  campaignTemplateId: string;
  fixedSeed?: number;
  /** 通用覆盖标签，如 "terrain.mountain"、"network.crossing" */
  testCoverage: string[];
  /** 通用注入条件 ID */
  injectedConditions: ContentId[];
  presentationPackId?: string;
}

// ============ 地点对象 ============
export interface SettlementSite {
  id: string;
  geoRef: GeoReference;
  /** 通用角色标签：'hub' | 'agrarian' | 'harbor' | 'mining' | ... */
  role: string;
  /** 0..1 选址适宜度 */
  suitability: number;
  discovered: boolean;
  /** 仅当候选点实际形成聚居地后才存在 */
  settlementState?: SettlementState;
}

export interface SettlementState {
  population: number;
  /** 通用阶段标签，如 'outpost' | 'town' */
  stage: string;
  establishedDay: number;
}

export interface EngineeringSite {
  id: string;
  geoRef: GeoReference;
  /** 引用通用 MapModuleDefinition.id，不携带剧情工程名 */
  moduleId: string;
  /** 通用自然需求标签 */
  naturalRequirements: string[];
  /** 0..1 选址适宜度 */
  suitability: number;
  discovered: boolean;
  /** 仅当候选点被选择、勘察、开工后才存在 */
  developmentState?: EngineeringDevelopmentState;
}

export interface EngineeringDevelopmentState {
  phase: 'survey' | 'construction' | 'trial' | 'operational';
  startedDay: number;
}

// ============ 网络项目 ============
export interface NetworkProject {
  id: string;
  kind: 'road' | 'rail' | 'canal' | 'power' | 'water' | 'data';
  /** 两端点引用已存在地点或已建网络的稳定 ID；不允许固定折线或剧情地点名 */
  endpointA: string;
  endpointB: string;
  requiredCapabilities: CapabilityTag[];
  /** 玩家选定后的路线方案（可选） */
  routePlan?: RoutePlan;
  /** 施工状态（可选） */
  constructionState?: NetworkConstructionState;
  builtEffectId?: string;
}

export interface RoutePlan {
  geo: GeoReference;
  lengthKm: number;
  /** 通用维护等级标签 */
  maintenanceClass: string;
  capacity: number;
  riskTags: string[];
}

export interface NetworkConstructionState {
  phase: 'planned' | 'survey' | 'construction' | 'trial' | 'operational';
  startedDay: number;
}
