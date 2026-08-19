import { createNationKernelFixture } from '../nationKernel/fixture';
import { rebuildMetroSummaries } from '../nationKernel/simulation';
import type { NationKernelState } from '../nationKernel/types';
import { installRegionalCampaignContent } from './regionalCampaign';
import { textAutomationUnlocked } from './simulation';
import { geoReferenceForCoordinateRef } from './strategicMapModel';
import type { TextIdleState } from './types';

/**
 * R21 的过渡适配器：首阶段文字共同体达到稳定聚居后，才生成国家内核的区域网络状态。
 * 这里不复制 UI 或剧情，只迁移人口、储备、能力、设施与时间；后续区域/统一内容都在 NationKernel 上运行。
 */
export function canEnterRegionalCampaign(state: TextIdleState): boolean {
  return state.developmentStage === 'settled' && textAutomationUnlocked(state);
}

export function createRegionalNationFromTextIdle(state: TextIdleState): NationKernelState | null {
  if (!canEnterRegionalCampaign(state)) return null;
  const next = createNationKernelFixture(state.seed);
  const playerId = next.playerPolityId;
  const player = next.polities[playerId];
  const core = next.cities['city.core'];
  const region = next.regions['region.home'];
  const metro = next.metros['metro.home'];

  delete next.polities['polity.peer'];
  delete next.regions['region.peer'];
  delete next.relations['relation.player-peer'];
  delete next.cities['city.satellite'];
  delete next.operations['operation.research'];
  delete next.operations['operation.policy'];

  next.calendar = { day: state.day, year: state.calendar.year, month: state.calendar.month, phase: state.calendar.phase };
  core.geoRef = geoReferenceForCoordinateRef(`home:${state.campaignTemplateId}:${state.seed}`);
  const workforce = Math.max(0, state.population - state.workforce.dependents);
  player.templateId = 'template.regional-network';
  player.archetype = 'regionalState';
  player.simulationTier = 'regional';
  player.population = { residents: state.population, temporary: 0, dependents: state.workforce.dependents, healthyWorkforce: workforce, migrationPressure: 0, housingPressure: Math.max(0, 30 - state.metrics.livelihood) };
  player.workforce = { healthy: workforce, dependents: state.workforce.dependents, essential: state.workforce.essentialStaff, maintenance: Math.max(1, state.workforce.projectStaff), publicServices: state.workforce.civicAndSecurityStaff, administration: Math.max(1, state.workforce.policyStaff), defense: 1 };
  player.cohesion = Math.round(state.metrics.stability);
  player.strategicIntent = ['regional-network', 'integrate-services'];
  player.capabilities = Object.fromEntries(state.completedTechs.map((id) => [`capability.${id}`, { id: `capability.${id}`, maturity: textAutomationUnlocked(state) ? 'replicable' : 'prototype', sourceIds: [id] }]));

  region.cityIds = ['city.core'];
  region.ruralPopulation = 0;
  region.integration = { registry: Math.round(state.metrics.administration), services: Math.round(state.metrics.livelihood), justice: Math.round(state.metrics.stability * .55), security: Math.round(state.metrics.military), executionQuality: Math.round((state.metrics.industry + state.metrics.research) / 2) };
  region.serviceAssignments = { 'city.core': player.workforce.publicServices };
  core.population = state.population;
  core.facilityIds = state.completedProjects.map((id) => `facility.${id}`);
  metro.memberCityIds = ['city.core'];
  metro.sharedNetworkIds = [];
  for (const id of state.completedProjects) {
    const facilityId = `facility.${id}`;
    const facilityFact = state.facilityFacts?.find((entry) => entry.projectId === id);
    if (next.facilities[facilityId] == null) next.facilities[facilityId] = {
      ...next.facilities['facility.water'], id: facilityId, moduleId: `module.${id}`, hostCityId: 'city.core',
      geoRef: facilityFact ? geoReferenceForCoordinateRef(facilityFact.coordinateRef) : core.geoRef,
      lifecycle: { status: 'operating', condition: 100, maintenanceBacklog: 0, startedDay: facilityFact?.startedOn ?? state.day }, recurringEffects: [],
    };
  }
  delete next.facilities['facility.water'];
  const polityQuantities = next.quantities[`polity:${playerId}`];
  polityQuantities['provision.waterDays'].current = Number(((state.reserves.water + state.reserves.food + state.reserves.repair) / 3).toFixed(2));
  polityQuantities['construction.ldu'].current = Number(state.construction.stock.toFixed(2));
  polityQuantities['capacity.research'].current = Math.round(state.metrics.research);
  rebuildMetroSummaries(next);
  return installRegionalCampaignContent(next);
}
