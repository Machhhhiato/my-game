import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../store/useGame';
import { E } from '../engine';
import { RES_META, RES_ORDER } from './meta';
import { resDisplay } from '../core/rates';
import { fmtNum } from '../core/util';
import { DIRECTIONS } from '../content/directions';
import type { DirectionId } from '../core/types';

export function TopBar() {
  const state = useGame(s => s.state);
  const refresh = useGame(s => s.refresh);
  const [pickerOpen, setPickerOpen] = useState(false);
  const alive = state.colonists.filter(c => c.hp > 0).length;
  const dir = DIRECTIONS[state.direction] ?? DIRECTIONS.balanced;

  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="brand">
          <span className="brand-icon">🌌</span>
          <span className="brand-name">群星挂机</span>
          <span className="brand-sub">第一幕 · 全球争霸</span>
        </div>

        <button
          className="dir-capsule"
          onClick={() => setPickerOpen(o => !o)}
          title={`当前方向:${dir.name}。点击切换。`}
        >
          <span className="dir-capsule-icon">{dir.icon}</span>
          <span className="dir-capsule-name">{dir.name}</span>
          <span className="dir-capsule-caret">▾</span>
        </button>
      </div>

      <div className="res-row">
        {RES_ORDER.filter(id => state.era === 'solar' || state.era === 'galaxy' || (id !== 'alloy' && id !== 'fuel')).map(id => {
          const m = RES_META[id];
          const { amount, rate } = resDisplay(state, id);
          return (
            <div className="res" key={id} title={m.name}>
              <span className="ricon">{m.icon}</span>
              <span className="ramt">{fmtNum(amount)}</span>
              <span className={`rrate ${rate >= 0 ? 'up' : 'down'}`}>
                ({rate >= 0 ? '+' : ''}{rate.toFixed(2)}/s)
              </span>
            </div>
          );
        })}
        <div className="res" title="人口">
          <span className="ricon">👥</span>
          <span className="ramt">{alive}</span>
        </div>
      </div>

      {pickerOpen && createPortal(
        <div className="dir-overlay" onClick={() => setPickerOpen(false)}>
          <div className="dir-modal" onClick={e => e.stopPropagation()}>
            <div className="dir-modal-title">🧭 选择发展方向</div>
            <div className="dir-modal-sub">切换即生效:岗位、建造、研究、军事姿态将自动重调</div>
            <div className="dir-grid">
              {(Object.keys(DIRECTIONS) as DirectionId[]).map(id => {
                const d = DIRECTIONS[id];
                const active = state.direction === id;
                return (
                  <button
                    key={id}
                    className={`dir-card ${active ? 'active' : ''}`}
                    onClick={() => { E.setDirection(id); refresh(); setPickerOpen(false); }}
                  >
                    <div className="dir-card-icon">{d.icon}</div>
                    <div className="dir-card-name">{d.name}</div>
                    <div className="dir-card-desc">{d.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
