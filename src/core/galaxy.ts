import type { GameState } from './types';
import { pushLog } from './state';
import { fleetPower } from './solar';

/** 可占领星系上限(社会科技) */
export function systemCap(s: GameState): number {
  const d = s.research.done;
  let c = 1;
  if (d.includes('governance')) c += 2;
  if (d.includes('sector')) c += 3;
  if (d.includes('empire')) c += 5;
  return c;
}

/** 占领星系成本(外交科技 -20%) */
export function claimCost(s: GameState): number {
  return s.research.done.includes('diplomacy') ? 400 : 500;
}

/** 自动占领邻接星系 */
function autoClaim(s: GameState): void {
  const owned = s.galaxy.systems.filter(x => x.owned);
  if (owned.length >= systemCap(s)) return;
  const cost = claimCost(s);
  if (s.resources.alloy < cost) return;
  for (const sys of owned) {
    for (const linkId of sys.links) {
      const target = s.galaxy.systems.find(x => x.id === linkId);
      if (!target || target.owned) continue;
      s.resources.alloy -= cost;
      target.owned = true;
      pushLog(s, 'good', '🪐', '星系占领', `你的舰队沿着超空间航道抵达并占领了「${target.name}」。`);
      return;
    }
  }
}

/** 天灾危机推进 */
function crisisTick(s: GameState): void {
  if (s.galaxy.crisis.won) return;
  if (!s.galaxy.crisis.active) {
    const t = s.stats.crisisAt ?? Infinity;
    if (s.elapsed >= t) {
      s.galaxy.crisis.active = true;
      s.galaxy.crisis.strength = 2000; // 固定基础强度,战列舰+泰坦+物理线即可对抗
      pushLog(s, 'warn', '👾', '天灾降临',
        '银河边缘出现了一支古老的灾厄舰队——肃正协议。它们的目标:灭绝一切文明。');
    }
    return;
  }
  // 强度极缓慢增长(制造紧迫感,但玩家扩军到战列舰+泰坦即可超越)
  s.galaxy.crisis.strength += 0.02;
}

/** 第三幕每 tick 结算 */
export function galaxyTick(s: GameState, eff: number): void {
  if (s.era !== 'galaxy') return;
  const d = s.research.done;
  // 舰队造船(战列舰/泰坦/巨像)
  const fleet = s.solar.fleets[0];
  if (fleet) {
    const build = (cls: 'battleship' | 'titan' | 'colossus', want: number, cost: number, power: number, name: string) => {
      const count = fleet.ships.filter(sh => sh.cls === cls).length;
      if (count < want && s.resources.alloy >= cost) {
        s.resources.alloy -= cost;
        fleet.ships.push({ id: `sh${s.seq++}`, name: `${name} ${count + 1}号`, cls, power, hp: 100 });
        pushLog(s, 'good', '🚀', '舰队扩充', `${name} ${count + 1}号 服役(军力 ${power})。`);
      }
    };
    if (d.includes('battleship')) build('battleship', 3, 800, 150, '战列舰');
    if (d.includes('titan')) build('titan', 2, 2000, 400, '泰坦');
    if (d.includes('colossus')) build('colossus', 1, 6000, 1000, '巨像');
  }
  // 自动占领邻接星系
  if (s.elapsed % 30 === 0) autoClaim(s);
  // 天灾推进
  crisisTick(s);
}

/** 迎击天灾,返回错误信息或 null(胜利) */
export function fightCrisis(s: GameState): string | null {
  if (s.galaxy.crisis.won) return '天灾已被击败';
  if (!s.galaxy.crisis.active) return '天灾尚未降临';
  const fp = fleetPower(s);
  if (fp >= s.galaxy.crisis.strength) {
    s.galaxy.crisis.won = true;
    s.galaxy.crisis.active = false;
    pushLog(s, 'good', '🏆', '击败天灾',
      `决战在银河边缘打响,你的舰队(军力 ${fp})击溃了肃正协议(强度 ${Math.round(s.galaxy.crisis.strength)})。银河重归和平。`);
    return null;
  }
  return `舰队军力不足(需 ${Math.round(s.galaxy.crisis.strength)},当前 ${fp})`;
}
