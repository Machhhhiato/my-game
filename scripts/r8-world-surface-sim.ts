import { generateWorldBlueprint, validateWorldBlueprint, withSurfaceFeatures } from '../src/v2/worldBlueprint';

const first = generateWorldBlueprint(7007);
const second = generateWorldBlueprint(7007);
validateWorldBlueprint(first);

if (JSON.stringify(first.surfaceFeatures) !== JSON.stringify(second.surfaceFeatures)) {
  throw new Error('same seed did not reproduce the same frozen surface');
}
if (first.surfaceFeatures.length < 40) throw new Error('surface feature list is unexpectedly sparse');
const rangeIds = new Set(first.ranges.map((range) => range.id));
if (!first.surfaceFeatures.some((entry) => entry.layer === 'macro' && rangeIds.has(entry.moduleId))) {
  throw new Error('mountain range was not composed as a macro surface feature');
}
if (first.surfaceFeatures.some((entry) => entry.spanDegrees <= 0 || entry.spanDegrees > 20)) {
  throw new Error('surface feature has invalid world footprint');
}

const legacy = structuredClone(first);
legacy.surfaceFeatures = [];
legacy.terrainChanges = [{
  id: 'test-river-works', kind: 'river_control', anchorId: 'valley_outpost',
  data: { completedOnDay: 12, projectId: 'test' },
}];
const repaired = withSurfaceFeatures(legacy);
validateWorldBlueprint(repaired);
if (repaired.terrainChanges[0]?.id !== 'test-river-works') {
  throw new Error('legacy surface migration overwrote mutable engineering change');
}

console.log(JSON.stringify({
  ok: true,
  seed: first.seed,
  features: first.surfaceFeatures.length,
  macroRanges: first.surfaceFeatures.filter((entry) => entry.layer === 'macro').length,
  regional: first.surfaceFeatures.filter((entry) => entry.layer === 'regional').length,
  local: first.surfaceFeatures.filter((entry) => entry.layer === 'local').length,
}));
