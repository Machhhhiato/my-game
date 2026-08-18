import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const readJson = (path) => readFile(resolve(root, path), 'utf8').then(JSON.parse);
const r5 = 'content/r5/stage-1';
const r6 = 'content/r6/stage-1/player-copy.json';
const outDir = 'src/v2/content';

const [techs, projects, policies, copy] = await Promise.all([
  readJson(`${r5}/tech-catalog.json`),
  readJson(`${r5}/project-catalog.json`),
  readJson(`${r5}/policy-catalog.json`),
  readJson(r6),
]);

const domainCategory = {
  water: ['survival', '生存与资源'],
  food: ['survival', '生存与资源'],
  industry: ['industry', '工业、能源与基建'],
  energy: ['industry', '工业、能源与基建'],
  logistics: ['logistics', '交通、通信与后勤'],
  security: ['security', '军事与安全'],
  admin: ['society', '社会与治理'],
  social: ['society', '社会与治理'],
  science: ['science', '科学、教育与外拓'],
  frontier: ['science', '科学、教育与外拓'],
};

const copyByKey = new Map([
  ...copy.technology,
  ...copy.policy,
].map((entry) => [entry.key, entry]));
const techById = new Map(techs.map((entry) => [entry.id, entry]));
const projectById = new Map(projects.map((entry) => [entry.id, entry]));
const plain = (value) => JSON.stringify(value, null, 2);

const breakthroughs = techs
  .filter((entry) => entry.class === 'breakthrough')
  .map((entry) => {
    const player = copyByKey.get(entry.playerCopyKey);
    const [categoryId, categoryName] = domainCategory[entry.domain];
    return {
      id: entry.id,
      categoryId,
      categoryName,
      domain: entry.domain,
      tier: entry.tier,
      title: player.title,
      summary: player.summary,
      requirements: player.requirements,
      unlocks: player.unlocks,
      limitation: player.limitation,
      nextId: entry.unlocks.nextTrunk ?? null,
      branchCount: techs.filter((node) => node.class === 'branch' && new RegExp(`^${entry.id}[abc]`).test(node.id)).length,
      refinementCount: techs.filter((node) => node.class === 'refinement' && new RegExp(`^${entry.id}r`).test(node.id)).length,
      engineeringRequirements: (entry.engineeringPrerequisites ?? []).map((id) => projectById.get(id)?.name ?? '相关设施能力'),
    };
  });

const policyFamilies = [...new Set(policies.map((entry) => entry.familyId))].map((familyId) => {
  const entries = policies.filter((entry) => entry.familyId === familyId);
  const versions = entries.map((entry) => {
    const player = copyByKey.get(entry.playerCopyKey);
    return {
      version: entry.version,
      title: player.title,
      summary: player.summary,
      requirements: player.requirements,
      duration: player.duration,
      limitation: player.limitation,
    };
  });
  return { id: familyId, theme: entries[0].theme, versions };
});

const source = `// 由 scripts/build-r7-discovery-index.mjs 生成；不要手改。\n\n`
  + `export type DiscoveryCategoryId = 'survival' | 'industry' | 'logistics' | 'security' | 'society' | 'science';\n\n`
  + `export interface MajorDiscovery {\n  id: string;\n  categoryId: DiscoveryCategoryId;\n  categoryName: string;\n  domain: string;\n  tier: number;\n  title: string;\n  summary: string;\n  requirements: string[];\n  unlocks: string;\n  limitation: string;\n  nextId: string | null;\n  branchCount: number;\n  refinementCount: number;\n  engineeringRequirements: string[];\n}\n\n`
  + `export interface PolicyLineage {\n  id: string;\n  theme: string;\n  versions: Array<{ version: string; title: string; summary: string; requirements: string[]; duration: string; limitation: string }>;\n}\n\n`
  + `export const DISCOVERY_CATEGORIES: Array<{ id: DiscoveryCategoryId; name: string }> = ${plain([
    { id: 'survival', name: '生存与资源' },
    { id: 'industry', name: '工业、能源与基建' },
    { id: 'logistics', name: '交通、通信与后勤' },
    { id: 'security', name: '军事与安全' },
    { id: 'society', name: '社会与治理' },
    { id: 'science', name: '科学、教育与外拓' },
  ])};\n\n`
  + `export const STAGE_1_MAJOR_DISCOVERIES: MajorDiscovery[] = ${plain(breakthroughs)};\n\n`
  + `export const STAGE_1_POLICY_LINEAGES: PolicyLineage[] = ${plain(policyFamilies)};\n\n`
  + `export function majorDiscoveriesFor(categoryId: DiscoveryCategoryId): MajorDiscovery[] {\n  return STAGE_1_MAJOR_DISCOVERIES.filter((entry) => entry.categoryId === categoryId);\n}\n`;

if (breakthroughs.length !== 50) throw new Error(`应生成 50 项主干突破，得到 ${breakthroughs.length}`);
if (breakthroughs.some((entry) => entry.branchCount !== 15 || entry.refinementCount !== 4)) throw new Error('主干的路线或能力分级数量不正确');
if (policyFamilies.length !== 20) throw new Error(`应生成 20 条政策脉络，得到 ${policyFamilies.length}`);
await mkdir(resolve(root, outDir), { recursive: true });
await writeFile(resolve(root, outDir, 'stage1Discovery.ts'), source);
console.log(`R7 discovery index built: ${breakthroughs.length} major discoveries, ${policyFamilies.length} policy lineages.`);
