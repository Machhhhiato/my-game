import { createNationKernelFixture } from './fixture';
import { advanceNationKernelDays, startOperation } from './simulation';
import { installContentPackage } from './contentPackage';
import type { ContentRoleBindings, NationContentPackage } from './contentPackage';
import { DIPLOMATIC_CONFLICT_CONTENT_PACKAGE } from './diplomaticConflictContent';
import { UNIFIED_NATION_CONTENT_PACKAGE } from './unifiedNationContent';
import { R28_GROUND_CONTENT_PACKAGE } from './r28GroundContent';
import type { FacilityState, NationKernelState, OperationState, PolityState } from './types';

export interface NationSaveFixture { id: string; stage: 'survival' | 'unifiedNation' | 'regional'; state: NationKernelState; }
const copy = (state: NationKernelState): NationKernelState => structuredClone(state) as NationKernelState;
const setQuantity = (state: NationKernelState, quantityId: string, value: number): void => { state.quantities['polity:polity.player'][quantityId] = { current: value, updatedDay: state.calendar.day, sourceIds: ['fixture'] }; };
const setScopedQuantity = (state: NationKernelState, scope: string, quantityId: string, value: number): void => { if (state.quantities[scope] == null) state.quantities[scope] = {}; state.quantities[scope][quantityId] = { current: value, updatedDay: state.calendar.day, sourceIds: ['fixture'] }; };

function installOrThrow<TRole extends string>(
  state: NationKernelState,
  contentPackage: NationContentPackage<TRole>,
  bindings: ContentRoleBindings<TRole>,
): Record<string, OperationState> {
  const result = installContentPackage(state, contentPackage, bindings);
  if (!result.ok) throw new Error(`fixture content install failed: ${result.errors.join('; ')}`);
  return result.operations;
}

/** 起步：单一共同体，只有生存、建设、研究与周边接触的最小事实。 */
export function createEarlyCommunitySave(): NationSaveFixture { return { id: 'save.fixture.early-community', stage: 'survival', state: createNationKernelFixture(101) }; }

/** 统一：单一主权国家拥有多个地区、城市和都市圈；不存在国内“敌对势力”。 */
export function createUnifiedNationSave(): NationSaveFixture {
  const state = copy(createNationKernelFixture(202)); const player = state.polities['polity.player'];
  delete state.polities['polity.peer']; delete state.regions['region.peer']; delete state.relations['relation.player-peer']; state.observations = []; state.operations = {}; state.facilities = {}; state.networks = {};
  state.calendar = { day: 21600, year: 61, month: 1, phase: 'early' };
  Object.assign(player, { archetype: 'planetaryState', simulationTier: 'full', territoryRegionIds: ['region.north', 'region.central', 'region.coast'], population: { residents: 15_200_000, temporary: 210_000, dependents: 2_530_000, healthyWorkforce: 9_200_000, migrationPressure: 18, housingPressure: 27 }, workforce: { healthy: 9_200_000, dependents: 2_530_000, essential: 3_100_000, maintenance: 760_000, publicServices: 1_180_000, administration: 420_000, defense: 610_000 }, cohesion: 72, strategicIntent: ['integrate', 'recover', 'develop'] });
  state.regions = {
    'region.north': { id: 'region.north', polityId: player.id, cityIds: ['city.north-core', 'city.north-port'], ruralPopulation: 1_130_000, integration: { registry: 89, services: 81, justice: 77, security: 83, executionQuality: 79 }, environmentPressure: 36 },
    'region.central': { id: 'region.central', polityId: player.id, cityIds: ['city.central'], ruralPopulation: 2_260_000, integration: { registry: 94, services: 88, justice: 86, security: 90, executionQuality: 87 }, environmentPressure: 28 },
    'region.coast': { id: 'region.coast', polityId: player.id, cityIds: ['city.coast-core', 'city.coast-satellite'], ruralPopulation: 1_040_000, integration: { registry: 82, services: 73, justice: 70, security: 76, executionQuality: 71 }, environmentPressure: 48 },
  };
  state.cities = {
    'city.north-core': { id: 'city.north-core', polityId: player.id, regionId: 'region.north', metroId: 'metro.north', geoRef: { kind: 'point', cellId: 'g5-104', local: [0.4, 0.5] }, stage: 'metropolis', role: 'industrial', population: 2_840_000, builtAreaKm2: 860, facilityIds: ['facility.north-workshops'] },
    'city.north-port': { id: 'city.north-port', polityId: player.id, regionId: 'region.north', metroId: 'metro.north', geoRef: { kind: 'point', cellId: 'g5-105', local: [0.6, 0.4] }, stage: 'city', role: 'port', population: 920_000, builtAreaKm2: 240, facilityIds: ['facility.north-port-handling'] },
    'city.central': { id: 'city.central', polityId: player.id, regionId: 'region.central', metroId: 'metro.central', geoRef: { kind: 'point', cellId: 'g5-211', local: [0.5, 0.5] }, stage: 'metropolis', role: 'administrative', population: 4_210_000, builtAreaKm2: 1100, facilityIds: ['facility.central-baseload'] },
    'city.coast-core': { id: 'city.coast-core', polityId: player.id, regionId: 'region.coast', metroId: 'metro.coast', geoRef: { kind: 'point', cellId: 'g5-332', local: [0.2, 0.6] }, stage: 'city', role: 'research', population: 1_560_000, builtAreaKm2: 430, facilityIds: ['facility.coast-clinic'] },
    'city.coast-satellite': { id: 'city.coast-satellite', polityId: player.id, regionId: 'region.coast', metroId: 'metro.coast', geoRef: { kind: 'point', cellId: 'g5-333', local: [0.7, 0.2] }, stage: 'town', role: 'logistics', population: 320_000, builtAreaKm2: 72, facilityIds: [] },
  };
  state.metros = {
    'metro.north': { id: 'metro.north', polityId: player.id, memberCityIds: ['city.north-core', 'city.north-port'], coreCityId: 'city.north-core', totalPopulation: 0, sharedNetworkIds: ['network.north-central-trunk'], coordinationLoad: 62 },
    'metro.central': { id: 'metro.central', polityId: player.id, memberCityIds: ['city.central'], coreCityId: 'city.central', totalPopulation: 0, sharedNetworkIds: ['network.north-central-trunk'], coordinationLoad: 71 },
    'metro.coast': { id: 'metro.coast', polityId: player.id, memberCityIds: ['city.coast-core', 'city.coast-satellite'], coreCityId: 'city.coast-core', totalPopulation: 0, sharedNetworkIds: ['network.coast-port-branch'], coordinationLoad: 54 },
  };
  const localFacility = (id: string, moduleId: string, hostCityId: string, maintenanceStaffRequired: number, recurringEffects: FacilityState['recurringEffects']): FacilityState => ({ id, moduleId, polityId: player.id, hostCityId, authority: { ownerId: player.id, operatorId: player.id, maintenanceOwnerId: player.id, commandAuthorityId: player.id, serviceScopes: [{ kind: 'city', id: hostCityId }] }, lifecycle: { status: 'operating', condition: 82, maintenanceBacklog: 0 }, maintenanceStaffRequired, recurringEffects });
  state.facilities = {
    'facility.central-baseload': localFacility('facility.central-baseload', 'module.energy.baseload', 'city.central', 1_200, [{ kind: 'quantity', timing: 'perDay', target: { kind: 'polity', id: player.id }, quantityId: 'capacity.energy', operation: 'add', value: 0.06, reasonKey: 'facility.central-baseload.daily' }]),
    'facility.north-workshops': localFacility('facility.north-workshops', 'module.repair.workshops', 'city.north-core', 1_500, [{ kind: 'quantity', timing: 'perDay', target: { kind: 'polity', id: player.id }, quantityId: 'construction.ndu', operation: 'add', value: 0.35, reasonKey: 'facility.north-workshops.daily' }, { kind: 'quantity', timing: 'perDay', target: { kind: 'polity', id: player.id }, quantityId: 'maintenance.backlog', operation: 'add', value: -0.03, reasonKey: 'facility.north-workshops.daily' }]),
    'facility.north-port-handling': localFacility('facility.north-port-handling', 'module.port.handling', 'city.north-port', 700, [{ kind: 'quantity', timing: 'perDay', target: { kind: 'polity', id: player.id }, quantityId: 'capacity.logistics', operation: 'add', value: 0.04, reasonKey: 'facility.north-port-handling.daily' }]),
    'facility.coast-clinic': localFacility('facility.coast-clinic', 'module.health.clinic', 'city.coast-core', 600, [{ kind: 'quantity', timing: 'perDay', target: { kind: 'city', id: 'city.coast-core' }, quantityId: 'service.healthCoverage', operation: 'add', value: 0.03, reasonKey: 'facility.coast-clinic.daily' }]),
  };
  state.networks = {
    'network.north-central-trunk': { id: 'network.north-central-trunk', polityId: player.id, kind: 'road', endpointIds: ['city.north-core', 'city.central'], capacity: 46, condition: 74, redundancy: 12, lifecycle: { status: 'operating', condition: 74, maintenanceBacklog: 4 } },
    'network.coast-port-branch': { id: 'network.coast-port-branch', polityId: player.id, kind: 'road', endpointIds: ['city.coast-core', 'city.coast-satellite'], capacity: 33, condition: 69, redundancy: 8, lifecycle: { status: 'operating', condition: 69, maintenanceBacklog: 6 } },
  };
  setQuantity(state, 'construction.ndu', 210); setQuantity(state, 'capacity.engineering', 76); setQuantity(state, 'capacity.energy', 74); setQuantity(state, 'capacity.research', 68); setQuantity(state, 'capacity.coordination', 71); setQuantity(state, 'capacity.logistics', 66); setQuantity(state, 'capacity.defense', 62); setQuantity(state, 'capacity.cohesion', 72); setQuantity(state, 'capacity.ecology', 58); setQuantity(state, 'maintenance.backlog', 19);
  setScopedQuantity(state, 'city:city.north-core', 'service.waterCoverage', 74); setScopedQuantity(state, 'city:city.north-core', 'service.healthCoverage', 69); setScopedQuantity(state, 'city:city.north-core', 'service.educationCoverage', 62);
  setScopedQuantity(state, 'city:city.north-port', 'service.waterCoverage', 68); setScopedQuantity(state, 'city:city.north-port', 'service.healthCoverage', 61); setScopedQuantity(state, 'city:city.north-port', 'service.educationCoverage', 53);
  setScopedQuantity(state, 'city:city.central', 'service.waterCoverage', 82); setScopedQuantity(state, 'city:city.central', 'service.healthCoverage', 78); setScopedQuantity(state, 'city:city.central', 'service.educationCoverage', 76);
  setScopedQuantity(state, 'city:city.coast-core', 'service.waterCoverage', 59); setScopedQuantity(state, 'city:city.coast-core', 'service.healthCoverage', 64); setScopedQuantity(state, 'city:city.coast-core', 'service.educationCoverage', 71);
  setScopedQuantity(state, 'city:city.coast-satellite', 'service.waterCoverage', 51); setScopedQuantity(state, 'city:city.coast-satellite', 'service.healthCoverage', 47); setScopedQuantity(state, 'city:city.coast-satellite', 'service.educationCoverage', 42);
  state.operations = installOrThrow(state, UNIFIED_NATION_CONTENT_PACKAGE, {
    playerPolity: player.id,
    industrialCoreCity: 'city.north-core',
    portCity: 'city.north-port',
    administrativeCoreCity: 'city.central',
    coastalServiceCity: 'city.coast-core',
    logisticsSatelliteCity: 'city.coast-satellite',
  });
  Object.assign(state.operations, installOrThrow(state, R28_GROUND_CONTENT_PACKAGE, {
    playerPolity: player.id,
    industrialCoreCity: 'city.north-core',
    borderRegion: 'region.north',
  }));
  return { id: 'save.fixture.unified-nation', stage: 'unifiedNation', state };
}

function prepareUnifiedStateForConflict(): NationKernelState {
  let state = createUnifiedNationSave().state;
  const begin = (ids: string[]): void => { for (const id of ids) state = startOperation(state, id); };
  begin(['operation.tech.grid-dispatch', 'operation.tech.safe-water-standard', 'operation.tech.component-standardisation', 'operation.tech.systems-survey']);
  state = advanceNationKernelDays(state, 22);
  begin(['operation.project.national-intertie', 'operation.project.coast-waterworks', 'operation.project.north-repair-center', 'operation.project.technical-institute']);
  state = advanceNationKernelDays(state, 38);
  begin(['operation.project.central-dispatch', 'operation.tech.network-operations', 'operation.tech.service-registry']);
  state = advanceNationKernelDays(state, 35);
  begin(['operation.project.registry-relay']);
  state = advanceNationKernelDays(state, 28);
  return state;
}

/** 外交冲突：两个独立主权势力、可数舰艇、战区、情报不确定性与持续动员并存。 */
export function createDiplomaticConflictSave(): NationSaveFixture {
  const state = prepareUnifiedStateForConflict(); const peerId = 'polity.neighbor';
  const peer: PolityState = { id: peerId, templateId: 'template.regional-state', archetype: 'regionalState', simulationTier: 'active', territoryRegionIds: ['region.neighbor'], population: { residents: 2_480_000, temporary: 74_000, dependents: 430_000, healthyWorkforce: 1_460_000, migrationPressure: 31, housingPressure: 39 }, workforce: { healthy: 1_460_000, dependents: 430_000, essential: 510_000, maintenance: 118_000, publicServices: 170_000, administration: 62_000, defense: 190_000 }, capabilities: {}, activeOperationIds: [], cohesion: 51, strategicIntent: ['secure-border', 'protect-route'] };
  state.polities[peerId] = peer; state.regions['region.neighbor'] = { id: 'region.neighbor', polityId: peerId, cityIds: ['city.neighbor-port'], ruralPopulation: 860_000, integration: { registry: 62, services: 58, justice: 51, security: 74, executionQuality: 56 }, environmentPressure: 43 };
  state.cities['city.neighbor-port'] = { id: 'city.neighbor-port', polityId: peerId, regionId: 'region.neighbor', geoRef: { kind: 'point', cellId: 'g5-487', local: [0.3, 0.7] }, stage: 'city', role: 'port', population: 680_000, builtAreaKm2: 188, facilityIds: [] };
  state.relations['relation.player-neighbor'] = { id: 'relation.player-neighbor', actorAId: 'polity.player', actorBId: peerId, stance: 'tense', trustAtoB: -36, trustBtoA: -48, agreementIds: ['agreement.transit'], grievanceIds: ['grievance.route-control'] };
  state.observations.push({ observerId: 'polity.player', subjectId: peerId, fieldId: 'fleet.sea.border', knownValue: '若干大型水面舰艇', confidence: 0.61, observedDay: state.calendar.day - 14, source: 'sensor' });
  state.fleets = {
    'fleet.player-sea': { id: 'fleet.player-sea', polityId: 'polity.player', domain: 'sea', mission: 'route-protection', vessels: { 'vessel.patrol': { total: 8, ready: 7, repairing: 1 }, 'vessel.destroyer': { total: 3, ready: 3, repairing: 0 }, 'vessel.carrier': { total: 1, ready: 1, repairing: 0 } }, personnel: 6_800, supplyDays: 24, readiness: 82 },
    'fleet.neighbor-sea': { id: 'fleet.neighbor-sea', polityId: peerId, domain: 'sea', mission: 'border-denial', vessels: { 'vessel.patrol': { total: 11, ready: 8, repairing: 3 }, 'vessel.destroyer': { total: 4, ready: 3, repairing: 1 } }, personnel: 5_400, supplyDays: 16, readiness: 68 },
  };
  state.theatres = { 'theatre.border-sea': { id: 'theatre.border-sea', polityId: 'polity.player', opponentPolityId: peerId, regionIds: ['region.coast', 'region.neighbor'], objective: 'protect-route', status: 'crisis', civilianImpact: 14, integrationPressure: 9 } };
  setQuantity(state, 'defense.readiness', 82); setQuantity(state, 'defense.supplyDays', 24); setQuantity(state, 'diplomacy.trust', -36); setQuantity(state, 'diplomacy.intelligenceConfidence', 61);
  Object.assign(state.operations, installOrThrow(state, DIPLOMATIC_CONFLICT_CONTENT_PACKAGE, {
    playerPolity: 'polity.player',
    neighborPolity: peerId,
    portCity: 'city.north-port',
    administrativeCoreCity: 'city.central',
    playerSeaFleet: 'fleet.player-sea',
    bilateralRelation: 'relation.player-neighbor',
  }));
  return { id: 'save.fixture.diplomatic-conflict', stage: 'regional', state };
}

export const R11_SAVE_FIXTURES = [createEarlyCommunitySave, createUnifiedNationSave, createDiplomaticConflictSave];
