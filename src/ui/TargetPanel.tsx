import { useGame } from '../store/useGame';
import { departMissing } from '../content/spaceProgram';
import { isUnified } from '../core/world';

export function TargetPanel() {
  const state = useGame(s => s.state);

  let content;
  if (state.era === 'colony') {
    const landTiles = state.world.tiles.flat().filter(t => t.terrain !== 'ocean' && t.terrain !== 'ice').length;
    const ownedTiles = state.world.tiles.flat().filter(t => t.ownerId === state.world.playerId).length;
    const unifyPct = Math.round((ownedTiles / Math.max(1, landTiles)) * 100);
    const missing = departMissing(state.space, state.world);
    content = (
      <>
        <div className="goal-line">🌍 统一全球 <b>{unifyPct}%</b>{isUnified(state) ? ' ✓' : ''}</div>
        <div className="goal-line">🚀 太空计划 <b>{state.space.done.length}/18</b></div>
        {missing.length > 0 ? (
          <div className="goal-missing">
            <div className="goal-missing-title">进入第二幕还缺:</div>
            {missing.map(m => <div key={m} className="goal-missing-item">· {m}</div>)}
          </div>
        ) : (
          <div className="goal-ready">✅ 全部门槛达成,可启航进入第二幕</div>
        )}
      </>
    );
  } else if (state.era === 'solar') {
    content = <div className="goal-line">🌌 研究「超空间引擎」,跃迁进入银河时代</div>;
  } else {
    content = <div className="goal-line">👾 壮大舰队,击败天灾「肃正协议」</div>;
  }

  return (
    <div className="target-panel">
      <div className="target-head">🎯 当前目标</div>
      {content}
    </div>
  );
}
