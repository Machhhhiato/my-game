import {
  createCampaign,
  createDiplomaticIssue,
  createNegotiation,
  createOccupation,
  installCivilizationSystems,
} from './civilizationSystems';
import { createDiplomaticConflictSave } from './saveFixtures';
import { advanceNationKernelDays, startOperation } from './simulation';
import type { CampaignState, CooperationProjectState, NationKernelState, OccupationState } from './types';

function completeOperation(state: NationKernelState, operationId: string, days: number): NationKernelState {
  const started = startOperation(state, operationId);
  return advanceNationKernelDays(started, days);
}

/**
 * R37 第二轮试玩场景。它复用正式内核与内容包，只预先完成冗长的工业建设阶段，
 * 让玩家从最后一个独立集团、边境战役和全球制度谈判开始。
 */
export function createGlobalUnificationPlaytestState(): NationKernelState {
  let state = createDiplomaticConflictSave().state;
  state = completeOperation(state, 'operation.r28b.industrial-standard', 12);
  state = startOperation(state, 'operation.r28b.guard-equipment-design');
  state = startOperation(state, 'operation.r29a.mobile-heavy-equipment-design');
  state = advanceNationKernelDays(state, 14);
  state = completeOperation(state, 'operation.r28b.military-assembly-works', 15);
  state = completeOperation(state, 'operation.r28b.guard-equipment-line', 22);
  state = completeOperation(state, 'operation.r28b.border-guard-formation', 6);
  state = completeOperation(state, 'operation.r29a.mobile-heavy-tooling', 8);
  state = completeOperation(state, 'operation.r29a.retool-mobile-heavy-line', 31);
  state = completeOperation(state, 'operation.r29a.mobile-reserve-formation', 8);

  state.designs['design.playtest.peer-line'] = {
    id: 'design.playtest.peer-line', polityId: 'polity.neighbor', kind: 'vehicle', status: 'standardized', requiredCapabilityIds: [],
    tags: ['ground'], productionCost: 1.5, maintenanceLoad: 0.28,
    performance: { effectiveness: 64, reliability: 68, adaptability: 66 }, sourceIds: ['fixture.r37-playtest'],
  };
  state.stockpiles['stockpile.playtest.peer-equipment'] = {
    id: 'stockpile.playtest.peer-equipment', polityId: 'polity.neighbor', kind: 'equipment', designId: 'design.playtest.peer-line',
    quantity: 20, reserved: 0, capacity: 30, targetReserve: 18, sourceFacilityIds: [],
  };
  state.formations['formation.playtest.peer-field'] = {
    id: 'formation.playtest.peer-field', polityId: 'polity.neighbor', role: 'field', personnel: 10_000, training: 66, readiness: 72,
    equipment: [{ stockpileId: 'stockpile.playtest.peer-equipment', required: 10, delivered: 10 }], equipmentReadiness: 100,
    supplyDays: 16, cohesion: 65, experience: 12, homeRegionId: 'region.neighbor', mission: 'deny-border-route',
  };
  state = installCivilizationSystems(state, {
    logistics: { freightCapacity: 72, militaryDemand: 28, civilianDemand: 44, redundancy: 62, disruption: 6 },
    economy: { output: 100, revenue: 70, militaryShare: 0.22, civilianShare: 0.28, reconstructionShare: 0.22, researchShare: 0.12, logisticsShare: 0.16 },
    politics: { legitimacy: 70, warSupport: 56, eliteCohesion: 64, regionalCompliance: 72, polarization: 22, emergencyPower: 12, protestPressure: 16 },
    maritime: { merchantShipping: 62, escortCapacity: 30, portCapacity: 55, routeSecurity: 78, navalReadiness: 76 },
    aerospace: { combatAircraft: 52, transportAircraft: 20, aircraftReadiness: 80, airDefense: 52, missileStockpile: 24, missileReliability: 76, airSuperiority: 35, fuelAvailability: 84, strategicStrikeRisk: 8 },
    satellites: { launchCapacity: 2, reconnaissanceSatellites: 2, communicationSatellites: 1, weatherSatellites: 1, orbitalCoverage: 45, reliability: 84, launchFailureRisk: 16, groundStationCapacity: 78 },
    globalUnification: { independentBlocs: 2, controlledTerritoryRatio: 0.78, integratedPopulationRatio: 0.72, commonInstitutionScore: 56, externalRecognition: 58, resistancePressure: 38, sharedInfrastructure: 48, stage: 'contestedOrder' },
  });

  const campaign: CampaignState = {
    id: 'campaign.final-corridor', theatreId: 'theatre.border-sea', attackerPolityId: 'polity.player', defenderPolityId: 'polity.neighbor',
    attackerFormationIds: ['formation.r28b.border-guard', 'formation.r29a.mobile-reserve'], defenderFormationIds: ['formation.playtest.peer-field'],
    objective: 'forceNegotiation', status: 'active', dayStarted: state.calendar.day, elapsedDays: 0, supplyDemand: 44, intelligence: 62,
    attackerPressure: 50, defenderDepth: 58, control: 52, attackerExhaustion: 0, defenderExhaustion: 0,
    attackerPersonnelLosses: 0, defenderPersonnelLosses: 0, equipmentLosses: 0, civilianImpact: 3, infrastructureDamage: 2, stopAtExhaustion: 72,
  };
  const occupation: OccupationState = {
    id: 'occupation.final-bloc', polityId: 'polity.player', regionId: 'region.neighbor', security: 32, resistance: 58, registry: 12,
    services: 15, justice: 8, localCooperation: 18, fiscalIntegration: 0, reconstruction: 8, garrisonDemand: 20, serviceDemand: 28,
    coercion: 30, civilianTrust: 20, displacedPopulation: 18_000, dailyCost: 0, status: 'militaryControl',
  };
  state = createCampaign(state, campaign);
  state = createOccupation(state, occupation);
  state = createDiplomaticIssue(state, {
    id: 'issue.final-order', actorIds: ['polity.player', 'polity.neighbor'], kind: 'security', importance: 65,
    tension: 55, grievance: 45, status: 'open',
  });
  state = createNegotiation(state, {
    id: 'negotiation.final-order', issueId: 'issue.final-order', proposerId: 'polity.player', counterpartId: 'polity.neighbor',
    demandLevel: 22, concessionValue: 42, militaryLeverage: 22, economicPressure: 15, credibility: 80, acceptance: 0, status: 'active',
  });
  const systems = state.civilizationSystems!;
  systems.events['event.returning-families'] = {
    id: 'event.returning-families', title: '海峡东岸的返乡家庭', category: 'social', triggeredDay: state.calendar.day,
    summary: '停火迹象出现后，第一批流离家庭要求返回尚未完成登记和排雷的社区。地方议事会希望立即开放，安全部门要求继续封锁。',
    status: 'active', optionIds: ['event-option.phased-return', 'event-option.security-delay'],
  };
  systems.eventOptions['event-option.phased-return'] = {
    id: 'event-option.phased-return', title: '开放分阶段返乡', summary: '投入重建资金，由地方议事会、医疗队与安全人员共同组织返乡。',
    legitimacyDelta: 3, institutionDelta: 2, resistanceDelta: -4, debtDelta: 3,
    factionSatisfaction: { 'faction.regions': 8, 'faction.workers': 4, 'faction.security': -3 },
  };
  systems.eventOptions['event-option.security-delay'] = {
    id: 'event-option.security-delay', title: '延长安全封锁', summary: '暂缓返乡，优先完成清查与军事管制。',
    legitimacyDelta: -2, resistanceDelta: 3,
    factionSatisfaction: { 'faction.security': 7, 'faction.regions': -8, 'faction.workers': -3 },
  };
  systems.situations['situation.final-region-transition'] = {
    id: 'situation.final-region-transition', title: '最后地区的制度过渡', category: 'political',
    summary: '临时军事管制必须逐步移交给登记、司法、公共服务和地方代表机构。', progress: 18, pressure: 46, status: 'developing',
    linkedEventId: 'event.returning-families',
  };
  systems.organizations['organization.reconstruction-compact'] = {
    id: 'organization.reconstruction-compact', name: '跨海峡重建与通信共同体', memberPolityIds: ['polity.player', 'polity.neighbor'],
    cohesion: 48, legitimacy: 56, commonBudget: 24, rule: 'consensus',
  };
  const projects: CooperationProjectState[] = [
    { id: 'cooperation.shared-communications', organizationId: 'organization.reconstruction-compact', title: '共享卫星通信与灾害预警', kind: 'space', contribution: 18, partnerContribution: 12, progress: 0, requiredProgress: 100, status: 'proposed' },
    { id: 'cooperation.strait-reconstruction', organizationId: 'organization.reconstruction-compact', title: '海峡港口与民生走廊修复', kind: 'infrastructure', contribution: 20, partnerContribution: 14, progress: 0, requiredProgress: 100, status: 'proposed' },
    { id: 'cooperation.public-health', organizationId: 'organization.reconstruction-compact', title: '跨境公共卫生与返乡协作', kind: 'relief', contribution: 14, partnerContribution: 14, progress: 0, requiredProgress: 80, status: 'proposed' },
  ];
  for (const project of projects) systems.cooperationProjects[project.id] = project;
  return advanceNationKernelDays(state, 1);
}
