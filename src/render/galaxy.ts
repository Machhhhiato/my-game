import type { GameState } from '../core/types';
import type { Sel } from '../store/useGame';

export const GALAXY_W = 960;
export const GALAXY_H = 620;

export interface GalaxyHit {
  kind: 'system';
  id: string;
}

function hash2(x: number, y: number, seed: number): number {
  let h = seed ^ (x * 374761393) ^ (y * 668265263);
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 10000) / 10000;
}

export function hitGalaxy(s: GameState, px: number, py: number): GalaxyHit | null {
  for (const sys of s.galaxy.systems) {
    if (Math.hypot(sys.x - px, sys.y - py) < 18) return { kind: 'system', id: sys.id };
  }
  return null;
}

export function drawGalaxy(ctx: CanvasRenderingContext2D, s: GameState, opts: { sel: Sel; hover: GalaxyHit | null }): void {
  const W = GALAXY_W, H = GALAXY_H;
  // 背景星云
  const grad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 600);
  grad.addColorStop(0, '#101a2e');
  grad.addColorStop(1, '#03050c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  // 尘埃星点
  for (let i = 0; i < 260; i++) {
    const x = hash2(i * 3 + 1, 9, s.seed) * W;
    const y = hash2(i * 5 + 2, 17, s.seed) * H;
    const r = 0.3 + hash2(i, 29, s.seed) * 1.0;
    const a = 0.2 + hash2(i * 7, 41, s.seed) * 0.6;
    ctx.fillStyle = `rgba(200,215,255,${a.toFixed(2)})`;
    ctx.fillRect(x, y, r, r);
  }
  // 超空间航道
  for (const sys of s.galaxy.systems) {
    for (const linkId of sys.links) {
      const other = s.galaxy.systems.find(x => x.id === linkId);
      if (!other) continue;
      if (sys.id > other.id) continue; // 只画一次
      ctx.strokeStyle = 'rgba(92,184,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sys.x, sys.y);
      ctx.lineTo(other.x, other.y);
      ctx.stroke();
    }
  }
  // 星系节点
  for (const sys of s.galaxy.systems) {
    const isHome = sys.id === s.galaxy.homeId;
    const isSel = opts.sel.kind === 'system' && opts.sel.id === sys.id;
    const isHov = opts.hover?.kind === 'system' && opts.hover.id === sys.id;
    // 光晕
    const glow = ctx.createRadialGradient(sys.x, sys.y, 1, sys.x, sys.y, 20);
    glow.addColorStop(0, sys.owned ? 'rgba(74,222,128,0.8)' : 'rgba(120,180,255,0.7)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(sys.x, sys.y, 20, 0, 7); ctx.fill();
    // 核心
    ctx.fillStyle = sys.owned ? '#7fe09a' : '#9ad0ff';
    ctx.beginPath(); ctx.arc(sys.x, sys.y, isHome ? 7 : 5, 0, 7); ctx.fill();
    // 名称
    ctx.fillStyle = sys.owned ? 'rgba(160,240,180,0.95)' : 'rgba(190,210,240,0.85)';
    ctx.font = '11px "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sys.name, sys.x, sys.y + 20);
    ctx.textAlign = 'left';
    if (sys.owned) {
      ctx.font = '9px "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('我方', sys.x, sys.y - 12);
      ctx.textAlign = 'left';
    }
    if (isSel || isHov) {
      ctx.strokeStyle = isSel ? '#4da3ff' : 'rgba(160,200,255,0.6)';
      ctx.lineWidth = isSel ? 2 : 1.5;
      ctx.beginPath(); ctx.arc(sys.x, sys.y, 14, 0, 7); ctx.stroke();
    }
  }
}
