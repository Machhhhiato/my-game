import type { GameState } from './types';
import { pushLog } from './state';

/** 第二幕生产速率(合金/燃料/轨道电力) */
export function solarRates(s: GameState): { alloy: number; fuel: number; power: number } {
  const d = s.research.done;
  let alloy = 0, fuel = 0, power = 0;

  // 采矿站产合金
  if (d.includes('asteroid')) {
    const mines = s.solar.stations.filter(st => st.kind === 'mine').length;
    let rate = 0.06 * mines;
    if (d.includes('alloy')) rate *= 1.5;
    if (d.includes('deepbelt')) rate *= 1.5;
    if (d.includes('orbitfactory')) rate *= 1.5;
    alloy = rate;
  }
  // 精炼站产燃料
  if (d.includes('gas')) {
    const refs = s.solar.stations.filter(st => st.kind === 'refinery').length;
    let rate = 0.05 * refs;
    if (d.includes('fuelref')) rate *= 1.5;
    fuel = rate;
  }
  // 第二幕全局生产加成
  let mult = 1;
  if (d.includes('logistics')) mult += 0.10;
  if (d.includes('hub')) mult += 0.15;
  if (d.includes('dronenet')) mult += 0.10;
  if (d.includes('factorychain')) mult += 0.20;
  if (d.includes('elevator')) mult += 0.20;
  if (d.includes('antimatter')) mult += 0.25;
  alloy *= mult;
  fuel *= mult;
  // 采矿站受损事件
  if (s.modifiers.some(m => m.id === 'minehalt')) alloy *= 0.5;

  // 轨道能源
  if (d.includes('solararray')) power += 4;
  if (d.includes('fission')) power += 8;
  if (d.includes('fusion')) power += 16;
  if (d.includes('antimatter')) power += 32;
  // 恒星耀斑事件
  if (s.modifiers.some(m => m.id === 'solarflare')) power = 0;

  return { alloy, fuel, power };
}

/** 舰队总军力 */
export function fleetPower(s: GameState): number {
  let p = 0;
  for (const f of s.solar.fleets) for (const sh of f.ships) p += sh.power;
  const d = s.research.done;
  let mult = 1;
  if (d.includes('fleetlogi')) mult += 0.20;
  if (d.includes('iondrive')) mult += 0.10;
  if (d.includes('plasma')) mult += 0.20;
  if (d.includes('shieldtech')) mult += 0.20;
  if (d.includes('antimatter_weapon')) mult += 0.30;
  return Math.round(p * mult);
}

/** 自治 A4: 自动扩张轨道设施 */
function autoExpand(s: GameState): void {
  const d = s.research.done;
  if (d.includes('asteroid')) {
    const mines = s.solar.stations.filter(st => st.kind === 'mine').length;
    const cap = 2 + (d.includes('moonbase') ? 1 : 0) + (d.includes('deepscan') ? 1 : 0);
    if (mines < cap && s.resources.steel >= 200 && s.resources.components >= 40) {
      s.resources.steel -= 200; s.resources.components -= 40;
      s.solar.stations.push({ id: `mine${s.seq++}`, kind: 'mine', name: `采矿站 ${mines + 1}`, planetId: 'p_belt', level: 1 });
      pushLog(s, 'info', '☄️', '自动扩张', 'AI 调度中枢在小行星带部署了新的采矿站。');
    }
  }
  if (d.includes('gas')) {
    const refs = s.solar.stations.filter(st => st.kind === 'refinery').length;
    const cap = 2;
    if (refs < cap && s.resources.steel >= 300 && s.resources.components >= 60) {
      s.resources.steel -= 300; s.resources.components -= 60;
      s.solar.stations.push({ id: `ref${s.seq++}`, kind: 'refinery', name: `精炼站 ${refs + 1}`, planetId: 'p_giant', level: 1 });
      pushLog(s, 'info', '⛽', '自动扩张', 'AI 调度中枢在气态巨行星部署了新的燃料精炼站。');
    }
  }
}

/** 第二幕每 tick 结算 */
export function solarTick(s: GameState, eff: number): void {
  if (s.era !== 'solar') return;
  const d = s.research.done;

  // 采矿站自动部署到上限(科技奖励,免材料)
  if (d.includes('asteroid')) {
    const cap = 1 + (d.includes('moonbase') ? 1 : 0) + (d.includes('deepscan') ? 1 : 0) + (d.includes('aihub') ? 1 : 0);
    const mines = s.solar.stations.filter(st => st.kind === 'mine').length;
    if (mines < cap) {
      s.solar.stations.push({ id: `mine${s.seq++}`, kind: 'mine', name: `采矿站 ${mines + 1}`, planetId: 'p_belt', level: 1 });
      pushLog(s, 'good', '☄️', '采矿站部署', '工程船在小行星带部署了新的采矿站。');
    }
  }
  // 精炼站自动部署到上限
  if (d.includes('gas')) {
    const cap = 1 + (d.includes('fuelref') ? 1 : 0) + (d.includes('aihub') ? 1 : 0);
    const refs = s.solar.stations.filter(st => st.kind === 'refinery').length;
    if (refs < cap) {
      s.solar.stations.push({ id: `ref${s.seq++}`, kind: 'refinery', name: `精炼站 ${refs + 1}`, planetId: 'p_giant', level: 1 });
      pushLog(s, 'good', '⛽', '精炼站部署', '工程船在气态巨行星部署了新的燃料精炼站。');
    }
  }
  // 舰队自动造船(消耗合金)
  const fleet = s.solar.fleets[0];
  if (fleet) {
    const build = (cls: 'corvette' | 'destroyer' | 'cruiser', want: number, cost: number, power: number, name: string) => {
      const count = fleet.ships.filter(sh => sh.cls === cls).length;
      if (count < want && s.resources.alloy >= cost) {
        s.resources.alloy -= cost;
        fleet.ships.push({ id: `sh${s.seq++}`, name: `${name} ${count + 1}号`, cls, power, hp: 100 });
        pushLog(s, 'good', '🚀', '舰队扩充', `${name} ${count + 1}号 下水服役(军力 ${power})。`);
      }
    };
    if (d.includes('corvette')) build('corvette', 3, 50, 10, '护卫舰');
    if (d.includes('destroyer')) build('destroyer', 2, 150, 25, '驱逐舰');
    if (d.includes('cruiser')) build('cruiser', 1, 400, 60, '巡洋舰');
  }

  // 产出结算
  const r = solarRates(s);
  s.resources.alloy += r.alloy * eff;
  s.resources.fuel += r.fuel * eff;
  // 行星公转
  for (const p of s.solar.planets) p.angle += p.orbitSpeed * eff;
  // AI 调度中枢: 自动扩张轨道设施
  if (s.research.done.includes('aihub')) autoExpand(s);
}
