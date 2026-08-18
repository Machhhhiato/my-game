// ============ P1-S03C 持续运行国家指标：单一日步因果源（纯函数，无 React/Zustand/DOM/time/Math.random） ============
import type { CampaignSaveV5, FocusId, MetricId, SlotState } from './types';
import {
  METRIC_ORDER, METRIC_DEFS, FOCUS_ORDER, FOCUS_DEFS,
  PROJECT_ORDER, PROJECT_DEFS, RESEARCH_ORDER, RESEARCH_DEFS,
  TRANSITION_DAYS, TRANSITION_START, TRANSITION_STEP, HANDOVER_DAYS, HANDOVER_START, EVENT_DETAIL_PLACEHOLDER,
} from './nation';

export {
  METRIC_ORDER, METRIC_DEFS, FOCUS_ORDER, FOCUS_DEFS,
  PROJECT_ORDER, PROJECT_DEFS, RESEARCH_ORDER, RESEARCH_DEFS,
};

export const DAYS_PER_PERIOD = 60;

function clamp(lo: number, hi: number, v: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function hashString99(key: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % 100;
}

export function yearOf(day: number): number {
  return Math.floor((day - 1) / 360) + 1;
}
export function periodOf(day: number): number {
  return Math.floor((day - 1) / DAYS_PER_PERIOD) + 1;
}

export function transitionLabel(s: CampaignSaveV5): string | null {
  if (s.focus.transitionDaysRemaining > 0) {
    return `中央改组中 · 还需 ${s.focus.transitionDaysRemaining} 日恢复满负荷`;
  }
  return null;
}

// ============ 量化“倾向/完成改变”的日变化率（最小确定性默认，见最终回报待裁决项） ============
function baseRate(m: MetricId): number {
  switch (m) {
    case 'livelihood': return 0.04;
    case 'industry': return 0.03;
    case 'energy': return 0.02;
    case 'research': return 0.03;
    case 'administration': return 0.03;
    case 'logistics': return 0.03;
    case 'military': return 0.01;
    case 'stability': return 0.02;
    case 'ecology': return -0.02;
  }
}

const FOCUS_RATE: Record<FocusId, Partial<Record<MetricId, number>>> = {
  survival: { livelihood: 0.04, logistics: 0.03, research: -0.02, industry: -0.02 },
  balanced: { livelihood: 0.02, stability: 0.02, administration: 0.02 },
  industry: { industry: 0.05, logistics: 0.03, livelihood: -0.02, ecology: -0.02 },
  science: { research: 0.05, administration: 0.03, industry: -0.02, logistics: -0.02 },
  military: { military: 0.04, logistics: 0.02, industry: -0.02, stability: -0.01 },
};

const PROJECT_EFFECT: Record<string, Partial<Record<MetricId, number>>> = {
  water_life: { livelihood: 0.04 },
  seed_protein: { livelihood: 0.03, ecology: 0.03 },
  workshop_calib: { industry: 0.05 },
  archive_beacon: { administration: 0.04, logistics: 0.03 },
};
const RESEARCH_EFFECT: Record<string, Partial<Record<MetricId, number>>> = {
  membrane_reuse: { livelihood: 0.02 },
  field_methods: { ecology: 0.03 },
  maintenance_training: { industry: 0.03, administration: 0.03 },
};

function mainMetric(slotId: string): MetricId {
  if (slotId === 'water_life' || slotId === 'membrane_reuse') return 'livelihood';
  if (slotId === 'seed_protein' || slotId === 'field_methods') return 'ecology';
  if (slotId === 'workshop_calib' || slotId === 'maintenance_training') return 'industry';
  return 'administration';
}

function completedEffect(s: CampaignSaveV5): Record<MetricId, number> {
  const acc: Record<MetricId, number> = {
    livelihood: 0, industry: 0, energy: 0, research: 0, administration: 0, logistics: 0, military: 0, stability: 0, ecology: 0,
  };
  if (s.project.id && s.project.milestones.p100) {
    for (const [k, v] of Object.entries(PROJECT_EFFECT[s.project.id] ?? {})) acc[k as MetricId] += v;
  }
  if (s.research.id && s.research.milestones.p100) {
    for (const [k, v] of Object.entries(RESEARCH_EFFECT[s.research.id] ?? {})) acc[k as MetricId] += v;
  }
  return acc;
}

function metricDailyRate(s: CampaignSaveV5, id: MetricId): number {
  const ce = completedEffect(s);
  return baseRate(id) + (FOCUS_RATE[s.focus.id][id] ?? 0) + ce[id];
}

function handoverEfficiency(slot: SlotState): number {
  if (slot.handoverDays <= 0) return 1;
  return HANDOVER_START + (HANDOVER_DAYS - slot.handoverDays) * ((1 - HANDOVER_START) / HANDOVER_DAYS);
}

function projectSpeed(s: CampaignSaveV5): number {
  const i = s.metrics.industry.value, l = s.metrics.logistics.value, a = s.metrics.administration.value;
  const factor = clamp(0.4, 1.2, (i + l + a) / 240);
  return 0.5 * factor;
}
function researchSpeed(s: CampaignSaveV5): number {
  const r = s.metrics.research.value, e = s.metrics.energy.value, a = s.metrics.administration.value;
  const factor = clamp(0.4, 1.2, (r + e + a) / 240);
  return 0.5 * factor;
}

function applyMilestones(slot: SlotState, slotId: string, s: CampaignSaveV5): void {
  if (!slot.milestones.p25 && slot.progress >= 25) {
    slot.milestones.p25 = true;
    s.metrics[mainMetric(slotId)].value = clamp(0, 100, s.metrics[mainMetric(slotId)].value + 1);
  }
  if (!slot.milestones.p50 && slot.progress >= 50) {
    slot.milestones.p50 = true;
    s.metrics[mainMetric(slotId)].value = clamp(0, 100, s.metrics[mainMetric(slotId)].value + 1);
  }
  if (!slot.milestones.p75 && slot.progress >= 75) {
    slot.milestones.p75 = true;
    s.metrics[mainMetric(slotId)].value = clamp(0, 100, s.metrics[mainMetric(slotId)].value + 1);
  }
  if (!slot.milestones.p100 && slot.progress >= 100) {
    slot.milestones.p100 = true;
    s.metrics[mainMetric(slotId)].value = clamp(0, 100, s.metrics[mainMetric(slotId)].value + 2);
  }
}

// ============ 切换（不暂停、不扣永久数值、不清进度） ============
export function setFocus(state: CampaignSaveV5, id: FocusId): CampaignSaveV5 {
  const s = structuredClone(state) as CampaignSaveV5;
  s.focus = { id, transitionDaysRemaining: TRANSITION_DAYS, transitionEfficiency: TRANSITION_START };
  return s;
}
export function setProject(state: CampaignSaveV5, id: string): CampaignSaveV5 {
  const s = structuredClone(state) as CampaignSaveV5;
  s.project = { id, progress: 0, handoverDays: HANDOVER_DAYS, milestones: { p25: false, p50: false, p75: false, p100: false } };
  return s;
}
export function setResearch(state: CampaignSaveV5, id: string): CampaignSaveV5 {
  const s = structuredClone(state) as CampaignSaveV5;
  s.research = { id, progress: 0, handoverDays: HANDOVER_DAYS, milestones: { p25: false, p50: false, p75: false, p100: false } };
  return s;
}

// ============ 事件（非阻塞；正文用占位符） ============
function ensureEvents(s: CampaignSaveV5): void {
  if (s.events.length > 0) return;
  s.events = [
    { id: 'water_wear', location: '翡翠河谷水网', cause: EVENT_DETAIL_PLACEHOLDER, affectedMetric: 'livelihood', consequence: EVENT_DETAIL_PLACEHOLDER, suggestion: EVENT_DETAIL_PLACEHOLDER, warningDay: 12 + hashString99(`${s.seed}:water_wear`) % 40, active: false },
    { id: 'acid_rain', location: '南部酸雨带', cause: EVENT_DETAIL_PLACEHOLDER, affectedMetric: 'ecology', consequence: EVENT_DETAIL_PLACEHOLDER, suggestion: EVENT_DETAIL_PLACEHOLDER, warningDay: 30 + hashString99(`${s.seed}:acid_rain`) % 50, active: false },
    { id: 'ferry_dispute', location: '旧渡口行旅营', cause: EVENT_DETAIL_PLACEHOLDER, affectedMetric: 'stability', consequence: EVENT_DETAIL_PLACEHOLDER, suggestion: EVENT_DETAIL_PLACEHOLDER, warningDay: 50 + hashString99(`${s.seed}:ferry_dispute`) % 50, active: false },
  ];
}

const EVENT_PENALTY: Record<string, Partial<Record<MetricId, number>>> = {
  water_wear: { livelihood: -0.03 },
  acid_rain: { ecology: -0.04 },
  ferry_dispute: { stability: -0.02 },
};

function tickEvents(s: CampaignSaveV5): void {
  ensureEvents(s);
  for (const ev of s.events) {
    if (!ev.active && s.day >= ev.warningDay) ev.active = true;
  }
}
function eventPenalty(s: CampaignSaveV5, id: MetricId): number {
  let p = 0;
  for (const ev of s.events) {
    if (ev.active) p += EVENT_PENALTY[ev.id]?.[id] ?? 0;
  }
  return p;
}

// ============ 推进一天 ============
export function advanceOneDay(state: CampaignSaveV5): CampaignSaveV5 {
  const s = structuredClone(state) as CampaignSaveV5;

  // 改组惯性
  if (s.focus.transitionDaysRemaining > 0) {
    s.focus.transitionDaysRemaining -= 1;
    s.focus.transitionEfficiency = Math.min(1, TRANSITION_START + (TRANSITION_DAYS - s.focus.transitionDaysRemaining) * TRANSITION_STEP);
  } else {
    s.focus.transitionEfficiency = 1;
  }
  // 交接
  if (s.project.handoverDays > 0) s.project.handoverDays -= 1;
  if (s.research.handoverDays > 0) s.research.handoverDays -= 1;

  const te = s.focus.transitionEfficiency;
  const ph = handoverEfficiency(s.project);
  const rh = handoverEfficiency(s.research);

  // 指标（正向速率 × 改组效率）
  for (const id of METRIC_ORDER) {
    let rate = metricDailyRate(s, id) + eventPenalty(s, id);
    const applied = rate > 0 ? rate * te : rate;
    s.metrics[id].value = clamp(0, 100, s.metrics[id].value + applied);
    s.metrics[id].dailyRate = rate;
  }

  // 工程/科研进度
  if (s.project.id) {
    const step = projectSpeed(s) * te * ph;
    s.project.progress = clamp(0, 100, s.project.progress + step);
    applyMilestones(s.project, s.project.id, s);
  }
  if (s.research.id) {
    const step = researchSpeed(s) * te * rh;
    s.research.progress = clamp(0, 100, s.research.progress + step);
    applyMilestones(s.research, s.research.id, s);
  }

  // 事件
  tickEvents(s);

  // 周报 / 60 日滚动简报（不暂停）
  if (s.day % 7 === 0) {
    s.log = [...s.log, {
      id: s.log.length ? Math.max(...s.log.map(e => e.id)) + 1 : 1,
      period: `第 ${periodOf(s.day)} 期`,
      place: '河谷执行周报',
      summary: buildWeeklySummary(s),
      severity: 'info' as const,
    }].slice(-40);
    s.logUnread = Math.min(99, s.logUnread + 1);
  }
  if (s.day % DAYS_PER_PERIOD === 0) {
    s.log = [...s.log, {
      id: s.log.length ? Math.max(...s.log.map(e => e.id)) + 1 : 1,
      period: `第 ${periodOf(s.day)} 期`,
      place: '中央滚动简报',
      summary: `第 ${periodOf(s.day)} 期中央滚动简报：${buildMetricSummary(s)}`,
      severity: 'info' as const,
    }].slice(-40);
    s.logUnread = Math.min(99, s.logUnread + 1);
  }

  s.day += 1;
  return s;
}

export function advanceDays(state: CampaignSaveV5, days: number): CampaignSaveV5 {
  let s = structuredClone(state) as CampaignSaveV5;
  for (let i = 0; i < days; i++) s = advanceOneDay(s);
  return s;
}

function buildWeeklySummary(s: CampaignSaveV5): string {
  const up: string[] = [];
  const down: string[] = [];
  for (const id of METRIC_ORDER) {
    const r = s.metrics[id].dailyRate;
    if (r > 0.005) up.push(METRIC_DEFS[id].name);
    else if (r < -0.005) down.push(METRIC_DEFS[id].name);
  }
  const u = up.length ? `回升：${up.join('、')}` : '无回升';
  const d = down.length ? `承压：${down.join('、')}` : '无承压';
  const evt = s.events.filter(e => e.active).map(e => e.location);
  return `本周 ${u}；${d}${evt.length ? `；警报：${evt.join('、')}` : ''}。`;
}

function buildMetricSummary(s: CampaignSaveV5): string {
  return METRIC_ORDER.map(id => `${METRIC_DEFS[id].name} ${Math.round(s.metrics[id].value)}`).join('、');
}
