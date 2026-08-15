import { useEffect, useRef, useState } from 'react';
import { useGame } from '../store/useGame';
import { E } from '../engine';
import { drawWorld, WORLD_W, WORLD_H, hitWorld, type WorldHit } from '../render/world';

export function WorldView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sel = useGame(s => s.sel);
  const select = useGame(s => s.select);
  const version = useGame(s => s.version);
  const [hover, setHover] = useState<WorldHit | null>(null);
  const [zoom, setZoom] = useState(3.5);
  const rotRef = useRef(0);
  const pitchRef = useRef(0);
  const dragRef = useRef<{ sx: number; sy: number; rot: number; pitch: number } | null>(null);
  const draggedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      rotRef.current += 0.00016 * (dt / 16.7); // 星球缓慢自转
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          if (canvas.width !== WORLD_W * dpr || canvas.height !== WORLD_H * dpr) {
            canvas.width = WORLD_W * dpr;
            canvas.height = WORLD_H * dpr;
            canvas.style.width = `${WORLD_W}px`;
            canvas.style.height = `${WORLD_H}px`;
          }
          drawWorld(ctx, E.state, { sel, hover, cam: { zoom, rot: rotRef.current, pitch: pitchRef.current } });
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  });

  void version;

  const toPx = (e: { clientX: number; clientY: number; currentTarget: HTMLCanvasElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (WORLD_W / rect.width),
      y: (e.clientY - rect.top) * (WORLD_H / rect.height),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    dragRef.current = { sx: p.x, sy: p.y, rot: rotRef.current, pitch: pitchRef.current };
    draggedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    if (dragRef.current) {
      const dx = p.x - dragRef.current.sx;
      const dy = p.y - dragRef.current.sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) draggedRef.current = true;
      rotRef.current = dragRef.current.rot - dx * 0.006;
      pitchRef.current = Math.max(-1.2, Math.min(1.2, dragRef.current.pitch + dy * 0.004));
      setHover(null);
      return;
    }
    setHover(hitWorld(E.state, p.x, p.y, { zoom, rot: rotRef.current, pitch: pitchRef.current }));
  };

  const onPointerUp = () => { dragRef.current = null; };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom(prev => Math.max(1, Math.min(10, prev * (e.deltaY < 0 ? 1.15 : 0.87))));
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedRef.current) return;
    const p = toPx(e);
    const hit = hitWorld(E.state, p.x, p.y, { zoom, rot: rotRef.current, pitch: pitchRef.current });
    if (hit?.kind === 'settlement' && hit.id) {
      select(sel.kind === 'settlement' && sel.id === hit.id
        ? { kind: null, id: null }
        : { kind: 'settlement', id: hit.id });
    } else if (hit?.kind === 'tile') {
      select({ kind: 'tile', id: `${hit.x},${hit.y}` });
    } else {
      select({ kind: null, id: null });
    }
  };

  const s = E.state;
  const ownedTiles = s.world.tiles.flat().filter(t => t.ownerId === s.world.playerId).length;
  const landTiles = s.world.tiles.flat().filter(t => t.terrain !== 'ocean' && t.terrain !== 'ice').length;
  const aliveFactions = s.world.factions.filter(f => f.alive && f.id !== 'player').length;

  return (
    <div className="colony-wrap solar-wrap">
      <div className="colony-chips">
        <span className="chip">🟢 领土 {ownedTiles}</span>
        <span className="chip">🏴 势力 {aliveFactions}</span>
        <span className="chip">🌍 统一 {Math.round((ownedTiles / Math.max(1, landTiles)) * 100)}%</span>
        <span className="chip">🔍 滚轮变焦 · 拖拽旋转</span>
      </div>
      <canvas
        ref={canvasRef}
        className="colony-canvas world-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => setHover(null)}
        onClick={onClick}
        onWheel={onWheel}
      />
      <div className="solar-hint">一颗缓慢旋转的星球 · 滚轮变焦 · 拖拽旋转 · 点击地块/据点查看</div>
    </div>
  );
}
