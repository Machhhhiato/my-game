import type { Building, GameState, LogEntry, LogKind } from './types';
import { makeColonist } from '../content/colonists';
import { BUILDINGS } from '../content/buildings';
import { generateSolar } from '../content/solar';
import { generateGalaxy } from '../content/galaxy';
import { generateWorld } from '../content/world';

export const MAP_W = 26;
export const MAP_H = 16;

let bSeq = 0;
function mkBuilding(type: Building['type'], x: number, y: number): Building {
  const def = BUILDINGS[type];
  return {
    id: `b${++bSeq}_${Math.floor(Math.random() * 1e6)}`,
    type, x, y, w: def.w, h: def.h,
    hp: 100, workerId: null,
    builtAt: 0,
  };
}

export function pushLog(s: GameState, kind: LogKind, icon: string, title: string, text: string): void {
  const entry: LogEntry = { id: s.seq++, t: s.elapsed, realT: Date.now(), kind, icon, title, text };
  s.log.push(entry);
  if (s.log.length > 300) s.log.splice(0, s.log.length - 300);
}

export function newGame(seed?: number): GameState {
  bSeq = 0;
  const s: GameState = {
    version: 1,
    seed: seed ?? (Math.random() * 2 ** 31) | 0,
    startedAt: Date.now(),
    elapsed: 0,
    lastTickReal: Date.now(),
    speed: 1,
    gameOver: false,
    launched: false,
    era: 'colony',
    direction: 'balanced',
    lockedTech: null,
    space: { done: [], reliability: 0, failures: 0, totalLaunches: 0, nextLaunchAt: 0 },
    solar: generateSolar(seed ?? (Math.random() * 2 ** 31) | 0),
    galaxy: generateGalaxy(seed ?? (Math.random() * 2 ** 31) | 0),
    world: generateWorld(seed ?? (Math.random() * 2 ** 31) | 0),
    resources: { wood: 150, steel: 30, components: 6, food: 180, herbal: 12, rp: 0, alloy: 0, fuel: 0 },
    colonists: [makeColonist(1), makeColonist(2), makeColonist(3)],
    buildings: [
      mkBuilding('shelter', 3, 5),
      mkBuilding('farm', 9, 5),
      mkBuilding('research', 15, 5),
    ],
    research: { current: null, progress: 0, done: [] },
    modifiers: [],
    log: [],
    pendingChoice: null,
    nextEventAt: 150,
    dayPhase: 0,
    seq: 1000,
    stats: { raids: 0, raidsWon: 0, foodEaten: 0, broke: 0 },
    offlineInfo: null,
  };
  pushLog(s, 'info', '🚀', '新的开始',
    '逃生舱坠毁在这颗陌生行星上。三名幸存者必须在这里活下去——然后,仰望星空。');
  pushLog(s, 'info', '📖', '提示',
    '殖民者会自己吃饭、睡觉、工作。你要做的是规划建筑、研究科技,等待火箭升空。');
  return s;
}
