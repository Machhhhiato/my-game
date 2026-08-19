import { textCampaignMapBriefing, geoReferenceForCoordinateRef, mapEntityLonLat } from '../src/v2/textIdle/strategicMapModel';
import { COAST_TEXT_CAMPAIGN_TEMPLATE, DEFAULT_TEXT_CAMPAIGN_TEMPLATE, RIDGE_TEXT_CAMPAIGN_TEMPLATE, installTextCampaignTemplate } from '../src/v2/textIdle/campaignTemplates';
import { advanceTextIdleDays, newTextIdleState, startTextExploration, startTextProject } from '../src/v2/textIdle/simulation';
import { TEXT_EXPLORATION_TARGETS } from '../src/v2/textIdle/exploration';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const a = geoReferenceForCoordinateRef('geo.fixture.anchor');
const b = geoReferenceForCoordinateRef('geo.fixture.anchor');
assert(JSON.stringify(a) === JSON.stringify(b), 'coordinate reference must resolve deterministically');
assert(mapEntityLonLat({ geoRef: a }).every(Number.isFinite), 'resolved geography must be usable by the globe');

installTextCampaignTemplate(DEFAULT_TEXT_CAMPAIGN_TEMPLATE);
let starter = newTextIdleState(410);
let starterMap = textCampaignMapBriefing(starter);
assert(starterMap.entities.some((entity) => entity.kind === 'settlement'), 'starter map must contain its settlement');
assert(starterMap.entities.some((entity) => entity.kind === 'exploration'), 'starter map must contain exploration directions');
assert(starterMap.entities.every((entity) => entity.geoRef.kind === 'point'), 'all starter markers must use GeoReference');
const firstTarget = starterMap.entities.find((entity) => entity.kind === 'exploration' && entity.status === 'available');
assert(firstTarget?.targetId, 'starter map must expose an available exploration target');
starter = startTextExploration(starter, firstTarget.targetId);
starter = advanceTextIdleDays(starter, 30);
starterMap = textCampaignMapBriefing(starter);
assert(starterMap.entities.some((entity) => entity.kind === 'discovery' || entity.kind === 'site'), 'completed exploration must create globe facts');

const shelterTarget = Object.values(TEXT_EXPLORATION_TARGETS).find((target) => target.discoveries.some((discovery) => discovery.id === 'discovery.site.storehouse'));
assert(shelterTarget, 'starter catalog must contain a surveyed shelter candidate');
starter = startTextExploration(starter, shelterTarget.id);
starter = advanceTextIdleDays(starter, 30);
starter = startTextProject(starter, 'starter.project.temporary-shelter');
const shelter = starter.facilityFacts.find((facility) => facility.projectId === 'starter.project.temporary-shelter');
const shelterSite = starter.discoveries.find((discovery) => discovery.id === 'discovery.site.storehouse');
assert(shelter?.status === 'building' && shelter.coordinateRef === shelterSite?.coordinateRef, 'project must begin at its surveyed engineering candidate');
starter = advanceTextIdleDays(starter, 30);
assert(starter.facilityFacts.find((facility) => facility.projectId === 'starter.project.temporary-shelter')?.status === 'operating', 'completed project must retain an operating spatial facility fact');
starterMap = textCampaignMapBriefing(starter);
assert(starterMap.entities.some((entity) => entity.kind === 'facility'), 'operating facility must be rendered as a globe fact');

installTextCampaignTemplate(RIDGE_TEXT_CAMPAIGN_TEMPLATE);
const ridge = newTextIdleState(733, RIDGE_TEXT_CAMPAIGN_TEMPLATE.id);
const ridgeMap = textCampaignMapBriefing(ridge);
assert(ridgeMap.entities.some((entity) => entity.id === 'exploration:ridge.scan.shelter'), 'template replacement must rebuild map markers from the active template');
assert(!ridgeMap.entities.some((entity) => entity.id === firstTarget.id), 'template replacement must not retain starter marker IDs');

installTextCampaignTemplate(COAST_TEXT_CAMPAIGN_TEMPLATE);
const coast = newTextIdleState(1204, COAST_TEXT_CAMPAIGN_TEMPLATE.id);
const coastMap = textCampaignMapBriefing(coast);
assert(coastMap.entities.some((entity) => entity.id === 'exploration:coast.explore.north'), 'coastal template must create its own marker IDs');
assert(coastMap.entities.filter((entity) => entity.kind === 'exploration').every((entity) => entity.coordinateRef?.startsWith('geo.coast.')), 'coastal template must use its own stable geographic references');
console.log(`R38 globe map simulation passed: ${starterMap.entities.length} starter facts, ${ridgeMap.entities.length} ridge facts, ${coastMap.entities.length} coastal facts.`);
