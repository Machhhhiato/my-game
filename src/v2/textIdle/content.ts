import policyUrl from '../../../content/r5/stage-1/policy-catalog.json?url';
import projectUrl from '../../../content/r5/stage-1/project-catalog.json?url';
import techUrl from '../../../content/r5/stage-1/tech-catalog.json?url';
import copyUrl from '../../../content/r6/stage-1/player-copy.json?url';
import type { MetricId } from '../types';
import type { ReserveId, TextFocusId, TextPolicy, TextPolicyId, TextProject, TextProjectId, TextTechnology, TextTechId } from './types';

export type RawTechnology = {
  id: string; domain: string; tier: number; class: 'breakthrough' | 'branch' | 'refinement'; prerequisites: string[]; engineeringPrerequisites?: string[]; discoveryPrerequisites?: string[]; playerCopyKey: string;
  runtime: { time: { workDays: number; milestones: number[] }; staffing: { researchers: number }; demand: { researchLoad: string }; result: { capability: string; automationEligible: boolean } };
};
export type RawProject = {
  id: string; domain: string; kind: string; prerequisites: string[]; discoveryPrerequisites?: string[]; playerCopyKey: string;
  runtime: { time: { workDays: number; milestones: number[] }; staffing: { builders: number }; demand: { constructionSupply: number; maintenanceLoad: string }; result: { reserveOutput: Partial<Record<ReserveId, number>>; metricEffects: Partial<Record<MetricId, number>>; facilityState: string; mapClass: string; automationFacility: boolean } };
};
export type RawPolicy = {
  id: string; familyId: string; theme: string; prerequisites: string[]; playerCopyKey: string;
  runtime: { time: { durationDays: number; milestones: number[] }; staffing: { administrators: number }; demand: { coordinationLoad: number }; result: { reserveOutput: Partial<Record<ReserveId, number>>; metricEffects: Partial<Record<MetricId, number>>; cooldownDays: number } };
};
export type PlayerCopy = { key: string; title: string; summary: string };
export type CopyPack = { technology: PlayerCopy[]; project: PlayerCopy[]; policy: PlayerCopy[] };

export interface Stage1CatalogSource {
  techs: RawTechnology[];
  projects: RawProject[];
  policies: RawPolicy[];
  copy: CopyPack;
}

export let TEXT_TECHS: Record<TextTechId, TextTechnology> = {};
export let TEXT_PROJECTS: Record<TextProjectId, TextProject> = {};
export let TEXT_POLICIES: Record<TextPolicyId, TextPolicy> = {};
export let TEXT_TECH_ORDER: Record<TextFocusId, TextTechId[]> = { settle: [], build: [], learn: [], defend: [] };
export let TEXT_PROJECT_ORDER: Record<TextFocusId, TextProjectId[]> = { settle: [], build: [], learn: [], defend: [] };
export let STAGE_1_CATALOG_COUNTS = { technologies: 0, projects: 0, policyFamilies: 0, policyVersions: 0 };

const domainFocus: Record<TextFocusId, string[]> = {
  settle: ['water', 'food', 'social', 'admin'], build: ['industry', 'energy', 'logistics'],
  learn: ['science', 'admin', 'water'], defend: ['security', 'logistics', 'frontier'],
};

function fallbackCopy(id: string): PlayerCopy { return { key: id, title: id, summary: '该内容的玩家文本尚未载入。' }; }
function orderForFocus<T extends { id: string; domain: string; tier?: number }>(items: T[], focus: TextFocusId): string[] {
  const favored = domainFocus[focus];
  return [...items].sort((a, b) => {
    const aRank = favored.indexOf(a.domain); const bRank = favored.indexOf(b.domain);
    return (aRank < 0 ? favored.length : aRank) - (bRank < 0 ? favored.length : bRank) || (a.tier ?? 0) - (b.tier ?? 0) || a.id.localeCompare(b.id);
  }).map((entry) => entry.id);
}

/** 测试可直接注入 JSON；浏览器只经 URL 异步读取，不将目录塞进启动包。 */
export function installStage1Catalog(source: Stage1CatalogSource): void {
  const techCopy = new Map(source.copy.technology.map((entry) => [entry.key, entry]));
  const projectCopy = new Map(source.copy.project.map((entry) => [entry.key, entry]));
  const policyCopy = new Map(source.copy.policy.map((entry) => [entry.key, entry]));
  const projectIds = new Set(source.projects.map((entry) => entry.id));
  TEXT_TECHS = Object.fromEntries(source.techs.map((entry) => {
    const copy = techCopy.get(entry.playerCopyKey) ?? fallbackCopy(entry.id);
    return [entry.id, { id: entry.id, name: copy.title, summary: copy.summary, domain: entry.domain, kind: entry.class === 'breakthrough' ? 'trunk' : entry.class, work: entry.runtime.time.workDays, teamRequired: entry.runtime.staffing.researchers, requirements: { techs: entry.prerequisites, operationalProjects: entry.engineeringPrerequisites ?? [], discoveries: entry.discoveryPrerequisites ?? [] }, grantsAutomation: entry.runtime.result.automationEligible, runtime: { milestones: entry.runtime.time.milestones, researchLoad: entry.runtime.demand.researchLoad, capability: entry.runtime.result.capability, automationEligible: entry.runtime.result.automationEligible } } satisfies TextTechnology];
  })) as Record<TextTechId, TextTechnology>;
  TEXT_PROJECTS = Object.fromEntries(source.projects.map((entry) => {
    const copy = projectCopy.get(entry.playerCopyKey) ?? fallbackCopy(entry.id);
    return [entry.id, { id: entry.id, name: copy.title, summary: copy.summary, work: entry.runtime.time.workDays, teamRequired: entry.runtime.staffing.builders, startCost: entry.runtime.demand.constructionSupply, requirements: { techs: entry.prerequisites, discoveries: entry.discoveryPrerequisites ?? [] }, output: entry.runtime.result.reserveOutput, metricEffects: entry.runtime.result.metricEffects, runtime: { milestones: entry.runtime.time.milestones, maintenanceLoad: entry.runtime.demand.maintenanceLoad, facilityState: entry.runtime.result.facilityState, mapClass: entry.runtime.result.mapClass, automationFacility: entry.runtime.result.automationFacility } } satisfies TextProject];
  })) as Record<TextProjectId, TextProject>;
  TEXT_POLICIES = Object.fromEntries(source.policies.map((entry) => {
    const copy = policyCopy.get(entry.playerCopyKey) ?? fallbackCopy(entry.id);
    return [entry.id, { id: entry.id, name: copy.title, summary: copy.summary, durationDays: entry.runtime.time.durationDays, cooldownDays: entry.runtime.result.cooldownDays, teamRequired: entry.runtime.staffing.administrators, requirements: { techs: entry.prerequisites.filter((id) => !projectIds.has(id)), operationalProjects: entry.prerequisites.filter((id) => projectIds.has(id)) }, output: entry.runtime.result.reserveOutput, metricEffects: entry.runtime.result.metricEffects, runtime: { milestones: entry.runtime.time.milestones, coordinationLoad: entry.runtime.demand.coordinationLoad } } satisfies TextPolicy];
  })) as Record<TextPolicyId, TextPolicy>;
  TEXT_TECH_ORDER = Object.fromEntries((['settle', 'build', 'learn', 'defend'] as TextFocusId[]).map((focus) => [focus, orderForFocus(source.techs, focus)])) as Record<TextFocusId, TextTechId[]>;
  TEXT_PROJECT_ORDER = Object.fromEntries((['settle', 'build', 'learn', 'defend'] as TextFocusId[]).map((focus) => [focus, orderForFocus(source.projects, focus)])) as Record<TextFocusId, TextProjectId[]>;
  STAGE_1_CATALOG_COUNTS = { technologies: source.techs.length, projects: source.projects.length, policyFamilies: new Set(source.policies.map((entry) => entry.familyId)).size, policyVersions: source.policies.length };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`阶段内容读取失败：${response.status}`);
  return response.json() as Promise<T>;
}
let catalogLoad: Promise<void> | null = null;
export function loadStage1Catalog(): Promise<void> {
  if (STAGE_1_CATALOG_COUNTS.technologies > 0) return Promise.resolve();
  if (catalogLoad == null) catalogLoad = Promise.all([
    fetchJson<RawTechnology[]>(techUrl), fetchJson<RawProject[]>(projectUrl), fetchJson<RawPolicy[]>(policyUrl), fetchJson<CopyPack>(copyUrl),
  ]).then(([techs, projects, policies, copy]) => installStage1Catalog({ techs, projects, policies, copy }));
  return catalogLoad;
}

/** 自动化不靠剧本名：目录中的能力标签与投用设施标签共同证明重复工作可被接管。 */
export function automationGate(): { tech: TextTechId; project: TextProjectId } | null {
  const technology = Object.values(TEXT_TECHS).find((entry) => entry.grantsAutomation);
  const project = Object.values(TEXT_PROJECTS).find((entry) => entry.runtime.automationFacility);
  return technology != null && project != null ? { tech: technology.id, project: project.id } : null;
}
