import type { GameState, Resources, ResourceId } from './types';
import { tickSecond } from './tick';
import { pushLog } from './state';
import { fmtDur } from './util';
import { generateSolar } from '../content/solar';
import { generateGalaxy } from '../content/galaxy';
import { generateWorld } from '../content/world';

const KEY = 'cts-save-v1';

export function saveGame(s: GameState): void {
  s.lastTickReal = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // 存储失败(隐私模式等)静默处理
  }
}

export function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as GameState;
    if (!s || s.version !== 1) return null;
    // 旧存档字段兼容
    if (s.direction === undefined) s.direction = 'balanced';
    if (s.lockedTech === undefined) s.lockedTech = null;
    if (s.space === undefined) {
      s.space = { done: [], reliability: 0, failures: 0, totalLaunches: 0, nextLaunchAt: 0 };
    }
    if (s.era === undefined) s.era = 'colony';
    if (s.resources.alloy === undefined) s.resources.alloy = 0;
    if (s.resources.fuel === undefined) s.resources.fuel = 0;
    if (s.solar === undefined) s.solar = generateSolar(s.seed);
    if (s.galaxy === undefined) s.galaxy = generateGalaxy(s.seed);
    if (s.galaxy.crisis === undefined) s.galaxy.crisis = { active: false, strength: 0, won: false };
    if (s.world === undefined || s.world.h !== 80) s.world = generateWorld(s.seed);
    return s;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}

export function exportSave(s: GameState): void {
  const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `colony-to-stars-save-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importSave(json: string): GameState | null {
  try {
    const s = JSON.parse(json) as GameState;
    if (!s || s.version !== 1) return null;
    return s;
  } catch {
    return null;
  }
}

/** 离线追赶: 以 60% 效率模拟, 上限 8 小时 */
export function applyOffline(s: GameState): void {
  const now = Date.now();
  let secs = Math.floor((now - s.lastTickReal) / 1000);
  if (secs <= 5) { s.lastTickReal = now; return; }
  secs = Math.min(secs, 8 * 3600);

  const before: Resources = { ...s.resources };
  const eff = 0.6;
  for (let i = 0; i < secs; i++) {
    tickSecond(s, eff);
    if (s.gameOver) break;
  }
  const gained: Partial<Resources> = {};
  for (const k of Object.keys(s.resources) as ResourceId[]) {
    const g = s.resources[k] - before[k];
    if (g > 0.001) gained[k] = g;
  }
  s.offlineInfo = { seconds: secs, gained };
  s.lastTickReal = now;
  const lines = [
    `你离开了 ${fmtDur(secs)},殖民地以 60% 效率运转。`,
    `漫长的 ${fmtDur(secs)} 里,殖民者们独自面对着这颗星球。`,
    `时钟走过了 ${fmtDur(secs)},殖民地没有停下。`,
  ];
  pushLog(s, 'info', '⏳', '离线结算', lines[Math.floor(Math.random() * lines.length)]);
}
