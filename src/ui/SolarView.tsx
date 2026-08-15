import { useEffect, useRef, useState } from 'react';
import { useGame } from '../store/useGame';
import { E } from '../engine';
import { drawSolar, SOLAR_W, SOLAR_H, hitSolar, type SolarHit } from '../render/solar';
import { fleetPower, solarRates } from '../core/solar';

export function SolarView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sel = useGame(s => s.sel);
  const select = useGame(s => s.select);
  const version = useGame(s => s.version);
  const [hover, setHover] = useState<SolarHit | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          if (canvas.width !== SOLAR_W * dpr || canvas.height !== SOLAR_H * dpr) {
            canvas.width = SOLAR_W * dpr;
            canvas.height = SOLAR_H * dpr;
            canvas.style.width = `${SOLAR_W}px`;
            canvas.style.height = `${SOLAR_H}px`;
          }
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          drawSolar(ctx, E.state, { sel, hover, timeMs: t });
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
      x: (e.clientX - rect.left) * (SOLAR_W / rect.width),
      y: (e.clientY - rect.top) * (SOLAR_H / rect.height),
    };
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    setHover(hitSolar(E.state, p.x, p.y));
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    const hit = hitSolar(E.state, p.x, p.y);
    if (hit) {
      select(sel.kind === hit.kind && sel.id === hit.id
        ? { kind: null, id: null }
        : { kind: hit.kind, id: hit.id });
    } else {
      select({ kind: null, id: null });
    }
  };

  const s = E.state;
  const mines = s.solar.stations.filter(st => st.kind === 'mine').length;
  const refs = s.solar.stations.filter(st => st.kind === 'refinery').length;
  const rates = solarRates(s);

  return (
    <div className="colony-wrap solar-wrap">
      <div className="colony-chips">
        <span className="chip" title="舰队总军力">🚀 舰队军力 {fleetPower(s)}</span>
        <span className="chip" title="采矿站数量">⛏️ 采矿站 {mines}</span>
        <span className="chip" title="精炼站数量">⛽ 精炼站 {refs}</span>
        <span className="chip" title="轨道电力">⚡ 轨道电力 {rates.power}</span>
      </div>
      <canvas
        ref={canvasRef}
        className="colony-canvas solar-canvas"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onClick={onClick}
      />
      <div className="solar-hint">点击行星、轨道设施或舰队查看详情 · 殖民地地面仍在持续运转</div>
    </div>
  );
}
