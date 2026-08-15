/**
 * R1B 纸面平衡审计：独立于游戏实现，用内容表的第一版口径验证 180 日路线。
 * 这不是运行时逻辑，不能被 UI 或存档引用。
 */
type Metric = 'livelihood' | 'industry' | 'energy' | 'research' | 'administration' | 'logistics' | 'military' | 'stability' | 'ecology';
type Focus = 'survival' | 'balanced' | 'industry' | 'science' | 'military';
type Route = 'default' | 'science' | 'industry' | 'military';

const IDS: Metric[] = ['livelihood', 'industry', 'energy', 'research', 'administration', 'logistics', 'military', 'stability', 'ecology'];
const initial: Record<Metric, number> = { livelihood: 48, industry: 32, energy: 52, research: 12, administration: 20, logistics: 28, military: 11, stability: 54, ecology: 58 };
const base: Record<Metric, number> = { livelihood: -0.10, industry: -0.04, energy: -0.02, research: 0, administration: -0.01, logistics: -0.02, military: -0.01, stability: -0.03, ecology: -0.05 };
const focusEffect: Record<Focus, Partial<Record<Metric, number>>> = {
  survival: { livelihood: 0.12, logistics: 0.04 },
  balanced: { livelihood: 0.05, administration: 0.06, stability: 0.06 },
  industry: { industry: 0.12, logistics: 0.08, ecology: -0.04, livelihood: -0.05 },
  science: { research: 0.12, administration: 0.06, energy: -0.04 },
  military: { military: 0.12, logistics: 0.05, stability: -0.06 },
};
const projectCost = { water: 62, greenhouse: 68, workshop: 58, tower: 54 } as const;
const researchCost = { survey: 22, archive: 28, membrane: 34, field: 32, maintenance: 36, shortwave: 34, health: 38, transit: 42 } as const;
type Project = keyof typeof projectCost;
type Research = keyof typeof researchCost;

interface Snapshot { day: number; values: Record<Metric, number>; completedProjects: Project[]; completedResearch: Research[]; warnings: string[] }

function clamp(n: number) { return Math.max(0, Math.min(100, n)); }
function projectMultiplier(focus: Focus) { return focus === 'industry' ? 1.25 : focus === 'science' ? 0.84 : focus === 'military' ? 0.95 : 1; }
function researchMultiplier(focus: Focus) { return focus === 'science' ? 1.35 : focus === 'survival' || focus === 'military' ? 0.82 : focus === 'industry' ? 0.86 : 1; }
function focusFor(route: Route, day: number): Focus {
  if (route === 'default') return day < 90 ? 'balanced' : 'survival';
  if (route === 'science') return day < 120 ? 'science' : 'balanced';
  if (route === 'industry') return day < 120 ? 'industry' : 'balanced';
  return day < 120 ? 'military' : 'balanced';
}
function nextResearch(route: Route, done: Set<Research>, projects: Set<Project>, projectProgress: number): Research | null {
  const orders: Record<Route, Research[]> = {
    default: ['survey', 'field', 'membrane', 'health', 'archive'],
    science: ['survey', 'archive', 'membrane', 'field', 'health', 'shortwave'],
    industry: ['survey', 'field', 'maintenance', 'membrane'],
    military: ['survey', 'archive', 'shortwave', 'maintenance'],
  };
  return orders[route].find(id => {
    if (done.has(id)) return false;
    if (id === 'maintenance') return projects.has('workshop') || projectProgress >= projectCost.workshop * 0.5;
    if (id === 'shortwave') return done.has('archive') && (projects.has('tower') || projectProgress >= projectCost.tower * 0.5);
    if (id === 'health') return done.has('membrane') && done.has('field');
    return true;
  }) ?? null;
}
function nextProject(route: Route, doneResearch: Set<Research>, doneProjects: Set<Project>): Project | null {
  const orders: Record<Route, Project[]> = {
    default: ['water', 'greenhouse', 'workshop', 'tower'],
    science: ['tower', 'water', 'greenhouse', 'workshop'],
    industry: ['workshop', 'water', 'greenhouse', 'tower'],
    military: ['tower', 'water', 'workshop', 'greenhouse'],
  };
  return orders[route].find(id => {
    if (doneProjects.has(id)) return false;
    if ((id === 'water' || id === 'workshop') && !doneResearch.has('survey')) return false;
    if (id === 'greenhouse' && !doneResearch.has('field')) return false;
    if (id === 'tower' && !doneResearch.has('archive')) return false;
    return true;
  }) ?? null;
}

function run(route: Route): Snapshot {
  const v = { ...initial };
  const doneR = new Set<Research>(); const doneP = new Set<Project>(); const warnings: string[] = [];
  let activeR: Research | null = 'survey'; let researchWork = 0;
  let activeP: Project | null = null; let projectWork = 0;
  let huntUntil = 0;
  for (let day = 1; day <= 180; day++) {
    const focus = focusFor(route, day);
    for (const id of IDS) v[id] = clamp(v[id] + base[id] + (focusEffect[focus][id] ?? 0));

    // 已完成设施/科技的持续效果
    if (doneP.has('water')) { v.livelihood = clamp(v.livelihood + 0.24); v.logistics = clamp(v.logistics + 0.05); }
    if (doneP.has('greenhouse')) { v.livelihood = clamp(v.livelihood + 0.16); v.ecology = clamp(v.ecology + 0.16); }
    if (doneP.has('workshop')) { v.industry = clamp(v.industry + 0.22); v.administration = clamp(v.administration + 0.04); }
    if (doneP.has('tower')) { v.administration = clamp(v.administration + 0.18); v.logistics = clamp(v.logistics + 0.16); v.military = clamp(v.military + 0.05); }
    if (doneR.has('survey')) { v.logistics = clamp(v.logistics + 0.03); v.research = clamp(v.research + 0.03); }
    if (doneR.has('archive')) { v.administration = clamp(v.administration + 0.04); v.research = clamp(v.research + 0.06); }
    if (doneR.has('membrane')) v.livelihood = clamp(v.livelihood + 0.06);
    if (doneR.has('field')) { v.ecology = clamp(v.ecology + 0.07); v.research = clamp(v.research + 0.02); }
    if (doneR.has('maintenance')) { v.industry = clamp(v.industry + 0.08); v.administration = clamp(v.administration + 0.04); }
    if (doneR.has('shortwave')) { v.logistics = clamp(v.logistics + 0.08); v.military = clamp(v.military + 0.04); }
    if (doneR.has('health')) { v.livelihood = clamp(v.livelihood + 0.05); v.stability = clamp(v.stability + 0.08); }
    if (day === 32 && doneR.has('survey')) huntUntil = 46;
    if (day <= huntUntil) { v.livelihood = clamp(v.livelihood + 0.16); researchWork *= 0.85; projectWork *= 0.85; }

    // 设施的半程收益
    if (activeP === 'water' && projectWork >= projectCost.water * 0.5) v.livelihood = clamp(v.livelihood + 0.06);
    if (activeP === 'greenhouse' && projectWork >= projectCost.greenhouse * 0.5) v.livelihood = clamp(v.livelihood + 0.04);
    if (activeP === 'workshop' && projectWork >= projectCost.workshop * 0.5) v.industry = clamp(v.industry + 0.06);
    if (activeP === 'tower' && projectWork >= projectCost.tower * 0.5) v.logistics = clamp(v.logistics + 0.04);

    if (activeR) {
      researchWork += (1 + v.research * 0.02 + v.administration * 0.01) * researchMultiplier(focus);
      if (researchWork >= researchCost[activeR]) { doneR.add(activeR); activeR = nextResearch(route, doneR, doneP, projectWork); researchWork = 0; }
    }
    if (!activeP) activeP = nextProject(route, doneR, doneP);
    if (activeP) {
      projectWork += (0.55 + v.industry * 0.02 + v.logistics * 0.01) * projectMultiplier(focus);
      if (projectWork >= projectCost[activeP]) { doneP.add(activeP); activeP = null; projectWork = 0; }
    }

    // 可复现的四个现实冲击；设施/研究完成后对应损失会被压低。
    if (day === 45 && !doneP.has('water')) v.livelihood = clamp(v.livelihood - (doneR.has('membrane') ? 0.8 : 2));
    if (day === 70 && !doneP.has('greenhouse')) { v.ecology = clamp(v.ecology - (doneR.has('field') ? 1.2 : 3)); v.livelihood = clamp(v.livelihood - 1); }
    if (day === 95 && (activeP === 'workshop' || doneP.has('workshop'))) { v.industry = clamp(v.industry - (doneR.has('maintenance') ? 0.4 : 1.2)); v.stability = clamp(v.stability - 0.8); }
    if (day === 120 && !doneP.has('tower')) { v.logistics = clamp(v.logistics - (doneR.has('shortwave') ? 0.6 : 2)); v.military = clamp(v.military - 0.8); }
    if (IDS.some(id => v[id] === 0)) warnings.push(`第 ${day} 日出现指标归零`);
  }
  return { day: 180, values: v, completedProjects: [...doneP], completedResearch: [...doneR], warnings };
}

for (const route of ['default', 'science', 'industry', 'military'] as Route[]) {
  const r = run(route);
  console.log(`\n== ${route} ==`);
  console.log(`工程：${r.completedProjects.join('、') || '无'}；科研：${r.completedResearch.join('、') || '无'}`);
  console.log(IDS.map(id => `${id}=${r.values[id].toFixed(1)}`).join(' | '));
  console.log(r.warnings.length ? `警告：${r.warnings.join('；')}` : '警告：无指标归零');
}
