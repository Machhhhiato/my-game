import type { BlueprintSiteAnchor, GeoReference, WorldSkeleton } from '../types';

type Vec3 = readonly [number, number, number];

export interface GeoCell {
  id: string;
  center: Vec3;
  lon: number;
  lat: number;
  neighbors: string[];
}

export interface GeoGrid {
  subdivision: 5;
  cells: GeoCell[];
  byId: Map<string, GeoCell>;
}

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const CACHE = new Map<number, GeoGrid>();

function normalize(v: Vec3): [number, number, number] {
  const length = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / length, v[1] / length, v[2] / length];
}

function midpoint(a: Vec3, b: Vec3): [number, number, number] {
  return normalize([a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
}

function toLonLat(v: Vec3): [number, number] {
  return [Math.atan2(v[2], v[0]) * R2D, Math.asin(v[1]) * R2D];
}

function edgeKey(a: number, b: number): string { return a < b ? `${a}/${b}` : `${b}/${a}`; }

/**
 * 全球战略骨架：L5 共 20,480 个等面积近似三角单元，平均间距约 160 km。
 * 它不是屏幕网格，球面/平面投影都读取同一批稳定 Cell ID。
 */
export function getGeoGrid(subdivision = 5): GeoGrid {
  if (subdivision !== 5) throw new Error('R9 currently freezes the strategic grid at icosphere subdivision 5');
  const cached = CACHE.get(subdivision);
  if (cached) return cached;

  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVertices: Vec3[] = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];
  const vertices: Array<[number, number, number]> = rawVertices.map(normalize);
  let faces: Array<[number, number, number]> = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  for (let level = 0; level < subdivision; level++) {
    const mids = new Map<string, number>();
    const middle = (a: number, b: number): number => {
      const key = edgeKey(a, b);
      const existing = mids.get(key);
      if (existing !== undefined) return existing;
      const index = vertices.length;
      vertices.push(midpoint(vertices[a], vertices[b]));
      mids.set(key, index);
      return index;
    };
    const next: Array<[number, number, number]> = [];
    for (const [a, b, c] of faces) {
      const ab = middle(a, b), bc = middle(b, c), ca = middle(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }

  const neighborIndexes = Array.from({ length: faces.length }, () => new Set<number>());
  const owners = new Map<string, number>();
  faces.forEach((face, index) => {
    [[face[0], face[1]], [face[1], face[2]], [face[2], face[0]]].forEach(([a, b]) => {
      const key = edgeKey(a, b);
      const other = owners.get(key);
      if (other === undefined) owners.set(key, index);
      else { neighborIndexes[index].add(other); neighborIndexes[other].add(index); }
    });
  });

  const cells = faces.map((face, index) => {
    const center = normalize([
      vertices[face[0]][0] + vertices[face[1]][0] + vertices[face[2]][0],
      vertices[face[0]][1] + vertices[face[1]][1] + vertices[face[2]][1],
      vertices[face[0]][2] + vertices[face[1]][2] + vertices[face[2]][2],
    ]);
    const [lon, lat] = toLonLat(center);
    return { id: `g5-${index}`, center, lon, lat, neighbors: [...neighborIndexes[index]].sort((a, b) => a - b).map((n) => `g5-${n}`) };
  });
  const grid = { subdivision: 5 as const, cells, byId: new Map(cells.map((cell) => [cell.id, cell])) };
  CACHE.set(subdivision, grid);
  return grid;
}

function fromLonLat(lon: number, lat: number): Vec3 {
  const lonR = lon * D2R, latR = lat * D2R;
  return [Math.cos(latR) * Math.cos(lonR), Math.sin(latR), Math.cos(latR) * Math.sin(lonR)];
}

export function nearestGeoCell(lon: number, lat: number, grid = getGeoGrid()): GeoCell {
  const point = fromLonLat(lon, lat);
  let best = grid.cells[0];
  let bestDot = -Infinity;
  for (const cell of grid.cells) {
    const dot = point[0] * cell.center[0] + point[1] * cell.center[1] + point[2] * cell.center[2];
    if (dot > bestDot) { best = cell; bestDot = dot; }
  }
  return best;
}

/** 格内位置暂定为经纬投影偏移；真正的道路和城区会使用同一 GeoReference，不再写裸坐标。 */
export function geoPointAt(lon: number, lat: number, grid = getGeoGrid()): GeoReference {
  const cell = nearestGeoCell(lon, lat, grid);
  return { kind: 'point', cellId: cell.id, local: [lon - cell.lon, lat - cell.lat] };
}

export function buildWorldSkeleton(sites: BlueprintSiteAnchor[]): WorldSkeleton {
  const grid = getGeoGrid();
  return {
    version: 1,
    topology: 'icosphere',
    subdivision: 5,
    cellCount: grid.cells.length,
    anchorCells: Object.fromEntries(sites.map((site) => [site.id, geoPointAt(site.position[0], site.position[1], grid)])),
  };
}

export function geoReferenceLonLat(reference: GeoReference, grid = getGeoGrid()): [number, number] {
  const anchor = reference.kind === 'point' ? grid.byId.get(reference.cellId) : undefined;
  if (!anchor || reference.kind !== 'point') throw new Error('only point references can be resolved to a single location');
  return [anchor.lon + reference.local[0], anchor.lat + reference.local[1]];
}
