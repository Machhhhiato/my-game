import { useV2 } from '../store';
import { PROJECTS } from '../data';

export function ObserverDrawer() {
  const state = useV2(s => s.state);
  const observerOpen = useV2(s => s.observerOpen);
  const toggleObserver = useV2(s => s.toggleObserver);
  const requestFocus = useV2(s => s.requestFocus);
  const selectedNodeId = useV2(s => s.selectedNodeId);

  const proj = PROJECTS[state.player.flagshipProjectId ?? 'water_life'];
  const todos = state.log.filter(e => e.severity !== 'info').slice(-3);

  return (
    <div className={`v2-observer ${observerOpen ? 'open' : ''}`}>
      <button className="v2-observer-handle" onClick={toggleObserver} title="观察器">
        <span>观察</span>
      </button>
      {observerOpen && (
        <div className="v2-observer-body">
          <div className="v2-obs-group">地点 3</div>
          {state.nodes.map(n => (
            <button
              key={n.id}
              className={`v2-obs-item ${selectedNodeId === n.id ? 'active' : ''}`}
              onClick={() => requestFocus(n.id)}
            >
              <span className="v2-obs-name">{n.name}</span>
              <span className="v2-obs-line">{n.statusLine}</span>
            </button>
          ))}
          <div className="v2-obs-group">工程 1</div>
          <button className="v2-obs-item" onClick={() => requestFocus('valley_outpost')}>
            <span className="v2-obs-name">{proj.name}</span>
            <span className="v2-obs-line">风险：{proj.risk}</span>
          </button>
          <div className="v2-obs-group">待办</div>
          {todos.map(t => (
            <button
              key={t.id}
              className={`v2-obs-item ${t.severity}`}
              onClick={() => { if (t.nodeId) requestFocus(t.nodeId); }}
            >
              <span className="v2-obs-name">{t.place}</span>
              <span className="v2-obs-line">{t.summary}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
