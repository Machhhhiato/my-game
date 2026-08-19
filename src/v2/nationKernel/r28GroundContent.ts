import type { ContentRoleBindings, NationContentPackage } from './contentPackage';
import type { EffectSpec, FacilityState, KernelId, OperationState, RegionState } from './types';

export type R28GroundRole = 'playerPolity' | 'industrialCoreCity' | 'borderRegion';
export type R28GroundBindings = ContentRoleBindings<R28GroundRole>;

const polityScope = (bindings: R28GroundBindings) => ({ kind: 'polity' as const, id: bindings.playerPolity });

function authority(bindings: R28GroundBindings, serviceScopes: FacilityState['authority']['serviceScopes']): FacilityState['authority'] {
  return {
    ownerId: bindings.playerPolity,
    operatorId: bindings.playerPolity,
    maintenanceOwnerId: bindings.playerPolity,
    commandAuthorityId: bindings.playerPolity,
    serviceScopes,
  };
}

function operation(
  bindings: R28GroundBindings,
  id: KernelId,
  kind: OperationState['kind'],
  staffRequired: number,
  workRequired: number,
  effects: EffectSpec[],
  extras: Partial<OperationState> = {},
): OperationState {
  return {
    id,
    definitionId: id,
    kind,
    polityId: bindings.playerPolity,
    scope: polityScope(bindings),
    status: 'planned',
    staffRequired,
    workRequired,
    workDone: 0,
    elapsedDays: 0,
    startDemands: [],
    effects,
    ...extras,
  };
}

const frontierRegion = (bindings: R28GroundBindings): RegionState => ({
  id: 'region.r28b.frontier',
  polityId: bindings.playerPolity,
  cityIds: [],
  ruralPopulation: 86_000,
  integration: {
    registry: 12,
    services: 8,
    justice: 6,
    security: 41,
    executionQuality: 9,
  },
  environmentPressure: 44,
  resourceEndowments: { 'resource.r28b.frontier-minerals': 42 },
  territory: {
    control: 42,
    integration: 8,
    development: 5,
    taxBase: 0,
    threat: 61,
    infrastructure: 10,
    resourcePotential: 42,
  },
});

export const R28_GROUND_CONTENT_PACKAGE: NationContentPackage<R28GroundRole> = {
  id: 'content.r28b.ground-industrial-slice',
  stage: 'unifiedNation',
  roleRequirements: [
    { role: 'playerPolity', entity: 'polity', description: '接收工业、守备与前沿事实的单一玩家政体。' },
    { role: 'industrialCoreCity', entity: 'city', description: '承载标准化军工装配设施的工业核心城市。' },
    { role: 'borderRegion', entity: 'region', description: '守备编制部署前已由国家管理的边境区域。' },
  ],
  operationDefinitions: (bindings) => [
    { id: 'operation.r28b.industrial-standard', kind: 'research', title: '工业互换标准', summary: '统一量规、材料批次、检验记录与备件接口。', outcome: '获得可复制的工业互换能力。', staffRequired: 3_600, workRequired: 12 },
    { id: 'operation.r28b.guard-equipment-design', kind: 'design', title: '通用守备装备定型', summary: '在维修负担、训练难度和批量制造之间完成标准化设计。', outcome: '形成可量产但尚未提供军力的装备设计。', staffRequired: 2_800, workRequired: 9, prerequisites: { capabilityIds: ['capability.r28b.interchangeable-production'] } },
    { id: 'operation.r29a.mobile-heavy-equipment-design', kind: 'design', title: '机动重装装备定型', summary: '以更高火力和主动反击能力换取更重的生产、补给与维护负担。', outcome: '形成高性能但高保障需求的替代设计；尚未量产或形成军力。', staffRequired: 4_600, workRequired: 14, prerequisites: { capabilityIds: ['capability.r28b.interchangeable-production'] } },
    { id: 'operation.r28b.military-assembly-works', kind: 'engineering', title: '守备装备装配厂', summary: `在角色绑定的工业核心城市 ${bindings.industrialCoreCity} 建设可维护装配设施。`, outcome: '形成运行中的军工厂和受容量约束的装备库存。', staffRequired: 12_000, workRequired: 15, prerequisites: { capabilityIds: ['capability.r28b.interchangeable-production'], designIds: ['design.r28b.guard-equipment'] } },
    { id: 'operation.r28b.guard-equipment-line', kind: 'production', title: '守备装备产线', summary: '把标准化设计交给运行工厂持续量产。', outcome: '产线每日形成可追溯的装备库存。', staffRequired: 4_200, workRequired: 4, prerequisites: { facilityIds: ['facility.r28b.military-assembly-works'], designIds: ['design.r28b.guard-equipment'] } },
    { id: 'operation.r29a.mobile-heavy-tooling', kind: 'engineering', title: '重装工装与储备区', summary: '在既有军工厂内准备重型动力、火控工装和独立储备区。', outcome: '工厂具备转产雷霆体系的物理条件，但当前产线仍生产磐石装备。', staffRequired: 6_800, workRequired: 8, prerequisites: { facilityIds: ['facility.r28b.military-assembly-works'], designIds: ['design.r29a.mobile-heavy-equipment'] } },
    { id: 'operation.r29a.retool-mobile-heavy-line', kind: 'production', title: '转产雷霆重装体系', summary: '停止磐石补库，改造同一条装配线并重新经历低速爬坡。', outcome: '唯一军工产线转为雷霆装备；磐石库存不再自动补充。', staffRequired: 8_200, workRequired: 6, prerequisites: { productionLineIds: ['production-line.r28b.guard-equipment'], completedOperationIds: ['operation.r29a.mobile-heavy-tooling'], designIds: ['design.r29a.mobile-heavy-equipment'] } },
    { id: 'operation.r29a.mobile-reserve-formation', kind: 'military', title: '机动重装预备队', summary: '把量产的雷霆装备、专业人员和补给编成跨区机动预备力量。', outcome: '形成高火力机动编制，同时锁定更多人员、装备与补给责任。', staffRequired: 9_500, workRequired: 8, prerequisites: { completedOperationIds: ['operation.r29a.retool-mobile-heavy-line'], designIds: ['design.r29a.mobile-heavy-equipment'] } },
    { id: 'operation.r29a.retool-guard-line', kind: 'production', title: '回切磐石守备装备', summary: '把唯一军工产线从雷霆重装体系切回易维护的磐石守备装备。', outcome: '雷霆停止补库，磐石恢复生产；产线再次承担转产与爬坡损失。', staffRequired: 6_400, workRequired: 5, prerequisites: { productionLineIds: ['production-line.r28b.guard-equipment'], completedOperationIds: ['operation.r29a.retool-mobile-heavy-line'], designIds: ['design.r28b.guard-equipment'] } },
    { id: 'operation.r28b.border-guard-formation', kind: 'military', title: '边境守备编制', summary: `为 ${bindings.borderRegion} 配置人员、训练和实际装备。`, outcome: '形成持久守备编制，并小幅提高可验证防卫能力。', staffRequired: 7_500, workRequired: 6, prerequisites: { completedOperationIds: ['operation.r28b.guard-equipment-line'], designIds: ['design.r28b.guard-equipment'] } },
    { id: 'operation.r28b.frontier-outpost', kind: 'engineering', title: '前沿据点', summary: '在守备编制掩护下建立维护、通信和接续服务据点。', outcome: '取得有限前沿存在；地区仍是低统合、高威胁、无税基状态。', staffRequired: 5_400, workRequired: 8, prerequisites: { completedOperationIds: ['operation.r28b.border-guard-formation'] } },
    { id: 'operation.r28b.frontier-registry', kind: 'policy', title: '前沿人口与权利登记', summary: '核对常住人口、家庭关系、财产争议和申诉入口。', outcome: '形成初步行政登记能力，但不直接产生税基。', staffRequired: 3_200, workRequired: 7, prerequisites: { completedOperationIds: ['operation.r28b.frontier-outpost'] } },
    { id: 'operation.r28b.frontier-supply-link', kind: 'engineering', title: '前沿补给接续线', summary: '连接工业核心与前沿据点，建立可维护的道路、通信与物资交接。', outcome: '形成有端点的补给网络，提高控制和开发条件。', staffRequired: 8_500, workRequired: 12, prerequisites: { capabilityIds: ['capability.r28b.frontier-registry'], facilityIds: ['facility.r28b.frontier-outpost'] } },
    { id: 'operation.r28b.frontier-service-mission', kind: 'policy', title: '前沿公共服务接续', summary: '在十日内轮换供水、基层诊疗、登记和维修人员。', outcome: '形成有限服务责任，地区仍未完成统合。', staffRequired: 4_600, workRequired: 0, durationDays: 10, prerequisites: { networkIds: ['network.r28b.frontier-supply-link'] } },
    { id: 'operation.r28b.initial-integration-mandate', kind: 'policy', title: '前沿初步统合令', summary: '在登记、补给和服务事实基础上建立有限司法、行政与财政责任。', outcome: '地区开始贡献少量税基与战略纵深，但仍保持部分控制和显著威胁。', staffRequired: 3_800, workRequired: 6, prerequisites: { capabilityIds: ['capability.r28b.frontier-service-responsibility'], networkIds: ['network.r28b.frontier-supply-link'] } },
  ],
  createOperations: (bindings) => ({
    'operation.r28b.industrial-standard': operation(bindings, 'operation.r28b.industrial-standard', 'research', 3_600, 12, [
      {
        kind: 'capability',
        timing: 'onComplete',
        targetPolityId: bindings.playerPolity,
        capability: { id: 'capability.r28b.interchangeable-production', maturity: 'replicable', sourceIds: ['operation.r28b.industrial-standard'] },
        reasonKey: 'r28b.industrial-standard.verified',
      },
      {
        kind: 'industrialStrategy',
        timing: 'onComplete',
        strategy: {
          policyId: 'policy.industry.limited-mobilization',
          technologyRouteId: 'technology-route.industry.balanced',
          factoryOutputModifier: 0.02,
          efficiencyCapModifier: 0,
          efficiencyGrowthModifier: 1,
          conversionRetention: 0.4,
          conversionSpeedModifier: 1,
          concentrationOutputModifier: 0.08,
          damageRiskModifier: 1,
          civilianConstructionModifier: 0,
          maintenanceDemandModifier: 1,
          stabilityPressurePerDay: 0,
        },
        reasonKey: 'r28b.industrial-strategy.baseline',
      },
    ], { startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 6 }] }),

    'operation.r28b.guard-equipment-design': operation(bindings, 'operation.r28b.guard-equipment-design', 'design', 2_800, 9, [
      {
        kind: 'design',
        timing: 'onComplete',
        design: {
          id: 'design.r28b.guard-equipment',
          polityId: bindings.playerPolity,
          kind: 'weapon',
          status: 'standardized',
          requiredCapabilityIds: ['capability.r28b.interchangeable-production'],
          tags: ['ground', 'garrison', 'maintainable'],
          productionCost: 1.2,
          maintenanceLoad: 0.18,
          identity: {
            modelId: 'model.r28b.guard-equipment.stonewall-1',
            generation: 1,
            roleIds: ['role.border-garrison', 'role.route-denial', 'role.outpost-defense'],
            presentationId: 'presentation.r28b.guard-equipment',
          },
          performance: { effectiveness: 58, reliability: 84, adaptability: 72, precision: 61, survivability: 56, mobility: 48, signature: 46 },
          impact: {
            targetDomains: ['personnel', 'armor', 'fortification'],
            effectiveRangeBand: 'regional',
            targetScale: 'formation',
            destructiveEffects: ['suppress', 'missionKill', 'areaDenial'],
            penetrationClass: 'light',
            areaEffectClass: 'corridor',
            demonstratedEffectIds: [],
            comparisonTags: ['maintainable', 'persistent-presence', 'not-heavy-assault'],
          },
          operationalDemand: {
            strategicSupplyPerDay: 0.18,
            deploymentDays: 2,
            turnaroundDays: 1,
            requiredFacilityTags: ['military-assembly', 'field-maintenance'],
            requiredNetworkKinds: ['road', 'comms'],
            environmentLimits: ['deep-isolation', 'heavy-fortification'],
          },
          constraints: {
            limitationTags: ['light-penetration', 'road-dependent', 'sustained-supply'],
            failureModeIds: ['failure.r28b.guard-equipment.spare-parts', 'failure.r28b.guard-equipment.fire-control'],
            collateralRisk: 24,
            politicalRisk: 18,
            escalationRisk: 31,
            minimumReadiness: 45,
            minimumSupplyDays: 12,
            counteredByTags: ['heavy-armor', 'fortified-line', 'long-range-strike'],
          },
          sourceIds: ['operation.r28b.guard-equipment-design'],
        },
        reasonKey: 'r28b.guard-equipment.standardized',
      },
    ], { prerequisites: { capabilityIds: ['capability.r28b.interchangeable-production'] } }),

    'operation.r29a.mobile-heavy-equipment-design': operation(bindings, 'operation.r29a.mobile-heavy-equipment-design', 'design', 4_600, 14, [
      {
        kind: 'design',
        timing: 'onComplete',
        design: {
          id: 'design.r29a.mobile-heavy-equipment',
          polityId: bindings.playerPolity,
          kind: 'vehicle',
          status: 'standardized',
          requiredCapabilityIds: ['capability.r28b.interchangeable-production'],
          tags: ['ground', 'mobile-reserve', 'counterattack', 'maintenance-intensive'],
          productionCost: 2.1,
          maintenanceLoad: 0.42,
          identity: {
            modelId: 'model.r29a.mobile-heavy-equipment.thunder-1',
            generation: 1,
            roleIds: ['role.mobile-reserve', 'role.armored-counterattack', 'role.route-reinforcement'],
            presentationId: 'presentation.r29a.mobile-heavy-equipment',
          },
          performance: { effectiveness: 78, reliability: 55, adaptability: 61, precision: 69, survivability: 73, mobility: 76, signature: 72 },
          impact: {
            targetDomains: ['personnel', 'armor', 'fortification'],
            effectiveRangeBand: 'theatre',
            targetScale: 'formation',
            destructiveEffects: ['suppress', 'missionKill', 'destroy'],
            penetrationClass: 'medium',
            areaEffectClass: 'site',
            demonstratedEffectIds: [],
            comparisonTags: ['mobile-firepower', 'medium-armor-defeat', 'maintenance-intensive'],
          },
          operationalDemand: {
            strategicSupplyPerDay: 0.46,
            deploymentDays: 4,
            turnaroundDays: 3,
            requiredFacilityTags: ['heavy-military-assembly', 'specialized-maintenance'],
            requiredNetworkKinds: ['road', 'rail', 'comms'],
            environmentLimits: ['roadless-terrain', 'deep-isolation', 'fuel-shortage'],
          },
          constraints: {
            limitationTags: ['heavy-supply', 'specialist-maintenance', 'high-signature'],
            failureModeIds: ['failure.r29a.mobile-heavy.powertrain', 'failure.r29a.mobile-heavy.fire-control'],
            collateralRisk: 43,
            politicalRisk: 29,
            escalationRisk: 58,
            minimumReadiness: 60,
            minimumSupplyDays: 18,
            counteredByTags: ['deep-defense', 'air-superiority', 'long-range-strike'],
          },
          sourceIds: ['operation.r29a.mobile-heavy-equipment-design'],
        },
        reasonKey: 'r29a.mobile-heavy-equipment.standardized',
      },
    ], {
      prerequisites: { capabilityIds: ['capability.r28b.interchangeable-production'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 8 }],
    }),

    'operation.r28b.military-assembly-works': operation(bindings, 'operation.r28b.military-assembly-works', 'engineering', 12_000, 15, [
      {
        kind: 'facility',
        timing: 'onComplete',
        facility: {
          id: 'facility.r28b.military-assembly-works',
          moduleId: 'module.r28b.military-assembly',
          polityId: bindings.playerPolity,
          hostCityId: bindings.industrialCoreCity,
          authority: authority(bindings, [{ kind: 'city', id: bindings.industrialCoreCity }, polityScope(bindings)]),
          lifecycle: { status: 'operating', condition: 90, maintenanceBacklog: 0 },
          maintenanceStaffRequired: 1_800,
          recurringEffects: [],
          industrialCapacity: { factoryUnits: 8, usableFactoryUnits: 8, concentration: 0.55, damageRisk: 0.12, repairRate: 0.04 },
        },
        reasonKey: 'r28b.military-assembly-works.commissioned',
      },
      {
        kind: 'stockpile',
        timing: 'onComplete',
        stockpile: {
          id: 'stockpile.r28b.guard-equipment',
          polityId: bindings.playerPolity,
          kind: 'equipment',
          designId: 'design.r28b.guard-equipment',
          quantity: 0,
          reserved: 0,
          capacity: 36,
          targetReserve: 24,
          condition: 100,
          sourceFacilityIds: ['facility.r28b.military-assembly-works'],
        },
        reasonKey: 'r28b.guard-equipment.stockpile-established',
      },
    ], {
      prerequisites: { capabilityIds: ['capability.r28b.interchangeable-production'], designIds: ['design.r28b.guard-equipment'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 18 }],
    }),

    'operation.r28b.guard-equipment-line': operation(bindings, 'operation.r28b.guard-equipment-line', 'production', 4_200, 4, [
      {
        kind: 'productionLine',
        timing: 'onComplete',
        productionLine: {
          id: 'production-line.r28b.guard-equipment',
          polityId: bindings.playerPolity,
          facilityId: 'facility.r28b.military-assembly-works',
          designId: 'design.r28b.guard-equipment',
          stockpileId: 'stockpile.r28b.guard-equipment',
          status: 'operating',
          dailyOutput: 1.5,
          efficiency: 0.8,
          capacityRequired: 1,
          assignedFactoryUnits: 5,
          baseOutputPerFactory: 0.38,
          efficiencyCap: 0.8,
          efficiencyGainPerDay: 0.02,
          productionFamilyId: 'production-family.ground-equipment',
          rampUp: 0.5,
          rampUpPerDay: 0.1,
          inputAvailability: 0.9,
          maintenanceLoad: 0.18,
        },
        reasonKey: 'r28b.guard-equipment-line.operating',
      },
    ], { prerequisites: { facilityIds: ['facility.r28b.military-assembly-works'], designIds: ['design.r28b.guard-equipment'] } }),

    'operation.r29a.mobile-heavy-tooling': operation(bindings, 'operation.r29a.mobile-heavy-tooling', 'engineering', 6_800, 8, [
      {
        kind: 'stockpile',
        timing: 'onComplete',
        stockpile: {
          id: 'stockpile.r29a.mobile-heavy-equipment',
          polityId: bindings.playerPolity,
          kind: 'equipment',
          designId: 'design.r29a.mobile-heavy-equipment',
          quantity: 0,
          reserved: 0,
          capacity: 18,
          targetReserve: 12,
          condition: 100,
          sourceFacilityIds: ['facility.r28b.military-assembly-works'],
        },
        reasonKey: 'r29a.mobile-heavy-equipment.stockpile-established',
      },
    ], {
      prerequisites: { facilityIds: ['facility.r28b.military-assembly-works'], designIds: ['design.r29a.mobile-heavy-equipment'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 10 }],
    }),

    'operation.r29a.retool-mobile-heavy-line': operation(bindings, 'operation.r29a.retool-mobile-heavy-line', 'production', 8_200, 6, [
      {
        kind: 'productionLineConfig',
        timing: 'onStart',
        productionLineId: 'production-line.r28b.guard-equipment',
        status: 'retooling',
        reasonKey: 'r29a.mobile-heavy-line.retooling',
      },
      {
        kind: 'productionLineConfig',
        timing: 'onComplete',
        productionLineId: 'production-line.r28b.guard-equipment',
        designId: 'design.r29a.mobile-heavy-equipment',
        stockpileId: 'stockpile.r29a.mobile-heavy-equipment',
        status: 'operating',
        dailyOutput: 0.72,
        efficiency: 0.72,
        assignedFactoryUnits: 8,
        baseOutputPerFactory: 0.16,
        efficiencyCap: 0.8,
        efficiencyGainPerDay: 0.015,
        productionFamilyId: 'production-family.ground-equipment',
        rampUp: 0.25,
        inputAvailability: 0.78,
        maintenanceLoad: 0.42,
        reasonKey: 'r29a.mobile-heavy-line.operating',
      },
    ], {
      prerequisites: { productionLineIds: ['production-line.r28b.guard-equipment'], completedOperationIds: ['operation.r29a.mobile-heavy-tooling'], designIds: ['design.r29a.mobile-heavy-equipment'] },
    }),

    'operation.r29a.mobile-reserve-formation': operation(bindings, 'operation.r29a.mobile-reserve-formation', 'military', 9_500, 8, [
      {
        kind: 'formation',
        timing: 'onComplete',
        formation: {
          id: 'formation.r29a.mobile-reserve',
          polityId: bindings.playerPolity,
          role: 'field',
          personnel: 9_500,
          training: 67,
          readiness: 74,
          equipment: [{ stockpileId: 'stockpile.r29a.mobile-heavy-equipment', required: 8 }],
          equipmentReadiness: 100,
          supplyDays: 18,
          cohesion: 63,
          experience: 8,
          homeRegionId: bindings.borderRegion,
          mission: 'mobile-counterattack-reserve',
        },
        reasonKey: 'r29a.mobile-reserve.deployed',
      },
      { kind: 'quantity', timing: 'onComplete', target: polityScope(bindings), quantityId: 'capacity.defense', operation: 'add', value: 5, reasonKey: 'r29a.mobile-reserve.defense-capacity' },
    ], {
      prerequisites: { completedOperationIds: ['operation.r29a.retool-mobile-heavy-line'], designIds: ['design.r29a.mobile-heavy-equipment'] },
      startStockpileDemands: [{ stockpileId: 'stockpile.r29a.mobile-heavy-equipment', amount: 8 }],
    }),

    'operation.r29a.retool-guard-line': operation(bindings, 'operation.r29a.retool-guard-line', 'production', 6_400, 5, [
      {
        kind: 'productionLineConfig',
        timing: 'onStart',
        productionLineId: 'production-line.r28b.guard-equipment',
        status: 'retooling',
        reasonKey: 'r29a.guard-line.retooling',
      },
      {
        kind: 'productionLineConfig',
        timing: 'onComplete',
        productionLineId: 'production-line.r28b.guard-equipment',
        designId: 'design.r28b.guard-equipment',
        stockpileId: 'stockpile.r28b.guard-equipment',
        status: 'operating',
        dailyOutput: 1.5,
        efficiency: 0.8,
        assignedFactoryUnits: 5,
        baseOutputPerFactory: 0.38,
        efficiencyCap: 0.8,
        efficiencyGainPerDay: 0.02,
        productionFamilyId: 'production-family.ground-equipment',
        rampUp: 0.4,
        inputAvailability: 0.9,
        maintenanceLoad: 0.18,
        reasonKey: 'r29a.guard-line.operating',
      },
    ], {
      prerequisites: { productionLineIds: ['production-line.r28b.guard-equipment'], completedOperationIds: ['operation.r29a.retool-mobile-heavy-line'], designIds: ['design.r28b.guard-equipment'] },
    }),

    'operation.r28b.border-guard-formation': operation(bindings, 'operation.r28b.border-guard-formation', 'military', 7_500, 6, [
      {
        kind: 'formation',
        timing: 'onComplete',
        formation: {
          id: 'formation.r28b.border-guard',
          polityId: bindings.playerPolity,
          role: 'garrison',
          personnel: 7_500,
          training: 61,
          readiness: 68,
          equipment: [{ stockpileId: 'stockpile.r28b.guard-equipment', required: 12 }],
          equipmentReadiness: 100,
          supplyDays: 24,
          cohesion: 66,
          experience: 12,
          homeRegionId: bindings.borderRegion,
          mission: 'secure-frontier-approach',
        },
        reasonKey: 'r28b.border-guard.deployed',
      },
      { kind: 'quantity', timing: 'onComplete', target: polityScope(bindings), quantityId: 'capacity.defense', operation: 'add', value: 3, reasonKey: 'r28b.border-guard.defense-capacity' },
    ], {
      prerequisites: { completedOperationIds: ['operation.r28b.guard-equipment-line'], designIds: ['design.r28b.guard-equipment'] },
      startStockpileDemands: [{ stockpileId: 'stockpile.r28b.guard-equipment', amount: 12 }],
    }),

    'operation.r28b.frontier-outpost': operation(bindings, 'operation.r28b.frontier-outpost', 'engineering', 5_400, 8, [
      { kind: 'region', timing: 'onComplete', region: frontierRegion(bindings), reasonKey: 'r28b.frontier.presence-established' },
      {
        kind: 'facility',
        timing: 'onComplete',
        facility: {
          id: 'facility.r28b.frontier-outpost',
          moduleId: 'module.r28b.frontier-outpost',
          polityId: bindings.playerPolity,
          authority: authority(bindings, [{ kind: 'region', id: 'region.r28b.frontier' }]),
          lifecycle: { status: 'operating', condition: 76, maintenanceBacklog: 0 },
          maintenanceStaffRequired: 900,
          recurringEffects: [],
        },
        reasonKey: 'r28b.frontier-outpost.commissioned',
      },
      {
        kind: 'capability',
        timing: 'onComplete',
        targetPolityId: bindings.playerPolity,
        capability: { id: 'capability.r28b.frontier-presence', maturity: 'prototype', sourceIds: ['operation.r28b.frontier-outpost'] },
        reasonKey: 'r28b.frontier-presence.established',
      },
      { kind: 'quantity', timing: 'onComplete', target: polityScope(bindings), quantityId: 'capacity.logistics', operation: 'add', value: 1.5, reasonKey: 'r28b.frontier-outpost.logistics-depth' },
    ], {
      prerequisites: { completedOperationIds: ['operation.r28b.border-guard-formation'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 8 }],
      startStockpileDemands: [{ stockpileId: 'stockpile.r28b.guard-equipment', amount: 4 }],
    }),

    'operation.r28b.frontier-registry': operation(bindings, 'operation.r28b.frontier-registry', 'policy', 3_200, 7, [
      {
        kind: 'capability',
        timing: 'onComplete',
        targetPolityId: bindings.playerPolity,
        capability: { id: 'capability.r28b.frontier-registry', maturity: 'replicable', sourceIds: ['operation.r28b.frontier-registry'] },
        reasonKey: 'r28b.frontier-registry.established',
      },
      {
        kind: 'regionProgress',
        timing: 'onComplete',
        regionId: 'region.r28b.frontier',
        integrationDelta: { registry: 18, justice: 4, executionQuality: 5 },
        territoryDelta: { integration: 7, threat: -3 },
        reasonKey: 'r28b.frontier-registry.progress',
      },
    ], {
      prerequisites: { completedOperationIds: ['operation.r28b.frontier-outpost'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 2 }],
    }),

    'operation.r28b.frontier-supply-link': operation(bindings, 'operation.r28b.frontier-supply-link', 'engineering', 8_500, 12, [
      {
        kind: 'network',
        timing: 'onComplete',
        network: {
          id: 'network.r28b.frontier-supply-link',
          polityId: bindings.playerPolity,
          kind: 'road',
          endpointIds: [bindings.industrialCoreCity, 'facility.r28b.frontier-outpost'],
          capacity: 24,
          condition: 78,
          redundancy: 12,
          lifecycle: { status: 'operating', condition: 78, maintenanceBacklog: 0 },
        },
        reasonKey: 'r28b.frontier-supply-link.commissioned',
      },
      {
        kind: 'regionProgress',
        timing: 'onComplete',
        regionId: 'region.r28b.frontier',
        integrationDelta: { security: 6, executionQuality: 8 },
        territoryDelta: { control: 8, integration: 4, development: 6, threat: -4, infrastructure: 18 },
        reasonKey: 'r28b.frontier-supply-link.progress',
      },
      { kind: 'quantity', timing: 'onComplete', target: polityScope(bindings), quantityId: 'capacity.logistics', operation: 'add', value: 2, reasonKey: 'r28b.frontier-supply-link.logistics' },
    ], {
      prerequisites: { capabilityIds: ['capability.r28b.frontier-registry'], facilityIds: ['facility.r28b.frontier-outpost'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 12 }],
    }),

    'operation.r28b.frontier-service-mission': operation(bindings, 'operation.r28b.frontier-service-mission', 'policy', 4_600, 0, [
      {
        kind: 'regionProgress',
        timing: 'perDay',
        regionId: 'region.r28b.frontier',
        integrationDelta: { services: 2, registry: 0.5, executionQuality: 0.7 },
        territoryDelta: { integration: 0.8, development: 0.5, threat: -0.4 },
        reasonKey: 'r28b.frontier-service.daily',
      },
      {
        kind: 'capability',
        timing: 'onComplete',
        targetPolityId: bindings.playerPolity,
        capability: { id: 'capability.r28b.frontier-service-responsibility', maturity: 'prototype', sourceIds: ['operation.r28b.frontier-service-mission'] },
        reasonKey: 'r28b.frontier-service.responsibility',
      },
    ], {
      durationDays: 10,
      prerequisites: { networkIds: ['network.r28b.frontier-supply-link'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 4 }],
    }),

    'operation.r28b.initial-integration-mandate': operation(bindings, 'operation.r28b.initial-integration-mandate', 'policy', 3_800, 6, [
      {
        kind: 'regionProgress',
        timing: 'onComplete',
        regionId: 'region.r28b.frontier',
        integrationDelta: { registry: 8, services: 8, justice: 12, security: 7, executionQuality: 10 },
        territoryDelta: { control: 12, integration: 14, development: 8, taxBase: 6, threat: -8, infrastructure: 4 },
        reasonKey: 'r28b.initial-integration.progress',
      },
      {
        kind: 'capability',
        timing: 'onComplete',
        targetPolityId: bindings.playerPolity,
        capability: { id: 'capability.r28b.initial-frontier-integration', maturity: 'prototype', sourceIds: ['operation.r28b.initial-integration-mandate'] },
        reasonKey: 'r28b.initial-integration.established',
      },
      { kind: 'quantity', timing: 'onComplete', target: polityScope(bindings), quantityId: 'capacity.coordination', operation: 'add', value: 1.5, reasonKey: 'r28b.initial-integration.coordination' },
    ], {
      prerequisites: { capabilityIds: ['capability.r28b.frontier-service-responsibility'], networkIds: ['network.r28b.frontier-supply-link'] },
      startDemands: [{ target: polityScope(bindings), quantityId: 'construction.ndu', amount: 3 }],
    }),
  }),
};
