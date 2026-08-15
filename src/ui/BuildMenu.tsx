import { useGame } from '../store/useGame';
import { BUILDINGS, BUILD_ORDER } from '../content/buildings';
import { TECH_MAP } from '../content/techs';
import { RES_META } from './meta';
import type { ResourceId } from '../core/types';

export function BuildMenu() {
  const state = useGame(s => s.state);
  const setGhost = useGame(s => s.setGhost);
  const setShowBuildMenu = useGame(s => s.setShowBuildMenu);

  return (
    <div className="build-menu">
      <div className="bm-title">🔨 建造</div>
      <div className="bm-grid">
        {BUILD_ORDER.map(type => {
          const def = BUILDINGS[type];
          const locked = !!(def.tech && !state.research.done.includes(def.tech));
          const affordable = Object.entries(def.cost).every(
            ([k, v]) => state.resources[k as ResourceId] >= (v ?? 0),
          );
          return (
            <button
              key={type}
              className={`bm-card ${locked ? 'locked' : ''} ${affordable ? 'afford' : 'poor'}`}
              disabled={locked}
              onClick={() => { setGhost(type); setShowBuildMenu(false); }}
              title={def.desc}
            >
              <div className="bm-icon">{def.icon}</div>
              <div className="bm-name">{def.name}</div>
              <div className="bm-cost">
                {locked
                  ? `需研究:${TECH_MAP[def.tech!]?.name ?? def.tech}`
                  : Object.entries(def.cost).map(([k, v]) => (
                      <span key={k} className={state.resources[k as ResourceId] >= (v ?? 0) ? 'ok' : 'no'}>
                        {RES_META[k as ResourceId]?.icon ?? k}{v}
                      </span>
                    ))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="bm-hint">点击卡片后,在地图上点击放置 · 右键取消</div>
    </div>
  );
}
