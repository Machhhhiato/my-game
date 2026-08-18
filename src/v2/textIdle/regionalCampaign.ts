import type { CityState, EffectSpec, FacilityState, KernelId, NationKernelState, NetworkState, OperationState } from '../nationKernel/types';

export interface RegionalOperationDefinition {
  id: KernelId;
  kind: OperationState['kind'];
  title: string;
  summary: string;
  outcome: string;
  staffRequired: number;
  workRequired: number;
  durationDays?: number;
  constructionCost: number;
  prerequisites?: OperationState['prerequisites'];
  effects: (playerId: KernelId) => EffectSpec[];
}

const polityScope = (playerId: KernelId) => ({ kind: 'polity' as const, id: playerId });

function regionalRelay(playerId: KernelId): FacilityState {
  return {
    id: 'facility.regional-relay', moduleId: 'module.regional.relay', polityId: playerId,
    authority: { ownerId: playerId, operatorId: playerId, maintenanceOwnerId: playerId, commandAuthorityId: playerId, serviceScopes: [polityScope(playerId)] },
    lifecycle: { status: 'operating', condition: 100, maintenanceBacklog: 0 }, maintenanceStaffRequired: 1,
    recurringEffects: [],
  };
}

function supplyRoute(playerId: KernelId): NetworkState {
  return {
    id: 'network.regional-supply-route', polityId: playerId, kind: 'road', endpointIds: ['city.core', 'facility.regional-relay'],
    capacity: 14, condition: 92, redundancy: 0, lifecycle: { status: 'operating', condition: 92, maintenanceBacklog: 0 },
  };
}

function regionalNode(playerId: KernelId, id: KernelId, cellId: string, role: string): CityState {
  return { id, polityId: playerId, regionId: 'region.home', geoRef: { kind: 'point', cellId, local: [0.5, 0.5] }, stage: 'outpost', role, population: 0, builtAreaKm2: 0.01, facilityIds: [] };
}

/** R21 区域网络的最小内容包。ID 是未来地理系统的挂接点，而非剧本地点。 */
export const REGIONAL_OPERATION_DEFINITIONS: RegionalOperationDefinition[] = [
  {
    id: 'operation.regional.survey', kind: 'survey', title: '外围定点普查',
    summary: '对已知范围外的补给条件、通行窗口和可值守地点进行连续普查。',
    outcome: '获得区域勘察能力，可建立首个区域中继点。', staffRequired: 1, workRequired: 8, constructionCost: 0,
    effects: (playerId) => [{ kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.regional-survey', maturity: 'replicable', sourceIds: ['operation.regional.survey'] }, reasonKey: 'regional.survey.completed' }],
  },
  {
    id: 'operation.regional.relay', kind: 'engineering', title: '区域中继点',
    summary: '设置补给、联络和轮换值守所需的标准中继设施。',
    outcome: '一处区域中继点投入值守，可接通稳定补给线。', staffRequired: 2, workRequired: 10, constructionCost: 3,
    prerequisites: { capabilityIds: ['capability.regional-survey'] },
    effects: (playerId) => [{ kind: 'facility', timing: 'onComplete', facility: regionalRelay(playerId), reasonKey: 'regional.relay.commissioned' }],
  },
  {
    id: 'operation.regional.supply-route', kind: 'engineering', title: '区域补给线',
    summary: '把聚居地与中继点之间的补给、修理和信息传递固定为可维护路线。',
    outcome: '区域补给线投入运行，区域联接不再完全依赖临时队伍。', staffRequired: 2, workRequired: 12, constructionCost: 4,
    prerequisites: { facilityIds: ['facility.regional-relay'] },
    effects: (playerId) => [{ kind: 'network', timing: 'onComplete', network: supplyRoute(playerId), reasonKey: 'regional.route.commissioned' }],
  },
  {
    id: 'operation.regional.compact', kind: 'policy', title: '区域协作章程',
    summary: '明确中继值守、物资转供和争议上报的共同规则。',
    outcome: '区域协作进入固定程序，为下一阶段的统合工作建立基础。', staffRequired: 1, workRequired: 0, durationDays: 12, constructionCost: 0,
    prerequisites: { networkIds: ['network.regional-supply-route'] },
    effects: (playerId) => [{ kind: 'quantity', timing: 'perDay', target: polityScope(playerId), quantityId: 'capacity.coordination', operation: 'add', value: 0.08, reasonKey: 'regional.compact.daily' }],
  },
  {
    id: 'operation.integration.first-node', kind: 'engineering', title: '首个常驻节点',
    summary: '在区域补给线可达范围内设置固定轮换班组与基本服务点。',
    outcome: '新增一个内部节点，并从核心聚居地调拨首批常驻人员。', staffRequired: 2, workRequired: 12, constructionCost: 1,
    prerequisites: { completedOperationIds: ['operation.regional.compact'] },
    effects: (playerId) => [
      { kind: 'city', timing: 'onComplete', city: regionalNode(playerId, 'city.regional-node-a', 'geo.region.node-a', 'service'), initialQuantities: { 'service.waterCoverage': 0, 'service.healthCoverage': 0, 'service.educationCoverage': 0 }, reasonKey: 'integration.node-a.opened' },
      { kind: 'populationTransfer', timing: 'onComplete', fromCityId: 'city.core', toCityId: 'city.regional-node-a', amount: 5, reasonKey: 'integration.node-a.staffed' },
    ],
  },
  {
    id: 'operation.integration.second-node', kind: 'engineering', title: '第二个常驻节点',
    summary: '将轮换补给和维修岗位延伸到另一处稳定值守点。',
    outcome: '新增第二个内部节点，区域不再只有单一中心。', staffRequired: 2, workRequired: 14, constructionCost: 1,
    prerequisites: { completedOperationIds: ['operation.integration.first-node'] },
    effects: (playerId) => [
      { kind: 'city', timing: 'onComplete', city: regionalNode(playerId, 'city.regional-node-b', 'geo.region.node-b', 'maintenance'), initialQuantities: { 'service.waterCoverage': 0, 'service.healthCoverage': 0, 'service.educationCoverage': 0 }, reasonKey: 'integration.node-b.opened' },
      { kind: 'populationTransfer', timing: 'onComplete', fromCityId: 'city.core', toCityId: 'city.regional-node-b', amount: 4, reasonKey: 'integration.node-b.staffed' },
    ],
  },
  {
    id: 'operation.integration.service-register', kind: 'policy', title: '区域服务登记',
    summary: '把各节点的常驻人口、供给状态和公共服务班次纳入共同登记。',
    outcome: '可在节点间调配公共服务人员，服务覆盖按日更新。', staffRequired: 1, workRequired: 0, durationDays: 12, constructionCost: 0,
    prerequisites: { completedOperationIds: ['operation.integration.second-node'] },
    effects: (playerId) => [{ kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.regional-service-registry', maturity: 'replicable', sourceIds: ['operation.integration.service-register'] }, reasonKey: 'integration.service-registry.completed' }],
  },
  {
    id: 'operation.integration.internal-compact', kind: 'policy', title: '内部统合章程',
    summary: '确定多节点之间的维修优先级、服务责任和共同决议程序。',
    outcome: '区域统合完成，可作为统一国家阶段的内部基础。', staffRequired: 1, workRequired: 0, durationDays: 15, constructionCost: 0,
    prerequisites: { capabilityIds: ['capability.regional-service-registry'] },
    effects: (playerId) => [{ kind: 'capability', timing: 'onComplete', targetPolityId: playerId, capability: { id: 'capability.internal-integration', maturity: 'integrated', sourceIds: ['operation.integration.internal-compact'] }, reasonKey: 'integration.compact.completed' }],
  },
];

export function installRegionalCampaignContent(state: NationKernelState): NationKernelState {
  const playerId = state.playerPolityId;
  const scope = polityScope(playerId);
  const region = state.regions['region.home'];
  if (region != null && region.serviceAssignments == null) region.serviceAssignments = { 'city.core': state.polities[playerId]?.workforce.publicServices ?? 0 };
  if (region != null && state.quantities['city:city.core'] == null) {
    state.quantities['city:city.core'] = {
      'service.waterCoverage': { current: Math.min(100, Math.round(region.integration.services)), updatedDay: state.calendar.day, sourceIds: ['regional.bridge'] },
      'service.healthCoverage': { current: Math.min(100, Math.round(region.integration.services * .65)), updatedDay: state.calendar.day, sourceIds: ['regional.bridge'] },
      'service.educationCoverage': { current: 0, updatedDay: state.calendar.day, sourceIds: ['regional.bridge'] },
    };
  }
  for (const definition of REGIONAL_OPERATION_DEFINITIONS) {
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

export function regionalCampaignComplete(state: NationKernelState): boolean {
  return ['operation.regional.survey', 'operation.regional.relay', 'operation.regional.supply-route', 'operation.regional.compact'].every((id) => state.operations[id]?.status === 'completed');
}

export function regionalIntegrationComplete(state: NationKernelState): boolean {
  return ['operation.integration.first-node', 'operation.integration.second-node', 'operation.integration.service-register', 'operation.integration.internal-compact'].every((id) => state.operations[id]?.status === 'completed');
}
