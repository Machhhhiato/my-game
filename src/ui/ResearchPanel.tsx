import { useGame } from '../store/useGame';
import { E } from '../engine';
import { TECHS, TECH_MAP, LINE_META } from '../content/techs';
import { DIRECTIONS } from '../content/directions';

export function ResearchPanel() {
  const state = useGame(s => s.state);
  const refresh = useGame(s => s.refresh);
  const cur = state.research.current ? TECH_MAP[state.research.current] : null;
  const dir = DIRECTIONS[state.direction] ?? DIRECTIONS.balanced;
  const locked = state.lockedTech;

  return (
    <div className="panel research-panel">
      <h2>🔬 研究</h2>
      <div className="research-mode">
        <span className="rm-chip">
          🧭 方向「{dir.icon} {dir.name}」自动选线中
          {locked ? ` · 🔒 已锁定:${TECH_MAP[locked]?.name ?? locked}` : ''}
        </span>
        <span className="rm-note">在下方点击「锁定」可手动指定目标,研究面板会优先执行;取消锁定恢复自动。</span>
      </div>
      {cur ? (
        <div className="cur-card">
          <div className="cur-icon">{cur.icon}</div>
          <div>
            <div className="cur-name">
              正在研究:{cur.name}
              <span className={`line-tag line-${cur.line}`}>{LINE_META[cur.line].icon}{LINE_META[cur.line].name}</span>
            </div>
            <div className="cur-desc">{cur.desc}</div>
            <div className="tech-bar">
              <div className="tech-fill" style={{ width: `${Math.min(100, (state.research.progress / cur.cost) * 100)}%` }} />
            </div>
            <div className="cur-prog">{Math.floor(state.research.progress)} / {cur.cost} 研究点</div>
            <div className="cur-actions">
              {locked === cur.id ? (
                <button className="btn small" onClick={() => { E.setLockedTech(null); refresh(); }}>🔓 取消锁定</button>
              ) : (
                <button className="btn small" onClick={() => { E.setLockedTech(cur.id); refresh(); }}>🔒 锁定此项</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="cur-card empty">全部科技已完成</div>
      )}
      <div className="tech-grid">
        {TECHS.map(t => {
          const done = state.research.done.includes(t.id);
          const avail = !done && t.req.every(r => state.research.done.includes(r));
          const isCur = state.research.current === t.id;
          const isLocked = locked === t.id;
          return (
            <div key={t.id} className={`tech-card ${done ? 'done' : avail ? 'avail' : 'locked'} ${isCur ? 'cur' : ''}`}>
              <div className="tech-icon">
                {t.icon}
                <span className={`line-tag line-${t.line}`}>{LINE_META[t.line].icon}{LINE_META[t.line].name}</span>
              </div>
              <div className="tech-name">{t.name}</div>
              <div className="tech-desc">{t.desc}</div>
              <div className="tech-cost">
                {done ? '✅ 完成'
                  : avail
                    ? (
                      <span className="tech-actions">
                        <button className="btn small" onClick={() => { E.setResearch(t.id); refresh(); }}>研究({t.cost}点)</button>
                        <button
                          className={`btn small lock ${isLocked ? 'locked-on' : ''}`}
                          onClick={() => { E.setLockedTech(isLocked ? null : t.id); refresh(); }}
                          title={isLocked ? '取消锁定,恢复方向自动选线' : '锁定:方向自动选择时优先研究此项'}
                        >
                          {isLocked ? '🔓' : '🔒'}
                        </button>
                      </span>
                    )
                    : `需:${t.req.map(r => TECH_MAP[r]?.name ?? r).join('、')}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
