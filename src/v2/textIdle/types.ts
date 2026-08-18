import type { MetricId } from '../types';

export type ReserveId = 'water' | 'food' | 'repair';
export type TextFocusId = 'settle' | 'build' | 'learn' | 'defend';
export type TextRunMode = 'manual' | 'auto';
export type TextPhaseId = 'early' | 'mid' | 'late';
export type TextEmergencyOrderId = ReserveId | 'salvage';
export type TextFailureLevel = 'stable' | 'strained' | 'critical' | 'lost';
export type TextDevelopmentStage = 'emergency' | 'recovery' | 'settled';
/** R5 正式目录的稳定 ID。显示名与描述只由 R6 文案包提供。 */
export type TextTechId = string;
export type TextProjectId = string;
export type TextPolicyId = string;

export interface TextRequirements {
  techs?: TextTechId[];
  operationalProjects?: TextProjectId[];
}

/** 玩家显示为“某年某月上/中/下旬”；内部仍按日结算。 */
export interface TextCalendar {
  year: number;
  month: number;
  phase: TextPhaseId;
  dayInPhase: number;
  absoluteDay: number;
}

/** 不展示工时比例；只记录共同体各类责任实际占用了多少人。 */
export interface TextWorkforce {
  dependents: number;
  essentialStaff: number;
  civicAndSecurityStaff: number;
  researchStaff: number;
  projectStaff: number;
  policyStaff: number;
  emergencyStaff: number;
}

export interface TextConstructionSupply {
  stock: number;
  capacity: number;
  dailyProduction: number;
}

export interface TextEmergencyOrder {
  id: TextEmergencyOrderId;
  teamSize: number;
  daysRemaining: number;
  startedOn: number;
}

export interface TextFailureState {
  level: TextFailureLevel;
  shortageDays: number;
  failedReserve?: ReserveId;
  lastChangedOn: number;
}

/** 每日归因只保存最近一天，供报告与详情面板读取；不是玩家可见的百分比分配。 */
export interface TextDailyLedger {
  day: number;
  reserveNet: Record<ReserveId, number>;
  constructionNet: number;
  metricDelta: Partial<Record<MetricId, number>>;
  focusId: TextFocusId;
}

export interface TextTechnology {
  id: TextTechId;
  name: string;
  summary: string;
  domain: string;
  kind: 'trunk' | 'branch' | 'refinement';
  work: number;
  teamRequired: number;
  requirements: TextRequirements;
  grantsAutomation?: boolean;
  runtime: { milestones: number[]; researchLoad: string; capability: string; automationEligible: boolean };
}

export interface TextProject {
  id: TextProjectId;
  name: string;
  summary: string;
  work: number;
  teamRequired: number;
  startCost: number;
  requirements: TextRequirements;
  output: Partial<Record<ReserveId, number>>;
  consumptionMultiplier?: Partial<Record<ReserveId, number>>;
  metricEffects: Partial<Record<MetricId, number>>;
  runtime: { milestones: number[]; maintenanceLoad: string; facilityState: string; mapClass: string; automationFacility: boolean };
}

export interface TextPolicy {
  id: TextPolicyId;
  name: string;
  summary: string;
  durationDays: number;
  cooldownDays: number;
  teamRequired: number;
  requirements: TextRequirements;
  output?: Partial<Record<ReserveId, number>>;
  metricEffects?: Partial<Record<MetricId, number>>;
  runtime: { milestones: number[]; coordinationLoad: number };
}

export interface TextSlot<T extends string> {
  mode: TextRunMode;
  id: T | null;
  work: number;
  teamSize: number;
  startCost: number;
  waitingForUnlock: boolean;
}

export interface TextPolicyRuntime {
  id: TextPolicyId;
  daysRemaining: number;
  teamSize: number;
}

export interface TextReport {
  id: string;
  day: number;
  kind: 'completion' | 'warning' | 'system';
  copyKey: string;
  params: Record<string, string | number>;
}

export interface TextIdleState {
  version: 5;
  seed: number;
  /** 内部日序号；玩家日期读取 calendar。 */
  day: number;
  calendar: TextCalendar;
  population: number;
  reserves: Record<ReserveId, number>;
  construction: TextConstructionSupply;
  workforce: TextWorkforce;
  emergencyOrder: TextEmergencyOrder | null;
  failure: TextFailureState;
  developmentStage: TextDevelopmentStage;
  dailyLedger: TextDailyLedger;
  metrics: Record<MetricId, number>;
  nationalFocus: { id: TextFocusId; transitionDays: number };
  currentPolicy: TextPolicyRuntime | null;
  policyCooldowns: Partial<Record<TextPolicyId, number>>;
  completedTechs: TextTechId[];
  completedProjects: TextProjectId[];
  research: TextSlot<TextTechId>;
  project: TextSlot<TextProjectId>;
  reports: TextReport[];
}
