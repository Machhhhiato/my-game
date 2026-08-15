import { useV2 } from '../store';
import type { LogSeverity } from '../types';

const SEV_COLOR: Record<LogSeverity, string> = {
  info: '#75c7e8',
  warn: '#efba74',
  danger: '#dc796f',
};

export function EventLog() {
  const state = useV2(s => s.state);
  const logCollapsed = useV2(s => s.logCollapsed);
  const logHistoryOpen = useV2(s => s.logHistoryOpen);
  const setLogCollapsed = useV2(s => s.setLogCollapsed);
  const setLogHistory = useV2(s => s.setLogHistory);
  const requestFocus = useV2(s => s.requestFocus);

  const recent = [...state.log].slice(-4).reverse();

  return (
    <div className={`v2-elog ${logCollapsed ? 'collapsed' : ''}`}>
      <div className="v2-elog-head" onClick={() => setLogCollapsed(!logCollapsed)}>
        <span className="v2-elog-title">河谷调度记录</span>
        {state.logUnread > 0 && <span className="v2-elog-unread">{state.logUnread}</span>}
        <button
          className="v2-elog-toggle"
          onClick={e => { e.stopPropagation(); setLogHistory(!logHistoryOpen); }}
        >
          {logHistoryOpen ? '收起历史' : '展开历史'}
        </button>
      </div>
      {!logCollapsed && (
        <div className="v2-elog-list">
          {recent.map(e => (
            <button
              key={e.id}
              className={`v2-elog-item ${e.severity}`}
              onClick={() => { if (e.nodeId) requestFocus(e.nodeId); }}
              disabled={!e.nodeId}
            >
              <span className="v2-elog-dot" style={{ background: SEV_COLOR[e.severity] }} />
              <span className="v2-elog-body">
                <span className="v2-elog-place">{e.period} · {e.place}</span>
                <span className="v2-elog-summary">{e.summary}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      {logHistoryOpen && (
        <div className="v2-elog-history">
          <div className="v2-elog-history-head">全部记录</div>
          {[...state.log].reverse().map(e => (
            <button
              key={e.id}
              className={`v2-elog-item ${e.severity}`}
              onClick={() => { if (e.nodeId) requestFocus(e.nodeId); }}
              disabled={!e.nodeId}
            >
              <span className="v2-elog-dot" style={{ background: SEV_COLOR[e.severity] }} />
              <span className="v2-elog-body">
                <span className="v2-elog-place">{e.period} · {e.place}</span>
                <span className="v2-elog-summary">{e.summary}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
