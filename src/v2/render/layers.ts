// ============ 三层覆盖层（政治执行 / 城市人口 / 资源生态），低透明 + 边界/斜纹 ============
import type { MapLayerId, WorldBlueprint } from '../types';
import { NODES, REGIONS } from '../data';
import { TEX_W, TEX_H, getRivers } from './terrain';
import { mulberry32 } from './noise';

const sx = TEX_W / 360;
const sy = TEX_H / 180;
const toPx = (lon: number, lat: number): [number, number] => [lon * sx, (90 - lat) * sy];

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

function fillPolygon(g: CanvasRenderingContext2D, poly: [number, number][], color: string, alpha: number): void {
  g.save();
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.beginPath();
  poly.forEach(([lon, lat], i) => {
    const [x, y] = toPx(lon, lat);
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  });
  g.closePath();
  g.fill();
  g.restore();
}

function strokePolygon(g: CanvasRenderingContext2D, poly: [number, number][], color: string, alpha: number, dash: number[] | null, width = 1.6): void {
  g.save();
  g.globalAlpha = alpha;
  g.strokeStyle = color;
  g.lineWidth = width;
  if (dash) g.setLineDash(dash);
  g.beginPath();
  poly.forEach(([lon, lat], i) => {
    const [x, y] = toPx(lon, lat);
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  });
  g.closePath();
  g.stroke();
  g.setLineDash([]);
  g.restore();
}

function hatchPolygon(g: CanvasRenderingContext2D, poly: [number, number][], color: string, alpha: number, spacing = 9): void {
  g.save();
  g.beginPath();
  poly.forEach(([lon, lat], i) => {
    const [x, y] = toPx(lon, lat);
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  });
  g.closePath();
  g.clip();
  g.globalAlpha = alpha;
  g.strokeStyle = color;
  g.lineWidth = 1.4;
  const xs = poly.map(p => toPx(p[0], p[1])[0]);
  const ys = poly.map(p => toPx(p[0], p[1])[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  for (let x = minX - maxY + minY; x < maxX + maxY - minY; x += spacing) {
    g.beginPath();
    g.moveTo(x, minY);
    g.lineTo(x + (maxY - minY), maxY);
    g.stroke();
  }
  g.restore();
}

function radialGlow(g: CanvasRenderingContext2D, lon: number, lat: number, r: number, color: string, alpha: number): void {
  const [x, y] = toPx(lon, lat);
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, color);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.save();
  g.globalAlpha = alpha;
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, r * 2, r * 2);
  g.restore();
}

function drawClusterDots(g: CanvasRenderingContext2D, lon: number, lat: number, color: string, count: number, spread: number, seed: number): void {
  const rnd = mulberry32(seed);
  g.save();
  g.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const r = rnd() * spread;
    const [x, y] = toPx(lon + Math.cos(a) * r, lat + Math.sin(a) * r);
    g.globalAlpha = 0.25 + rnd() * 0.5;
    g.fillRect(x, y, 2.2, 2.2);
  }
  g.restore();
}

function buildPolitical(g: CanvasRenderingContext2D): void {
  const valley = REGIONS.find(r => r.id === 'emerald_valley')!;
  const ferry = REGIONS.find(r => r.id === 'old_ferry')!;
  const acid = REGIONS.find(r => r.id === 'south_acid')!;
  // 只做极淡填充与纹理（边界 1px 由 planetMap 矢量绘制，保证细且不粗于道路）
  fillPolygon(g, valley.outline, '#D4A848', 0.06);
  fillPolygon(g, ferry.outline, '#4F9CB7', 0.05);
  hatchPolygon(g, ferry.outline, '#4F9CB7', 0.20, 8);
  fillPolygon(g, acid.outline, '#B86158', 0.06);
}

function buildPopulation(g: CanvasRenderingContext2D): void {
  const n07 = NODES.find(n => n.id === 'facility_07')!;
  const nOut = NODES.find(n => n.id === 'valley_outpost')!;
  const nFerry = NODES.find(n => n.id === 'old_ferry_camp')!;
  // 外拓营：暖金稀疏灯火 + 柔和光晕
  radialGlow(g, nOut.lon, nOut.lat, 26, 'rgba(212,168,72,0.5)', 0.45);
  drawClusterDots(g, nOut.lon, nOut.lat, '#D4A848', 24, 2.2, 7007);
  // 第 07 号：冷白地下设施微光
  radialGlow(g, n07.lon, n07.lat, 18, 'rgba(220,229,226,0.45)', 0.36);
  drawClusterDots(g, n07.lon, n07.lat, '#DCE5E2', 14, 1.6, 7011);
  // 旧渡口：低亮青色临时灯火
  radialGlow(g, nFerry.lon, nFerry.lat, 14, 'rgba(115,203,231,0.42)', 0.32);
  drawClusterDots(g, nFerry.lon, nFerry.lat, '#73CBE7', 9, 1.4, 7013);
}

function buildEcology(g: CanvasRenderingContext2D, world: WorldBlueprint): void {
  // 主河网高亮（水 #73CBE7）
  const rivers = getRivers(world);
  g.save();
  g.lineCap = 'round';
  rivers.forEach((path, i) => {
    g.strokeStyle = 'rgba(115,203,231,0.5)';
    g.lineWidth = i === 0 ? 4 : 2;
    g.beginPath();
    path.forEach(([lon, lat], j) => {
      const [x, y] = toPx(lon, lat);
      if (j === 0) g.moveTo(x, y); else g.lineTo(x, y);
    });
    g.stroke();
  });
  g.restore();
  // 河谷耕地（浅绿斜纹）
  const valley = REGIONS.find(r => r.id === 'emerald_valley')!;
  hatchPolygon(g, valley.outline, '#D9EBD1', 0.12, 16);
  // 南部酸雨/污染斑点（不整片填充，避免形成大色带）
  const acid = REGIONS.find(r => r.id === 'south_acid')!;
  const rnd = mulberry32(world.seed ^ 0xabc);
  const axs = acid.outline.map(p => p[0]), ays = acid.outline.map(p => p[1]);
  const minX = Math.min(...axs), maxX = Math.max(...axs), minY = Math.min(...ays), maxY = Math.max(...ays);
  g.save();
  for (let i = 0; i < 48; i++) {
    const lon = minX + rnd() * (maxX - minX);
    const lat = minY + rnd() * (maxY - minY);
    if (!pointInPolygon(lon, lat, acid.outline)) continue;
    const [x, y] = toPx(lon, lat);
    g.fillStyle = rnd() > 0.5 ? 'rgba(155,110,72,0.5)' : 'rgba(124,96,80,0.5)';
    g.globalAlpha = 0.22 + rnd() * 0.28;
    g.fillRect(x, y, 3 + rnd() * 4, 3 + rnd() * 4);
  }
  g.restore();
  // 资源点小标记：水源 / 试验田
  const n07 = NODES.find(n => n.id === 'facility_07')!;
  const nOut = NODES.find(n => n.id === 'valley_outpost')!;
  g.save();
  g.fillStyle = '#73CBE7';
  g.globalAlpha = 0.8;
  const [wx, wy] = toPx(n07.lon - 0.4, n07.lat + 0.5);
  g.fillRect(wx, wy, 5, 5);
  g.fillStyle = '#D9EBD1';
  const [fx, fy] = toPx(nOut.lon + 0.5, nOut.lat - 0.4);
  g.fillRect(fx, fy, 5, 5);
  g.restore();
}

export function buildLayerTexture(world: WorldBlueprint, layer: MapLayerId): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d')!;
  if (layer === 'political') buildPolitical(g);
  else if (layer === 'population') buildPopulation(g);
  else buildEcology(g, world);
  return c;
}
