import { create } from 'zustand';
import type {
  CampaignSaveV3, DirectionId, MapLayerId, PlayerCommandState,
  PolicyId, ProjectId, ResourceId, SecurityPostureId,
} from './types';
import { initV3, saveGameV3, hasRetiredV1Save, backupRetiredV1Save } from './save';
import { settlePlanPeriod } from './simulation';

export type PanelId = 'nation' | 'plan' | 'direction' | 'project' | 'policy' | 'research' | 'report';

interface V2Store {
  state: CampaignSaveV3;
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

const init = initV3();

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
    saveGameV3(s);
    set({ retirementNotice: false });
  },

  setLayer: (id) => {
    const s = get().state;
    s.activeLayers = [id];
    saveGameV3(s);
    set({ state: { ...s } });
  },

  toggleLayer: (id) => {
    const s = get().state;
    const cur = s.activeLayers;
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    // 至少保留一个图层
    if (next.length === 0) return;
    s.activeLayers = next;
    saveGameV3(s);
    set({ state: { ...s } });
  },

  setActiveLayers: (ids) => {
    const s = get().state;
    s.activeLayers = ids.length > 0 ? [...ids] : ['political'];
    saveGameV3(s);
    set({ state: { ...s } });
  },

  setSpeed: (v) => {
    const s = get().state;
    s.clock.speed = v;
    saveGameV3(s);
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
    const result = settlePlanPeriod(s, p);
    saveGameV3(result.newState);
    set({
      state: result.newState,
      confirmSummaryOpen: false,
      staged: false,
      pending: { ...result.newState.player },
      panel: 'report',
    });
  },
}));

// ===== 速度按钮仅保存外观/存储值；P1-S02 日历只随结算前进 =====
export function startV2Loop(): void {
  // 不推进 year/period/elapsed，避免速度按钮造成未结算的日历跳期。
}
