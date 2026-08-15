import type { GameState } from '../core/types';
import type { Sel } from '../store/useGame';
import { terrainAtLonLat } from '../content/world';

export const WORLD_W = 600;
export const WORLD_H = 600;

export interface WorldCamera {
  zoom: number;   // 1 = 整颗星球, 8 = 贴近地表
  rot: number;    // 经度旋转(自转 + 拖拽)
  pitch: number;  // 纬度偏移(拖拽)
}

export interface WorldHit {
  kind: 'tile' | 'settlement';
  x: number; y: number;
  id?: string;
}

const TEX_W = 2048;
const TEX_H = 1024;

const TERRAIN_COLORS: Record<string, string> = {
  ocean: '#16385c', coast: '#2a4a6a', plains: '#6d8a4e',
  forest: '#3c6b3a', mountain: '#7a7a70', desert: '#b0a060', river: '#4a8ac0', ice: '#e8eef4',
};

function terrainColorAt(u: number, v: number, seed: number): string {
  const lon = u * Math.PI * 2;
  const latDeg = (v - 0.5) * 180;
  return TERRAIN_COLORS[terrainAtLonLat(lon, latDeg, seed)];
}

// ===== 据点矢量图标 =====
function drawSettlementIcon(g: CanvasRenderingContext2D, px: number, py: number, s: number, isPlayer: boolean, level: number, hostile: boolean): void {
  g.save();
  g.translate(px, py);
  if (isPlayer) {
    const c = '#f0e6c8';
    if (level <= 1) {
      g.fillStyle = c;
      g.fillRect(-s * 0.4, -s * 0.1, s * 0.8, s * 0.6);
      g.fillStyle = '#c89a5a';
      g.beginPath(); g.moveTo(-s * 0.5, -s * 0.1); g.lineTo(0, -s * 0.7); g.lineTo(s * 0.5, -s * 0.1); g.closePath(); g.fill();
    } else if (level === 2) {
      g.fillStyle = c;
      g.fillRect(-s * 0.7, -s * 0.15, s * 0.6, s * 0.7);
      g.fillRect(s * 0.1, -s * 0.15, s * 0.6, s * 0.7);
      g.fillStyle = '#c89a5a';
      g.beginPath(); g.moveTo(-s * 0.8, -s * 0.15); g.lineTo(-s * 0.4, -s * 0.7); g.lineTo(0, -s * 0.15); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(s * 0, -s * 0.15); g.lineTo(s * 0.4, -s * 0.7); g.lineTo(s * 0.8, -s * 0.15); g.closePath(); g.fill();
    } else if (level === 3) {
      g.fillStyle = '#9aa0a8';
      g.fillRect(-s * 0.6, -s * 0.3, s * 1.2, s * 0.9);
      for (let i = -1; i <= 1; i++) g.fillRect(i * s * 0.5 - s * 0.08, -s * 0.55, s * 0.16, s * 0.3);
    } else if (level === 4) {
      g.fillStyle = '#b8bcc4';
      g.fillRect(-s * 0.8, -s * 0.4, s * 0.5, s * 1.0);
      g.fillRect(-s * 0.2, -s * 0.7, s * 0.5, s * 1.3);
      g.fillRect(s * 0.4, -s * 0.3, s * 0.5, s * 0.9);
    } else {
      g.fillStyle = '#c8ccd4';
      g.fillRect(-s * 0.9, -s * 0.2, s * 0.45, s * 1.1);
      g.fillRect(-s * 0.35, -s * 0.85, s * 0.4, s * 1.6);
      g.fillRect(s * 0.15, -s * 0.5, s * 0.4, s * 1.3);
      g.fillRect(s * 0.6, -s * 0.15, s * 0.4, s * 1.0);
    }
  } else if (hostile) {
    g.fillStyle = '#e04a3a';
    g.beginPath(); g.arc(0, -s * 0.15, s * 0.5, 0, 7); g.fill();
    g.fillRect(-s * 0.5, s * 0.05, s * 1.0, s * 0.55);
    g.fillStyle = '#1a0a08';
    g.fillRect(-s * 0.3, -s * 0.3, s * 0.18, s * 0.2);
    g.fillRect(s * 0.12, -s * 0.3, s * 0.18, s * 0.2);
    g.fillRect(-s * 0.35, s * 0.3, s * 0.7, s * 0.1);
  } else {
    g.fillStyle = '#e0c04a';
    g.beginPath(); g.moveTo(0, -s * 0.7); g.lineTo(s * 0.6, s * 0.4); g.lineTo(-s * 0.6, s * 0.4); g.closePath(); g.fill();
    g.fillStyle = '#5a4a20';
    g.fillRect(-s * 0.1, s * 0.1, s * 0.2, s * 0.3);
  }
  g.restore();
}

// ===== 分层贴图缓存 =====
let terrainTex: HTMLCanvasElement | null = null;
let terrainSeed = -1;
let mapTex: HTMLCanvasElement | null = null;
let mapData: Uint8ClampedArray | null = null;
let mapKey = '';

function mapKeyOf(s: GameState): string {
  let owned = 0;
  for (const row of s.world.tiles) for (const t of row) if (t.ownerId) owned++;
  return `${owned}:${s.world.reveal.flat().filter(Boolean).length}:${s.world.settlements.length}:${s.world.factions.filter(f => f.alive).length}`;
}

/** 静态地形层(噪声逐像素, 只生成一次) */
function buildTerrainTex(s: GameState): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d')!;
  const img = g.createImageData(TEX_W, TEX_H);
  for (let py = 0; py < TEX_H; py++) {
    for (let px = 0; px < TEX_W; px++) {
      const col = terrainColorAt(px / TEX_W, py / TEX_H, s.seed);
      const r = parseInt(col.slice(1, 3), 16), gg = parseInt(col.slice(3, 5), 16), b = parseInt(col.slice(5, 7), 16);
      const i = (py * TEX_W + px) * 4;
      img.data[i] = r; img.data[i + 1] = gg; img.data[i + 2] = b; img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

/** 动态层合成到地形上 */
function buildMapTex(s: GameState): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d')!;
  g.drawImage(terrainTex!, 0, 0);
  const sx = TEX_W / s.world.w, sy = TEX_H / s.world.h;

  // 领土
  for (let y = 0; y < s.world.h; y++) {
    for (let x = 0; x < s.world.w; x++) {
      const t = s.world.tiles[y][x];
      if (t.ownerId) {
        const f = s.world.factions.find(fc => fc.id === t.ownerId);
        if (f) { g.fillStyle = f.color + '38'; g.fillRect(x * sx, y * sy, sx, sy); }
      }
    }
  }
  // 河流
  g.strokeStyle = '#4a8ac0';
  g.lineWidth = 1.6;
  for (let y = 0; y < s.world.h; y++) {
    for (let x = 0; x < s.world.w; x++) {
      if (s.world.tiles[y][x].terrain === 'river') {
        g.beginPath(); g.moveTo(x * sx, y * sy + sy / 2); g.lineTo((x + 1) * sx, y * sy + sy / 2); g.stroke();
      }
    }
  }
  // 道路
  for (const r of s.world.roads) {
    g.strokeStyle = '#8a7a5a';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo((r.from.x + 0.5) * sx, (r.from.y + 0.5) * sy);
    g.lineTo((r.to.x + 0.5) * sx, (r.to.y + 0.5) * sy);
    g.stroke();
  }
  // 据点
  const isz = Math.max(7, sy * 1.6);
  for (const st of s.world.settlements) {
    const f = s.world.factions.find(fc => fc.id === st.factionId);
    drawSettlementIcon(g, (st.x + 0.5) * sx, (st.y + 0.5) * sy, isz, st.factionId === s.world.playerId, st.level, f ? f.attitude === 'hostile' : false);
  }
  // 视野雾
  for (let y = 0; y < s.world.h; y++) {
    for (let x = 0; x < s.world.w; x++) {
      if (!s.world.reveal[y][x]) {
        g.fillStyle = 'rgba(3,5,12,0.85)';
        g.fillRect(x * sx, y * sy, sx + 0.5, sy + 0.5);
      }
    }
  }
  return c;
}

// ===== 星空(加深, 分层) =====
let starField: HTMLCanvasElement | null = null;
function buildStars(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = WORLD_W; c.height = WORLD_H;
  const g = c.getContext('2d')!;
  g.fillStyle = '#010208';
  g.fillRect(0, 0, WORLD_W, WORLD_H);

  // 银河带(斜向微弱亮带)
  const band = g.createLinearGradient(0, 0, WORLD_W, WORLD_H);
  band.addColorStop(0, 'rgba(80,100,160,0)');
  band.addColorStop(0.5, 'rgba(90,110,170,0.06)');
  band.addColorStop(1, 'rgba(80,100,160,0)');
  g.fillStyle = band;
  g.save();
  g.translate(WORLD_W / 2, WORLD_H / 2);
  g.rotate(-0.5);
  g.fillRect(-WORLD_W, -80, WORLD_W * 2, 160);
  g.restore();

  // 星云 3 团
  const nebulae = [[0.2, 0.3, 'rgba(60,40,120,0.08)'], [0.75, 0.65, 'rgba(30,60,130,0.09)'], [0.5, 0.85, 'rgba(90,50,100,0.07)']];
  for (const [nx, ny, col] of nebulae as [number, number, string][]) {
    const rg = g.createRadialGradient(nx * WORLD_W, ny * WORLD_H, 0, nx * WORLD_W, ny * WORLD_H, 140);
    rg.addColorStop(0, col);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, WORLD_W, WORLD_H);
  }

  // 远景暗星
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(160,180,210,${(0.12 + Math.random() * 0.4).toFixed(2)})`;
    g.fillRect(Math.random() * WORLD_W, Math.random() * WORLD_H, 0.4 + Math.random() * 0.6, 0.4 + Math.random() * 0.6);
  }
  // 近景亮星(带光晕)
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * WORLD_W, y = Math.random() * WORLD_H;
    const r = 0.6 + Math.random() * 1.0;
    const gl = g.createRadialGradient(x, y, 0, x, y, r * 4);
    gl.addColorStop(0, 'rgba(220,235,255,0.9)');
    gl.addColorStop(0.3, 'rgba(180,200,240,0.25)');
    gl.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gl;
    g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
    g.fillStyle = '#eef4ff';
    g.fillRect(x - r / 2, y - r / 2, r, r);
  }
  return c;
}

// ===== 命中检测 =====
function cameraDistance(zoom: number): number {
  // zoom=1 → d≈2.48, 星球占画布约 95%; zoom 越大越贴近地表
  return 1 + 1.48 / zoom;
}

function rayHit(sx: number, sy: number, cam: WorldCamera): { u: number; v: number } | null {
  const d = cameraDistance(cam.zoom);
  const fov = (50 / cam.zoom) * (Math.PI / 180);
  const scale = 2 * d * Math.tan(fov / 2) / WORLD_H;
  const px = (sx - WORLD_W / 2) * scale;
  const py = (sy - WORLD_H / 2) * scale;
  const len = Math.hypot(px, py, d);
  const nx = px / len, ny = py / len, nz = -d / len;
  const b = 2 * d * nz, cc = d * d - 1;
  const disc = b * b - 4 * cc;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / 2;
  if (t <= 0) return null;
  const wx = nx * t, wy = ny * t, wz = nz * t + d;
  // 绕 X 轴旋转(相机 pitch, 真实球面旋转而非纬度平移)
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const wy2 = wy * cp + wz * sp;
  const wz2 = -wy * sp + wz * cp;
  const lon = Math.atan2(wx, wz2);
  const lat = Math.asin(Math.max(-1, Math.min(1, wy2)));
  let u = ((lon / (2 * Math.PI)) + 0.5 + cam.rot) % 1;
  if (u < 0) u += 1;
  let v = lat / Math.PI + 0.5;
  v = Math.max(0, Math.min(1, v));
  return { u, v };
}

export function hitWorld(s: GameState, sx: number, sy: number, cam: WorldCamera): WorldHit | null {
  const w = rayHit(sx, sy, cam);
  if (!w) return null;
  const tx = Math.floor(w.u * s.world.w), ty = Math.floor(w.v * s.world.h);
  if (tx < 0 || ty < 0 || tx >= s.world.w || ty >= s.world.h) return null;
  for (const st of s.world.settlements) {
    const du = Math.abs(st.x / s.world.w - w.u);
    const dv = Math.abs(st.y / s.world.h - w.v);
    if (du < 0.015 && dv < 0.03) return { kind: 'settlement', x: st.x, y: st.y, id: st.id };
  }
  return { kind: 'tile', x: tx, y: ty };
}

// ===== 渲染 =====
let composite: HTMLCanvasElement | null = null;
let sphereCanvas: HTMLCanvasElement | null = null;

export function drawWorld(ctx: CanvasRenderingContext2D, s: GameState, opts: { sel: Sel; hover: WorldHit | null; cam: WorldCamera }): void {
  const W = WORLD_W, H = WORLD_H;
  if (!starField) starField = buildStars();
  if (!terrainTex || terrainSeed !== s.seed) { terrainTex = buildTerrainTex(s); terrainSeed = s.seed; }
  const mk = mapKeyOf(s);
  if (!mapTex || !mapData || mapKey !== mk) {
    mapTex = buildMapTex(s);
    mapData = mapTex.getContext('2d')!.getImageData(0, 0, TEX_W, TEX_H).data;
    mapKey = mk;
  }
  if (!composite) { composite = document.createElement('canvas'); composite.width = W; composite.height = H; }
  if (!sphereCanvas) { sphereCanvas = document.createElement('canvas'); sphereCanvas.width = W; sphereCanvas.height = H; }
  const g = composite.getContext('2d')!;
  const sg = sphereCanvas.getContext('2d')!;

  // 星空背景(不透明底)
  g.drawImage(starField, 0, 0, W, H);

  // 球面逐像素渲染(球外透明)
  const img = sg.createImageData(W, H);
  const data = img.data;
  const td = mapData;
  const d = cameraDistance(opts.cam.zoom);
  const fov = (50 / opts.cam.zoom) * (Math.PI / 180);
  const scale = 2 * d * Math.tan(fov / 2) / H;
  const rot = opts.cam.rot, pitch = opts.cam.pitch;

  for (let sy = 0; sy < H; sy++) {
    const py = (sy - H / 2) * scale;
    for (let sx = 0; sx < W; sx++) {
      const px = (sx - W / 2) * scale;
      const len = Math.hypot(px, py, d);
      const nx = px / len, ny = py / len, nz = -d / len;
      const b = 2 * d * nz, cc = d * d - 1;
      const disc = b * b - 4 * cc;
      const i = (sy * W + sx) * 4;
      if (disc < 0) { data[i + 3] = 0; continue; }
      const t = (-b - Math.sqrt(disc)) / 2;
      if (t <= 0) { data[i + 3] = 0; continue; }
      const wx = nx * t, wy = ny * t, wz = nz * t + d;
      // 绕 X 轴旋转(相机 pitch, 真实球面旋转)
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const wy2 = wy * cp + wz * sp;
      const wz2 = -wy * sp + wz * cp;
      const lon = Math.atan2(wx, wz2);
      const lat = Math.asin(Math.max(-1, Math.min(1, wy2)));
      let u = ((lon / (2 * Math.PI)) + 0.5 + rot) % 1;
      if (u < 0) u += 1;
      let v = lat / Math.PI + 0.5;
      v = Math.max(0, Math.min(1, v));
      const txi = Math.min(TEX_W - 1, Math.floor(u * TEX_W));
      const tyi = Math.min(TEX_H - 1, Math.floor(v * TEX_H));
      const ti = (tyi * TEX_W + txi) * 4;
      data[i] = td[ti];
      data[i + 1] = td[ti + 1];
      data[i + 2] = td[ti + 2];
      data[i + 3] = 255;
    }
  }
  sg.putImageData(img, 0, 0);
  // 球面画到星空之上(球外透明保留星空, 无残影)
  g.drawImage(sphereCanvas, 0, 0);

  // 统一缩放到物理画布
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(composite, 0, 0, ctx.canvas.width, ctx.canvas.height);
}
