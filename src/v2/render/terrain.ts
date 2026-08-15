// ============ 程序化地形：宏观大陆 + 河谷微地形 + 连续色阶，纯地形纹理，河网道路走矢量 ============
import { fbm3, hash2 } from './noise';
import { NODES, REGIONS } from '../data';

export const TEX_W = 2048;
export const TEX_H = 1024;
export const SEA = 0.5;

const H_W = 1024;
const H_H = 512;
const D2R = Math.PI / 180;

let hCache: Float32Array | null = null;
let mCache: Float32Array | null = null;
let cacheSeed = -1;

function angularDistDeg(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const dLon = ((lon2 - lon1 + 180) % 360 + 360) % 360 - 180;
  const dLat = lat2 - lat1;
  const a = Math.sin(dLat * D2R / 2) ** 2 +
    Math.cos(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.sin(dLon * D2R / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) / D2R;
}

// ============ 河网（手工锚定：主河 + 两条支流，遵循河谷） ============
export type Polyline = [number, number][];

const MAIN_RIVER: Polyline = [
  [36.5, 22.0], [37.5, 20.5], [38.6, 18.8], [40.3, 16.8], [42.5, 15.0],
  [44.5, 13.5], [46.5, 11.0], [47.2, 8.5], [47.6, 5.5],
];
const TRIBUTARY_WEST: Polyline = [
  [34.0, 21.0], [35.6, 19.4], [37.3, 18.5],
];
const TRIBUTARY_EAST: Polyline = [
  [43.0, 18.8], [42.0, 17.2], [41.0, 16.5],
];

// ============ 大陆形状（连续距离场，确定性） ============
function ellipseSDF(lon: number, lat: number, clon: number, clat: number, rx: number, ry: number): number {
  const dLon = ((lon - clon + 180) % 360 + 360) % 360 - 180; // 经度环绕
  const dx = dLon / rx, dy = (lat - clat) / ry;
  return Math.sqrt(dx * dx + dy * dy);
}

function lobe(lon: number, lat: number, clon: number, clat: number, rx: number, ry: number): number {
  return 1 - ellipseSDF(lon, lat, clon, clat, rx, ry);
}

// 主大陆由宽大、交叠的叶瓣组成；岸线细节在 macroLand 中切出。
// 不再用小椭圆贴出玩具般的圆形岛屿。
const MAINLAND_LOBES: [number, number, number, number][] = [
  [28, 7, 49, 48],
  [2, 29, 27, 23],
  [57, 24, 25, 22],
];
const ISLAND_LOBES: [number, number, number, number][] = [
  [86, 20, 8, 14],
  [95, 5, 7, 11],
];

// 远景海岸线是设计过的、非规则大陆轮廓；距离场只用来给海岸留出自然的浅海和噪声侵蚀。
const MAINLAND_COAST: Polyline = [
  [-22, 22], [-16, 37], [-5, 49], [12, 54], [27, 50], [42, 52],
  [60, 45], [75, 34], [73, 25], [82, 15], [75, 5], [78, -8],
  [65, -17], [57, -32], [44, -40], [29, -44], [16, -38], [2, -35],
  [-9, -24], [-17, -8], [-17, 8], [-22, 22],
];
const EASTERN_ISLANDS: Polyline[] = [
  [[82, 25], [88, 32], [96, 25], [94, 16], [88, 12], [82, 17], [82, 25]],
  [[94, 6], [99, 11], [104, 5], [102, -4], [96, -7], [92, -1], [94, 6]],
];

// 山系（山脊线）
const NORTHERN_RANGE: Polyline = [[-4, 39], [15, 45], [34, 44], [51, 41], [65, 35]];
const WEST_RIDGE: Polyline = [[34.2, 22.5], [35.2, 19.2], [36.1, 15.5], [37.0, 11.5], [37.6, 8.0]];
const EAST_FOOTHILLS: Polyline = [[43.4, 21.5], [44.0, 18.0], [45.2, 14.5], [46.5, 10.5], [47.4, 7.0]];

export const VALLEY_RIDGES: Polyline[] = [WEST_RIDGE, EAST_FOOTHILLS];

/** 平面近似的折线距离（度，小距离够用，无三角函数开销） */
function distToPolylineDeg(lon: number, lat: number, poly: Polyline): number {
  const cosLat = Math.cos(lat * D2R);
  let best = Infinity;
  for (let i = 0; i < poly.length - 1; i++) {
    const ax = poly[i][0], ay = poly[i][1];
    const bx = poly[i + 1][0], by = poly[i + 1][1];
    const dx = (bx - ax) * cosLat, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 === 0 ? 0 : (((lon - ax) * cosLat) * dx + (lat - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + (bx - ax) * t, cy = ay + (by - ay) * t;
    const px = (lon - cx) * cosLat, py = lat - cy;
    const d = Math.hypot(px, py);
    if (d < best) best = d;
  }
  return best;
}

function ridge(lon: number, lat: number, poly: Polyline, halfWidth: number, height: number): number {
  const d = distToPolylineDeg(lon, lat, poly);
  const t = 1 - d / halfWidth;
  return t <= 0 ? 0 : t * t * height;
}

function valley(lon: number, lat: number, poly: Polyline, halfWidth: number, depth: number): number {
  const d = distToPolylineDeg(lon, lat, poly);
  const t = 1 - d / halfWidth;
  return t <= 0 ? 0 : -(t * t * depth);
}

/** 宏观陆地场：>0 为陆、<0 为海、≈0 为海岸（海岸被低频噪声扰动） */
function macroLand(lon: number, lat: number, seed: number): number {
  const lonR = lon * D2R, latR = lat * D2R;
  const x = Math.cos(latR) * Math.cos(lonR);
  const y = Math.sin(latR);
  const z = Math.cos(latR) * Math.sin(lonR);
  const coastNoise = fbm3(x * 2.1, y * 2.1, z * 2.1, seed + 555, 4) - 0.5;
  const shoreNoise = fbm3(x * 5.4, y * 5.4, z * 5.4, seed + 557, 2) - 0.5;
  const polygonField = (poly: Polyline, interior: number): number => {
    const d = Math.min(6, distToPolylineDeg(lon, lat, poly));
    const sign = pointInPolygon(lon, lat, poly) ? 1 : -1;
    return sign * (0.10 + d * interior) + coastNoise * 0.075 + shoreNoise * 0.030;
  };
  const mainLand = polygonField(MAINLAND_COAST, 0.050);
  const islandLand = Math.max(...EASTERN_ISLANDS.map(poly => polygonField(poly, 0.045) - 0.08));
  return Math.max(mainLand, islandLand);
}

function baseElevation(lonDeg: number, latDeg: number, seed: number): number {
  const lon = lonDeg * D2R, lat = latDeg * D2R;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.sin(lon);
  const detail = fbm3(x, y, z, seed, 5);
  let e = SEA + macroLand(lonDeg, latDeg, seed) * 0.23;
  e += (detail - 0.5) * 0.050;
  e += ridge(lonDeg, latDeg, NORTHERN_RANGE, 1.35, 0.115);
  e += ridge(lonDeg, latDeg, WEST_RIDGE, 0.70, 0.095);
  e += ridge(lonDeg, latDeg, EAST_FOOTHILLS, 0.85, 0.060);
  e += valley(lonDeg, latDeg, MAIN_RIVER, 0.58, 0.050);
  return e;
}

function moistureAt(lonDeg: number, latDeg: number, seed: number): number {
  const lon = lonDeg * D2R, lat = latDeg * D2R;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.sin(lon);
  let m = fbm3(x * 1.7 + 41, y * 1.7 + 41, z * 1.7 + 41, seed + 12345, 4);
  // 副热带干燥带（|lat| 15–35 略干）
  const dry = Math.exp(-(((Math.abs(latDeg) - 25) / 12) ** 2));
  m = m * (1 - dry * 0.22);
  return m;
}

function buildGrids(seed: number): void {
  hCache = new Float32Array(H_W * H_H);
  mCache = new Float32Array(H_W * H_H);
  for (let gy = 0; gy < H_H; gy++) {
    const lat = 90 - (gy / H_H) * 180;
    for (let gx = 0; gx < H_W; gx++) {
      const lon = (gx / H_W) * 360;
      hCache[gy * H_W + gx] = baseElevation(lon, lat, seed);
      mCache[gy * H_W + gx] = moistureAt(lon, lat, seed);
    }
  }
  cacheSeed = seed;
}

function ensureGrids(seed: number): void {
  if (!hCache || cacheSeed !== seed) buildGrids(seed);
}

/** 双线性采样高程（经度环绕） */
export function sampleHeight(lonDeg: number, latDeg: number, seed: number): number {
  ensureGrids(seed);
  const u = (((lonDeg % 360) + 360) % 360) / 360 * H_W;
  let v = (90 - latDeg) / 180 * H_H;
  v = Math.max(0, Math.min(H_H - 0.001, v));
  const x0 = Math.floor(u), y0 = Math.floor(v);
  const fx = u - x0, fy = v - y0;
  const x1 = (x0 + 1) % H_W;
  const y1 = Math.min(H_H - 1, y0 + 1);
  const a = hCache![y0 * H_W + x0], b = hCache![y0 * H_W + x1];
  const c = hCache![y1 * H_W + x0], d = hCache![y1 * H_W + x1];
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

function sampleMoisture(lonDeg: number, latDeg: number, seed: number): number {
  ensureGrids(seed);
  const u = (((lonDeg % 360) + 360) % 360) / 360 * H_W;
  let v = (90 - latDeg) / 180 * H_H;
  v = Math.max(0, Math.min(H_H - 0.001, v));
  const x0 = Math.floor(u), y0 = Math.floor(v);
  const fx = u - x0, fy = v - y0;
  const x1 = (x0 + 1) % H_W;
  const y1 = Math.min(H_H - 1, y0 + 1);
  const a = mCache![y0 * H_W + x0], b = mCache![y0 * H_W + x1];
  const c = mCache![y1 * H_W + x0], d = mCache![y1 * H_W + x1];
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

export function isLandAt(lonDeg: number, latDeg: number, seed: number): boolean {
  return sampleHeight(lonDeg, latDeg, seed) >= SEA;
}

function pointInPolygon(lon: number, lat: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function inAcidRegion(lonDeg: number, latDeg: number): boolean {
  const r = REGIONS.find(x => x.id === 'south_acid')!;
  return pointInPolygon(lonDeg, latDeg, r.outline);
}

export function inValleyRegion(lonDeg: number, latDeg: number): boolean {
  const r = REGIONS.find(x => x.id === 'emerald_valley')!;
  return pointInPolygon(lonDeg, latDeg, r.outline);
}

export function inRegion(regionId: string, lonDeg: number, latDeg: number): boolean {
  const r = REGIONS.find(x => x.id === regionId);
  return r ? pointInPolygon(lonDeg, latDeg, r.outline) : false;
}

function clampShade(v: number): number {
  return Math.max(0.78, Math.min(1.16, v));
}

function hillshade(lonDeg: number, latDeg: number, seed: number): number {
  const d = 0.5;
  const eC = sampleHeight(lonDeg, latDeg, seed);
  const eW = sampleHeight(lonDeg - d, latDeg, seed);
  const eN = sampleHeight(lonDeg, latDeg + d, seed);
  const gx = (eW - eC) / d;
  const gy = (eN - eC) / d;
  const lx = -0.707, ly = 0.707, lz = 0.707;
  const dot = (lx * gx + ly * gy + lz) / Math.hypot(gx, gy, 1);
  return clampShade(dot * 0.34 + 0.88);
}

// ============ 河网（缓存） ============
let riversCache: Polyline[] | null = null;
let riversSeed = -1;

export function getRivers(seed: number): Polyline[] {
  if (!riversCache || riversSeed !== seed) {
    riversCache = [MAIN_RIVER, TRIBUTARY_WEST, TRIBUTARY_EAST];
    riversSeed = seed;
  }
  return riversCache;
}

// ============ 道路 / 水网（矢量，遵循节点） ============
const n07 = NODES.find(n => n.id === 'facility_07')!;
const nOut = NODES.find(n => n.id === 'valley_outpost')!;
const nFerry = NODES.find(n => n.id === 'old_ferry_camp')!;
export const WATER_NET: [number, number][] = [[n07.lon, n07.lat], [nOut.lon, nOut.lat]];
export const ROAD_NET: [number, number][] = [
  [nOut.lon, nOut.lat], [41.2, 16.0], [42.0, 15.5], [42.8, 15.0],
  [43.7, 14.5], [44.5, 14.0], [nFerry.lon, nFerry.lat],
];

// ============ 分类着色（连续色阶 + 微斑驳） ============
type RGB = [number, number, number];

function lerp3(a: RGB, b: RGB, t: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function lowlandColor(m: number, latDeg: number, lonDeg: number): RGB {
  const aLat = Math.abs(latDeg);
  if (inValleyRegion(lonDeg, latDeg) && m > 0.40) {                 // 河谷草地/耕地
    const rows = Math.sin(latDeg * 22) * Math.cos(lonDeg * 16);
    return [124 + rows * 6, 146 + rows * 6, 92] as RGB;
  }
  const dry = Math.max(0, Math.min(1, (0.48 - m) / 0.22));
  const wet = Math.max(0, Math.min(1, (m - 0.50) / 0.28));
  let base = lerp3([110, 132, 82], [151, 128, 82], dry * 0.82);
  base = lerp3(base, [55, 88, 61], wet * 0.68);
  // 低纬副热带保持偏干，但不产生硬边界的橙色大块。
  if (aLat < 12) base = lerp3(base, [118, 136, 86], 0.18);
  return base;
}

function terrainRGB(e: number, m: number, latDeg: number, lonDeg: number, seed: number): RGB {
  const aLat = Math.abs(latDeg);
  let base: RGB;
  const deepTop = SEA - 0.10;    // 深海 #0C2E43
  const shallowTop = SEA - 0.03; // 浅海 #195B73
  if (e < deepTop) { const d = Math.max(0, e / deepTop); return [9 + d * 5, 35 + d * 11, 51 + d * 12]; }
  if (e < shallowTop) return lerp3([14, 48, 65], [24, 78, 94], (e - deepTop) / (shallowTop - deepTop));
  if (e < SEA) return lerp3([24, 78, 94], [60, 119, 130], (e - shallowTop) / (SEA - shallowTop));
  if (e < SEA + 0.012) return [140, 130, 100]; // 海岸/滩
  const low = lowlandColor(m, latDeg, lonDeg);
  if (e < SEA + 0.085) base = low;
  else if (e < SEA + 0.15) base = lerp3(low, [96, 101, 94], (e - SEA - 0.085) / 0.065);
  else if (e < SEA + 0.22) base = [96, 101, 94];
  else if (aLat > 36) base = lerp3([96, 101, 94], [220, 229, 226], Math.min(1, (e - SEA - 0.22) / 0.08));
  else base = [116, 118, 109];
  // 南部酸雨/污染（半透明斑驳）
  if (inAcidRegion(lonDeg, latDeg)) {
    const speck = hash2(Math.floor(lonDeg * 6), Math.floor(latDeg * 6), seed);
    const k = 0.20 + speck * 0.38;
    const p = speck > 0.5 ? [155, 110, 72] : [124, 96, 80];
    base = [
      Math.round(base[0] * (1 - k) + p[0] * k),
      Math.round(base[1] * (1 - k) + p[1] * k),
      Math.round(base[2] * (1 - k) + p[2] * k),
    ] as RGB;
  }
  const grain = hash2(Math.floor(lonDeg * 46), Math.floor(latDeg * 46), seed + 777);
  const gk = 0.95 + grain * 0.10;
  return [base[0] * gk, base[1] * gk, base[2] * gk];
}

// ============ 基础纹理（纯地形，一次生成） ============
export function buildBaseTexture(seed: number): HTMLCanvasElement {
  ensureGrids(seed);
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d')!;
  const img = g.createImageData(TEX_W, TEX_H);
  const data = img.data;
  for (let py = 0; py < TEX_H; py++) {
    const lat = 90 - (py / TEX_H) * 180;
    for (let px = 0; px < TEX_W; px++) {
      const lon = (px / TEX_W) * 360;
      const e = sampleHeight(lon, lat, seed);
      const m = sampleMoisture(lon, lat, seed);
      let [r, gg, b] = terrainRGB(e, m, lat, lon, seed);
      if (e >= SEA && Math.abs(lat) <= 68) {
        const sh = hillshade(lon, lat, seed);
        r = Math.min(255, r * sh);
        gg = Math.min(255, gg * sh);
        b = Math.min(255, b * sh);
      }
      const pole = Math.max(0, (Math.abs(lat) - 62) / 28) * 0.18;
      r *= 1 - pole; gg *= 1 - pole; b *= 1 - pole;
      const i = (py * TEX_W + px) * 4;
      data[i] = r; data[i + 1] = gg; data[i + 2] = b; data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function preciseHillshade(lonDeg: number, latDeg: number, seed: number, eC: number): number {
  const d = 0.16;
  const eW = baseElevation(lonDeg - d, latDeg, seed);
  const eN = baseElevation(lonDeg, latDeg + d, seed);
  const gx = (eW - eC) / d;
  const gy = (eN - eC) / d;
  const lx = -0.707, ly = 0.707, lz = 0.707;
  const dot = (lx * gx + ly * gy + lz) / Math.hypot(gx, gy, 1);
  return clampShade(dot * 0.62 + 0.78);
}

function inLocalValley(lon: number, lat: number): boolean {
  return lon >= 30 && lon <= 52 && lat >= 2 && lat <= 26;
}

/** 中近景河谷的专用地貌调色：不把全球宏观生物群落放大成色带。 */
function localValleyRGB(lon: number, lat: number, seed: number): RGB {
  const riverDist = distToPolylineDeg(lon, lat, MAIN_RIVER);
  const westDist = distToPolylineDeg(lon, lat, WEST_RIDGE);
  const eastDist = distToPolylineDeg(lon, lat, EAST_FOOTHILLS);
  const n = fbm3(lon * 0.20, lat * 0.20, seed * 0.01, seed + 121, 3);
  const grain = (n - 0.5) * 8;

  if (riverDist < 0.040) return [56 + grain * 0.2, 132 + grain * 0.3, 157 + grain * 0.4];
  if (riverDist < 0.62) {
    const rows = Math.sin(lon * 13 + lat * 4) > 0.46 ? 7 : 0;
    return [111 + rows + grain, 139 + rows + grain, 84 + grain * 0.45];
  }

  const ridgeDist = Math.min(westDist, eastDist);
  if (ridgeDist < 0.30) {
    const t = 1 - ridgeDist / 0.30;
    const rock: RGB = westDist < eastDist ? [78, 87, 76] : [94, 101, 86];
    const grass: RGB = [103, 123, 80];
    const shade = 0.76 + n * 0.20;
    const mixed = lerp3(grass, rock, t * 0.9);
    return [mixed[0] * shade, mixed[1] * shade, mixed[2] * shade];
  }

  // 河谷外缘是低饱和草地与干地的渐变，避免大块纯黄和纯绿。
  const dry = Math.max(0, Math.min(1, (lon - 42) / 11 + (18 - lat) / 30));
  const grass = lerp3([106, 130, 83], [151, 128, 81], dry * 0.55);
  return [grass[0] + grain, grass[1] + grain, grass[2] + grain * 0.45];
}

/** 中近景用：直接从噪声求地形色（不放大低清纹理） */
export function preciseTerrainRGB(lonDeg: number, latDeg: number, seed: number): RGB {
  if (inLocalValley(lonDeg, latDeg)) return localValleyRGB(lonDeg, latDeg, seed);
  const e = baseElevation(lonDeg, latDeg, seed);
  const m = moistureAt(lonDeg, latDeg, seed);
  let [r, g, b] = terrainRGB(e, m, latDeg, lonDeg, seed);
  if (e >= SEA && Math.abs(latDeg) <= 68) {
    const sh = preciseHillshade(lonDeg, latDeg, seed, e);
    r = Math.min(255, r * sh);
    g = Math.min(255, g * sh);
    b = Math.min(255, b * sh);
  }
  return [r, g, b];
}
