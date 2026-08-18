import type {
  BlueprintSiteAnchor,
  BlueprintWatershed,
  ClimateKind,
  MapNode,
  SiteRequirement,
  TectonicBoundary,
  TectonicPlate,
  TerrainEdge,
  TerrainModuleSlot,
  TerrainRegionKind,
  SurfaceFeaturePlacement,
  WorldBlueprint,
} from './types';
import { mulberry32 } from './render/noise';
import { selectTerrainModuleTemplate, validateTerrainModuleProtocol } from './world/terrainModules';
import { buildWorldSkeleton, getGeoGrid } from './world/geoGrid';
import { sampleClimate } from './world/climate';
import { buildHydrology } from './world/hydrology';
import { buildEcology } from './world/ecology';
import { evaluateSite } from './world/siteSuitability';
import { buildSpatialNetwork } from './world/spatialNetwork';

/** R9.1 起大陆块直接参与高程重建；升级世界生成器必须触发可追溯的蓝图迁移。 */
export const WORLD_GENERATOR_VERSION = 8 as const;
const D2R = Math.PI / 180;

function wrapLon(lon: number): number {
  return ((lon + 180) % 360 + 360) % 360 - 180;
}

function distanceDeg(a: [number, number], b: [number, number]): number {
  const dLon = wrapLon(a[0] - b[0]) * D2R;
  const dLat = (a[1] - b[1]) * D2R;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * D2R) * Math.cos(b[1] * D2R) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) / D2R;
}

function pointToSegmentDistance(point: [number, number], a: [number, number], b: [number, number]): number {
  const x = point[0] * Math.cos(point[1] * D2R), y = point[1];
  const ax = a[0] * Math.cos(point[1] * D2R), ay = a[1];
  const bx = b[0] * Math.cos(point[1] * D2R), by = b[1];
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / Math.max(0.000001, dx * dx + dy * dy)));
  return Math.hypot(x - (ax + dx * t), y - (ay + dy * t));
}

function distanceToPath(point: [number, number], path: [number, number][]): number {
  let best = Infinity;
  for (let i = 0; i < path.length - 1; i++) best = Math.min(best, pointToSegmentDistance(point, path[i], path[i + 1]));
  return best;
}

/** 以边界走向检验相对漂移：汇聚/张裂应主要跨越边界，转换断层应主要沿边界错动。 */
function boundaryMotionIsPlausible(boundary: TectonicBoundary, plates: TectonicPlate[]): boolean {
  const first = boundary.path[0], last = boundary.path[boundary.path.length - 1];
  const cosLat = Math.max(0.28, Math.cos(((first[1] + last[1]) * 0.5) * D2R));
  const tangentX = (last[0] - first[0]) * cosLat, tangentY = last[1] - first[1];
  const length = Math.hypot(tangentX, tangentY);
  if (length < 0.001) return false;
  const tx = tangentX / length, ty = tangentY / length;
  const plateA = plates.find((plate) => plate.id === boundary.plates[0]);
  const plateB = plates.find((plate) => plate.id === boundary.plates[1]);
  if (!plateA || !plateB) return false;
  const relativeX = plateA.drift[0] - plateB.drift[0];
  const relativeY = plateA.drift[1] - plateB.drift[1];
  const tangential = Math.abs(relativeX * tx + relativeY * ty);
  const normal = Math.abs(relativeX * -ty + relativeY * tx);
  return boundary.kind === 'transform' ? tangential > normal * 1.2 : normal > tangential * 1.2;
}

function climateAt(lat: number, wetness: number): ClimateKind {
  const abs = Math.abs(lat);
  if (abs >= 62) return 'polar';
  if (abs >= 46) return 'cold';
  if (abs <= 15 && wetness >= 0.54) return 'tropical';
  if (wetness < 0.38) return 'arid';
  return 'temperate';
}

function module(
  id: string,
  region: TerrainRegionKind,
  center: [number, number],
  edges: [TerrainEdge, TerrainEdge, TerrainEdge, TerrainEdge],
  climate: ClimateKind,
  random: () => number,
): Omit<TerrainModuleSlot, 'templateId'> {
  const rotations: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];
  return {
    id, region, climate, center,
    rotation: rotations[Math.floor(random() * rotations.length)],
    variant: Math.floor(random() * 6),
    edges: { north: edges[0], east: edges[1], south: edges[2], west: edges[3] },
  };
}

function initialWatersheds(): BlueprintWatershed[] {
  // 这条流域是首局设定约束：不是随机把设施塞进地形，而是地形本身提供可居住河谷。
  const emerald: [number, number][] = [
    [36.5, 22.0], [37.5, 20.5], [38.6, 18.8], [40.3, 16.8], [42.5, 15.0],
    [44.5, 13.5], [46.5, 11.0], [47.2, 8.5], [47.6, 5.5],
  ];
  return [{
    id: 'emerald_drainage',
    source: emerald[0], mouth: emerald[emerald.length - 1], path: emerald,
    elevations: [0.88, 0.82, 0.76, 0.70, 0.64, 0.59, 0.54, 0.50, 0.47],
    drainage: 'ocean',
  }];
}

function initialSites(): BlueprintSiteAnchor[] {
  return [
    { id: 'facility_07', kind: 'shelter', position: [38.2, 18.6], required: ['land', 'low_slope'] },
    { id: 'valley_outpost', kind: 'settlement', position: [40.6, 16.4], required: ['land', 'freshwater', 'low_slope'] },
    { id: 'old_ferry_camp', kind: 'crossing', position: [45.2, 13.8], required: ['land', 'freshwater', 'river_crossing'] },
  ];
}

const SURFACE_ASSETS: Record<Exclude<TerrainRegionKind, 'ocean'>, string[]> = {
  coast: ['terrain-coast-cliff-headland', 'terrain-coast-beach-inlet', 'terrain-coast-estuary'],
  plain: ['terrain-plain-field-mosaic', 'terrain-plain-scrub-border'],
  river_valley: ['terrain-river_valley-river-bank', 'terrain-river_valley-terraced-field', 'terrain-river_valley-wetland-fringe'],
  highland: ['terrain-highland-escarpment', 'terrain-highland-broken-shelf', 'terrain-highland-hill-mass'],
  mountain: ['terrain-mountain-ridge-crest', 'terrain-mountain-single-peak', 'terrain-mountain-shoulder-slope', 'terrain-mountain-snow-cap'],
  forest: ['terrain-forest-dense-canopy', 'terrain-forest-open-canopy', 'terrain-forest-woodland-edge'],
  arid: ['terrain-arid-dune-field', 'terrain-arid-mesa-outcrop', 'terrain-arid-dry-wash'],
  tundra: ['terrain-tundra-frost-heath', 'terrain-tundra-ice-rock', 'terrain-tundra-snow-drift'],
};

const SURFACE_MODULE_PROFILE: Record<Exclude<TerrainRegionKind, 'ocean'>, { count: number; radius: number; span: [number, number]; layer: SurfaceFeaturePlacement['layer'] }> = {
  coast: { count: 10, radius: 15, span: [2.8, 5.2], layer: 'regional' },
  plain: { count: 8, radius: 13, span: [2.1, 3.8], layer: 'local' },
  river_valley: { count: 13, radius: 11, span: [2.5, 4.3], layer: 'regional' },
  highland: { count: 12, radius: 15, span: [3.8, 6.6], layer: 'regional' },
  mountain: { count: 10, radius: 17, span: [4.5, 7.4], layer: 'regional' },
  forest: { count: 15, radius: 15, span: [3.4, 6.4], layer: 'regional' },
  arid: { count: 12, radius: 16, span: [3.5, 6.0], layer: 'regional' },
  tundra: { count: 11, radius: 16, span: [3.5, 6.2], layer: 'regional' },
};

function rotateBy(index: number): 0 | 90 | 180 | 270 {
  return ([0, 90, 180, 270] as const)[((index % 4) + 4) % 4];
}

/**
 * 自然地貌在生成世界时确定为一份地理占地清单。这里的坐标和 span 都是世界单位，
 * 渲染器只能据此合成同一张地表，不能在每个镜头里重新掷骰子。
 */
export function buildSurfaceFeatures(world: Pick<WorldBlueprint, 'seed' | 'ranges' | 'terrainModules'>): SurfaceFeaturePlacement[] {
  const random = mulberry32(world.seed ^ 0x5F7F_A11A);
  const features: SurfaceFeaturePlacement[] = [];
  const add = (feature: Omit<SurfaceFeaturePlacement, 'id'>) => {
    features.push({ ...feature, id: `surface-${features.length + 1}` });
  };

  // 山系是宏观连续地貌：沿每条预设脊线布置交叠的大尺度山脊段，绝不是单个山图标。
  for (const range of world.ranges) {
    for (let segment = 0; segment < range.ridge.length - 1; segment++) {
      const a = range.ridge[segment], b = range.ridge[segment + 1];
      const length = Math.hypot((b[0] - a[0]) * Math.cos(a[1] * D2R), b[1] - a[1]);
      const pieces = Math.max(1, Math.ceil(length / 3.4));
      for (let piece = 0; piece < pieces; piece++) {
        const t = (piece + 0.25 + random() * 0.5) / pieces;
        const anchor: [number, number] = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        const assets = SURFACE_ASSETS.mountain;
        add({
          assetId: assets[Math.floor(random() * assets.length)], moduleId: range.id, anchor,
          rotation: rotateBy(Math.round(Math.atan2(b[1] - a[1], b[0] - a[0]) / (Math.PI / 2))),
          spanDegrees: 5.2 + random() * 3.1, layer: 'macro',
        });
      }
    }
  }

  // 各区域模块补充森林、河谷、海岸等区域性和局部性细节，仍以地理坐标而非屏幕坐标记录。
  for (const module of world.terrainModules) {
    if (module.region === 'ocean') continue;
    const profile = SURFACE_MODULE_PROFILE[module.region];
    const assets = SURFACE_ASSETS[module.region];
    for (let index = 0; index < profile.count; index++) {
      const angle = random() * Math.PI * 2;
      const distance = Math.sqrt(random()) * profile.radius;
      const lon = module.center[0] + Math.cos(angle) * distance / Math.max(0.25, Math.cos(module.center[1] * D2R));
      const lat = Math.max(-84, Math.min(84, module.center[1] + Math.sin(angle) * distance));
      add({
        assetId: assets[Math.floor(random() * assets.length)], moduleId: module.id, anchor: [lon, lat],
        rotation: rotateBy(module.rotation / 90 + index),
        spanDegrees: profile.span[0] + random() * (profile.span[1] - profile.span[0]), layer: profile.layer,
      });
    }
  }
  return features;
}

/** 为旧蓝图补充新字段，不改动既有种子、地形模块、地点或工程地表变化。 */
export function withSurfaceFeatures(world: WorldBlueprint): WorldBlueprint {
  if (Array.isArray(world.surfaceFeatures) && world.surfaceFeatures.length > 0) return world;
  return { ...world, surfaceFeatures: buildSurfaceFeatures(world) };
}

/** 为旧存档补充球面格绑定；只补元数据，不重掷地形或改写已发生的工程结果。 */
export function withWorldSkeleton(world: WorldBlueprint): WorldBlueprint {
  if (world.skeleton?.version === 1) return world;
  return { ...world, skeleton: buildWorldSkeleton(world.siteAnchors) };
}

/**
 * 生成的是稳定的地理解释层，而不是纹理。首局河谷位置固定为世界观约束；
 * 远方大陆的尺寸、模块变体和方向由种子决定，供后续外拓与随机落点使用。
 */
export function generateWorldBlueprint(seed: number): WorldBlueprint {
  const random = mulberry32(seed ^ 0x4A7D_1107);
  const wetness = 0.44 + random() * 0.18;
  const eastCenter: [number, number] = [112 + Math.round((random() - 0.5) * 16), 12 + Math.round((random() - 0.5) * 18)];
  const southernCenter: [number, number] = [-98 + Math.round((random() - 0.5) * 22), -28 + Math.round((random() - 0.5) * 14)];
  const coreClimate = climateAt(16, wetness);
  const moduleDrafts = [
    module('north_range', 'mountain', [28, 37], ['tundra', 'ridge', 'ridge', 'ridge'], 'cold', random),
    module('west_highland', 'highland', [34, 20], ['ridge', 'highland', 'plain', 'highland'], coreClimate, random),
    module('emerald_valley', 'river_valley', [40, 16], ['river', 'highland', 'plain', 'ridge'], coreClimate, random),
    module('ferry_lowlands', 'plain', [45, 13], ['plain', 'coast', 'plain', 'river'], coreClimate, random),
    // 信风越过主大陆后在西侧形成干燥内陆；荒地必须先由水汽来源与雨影成立。
    module('western_badlands', 'arid', [8, 16], ['plain', 'arid', 'arid', 'highland'], 'arid', random),
    // 东部迎风岸从海上获得稳定水汽，形成与西部荒地对照的温湿森林。
    module('eastern_windward_forest', 'forest', [126, 14], ['forest', 'plain', 'forest', 'coast'], 'tropical', random),
    module('northern_tundra', 'tundra', [18, 63], ['ocean', 'tundra', 'ridge', 'ocean'], 'polar', random),
    module('eastern_archipelago', 'coast', eastCenter, ['ocean', 'ocean', 'coast', 'coast'], climateAt(eastCenter[1], wetness), random),
    module('southern_continent', 'coast', southernCenter, ['ocean', 'plain', 'ocean', 'coast'], climateAt(southernCenter[1], wetness), random),
  ];
  const modules = moduleDrafts.map((entry) => selectTerrainModuleTemplate(entry, seed));
  const moduleLinks = [
    { id: 'north_range_to_west_highland', fromId: 'north_range', fromEdge: 'south', toId: 'west_highland', toEdge: 'north' },
    { id: 'west_highland_to_emerald_valley', fromId: 'west_highland', fromEdge: 'east', toId: 'emerald_valley', toEdge: 'west' },
    { id: 'emerald_valley_to_western_badlands', fromId: 'emerald_valley', fromEdge: 'south', toId: 'western_badlands', toEdge: 'north' },
  ] as const;
  validateTerrainModuleProtocol(modules, [...moduleLinks]);
  const world: WorldBlueprint = {
    generatorVersion: WORLD_GENERATOR_VERSION,
    seed,
    planet: {
      radiusKm: 6_460,
      gravityG: 1.02,
      axialTiltDeg: 22.8,
      dayHours: 25.1,
      yearDays: 392,
      oceanTarget: 0.72,
      tectonicActivity: 'active',
    },
    landmasses: [
      // 大陆块是高程发生器的事实源，不再只是给贴图用的装饰坐标。
      // 首局河谷位于主大陆东部内陆；其余大陆保证全景有真实的海盆与洲际尺度。
      { id: 'primary_continent', center: [30, 10], radius: [43, 33], continentalness: 0.95 },
      { id: 'western_continent', center: [-78, 19], radius: [27 + Math.round(random() * 5), 30 + Math.round(random() * 4)], continentalness: 0.88 },
      { id: 'eastern_continent', center: eastCenter, radius: [27 + Math.round(random() * 5), 24 + Math.round(random() * 4)], continentalness: 0.78 },
      { id: 'southern_continent', center: southernCenter, radius: [29 + Math.round(random() * 6), 20 + Math.round(random() * 5)], continentalness: 0.82 },
      { id: 'southern_plateau', center: [26, -49], radius: [23 + Math.round(random() * 4), 14 + Math.round(random() * 3)], continentalness: 0.66 },
      { id: 'northern_land', center: [4, 64], radius: [28 + Math.round(random() * 4), 15 + Math.round(random() * 3)], continentalness: 0.64 },
      { id: 'far_east_arc', center: [158, -8], radius: [18 + Math.round(random() * 4), 14 + Math.round(random() * 3)], continentalness: 0.52 },
    ],
    tectonicPlates: [
      { id: 'central_continental_plate', crust: 'continental', center: [28, 13], drift: [0.02, 0.80] },
      { id: 'northern_continental_plate', crust: 'continental', center: [20, 58], drift: [-0.02, -0.72] },
      { id: 'emerald_west_microplate', crust: 'continental', center: [31, 15], drift: [0.02, -0.60] },
      { id: 'emerald_east_microplate', crust: 'continental', center: [48, 15], drift: [-0.02, -0.58] },
      { id: 'western_oceanic_plate', crust: 'oceanic', center: [-85, 4], drift: [0.62, 0.08] },
      { id: 'eastern_oceanic_plate', crust: 'oceanic', center: [104, 4], drift: [-0.62, -0.08] },
    ],
    tectonicBoundaries: [
      // 两块大陆地壳汇聚：北部连续山系与其南侧高原都从此处派生。
      { id: 'northern_collision', kind: 'convergent', plates: ['central_continental_plate', 'northern_continental_plate'], path: [[-8, 33], [10, 38], [28, 39], [46, 37], [62, 31]], width: 2.1, intensity: 0.150 },
      // 河谷两侧是稳定大陆内部的古老转换断裂/断块边缘，而非凭空画出的两道山墙。
      { id: 'emerald_west_fault', kind: 'transform', plates: ['central_continental_plate', 'emerald_west_microplate'], path: [[34.2, 22.5], [35.2, 19.2], [36.1, 15.5], [37.0, 11.5], [37.6, 8.0]], width: 0.70, intensity: 0.095 },
      { id: 'emerald_east_fault', kind: 'transform', plates: ['central_continental_plate', 'emerald_east_microplate'], path: [[43.4, 21.5], [44.0, 18.0], [45.2, 14.5], [46.5, 10.5], [47.4, 7.0]], width: 0.85, intensity: 0.060 },
      // 远洋张裂带保证海盆不是静态黑底；它会生成可查询的洋中脊与深海航线地质风险。
      { id: 'western_spreading_ridge', kind: 'divergent', plates: ['western_oceanic_plate', 'eastern_oceanic_plate'], path: [[-146, -44], [-143, -18], [-148, 8], [-142, 31]], width: 2.8, intensity: 0.050 },
    ],
    ranges: [
      { id: 'northern_range', sourceBoundaryId: 'northern_collision', ridge: [[-8, 33], [10, 38], [28, 39], [46, 37], [62, 31]], width: 2.1, height: 0.150 },
      { id: 'emerald_west_ridge', sourceBoundaryId: 'emerald_west_fault', ridge: [[34.2, 22.5], [35.2, 19.2], [36.1, 15.5], [37.0, 11.5], [37.6, 8.0]], width: 0.70, height: 0.095 },
      { id: 'emerald_east_foothills', sourceBoundaryId: 'emerald_east_fault', ridge: [[43.4, 21.5], [44.0, 18.0], [45.2, 14.5], [46.5, 10.5], [47.4, 7.0]], width: 0.85, height: 0.060 },
    ],
    watersheds: initialWatersheds(),
    hydrology: { version: 1, gridSubdivision: 5, riverCellIds: [], lakeCellIds: [], basins: [] },
    ecology: { version: 1, gridSubdivision: 5, biomeCoverage: {}, resourceAreas: [] },
    spatialNetwork: { version: 2, gridSubdivision: 5, settlementPotentials: [], engineeringPotentials: [] },
    terrainModules: modules,
    moduleLinks: [...moduleLinks],
    skeleton: buildWorldSkeleton(initialSites()),
    surfaceFeatures: [],
    siteAnchors: initialSites(),
    terrainChanges: [],
  };
  // 地貌模块的气候不再由一条“纬度 + 随机湿度”规则预先指定。
  // 先以完整的构造/海盆/高程世界取样，再选取匹配的地貌材料协议。
  world.terrainModules = world.terrainModules.map((slot) => {
    const climate = sampleClimate(slot.center[0], slot.center[1], world).climate;
    return selectTerrainModuleTemplate({ ...slot, climate }, seed);
  });
  world.hydrology = buildHydrology(world);
  world.ecology = buildEcology(world);
  world.spatialNetwork = buildSpatialNetwork(world);
  world.surfaceFeatures = buildSurfaceFeatures(world);
  return world;
}

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(`Invalid world blueprint: ${message}`);
}

const REQUIRED_TEST_TERRAIN: Exclude<TerrainRegionKind, 'ocean'>[] = [
  'coast', 'plain', 'river_valley', 'highland', 'mountain', 'forest', 'arid', 'tundra',
];

function nearestModuleDistance(world: WorldBlueprint, point: [number, number], regions: TerrainRegionKind[]): number {
  let best = Infinity;
  for (const slot of world.terrainModules) {
    if (regions.includes(slot.region)) best = Math.min(best, distanceDeg(point, slot.center));
  }
  return best;
}

/** 供未来工程选址使用；不通过的锚点不能进入世界蓝图或解锁可建项目。 */
export function siteAnchorIsSuitable(anchor: BlueprintSiteAnchor, world: WorldBlueprint): boolean {
  const requirements: SiteRequirement[] = [];
  for (const requirement of anchor.required) {
    if (requirement === 'land') requirements.push({ kind: 'land' });
    else if (requirement === 'freshwater') requirements.push({ kind: 'freshwater', min: 0.30 });
    else if (requirement === 'low_slope') requirements.push({ kind: 'slope_max', max: 0.15 });
    else if (requirement === 'river_crossing') requirements.push({ kind: 'river_crossing', maxDistance: 0.06 });
    else if (requirement === 'coast') requirements.push({ kind: 'harbor', min: 0.42 });
    else if (requirement === 'narrow_valley') requirements.push({ kind: 'freshwater', min: 0.45 }, { kind: 'river_drop', min: 0.02 });
    else requirements.push({ kind: 'metal_ore', min: 0.42 });
  }
  return evaluateSite(anchor.position[0], anchor.position[1], requirements, world).eligible;
}

/** 地图对象保持叙事字段，但位置只能从世界蓝图的同 ID 地点锚点读取。 */
export function alignMapNodesToWorld(nodes: MapNode[], world: WorldBlueprint): MapNode[] {
  const anchors = new Map(world.siteAnchors.map((anchor) => [anchor.id, anchor]));
  return nodes.map((node) => {
    const anchor = anchors.get(node.id);
    return anchor ? { ...node, lon: anchor.position[0], lat: anchor.position[1] } : node;
  });
}

/** 开发与存档迁移均调用此函数，阻止不自洽蓝图写入。 */
export function validateWorldBlueprint(world: WorldBlueprint): void {
  assert(world.generatorVersion === WORLD_GENERATOR_VERSION, 'unsupported generator version');
  assert(Number.isFinite(world.seed), 'seed is not finite');
  assert(world.planet?.radiusKm > 4_000 && world.planet.radiusKm < 10_000, 'invalid planetary radius');
  assert(world.planet.gravityG > 0.5 && world.planet.gravityG < 1.5, 'invalid planetary gravity');
  assert(world.planet.axialTiltDeg >= 0 && world.planet.axialTiltDeg <= 45, 'invalid axial tilt');
  assert(world.planet.oceanTarget > 0.5 && world.planet.oceanTarget < 0.9, 'invalid ocean target');
  assert(world.landmasses.length >= 2, 'needs at least two landmasses');
  assert(world.tectonicPlates?.length >= 3, 'needs tectonic plates');
  assert(world.tectonicBoundaries?.length >= 3, 'needs tectonic boundaries');
  const plateIds = new Set(world.tectonicPlates.map((plate) => plate.id));
  assert(plateIds.size === world.tectonicPlates.length, 'duplicate tectonic plate');
  const boundaryKinds = new Set(world.tectonicBoundaries.map((boundary) => boundary.kind));
  for (const kind of ['convergent', 'divergent', 'transform'] as const) assert(boundaryKinds.has(kind), `missing ${kind} tectonic boundary`);
  for (const boundary of world.tectonicBoundaries) {
    assert(boundary.path.length >= 2 && boundary.width > 0 && boundary.intensity > 0, `${boundary.id} has invalid geometry`);
    assert(plateIds.has(boundary.plates[0]) && plateIds.has(boundary.plates[1]), `${boundary.id} references an unknown plate`);
    assert(boundaryMotionIsPlausible(boundary, world.tectonicPlates), `${boundary.id} drift does not match ${boundary.kind}`);
  }
  for (const range of world.ranges) assert(world.tectonicBoundaries.some((boundary) => boundary.id === range.sourceBoundaryId), `${range.id} has no tectonic source`);
  assert(world.terrainModules.length >= 6, 'needs terrain modules');
  const testTerrain = new Set(world.terrainModules.map((entry) => entry.region));
  for (const region of REQUIRED_TEST_TERRAIN) assert(testTerrain.has(region), `test world is missing ${region}`);
  assert(world.skeleton?.version === 1, 'needs world skeleton');
  assert(world.skeleton.topology === 'icosphere' && world.skeleton.subdivision === 5, 'unsupported world skeleton topology');
  assert(world.skeleton.cellCount === getGeoGrid().cells.length, 'world skeleton cell count mismatch');
  assert(Array.isArray(world.surfaceFeatures) && world.surfaceFeatures.length >= 40, 'needs frozen surface features');
  assert(new Set(world.terrainModules.map((entry) => entry.id)).size === world.terrainModules.length, 'duplicate module id');
  validateTerrainModuleProtocol(world.terrainModules, world.moduleLinks);
  const validSurfaceOwners = new Set([...world.terrainModules.map((entry) => entry.id), ...world.ranges.map((entry) => entry.id)]);
  assert(new Set(world.surfaceFeatures.map((entry) => entry.id)).size === world.surfaceFeatures.length, 'duplicate surface feature id');
  for (const feature of world.surfaceFeatures) {
    assert(validSurfaceOwners.has(feature.moduleId), `${feature.id} has no geographic owner`);
    assert(feature.assetId.startsWith('terrain-') && Number.isFinite(feature.spanDegrees) && feature.spanDegrees > 0, `${feature.id} is not a valid terrain feature`);
  }
  for (const watershed of world.watersheds) {
    assert(watershed.path.length >= 2, `${watershed.id} has no path`);
    assert(watershed.path.length === watershed.elevations.length, `${watershed.id} path/elevation mismatch`);
    assert(distanceDeg(watershed.source, watershed.path[0]) < 0.01, `${watershed.id} source mismatch`);
    assert(distanceDeg(watershed.mouth, watershed.path[watershed.path.length - 1]) < 0.01, `${watershed.id} mouth mismatch`);
    for (let i = 1; i < watershed.elevations.length; i++) {
      assert(watershed.elevations[i] <= watershed.elevations[i - 1], `${watershed.id} flows uphill`);
    }
  }
  assert(world.hydrology?.version === 1 && world.hydrology.gridSubdivision === 5, 'needs hydrology network');
  assert(world.hydrology.riverCellIds.length > 0, 'needs generated river cells');
  assert(world.hydrology.basins.some((basin) => basin.source === 'generated'), 'needs generated drainage basin');
  assert(world.hydrology.basins.some((basin) => basin.source === 'anchored'), 'needs anchored drainage basin');
  const gridIds = new Set(getGeoGrid().cells.map((cell) => cell.id));
  for (const cellId of [...world.hydrology.riverCellIds, ...world.hydrology.lakeCellIds]) assert(gridIds.has(cellId), `hydrology references unknown cell ${cellId}`);
  assert(world.ecology?.version === 1 && world.ecology.gridSubdivision === 5, 'needs ecology network');
  assert((world.ecology.biomeCoverage.arid ?? 0) > 0, 'needs arid ecology');
  assert((world.ecology.biomeCoverage.temperate_forest ?? 0) + (world.ecology.biomeCoverage.tropical_forest ?? 0) > 0, 'needs forest ecology');
  const resourceKinds = new Set(world.ecology.resourceAreas.map((area) => area.kind));
  for (const kind of ['freshwater', 'arable_land', 'timber', 'metal_ore', 'geothermal', 'harbor'] as const) assert(resourceKinds.has(kind), `needs ${kind} resource area`);
  for (const area of world.ecology.resourceAreas) {
    assert(area.quality >= 0 && area.quality <= 1 && area.cellIds.length > 0, `${area.id} has invalid ecology potential`);
    for (const cellId of area.cellIds) assert(gridIds.has(cellId), `${area.id} references unknown cell ${cellId}`);
  }
  assert(world.spatialNetwork?.version === 2 && world.spatialNetwork.gridSubdivision === 5, 'needs spatial network');
  assert(world.spatialNetwork.settlementPotentials.filter((site) => site.role === 'existing').length === world.siteAnchors.length, 'lost existing settlement anchors');
  assert(world.spatialNetwork.engineeringPotentials.length >= 4, 'needs qualified engineering candidates');
  for (const potential of world.spatialNetwork.engineeringPotentials) {
    assert(gridIds.has(potential.cellId) && potential.suitability >= 0 && potential.suitability <= 1, `${potential.id} has invalid engineering site`);
  }
  for (const anchor of world.siteAnchors) assert(siteAnchorIsSuitable(anchor, world), `${anchor.id} violates its geographic requirements`);
  for (const anchor of world.siteAnchors) assert(world.skeleton.anchorCells[anchor.id]?.kind === 'point', `${anchor.id} has no skeleton cell binding`);
}
