import { SEA, sampleHeight } from '../render/terrain';
import type { HydrologyBasin, HydrologyNetwork, WorldBlueprint } from '../types';
import { getGeoGrid, nearestGeoCell, type GeoCell, type GeoGrid } from './geoGrid';

type HydrologyWorld = Pick<WorldBlueprint, 'seed' | 'planet' | 'landmasses' | 'tectonicPlates' | 'tectonicBoundaries' | 'ranges' | 'watersheds' | 'terrainModules'>;

const FLOW_EPSILON = 0.00001;
// L5 单元平均约 160 km；第一版以汇集 8 个陆地单元筛出大陆尺度河道，
// 避免把每一条坡面径流都画成蓝线，也不因网格较粗而筛掉所有河流。
const RIVER_THRESHOLD = 8;
const MAJOR_SOURCE_THRESHOLD = 12;
const LAKE_THRESHOLD = 6;

function stableId(prefix: string, cells: string[]): string {
  let hash = 2166136261;
  for (const text of cells.join('/')) {
    hash ^= text.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

function angularDistance(a: GeoCell, b: GeoCell): number {
  const dot = a.center[0] * b.center[0] + a.center[1] * b.center[1] + a.center[2] * b.center[2];
  return Math.acos(Math.max(-1, Math.min(1, dot)));
}

/** 在同一球面骨架中补足两个人工锚点之间的相邻格路径，避免经纬点跳过网格。 */
function connectCells(startId: string, endId: string, grid: GeoGrid): string[] {
  const path = [startId];
  const seen = new Set(path);
  let current = grid.byId.get(startId)!;
  const destination = grid.byId.get(endId)!;
  for (let guard = 0; current.id !== destination.id && guard < 512; guard++) {
    const currentDistance = angularDistance(current, destination);
    const next = current.neighbors
      .map((id) => grid.byId.get(id)!)
      .filter((cell) => !seen.has(cell.id))
      .sort((a, b) => angularDistance(a, destination) - angularDistance(b, destination))[0];
    if (!next || angularDistance(next, destination) >= currentDistance) break;
    path.push(next.id);
    seen.add(next.id);
    current = next;
  }
  if (path[path.length - 1] !== endId) throw new Error(`cannot connect hydrology anchor ${startId} to ${endId}`);
  return path;
}

function anchoredGridPath(path: [number, number][], grid: GeoGrid): string[] {
  const anchors = path.map(([lon, lat]) => nearestGeoCell(lon, lat, grid).id);
  const cells: string[] = [anchors[0]];
  for (let index = 1; index < anchors.length; index++) {
    const segment = connectCells(cells[cells.length - 1], anchors[index], grid);
    cells.push(...segment.slice(1));
  }
  return cells;
}

/**
 * 按球面格的真实邻接关系寻找最陡下坡。这里不依赖屏幕投影、地形贴图或城市坐标，
 * 所以缩放、换皮和玩家工程不会令同一条自然河流漂移。
 */
export function buildHydrology(world: HydrologyWorld): HydrologyNetwork {
  const grid = getGeoGrid();
  const heights = new Map<string, number>();
  const landIds: string[] = [];
  for (const cell of grid.cells) {
    const elevation = sampleHeight(cell.lon, cell.lat, world as WorldBlueprint);
    heights.set(cell.id, elevation);
    if (elevation >= SEA) landIds.push(cell.id);
  }

  const downstream = new Map<string, string | null>();
  const sinks = new Set<string>();
  for (const id of landIds) {
    const cell = grid.byId.get(id)!;
    const elevation = heights.get(id)!;
    let next: string | null = null;
    let nextElevation = elevation;
    for (const neighborId of cell.neighbors) {
      const neighborElevation = heights.get(neighborId)!;
      if (neighborElevation < nextElevation - FLOW_EPSILON) {
        next = neighborId;
        nextElevation = neighborElevation;
      }
    }
    downstream.set(id, next);
    if (!next) sinks.add(id);
  }

  // 由高到低发送降水贡献，严格下坡关系使这里不可能形成循环。
  const accumulation = new Map<string, number>();
  for (const id of landIds) accumulation.set(id, 1);
  const descending = [...landIds].sort((a, b) => heights.get(b)! - heights.get(a)! || a.localeCompare(b));
  for (const id of descending) {
    const next = downstream.get(id);
    if (next && accumulation.has(next)) accumulation.set(next, accumulation.get(next)! + accumulation.get(id)!);
  }

  const riverSet = new Set<string>();
  for (const id of landIds) {
    if (downstream.get(id) && accumulation.get(id)! >= RIVER_THRESHOLD) riverSet.add(id);
  }
  // 首局叙事河谷仍是自然锚点：它要遵守高程检验，也要被接入同一条河道索引。
  for (const watershed of world.watersheds) {
    for (const [lon, lat] of watershed.path) riverSet.add(nearestGeoCell(lon, lat, grid).id);
  }

  const lakeCellIds = [...sinks]
    .filter((id) => accumulation.get(id)! >= LAKE_THRESHOLD && heights.get(id)! >= SEA)
    .sort();

  const inboundRiver = new Set<string>();
  for (const id of riverSet) {
    const next = downstream.get(id);
    if (next && riverSet.has(next)) inboundRiver.add(next);
  }
  const basins: HydrologyBasin[] = [];
  for (const sourceId of [...riverSet].sort()) {
    if (inboundRiver.has(sourceId) || accumulation.get(sourceId)! < MAJOR_SOURCE_THRESHOLD) continue;
    const cellIds: string[] = [];
    const seen = new Set<string>();
    let current: string | null = sourceId;
    while (current && !seen.has(current) && cellIds.length < 512) {
      seen.add(current);
      cellIds.push(current);
      const next: string | null = downstream.get(current) ?? null;
      if (!next || !riverSet.has(next)) {
        const drainage: HydrologyBasin['drainage'] = next && heights.get(next)! < SEA ? 'ocean' : 'inland_basin';
        basins.push({ id: stableId('basin', cellIds), source: 'generated', drainage, cellIds, estimatedDischarge: Math.round(accumulation.get(current)! * 10) / 10 });
        break;
      }
      current = next;
    }
  }

  for (const watershed of world.watersheds) {
    const cellIds = anchoredGridPath(watershed.path, grid);
    basins.push({
      id: `anchored-${watershed.id}`,
      source: 'anchored',
      drainage: watershed.drainage,
      cellIds,
      estimatedDischarge: Math.round((accumulation.get(cellIds[0]) ?? RIVER_THRESHOLD) * 10) / 10,
    });
  }

  return {
    version: 1,
    gridSubdivision: 5,
    riverCellIds: [...riverSet].sort(),
    lakeCellIds,
    basins: basins.sort((a, b) => b.estimatedDischarge - a.estimatedDischarge || a.id.localeCompare(b.id)),
  };
}
