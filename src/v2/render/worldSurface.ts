// ============ R8-D 世界地表合成器：一次性合成，所有镜头取样同一张地表 ==========
import type { SurfaceFeaturePlacement, WorldBlueprint } from '../types';
import mountainRidgeCrestUrl from '../assets/map/terrain/mountain/ridge-crest.png';
import mountainSinglePeakUrl from '../assets/map/terrain/mountain/single-peak.png';
import mountainShoulderSlopeUrl from '../assets/map/terrain/mountain/shoulder-slope.png';
import mountainSnowCapUrl from '../assets/map/terrain/mountain/snow-cap.png';
import highlandEscarpmentUrl from '../assets/map/terrain/highland/escarpment.png';
import highlandBrokenShelfUrl from '../assets/map/terrain/highland/broken-shelf.png';
import highlandHillMassUrl from '../assets/map/terrain/highland/hill-mass.png';
import valleyRiverBankUrl from '../assets/map/terrain/river_valley/river-bank.png';
import valleyTerracedFieldUrl from '../assets/map/terrain/river_valley/terraced-field.png';
import valleyWetlandFringeUrl from '../assets/map/terrain/river_valley/wetland-fringe.png';
import plainFieldMosaicUrl from '../assets/map/terrain/plain/field-mosaic.png';
import plainScrubBorderUrl from '../assets/map/terrain/plain/scrub-border.png';
import forestDenseCanopyUrl from '../assets/map/terrain/forest/dense-canopy.png';
import forestOpenCanopyUrl from '../assets/map/terrain/forest/open-canopy.png';
import forestWoodlandEdgeUrl from '../assets/map/terrain/forest/woodland-edge.png';
import aridDuneFieldUrl from '../assets/map/terrain/arid/dune-field.png';
import aridMesaOutcropUrl from '../assets/map/terrain/arid/mesa-outcrop.png';
import aridDryWashUrl from '../assets/map/terrain/arid/dry-wash.png';
import tundraFrostHeathUrl from '../assets/map/terrain/tundra/frost-heath.png';
import tundraIceRockUrl from '../assets/map/terrain/tundra/ice-rock.png';
import tundraSnowDriftUrl from '../assets/map/terrain/tundra/snow-drift.png';
import coastCliffHeadlandUrl from '../assets/map/terrain/coast/cliff-headland.png';
import coastBeachInletUrl from '../assets/map/terrain/coast/beach-inlet.png';
import coastEstuaryUrl from '../assets/map/terrain/coast/estuary.png';
import { TEX_H, TEX_W, buildBaseTexture } from './terrain';

const D2R = Math.PI / 180;
const urls: Record<string, string> = {
  'terrain-mountain-ridge-crest': mountainRidgeCrestUrl,
  'terrain-mountain-single-peak': mountainSinglePeakUrl,
  'terrain-mountain-shoulder-slope': mountainShoulderSlopeUrl,
  'terrain-mountain-snow-cap': mountainSnowCapUrl,
  'terrain-highland-escarpment': highlandEscarpmentUrl,
  'terrain-highland-broken-shelf': highlandBrokenShelfUrl,
  'terrain-highland-hill-mass': highlandHillMassUrl,
  'terrain-river_valley-river-bank': valleyRiverBankUrl,
  'terrain-river_valley-terraced-field': valleyTerracedFieldUrl,
  'terrain-river_valley-wetland-fringe': valleyWetlandFringeUrl,
  'terrain-plain-field-mosaic': plainFieldMosaicUrl,
  'terrain-plain-scrub-border': plainScrubBorderUrl,
  'terrain-forest-dense-canopy': forestDenseCanopyUrl,
  'terrain-forest-open-canopy': forestOpenCanopyUrl,
  'terrain-forest-woodland-edge': forestWoodlandEdgeUrl,
  'terrain-arid-dune-field': aridDuneFieldUrl,
  'terrain-arid-mesa-outcrop': aridMesaOutcropUrl,
  'terrain-arid-dry-wash': aridDryWashUrl,
  'terrain-tundra-frost-heath': tundraFrostHeathUrl,
  'terrain-tundra-ice-rock': tundraIceRockUrl,
  'terrain-tundra-snow-drift': tundraSnowDriftUrl,
  'terrain-coast-cliff-headland': coastCliffHeadlandUrl,
  'terrain-coast-beach-inlet': coastBeachInletUrl,
  'terrain-coast-estuary': coastEstuaryUrl,
};

const images: Record<string, HTMLImageElement> = {};
let cachedSurface: HTMLCanvasElement | null = null;
let cachedKey = '';
let revision = 0;
let invalidateTimer: number | null = null;

function invalidateSurface(): void {
  // 初次加载会同时抵达许多小图；把它们合并成一次重合成，避免每张图各卡一次。
  if (invalidateTimer !== null) return;
  invalidateTimer = window.setTimeout(() => {
    invalidateTimer = null;
    cachedSurface = null;
    cachedKey = '';
    revision += 1;
    window.dispatchEvent(new Event('world-surface-ready'));
  }, 80);
}

function imageFor(assetId: string): HTMLImageElement | null {
  const url = urls[assetId];
  if (!url) return null;
  const cached = images[assetId];
  if (cached) return cached;
  const image = new Image();
  image.onload = invalidateSurface;
  // 缺图不能让基础地表失效；下一次替换资产后会因 URL/key 改变重新进入缓存。
  image.onerror = invalidateSurface;
  image.src = url;
  images[assetId] = image;
  return image;
}

/** 供局部切平面按同一世界坐标重绘已冻结的地貌占地；绝不在调用处随机选图。 */
export function getSurfaceFeatureImage(assetId: string): HTMLImageElement | null {
  return imageFor(assetId);
}

function surfaceKey(world: WorldBlueprint): string {
  const changes = world.terrainChanges.map((entry) => `${entry.id}/${entry.kind}/${entry.anchorId}/${JSON.stringify(entry.data)}`).join(',');
  const features = world.surfaceFeatures.map((feature) => `${feature.id}/${feature.assetId}/${feature.anchor.join(':')}/${feature.rotation}/${feature.spanDegrees}/${feature.layer}`).join(',');
  return `${world.generatorVersion}:${world.seed}:${features}:${changes}`;
}

function layerOrder(layer: SurfaceFeaturePlacement['layer']): number {
  return layer === 'macro' ? 0 : layer === 'regional' ? 1 : 2;
}

function drawFeature(g: CanvasRenderingContext2D, feature: SurfaceFeaturePlacement): void {
  const image = imageFor(feature.assetId);
  if (!image || !image.complete || image.naturalWidth === 0) return;
  const x = ((feature.anchor[0] % 360 + 360) % 360) / 360 * TEX_W;
  const y = (90 - feature.anchor[1]) / 180 * TEX_H;
  const width = feature.spanDegrees / 360 * TEX_W;
  const latitudeAspect = Math.max(0.56, Math.cos(feature.anchor[1] * D2R));
  const height = width * image.naturalHeight / image.naturalWidth * latitudeAspect;
  const alpha = feature.layer === 'macro' ? 0.88 : feature.layer === 'regional' ? 0.76 : 0.62;
  g.save();
  g.globalAlpha = alpha;
  g.translate(Math.round(x), Math.round(y));
  g.rotate(feature.rotation * D2R);
  g.drawImage(image, Math.round(-width / 2), Math.round(-height / 2), Math.round(width), Math.round(height));
  g.restore();
}

/**
 * 返回全世界唯一的自然地表。它只在世界事实或贴图加载状态改变时合成一次；
 * 球面和局部平面都必须从这张图取样，不能对同一地貌再做镜头相关的重新散布。
 */
export function getWorldSurfaceTexture(world: WorldBlueprint): HTMLCanvasElement {
  const key = surfaceKey(world);
  if (cachedSurface && cachedKey === key) return cachedSurface;
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext('2d')!;
  g.imageSmoothingEnabled = false;
  g.drawImage(buildBaseTexture(world), 0, 0);
  [...world.surfaceFeatures].sort((a, b) => layerOrder(a.layer) - layerOrder(b.layer) || a.id.localeCompare(b.id)).forEach((feature) => drawFeature(g, feature));
  cachedSurface = canvas;
  cachedKey = key;
  return canvas;
}

export function worldSurfaceRevision(): number {
  return revision;
}
