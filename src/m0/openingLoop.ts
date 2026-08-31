import { dailyResourceRate } from './economy';
import { daysInMonth } from './calendar';
import { technologies } from './progression';
import { mobileSettlementWorkforce, unifiedWorkablePopulation } from './populationAccounting';
import type {
  M0State,
  OpeningContinuityMonth,
  OpeningEvidenceId,
  OpeningLoopEvidence,
  OpeningLoopEvidenceItem,
  OpeningProjectId,
  OpeningServiceId,
  RecoveryProjectId,
  ResourceId,
} from './types';

export const OPENING_SETTLEMENT_CELL_ID = 'local--4-0';

export const OPENING_PROJECT_RULES: Record<OpeningProjectId, {
  label: string;
  workRequired: number;
}> = {
  'opening-water-repair': { label: '供水修复', workRequired: 12 },
  'opening-food-source': { label: '重复食物来源', workRequired: 12 },
  'opening-food-processing': { label: '食品处理', workRequired: 12 },
  'opening-critical-power': { label: '关键供能', workRequired: 12 },
  'opening-sanitation': { label: '卫生服务', workRequired: 12 },
  'opening-basic-medical': { label: '基础医疗', workRequired: 12 },
  'opening-housing': { label: '基本住处', workRequired: 12 },
  'opening-registration': { label: '人口登记', workRequired: 12 },
  'opening-basic-industry': { label: '基础生产场址', workRequired: 12 },
};

export function isOpeningProjectId(id: string): id is OpeningProjectId {
  return Object.prototype.hasOwnProperty.call(OPENING_PROJECT_RULES, id);
}

export const RECOVERY_RULES: Record<RecoveryProjectId, {
  resource: Extract<ResourceId, 'commonParts' | 'engineeringComponents' | 'alloy'>;
  label: string;
  floor: number;
  cap: number;
  output: number;
  workRequired: number;
}> = {
  floor_common_parts: {
    resource: 'commonParts', label: '普通零件回收', floor: 12, cap: 24, output: 12, workRequired: 12,
  },
  floor_engineering_components: {
    resource: 'engineeringComponents', label: '工程部件回收', floor: 10, cap: 18, output: 10, workRequired: 12,
  },
  floor_alloy: {
    resource: 'alloy', label: '合金回收', floor: 8, cap: 14, output: 8, workRequired: 12,
  },
};

export function isRecoveryProjectId(id: string): id is RecoveryProjectId {
  return Object.prototype.hasOwnProperty.call(RECOVERY_RULES, id);
}

export function openingServiceOperational(state: M0State, service: OpeningServiceId): boolean {
  if (service === 'food') {
    return state.settlement.services.foodSource.operational
      && state.settlement.services.foodProcessing.operational;
  }
  return state.settlement.services[service].operational;
}

function serviceCapacity(state: M0State, service: OpeningServiceId): number {
  if (service === 'food') {
    return Math.min(
      state.settlement.services.foodSource.capacity,
      state.settlement.services.foodProcessing.capacity,
    );
  }
  return state.settlement.services[service].capacity;
}

function serviceCoversPopulation(state: M0State, service: OpeningServiceId): boolean {
  const requiredPopulation = state.settlement.servedPopulation > 0
    ? state.settlement.servedPopulation
    : state.settlement.population;
  return openingServiceOperational(state, service)
    && serviceCapacity(state, service) >= requiredPopulation;
}

export function settlementReadyForIntegration(state: M0State): boolean {
  const settlement = state.settlement;
  return settlement.status === 'ready-to-integrate'
    && settlement.services.registrationComplete
    && settlement.basicProductionUnits > 0
    && serviceCoversPopulation(state, 'water')
    && serviceCoversPopulation(state, 'food')
    && serviceCoversPopulation(state, 'power')
    && serviceCoversPopulation(state, 'sanitation')
    && serviceCoversPopulation(state, 'medical')
    && serviceCoversPopulation(state, 'housing');
}

function repairSustainmentAvailable(state: M0State): boolean {
  const remanufacturing = state.production.lines.find((line) => line.id === 'common-parts-remanufacturing');
  return state.maintenanceBacklog <= 60
    && state.oldRepairableParts >= 3
    && Boolean(remanufacturing
      && remanufacturing.allocatedFactories > 0
      && (remanufacturing.blockedReason === null || remanufacturing.blockedReason === 'asset-limit'));
}

export function recordOpeningServiceDay(
  state: M0State,
  waterMet: boolean,
  foodMet: boolean,
  maintenanceMet: boolean,
): void {
  const month = state.openingLoop.currentMonth;
  if (state.settlement.status !== 'served' || state.settlement.servedPopulation === 0) return;
  const criticalServicesMet = serviceCoversPopulation(state, 'power')
    && serviceCoversPopulation(state, 'sanitation')
    && serviceCoversPopulation(state, 'medical')
    && serviceCoversPopulation(state, 'housing');
  month.servedDays += 1;
  if (!waterMet) month.waterGapDays += 1;
  if (!foodMet) month.foodGapDays += 1;
  if (!criticalServicesMet) month.criticalServiceGapDays += 1;
  if (!maintenanceMet || !repairSustainmentAvailable(state)) month.maintenanceGapDays += 1;
}

export function resetOpeningCurrentMonth(state: M0State): void {
  state.openingLoop.currentMonth = {
    year: state.calendar.year,
    month: state.calendar.month,
    calendarDays: daysInMonth(state.calendar.year, state.calendar.month),
    servedDays: 0,
    waterGapDays: 0,
    foodGapDays: 0,
    criticalServiceGapDays: 0,
    maintenanceGapDays: 0,
  };
}

export function createOpeningContinuityMonth(state: M0State): OpeningContinuityMonth {
  const settlement = state.settlement;
  const month = state.openingLoop.currentMonth;
  const servedForWholeMonth = settlement.status === 'served'
    && settlement.servedPopulation > 0
    && settlement.servedSince !== null
    && (settlement.servedSince.year < state.monthly.year
      || (settlement.servedSince.year === state.monthly.year
        && (settlement.servedSince.month < state.monthly.month
          || (settlement.servedSince.month === state.monthly.month && settlement.servedSince.day === 1))));
  const recordedWholeMonth = servedForWholeMonth
    && month.year === state.monthly.year
    && month.month === state.monthly.month
    && month.servedDays === month.calendarDays;
  return {
    year: month.year,
    month: month.month,
    waterMet: recordedWholeMonth && month.waterGapDays === 0,
    foodMet: recordedWholeMonth && month.foodGapDays === 0,
    criticalServicesOperational: recordedWholeMonth && month.criticalServiceGapDays === 0,
    maintenanceRecoverable: recordedWholeMonth && month.maintenanceGapDays === 0,
    resourceAccountingConserved: state.ledger.every((entry) => Object.values(entry.resources).every((flow) => (
      Math.abs(flow.start + flow.inflow - flow.outflow - flow.overflow - flow.end) < 0.000001
    ))),
  };
}

function evidenceItem(id: OpeningEvidenceId, pass: boolean, gap: string): OpeningLoopEvidenceItem {
  return { id, status: pass ? 'pass' : 'blocked', gap: pass ? null : gap };
}

export function openingLoopEvidence(state: M0State): OpeningLoopEvidence {
  const settlement = state.settlement;
  const mobileWorkforce = mobileSettlementWorkforce(state);
  const mobileRequired = Math.ceil(settlement.servedPopulation * 0.05);
  const remanufacturing = state.production.lines.find((line) => line.id === 'common-parts-remanufacturing');
  const industryReady = state.settlement.basicProductionUnits > 0
    && state.production.totalFactories >= state.settlement.basicProductionUnits
    && Boolean(remanufacturing
      && remanufacturing.allocatedFactories > 0
      && (remanufacturing.blockedReason === null || remanufacturing.blockedReason === 'asset-limit'));
  const idleQueue = state.research.manualQueue.some((id) => (
    !state.research.completed.includes(id)
      && technologies.some((technology) => technology.id === id)
  )) || state.projects.some((project) => (
    project.status === 'active' && !project.directRecovery
  )) || state.production.lines.some((line) => line.allocatedFactories > 0 && line.blockedReason === null);
  const items: OpeningLoopEvidenceItem[] = [
    evidenceItem('population_registered_served', settlement.registeredPopulation >= 1_000
      && settlement.servedPopulation >= 1_000, '已登记且受服务人口不足一千'),
    evidenceItem('water_repeatable', serviceCoversPopulation(state, 'water')
      && dailyResourceRate(state, 'water').inflow >= dailyResourceRate(state, 'water').outflow,
    '重复日供水能力未覆盖服务人口'),
    evidenceItem('food_repeatable', serviceCoversPopulation(state, 'food')
      && dailyResourceRate(state, 'food').inflow >= dailyResourceRate(state, 'food').outflow,
    '食物来源与基础处理未共同覆盖服务人口'),
    evidenceItem('critical_power', serviceCoversPopulation(state, 'power')
      && repairSustainmentAvailable(state), '关键供能或其维护来源未覆盖服务人口'),
    evidenceItem('sanitation_medical', serviceCoversPopulation(state, 'sanitation')
      && serviceCoversPopulation(state, 'medical'), '卫生或基础医疗容量未覆盖服务人口'),
    evidenceItem('repair_sustainment', repairSustainmentAvailable(state), '基础维修缺少可恢复的普通零件来源'),
    evidenceItem('basic_industry', industryReady, '没有可运行生产场址与可分配生产单元'),
    evidenceItem('mobile_workforce', settlement.servedPopulation >= 1_000
      && mobileWorkforce >= mobileRequired
      && state.workforce.workable === unifiedWorkablePopulation(state), '机动人力未进入统一可用劳动力账'),
    evidenceItem('idle_queue', idleQueue, '没有玩家已批准且可继续推进的队列'),
  ];
  const continuity = state.openingLoop.continuityMonths.slice(-3);
  const continuityPassed = continuity.length === 3 && continuity.every((month) => (
    month.waterMet
      && month.foodMet
      && month.criticalServicesOperational
      && month.maintenanceRecoverable
      && month.resourceAccountingConserved
  ));
  return {
    items,
    consecutiveMonths: continuityPassed ? 3 : continuity.filter((month) => (
      month.waterMet && month.foodMet && month.criticalServicesOperational
        && month.maintenanceRecoverable && month.resourceAccountingConserved
    )).length,
    passed: items.every((item) => item.status === 'pass') && continuityPassed,
  };
}
