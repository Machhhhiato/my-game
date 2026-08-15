import type { CampaignSaveV2, CampaignSaveV3 } from './types';
import { newCampaignV2, newCampaignV3 } from './state';

const KEY_V2 = 'cts-save-v2';
const KEY_V3 = 'cts-save-v3';
/** 旧 v1 原型存档键 */
const KEY_V1 = 'cts-save-v1';
const KEY_V1_BACKUP_PREFIX = 'cts-save-v1-retired-';
const KEY_V2_BACKUP_PREFIX = 'cts-save-v2-pre-settlement-';

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
