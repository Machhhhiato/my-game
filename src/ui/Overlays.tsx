import { useEffect } from 'react';
import { useGame } from '../store/useGame';
import { E } from '../engine';
import { RES_META, RES_ORDER } from './meta';
import { fmtDur, fmtNum } from '../core/util';
import type { ResourceId } from '../core/types';

export function Overlays() {
  const state = useGame(s => s.state);
  const refresh = useGame(s => s.refresh);
  const toast = useGame(s => s.toast);
  const setToast = useGame(s => s.setToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast, setToast]);

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {state.offlineInfo && (
        <div className="overlay">
          <div className="modal">
            <h3>⏳ 欢迎回来</h3>
            <p>你离开了 <b>{fmtDur(state.offlineInfo.seconds)}</b>,殖民地以 60% 效率继续运转:</p>
            <div className="offline-gains">
              {Object.entries(state.offlineInfo.gained).map(([k, v]) => (
                <span key={k} className="gain">
                  {RES_META[k as ResourceId]?.icon ?? k} +{fmtNum(v as number)}
                </span>
              ))}
              {Object.keys(state.offlineInfo.gained).length === 0 && <span>殖民地勉强维持,没有明显产出</span>}
            </div>
            <button className="btn" onClick={() => { E.dismissOffline(); refresh(); }}>知道了</button>
          </div>
        </div>
      )}

      {state.gameOver && (
        <div className="overlay">
          <div className="modal center">
            <div className="big-emoji">🕯️</div>
            <h3>殖民地覆灭</h3>
            <p>最后一位殖民者倒下了。你们在这颗星球上存活了 <b>{fmtDur(state.elapsed)}</b>。</p>
            <p className="muted">袭击 {state.stats.raids ?? 0} 次 · 击退 {state.stats.raidsWon ?? 0} 次 · 研究科技 {state.research.done.length} 项</p>
            <button className="btn" onClick={() => { E.continueAfterGameOver(); refresh(); }}>🔄 重新开始</button>
          </div>
        </div>
      )}

      {state.launched && state.era === 'solar' && (
        <div className="overlay">
          <div className="modal center launch">
            <div className="big-emoji">🌠</div>
            <h3>进入母星系时代</h3>
            <p>历经 {state.space.totalLaunches} 次发射,星际飞船组装完毕,驶入了母星系——第二幕开始了。</p>
            <div className="launch-stats">
              <span>🚀 发射 {state.space.totalLaunches} 次</span>
              <span>💥 失败 {state.space.failures} 次</span>
              <span>👥 人口 {state.colonists.filter(c => c.hp > 0).length}</span>
              <span>🧪 科技 {state.research.done.length} 项</span>
            </div>
            <p className="muted">研究第二幕科技,部署采矿站与精炼站,壮大你的舰队。</p>
            <button className="btn" onClick={() => { E.continueAfterLaunch(); refresh(); }}>驶向母星系 →</button>
          </div>
        </div>
      )}

      {state.galaxy.crisis.won && state.era === 'galaxy' && (
        <div className="overlay">
          <div className="modal center launch">
            <div className="big-emoji">🏆</div>
            <h3>击败天灾,银河统一</h3>
            <p>肃正协议在决战中土崩瓦解,你的帝国成为了银河的主宰。</p>
            <div className="launch-stats">
              <span>🪐 占领星系 {state.galaxy.systems.filter(x => x.owned).length} 个</span>
              <span>🚀 舰队军力 {Math.round(state.galaxy.crisis.strength)}</span>
              <span>⏱️ 用时 {fmtDur(state.elapsed)}</span>
            </div>
            <p className="muted">转生开启新纪元:保留声望,起始资源 +50%/级。</p>
            <button className="btn" onClick={() => { E.prestige(); refresh(); }}>🌟 开启新纪元(转生)</button>
          </div>
        </div>
      )}

      {!state.gameOver && !state.launched && !state.offlineInfo && state.research.done.length === 0 && (
        <div className="hint-banner">
          💡 你只需定方向:点击顶部「🧭 方向」胶囊选择发展路线,殖民地会自动调配岗位、建造与研究。研究出机器人后连建造也全自动!
        </div>
      )}
    </>
  );
}

void RES_ORDER;
