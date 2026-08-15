import type { BuildingTypeId, DirectionId, GameState, MissionId, ResourceId } from './core/types';
import { newGame, pushLog, MAP_W, MAP_H } from './core/state';
import { tickSecond, calcDefense, calcPower, releaseWorker } from './core/tick';
import { loadSave, saveGame, clearSave, applyOffline } from './core/save';
import { applyChoice } from './core/events-run';
import { launchMission, type LaunchResult } from './core/space';
import { canDepart, departMissing } from './content/spaceProgram';
import { fightCrisis } from './core/galaxy';
import { BUILDINGS } from './content/buildings';
import { TECH_MAP, techDone } from './content/techs';
import { DIRECTIONS } from './content/directions';

let state: GameState | null = null;

export function initEngine(): GameState {
  if (state) return state;
  state = loadSave() ?? newGame();
  applyOffline(state);
  saveGame(state);
  return state;
}

export function getState(): GameState {
  return initEngine();
}

function overlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

export const E = {
  get state(): GameState { return initEngine(); },

  tick(): void {
    const s = this.state;
    if (s.gameOver) return;
    tickSecond(s, 1);
  },

  setSpeed(v: 0 | 1 | 2 | 4): void {
    this.state.speed = v;
    saveGame(this.state);
  },

  /** 切换方向: 殖民者立即按新方向重新分配 */
  setDirection(id: DirectionId): void {
    const s = this.state;
    if (s.direction === id) return;
    s.direction = id;
    for (const b of s.buildings) b.workerId = null;
    for (const c of s.colonists) {
      if (c.state === 'work' && c.hp > 0) { c.state = 'idle'; c.job = null; }
      releaseWorker(s, c.id);
    }
    const def = DIRECTIONS[id];
    pushLog(s, 'info', def.icon, `方向切换:${def.name}`, def.desc);
    saveGame(s);
  },

  /** 锁定/解锁研究目标(可选干预) */
  setLockedTech(id: string | null): void {
    this.state.lockedTech = id;
    saveGame(this.state);
  },

  reset(): void {
    clearSave();
    state = newGame();
    saveGame(state);
  },

  /** 校验放置,返回错误信息或 null */
  canPlace(type: BuildingTypeId, x: number, y: number): string | null {
    const s = this.state;
    const def = BUILDINGS[type];
    if (def.tech && !techDone(s, def.tech)) return `需要先研究「${TECH_MAP[def.tech]?.name ?? def.tech}」`;
    if (x < 0 || y < 0 || x + def.w > MAP_W || y + def.h > MAP_H) return '超出地图边界';
    for (const b of s.buildings) {
      if (overlap({ x, y, w: def.w, h: def.h }, b)) return '与已有建筑重叠';
    }
    for (const [k, v] of Object.entries(def.cost)) {
      if (s.resources[k as keyof typeof s.resources] < (v ?? 0)) return '资源不足';
    }
    return null;
  },

  /** 返回错误信息,成功返回 null */
  placeBuilding(type: BuildingTypeId, x: number, y: number): string | null {
    const s = this.state;
    const err = this.canPlace(type, x, y);
    if (err) return err;
    const def = BUILDINGS[type];
    for (const [k, v] of Object.entries(def.cost)) {
      s.resources[k as keyof typeof s.resources] -= v ?? 0;
    }
    s.buildings.push({
      id: `b${s.seq++}_${Math.floor(Math.random() * 1e6)}`,
      type, x, y, w: def.w, h: def.h, hp: 100, workerId: null, builtAt: s.elapsed,
    });
    pushLog(s, 'info', def.icon, `建成 ${def.name}`, def.desc);
    saveGame(s);
    return null;
  },

  demolish(id: string): void {
    const s = this.state;
    const b = s.buildings.find(x => x.id === id);
    if (!b) return;
    const def = BUILDINGS[b.type];
    s.buildings = s.buildings.filter(x => x.id !== id);
    if (b.workerId) {
      const c = s.colonists.find(x => x.id === b.workerId);
      if (c) { c.state = 'idle'; c.job = null; c.target = null; }
    }
    // 返还 40% 材料
    for (const [k, v] of Object.entries(def.cost)) {
      s.resources[k as keyof typeof s.resources] += Math.floor((v ?? 0) * 0.4);
    }
    pushLog(s, 'info', '🧱', `拆除 ${def.name}`, '回收了部分材料。');
    saveGame(s);
  },

  answerChoice(index: number): void {
    applyChoice(this.state, index);
    saveGame(this.state);
  },

  /** 执行太空计划发射,返回结果码 */
  launchMission(id: MissionId): LaunchResult {
    const r = launchMission(this.state, id);
    saveGame(this.state);
    return r;
  },

  /** 满足三门槛后进入第二幕 */
  depart(): string | null {
    const s = this.state;
    if (!canDepart(s.space, s.world)) {
      const missing = departMissing(s.space, s.world);
      return `进入第二幕还缺:${missing.join('、')}`;
    }
    s.launched = true;
    s.era = 'solar';
    pushLog(s, 'good', '🌠', '启航!', '统一全球、登天工业化、科研船与工程船就绪——母星系的时代,开始了。');
    saveGame(s);
    return null;
  },

  /** 超空间跃迁,进入第三幕(银河时代) */
  jump(): string | null {
    const s = this.state;
    if (s.era !== 'solar') return '当前不是母星系时代';
    if (!techDone(s, 'hyperdrive')) return '需要先研究「超空间引擎」';
    const needAlloy = 5000, needFuel = 3000;
    if (s.resources.alloy < needAlloy || s.resources.fuel < needFuel) {
      return `跃迁需要 ${needAlloy} 合金与 ${needFuel} 燃料`;
    }
    s.resources.alloy -= needAlloy;
    s.resources.fuel -= needFuel;
    s.era = 'galaxy';
    s.stats.crisisAt = s.elapsed + 1800; // 30 分钟后天灾降临
    pushLog(s, 'good', '🌌', '跃迁!', '超空间引擎启动,舰队跃入了广袤的银河——第三幕开始了。');
    saveGame(s);
    return null;
  },

  /** 迎击天灾 */
  fightCrisis(): string | null {
    const r = fightCrisis(this.state);
    saveGame(this.state);
    return r;
  },

  /** 转生: 新纪元,保留声望与起始资源加成 */
  prestige(): void {
    const prestige = (this.state.stats.prestige ?? 0) + 1;
    clearSave();
    state = newGame();
    state.stats.prestige = prestige;
    for (const k of Object.keys(state.resources) as ResourceId[]) {
      if (k === 'rp' || k === 'alloy' || k === 'fuel') continue;
      state.resources[k] = Math.round(state.resources[k] * (1 + prestige * 0.5));
    }
    pushLog(state, 'good', '🌟', '新纪元', `第 ${prestige} 纪元开始,前人的智慧化作起始资源加成(+${prestige * 50}%)。`);
    saveGame(state);
  },

  continueAfterLaunch(): void {
    this.state.launched = false;
    saveGame(this.state);
  },

  continueAfterGameOver(): void {
    this.state.gameOver = false;
    this.reset();
  },

  dismissOffline(): void {
    this.state.offlineInfo = null;
  },

  /** 手动指定研究目标(仅可选中的) */
  setResearch(id: string): void {
    const s = this.state;
    if (techDone(s, id)) return;
    const tech = TECH_MAP[id];
    if (!tech || !tech.req.every(r => techDone(s, r))) return;
    s.research.current = id;
    s.research.progress = 0;
  },

  /** 导入存档 */
  replace(next: GameState): void {
    state = next;
    saveGame(state);
  },

  save(): void {
    saveGame(this.state);
  },

  snapshot(): GameState {
    return structuredClone(this.state);
  },

  getDefense(): number { return calcDefense(this.state); },
  getPowerEff(): number { return calcPower(this.state); },
};
