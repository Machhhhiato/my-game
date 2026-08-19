import { advanceNationKernelDays, createCampaign, createDiplomaticIssue, createNegotiation, createOccupation, setEconomicAllocation, setOccupationApproach, validateNationKernel } from '../src/v2/nationKernel';
import { createCivilizationTestState } from './civilization-sim-fixture';
import type { CampaignState, NationKernelState, OccupationState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
const campaign = (id: string, attackers: string[], objective: CampaignState['objective'] = 'holdRoute'): CampaignState => ({ id, theatreId: 'theatre.border-sea', attackerPolityId: 'polity.player', defenderPolityId: 'polity.neighbor', attackerFormationIds: attackers, defenderFormationIds: ['formation.test.peer-field'], objective, status: 'active', dayStarted: 0, elapsedDays: 0, supplyDemand: attackers.reduce((sum, formationId) => sum + (formationId === 'formation.r29a.mobile-reserve' ? 28 : 16), 0), intelligence: 58, attackerPressure: 50, defenderDepth: 58, control: 50, attackerExhaustion: 0, defenderExhaustion: 0, attackerPersonnelLosses: 0, defenderPersonnelLosses: 0, equipmentLosses: 0, civilianImpact: 4, infrastructureDamage: 2, stopAtExhaustion: 72 });

const base = createCivilizationTestState();
base.civilizationSystems!.logistics.freightCapacity = 34;
base.civilizationSystems!.logistics.disruption = 18;
let guardOnly = createCampaign(base, campaign('campaign.guard-only', ['formation.r28b.border-guard']));
let heavyOnly = createCampaign(base, campaign('campaign.heavy-only', ['formation.r29a.mobile-reserve']));
let combined = createCampaign(base, campaign('campaign.combined', ['formation.r28b.border-guard', 'formation.r29a.mobile-reserve'], 'limitedAdvance'));
const supportedBase = structuredClone(base) as NationKernelState; supportedBase.civilizationSystems!.logistics.freightCapacity = 72; supportedBase.civilizationSystems!.logistics.disruption = 4; supportedBase.civilizationSystems!.maritime.routeSecurity = 78; supportedBase.civilizationSystems!.satellites.orbitalCoverage = 45;
let supportedCombined = createCampaign(supportedBase, campaign('campaign.supported-combined', ['formation.r28b.border-guard', 'formation.r29a.mobile-reserve'], 'limitedAdvance'));
guardOnly = advanceNationKernelDays(guardOnly, 30); heavyOnly = advanceNationKernelDays(heavyOnly, 30); combined = advanceNationKernelDays(combined, 30);
supportedCombined = advanceNationKernelDays(supportedCombined, 30);
const guardResult = guardOnly.civilizationSystems!.campaigns['campaign.guard-only']; const heavyResult = heavyOnly.civilizationSystems!.campaigns['campaign.heavy-only']; const combinedResult = combined.civilizationSystems!.campaigns['campaign.combined']; const supportedResult = supportedCombined.civilizationSystems!.campaigns['campaign.supported-combined'];
assert(supportedResult.control > Math.max(guardResult.control, heavyResult.control, combinedResult.control), 'logistically supported mixed force did not outperform constrained or single-role forces');
assert(heavyResult.attackerExhaustion > guardResult.attackerExhaustion, 'heavy-only force did not carry higher sustained supply exhaustion');

let diplomacy = createDiplomaticIssue(combined, { id: 'issue.border-route', actorIds: ['polity.player', 'polity.neighbor'], kind: 'route', importance: 60, tension: 68, grievance: 55, status: 'open' });
diplomacy = createNegotiation(diplomacy, { id: 'negotiation.limited', issueId: 'issue.border-route', proposerId: 'polity.player', counterpartId: 'polity.neighbor', demandLevel: 25, concessionValue: 38, militaryLeverage: 25, economicPressure: 20, credibility: 80, acceptance: 0, status: 'active' });
let maximal = createDiplomaticIssue(combined, { id: 'issue.maximal', actorIds: ['polity.player', 'polity.neighbor'], kind: 'territory', importance: 75, tension: 80, grievance: 65, status: 'open' });
maximal = createNegotiation(maximal, { id: 'negotiation.maximal', issueId: 'issue.maximal', proposerId: 'polity.player', counterpartId: 'polity.neighbor', demandLevel: 90, concessionValue: 0, militaryLeverage: 25, economicPressure: 20, credibility: 60, acceptance: 0, status: 'active' });
diplomacy = advanceNationKernelDays(diplomacy, 5); maximal = advanceNationKernelDays(maximal, 5);
assert(diplomacy.civilizationSystems!.negotiations['negotiation.limited'].status === 'accepted', 'limited settlement was not accepted despite credible leverage and concessions');
assert(maximal.civilizationSystems!.negotiations['negotiation.maximal'].status !== 'accepted', 'maximal annexation demand was accepted too easily');

const occupationBase: OccupationState = { id: 'occupation.test', polityId: 'polity.player', regionId: 'region.neighbor', security: 28, resistance: 62, registry: 8, services: 10, justice: 4, localCooperation: 12, fiscalIntegration: 0, reconstruction: 5, garrisonDemand: 18, serviceDemand: 22, coercion: 70, civilianTrust: 15, displacedPopulation: 25_000, dailyCost: 0, status: 'militaryControl' };
let coercive = createOccupation(base, occupationBase); coercive = setOccupationApproach(coercive, 'occupation.test', 82, 8); coercive = setEconomicAllocation(coercive, { militaryShare: 0.4, civilianShare: 0.2, reconstructionShare: 0.08, researchShare: 0.12, logisticsShare: 0.2 });
let service = createOccupation(base, occupationBase); service = setOccupationApproach(service, 'occupation.test', 30, 28); service = setEconomicAllocation(service, { militaryShare: 0.22, civilianShare: 0.28, reconstructionShare: 0.25, researchShare: 0.1, logisticsShare: 0.15 });
coercive = advanceNationKernelDays(coercive, 180); service = advanceNationKernelDays(service, 180);
const coerciveOccupation = coercive.civilizationSystems!.occupations['occupation.test']; const serviceOccupation = service.civilizationSystems!.occupations['occupation.test'];
assert(coerciveOccupation.security > serviceOccupation.security, 'coercive occupation did not create stronger short-term security');
assert(serviceOccupation.services > coerciveOccupation.services && serviceOccupation.civilianTrust > coerciveOccupation.civilianTrust && serviceOccupation.resistance < coerciveOccupation.resistance, 'service-led integration did not improve trust, services and resistance');
assert(coerciveOccupation.fiscalIntegration === 0, 'coercive control created automatic fiscal integration');
const serviceLong = advanceNationKernelDays(service, 540); const integratedOccupation = serviceLong.civilizationSystems!.occupations['occupation.test'];
assert(integratedOccupation.status === 'integrated' && integratedOccupation.fiscalIntegration > 0, 'service-led occupation did not become integrable within two years');
for (const state of [guardOnly, heavyOnly, combined, supportedCombined, diplomacy, maximal, coercive, service, serviceLong]) { const validation = validateNationKernel(state); assert(validation.ok, validation.errors.join(', ')); }

console.log(JSON.stringify({ ok: true, campaigns: { guard: { control: guardResult.control, exhaustion: guardResult.attackerExhaustion }, heavy: { control: heavyResult.control, exhaustion: heavyResult.attackerExhaustion }, constrainedCombined: { control: combinedResult.control, exhaustion: combinedResult.attackerExhaustion }, supportedCombined: { control: supportedResult.control, exhaustion: supportedResult.attackerExhaustion } }, diplomacy: { limited: diplomacy.civilizationSystems!.negotiations['negotiation.limited'].status, maximal: maximal.civilizationSystems!.negotiations['negotiation.maximal'].status }, occupation180Days: { coercive: coerciveOccupation, service: serviceOccupation }, serviceIntegration720Days: { status: integratedOccupation.status, fiscalIntegration: integratedOccupation.fiscalIntegration, trust: integratedOccupation.civilianTrust, resistance: integratedOccupation.resistance } }, null, 2));
