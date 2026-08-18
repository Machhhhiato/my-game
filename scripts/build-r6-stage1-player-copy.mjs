import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const readJson = (path) => readFile(resolve(root, path), 'utf8').then(JSON.parse);
const input = 'content/r5/stage-1';
const output = 'content/r6/stage-1';

const [techs, projects, policies] = await Promise.all([
  readJson(`${input}/tech-catalog.json`),
  readJson(`${input}/project-catalog.json`),
  readJson(`${input}/policy-catalog.json`),
]);

const domainCopy = {
  water: { group: '生存与资源', subject: '安全用水、土地恢复和聚居地供水' },
  food: { group: '生存与资源', subject: '食物、种源和抗灾农业' },
  industry: { group: '工业、能源与基建', subject: '材料回收、制造与长期维修' },
  energy: { group: '工业、能源与基建', subject: '发电、储能和公共能源服务' },
  logistics: { group: '交通、通信与后勤', subject: '道路、仓储、运输和统一调度' },
  security: { group: '军事与安全', subject: '预警、护运、救援和统一防卫' },
  admin: { group: '社会与治理', subject: '登记、预算、申诉和统一服务' },
  social: { group: '社会与治理', subject: '诊疗、居住、照护和人口安置' },
  science: { group: '科学、教育与外拓', subject: '档案、训练、实验和检验' },
  frontier: { group: '科学、教育与外拓', subject: '环境修复、接触和共同勘探' },
};

const policyTheme = {
  livelihood: '供给、照护和公共服务',
  production: '施工安全、维修、能源和劳动安排',
  mobility_security: '道路、护运、巡查和应急防卫',
  ecology_frontier: '土地恢复、污染处置和环境监测',
  governance: '登记、预算、申诉和公共监督',
};

const techById = new Map(techs.map((item) => [item.id, item]));
const projectById = new Map(projects.map((item) => [item.id, item]));
const cleanTitle = (title) => title.replaceAll('：', '·');
const projectTitle = (id) => projectById.get(id)?.name ?? '相关设施';
const techTitle = (id) => cleanTitle(techById.get(id)?.name ?? '相关研究');

function requirementText(id) {
  return techById.has(id) ? `先掌握「${techTitle(id)}」` : `让「${projectTitle(id)}」投入运行`;
}

function techSummary(item) {
  const domain = domainCopy[item.domain];
  if (item.class === 'breakthrough') return `建立${item.name}所需的共同方法，使${domain.subject}从临时应对进入可持续建设。`;
  if (item.class === 'branch' && item.route === 'production') return `把${domain.subject}转化为更稳定的供给与施工能力，为下一处地点复制做准备。`;
  if (item.class === 'branch' && item.route === 'resilience') return `识别会让${domain.subject}失效的风险，并把故障处理变成可执行的规程。`;
  if (item.class === 'branch') return `把少数人的经验变成可记录、可交接、可在第二处地点使用的公共做法。`;
  return `让既有做法在质量、维护、规模或公共监督上达到可以长期运行的标准。`;
}

function unlockText(item) {
  if (item.class === 'breakthrough') return `开放「${item.unlocks.projectCluster}」工程簇，并为下一层重大突破提供基础。`;
  if (item.class === 'branch' && item.unlocks.proofFor) return `形成下一层能力所需的${item.route === 'production' ? '供给' : item.route === 'resilience' ? '安全' : '复制'}证明。`;
  if (item.class === 'refinement') return `允许对应设施进入更可靠、更大规模或更公开的运行阶段。`;
  return `为「${item.unlocks.projectCluster}」补充一条可实施路线。`;
}

function buildTechCopy(item) {
  const domain = domainCopy[item.domain];
  const requirements = [...item.prerequisites, ...(item.engineeringPrerequisites ?? [])].map(requirementText);
  return {
    key: item.playerCopyKey,
    type: 'technology',
    category: domain.group,
    title: cleanTitle(item.name),
    summary: techSummary(item),
    requirements,
    unlocks: unlockText(item),
    limitation: item.consequence,
  };
}

function buildProjectCopy(item) {
  return {
    key: item.playerCopyKey,
    type: 'project',
    category: domainCopy[item.domain].group,
    title: item.name,
    summary: `在${item.location}建设${item.entity}，由${item.builder}负责施工。`,
    location: item.location,
    construction: `当前目标：${item.construction.phase}；建成后进入${item.construction.facilityState}。`,
    requirements: item.prerequisites.map(requirementText),
    outcome: item.effects.statement,
    limitation: item.consequence,
    mapResult: item.map.class === 'cityComposite' ? '城市外观和公共服务会随设施投入逐步改变。' : item.map.class === 'ordinaryNode' ? '地图上会出现名称、规模标记以及相关线路或环境痕迹。' : '地图上会出现可见地标，并显示从开工到投用的建设状态。',
  };
}

function buildPolicyCopy(item) {
  const place = item.version === 'early' ? '当前聚居地' : item.version === 'capable' ? '聚居地与外拓点' : '适用地区';
  const subject = policyTheme[item.theme] ?? '相关公共服务';
  const summary = item.version === 'early'
    ? `在${place}开展「${item.name}」，把有限人手和物资优先投向${subject}。`
    : item.version === 'capable'
      ? `在${place}推行「${item.name}」，把${subject}交给固定设施和岗位持续安排。`
      : `在${place}执行「${item.name}」，统一${subject}的服务标准、记录方式和例外申报。`;
  return {
    key: item.playerCopyKey,
    type: 'policy',
    category: '当前政策',
    title: item.name,
    summary,
    duration: `执行 ${item.durationDays} 日，到期后${item.endResult}。`,
    requirements: item.prerequisites.map(requirementText),
    limitation: item.cost,
    progression: item.upgradesTo ? '条件成熟后将由同一政策脉络的下一版本接替。' : '这是本阶段该政策脉络的长期版本，仍须定期评估。',
  };
}

const playerCopy = {
  version: 1,
  locale: 'zh-CN',
  stage: 'stage-1',
  generatedFrom: 'R5 frozen content catalog',
  technology: techs.map(buildTechCopy),
  project: projects.map(buildProjectCopy),
  policy: policies.map(buildPolicyCopy),
};

const forbidden = /LDU|NDU|PDU|SDU|requirement\.|copyKey|状态机|权重|槽位|债务|[a-z][0-9](?:[a-z][0-9])?/i;
const allEntries = [...playerCopy.technology, ...playerCopy.project, ...playerCopy.policy];
for (const entry of allEntries) {
  for (const [field, value] of Object.entries(entry)) {
    if (field === 'key') continue;
    if (typeof value === 'string' && forbidden.test(value)) throw new Error(`玩家文案含禁用词：${entry.key}.${field}`);
    if (Array.isArray(value)) for (const line of value) if (forbidden.test(line)) throw new Error(`玩家文案含禁用词：${entry.key}.${field}`);
  }
  if (!entry.title || !entry.summary || !entry.limitation) throw new Error(`玩家文案字段不完整：${entry.key}`);
}
if (playerCopy.technology.length !== 1000 || playerCopy.project.length !== 1000 || playerCopy.policy.length !== 60) throw new Error('R6 文案数量与 R5 内容目录不一致');

await mkdir(resolve(root, output), { recursive: true });
await Promise.all([
  writeFile(resolve(root, output, 'player-copy.json'), `${JSON.stringify(playerCopy, null, 2)}\n`),
  writeFile(resolve(root, output, 'summary.json'), `${JSON.stringify({
    technologyCopyCount: playerCopy.technology.length,
    projectCopyCount: playerCopy.project.length,
    policyCopyCount: playerCopy.policy.length,
    forbiddenTermCheck: 'passed',
  }, null, 2)}\n`),
]);
console.log(`R6 player copy built: ${playerCopy.technology.length} technologies, ${playerCopy.project.length} projects, ${playerCopy.policy.length} policy versions.`);
