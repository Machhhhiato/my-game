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

export type UnifiedNationContentRole =
  | 'playerPolity'
  | 'industrialCoreCity'
  | 'portCity'
  | 'administrativeCoreCity'
  | 'coastalServiceCity'
  | 'logisticsSatelliteCity';

export type UnifiedNationContentBindings = ContentRoleBindings<UnifiedNationContentRole>;

export interface UnifiedNationSliceBindings {
  polityId: KernelId;
  northCoreCityId: KernelId;
  northPortCityId: KernelId;
  centralCityId: KernelId;
  coastCoreCityId: KernelId;
  coastSatelliteCityId: KernelId;
}

export interface UnifiedNationOperationDefinition {
  id: KernelId;
  kind: OperationKind;
  title: string;
  summary: string;
  outcome: string;
  staffRequired: number;
  workRequired: number;
  durationDays?: number;
  prerequisites?: OperationPrerequisites;
  nduCost: number;
  effects: (binding: UnifiedNationSliceBindings) => EffectSpec[];
}

function legacyBindingsFromRoles(binding: UnifiedNationContentBindings): UnifiedNationSliceBindings {
  return {
    polityId: binding.playerPolity,
    northCoreCityId: binding.industrialCoreCity,
    northPortCityId: binding.portCity,
    centralCityId: binding.administrativeCoreCity,
    coastCoreCityId: binding.coastalServiceCity,
    coastSatelliteCityId: binding.logisticsSatelliteCity,
  };
}

const polityScope = (id: KernelId): ScopeRef => ({ kind: 'polity', id });
const cityScope = (id: KernelId): ScopeRef => ({ kind: 'city', id });

function capabilityFor(binding: UnifiedNationSliceBindings, id: KernelId, sourceId: KernelId, maturity: CapabilityState['maturity'] = 'replicable'): EffectSpec {
  return { kind: 'capability', timing: 'onComplete', targetPolityId: binding.polityId, capability: { id, maturity, sourceIds: [sourceId] }, reasonKey: `${id}.acquired` };
}

function nationalEffect(binding: UnifiedNationSliceBindings, quantityId: KernelId, value: number, reasonKey: string, timing: 'onComplete' | 'perDay' = 'onComplete'): EffectSpec {
  return { kind: 'quantity', timing, target: polityScope(binding.polityId), quantityId, operation: 'add', value, reasonKey };
}

function cityEffect(cityId: KernelId, quantityId: KernelId, value: number, reasonKey: string, timing: 'onComplete' | 'perDay' = 'onComplete'): EffectSpec {
  return { kind: 'quantity', timing, target: cityScope(cityId), quantityId, operation: 'add', value, reasonKey };
}

function facility(binding: UnifiedNationSliceBindings, id: KernelId, moduleId: KernelId, hostCityId: KernelId, maintenanceStaffRequired: number, recurringEffects: EffectSpec[]): EffectSpec {
  const state: FacilityState = {
    id,
    moduleId,
    polityId: binding.polityId,
    hostCityId,
    authority: {
      ownerId: binding.polityId,
      operatorId: binding.polityId,
      maintenanceOwnerId: binding.polityId,
      commandAuthorityId: binding.polityId,
      serviceScopes: [cityScope(hostCityId)],
    },
    lifecycle: { status: 'operating', condition: 88, maintenanceBacklog: 0 },
    maintenanceStaffRequired,
    recurringEffects,
  };
  return { kind: 'facility', timing: 'onComplete', facility: state, reasonKey: `${id}.commissioned` };
}

function network(binding: UnifiedNationSliceBindings, id: KernelId, kind: NetworkState['kind'], endpointIds: KernelId[], capacity: number, redundancy: number): EffectSpec {
  const state: NetworkState = {
    id,
    polityId: binding.polityId,
    kind,
    endpointIds,
    capacity,
    condition: 90,
    redundancy,
    lifecycle: { status: 'operating', condition: 90, maintenanceBacklog: 0 },
  };
  return { kind: 'network', timing: 'onComplete', network: state, reasonKey: `${id}.commissioned` };
}

const needs = (amount: number, binding: UnifiedNationSliceBindings): ResourceDemand[] => amount > 0 ? [{ target: polityScope(binding.polityId), quantityId: 'construction.ndu', amount }] : [];

/**
 * 统一国家开发纵切片的静态内容。城市 ID 由 bindings 注入，使内容包不依赖任何剧本名称、坐标或视觉资产。
 */
export function unifiedNationOperationDefinitions(binding: UnifiedNationSliceBindings): UnifiedNationOperationDefinition[] {
  const northCore = binding.northCoreCityId;
  const northPort = binding.northPortCityId;
  const central = binding.centralCityId;
  const coast = binding.coastCoreCityId;
  const coastSatellite = binding.coastSatelliteCityId;
  return [
    {
      id: 'operation.tech.grid-dispatch', kind: 'research', title: '电网调度方法', summary: '建立跨区负荷预测、检修窗口与备用容量的统一调度方法。', outcome: '获得跨区电网调度能力，并可筹建跨区互联线。', staffRequired: 4_200, workRequired: 18, nduCost: 5,
      effects: () => [capabilityFor(binding, 'capability.grid-dispatch', 'operation.tech.grid-dispatch', 'scaled')],
    },
    {
      id: 'operation.tech.safe-water-standard', kind: 'research', title: '城市供水安全标准', summary: '把取水、净化、检验和故障隔离写成可执行的统一标准。', outcome: '获得城市供水标准能力，并可建设海岸净水厂。', staffRequired: 3_600, workRequired: 16, nduCost: 4,
      effects: () => [capabilityFor(binding, 'capability.safe-water-service', 'operation.tech.safe-water-standard', 'scaled')],
    },
    {
      id: 'operation.tech.component-standardisation', kind: 'research', title: '关键部件互换体系', summary: '统一常用阀件、轴承、紧固件与检修记录的规格。', outcome: '获得工业互换件能力，并可扩建区域检修中心。', staffRequired: 3_200, workRequired: 17, nduCost: 4,
      effects: () => [capabilityFor(binding, 'capability.industrial-standard', 'operation.tech.component-standardisation', 'scaled')],
    },
    {
      id: 'operation.tech.systems-survey', kind: 'research', title: '国家设施普查', summary: '以统一编号记录现有设施的服务对象、状态与维护缺口。', outcome: '获得系统普查能力，并可建设技术学院和服务登记链路。', staffRequired: 2_800, workRequired: 15, nduCost: 3,
      effects: () => [capabilityFor(binding, 'capability.systems-survey', 'operation.tech.systems-survey', 'replicable')],
    },
    {
      id: 'operation.tech.network-operations', kind: 'research', title: '跨区网络运行学', summary: '把互联线的负荷、故障切换和检修编排转为连续运行制度。', outcome: '获得网络运行能力，并可组织国家级货运走廊。', staffRequired: 4_600, workRequired: 20, nduCost: 5, prerequisites: { networkIds: ['network.national-intertie'] },
      effects: () => [capabilityFor(binding, 'capability.network-operations', 'operation.tech.network-operations', 'scaled')],
    },
    {
      id: 'operation.tech.freight-routing', kind: 'research', title: '干线货运编组', summary: '以装卸窗口、周转容器和优先级表协调跨区物资运输。', outcome: '获得干线货运能力，并可建设海岸货运走廊。', staffRequired: 4_100, workRequired: 19, nduCost: 5, prerequisites: { capabilityIds: ['capability.network-operations'] },
      effects: () => [capabilityFor(binding, 'capability.freight-routing', 'operation.tech.freight-routing', 'scaled')],
    },
    {
      id: 'operation.tech.service-registry', kind: 'research', title: '公共服务登记标准', summary: '把人口、服务覆盖、设备状态与申诉记录接入同一套可审计口径。', outcome: '获得公共服务登记能力，并可建设区域登记链路。', staffRequired: 3_400, workRequired: 18, nduCost: 4, prerequisites: { capabilityIds: ['capability.systems-survey'] },
      effects: () => [capabilityFor(binding, 'capability.service-registry', 'operation.tech.service-registry', 'replicable')],
    },
    {
      id: 'operation.tech.urban-health-coordination', kind: 'research', title: '都市卫生协同', summary: '将饮水监测、基层诊疗、转诊与流行病报告接入统一处置流程。', outcome: '获得都市卫生协同能力，并可扩建都市诊疗网。', staffRequired: 4_000, workRequired: 20, nduCost: 5, prerequisites: { facilityIds: ['facility.coast-waterworks'] },
      effects: () => [capabilityFor(binding, 'capability.urban-health', 'operation.tech.urban-health-coordination', 'scaled')],
    },
    {
      id: 'operation.tech.resilience-modeling', kind: 'research', title: '沿海韧性评估', summary: '结合补给网络、地势与设施状态，确定优先加固的服务节点。', outcome: '获得区域韧性评估能力，并可实施海岸防护工程。', staffRequired: 3_900, workRequired: 21, nduCost: 5, prerequisites: { capabilityIds: ['capability.systems-survey'], networkIds: ['network.coastal-freight-corridor'] },
      effects: () => [capabilityFor(binding, 'capability.resilience-planning', 'operation.tech.resilience-modeling', 'scaled')],
    },
    {
      id: 'operation.tech.civil-protection-protocols', kind: 'research', title: '民防通信规程', summary: '把预警、疏散、救援和跨部门联络写成可轮换执行的公共流程。', outcome: '获得民防通信能力，并可建设区域应急通信塔。', staffRequired: 3_700, workRequired: 18, nduCost: 4, prerequisites: { facilityIds: ['facility.central-dispatch'] },
      effects: () => [capabilityFor(binding, 'capability.civil-protection-comms', 'operation.tech.civil-protection-protocols', 'replicable')],
    },

    {
      id: 'operation.project.national-intertie', kind: 'engineering', title: '跨区电力互联线', summary: '连接北部工业区、中央调度区和海岸服务区的主干输电工程。', outcome: '形成一条可维护的国家电力网络。', staffRequired: 18_000, workRequired: 34, nduCost: 28, prerequisites: { capabilityIds: ['capability.grid-dispatch'] },
      effects: () => [network(binding, 'network.national-intertie', 'power', [northCore, central, coast], 76, 24), nationalEffect(binding, 'capacity.energy', 4, 'network.national-intertie.capacity')],
    },
    {
      id: 'operation.project.central-dispatch', kind: 'engineering', title: '中央调度中心', summary: '建立可持续值守的电力、维修与紧急转供调度设施。', outcome: '形成国家级调度设施，并持续提高统筹能力。', staffRequired: 15_000, workRequired: 31, nduCost: 24, prerequisites: { capabilityIds: ['capability.grid-dispatch'], networkIds: ['network.national-intertie'] },
      effects: () => [facility(binding, 'facility.central-dispatch', 'module.dispatch.center', central, 1_800, [nationalEffect(binding, 'capacity.coordination', 0.12, 'facility.central-dispatch.daily', 'perDay')])],
    },
    {
      id: 'operation.project.coast-waterworks', kind: 'engineering', title: '海岸净水厂', summary: '建设取水、净化、检验和故障隔离一体化的城市净水设施。', outcome: '海岸核心城市获得更稳定的供水服务。', staffRequired: 16_000, workRequired: 30, nduCost: 23, prerequisites: { capabilityIds: ['capability.safe-water-service'] },
      effects: () => [facility(binding, 'facility.coast-waterworks', 'module.waterworks.city', coast, 2_200, [cityEffect(coast, 'service.waterCoverage', 0.10, 'facility.coast-waterworks.daily', 'perDay')]), cityEffect(coast, 'service.waterCoverage', 18, 'facility.coast-waterworks.opened')],
    },
    {
      id: 'operation.project.north-repair-center', kind: 'engineering', title: '北部检修中心', summary: '扩建部件检测、翻修、调拨与培训一体化的区域维修中心。', outcome: '形成可复制的检修能力，并持续缓解维护积压。', staffRequired: 14_000, workRequired: 28, nduCost: 21, prerequisites: { capabilityIds: ['capability.industrial-standard'] },
      effects: () => [facility(binding, 'facility.north-repair-center', 'module.repair.center', northCore, 2_600, [nationalEffect(binding, 'maintenance.backlog', -0.10, 'facility.north-repair-center.daily', 'perDay'), nationalEffect(binding, 'construction.ndu', 0.25, 'facility.north-repair-center.daily', 'perDay')]), nationalEffect(binding, 'capacity.engineering', 3, 'facility.north-repair-center.opened')],
    },
    {
      id: 'operation.project.technical-institute', kind: 'engineering', title: '国家技术学院', summary: '将设施普查、工艺试验和师徒训练接入可持续的公共技术教育体系。', outcome: '形成技术教育设施，并持续提升研究与工务能力。', staffRequired: 12_000, workRequired: 26, nduCost: 20, prerequisites: { capabilityIds: ['capability.systems-survey'] },
      effects: () => [facility(binding, 'facility.technical-institute', 'module.technical.institute', central, 1_600, [nationalEffect(binding, 'capacity.research', 0.10, 'facility.technical-institute.daily', 'perDay'), nationalEffect(binding, 'capacity.engineering', 0.06, 'facility.technical-institute.daily', 'perDay')])],
    },
    {
      id: 'operation.project.coastal-freight-corridor', kind: 'engineering', title: '海岸货运走廊', summary: '升级港口、仓储和干线衔接，建立可调度的跨区物资走廊。', outcome: '形成海岸货运网络，并提高国家运输能力。', staffRequired: 18_000, workRequired: 35, nduCost: 30, prerequisites: { capabilityIds: ['capability.freight-routing'], networkIds: ['network.national-intertie'] },
      effects: () => [network(binding, 'network.coastal-freight-corridor', 'rail', [northPort, central, coast, coastSatellite], 72, 18), nationalEffect(binding, 'capacity.logistics', 5, 'network.coastal-freight-corridor.capacity')],
    },
    {
      id: 'operation.project.registry-relay', kind: 'engineering', title: '区域服务登记链路', summary: '把人口登记、服务覆盖与维修状态接入可校验的跨区通信链路。', outcome: '形成公共服务网络，并提高统筹与教育服务的覆盖基础。', staffRequired: 11_000, workRequired: 24, nduCost: 16, prerequisites: { capabilityIds: ['capability.service-registry'] },
      effects: () => [network(binding, 'network.service-registry-relay', 'comms', [northCore, central, coast], 68, 38), nationalEffect(binding, 'capacity.coordination', 3, 'network.service-registry-relay.capacity')],
    },
    {
      id: 'operation.project.metro-clinic-network', kind: 'engineering', title: '都市诊疗网络', summary: '扩充基层诊疗点、转诊车队和公共卫生实验室之间的协同设施。', outcome: '海岸都市圈获得可维护的诊疗网络。', staffRequired: 14_000, workRequired: 27, nduCost: 22, prerequisites: { capabilityIds: ['capability.urban-health'], facilityIds: ['facility.coast-waterworks'] },
      effects: () => [facility(binding, 'facility.metro-clinic-network', 'module.health.metro-network', coast, 2_000, [cityEffect(coast, 'service.healthCoverage', 0.12, 'facility.metro-clinic-network.daily', 'perDay')]), cityEffect(coast, 'service.healthCoverage', 16, 'facility.metro-clinic-network.opened')],
    },
    {
      id: 'operation.project.coastal-resilience-works', kind: 'engineering', title: '海岸服务节点加固', summary: '加固关键仓储、供水与避难节点，减少恶劣天气造成的服务中断。', outcome: '形成韧性设施，并降低海岸地区的环境压力。', staffRequired: 17_000, workRequired: 33, nduCost: 29, prerequisites: { capabilityIds: ['capability.resilience-planning'], networkIds: ['network.coastal-freight-corridor'] },
      effects: () => [facility(binding, 'facility.coastal-resilience-works', 'module.resilience.coastal', coastSatellite, 1_500, [nationalEffect(binding, 'capacity.ecology', 0.08, 'facility.coastal-resilience-works.daily', 'perDay')]), nationalEffect(binding, 'capacity.ecology', 4, 'facility.coastal-resilience-works.opened')],
    },
    {
      id: 'operation.project.emergency-comms-tower', kind: 'engineering', title: '区域应急通信塔', summary: '建设面向预警、救援和跨部门指挥的冗余通信设施。', outcome: '形成民防通信设施，并提高防卫与统筹能力。', staffRequired: 10_000, workRequired: 22, nduCost: 15, prerequisites: { capabilityIds: ['capability.civil-protection-comms'], facilityIds: ['facility.central-dispatch'] },
      effects: () => [facility(binding, 'facility.emergency-comms-tower', 'module.comms.emergency', northPort, 900, [nationalEffect(binding, 'capacity.defense', 0.08, 'facility.emergency-comms-tower.daily', 'perDay')]), nationalEffect(binding, 'capacity.coordination', 2, 'facility.emergency-comms-tower.opened')],
    },

    {
      id: 'operation.policy.maintenance-renewal', kind: 'policy', title: '维护更新令', summary: '在一个执行周期内优先处理跨区电网与公共设施的积压检修。', outcome: '短期集中压降维护积压，但占用行政与检修协调编制。', staffRequired: 22_000, workRequired: 0, durationDays: 30, nduCost: 2, prerequisites: { facilityIds: ['facility.central-dispatch'] },
      effects: () => [nationalEffect(binding, 'maintenance.backlog', -0.22, 'policy.maintenance-renewal.daily', 'perDay')],
    },
    {
      id: 'operation.policy.public-apprenticeship', kind: 'policy', title: '公共学徒计划', summary: '以技术学院为节点，安排检修、实验与公共服务岗位的轮换培养。', outcome: '持续提高研究与工务能力。', staffRequired: 18_000, workRequired: 0, durationDays: 45, nduCost: 2, prerequisites: { facilityIds: ['facility.technical-institute'] },
      effects: () => [nationalEffect(binding, 'capacity.research', 0.08, 'policy.public-apprenticeship.daily', 'perDay'), nationalEffect(binding, 'capacity.engineering', 0.08, 'policy.public-apprenticeship.daily', 'perDay')],
    },
    {
      id: 'operation.policy.water-service-priority', kind: 'policy', title: '供水服务优先令', summary: '在一个执行周期内将海岸维护与检验资源优先用于供水系统。', outcome: '短期提高海岸供水与诊疗覆盖。', staffRequired: 16_000, workRequired: 0, durationDays: 20, nduCost: 1, prerequisites: { facilityIds: ['facility.coast-waterworks'] },
      effects: () => [cityEffect(coast, 'service.waterCoverage', 0.12, 'policy.water-service-priority.daily', 'perDay'), cityEffect(coast, 'service.healthCoverage', 0.05, 'policy.water-service-priority.daily', 'perDay')],
    },
    {
      id: 'operation.policy.freight-coordination', kind: 'policy', title: '干线货运协同令', summary: '统一装卸窗口、优先级与维修时段，减少跨区运输中的空转。', outcome: '短期提高运输能力与建设物资周转。', staffRequired: 20_000, workRequired: 0, durationDays: 30, nduCost: 2, prerequisites: { networkIds: ['network.coastal-freight-corridor'] },
      effects: () => [nationalEffect(binding, 'capacity.logistics', 0.12, 'policy.freight-coordination.daily', 'perDay'), nationalEffect(binding, 'construction.ndu', 0.18, 'policy.freight-coordination.daily', 'perDay')],
    },
    {
      id: 'operation.policy.registry-audit', kind: 'policy', title: '服务登记复核', summary: '集中校验人口、设施和服务记录，清理跨区协作中的失真数据。', outcome: '短期提高国家统筹能力。', staffRequired: 14_000, workRequired: 0, durationDays: 24, nduCost: 1, prerequisites: { networkIds: ['network.service-registry-relay'] },
      effects: () => [nationalEffect(binding, 'capacity.coordination', 0.14, 'policy.registry-audit.daily', 'perDay')],
    },
    {
      id: 'operation.policy.clinical-rotation', kind: 'policy', title: '跨城诊疗轮换', summary: '组织诊疗、检验与转诊队伍在都市圈内按需求轮换。', outcome: '短期提高都市圈的医疗服务覆盖。', staffRequired: 19_000, workRequired: 0, durationDays: 30, nduCost: 2, prerequisites: { facilityIds: ['facility.metro-clinic-network'] },
      effects: () => [cityEffect(coast, 'service.healthCoverage', 0.15, 'policy.clinical-rotation.daily', 'perDay'), cityEffect(coastSatellite, 'service.healthCoverage', 0.10, 'policy.clinical-rotation.daily', 'perDay')],
    },
    {
      id: 'operation.policy.resilience-reserve', kind: 'policy', title: '韧性储备计划', summary: '将一部分工务与物流能力留给恶劣天气前的预防性加固与调拨。', outcome: '短期提高生态承载与服务稳定性。', staffRequired: 17_000, workRequired: 0, durationDays: 36, nduCost: 3, prerequisites: { facilityIds: ['facility.coastal-resilience-works'] },
      effects: () => [nationalEffect(binding, 'capacity.ecology', 0.12, 'policy.resilience-reserve.daily', 'perDay'), nationalEffect(binding, 'capacity.cohesion', 0.05, 'policy.resilience-reserve.daily', 'perDay')],
    },
    {
      id: 'operation.policy.civil-preparedness', kind: 'policy', title: '公共避险演练', summary: '依托应急通信设施组织预警、避险和救援联络演练。', outcome: '短期提高民防准备与跨部门协同。', staffRequired: 15_000, workRequired: 0, durationDays: 18, nduCost: 1, prerequisites: { facilityIds: ['facility.emergency-comms-tower'] },
      effects: () => [nationalEffect(binding, 'capacity.defense', 0.14, 'policy.civil-preparedness.daily', 'perDay'), nationalEffect(binding, 'capacity.coordination', 0.06, 'policy.civil-preparedness.daily', 'perDay')],
    },
    {
      id: 'operation.policy.procurement-assurance', kind: 'policy', title: '维修采购保障', summary: '以统一部件目录和检修中心为依据，压缩关键备件的等待时间。', outcome: '短期缓解维护积压并提高工务能力。', staffRequired: 16_000, workRequired: 0, durationDays: 28, nduCost: 2, prerequisites: { facilityIds: ['facility.north-repair-center'] },
      effects: () => [nationalEffect(binding, 'maintenance.backlog', -0.16, 'policy.procurement-assurance.daily', 'perDay'), nationalEffect(binding, 'capacity.engineering', 0.08, 'policy.procurement-assurance.daily', 'perDay')],
    },
    {
      id: 'operation.policy.regional-service-compact', kind: 'policy', title: '区域服务协定', summary: '明确地区之间的服务责任、转供顺序与争议上报程序。', outcome: '短期提高共同体协作与国家统筹能力。', staffRequired: 21_000, workRequired: 0, durationDays: 40, nduCost: 2, prerequisites: { capabilityIds: ['capability.service-registry'], facilityIds: ['facility.central-dispatch'] },
      effects: () => [nationalEffect(binding, 'capacity.cohesion', 0.10, 'policy.regional-service-compact.daily', 'perDay'), nationalEffect(binding, 'capacity.coordination', 0.08, 'policy.regional-service-compact.daily', 'perDay')],
    },
  ];
}

function buildUnifiedNationOperations(binding: UnifiedNationSliceBindings): Record<KernelId, OperationState> {
  return Object.fromEntries(unifiedNationOperationDefinitions(binding).map((definition) => [definition.id, {
    id: definition.id,
    definitionId: definition.id,
    kind: definition.kind,
    polityId: binding.polityId,
    scope: polityScope(binding.polityId),
    status: 'planned',
    staffRequired: definition.staffRequired,
    workRequired: definition.workRequired,
    workDone: 0,
    durationDays: definition.durationDays,
    elapsedDays: 0,
    prerequisites: definition.prerequisites,
    startDemands: needs(definition.nduCost, binding),
    effects: definition.effects(binding),
  }]));
}

/**
 * R12 的内容包只面向城市角色，不含任何固定剧本名、坐标或预先指定的存档 ID。
 * 当前定义体仍保留旧绑定适配层，便于后续把大量静态条目逐步迁成纯数据模板。
 */
export const UNIFIED_NATION_CONTENT_PACKAGE: NationContentPackage<UnifiedNationContentRole> = {
  id: 'package.unified-nation.core-services',
  stage: 'unifiedNation',
  roleRequirements: [
    { role: 'playerPolity', entity: 'polity', description: '统一国家的中央政府' },
    { role: 'industrialCoreCity', entity: 'city', description: '工业与检修核心城市' },
    { role: 'portCity', entity: 'city', description: '港口与外运城市' },
    { role: 'administrativeCoreCity', entity: 'city', description: '行政与调度核心城市' },
    { role: 'coastalServiceCity', entity: 'city', description: '需要提升公共服务的城市' },
    { role: 'logisticsSatelliteCity', entity: 'city', description: '承担物流与韧性节点的卫星城市' },
  ],
  operationDefinitions: (roles) => unifiedNationOperationDefinitions(legacyBindingsFromRoles(roles)),
  createOperations: (roles) => buildUnifiedNationOperations(legacyBindingsFromRoles(roles)),
};

/** @deprecated 新存档请通过 UNIFIED_NATION_CONTENT_PACKAGE 安装；保留给既有测试入口。 */
export function createUnifiedNationOperations(binding: UnifiedNationSliceBindings): Record<KernelId, OperationState> {
  return buildUnifiedNationOperations(binding);
}
