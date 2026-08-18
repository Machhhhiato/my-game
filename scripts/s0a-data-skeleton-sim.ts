// S0-A 数据骨架自动验证：通用契约、引用完整性、端点/模块合法性、夹具边界
// 运行：npx tsx scripts/s0a-data-skeleton-sim.ts
import { readFileSync } from 'node:fs';
import {
  validateWorldTemplate, validateCampaignTemplate, validateScenarioFixture,
  validateSettlementSite, validateEngineeringSite, validateNetworkProject,
  type WorldTemplate, type CampaignTemplate, type ScenarioFixture,
  type SettlementSite, type EngineeringSite, type NetworkProject,
} from '../src/v2/contracts';
import { LEGACY_VALLEY_FIXTURE } from '../src/v2/fixtures/legacy-valley/manifest';
import type { PlanetProfile } from '../src/v2/types';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (cond) console.log('  ok: ' + msg);
  else { console.error('  FAIL: ' + msg); failures++; }
}

const PLANET: PlanetProfile = {
  radiusKm: 6400, gravityG: 0.98, axialTiltDeg: 23, dayHours: 24, yearDays: 400, oceanTarget: 0.62, tectonicActivity: 'active',
};

function makeWorld(id: string, seed: number): WorldTemplate {
  return {
    id,
    generatorVersion: 1,
    planetProfile: { ...PLANET },
    worldSeed: seed,
    geographyRules: { continents: 3, targetLandFraction: 0.4, allowedTerrain: ['plain', 'highland', 'mountain', 'forest', 'coast'] },
    climateRules: { allowedClimates: ['temperate', 'cold'], iceLineLatitude: 62 },
    ecologyRules: { allowedBiomes: ['grassland', 'temperate_forest', 'tundra'], resourceKinds: ['freshwater', 'arable_land', 'metal_ore'] },
  };
}

function makeCampaign(id: string): CampaignTemplate {
  return {
    id,
    eraId: 'era.shelter_outreach',
    startProfile: { populationRange: [20, 60], startingSettlements: 1 },
    discoveryRules: { revealRadiusKm: 240, initialKnownCells: 12 },
    factionRules: { density: 'normal', externalFactions: 2 },
    initialCapabilities: ['capability.water_treatment', 'capability.shelter'],
    stageGates: [
      { id: 'gate.stable_water', condition: { kind: 'capability', capabilityId: 'capability.water_treatment' }, unlocks: ['module.farm_district'] },
    ],
    contentPools: ['module.settlement_core', 'module.water_utility', 'module.farm_district'],
  };
}

console.log('== 1. 两个通用模板通过校验 ==');
const worldA = makeWorld('world.template.boreal_standard', 101);
const worldB = makeWorld('world.template.temperate_coast', 202);
const campaignA = makeCampaign('campaign.template.shelter_outreach');
const campaignB = makeCampaign('campaign.template.coastal_restart');
assert(validateWorldTemplate(worldA).ok, '1a 世界模板 A 通过');
assert(validateWorldTemplate(worldB).ok, '1b 世界模板 B 通过');
assert(validateCampaignTemplate(campaignA).ok, '1c 战役模板 A 通过');
assert(validateCampaignTemplate(campaignB).ok, '1d 战役模板 B 通过');

console.log('== 2. 坏引用 / 无效端点 / 不合法工程候选被稳定错误码拒绝 ==');
const worldIds = new Set([worldA.id, worldB.id]);
const campaignIds = new Set([campaignA.id, campaignB.id]);

const badFixture: ScenarioFixture = {
  id: 'fixture.bad', worldTemplateId: 'world.template.missing', campaignTemplateId: campaignA.id,
  testCoverage: ['terrain.mountain'], injectedConditions: [],
};
const fr = validateScenarioFixture(badFixture, worldIds, campaignIds);
assert(!fr.ok && fr.errors.some(e => e.code === 'UNKNOWN_TEMPLATE_REF'), `2a 坏世界模板引用被拒绝（${fr.errors.map(e => e.code).join(',')}）`);

const siteA: SettlementSite = { id: 'site.hub_a', geoRef: { kind: 'point', cellId: 'g5-0', local: [0, 0] }, role: 'hub', suitability: 0.9, discovered: true };
const siteB: SettlementSite = { id: 'site.harbor_b', geoRef: { kind: 'point', cellId: 'g5-1', local: [0, 0] }, role: 'harbor', suitability: 0.8, discovered: true };
assert(validateSettlementSite(siteA).ok && validateSettlementSite(siteB).ok, '2b 合法聚居点通过');

const endpointIds = new Set([siteA.id, siteB.id]);
const goodNet: NetworkProject = { id: 'net.road_a_b', kind: 'road', endpointA: siteA.id, endpointB: siteB.id, requiredCapabilities: ['capability.road_survey'] };
assert(validateNetworkProject(goodNet, endpointIds).ok, '2c 合法网络通过');

const badNet: NetworkProject = { id: 'net.bad_endpoint', kind: 'road', endpointA: siteA.id, endpointB: 'site.missing', requiredCapabilities: ['capability.road_survey'] };
const nr = validateNetworkProject(badNet, endpointIds);
assert(!nr.ok && nr.errors.some(e => e.code === 'UNKNOWN_ENDPOINT'), `2d 无效网络端点被拒绝（${nr.errors.map(e => e.code).join(',')}）`);

const moduleIds = new Set(['water_utility', 'settlement_core', 'farm_district']);
const goodEng: EngineeringSite = { id: 'eng.water_a', geoRef: { kind: 'point', cellId: 'g5-2', local: [0, 0] }, moduleId: 'water_utility', naturalRequirements: ['freshwater'], suitability: 0.85, discovered: true };
assert(validateEngineeringSite(goodEng, moduleIds).ok, '2e 合法工程候选通过');

const badEng: EngineeringSite = { id: 'eng.bad_module', geoRef: { kind: 'point', cellId: 'g5-3', local: [0, 0] }, moduleId: 'valley_only_module', naturalRequirements: ['freshwater'], suitability: 0.85, discovered: true };
const er = validateEngineeringSite(badEng, moduleIds);
assert(!er.ok && er.errors.some(e => e.code === 'UNKNOWN_MODULE'), `2f 不合法工程候选被拒绝（${er.errors.map(e => e.code).join(',')}）`);

console.log('== 3. 通用 contracts 不包含旧河谷专名 ==');
const legacyTokens = [...LEGACY_VALLEY_FIXTURE.legacyNodeIds, ...LEGACY_VALLEY_FIXTURE.legacyRegionIds, ...LEGACY_VALLEY_FIXTURE.legacyDisplayNames];
const contractFiles = [
  'src/v2/contracts/types.ts',
  'src/v2/contracts/validate.ts',
  'src/v2/contracts/index.ts',
];
let leaked: string[] = [];
for (const file of contractFiles) {
  const text = readFileSync(file, 'utf8');
  for (const token of legacyTokens) {
    if (text.includes(token)) leaked.push(`${file}:${token}`);
  }
}
assert(leaked.length === 0, `3a 契约文件无河谷专名${leaked.length ? '（泄漏：' + leaked.join('、') + '）' : ''}`);
assert(LEGACY_VALLEY_FIXTURE.status === 'legacy', '3b 旧河谷被标记为 legacy Fixture');

console.log(failures === 0 ? '\n全部断言通过' : `\n${failures} 个断言失败`);
if (failures > 0) process.exit(1);
