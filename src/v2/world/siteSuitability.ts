import { SEA, sampleHeight } from '../render/terrain';
import type { EcologySample, MapModuleDefinition, SiteRequirement, WorldBlueprint } from '../types';
import { sampleEcology } from './ecology';
import { getGeoGrid, nearestGeoCell } from './geoGrid';

export interface SiteEvaluation {
  eligible: boolean;
  failed: SiteRequirement['kind'][];
  ecology: EcologySample;
  slope: number;
  riverDrop: number;
}

function localTerrain(lon: number, lat: number, world: WorldBlueprint): { slope: number; riverDrop: number } {
  const grid = getGeoGrid();
  const cell = nearestGeoCell(lon, lat, grid);
  const elevation = sampleHeight(cell.lon, cell.lat, world);
  const neighborHeights = cell.neighbors.map((id) => {
    const neighbor = grid.byId.get(id)!;
    return sampleHeight(neighbor.lon, neighbor.lat, world);
  });
  const low = Math.min(...neighborHeights);
  const high = Math.max(...neighborHeights);
  return {
    slope: Math.max(0, high - low),
    riverDrop: Math.max(0, elevation - low),
  };
}

function meets(requirement: SiteRequirement, lon: number, lat: number, world: WorldBlueprint, ecology: EcologySample, slope: number, riverDrop: number): boolean {
  if (requirement.kind === 'land') return sampleHeight(lon, lat, world) >= SEA;
  if (requirement.kind === 'freshwater') return ecology.freshwater >= requirement.min;
  if (requirement.kind === 'fertility') return ecology.fertility >= requirement.min;
  if (requirement.kind === 'metal_ore') return ecology.metalOre >= requirement.min;
  if (requirement.kind === 'geothermal') return ecology.geothermal >= requirement.min;
  if (requirement.kind === 'harbor') return ecology.harbor >= requirement.min;
  if (requirement.kind === 'slope_max') return slope <= requirement.max;
  if (requirement.kind === 'river_crossing') return ecology.freshwater >= 0.30 && riverDrop <= requirement.maxDistance;
  return ecology.freshwater >= 0.45 && riverDrop >= requirement.min;
}

/** 所有工程与地点通过同一个自然选址接口；返回失败原因键，供未来玩家文案包翻译。 */
export function evaluateSite(lon: number, lat: number, requirements: SiteRequirement[], world: WorldBlueprint): SiteEvaluation {
  const ecology = sampleEcology(lon, lat, world);
  const { slope, riverDrop } = localTerrain(lon, lat, world);
  const failed = requirements.filter((requirement) => !meets(requirement, lon, lat, world, ecology, slope, riverDrop)).map((requirement) => requirement.kind);
  return { eligible: failed.length === 0, failed, ecology, slope, riverDrop };
}

export function evaluateModuleSite(module: MapModuleDefinition, lon: number, lat: number, world: WorldBlueprint): SiteEvaluation {
  return evaluateSite(lon, lat, module.siteRequirements, world);
}
