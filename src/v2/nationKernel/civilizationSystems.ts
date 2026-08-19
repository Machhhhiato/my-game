import type { AuthorityModel, CampaignState, CivilizationEthic, CivilizationSystemsState, CooperationProjectState, DiplomaticIssueState, EconomicAllocationState, KernelId, NationKernelState, NegotiationState, OccupationState, StrategicDirectionDomain } from './types';
import { globalUnificationPolicies, globalUnificationProjects, globalUnificationTechnologies } from './globalUnificationDevelopmentContent';
import { initialStrategicDirectionSelections, strategicDirectionOptions } from './strategicDirectionContent';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const round = (value: number, precision = 3) => Number(value.toFixed(precision));
const clone = (state: NationKernelState): NationKernelState => structuredClone(state) as NationKernelState;
function record(state: NationKernelState, sourceId: KernelId, target: string, before: number | string, after: number | string, reasonKey: string): void { if (before !== after) state.ledger.push({ day: state.calendar.day, sourceId, target, before, after, reasonKey }); }

export interface CivilizationSystemsPreset {
  logistics?: Partial<CivilizationSystemsState['logistics']>;
  demographics?: Partial<CivilizationSystemsState['demographics']>;
  economy?: Partial<CivilizationSystemsState['economy']>;
  politics?: Partial<CivilizationSystemsState['politics']>;
  maritime?: Partial<CivilizationSystemsState['maritime']>;
  aerospace?: Partial<CivilizationSystemsState['aerospace']>;
  satellites?: Partial<CivilizationSystemsState['satellites']>;
  globalUnification?: Partial<CivilizationSystemsState['globalUnification']>;
}

export function installCivilizationSystems(state: NationKernelState, preset: CivilizationSystemsPreset = {}): NationKernelState {
  if (state.civilizationSystems != null) return state;
  const next = clone(state); const population = next.polities[next.playerPolityId]?.population.residents ?? 0;
  next.civilizationSystems = {
    campaigns: {}, diplomaticIssues: {}, negotiations: {}, settlements: {}, occupations: {},
    identity: { authority: 'councilRepublic', ethics: ['cooperation', 'equality', 'continuity'], civicIds: ['civic.public-service-state', 'civic.engineering-commonwealth'], reformCooldownDays: 0 },
    factions: {
      'faction.workers': { id: 'faction.workers', name: '产业劳动联合会', influence: 24, satisfaction: 62, demand: '维持民用供应、劳动保障与可预期的生产秩序', alignedEthic: 'equality' },
      'faction.regions': { id: 'faction.regions', name: '地区议事联盟', influence: 21, satisfaction: 58, demand: '保障地方执行权、公共服务和制度内申诉渠道', alignedEthic: 'cooperation' },
      'faction.industry': { id: 'faction.industry', name: '国家工业委员会', influence: 22, satisfaction: 60, demand: '保持基础设施投资、技术标准和稳定订单', alignedEthic: 'merit' },
      'faction.security': { id: 'faction.security', name: '国防与安全会议', influence: 19, satisfaction: 56, demand: '维持战略威慑、边境安全和可靠后勤', alignedEthic: 'security' },
      'faction.science': { id: 'faction.science', name: '科学共同体', influence: 14, satisfaction: 66, demand: '保障开放研究、国际交流和长期航天投入', alignedEthic: 'openness' },
    },
    events: {}, eventOptions: {}, situations: {}, organizations: {}, cooperationProjects: {},
    technologies: globalUnificationTechnologies(), policies: globalUnificationPolicies(), developmentProjects: globalUnificationProjects(), strategicDirections: initialStrategicDirectionSelections(),
    logistics: { freightCapacity: 70, militaryDemand: 20, civilianDemand: 42, redundancy: 35, disruption: 0, stockpileThroughput: 55, maritimeThroughput: 0, airliftCapacity: 0, effectiveCapacity: 0, bottleneck: 0, ...preset.logistics },
    demographics: { population, healthyPopulation: population * 0.72, dependents: population * 0.26, displaced: 0, birthsPerThousand: 11, deathsPerThousand: 8, migrationPerDay: 0, householdBurden: 38, healthAccess: 65, workforceParticipation: 58, warCasualties: 0, ...preset.demographics },
    economy: { output: 100, revenue: 70, militaryShare: 0.2, civilianShare: 0.35, reconstructionShare: 0.1, researchShare: 0.15, logisticsShare: 0.2, debt: 0, inflationPressure: 10, civilianAvailability: 75, repairFunding: 55, ...preset.economy },
    politics: { legitimacy: 68, warSupport: 55, eliteCohesion: 62, regionalCompliance: 66, polarization: 25, emergencyPower: 10, protestPressure: 15, casualtyTolerance: 50, ...preset.politics },
    maritime: { merchantShipping: 0, escortCapacity: 0, portCapacity: 0, routeSecurity: 0, convoyLossRate: 0, blockadePressure: 0, navalReadiness: 0, ...preset.maritime },
    aerospace: { combatAircraft: 0, transportAircraft: 0, aircraftReadiness: 0, airDefense: 0, missileStockpile: 0, missileReliability: 0, airSuperiority: 0, fuelAvailability: 0, strategicStrikeRisk: 0, ...preset.aerospace },
    satellites: { launchCapacity: 0, reconnaissanceSatellites: 0, communicationSatellites: 0, weatherSatellites: 0, orbitalCoverage: 0, reliability: 0, launchFailureRisk: 100, groundStationCapacity: 0, ...preset.satellites },
    globalUnification: { independentBlocs: 6, controlledTerritoryRatio: 0.35, integratedPopulationRatio: 0.28, commonInstitutionScore: 20, externalRecognition: 25, resistancePressure: 40, sharedInfrastructure: 30, stage: 'fragmented', ...preset.globalUnification },
  };
  record(next, 'civilization-systems', 'civilizationSystems.status', 'absent', 'installed', 'civilizationSystems.installed'); return next;
}

const IDENTITY_PRESETS: Record<AuthorityModel, { ethics: CivilizationEthic[]; civicIds: KernelId[] }> = {
  councilRepublic: { ethics: ['cooperation', 'equality', 'continuity'], civicIds: ['civic.public-service-state', 'civic.regional-councils'] },
  technocraticDirectorate: { ethics: ['merit', 'openness', 'continuity'], civicIds: ['civic.engineering-commonwealth', 'civic.evidence-administration'] },
  centralCommand: { ethics: ['security', 'merit', 'continuity'], civicIds: ['civic.strategic-mobilization', 'civic.unified-command'] },
};

export function setPoliticalIdentity(state: NationKernelState, authority: AuthorityModel): NationKernelState {
  const systems = state.civilizationSystems; const preset = IDENTITY_PRESETS[authority];
  if (systems == null || preset == null || systems.identity.authority === authority || systems.identity.reformCooldownDays > 0) return state;
  const next = clone(state); const target = next.civilizationSystems!; const before = target.identity.authority;
  target.identity = { authority, ethics: [...preset.ethics], civicIds: [...preset.civicIds], reformCooldownDays: 360, lastReformDay: next.calendar.day };
  if (authority === 'councilRepublic') { target.politics.legitimacy = round(clamp(target.politics.legitimacy + 5)); target.politics.regionalCompliance = round(clamp(target.politics.regionalCompliance + 6)); target.politics.emergencyPower = round(clamp(target.politics.emergencyPower - 10)); }
  if (authority === 'technocraticDirectorate') { target.politics.eliteCohesion = round(clamp(target.politics.eliteCohesion + 7)); target.economy.output = round(target.economy.output * 1.04); target.politics.polarization = round(clamp(target.politics.polarization + 3)); }
  if (authority === 'centralCommand') { target.politics.warSupport = round(clamp(target.politics.warSupport + 10)); target.politics.emergencyPower = round(clamp(target.politics.emergencyPower + 20)); target.politics.legitimacy = round(clamp(target.politics.legitimacy - 5)); }
  for (const faction of Object.values(target.factions)) faction.satisfaction = round(clamp(faction.satisfaction + (preset.ethics.includes(faction.alignedEthic) ? 8 : -6)));
  record(next, 'political-reform', 'civilizationSystems.identity.authority', before, authority, 'politics.identity-reformed'); return next;
}

export function resolveStrategicEvent(state: NationKernelState, eventId: KernelId, optionId: KernelId): NationKernelState {
  const event = state.civilizationSystems?.events[eventId]; const option = state.civilizationSystems?.eventOptions[optionId];
  if (event == null || option == null || event.status !== 'active' || !event.optionIds.includes(optionId)) return state;
  const next = clone(state); const systems = next.civilizationSystems!; const target = systems.events[eventId]; target.status = 'resolved'; target.resolvedOptionId = optionId;
  systems.politics.legitimacy = round(clamp(systems.politics.legitimacy + (option.legitimacyDelta ?? 0))); systems.globalUnification.commonInstitutionScore = round(clamp(systems.globalUnification.commonInstitutionScore + (option.institutionDelta ?? 0))); systems.globalUnification.externalRecognition = round(clamp(systems.globalUnification.externalRecognition + (option.recognitionDelta ?? 0))); systems.globalUnification.resistancePressure = round(clamp(systems.globalUnification.resistancePressure + (option.resistanceDelta ?? 0))); systems.economy.debt = round(Math.max(0, systems.economy.debt + (option.debtDelta ?? 0)));
  for (const [factionId, delta] of Object.entries(option.factionSatisfaction ?? {})) { const faction = systems.factions[factionId]; if (faction != null) faction.satisfaction = round(clamp(faction.satisfaction + delta)); }
  record(next, eventId, `event:${eventId}.status`, 'active', `resolved:${optionId}`, 'event.option-selected'); return next;
}

export function startCooperationProject(state: NationKernelState, projectId: KernelId): NationKernelState {
  const project = state.civilizationSystems?.cooperationProjects[projectId]; if (project == null || project.status !== 'proposed') return state;
  const next = clone(state); next.civilizationSystems!.cooperationProjects[projectId].status = 'active'; record(next, projectId, `cooperationProject:${projectId}.status`, 'proposed', 'active', 'cooperation.project-started'); return next;
}

export function setCooperationContribution(state: NationKernelState, projectId: KernelId, contribution: number): NationKernelState {
  const project = state.civilizationSystems?.cooperationProjects[projectId]; if (project == null || project.status === 'completed' || !Number.isFinite(contribution)) return state;
  const next = clone(state); const target = next.civilizationSystems!.cooperationProjects[projectId]; const before = target.contribution; target.contribution = clamp(contribution, 0, 50); record(next, projectId, `cooperationProject:${projectId}.contribution`, before, target.contribution, 'cooperation.contribution-changed'); return next;
}

export function startCivilizationTechnology(state: NationKernelState, technologyId: KernelId): NationKernelState {
  const technology = state.civilizationSystems?.technologies[technologyId]; if (technology == null || technology.status !== 'available' || Object.values(state.civilizationSystems!.technologies).some((item) => item.status === 'researching')) return state;
  const next = clone(state); next.civilizationSystems!.technologies[technologyId].status = 'researching'; record(next, technologyId, `technology:${technologyId}.status`, 'available', 'researching', 'technology.research-started'); return next;
}

export function activateCivilizationPolicy(state: NationKernelState, policyId: KernelId): NationKernelState {
  const policy = state.civilizationSystems?.policies[policyId]; if (policy == null || policy.status !== 'available') return state;
  const next = clone(state); const target = next.civilizationSystems!.policies[policyId]; target.status = 'active'; target.remainingDays = target.durationDays; record(next, policyId, `policy:${policyId}.status`, 'available', 'active', 'policy.activated'); return next;
}

export function startNationalDevelopmentProject(state: NationKernelState, projectId: KernelId): NationKernelState {
  const project = state.civilizationSystems?.developmentProjects[projectId]; if (project == null || project.status !== 'available') return state;
  const next = clone(state); next.civilizationSystems!.developmentProjects[projectId].status = 'building'; record(next, projectId, `developmentProject:${projectId}.status`, 'available', 'building', 'developmentProject.started'); return next;
}

export function selectStrategicDirection(state: NationKernelState, domain: StrategicDirectionDomain, optionId: KernelId): NationKernelState {
  const selection = state.civilizationSystems?.strategicDirections[domain]; const option = strategicDirectionOptions()[optionId];
  if (selection == null || option == null || option.domain !== domain || selection.selectedOptionId === optionId || selection.revisionCooldownDays > 0) return state;
  const next = clone(state); const target = next.civilizationSystems!.strategicDirections[domain]; const before = target.selectedOptionId ?? 'unselected';
  target.selectedOptionId = optionId; target.selectedDay = next.calendar.day; target.revisionCooldownDays = 90;
  record(next, optionId, `strategicDirection:${domain}`, before, optionId, 'strategic-direction.selected'); return next;
}

export function setEconomicAllocation(state: NationKernelState, allocation: Pick<EconomicAllocationState, 'militaryShare' | 'civilianShare' | 'reconstructionShare' | 'researchShare' | 'logisticsShare'>): NationKernelState {
  const systems = state.civilizationSystems; const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  if (systems == null || Object.values(allocation).some((value) => !Number.isFinite(value) || value < 0) || Math.abs(total - 1) > 0.001) return state;
  const next = clone(state); Object.assign(next.civilizationSystems!.economy, allocation); record(next, 'economic-allocation', 'civilizationSystems.economy.allocation', 'previous', `${allocation.militaryShare}/${allocation.civilianShare}/${allocation.reconstructionShare}/${allocation.researchShare}/${allocation.logisticsShare}`, 'economy.allocation-changed'); return next;
}

export function createCampaign(state: NationKernelState, campaign: CampaignState): NationKernelState {
  const systems = state.civilizationSystems; if (systems == null || systems.campaigns[campaign.id] != null || state.theatres[campaign.theatreId] == null || [...campaign.attackerFormationIds, ...campaign.defenderFormationIds].some((id) => state.formations[id] == null)) return state;
  const next = clone(state); next.civilizationSystems!.campaigns[campaign.id] = structuredClone(campaign); record(next, campaign.id, `campaign:${campaign.id}.status`, 'absent', campaign.status, 'campaign.created'); return next;
}

export function createDiplomaticIssue(state: NationKernelState, issue: DiplomaticIssueState): NationKernelState {
  if (state.civilizationSystems == null || state.civilizationSystems.diplomaticIssues[issue.id] != null || issue.actorIds.some((id) => state.polities[id] == null)) return state;
  const next = clone(state); next.civilizationSystems!.diplomaticIssues[issue.id] = structuredClone(issue); record(next, issue.id, `diplomaticIssue:${issue.id}.status`, 'absent', issue.status, 'diplomaticIssue.created'); return next;
}

export function createNegotiation(state: NationKernelState, negotiation: NegotiationState): NationKernelState {
  const systems = state.civilizationSystems; if (systems == null || systems.negotiations[negotiation.id] != null || systems.diplomaticIssues[negotiation.issueId] == null) return state;
  const next = clone(state); next.civilizationSystems!.negotiations[negotiation.id] = structuredClone(negotiation); next.civilizationSystems!.diplomaticIssues[negotiation.issueId].status = 'negotiating'; record(next, negotiation.id, `negotiation:${negotiation.id}.status`, 'absent', negotiation.status, 'negotiation.created'); return next;
}

export function createOccupation(state: NationKernelState, occupation: OccupationState): NationKernelState {
  if (state.civilizationSystems == null || state.civilizationSystems.occupations[occupation.id] != null || state.regions[occupation.regionId] == null || state.polities[occupation.polityId] == null) return state;
  const next = clone(state); next.civilizationSystems!.occupations[occupation.id] = structuredClone(occupation); record(next, occupation.id, `occupation:${occupation.id}.status`, 'absent', occupation.status, 'occupation.created'); return next;
}

export function setOccupationApproach(state: NationKernelState, occupationId: KernelId, coercion: number, serviceDemand: number): NationKernelState {
  const occupation = state.civilizationSystems?.occupations[occupationId]; if (occupation == null || !Number.isFinite(coercion) || !Number.isFinite(serviceDemand)) return state;
  const next = clone(state); const target = next.civilizationSystems!.occupations[occupationId]; target.coercion = clamp(coercion); target.serviceDemand = Math.max(0, serviceDemand); record(next, occupationId, `occupation:${occupationId}.approach`, 'previous', `${target.coercion}/${target.serviceDemand}`, 'occupation.approach-changed'); return next;
}

export function launchBasicSatellite(state: NationKernelState, kind: 'reconnaissance' | 'communication' | 'weather'): NationKernelState {
  const satellites = state.civilizationSystems?.satellites; if (satellites == null || satellites.launchCapacity < 1 || satellites.groundStationCapacity < 20) return state;
  const next = clone(state); const target = next.civilizationSystems!.satellites; target.launchCapacity = round(target.launchCapacity - 1); const succeeds = target.reliability >= target.launchFailureRisk;
  if (succeeds) { const field = kind === 'reconnaissance' ? 'reconnaissanceSatellites' : kind === 'communication' ? 'communicationSatellites' : 'weatherSatellites'; const before = target[field]; target[field] += 1; record(next, `satellite-launch.${kind}`, `satellites.${field}`, before, target[field], 'satellite.launch-success'); }
  else record(next, `satellite-launch.${kind}`, 'satellites.launchResult', 'planned', 'failure', 'satellite.launch-failure');
  return next;
}

export function conductMissileDemonstration(state: NationKernelState, negotiationId: KernelId): NationKernelState {
  const systems = state.civilizationSystems; const negotiation = systems?.negotiations[negotiationId]; if (systems == null || negotiation == null || systems.aerospace.missileStockpile < 1 || systems.aerospace.missileReliability <= 0) return state;
  const next = clone(state); const targetSystems = next.civilizationSystems!; const target = targetSystems.negotiations[negotiationId]; const issue = targetSystems.diplomaticIssues[target.issueId]; targetSystems.aerospace.missileStockpile -= 1; target.credibility = round(clamp(target.credibility + targetSystems.aerospace.missileReliability * 0.12)); target.militaryLeverage = round(clamp(target.militaryLeverage + 8)); if (issue != null) { issue.tension = round(clamp(issue.tension + 7)); issue.grievance = round(clamp(issue.grievance + 4)); } record(next, negotiationId, `negotiation:${negotiationId}.missileDemonstration`, 'unused', 'conducted', 'aerospace.missile-demonstration'); return next;
}

export function ratifyGlobalSettlement(state: NationKernelState, settlementId: KernelId): NationKernelState {
  const settlement = state.civilizationSystems?.settlements[settlementId]; if (settlement == null || settlement.status !== 'active' || settlement.legitimacy < 45) return state;
  const next = clone(state); const systems = next.civilizationSystems!; const target = systems.settlements[settlementId]; const before = systems.globalUnification.independentBlocs; systems.globalUnification.independentBlocs = Math.max(1, before - 1); systems.globalUnification.commonInstitutionScore = round(clamp(systems.globalUnification.commonInstitutionScore + target.monitoring * 0.08 + target.legitimacy * 0.06)); systems.globalUnification.externalRecognition = round(clamp(systems.globalUnification.externalRecognition + target.legitimacy * 0.1)); target.status = 'completed'; record(next, settlementId, 'globalUnification.independentBlocs', before, systems.globalUnification.independentBlocs, 'globalSettlement.ratified'); return next;
}

export function globalUnificationReadiness(state: NationKernelState): Record<string, { current: number; required: number; met: boolean }> | null {
  const systems = state.civilizationSystems; if (systems == null) return null; const global = systems.globalUnification;
  return {
    independentBlocs: { current: global.independentBlocs, required: 1, met: global.independentBlocs <= 1 },
    controlledTerritoryRatio: { current: global.controlledTerritoryRatio, required: 0.85, met: global.controlledTerritoryRatio >= 0.85 },
    integratedPopulationRatio: { current: global.integratedPopulationRatio, required: 0.8, met: global.integratedPopulationRatio >= 0.8 },
    commonInstitutionScore: { current: global.commonInstitutionScore, required: 65, met: global.commonInstitutionScore >= 65 },
    resistancePressure: { current: global.resistancePressure, required: 35, met: global.resistancePressure <= 35 },
    legitimacy: { current: systems.politics.legitimacy, required: 55, met: systems.politics.legitimacy >= 55 },
    sharedInfrastructure: { current: global.sharedInfrastructure, required: 55, met: global.sharedInfrastructure >= 55 },
    fiscalSustainability: { current: systems.economy.debt / Math.max(1, systems.economy.output), required: 1.2, met: systems.economy.debt / Math.max(1, systems.economy.output) <= 1.2 },
    communicationSatellites: { current: systems.satellites.communicationSatellites, required: 1, met: systems.satellites.communicationSatellites >= 1 },
    maritimeThroughput: { current: systems.logistics.maritimeThroughput, required: 10, met: systems.logistics.maritimeThroughput >= 10 },
    airliftCapacity: { current: systems.logistics.airliftCapacity, required: 2, met: systems.logistics.airliftCapacity >= 2 },
    strategicDeterrence: { current: Math.min(systems.aerospace.missileStockpile, systems.aerospace.missileReliability), required: 1, met: systems.aerospace.missileStockpile >= 1 && systems.aerospace.missileReliability >= 50 },
  };
}

function formationPower(state: NationKernelState, ids: KernelId[], attacking: boolean): number {
  return ids.reduce((sum, id) => { const formation = state.formations[id]; if (formation == null) return sum; const equipmentEffect = formation.equipment.reduce((effect, item) => { const designId = state.stockpiles[item.stockpileId]?.designId; const design = designId == null ? undefined : state.designs[designId]; return effect + (design?.performance?.effectiveness ?? 50) * ((item.delivered ?? item.required) / item.required); }, 0) / Math.max(1, formation.equipment.length); const role = attacking ? (formation.role === 'field' ? 1.15 : 0.82) : (formation.role === 'garrison' ? 1.18 : 1); return sum + formation.personnel / 1000 * formation.training / 100 * formation.readiness / 100 * (formation.equipmentReadiness ?? 100) / 100 * equipmentEffect / 50 * role; }, 0);
}

function applyCampaignEquipmentLoss(state: NationKernelState, ids: KernelId[], lossRatio: number): void {
  for (const id of ids) { const formation = state.formations[id]; if (formation == null) continue; for (const item of formation.equipment) item.delivered = round(clamp((item.delivered ?? item.required) - item.required * lossRatio, 0, item.required)); const delivered = formation.equipment.reduce((sum, item) => sum + (item.delivered ?? item.required), 0); const required = formation.equipment.reduce((sum, item) => sum + item.required, 0); formation.equipmentReadiness = required === 0 ? 100 : round(delivered / required * 100, 1); }
}

function advanceMaritimeAerospaceAndSpace(systems: CivilizationSystemsState): void {
  const maritime = systems.maritime; const aerospace = systems.aerospace; const satellites = systems.satellites;
  const convoyLossTarget = clamp((maritime.blockadePressure - maritime.escortCapacity * 1.4 - aerospace.airSuperiority * 0.25) * 0.12);
  maritime.convoyLossRate = round(clamp(maritime.convoyLossRate + (convoyLossTarget - maritime.convoyLossRate) * 0.15)); maritime.routeSecurity = round(clamp(maritime.routeSecurity + (50 + maritime.escortCapacity * 1.2 + maritime.navalReadiness * 0.25 - maritime.blockadePressure - maritime.routeSecurity) * 0.08));
  const airTarget = clamp(aerospace.combatAircraft * aerospace.aircraftReadiness / 100 * aerospace.fuelAvailability / 100 * 1.35 + satellites.reconnaissanceSatellites * satellites.reliability / 100 * 1.2);
  aerospace.airSuperiority = round(clamp(aerospace.airSuperiority + (airTarget - aerospace.airSuperiority) * 0.12)); aerospace.strategicStrikeRisk = round(clamp(aerospace.missileStockpile * aerospace.missileReliability / 100 * 0.35));
  const satelliteCount = satellites.reconnaissanceSatellites + satellites.communicationSatellites + satellites.weatherSatellites; const coverageTarget = clamp(satelliteCount * 18 * satellites.reliability / 100 * Math.min(1, satellites.groundStationCapacity / 50)); satellites.orbitalCoverage = round(clamp(satellites.orbitalCoverage + (coverageTarget - satellites.orbitalCoverage) * 0.1));
}

function advanceLogistics(systems: CivilizationSystemsState): void {
  const maritime = Math.min(systems.maritime.merchantShipping, systems.maritime.portCapacity) * systems.maritime.routeSecurity / 100 * (1 - systems.maritime.convoyLossRate / 100);
  systems.logistics.maritimeThroughput = round(maritime);
  systems.logistics.airliftCapacity = round(systems.aerospace.transportAircraft * systems.aerospace.aircraftReadiness / 100 * systems.aerospace.fuelAvailability / 100 * 0.4);
  const raw = systems.logistics.freightCapacity + systems.logistics.maritimeThroughput + systems.logistics.airliftCapacity;
  const resilience = 0.7 + systems.logistics.redundancy / 100 * 0.3;
  const satelliteCoordination = 1 + systems.satellites.communicationSatellites * systems.satellites.reliability / 100 * 0.005;
  systems.logistics.effectiveCapacity = round(raw * resilience * (1 - systems.logistics.disruption / 100) * satelliteCoordination);
  systems.logistics.bottleneck = round(Math.max(0, systems.logistics.militaryDemand + systems.logistics.civilianDemand - systems.logistics.effectiveCapacity));
}

function advanceCampaigns(state: NationKernelState, systems: CivilizationSystemsState): void {
  for (const campaign of Object.values(systems.campaigns)) {
    if (campaign.status !== 'active') continue; campaign.elapsedDays += 1;
    const supplyCoverage = clamp(systems.logistics.effectiveCapacity / Math.max(1, systems.logistics.militaryDemand + campaign.supplyDemand), 0, 1.2);
    const satelliteIntel = systems.satellites.reconnaissanceSatellites * systems.satellites.reliability / 100 * 2;
    const intelligence = clamp(campaign.intelligence + satelliteIntel, 0, 100) / 100;
    const airAdvantage = 1 + systems.aerospace.airSuperiority / 500;
    const attacker = formationPower(state, campaign.attackerFormationIds, true) * supplyCoverage * (0.8 + intelligence * 0.2) * airAdvantage;
    const defender = formationPower(state, campaign.defenderFormationIds, false) * (0.8 + campaign.defenderDepth / 250) * (1 + systems.aerospace.airDefense / 600);
    const balance = (attacker - defender) / Math.max(1, attacker + defender); const beforeControl = campaign.control;
    campaign.control = round(clamp(campaign.control + balance * (campaign.objective === 'limitedAdvance' ? 2.2 : 1.4), 0, 100));
    const intensity = 0.001 + Math.abs(balance) * 0.002; const attackerLoss = intensity * (defender / Math.max(1, attacker)); const defenderLoss = intensity * (attacker / Math.max(1, defender));
    applyCampaignEquipmentLoss(state, campaign.attackerFormationIds, attackerLoss); applyCampaignEquipmentLoss(state, campaign.defenderFormationIds, defenderLoss);
    campaign.attackerPersonnelLosses = round(campaign.attackerPersonnelLosses + attackerLoss * campaign.attackerFormationIds.reduce((sum, id) => sum + (state.formations[id]?.personnel ?? 0), 0));
    campaign.defenderPersonnelLosses = round(campaign.defenderPersonnelLosses + defenderLoss * campaign.defenderFormationIds.reduce((sum, id) => sum + (state.formations[id]?.personnel ?? 0), 0));
    campaign.equipmentLosses = round(campaign.equipmentLosses + (attackerLoss + defenderLoss) * 10);
    campaign.attackerExhaustion = round(clamp(campaign.attackerExhaustion + 0.35 + (1 - supplyCoverage) * 1.2)); campaign.defenderExhaustion = round(clamp(campaign.defenderExhaustion + 0.28 + Math.max(0, balance) * 0.8));
    campaign.civilianImpact = round(clamp(campaign.civilianImpact + 0.08 + systems.aerospace.strategicStrikeRisk * 0.002)); campaign.infrastructureDamage = round(clamp(campaign.infrastructureDamage + 0.05 + systems.aerospace.strategicStrikeRisk * 0.0015));
    systems.demographics.warCasualties = round(systems.demographics.warCasualties + attackerLoss * 5 + defenderLoss * 5); systems.demographics.displaced = round(systems.demographics.displaced + campaign.civilianImpact * 2);
    if (campaign.control >= 70) { campaign.status = 'completed'; campaign.outcome = 'attacker-objective-secured'; } else if (campaign.control <= 30) { campaign.status = 'failed'; campaign.outcome = 'attacker-repelled'; } else if (campaign.attackerExhaustion >= campaign.stopAtExhaustion || campaign.defenderExhaustion >= campaign.stopAtExhaustion) { campaign.status = 'stalemate'; campaign.outcome = 'exhaustion-stop'; }
    if (Math.floor(beforeControl) !== Math.floor(campaign.control)) record(state, campaign.id, `campaign:${campaign.id}.control`, beforeControl, campaign.control, 'campaign.daily-resolution');
  }
}

function advanceDiplomacy(state: NationKernelState, systems: CivilizationSystemsState): void {
  const activeCampaigns = Object.values(systems.campaigns).filter((campaign) => campaign.status === 'active' || campaign.status === 'stalemate');
  for (const negotiation of Object.values(systems.negotiations)) {
    if (negotiation.status !== 'active' && negotiation.status !== 'proposed') continue; const issue = systems.diplomaticIssues[negotiation.issueId]; if (issue == null) continue;
    const campaign = activeCampaigns.find((item) => issue.actorIds.includes(item.attackerPolityId) && issue.actorIds.includes(item.defenderPolityId)); const exhaustion = campaign == null ? 0 : (campaign.attackerExhaustion + campaign.defenderExhaustion) / 2;
    negotiation.militaryLeverage = round(clamp(negotiation.militaryLeverage + (campaign == null ? 0 : (campaign.control - 50) * 0.03)));
    negotiation.acceptance = round(clamp(50 + negotiation.concessionValue + negotiation.economicPressure * 0.3 + negotiation.credibility * 0.2 + negotiation.militaryLeverage * 0.4 + exhaustion * 0.25 - negotiation.demandLevel - issue.importance * 0.35));
    negotiation.status = negotiation.acceptance >= 65 ? 'accepted' : negotiation.acceptance <= 10 && negotiation.demandLevel > 70 ? 'rejected' : 'active';
    if (negotiation.status === 'accepted') { const settlementId = `settlement.${negotiation.id}`; negotiation.settlementId = settlementId; issue.status = 'settled'; systems.settlements[settlementId] = { id: settlementId, issueId: issue.id, actorIds: issue.actorIds, ceasefire: true, withdrawal: clamp(100 - negotiation.demandLevel), routeAccess: clamp(negotiation.concessionValue), reparations: clamp(negotiation.demandLevel - 40), monitoring: clamp(negotiation.credibility), legitimacy: clamp(100 - negotiation.demandLevel + negotiation.concessionValue), status: 'active' }; record(state, negotiation.id, `negotiation:${negotiation.id}.status`, 'active', 'accepted', 'negotiation.accepted'); }
  }
}

function advanceOccupations(state: NationKernelState, systems: CivilizationSystemsState): void {
  for (const occupation of Object.values(systems.occupations)) {
    if (occupation.status === 'integrated' || occupation.status === 'failed') continue; const logisticsCoverage = clamp(systems.logistics.effectiveCapacity / Math.max(1, systems.logistics.civilianDemand + occupation.serviceDemand), 0, 1);
    const reconstruction = systems.economy.reconstructionShare * systems.economy.output * logisticsCoverage; const serviceGrowth = reconstruction * 0.014;
    occupation.security = round(clamp(occupation.security + occupation.coercion * 0.006 + occupation.localCooperation * 0.003 - occupation.resistance * 0.002));
    occupation.services = round(clamp(occupation.services + serviceGrowth)); occupation.reconstruction = round(clamp(occupation.reconstruction + reconstruction * 0.004)); occupation.registry = round(clamp(occupation.registry + (occupation.services > 25 ? 0.22 : 0.04)));
    occupation.justice = round(clamp(occupation.justice + (occupation.registry > 25 ? 0.14 : 0.02))); occupation.civilianTrust = round(clamp(occupation.civilianTrust + serviceGrowth * 0.5 + occupation.justice * 0.002 - occupation.coercion * 0.001));
    occupation.resistance = round(clamp(occupation.resistance + occupation.coercion * 0.002 - occupation.civilianTrust * 0.004 - occupation.security * 0.001)); occupation.localCooperation = round(clamp(occupation.localCooperation + occupation.civilianTrust * 0.002 - occupation.coercion * 0.0015));
    if (occupation.security > 45 && occupation.registry > 35 && occupation.services > 35) occupation.status = 'civilAdministration';
    if (occupation.security > 60 && occupation.registry > 60 && occupation.services > 60 && occupation.justice > 45 && occupation.civilianTrust > 55) { occupation.status = 'integrated'; occupation.fiscalIntegration = round(clamp(occupation.fiscalIntegration + 20)); }
    occupation.displacedPopulation = round(Math.max(0, occupation.displacedPopulation - reconstruction * 0.2)); occupation.dailyCost = round(occupation.garrisonDemand * systems.economy.militaryShare + occupation.serviceDemand * systems.economy.reconstructionShare);
  }
}

function advanceEconomyAndSociety(state: NationKernelState, systems: CivilizationSystemsState): void {
  const economy = systems.economy; const politics = systems.politics; const demographics = systems.demographics; const activeWars = Object.values(systems.campaigns).filter((campaign) => campaign.status === 'active').length;
  const militaryDemand = systems.logistics.militaryDemand + activeWars * 12; const fundedMilitary = economy.output * economy.militaryShare; economy.debt = round(Math.max(0, economy.debt + (militaryDemand - fundedMilitary) * 0.02)); economy.inflationPressure = round(clamp(economy.inflationPressure + Math.max(0, economy.militaryShare - 0.25) * 0.08 - economy.civilianShare * 0.02));
  economy.civilianAvailability = round(clamp(60 + economy.civilianShare * 80 - systems.logistics.bottleneck * 0.35 - economy.inflationPressure * 0.2)); economy.repairFunding = round(clamp(economy.reconstructionShare * 220 + economy.logisticsShare * 80));
  politics.warSupport = round(clamp(politics.warSupport - systems.demographics.warCasualties * 0.0002 - activeWars * 0.015 + Math.max(0, 55 - systems.globalUnification.resistancePressure) * 0.001)); politics.protestPressure = round(clamp(politics.protestPressure + Math.max(0, 55 - economy.civilianAvailability) * 0.01 + economy.inflationPressure * 0.003)); politics.legitimacy = round(clamp(politics.legitimacy + (economy.civilianAvailability - 60) * 0.002 - politics.protestPressure * 0.001 - politics.emergencyPower * 0.0004));
  politics.regionalCompliance = round(clamp(politics.regionalCompliance + (politics.legitimacy - 55) * 0.001 - politics.emergencyPower * 0.0006 - politics.polarization * 0.0003)); politics.eliteCohesion = round(clamp(politics.eliteCohesion + (politics.warSupport - 50) * 0.0008 - politics.polarization * 0.0004)); politics.polarization = round(clamp(politics.polarization + politics.emergencyPower * 0.0008 + Math.max(0, 60 - economy.civilianAvailability) * 0.002 - economy.civilianShare * 0.002));
  const adjustedDeaths = demographics.deathsPerThousand * (1 + Math.max(0, 60 - demographics.healthAccess) / 100); const adjustedBirths = demographics.birthsPerThousand * (1 - demographics.householdBurden / 180); const annualNaturalRate = (adjustedBirths - adjustedDeaths) / 1000; demographics.population = round(Math.max(0, demographics.population + demographics.population * annualNaturalRate / 360 + demographics.migrationPerDay - demographics.warCasualties * 0.001)); demographics.healthAccess = round(clamp(demographics.healthAccess + (economy.civilianAvailability - 60) * 0.001 - systems.logistics.bottleneck * 0.002)); demographics.householdBurden = round(clamp(demographics.householdBurden + activeWars * 0.01 + demographics.displaced / Math.max(1, demographics.population) * 5 - economy.civilianShare * 0.01)); demographics.displaced = round(Math.max(0, demographics.displaced - economy.reconstructionShare * 16 * Math.max(0.2, 1 - systems.logistics.bottleneck / 100))); demographics.workforceParticipation = round(clamp(demographics.workforceParticipation + (demographics.healthAccess - 60) * 0.0005 - (demographics.householdBurden - 40) * 0.0004));
}

function advanceGlobalUnification(systems: CivilizationSystemsState): void {
  const global = systems.globalUnification; const occupations = Object.values(systems.occupations); const integrated = occupations.filter((occupation) => occupation.status === 'integrated').length; const settlements = Object.values(systems.settlements).filter((settlement) => settlement.status === 'active').length;
  global.commonInstitutionScore = round(clamp(global.commonInstitutionScore + settlements * 0.005 + systems.politics.regionalCompliance * 0.0005)); global.integratedPopulationRatio = round(clamp(global.integratedPopulationRatio + integrated * 0.0003, 0, 1), 5); global.controlledTerritoryRatio = round(clamp(global.controlledTerritoryRatio + integrated * 0.0002, 0, 1), 5); global.sharedInfrastructure = round(clamp(global.sharedInfrastructure + systems.logistics.redundancy * 0.0005 + systems.satellites.orbitalCoverage * 0.0002)); global.resistancePressure = round(clamp(global.resistancePressure + occupations.reduce((sum, occupation) => sum + occupation.resistance - occupation.civilianTrust, 0) * 0.0002));
  const fiscalSustainable = systems.economy.debt / Math.max(1, systems.economy.output) <= 1.2; const connected = systems.satellites.communicationSatellites >= 1 && systems.logistics.maritimeThroughput >= 10 && systems.logistics.airliftCapacity >= 2; const deterrence = systems.aerospace.missileStockpile >= 1 && systems.aerospace.missileReliability >= 50;
  const unionReady = global.independentBlocs <= 1 && global.controlledTerritoryRatio >= 0.85 && global.integratedPopulationRatio >= 0.8 && global.commonInstitutionScore >= 65 && global.resistancePressure <= 35 && systems.politics.legitimacy >= 55 && global.sharedInfrastructure >= 55 && fiscalSustainable && connected && deterrence;
  global.stage = unionReady ? 'globalUnion' : global.controlledTerritoryRatio >= 0.7 ? 'hegemonicSettlement' : global.commonInstitutionScore >= 40 ? 'contestedOrder' : 'fragmented';
}

function applyDevelopmentEffect(systems: CivilizationSystemsState, effect: import('./types').DevelopmentEffect, scale = 1): void {
  const add = (value: number | undefined): number => (value ?? 0) * scale;
  systems.politics.legitimacy = round(clamp(systems.politics.legitimacy + add(effect.legitimacy))); systems.politics.regionalCompliance = round(clamp(systems.politics.regionalCompliance + add(effect.regionalCompliance)));
  systems.globalUnification.commonInstitutionScore = round(clamp(systems.globalUnification.commonInstitutionScore + add(effect.commonInstitution))); systems.globalUnification.externalRecognition = round(clamp(systems.globalUnification.externalRecognition + add(effect.recognition))); systems.globalUnification.resistancePressure = round(clamp(systems.globalUnification.resistancePressure + add(effect.resistance))); systems.globalUnification.sharedInfrastructure = round(clamp(systems.globalUnification.sharedInfrastructure + add(effect.sharedInfrastructure)));
  systems.logistics.freightCapacity = round(Math.max(0, systems.logistics.freightCapacity + add(effect.logisticsCapacity))); systems.logistics.redundancy = round(clamp(systems.logistics.redundancy + add(effect.logisticsRedundancy))); systems.satellites.reliability = round(clamp(systems.satellites.reliability + add(effect.satelliteReliability))); systems.satellites.orbitalCoverage = round(clamp(systems.satellites.orbitalCoverage + add(effect.orbitalCoverage)));
  systems.economy.civilianAvailability = round(clamp(systems.economy.civilianAvailability + add(effect.civilianAvailability))); systems.demographics.healthAccess = round(clamp(systems.demographics.healthAccess + add(effect.healthAccess))); systems.economy.debt = round(Math.max(0, systems.economy.debt + add(effect.debt)));
  for (const [factionId, delta] of Object.entries(effect.factionSatisfaction ?? {})) { const faction = systems.factions[factionId]; if (faction != null) faction.satisfaction = round(clamp(faction.satisfaction + delta * scale)); }
}

function advanceDevelopmentContent(state: NationKernelState, systems: CivilizationSystemsState): void {
  for (const technology of Object.values(systems.technologies)) {
    if (technology.status === 'locked' && technology.prerequisiteIds.every((id) => systems.technologies[id]?.status === 'completed')) technology.status = 'available';
    if (technology.status !== 'researching') continue; technology.progress = round(Math.min(technology.workRequired, technology.progress + systems.economy.output * systems.economy.researchShare / 10));
    if (technology.progress < technology.workRequired) continue; technology.status = 'completed'; applyDevelopmentEffect(systems, technology.effects); record(state, technology.id, `technology:${technology.id}.status`, 'researching', 'completed', 'technology.research-completed');
  }
  for (const project of Object.values(systems.developmentProjects)) {
    if (project.status === 'locked' && project.requiredTechnologyIds.every((id) => systems.technologies[id]?.status === 'completed')) project.status = 'available';
    if (project.status !== 'building') continue; project.progress = round(Math.min(project.workRequired, project.progress + systems.economy.output * systems.economy.reconstructionShare / 10));
    if (project.progress < project.workRequired) continue; project.status = 'completed'; applyDevelopmentEffect(systems, project.effects); record(state, project.id, `developmentProject:${project.id}.status`, 'building', 'completed', 'developmentProject.completed');
  }
  for (const policy of Object.values(systems.policies)) {
    if (policy.status === 'active') { applyDevelopmentEffect(systems, policy.dailyEffects); policy.remainingDays -= 1; if (policy.remainingDays <= 0) { applyDevelopmentEffect(systems, policy.completionEffects ?? {}); policy.status = 'cooldown'; policy.remainingDays = policy.cooldownDays; record(state, policy.id, `policy:${policy.id}.status`, 'active', 'cooldown', 'policy.completed'); } }
    else if (policy.status === 'cooldown') { policy.remainingDays -= 1; if (policy.remainingDays <= 0) { policy.status = 'available'; policy.remainingDays = 0; } }
  }
}

function advancePoliticsEventsAndCooperation(state: NationKernelState, systems: CivilizationSystemsState): void {
  systems.identity.reformCooldownDays = Math.max(0, systems.identity.reformCooldownDays - 1);
  for (const direction of Object.values(systems.strategicDirections)) direction.revisionCooldownDays = Math.max(0, direction.revisionCooldownDays - 1);
  const civilian = systems.economy.civilianAvailability; const security = 100 - systems.globalUnification.resistancePressure;
  for (const faction of Object.values(systems.factions)) {
    let target = 55;
    if (faction.id === 'faction.workers') target = civilian;
    if (faction.id === 'faction.regions') target = (systems.politics.regionalCompliance + security) / 2;
    if (faction.id === 'faction.industry') target = (systems.economy.output + systems.logistics.effectiveCapacity) / 2;
    if (faction.id === 'faction.security') target = (systems.politics.warSupport + systems.aerospace.missileReliability) / 2;
    if (faction.id === 'faction.science') target = systems.economy.researchShare * 260 + systems.satellites.orbitalCoverage * .35;
    faction.satisfaction = round(clamp(faction.satisfaction + (target - faction.satisfaction) * .004));
  }
  for (const situation of Object.values(systems.situations)) {
    if (situation.status !== 'developing' && situation.status !== 'critical') continue;
    const response = systems.economy.reconstructionShare * 70 + systems.politics.regionalCompliance * .18 + systems.globalUnification.commonInstitutionScore * .12;
    situation.progress = round(clamp(situation.progress + Math.max(.02, response / 100)));
    situation.pressure = round(clamp(situation.pressure + systems.globalUnification.resistancePressure * .003 - response * .002));
    situation.status = situation.progress >= 100 ? 'resolved' : situation.pressure >= 80 ? 'critical' : 'developing';
  }
  for (const project of Object.values(systems.cooperationProjects)) {
    if (project.status !== 'active') continue; const organization = systems.organizations[project.organizationId];
    const trustFactor = organization == null ? .5 : (organization.cohesion + organization.legitimacy) / 200;
    project.progress = round(Math.min(project.requiredProgress, project.progress + (project.contribution + project.partnerContribution) * trustFactor / 100));
    if (project.progress < project.requiredProgress) continue; project.status = 'completed';
    systems.globalUnification.externalRecognition = round(clamp(systems.globalUnification.externalRecognition + 6)); systems.globalUnification.commonInstitutionScore = round(clamp(systems.globalUnification.commonInstitutionScore + 5));
    if (project.kind === 'infrastructure' || project.kind === 'space') systems.globalUnification.sharedInfrastructure = round(clamp(systems.globalUnification.sharedInfrastructure + 7));
    if (organization != null) { organization.cohesion = round(clamp(organization.cohesion + 6)); organization.legitimacy = round(clamp(organization.legitimacy + 4)); }
    record(state, project.id, `cooperationProject:${project.id}.status`, 'active', 'completed', 'cooperation.project-completed');
  }
}

export function advanceCivilizationSystemsDay(state: NationKernelState): void {
  const systems = state.civilizationSystems; if (systems == null) return; advanceMaritimeAerospaceAndSpace(systems); advanceLogistics(systems); advanceCampaigns(state, systems); advanceDiplomacy(state, systems); advanceOccupations(state, systems); advanceEconomyAndSociety(state, systems); advanceDevelopmentContent(state, systems); advancePoliticsEventsAndCooperation(state, systems); advanceGlobalUnification(systems);
}
