// ============ S0-A 通用数据契约导出 ============
export type {
  WorldTemplate, GeographyRules, ClimateRules, EcologyRules,
  CampaignTemplate, CampaignStartProfile, DiscoveryRules, FactionRules, StageGate, StageGateCondition,
  ScenarioFixture,
  SettlementSite, SettlementState, EngineeringSite, EngineeringDevelopmentState,
  NetworkProject, RoutePlan, NetworkConstructionState,
  ContentId, CapabilityTag,
} from './types';
export {
  validateWorldTemplate, validateCampaignTemplate, validateScenarioFixture,
  validateSettlementSite, validateEngineeringSite, validateNetworkProject,
  type ErrorCode, type ValidationError, type ValidationResult,
} from './validate';
