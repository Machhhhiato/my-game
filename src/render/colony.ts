import type { BuildingTypeId, GameState } from '../core/types';
import type { Sel } from '../store/useGame';
import { BUILDINGS } from '../content/buildings';
import { MAP_W, MAP_H } from '../core/state';

export const TILE = 36;

// ---------- 伪随机 ----------
function hash2(x: number, y: number, seed: number): number {
  let h = seed ^ (x * 374761393) ^ (y * 668265263);
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 10000) / 10000;
}

export interface DrawOpts {
  frac: number;
  sel: Sel;
  hover: { kind: 'building' | 'colonist'; id: string } | null;
  ghost: BuildingTypeId | null;
  mouseTile: { x: number; y: number } | null;
  ghostOk: boolean;
  timeMs: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ---------- 建筑精灵 ----------
function drawBuildingSprite(ctx: CanvasRenderingContext2D, type: BuildingTypeId, px: number, py: number, w: number, h: number, ghost: boolean): void {
  const x = px * TILE, y = py * TILE, W = w * TILE, H = h * TILE;
  if (ghost) { ctx.globalAlpha = 0.55; }
  switch (type) {
    case 'shelter': {
      ctx.fillStyle = '#8a6b4a'; roundRect(ctx, x + 3, y + 8, W - 6, H - 8, 4); ctx.fill();
      ctx.fillStyle = '#7a5638'; roundRect(ctx, x + 3, y + 8, W - 6, H * 0.4, 4); ctx.fill();
      ctx.fillStyle = '#4a3520'; ctx.fillRect(x + W / 2 - 6, y + H - 22, 12, 22);
      ctx.fillStyle = '#d8c8a8'; ctx.fillRect(x + 8, y + H - 14, 14, 8); ctx.fillRect(x + W - 22, y + H - 14, 14, 8);
      break;
    }
    case 'farm': {
      ctx.fillStyle = '#4a3524'; roundRect(ctx, x + 2, y + 2, W - 4, H - 4, 4); ctx.fill();
      ctx.fillStyle = '#3a2a1a';
      for (let r = 0; r < h; r++) {
        ctx.fillRect(x + 6, y + 8 + r * 18, W - 12, 6);
      }
      ctx.fillStyle = '#5fae3f';
      for (let r = 0; r < h; r++) {
        for (let i = 0; i < w * 2; i++) {
          ctx.beginPath(); ctx.arc(x + 10 + i * 17, y + 6 + r * 18, 2.2, 0, 7); ctx.fill();
        }
      }
      break;
    }
    case 'woodcutter': {
      ctx.fillStyle = '#6b5236'; roundRect(ctx, x + 2, y + 2, W - 4, H - 4, 4); ctx.fill();
      ctx.fillStyle = '#8a6b3a'; ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2, 10, 0, 7); ctx.fill();
      ctx.fillStyle = '#c9a86a'; ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2, 6, 0, 7); ctx.fill();
      ctx.fillStyle = '#6b4a2a'; ctx.beginPath(); ctx.arc(x + 12, y + H - 10, 4, 0, 7); ctx.fill();
      ctx.fillStyle = '#7a5a34'; ctx.fillRect(x + W - 16, y + H - 12, 12, 4);
      break;
    }
    case 'mine': {
      ctx.fillStyle = '#55555e';
      ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2 + 4, Math.min(W, H) * 0.4, 0, 7); ctx.fill();
      ctx.fillStyle = '#6f6f78'; ctx.beginPath(); ctx.arc(x + W / 2 - 3, y + H / 2, Math.min(W, H) * 0.32, 0, 7); ctx.fill();
      ctx.fillStyle = '#333'; ctx.fillRect(x + W / 2 + 8, y + 6, 5, 14);
      ctx.strokeStyle = '#aaa'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + W / 2 + 6, y + 6); ctx.lineTo(x + W / 2 + 15, y + 6); ctx.stroke();
      ctx.fillStyle = '#c9a86a'; ctx.fillRect(x + W / 2 + 11, y + 2, 8, 5);
      break;
    }
    case 'kitchen': {
      ctx.fillStyle = '#9a7b52'; roundRect(ctx, x + 3, y + 8, W - 6, H - 8, 4); ctx.fill();
      ctx.fillStyle = '#7a5f3e'; roundRect(ctx, x + 3, y + 8, W - 6, 10, 4); ctx.fill();
      ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(x + W / 2, y + H - 12, 7, 0, 7); ctx.fill();
      ctx.fillStyle = '#d84a2a'; ctx.beginPath(); ctx.arc(x + W / 2, y + H - 12, 4, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(220,220,220,0.4)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x + W / 2 - 4, y + 6, 3, Math.PI, 2 * Math.PI); ctx.stroke();
      break;
    }
    case 'workshop': {
      ctx.fillStyle = '#7a6b52'; roundRect(ctx, x + 3, y + 8, W - 6, H - 8, 4); ctx.fill();
      ctx.fillStyle = '#5f5542'; roundRect(ctx, x + 3, y + 8, W - 6, 10, 4); ctx.fill();
      ctx.fillStyle = '#9aa0a8';
      ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2 + 4, 8, 0, 7); ctx.fill();
      ctx.fillStyle = '#7a6b52'; ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2 + 4, 4, 0, 7); ctx.fill();
      ctx.strokeStyle = '#9aa0a8'; ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x + W / 2 + Math.cos(a) * 8, y + H / 2 + 4 + Math.sin(a) * 8);
        ctx.lineTo(x + W / 2 + Math.cos(a) * 11, y + H / 2 + 4 + Math.sin(a) * 11);
        ctx.stroke();
      }
      break;
    }
    case 'research': {
      ctx.fillStyle = '#8a6b4a'; ctx.fillRect(x + 4, y + H - 8, W - 8, 8);
      ctx.fillStyle = '#6b5236'; ctx.fillRect(x + W / 2 - 3, y + H - 24, 6, 16);
      ctx.fillStyle = '#39c6c0'; ctx.fillRect(x + W / 2 - 3, y + 8, 6, 10);
      ctx.fillStyle = '#7fd8d2'; ctx.beginPath();
      ctx.moveTo(x + W / 2, y + 2); ctx.lineTo(x + W / 2 - 5, y + 8); ctx.lineTo(x + W / 2 + 5, y + 8);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#39c6c0'; ctx.fillRect(x + W / 2 - 12, y + H - 26, 10, 8);
      ctx.fillStyle = '#c8b47a'; ctx.fillRect(x + W / 2 + 3, y + H - 24, 9, 6);
      break;
    }
    case 'solar': {
      ctx.fillStyle = '#2a2f3a'; roundRect(ctx, x + 2, y + 4, W - 4, H - 6, 3); ctx.fill();
      ctx.fillStyle = '#3f6fd8'; ctx.fillRect(x + 6, y + 8, W - 12, H - 14);
      ctx.strokeStyle = '#1e3a7a'; ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(x + 6 + ((W - 12) / 3) * i, y + 8); ctx.lineTo(x + 6 + ((W - 12) / 3) * i, y + H - 6); ctx.stroke();
      }
      break;
    }
    case 'turret': {
      ctx.fillStyle = '#55555e'; ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2, 10, 0, 7); ctx.fill();
      ctx.fillStyle = '#3a3a42'; ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2, 6, 0, 7); ctx.fill();
      ctx.fillStyle = '#333'; ctx.fillRect(x + W / 2, y + H / 2 - 2, 16, 4);
      ctx.fillStyle = '#444'; ctx.fillRect(x + W / 2 + 10, y + H / 2 - 3, 6, 6);
      break;
    }
    case 'medbay': {
      ctx.fillStyle = '#cfcfd6'; roundRect(ctx, x + 3, y + 8, W - 6, H - 8, 4); ctx.fill();
      ctx.fillStyle = '#a8a8b2'; roundRect(ctx, x + 3, y + 8, W - 6, 10, 4); ctx.fill();
      ctx.fillStyle = '#c0392b'; ctx.fillRect(x + W / 2 - 7, y + H / 2 - 2, 14, 4); ctx.fillRect(x + W / 2 - 2, y + H / 2 - 7, 4, 14);
      break;
    }
    case 'armory': {
      ctx.fillStyle = '#6b5a4a'; roundRect(ctx, x + 3, y + 8, W - 6, H - 8, 4); ctx.fill();
      ctx.fillStyle = '#54483c'; roundRect(ctx, x + 3, y + 8, W - 6, 10, 4); ctx.fill();
      // 武器架
      ctx.fillStyle = '#4a4a52';
      ctx.fillRect(x + 8, y + H - 22, 3, 14); ctx.fillRect(x + 8, y + H - 22, 13, 3);
      ctx.fillRect(x + W - 20, y + H - 22, 3, 14); ctx.fillRect(x + W - 20, y + H - 22, 13, 3);
      ctx.fillStyle = '#333';
      ctx.fillRect(x + W / 2 - 7, y + 11, 14, 7);
      break;
    }
    case 'launchpad': {
      ctx.fillStyle = '#8a8f98'; roundRect(ctx, x + 2, y + H - 10, W - 4, 8, 2); ctx.fill();
      ctx.fillStyle = '#6f747c'; ctx.fillRect(x + W / 2 - 12, y + H - 12, 24, 4);
      // 火箭
      const rx = x + W / 2, ry = y + H - 20;
      ctx.fillStyle = '#e8e8ec'; roundRect(ctx, rx - 7, ry - 34, 14, 36, 5); ctx.fill();
      ctx.fillStyle = '#c0392b'; ctx.beginPath();
      ctx.moveTo(rx - 7, ry - 34); ctx.lineTo(rx + 7, ry - 34); ctx.lineTo(rx, ry - 46); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#39a8e8'; ctx.beginPath(); ctx.arc(rx, ry - 20, 3.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#c0392b'; ctx.beginPath();
      ctx.moveTo(rx - 7, ry - 6); ctx.lineTo(rx - 13, ry + 4); ctx.lineTo(rx - 7, ry); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + 7, ry - 6); ctx.lineTo(rx + 13, ry + 4); ctx.lineTo(rx + 7, ry); ctx.closePath(); ctx.fill();
      break;
    }
  }
  ctx.globalAlpha = 1;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- 主绘制 ----------
export function drawColony(ctx: CanvasRenderingContext2D, s: GameState, o: DrawOpts): void {
  const W = MAP_W * TILE, H = MAP_H * TILE;
  // 地面
  ctx.fillStyle = '#1c2a1a';
  ctx.fillRect(0, 0, W, H);
  for (let ty = 0; ty < MAP_H; ty++) {
    for (let tx = 0; tx < MAP_W; tx++) {
      const h = hash2(tx, ty, s.seed);
      ctx.fillStyle = `rgba(46,72,38,${0.10 + h * 0.16})`;
      ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
      if (h > 0.86) {
        ctx.fillStyle = 'rgba(90,120,70,0.55)';
        ctx.beginPath(); ctx.arc(tx * TILE + 8 + h * 20, ty * TILE + 8 + h * 20, 3.5, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(40,60,30,0.6)';
        ctx.beginPath(); ctx.arc(tx * TILE + 8 + h * 20, ty * TILE + 12 + h * 20, 2.2, 0, 7); ctx.fill();
      } else if (h > 0.74) {
        ctx.fillStyle = '#5f6b66';
        ctx.beginPath(); ctx.arc(tx * TILE + 14 + h * 8, ty * TILE + 18 + h * 8, 4, 0, 7); ctx.fill();
        ctx.fillStyle = '#76837e';
        ctx.beginPath(); ctx.arc(tx * TILE + 12 + h * 8, ty * TILE + 16 + h * 8, 2, 0, 7); ctx.fill();
      }
    }
  }
  // 建筑(按 y 排序)
  const sorted = [...s.buildings].sort((a, b) => (a.y + a.h) - (b.y + b.h));
  for (const b of sorted) {
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(b.x * TILE + 3, (b.y + b.h) * TILE - 3, b.w * TILE, 6);
    drawBuildingSprite(ctx, b.type, b.x, b.y, b.w, b.h, false);
    // 选中框
    const isSel = o.sel.kind === 'building' && o.sel.id === b.id;
    const isHov = o.hover?.kind === 'building' && o.hover.id === b.id;
    if (isSel || isHov) {
      ctx.strokeStyle = isSel ? '#4da3ff' : 'rgba(160,200,255,0.55)';
      ctx.lineWidth = isSel ? 2.5 : 1.5;
      ctx.setLineDash(isSel ? [] : [4, 3]);
      roundRect(ctx, b.x * TILE - 2, b.y * TILE - 2, b.w * TILE + 4, b.h * TILE + 4, 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // 受损指示(袭击损坏,维修机器人可修复)
    if (b.hp < 70) {
      ctx.strokeStyle = `rgba(240,90,60,${0.5 + (1 - b.hp / 70) * 0.5})`;
      ctx.lineWidth = 1.5;
      const cx2 = (b.x + b.w / 2) * TILE, cy2 = (b.y + b.h / 2) * TILE;
      ctx.beginPath();
      ctx.moveTo(cx2 - 7, cy2 - 5); ctx.lineTo(cx2, cy2); ctx.lineTo(cx2 + 7, cy2 + 5);
      ctx.moveTo(cx2 + 7, cy2 - 5); ctx.lineTo(cx2, cy2); ctx.lineTo(cx2 - 7, cy2 + 5);
      ctx.stroke();
    }
    // 工作中火花
    const def = BUILDINGS[b.type];
    if (def.produce || def.researchRate || def.healRate) {
      if (b.workerId) {
        const c = s.colonists.find(x => x.id === b.workerId);
        if (c && c.state === 'work') {
          const spark = (o.timeMs / 400) % 2;
          ctx.fillStyle = 'rgba(255,220,120,0.8)';
          ctx.beginPath();
          ctx.arc(b.x * TILE + (spark < 1 ? 8 : b.w * TILE - 8), b.y * TILE - 6, 2.5, 0, 7);
          ctx.fill();
        }
      }
    }
  }

  // 殖民者
  for (const c of s.colonists) {
    if (c.hp <= 0) {
      ctx.fillStyle = 'rgba(150,150,150,0.6)';
      ctx.font = '14px sans-serif';
      ctx.fillText('💀', c.x * TILE - 8, c.y * TILE + 2);
      continue;
    }
    const fx = lerp(c.px, c.x, o.frac) * TILE;
    const fy = lerp(c.py, c.y, o.frac) * TILE;
    const walkBob = c.state === 'walk' ? Math.abs(Math.sin(o.timeMs / 90)) * 2 : 0;
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(fx, fy + 10, 6, 2.6, 0, 0, 7); ctx.fill();
    // 身体
    const hue = (hash2(c.seq, 7, s.seed) * 360) | 0;
    ctx.fillStyle = `hsl(${hue},55%,52%)`;
    ctx.beginPath(); ctx.arc(fx, fy - 5 - walkBob, 6.5, 0, 7); ctx.fill();
    // 头
    ctx.fillStyle = '#e8c39e';
    ctx.beginPath(); ctx.arc(fx, fy - 14 - walkBob, 4.2, 0, 7); ctx.fill();
    // 状态图标
    let emoji = '';
    if (c.state === 'sleep') emoji = '💤';
    else if (c.state === 'eat') emoji = '🍖';
    else if (c.state === 'recreate') emoji = '🎵';
    else if (c.state === 'broken') emoji = '😵';
    else if (c.state === 'work') emoji = '🔧';
    else if (c.state === 'walk') emoji = '🚶';
    if (emoji) {
      ctx.font = '11px sans-serif';
      ctx.fillText(emoji, fx - 6, fy - 22 - walkBob);
    }
    // 血量条
    const mhp = c.traits.includes('tough') ? 130 : c.traits.includes('sickly') ? 70 : 100;
    if (c.hp < mhp) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(fx - 8, fy + 12, 16, 3);
      ctx.fillStyle = c.hp / mhp > 0.5 ? '#4ac24a' : c.hp / mhp > 0.25 ? '#e8a33a' : '#e04a3a';
      ctx.fillRect(fx - 8, fy + 12, 16 * (c.hp / mhp), 3);
    }
    // 选中/悬停
    const isSel = o.sel.kind === 'colonist' && o.sel.id === c.id;
    const isHov = o.hover?.kind === 'colonist' && o.hover.id === c.id;
    if (isSel || isHov) {
      ctx.strokeStyle = isSel ? '#4da3ff' : 'rgba(160,200,255,0.55)';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(fx, fy - 7, 12, 0, 7); ctx.stroke();
      ctx.fillStyle = '#cfe4ff';
      ctx.font = '11px "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.name, fx, fy + 26);
      ctx.textAlign = 'left';
    }
  }

  // 建造幽灵
  if (o.ghost && o.mouseTile) {
    const def = BUILDINGS[o.ghost];
    const gx = o.mouseTile.x, gy = o.mouseTile.y;
    ctx.globalAlpha = o.ghostOk ? 1 : 0.85;
    ctx.fillStyle = o.ghostOk ? 'rgba(90,200,120,0.16)' : 'rgba(220,70,60,0.18)';
    ctx.fillRect(gx * TILE, gy * TILE, def.w * TILE, def.h * TILE);
    drawBuildingSprite(ctx, o.ghost, gx, gy, def.w, def.h, true);
    ctx.strokeStyle = o.ghostOk ? '#5ac878' : '#e04a3a';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    roundRect(ctx, gx * TILE - 1, gy * TILE - 1, def.w * TILE + 2, def.h * TILE + 2, 4);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  // 昼夜滤镜
  const light = 0.55 + 0.45 * Math.cos(s.dayPhase * Math.PI * 2);
  const night = Math.max(0, 0.55 - light);
  if (night > 0.01) {
    ctx.fillStyle = `rgba(10,16,44,${(night * 0.62).toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }

  // 边界线
  ctx.strokeStyle = 'rgba(120,160,200,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
}
