import type { NationKernelState } from './types';
import { R11_QUANTITY_CATALOG } from './quantityCatalog';

/** 无剧情、无固定地名的 R11 回归夹具；只验证国家对象之间的数据关系。 */
export function createNationKernelFixture(seed = 11): NationKernelState {
  const playerId = 'polity.player';
  const peerId = 'polity.peer';
  const playerScope = `polity:${playerId}`;
  return {
    version: 1, seed, playerPolityId: playerId, calendar: { day: 0, year: 1, month: 1, phase: 'early' },
    quantityDefinitions: R11_QUANTITY_CATALOG,
    quantities: { [playerScope]: {
      'provision.waterDays': { current: 18, updatedDay: 0, sourceIds: [] },
      'construction.ldu': { current: 12, updatedDay: 0, sourceIds: [] },
      'capacity.research': { current: 10, updatedDay: 0, sourceIds: [] },
    } },
    polities: {
      [playerId]: { id: playerId, templateId: 'template.community', archetype: 'community', simulationTier: 'full', territoryRegionIds: ['region.home'], population: { residents: 28, temporary: 0, dependents: 4, healthyWorkforce: 24, migrationPressure: 0, housingPressure: 12 }, workforce: { healthy: 24, dependents: 4, essential: 12, maintenance: 1, publicServices: 1, administration: 1, defense: 1 }, capabilities: {}, activeOperationIds: [], cohesion: 48, strategicIntent: ['survive', 'settle'] },
      [peerId]: { id: peerId, templateId: 'template.city-state', archetype: 'cityState', simulationTier: 'strategic', territoryRegionIds: ['region.peer'], population: { residents: 420, temporary: 18, dependents: 76, healthyWorkforce: 295, migrationPressure: 8, housingPressure: 21 }, workforce: { healthy: 295, dependents: 76, essential: 130, maintenance: 26, publicServices: 32, administration: 14, defense: 18 }, capabilities: {}, activeOperationIds: [], cohesion: 56, strategicIntent: ['trade', 'defend'] },
    },
    regions: { 'region.home': { id: 'region.home', polityId: playerId, cityIds: ['city.core', 'city.satellite'], ruralPopulation: 0, integration: { registry: 18, services: 22, justice: 8, security: 16, executionQuality: 20 }, environmentPressure: 12 }, 'region.peer': { id: 'region.peer', polityId: peerId, cityIds: [], ruralPopulation: 220, integration: { registry: 45, services: 42, justice: 36, security: 38, executionQuality: 40 }, environmentPressure: 18 } },
    cities: {
      'city.core': { id: 'city.core', polityId: playerId, regionId: 'region.home', metroId: 'metro.home', geoRef: { kind: 'point', cellId: 'g5-1', local: [0.2, 0.2] }, stage: 'settlement', role: 'mixed', population: 28, builtAreaKm2: 0.1, facilityIds: ['facility.water'] },
      'city.satellite': { id: 'city.satellite', polityId: playerId, regionId: 'region.home', metroId: 'metro.home', geoRef: { kind: 'point', cellId: 'g5-2', local: [0.8, 0.4] }, stage: 'outpost', role: 'logistics', population: 7, builtAreaKm2: 0.02, facilityIds: [] },
    },
    metros: { 'metro.home': { id: 'metro.home', polityId: playerId, memberCityIds: ['city.core', 'city.satellite'], coreCityId: 'city.core', totalPopulation: 0, sharedNetworkIds: [], coordinationLoad: 1 } },
    facilities: {
      'facility.water': { id: 'facility.water', moduleId: 'module.water.utility', polityId: playerId, authority: { ownerId: playerId, operatorId: playerId, maintenanceOwnerId: playerId, commandAuthorityId: playerId, serviceScopes: [{ kind: 'metro', id: 'metro.home' }] }, lifecycle: { status: 'operating', condition: 100, maintenanceBacklog: 0, startedDay: 0 }, maintenanceStaffRequired: 1, recurringEffects: [{ kind: 'quantity', timing: 'perDay', target: { kind: 'polity', id: playerId }, quantityId: 'provision.waterDays', operation: 'add', value: 0.4, reasonKey: 'facility.water.daily' }] },
    },
    networks: {}, fleets: {}, theatres: {}, spaceAssets: {},
    relations: { 'relation.player-peer': { id: 'relation.player-peer', actorAId: playerId, actorBId: peerId, stance: 'contact', trustAtoB: 0, trustBtoA: 0, agreementIds: [], grievanceIds: [] } },
    observations: [{ observerId: playerId, subjectId: peerId, fieldId: 'population.total', knownValue: '约数百人', confidence: 0.45, observedDay: 0, source: 'rumor' }],
    operations: {
      'operation.research': { id: 'operation.research', definitionId: 'definition.research.testing', kind: 'research', polityId: playerId, scope: { kind: 'polity', id: playerId }, status: 'planned', staffRequired: 2, workRequired: 4, workDone: 0, elapsedDays: 0, startDemands: [{ target: { kind: 'polity', id: playerId }, quantityId: 'construction.ldu', amount: 4 }], effects: [{ kind: 'quantity', timing: 'onComplete', target: { kind: 'polity', id: playerId }, quantityId: 'capacity.research', operation: 'add', value: 5, reasonKey: 'research.testing.completed' }, { kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.testing', maturity: 'prototype', sourceIds: ['operation.research'] }, reasonKey: 'research.testing.capability' }], },
      'operation.policy': { id: 'operation.policy', definitionId: 'definition.policy.water-priority', kind: 'policy', polityId: playerId, scope: { kind: 'polity', id: playerId }, status: 'planned', staffRequired: 1, workRequired: 0, workDone: 0, durationDays: 3, elapsedDays: 0, startDemands: [], effects: [{ kind: 'quantity', timing: 'perDay', target: { kind: 'polity', id: playerId }, quantityId: 'provision.waterDays', operation: 'add', value: 0.2, reasonKey: 'policy.water-priority.daily' }, { kind: 'relation', timing: 'onComplete', relationId: 'relation.player-peer', deltaAtoB: 2, deltaBtoA: 0, reasonKey: 'policy.water-priority.reviewed' }] },
    }, ledger: [],
  };
}
