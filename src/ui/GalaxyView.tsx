import { useEffect, useRef, useState } from 'react';
import { useGame } from '../store/useGame';
import { E } from '../engine';
import { drawGalaxy, GALAXY_W, GALAXY_H, hitGalaxy, type GalaxyHit } from '../render/galaxy';
import { techDone } from '../content/techs';

export function GalaxyView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sel = useGame(s => s.sel);
  const select = useGame(s => s.select);
  const version = useGame(s => s.version);
  const setToast = useGame(s => s.setToast);
  const refresh = useGame(s => s.refresh);
  const [hover, setHover] = useState<GalaxyHit | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          if (canvas.width !== GALAXY_W * dpr || canvas.height !== GALAXY_H * dpr) {
            canvas.width = GALAXY_W * dpr;
            canvas.height = GALAXY_H * dpr;
            canvas.style.width = `${GALAXY_W}px`;
            canvas.style.height = `${GALAXY_H}px`;
          }
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          drawGalaxy(ctx, E.state, { sel, hover });
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [sel, hover]);

  void version;

  const toPx = (e: { clientX: number; clientY: number; currentTarget: HTMLCanvasElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (GALAXY_W / rect.width),
      y: (e.clientY - rect.top) * (GALAXY_H / rect.height),
    };
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    setHover(hitGalaxy(E.state, p.x, p.y));
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    const hit = hitGalaxy(E.state, p.x, p.y);
    if (hit) {
      select(sel.kind === 'system' && sel.id === hit.id
        ? { kind: null, id: null }
        : { kind: 'system', id: hit.id });
    } else {
      select({ kind: null, id: null });
    }
  };

  const s = E.state;
  const owned = s.galaxy.systems.filter(x => x.owned).length;

  return (
    <div className="colony-wrap solar-wrap">
      <div className="colony-chips">
        <span className="chip" title="已探明星系">🌌 星系 {s.galaxy.systems.length}</span>
        <span className="chip" title="受控制星系">🟢 我方 {owned}</span>
        <span className="chip">第三幕 · 银河时代(框架)</span>
      </div>
      <canvas
        ref={canvasRef}
        className="colony-canvas solar-canvas"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onClick={onClick}
      />
      <div className="solar-hint">点击星系查看详情 · 超空间航道连接着可跃迁的星域</div>
    </div>
  );
}
