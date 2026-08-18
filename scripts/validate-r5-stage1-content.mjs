import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'content/r5/stage-1');
const read = (file) => readFile(resolve(dir, file), 'utf8').then(JSON.parse);
const fail = (message) => { throw new Error(`R5 catalog validation failed: ${message}`); };
const assert = (condition, message) => { if (!condition) fail(message); };

const [techs, projects, policies, map, mapAssetFamilies] = await Promise.all([
  read('tech-catalog.json'), read('project-catalog.json'), read('policy-catalog.json'), read('map-asset-manifest.json'), read('map-asset-family-manifest.json'),
]);

assert(techs.length === 1000, `expected 1000 technologies, got ${techs.length}`);
assert(projects.length === 1000, `expected 1000 projects, got ${projects.length}`);
assert(policies.length === 60, `expected 60 policy versions, got ${policies.length}`);
assert(map.length === 1000, `expected 1000 map rows, got ${map.length}`);

const ids = new Set(techs.map(({ id }) => id));
const projectIds = new Set(projects.map(({ id }) => id));
assert(ids.size === techs.length, 'duplicate technology ids');
assert(new Set(projects.map(({ id }) => id)).size === projects.length, 'duplicate project ids');
assert(techs.filter(({ class: cls }) => cls === 'breakthrough').length === 50, 'breakthrough count must be 50');
assert(techs.filter(({ class: cls }) => cls === 'branch').length === 750, 'branch count must be 750');
assert(techs.filter(({ class: cls }) => cls === 'refinement').length === 200, 'refinement count must be 200');

const domains = new Set(techs.map(({ domain }) => domain));
assert(domains.size === 10, `expected 10 domains, got ${domains.size}`);
for (const domain of domains) assert(techs.filter((node) => node.domain === domain).length === 100, `${domain} must contain 100 technologies`);
for (const tech of techs) {
  assert(tech.prerequisites.every((id) => ids.has(id)), `${tech.id} has a missing prerequisite`);
  assert((tech.engineeringPrerequisites ?? []).every((id) => projectIds.has(id)), `${tech.id} has a missing engineering prerequisite`);
  assert(tech.capability && tech.unlocks && tech.consequence && tech.playerCopyKey, `${tech.id} is missing a required content field`);
  assert(tech.runtime?.time?.workDays > 0 && tech.runtime.time.milestones?.at(-1) === 100 && tech.runtime.staffing?.researchers > 0 && tech.runtime.result?.capability, `${tech.id} lacks runtime time, staffing, or result`);
}

// 科技与工程组成同一张能力图：后续科技可以要求一项已投用工程，工程也会要求科技。
const reachable = new Set();
const reachableProjects = new Set();
let changed = true;
while (changed) {
  changed = false;
  for (const node of techs) {
    if (!reachable.has(node.id) && node.prerequisites.every((id) => reachable.has(id)) && (node.engineeringPrerequisites ?? []).every((id) => reachableProjects.has(id))) {
      reachable.add(node.id);
      changed = true;
    }
  }
  for (const project of projects) {
    if (!reachableProjects.has(project.id) && project.prerequisites.every((id) => reachable.has(id))) {
      reachableProjects.add(project.id);
      changed = true;
    }
  }
}
assert(reachable.size === techs.length, `technology graph contains ${techs.length - reachable.size} unreachable nodes`);
assert(reachableProjects.size === projects.length, `capability graph contains ${projects.length - reachableProjects.size} unreachable projects`);

for (const project of projects) {
  assert(project.location && project.entity && project.builder && project.beneficiary, `${project.id} lacks physical project identity`);
  assert(project.prerequisites.every((id) => ids.has(id)), `${project.id} has missing tech prerequisite`);
  assert(project.construction?.phase && project.construction?.facilityState, `${project.id} lacks construction state`);
  assert(project.map?.class && project.effects?.statement && project.consequence, `${project.id} lacks map/effect/consequence`);
  assert(project.runtime?.time?.workDays > 0 && project.runtime.time.milestones?.at(-1) === 100 && project.runtime.staffing?.builders > 0 && project.runtime.demand?.constructionSupply > 0 && project.runtime.result?.facilityState && project.runtime.result?.mapClass, `${project.id} lacks runtime time, staffing, demand, or result`);
}
const ratio = (predicate) => projects.filter(predicate).length / projects.length;
assert(ratio((p) => p.location.startsWith('跨区')) >= 0.30, 'cross-region project ratio below 30%');
assert(ratio((p) => ['service', 'safety', 'training', 'monitor', 'mitigation', 'oversight'].includes(p.kind)) >= 0.20, 'public/ecology project ratio below 20%');
assert(ratio((p) => p.strategic) >= 0.15, 'military/diplomatic project ratio below 15%');

const policyFamilies = new Map();
for (const policy of policies) {
  assert(policy.prerequisites.length && policy.durationDays > 0 && policy.target && policy.benefit && policy.cost && policy.endResult, `${policy.id} lacks policy fields`);
  assert(policy.prerequisites.every((id) => ids.has(id) || projectIds.has(id)), `${policy.id} is not attached to an existing technology or project`);
  assert(policy.runtime?.time?.durationDays === policy.durationDays && policy.runtime.time.milestones?.at(-1) === 100 && policy.runtime.staffing?.administrators > 0 && policy.runtime.demand?.coordinationLoad > 0 && policy.runtime.result?.cooldownDays > 0, `${policy.id} lacks runtime time, staffing, demand, or result`);
  policyFamilies.set(policy.familyId, [...(policyFamilies.get(policy.familyId) ?? []), policy.version]);
}
assert(policyFamilies.size === 20, `expected 20 policy families, got ${policyFamilies.size}`);
for (const [family, versions] of policyFamilies) assert(new Set(versions).size === 3, `${family} lacks early/capable/institutional versions`);

assert(new Set(map.map((entry) => entry.projectId)).size === projects.length, 'map manifest has duplicate or missing project rows');
assert(mapAssetFamilies.length === 40, `expected 40 reusable landmark asset families, got ${mapAssetFamilies.length}`);
assert(mapAssetFamilies.every((family) => family.imageCount === 8 && family.appliesToProjectCount === 5), 'landmark asset family reuse specification is inconsistent');
console.log(JSON.stringify({
  ok: true,
  technologyCount: techs.length,
  projectCount: projects.length,
  policyFamilyCount: policyFamilies.size,
  reachableTechnologyCount: reachable.size,
  reachableProjectCount: reachableProjects.size,
  mapClasses: Object.fromEntries(['cityComposite', 'ordinaryNode', 'landmark'].map((key) => [key, map.filter((entry) => entry.mapClass === key).length])),
  reusableLandmarkAssetFamilies: mapAssetFamilies.length,
  reusableLandmarkImageCount: mapAssetFamilies.reduce((sum, family) => sum + family.imageCount, 0),
}, null, 2));
