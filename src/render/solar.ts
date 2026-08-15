import type { GameState, Planet } from '../core/types';
import type { Sel } from '../store/useGame';

export const SOLAR_W = 960;
export const SOLAR_H = 620;
const CX = 480, CY = 310, SCALE = 0.82;

export interface SolarHit {
  kind: 'planet' | 'station' | 'fleet';
  id: string;
}

export interface SolarDrawOpts {
  sel: Sel;
  hover: SolarHit | null;
  timeMs: number;
}

function hash2(x: number, y: number, seed: number): number {
  let h = seed ^ (x * 374761393) ^ (y * 668265263);
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 10000) / 10000;
}

/** 行星屏幕坐标 */
export function planetXY(p: Planet): { x: number; y: number } {
  return {
    x: CX + Math.cos(p.angle) * p.orbitRadius * SCALE,
    y: CY + Math.sin(p.orbitRadius * 0.0001 + p.angle) * p.orbitRadius * SCALE * 0.6,
  };
}

export function hitSolar(s: GameState, px: number, py: number): SolarHit | null {
  // 舰队(命中半径大些)
  for (const f of s.solar.fleets) {
    if (Math.hypot(f.x - px, f.y - py) < 22) return { kind: 'fleet', id: f.id };
  }
  // 设施
  for (const st of s.solar.stations) {
    const p = s.solar.planets.find(pp => pp.id === st.planetId);
    if (!p) continue;
    const { x, y } = planetXY(p);
    const ox = x + (st.kind === 'mine' ? 18 : st.kind === 'refinery' ? -18 : 0);
    const oy = y - 18;
    if (Math.hypot(ox - px, oy - py) < 12) return { kind: 'station', id: st.id };
  }
  // 行星
  for (const p of s.solar.planets) {
    const { x, y } = planetXY(p);
    if (Math.hypot(x - px, y - py) < p.size + 6) return { kind: 'planet', id: p.id };
  }
  return null;
}

function drawStar(ctx: CanvasRenderingContext2D, seed: number, W: number, H: number): void {
  for (let i = 0; i < 130; i++) {
    const x = hash2(i * 3 + 1, 9, seed) * W;
    const y = hash2(i * 5 + 2, 17, seed) * H;
    const r = 0.3 + hash2(i, 29, seed) * 1.1;
    const a = 0.25 + hash2(i * 7, 41, seed) * 0.75;
    ctx.fillStyle = `rgba(210,225,255,${a.toFixed(2)})`;
    ctx.fillRect(x, y, r, r);
  }
}

export function drawSolar(ctx: CanvasRenderingContext2D, s: GameState, o: SolarDrawOpts): void {
  const W = SOLAR_W, H = SOLAR_H;
  // 背景
  const grad = ctx.createRadialGradient(CX, CY, 20, CX, CY, 420);
  grad.addColorStop(0, '#101a30');
  grad.addColorStop(1, '#04060d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawStar(ctx, s.seed, W, H);

  // 轨道环
  ctx.lineWidth = 1;
  for (const p of s.solar.planets) {
    ctx.strokeStyle = 'rgba(120,160,220,0.13)';
    ctx.beginPath();
    ctx.ellipse(CX, CY, p.orbitRadius * SCALE, p.orbitRadius * SCALE * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 恒星
  const glow = ctx.createRadialGradient(CX, CY, 4, CX, CY, 48);
  glow.addColorStop(0, '#fff6d8');
  glow.addColorStop(0.4, '#ffd27a');
  glow.addColorStop(1, 'rgba(255,180,80,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(CX, CY, 48, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff2c8';
  ctx.beginPath(); ctx.arc(CX, CY, 16, 0, 7); ctx.fill();

  // 行星
  for (const p of s.solar.planets) {
    const { x, y } = planetXY(p);
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.arc(x + 1, y + 1, p.size, 0, 7); ctx.fill();
    // 球体
    const g = ctx.createRadialGradient(x - p.size * 0.3, y - p.size * 0.3, 1, x, y, p.size);
    g.addColorStop(0, lighten(p.color, 0.5));
    g.addColorStop(1, p.color);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, p.size, 0, 7); ctx.fill();
    // 家园星标记
    if (p.colony) {
      ctx.strokeStyle = 'rgba(74,222,128,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, p.size + 3, 0, 7); ctx.stroke();
    }
    // 名称
    ctx.fillStyle = 'rgba(200,215,240,0.85)';
    ctx.font = '11px "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, x, y + p.size + 13);
    ctx.textAlign = 'left';
    // 选中/悬停
    const isSel = o.sel.kind === 'planet' && o.sel.id === p.id;
    const isHov = o.hover?.kind === 'planet' && o.hover.id === p.id;
    if (isSel || isHov) {
      ctx.strokeStyle = isSel ? '#4da3ff' : 'rgba(160,200,255,0.55)';
      ctx.lineWidth = isSel ? 2 : 1.5;
      ctx.beginPath(); ctx.arc(x, y, p.size + 5, 0, 7); ctx.stroke();
    }
  }

  // 轨道设施
  for (const st of s.solar.stations) {
    const p = s.solar.planets.find(pp => pp.id === st.planetId);
    if (!p) continue;
    const { x, y } = planetXY(p);
    const ox = x + (st.kind === 'mine' ? 18 : st.kind === 'refinery' ? -18 : 0);
    const oy = y - 18;
    const icon = st.kind === 'mine' ? '⛏️' : st.kind === 'refinery' ? '⛽' : st.kind === 'dock' ? '🏗️' : '🛰️';
    ctx.font = '13px sans-serif';
    ctx.fillText(icon, ox - 6, oy + 5);
    const isSel = o.sel.kind === 'station' && o.sel.id === st.id;
    const isHov = o.hover?.kind === 'station' && o.hover.id === st.id;
    if (isSel || isHov) {
      ctx.strokeStyle = isSel ? '#4da3ff' : 'rgba(160,200,255,0.55)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox - 9, oy - 9, 18, 18);
    }
  }

  // 舰队
  for (const f of s.solar.fleets) {
    const bob = Math.sin(o.timeMs / 500) * 2;
    const x = f.x, y = f.y + bob;
    // 舰船图标(三角)
    ctx.fillStyle = '#9ad0ff';
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x - 6, y + 6);
    ctx.lineTo(x + 6, y + 6);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#dff0ff';
    ctx.font = '10px "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${f.name} · ${f.ships.length}舰`, x, y + 16);
    ctx.textAlign = 'left';
    const isSel = o.sel.kind === 'fleet' && o.sel.id === f.id;
    const isHov = o.hover?.kind === 'fleet' && o.hover.id === f.id;
    if (isSel || isHov) {
      ctx.strokeStyle = isSel ? '#4da3ff' : 'rgba(160,200,255,0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.stroke();
    }
  }
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + 255 * amt);
  const g = Math.min(255, ((n >> 8) & 255) + 255 * amt);
  const b = Math.min(255, (n & 255) + 255 * amt);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}
