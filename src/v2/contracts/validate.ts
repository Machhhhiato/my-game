// ============ S0-A 纯校验器：只返回稳定错误码，不依赖 UI/渲染/旧河谷数据/硬编码坐标 ============
import type {
  WorldTemplate, CampaignTemplate, ScenarioFixture,
  SettlementSite, EngineeringSite, NetworkProject,
} from './types';

export type ErrorCode =
  | 'EMPTY_ID'
  | 'INVALID_ID_FORMAT'
  | 'INVALID_GENERATOR_VERSION'
  | 'INVALID_SEED'
  | 'INVALID_LAND_FRACTION'
  | 'INVALID_ICE_LINE'
  | 'EMPTY_TERRAIN_RULES'
  | 'EMPTY_CLIMATE_RULES'
  | 'EMPTY_ECOLOGY_RULES'
  | 'EMPTY_ERA_ID'
  | 'INVALID_POPULATION_RANGE'
  | 'NEGATIVE_START_SETTLEMENTS'
  | 'EMPTY_CAPABILITIES'
  | 'EMPTY_COVERAGE'
  | 'UNKNOWN_TEMPLATE_REF'
  | 'UNKNOWN_CONTENT_REF'
  | 'INVALID_GEO_REF'
  | 'EMPTY_ROLE'
  | 'INVALID_SUITABILITY'
  | 'UNKNOWN_MODULE'
  | 'EMPTY_ENDPOINT'
  | 'SELF_LOOP_ENDPOINT'
  | 'UNKNOWN_ENDPOINT'
  | 'UNKNOWN_NETWORK_KIND'
  | 'INVALID_ROUTE_GEOMETRY';

export interface ValidationError {
  code: ErrorCode;
  path: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}

const ID_PATTERN = /^[a-zA-Z0-9._-]+$/;

function ok(): ValidationResult {
  return { ok: true, errors: [] };
}

function fail(errors: ValidationError[]): ValidationResult {
  return { ok: errors.length === 0, errors };
}

function checkId(id: string, path: string, errors: ValidationError[]): void {
  if (!id || id.trim() === '') errors.push({ code: 'EMPTY_ID', path });
  else if (!ID_PATTERN.test(id)) errors.push({ code: 'INVALID_ID_FORMAT', path });
}

function checkGeoRef(geo: unknown, path: string, errors: ValidationError[]): void {
  if (!geo || typeof geo !== 'object') {
    errors.push({ code: 'INVALID_GEO_REF', path });
    return;
  }
  const g = geo as { kind?: string };
  if (g.kind === undefined) errors.push({ code: 'INVALID_GEO_REF', path });
}

export function validateWorldTemplate(t: WorldTemplate): ValidationResult {
  const errors: ValidationError[] = [];
  checkId(t.id, 'id', errors);
  if (t.generatorVersion <= 0) errors.push({ code: 'INVALID_GENERATOR_VERSION', path: 'generatorVersion' });
  if (t.worldSeed < 0) errors.push({ code: 'INVALID_SEED', path: 'worldSeed' });
  if (t.geographyRules.targetLandFraction < 0 || t.geographyRules.targetLandFraction > 1) {
    errors.push({ code: 'INVALID_LAND_FRACTION', path: 'geographyRules.targetLandFraction' });
  }
  if (t.geographyRules.allowedTerrain.length === 0) errors.push({ code: 'EMPTY_TERRAIN_RULES', path: 'geographyRules.allowedTerrain' });
  if (t.climateRules.allowedClimates.length === 0) errors.push({ code: 'EMPTY_CLIMATE_RULES', path: 'climateRules.allowedClimates' });
  if (t.climateRules.iceLineLatitude < 0 || t.climateRules.iceLineLatitude > 90) {
    errors.push({ code: 'INVALID_ICE_LINE', path: 'climateRules.iceLineLatitude' });
  }
  if (t.ecologyRules.allowedBiomes.length === 0) errors.push({ code: 'EMPTY_ECOLOGY_RULES', path: 'ecologyRules.allowedBiomes' });
  return fail(errors);
}

export function validateCampaignTemplate(t: CampaignTemplate): ValidationResult {
  const errors: ValidationError[] = [];
  checkId(t.id, 'id', errors);
  if (!t.eraId || t.eraId.trim() === '') errors.push({ code: 'EMPTY_ERA_ID', path: 'eraId' });
  const [lo, hi] = t.startProfile.populationRange;
  if (lo < 0 || hi < lo) errors.push({ code: 'INVALID_POPULATION_RANGE', path: 'startProfile.populationRange' });
  if (t.startProfile.startingSettlements < 0) errors.push({ code: 'NEGATIVE_START_SETTLEMENTS', path: 'startProfile.startingSettlements' });
  if (t.initialCapabilities.length === 0) errors.push({ code: 'EMPTY_CAPABILITIES', path: 'initialCapabilities' });
  return fail(errors);
}

export function validateScenarioFixture(f: ScenarioFixture, worldIds: ReadonlySet<string>, campaignIds: ReadonlySet<string>): ValidationResult {
  const errors: ValidationError[] = [];
  checkId(f.id, 'id', errors);
  if (!worldIds.has(f.worldTemplateId)) errors.push({ code: 'UNKNOWN_TEMPLATE_REF', path: 'worldTemplateId' });
  if (!campaignIds.has(f.campaignTemplateId)) errors.push({ code: 'UNKNOWN_TEMPLATE_REF', path: 'campaignTemplateId' });
  if (f.testCoverage.length === 0) errors.push({ code: 'EMPTY_COVERAGE', path: 'testCoverage' });
  return fail(errors);
}

export function validateSettlementSite(site: SettlementSite): ValidationResult {
  const errors: ValidationError[] = [];
  checkId(site.id, 'id', errors);
  checkGeoRef(site.geoRef, 'geoRef', errors);
  if (!site.role || site.role.trim() === '') errors.push({ code: 'EMPTY_ROLE', path: 'role' });
  if (site.suitability < 0 || site.suitability > 1) errors.push({ code: 'INVALID_SUITABILITY', path: 'suitability' });
  return fail(errors);
}

export function validateEngineeringSite(site: EngineeringSite, moduleIds: ReadonlySet<string>): ValidationResult {
  const errors: ValidationError[] = [];
  checkId(site.id, 'id', errors);
  checkGeoRef(site.geoRef, 'geoRef', errors);
  if (!moduleIds.has(site.moduleId)) errors.push({ code: 'UNKNOWN_MODULE', path: 'moduleId' });
  if (site.suitability < 0 || site.suitability > 1) errors.push({ code: 'INVALID_SUITABILITY', path: 'suitability' });
  if (site.developmentState && !['survey', 'construction', 'trial', 'operational'].includes(site.developmentState.phase)) {
    errors.push({ code: 'UNKNOWN_CONTENT_REF', path: 'developmentState.phase' });
  }
  return fail(errors);
}

const NETWORK_KINDS: ReadonlySet<string> = new Set(['road', 'rail', 'canal', 'power', 'water', 'data']);

export function validateNetworkProject(net: NetworkProject, endpointIds: ReadonlySet<string>): ValidationResult {
  const errors: ValidationError[] = [];
  checkId(net.id, 'id', errors);
  if (!NETWORK_KINDS.has(net.kind)) errors.push({ code: 'UNKNOWN_NETWORK_KIND', path: 'kind' });
  if (!net.endpointA || net.endpointA.trim() === '') errors.push({ code: 'EMPTY_ENDPOINT', path: 'endpointA' });
  if (!net.endpointB || net.endpointB.trim() === '') errors.push({ code: 'EMPTY_ENDPOINT', path: 'endpointB' });
  if (net.endpointA && net.endpointB && net.endpointA === net.endpointB) errors.push({ code: 'SELF_LOOP_ENDPOINT', path: 'endpointA/endpointB' });
  if (net.endpointA && !endpointIds.has(net.endpointA)) errors.push({ code: 'UNKNOWN_ENDPOINT', path: 'endpointA' });
  if (net.endpointB && !endpointIds.has(net.endpointB)) errors.push({ code: 'UNKNOWN_ENDPOINT', path: 'endpointB' });
  if (net.routePlan && net.routePlan.geo.kind !== 'path' && net.routePlan.geo.kind !== 'edge') {
    errors.push({ code: 'INVALID_ROUTE_GEOMETRY', path: 'routePlan.geo' });
  }
  return fail(errors);
}
