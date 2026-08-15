import { useEffect, useRef, useState } from 'react';
import { PlanetRenderer } from '../render/planet';
import { loadSave } from '../core/save';
import { netRates } from '../core/rates';
import { fmtNum, fmtDur } from '../core/util';
import { RES_META } from './meta';
import { useGame } from '../store/useGame';
import { E } from '../engine';
import type { GameState } from '../core/types';

function PlanetCanvas({ seed, s }: { seed: number; s: GameState | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rendRef = useRef<PlanetRenderer | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const r = new PlanetRenderer(canvas, seed || 1);
    rendRef.current = r;
    r.resize(200, 150);
    let raf = 0;
    const loop = (t: number) => {
      r.frame(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [seed]);

  void s;
  return <canvas ref={ref} className="widget-planet" />;
}

/** 小组件内容(桌面窗口与浏览器浮动窗共用) */
function WidgetContent({ s }: { s: GameState | null }) {
  if (!s) {
    return <div className="widget-empty">殖民地尚未开始</div>;
  }
  const rates = netRates(s);
  const alive = s.colonists.filter(c => c.hp > 0).length;
  return (
    <div className="widget-body">
      <PlanetCanvas seed={s.seed} s={s} />
      <div className="widget-info">
        <div className="widget-title">🪐 {s.colonists[0]?.name ?? '未知'}星 · 殖民地</div>
        <div className="widget-row">
          {(['wood', 'steel', 'components', 'food'] as const).map(id => (
            <span key={id} className="widget-res">
              {RES_META[id].icon}{fmtNum(s.resources[id])}
              <i>({rates[id] >= 0 ? '+' : ''}{rates[id].toFixed(1)}/s)</i>
            </span>
          ))}
        </div>
        <div className="widget-row muted">
          <span>👥 {alive}人</span>
          <span>第{Math.floor(s.elapsed / 86400)}天</span>
          <span>{fmtDur(s.elapsed % 86400)}</span>
          <span>{s.gameOver ? '💀 已覆灭' : s.launched ? '🚀 已升空' : s.speed === 0 ? '⏸ 暂停' : `${s.speed}x`}</span>
        </div>
      </div>
    </div>
  );
}

/** 桌面小组件窗口(?widget=1) */
export default function WidgetStandalone() {
  const [s, setS] = useState<GameState | null>(() => loadSave());

  useEffect(() => {
    const t = setInterval(() => setS(loadSave()), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="widget-window" data-tauri-drag-region>
      <WidgetContent s={s} />
    </div>
  );
}

/** 浏览器降级: 可拖拽浮动小窗 */
export function MiniPanel() {
  const snapshot = useGame(s => s.state);
  const toggleMini = useGame(s => s.toggleMini);
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const style: React.CSSProperties = {};
  if (pos.x >= 0) { style.left = pos.x; style.top = pos.y; }

  return (
    <div
      className="mini-panel"
      style={style}
      onPointerDown={e => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        drag.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={e => {
        if (drag.current) setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
      }}
      onPointerUp={() => { drag.current = null; }}
    >
      <div className="mini-head">
        <span>🪐 星球视窗</span>
        <button className="mini-close" onClick={toggleMini}>✕</button>
      </div>
      <WidgetContent s={E.state} />
      <span className="mini-live" />
    </div>
  );
}
