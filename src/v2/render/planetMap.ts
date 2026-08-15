// ============ 星球地图渲染器：完整矩形视口，远景球面 → 中近景局部切平面，多层合成，18 功能区群 ============
import type { CampaignSaveV2, MapLayerId, MapNode } from '../types';
import { NODES, REGIONS } from '../data';
import {
  TEX_W, TEX_H, buildBaseTexture, getRivers, preciseTerrainRGB, inRegion, WATER_NET, ROAD_NET, VALLEY_RIDGES,
} from './terrain';
import { buildLayerTexture } from './layers';
import { mulberry32 } from './noise';

export const PLANE_ZOOM = 2.2;     // 中近景起点：局部切平面
const CLUSTER_ZOOM = 5.0;          // 功能区群出现
const D2R = Math.PI / 180;
const FOV_RAD = 50 * D2R;

export interface MapViewport { width: number; height: number }

export interface MapCamera {
  zoom: number;   // 1..10
  rot: number;    // 经度旋转 0..1
  pitch: number;  // 纬度俯仰（弧度）
}

/** 远景球直径占 min(width,height) 的比例 */
function planetFill(zoom: number): number {
  return 0.47 + 0.28 * zoom;
}

function cameraDistance(zoom: number): number {
  // 远景用近乎正交的大距离，保证显示接近完整半球（约 160°），而非局部放大
  void zoom;
  return 7;
}

function isPlane(cam: MapCamera): boolean {
  return cam.zoom >= PLANE_ZOOM;
}

function camCenter(cam: MapCamera): { lon: number; lat: number } {
  const lon = (((cam.rot + 0.5) % 1) + 1) % 1 * 360;
  return { lon, lat: -cam.pitch / D2R };
}

function pxPerDeg(cam: MapCamera): number {
  return 22 * cam.zoom;
}

function angularDistDeg(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const dLon = ((lon2 - lon1 + 180) % 360 + 360) % 360 - 180;
  const dLat = lat2 - lat1;
  const a = Math.sin(dLat * D2R / 2) ** 2 +
    Math.cos(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.sin(dLon * D2R / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) / D2R;
}

function distToPolylineDeg(lon: number, lat: number, poly: [number, number][]): number {
  let best = Infinity;
  for (let i = 0; i < poly.length - 1; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[i + 1];
    const d = pointSegDist(lon, lat, ax, ay, bx, by);
    if (d < best) best = d;
  }
  return best;
}

function pointSegDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return angularDistDeg(px, py, cx, cy);
}

// ===== 投影：经纬度 → 屏幕（远景球面 / 中近景切平面） =====
export function lonLatToScreen(lonDeg: number, latDeg: number, cam: MapCamera, vp: MapViewport): { x: number; y: number; visible: boolean } {
  if (isPlane(cam)) {
    const c = camCenter(cam);
    const ppd = pxPerDeg(cam);
    const dLon = ((lonDeg - c.lon + 180) % 360 + 360) % 360 - 180;
    const x = vp.width / 2 + dLon * ppd;
    const y = vp.height / 2 - (latDeg - c.lat) * ppd;
    const margin = 120;
    return { x, y, visible: x > -margin && x < vp.width + margin && y > -margin && y < vp.height + margin };
  }
  const d = cameraDistance(cam.zoom);
  const fill = planetFill(cam.zoom);
  const Rpx = fill * Math.min(vp.width, vp.height) / 2;
  const scale = (d / Math.sqrt(d * d - 1)) / Rpx;
  const cx = vp.width / 2, cy = vp.height / 2;
  const u = lonDeg / 360;
  const v = (90 - latDeg) / 180;
  let lonU = u - cam.rot;
  lonU = ((lonU % 1) + 1) % 1;
  const lon = (lonU - 0.5) * 2 * Math.PI;
  const lat = (v - 0.5) * Math.PI;
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const wx = Math.cos(lat) * Math.sin(lon);
  const wy2 = Math.sin(lat);
  const wz2 = Math.cos(lat) * Math.cos(lon);
  const wy = wy2 * cp - wz2 * sp;
  const wz = wy2 * sp + wz2 * cp;
  const visible = wz > 1 / d;
  const dx = wx, dy = wy, dz = wz - d;
  const nlen = Math.hypot(dx, dy, dz);
  if (nlen < 1e-6) return { x: 0, y: 0, visible: false };
  const nx = dx / nlen, ny = dy / nlen, nz = dz / nlen;
  if (nz >= -1e-4) return { x: 0, y: 0, visible: false };
  const px = -d * nx / nz;
  const py = -d * ny / nz;
  return { x: px / scale + cx, y: py / scale + cy, visible };
}

/** 使指定经纬度对准画面中心的相机旋转/俯仰 */
export function focusCamera(lonDeg: number, latDeg: number): { rot: number; pitch: number } {
  let rot = lonDeg / 360 - 0.5;
  rot = ((rot % 1) + 1) % 1;
  return { rot, pitch: -latDeg * D2R };
}

// ===== 远景合成纹理缓存（基础地形 + 多个图层） =====
let compositeData: Uint8ClampedArray | null = null;
let compositeKey = '';

function getComposite(seed: number, layers: MapLayerId[]): { data: Uint8ClampedArray } {
  const key = `${seed}:${layers.join(',')}`;
  if (!compositeData || compositeKey !== key) {
    const base = buildBaseTexture(seed);
    const c = document.createElement('canvas');
    c.width = TEX_W; c.height = TEX_H;
    const g = c.getContext('2d')!;
    g.drawImage(base, 0, 0);
    for (const layer of layers) {
      g.drawImage(buildLayerTexture(seed, layer), 0, 0);
    }
    compositeData = g.getImageData(0, 0, TEX_W, TEX_H).data;
    compositeKey = key;
  }
  return { data: compositeData };
}

// ===== 中近景切平面补丁（原生重采样，降采样后放大） =====
let patchCanvas: HTMLCanvasElement | null = null;
let patchKey = '';

function applyTint(lon: number, lat: number, seed: number, layers: MapLayerId[], base: [number, number, number]): [number, number, number] {
  const mix = (cur: [number, number, number], r: number, g: number, b: number, a: number): [number, number, number] => [
    cur[0] * (1 - a) + r * a, cur[1] * (1 - a) + g * a, cur[2] * (1 - a) + b * a,
  ];
  let cur = base;
  for (const layer of layers) {
    if (layer === 'political') {
      if (inRegion('emerald_valley', lon, lat)) cur = mix(cur, 212, 168, 72, 0.025);
      else if (inRegion('old_ferry', lon, lat)) {
        const h = Math.sin(lon * 90) + Math.sin(lat * 130);
        cur = mix(cur, 79, 156, 183, h > 0 ? 0.03 : 0.012);
      }
      else if (inRegion('south_acid', lon, lat)) cur = mix(cur, 184, 97, 88, 0.025);
    } else if (layer === 'population') {
      let best = Infinity; let c: [number, number, number] = [212, 168, 72];
      for (const n of NODES) {
        const dd = angularDistDeg(lon, lat, n.lon, n.lat);
        if (dd < best) {
          best = dd;
          c = n.symbol === 'warmlight' ? [212, 168, 72] : n.symbol === 'waylight' ? [115, 203, 231] : [220, 229, 226];
        }
      }
      const glow = Math.max(0, 1 - best / 2.2) * 0.12;
      cur = mix(cur, c[0], c[1], c[2], glow);
    } else {
      if (inRegion('south_acid', lon, lat)) cur = mix(cur, 124, 96, 80, 0.10);
      else if (distToPolylineDeg(lon, lat, getRivers(seed)[0]) < 0.8) cur = mix(cur, 115, 203, 231, 0.08);
      else if (inRegion('emerald_valley', lon, lat)) cur = mix(cur, 217, 235, 209, 0.025);
    }
  }
  return cur;
}

function buildPatch(state: CampaignSaveV2, cam: MapCamera, layers: MapLayerId[], resW: number, resH: number, degPerPx: number): HTMLCanvasElement {
  const seed = state.seed;
  const c = document.createElement('canvas');
  c.width = resW; c.height = resH;
  const g = c.getContext('2d')!;
  const img = g.createImageData(resW, resH);
  const data = img.data;
  const center = camCenter(cam);
  for (let py = 0; py < resH; py++) {
    const lat = center.lat - (py - resH / 2) * degPerPx;
    for (let px = 0; px < resW; px++) {
      const lon = center.lon + (px - resW / 2) * degPerPx;
      let [r, gg, bb] = preciseTerrainRGB(lon, lat, seed);
      [r, gg, bb] = applyTint(lon, lat, seed, layers, [r, gg, bb]);
      const i = (py * resW + px) * 4;
      data[i] = r; data[i + 1] = gg; data[i + 2] = bb; data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function getPatch(state: CampaignSaveV2, cam: MapCamera, layers: MapLayerId[], vp: MapViewport, fast: boolean): HTMLCanvasElement {
  const maxDim = Math.min(vp.width, vp.height);
  const cap = fast ? 360 : 1100;
  const scale = Math.min(1, cap / maxDim);
  const resW = Math.max(160, Math.round(vp.width * scale));
  const resH = Math.max(96, Math.round(vp.height * scale));
  const degPerPx = 1 / (pxPerDeg(cam) * scale);
  const bucket = fast ? 0.006 : 0.0025;
  const key = `${state.seed}:${layers.join(',')}:${resW}x${resH}:${Math.round(cam.rot / bucket)}:${Math.round(cam.pitch / (fast ? 0.05 : 0.02))}:${Math.round(cam.zoom * (fast ? 1.5 : 2))}`;
  if (!patchCanvas || patchKey !== key) {
    patchCanvas = buildPatch(state, cam, layers, resW, resH, degPerPx);
    patchKey = key;
  }
  return patchCanvas;
}

// ===== 节点命中 =====
export function hitNode(state: CampaignSaveV2, sx: number, sy: number, cam: MapCamera, vp: MapViewport): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const n of state.nodes) {
    const p = lonLatToScreen(n.lon, n.lat, cam, vp);
    if (!p.visible) continue;
    const dd = Math.hypot(p.x - sx, p.y - sy);
    const r = nodeRadius(n, cam.zoom) + 8;
    if (dd < r && dd < bestD) { bestD = dd; best = n.id; }
  }
  return best;
}

function nodeRadius(n: MapNode, zoom: number): number {
  const base = n.symbol === 'wellhead' ? 11 : n.symbol === 'warmlight' ? 9 : 8;
  return Math.max(base, base + (zoom - 1) * 1.2);
}

// ===== 节点矢量符号 =====
function glow(g: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number): void {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, color);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.save();
  g.globalAlpha = alpha;
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, r * 2, r * 2);
  g.restore();
}

function drawNodeMarker(g: CanvasRenderingContext2D, n: MapNode, x: number, y: number, s: number, selected: boolean, hovered: boolean): void {
  g.save();
  g.translate(x, y);
  if (n.symbol === 'wellhead') {
    glow(g, 0, 0, s * 2.4, 'rgba(220,229,226,0.4)', 0.4);
    g.strokeStyle = '#DCE5E2';
    g.lineWidth = 1.4;
    g.beginPath(); g.arc(0, 0, s, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#DCE5E2';
    g.beginPath(); g.arc(0, 0, s * 0.3, 0, Math.PI * 2); g.fill();
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
      g.beginPath();
      g.moveTo(Math.cos(a) * s * 0.55, Math.sin(a) * s * 0.55);
      g.lineTo(Math.cos(a) * s * 1.2, Math.sin(a) * s * 1.2);
      g.stroke();
    }
  } else if (n.symbol === 'warmlight') {
    glow(g, 0, 0, s * 2.8, 'rgba(212,168,72,0.42)', 0.4);
    g.fillStyle = '#D4A848';
    const pts = [[0, -s * 0.55], [s * 0.5, -s * 0.15], [s * 0.32, s * 0.48], [-s * 0.32, s * 0.48], [-s * 0.5, -s * 0.15]];
    for (const [dx, dy] of pts) {
      g.beginPath(); g.arc(dx, dy, s * 0.2, 0, Math.PI * 2); g.fill();
    }
    g.beginPath(); g.arc(0, 0, s * 0.18, 0, Math.PI * 2); g.fill();
  } else {
    glow(g, 0, 0, s * 2.4, 'rgba(115,203,231,0.38)', 0.38);
    g.fillStyle = '#73CBE7';
    g.globalAlpha = 0.85;
    g.beginPath();
    g.moveTo(0, -s * 0.65); g.lineTo(s * 0.55, s * 0.32); g.lineTo(-s * 0.55, s * 0.32);
    g.closePath(); g.fill();
    g.globalAlpha = 0.65;
    for (let k = 0; k < 3; k++) {
      g.beginPath(); g.arc((k - 1) * s * 0.45, s * 0.6, s * 0.15, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }
  g.restore();
  if (hovered && !selected) {
    g.save();
    g.strokeStyle = '#73CBE7';
    g.lineWidth = 1;
    g.beginPath(); g.arc(x, y, s * 1.4, 0, Math.PI * 2); g.stroke();
    g.restore();
  }
  if (selected) {
    g.save();
    g.strokeStyle = '#73CBE7';
    g.lineWidth = 1.2;
    g.beginPath(); g.arc(x, y, s * 1.4, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = 'rgba(212,168,72,0.6)';
    g.lineWidth = 1;
    g.beginPath(); g.arc(x, y, s * 1.75, 0, Math.PI * 2); g.stroke();
    g.restore();
  }
}

// ===== 矢量折线 =====
function strokePolyline(g: CanvasRenderingContext2D, poly: [number, number][], cam: MapCamera, vp: MapViewport, color: string, width: number, dash: number[] | null): void {
  g.save();
  g.strokeStyle = color;
  g.lineWidth = width;
  g.lineJoin = 'round';
  g.lineCap = 'round';
  if (dash) g.setLineDash(dash);
  g.beginPath();
  let started = false;
  for (const [lon, lat] of poly) {
    const p = lonLatToScreen(lon, lat, cam, vp);
    if (!p.visible) { started = false; continue; }
    if (!started) { g.moveTo(p.x, p.y); started = true; }
    else g.lineTo(p.x, p.y);
  }
  g.stroke();
  g.restore();
}

function strokePolygon(g: CanvasRenderingContext2D, poly: [number, number][], cam: MapCamera, vp: MapViewport, color: string, width: number, dash: number[] | null): void {
  g.save();
  g.strokeStyle = color;
  g.lineWidth = width;
  if (dash) g.setLineDash(dash);
  g.beginPath();
  let started = false;
  for (const [lon, lat] of poly) {
    const p = lonLatToScreen(lon, lat, cam, vp);
    if (!p.visible) { started = false; continue; }
    if (!started) { g.moveTo(p.x, p.y); started = true; }
    else g.lineTo(p.x, p.y);
  }
  g.closePath();
  g.stroke();
  g.restore();
}

// ===== 近景 18 个功能区群 =====
type ClusterKind = 'wellhead' | 'public' | 'housing' | 'water' | 'farm' | 'workshop' | 'storage' | 'defense';
interface Cluster { lon: number; lat: number; kind: ClusterKind }

function buildClusters(): Cluster[] {
  const c: Cluster[] = [
    // 第 07 号井口群（西北上游）
    { lon: 38.20, lat: 18.60, kind: 'wellhead' },
    // 水处理/抽水（沿河 + 07—外拓营水线）
    { lon: 38.50, lat: 18.30, kind: 'water' },
    { lon: 39.50, lat: 17.40, kind: 'water' },
    { lon: 40.30, lat: 16.70, kind: 'water' },
    // 外拓营居住片区（4）
    { lon: 40.85, lat: 16.72, kind: 'housing' },
    { lon: 40.45, lat: 16.72, kind: 'housing' },
    { lon: 40.72, lat: 16.08, kind: 'housing' },
    { lon: 40.35, lat: 16.12, kind: 'housing' },
    // 公共服务/医疗（外拓营核心）
    { lon: 40.60, lat: 16.40, kind: 'public' },
    // 温室/耕作带（沿河两岸，4）
    { lon: 40.90, lat: 16.90, kind: 'farm' },
    { lon: 40.22, lat: 16.60, kind: 'farm' },
    { lon: 40.80, lat: 15.90, kind: 'farm' },
    { lon: 40.24, lat: 16.00, kind: 'farm' },
    // 维修/材料场（靠道路，离河岸，2）
    { lon: 41.10, lat: 16.10, kind: 'workshop' },
    { lon: 40.55, lat: 15.70, kind: 'workshop' },
    // 仓储/调度（道路与水线交会，2）
    { lon: 40.75, lat: 16.52, kind: 'storage' },
    { lon: 43.00, lat: 15.00, kind: 'storage' },
    // 外围警戒（东南边缘）
    { lon: 41.20, lat: 15.70, kind: 'defense' },
  ];
  return c;
}

function clusterSize(zoom: number): number {
  return Math.min(22, 11 + (zoom - CLUSTER_ZOOM) * 2.6);
}

function drawCluster(g: CanvasRenderingContext2D, kind: ClusterKind, x: number, y: number, s: number): void {
  g.save();
  g.translate(x, y);
  g.fillStyle = 'rgba(15,30,34,0.10)';
  g.beginPath(); g.arc(0, 0, s * 0.95, 0, Math.PI * 2); g.fill();
  switch (kind) {
    case 'wellhead': {
      g.strokeStyle = '#DCE5E2';
      g.lineWidth = 1;
      g.beginPath(); g.arc(0, 0, s * 0.7, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#DCE5E2';
      g.globalAlpha = 0.8;
      g.beginPath(); g.arc(0, 0, s * 0.16, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#DCE5E2';
      g.globalAlpha = 0.6;
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
        g.beginPath();
        g.moveTo(Math.cos(a) * s * 0.4, Math.sin(a) * s * 0.4);
        g.lineTo(Math.cos(a) * s * 0.9, Math.sin(a) * s * 0.9);
        g.stroke();
      }
      break;
    }
    case 'public': {
      g.strokeStyle = '#DCE5E2';
      g.lineWidth = 1;
      g.globalAlpha = 0.8;
      g.beginPath(); g.arc(0, 0, s * 0.65, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#DCE5E2';
      g.globalAlpha = 0.7;
      g.beginPath(); g.arc(0, 0, s * 0.14, 0, Math.PI * 2); g.fill();
      break;
    }
    case 'housing': {
      g.fillStyle = '#A7B8C7';
      const rnd = mulberry32(Math.round(x * 7) + Math.round(y * 13));
      for (let i = 0; i < 4; i++) {
        const a = rnd() * Math.PI * 2, r = rnd() * s * 0.55;
        g.globalAlpha = 0.58 + rnd() * 0.22;
        g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, s * 0.15, 0, Math.PI * 2); g.fill();
      }
      g.fillStyle = '#D4A848';
      g.globalAlpha = 0.88;
      g.beginPath(); g.arc(s * 0.45, -s * 0.35, s * 0.11, 0, Math.PI * 2); g.fill();
      break;
    }
    case 'water': {
      g.fillStyle = '#73CBE7';
      g.globalAlpha = 0.78;
      g.fillRect(-s * 0.55, -s * 0.15, s * 1.1, s * 0.3);
      g.strokeStyle = '#73CBE7';
      g.lineWidth = 1;
      g.beginPath(); g.arc(-s * 0.65, 0, s * 0.16, 0, Math.PI * 2); g.stroke();
      break;
    }
    case 'farm': {
      g.fillStyle = '#718855';
      for (let i = 0; i < 3; i++) {
        g.globalAlpha = 0.65 - i * 0.09;
        g.fillRect(-s * 0.65, -s * 0.28 + i * s * 0.26, s * 1.3, s * 0.14);
      }
      break;
    }
    case 'workshop': {
      g.fillStyle = '#C39A5A';
      g.globalAlpha = 0.76;
      g.fillRect(-s * 0.7, -s * 0.18, s * 1.4, s * 0.36);
      g.strokeStyle = '#686A63';
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(-s * 0.35, -s * 0.18); g.lineTo(-s * 0.35, s * 0.18); g.stroke();
      break;
    }
    case 'storage': {
      g.fillStyle = '#607181';
      g.globalAlpha = 0.78;
      g.fillRect(-s * 0.45, -s * 0.35, s * 0.9, s * 0.7);
      g.strokeStyle = '#A7B8C7';
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(s * 0.45, 0); g.lineTo(s * 1.0, 0); g.stroke();
      break;
    }
    case 'defense': {
      g.strokeStyle = '#607181';
      g.lineWidth = 1.2;
      g.globalAlpha = 0.8;
      g.setLineDash([2, 2]);
      g.beginPath(); g.arc(0, 0, s * 0.75, 0, Math.PI * 2); g.stroke();
      g.setLineDash([]);
      break;
    }
  }
  g.restore();
}

// ===== 主绘制 =====
let farBuf: HTMLCanvasElement | null = null;
let farBufKey = '';

function getFarBuffer(vp: MapViewport): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; img: ImageData } {
  const key = `${vp.width}x${vp.height}`;
  if (!farBuf || farBufKey !== key) {
    farBuf = document.createElement('canvas');
    farBuf.width = vp.width; farBuf.height = vp.height;
    farBufKey = key;
  }
  const ctx = farBuf.getContext('2d')!;
  const img = ctx.createImageData(vp.width, vp.height);
  return { canvas: farBuf, ctx, img };
}

export function drawPlanetMap(
  ctx: CanvasRenderingContext2D,
  state: CampaignSaveV2,
  cam: MapCamera,
  layers: MapLayerId[],
  selectedId: string | null,
  hoverId: string | null,
  fast: boolean,
  vp: MapViewport,
): void {
  const W = vp.width, H = vp.height;
  const dpr = ctx.canvas.width / W;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  let baseImg: HTMLCanvasElement | null = null;
  if (isPlane(cam)) {
    baseImg = getPatch(state, cam, layers, vp, fast);
  } else {
    const comp = getComposite(state.seed, layers);
    const td = comp.data;
    const { canvas: fg, ctx: fgc, img } = getFarBuffer(vp);
    const data = img.data;
    const d = cameraDistance(cam.zoom);
    const fill = planetFill(cam.zoom);
    const Rpx = fill * Math.min(W, H) / 2;
    const scale = (d / Math.sqrt(d * d - 1)) / Rpx;
    const cx = W / 2, cy = H / 2;
    const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const inv = 1 - 1 / d;
    for (let sy = 0; sy < H; sy++) {
      const py = (sy - cy) * scale;
      for (let sx = 0; sx < W; sx++) {
        const px = (sx - cx) * scale;
        const len = Math.hypot(px, py, d);
        const nx = px / len, ny = py / len, nz = -d / len;
        const b = 2 * d * nz, cc = d * d - 1;
        const disc = b * b - 4 * cc;
        const i = (sy * W + sx) * 4;
        if (disc < 0) { data[i + 3] = 0; continue; }
        const t = (-b - Math.sqrt(disc)) / 2;
        if (t <= 0) { data[i + 3] = 0; continue; }
        const wx = nx * t, wy = ny * t, wz = nz * t + d;
        const wy2 = wy * cp + wz * sp;
        const wz2 = -wy * sp + wz * cp;
        const lon = Math.atan2(wx, wz2);
        const lat = Math.asin(Math.max(-1, Math.min(1, wy2)));
        let u = ((lon / (2 * Math.PI)) + 0.5 + cam.rot) % 1;
        if (u < 0) u += 1;
        let v = lat / Math.PI + 0.5;
        v = Math.max(0, Math.min(1, v));
        const tx = Math.min(TEX_W - 1, Math.floor(u * TEX_W));
        const ty = Math.min(TEX_H - 1, Math.floor(v * TEX_H));
        const ti = (ty * TEX_W + tx) * 4;
        let r = td[ti], gg = td[ti + 1], bb = td[ti + 2];
        // 球缘冷灰背光 + 临边暗影
        const limb = (wz - 1 / d) / inv;
        const shade = 0.6 + 0.4 * Math.max(0, limb);
        r *= shade; gg *= shade; bb *= shade;
        const rim = Math.pow(1 - Math.max(0, limb), 2.6) * 54;
        r += rim * 0.55; gg += rim * 0.68; bb += rim * 0.8;
        data[i] = r; data[i + 1] = gg; data[i + 2] = bb; data[i + 3] = 255;
      }
    }
    fgc.putImageData(img, 0, 0);
    baseImg = fg;
  }

  ctx.drawImage(baseImg, 0, 0, W, H);

  // 中近景的两侧山脊只作为低亮地形脊线，行政边界永远不应比它更醒目。
  if (isPlane(cam)) {
    strokePolyline(ctx, VALLEY_RIDGES[0], cam, vp, 'rgba(45,55,47,0.36)', 1.25, null);
    strokePolyline(ctx, VALLEY_RIDGES[1], cam, vp, 'rgba(69,79,65,0.28)', 1, null);
  }

  // 主河湿润河谷带（低对比湿地/耕地晕染）
  const rivers = getRivers(state.seed);
  const wetWidth = Math.max(3, 6 + cam.zoom * 1.4);
  strokePolyline(ctx, rivers[0], cam, vp, 'rgba(113,136,85,0.20)', wetWidth, null);

  // 河网（主河 2–4px 中景、3–6px 近景）
  rivers.forEach((r, i) => {
    const w = isPlane(cam) ? (i === 0 ? 4 : 1.5) : (i === 0 ? 2 : 1);
    strokePolyline(ctx, r, cam, vp, 'rgba(115,203,231,0.82)', w, null);
  });
  // 水网（07 → 外拓营）
  strokePolyline(ctx, WATER_NET, cam, vp, 'rgba(115,203,231,0.7)', isPlane(cam) ? 1.6 : 1, [5, 3]);
  // 道路（外拓营 → 旧渡口）
  strokePolyline(ctx, ROAD_NET, cam, vp, 'rgba(195,154,90,0.8)', isPlane(cam) ? 1.8 : 1.2, [7, 4]);

  // 治理边界 1px 矢量（政治层开启时）
  if (layers.includes('political') && cam.zoom < CLUSTER_ZOOM) {
    for (const r of REGIONS) {
      const col = r.status === 'contested' ? '#B86158' : r.status === 'compact' ? '#4F9CB7' : '#D4A848';
      const dash = r.status === 'direct' ? null : r.status === 'compact' ? [6, 4] : [3, 5];
      ctx.save();
      ctx.globalAlpha = isPlane(cam) ? 0.25 : 0.24;
      strokePolygon(ctx, r.outline, cam, vp, col, 1, dash);
      ctx.restore();
    }
  }

  // 近景功能区群（18）
  if (cam.zoom >= CLUSTER_ZOOM) {
    for (const c of buildClusters()) {
      const p = lonLatToScreen(c.lon, c.lat, cam, vp);
      if (!p.visible) continue;
      drawCluster(ctx, c.kind, p.x, p.y, clusterSize(cam.zoom));
    }
  }

  // 节点标记
  for (const n of state.nodes) {
    const p = lonLatToScreen(n.lon, n.lat, cam, vp);
    if (!p.visible) continue;
    drawNodeMarker(ctx, n, p.x, p.y, nodeRadius(n, cam.zoom), selectedId === n.id, hoverId === n.id);
  }

  // 选中/悬停标签
  const labelNode = state.nodes.find(n => n.id === selectedId) ?? state.nodes.find(n => n.id === hoverId);
  if (labelNode) {
    const p = lonLatToScreen(labelNode.lon, labelNode.lat, cam, vp);
    if (p.visible) {
      ctx.save();
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#E6EDF3';
      ctx.textAlign = 'center';
      ctx.fillText(labelNode.name, p.x, p.y + nodeRadius(labelNode, cam.zoom) * 1.7 + 8);
      ctx.restore();
    }
  }
}
