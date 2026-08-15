import { useGame } from '../store/useGame';
import { E } from '../engine';
import { MISSIONS, STATION_MODULES, SHIP_MODULES, stationProgress, shipProgress, canDepart } from '../content/spaceProgram';
import { missionChance } from '../core/space';
import { RES_META } from './meta';
import { fmtDur } from '../core/util';
import type { MissionId, ResourceId } from '../core/types';

const MODULE_ICONS: Record<string, string> = {
  stationCore: '🧩', stationLab: '🔬', stationHab: '🛏️', stationPower: '☀️',
  shipDrive: '🚀', shipFuel: '⛽', shipCrew: '🛋️', shipCommand: '🎛️',
};

export function SpacePanel() {
  const state = useGame(s => s.state);
  const refresh = useGame(s => s.refresh);
  const setToast = useGame(s => s.setToast);

  const sp = state.space;
  const cooldown = Math.max(0, sp.nextLaunchAt - state.elapsed);

  const launch = (id: MissionId) => {
    const r = E.launchMission(id);
    refresh();
    if (r === 'ok') setToast('✅ 发射成功!');
    else if (r === 'failed') setToast('💥 发射失败,吸取了教训');
    else if (r === 'cooldown') setToast(`⏳ 发射准备中,还需 ${fmtDur(cooldown)}`);
    else if (r === 'no-res') setToast('❌ 材料不足');
    else if (r === 'no-pad') setToast('❌ 需要建造火箭发射台');
    else if (r === 'no-tech') setToast('❌ 科技前置未满足');
    else if (r === 'no-req') setToast('❌ 前置任务未完成');
  };

  const depart = () => {
    const err = E.depart();
    refresh();
    if (err) setToast(`❌ ${err}`);
  };

  return (
    <div className="panel space-panel">
      <h2>🚀 太空计划</h2>

      <div className="sp-top">
        <div className="rel-meter">
          <div className="rel-label">可靠性</div>
          <div className="rel-value">{sp.reliability}%</div>
          <div className="rel-note">成功 +4% · 失败 +6%(教训)</div>
        </div>
        <div className="sp-stats">
          <span>📈 发射 {sp.totalLaunches} 次</span>
          <span>💥 失败 {sp.failures} 次</span>
          <span>📊 成功率加成 +{(sp.reliability * 0.3).toFixed(0)}%</span>
          {cooldown > 0 && <span className="sp-cd">⏳ 下次发射: {fmtDur(cooldown)}</span>}
        </div>
      </div>

      <div className="sp-assembly">
        <div className="asm-block">
          <div className="asm-title">🛰️ 空间站组装 {stationProgress(sp)}/4</div>
          <div className="module-slots">
            {STATION_MODULES.map(m => (
              <span key={m} className={`module-slot ${sp.done.includes(m) ? 'done' : ''}`}>
                {MODULE_ICONS[m]}
              </span>
            ))}
          </div>
        </div>
        <div className="asm-block">
          <div className="asm-title">🛸 星际飞船组装 {shipProgress(sp)}/4</div>
          <div className="module-slots">
            {SHIP_MODULES.map(m => (
              <span key={m} className={`module-slot ${sp.done.includes(m) ? 'done' : ''}`}>
                {MODULE_ICONS[m]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {canDepart(state.space, state.world) && !state.launched && (
        <div className="depart-row">
          <button className="btn depart-btn" onClick={depart}>
            🌠 启航 —— 驶向母星系(第二幕)
          </button>
        </div>
      )}

      <div className="mission-list">
        {MISSIONS.map(m => {
          const done = sp.done.includes(m.id);
          const reqOk = m.req.every(r => sp.done.includes(r));
          const techOk = !m.techReq || m.techReq.every(t => state.research.done.includes(t));
          const padOk = !m.needLaunchpad || state.buildings.some(b => b.type === 'launchpad');
          const affordable = Object.entries(m.cost).every(([k, v]) => state.resources[k as ResourceId] >= (v ?? 0));
          const ready = !done && reqOk && techOk && padOk && cooldown === 0;
          const chance = Math.round(missionChance(state, m) * 100);

          let statusNode;
          if (done) {
            statusNode = <span className="m-status done">✅ 完成</span>;
          } else if (!reqOk) {
            statusNode = <span className="m-status locked">需先完成: {m.req.map(r => MISSIONS.find(x => x.id === r)?.name.split('·')[0].trim() ?? r).join('、')}</span>;
          } else if (!techOk) {
            statusNode = <span className="m-status locked">🔬 科技前置未满足</span>;
          } else if (!padOk) {
            statusNode = <span className="m-status locked">需建造火箭发射台</span>;
          } else {
            statusNode = (
              <button
                className={`btn small m-launch ${ready && affordable ? '' : 'disabled'}`}
                disabled={!ready}
                onClick={() => launch(m.id)}
                title={!affordable ? '材料不足' : '发射'}
              >
                🚀 发射 · 成功率 {chance}%
              </button>
            );
          }

          return (
            <div key={m.id} className={`mission-card ${done ? 'done' : ready ? 'ready' : ''}`}>
              <div className="m-icon">{m.icon}</div>
              <div className="m-body">
                <div className="m-name">{m.name}</div>
                <div className="m-desc">{m.desc}</div>
                <div className="m-meta">
                  <span className="m-cost">
                    {Object.entries(m.cost).map(([k, v]) => (
                      <span key={k} className={state.resources[k as ResourceId] >= (v ?? 0) ? 'ok' : 'no'}>
                        {RES_META[k as ResourceId]?.icon ?? k}{v}
                      </span>
                    ))}
                  </span>
                  {done && <span className="m-reward">🎁 {m.reward}</span>}
                  {!done && <span className="m-reward">🎁 {m.reward}</span>}
                </div>
              </div>
              <div className="m-status-col">{statusNode}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
