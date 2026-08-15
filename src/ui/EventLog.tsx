import { useGame } from '../store/useGame';
import { E } from '../engine';

function fmtRealTime(ms: number): string {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function EventLog() {
  const state = useGame(s => s.state);
  const refresh = useGame(s => s.refresh);
  const recent = state.log.slice(-40).reverse();

  return (
    <div className="elog">
      <div className="elog-head">📜 事件日志</div>
      {state.pendingChoice && (
        <div className="choice">
          <span className="choice-icon">❓</span>
          <div className="choice-body">
            <div className="choice-title">【待抉择】{state.pendingChoice.title}</div>
            <div className="choice-text">{state.pendingChoice.text}</div>
            <div className="choice-opts">
              {state.pendingChoice.options.map((o, i) => (
                <button key={i} className="btn small" onClick={() => { E.answerChoice(i); refresh(); }}>
                  {o.label}
                </button>
              ))}
              <span className="choice-timer">
                剩余 {Math.max(0, Math.ceil(state.pendingChoice!.expiresAt - state.elapsed))} 秒
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="elog-scroll">
        {recent.map(e => (
          <div key={e.id} className={`elog-item ${e.kind}`}>
            <span className="elog-icon">{e.icon}</span>
            <div className="elog-body">
              <div className="elog-title">{e.title}</div>
              <div className="elog-text">{e.text}</div>
            </div>
            <span className="elog-time">{fmtRealTime(e.realT)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
