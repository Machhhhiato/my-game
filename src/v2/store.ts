import { create } from 'zustand';
import type { CampaignSaveV6, FocusId, MapLayerId, ResourceId, RunMode, V6PolicyId, V6ProjectId, V6TechId } from './types';
import { initV6, saveGameV6, hasRetiredV1Save, backupRetiredV1Save, backupCurrentV6Save } from './save';
import { newCampaignV6 } from './state';
import { advanceOneDayV6, setNationalPolicyV6, setSlotModeV6, startPolicyV6, startProjectV6, startResearchV6 } from './simulationV6';

export type PanelId = 'nation' | 'focus' | 'policy' | 'project' | 'research' | 'report';

interface V2Store {
  state: CampaignSaveV6;
  version: number;
  panel: PanelId | null;
  resourceLedger: ResourceId | null;
  selectedNodeId: string | null;
  observerOpen: boolean;
  logCollapsed: boolean;
  logHistoryOpen: boolean;
  retirementNotice: boolean;
  focusNodeId: string | null;
  focusSeq: number;
  selectedAnchor: { x: number; y: number; visible: boolean } | null;
  ledgerAnchor: { left: number; top: number } | null;
  mapSize: { w: number; h: number };
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
  dismissRetirement(): void;
  setLayer(id: MapLayerId): void;
  toggleLayer(id: MapLayerId): void;
  setActiveLayers(ids: MapLayerId[]): void;
  setSpeed(v: 0 | 1 | 2 | 4): void;
  setFocus(id: FocusId): void;
  setProject(id: V6ProjectId): void;
  setResearch(id: V6TechId): void;
  setPolicy(id: V6PolicyId): void;
  setSlotMode(slot: 'project' | 'research', mode: RunMode): void;
  restartCampaign(): void;
}

const init = initV6();

export const useV2 = create<V2Store>((set, get) => ({
  state: init.state,
  version: 0,
  panel: null,
  resourceLedger: null,
  selectedNodeId: null,
  observerOpen: false,
  logCollapsed: false,
  logHistoryOpen: false,
  retirementNotice: hasRetiredV1Save() && !init.state.retiredNoticeShown,
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

  dismissRetirement: () => {
    backupRetiredV1Save();
    const s = get().state;
    s.retiredNoticeShown = true;
    saveGameV6(s);
    set({ retirementNotice: false });
  },

  setLayer: (id) => {
    const s = get().state;
    s.activeLayers = [id];
    saveGameV6(s);
    set({ state: { ...s } });
  },

  toggleLayer: (id) => {
    const s = get().state;
    const cur = s.activeLayers;
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    if (next.length === 0) return;
    s.activeLayers = next;
    saveGameV6(s);
    set({ state: { ...s } });
  },

  setActiveLayers: (ids) => {
    const s = get().state;
    s.activeLayers = ids.length > 0 ? [...ids] : ['political'];
    saveGameV6(s);
    set({ state: { ...s } });
  },

  setSpeed: (v) => {
    const s = get().state;
    s.clock.speed = v;
    saveGameV6(s);
    set({ state: { ...s } });
  },

  setFocus: (id) => {
    const s = get().state;
    const next = setNationalPolicyV6(s, id);
    saveGameV6(next);
    set({ state: next });
  },

  setProject: (id) => {
    const s = get().state;
    const next = startProjectV6(s, id);
    saveGameV6(next);
    set({ state: next });
  },

  setResearch: (id) => {
    const s = get().state;
    const next = startResearchV6(s, id);
    saveGameV6(next);
    set({ state: next });
  },

  setPolicy: (id) => {
    const next = startPolicyV6(get().state, id);
    saveGameV6(next);
    set({ state: next });
  },

  setSlotMode: (slot, mode) => {
    const next = setSlotModeV6(get().state, slot, mode);
    saveGameV6(next);
    set({ state: next });
  },

  restartCampaign: () => {
    backupCurrentV6Save();
    const fresh = newCampaignV6();
    saveGameV6(fresh);
    set((s) => ({
      state: fresh,
      version: s.version + 1,
      panel: null,
      resourceLedger: null,
      selectedNodeId: null,
      selectedAnchor: null,
      focusNodeId: null,
      logHistoryOpen: false,
    }));
  },
}));

// ===== 持续时钟：速度驱动游戏日推进（1×=0.5s/日、2×=0.25s/日、4×=0.125s/日）；仅手动暂停 =====
let lastT = performance.now();
let acc = 0;
let saveCounter = 0;

export function startV2Loop(): void {
  setInterval(() => {
    const now = performance.now();
    const dt = Math.min(200, now - lastT) / 1000;
    lastT = now;
    const st = useV2.getState();
    const s = st.state;
    if (s.clock.speed === 0) return;

    acc += dt * 2 * s.clock.speed;
    let days = Math.floor(acc);
    days = Math.min(days, 4);
    if (days < 1) return;
    acc -= days;

    let cur = s;
    for (let i = 0; i < days; i++) cur = advanceOneDayV6(cur);
    saveCounter += days;
    if (saveCounter >= 7) {
      saveCounter = 0;
      saveGameV6(cur);
    }
    useV2.setState({ state: cur });
  }, 50);
}
