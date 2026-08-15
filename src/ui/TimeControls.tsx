import { useGame } from '../store/useGame';
import { E } from '../engine';
import { fmtDur } from '../core/util';

const SPEEDS: { v: 0 | 1 | 2 | 4; icon: string; name: string }[] = [
  { v: 0, icon: '⏸', name: '暂停' },
  { v: 1, icon: '▶', name: '正常速度' },
  { v: 2, icon: '⏩', name: '二倍速' },
  { v: 4, icon: '⏭️', name: '四倍速' },
];

export function TimeControls() {
  const state = useGame(s => s.state);
  const refresh = useGame(s => s.refresh);

  return (
    <div className="tctl">
      {SPEEDS.map(sp => (
        <button
          key={sp.v}
          className={`tctl-btn ${state.speed === sp.v ? 'active' : ''}`}
          onClick={() => { E.setSpeed(sp.v); refresh(); }}
          title={sp.name}
        >
          {sp.icon}
        </button>
      ))}
      <span className="tctl-time">第 {Math.floor(state.elapsed / 86400)} 天 {fmtDur(state.elapsed % 86400)}</span>
      <span className="tctl-save" title="每15秒自动保存">💾 自动保存</span>
    </div>
  );
}
