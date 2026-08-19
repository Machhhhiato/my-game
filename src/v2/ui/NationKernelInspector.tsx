import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  advanceNationKernelDays,
  assignProductionFactories,
  availableWorkforce,
  createIndustrialStrategy,
  createProductionLine,
  damageIndustrialFacility,
  quantitiesForStage,
  retoolProductionLine,
  scopeKey,
  setIndustrialStrategy,
  setFormationReplenishmentPriority,
  setProductionLinePaused,
  startOperation,
} from '../nationKernel';
import {
  createDiplomaticConflictSave,
  createEarlyCommunitySave,
  createUnifiedNationSave,
} from '../nationKernel/saveFixtures';
import { diplomaticConflictOperationDefinitions } from '../nationKernel/diplomaticConflictContent';
import { strategicAssetPresentation } from '../nationKernel/assetPresentation';
import { R28_GROUND_CONTENT_PACKAGE } from '../nationKernel/r28GroundContent';
import { unifiedNationOperationDefinitions } from '../nationKernel/unifiedNationContent';
import type { NationSaveFixture } from '../nationKernel/saveFixtures';
import type {
  FleetState,
  NationKernelState,
  QuantityDefinition,
} from '../nationKernel/types';
import './nationKernel.css';

type FixtureKey = 'early' | 'unified' | 'conflict';
type OperationPresentation = { title: string; summary: string; outcome: string };

const FIXTURES: Record<FixtureKey, { label: string; create: () => NationSaveFixture }> = {
  early: { label: '起步共同体', create: createEarlyCommunitySave },
  unified: { label: '统一国家', create: createUnifiedNationSave },
  conflict: { label: '外交冲突', create: createDiplomaticConflictSave },
};

const normalizeFixture = (value: string | null | undefined): FixtureKey => (
  value === 'unified' || value === 'conflict' ? value : 'early'
);

const numberText = (value: number): string => new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
}).format(value);

const titleFromId = (id: string): string => id.replace(/^[a-z]+\./, '').replaceAll('.', ' · ');

const quantityLabels: Record<string, { label: string; meaning: string }> = {
  'construction.ndu': { label: '国家建设物资', meaning: '可用于启动国家级工程的储备' },
  'capacity.engineering': { label: '工务能力', meaning: '修建、检修与制造的综合能力' },
  'capacity.energy': { label: '能源余量', meaning: '供电与供能体系的余裕' },
  'capacity.research': { label: '研究能力', meaning: '试验、标准化与技术转化能力' },
  'capacity.coordination': { label: '统筹能力', meaning: '中央同时可靠推进跨区事务的能力' },
  'capacity.logistics': { label: '运输与补给', meaning: '人、货和救援跨区抵达的能力' },
  'capacity.defense': { label: '防卫能力', meaning: '训练、装备与持续应对威胁的能力' },
  'capacity.cohesion': { label: '共同体协作', meaning: '地区之间能否接受并落实共同安排' },
  'capacity.ecology': { label: '土地与环境', meaning: '水土、污染和长期恢复的余量' },
  'maintenance.backlog': { label: '维修积压', meaning: '尚未处理的设备与网络维护负担' },
  'service.waterCoverage': { label: '供水覆盖', meaning: '城市居民可获得稳定供水的比例' },
  'service.healthCoverage': { label: '医疗覆盖', meaning: '城市居民可获得基础诊疗的比例' },
  'service.educationCoverage': { label: '教育覆盖', meaning: '城市居民可获得基础教育与培训的比例' },
  'defense.readiness': { label: '战备状态', meaning: '当前可用部队与装备的准备程度' },
  'defense.supplyDays': { label: '军事补给', meaning: '现有军事力量可持续维持的天数' },
  'diplomacy.trust': { label: '对外信任', meaning: '对方关系中可用于谈判与协作的基础' },
  'diplomacy.intelligenceConfidence': { label: '情报可信度', meaning: '当前情报与真实情况相符的把握' },
};
const quantityNames: Record<string, string> = Object.fromEntries(Object.entries(quantityLabels).map(([id, value]) => [id, value.label]));
const capabilityLabels: Record<string, string> = {
  'capability.grid-dispatch': '跨区电网调度能力',
  'capability.safe-water-service': '城市供水标准能力',
  'capability.industrial-standard': '工业互换件能力',
  'capability.r28b.interchangeable-production': '工业互换生产能力',
  'capability.r28b.frontier-registry': '前沿人口与权利登记能力',
  'capability.r28b.frontier-service-responsibility': '前沿公共服务责任',
  'capability.systems-survey': '国家设施普查能力',
  'capability.network-operations': '网络运行能力',
  'capability.freight-routing': '干线货运能力',
  'capability.service-registry': '公共服务登记能力',
  'capability.urban-health': '都市卫生协同能力',
  'capability.resilience-planning': '区域韧性评估能力',
  'capability.civil-protection-comms': '民防通信能力',
  'capability.naval-maintenance': '舰艇维护能力',
  'capability.maritime-sensor-protocols': '海上监视能力',
  'capability.maritime-inspection': '航线核查能力',
};
const vesselLabels: Record<string, string> = { 'vessel.patrol': '巡逻舰', 'vessel.destroyer': '驱逐舰', 'vessel.carrier': '航空母舰' };

const cityLabels: Record<string, string> = {
  'city.north-core': '北部工业核心',
  'city.north-port': '北部港口城',
  'city.central': '中央行政都市',
  'city.coast-core': '海岸科研城',
  'city.coast-satellite': '海岸物流镇',
  'city.core': '核心聚居地',
  'city.satellite': '外围前哨',
  'city.neighbor-port': '邻国港口城',
};

const facilityLabels: Record<string, string> = {
  'facility.central-baseload': '中央基础电站',
  'facility.north-workshops': '北部维修工坊',
  'facility.north-port-handling': '北部港口装卸设施',
  'facility.r28b.military-assembly-works': '守备装备装配厂',
  'facility.r28b.frontier-outpost': '前沿据点',
  'facility.coast-clinic': '海岸基层诊疗点',
  'facility.central-dispatch': '中央调度中心',
  'facility.coast-waterworks': '海岸净水厂',
  'facility.north-repair-center': '北部检修中心',
  'facility.technical-institute': '国家技术学院',
  'facility.metro-clinic-network': '都市诊疗网络',
  'facility.coastal-resilience-works': '海岸服务节点加固设施',
  'facility.emergency-comms-tower': '区域应急通信塔',
  'facility.naval-repair-berth': '舰艇维修泊位',
  'facility.crisis-command-relay': '危机指挥中继站',
};

const networkLabels: Record<string, string> = {
  'network.north-central-trunk': '北部—中央干线',
  'network.coast-port-branch': '海岸港口支线',
  'network.national-intertie': '国家电力互联线',
  'network.coastal-freight-corridor': '海岸货运走廊',
  'network.service-registry-relay': '区域服务登记链路',
  'network.coastal-sensor-net': '海岸传感网络',
  'network.r28b.frontier-supply-link': '前沿补给接续线',
};

const statusLabels: Record<string, string> = { planned: '等待条件', active: '正在推进', completed: '已经完成', blocked: '暂时受阻', cancelled: '已经取消' };
const kindLabels: Record<string, string> = { research: '科研', design: '设计', production: '生产', engineering: '工程', policy: '当前政策', military: '军事行动', diplomacy: '外交行动', survey: '调查', emergency: '应急行动' };
const operationLabels: Record<string, string> = {
  'operation.r28b.guard-equipment-line': '守备装备产线',
  'operation.r28b.border-guard-formation': '边境守备编制',
  'operation.r28b.frontier-outpost': '前沿据点',
};
const stageLabels: Record<string, string> = { survival: '起步共同体', regional: '区域发展', unifiedNation: '统一国家' };
const labelFor = (id: string, labels: Record<string, string>): string => labels[id] ?? titleFromId(id);

const geoLabel = (reference: NationKernelState['cities'][string]['geoRef']): string => {
  if (reference.kind === 'point') return reference.cellId;
  if (reference.kind === 'edge') return `${reference.fromCellId} → ${reference.toCellId}`;
  return `${reference.kind} · ${reference.cellIds.length} cells`;
};

function definitionValue(state: NationKernelState, polityId: string, definition: QuantityDefinition): string {
  const value = state.quantities[scopeKey({ kind: 'polity', id: polityId })]?.[definition.id];
  if (value == null) return '未写入此开发存档';
  return `${numberText(value.current)} ${definition.unit}`;
}

function cityServices(state: NationKernelState, cityId: string): string {
  const values = state.quantities[scopeKey({ kind: 'city', id: cityId })] ?? {};
  const coverage = (id: string): string => values[id] == null ? '—' : `${numberText(values[id].current)}%`;
  return `供水 ${coverage('service.waterCoverage')} · 医疗 ${coverage('service.healthCoverage')} · 教育 ${coverage('service.educationCoverage')}`;
}

function fleetVessels(fleet: FleetState): string {
  return Object.entries(fleet.vessels)
    .map(([kind, count]) => `${labelFor(kind, vesselLabels)} ${count.total} 艘（可用 ${count.ready} / 维修 ${count.repairing}）`)
    .join('；');
}

function fixtureSummary(state: NationKernelState): Array<{ label: string; value: string }> {
  return [
    { label: '独立势力', value: String(Object.keys(state.polities).length) },
    { label: '地区', value: String(Object.keys(state.regions).length) },
    { label: '城市', value: String(Object.keys(state.cities).length) },
    { label: '都市圈', value: String(Object.keys(state.metros).length) },
    { label: '设施 / 网络', value: `${Object.keys(state.facilities).length} / ${Object.keys(state.networks).length}` },
    { label: '舰队 / 战区', value: `${Object.keys(state.fleets).length} / ${Object.keys(state.theatres).length}` },
  ];
}

function nationalStrengthSummary(state: NationKernelState, polityId: string): Array<{ label: string; value: string; detail: string }> {
  const values = state.quantities[scopeKey({ kind: 'polity', id: polityId })] ?? {};
  const quantityValue = (id: string): number => values[id]?.current ?? 0;
  const playerCities = Object.values(state.cities).filter((city) => city.polityId === polityId);
  const serviceValues = playerCities.flatMap((city) => ['service.waterCoverage', 'service.healthCoverage', 'service.educationCoverage'].map((id) => state.quantities[scopeKey({ kind: 'city', id: city.id })]?.[id]?.current).filter((value): value is number => value != null));
  const serviceAverage = serviceValues.length === 0 ? null : serviceValues.reduce((sum, value) => sum + value, 0) / serviceValues.length;
  return [
    { label: '人口与劳动力', value: `${numberText(state.polities[polityId].population.residents)} / ${numberText(availableWorkforce(state, polityId))}`, detail: '居民 / 可调度人手' },
    { label: '建设与维护', value: `${numberText(quantityValue('construction.ndu'))} NDU`, detail: `维修积压 ${numberText(quantityValue('maintenance.backlog'))}` },
    { label: '科研能力', value: numberText(quantityValue('capacity.research')), detail: '标准化与技术转化' },
    { label: '物流网络', value: numberText(quantityValue('capacity.logistics')), detail: `${Object.keys(state.networks).length} 条可运行网络` },
    { label: '公共服务', value: serviceAverage == null ? '—' : `${numberText(serviceAverage)}%`, detail: '城市供水、医疗、教育均值' },
    { label: '防卫战备', value: numberText(quantityValue('capacity.defense') || quantityValue('defense.readiness')), detail: `${Object.keys(state.fleets).length} 支可数舰队` },
  ];
}

function operationBlockers(state: NationKernelState, operation: NationKernelState['operations'][string]): string[] {
  const blockers: string[] = [];
  const capabilities = state.polities[operation.polityId]?.capabilities ?? {};
  for (const id of operation.prerequisites?.capabilityIds ?? []) if (capabilities[id] == null) blockers.push(`需要“${labelFor(id, capabilityLabels)}”`);
  for (const id of operation.prerequisites?.facilityIds ?? []) if (state.facilities[id]?.lifecycle.status !== 'operating') blockers.push(`需要“${labelFor(id, facilityLabels)}”投入使用`);
  for (const id of operation.prerequisites?.networkIds ?? []) if (state.networks[id]?.lifecycle.status !== 'operating') blockers.push(`需要“${labelFor(id, networkLabels)}”投入使用`);
  for (const id of operation.prerequisites?.productionLineIds ?? []) if (state.productionLines[id]?.status !== 'operating') blockers.push(`需要“${titleFromId(id)}”正在生产`);
  for (const id of operation.prerequisites?.designIds ?? []) if (state.designs[id]?.status !== 'standardized') blockers.push(`需要“${titleFromId(id)}”完成定型`);
  for (const id of operation.prerequisites?.completedOperationIds ?? []) if (state.operations[id]?.status !== 'completed') blockers.push(`需要先完成“${labelFor(id, operationLabels)}”`);
  for (const demand of operation.startStockpileDemands ?? []) {
    const stockpile = state.stockpiles[demand.stockpileId];
    if (stockpile == null || stockpile.quantity - stockpile.reserved < demand.amount) blockers.push(`${titleFromId(demand.stockpileId)}库存不足`);
  }
  for (const demand of operation.startDemands) {
    const current = state.quantities[scopeKey(demand.target)]?.[demand.quantityId]?.current ?? 0;
    if (current < demand.amount) blockers.push(`${labelFor(demand.quantityId, quantityNames)}不足`);
  }
  if (availableWorkforce(state, operation.polityId) < operation.staffRequired) blockers.push('可调度人手不足');
  return blockers;
}

function reasonText(reasonKey: string): string {
  if (reasonKey === 'operation.started') return '已启动';
  if (reasonKey === 'operation.completed') return '已完成';
  if (reasonKey.endsWith('.commissioned')) return '工程投入运行';
  if (reasonKey.endsWith('.acquired')) return '获得新能力';
  if (reasonKey.endsWith('.daily')) return '日常运行效果';
  if (reasonKey.endsWith('.capacity')) return '形成新的国家能力';
  if (reasonKey.endsWith('.opened')) return '工程带来的服务改善';
  return '状态发生变化';
}

/**
 * 开发专用的 R11 状态阅读器。它不写入正式存档，也不承担玩家 UI；
 * 只让设计和测试阶段能在同一页核对数据骨架与每日账本。
 */
export function NationKernelInspector({ initialFixture }: { initialFixture?: string }): ReactElement {
  const [fixtureKey, setFixtureKey] = useState<FixtureKey>(() => normalizeFixture(initialFixture));
  const [fixture, setFixture] = useState<NationSaveFixture>(() => FIXTURES[normalizeFixture(initialFixture)].create());
  const [industrialMessage, setIndustrialMessage] = useState('生产调整会保留在当前开发存档中。');
  const state = fixture.state;
  const player = state.polities[state.playerPolityId];
  const visibleDefinitions = useMemo(() => quantitiesForStage(fixture.stage), [fixture.stage]);
  const playerCities = useMemo(
    () => Object.values(state.cities).filter((city) => city.polityId === player.id),
    [state.cities, player.id],
  );
  const playerMetros = useMemo(
    () => Object.values(state.metros).filter((metro) => metro.polityId === player.id),
    [state.metros, player.id],
  );
  const foreignPolities = useMemo(
    () => Object.values(state.polities).filter((polity) => polity.id !== player.id),
    [state.polities, player.id],
  );
  const strengthSummary = useMemo(() => nationalStrengthSummary(state, player.id), [state, player.id]);
  const strategicDesigns = useMemo(
    () => Object.values(state.designs).filter((design) => design.polityId === player.id && design.identity != null),
    [state.designs, player.id],
  );
  const operationDefinitions = useMemo<Map<string, OperationPresentation>>(() => {
    const requiredCityIds = ['city.north-core', 'city.north-port', 'city.central', 'city.coast-core', 'city.coast-satellite'];
    if (!requiredCityIds.every((id) => state.cities[id] != null)) return new Map();
    const definitions = new Map<string, OperationPresentation>(unifiedNationOperationDefinitions({
      polityId: player.id,
      northCoreCityId: 'city.north-core',
      northPortCityId: 'city.north-port',
      centralCityId: 'city.central',
      coastCoreCityId: 'city.coast-core',
      coastSatelliteCityId: 'city.coast-satellite',
    }).map((definition) => [definition.id, definition]));
    for (const definition of R28_GROUND_CONTENT_PACKAGE.operationDefinitions({
      playerPolity: player.id,
      industrialCoreCity: 'city.north-core',
      borderRegion: 'region.north',
    })) definitions.set(definition.id, definition);
    if (state.fleets['fleet.player-sea'] != null && state.relations['relation.player-neighbor'] != null) for (const definition of diplomaticConflictOperationDefinitions({ polityId: player.id, neighborPolityId: 'polity.neighbor', northPortCityId: 'city.north-port', centralCityId: 'city.central', playerFleetId: 'fleet.player-sea', relationId: 'relation.player-neighbor' })) definitions.set(definition.id, definition);
    return definitions;
  }, [state.cities, state.fleets, state.relations, player.id]);

  const loadFixture = (key: FixtureKey): void => {
    setFixtureKey(key);
    setFixture(FIXTURES[key].create());
  };
  const advance = (days: number): void => {
    setFixture((previous) => ({ ...previous, state: advanceNationKernelDays(previous.state, days) }));
  };
  const start = (operationId: string): void => {
    setFixture((previous) => ({ ...previous, state: startOperation(previous.state, operationId) }));
  };
  const startEligible = (): void => {
    setFixture((previous) => {
      let next = previous.state;
      for (const operation of Object.values(next.operations)) next = startOperation(next, operation.id);
      return { ...previous, state: next };
    });
  };
  const updateIndustry = (transform: (state: NationKernelState) => NationKernelState, success: string, rejected: string): void => {
    const next = transform(state); setIndustrialMessage(next === state ? rejected : success); if (next !== state) setFixture((previous) => ({ ...previous, state: next }));
  };
  const changeFactories = (lineId: string, delta: number): void => {
    const current = state.productionLines[lineId]; if (current == null) return;
    updateIndustry((previous) => assignProductionFactories(previous, lineId, (current.assignedFactoryUnits ?? current.capacityRequired) + delta), '军工厂分配已更新。', '没有足够的可用军工厂，或该调整无效。');
  };
  const toggleLine = (lineId: string): void => {
    const line = state.productionLines[lineId]; if (line == null) return;
    updateIndustry((previous) => setProductionLinePaused(previous, lineId, line.status !== 'paused'), line.status === 'paused' ? '生产栏已恢复。' : '生产栏已暂停，军工厂可重新分配。', '生产栏正在换型，或恢复时没有足够军工厂。');
  };
  const switchLineDesign = (lineId: string, designId: string): void => {
    const heavy = designId === 'design.r29a.mobile-heavy-equipment';
    updateIndustry((previous) => retoolProductionLine(previous, lineId, { designId, stockpileId: heavy ? 'stockpile.r29a.mobile-heavy-equipment' : 'stockpile.r28b.guard-equipment', productionFamilyId: heavy ? 'production-family.mobile-heavy' : 'production-family.ground-equipment', baseOutputPerFactory: heavy ? 0.16 : 0.38, efficiencyCap: 0.8, efficiencyGainPerDay: heavy ? 0.015 : 0.02, inputAvailability: heavy ? 0.78 : 0.9, maintenanceLoad: heavy ? 0.42 : 0.18 }), '生产栏已进入换型，效率保留和改造时间按当前工业路线结算。', '目标设计、库存或生产栏尚未准备完成。');
  };
  const chooseIndustrialStrategy = (policyId: string, routeId: string): void => {
    const strategy = createIndustrialStrategy(policyId, routeId); if (strategy == null) return;
    updateIndustry((previous) => setIndustrialStrategy(previous, strategy), '工业政策与科技路线已更新。', '工业策略没有变化。');
  };
  const addHeavyProductionColumn = (): void => {
    updateIndustry((previous) => createProductionLine(previous, { id: `production-line.player.mobile-heavy.${previous.calendar.day}`, polityId: previous.playerPolityId, facilityId: 'facility.r28b.military-assembly-works', designId: 'design.r29a.mobile-heavy-equipment', stockpileId: 'stockpile.r29a.mobile-heavy-equipment', status: 'operating', dailyOutput: 0, efficiency: 0.25, capacityRequired: 0, assignedFactoryUnits: 0, baseOutputPerFactory: 0.16, efficiencyCap: 0.8, efficiencyGainPerDay: 0.015, productionFamilyId: 'production-family.mobile-heavy', rampUp: 1, inputAvailability: 0.78, maintenanceLoad: 0.42 }), '新的雷霆装备生产栏已建立，请分配军工厂。', '必须先完成雷霆设计、库存区和军工设施，且生产栏编号不能重复。');
  };
  const setReplenishmentPriority = (formationId: string, priority: 0 | 1 | 2 | 3): void => {
    updateIndustry((previous) => setFormationReplenishmentPriority(previous, formationId, priority), '编制补充优先级已更新。', '无法更新该编制。');
  };

  return (
    <main className="kernel-inspector">
      <header className="kernel-header">
        <div>
          <p className="kernel-kicker">DEVELOPMENT ONLY · NO SAVE WRITE</p>
          <h1>国家运行面板</h1>
          <p>这是开发阶段的可读检查页：看国家有哪些能力、哪些项目能开始、工程会留下什么，以及城市生活正在改善还是恶化。</p>
        </div>
        <div className="kernel-controls" aria-label="开发存档与推进控制">
          {Object.entries(FIXTURES).map(([key, item]) => (
            <button className={fixtureKey === key ? 'is-active' : ''} key={key} onClick={() => loadFixture(key as FixtureKey)} type="button">
              {item.label}
            </button>
          ))}
          <button onClick={() => loadFixture(fixtureKey)} type="button">重置</button>
          <button onClick={startEligible} type="button">启动当前可用</button>
          <button onClick={() => advance(1)} type="button">推进 1 日</button>
          <button onClick={() => advance(10)} type="button">推进 10 日</button>
          <button onClick={() => window.location.assign(window.location.pathname)} type="button">返回文字试玩</button>
        </div>
      </header>

      <section className="kernel-overview" aria-label="状态概览">
        <article className="kernel-primary-card">
          <span>当前发展阶段</span>
          <strong>{stageLabels[fixture.stage] ?? fixture.stage}</strong>
          <small>第 {state.calendar.year} 年 · 第 {state.calendar.month} 月 · {state.calendar.phase === 'early' ? '上旬' : state.calendar.phase === 'mid' ? '中旬' : '下旬'}</small>
        </article>
        <article className="kernel-primary-card">
          <span>国家规模</span>
          <strong>居民 {numberText(player.population.residents)}</strong>
          <small>当前可调度人手 {numberText(availableWorkforce(state, player.id))} · 已有设施 {Object.keys(state.facilities).length} 处</small>
        </article>
        <article className="kernel-primary-card">
          <span>当前工作</span>
          <strong>可开工 {Object.values(state.operations).filter((operation) => operation.status === 'planned' && operationBlockers(state, operation).length === 0).length} 项</strong>
          <small>进行中 {Object.values(state.operations).filter((operation) => operation.status === 'active').length} 项 · 已完成 {Object.values(state.operations).filter((operation) => operation.status === 'completed').length} 项</small>
        </article>
        {fixtureSummary(state).map((item) => (
          <article className="kernel-stat-card" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>
        ))}
      </section>

      <section className="kernel-strength" aria-label="国家实力摘要">
        <header><div><p className="kernel-kicker">NATIONAL CAPACITY · DEVELOPMENT VIEW</p><h2>国家实力摘要</h2></div><p>不折算成单一战力：每项实力都对应人口、设施、网络、服务或可数装备。</p></header>
        <div>{strengthSummary.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></article>)}</div>
      </section>

      <section className="kernel-grid">
        <article className="kernel-panel kernel-quantities">
          <header><h2>国家能力与当前负担</h2><span>只显示本阶段已写入的国家数据</span></header>
          <div className="kernel-table" role="table">
            <div className="kernel-row kernel-table-head" role="row"><span>指标</span><span>当前值</span><span>它代表什么</span></div>
            {visibleDefinitions.filter((definition) => definitionValue(state, player.id, definition) !== '未写入此开发存档').map((definition) => (
              <div className="kernel-row" key={definition.id} role="row">
                <strong>{quantityLabels[definition.id]?.label ?? titleFromId(definition.id)}</strong><span>{definitionValue(state, player.id, definition)}</span><span>{quantityLabels[definition.id]?.meaning ?? '该阶段的国家运行数据'}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="kernel-panel">
          <header><h2>国内地区与城市生活</h2><span>城市和都市圈都由同一中央政府统筹</span></header>
          <div className="kernel-object-list">
            <div className="kernel-object-block">
              <h3>地区</h3>
              {Object.values(state.regions).filter((region) => region.polityId === player.id).map((region) => (
                <p key={region.id}><b>{region.id === 'region.north' ? '北部地区' : region.id === 'region.central' ? '中央地区' : region.id === 'region.coast' ? '海岸地区' : region.id === 'region.r28b.frontier' ? '前沿地区' : '国内地区'}</b> · 农村人口 {numberText(region.ruralPopulation)} · 公共执行 {region.integration.executionQuality}/100 · 环境压力 {region.environmentPressure}/100{region.territory == null ? null : <><br />控制 {region.territory.control}/100 · 统合 {region.territory.integration}/100 · 开发 {region.territory.development}/100 · 税基 {region.territory.taxBase}/100 · 威胁 {region.territory.threat}/100{region.territory.infrastructure == null ? '' : ` · 基建 ${region.territory.infrastructure}/100`}{region.territory.resourcePotential == null ? '' : ` · 资源潜力 ${region.territory.resourcePotential}/100`}</>}</p>
              ))}
            </div>
            <div className="kernel-object-block">
              <h3>城市</h3>
              {playerCities.map((city) => (
                <p key={city.id}><b>{labelFor(city.id, cityLabels)}</b> · 人口 {numberText(city.population)} · {city.role === 'industrial' ? '工业中心' : city.role === 'port' ? '港口节点' : city.role === 'administrative' ? '行政中心' : city.role === 'research' ? '科研中心' : city.role === 'logistics' ? '物流节点' : '综合聚居地'}<br />{cityServices(state, city.id)} · 已投入使用设施 {city.facilityIds.length} 处</p>
              ))}
            </div>
            <div className="kernel-object-block">
              <h3>都市圈</h3>
              {playerMetros.map((metro) => (
                <p key={metro.id}><b>{metro.id === 'metro.north' ? '北部都市圈' : metro.id === 'metro.central' ? '中央都市圈' : metro.id === 'metro.coast' ? '海岸都市圈' : '都市圈'}</b> · 成员城市 {metro.memberCityIds.length} 座 · 人口 {numberText(metro.totalPopulation)} · 协调负荷 {metro.coordinationLoad}/100</p>
              ))}
            </div>
          </div>
        </article>

        <article className="kernel-panel">
          <header><h2>国家设施与网络</h2><span>工程完成后留下的长期事实</span></header>
          <div className="kernel-object-list">
            <h3>设施</h3>
            {Object.values(state.facilities).map((facility) => (
              <p key={facility.id}><b>{labelFor(facility.id, facilityLabels)}</b> · 状态 {facility.lifecycle.status === 'operating' ? '正在运行' : facility.lifecycle.status} · 维护编制 {numberText(facility.maintenanceStaffRequired)} 人 · 服务 {facility.hostCityId == null ? '国家层面' : labelFor(facility.hostCityId, cityLabels)}{facility.industrialCapacity == null ? '' : ` · 军工厂 ${facility.industrialCapacity.usableFactoryUnits}/${facility.industrialCapacity.factoryUnits}`}</p>
            ))}
            <h3>网络</h3>
            {Object.values(state.networks).map((network) => (
              <p key={network.id}><b>{labelFor(network.id, networkLabels)}</b> · {network.kind === 'power' ? '电力网络' : network.kind === 'rail' ? '货运网络' : network.kind === 'comms' ? '通信网络' : '陆路网络'} · 状态 {network.lifecycle.status === 'operating' ? '正在运行' : network.lifecycle.status} · 容量 {network.capacity} · 冗余 {network.redundancy}</p>
            ))}
            {Object.values(state.productionLines).length === 0 ? null : <h3>战略产线</h3>}
            {state.industrialStrategy == null ? null : <p><b>工业路线</b> · {state.industrialStrategy.technologyRouteId.includes('flexible') ? '弹性生产线' : state.industrialStrategy.technologyRouteId.includes('concentrated') ? '集中工业' : '均衡工业'} · 换线效率保留 {numberText(state.industrialStrategy.conversionRetention * 100)}% · 产出修正 {numberText(state.industrialStrategy.factoryOutputModifier * 100)}%</p>}
            {state.facilities['facility.r28b.military-assembly-works']?.industrialCapacity == null ? null : <div className="kernel-industrial-actions">
              <button onClick={() => chooseIndustrialStrategy('policy.industry.limited-mobilization', 'technology-route.industry.concentrated')} type="button">有限动员＋集中工业</button>
              <button onClick={() => chooseIndustrialStrategy('policy.industry.limited-mobilization', 'technology-route.industry.flexible')} type="button">有限动员＋弹性产线</button>
              <button onClick={() => chooseIndustrialStrategy('policy.industry.war-economy', state.industrialStrategy?.technologyRouteId.includes('flexible') ? 'technology-route.industry.flexible' : 'technology-route.industry.concentrated')} type="button">切换战时经济</button>
              <button onClick={addHeavyProductionColumn} type="button">新增雷霆生产栏</button>
              <button onClick={() => updateIndustry((previous) => damageIndustrialFacility(previous, 'facility.r28b.military-assembly-works', 12), '军工设施受损，可用军工厂下降并开始维修。', '军工设施尚未建成。')} type="button">模拟工业受损</button>
            </div>}
            {Object.values(state.productionLines).map((line) => {
              const design = state.designs[line.designId];
              const presentation = design?.identity == null ? undefined : strategicAssetPresentation(design.identity.presentationId);
              const assignedFactories = line.assignedFactoryUnits ?? line.capacityRequired;
              return <div className="kernel-production-column" key={line.id}>
                <p><b>{presentation?.displayName ?? titleFromId(line.designId)}</b> · {line.status === 'operating' ? '正在生产' : line.status === 'retooling' ? `正在转产（${line.retoolingDaysRemaining ?? 0}日）` : line.status === 'paused' ? '已暂停' : line.status} · 投入军工厂 {assignedFactories} · 生产效率 {numberText(line.efficiency * 100)}%/{numberText(((line.efficiencyCap ?? 1) + (state.industrialStrategy?.efficiencyCapModifier ?? 0)) * 100)}% · 单厂日产 {numberText(line.baseOutputPerFactory ?? line.dailyOutput)} · 输入保障 {numberText((line.inputAvailability ?? 1) * 100)}%</p>
                <div className="kernel-industrial-actions">
                  <button onClick={() => changeFactories(line.id, -1)} type="button">−1 军工厂</button><button onClick={() => changeFactories(line.id, 1)} type="button">＋1 军工厂</button>
                  <button onClick={() => toggleLine(line.id)} type="button">{line.status === 'paused' ? '恢复' : '暂停'}</button>
                  <button onClick={() => switchLineDesign(line.id, 'design.r28b.guard-equipment')} type="button">换型磐石</button><button onClick={() => switchLineDesign(line.id, 'design.r29a.mobile-heavy-equipment')} type="button">换型雷霆</button>
                </div>
              </div>;
            })}
            {Object.values(state.productionLines).length === 0 ? null : <p className="kernel-industrial-message">{industrialMessage}</p>}
          </div>
        </article>

        <article className="kernel-panel">
          <header><h2>外部势力与观察</h2><span>看到的是情报，不等于全部真实情况</span></header>
          <div className="kernel-object-list">
            {foreignPolities.length === 0 ? <p className="kernel-empty">此夹具没有外部主权势力。</p> : foreignPolities.map((polity) => (
              <p key={polity.id}><b>{polity.id === 'polity.neighbor' ? '邻国' : '外部势力'}</b> · 居民约 {numberText(polity.population.residents)} · 当前以 {polity.simulationTier === 'active' ? '区域级精度' : '战略级精度'} 模拟</p>
            ))}
            <h3>关系</h3>
            {Object.values(state.relations).map((relation) => (
              <p key={relation.id}><b>{relation.stance === 'tense' ? '关系紧张' : relation.stance === 'contact' ? '已经接触' : relation.stance === 'cooperative' ? '正在合作' : '关系中性'}</b> · 我方信任 {relation.trustAtoB} · 对方信任 {relation.trustBtoA} · 现有协定 {relation.agreementIds.length} 项 · 未解决争议 {relation.grievanceIds.length} 项</p>
            ))}
            <h3>观察</h3>
            {state.observations.length === 0 ? <p className="kernel-empty">无有效观察。</p> : state.observations.map((observation, index) => (
              <p key={`${observation.subjectId}-${observation.fieldId}-${index}`}>关于<b>{observation.subjectId === 'polity.neighbor' ? '邻国' : '外部势力'}</b>的观察：{String(observation.knownValue ?? '情报不足')} · 可信度 {numberText(observation.confidence * 100)}%</p>
            ))}
          </div>
        </article>

        <article className="kernel-panel">
          <header><h2>军事与安全态势</h2><span>舰艇保留精确数量，不折算成抽象点数</span></header>
          <div className="kernel-object-list">
            {strategicDesigns.length >= 2 ? (
              <div className="kernel-object-block">
                <h3>设计取舍</h3>
                <p>高效果不等于全面更优。比较火力、可靠性、适应性、生产成本、维护和最低补给，选择符合当前国家网络与任务的设计。</p>
                {strategicDesigns.map((design) => {
                  const presentation = strategicAssetPresentation(design.identity!.presentationId);
                  return <p key={`comparison-${design.id}`}><b>{presentation?.displayName ?? titleFromId(design.id)}</b> · 效果 {design.performance?.effectiveness ?? '—'} · 可靠性 {design.performance?.reliability ?? '—'} · 适应性 {design.performance?.adaptability ?? '—'} · 成本 {numberText(design.productionCost)} · 维护 {numberText(design.maintenanceLoad)} · 最低补给 {design.constraints?.minimumSupplyDays ?? '—'} 日</p>;
                })}
              </div>
            ) : null}
            {strategicDesigns.map((design) => {
              const presentation = strategicAssetPresentation(design.identity!.presentationId);
              if (presentation == null) return null;
              return (
                <div className="kernel-object-block" key={design.id}>
                  <h3>{presentation.displayName}</h3>
                  <p>{presentation.roleSummary}</p>
                  <p><b>可想象威力</b><br />{presentation.impactSummary}</p>
                  <p><b>主要限制</b><br />{presentation.limitationSummary}</p>
                  <p><b>文明意义</b><br />{presentation.civilizationMeaning}</p>
                  <p>效果 {design.performance?.effectiveness ?? '—'}/100 · 可靠性 {design.performance?.reliability ?? '—'}/100 · 适应性 {design.performance?.adaptability ?? '—'}/100 · 生产成本 {numberText(design.productionCost)} · 维护负担 {numberText(design.maintenanceLoad)}</p>
                </div>
              );
            })}
            {Object.values(state.fleets).length === 0 ? <p className="kernel-empty">此阶段没有舰队对象。</p> : Object.values(state.fleets).map((fleet) => (
              <p key={fleet.id}><b>{fleet.polityId === player.id ? '我方海上舰队' : '邻国海上舰队'}</b> · 任务 {fleet.mission === 'route-protection' ? '航线保护' : '边境拒止'} · 战备 {fleet.readiness}/100 · 补给还可维持 {fleet.supplyDays} 日<br />{fleetVessels(fleet)}</p>
            ))}
            {Object.values(state.theatres).map((theatre) => (
              <p key={theatre.id}><b>{theatre.status === 'crisis' ? '边境海域危机' : '安全战区'}</b> · 当前目标 {theatre.objective === 'protect-route' ? '维持航线通行' : theatre.objective} · 平民影响 {theatre.civilianImpact}/100 · 地区执行压力 {theatre.integrationPressure}/100</p>
            ))}
            {Object.values(state.formations).map((formation) => (
              <div className="kernel-production-column" key={formation.id}>
                <p><b>{formation.id === 'formation.r28b.border-guard' ? '边境守备编制' : titleFromId(formation.id)}</b> · 人员 {numberText(formation.personnel)} · 训练 {formation.training}/100 · 战备 {formation.readiness}/100{formation.equipmentReadiness == null ? '' : ` · 装备满足 ${formation.equipmentReadiness}/100`}{formation.supplyDays == null ? '' : ` · 补给 ${formation.supplyDays} 日`}<br />装备 {formation.equipment.map((item) => `${item.stockpileId === 'stockpile.r28b.guard-equipment' ? '通用守备装备' : titleFromId(item.stockpileId)} ${numberText(item.delivered ?? item.required)}/${item.required}`).join('；')} · 补充优先级 {formation.replenishmentPriority ?? 1} · 当前任务 {formation.mission === 'secure-frontier-approach' ? '保障前沿通道' : formation.mission}</p>
                <div className="kernel-industrial-actions"><button onClick={() => setReplenishmentPriority(formation.id, 0)} type="button">低补充</button><button onClick={() => setReplenishmentPriority(formation.id, 1)} type="button">普通补充</button><button onClick={() => setReplenishmentPriority(formation.id, 2)} type="button">优先补充</button><button onClick={() => setReplenishmentPriority(formation.id, 3)} type="button">最高补充</button></div>
              </div>
            ))}
            {Object.values(state.stockpiles).filter((stockpile) => stockpile.polityId === player.id).map((stockpile) => (
              <p key={stockpile.id}><b>{stockpile.id === 'stockpile.r28b.guard-equipment' ? '通用守备装备库存' : titleFromId(stockpile.id)}</b> · 可用 {numberText(stockpile.quantity - stockpile.reserved)} · 在库 {numberText(stockpile.quantity)}{stockpile.capacity == null ? '' : ` / 容量 ${numberText(stockpile.capacity)}`}{stockpile.targetReserve == null ? '' : ` · 目标储备 ${numberText(stockpile.targetReserve)}`}{stockpile.condition == null ? '' : ` · 状况 ${stockpile.condition}/100`}</p>
            ))}
            {Object.values(state.spaceAssets).map((asset) => (
              <p key={asset.id}><code>{asset.id}</code> · {asset.kind} · {asset.lifecycle.status} · 人员 {numberText(asset.personnel)}</p>
            ))}
          </div>
        </article>

        <article className="kernel-panel">
          <header><h2>国家工作队列</h2><span>科研获得能力；工程留下实体；政策只在期限内生效</span></header>
          <div className="kernel-object-list">
            {Object.values(state.operations).length === 0 ? <p className="kernel-empty">此夹具没有运行中的操作。</p> : Object.values(state.operations).map((operation) => (
              <div className="kernel-operation" key={operation.id}>
                <p><b>{operationDefinitions.get(operation.definitionId)?.title ?? (operation.id === 'operation.research' ? '试验研究' : operation.id === 'operation.policy' ? '供水优先调整' : titleFromId(operation.id))}</b> · {kindLabels[operation.kind] ?? operation.kind} · {statusLabels[operation.status] ?? operation.status}<br />{operationDefinitions.get(operation.definitionId)?.summary ?? '用于验证国家运行规则的开发操作。'}<br />{operation.status === 'active' ? `当前进度：${operation.workRequired > 0 ? `${operation.workDone} / ${operation.workRequired} 日` : `${operation.elapsedDays} / ${operation.durationDays ?? 0} 日`}` : operation.status === 'completed' ? `完成结果：${operationDefinitions.get(operation.definitionId)?.outcome ?? '结果已写入国家状态。'}` : operationBlockers(state, operation).length === 0 ? `可以开始：将占用 ${numberText(operation.staffRequired)} 人，并投入 ${operation.startDemands.map((demand) => `${demand.amount} NDU`).join('，') || '现有编制'}` : `暂不能开始：${operationBlockers(state, operation).join('；')}`}</p>
                {operation.status === 'planned' ? <button onClick={() => start(operation.id)} type="button">启动该操作</button> : null}
              </div>
            ))}
          </div>
        </article>

        <article className="kernel-panel kernel-ledger">
          <header><h2>最近的重要变化</h2><span>原始账本仍保留；这里先翻译成可读结果</span></header>
          {state.ledger.length === 0 ? <p className="kernel-empty">尚未产生变化。可在“起步共同体”夹具中启动操作，再推进日期。</p> : (
            <div className="kernel-object-list">
              {state.ledger.slice(-16).reverse().map((entry, index) => (
                <p key={`${entry.day}-${entry.sourceId}-${entry.target}-${index}`}><b>第 {entry.day} 日</b> · {operationDefinitions.get(entry.sourceId)?.title ?? labelFor(entry.sourceId, facilityLabels)}：{reasonText(entry.reasonKey)}<br />数值变化 {String(entry.before)} → {String(entry.after)}</p>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
