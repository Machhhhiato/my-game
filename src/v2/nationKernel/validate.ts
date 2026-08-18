import type { NationKernelState } from './types';
import { scopeKey } from './simulation';
export interface KernelValidation { ok: boolean; errors: string[]; }
export function validateNationKernel(state: NationKernelState): KernelValidation {
  const errors: string[] = []; if (state.version !== 1) errors.push('unsupported-version'); if (!state.polities[state.playerPolityId]) errors.push('missing-player-polity');
  for (const [key, quantities] of Object.entries(state.quantities)) for (const [id, value] of Object.entries(quantities)) { const definition = state.quantityDefinitions[id]; if (!definition) errors.push(`unknown-quantity:${key}.${id}`); if (!Number.isFinite(value.current) || value.current < (definition?.min ?? 0) || (definition?.max != null && value.current > definition.max)) errors.push(`invalid-quantity:${key}.${id}`); }
  for (const operation of Object.values(state.operations)) {
    if (!state.polities[operation.polityId]) errors.push(`unknown-operation-polity:${operation.id}`);
    if (!state.quantities[scopeKey(operation.scope)] && operation.scope.kind !== 'polity') errors.push(`unknown-operation-scope:${operation.id}`);
    for (const demand of operation.startDemands) if (!state.quantityDefinitions[demand.quantityId]) errors.push(`unknown-operation-demand:${operation.id}:${demand.quantityId}`);
    for (const effect of operation.effects) {
      if (effect.kind === 'quantity' && !state.quantityDefinitions[effect.quantityId]) errors.push(`unknown-operation-effect-quantity:${operation.id}:${effect.quantityId}`);
      if (effect.kind === 'capability' && !state.polities[effect.targetPolityId]) errors.push(`unknown-operation-effect-polity:${operation.id}:${effect.targetPolityId}`);
      if (effect.kind === 'facility' && !state.polities[effect.facility.polityId]) errors.push(`unknown-operation-effect-facility-owner:${operation.id}:${effect.facility.id}`);
      if (effect.kind === 'facility' && effect.facility.hostCityId != null && !state.cities[effect.facility.hostCityId]) errors.push(`unknown-operation-effect-facility-city:${operation.id}:${effect.facility.hostCityId}`);
      if (effect.kind === 'network' && !state.polities[effect.network.polityId]) errors.push(`unknown-operation-effect-network-owner:${operation.id}:${effect.network.id}`);
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
  for (const relation of Object.values(state.relations)) if (!state.polities[relation.actorAId] || !state.polities[relation.actorBId]) errors.push(`unknown-relation-actor:${relation.id}`);
  for (const fleet of Object.values(state.fleets)) { if (!state.polities[fleet.polityId]) errors.push(`unknown-fleet-polity:${fleet.id}`); for (const vessel of Object.values(fleet.vessels)) if (vessel.ready + vessel.repairing > vessel.total) errors.push(`invalid-fleet-readiness:${fleet.id}`); }
  for (const theatre of Object.values(state.theatres)) { if (!state.polities[theatre.polityId] || !state.polities[theatre.opponentPolityId]) errors.push(`unknown-theatre-polity:${theatre.id}`); for (const regionId of theatre.regionIds) if (!state.regions[regionId]) errors.push(`unknown-theatre-region:${theatre.id}:${regionId}`); }
  return { ok: errors.length === 0, errors };
}
