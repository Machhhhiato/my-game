import { generateWorldBlueprint, validateWorldBlueprint, withWorldSkeleton } from '../src/v2/worldBlueprint';
import { geoReferenceLonLat, getGeoGrid } from '../src/v2/world/geoGrid';
import { SEA, sampleHeight } from '../src/v2/render/terrain';
import { sampleClimate } from '../src/v2/world/climate';
import { sampleEcology } from '../src/v2/world/ecology';
import { MAP_MODULES, mapModuleById } from '../src/v2/world/mapModules';
import { evaluateModuleSite } from '../src/v2/world/siteSuitability';
import { PROJECT_MAP_EFFECTS } from '../src/v2/content/projectMapEffects';

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const first = generateWorldBlueprint(1107);
const second = generateWorldBlueprint(1107);
validateWorldBlueprint(first);

const grid = getGeoGrid();
assert(grid.cells.length === 20_480, `expected 20,480 cells, received ${grid.cells.length}`);
for (const cell of grid.cells) {
  assert(cell.neighbors.length === 3, `${cell.id} does not have three neighbors`);
  for (const neighborId of cell.neighbors) {
    const neighbor = grid.byId.get(neighborId);
    assert(neighbor?.neighbors.includes(cell.id), `${cell.id} has a non-reciprocal neighbor ${neighborId}`);
  }
}

assert(JSON.stringify(first.skeleton) === JSON.stringify(second.skeleton), 'same seed produced a different skeleton');
for (const site of first.siteAnchors) {
  const reference = first.skeleton.anchorCells[site.id];
  assert(reference?.kind === 'point', `${site.id} is not bound to a point cell`);
  const [lon, lat] = geoReferenceLonLat(reference);
  assert(Math.abs(lon - site.position[0]) < 0.0001 && Math.abs(lat - site.position[1]) < 0.0001, `${site.id} did not round-trip through its cell reference`);
}

const landRatio = grid.cells.filter((cell) => sampleHeight(cell.lon, cell.lat, first) >= SEA).length / grid.cells.length;
assert(landRatio > 0.18 && landRatio < 0.46, `land ratio ${landRatio.toFixed(3)} is not earthlike`);
const requiredTerrain = ['coast', 'plain', 'river_valley', 'highland', 'mountain', 'forest', 'arid', 'tundra'] as const;
const availableTerrain = new Set(first.terrainModules.map((module) => module.region));
for (const region of requiredTerrain) assert(availableTerrain.has(region), `test world is missing ${region}`);
for (const module of first.terrainModules) {
  if (module.region !== 'ocean') assert(sampleHeight(module.center[0], module.center[1], first) >= SEA, `${module.id} is not on land`);
}
const elevationProbes = Object.fromEntries(first.terrainModules.map((module) => [
  module.id,
  { region: module.region, elevation: Number(sampleHeight(module.center[0], module.center[1], first).toFixed(3)) },
]));
const probeElevation = (id: string): number => (elevationProbes[id] as { elevation: number }).elevation;
assert(
  probeElevation('north_range') > probeElevation('west_highland') + 0.08,
  `mountain ${probeElevation('north_range')} is not visibly above highland ${probeElevation('west_highland')}`,
);
assert(probeElevation('west_highland') > probeElevation('emerald_valley') + 0.05, 'highland does not stand above river valley');
assert(probeElevation('emerald_valley') > probeElevation('ferry_lowlands'), 'river valley is not above downstream lowland');
for (const watershed of first.watersheds) {
  const heights = watershed.path.map(([lon, lat]) => sampleHeight(lon, lat, first));
  assert(heights[0] > heights[heights.length - 1], `${watershed.id} source is not above its mouth`);
}
assert(first.hydrology.riverCellIds.length >= 8, 'automatic hydrology produced too few river cells');
assert(first.hydrology.basins.some((basin) => basin.source === 'generated' && basin.drainage === 'ocean'), 'no generated river reaches the ocean');
assert(first.hydrology.basins.some((basin) => basin.source === 'anchored' && basin.id === 'anchored-emerald_drainage'), 'initial river is not retained as an anchored basin');
for (const basin of first.hydrology.basins) {
  assert(basin.cellIds.length >= 1, `${basin.id} has no cells`);
  for (let index = 1; index < basin.cellIds.length; index++) {
    const previous = grid.byId.get(basin.cellIds[index - 1])!;
    const current = grid.byId.get(basin.cellIds[index])!;
    assert(previous.neighbors.includes(current.id), `${basin.id} skips non-neighbor cells`);
    if (basin.source === 'generated') {
      assert(sampleHeight(previous.lon, previous.lat, first) >= sampleHeight(current.lon, current.lat, first) - 0.0001, `${basin.id} flows uphill`);
    }
  }
}

const climateProbes = Object.fromEntries(first.terrainModules.map((module) => [
  module.id,
  sampleClimate(module.center[0], module.center[1], first),
]));
const mountainClimate = climateProbes.north_range;
const valleyClimate = climateProbes.emerald_valley;
const badlandsClimate = climateProbes.western_badlands;
const forestClimate = climateProbes.eastern_windward_forest;
assert(mountainClimate.temperatureC < valleyClimate.temperatureC, 'altitude does not cool the mountain climate');
assert(
  badlandsClimate.moisture < valleyClimate.moisture,
  `arid basin (${badlandsClimate.moisture.toFixed(2)}) is not drier than the river valley (${valleyClimate.moisture.toFixed(2)})`,
);
assert(badlandsClimate.climate === 'arid', `badlands is not arid (${badlandsClimate.climate})`);
assert(forestClimate.climate === 'temperate' || forestClimate.climate === 'tropical', `windward forest is not humid enough (${forestClimate.climate})`);

const valleyEcology = sampleEcology(40.6, 16.4, first);
const badlandsEcology = sampleEcology(8, 16, first);
const mountainEcology = sampleEcology(28, 37, first);
assert(valleyEcology.fertility > badlandsEcology.fertility, 'river valley is not more fertile than badlands');
assert(mountainEcology.metalOre > valleyEcology.metalOre, 'mountain is not more ore-bearing than river valley');
const ecologyKinds = new Set(Object.keys(first.ecology.biomeCoverage));
for (const biome of ['arid', 'temperate_forest', 'grassland', 'tundra'] as const) assert(ecologyKinds.has(biome), `missing ${biome} ecology`);
for (const kind of ['freshwater', 'arable_land', 'timber', 'metal_ore', 'geothermal', 'harbor'] as const) {
  assert(first.ecology.resourceAreas.some((area) => area.kind === kind), `missing ${kind} resource area`);
}

assert(MAP_MODULES.length >= 7, 'map module catalog is incomplete');
for (const module of MAP_MODULES) assert(module.siteRequirements.length > 0, `${module.id} has no site requirements`);
const moduleChecks = [
  ['farm_district', 'arable_land'],
  ['mine_complex', 'metal_ore'],
  ['geothermal_station', 'geothermal'],
  ['seaport', 'harbor'],
] as const;
for (const [moduleId, resourceKind] of moduleChecks) {
  const area = first.ecology.resourceAreas.find((entry) => entry.kind === resourceKind)!;
  const cell = grid.byId.get(area.cellIds[0])!;
  assert(evaluateModuleSite(mapModuleById(moduleId), cell.lon, cell.lat, first).eligible, `${moduleId} cannot be placed in a matching ${resourceKind} area`);
}
for (const anchor of first.siteAnchors) assert(first.skeleton.anchorCells[anchor.id], `${anchor.id} lost its geographic binding`);
for (const effects of Object.values(PROJECT_MAP_EFFECTS)) {
  for (const effect of effects) {
    const anchor = first.siteAnchors.find((entry) => entry.id === effect.anchorId)!;
    assert(evaluateModuleSite(mapModuleById(effect.moduleId), anchor.position[0], anchor.position[1], first).eligible, `${effect.changeId} cannot be placed at ${effect.anchorId}`);
  }
}
assert(first.spatialNetwork.settlementPotentials.length >= first.siteAnchors.length + 2, 'spatial network lacks development candidates');
assert(first.spatialNetwork.engineeringPotentials.length >= 4, 'spatial network lacks qualified engineering candidates');
for (const potential of first.spatialNetwork.engineeringPotentials) {
  const cell = grid.byId.get(potential.cellId)!;
  assert(evaluateModuleSite(mapModuleById(potential.moduleId), cell.lon, cell.lat, first).eligible, `${potential.id} violates its module site rules`);
}

const oldWorld = { ...first } as typeof first & { skeleton?: never };
delete (oldWorld as { skeleton?: unknown }).skeleton;
const migrated = withWorldSkeleton(oldWorld as unknown as typeof first);
assert(migrated.skeleton.cellCount === grid.cells.length, 'legacy blueprint migration lost the grid');

console.log(JSON.stringify({
  result: 'ok',
  cells: grid.cells.length,
  anchors: Object.keys(first.skeleton.anchorCells).length,
  landRatio: Number(landRatio.toFixed(3)),
  elevationProbes,
  climateProbes: Object.fromEntries(Object.entries(climateProbes).map(([id, sample]) => [id, {
    climate: sample.climate,
    temperatureC: Number(sample.temperatureC.toFixed(1)),
    moisture: Number(sample.moisture.toFixed(2)),
    rainShadow: Number(sample.rainShadow.toFixed(2)),
  }])),
  hydrology: {
    rivers: first.hydrology.riverCellIds.length,
    lakes: first.hydrology.lakeCellIds.length,
    basins: first.hydrology.basins.length,
    generatedOceanBasins: first.hydrology.basins.filter((basin) => basin.source === 'generated' && basin.drainage === 'ocean').length,
  },
  ecology: {
    coverage: first.ecology.biomeCoverage,
    areas: Object.fromEntries(['freshwater', 'arable_land', 'timber', 'metal_ore', 'geothermal', 'harbor'].map((kind) => [kind, first.ecology.resourceAreas.filter((area) => area.kind === kind).length])),
    valleyFertility: Number(valleyEcology.fertility.toFixed(2)),
    badlandsFertility: Number(badlandsEcology.fertility.toFixed(2)),
  },
  modules: MAP_MODULES.map((module) => module.id),
  spatialNetwork: {
    potentials: first.spatialNetwork.settlementPotentials.length,
    engineeringPotentials: first.spatialNetwork.engineeringPotentials.map((potential) => ({ id: potential.id, module: potential.moduleId, source: potential.sourceId })),
  },
  seed: first.seed,
}, null, 2));
