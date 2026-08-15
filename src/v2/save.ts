import type { CampaignSaveV2 } from './types';
import { newCampaignV2 } from './state';

const KEY_V2 = 'cts-save-v2';
/** 旧 v1 原型存档键 */
const KEY_V1 = 'cts-save-v1';
const KEY_V1_BACKUP_PREFIX = 'cts-save-v1-retired-';

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
