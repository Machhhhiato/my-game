// ============ P1-S02 计划期结算：纯函数，不依赖 React/Zustand/Canvas/DOM/time/Math.random ============
import type {
  CampaignSaveV3, PlayerCommandState, ResourceId, CapacityId, DebtId, ProjectId,
  DirectionId, PolicyId, SecurityPostureId,
  PlanPeriodReport, SettlementResult, SettlementPreview, V2LogEntry,
} from './types';
import { PROJECTS, POLICIES, SECURITY_POSTURES } from './data';

export const RESOURCE_IDS: ResourceId[] = [
  'safeWater', 'calories', 'bioLandCapital', 'reclaimedMaterial',
  'precisionParts', 'effectiveLabor', 'publicCredit',
];
export const CAPACITY_IDS: CapacityId[] = [
  'materialBase', 'knowledgeBase', 'coerciveCapacity',
  'integrationCapacity', 'socialCapacity', 'logisticsResilience',
];
export const DEBT_IDS: DebtId[] = [
  'maintenance', 'ecology', 'housing', 'trust', 'military', 'integration',
];

export const RESOURCE_NAMES: Record<ResourceId, string> = {
  safeWater: '安全水', calories: '热量', bioLandCapital: '生物土地资本',
  reclaimedMaterial: '回收材料', precisionParts: '精密备件',
  effectiveLabor: '有效劳力', publicCredit: '公共信用',
};
export const CAPACITY_NAMES: Record<CapacityId, string> = {
  materialBase: '物质', knowledgeBase: '知识', coerciveCapacity: '强制',
  integrationCapacity: '统合', socialCapacity: '社会', logisticsResilience: '后勤',
};
export const DEBT_NAMES: Record<DebtId, string> = {
  maintenance: '维护债', ecology: '生态债', housing: '住房债',
  trust: '信任债', military: '军事债', integration: '统合债',
};

/** clamp(lo, hi, v)：与规格公式 clamp(0.55, 1.10, x) 的参数顺序一致 */
function clamp(lo: number, hi: number, v: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function sign(n: number): -1 | 0 | 1 {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

/** 确定性本地哈希 0..99（FNV-1a） */
function hashString99(key: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % 100;
}

type ResD = Partial<Record<ResourceId, number>>;
type CapD = Partial<Record<CapacityId, number>>;
type DebtD = Partial<Record<DebtId, number>>;

// ============ 规则表（数值严格按 P1-S02_SETTLEMENT_SPEC.md 第 5 节） ============
const FIXED_ACCOUNT: ResD = {
  safeWater: -2, calories: -2, bioLandCapital: -1, reclaimedMaterial: -1,
  precisionParts: -2, effectiveLabor: -5, publicCredit: +1,
};

const DIRECTION_RULES: Record<DirectionId, { res: ResD; cap: CapD; debt: DebtD; keyword: string }> = {
  survival: { res: { safeWater: 3, calories: 2 }, cap: { socialCapacity: 1 }, debt: {}, keyword: '配给与维修优先' },
  balanced: { res: { safeWater: 1, calories: 1, reclaimedMaterial: 1 }, cap: {}, debt: { maintenance: -1 }, keyword: '分散风险' },
  science: { res: { precisionParts: -1, effectiveLabor: -1, publicCredit: 1 }, cap: { knowledgeBase: 3 }, debt: { maintenance: 1 }, keyword: '校验与学徒挤占' },
  industry: { res: { reclaimedMaterial: 3, bioLandCapital: -1, effectiveLabor: -2 }, cap: { materialBase: 3 }, debt: { ecology: 1 }, keyword: '回收与工务挤占' },
  military: { res: { effectiveLabor: -2, publicCredit: -1 }, cap: { coerciveCapacity: 3 }, debt: { military: 1 }, keyword: '护运与警戒挤占' },
  space: { res: { precisionParts: -2, publicCredit: -2 }, cap: { knowledgeBase: 1 }, debt: { integration: 1 }, keyword: '年代能力不足的远景备案' },
};

const PROJECT_RULES: Record<ProjectId, { res: ResD; cap: CapD; debt: DebtD; baseProgress: number; laborReq: number }> = {
  water_life: { res: { safeWater: 5, precisionParts: -2, effectiveLabor: -1 }, cap: { logisticsResilience: 3 }, debt: { maintenance: -5 }, baseProgress: 25, laborReq: 1 },
  seed_protein: { res: { calories: 5, bioLandCapital: 3, safeWater: -2, effectiveLabor: -2 }, cap: { socialCapacity: 2 }, debt: { ecology: 1 }, baseProgress: 25, laborReq: 2 },
  workshop_calib: { res: { reclaimedMaterial: 5, calories: -2, effectiveLabor: -2 }, cap: { materialBase: 3 }, debt: { maintenance: -6, ecology: 2 }, baseProgress: 25, laborReq: 2 },
  archive_beacon: { res: { precisionParts: -1, effectiveLabor: -1, publicCredit: 3 }, cap: { knowledgeBase: 4 }, debt: { trust: -2 }, baseProgress: 25, laborReq: 1 },
};

const POLICY_RULES: Record<PolicyId, { res: ResD; cap: CapD; debt: DebtD }> = {
  mixed_ration: { res: {}, cap: {}, debt: { trust: -1 } },
  cautious_register: { res: { publicCredit: -1 }, cap: {}, debt: { housing: -2, integration: 1 } },
  apprentice_first: { res: { effectiveLabor: -1 }, cap: { knowledgeBase: 2 }, debt: { maintenance: -1 } },
  labor_protection: { res: { reclaimedMaterial: -1, effectiveLabor: 1 }, cap: {}, debt: { maintenance: 2, trust: -1 } },
  community_housing: { res: { reclaimedMaterial: -2, publicCredit: -1 }, cap: { socialCapacity: 2 }, debt: { housing: -4 } },
};

const SECURITY_RULES: Record<SecurityPostureId, { res: ResD; cap: CapD; debt: DebtD }> = {
  low: { res: { effectiveLabor: 1 }, cap: {}, debt: { military: 2 } },
  escort: { res: {}, cap: {}, debt: {} },
  heightened: { res: { effectiveLabor: -2, precisionParts: -1 }, cap: { coerciveCapacity: 1 }, debt: { military: 3 } },
};

// ============ 结算内部计算 ============
interface Computation {
  resourceDelta: Record<ResourceId, number>;
  capacityDelta: Record<CapacityId, number>;
  debtDelta: Record<DebtId, number>;
  project: { id: ProjectId; name: string; progressFrom: number; progressTo: number; efficiency: number } | null;
  event: { id: string; name: string; summary: string; place: string } | null;
  temporaryPopulationDelta: number;
  reasons: string[];
  seedKey: string;
}

function emptyRes(): Record<ResourceId, number> {
  return { safeWater: 0, calories: 0, bioLandCapital: 0, reclaimedMaterial: 0, precisionParts: 0, effectiveLabor: 0, publicCredit: 0 };
}
function emptyCap(): Record<CapacityId, number> {
  return { materialBase: 0, knowledgeBase: 0, coerciveCapacity: 0, integrationCapacity: 0, socialCapacity: 0, logisticsResilience: 0 };
}
function emptyDebt(): Record<DebtId, number> {
  return { maintenance: 0, ecology: 0, housing: 0, trust: 0, military: 0, integration: 0 };
}

function applyRes(res: Record<ResourceId, number>, d: ResD, mult = 1): void {
  for (const k of Object.keys(d) as ResourceId[]) res[k] += (d[k] ?? 0) * mult;
}
function applyCap(cap: Record<CapacityId, number>, d: CapD, mult = 1): void {
  for (const k of Object.keys(d) as CapacityId[]) cap[k] += (d[k] ?? 0) * mult;
}
function applyDebt(debt: Record<DebtId, number>, d: DebtD, mult = 1): void {
  for (const k of Object.keys(d) as DebtId[]) debt[k] += (d[k] ?? 0) * mult;
}

function computePlanPeriod(state: CampaignSaveV3, command: PlayerCommandState): Computation {
  const res = emptyRes();
  const cap = emptyCap();
  const debt = emptyDebt();
  let temporaryPopulationDelta = 0;

  // 1. 固定账户收支
  applyRes(res, FIXED_ACCOUNT);

  // 2. 主方向 100%，辅方向 50%（主辅相同视为无辅方向）
  applyRes(res, DIRECTION_RULES[command.primaryDirection].res, 1);
  applyCap(cap, DIRECTION_RULES[command.primaryDirection].cap, 1);
  applyDebt(debt, DIRECTION_RULES[command.primaryDirection].debt, 1);
  if (command.secondaryDirection && command.secondaryDirection !== command.primaryDirection) {
    applyRes(res, DIRECTION_RULES[command.secondaryDirection].res, 0.5);
    applyCap(cap, DIRECTION_RULES[command.secondaryDirection].cap, 0.5);
    applyDebt(debt, DIRECTION_RULES[command.secondaryDirection].debt, 0.5);
  }

  // 3. 旗舰工程（仅选中项完整生效）及进度
  let project: Computation['project'] = null;
  if (command.flagshipProjectId) {
    const pr = PROJECT_RULES[command.flagshipProjectId];
    applyRes(res, pr.res);
    applyCap(cap, pr.cap);
    applyDebt(debt, pr.debt);

    const logistics = state.nation.capacities.logisticsResilience.value;
    const maintenance = state.nation.debts.maintenance.value;
    const laborStock = state.nation.resources.effectiveLabor.stock;
    const efficiency = clamp(0.55, 1.10,
      0.85 + (logistics - 30) / 200 - maintenance / 500 - Math.max(0, pr.laborReq - laborStock) / 100);
    const progressFrom = state.projectProgress[command.flagshipProjectId] ?? 0;
    const step = Math.round(pr.baseProgress * efficiency);
    const progressTo = clamp(0, 100, progressFrom + step);
    project = {
      id: command.flagshipProjectId,
      name: PROJECTS[command.flagshipProjectId].name,
      progressFrom,
      progressTo,
      efficiency,
    };
  }

  // 4. 法令与安全姿态
  applyRes(res, POLICY_RULES[command.policyId].res);
  applyCap(cap, POLICY_RULES[command.policyId].cap);
  applyDebt(debt, POLICY_RULES[command.policyId].debt);
  applyRes(res, SECURITY_RULES[command.securityPosture].res);
  applyCap(cap, SECURITY_RULES[command.securityPosture].cap);
  applyDebt(debt, SECURITY_RULES[command.securityPosture].debt);

  // 5. 基础债务（用修正后库存）
  const postStock = (id: ResourceId): number => state.nation.resources[id].stock + res[id];
  if (postStock('precisionParts') < 24) debt.maintenance += 2;
  if (postStock('precisionParts') < 12) debt.maintenance += 1;
  if (postStock('bioLandCapital') < 40) debt.ecology += 1;
  if (postStock('effectiveLabor') < 20) debt.housing += 1;
  if (postStock('publicCredit') < 40) debt.trust += 2;
  debt.military += command.securityPosture === 'low' ? 1 : command.securityPosture === 'heightened' ? 2 : 0;
  if (postStock('publicCredit') < 40) debt.integration += 1;

  // 6. 条件事件（每期最多一条，按优先级）
  let event: Computation['event'] = null;
  if (command.flagshipProjectId === 'water_life' && postStock('precisionParts') <= 12 && !state.eventFlags.filter_strain) {
    res.safeWater -= 8; res.publicCredit -= 3; debt.maintenance += 2;
    event = { id: 'filter_strain', name: '滤芯拆借', summary: '滤芯拆借，净水储备被迫下调', place: '翡翠河谷水网' };
  } else if (postStock('bioLandCapital') <= 22 && !state.eventFlags.acid_rain) {
    const roll = hashString99(`${state.seed}:${state.settlementCount}:acid_rain`);
    if (roll < 40) {
      res.bioLandCapital -= 4; debt.ecology += 5;
      event = { id: 'acid_rain', name: '酸雨冲刷', summary: '酸雨冲刷试验地，土壤基质报废', place: '南部酸雨带' };
    }
  } else if (command.policyId === 'cautious_register' && postStock('publicCredit') <= 36 && !state.eventFlags.ferry_dispute) {
    res.publicCredit -= 5; debt.housing += 3; debt.trust += 4; temporaryPopulationDelta += 4;
    event = { id: 'ferry_dispute', name: '登记争议', summary: '登记争议扩大，临时安置压力上升', place: '旧渡口行旅营' };
  }

  // 7. 原因与 seedKey
  const dir = DIRECTION_RULES[command.primaryDirection];
  const reasons = [
    `固定账户收支：水 ${FIXED_ACCOUNT.safeWater}、热量 ${FIXED_ACCOUNT.calories}、土地 ${FIXED_ACCOUNT.bioLandCapital}、材料 ${FIXED_ACCOUNT.reclaimedMaterial}、备件 ${FIXED_ACCOUNT.precisionParts}、劳力 ${FIXED_ACCOUNT.effectiveLabor}、信用 ${FIXED_ACCOUNT.publicCredit}。`,
    `命令修正：${dir.keyword}${project ? `；旗舰工程「${project.name}」推进 +${project.progressTo - project.progressFrom}` : ''}；${POLICIES[command.policyId].name}；${SECURITY_POSTURES.find(s => s.id === command.securityPosture)!.name}。`,
    event ? `事件兑现：${event.summary}。` : '基础债务按库存结算；本期无新增硬事件，风险继续积累。',
  ];
  const seedKey = `${state.seed}:${state.settlementCount}`;

  return { resourceDelta: res, capacityDelta: cap, debtDelta: debt, project, event, temporaryPopulationDelta, reasons, seedKey };
}

// ============ 预览（不改输入，与结算数值一致） ============
export function previewPlanPeriod(state: CampaignSaveV3, command: PlayerCommandState): SettlementPreview {
  const comp = computePlanPeriod(state, command);

  let mostStressedResource: SettlementPreview['mostStressedResource'] = null;
  let minRatio = Infinity;
  for (const id of RESOURCE_IDS) {
    const post = state.nation.resources[id].stock + comp.resourceDelta[id];
    const target = state.nation.resources[id].reserveTarget;
    const ratio = target > 0 ? post / target : Infinity;
    if (ratio < minRatio) minRatio = ratio;
  }
  if (minRatio < 1) {
    for (const id of RESOURCE_IDS) {
      const post = state.nation.resources[id].stock + comp.resourceDelta[id];
      const target = state.nation.resources[id].reserveTarget;
      const ratio = target > 0 ? post / target : Infinity;
      if (Math.abs(ratio - minRatio) < 1e-9) {
        mostStressedResource = { id, name: RESOURCE_NAMES[id], delta: comp.resourceDelta[id] };
        break;
      }
    }
  }

  let largestDebtChange: SettlementPreview['largestDebtChange'] = null;
  let maxAbs = 0;
  for (const id of DEBT_IDS) {
    const a = Math.abs(comp.debtDelta[id]);
    if (a > maxAbs) maxAbs = a;
  }
  if (maxAbs > 0) {
    for (const id of DEBT_IDS) {
      if (Math.abs(comp.debtDelta[id]) === maxAbs) {
        largestDebtChange = { id, name: DEBT_NAMES[id], delta: comp.debtDelta[id] };
        break;
      }
    }
  }

  return {
    flagshipProject: projectName(command),
    mostStressedResource,
    largestDebtChange,
    event: comp.event ? { id: comp.event.id, name: comp.event.name } : null,
    summary: buildSummary(state, comp),
  };
}

function projectName(command: PlayerCommandState): string {
  if (command.flagshipProjectId && PROJECTS[command.flagshipProjectId]) return PROJECTS[command.flagshipProjectId].name;
  return '无旗舰工程';
}

function buildSummary(state: CampaignSaveV3, comp: Computation): string {
  const proj = comp.project ? `优先「${comp.project.name}」(+${comp.project.progressTo - comp.project.progressFrom})` : '无旗舰工程';
  const evt = comp.event ? `事件「${comp.event.name}」` : '无新增硬事件';
  return `第 ${state.clock.year} 年第 ${state.clock.period} 期结算：${proj}；${evt}`;
}

// ============ 结算（不改输入，返回新状态） ============
export function settlePlanPeriod(state: CampaignSaveV3, command: PlayerCommandState): SettlementResult {
  const comp = computePlanPeriod(state, command);
  const newState = structuredClone(state) as CampaignSaveV3;

  // 应用 delta（库存 clamp ≥0；能力/债务 clamp 0..100）
  for (const id of RESOURCE_IDS) {
    const lv = newState.nation.resources[id];
    const d = comp.resourceDelta[id];
    lv.stock = Math.max(0, lv.stock + d);
    lv.trend = sign(d);
  }
  for (const id of CAPACITY_IDS) {
    const s = newState.nation.capacities[id];
    const d = comp.capacityDelta[id];
    s.value = clamp(0, 100, s.value + d);
    s.trend = sign(d);
  }
  for (const id of DEBT_IDS) {
    const s = newState.nation.debts[id];
    const d = comp.debtDelta[id];
    s.value = clamp(0, 100, s.value + d);
    s.trend = sign(d);
  }

  // 工程进度
  if (comp.project) {
    newState.projectProgress[comp.project.id] = comp.project.progressTo;
  }

  // 事件标记 + 临时人口
  if (comp.event) {
    newState.eventFlags[comp.event.id] = true;
  }
  if (comp.temporaryPopulationDelta !== 0) {
    newState.nation.population.temporary = Math.max(0, newState.nation.population.temporary + comp.temporaryPopulationDelta);
  }

  // 命令提交
  newState.player = { ...command };

  // 报告（最多 12 份）
  const report: PlanPeriodReport = {
    year: state.clock.year,
    period: state.clock.period,
    command: { ...command },
    resourceDelta: { ...comp.resourceDelta },
    capacityDelta: { ...comp.capacityDelta },
    debtDelta: { ...comp.debtDelta },
    project: comp.project ? { ...comp.project } : null,
    event: comp.event ? { id: comp.event.id, name: comp.event.name, summary: comp.event.summary } : null,
    reasons: [...comp.reasons],
    seedKey: comp.seedKey,
  };
  newState.reports = [...newState.reports, report].slice(-12);

  // 日志（最多 40 条）
  let nextId = newState.log.length ? Math.max(...newState.log.map(e => e.id)) + 1 : 1;
  const logEntries: V2LogEntry[] = [
    {
      id: nextId++,
      period: `第 ${state.clock.period} 期`,
      place: '统筹与账目',
      summary: buildSummary(state, comp),
      severity: 'info',
    },
  ];
  if (comp.event) {
    logEntries.push({
      id: nextId++,
      period: `第 ${state.clock.period} 期`,
      place: comp.event.place,
      summary: comp.event.summary,
      severity: 'danger',
    });
  }
  newState.log = [...newState.log, ...logEntries].slice(-40);
  newState.logUnread = Math.min(99, newState.logUnread + logEntries.length);

  newState.settlementCount += 1;

  // 8. 日历：只有此步推进
  newState.clock.period += 1;
  if (newState.clock.period > 6) {
    newState.clock.period = 1;
    newState.clock.year += 1;
  }

  return { newState, report, logEntries, summary: buildSummary(state, comp) };
}
