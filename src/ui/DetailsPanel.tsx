import { useGame } from '../store/useGame';
import { E } from '../engine';
import { BUILDINGS } from '../content/buildings';
import { TRAITS, maxHp } from '../content/colonists';
import { TECH_MAP, techDone, buildSpeedMult } from '../content/techs';
import { calcDefense, calcPower } from '../core/tick';
import { fleetPower, solarRates } from '../core/solar';
import { netRates } from '../core/rates';
import { systemCap } from '../core/galaxy';
import { playerMilitary, isUnified } from '../core/world';
import { SETTLEMENT_ICONS } from '../content/world';
import { fmtDur } from '../core/util';
import type { Colonist, Building, Planet, OrbitalStation, Fleet, StarSystem } from '../core/types';

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="nbar">
      <span className="nbar-label">{label}</span>
      <div className="nbar-track">
        <div className="nbar-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
      </div>
      <span className="nbar-val">{Math.round(value)}</span>
    </div>
  );
}

const SKILL_NAMES: Record<string, string> = {
  build: '建造', mine: '采矿', farm: '种植', craft: '手工',
  cook: '烹饪', research: '智力', combat: '战斗', medic: '医疗',
};

function ColonistDetail({ c }: { c: Colonist }) {
  const skills = Object.entries(c.skills).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return (
    <div className="detail">
      <h3>🧑‍🚀 {c.name}</h3>
      <div className="trait-chips">
        {c.traits.map(t => (
          <span key={t} className="trait-chip" title={TRAITS[t]?.desc}>{TRAITS[t]?.name ?? t}</span>
        ))}
      </div>
      <div className="detail-row">状态:{c.state === 'work' ? '工作中' : c.state === 'walk' ? '移动中' : c.state === 'sleep' ? '睡觉' : c.state === 'eat' ? '进食' : c.state === 'recreate' ? '娱乐' : c.state === 'broken' ? '精神崩溃' : '空闲'}</div>
      <Bar label="❤️ 生命" value={(c.hp / maxHp(c)) * 100} color={c.hp / maxHp(c) > 0.5 ? '#4ac24a' : '#e04a3a'} />
      <Bar label="😊 心情" value={c.mood} color={c.mood >= 60 ? '#4ac24a' : c.mood >= 30 ? '#e8a33a' : '#e04a3a'} />
      <Bar label="🍖 饱食" value={c.needs.food} color="#e0a03a" />
      <Bar label="😴 精力" value={c.needs.rest} color="#6f8fe8" />
      <Bar label="🎵 娱乐" value={c.needs.recreation} color="#b06fe8" />
      <Bar label="🛋️ 舒适" value={c.needs.comfort} color="#4ab2c2" />
      <div className="skills">
        {skills.map(([k, v]) => (
          <span key={k} className="skill-chip">{SKILL_NAMES[k] ?? k} <b>{v}</b></span>
        ))}
      </div>
    </div>
  );
}

function BuildingDetail({ b }: { b: Building }) {
  const def = BUILDINGS[b.type];
  const worker = b.workerId ? E.state.colonists.find(c => c.id === b.workerId) : null;
  return (
    <div className="detail">
      <h3>{def.icon} {def.name}</h3>
      <p className="detail-desc">{def.desc}</p>
      <div className="detail-row">工作者:{worker ? `👷 ${worker.name}` : '无人工作'}</div>
      {def.power && <div className="detail-row">🔌 耗电:{def.power}</div>}
      {def.powerOut && <div className="detail-row">🔋 发电:{def.powerOut}</div>}
      {def.defense && <div className="detail-row">🛡️ 防御:{def.defense}</div>}
      <button
        className="btn danger"
        onClick={() => { E.demolish(b.id); useGame.getState().refresh(); useGame.getState().select({ kind: null, id: null }); }}
      >
        🧱 拆除(返还40%材料)
      </button>
    </div>
  );
}

function PlanetDetail({ p }: { p: Planet }) {
  return (
    <div className="detail">
      <h3>🪐 {p.name}</h3>
      <p className="detail-desc">
        {p.type === 'lush' ? '宜居行星——殖民地的家园。' : p.type === 'gas' ? '气态巨行星——燃料精炼的理想场所。' : p.type === 'ice' ? '冰巨星——寒冷而遥远。' : p.type === 'asteroid' ? '小行星带——采矿站的天堂。' : '岩质行星——荒凉而静默。'}
      </p>
      {p.colony && <div className="detail-row">🏕️ 殖民地所在</div>}
      <div className="detail-row">📐 轨道半径 {p.orbitRadius} · 大小 {p.size}</div>
    </div>
  );
}

function StationDetail({ st }: { st: OrbitalStation }) {
  const kindName = st.kind === 'mine' ? '采矿站' : st.kind === 'refinery' ? '燃料精炼站' : st.kind === 'dock' ? '轨道船坞' : '空间站';
  const icon = st.kind === 'mine' ? '⛏️' : st.kind === 'refinery' ? '⛽' : st.kind === 'dock' ? '🏗️' : '🛰️';
  return (
    <div className="detail">
      <h3>{icon} {st.name}</h3>
      <p className="detail-desc">{kindName} · 等级 {st.level}</p>
      {st.kind === 'mine' && <div className="detail-row">⛏️ 产出:合金</div>}
      {st.kind === 'refinery' && <div className="detail-row">⛽ 产出:燃料</div>}
    </div>
  );
}

function FleetDetail({ f }: { f: Fleet }) {
  const totalPower = f.ships.reduce((a, sh) => a + sh.power, 0);
  return (
    <div className="detail">
      <h3>🚀 {f.name}</h3>
      <p className="detail-desc">舰船 {f.ships.length} 艘 · 总军力 {totalPower}</p>
      {f.ships.map(sh => (
        <div key={sh.id} className="detail-row">
          <span>{sh.cls === 'corvette' ? '🚤' : sh.cls === 'destroyer' ? '🚢' : '🛳️'} {sh.name}</span>
          <span className="muted">军力 {sh.power}</span>
        </div>
      ))}
    </div>
  );
}

function SystemDetail({ sys }: { sys: StarSystem }) {
  return (
    <div className="detail">
      <h3>{sys.owned ? '🟢' : '⭐'} {sys.name}</h3>
      <p className="detail-desc">
        {sys.owned ? '我方控制的恒星系。' : '未探索的星域,等待你的舰队抵达。'}
      </p>
      <div className="detail-row">🔗 超空间航道 {sys.links.length} 条</div>
      <div className="detail-row">📍 坐标 ({Math.round(sys.x)}, {Math.round(sys.y)})</div>
    </div>
  );
}

function SettlementDetail({ st }: { st: import('../core/types').Settlement }) {
  const f = E.state.world.factions.find(fc => fc.id === st.factionId);
  return (
    <div className="detail">
      <h3>{SETTLEMENT_ICONS[Math.min(4, Math.max(0, st.level - 1))]} {st.name}</h3>
      <p className="detail-desc">
        {f ? (f.id === 'player' ? '我方据点' : `隶属:${f.name}`) : '无主'} · 等级 {st.level} · 人口 {st.population}
      </p>
      <div className="detail-row">🏠 下一级人口需求:{st.level >= 5 ? '已满级' : st.level === 1 ? 6 : st.level === 2 ? 15 : st.level === 3 ? 30 : 60}</div>
    </div>
  );
}

export function DetailsPanel() {
  const state = useGame(s => s.state);
  const sel = useGame(s => s.sel);
  const setToast = useGame(s => s.setToast);
  const version = useGame(s => s.version);
  void version;

  const b = sel.kind === 'building' ? state.buildings.find(x => x.id === sel.id) : null;
  const c = sel.kind === 'colonist' ? state.colonists.find(x => x.id === sel.id) : null;
  const p = sel.kind === 'planet' ? state.solar.planets.find(x => x.id === sel.id) : null;
  const st = sel.kind === 'station' ? state.solar.stations.find(x => x.id === sel.id) : null;
  const f = sel.kind === 'fleet' ? state.solar.fleets.find(x => x.id === sel.id) : null;
  const sys = sel.kind === 'system' ? state.galaxy.systems.find(x => x.id === sel.id) : null;
  const stl = sel.kind === 'settlement' ? state.world.settlements.find(x => x.id === sel.id) : null;

  const power = calcPower(state);
  const defense = calcDefense(state);
  const curTech = state.research.current ? TECH_MAP[state.research.current] : null;
  const sr = solarRates(state);
  const nr = netRates(state);

  return (
    <aside className="details">
      {c ? <ColonistDetail c={c} />
        : b ? <BuildingDetail b={b} />
        : p ? <PlanetDetail p={p} />
        : st ? <StationDetail st={st} />
        : f ? <FleetDetail f={f} />
        : sys ? <SystemDetail sys={sys} />
        : stl ? <SettlementDetail st={stl} />
        : (
          <div className="detail">
            <h3>{state.era === 'galaxy' ? '🌌 银河总览' : state.era === 'solar' ? '🪐 母星系总览' : '🌍 全球争霸'}</h3>
            <div className="detail-row">👥 人口:{state.colonists.filter(x => x.hp > 0).length}</div>
            <div className="detail-row">🏠 建筑:{state.buildings.length}</div>
            <div className="detail-row">🛡️ 防御:{defense.toFixed(1)}</div>
            <div className="detail-row">⚡ 电力效率:{Math.round(power * 100)}%</div>
            <div className="detail-row">⏱️ 已生存:{fmtDur(state.elapsed)}</div>
            <div className="detail-row">🎯 袭击:{state.stats.raids ?? 0} 次 · 击退:{state.stats.raidsWon ?? 0} 次</div>
            {state.era === 'colony' && (
              <>
                <hr className="hr" />
                <div className="detail-row">🟢 领土:{state.world.tiles.flat().filter(t => t.ownerId === state.world.playerId).length} 格</div>
                <div className="detail-row">🏴 存活势力:{state.world.factions.filter(fc => fc.alive && fc.id !== 'player').length}</div>
                <div className="detail-row">⚔️ 我军力:{playerMilitary(state)}</div>
                <div className="detail-row">🌍 统一进度:{Math.round((state.world.tiles.flat().filter(t => t.ownerId === state.world.playerId).length / Math.max(1, state.world.tiles.flat().filter(t => t.terrain !== 'ocean' && t.terrain !== 'ice').length)) * 100)}%</div>
                {isUnified(state) && <div className="goal-hint">🌍 全球统一!已满足政治门槛。</div>}
                <hr className="hr" />
                <div className="detail-row">⚙️ 资源获取:🪵{nr.wood.toFixed(1)} 🔩{nr.steel.toFixed(1)} 🍖{nr.food.toFixed(1)}/s</div>
                <div className="detail-row">🔬 科研能力:+{nr.rp.toFixed(2)}/s</div>
                <div className="detail-row">🏗️ 建造速度:每 {Math.max(5, Math.round(15 / buildSpeedMult(state)))} 秒一栋</div>
                <div className="detail-row">🏛️ 行政能力:据点 {state.world.settlements.filter(x => x.factionId === 'player').length}/{Math.min(5, 1 + Math.floor(state.world.tiles.flat().filter(t => t.ownerId === state.world.playerId).length / 30))}</div>
              </>
            )}
            {state.era === 'solar' && (
              <>
                <hr className="hr" />
                <div className="detail-row">🚀 舰队军力:{fleetPower(state)}</div>
                <div className="detail-row">⛏️ 采矿站:{state.solar.stations.filter(x => x.kind === 'mine').length}</div>
                <div className="detail-row">⛽ 精炼站:{state.solar.stations.filter(x => x.kind === 'refinery').length}</div>
                <div className="detail-row">⚡ 轨道电力:{sr.power}</div>
                <div className="detail-row">🧱 合金 +{sr.alloy.toFixed(2)}/s</div>
                <div className="detail-row">⛽ 燃料 +{sr.fuel.toFixed(2)}/s</div>
                {techDone(state, 'hyperdrive') && state.era === 'solar' && (
                  <button
                    className="btn depart-btn"
                    onClick={() => {
                      const err = E.jump();
                      useGame.getState().refresh();
                      if (err) useGame.getState().setToast(`❌ ${err}`);
                    }}
                  >
                    🌌 跃迁进入银河时代(5000合金 + 3000燃料)
                  </button>
                )}
              </>
            )}
            {state.era === 'galaxy' && (
              <>
                <hr className="hr" />
                <div className="detail-row">🪐 占领星系:{state.galaxy.systems.filter(x => x.owned).length}/{systemCap(state)}</div>
                <div className="detail-row">🚀 舰队军力:{fleetPower(state)}</div>
                {!state.galaxy.crisis.active && !state.galaxy.crisis.won && (
                  <div className="detail-row">👾 天灾:肃正协议正在逼近</div>
                )}
                {state.galaxy.crisis.active && !state.galaxy.crisis.won && (
                  <>
                    <div className="detail-row" style={{ color: '#fca5a5' }}>👾 天灾强度:{Math.round(state.galaxy.crisis.strength)}</div>
                    <button
                      className="btn danger"
                      onClick={() => {
                        const err = E.fightCrisis();
                        useGame.getState().refresh();
                        if (err) setToast(`❌ ${err}`);
                        else setToast('🏆 天灾被击败!银河重归和平。');
                      }}
                    >
                      ⚔️ 迎击天灾
                    </button>
                  </>
                )}
                {state.galaxy.crisis.won && (
                  <button
                    className="btn depart-btn"
                    onClick={() => { E.prestige(); useGame.getState().refresh(); }}
                  >
                    🌟 新纪元(转生,保留声望)
                  </button>
                )}
              </>
            )}
            <hr className="hr" />
            {curTech ? (
              <div className="cur-tech">
                <div className="detail-row">🔬 研究:{curTech.icon} {curTech.name}</div>
                <div className="tech-bar">
                  <div className="tech-fill" style={{ width: `${Math.min(100, (state.research.progress / curTech.cost) * 100)}%` }} />
                </div>
                <div className="detail-row small">{Math.floor(state.research.progress)} / {curTech.cost} 研究点</div>
              </div>
            ) : (
              <div className="detail-row">🔬 全部科技已研究完成</div>
            )}
            {!state.launched && !state.gameOver && (
              <div className="goal-hint">
                🚀 目标:研究全部科技,建造火箭发射台,飞向星空。
              </div>
            )}
          </div>
        )}
    </aside>
  );
}
