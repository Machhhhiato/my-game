import { useGame } from '../store/useGame';
import { isTauri, showWidgetWindow } from '../lib/tauri';

export function NavPanel() {
  const view = useGame(s => s.view);
  const setView = useGame(s => s.setView);
  const showBuildMenu = useGame(s => s.showBuildMenu);
  const setShowBuildMenu = useGame(s => s.setShowBuildMenu);
  const toggleMini = useGame(s => s.toggleMini);
  const era = useGame(s => s.state.era);

  return (
    <nav className="nav">
      <button
        className={`nav-btn ${view === 'colony' ? 'active' : ''}`}
        onClick={() => { setView('colony'); setShowBuildMenu(false); }}
      >
        <span className="nav-icon">{era === 'colony' ? '🌍' : era === 'solar' ? '🪐' : '🌌'}</span>
        <span>{era === 'colony' ? '全球' : era === 'solar' ? '母星系' : '银河'}</span>
      </button>
      {era === 'solar' && (
        <button
          className={`nav-btn ${view === 'ground' ? 'active' : ''}`}
          onClick={() => { setView('ground'); setShowBuildMenu(false); }}
          title="回到殖民地地面"
        >
          <span className="nav-icon">🏕️</span>
          <span>地面</span>
        </button>
      )}
      <button
        className={`nav-btn ${view === 'research' ? 'active' : ''}`}
        onClick={() => { setView('research'); setShowBuildMenu(false); }}
      >
        <span className="nav-icon">🔬</span>
        <span>研究</span>
      </button>
      <button
        className={`nav-btn ${view === 'space' ? 'active' : ''}`}
        onClick={() => { setView('space'); setShowBuildMenu(false); }}
      >
        <span className="nav-icon">🚀</span>
        <span>太空计划</span>
      </button>
      <button
        className={`nav-btn ${view === 'log' ? 'active' : ''}`}
        onClick={() => { setView('log'); setShowBuildMenu(false); }}
      >
        <span className="nav-icon">📜</span>
        <span>日志</span>
      </button>
      <button
        className={`nav-btn ${view === 'settings' ? 'active' : ''}`}
        onClick={() => { setView('settings'); setShowBuildMenu(false); }}
      >
        <span className="nav-icon">⚙️</span>
        <span>设置</span>
      </button>
      <div className="nav-sep" />
      <button
        className={`nav-btn ${showBuildMenu ? 'active' : ''}`}
        onClick={() => { setView('colony'); setShowBuildMenu(!showBuildMenu); }}
        title="建造建筑"
      >
        <span className="nav-icon">🔨</span>
        <span>建造</span>
      </button>
      <button
        className="nav-btn"
        onClick={() => { if (isTauri) void showWidgetWindow(); else toggleMini(); }}
        title="桌面小组件:旋转星球视窗"
      >
        <span className="nav-icon">🪐</span>
        <span>星球视窗</span>
      </button>
    </nav>
  );
}
