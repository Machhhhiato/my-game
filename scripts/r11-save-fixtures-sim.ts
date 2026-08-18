import { advanceNationKernelDays, quantitiesForStage, rebuildMetroSummaries, validateNationKernel } from '../src/v2/nationKernel';
import { createDiplomaticConflictSave, createEarlyCommunitySave, createUnifiedNationSave } from '../src/v2/nationKernel/saveFixtures';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
const early = createEarlyCommunitySave(); const unified = createUnifiedNationSave(); const conflict = createDiplomaticConflictSave();
for (const fixture of [early, unified, conflict]) assert(validateNationKernel(fixture.state).ok, `${fixture.id} violates R11 contract`);
rebuildMetroSummaries(early.state); rebuildMetroSummaries(unified.state); rebuildMetroSummaries(conflict.state);
assert(early.state.polities['polity.player'].archetype === 'community', 'early save is not a community');
assert(Object.keys(early.state.fleets).length === 0 && Object.keys(early.state.relations).length === 1, 'early save exposes advanced external systems');
assert(unified.state.polities['polity.player'].archetype === 'planetaryState', 'unified save is not a planetary state');
assert(Object.keys(unified.state.polities).length === 1 && Object.keys(unified.state.metros).length === 3, 'unified save does not isolate internal regions from external factions');
assert(unified.state.metros['metro.north'].totalPopulation === 3_760_000, 'unified metro total is incorrect');
assert(Object.keys(conflict.state.polities).length === 2 && Object.keys(conflict.state.fleets).length === 2, 'conflict save lacks two polities or fleets');
assert(conflict.state.fleets['fleet.player-sea'].vessels['vessel.carrier'].total === 1, 'fleet loses exact vessel quantities');
assert(conflict.state.relations['relation.player-neighbor'].stance === 'tense' && conflict.state.theatres['theatre.border-sea'].status === 'crisis', 'conflict state is not represented by relation and theatre');
assert(quantitiesForStage('survival').every((definition) => definition.presentation.visibleFrom === 'survival'), 'survival view leaks future quantities');
assert(quantitiesForStage('unifiedNation').some((definition) => definition.id === 'construction.ndu'), 'unified view does not unlock national scale units');
const repeatedA = advanceNationKernelDays(createDiplomaticConflictSave().state, 30); const repeatedB = advanceNationKernelDays(createDiplomaticConflictSave().state, 30);
assert(JSON.stringify(repeatedA) === JSON.stringify(repeatedB), 'conflict save is not deterministic over time');
console.log(JSON.stringify({ ok: true, saves: [early.id, unified.id, conflict.id], earlyVisibleQuantities: quantitiesForStage('survival').length, unifiedVisibleQuantities: quantitiesForStage('unifiedNation').length, conflictFleets: Object.fromEntries(Object.entries(conflict.state.fleets).map(([id, fleet]) => [id, fleet.vessels])), }, null, 2));
