// ============ 星球地图渲染器：完整矩形视口，远景球面 → 中近景局部切平面，多层合成，18 功能区群 ============
import type { CampaignSaveV6, FacilityId, FacilityStage, MapLayerId, MapNode } from '../types';
import { NODES, REGIONS } from '../data';
import { FACILITY_PRESENTATIONS } from '../content/facilities';
import { SETTLEMENTS, settlementStage, type SettlementPresentation, type SettlementStage } from '../content/settlements';
import { PROJECTS as V6_PROJECTS } from '../content/definitions';
import waterMainSpriteUrl from '../assets/facility-water-main.png';
import greenhouseSpriteUrl from '../assets/facility-greenhouse.png';
import workshopSpriteUrl from '../assets/facility-workshop.png';
import radioTowerSpriteUrl from '../assets/facility-radio-tower.png';
import {
  TEX_W, TEX_H, SKELETON_W, SKELETON_H, buildSkeletonTexture, getRivers, terrainModuleAt, preciseTerrainRGB, skeletonTerrainRGB, WATER_NET, ROAD_NET, VALLEY_RIDGES,
} from './terrain';
import { buildLayerTexture } from './layers';
import { mulberry32 } from './noise';
import { getSurfaceFeatureImage, getWorldSurfaceTexture, worldSurfaceRevision } from './worldSurface';
import { getGeoGrid } from '../world/geoGrid';

export const PLANE_ZOOM = 2.2;     // 中近景起点：局部切平面
const CLUSTER_ZOOM = 5.0;          // 功能区群出现
const D2R = Math.PI / 180;
const FOV_RAD = 50 * D2R;

const FACILITY_SPRITE_URL: Record<FacilityId, string> = {
  water_main: waterMainSpriteUrl,
  valley_greenhouse: greenhouseSpriteUrl,
  ferry_workshop: workshopSpriteUrl,
  well_radio_tower: radioTowerSpriteUrl,
};
const facilitySprites = {} as Partial<Record<FacilityId, HTMLImageElement>>;
function facilitySprite(id: FacilityId): HTMLImageElement {
  const cached = facilitySprites[id];
  if (cached) return cached;
  const image = new Image();
  image.onload = () => window.dispatchEvent(new Event('facility-sprite-ready'));
  image.src = FACILITY_SPRITE_URL[id];
  facilitySprites[id] = image;
  return image;
}

export interface MapViewport { width: number; height: number }

export interface MapCamera {
  zoom: number;   // 1..10
  rot: number;    // 经度旋转 0..1
  pitch: number;  // 纬度俯仰（弧度）
}

/** 正式地表与地理验收骨架使用同一份世界蓝图；骨架模式刻意不加载视觉贴图。 */
export type MapStyle = 'terrain' | 'skeleton' | 'spatial-lab';

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

function getComposite(world: CampaignSaveV6['world'], layers: MapLayerId[]): { data: Uint8ClampedArray; width: number; height: number } {
  const changes = world.terrainChanges.map((entry) => `${entry.id}/${entry.kind}/${entry.anchorId}/${JSON.stringify(entry.data)}`).join(',');
  const key = `${world.generatorVersion}:${world.seed}:${worldSurfaceRevision()}:${world.terrainModules.map((entry) => `${entry.id}/${entry.templateId}/${entry.variant}`).join(',')}:${changes}:${layers.join(',')}`;
  if (!compositeData || compositeKey !== key) {
    const base = getWorldSurfaceTexture(world);
    const c = document.createElement('canvas');
    c.width = TEX_W; c.height = TEX_H;
    const g = c.getContext('2d')!;
    g.drawImage(base, 0, 0);
    for (const layer of layers) {
      g.drawImage(buildLayerTexture(world, layer), 0, 0);
    }
    compositeData = g.getImageData(0, 0, TEX_W, TEX_H).data;
    compositeKey = key;
  }
  return { data: compositeData, width: TEX_W, height: TEX_H };
}

let skeletonData: Uint8ClampedArray | null = null;
let skeletonKey = '';

function getSkeletonComposite(world: CampaignSaveV6['world']): { data: Uint8ClampedArray; width: number; height: number } {
  const key = `${world.seed}:${world.skeleton.version}:${world.skeleton.subdivision}:${world.skeleton.cellCount}`;
  if (!skeletonData || skeletonKey !== key) {
    const texture = buildSkeletonTexture(world);
    skeletonData = texture.getContext('2d')!.getImageData(0, 0, SKELETON_W, SKELETON_H).data;
    skeletonKey = key;
  }
  return { data: skeletonData, width: SKELETON_W, height: SKELETON_H };
}

// ===== 中近景切平面补丁（原生重采样，降采样后放大） =====
let patchCanvas: HTMLCanvasElement | null = null;
let patchKey = '';

function buildPatch(state: CampaignSaveV6, cam: MapCamera, layers: MapLayerId[], resW: number, resH: number, degPerPx: number, style: MapStyle): HTMLCanvasElement {
  void layers;
  const c = document.createElement('canvas');
  c.width = resW; c.height = resH;
  const g = c.getContext('2d')!;
  // 局部不是把远景贴图放大；它以同一份 seed、模块和工程差异重采样。
  // 这让山系与河谷位置完全一致，同时避免低分辨率世界贴图在近景变成大方块。
  g.imageSmoothingEnabled = true;
  const center = camCenter(cam);
  const lonStart = center.lon - resW / 2 * degPerPx;
  const latTop = center.lat + resH / 2 * degPerPx;
  const img = g.createImageData(resW, resH);
  const data = img.data;
  for (let py = 0; py < resH; py++) {
    const lat = Math.max(-89.9, Math.min(89.9, latTop - py * degPerPx));
    for (let px = 0; px < resW; px++) {
      const lon = ((lonStart + px * degPerPx) % 360 + 360) % 360;
      const [r, gg, b] = style !== 'terrain'
        ? skeletonTerrainRGB(lon, lat, state.world)
        : preciseTerrainRGB(lon, lat, state.world);
      const i = (py * resW + px) * 4;
      data[i] = r; data[i + 1] = gg; data[i + 2] = b; data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function getPatch(state: CampaignSaveV6, cam: MapCamera, layers: MapLayerId[], vp: MapViewport, fast: boolean, style: MapStyle): HTMLCanvasElement {
  const maxDim = Math.min(vp.width, vp.height);
  // 细地形为 CPU 一次性重采样；分辨率上限让拖拽预览保持跟手，静止后也不会生成大纹理。
  const cap = fast ? 220 : 480;
  const scale = Math.min(1, cap / maxDim);
  const resW = Math.max(160, Math.round(vp.width * scale));
  const resH = Math.max(96, Math.round(vp.height * scale));
  const degPerPx = 1 / (pxPerDeg(cam) * scale);
  const bucket = fast ? 0.006 : 0.0025;
  const changes = state.world.terrainChanges.map((entry) => `${entry.id}/${entry.kind}/${JSON.stringify(entry.data)}`).join(',');
  const key = `${style}:${state.seed}:${worldSurfaceRevision()}:${changes}:${layers.join(',')}:${resW}x${resH}:${Math.round(cam.rot / bucket)}:${Math.round(cam.pitch / (fast ? 0.05 : 0.02))}:${Math.round(cam.zoom * (fast ? 1.5 : 2))}`;
  if (!patchCanvas || patchKey !== key) {
    patchCanvas = buildPatch(state, cam, layers, resW, resH, degPerPx, style);
    patchKey = key;
  }
  return patchCanvas;
}

/**
 * 世界表面在近景仍使用那一份冻结清单；只是底色改为细采样，避免按镜头重新“撒贴图”。
 * 越靠近，低分辨率像素贴图越收敛为材料暗示，让细地形承担主读感。
 */
function drawFrozenSurfaceFeaturesOnPlane(g: CanvasRenderingContext2D, state: CampaignSaveV6, cam: MapCamera, vp: MapViewport): void {
  const detailFade = Math.max(0.18, 1 - Math.max(0, cam.zoom - 2.2) / 3.6);
  const px = pxPerDeg(cam);
  for (const feature of state.world.surfaceFeatures) {
    const point = lonLatToScreen(feature.anchor[0], feature.anchor[1], cam, vp);
    if (!point.visible) continue;
    const image = getSurfaceFeatureImage(feature.assetId);
    if (!image || !image.complete || image.naturalWidth === 0) continue;
    const width = feature.spanDegrees * px;
    const height = width * image.naturalHeight / image.naturalWidth * Math.max(0.56, Math.cos(feature.anchor[1] * D2R));
    if (point.x + width / 2 < 0 || point.x - width / 2 > vp.width || point.y + height / 2 < 0 || point.y - height / 2 > vp.height) continue;
    g.save();
    g.globalAlpha = (feature.layer === 'macro' ? 0.62 : feature.layer === 'regional' ? 0.48 : 0.34) * detailFade;
    // 远近景保持贴图轮廓，近景则以柔化后的材料叠层融入细地形，避免粗像素盖住地表。
    g.imageSmoothingEnabled = cam.zoom >= 4.2;
    g.translate(point.x, point.y);
    g.rotate(feature.rotation * D2R);
    g.drawImage(image, -width / 2, -height / 2, width, height);
    g.restore();
  }
}

// ===== 节点命中 =====
export function hitNode(state: CampaignSaveV6, sx: number, sy: number, cam: MapCamera, vp: MapViewport): string | null {
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

// ===== v6 设施表现：同一份 FacilityRuntime 同时驱动地图、解锁与持续效果 =====
function facilityColor(stage: FacilityStage): string {
  if (stage === 'planned') return 'rgba(167,184,199,0.72)';
  if (stage === 'construction') return '#D4A848';
  if (stage === 'trial') return '#73CBE7';
  if (stage === 'operational') return '#D9EBD1';
  return '#B86158';
}

function facilityAlpha(stage: FacilityStage): number {
  return stage === 'planned' ? 0.45 : stage === 'construction' ? 0.72 : stage === 'trial' ? 0.86 : 1;
}

function drawFacilityBadge(g: CanvasRenderingContext2D, x: number, y: number, r: number, stage: FacilityStage): void {
  const color = facilityColor(stage);
  glow(g, x, y, r * (stage === 'operational' ? 3.5 : 2.4), color, stage === 'operational' ? 0.22 : 0.14);
  g.save();
  g.strokeStyle = color; g.globalAlpha = facilityAlpha(stage); g.lineWidth = 1.1;
  if (stage === 'planned') g.setLineDash([3, 3]);
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
  g.setLineDash([]);
  if (stage === 'trial') { g.beginPath(); g.arc(x, y, r * 1.52, 0, Math.PI * 2); g.stroke(); }
  g.restore();
}

function drawGreenhouse(g: CanvasRenderingContext2D, x: number, y: number, s: number, stage: FacilityStage): void {
  const color = facilityColor(stage);
  g.save(); g.translate(x, y); g.strokeStyle = color; g.globalAlpha = facilityAlpha(stage); g.lineWidth = 1.2;
  if (stage === 'planned') g.setLineDash([3, 3]);
  for (let i = -1; i <= 1; i++) {
    g.beginPath(); g.roundRect(i * s * 0.52 - s * 0.2, -s * 0.36, s * 0.4, s * 0.72, s * 0.12); g.stroke();
    if (stage === 'operational') { g.fillStyle = 'rgba(113,136,85,0.35)'; g.fill(); }
  }
  g.setLineDash([]); g.restore();
  drawFacilityBadge(g, x, y, s * 0.76, stage);
}

function drawWorkshop(g: CanvasRenderingContext2D, x: number, y: number, s: number, stage: FacilityStage): void {
  const color = facilityColor(stage);
  g.save(); g.translate(x, y); g.globalAlpha = facilityAlpha(stage); g.strokeStyle = color; g.lineWidth = 1.25;
  if (stage === 'planned') g.setLineDash([3, 3]);
  g.beginPath(); g.rect(-s * 0.72, -s * 0.32, s * 1.44, s * 0.64); g.stroke();
  g.beginPath(); g.moveTo(-s * 0.82, -s * 0.32); g.lineTo(0, -s * 0.76); g.lineTo(s * 0.82, -s * 0.32); g.stroke();
  if (stage !== 'planned') { g.beginPath(); g.moveTo(s * 0.52, -s * 0.33); g.lineTo(s * 0.52, -s * 0.95); g.stroke(); }
  if (stage === 'operational') { g.fillStyle = 'rgba(195,154,90,0.25)'; g.fillRect(-s * 0.66, -s * 0.25, s * 1.32, s * 0.5); }
  g.setLineDash([]); g.restore();
  drawFacilityBadge(g, x, y, s * 0.92, stage);
}

function drawRadioTower(g: CanvasRenderingContext2D, x: number, y: number, s: number, stage: FacilityStage): void {
  const color = facilityColor(stage);
  g.save(); g.translate(x, y); g.globalAlpha = facilityAlpha(stage); g.strokeStyle = color; g.lineWidth = 1.25;
  if (stage === 'planned') g.setLineDash([3, 3]);
  g.beginPath(); g.moveTo(0, -s); g.lineTo(-s * 0.48, s * 0.62); g.lineTo(s * 0.48, s * 0.62); g.closePath(); g.stroke();
  g.beginPath(); g.moveTo(-s * 0.58, s * 0.62); g.lineTo(s * 0.58, s * 0.62); g.stroke();
  if (stage === 'trial' || stage === 'operational') for (let r = 1; r <= 2; r++) { g.globalAlpha = 0.36; g.beginPath(); g.arc(0, -s * 0.82, s * (0.55 + r * 0.34), -1.2, 0.2); g.stroke(); }
  g.setLineDash([]); g.restore();
  drawFacilityBadge(g, x, y, s * 0.92, stage);
}

function drawFacilityFlag(g: CanvasRenderingContext2D, id: FacilityId, x: number, y: number, scale: number, stage: FacilityStage, zoom: number): void {
  // 中景只显示“地点 + 规模”，避免四个工程名挤成一片；单项工程到近景才标注。
  if (zoom < CLUSTER_ZOOM || stage === 'planned') return;
  const radius = Math.max(8, Math.min(34, (6 + zoom * 1.75) * scale));
  const color = facilityColor(stage);
  g.save();
  g.globalAlpha = stage === 'construction' ? 0.42 : 0.26;
  g.fillStyle = color; g.beginPath(); g.arc(x, y, radius, 0, Math.PI * 2); g.fill();
  g.globalAlpha = 0.95; g.strokeStyle = color; g.lineWidth = 1.2;
  if (stage === 'construction') g.setLineDash([3, 3]);
  g.beginPath(); g.arc(x, y, radius, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
  const pole = Math.max(18, radius + 8), flagY = y - pole;
  g.strokeStyle = '#D9EBD1'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - radius * 0.35); g.lineTo(x, flagY); g.stroke();
  g.font = '11px system-ui, sans-serif';
  const name = V6_PROJECTS[id].name;
  const width = Math.min(180, g.measureText(name).width + 12);
  g.fillStyle = '#0E1722'; g.fillRect(x + 1, flagY - 11, width, 15);
  g.strokeStyle = color; g.strokeRect(x + 1, flagY - 11, width, 15);
  g.fillStyle = '#E6EDF3'; g.textBaseline = 'middle'; g.fillText(name, x + 7, flagY - 3.5);
  g.restore();
}

/**
 * 聚居地不再使用绑定河谷故事的旧贴图。这个轻量像素轮廓由所在地貌/气候和发展阶段共同决定；
 * R8-C 的正式独立资产接入时，只需替换本函数，不改地点、规模或发展阶段规则。
 */
function drawSettlementSilhouette(g: CanvasRenderingContext2D, x: number, y: number, size: number, stage: SettlementStage, region: string, climate: string): void {
  const base = region === 'arid' ? '#B6945B' : region === 'forest' || climate === 'tropical' ? '#5F9268' : region === 'mountain' || region === 'highland' ? '#859092' : region === 'tundra' || climate === 'polar' ? '#B4C2C3' : '#8DAD76';
  const roof = region === 'arid' ? '#78593E' : climate === 'polar' ? '#526A70' : '#465957';
  const light = region === 'arid' ? '#E1BE74' : '#D9C878';
  const unit = Math.max(1, Math.round(size / 14));
  const block = (ox: number, oy: number, w: number, h: number, lit = false) => {
    g.fillStyle = roof; g.fillRect(Math.round(x + ox * unit), Math.round(y + oy * unit), w * unit, h * unit);
    g.fillStyle = base; g.fillRect(Math.round(x + (ox + 1) * unit), Math.round(y + (oy + 1) * unit), Math.max(unit, (w - 2) * unit), Math.max(unit, (h - 1) * unit));
    if (lit) { g.fillStyle = light; g.fillRect(Math.round(x + (ox + w - 2) * unit), Math.round(y + (oy + h - 2) * unit), unit, unit); }
  };
  g.save();
  g.imageSmoothingEnabled = false;
  g.globalAlpha = 0.96;
  if (stage === 'camp') {
    block(-5, 1, 5, 3, true); block(1, -2, 5, 5, true); block(-1, 5, 3, 2);
  } else if (stage === 'settlement') {
    block(-7, 2, 5, 4, true); block(-1, -3, 6, 6, true); block(5, 2, 4, 4, true); block(-4, 7, 9, 3);
  } else if (stage === 'worktown') {
    block(-8, 3, 5, 5, true); block(-2, -5, 7, 8, true); block(5, 1, 5, 6, true); block(-5, 8, 12, 3, true);
    g.fillStyle = roof; g.fillRect(Math.round(x + 3 * unit), Math.round(y - 9 * unit), unit * 2, unit * 5);
  } else {
    block(-9, 3, 5, 6, true); block(-3, -5, 6, 12, true); block(4, -1, 6, 10, true); block(-7, 10, 16, 3, true);
    g.fillStyle = light; g.fillRect(Math.round(x - unit), Math.round(y - 8 * unit), unit * 2, unit * 2);
  }
  g.restore();
}

/**
 * 中远景的聚居地读作一个清晰地点：阶段城市形态、名称旗帜和规模圆环。
 * 工程不会逐个替换城市图；它们积累后推进城市阶段，近景才展开为具体地标。
 */
function drawSettlementTag(g: CanvasRenderingContext2D, state: CampaignSaveV6, cam: MapCamera, vp: MapViewport, presentation: SettlementPresentation): void {
  // 城市坐标从当前世界节点取；蓝图或随机落点改变时，城市、旗帜和规模圈不会脱节。
  const node = state.nodes.find((entry) => entry.id === presentation.nodeId);
  const anchor: [number, number] = node ? [node.lon, node.lat] : presentation.anchor;
  const point = lonLatToScreen(anchor[0], anchor[1], cam, vp);
  if (!point.visible) return;
  const stage = settlementStage(state, presentation);
  const scale = presentation.scaleByStage[stage];
  const circle = Math.max(9, Math.min(42, (8 + cam.zoom * 2.25) * scale));
  const terrain = terrainModuleAt(state.world, anchor[0], anchor[1])?.slot;

  g.save();
  // 圈的面积代表聚居地规模，颜色只作轻微的统辖标识，不吞没地形。
  g.fillStyle = '#D4A848';
  g.globalAlpha = 0.16;
  g.beginPath(); g.arc(point.x, point.y, circle, 0, Math.PI * 2); g.fill();
  g.globalAlpha = 0.74;
  g.lineWidth = 1.1;
  g.strokeStyle = '#D4A848';
  g.beginPath(); g.arc(point.x, point.y, circle, 0, Math.PI * 2); g.stroke();

  const imageSize = Math.max(28, Math.min(92, (24 + cam.zoom * 6) * scale));
  drawSettlementSilhouette(g, point.x, point.y, imageSize, stage, terrain?.region ?? 'plain', terrain?.climate ?? 'temperate');

  // 旗帜保留到近景，让城市在移动和缩放时始终可定位；名称一律是地点名，不是工程名。
  const pole = Math.max(21, circle + 12);
  const flagY = point.y - pole;
  g.globalAlpha = 0.9; g.strokeStyle = '#D9EBD1'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(point.x, point.y - circle * 0.28); g.lineTo(point.x, flagY); g.stroke();
  g.font = '600 11px system-ui, sans-serif';
  const label = `${presentation.name} · ${stage === 'camp' ? '外拓营' : stage === 'settlement' ? '聚居地' : stage === 'worktown' ? '工务镇' : '河谷城市'}`;
  const width = Math.min(188, g.measureText(label).width + 14);
  g.globalAlpha = 0.94; g.fillStyle = '#0E1722'; g.fillRect(point.x + 2, flagY - 12, width, 16);
  g.strokeStyle = '#D4A848'; g.strokeRect(point.x + 2, flagY - 12, width, 16);
  g.fillStyle = '#E6EDF3'; g.textBaseline = 'middle'; g.fillText(label, point.x + 8, flagY - 4);
  g.restore();
}

/** 近景才展示从原始概念图直接抽稀得到的地标；中景仍是旗帜与规模圆环。 */
function drawFacilityLandmark(g: CanvasRenderingContext2D, id: FacilityId, x: number, y: number, scale: number, stage: FacilityStage, zoom: number): void {
  if (zoom < CLUSTER_ZOOM || (stage !== 'trial' && stage !== 'operational')) return;
  const image = facilitySprite(id);
  if (!image.complete || image.naturalWidth === 0) return;
  const size = Math.max(30, Math.min(84, (22 + zoom * 4) * scale));
  g.save();
  g.globalAlpha = stage === 'trial' ? 0.72 : 0.96;
  g.imageSmoothingEnabled = false;
  g.drawImage(image, x - size / 2, y - size / 2, size, size);
  g.restore();
}

function drawFacilities(g: CanvasRenderingContext2D, state: CampaignSaveV6, cam: MapCamera, vp: MapViewport): void {
  for (const id of Object.keys(FACILITY_PRESENTATIONS) as FacilityId[]) {
    const runtime = state.facilities[id];
    if (!runtime || runtime.stage === 'locked') continue;
    const presentation = FACILITY_PRESENTATIONS[id];
    const point = lonLatToScreen(presentation.anchor[0], presentation.anchor[1], cam, vp);
    if (!point.visible) continue;
    const s = Math.max(4, Math.min(18, 3 + cam.zoom * 1.8));
    if (id === 'water_main' && presentation.constructionLine) {
      const width = runtime.stage === 'operational' ? Math.max(2.2, cam.zoom * 0.7) : Math.max(1.2, cam.zoom * 0.42);
      strokePolyline(g, presentation.constructionLine, cam, vp, facilityColor(runtime.stage), width, runtime.stage === 'planned' ? [3, 3] : runtime.stage === 'construction' ? [8, 4] : null);
      drawFacilityBadge(g, point.x, point.y, s, runtime.stage);
    } else if (id === 'valley_greenhouse') drawGreenhouse(g, point.x, point.y, s, runtime.stage);
    else if (id === 'ferry_workshop') drawWorkshop(g, point.x, point.y, s, runtime.stage);
    else drawRadioTower(g, point.x, point.y, s, runtime.stage);
    drawFacilityLandmark(g, id, point.x, point.y, presentation.mapScale, runtime.stage, cam.zoom);
    drawFacilityFlag(g, id, point.x, point.y, presentation.mapScale, runtime.stage, cam.zoom);
  }
}

/**
 * R9 骨架验收覆盖层：只显示会影响地理事实的河流、道路、工程落点和地点锚。
 * 不画行政图层、城市轮廓、功能区或任何贴图，避免把视觉层误认为世界事实。
 */
function drawSkeletonOverlay(
  g: CanvasRenderingContext2D,
  state: CampaignSaveV6,
  cam: MapCamera,
  vp: MapViewport,
  selectedId: string | null,
  hoverId: string | null,
): void {
  const rivers = getRivers(state.world);
  rivers.forEach((river, index) => {
    strokePolyline(g, river, cam, vp, index === 0 ? 'rgba(232,232,232,0.90)' : 'rgba(186,186,186,0.70)', index === 0 ? 1.8 : 1, null);
  });

  const waterStage = state.facilities.water_main.stage;
  if (waterStage !== 'locked') {
    const dash = waterStage === 'operational' ? null : [4, 3];
    strokePolyline(g, WATER_NET, cam, vp, 'rgba(218,218,218,0.86)', waterStage === 'operational' ? 1.7 : 1.1, dash);
  }
  const roadStage = state.facilities.ferry_workshop.stage;
  if (roadStage !== 'locked') {
    const dash = roadStage === 'operational' ? null : [7, 4];
    strokePolyline(g, ROAD_NET, cam, vp, 'rgba(35,35,35,0.82)', roadStage === 'operational' ? 1.9 : 1.1, dash);
  }

  for (const id of Object.keys(FACILITY_PRESENTATIONS) as FacilityId[]) {
    const runtime = state.facilities[id];
    if (!runtime || runtime.stage === 'locked') continue;
    const point = lonLatToScreen(FACILITY_PRESENTATIONS[id].anchor[0], FACILITY_PRESENTATIONS[id].anchor[1], cam, vp);
    if (!point.visible) continue;
    const r = Math.max(3.5, Math.min(7, 2 + cam.zoom * 1.1));
    g.save();
    g.strokeStyle = runtime.stage === 'operational' ? '#F2F2F2' : '#B8B8B8';
    g.lineWidth = 1.2;
    if (runtime.stage === 'planned' || runtime.stage === 'construction') g.setLineDash([2, 2]);
    g.strokeRect(point.x - r, point.y - r, r * 2, r * 2);
    g.restore();
  }

  for (const node of state.nodes) {
    const point = lonLatToScreen(node.lon, node.lat, cam, vp);
    if (!point.visible) continue;
    const r = Math.max(4.5, Math.min(8, nodeRadius(node, cam.zoom) * 0.68));
    const active = selectedId === node.id;
    const over = hoverId === node.id;
    g.save();
    g.fillStyle = '#111';
    g.strokeStyle = active || over ? '#FFFFFF' : '#D0D0D0';
    g.lineWidth = active ? 2 : 1.25;
    g.beginPath(); g.arc(point.x, point.y, r, 0, Math.PI * 2); g.fill(); g.stroke();
    if (active) {
      g.setLineDash([3, 3]);
      g.beginPath(); g.arc(point.x, point.y, r * 1.75, 0, Math.PI * 2); g.stroke();
    }
    g.restore();
  }

  const labelled = state.nodes.find((node) => node.id === selectedId) ?? state.nodes.find((node) => node.id === hoverId);
  if (labelled) {
    const point = lonLatToScreen(labelled.lon, labelled.lat, cam, vp);
    if (point.visible) {
      g.save();
      g.font = '600 11px system-ui, sans-serif';
      const width = g.measureText(labelled.name).width + 12;
      g.fillStyle = 'rgba(12,12,12,0.84)';
      g.fillRect(point.x + 8, point.y - 20, width, 16);
      g.strokeStyle = '#D6D6D6'; g.strokeRect(point.x + 8, point.y - 20, width, 16);
      g.fillStyle = '#F2F2F2'; g.textBaseline = 'middle';
      g.fillText(labelled.name, point.x + 14, point.y - 12);
      g.restore();
    }
  }
}

const SETTLEMENT_ROLE_LABEL: Record<CampaignSaveV6['world']['spatialNetwork']['settlementPotentials'][number]['role'], string> = {
  existing: '现有聚居点',
  agricultural: '农垦聚居候选',
  mineral: '矿业聚居候选',
  harbor: '港口聚居候选',
  river_hub: '河流枢纽候选',
};

const ENGINEERING_LABEL: Record<string, string> = {
  water_utility: '水务工程候选',
  farm_district: '农垦工程候选',
  mine_complex: '矿场工程候选',
  geothermal_station: '地热工程候选',
  seaport: '港口工程候选',
};

/**
 * 仅供路线规则讨论的观察层：圆点是聚居点，方块是通过选址验收的工程候选点。
 * 刻意不连线，避免把“可发展”误读为“已经存在一条道路”或“算法已替玩家作了决定”。
 */
function drawSpatialLabOverlay(g: CanvasRenderingContext2D, state: CampaignSaveV6, cam: MapCamera, vp: MapViewport, selectedId: string | null, hoverId: string | null): void {
  drawSkeletonOverlay(g, state, cam, vp, selectedId, hoverId);
  const grid = getGeoGrid();
  const network = state.world.spatialNetwork;
  const showLabels = cam.zoom >= 2.2;
  const existingCount = network.settlementPotentials.filter((potential) => potential.role === 'existing').length;
  const developmentCount = network.settlementPotentials.length - existingCount;

  for (const potential of network.settlementPotentials) {
    if (potential.role === 'existing') continue;
    const cell = grid.byId.get(potential.cellId);
    if (!cell) continue;
    const point = lonLatToScreen(cell.lon, cell.lat, cam, vp);
    if (!point.visible) continue;
    const radius = Math.max(4, Math.min(8, 2 + cam.zoom * 1.2));
    g.save();
    g.fillStyle = 'rgba(214,214,214,0.92)';
    g.strokeStyle = '#202020'; g.lineWidth = 1.5;
    g.beginPath(); g.arc(point.x, point.y, radius, 0, Math.PI * 2); g.fill(); g.stroke();
    if (showLabels) {
      g.font = '600 11px system-ui, sans-serif';
      g.fillStyle = '#F1F1F1'; g.textBaseline = 'middle';
      g.fillText(SETTLEMENT_ROLE_LABEL[potential.role], point.x + radius + 5, point.y);
    }
    g.restore();
  }

  for (const potential of network.engineeringPotentials) {
    const cell = grid.byId.get(potential.cellId);
    if (!cell) continue;
    const point = lonLatToScreen(cell.lon, cell.lat, cam, vp);
    if (!point.visible) continue;
    const size = Math.max(7, Math.min(12, 4 + cam.zoom * 1.5));
    g.save();
    g.fillStyle = 'rgba(28,28,28,0.92)';
    g.strokeStyle = '#F1F1F1'; g.lineWidth = 1.25;
    g.fillRect(point.x - size / 2, point.y - size / 2, size, size);
    g.strokeRect(point.x - size / 2, point.y - size / 2, size, size);
    if (showLabels) {
      g.font = '600 11px system-ui, sans-serif';
      g.fillStyle = '#F1F1F1'; g.textBaseline = 'middle';
      g.fillText(ENGINEERING_LABEL[potential.moduleId] ?? potential.moduleId, point.x + size / 2 + 5, point.y);
    }
    g.restore();
  }

  g.save();
  g.fillStyle = 'rgba(10,10,10,0.78)'; g.fillRect(16, 16, 272, 48);
  g.strokeStyle = '#CFCFCF'; g.lineWidth = 1; g.strokeRect(16, 16, 272, 48);
  g.fillStyle = '#F3F3F3'; g.font = '700 13px system-ui, sans-serif'; g.textBaseline = 'middle';
  g.fillText('道路试验世界 · 尚未规划道路', 27, 34);
  g.font = '11px system-ui, sans-serif'; g.fillStyle = '#D2D2D2';
  g.fillText(`● 现有聚居 ${existingCount}   ○ 可发展聚居 ${developmentCount}   □ 工程候选 ${network.engineeringPotentials.length}`, 27, 52);
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
  state: CampaignSaveV6,
  cam: MapCamera,
  layers: MapLayerId[],
  selectedId: string | null,
  hoverId: string | null,
  fast: boolean,
  vp: MapViewport,
  style: MapStyle = 'terrain',
): void {
  const W = vp.width, H = vp.height;
  const dpr = ctx.canvas.width / W;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  let baseImg: HTMLCanvasElement | null = null;
  if (isPlane(cam)) {
    baseImg = getPatch(state, cam, layers, vp, fast, style);
  } else {
    const comp = style !== 'terrain' ? getSkeletonComposite(state.world) : getComposite(state.world, layers);
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
        const tx = Math.min(comp.width - 1, Math.floor(u * comp.width));
        const ty = Math.min(comp.height - 1, Math.floor(v * comp.height));
        const ti = (ty * comp.width + tx) * 4;
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

  if (style === 'skeleton') {
    drawSkeletonOverlay(ctx, state, cam, vp, selectedId, hoverId);
    return;
  }
  if (style === 'spatial-lab') {
    drawSpatialLabOverlay(ctx, state, cam, vp, selectedId, hoverId);
    return;
  }

  // 中近景的两侧山脊只作为低亮地形脊线，行政边界永远不应比它更醒目。
  if (isPlane(cam)) {
    drawFrozenSurfaceFeaturesOnPlane(ctx, state, cam, vp);
    strokePolyline(ctx, VALLEY_RIDGES[0], cam, vp, 'rgba(45,55,47,0.36)', 1.25, null);
    strokePolyline(ctx, VALLEY_RIDGES[1], cam, vp, 'rgba(69,79,65,0.28)', 1, null);
  }

  // 主河湿润河谷带（低对比湿地/耕地晕染）
  const rivers = getRivers(state.world);
  const wetWidth = Math.max(3, 6 + cam.zoom * 1.4);
  strokePolyline(ctx, rivers[0], cam, vp, 'rgba(113,136,85,0.20)', wetWidth, null);

  // 河网（主河 2–4px 中景、3–6px 近景）
  rivers.forEach((r, i) => {
    const w = isPlane(cam) ? (i === 0 ? 4 : 1.5) : (i === 0 ? 2 : 1);
    strokePolyline(ctx, r, cam, vp, 'rgba(115,203,231,0.82)', w, null);
  });
  // 水网与道路不是开局就完整画好的装饰：工程达到施工/试运行/投用时，
  // 线路依次从勘察虚线变成可见网络，地图才会回应建设进度。
  const waterStage = state.facilities.water_main.stage;
  if (waterStage !== 'locked') {
    const operational = waterStage === 'operational';
    const trial = waterStage === 'trial';
    const alpha = operational ? 0.92 : trial ? 0.72 : 0.42;
    const dash = operational ? null : trial ? [7, 3] : [3, 4];
    const width = (isPlane(cam) ? 1.8 : 1.05) * (operational ? 1.45 : trial ? 1.15 : 0.8);
    strokePolyline(ctx, WATER_NET, cam, vp, `rgba(115,203,231,${alpha})`, width, dash);
  }
  const roadStage = state.facilities.ferry_workshop.stage;
  if (roadStage !== 'locked') {
  const roadOperational = roadStage === 'operational';
  const roadTrial = roadStage === 'trial';
  const roadAlpha = roadOperational ? 0.90 : roadTrial ? 0.64 : 0.40;
  const roadDash = roadOperational ? null : roadTrial ? [8, 4] : [3, 6];
  const roadWidth = (isPlane(cam) ? 1.9 : 1.15) * (roadOperational ? 1.5 : roadTrial ? 1.12 : 0.72);
  strokePolyline(ctx, ROAD_NET, cam, vp, `rgba(195,154,90,${roadAlpha})`, roadWidth, roadDash);
  }

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

  // 工程不是一张完成卡：设施在施工、试运行和投用阶段均留下不同的地图痕迹。
  SETTLEMENTS.forEach((settlement) => drawSettlementTag(ctx, state, cam, vp, settlement));
  drawFacilities(ctx, state, cam, vp);

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
