import type {
  M0State,
  Priority,
  Project,
  ResearchDomain,
  ResearchMode,
  ResearchState,
  ResourceId,
} from './types';

export interface TechnologyDefinition {
  id: string;
  name: string;
  domain: ResearchDomain;
  stage: number;
  stageEntry: boolean;
  automatic: boolean;
  order: number;
  prerequisites: string[];
  physicalPrerequisites: string[];
  work: number;
}

export const technologies: TechnologyDefinition[] = [
  {
    id: 'restore-precision-manufacturing',
    name: '恢复精密制造',
    domain: 'manufacturing',
    stage: 1,
    stageEntry: true,
    automatic: true,
    order: 1,
    prerequisites: [],
    physicalPrerequisites: [],
    work: 24,
  },
  {
    id: 'adapt-survey-drone',
    name: '适配勘测无人机',
    domain: 'surveying',
    stage: 1,
    stageEntry: true,
    automatic: true,
    order: 1,
    prerequisites: ['restore-precision-manufacturing'],
    physicalPrerequisites: [],
    work: 18,
  },
];

interface CapabilityRecipe {
  name: string;
  work: number;
  workers: number;
  queueOrder: number;
  cost: Partial<Record<ResourceId, number>>;
}

export const capabilityRecipes: Record<string, CapabilityRecipe> = {
  'repair-precision-workshop': {
    name: '修复精密工坊',
    work: 36,
    workers: 9,
    queueOrder: 120,
    cost: { commonParts: 5, engineeringComponents: 16, alloy: 8 },
  },
  'prototype-precision-parts': {
    name: '独立试制批',
    work: 12,
    workers: 6,
    queueOrder: 130,
    cost: { commonParts: 2, engineeringComponents: 4, alloy: 4 },
  },
  'assemble-survey-drone': {
    name: '首套多光谱勘测无人机系统',
    work: 18,
    workers: 6,
    queueOrder: 140,
    cost: { commonParts: 3, engineeringComponents: 10, alloy: 8, precisionParts: 2 },
  },
};

export const capabilityPrerequisites: Record<string, string[]> = {
  'repair-precision-workshop': ['restore-precision-manufacturing'],
  'prototype-precision-parts': ['repair-precision-workshop'],
  'assemble-survey-drone': ['adapt-survey-drone', 'prototype-precision-parts'],
};

export function isResearchProjectId(id: string): boolean {
  return technologies.some((technology) => technology.id === id);
}

export function isPrecisionWorkshopProjectId(id: string): boolean {
  return id === 'prototype-precision-parts' || id === 'assemble-survey-drone';
}

export function technologyName(id: string): string {
  return technologies.find((technology) => technology.id === id)?.name ?? id;
}

export function researchDomainName(domain: ResearchDomain): string {
  return {
    manufacturing: '制造与材料',
    surveying: '勘测与地图',
    engineering: '工程与后勤',
  }[domain];
}

export function enabledResearchCapacity(research: Pick<ResearchState, 'facilities'>): number {
  return research.facilities
    .filter((facility) => facility.enabled)
    .reduce((total, facility) => total + facility.openPositions, 0);
}

export function projectForCapability(
  id: string,
  priority: Priority = 'P1',
  researchWorkers = 6,
): Project | null {
  const technology = technologies.find((item) => item.id === id);
  const recipe = capabilityRecipes[id];
  if (!technology && !recipe) return null;
  const workers = technology ? Math.max(0, Math.floor(researchWorkers)) : recipe.workers;
  return {
    id,
    name: technology?.name ?? recipe.name,
    priority,
    queueOrder: technology ? 100 : recipe.queueOrder,
    status: 'active',
    production: false,
    testOnly: false,
    directRecovery: false,
    autoResume: true,
    pausedReason: null,
    safeActiveDays: 0,
    staffing: {
      planned: workers,
      actual: 0,
      source: 'development',
      returnTo: 'development',
    },
    workDone: 0,
    workRequired: technology?.work ?? recipe.work,
    investedResources: recipe?.cost ?? {},
  };
}

function expandPrerequisites(id: string, completed: Set<string>, visiting: Set<string>, output: string[]): void {
  if (completed.has(id) || output.includes(id)) return;
  if (visiting.has(id)) throw new Error(`Cyclic research prerequisite: ${id}`);
  const technology = technologies.find((candidate) => candidate.id === id);
  if (!technology) return;
  visiting.add(id);
  for (const prerequisite of technology.prerequisites) expandPrerequisites(prerequisite, completed, visiting, output);
  visiting.delete(id);
  output.push(id);
}

export function queueTarget(research: ResearchState, id: string): string[] {
  if (!technologies.some((technology) => technology.id === id)) return research.manualQueue;
  const expanded: string[] = [];
  expandPrerequisites(id, new Set(research.completed), new Set(), expanded);
  const retained = research.manualQueue.filter((queuedId) => !expanded.includes(queuedId) && !research.completed.includes(queuedId));
  return [...retained, ...expanded];
}

export function completedCapability(state: M0State, id: string): boolean {
  return state.research.completed.includes(id)
    || (id === 'prototype-precision-parts'
      && state.production.lines.some((line) => line.id === 'precision-parts' && line.batchesCompleted > 0))
    || (id === 'assemble-survey-drone' && state.drone !== null)
    || state.projects.some((project) => project.id === id && project.status === 'complete');
}

export function technologyBlockReason(
  state: M0State,
  technology: TechnologyDefinition,
): 'physical-prerequisite' | 'manual-choice' | null {
  if (technology.prerequisites.some((id) => !state.research.completed.includes(id))) return 'manual-choice';
  if (technology.physicalPrerequisites.some((id) => !completedCapability(state, id))) return 'physical-prerequisite';
  return null;
}

export function domainStage(
  research: ResearchState,
  domain: ResearchDomain,
  definitions: TechnologyDefinition[] = technologies,
): number {
  return definitions
    .filter((technology) => technology.domain === domain && technology.stageEntry && research.completed.includes(technology.id))
    .reduce((highest, technology) => Math.max(highest, technology.stage), 0);
}

export interface ResearchSelection {
  id: string | null;
  source: ResearchMode | null;
  roundTarget: number | null;
  blockedProjectId: string | null;
  blockedReason: ResearchState['blockedReason'];
}

function firstIncompleteManual(research: ResearchState): TechnologyDefinition | undefined {
  return research.manualQueue
    .map((id) => technologies.find((technology) => technology.id === id))
    .find((technology): technology is TechnologyDefinition => Boolean(technology && !research.completed.includes(technology.id)));
}

function blockedSelection(
  state: M0State,
  technology: TechnologyDefinition,
  roundTarget: number,
): ResearchSelection {
  return {
    id: null,
    source: null,
    roundTarget,
    blockedProjectId: technology.id,
    blockedReason: technologyBlockReason(state, technology),
  };
}

export function automaticSelectionForDefinitions(
  state: M0State,
  definitions: TechnologyDefinition[],
): ResearchSelection {
  const research = state.research;
  const participating = research.domainOrder.filter((domain) => research.automaticDomains.includes(domain));
  const nextEntryStages = participating.flatMap((domain) => {
    const completedStage = domainStage(research, domain, definitions);
    return definitions
      .filter((technology) => technology.domain === domain
        && technology.stageEntry
        && technology.stage > completedStage
        && !research.completed.includes(technology.id))
      .map((technology) => technology.stage);
  });
  const unfinishedOrdinaryStages = definitions
    .filter((technology) => participating.includes(technology.domain)
      && !technology.stageEntry
      && technology.automatic
      && !research.completed.includes(technology.id))
    .map((technology) => technology.stage);
  const pendingRoundStages = [...nextEntryStages, ...unfinishedOrdinaryStages];
  const roundTarget = research.roundTarget ?? (pendingRoundStages.length > 0 ? Math.min(...pendingRoundStages) : null);
  if (roundTarget === null) return { id: null, source: null, roundTarget: null, blockedProjectId: null, blockedReason: 'no-project' };

  let firstBlocked: TechnologyDefinition | null = null;
  for (const domain of participating) {
    const entry = definitions
      .filter((technology) => technology.domain === domain
        && technology.stageEntry
        && technology.stage === roundTarget
        && !research.completed.includes(technology.id))
      .sort((left, right) => left.order - right.order)[0];
    if (!entry) continue;
    if (technologyBlockReason(state, entry) === null) {
      return {
        id: entry.id,
        source: 'automatic',
        roundTarget,
        blockedProjectId: firstBlocked?.id ?? null,
        blockedReason: firstBlocked ? technologyBlockReason(state, firstBlocked) : null,
      };
    }
    firstBlocked ??= entry;
  }

  if (firstBlocked) return blockedSelection(state, firstBlocked, roundTarget);

  for (const domain of participating) {
    const ordinary = definitions
      .filter((technology) => technology.domain === domain
        && !technology.stageEntry
        && technology.stage <= roundTarget
        && technology.automatic
        && !research.completed.includes(technology.id))
      .sort((left, right) => left.order - right.order);
    for (const technology of ordinary) {
      if (technologyBlockReason(state, technology) === null) {
        return {
          id: technology.id,
          source: 'automatic',
          roundTarget,
          blockedProjectId: firstBlocked?.id ?? null,
          blockedReason: firstBlocked ? technologyBlockReason(state, firstBlocked) : null,
        };
      }
      firstBlocked ??= technology;
    }
  }

  if (firstBlocked) return blockedSelection(state, firstBlocked, roundTarget);

  const laterEntryStages = participating.flatMap((domain) => definitions
    .filter((technology) => technology.domain === domain
      && technology.stageEntry
      && technology.stage > roundTarget
      && !research.completed.includes(technology.id))
    .map((technology) => technology.stage));
  if (laterEntryStages.length === 0) {
    return { id: null, source: null, roundTarget: null, blockedProjectId: null, blockedReason: 'no-project' };
  }
  const nextRoundState = {
    ...state,
    research: { ...state.research, roundTarget: Math.min(...laterEntryStages) },
  };
  return automaticSelectionForDefinitions(nextRoundState, definitions);
}

function automaticSelection(state: M0State): ResearchSelection {
  return automaticSelectionForDefinitions(state, technologies);
}

export function selectResearch(state: M0State): ResearchSelection {
  const manual = firstIncompleteManual(state.research);
  if (manual) {
    const block = technologyBlockReason(state, manual);
    return block === null
      ? { id: manual.id, source: 'manual', roundTarget: state.research.roundTarget, blockedProjectId: null, blockedReason: null }
      : { id: null, source: null, roundTarget: state.research.roundTarget, blockedProjectId: manual.id, blockedReason: block };
  }
  return { id: null, source: null, roundTarget: null, blockedProjectId: null, blockedReason: 'no-project' };
}
