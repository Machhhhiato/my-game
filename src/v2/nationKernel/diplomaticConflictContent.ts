import type {
  CapabilityState,
  EffectSpec,
  FacilityState,
  KernelId,
  NetworkState,
  OperationKind,
  OperationPrerequisites,
  OperationState,
  ResourceDemand,
  ScopeRef,
} from './types';
import type { ContentRoleBindings, NationContentPackage } from './contentPackage';

export type DiplomaticConflictContentRole =
  | 'playerPolity'
  | 'neighborPolity'
  | 'portCity'
  | 'administrativeCoreCity'
  | 'playerSeaFleet'
  | 'bilateralRelation';

export type DiplomaticConflictContentBindings = ContentRoleBindings<DiplomaticConflictContentRole>;

export interface DiplomaticConflictSliceBindings {
  polityId: KernelId;
  neighborPolityId: KernelId;
  northPortCityId: KernelId;
  centralCityId: KernelId;
  playerFleetId: KernelId;
  relationId: KernelId;
}

export interface DiplomaticConflictOperationDefinition {
  id: KernelId;
  kind: OperationKind;
  title: string;
  summary: string;
  outcome: string;
  staffRequired: number;
  workRequired: number;
  durationDays?: number;
  nduCost: number;
  prerequisites?: OperationPrerequisites;
  effects: (binding: DiplomaticConflictSliceBindings) => EffectSpec[];
}

function legacyBindingsFromRoles(binding: DiplomaticConflictContentBindings): DiplomaticConflictSliceBindings {
  return {
    polityId: binding.playerPolity,
    neighborPolityId: binding.neighborPolity,
    northPortCityId: binding.portCity,
    centralCityId: binding.administrativeCoreCity,
    playerFleetId: binding.playerSeaFleet,
    relationId: binding.bilateralRelation,
  };
}

const polityScope = (id: KernelId): ScopeRef => ({ kind: 'polity', id });
const demand = (amount: number, binding: DiplomaticConflictSliceBindings): ResourceDemand[] => amount > 0 ? [{ target: polityScope(binding.polityId), quantityId: 'construction.ndu', amount }] : [];
const capability = (binding: DiplomaticConflictSliceBindings, id: KernelId, sourceId: KernelId, maturity: CapabilityState['maturity'] = 'replicable'): EffectSpec => ({ kind: 'capability', timing: 'onComplete', targetPolityId: binding.polityId, capability: { id, maturity, sourceIds: [sourceId] }, reasonKey: `${id}.acquired` });
const national = (binding: DiplomaticConflictSliceBindings, quantityId: KernelId, value: number, reasonKey: string, timing: 'onComplete' | 'perDay' = 'onComplete'): EffectSpec => ({ kind: 'quantity', timing, target: polityScope(binding.polityId), quantityId, operation: 'add', value, reasonKey });

function facility(binding: DiplomaticConflictSliceBindings, id: KernelId, moduleId: KernelId, hostCityId: KernelId, maintenanceStaffRequired: number, recurringEffects: EffectSpec[]): EffectSpec {
  const state: FacilityState = { id, moduleId, polityId: binding.polityId, hostCityId, authority: { ownerId: binding.polityId, operatorId: binding.polityId, maintenanceOwnerId: binding.polityId, commandAuthorityId: binding.polityId, serviceScopes: [{ kind: 'city', id: hostCityId }] }, lifecycle: { status: 'operating', condition: 87, maintenanceBacklog: 0 }, maintenanceStaffRequired, recurringEffects };
  return { kind: 'facility', timing: 'onComplete', facility: state, reasonKey: `${id}.commissioned` };
}

function network(binding: DiplomaticConflictSliceBindings, id: KernelId, kind: NetworkState['kind'], endpointIds: KernelId[], capacity: number, redundancy: number): EffectSpec {
  const state: NetworkState = { id, polityId: binding.polityId, kind, endpointIds, capacity, condition: 88, redundancy, lifecycle: { status: 'operating', condition: 88, maintenanceBacklog: 0 } };
  return { kind: 'network', timing: 'onComplete', network: state, reasonKey: `${id}.commissioned` };
}

/** 外交冲突开发切片：所有军事实力均回溯到港口、维修、通信、补给和外交程序。 */
export function diplomaticConflictOperationDefinitions(binding: DiplomaticConflictSliceBindings): DiplomaticConflictOperationDefinition[] {
  return [
    {
      id: 'operation.tech.naval-maintenance', kind: 'research', title: '舰艇维护规程', summary: '把船体检修、备件调拨与出港验收纳入统一维护制度。', outcome: '获得舰艇维护能力，并可建设专用维修泊位。', staffRequired: 4_800, workRequired: 19, nduCost: 5, prerequisites: { facilityIds: ['facility.north-repair-center', 'facility.north-port-handling'] },
      effects: () => [capability(binding, 'capability.naval-maintenance', 'operation.tech.naval-maintenance', 'scaled')],
    },
    {
      id: 'operation.tech.maritime-sensor-protocols', kind: 'research', title: '海上监视规程', summary: '统一岸基观察、航线报告与可疑接触的识别流程。', outcome: '获得海上监视能力，并可建设海岸传感网络。', staffRequired: 4_200, workRequired: 18, nduCost: 4, prerequisites: { capabilityIds: ['capability.grid-dispatch'] },
      effects: () => [capability(binding, 'capability.maritime-sensor-protocols', 'operation.tech.maritime-sensor-protocols', 'replicable')],
    },
    {
      id: 'operation.tech.maritime-inspection', kind: 'research', title: '航线核查框架', summary: '建立货运申报、临检记录与争端移交的共同程序。', outcome: '获得航线核查能力，可开展有限的外交降温行动。', staffRequired: 3_900, workRequired: 17, nduCost: 4, prerequisites: { networkIds: ['network.service-registry-relay'] },
      effects: () => [capability(binding, 'capability.maritime-inspection', 'operation.tech.maritime-inspection', 'replicable')],
    },
    {
      id: 'operation.project.naval-repair-berth', kind: 'engineering', title: '舰艇维修泊位', summary: '在既有港口内设置船体检修、备件吊装和出港检验泊位。', outcome: '形成舰艇维修设施，恢复一艘巡逻舰并提高舰队战备。', staffRequired: 14_000, workRequired: 26, nduCost: 22, prerequisites: { capabilityIds: ['capability.naval-maintenance'], facilityIds: ['facility.north-port-handling'] },
      effects: () => [facility(binding, 'facility.naval-repair-berth', 'module.naval.repair-berth', binding.northPortCityId, 1_200, [{ kind: 'fleet', timing: 'perDay', fleetId: binding.playerFleetId, readinessDelta: 0.04, supplyDaysDelta: 0.05, reasonKey: 'facility.naval-repair-berth.daily' }]), { kind: 'fleet', timing: 'onComplete', fleetId: binding.playerFleetId, readinessDelta: 6, supplyDaysDelta: 4, vesselReadiness: [{ vesselId: 'vessel.patrol', readyDelta: 1, repairingDelta: -1 }], reasonKey: 'facility.naval-repair-berth.opened' }],
    },
    {
      id: 'operation.project.coastal-sensor-net', kind: 'engineering', title: '海岸传感网络', summary: '建设岸基观察、通信转发与航道通报节点。', outcome: '形成海岸传感网络，提高防卫能力与情报可信度。', staffRequired: 11_000, workRequired: 24, nduCost: 16, prerequisites: { capabilityIds: ['capability.maritime-sensor-protocols'] },
      effects: () => [network(binding, 'network.coastal-sensor-net', 'comms', [binding.northPortCityId, binding.centralCityId], 62, 44), national(binding, 'capacity.defense', 3, 'network.coastal-sensor-net.capacity'), national(binding, 'diplomacy.intelligenceConfidence', 9, 'network.coastal-sensor-net.intelligence')],
    },
    {
      id: 'operation.project.crisis-command-relay', kind: 'engineering', title: '危机指挥中继站', summary: '将海岸观察、中央调度与港口值守接入可持续的危机通信链路。', outcome: '形成危机指挥设施，持续改善舰队战备与中央统筹。', staffRequired: 9_500, workRequired: 21, nduCost: 14, prerequisites: { networkIds: ['network.coastal-sensor-net'], facilityIds: ['facility.central-dispatch'] },
      effects: () => [facility(binding, 'facility.crisis-command-relay', 'module.comms.crisis-relay', binding.centralCityId, 700, [{ kind: 'fleet', timing: 'perDay', fleetId: binding.playerFleetId, readinessDelta: 0.05, reasonKey: 'facility.crisis-command-relay.daily' }, national(binding, 'capacity.coordination', 0.06, 'facility.crisis-command-relay.daily', 'perDay')])],
    },
    {
      id: 'operation.military.convoy-readiness', kind: 'military', title: '护航准备部署', summary: '在一个执行周期内集中安排护航轮换、补给与出港检验。', outcome: '短期提高舰队补给与战备，但持续占用防务编制。', staffRequired: 12_000, workRequired: 0, durationDays: 30, nduCost: 2, prerequisites: { facilityIds: ['facility.naval-repair-berth'] },
      effects: () => [{ kind: 'fleet', timing: 'perDay', fleetId: binding.playerFleetId, readinessDelta: 0.08, supplyDaysDelta: 0.18, reasonKey: 'operation.military.convoy-readiness.daily' }],
    },
    {
      id: 'operation.policy.port-maintenance-window', kind: 'policy', title: '港口检修窗口', summary: '固定港口与泊位的检修时段，减少紧张时期的突发停航。', outcome: '短期降低维护积压，并保持港口和舰队后勤稳定。', staffRequired: 10_000, workRequired: 0, durationDays: 24, nduCost: 1, prerequisites: { facilityIds: ['facility.naval-repair-berth'] },
      effects: () => [national(binding, 'maintenance.backlog', -0.10, 'operation.policy.port-maintenance-window.daily', 'perDay'), { kind: 'fleet', timing: 'perDay', fleetId: binding.playerFleetId, supplyDaysDelta: 0.10, reasonKey: 'operation.policy.port-maintenance-window.daily' }],
    },
    {
      id: 'operation.diplomacy.incident-hotline', kind: 'diplomacy', title: '海上事件热线', summary: '建立舰队值守与对方联络之间的紧急通报程序，避免小型接触直接升级。', outcome: '建立危机联络机制，缓和双边紧张。', staffRequired: 3_200, workRequired: 0, durationDays: 12, nduCost: 1, prerequisites: { facilityIds: ['facility.crisis-command-relay'] },
      effects: () => [{ kind: 'relation', timing: 'onComplete', relationId: binding.relationId, deltaAtoB: 8, deltaBtoA: 6, reasonKey: 'operation.diplomacy.incident-hotline.completed' }],
    },
    {
      id: 'operation.diplomacy.transit-inspection', kind: 'diplomacy', title: '航线核查会谈', summary: '以统一的货运与临检记录为基础，就敏感航线的核查程序进行会谈。', outcome: '在不放弃航线控制的前提下，逐步改善互信。', staffRequired: 4_100, workRequired: 0, durationDays: 20, nduCost: 1, prerequisites: { capabilityIds: ['capability.maritime-inspection'], networkIds: ['network.coastal-sensor-net'] },
      effects: () => [{ kind: 'relation', timing: 'perDay', relationId: binding.relationId, deltaAtoB: 0.25, deltaBtoA: 0.2, reasonKey: 'operation.diplomacy.transit-inspection.daily' }],
    },
  ];
}

function buildDiplomaticConflictOperations(binding: DiplomaticConflictSliceBindings): Record<KernelId, OperationState> {
  return Object.fromEntries(diplomaticConflictOperationDefinitions(binding).map((definition) => [definition.id, {
    id: definition.id, definitionId: definition.id, kind: definition.kind, polityId: binding.polityId, scope: polityScope(binding.polityId), status: 'planned', staffRequired: definition.staffRequired, workRequired: definition.workRequired, workDone: 0, durationDays: definition.durationDays, elapsedDays: 0, prerequisites: definition.prerequisites, startDemands: demand(definition.nduCost, binding), effects: definition.effects(binding),
  }]));
}

/** 外交冲突包只需要对手、港口、中央节点、己方舰队与双边关系这六类角色。 */
export const DIPLOMATIC_CONFLICT_CONTENT_PACKAGE: NationContentPackage<DiplomaticConflictContentRole> = {
  id: 'package.regional-diplomatic-conflict.maritime',
  stage: 'regional',
  roleRequirements: [
    { role: 'playerPolity', entity: 'polity', description: '执行外交与防卫的主权政府' },
    { role: 'neighborPolity', entity: 'polity', description: '相邻独立主权势力' },
    { role: 'portCity', entity: 'city', description: '舰队后勤港口城市' },
    { role: 'administrativeCoreCity', entity: 'city', description: '危机指挥与行政中心' },
    { role: 'playerSeaFleet', entity: 'fleet', description: '受玩家统筹的海上舰队' },
    { role: 'bilateralRelation', entity: 'relation', description: '双方关系记录' },
  ],
  operationDefinitions: (roles) => diplomaticConflictOperationDefinitions(legacyBindingsFromRoles(roles)),
  createOperations: (roles) => buildDiplomaticConflictOperations(legacyBindingsFromRoles(roles)),
};

/** @deprecated 新存档请通过 DIPLOMATIC_CONFLICT_CONTENT_PACKAGE 安装；保留给既有测试入口。 */
export function createDiplomaticConflictOperations(binding: DiplomaticConflictSliceBindings): Record<KernelId, OperationState> {
  return buildDiplomaticConflictOperations(binding);
}
