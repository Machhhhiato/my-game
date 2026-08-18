import type { EffectSpec, FacilityState, KernelId, NationKernelState, NetworkState, RegionState } from '../nationKernel/types';
import type { RegionalOperationDefinition } from './regionalCampaign';

const polityScope = (playerId: KernelId) => ({ kind: 'polity' as const, id: playerId });
const cityScope = (cityId: KernelId) => ({ kind: 'city' as const, id: cityId });

function nationalOffice(playerId: KernelId): FacilityState {
  return {
    id: 'facility.national-coordination-office', moduleId: 'module.national.coordination-office', polityId: playerId, hostCityId: 'city.core',
    authority: { ownerId: playerId, operatorId: playerId, maintenanceOwnerId: playerId, commandAuthorityId: playerId, serviceScopes: [polityScope(playerId), { kind: 'region', id: 'region.home' }, { kind: 'region', id: 'region.national-service-district' }] },
    lifecycle: { status: 'operating', condition: 100, maintenanceBacklog: 0 }, maintenanceStaffRequired: 1, recurringEffects: [],
  };
}

function nationalTrunk(playerId: KernelId): NetworkState {
  return {
    id: 'network.national-service-trunk', polityId: playerId, kind: 'road', endpointIds: ['city.core', 'city.regional-node-b'],
    capacity: 18, condition: 90, redundancy: 0, lifecycle: { status: 'operating', condition: 90, maintenanceBacklog: 0 },
  };
}

function serviceDistrict(playerId: KernelId): RegionState {
  return {
    id: 'region.national-service-district', polityId: playerId, cityIds: [], ruralPopulation: 0,
    integration: { registry: 0, services: 0, justice: 0, security: 0, executionQuality: 0 }, environmentPressure: 0,
    serviceAssignments: { 'city.regional-node-b': 0 },
  };
}

function serviceGuaranteeEffects(playerId: KernelId): EffectSpec[] {
  return [
    { kind: 'quantity', timing: 'perDay', target: cityScope('city.core'), quantityId: 'service.waterCoverage', operation: 'set', value: 60, reasonKey: 'nation.service-guarantee.core-water' },
    { kind: 'quantity', timing: 'perDay', target: cityScope('city.regional-node-a'), quantityId: 'service.waterCoverage', operation: 'set', value: 45, reasonKey: 'nation.service-guarantee.node-a-water' },
    { kind: 'quantity', timing: 'perDay', target: cityScope('city.regional-node-b'), quantityId: 'service.waterCoverage', operation: 'set', value: 45, reasonKey: 'nation.service-guarantee.node-b-water' },
    { kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.national-service-guarantee', maturity: 'integrated', sourceIds: ['operation.nation.service-guarantee'] }, reasonKey: 'nation.service-guarantee.completed' },
  ];
}

/** R23 统一国家纵切片。所有区域和设施均属同一玩家政体，不代表独立势力或空间地图。 */
export const UNIFIED_NATION_OPERATION_DEFINITIONS: RegionalOperationDefinition[] = [
  {
    id: 'operation.nation.registry-method', kind: 'research', title: '跨区登记方法',
    summary: '统一人口、服务责任、维护义务与申诉上报的登记口径。',
    outcome: '形成国家登记能力，并把既有常驻节点纳入两个内部行政区域。', staffRequired: 1, workRequired: 10, constructionCost: 0,
    prerequisites: { capabilityIds: ['capability.internal-integration'] },
    effects: (playerId) => [
      { kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.national-registry', maturity: 'replicable', sourceIds: ['operation.nation.registry-method'] }, reasonKey: 'nation.registry.completed' },
      { kind: 'region', timing: 'onComplete', region: serviceDistrict(playerId), reassignCityIds: ['city.regional-node-b'], reasonKey: 'nation.service-district.registered' },
    ],
  },
  {
    id: 'operation.nation.coordination-office', kind: 'engineering', title: '国家调度所',
    summary: '设置汇总维修、服务班次和跨区调拨所需的常设调度设施。',
    outcome: '国家调度所投入运行，跨区行政有了可维护的实体承载。', staffRequired: 2, workRequired: 12, constructionCost: 2,
    prerequisites: { capabilityIds: ['capability.national-registry'] },
    effects: (playerId) => [{ kind: 'facility', timing: 'onComplete', facility: nationalOffice(playerId), reasonKey: 'nation.coordination-office.commissioned' }],
  },
  {
    id: 'operation.nation.service-trunk', kind: 'engineering', title: '干线补给网',
    summary: '把既有节点之间的补给、检修和公共服务调度固定为跨区干线。',
    outcome: '干线补给网投入运行，国家调度不再只依赖临时队伍。', staffRequired: 2, workRequired: 14, constructionCost: 3,
    prerequisites: { facilityIds: ['facility.national-coordination-office'], networkIds: ['network.regional-supply-route'] },
    effects: (playerId) => [{ kind: 'network', timing: 'onComplete', network: nationalTrunk(playerId), reasonKey: 'nation.service-trunk.commissioned' }],
  },
  {
    id: 'operation.nation.service-guarantee', kind: 'policy', title: '公共服务保障令',
    summary: '在固定登记与干线条件下，连续核对各区供水责任并优先补足服务班次。',
    outcome: '服务保障程序完成，形成统一的公共服务责任。', staffRequired: 1, workRequired: 0, durationDays: 10, constructionCost: 0,
    prerequisites: { networkIds: ['network.national-service-trunk'] },
    effects: (playerId) => serviceGuaranteeEffects(playerId),
  },
  {
    id: 'operation.nation.unification-charter', kind: 'policy', title: '统一国家章程',
    summary: '确认统一登记、跨区调度、服务申诉和共同保障的中央责任。',
    outcome: '统一国家成立；地方继续承担现场执行与反馈，但不成为并列主权。', staffRequired: 1, workRequired: 0, durationDays: 14, constructionCost: 0,
    prerequisites: { capabilityIds: ['capability.national-service-guarantee'], facilityIds: ['facility.national-coordination-office'], networkIds: ['network.national-service-trunk'] },
    effects: (playerId) => [
      { kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.unified-nation', maturity: 'integrated', sourceIds: ['operation.nation.unification-charter'] }, reasonKey: 'nation.charter.completed' },
      { kind: 'polityProfile', timing: 'onComplete', polityId: playerId, templateId: 'template.unified-nation', archetype: 'nationState', simulationTier: 'active', strategicIntent: ['unified-administration', 'public-service-guarantee', 'maintain-national-network'], reasonKey: 'nation.profile.unified' },
    ],
  },
];

export function installUnifiedNationContent(state: NationKernelState): NationKernelState {
  const playerId = state.playerPolityId;
  const scope = polityScope(playerId);
  for (const definition of UNIFIED_NATION_OPERATION_DEFINITIONS) {
    if (state.operations[definition.id] != null) continue;
    state.operations[definition.id] = {
      id: definition.id, definitionId: definition.id, kind: definition.kind, polityId: playerId, scope, status: 'planned',
      staffRequired: definition.staffRequired, workRequired: definition.workRequired, workDone: 0, durationDays: definition.durationDays, elapsedDays: 0,
      prerequisites: definition.prerequisites,
      startDemands: definition.constructionCost > 0 ? [{ target: scope, quantityId: 'construction.ldu', amount: definition.constructionCost }] : [],
      effects: definition.effects(playerId),
    };
  }
  return state;
}

export function unifiedNationComplete(state: NationKernelState): boolean {
  const player = state.polities[state.playerPolityId];
  const playerRegionCount = Object.values(state.regions).filter((region) => region.polityId === state.playerPolityId).length;
  return player?.archetype === 'nationState'
    && player.capabilities['capability.unified-nation'] != null
    && playerRegionCount >= 2
    && ['operation.nation.registry-method', 'operation.nation.coordination-office', 'operation.nation.service-trunk', 'operation.nation.service-guarantee', 'operation.nation.unification-charter'].every((id) => state.operations[id]?.status === 'completed');
}
