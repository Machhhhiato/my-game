import { SEA, sampleHeight } from '../render/terrain';
import type { BiomeKind, EcologyNetwork, EcologySample, ResourceArea, ResourcePotentialKind, WorldBlueprint } from '../types';
import { sampleClimate } from './climate';
import { getGeoGrid, nearestGeoCell } from './geoGrid';

type EcologyWorld = Pick<WorldBlueprint, 'seed' | 'planet' | 'landmasses' | 'tectonicPlates' | 'tectonicBoundaries' | 'ranges' | 'watersheds' | 'hydrology' | 'terrainModules'>;
const D2R = Math.PI / 180;
// L5 单元平均相邻间距约 160 km，在本行星半径下约折合 1.4°。生态层只需判断
// “靠河/不靠河”的区域尺度，不需要在每格扫描全部河道做数百万次球面三角函数。
const CELL_STEP_DEGREES = 1.4;

function clamp(value: number): number { return Math.max(0, Math.min(1, value)); }

function angularDistance(lonA: number, latA: number, lonB: number, latB: number): number {
  const dLon = (lonB - lonA) * D2R, dLat = (latB - latA) * D2R;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(latA * D2R) * Math.cos(latB * D2R) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) / D2R;
}

function riverDistanceDegrees(lon: number, lat: number, world: EcologyWorld): number {
  const grid = getGeoGrid();
  let best = Infinity;
  for (const id of world.hydrology.riverCellIds) {
    const cell = grid.byId.get(id);
    if (cell) best = Math.min(best, angularDistance(lon, lat, cell.lon, cell.lat));
  }
  return best;
}

function tectonicProximity(lon: number, lat: number, world: EcologyWorld): number {
  let best = Infinity;
  for (const boundary of world.tectonicBoundaries) {
    for (const [boundaryLon, boundaryLat] of boundary.path) best = Math.min(best, angularDistance(lon, lat, boundaryLon, boundaryLat));
  }
  return clamp(1 - best / 18);
}

function coastalAccess(lon: number, lat: number, world: EcologyWorld, riverDistance: number): number {
  const grid = getGeoGrid();
  const cell = nearestGeoCell(lon, lat, grid);
  const adjacentOcean = cell.neighbors.some((id) => {
    const neighbor = grid.byId.get(id)!;
    return sampleHeight(neighbor.lon, neighbor.lat, world as WorldBlueprint) < SEA;
  });
  if (!adjacentOcean) return 0;
  const elevation = sampleHeight(lon, lat, world as WorldBlueprint);
  // 陡峭山岸可停靠性低；低缓大陆架和河口更高。
  const shelf = clamp(1 - Math.max(0, elevation - SEA) / 0.11);
  const river = clamp(1 - riverDistance / 3.5);
  return clamp(shelf * 0.72 + river * 0.28);
}

/** 多源 BFS：一次计算全局格到任意河道的步数，供全图生态生成复用。 */
function riverDistanceByCell(world: EcologyWorld): Map<string, number> {
  const grid = getGeoGrid();
  const distances = new Map<string, number>();
  const queue: string[] = [];
  for (const id of world.hydrology.riverCellIds) {
    if (!grid.byId.has(id) || distances.has(id)) continue;
    distances.set(id, 0);
    queue.push(id);
  }
  for (let index = 0; index < queue.length; index++) {
    const id = queue[index];
    const distance = distances.get(id)!;
    if (distance >= 5) continue;
    for (const neighborId of grid.byId.get(id)!.neighbors) {
      if (distances.has(neighborId)) continue;
      distances.set(neighborId, distance + 1);
      queue.push(neighborId);
    }
  }
  return distances;
}

function sampleEcologyWithRiverDistance(lon: number, lat: number, world: EcologyWorld, riverDistance: number): EcologySample {
  const elevation = sampleHeight(lon, lat, world as WorldBlueprint);
  const climate = sampleClimate(lon, lat, world as WorldBlueprint);
  const river = clamp(1 - riverDistance / 3.2);
  const coast = coastalAccess(lon, lat, world, riverDistance);
  const tectonic = tectonicProximity(lon, lat, world);
  const altitude = clamp((elevation - SEA) / 0.34);
  const temperatureSuitability = clamp((climate.temperatureC + 3) / 24);
  const fertility = clamp(climate.moisture * 0.43 + river * 0.38 + temperatureSuitability * 0.24 - altitude * 0.38);

  let biome: BiomeKind;
  if (climate.temperatureC <= -8) biome = 'ice';
  else if (climate.temperatureC <= 3) biome = 'tundra';
  else if (coast >= 0.72 && elevation < SEA + 0.045 && climate.moisture > 0.40) biome = 'wetland';
  else if (climate.moisture < 0.24) biome = 'arid';
  else if (climate.moisture < 0.37) biome = 'shrubland';
  else if (climate.moisture >= 0.56 && climate.temperatureC >= 20) biome = 'tropical_forest';
  else if (climate.moisture >= 0.48) biome = 'temperate_forest';
  else if (coast >= 0.62) biome = 'coast';
  else biome = 'grassland';

  return {
    biome,
    fertility,
    freshwater: clamp(river * 0.82 + climate.moisture * 0.18),
    timber: biome === 'temperate_forest' ? 0.72 : biome === 'tropical_forest' ? 0.88 : biome === 'shrubland' ? 0.18 : 0,
    metalOre: clamp(tectonic * 0.70 + altitude * 0.22),
    geothermal: clamp(tectonic * 0.85),
    harbor: coast,
  };
}

/** 给任意球面位置计算生态与资源潜力；所有字段从同一世界蓝图派生。 */
export function sampleEcology(lon: number, lat: number, world: EcologyWorld): EcologySample {
  return sampleEcologyWithRiverDistance(lon, lat, world, riverDistanceDegrees(lon, lat, world));
}

function selectAreas(kind: ResourcePotentialKind, candidates: Array<{ cellId: string; value: number }>, maximum = 7): ResourceArea[] {
  const ordered = candidates.filter((entry) => entry.value >= 0.42).sort((a, b) => b.value - a.value || a.cellId.localeCompare(b.cellId));
  const selected: Array<{ cellId: string; value: number }> = [];
  const grid = getGeoGrid();
  for (const candidate of ordered) {
    if (selected.length >= maximum) break;
    const cell = grid.byId.get(candidate.cellId)!;
    const overlaps = selected.some((entry) => angularDistance(cell.lon, cell.lat, grid.byId.get(entry.cellId)!.lon, grid.byId.get(entry.cellId)!.lat) < 9);
    if (!overlaps) selected.push(candidate);
  }
  return selected.map((entry, index) => ({ id: `${kind}-${index + 1}`, kind, cellIds: [entry.cellId], quality: Math.round(entry.value * 100) / 100 }));
}

/** 将气候/水文/构造结果压缩为少量可存档资源区，同时保留全局覆盖率供平衡测试。 */
export function buildEcology(world: EcologyWorld): EcologyNetwork {
  const grid = getGeoGrid();
  const riverDistances = riverDistanceByCell(world);
  const coverage: Partial<Record<BiomeKind, number>> = {};
  const candidates: Record<ResourcePotentialKind, Array<{ cellId: string; value: number }>> = {
    freshwater: [], arable_land: [], timber: [], metal_ore: [], geothermal: [], harbor: [],
  };
  let landCount = 0;
  for (const cell of grid.cells) {
    if (sampleHeight(cell.lon, cell.lat, world as WorldBlueprint) < SEA) continue;
    landCount++;
    const riverDistance = (riverDistances.get(cell.id) ?? 99) * CELL_STEP_DEGREES;
    const ecology = sampleEcologyWithRiverDistance(cell.lon, cell.lat, world, riverDistance);
    coverage[ecology.biome] = (coverage[ecology.biome] ?? 0) + 1;
    candidates.freshwater.push({ cellId: cell.id, value: ecology.freshwater });
    candidates.arable_land.push({ cellId: cell.id, value: ecology.fertility });
    candidates.timber.push({ cellId: cell.id, value: ecology.timber });
    candidates.metal_ore.push({ cellId: cell.id, value: ecology.metalOre });
    candidates.geothermal.push({ cellId: cell.id, value: ecology.geothermal });
    candidates.harbor.push({ cellId: cell.id, value: ecology.harbor });
  }
  for (const biome of Object.keys(coverage) as BiomeKind[]) coverage[biome] = Math.round((coverage[biome]! / Math.max(1, landCount)) * 10_000) / 10_000;
  return {
    version: 1,
    gridSubdivision: 5,
    biomeCoverage: coverage,
    resourceAreas: (Object.keys(candidates) as ResourcePotentialKind[]).flatMap((kind) => selectAreas(kind, candidates[kind])),
  };
}
