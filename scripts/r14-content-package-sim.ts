import {
  DIPLOMATIC_CONFLICT_CONTENT_PACKAGE,
  installContentPackage,
  UNIFIED_NATION_CONTENT_PACKAGE,
} from '../src/v2/nationKernel';
import { createDiplomaticConflictSave, createUnifiedNationSave } from '../src/v2/nationKernel/saveFixtures';

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const unifiedRoles = {
  playerPolity: 'polity.alt-union',
  industrialCoreCity: 'city.alt-foundry',
  portCity: 'city.alt-harbor',
  administrativeCoreCity: 'city.alt-capital',
  coastalServiceCity: 'city.alt-service',
  logisticsSatelliteCity: 'city.alt-logistics',
} as const;
const conflictRoles = {
  playerPolity: 'polity.alt-union',
  neighborPolity: 'polity.alt-neighbor',
  portCity: 'city.alt-harbor',
  administrativeCoreCity: 'city.alt-capital',
  playerSeaFleet: 'fleet.alt-sea',
  bilateralRelation: 'relation.alt-neighbor',
} as const;

const unifiedDefinitions = UNIFIED_NATION_CONTENT_PACKAGE.operationDefinitions(unifiedRoles);
const unifiedOperations = UNIFIED_NATION_CONTENT_PACKAGE.createOperations(unifiedRoles);
const conflictDefinitions = DIPLOMATIC_CONFLICT_CONTENT_PACKAGE.operationDefinitions(conflictRoles);
const conflictOperations = DIPLOMATIC_CONFLICT_CONTENT_PACKAGE.createOperations(conflictRoles);

assert(unifiedDefinitions.length === 30, 'unified package definition count changed');
assert(conflictDefinitions.length === 10, 'conflict package definition count changed');
assert(JSON.stringify(unifiedOperations).includes('city.alt-service'), 'unified package did not bind the service-city role');
assert(JSON.stringify(unifiedOperations).includes('city.alt-harbor'), 'unified package did not bind the port-city role');
assert(JSON.stringify(conflictOperations).includes('fleet.alt-sea'), 'conflict package did not bind the fleet role');
assert(JSON.stringify(conflictOperations).includes('relation.alt-neighbor'), 'conflict package did not bind the bilateral-relation role');
assert(!JSON.stringify(unifiedOperations).includes('city.north-core'), 'unified package leaked fixture city IDs');
assert(!JSON.stringify(conflictOperations).includes('fleet.player-sea'), 'conflict package leaked fixture fleet IDs');

const unifiedFixture = createUnifiedNationSave().state;
const conflictFixture = createDiplomaticConflictSave().state;
const unifiedInstall = installContentPackage(unifiedFixture, UNIFIED_NATION_CONTENT_PACKAGE, {
  playerPolity: 'polity.player',
  industrialCoreCity: 'city.north-core',
  portCity: 'city.north-port',
  administrativeCoreCity: 'city.central',
  coastalServiceCity: 'city.coast-core',
  logisticsSatelliteCity: 'city.coast-satellite',
});
const conflictInstall = installContentPackage(conflictFixture, DIPLOMATIC_CONFLICT_CONTENT_PACKAGE, {
  playerPolity: 'polity.player',
  neighborPolity: 'polity.neighbor',
  portCity: 'city.north-port',
  administrativeCoreCity: 'city.central',
  playerSeaFleet: 'fleet.player-sea',
  bilateralRelation: 'relation.player-neighbor',
});
assert(!unifiedInstall.ok && unifiedInstall.errors.some((error) => error.includes('duplicate operation')), 'installer must reject silent duplicate operations');
assert(!conflictInstall.ok && conflictInstall.errors.some((error) => error.includes('duplicate operation')), 'installer must reject duplicate conflict operations');

const wrongRole = installContentPackage(unifiedFixture, UNIFIED_NATION_CONTENT_PACKAGE, {
  playerPolity: 'city.central',
  industrialCoreCity: 'city.north-core',
  portCity: 'city.north-port',
  administrativeCoreCity: 'city.central',
  coastalServiceCity: 'city.coast-core',
  logisticsSatelliteCity: 'city.coast-satellite',
});
assert(!wrongRole.ok && wrongRole.errors.some((error) => error.includes('playerPolity must reference an existing polity')), 'installer must reject a role bound to the wrong entity type');

console.log(JSON.stringify({
  ok: true,
  packages: [
    { id: UNIFIED_NATION_CONTENT_PACKAGE.id, definitions: unifiedDefinitions.length, roles: UNIFIED_NATION_CONTENT_PACKAGE.roleRequirements.length },
    { id: DIPLOMATIC_CONFLICT_CONTENT_PACKAGE.id, definitions: conflictDefinitions.length, roles: DIPLOMATIC_CONFLICT_CONTENT_PACKAGE.roleRequirements.length },
  ],
  invalidBindingRejected: wrongRole.errors.length,
}, null, 2));
