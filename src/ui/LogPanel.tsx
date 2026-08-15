import { useGame } from '../store/useGame';
import { fmtDur } from '../core/util';

export function LogPanel() {
  const state = useGame(s => s.state);
  const list = [...state.log].reverse();
  return (
    <div className="panel log-panel">
      <h2>📜 殖民地编年史</h2>
      <div className="log-list">
        {list.map(e => (
          <div key={e.id} className={`log-line ${e.kind}`}>
            <span className="log-t">{fmtDur(e.t)}</span>
            <span className="log-icon">{e.icon}</span>
            <span className="log-title">{e.title}</span>
            <span className="log-text">{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
