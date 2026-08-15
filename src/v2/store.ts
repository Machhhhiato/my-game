import { create } from 'zustand';
import type {
  CampaignSaveV2, DirectionId, MapLayerId, PlayerCommandState,
  PolicyId, ProjectId, ResourceId, SecurityPostureId,
} from './types';
import { initV2, saveGameV2, hasRetiredV1Save, backupRetiredV1Save } from './save';
import { PROJECTS } from './data';

export type PanelId = 'nation' | 'plan' | 'direction' | 'project' | 'policy' | 'research' | 'report';

const PERIOD_SECONDS = 45;
const PERIODS_PER_YEAR = 6;

export function periodLabel(elapsed: number): { year: number; period: number } {
  const total = Math.floor(elapsed / PERIOD_SECONDS);
  return {
    year: 1 + Math.floor(total / PERIODS_PER_YEAR),
    period: 1 + (total % PERIODS_PER_YEAR),
  };
}

interface V2Store {
  state: CampaignSaveV2;
  version: number;
  // 瞬态 UI（不入存档）
  panel: PanelId | null;
  resourceLedger: ResourceId | null;
  selectedNodeId: string | null;
  observerOpen: boolean;
  logCollapsed: boolean;
  logHistoryOpen: boolean;
  confirmSummaryOpen: boolean;
  retirementNotice: boolean;
  pending: PlayerCommandState;
  staged: boolean;
  focusNodeId: string | null;
  focusSeq: number;
  // 浮窗锚定（相对 .v2-map / .v2-app，由 PlanetCanvas/TopToolbar 计算）
  selectedAnchor: { x: number; y: number; visible: boolean } | null;
  ledgerAnchor: { left: number; top: number } | null;
  mapSize: { w: number; h: number };
  // actions
  refresh(): void;
  setPanel(p: PanelId | null): void;
  openResource(id: ResourceId | null, anchor?: { left: number; top: number }): void;
  selectNode(id: string | null): void;
  setSelectedAnchor(a: { x: number; y: number; visible: boolean } | null): void;
  setMapSize(w: number, h: number): void;
  requestFocus(id: string): void;
  toggleObserver(): void;
  setLogCollapsed(b: boolean): void;
  setLogHistory(b: boolean): void;
  setConfirmSummary(b: boolean): void;
  dismissRetirement(): void;
  setLayer(id: MapLayerId): void;
  toggleLayer(id: MapLayerId): void;
  setActiveLayers(ids: MapLayerId[]): void;
  setSpeed(v: 0 | 1 | 2 | 4): void;
  stageCommand(patch: Partial<PlayerCommandState>): void;
  resetStaging(): void;
  confirmPeriod(): void;
}

const init = initV2();

export const useV2 = create<V2Store>((set, get) => ({
  state: init.state,
  version: 0,
  panel: null,
  resourceLedger: null,
  selectedNodeId: null,
  observerOpen: false,
  logCollapsed: false,
  logHistoryOpen: false,
  confirmSummaryOpen: false,
  retirementNotice: hasRetiredV1Save() && !init.state.retiredNoticeShown,
  pending: { ...init.state.player },
  staged: false,
  focusNodeId: null,
  focusSeq: 0,
  selectedAnchor: null,
  ledgerAnchor: null,
  mapSize: { w: 0, h: 0 },

  refresh: () => set(s => ({ state: { ...s.state }, version: s.version + 1 })),

  setPanel: (p) => set({ panel: p }),
  openResource: (id, anchor) => set({ resourceLedger: id, panel: null, ledgerAnchor: id ? (anchor ?? null) : null }),
  selectNode: (id) => set(s => ({ selectedNodeId: id, selectedAnchor: id ? s.selectedAnchor : null })),
  setSelectedAnchor: (a) => set({ selectedAnchor: a }),
  setMapSize: (w, h) => set({ mapSize: { w, h } }),
  requestFocus: (id) => set(s => ({ focusNodeId: id, focusSeq: s.focusSeq + 1, selectedNodeId: id })),
  toggleObserver: () => set(s => ({ observerOpen: !s.observerOpen })),
  setLogCollapsed: (b) => set({ logCollapsed: b }),
  setLogHistory: (b) => set({ logHistoryOpen: b }),
  setConfirmSummary: (b) => set({ confirmSummaryOpen: b }),

  dismissRetirement: () => {
    backupRetiredV1Save();
    const s = get().state;
    s.retiredNoticeShown = true;
    saveGameV2(s);
    set({ retirementNotice: false });
  },

  setLayer: (id) => {
    const s = get().state;
    s.activeLayers = [id];
    saveGameV2(s);
    set({ state: { ...s } });
  },

  toggleLayer: (id) => {
    const s = get().state;
    const cur = s.activeLayers;
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    // 至少保留一个图层
    if (next.length === 0) return;
    s.activeLayers = next;
    saveGameV2(s);
    set({ state: { ...s } });
  },

  setActiveLayers: (ids) => {
    const s = get().state;
    s.activeLayers = ids.length > 0 ? [...ids] : ['political'];
    saveGameV2(s);
    set({ state: { ...s } });
  },

  setSpeed: (v) => {
    const s = get().state;
    s.clock.speed = v;
    saveGameV2(s);
    set({ state: { ...s } });
  },

  stageCommand: (patch) => {
    set(s => ({
      pending: { ...s.pending, ...patch },
      staged: true,
    }));
  },

  resetStaging: () => set(s => ({ pending: { ...s.state.player }, staged: false })),

  confirmPeriod: () => {
    const s = get().state;
    const p = get().pending;
    s.player = { ...p };
    const proj = PROJECTS[p.flagshipProjectId ?? 'water_life'];
    s.log = [
      ...s.log,
      {
        id: s.log.length + 1,
        period: `第 ${s.clock.period} 期`,
        place: '统筹与账目',
        summary: `本期命令已确认：优先「${proj.name}」；挤占 ${proj.cost}；主要风险 ${proj.risk}。`,
        severity: 'info' as const,
        nodeId: 'valley_outpost',
      },
    ].slice(-40);
    saveGameV2(s);
    set({ state: { ...s }, confirmSummaryOpen: false, staged: false, pending: { ...s.player } });
  },
}));

// ===== 极简时钟循环（仅推进时间显示，不做资源结算） =====
let last = performance.now();
let acc = 0;
let saveCounter = 0;

export function startV2Loop(): void {
  setInterval(() => {
    const now = performance.now();
    const dt = Math.min(100, now - last);
    last = now;
    const s = useV2.getState().state;
    if (s.clock.speed > 0) {
      acc += (dt / 1000) * s.clock.speed;
      const whole = Math.floor(acc);
      if (whole >= 1) {
        acc -= whole;
        s.clock.elapsed += whole;
        const pl = periodLabel(s.clock.elapsed);
        s.clock.year = pl.year;
        s.clock.period = pl.period;
        saveCounter++;
        if (saveCounter >= 15) { saveCounter = 0; saveGameV2(s); }
        useV2.getState().refresh();
      }
    }
  }, 100);
}
