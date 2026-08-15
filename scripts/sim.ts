/**
 * Headless 数值模拟: 模拟"活跃玩家"自动建造策略, 验证第一幕节奏。
 * 运行: npx tsx scripts/sim.ts
 */
import { newGame } from '../src/core/state';
import { tickSecond } from '../src/core/tick';
import { BUILDINGS, BUILD_ORDER } from '../src/content/buildings';
import { techDone } from '../src/content/techs';
import type { BuildingTypeId, GameState } from '../src/core/types';

const MAX_COUNT: Partial<Record<BuildingTypeId, number>> = {
  shelter: 1, farm: 2, woodcutter: 2, mine: 2, kitchen: 1,
  workshop: 1, research: 1, solar: 3, turret: 2, medbay: 1, launchpad: 1,
};

function tryPlace(s: GameState, type: BuildingTypeId): boolean {
  const def = BUILDINGS[type];
  if (def.tech && !techDone(s, def.tech)) return false;
  if ((s.buildings.filter(b => b.type === type).length) >= (MAX_COUNT[type] ?? 1)) return false;
  for (const [k, v] of Object.entries(def.cost)) {
    if (s.resources[k as keyof typeof s.resources] < (v ?? 0)) return false;
  }
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 26; x++) {
      if (x + def.w > 26 || y + def.h > 16) continue;
      const rect = { x, y, w: def.w, h: def.h };
      if (s.buildings.some(b => b.x < x + def.w && x < b.x + b.w && b.y < y + def.h && y < b.y + b.h)) continue;
      for (const [k, v] of Object.entries(def.cost)) {
        s.resources[k as keyof typeof s.resources] -= v ?? 0;
      }
      s.buildings.push({ id: `sim${s.seq++}`, type, x, y, w: def.w, h: def.h, hp: 100, workerId: null, builtAt: s.elapsed });
      return true;
    }
  }
  return false;
}

const s = newGame(12345);
const HOURS = 12;
let launchTime = -1;

console.log('=== 第一幕 headless 模拟 (活跃自动建造) ===');
console.log('开局: 3 殖民者 / 避难所+农田+研究台 / 木材150 钢铁30 零件6 食物140');
console.log('');

for (let i = 0; i < HOURS * 3600; i++) {
  tickSecond(s, 1);
  if (s.gameOver) { console.log(`❌ 第${(s.elapsed / 3600).toFixed(1)}小时 殖民地覆灭!`); break; }
  // 每隔 30 秒尝试自动建造
  if (i % 30 === 0) {
    for (const t of BUILD_ORDER) tryPlace(s, t);
  }
  if (launchTime < 0 && techDone(s, 'propulsion') && s.buildings.some(b => b.type === 'launchpad')) {
    if (s.resources.steel >= 200 && s.resources.components >= 40) {
      launchTime = s.elapsed;
      console.log(`🚀 满足发射条件! 用时 ${(s.elapsed / 3600).toFixed(2)} 小时`);
    }
  }
  if (i % 1800 === 0 && i > 0) {
    const alive = s.colonists.filter(c => c.hp > 0).length;
    console.log(
      `[${(s.elapsed / 3600).toFixed(1)}h] ` +
      `木${s.resources.wood.toFixed(0)} 钢${s.resources.steel.toFixed(0)} 件${s.resources.components.toFixed(1)} ` +
      `食${s.resources.food.toFixed(0)} | 科技${s.research.done.length}/12 | 人${alive} | 建筑${s.buildings.length} | ` +
      `心情均${(s.colonists.filter(c => c.hp > 0).reduce((a, c) => a + c.mood, 0) / Math.max(1, alive)).toFixed(0)} | ` +
      `袭击${s.stats.raids ?? 0}次(胜${s.stats.raidsWon ?? 0})`,
    );
  }
}

console.log('');
console.log('=== 结果 ===');
if (launchTime >= 0) console.log(`✅ 发射可达: ${(launchTime / 3600).toFixed(2)} 小时(约 ${(launchTime / 3600 * 60).toFixed(0)} 分钟活跃游玩)`);
else console.log(`⚠️ ${HOURS} 小时内未满足发射条件(可能被袭击/崩溃拖慢)`);
console.log(`研究完成: ${s.research.done.join(', ')}`);
console.log(`事件日志条数: ${s.log.length} / 袭击 ${s.stats.raids ?? 0} 次 击退 ${s.stats.raidsWon ?? 0} / 进食 ${(s.stats.foodEaten ?? 0).toFixed(0)} / 崩溃 ${s.stats.broke ?? 0}`);
