import { create } from 'zustand';
import type { BuildingTypeId, Colonist, GameState } from '../core/types';
import { E, initEngine } from '../engine';

export type ViewId = 'colony' | 'ground' | 'research' | 'space' | 'log' | 'settings';

export interface Sel {
  kind: 'building' | 'colonist' | 'planet' | 'station' | 'fleet' | 'system' | 'settlement' | 'tile' | null;
  id: string | null;
}

interface GameUI {
  state: GameState;
  version: number;
  view: ViewId;
  sel: Sel;
  ghost: BuildingTypeId | null;
  showBuildMenu: boolean;
  toast: string | null;
  miniOpen: boolean;
  // actions
  setView: (v: ViewId) => void;
  select: (sel: Sel) => void;
  setGhost: (t: BuildingTypeId | null) => void;
  setShowBuildMenu: (b: boolean) => void;
  setToast: (t: string | null) => void;
  toggleMini: () => void;
  refresh: () => void;
}

export const useGame = create<GameUI>((set, get) => ({
  state: initEngine(),
  version: 0,
  view: 'colony',
  sel: { kind: null, id: null },
  ghost: null,
  showBuildMenu: false,
  toast: null,
  miniOpen: false,
  setView: (v) => set({ view: v }),
  select: (sel) => set({ sel }),
  setGhost: (t) => set({ ghost: t }),
  setShowBuildMenu: (b) => set({ showBuildMenu: b }),
  setToast: (t) => set({ toast: t }),
  toggleMini: () => set(s => ({ miniOpen: !s.miniOpen })),
  refresh: () => set(s => ({ state: E.snapshot(), version: s.version + 1 })),
}));

// ===== 游戏主循环: 每 100ms 结算一次, 每秒推送一次 UI 快照 =====
let acc = 0;
let last = performance.now();
let saveCounter = 0;
let accFrac = 0;

/** 当前 tick 内的插值进度 0..1(渲染平滑用) */
export function getTickFrac(): number {
  return accFrac;
}

export function startGameLoop(): void {
  setInterval(() => {
    const s = E.state;
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (s.speed > 0 && !s.gameOver) {
      acc += dt * s.speed;
      let ticked = false;
      while (acc >= 1000) {
        E.tick();
        acc -= 1000;
        ticked = true;
      }
      accFrac = Math.min(1, acc / 1000);
      if (ticked) {
        saveCounter += 1;
        if (saveCounter >= 15) { saveCounter = 0; E.save(); }
        useGame.getState().refresh();
      }
    }
  }, 100);
}

export function selectedColonist(s: GameState, sel: Sel): Colonist | null {
  if (sel.kind !== 'colonist' || !sel.id) return null;
  return s.colonists.find(c => c.id === sel.id) ?? null;
}
