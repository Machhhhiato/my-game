import type { CampaignSaveV2, CampaignSaveV3, CampaignSaveV4, CampaignSaveV5, CampaignSaveV6, LivingState, MetricId, MetricValue } from './types';
import { newCampaignV2, newCampaignV3, newCampaignV4, newCampaignV5, newCampaignV6 } from './state';
import { DAILY_LIVING_NEED } from './terms';
import { METRIC_DEFS, METRIC_ORDER } from './nation';
import { alignMapNodesToWorld, generateWorldBlueprint, validateWorldBlueprint, withSurfaceFeatures, withWorldSkeleton, WORLD_GENERATOR_VERSION } from './worldBlueprint';

const KEY_V2 = 'cts-save-v2';
const KEY_V3 = 'cts-save-v3';
const KEY_V4 = 'cts-save-v4';
const KEY_V5 = 'cts-save-v5';
const KEY_V6 = 'cts-save-v6';
const KEY_V6_RESTART_BACKUP_PREFIX = 'cts-save-v6-before-restart-';
/** 旧 v1 原型存档键 */
const KEY_V1 = 'cts-save-v1';
const KEY_V1_BACKUP_PREFIX = 'cts-save-v1-retired-';
const KEY_V2_BACKUP_PREFIX = 'cts-save-v2-pre-settlement-';
const KEY_V2_BACKUP_RUNTIME = 'cts-save-v2-pre-runtime-';
const KEY_V3_BACKUP_RUNTIME = 'cts-save-v3-pre-runtime-';
const KEY_V4_BACKUP = 'cts-save-v4-pre-continuous-';

export function saveGameV2(s: CampaignSaveV2): void {
  s.lastSavedAt = Date.now();
  try {
    localStorage.setItem(KEY_V2, JSON.stringify(s));
  } catch {
    /* 存储失败静默处理 */
  }
}

export function loadSaveV2(): CampaignSaveV2 | null {
  try {
    const raw = localStorage.getItem(KEY_V2);
    if (!raw) return null;
    const s = JSON.parse(raw) as CampaignSaveV2;
    if (!s || s.version !== 2) return null;
    // 字段兜底（未来版本增量安全）
    if (!s.nation) return null;
    // 旧档迁移：mapLayer 单值 → activeLayers 数组
    if (!Array.isArray(s.activeLayers) || s.activeLayers.length === 0) {
      const legacy = (s as unknown as { mapLayer?: string }).mapLayer;
      s.activeLayers = legacy === 'population' || legacy === 'ecology' ? [legacy] : ['political'];
    }
    return s;
  } catch {
    return null;
  }
}

export function clearSaveV2(): void {
  try { localStorage.removeItem(KEY_V2); } catch { /* noop */ }
}

/** 是否存在旧 v1 原型存档（需展示退役提示） */
export function hasRetiredV1Save(): boolean {
  try {
    return localStorage.getItem(KEY_V1) !== null;
  } catch {
    return false;
  }
}

/** 将旧 v1 存档原样备份到独立键，绝不覆盖 v2 新档、绝不做数值转换 */
export function backupRetiredV1Save(): void {
  try {
    const raw = localStorage.getItem(KEY_V1);
    if (raw === null) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    localStorage.setItem(KEY_V1_BACKUP_PREFIX + stamp, raw);
    // 保留原键不做删除，避免静默破坏；仅在 UI 层面不再提供旧模式入口。
  } catch {
    /* noop */
  }
}

/** 载入或新建 v2 存档 */
export function initV2(): { state: CampaignSaveV2; fresh: boolean } {
  const loaded = loadSaveV2();
  if (loaded) return { state: loaded, fresh: false };
  const s = newCampaignV2();
  saveGameV2(s);
  return { state: s, fresh: true };
}

// ============ v3 存档（P1-S02 结算闭环） ============

export function saveGameV3(s: CampaignSaveV3): void {
  s.lastSavedAt = Date.now();
  try {
    localStorage.setItem(KEY_V3, JSON.stringify(s));
  } catch {
    /* 存储失败静默处理 */
  }
}

function migrateV2toV3(v2: CampaignSaveV2): CampaignSaveV3 {
  return {
    ...v2,
    version: 3,
    projectProgress: { water_life: 0, seed_protein: 0, workshop_calib: 0, archive_beacon: 0 },
    reports: [],
    settlementCount: 0,
    eventFlags: {},
  };
}

/**
 * 载入 v3：优先读 v3 键；若不存在而 v2 存在，先把 v2 原文备份，再迁移为 v3 写入新键。
 * 不改变或删除 cts-save-v2；失败返回 null（由调用方新建 v3）。
 */
export function loadSaveV3(): CampaignSaveV3 | null {
  try {
    const raw3 = localStorage.getItem(KEY_V3);
    if (raw3) {
      const s = JSON.parse(raw3) as CampaignSaveV3;
      if (s && s.version === 3 && s.nation) return s;
    }
    const raw2 = localStorage.getItem(KEY_V2);
    if (raw2) {
      const v2 = JSON.parse(raw2) as CampaignSaveV2;
      if (v2 && v2.version === 2 && v2.nation) {
        try {
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          localStorage.setItem(KEY_V2_BACKUP_PREFIX + stamp, raw2);
        } catch { /* 备份失败不阻断迁移 */ }
        const v3 = migrateV2toV3(v2);
        saveGameV3(v3);
        return v3;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSaveV3(): void {
  try { localStorage.removeItem(KEY_V3); } catch { /* noop */ }
}

/** 载入或新建 v3 存档 */
export function initV3(): { state: CampaignSaveV3; fresh: boolean } {
  const loaded = loadSaveV3();
  if (loaded) return { state: loaded, fresh: false };
  const s = newCampaignV3();
  saveGameV3(s);
  return { state: s, fresh: true };
}

// ============ v4 存档（P1-S03A 真实时间） ============

function livingFromNation(s: CampaignSaveV3): LivingState {
  const water = s.nation.resources.safeWater;
  const food = s.nation.resources.calories;
  return {
    waterDays: Math.round(water.stock / DAILY_LIVING_NEED.water),
    foodDays: Math.round(food.stock / DAILY_LIVING_NEED.food),
    shelteredBeds: 31,
    repairBacklog: s.nation.debts.maintenance.value,
  };
}

function migrateV3toV4(v3: CampaignSaveV3): CampaignSaveV4 {
  return {
    ...v3,
    version: 4,
    runtime: {
      activeCommand: null,
      dayInPeriod: 0,
      dayRemainder: 0,
      weeklyStart: null,
      periodStart: null,
      pausedReason: 'awaiting_plan',
      startedPeriod: null,
      budget: null,
      periodEvent: null,
    },
    living: livingFromNation(v3),
  };
}

export function saveGameV4(s: CampaignSaveV4): void {
  s.lastSavedAt = Date.now();
  try {
    localStorage.setItem(KEY_V4, JSON.stringify(s));
  } catch {
    /* 存储失败静默处理 */
  }
}

function backupRaw(prefix: string, raw: string): void {
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    localStorage.setItem(prefix + stamp, raw);
  } catch {
    /* 备份失败不阻断迁移 */
  }
}

/**
 * 载入 v4：优先 v4 → 缺省迁移 v3 → 再缺省迁移 v2。
 * v3/v2 迁移前均原文备份到 cts-save-v<old>-pre-runtime-<ISO>；绝不删除旧键。
 * 失败返回 null（由调用方新建 v4）。
 */
export function loadSaveV4(): CampaignSaveV4 | null {
  try {
    const raw4 = localStorage.getItem(KEY_V4);
    if (raw4) {
      const s = JSON.parse(raw4) as CampaignSaveV4;
      if (s && s.version === 4 && s.nation && s.runtime && s.living) return s;
    }
    const raw3 = localStorage.getItem(KEY_V3);
    if (raw3) {
      const v3 = JSON.parse(raw3) as CampaignSaveV3;
      if (v3 && v3.version === 3 && v3.nation) {
        backupRaw(KEY_V3_BACKUP_RUNTIME, raw3);
        const v4 = migrateV3toV4(v3);
        saveGameV4(v4);
        return v4;
      }
    }
    const raw2 = localStorage.getItem(KEY_V2);
    if (raw2) {
      const v2 = JSON.parse(raw2) as CampaignSaveV2;
      if (v2 && v2.version === 2 && v2.nation) {
        backupRaw(KEY_V2_BACKUP_RUNTIME, raw2);
        // v2 → v3 → v4
        const v3 = migrateV2toV3(v2);
        const v4 = migrateV3toV4(v3);
        saveGameV4(v4);
        return v4;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSaveV4(): void {
  try { localStorage.removeItem(KEY_V4); } catch { /* noop */ }
}

/** 载入或新建 v4 存档 */
export function initV4(): { state: CampaignSaveV4; fresh: boolean } {
  const loaded = loadSaveV4();
  if (loaded) {
    // 重载时若 activeCommand 仍非空（上次运行未到期末/事件），恢复后强制暂停
    if (loaded.runtime.activeCommand !== null && loaded.runtime.pausedReason !== 'awaiting_plan') {
      loaded.runtime.pausedReason = 'manual';
      loaded.clock.speed = 0;
    }
    return { state: loaded, fresh: false };
  }
  const s = newCampaignV4();
  saveGameV4(s);
  return { state: s, fresh: true };
}

// ============ v5 存档（P1-S03C 持续运行国家指标） ============

function initialMetricsV5(): Record<MetricId, MetricValue> {
  const m = {} as Record<MetricId, MetricValue>;
  for (const id of METRIC_ORDER) {
    m[id] = {
      value: METRIC_DEFS[id].initial,
      dailyRate: 0,
      sources: [...METRIC_DEFS[id].sources],
      bottleneck: METRIC_DEFS[id].bottleneck,
    };
  }
  return m;
}

/** v4 → v5：映射到规格第 2 节初始值；不保留资源账/债务为活跃结算状态（写入 migrationNote） */
function migrateV4toV5(v4: CampaignSaveV4): CampaignSaveV5 {
  return {
    ...v4,
    version: 5,
    day: 1,
    clock: { ...v4.clock, speed: 0 },
    focus: { id: 'balanced', transitionDaysRemaining: 0, transitionEfficiency: 1 },
    project: { id: null, progress: 0, handoverDays: 0, milestones: { p25: false, p50: false, p75: false, p100: false } },
    research: { id: null, progress: 0, handoverDays: 0, milestones: { p25: false, p50: false, p75: false, p100: false } },
    metrics: initialMetricsV5(),
    population: 31,
    events: [],
    migrationNote: JSON.stringify({ resources: v4.nation.resources, capacities: v4.nation.capacities, debts: v4.nation.debts }),
  };
}

export function saveGameV5(s: CampaignSaveV5): void {
  s.lastSavedAt = Date.now();
  try {
    localStorage.setItem(KEY_V5, JSON.stringify(s));
  } catch {
    /* 存储失败静默处理 */
  }
}

/**
 * 载入 v5：优先 v5 → 缺省迁移 v4 → v3 → v2。
 * 每次迁移前原文备份（沿用既有规则）；绝不删除旧键。
 */
export function loadSaveV5(): CampaignSaveV5 | null {
  try {
    const raw5 = localStorage.getItem(KEY_V5);
    if (raw5) {
      const s = JSON.parse(raw5) as CampaignSaveV5;
      if (s && s.version === 5 && s.metrics && s.focus) return s;
    }
    const raw4 = localStorage.getItem(KEY_V4);
    if (raw4) {
      const v4 = JSON.parse(raw4) as CampaignSaveV4;
      if (v4 && v4.version === 4 && v4.nation) {
        backupRaw(KEY_V4_BACKUP, raw4);
        const v5 = migrateV4toV5(v4);
        saveGameV5(v5);
        return v5;
      }
    }
    const raw3 = localStorage.getItem(KEY_V3);
    if (raw3) {
      const v3 = JSON.parse(raw3) as CampaignSaveV3;
      if (v3 && v3.version === 3 && v3.nation) {
        backupRaw(KEY_V3_BACKUP_RUNTIME, raw3);
        const v4 = migrateV3toV4(v3);
        const v5 = migrateV4toV5(v4);
        saveGameV5(v5);
        return v5;
      }
    }
    const raw2 = localStorage.getItem(KEY_V2);
    if (raw2) {
      const v2 = JSON.parse(raw2) as CampaignSaveV2;
      if (v2 && v2.version === 2 && v2.nation) {
        backupRaw(KEY_V2_BACKUP_RUNTIME, raw2);
        const v3 = migrateV2toV3(v2);
        const v4 = migrateV3toV4(v3);
        const v5 = migrateV4toV5(v4);
        saveGameV5(v5);
        return v5;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSaveV5(): void {
  try { localStorage.removeItem(KEY_V5); } catch { /* noop */ }
}

/** 载入或新建 v5 存档 */
export function initV5(): { state: CampaignSaveV5; fresh: boolean } {
  const loaded = loadSaveV5();
  if (loaded) return { state: loaded, fresh: false };
  const s = newCampaignV5();
  saveGameV5(s);
  return { state: s, fresh: true };
}

// ============ v6 存档（前置、设施、政策和自动推进） ============

export function saveGameV6(s: CampaignSaveV6): void {
  s.lastSavedAt = Date.now();
  try { localStorage.setItem(KEY_V6, JSON.stringify(s)); } catch { /* noop */ }
}

function isLegacyCampaign(raw: string, version: number): boolean {
  try {
    const value = JSON.parse(raw) as { version?: number };
    return value?.version === version;
  } catch { return false; }
}

/**
 * v6 不能把旧“进度条”猜测为真实科技或设施：发现旧档仅备份原文，并从元年建立新状态。
 */
export function loadSaveV6(): CampaignSaveV6 | null {
  try {
    const raw6 = localStorage.getItem(KEY_V6);
    if (raw6) {
      const save = JSON.parse(raw6) as CampaignSaveV6;
      if (save?.version === 6 && save.metrics && save.facilities && save.supply) {
        // 运行时字段只影响日志节流；老存档缺失时补为 false，不重算进度或世界事实。
        if (save.projectSlot && typeof save.projectSlot.waitingForUnlock !== 'boolean') save.projectSlot.waitingForUnlock = false;
        if (save.researchSlot && typeof save.researchSlot.waitingForUnlock !== 'boolean') save.researchSlot.waitingForUnlock = false;
        // 当前仍是 Demo：世界生成器升级后，以同一 seed 直接重建自然世界与测试节点。
        // 保留的仅是当前这局已发生的工程增量，不能当作正式存档兼容承诺。
        if (save.world && save.world.generatorVersion !== WORLD_GENERATOR_VERSION) {
          backupRaw(`${KEY_V6}-pre-earthlike-world-`, raw6);
          const rebuilt = generateWorldBlueprint(save.seed);
          rebuilt.terrainChanges = save.world.terrainChanges ?? [];
          save.world = rebuilt;
          save.nodes = alignMapNodesToWorld(save.nodes, save.world);
          saveGameV6(save);
        }
        // R9 补充稳定球面格绑定。旧档只增补坐标协议，绝不重掷种子或改动已发生的工程地表变化。
        if (save.world && !save.world.skeleton) {
          backupRaw(`${KEY_V6}-pre-world-skeleton-`, raw6);
          save.world = withWorldSkeleton(save.world);
          save.nodes = alignMapNodesToWorld(save.nodes, save.world);
          saveGameV6(save);
        }
        // R8-D 补充冻结的自然地表占地。旧档只增补此字段，绝不重掷种子或改动已发生的工程地表变化。
        if (save.world && (!Array.isArray(save.world.surfaceFeatures) || save.world.surfaceFeatures.length === 0)) {
          backupRaw(`${KEY_V6}-pre-world-surface-`, raw6);
          save.world = withSurfaceFeatures(save.world);
          save.nodes = alignMapNodesToWorld(save.nodes, save.world);
          saveGameV6(save);
        }
        // R4.1 是确定性补充字段：先原文备份，再从既有种子重建蓝图；不动任何游戏进度。
        try {
          validateWorldBlueprint(save.world);
        } catch {
          backupRaw(`${KEY_V6}-pre-world-blueprint-`, raw6);
          save.world = generateWorldBlueprint(save.seed);
          save.nodes = alignMapNodesToWorld(save.nodes, save.world);
          saveGameV6(save);
        }
        return save;
      }
    }
    const legacy = [
      [KEY_V5, 5], [KEY_V4, 4], [KEY_V3, 3], [KEY_V2, 2],
    ] as const;
    for (const [key, version] of legacy) {
      const raw = localStorage.getItem(key);
      if (!raw || !isLegacyCampaign(raw, version)) continue;
      backupRaw(`${key}-pre-v6-`, raw);
      const fresh = newCampaignV6(`migrated_from_v${version}`);
      saveGameV6(fresh);
      return fresh;
    }
    return null;
  } catch { return null; }
}

export function clearSaveV6(): void {
  try { localStorage.removeItem(KEY_V6); } catch { /* noop */ }
}

/** 新开战役前保存当前 v6 原文；重开从不静默丢弃玩家已有的世界与进度。 */
export function backupCurrentV6Save(): void {
  try {
    const raw = localStorage.getItem(KEY_V6);
    if (raw) backupRaw(KEY_V6_RESTART_BACKUP_PREFIX, raw);
  } catch { /* noop */ }
}

export function initV6(): { state: CampaignSaveV6; fresh: boolean } {
  const loaded = loadSaveV6();
  if (loaded) return { state: loaded, fresh: false };
  const fresh = newCampaignV6();
  saveGameV6(fresh);
  return { state: fresh, fresh: true };
}
