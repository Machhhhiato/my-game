import { newCampaignV6 } from '../src/v2/state';
import { alignMapNodesToWorld, generateWorldBlueprint, validateWorldBlueprint } from '../src/v2/worldBlueprint';
import { NODES } from '../src/v2/data';
import { validateTerrainModuleProtocol } from '../src/v2/world/terrainModules';

const first = generateWorldBlueprint(7007);
const second = generateWorldBlueprint(7007);
validateWorldBlueprint(first);
validateTerrainModuleProtocol(first.terrainModules, first.moduleLinks);

if (JSON.stringify(first) !== JSON.stringify(second)) throw new Error('same seed did not reproduce the same blueprint');
if (JSON.stringify(first) === JSON.stringify(generateWorldBlueprint(7008))) throw new Error('different seed did not alter the blueprint');
if (!first.siteAnchors.some((anchor) => anchor.id === 'valley_outpost')) throw new Error('opening settlement anchor is missing');
const shifted = structuredClone(first);
shifted.siteAnchors.find((anchor) => anchor.id === 'valley_outpost')!.position = [41.1, 16.1];
const aligned = alignMapNodesToWorld(NODES, shifted);
const alignedOutpost = aligned.find((node) => node.id === 'valley_outpost')!;
if (alignedOutpost.lon !== 41.1 || alignedOutpost.lat !== 16.1) throw new Error('map node did not follow blueprint anchor');

const uphill = structuredClone(first);
uphill.watersheds[0].elevations[3] = uphill.watersheds[0].elevations[2] + 0.01;
let rejectedUphillRiver = false;
try { validateWorldBlueprint(uphill); } catch { rejectedUphillRiver = true; }
if (!rejectedUphillRiver) throw new Error('uphill watershed was accepted');

const invalidLink = structuredClone(first);
invalidLink.moduleLinks[0].toEdge = 'east';
let rejectedBadModuleLink = false;
try { validateTerrainModuleProtocol(invalidLink.terrainModules, invalidLink.moduleLinks); } catch { rejectedBadModuleLink = true; }
if (!rejectedBadModuleLink) throw new Error('invalid module edge link was accepted');

const campaign = newCampaignV6();
validateWorldBlueprint(campaign.world);
if (campaign.world.seed !== campaign.seed) throw new Error('campaign world seed differs from campaign seed');

console.log(JSON.stringify({
  ok: true,
  generatorVersion: first.generatorVersion,
  modules: first.terrainModules.length,
  moduleLinks: first.moduleLinks.length,
  landmasses: first.landmasses.length,
  watersheds: first.watersheds.length,
  anchors: first.siteAnchors.map((anchor) => anchor.id),
}));
