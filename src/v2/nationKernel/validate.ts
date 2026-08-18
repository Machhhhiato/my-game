import type { NationKernelState } from './types';
import { scopeKey } from './simulation';
export interface KernelValidation { ok: boolean; errors: string[]; }
function operationCreates(state: NationKernelState, kind: 'design' | 'stockpile' | 'facility' | 'fleet', id: string): boolean {
  return Object.values(state.operations).some((operation) => operation.effects.some((effect) => {
    if (kind === 'design') return effect.kind === 'design' && effect.design.id === id;
    if (kind === 'stockpile') return effect.kind === 'stockpile' && effect.stockpile.id === id;
    if (kind === 'facility') return effect.kind === 'facility' && effect.facility.id === id;
    return effect.kind === 'fleet' && effect.fleetId === id;
  }));
}
export function validateNationKernel(state: NationKernelState): KernelValidation {
  const errors: string[] = []; if (state.version !== 1) errors.push('unsupported-version'); if (!state.polities[state.playerPolityId]) errors.push('missing-player-polity');
  for (const [key, quantities] of Object.entries(state.quantities)) for (const [id, value] of Object.entries(quantities)) { const definition = state.quantityDefinitions[id]; if (!definition) errors.push(`unknown-quantity:${key}.${id}`); if (!Number.isFinite(value.current) || value.current < (definition?.min ?? 0) || (definition?.max != null && value.current > definition.max)) errors.push(`invalid-quantity:${key}.${id}`); }
  for (const operation of Object.values(state.operations)) {
    if (!state.polities[operation.polityId]) errors.push(`unknown-operation-polity:${operation.id}`);
    if (!state.quantities[scopeKey(operation.scope)] && operation.scope.kind !== 'polity') errors.push(`unknown-operation-scope:${operation.id}`);
    for (const demand of operation.startDemands) if (!state.quantityDefinitions[demand.quantityId]) errors.push(`unknown-operation-demand:${operation.id}:${demand.quantityId}`);
    for (const demand of operation.startStockpileDemands ?? []) if ((!state.stockpiles[demand.stockpileId] && !operationCreates(state, 'stockpile', demand.stockpileId)) || demand.amount <= 0) errors.push(`unknown-operation-stockpile-demand:${operation.id}:${demand.stockpileId}`);
    for (const effect of operation.effects) {
      if (effect.kind === 'quantity' && !state.quantityDefinitions[effect.quantityId]) errors.push(`unknown-operation-effect-quantity:${operation.id}:${effect.quantityId}`);
      if (effect.kind === 'capability' && !state.polities[effect.targetPolityId]) errors.push(`unknown-operation-effect-polity:${operation.id}:${effect.targetPolityId}`);
      if (effect.kind === 'region' && !state.polities[effect.region.polityId]) errors.push(`unknown-operation-effect-region-owner:${operation.id}:${effect.region.id}`);
      if (effect.kind === 'region') for (const cityId of effect.reassignCityIds ?? []) {
        const city = state.cities[cityId];
        if (city == null) errors.push(`unknown-operation-effect-region-city:${operation.id}:${cityId}`);
        else if (city.polityId !== effect.region.polityId) errors.push(`foreign-operation-effect-region-city:${operation.id}:${cityId}`);
      }
      if (effect.kind === 'polityProfile' && !state.polities[effect.polityId]) errors.push(`unknown-operation-effect-profile-polity:${operation.id}:${effect.polityId}`);
      if (effect.kind === 'facility' && !state.polities[effect.facility.polityId]) errors.push(`unknown-operation-effect-facility-owner:${operation.id}:${effect.facility.id}`);
      if (effect.kind === 'facility' && effect.facility.hostCityId != null && !state.cities[effect.facility.hostCityId]) errors.push(`unknown-operation-effect-facility-city:${operation.id}:${effect.facility.hostCityId}`);
      if (effect.kind === 'network' && !state.polities[effect.network.polityId]) errors.push(`unknown-operation-effect-network-owner:${operation.id}:${effect.network.id}`);
      if (effect.kind === 'design' && !state.polities[effect.design.polityId]) errors.push(`unknown-operation-effect-design-owner:${operation.id}:${effect.design.id}`);
      if (effect.kind === 'productionLine' && (!state.polities[effect.productionLine.polityId] || (!state.facilities[effect.productionLine.facilityId] && !operationCreates(state, 'facility', effect.productionLine.facilityId)) || (!state.designs[effect.productionLine.designId] && !operationCreates(state, 'design', effect.productionLine.designId)) || (!state.stockpiles[effect.productionLine.stockpileId] && !operationCreates(state, 'stockpile', effect.productionLine.stockpileId)))) errors.push(`invalid-operation-effect-production-line:${operation.id}:${effect.productionLine.id}`);
      if (effect.kind === 'stockpile' && !state.polities[effect.stockpile.polityId]) errors.push(`unknown-operation-effect-stockpile-owner:${operation.id}:${effect.stockpile.id}`);
      if (effect.kind === 'formation' && !state.polities[effect.formation.polityId]) errors.push(`unknown-operation-effect-formation-owner:${operation.id}:${effect.formation.id}`);
      if (effect.kind === 'vessel' && (!state.polities[effect.vessel.polityId] || (!state.designs[effect.vessel.designId] && !operationCreates(state, 'design', effect.vessel.designId)) || (effect.fleetId != null && !state.fleets[effect.fleetId] && !operationCreates(state, 'fleet', effect.fleetId)))) errors.push(`invalid-operation-effect-vessel:${operation.id}:${effect.vessel.id}`);
      if (effect.kind === 'spaceAsset' && (!state.polities[effect.spaceAsset.polityId] || (effect.spaceAsset.designId != null && !state.designs[effect.spaceAsset.designId] && !operationCreates(state, 'design', effect.spaceAsset.designId)))) errors.push(`invalid-operation-effect-space-asset:${operation.id}:${effect.spaceAsset.id}`);
      if (effect.kind === 'spaceMission' && (!state.polities[effect.spaceMission.polityId] || (!state.facilities[effect.spaceMission.originFacilityId] && !operationCreates(state, 'facility', effect.spaceMission.originFacilityId)) || (effect.spaceMission.vehicleDesignId != null && !state.designs[effect.spaceMission.vehicleDesignId] && !operationCreates(state, 'design', effect.spaceMission.vehicleDesignId)))) errors.push(`invalid-operation-effect-space-mission:${operation.id}:${effect.spaceMission.id}`);
      if (effect.kind === 'fleet' && !state.fleets[effect.fleetId]) errors.push(`unknown-operation-effect-fleet:${operation.id}:${effect.fleetId}`);
      if (effect.kind === 'fleet') for (const vessel of effect.vesselReadiness ?? []) if (!state.fleets[effect.fleetId]?.vessels[vessel.vesselId]) errors.push(`unknown-operation-effect-vessel:${operation.id}:${effect.fleetId}:${vessel.vesselId}`);
    }
  }
  for (const metro of Object.values(state.metros)) { if (!state.cities[metro.coreCityId]) errors.push(`unknown-metro-core:${metro.id}`); for (const cityId of metro.memberCityIds) if (!state.cities[cityId]) errors.push(`unknown-metro-city:${metro.id}:${cityId}`); }
  for (const region of Object.values(state.regions)) { if (!state.polities[region.polityId]) errors.push(`unknown-region-polity:${region.id}`); for (const cityId of region.cityIds) if (!state.cities[cityId]) errors.push(`unknown-region-city:${region.id}:${cityId}`); }
  for (const city of Object.values(state.cities)) for (const facilityId of city.facilityIds) {
    const facility = state.facilities[facilityId];
    if (!facility) errors.push(`unknown-city-facility:${city.id}:${facilityId}`);
    else if (facility.polityId !== city.polityId) errors.push(`foreign-city-facility:${city.id}:${facilityId}`);
    else if (facility.hostCityId != null && facility.hostCityId !== city.id) errors.push(`mismatched-city-facility:${city.id}:${facilityId}`);
  }
  for (const facility of Object.values(state.facilities)) {
    if (!state.polities[facility.polityId]) errors.push(`unknown-facility-polity:${facility.id}`);
    if (facility.hostCityId != null && !state.cities[facility.hostCityId]) errors.push(`unknown-facility-city:${facility.id}:${facility.hostCityId}`);
  }
  for (const network of Object.values(state.networks)) {
    if (!state.polities[network.polityId]) errors.push(`unknown-network-polity:${network.id}`);
    for (const endpointId of network.endpointIds) if (!state.cities[endpointId] && !state.facilities[endpointId]) errors.push(`unknown-network-endpoint:${network.id}:${endpointId}`);
  }
  for (const design of Object.values(state.designs)) { if (!state.polities[design.polityId]) errors.push(`unknown-design-polity:${design.id}`); for (const capabilityId of design.requiredCapabilityIds) if (!state.polities[design.polityId]?.capabilities[capabilityId]) errors.push(`unknown-design-capability:${design.id}:${capabilityId}`); }
  for (const line of Object.values(state.productionLines)) { if (!state.polities[line.polityId] || !state.facilities[line.facilityId] || !state.designs[line.designId] || !state.stockpiles[line.stockpileId] || line.dailyOutput < 0 || line.efficiency < 0 || line.efficiency > 1) errors.push(`invalid-production-line:${line.id}`); }
  for (const stockpile of Object.values(state.stockpiles)) { if (!state.polities[stockpile.polityId] || stockpile.quantity < 0 || stockpile.reserved < 0 || (stockpile.capacity != null && stockpile.quantity > stockpile.capacity) || (stockpile.designId != null && !state.designs[stockpile.designId])) errors.push(`invalid-stockpile:${stockpile.id}`); }
  for (const formation of Object.values(state.formations)) { if (!state.polities[formation.polityId] || formation.readiness < 0 || formation.readiness > 100 || formation.training < 0 || formation.training > 100 || (formation.homeRegionId != null && !state.regions[formation.homeRegionId])) errors.push(`invalid-formation:${formation.id}`); for (const equipment of formation.equipment) if (!state.stockpiles[equipment.stockpileId] || equipment.required <= 0) errors.push(`invalid-formation-equipment:${formation.id}:${equipment.stockpileId}`); }
  for (const vessel of Object.values(state.vessels)) { if (!state.polities[vessel.polityId] || !state.designs[vessel.designId] || vessel.readiness < 0 || vessel.readiness > 100 || (vessel.homeFacilityId != null && !state.facilities[vessel.homeFacilityId])) errors.push(`invalid-vessel:${vessel.id}`); }
  for (const relation of Object.values(state.relations)) if (!state.polities[relation.actorAId] || !state.polities[relation.actorBId]) errors.push(`unknown-relation-actor:${relation.id}`);
  for (const fleet of Object.values(state.fleets)) { if (!state.polities[fleet.polityId]) errors.push(`unknown-fleet-polity:${fleet.id}`); for (const vessel of Object.values(fleet.vessels)) if (vessel.ready + vessel.repairing > vessel.total) errors.push(`invalid-fleet-readiness:${fleet.id}`); for (const vesselId of fleet.vesselIds ?? []) if (!state.vessels[vesselId]) errors.push(`unknown-fleet-vessel:${fleet.id}:${vesselId}`); }
  for (const theatre of Object.values(state.theatres)) { if (!state.polities[theatre.polityId] || !state.polities[theatre.opponentPolityId]) errors.push(`unknown-theatre-polity:${theatre.id}`); for (const regionId of theatre.regionIds) if (!state.regions[regionId]) errors.push(`unknown-theatre-region:${theatre.id}:${regionId}`); }
  for (const asset of Object.values(state.spaceAssets)) if (!state.polities[asset.polityId] || (asset.designId != null && !state.designs[asset.designId])) errors.push(`invalid-space-asset:${asset.id}`);
  for (const mission of Object.values(state.spaceMissions)) if (!state.polities[mission.polityId] || !state.facilities[mission.originFacilityId] || (mission.vehicleDesignId != null && !state.designs[mission.vehicleDesignId])) errors.push(`invalid-space-mission:${mission.id}`);
  for (const agreement of Object.values(state.agreements)) { if (agreement.actorIds.length < 2 || agreement.actorIds.some((id) => !state.polities[id])) errors.push(`invalid-agreement:${agreement.id}`); }
  return { ok: errors.length === 0, errors };
}
