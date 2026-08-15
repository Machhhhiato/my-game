import type { GameState } from './types';
import { pushLog } from './state';
import { calcDefense } from './tick';
import { directionDef } from '../content/directions';
import { fleetPower } from './solar';
import { makeColonist, maxHp } from '../content/colonists';
import { clamp, rndInt } from './util';

/** 随机取一条文案(长挂机时避免重复感) */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface ChoiceOption {
  label: string;
  /** 选择后效果 */
  apply: (s: GameState) => void;
}

interface ChoiceEvent {
  id: string;
  title: string;
  icon: string;
  text: string;
  can?: (s: GameState) => boolean;
  options: ChoiceOption[];
  /** 未作答自动选择第 0 项 */
}

const CHOICES: ChoiceEvent[] = [
  {
    id: 'caravan',
    title: '商队来访',
    icon: '🐫',
    text: '一支来自远方的商队停靠在你殖民地边缘。他们愿意用 6 个零件交换 80 木材。',
    can: (s) => s.resources.wood >= 40,
    options: [
      { label: '交易:付出80木材,获得6零件', apply: (s) => {
        if (s.resources.wood >= 80) {
          s.resources.wood -= 80; s.resources.components += 6;
          pushLog(s, 'good', '🐫', '交易达成', pick([
            '商队带着木材离开,留下了一箱零件。',
            '木料装车,零件卸下——各取所需。',
            '商队首领验了验木料,满意地点点头,递过一箱零件。',
          ]));
        } else {
          pushLog(s, 'info', '🐫', '交易未达成', '木材不足,商队离开了。');
        }
      } },
      { label: '拒绝交易', apply: (s) => { pushLog(s, 'info', '🐫', '交易未达成', '商队离开了。'); } },
    ],
  },
  {
    id: 'signal',
    title: '神秘信号',
    icon: '📡',
    text: '夜空中传来一段断断续续的加密信号,来源似乎是坠毁的舰船残骸。派人去探查吗?',
    options: [
      { label: '前往探查(可能有所收获,也可能有危险)', apply: (s) => {
        if (Math.random() < 0.6) {
          const comp = rndInt(3, 6), steel = rndInt(25, 45);
          s.resources.components += comp; s.resources.steel += steel;
          pushLog(s, 'good', '📡', '探查成功', pick([
            `残骸中找到 ${comp} 个零件与 ${steel} 钢铁。`,
            `深入残骸,探险队扛回了 ${comp} 个零件和 ${steel} 钢铁。`,
            `这艘坠毁的舰船还有救:拆出 ${comp} 个零件、${steel} 钢铁。`,
          ]));
        } else {
          pushLog(s, 'bad', '📡', '探查遇袭', '残骸中藏着机械守卫!殖民者被迫撤退,有人受了伤。');
          doRaid(s, 1.0);
        }
      } },
      { label: '不去冒险', apply: (s) => { pushLog(s, 'info', '📡', '按兵不动', '信号在黎明前消失了。'); } },
    ],
  },
  {
    id: 'prisoner',
    title: '逃犯',
    icon: '🏃',
    text: '一个衣衫褴褛的陌生人出现在殖民地外,自称从掠夺者营地逃出,请求庇护。',
    can: (s) => s.colonists.filter(c => c.hp > 0).length < 6,
    options: [
      { label: '收留他(新增一位殖民者,但大家心情低落)', apply: (s) => {
        const c = makeColonist(s.colonists.length + 1);
        c.x = 2; c.y = 2; c.px = 2; c.py = 2;
        s.colonists.push(c);
        for (const o of s.colonists) o.mood = clamp(o.mood - 8, 0, 100);
        pushLog(s, 'good', '🏃', '新成员加入', pick([
          `${c.name} 加入了殖民地。`,
          `经过一番盘问,大家接纳了 ${c.name}。`,
          `${c.name} 洗了把脸,换上新衣服,开始了新生活。`,
        ]));
      } },
      { label: '给他食物,送他离开', apply: (s) => {
        s.resources.food = Math.max(0, s.resources.food - 15);
        pushLog(s, 'info', '🏃', '善意', '陌生人带着食物离开了,消失在荒野中。');
      } },
    ],
  },
  {
    id: 'ruins',
    title: '古代遗迹',
    icon: '🏛️',
    text: '探测队发现了一处古代文明的遗迹,内部可能有珍贵的前人知识,也可能有致命的防御系统。',
    can: (s) => s.elapsed > 600,
    options: [
      { label: '深入遗迹(50%:研究点 +150~300 / 50%:触发机械守卫)', apply: (s) => {
        if (Math.random() < 0.5) {
          const rp = rndInt(150, 300);
          s.resources.rp += rp;
          if (s.research.current) s.research.progress += rp;
          pushLog(s, 'good', '🏛️', '遗迹知识', pick([
            `解读古代数据核心,获得 ${rp} 研究点!`,
            `遗迹深处保存着一座完整的数据库,研究者们带回了 ${rp} 研究点。`,
            `墙上的铭文被破译,先人的智慧化作 ${rp} 研究点。`,
          ]));
        } else {
          pushLog(s, 'bad', '🏛️', '守卫苏醒', '遗迹防御系统启动了!殖民者仓皇撤离。');
          doRaid(s, 0.9);
        }
      } },
      { label: '封锁遗迹,不去打扰', apply: (s) => { pushLog(s, 'info', '🏛️', '敬而远之', '遗迹被封锁,它的秘密留给了未来。'); } },
    ],
  },
  {
    id: 'merchant',
    title: '高价商机',
    icon: '💰',
    text: '一名星际商人急需一批零件,愿意用 150 钢铁交换你的 10 个零件。',
    can: (s) => s.resources.components >= 10,
    options: [
      { label: '成交:付出10零件,获得150钢铁', apply: (s) => {
        if (s.resources.components >= 10) {
          s.resources.components -= 10; s.resources.steel += 150;
          pushLog(s, 'good', '💰', '交易达成', pick([
            '商人满意而归,留下 150 钢铁。',
            '一箱零件换回了整整 150 钢铁,这买卖不亏。',
            '商人数了数零件,爽快地卸下了 150 钢铁。',
          ]));
        } else {
          pushLog(s, 'info', '💰', '交易未达成', '零件不足,商人遗憾离开。');
        }
      } },
      { label: '婉拒', apply: (s) => { pushLog(s, 'info', '💰', '婉拒', '商人耸耸肩,驶向了别的殖民地。'); } },
    ],
  },
];

export function doRaid(s: GameState, mult = 1): void {
  s.stats.raids = (s.stats.raids ?? 0) + 1;
  const dir = directionDef(s);
  const strength = (1.2 + s.elapsed / 2400 + Math.random() * 1.2) * mult;
  const defense = calcDefense(s);
  if (defense >= strength) {
    s.stats.raidsWon = (s.stats.raidsWon ?? 0) + 1;
    const moodBonus = (dir.stance === 'fight' ? 8 : 5) + (s.research.done.includes('bastion') ? 3 : 0);
    pushLog(s, 'good', '⚔️', '击退袭击', pick([
      `掠夺者来袭(强度${strength.toFixed(1)}),被防御(${defense.toFixed(1)})击退!`,
      `哨兵提前发现敌情,防御火力(${defense.toFixed(1)})把掠夺者(强度${strength.toFixed(1)})打得落荒而逃。`,
      `一阵枪响过后,掠夺者(强度${strength.toFixed(1)})抛下辎重溃散,防御(${defense.toFixed(1)})完好。`,
    ]));
    for (const c of s.colonists) if (c.hp > 0) c.mood = clamp(c.mood + moodBonus, 0, 100);
  } else {
    // 防御工事/要塞化/躲藏姿态 减损
    let foodPct = 0.15, woodPct = 0.10;
    if (s.research.done.includes('fortify')) { foodPct *= 0.7; woodPct *= 0.7; }
    if (s.research.done.includes('bastion')) { foodPct *= 0.7; woodPct *= 0.7; }
    if (dir.stance === 'hide') { foodPct *= 0.75; woodPct *= 0.75; }
    const foodLoss = Math.round(s.resources.food * foodPct);
    const woodLoss = Math.round(s.resources.wood * woodPct);
    s.resources.food -= foodLoss;
    s.resources.wood -= woodLoss;
    const alive = s.colonists.filter(c => c.hp > 0);
    if (alive.length) {
      const victim = alive[Math.floor(Math.random() * alive.length)];
      victim.hp = clamp(victim.hp - (15 + Math.random() * 20), 0, maxHp(victim));
    }
    // 建筑受损(产出下降,维修机器人可修复)
    const damagedCount = 1 + Math.floor(Math.random() * 2);
    const damaged: string[] = [];
    for (let i = 0; i < damagedCount; i++) {
      const targets = s.buildings.filter(b => !damaged.includes(b.id));
      if (!targets.length) break;
      const b = targets[Math.floor(Math.random() * targets.length)];
      b.hp = Math.max(10, b.hp - (25 + Math.random() * 40));
      damaged.push(b.id);
    }
    const moodLoss = dir.stance === 'hide' ? 14 : 10; // 怯战更憋屈
    for (const c of s.colonists) if (c.hp > 0) c.mood = clamp(c.mood - moodLoss, 0, 100);
    const dmgText = damaged.length ? `${damaged.length} 座建筑受损,产出下降。` : '';
    pushLog(s, 'bad', '⚔️', '袭击得手', pick([
      `掠夺者(强度${strength.toFixed(1)})突破了防御(${defense.toFixed(1)}),抢走 ${foodLoss} 食物与 ${woodLoss} 木材,有人受伤。${dmgText}`,
      `防线(${defense.toFixed(1)})在冲击中崩溃,掠夺者洗劫了仓库——${foodLoss} 食物、${woodLoss} 木材被抢。${dmgText}`,
      `偷袭来得太突然,殖民者们且战且退,还是丢了 ${foodLoss} 食物和 ${woodLoss} 木材。${dmgText}`,
    ]));
  }
}

interface AutoEvent {
  id: string;
  title: string;
  icon: string;
  weight: number;
  can?: (s: GameState) => boolean;
  run: (s: GameState) => void;
}

const AUTO_EVENTS: AutoEvent[] = [
  {
    id: 'cargo', title: '坠毁补给舱', icon: '📦', weight: 3,
    run: (s) => {
      const roll = Math.random();
      if (roll < 0.4) {
        const n = rndInt(40, 90); s.resources.wood += n;
        pushLog(s, 'good', '📦', '坠毁补给舱', pick([
          `回收 ${n} 木材。`,
          `舱体摔得稀碎,但里面的木板完好,捡回 ${n} 木材。`,
          `搜救队撬开舱门,拖出 ${n} 单位的木材。`,
        ]));
      } else if (roll < 0.7) {
        const n = rndInt(10, 30); s.resources.steel += n;
        pushLog(s, 'good', '📦', '坠毁补给舱', pick([
          `回收 ${n} 钢铁。`,
          `舱壁的合金梁还能用,拆出 ${n} 钢铁。`,
          `在一堆废铁里翻出 ${n} 单位的可用钢铁。`,
        ]));
      } else if (roll < 0.9) {
        const n = rndInt(30, 60); s.resources.food += n;
        pushLog(s, 'good', '📦', '坠毁补给舱', pick([
          `回收 ${n} 口粮。`,
          `密封的应急口粮完好无损,搬回 ${n} 食物。`,
          `箱子里是真空包装的干粮,${n} 单位食物入库。`,
        ]));
      } else {
        const n = rndInt(2, 5); s.resources.components += n;
        pushLog(s, 'good', '📦', '坠毁补给舱', pick([
          `回收 ${n} 个零件!`,
          `最值钱的货在夹层里:${n} 个精密零件。`,
          `翻到 ${n} 个还能用的零件,工程师如获至宝。`,
        ]));
      }
    },
  },
  {
    id: 'raid', title: '袭击', icon: '⚔️', weight: 1.2,
    can: (s) => s.elapsed > 300,
    run: (s) => doRaid(s),
  },
  {
    id: 'blight', title: '枯萎病', icon: '🥀', weight: 1.5,
    can: (s) => s.buildings.some(b => b.type === 'farm'),
    run: (s) => {
      s.modifiers.push({ id: 'blight', name: '枯萎病', icon: '🥀', until: s.elapsed + 150 });
      pushLog(s, 'warn', '🥀', '枯萎病蔓延', pick([
        '农田作物染病,未来 2.5 分钟产量减半。',
        '一种陌生的霉菌在作物间疯长,农业专家警告产量将减半。',
        '叶片上出现了诡异的斑点,枯萎病正在啃食你的收成。',
      ]));
    },
  },
  {
    id: 'flare', title: '太阳耀斑', icon: '☀️', weight: 1.2,
    can: (s) => s.research.done.includes('electric'),
    run: (s) => {
      s.modifiers.push({ id: 'flare', name: '太阳耀斑', icon: '☀️', until: s.elapsed + 120 });
      pushLog(s, 'warn', '☀️', '太阳耀斑', pick([
        '恒星活动异常,电力中断 2 分钟!',
        '恒星表面爆发耀斑,电磁脉冲让电网瘫痪了。',
        '天空突然大亮,紧接着所有仪表都黑了——太阳耀斑来袭。',
      ]));
    },
  },
  {
    id: 'fallout', title: '毒雾', icon: '☣️', weight: 1.2,
    can: (s) => s.elapsed > 600,
    run: (s) => {
      s.modifiers.push({ id: 'fallout', name: '毒雾', icon: '☣️', until: s.elapsed + 180 });
      pushLog(s, 'warn', '☣️', '毒雾来袭', pick([
        '剧毒雾气笼罩殖民地,殖民者心情与舒适度恶化,持续 3 分钟。',
        '风停了,一团黄绿色的雾气从谷底漫上来,呼吸都变得刺痛。',
        '警报响起:检测到有毒气溶胶,所有人尽量待在室内。',
      ]));
    },
  },
  {
    id: 'wanderer', title: '流浪者', icon: '🧭', weight: 2,
    can: (s) => s.colonists.filter(c => c.hp > 0).length < 6,
    run: (s) => {
      const c = makeColonist(s.colonists.length + 1);
      c.x = 1.5; c.y = 2.5; c.px = 1.5; c.py = 2.5;
      s.colonists.push(c);
      pushLog(s, 'good', '🧭', '流浪者加入', pick([
        `${c.name} 从荒野中走来,加入了殖民地。`,
        `${c.name} 背着破旧的背包出现在哨卡外,请求收留。`,
        `一名幸存者找到了这里,${c.name} 加入了殖民者的队伍。`,
      ]));
    },
  },
  {
    id: 'meteor', title: '陨石雨', icon: '☄️', weight: 2,
    run: (s) => {
      const steel = rndInt(20, 50), wood = rndInt(10, 20);
      s.resources.steel += steel; s.resources.wood += wood;
      pushLog(s, 'good', '☄️', '陨石雨', pick([
        `天降陨石,采集到 ${steel} 钢铁与 ${wood} 木材。`,
        `夜空中划过一场流星雨,陨石坠落在附近,敲开一看是 ${steel} 钢铁。`,
        `陨石坑里发现了铁镍核心,加上烧焦的树木,一共 ${steel} 钢铁、${wood} 木材。`,
      ]));
    },
  },
  {
    id: 'bounty', title: '丰收', icon: '🌾', weight: 1.5,
    can: (s) => s.buildings.some(b => b.type === 'farm'),
    run: (s) => {
      const n = rndInt(60, 120);
      s.resources.food += n;
      pushLog(s, 'good', '🌾', '丰收', pick([
        `风调雨顺,农田大丰收,收获 ${n} 食物。`,
        `这个季节的收成格外好,粮仓堆得满满当当:${n} 食物入库。`,
        `作物长势喜人,收割队忙了整整一天,${n} 食物颗粒归仓。`,
      ]));
    },
  },
  {
    id: 'wildfire', title: '野火', icon: '🔥', weight: 1,
    can: (s) => s.buildings.some(b => b.type === 'woodcutter' || b.type === 'farm'),
    run: (s) => {
      const loss = Math.round(s.resources.wood * 0.2);
      s.resources.wood -= loss;
      pushLog(s, 'warn', '🔥', '野火', pick([
        `干燥季节,一场野火烧毁了木料场,损失 ${loss} 木材。`,
        `一阵热风卷来,火光冲天——${loss} 木材化作了灰烬。`,
        `野火借着风势蔓延,消防队奋战到天亮,还是损失了 ${loss} 木材。`,
      ]));
    },
  },
  {
    id: 'malfunction', title: '机器人故障', icon: '⚠️', weight: 1,
    can: (s) => s.research.done.includes('robot'),
    run: (s) => {
      s.modifiers.push({ id: 'malfunction', name: '机器人故障', icon: '⚠️', until: s.elapsed + 120 });
      pushLog(s, 'warn', '⚠️', '机器人故障', pick([
        '机器人编队出现系统性故障,生产 -20%,持续 2 分钟。',
        '几台机器人突然原地打转,工程师紧急排查,生产线暂时降速。',
        '中枢指令冲突,机器人们集体罢工了——生产将受影响。',
      ]));
    },
  },
  {
    id: 'inspiration', title: '灵感迸发', icon: '💡', weight: 1,
    can: (s) => s.buildings.some(b => b.type === 'research'),
    run: (s) => {
      s.modifiers.push({ id: 'inspiration', name: '灵感迸发', icon: '💡', until: s.elapsed + 120 });
      pushLog(s, 'good', '💡', '灵感迸发', pick([
        '研究团队灵感爆发,研究速度 +50%,持续 2 分钟!',
        '一名研究员在夜里喊出了答案——整个实验室跟着沸腾,研究加速。',
        '一次意外实验打通了关键瓶颈,研究进度突飞猛进。',
      ]));
    },
  },
];

// ===== 第二幕: 母星系专属事件 =====
const SOLAR_AUTO_EVENTS: AutoEvent[] = [
  {
    id: 'asteroid_impact', title: '小行星撞击', icon: '☄️', weight: 1.5,
    can: (s) => s.solar.stations.some(st => st.kind === 'mine'),
    run: (s) => {
      s.modifiers.push({ id: 'minehalt', name: '采矿站受损', icon: '☄️', until: s.elapsed + 120 });
      pushLog(s, 'warn', '☄️', '小行星撞击', pick([
        '一颗失控的小行星撞上了采矿站,合金产量减半,持续 2 分钟。',
        '采矿站被流石击中,钻机停机,工程师紧急抢修。',
      ]));
    },
  },
  {
    id: 'pirate', title: '海盗来袭', icon: '🏴‍☠️', weight: 1.2,
    can: (s) => s.solar.fleets[0] && s.solar.fleets[0].ships.length > 0,
    run: (s) => {
      const fp = fleetPower(s);
      const threat = 40 + (s.elapsed / 3600) * 5;
      if (fp >= threat) {
        const loot = rndInt(20, 50);
        s.resources.alloy += loot;
        pushLog(s, 'good', '🏴‍☠️', '击退海盗', pick([
          `海盗舰队(威胁${threat.toFixed(0)})撞上了你的舰队(军力${fp}),被击退后留下 ${loot} 合金战利品。`,
          `海盗见势不妙掉头就跑,你的舰队捡回了 ${loot} 合金。`,
        ]));
      } else {
        const alloyLoss = Math.round(s.resources.alloy * 0.15);
        const fuelLoss = Math.round(s.resources.fuel * 0.10);
        s.resources.alloy -= alloyLoss;
        s.resources.fuel -= fuelLoss;
        pushLog(s, 'bad', '🏴‍☠️', '海盗得手', `海盗(威胁${threat.toFixed(0)})突破了舰队(军力${fp}),抢走 ${alloyLoss} 合金与 ${fuelLoss} 燃料。`);
      }
    },
  },
  {
    id: 'solarflare2', title: '恒星耀斑', icon: '☀️', weight: 1.2,
    can: (s) => s.research.done.includes('solararray'),
    run: (s) => {
      s.modifiers.push({ id: 'solarflare', name: '恒星耀斑', icon: '☀️', until: s.elapsed + 120 });
      pushLog(s, 'warn', '☀️', '恒星耀斑', '恒星爆发耀斑,轨道电力中断 2 分钟。');
    },
  },
  {
    id: 'richore', title: '富矿发现', icon: '💎', weight: 1.5,
    can: (s) => s.solar.stations.some(st => st.kind === 'mine'),
    run: (s) => {
      const n = rndInt(50, 120);
      s.resources.alloy += n;
      pushLog(s, 'good', '💎', '富矿发现', pick([
        `勘探船在小行星带发现富矿脉,提炼出 ${n} 合金。`,
        `一块稀有金属含量极高的矿石被拖回冶炼,${n} 合金入库。`,
      ]));
    },
  },
];

const SOLAR_CHOICES: ChoiceEvent[] = [
  {
    id: 'trader2', title: '星际商队', icon: '🛸',
    text: '一支星际商队停靠在你母星系边缘,愿意用 80 燃料交换你的 50 合金。',
    can: (s) => s.resources.alloy >= 50,
    options: [
      { label: '成交:50合金 → 80燃料', apply: (s) => {
        if (s.resources.alloy >= 50) {
          s.resources.alloy -= 50; s.resources.fuel += 80;
          pushLog(s, 'good', '🛸', '交易达成', '合金换成了满满的燃料罐。');
        } else {
          pushLog(s, 'info', '🛸', '交易未达成', '合金不足,商队离开了。');
        }
      } },
      { label: '婉拒', apply: (s) => { pushLog(s, 'info', '🛸', '婉拒', '商队跃迁离开了。'); } },
    ],
  },
];

export function eventsTick(s: GameState): void {
  if (s.elapsed < s.nextEventAt) return;
  s.nextEventAt = s.elapsed + rndInt(90, 240);

  // 有未决选择时,只触发自动事件
  const choicePool = s.pendingChoice ? [] : [...CHOICES, ...(s.era === 'solar' ? SOLAR_CHOICES : [])];
  const autoPool = [...AUTO_EVENTS, ...(s.era === 'solar' ? SOLAR_AUTO_EVENTS : [])];
  const pools: ({ weight: number } & ({ kind: 'choice'; ev: ChoiceEvent } | { kind: 'auto'; ev: AutoEvent }))[] = [];
  for (const ev of autoPool) {
    if (ev.can && !ev.can(s)) continue;
    pools.push({ kind: 'auto', ev, weight: ev.weight });
  }
  for (const ev of choicePool) {
    if (ev.can && !ev.can(s)) continue;
    pools.push({ kind: 'choice', ev, weight: 1.3 });
  }
  if (pools.length === 0) return;

  const total = pools.reduce((a, p) => a + p.weight, 0);
  let r = Math.random() * total;
  for (const p of pools) {
    r -= p.weight;
    if (r <= 0) {
      if (p.kind === 'auto') {
        p.ev.run(s);
      } else {
        s.pendingChoice = {
          id: s.seq++,
          eventId: p.ev.id,
          title: p.ev.title,
          text: p.ev.text,
          options: p.ev.options.map(o => ({ label: o.label })),
          expiresAt: s.elapsed + 90,
        };
        pushLog(s, 'event', p.ev.icon, `【待抉择】${p.ev.title}`, p.ev.text);
      }
      return;
    }
  }
}

/** 处理玩家选择 */
export function applyChoice(s: GameState, index: number): void {
  if (!s.pendingChoice) return;
  const allChoices = [...CHOICES, ...SOLAR_CHOICES];
  const ev = allChoices.find(c => c.id === s.pendingChoice!.eventId);
  if (!ev) { s.pendingChoice = null; return; }
  const opt = ev.options[Math.min(index, ev.options.length - 1)];
  opt.apply(s);
  s.pendingChoice = null;
}

/** 未作答自动选择 */
export function expireChoice(s: GameState): void {
  if (s.pendingChoice && s.elapsed >= s.pendingChoice.expiresAt) {
    const allChoices = [...CHOICES, ...SOLAR_CHOICES];
    const ev = allChoices.find(c => c.id === s.pendingChoice!.eventId);
    const label = s.pendingChoice.options[0]?.label ?? '';
    s.pendingChoice = null;
    if (ev) {
      ev.options[0].apply(s);
      pushLog(s, 'info', '⏱️', '抉择超时', `你没有及时回应,殖民者们替你做了决定:${label}`);
    }
  }
}
