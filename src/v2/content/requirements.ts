import type { CampaignSaveV6, FacilityId, FacilityStage, MetricId, V6ProjectId, V6TechId } from '../types';

export type Requirement =
  | { kind: 'tech'; id: V6TechId }
  | { kind: 'facility'; id: FacilityId; stage: Exclude<FacilityStage, 'locked' | 'planned' | 'damaged'> }
  | { kind: 'metric'; id: MetricId; min: number }
  | { kind: 'project'; id: V6ProjectId; milestone: 25 | 50 | 75 | 100 };

export interface RequirementSet {
  all: Requirement[];
  any?: Requirement[];
}

const stageRank: Record<FacilityStage, number> = {
  locked: 0, planned: 1, construction: 2, trial: 3, operational: 4, damaged: 0,
};

export const NO_REQUIREMENTS: RequirementSet = { all: [] };

export function requirementMet(requirement: Requirement, state: CampaignSaveV6): boolean {
  switch (requirement.kind) {
    case 'tech': return state.completed.techs.includes(requirement.id);
    case 'metric': return state.metrics[requirement.id].value >= requirement.min;
    case 'facility': return stageRank[state.facilities[requirement.id].stage] >= stageRank[requirement.stage];
    case 'project': return state.facilities[requirement.id].reachedMilestones.includes(requirement.milestone);
  }
}

export function requirementsMet(requirements: RequirementSet, state: CampaignSaveV6): boolean {
  return requirements.all.every((requirement) => requirementMet(requirement, state))
    && (!requirements.any || requirements.any.some((requirement) => requirementMet(requirement, state)));
}

/**
 * 指标门槛用于判断“能否开工”，不应在施工中因短期波动把已经开工的实体工程冻住。
 * 知识、设施和既有工程仍会持续检查，因而后续损坏机制可以真实造成停工。
 */
export function ongoingRequirementsMet(requirements: RequirementSet, state: CampaignSaveV6): boolean {
  const all = requirements.all.filter((requirement) => requirement.kind !== 'metric');
  const any = requirements.any;
  const anyContainsMetric = any?.some((requirement) => requirement.kind === 'metric') ?? false;
  const persistentAny = anyContainsMetric ? [] : (any ?? []);
  return all.every((requirement) => requirementMet(requirement, state))
    && (persistentAny.length === 0 || persistentAny.some((requirement) => requirementMet(requirement, state)));
}

/** 开发期解释键；R6 统一替换为玩家文字。 */
export function explainRequirement(requirement: Requirement, state: CampaignSaveV6): string {
  if (requirementMet(requirement, state)) return `requirement.met.${requirement.kind}`;
  if (requirement.kind === 'metric') return `requirement.metric.${requirement.id}.${Math.round(state.metrics[requirement.id].value)}.${requirement.min}`;
  if (requirement.kind === 'facility') return `requirement.facility.${requirement.id}.${requirement.stage}`;
  if (requirement.kind === 'project') return `requirement.project.${requirement.id}.${requirement.milestone}`;
  return `requirement.tech.${requirement.id}`;
}
