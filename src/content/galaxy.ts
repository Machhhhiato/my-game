import type { GalaxyState, StarSystem } from '../core/types';

const NAMES = [
  '天启', '曙光', '苍蓝', '赤渊', '凛风', '星坠',
  '琉璃', '玄铁', '白鸦', '青鸾', '雷鸣', '雾海',
  '扶摇', '长庚', '荧惑', '望舒',
];

function mulberry(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 生成银河: 随机撒点 + 最小生成树保证连通 + 额外航道 */
export function generateGalaxy(seed: number): GalaxyState {
  const rnd = mulberry(seed);
  const n = 12;
  const pts: { x: number; y: number }[] = [];
  // 撒点(带最小间距)
  let guard = 0;
  while (pts.length < n && guard++ < 1000) {
    const x = 60 + rnd() * 880;
    const y = 60 + rnd() * 680;
    if (pts.every(p => Math.hypot(p.x - x, p.y - y) > 110)) pts.push({ x, y });
  }
  while (pts.length < n) pts.push({ x: rnd() * 1000, y: rnd() * 800 });

  // Prim 最小生成树
  const sys: StarSystem[] = pts.map((p, i) => ({
    id: `sys${i}`, name: NAMES[i % NAMES.length], x: p.x, y: p.y, links: [], owned: false,
  }));
  const inTree = new Set([0]);
  const edges: [number, number][] = [];
  while (inTree.size < n) {
    let best: [number, number] | null = null;
    let bestD = Infinity;
    for (const a of inTree) {
      for (let b = 0; b < n; b++) {
        if (inTree.has(b)) continue;
        const d = Math.hypot(sys[a].x - sys[b].x, sys[a].y - sys[b].y);
        if (d < bestD) { bestD = d; best = [a, b]; }
      }
    }
    if (!best) break;
    edges.push(best);
    inTree.add(best[1]);
  }
  // 额外航道(每点约 30% 概率连一个较近的非相邻点)
  for (let a = 0; a < n; a++) {
    if (rnd() < 0.4) {
      let bestB = -1, bestD = Infinity;
      for (let b = 0; b < n; b++) {
        if (b === a) continue;
        if (edges.some(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a))) continue;
        const d = Math.hypot(sys[a].x - sys[b].x, sys[a].y - sys[b].y);
        if (d < 260 && d < bestD) { bestD = d; bestB = b; }
      }
      if (bestB >= 0) edges.push([a, bestB]);
    }
  }
  for (const [a, b] of edges) {
    sys[a].links.push(sys[b].id);
    sys[b].links.push(sys[a].id);
  }
  // 家园系统
  sys[0].owned = true;
  return { systems: sys, homeId: sys[0].id, crisis: { active: false, strength: 0, won: false } };
}
