import { useEffect, useRef, useState } from 'react';
import { useGame, getTickFrac } from '../store/useGame';
import { E } from '../engine';
import { drawColony, TILE } from '../render/colony';
import { MAP_W, MAP_H } from '../core/state';
import { calcDefense, calcPower } from '../core/tick';
import { BUILDINGS } from '../content/buildings';
import type { GameState } from '../core/types';

interface Hit {
  kind: 'building' | 'colonist';
  id: string;
}

function hitTest(s: GameState, tx: number, ty: number): Hit | null {
  for (const b of s.buildings) {
    if (tx >= b.x && tx < b.x + b.w && ty >= b.y && ty < b.y + b.h) {
      return { kind: 'building', id: b.id };
    }
  }
  for (const c of s.colonists) {
    if (c.hp <= 0) continue;
    const dx = c.x - (tx + 0.5), dy = c.y - (ty + 0.5);
    if (dx * dx + dy * dy < 0.64) return { kind: 'colonist', id: c.id };
  }
  return null;
}

export function ColonyView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sel = useGame(s => s.sel);
  const select = useGame(s => s.select);
  const ghost = useGame(s => s.ghost);
  const setGhost = useGame(s => s.setGhost);
  const setToast = useGame(s => s.setToast);
  const refresh = useGame(s => s.refresh);
  const version = useGame(s => s.version);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<Hit | null>(null);

  // 渲染循环
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          const W = MAP_W * TILE, H = MAP_H * TILE;
          if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
          }
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          drawColony(ctx, E.state, {
            frac: getTickFrac(),
            sel,
            hover,
            ghost,
            mouseTile: mouse,
            ghostOk: ghost && mouse ? !E.canPlace(ghost, mouse.x, mouse.y) : false,
            timeMs: t,
          });
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [sel, hover, ghost, mouse]);

  void version;

  const tileFromEvent = (e: { clientX: number; clientY: number; currentTarget: HTMLCanvasElement }): { x: number; y: number } | null => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = (MAP_W * TILE) / rect.width;
    const scaleY = (MAP_H * TILE) / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    if (px < 0 || py < 0 || px >= MAP_W * TILE || py >= MAP_H * TILE) return null;
    return { x: Math.floor(px / TILE), y: Math.floor(py / TILE) };
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const tile = tileFromEvent(e);
    setMouse(tile);
    if (tile) setHover(hitTest(E.state, tile.x, tile.y));
    else setHover(null);
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const tile = tileFromEvent(e);
    if (!tile) return;
    if (ghost) {
      const err = E.placeBuilding(ghost, tile.x, tile.y);
      if (err) {
        setToast(`❌ ${err}`);
      } else {
        const def = BUILDINGS[ghost];
        setToast(`✅ 建成 ${def.icon}${def.name}`);
        refresh();
      }
      return;
    }
    const hit = hitTest(E.state, tile.x, tile.y);
    if (hit) {
      select(
        sel.kind === hit.kind && sel.id === hit.id
          ? { kind: null, id: null }
          : { kind: hit.kind, id: hit.id },
      );
    } else {
      select({ kind: null, id: null });
    }
  };

  const onRightClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (ghost) setGhost(null);
  };

  const s = E.state;
  const defense = calcDefense(s);
  const power = calcPower(s);

  return (
    <div className="colony-wrap">
      <div className="colony-chips">
        <span className="chip" title="防御力(炮塔+战斗技能)">🛡️ 防御 {defense.toFixed(1)}</span>
        <span className="chip" title="电力效率(供电/需求)">⚡ 电力 {Math.round(power * 100)}%</span>
        <span className="chip">👥 人口 {s.colonists.filter(c => c.hp > 0).length}/{s.colonists.length}</span>
        {ghost && <span className="chip warn">🔨 建造模式 · 右键取消</span>}
      </div>
      <canvas
        ref={canvasRef}
        className="colony-canvas"
        onPointerMove={onMove}
        onPointerLeave={() => { setMouse(null); setHover(null); }}
        onClick={onClick}
        onContextMenu={onRightClick}
      />
    </div>
  );
}
