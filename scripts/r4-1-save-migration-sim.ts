import { loadSaveV6 } from '../src/v2/save';
import { newCampaignV6 } from '../src/v2/state';

const data = new Map<string, string>();
const fakeStorage: Storage = {
  get length() { return data.size; },
  clear: () => data.clear(),
  getItem: (key) => data.get(key) ?? null,
  key: (index) => [...data.keys()][index] ?? null,
  removeItem: (key) => { data.delete(key); },
  setItem: (key, value) => { data.set(key, value); },
};
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: fakeStorage });

const current = newCampaignV6();
const legacy = { ...current } as Partial<typeof current>;
delete legacy.world;
data.set('cts-save-v6', JSON.stringify(legacy));

const migrated = loadSaveV6();
if (!migrated?.world) throw new Error('v6 save without world blueprint was not repaired');
if (migrated.day !== current.day || migrated.population !== current.population) throw new Error('migration changed campaign progress');
if (![...data.keys()].some((key) => key.startsWith('cts-save-v6-pre-world-blueprint-'))) throw new Error('raw v6 save was not backed up');

console.log(JSON.stringify({ ok: true, retainedDay: migrated.day, retainedPopulation: migrated.population, worldSeed: migrated.world.seed }));
