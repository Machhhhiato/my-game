import type { EngineeringPotential, ResourcePotentialKind, SettlementPotential, SpatialNetwork, WorldBlueprint } from '../types';
import { mapModuleById } from './mapModules';
import { evaluateModuleSite } from './siteSuitability';
import { getGeoGrid, nearestGeoCell } from './geoGrid';

type SpatialWorld = Pick<WorldBlueprint, 'seed' | 'planet' | 'landmasses' | 'tectonicPlates' | 'tectonicBoundaries' | 'ranges' | 'watersheds' | 'hydrology' | 'ecology' | 'terrainModules' | 'siteAnchors'>;
const D2R = Math.PI / 180;

function angularDistance(lonA: number, latA: number, lonB: number, latB: number): number {
  const dLon = (lonB - lonA) * D2R, dLat = (latB - latA) * D2R;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(latA * D2R) * Math.cos(latB * D2R) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) / D2R;
}

function resourceCandidate(role: Exclude<SettlementPotential['role'], 'existing' | 'river_hub'>, kind: 'arable_land' | 'metal_ore' | 'harbor', world: SpatialWorld): SettlementPotential | null {
  const grid = getGeoGrid();
  const valley = nearestGeoCell(40.6, 16.4, grid);
  const choices = world.ecology.resourceAreas
    .filter((area) => area.kind === kind)
    .map((area) => ({ area, cell: grid.byId.get(area.cellIds[0])! }))
    .filter(({ cell }) => angularDistance(cell.lon, cell.lat, valley.lon, valley.lat) < 65)
    .sort((a, b) => b.area.quality - a.area.quality || a.area.id.localeCompare(b.area.id));
  const choice = choices[0];
  return choice ? { id: `potential-${role}`, role, cellId: choice.cell.id, sourceId: choice.area.id, suitability: choice.area.quality } : null;
}

/**
 * 只从生态层已经筛出的高价值区域中挑选，而且再走一次工程模块选址。
 * 因此测试世界里的方块代表“确有条件开工”，不是为了演示而随手放的图钉。
 */
function engineeringCandidate(moduleId: string, resourceKind: ResourcePotentialKind, world: SpatialWorld): EngineeringPotential | null {
  const grid = getGeoGrid();
  const module = mapModuleById(moduleId);
  const choices = world.ecology.resourceAreas
    .filter((area) => area.kind === resourceKind)
    .map((area) => ({ area, cell: grid.byId.get(area.cellIds[0])! }))
    .sort((a, b) => b.area.quality - a.area.quality || a.area.id.localeCompare(b.area.id));
  for (const { area, cell } of choices) {
    if (!evaluateModuleSite(module, cell.lon, cell.lat, world as WorldBlueprint).eligible) continue;
    return { id: `engineering-${moduleId}-${area.id}`, moduleId, cellId: cell.id, sourceId: area.id, suitability: area.quality };
  }
  return null;
}

/**
 * “城市网络”只记录地理上可发展的聚居点与工程候选。实际人口、城市等级、项目状态
 * 和道路状态都属于战役增量；世界生成绝不偷偷预铺道路或预求解路线。
 */
export function buildSpatialNetwork(world: SpatialWorld): SpatialNetwork {
  const grid = getGeoGrid();
  const existing: SettlementPotential[] = world.siteAnchors.map((anchor) => {
    const cell = nearestGeoCell(anchor.position[0], anchor.position[1], grid);
    return { id: anchor.id, role: 'existing', cellId: cell.id, sourceId: anchor.id, suitability: 1 };
  });
  const candidates = [
    resourceCandidate('agricultural', 'arable_land', world),
    resourceCandidate('mineral', 'metal_ore', world),
    resourceCandidate('harbor', 'harbor', world),
  ].filter((entry): entry is SettlementPotential => entry !== null);
  const settlementPotentials = [...existing, ...candidates];
  const engineeringPotentials = [
    engineeringCandidate('water_utility', 'freshwater', world),
    engineeringCandidate('farm_district', 'arable_land', world),
    engineeringCandidate('mine_complex', 'metal_ore', world),
    engineeringCandidate('geothermal_station', 'geothermal', world),
    engineeringCandidate('seaport', 'harbor', world),
  ].filter((entry): entry is EngineeringPotential => entry !== null);
  return { version: 2, gridSubdivision: 5, settlementPotentials, engineeringPotentials };
}
