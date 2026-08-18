import { useV2 } from '../store';
import type { LogSeverity } from '../types';
import { notificationSeverity, notificationSummary } from '../content/copyKeys';

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

  const recent = [...state.notificationHistory].slice(-4).reverse();

  return (
    <div className={`v2-elog ${logCollapsed ? 'collapsed' : ''}`}>
      <div className="v2-elog-head" onClick={() => setLogCollapsed(!logCollapsed)}>
        <span className="v2-elog-title">河谷调度记录</span>
        {state.notificationHistory.length > 0 && <span className="v2-elog-unread">{state.notificationHistory.length}</span>}
        <button
          className="v2-elog-toggle"
          onClick={e => { e.stopPropagation(); setLogHistory(!logHistoryOpen); }}
        >
          {logHistoryOpen ? '收起历史' : '展开历史'}
        </button>
      </div>
      {!logCollapsed && (
        <div className="v2-elog-list">
          {recent.map(e => {
            const severity = notificationSeverity(e);
            return (
            <button
              key={e.id}
              className={`v2-elog-item ${severity}`}
              disabled
            >
              <span className="v2-elog-dot" style={{ background: SEV_COLOR[severity] }} />
              <span className="v2-elog-body">
                <span className="v2-elog-place">第 {e.day} 日 · 河谷执行</span>
                <span className="v2-elog-summary">{notificationSummary(e)}</span>
              </span>
            </button>
          )})}
        </div>
      )}
      {logHistoryOpen && (
        <div className="v2-elog-history">
          <div className="v2-elog-history-head">全部记录</div>
          {[...state.notificationHistory].reverse().map(e => {
            const severity = notificationSeverity(e);
            return (
            <button
              key={e.id}
              className={`v2-elog-item ${severity}`}
              disabled
            >
              <span className="v2-elog-dot" style={{ background: SEV_COLOR[severity] }} />
              <span className="v2-elog-body">
                <span className="v2-elog-place">第 {e.day} 日 · 河谷执行</span>
                <span className="v2-elog-summary">{notificationSummary(e)}</span>
              </span>
            </button>
          )})}
        </div>
      )}
    </div>
  );
}
