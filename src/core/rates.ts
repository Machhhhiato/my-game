import type { GameState, ResourceId, Resources } from './types';
import { BUILDINGS } from '../content/buildings';
import { techEffects, calcPower } from './tick';
import { solarRates } from './solar';

/** 每秒产出速率估算(显示用, 与 tick 逻辑保持一致) */
export function productionRates(s: GameState): Resources {
  const te = techEffects(s);
  const power = calcPower(s);
  const blight = s.modifiers.some(m => m.id === 'blight');
  const rates: Resources = { wood: 0, steel: 0, components: 0, food: 0, herbal: 0, rp: 0, alloy: 0, fuel: 0 };
  for (const b of s.buildings) {
    const def = BUILDINGS[b.type];
    if (!b.workerId) continue;
    const c = s.colonists.find(x => x.id === b.workerId);
    if (!c || c.state !== 'work' || c.hp <= 0) continue;
    if (def.produce) {
      let rate = def.produce.rate;
      let sf = 0.55 + c.skills[def.produce.skill] * 0.09;
      if (c.traits.includes('industrious')) sf *= 1.15;
      if (c.traits.includes('lazy')) sf *= 0.8;
      if (b.type === 'farm' && te.farm2) rate *= 1.5;
      if ((b.type === 'woodcutter' || b.type === 'mine') && te.advmat) rate *= 1.4;
      if (b.type === 'workshop' && te.machining) rate *= 1.5;
      if (b.type === 'farm' && blight) rate *= 0.5;
      if (def.power) rate *= power;
      rates[def.produce.resource] += rate * sf;
    }
    if (def.researchRate) {
      let rate = def.researchRate * (0.5 + c.skills.research * 0.1);
      if (c.traits.includes('smart')) rate *= 1.3;
      if (def.power) rate *= power;
      rates.rp += rate;
    }
  }
  // 第二幕轨道生产
  if (s.era === 'solar') {
    const sr = solarRates(s);
    rates.alloy = sr.alloy;
    rates.fuel = sr.fuel;
  }
  return rates;
}

/** 食物净消耗(每秒) */
export function foodConsumption(s: GameState): number {
  const te = techEffects(s);
  let sum = 0;
  for (const c of s.colonists) {
    if (c.hp <= 0) continue;
    const amount = 1 * (te.fridge ? 0.85 : 1) * (c.traits.includes('glutton') ? 1.3 : 1) * (s.space.done.includes('lifeorbit') ? 0.95 : 1);
    sum += amount / 230; // 每餐 ~230 秒
  }
  return sum;
}

/** 净速率(食物扣除消耗) */
export function netRates(s: GameState): Resources {
  const r = productionRates(s);
  r.food -= foodConsumption(s);
  return r;
}

export function resDisplay(s: GameState, id: ResourceId): { amount: number; rate: number } {
  const net = netRates(s);
  return { amount: s.resources[id], rate: net[id] };
}
