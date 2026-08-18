import type { EffectSpec, KernelCalendar, KernelId, NationKernelState, OperationState, PolityState, QuantityValue, ScopeRef } from './types';

const PHASES: KernelCalendar['phase'][] = ['early', 'mid', 'late'];
const clamp = (value: number, min = 0, max = Number.POSITIVE_INFINITY) => Math.max(min, Math.min(max, value));
const round = (value: number, precision = 2) => Number(value.toFixed(precision));
const clone = (state: NationKernelState): NationKernelState => structuredClone(state) as NationKernelState;
export const scopeKey = (scope: ScopeRef): string => `${scope.kind}:${scope.id}`;
function calendarFor(day: number): KernelCalendar { return { day, year: Math.floor(day / 360) + 1, month: Math.floor(day / 30) % 12 + 1, phase: PHASES[Math.floor(day / 10) % 3] }; }
function record(state: NationKernelState, sourceId: KernelId, target: string, before: number | string, after: number | string, reasonKey: string): void { if (before !== after) state.ledger.push({ day: state.calendar.day, sourceId, target, before, after, reasonKey }); }
function quantity(state: NationKernelState, target: ScopeRef, quantityId: KernelId): QuantityValue | null { return state.quantities[scopeKey(target)]?.[quantityId] ?? null; }
function applyQuantity(state: NationKernelState, effect: Extract<EffectSpec, { kind: 'quantity' }>, sourceId: KernelId): void {
  const value = quantity(state, effect.target, effect.quantityId); if (value == null) return;
  const definition = state.quantityDefinitions[effect.quantityId]; const before = value.current;
  const raw = effect.operation === 'add' ? before + effect.value : effect.operation === 'multiply' ? before * effect.value : effect.value;
  value.current = Number(clamp(raw, definition?.min ?? 0, definition?.max).toFixed(definition?.precision ?? 2)); value.updatedDay = state.calendar.day;
  if (!value.sourceIds.includes(sourceId)) value.sourceIds.push(sourceId); record(state, sourceId, `${scopeKey(effect.target)}.${effect.quantityId}`, before, value.current, effect.reasonKey);
}
function applyEffect(state: NationKernelState, effect: EffectSpec, sourceId: KernelId): void {
  if (effect.kind === 'quantity') applyQuantity(state, effect, sourceId);
  if (effect.kind === 'capability' && state.polities[effect.targetPolityId]?.capabilities) {
    const capabilities = state.polities[effect.targetPolityId].capabilities;
    const before = capabilities[effect.capability.id]?.maturity ?? 'absent';
    capabilities[effect.capability.id] = effect.capability;
    record(state, sourceId, `polity:${effect.targetPolityId}.capability.${effect.capability.id}`, before, effect.capability.maturity, effect.reasonKey);
  }
  if (effect.kind === 'city' && !state.cities[effect.city.id]) {
    const city = structuredClone(effect.city);
    state.cities[city.id] = city;
    const region = state.regions[city.regionId];
    if (region != null && !region.cityIds.includes(city.id)) region.cityIds.push(city.id);
    if (city.metroId != null && state.metros[city.metroId] != null && !state.metros[city.metroId].memberCityIds.includes(city.id)) state.metros[city.metroId].memberCityIds.push(city.id);
    if (effect.initialQuantities != null) state.quantities[`city:${city.id}`] = Object.fromEntries(Object.entries(effect.initialQuantities).map(([id, current]) => [id, { current, updatedDay: state.calendar.day, sourceIds: [sourceId] }]));
    record(state, sourceId, `city:${city.id}.status`, 'absent', city.stage, effect.reasonKey);
  }
  if (effect.kind === 'populationTransfer') {
    const from = state.cities[effect.fromCityId]; const to = state.cities[effect.toCityId];
    if (from != null && to != null && effect.amount > 0 && from.population >= effect.amount) {
      const before = `${from.population}/${to.population}`;
      from.population -= effect.amount; to.population += effect.amount;
      record(state, sourceId, `city:${from.id}->${to.id}.population`, before, `${from.population}/${to.population}`, effect.reasonKey);
    }
  }
  if (effect.kind === 'lifecycle' && state.facilities[effect.facilityId]) { const facility = state.facilities[effect.facilityId]; const before = facility.lifecycle.status; facility.lifecycle.status = effect.status; record(state, sourceId, `facility:${facility.id}.status`, before, effect.status, effect.reasonKey); }
  if (effect.kind === 'facility' && !state.facilities[effect.facility.id]) {
    const facility = structuredClone(effect.facility);
    state.facilities[facility.id] = facility;
    if (facility.hostCityId != null && state.cities[facility.hostCityId] && !state.cities[facility.hostCityId].facilityIds.includes(facility.id)) state.cities[facility.hostCityId].facilityIds.push(facility.id);
    record(state, sourceId, `facility:${facility.id}.status`, 'absent', facility.lifecycle.status, effect.reasonKey);
  }
  if (effect.kind === 'network' && !state.networks[effect.network.id]) {
    const network = structuredClone(effect.network);
    state.networks[network.id] = network;
    record(state, sourceId, `network:${network.id}.status`, 'absent', network.lifecycle.status, effect.reasonKey);
  }
  if (effect.kind === 'fleet' && state.fleets[effect.fleetId]) {
    const fleet = state.fleets[effect.fleetId];
    if (effect.readinessDelta != null) { const before = fleet.readiness; fleet.readiness = round(clamp(before + effect.readinessDelta, 0, 100), 1); record(state, sourceId, `fleet:${fleet.id}.readiness`, before, fleet.readiness, effect.reasonKey); }
    if (effect.supplyDaysDelta != null) { const before = fleet.supplyDays; fleet.supplyDays = round(clamp(before + effect.supplyDaysDelta, 0), 1); record(state, sourceId, `fleet:${fleet.id}.supplyDays`, before, fleet.supplyDays, effect.reasonKey); }
    for (const change of effect.vesselReadiness ?? []) {
      const vessel = fleet.vessels[change.vesselId];
      if (vessel == null) continue;
      const before = `${vessel.ready}/${vessel.repairing}`;
      const ready = clamp(vessel.ready + change.readyDelta, 0, vessel.total);
      const repairing = clamp(vessel.repairing + change.repairingDelta, 0, vessel.total - ready);
      vessel.ready = ready; vessel.repairing = repairing;
      record(state, sourceId, `fleet:${fleet.id}.vessel.${change.vesselId}`, before, `${ready}/${repairing}`, effect.reasonKey);
    }
  }
  if (effect.kind === 'relation' && state.relations[effect.relationId]) { const relation = state.relations[effect.relationId]; const a = relation.trustAtoB; const b = relation.trustBtoA; relation.trustAtoB = round(clamp(a + effect.deltaAtoB, -100, 100)); relation.trustBtoA = round(clamp(b + effect.deltaBtoA, -100, 100)); record(state, sourceId, `relation:${relation.id}.trustAtoB`, a, relation.trustAtoB, effect.reasonKey); record(state, sourceId, `relation:${relation.id}.trustBtoA`, b, relation.trustBtoA, effect.reasonKey); }
}
function activeStaff(state: NationKernelState, polityId: KernelId): number { return Object.values(state.operations).filter((operation) => operation.polityId === polityId && operation.status === 'active').reduce((sum, operation) => sum + operation.staffRequired, 0); }
export function availableWorkforce(state: NationKernelState, polityId: KernelId): number { const polity = state.polities[polityId]; if (polity == null) return 0; const workforce = polity.workforce; return Math.max(0, workforce.healthy - workforce.dependents - workforce.essential - workforce.maintenance - workforce.publicServices - workforce.administration - workforce.defense - activeStaff(state, polityId)); }
function demandsMet(state: NationKernelState, demands: ReadonlyArray<OperationState['startDemands'][number]>): boolean { return demands.every((demand) => (quantity(state, demand.target, demand.quantityId)?.current ?? 0) >= demand.amount); }
function prerequisitesMet(state: NationKernelState, operation: OperationState): boolean {
  const requirements = operation.prerequisites;
  if (requirements == null) return true;
  const capabilities = state.polities[operation.polityId]?.capabilities ?? {};
  return (requirements.capabilityIds ?? []).every((id) => capabilities[id] != null)
    && (requirements.facilityIds ?? []).every((id) => state.facilities[id]?.lifecycle.status === 'operating')
    && (requirements.networkIds ?? []).every((id) => state.networks[id]?.lifecycle.status === 'operating')
    && (requirements.completedOperationIds ?? []).every((id) => state.operations[id]?.status === 'completed');
}
export function startOperation(state: NationKernelState, operationId: KernelId): NationKernelState {
  const operation = state.operations[operationId]; if (operation == null || operation.status !== 'planned' || !prerequisitesMet(state, operation) || !demandsMet(state, operation.startDemands) || availableWorkforce(state, operation.polityId) < operation.staffRequired) return state;
  const next = clone(state); const active = next.operations[operationId];
  for (const demand of active.startDemands) applyEffect(next, { kind: 'quantity', timing: 'onStart', target: demand.target, quantityId: demand.quantityId, operation: 'add', value: -demand.amount, reasonKey: 'operation.input.reserved' }, active.id);
  active.status = 'active'; active.startedDay = next.calendar.day; record(next, active.id, `operation:${active.id}.status`, 'planned', 'active', 'operation.started'); active.effects.filter((effect) => effect.timing === 'onStart').forEach((effect) => applyEffect(next, effect, active.id)); return next;
}
function advanceOperation(state: NationKernelState, operation: OperationState): void {
  if (operation.status !== 'active') return;
  operation.elapsedDays += 1; operation.effects.filter((effect) => effect.timing === 'perDay').forEach((effect) => applyEffect(state, effect, operation.id));
  if (operation.workRequired > 0) operation.workDone = Math.min(operation.workRequired, operation.workDone + 1);
  const complete = (operation.workRequired > 0 && operation.workDone >= operation.workRequired) || (operation.durationDays != null && operation.elapsedDays >= operation.durationDays);
  if (!complete) return;
  operation.status = 'completed'; operation.completedDay = state.calendar.day; record(state, operation.id, `operation:${operation.id}.status`, 'active', 'completed', 'operation.completed'); operation.effects.filter((effect) => effect.timing === 'onComplete').forEach((effect) => applyEffect(state, effect, operation.id));
}
function advanceFacilities(state: NationKernelState): void { for (const facility of Object.values(state.facilities)) { if (facility.lifecycle.status !== 'operating') continue; facility.recurringEffects.filter((effect) => effect.timing === 'perDay').forEach((effect) => applyEffect(state, effect, facility.id)); if (facility.maintenanceStaffRequired > 0 && state.polities[facility.polityId]?.workforce.maintenance < facility.maintenanceStaffRequired) { facility.lifecycle.maintenanceBacklog += 1; facility.lifecycle.condition = clamp(facility.lifecycle.condition - 0.2, 0, 100); } } }
function advanceRegionalServices(state: NationKernelState): void {
  for (const region of Object.values(state.regions)) {
    const assignments = region.serviceAssignments;
    if (assignments == null) continue;
    for (const cityId of region.cityIds) {
      const quantities = state.quantities[`city:${cityId}`];
      if (quantities == null) continue;
      const assigned = assignments[cityId] ?? 0;
      const target = clamp(assigned * 25, 0, 100);
      for (const quantityId of ['service.waterCoverage', 'service.healthCoverage']) {
        const value = quantities[quantityId];
        if (value == null) continue;
        const before = value.current;
        value.current = round(before + Math.sign(target - before) * Math.min(2, Math.abs(target - before)), 1);
        value.updatedDay = state.calendar.day;
        record(state, region.id, `city:${cityId}.${quantityId}`, before, value.current, 'regional.service.dispatch');
      }
    }
  }
}
export function changeRegionalServiceAssignment(state: NationKernelState, regionId: KernelId, cityId: KernelId, delta: number): NationKernelState {
  const region = state.regions[regionId];
  if (region == null || !region.cityIds.includes(cityId) || delta === 0) return state;
  const player = state.polities[region.polityId]; const assignments = region.serviceAssignments ?? {};
  const current = assignments[cityId] ?? 0; const used = Object.values(assignments).reduce((sum, value) => sum + value, 0);
  if (delta < 0 && current < Math.abs(delta)) return state;
  if (delta > 0 && (player?.workforce.publicServices ?? 0) - used < delta) return state;
  const next = clone(state); const nextRegion = next.regions[regionId];
  nextRegion.serviceAssignments = { ...(nextRegion.serviceAssignments ?? {}), [cityId]: current + delta };
  record(next, regionId, `region:${regionId}.service.${cityId}`, current, current + delta, 'regional.service.reassigned');
  return next;
}
export function rebuildMetroSummaries(state: NationKernelState): void { for (const metro of Object.values(state.metros)) metro.totalPopulation = metro.memberCityIds.reduce((sum, cityId) => sum + (state.cities[cityId]?.population ?? 0), 0); }
export function advanceNationKernelDays(state: NationKernelState, days: number): NationKernelState { let next = state; for (let i = 0; i < days; i += 1) { next = clone(next); next.calendar = calendarFor(next.calendar.day + 1); advanceFacilities(next); advanceRegionalServices(next); Object.values(next.operations).forEach((operation) => advanceOperation(next, operation)); rebuildMetroSummaries(next); next.observations = next.observations.filter((observation) => next.calendar.day - observation.observedDay <= 360); next.ledger = next.ledger.slice(-500); } return next; }
export function polity(state: NationKernelState, id: KernelId): PolityState | null { return state.polities[id] ?? null; }
