import type { EffectSpec, IndustrialStrategyState, KernelCalendar, KernelId, NationKernelState, OperationState, PolityState, ProductionLineState, QuantityValue, RegionState, ScopeRef, TerritoryState } from './types';
import { advanceCivilizationSystemsDay, externalDirectionRuntime, industrialLogisticsDirectionRuntime } from './civilizationSystems';

const PHASES: KernelCalendar['phase'][] = ['early', 'mid', 'late'];
const clamp = (value: number, min = 0, max = Number.POSITIVE_INFINITY) => Math.max(min, Math.min(max, value));
const round = (value: number, precision = 2) => Number(value.toFixed(precision));
const clone = (state: NationKernelState): NationKernelState => structuredClone(state) as NationKernelState;
export function calculateRetooledEfficiency(currentEfficiency: number, sameProductionFamily: boolean, strategy: NationKernelState['industrialStrategy']): number {
  const retention = clamp(strategy?.conversionRetention ?? 0.35, 0, 1);
  const effectiveRetention = sameProductionFamily ? Math.max(retention, 0.65) : retention;
  return round(clamp(currentEfficiency, 0, 1) * effectiveRetention, 3);
}
function allocatedFactoryUnits(state: NationKernelState, facilityId: KernelId, excludedLineId?: KernelId): number {
  return Object.values(state.productionLines).filter((line) => line.facilityId === facilityId && line.id !== excludedLineId && line.status !== 'paused').reduce((total, line) => total + (line.assignedFactoryUnits ?? line.capacityRequired), 0);
}
export function createProductionLine(state: NationKernelState, line: ProductionLineState): NationKernelState {
  const facility = state.facilities[line.facilityId];
  const assigned = line.assignedFactoryUnits ?? line.capacityRequired;
  if (state.productionLines[line.id] != null || facility?.lifecycle.status !== 'operating' || facility.industrialCapacity == null || state.designs[line.designId]?.status !== 'standardized' || state.stockpiles[line.stockpileId]?.designId !== line.designId || assigned < 0 || allocatedFactoryUnits(state, line.facilityId) + assigned > facility.industrialCapacity.usableFactoryUnits) return state;
  const next = clone(state); next.productionLines[line.id] = structuredClone(line); record(next, line.id, `productionLine:${line.id}.status`, 'absent', line.status, 'productionLine.created'); return next;
}
export function assignProductionFactories(state: NationKernelState, lineId: KernelId, assignedFactoryUnits: number): NationKernelState {
  const line = state.productionLines[lineId]; const facility = line == null ? undefined : state.facilities[line.facilityId];
  if (line == null || facility?.industrialCapacity == null || !Number.isInteger(assignedFactoryUnits) || assignedFactoryUnits < 0 || allocatedFactoryUnits(state, line.facilityId, line.id) + (line.status === 'paused' ? 0 : assignedFactoryUnits) > facility.industrialCapacity.usableFactoryUnits) return state;
  const next = clone(state); const target = next.productionLines[lineId]; const before = target.assignedFactoryUnits ?? target.capacityRequired; target.assignedFactoryUnits = assignedFactoryUnits; record(next, lineId, `productionLine:${lineId}.assignedFactoryUnits`, before, assignedFactoryUnits, 'productionLine.factory-allocation'); return next;
}
export function setProductionLinePaused(state: NationKernelState, lineId: KernelId, paused: boolean): NationKernelState {
  const line = state.productionLines[lineId]; if (line == null || line.status === 'retooling') return state;
  const assigned = line.assignedFactoryUnits ?? line.capacityRequired; const facility = state.facilities[line.facilityId];
  if (!paused && (facility?.lifecycle.status !== 'operating' || facility.industrialCapacity == null || allocatedFactoryUnits(state, line.facilityId, line.id) + assigned > facility.industrialCapacity.usableFactoryUnits)) return state;
  const next = clone(state); const target = next.productionLines[lineId]; const before = target.status; target.status = paused ? 'paused' : 'operating'; record(next, lineId, `productionLine:${lineId}.status`, before, target.status, paused ? 'productionLine.paused' : 'productionLine.resumed'); return next;
}
export interface RetoolProductionLineInput { designId: KernelId; stockpileId: KernelId; productionFamilyId: KernelId; baseOutputPerFactory: number; efficiencyCap: number; efficiencyGainPerDay: number; inputAvailability: number; maintenanceLoad: number; baseRetoolingDays?: number; }
export function retoolProductionLine(state: NationKernelState, lineId: KernelId, input: RetoolProductionLineInput): NationKernelState {
  const line = state.productionLines[lineId]; const design = state.designs[input.designId]; const stockpile = state.stockpiles[input.stockpileId];
  if (line == null || line.status === 'retooling' || design?.status !== 'standardized' || stockpile?.designId !== input.designId || [input.baseOutputPerFactory, input.efficiencyCap, input.efficiencyGainPerDay, input.inputAvailability, input.maintenanceLoad].some((value) => !Number.isFinite(value) || value < 0)) return state;
  const next = clone(state); const target = next.productionLines[lineId]; const sameFamily = target.productionFamilyId === input.productionFamilyId;
  const retained = calculateRetooledEfficiency(target.efficiency, sameFamily, next.industrialStrategy); const beforeDesign = target.designId;
  Object.assign(target, input, { status: 'retooling', efficiency: retained, rampUp: 1, retoolingDaysRemaining: Math.max(1, Math.ceil((input.baseRetoolingDays ?? 6) / Math.max(0.1, next.industrialStrategy?.conversionSpeedModifier ?? 1))) });
  record(next, lineId, `productionLine:${lineId}.designId`, beforeDesign, input.designId, 'productionLine.retool-started');
  record(next, lineId, `productionLine:${lineId}.efficiency`, line.efficiency, retained, 'productionLine.retool-retention'); return next;
}
export function setIndustrialStrategy(state: NationKernelState, strategy: IndustrialStrategyState): NationKernelState {
  const next = clone(state); const before = next.industrialStrategy?.technologyRouteId ?? 'unset'; next.industrialStrategy = structuredClone(strategy); record(next, 'industrial-strategy', 'industrialStrategy.technologyRouteId', before, strategy.technologyRouteId, 'industrialStrategy.changed'); return next;
}
export function damageIndustrialFacility(state: NationKernelState, facilityId: KernelId, severity: number): NationKernelState {
  const facility = state.facilities[facilityId]; const industrial = facility?.industrialCapacity; if (industrial == null || !Number.isFinite(severity) || severity <= 0) return state;
  const next = clone(state); const target = next.facilities[facilityId].industrialCapacity!; const before = target.damagedFactoryUnits ?? 0;
  const loss = Math.max(1, Math.ceil(severity * target.damageRisk * (next.industrialStrategy?.damageRiskModifier ?? 1))); target.damagedFactoryUnits = clamp(before + loss, 0, target.factoryUnits); target.usableFactoryUnits = target.factoryUnits - target.damagedFactoryUnits;
  record(next, facilityId, `facility:${facilityId}.damagedFactoryUnits`, before, target.damagedFactoryUnits, 'industrialFacility.damaged'); return next;
}
export function applyFormationEquipmentLoss(state: NationKernelState, formationId: KernelId, lossRatio: number, reasonKey = 'formation.equipment-loss'): NationKernelState {
  const formation = state.formations[formationId]; if (formation == null || !Number.isFinite(lossRatio) || lossRatio <= 0) return state;
  const next = clone(state); const target = next.formations[formationId];
  for (const equipment of target.equipment) { const before = equipment.delivered ?? equipment.required; equipment.delivered = round(clamp(before - equipment.required * lossRatio, 0, equipment.required), 2); record(next, formationId, `formation:${formationId}.equipment.${equipment.stockpileId}`, before, equipment.delivered, reasonKey); }
  const delivered = target.equipment.reduce((sum, item) => sum + (item.delivered ?? item.required), 0); const required = target.equipment.reduce((sum, item) => sum + item.required, 0); target.equipmentReadiness = required === 0 ? 100 : round(delivered / required * 100, 1); return next;
}
export function setFormationReplenishmentPriority(state: NationKernelState, formationId: KernelId, priority: 0 | 1 | 2 | 3, autoReplenish = true): NationKernelState {
  const formation = state.formations[formationId]; if (formation == null || ![0, 1, 2, 3].includes(priority)) return state;
  const next = clone(state); const target = next.formations[formationId]; const before = target.replenishmentPriority ?? 1; target.replenishmentPriority = priority; target.autoReplenish = autoReplenish; record(next, formationId, `formation:${formationId}.replenishmentPriority`, before, priority, 'formation.replenishment-priority'); return next;
}
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
  if (effect.kind === 'region' && !state.regions[effect.region.id]) {
    const region = structuredClone(effect.region);
    state.regions[region.id] = region;
    const polity = state.polities[region.polityId];
    if (polity != null && !polity.territoryRegionIds.includes(region.id)) polity.territoryRegionIds.push(region.id);
    for (const cityId of effect.reassignCityIds ?? []) {
      const city = state.cities[cityId];
      if (city == null || city.polityId !== region.polityId) continue;
      const previousRegion = state.regions[city.regionId];
      if (previousRegion != null) previousRegion.cityIds = previousRegion.cityIds.filter((id) => id !== cityId);
      city.regionId = region.id;
      if (!region.cityIds.includes(cityId)) region.cityIds.push(cityId);
      record(state, sourceId, `city:${cityId}.region`, previousRegion?.id ?? 'absent', region.id, effect.reasonKey);
    }
    record(state, sourceId, `region:${region.id}.status`, 'absent', 'registered', effect.reasonKey);
  }
  if (effect.kind === 'regionProgress' && state.regions[effect.regionId]) {
    const region = state.regions[effect.regionId];
    for (const [field, delta] of Object.entries(effect.integrationDelta ?? {})) {
      if (delta == null) continue;
      const key = field as keyof RegionState['integration'];
      const before = region.integration[key];
      region.integration[key] = round(clamp(before + delta, 0, 100), 1);
      record(state, sourceId, `region:${region.id}.integration.${key}`, before, region.integration[key], effect.reasonKey);
    }
    if (effect.territoryDelta != null) {
      if (region.territory == null) region.territory = { control: 0, integration: 0, development: 0, taxBase: 0, threat: 0, infrastructure: 0, resourcePotential: 0 };
      for (const [field, delta] of Object.entries(effect.territoryDelta)) {
        if (delta == null) continue;
        const key = field as keyof TerritoryState;
        const before = region.territory[key] ?? 0;
        region.territory[key] = round(clamp(before + delta, 0, 100), 1);
        record(state, sourceId, `region:${region.id}.territory.${key}`, before, region.territory[key], effect.reasonKey);
      }
    }
    if (effect.ruralPopulationDelta != null) {
      const before = region.ruralPopulation;
      region.ruralPopulation = round(clamp(before + effect.ruralPopulationDelta, 0), 0);
      record(state, sourceId, `region:${region.id}.ruralPopulation`, before, region.ruralPopulation, effect.reasonKey);
    }
  }
  if (effect.kind === 'polityProfile' && state.polities[effect.polityId]) {
    const polity = state.polities[effect.polityId];
    const before = `${polity.templateId}/${polity.archetype}/${polity.simulationTier}`;
    polity.templateId = effect.templateId;
    polity.archetype = effect.archetype;
    polity.simulationTier = effect.simulationTier;
    polity.strategicIntent = [...effect.strategicIntent];
    record(state, sourceId, `polity:${polity.id}.profile`, before, `${polity.templateId}/${polity.archetype}/${polity.simulationTier}`, effect.reasonKey);
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
  if (effect.kind === 'design' && !state.designs[effect.design.id]) {
    const design = structuredClone(effect.design);
    state.designs[design.id] = design;
    record(state, sourceId, `design:${design.id}.status`, 'absent', design.status, effect.reasonKey);
  }
  if (effect.kind === 'productionLine' && !state.productionLines[effect.productionLine.id]) {
    const line = structuredClone(effect.productionLine);
    state.productionLines[line.id] = line;
    record(state, sourceId, `productionLine:${line.id}.status`, 'absent', line.status, effect.reasonKey);
  }
  if (effect.kind === 'productionLineConfig' && state.productionLines[effect.productionLineId]) {
    const line = state.productionLines[effect.productionLineId];
    for (const [field, value] of Object.entries({ designId: effect.designId, stockpileId: effect.stockpileId, status: effect.status, dailyOutput: effect.dailyOutput, efficiency: effect.efficiency, assignedFactoryUnits: effect.assignedFactoryUnits, baseOutputPerFactory: effect.baseOutputPerFactory, efficiencyCap: effect.efficiencyCap, efficiencyGainPerDay: effect.efficiencyGainPerDay, productionFamilyId: effect.productionFamilyId, rampUp: effect.rampUp, inputAvailability: effect.inputAvailability, maintenanceLoad: effect.maintenanceLoad })) {
      if (value == null) continue;
      const key = field as keyof typeof line;
      const before = line[key];
      Object.assign(line, { [key]: value });
      record(state, sourceId, `productionLine:${line.id}.${key}`, before ?? 'unset', value, effect.reasonKey);
    }
  }
  if (effect.kind === 'industrialStrategy') {
    const before = state.industrialStrategy?.technologyRouteId ?? 'unset';
    state.industrialStrategy = structuredClone(effect.strategy);
    record(state, sourceId, 'industrialStrategy.technologyRouteId', before, effect.strategy.technologyRouteId, effect.reasonKey);
  }
  if (effect.kind === 'stockpile' && !state.stockpiles[effect.stockpile.id]) {
    const stockpile = structuredClone(effect.stockpile);
    state.stockpiles[stockpile.id] = stockpile;
    record(state, sourceId, `stockpile:${stockpile.id}.quantity`, 'absent', stockpile.quantity, effect.reasonKey);
  }
  if (effect.kind === 'formation' && !state.formations[effect.formation.id]) {
    const formation = structuredClone(effect.formation);
    state.formations[formation.id] = formation;
    record(state, sourceId, `formation:${formation.id}.status`, 'absent', formation.mission, effect.reasonKey);
  }
  if (effect.kind === 'vessel' && !state.vessels[effect.vessel.id]) {
    const vessel = structuredClone(effect.vessel);
    state.vessels[vessel.id] = vessel;
    if (effect.fleetId != null && state.fleets[effect.fleetId] != null) {
      const fleet = state.fleets[effect.fleetId];
      fleet.vesselIds = [...(fleet.vesselIds ?? []), vessel.id];
    }
    record(state, sourceId, `vessel:${vessel.id}.status`, 'absent', vessel.lifecycle.status, effect.reasonKey);
  }
  if (effect.kind === 'spaceAsset' && !state.spaceAssets[effect.spaceAsset.id]) {
    const asset = structuredClone(effect.spaceAsset);
    state.spaceAssets[asset.id] = asset;
    record(state, sourceId, `spaceAsset:${asset.id}.status`, 'absent', asset.lifecycle.status, effect.reasonKey);
  }
  if (effect.kind === 'spaceMission') {
    const existing = state.spaceMissions[effect.spaceMission.id];
    if (existing == null) {
      const mission = structuredClone(effect.spaceMission);
      state.spaceMissions[mission.id] = mission;
      record(state, sourceId, `spaceMission:${mission.id}.status`, 'absent', mission.status, effect.reasonKey);
    } else if (existing.status !== effect.spaceMission.status) {
      const before = existing.status;
      existing.status = effect.spaceMission.status;
      if (effect.spaceMission.status === 'completed') existing.completedDay = state.calendar.day;
      record(state, sourceId, `spaceMission:${existing.id}.status`, before, existing.status, effect.reasonKey);
    }
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
function stockpileDemandsMet(state: NationKernelState, demands: ReadonlyArray<NonNullable<OperationState['startStockpileDemands']>[number]>): boolean { return demands.every((demand) => (state.stockpiles[demand.stockpileId]?.quantity ?? 0) - (state.stockpiles[demand.stockpileId]?.reserved ?? 0) >= demand.amount); }
function prerequisitesMet(state: NationKernelState, operation: OperationState): boolean {
  const requirements = operation.prerequisites;
  if (requirements == null) return true;
  const capabilities = state.polities[operation.polityId]?.capabilities ?? {};
  return (requirements.capabilityIds ?? []).every((id) => capabilities[id] != null)
    && (requirements.facilityIds ?? []).every((id) => state.facilities[id]?.lifecycle.status === 'operating')
    && (requirements.networkIds ?? []).every((id) => state.networks[id]?.lifecycle.status === 'operating')
    && (requirements.productionLineIds ?? []).every((id) => state.productionLines[id]?.status === 'operating')
    && (requirements.completedOperationIds ?? []).every((id) => state.operations[id]?.status === 'completed')
    && (requirements.designIds ?? []).every((id) => state.designs[id]?.status === 'standardized');
}
export function startOperation(state: NationKernelState, operationId: KernelId): NationKernelState {
  const operation = state.operations[operationId]; if (operation == null || operation.status !== 'planned' || !prerequisitesMet(state, operation) || !demandsMet(state, operation.startDemands) || !stockpileDemandsMet(state, operation.startStockpileDemands ?? []) || availableWorkforce(state, operation.polityId) < operation.staffRequired) return state;
  const next = clone(state); const active = next.operations[operationId];
  for (const demand of active.startDemands) applyEffect(next, { kind: 'quantity', timing: 'onStart', target: demand.target, quantityId: demand.quantityId, operation: 'add', value: -demand.amount, reasonKey: 'operation.input.reserved' }, active.id);
  for (const demand of active.startStockpileDemands ?? []) {
    const stockpile = next.stockpiles[demand.stockpileId];
    if (stockpile == null) continue;
    const before = stockpile.quantity;
    stockpile.quantity -= demand.amount;
    record(next, active.id, `stockpile:${stockpile.id}.quantity`, before, stockpile.quantity, 'operation.stockpile.reserved');
  }
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
function advanceFacilities(state: NationKernelState): void { for (const facility of Object.values(state.facilities)) { if (facility.lifecycle.status !== 'operating') continue; facility.recurringEffects.filter((effect) => effect.timing === 'perDay').forEach((effect) => applyEffect(state, effect, facility.id)); if (facility.maintenanceStaffRequired > 0 && state.polities[facility.polityId]?.workforce.maintenance < facility.maintenanceStaffRequired * (state.industrialStrategy?.maintenanceDemandModifier ?? 1)) { facility.lifecycle.maintenanceBacklog += 1; facility.lifecycle.condition = clamp(facility.lifecycle.condition - 0.2, 0, 100); }
    const industrial = facility.industrialCapacity; if (industrial != null && (industrial.damagedFactoryUnits ?? 0) > 0 && facility.lifecycle.maintenanceBacklog < 30) { const before = industrial.damagedFactoryUnits ?? 0; industrial.damagedFactoryUnits = round(clamp(before - industrial.repairRate, 0, industrial.factoryUnits), 2); industrial.usableFactoryUnits = Math.floor(industrial.factoryUnits - industrial.damagedFactoryUnits); if (industrial.damagedFactoryUnits !== before) record(state, facility.id, `facility:${facility.id}.damagedFactoryUnits`, before, industrial.damagedFactoryUnits, 'industrialFacility.repaired'); }
  } }
function advanceProductionLines(state: NationKernelState): void {
  const direction = industrialLogisticsDirectionRuntime(state);
  for (const line of Object.values(state.productionLines)) {
    if (line.status === 'retooling') { if (line.retoolingDaysRemaining != null) { const before = line.retoolingDaysRemaining; line.retoolingDaysRemaining = Math.max(0, before - 1); if (line.retoolingDaysRemaining === 0) { line.status = 'operating'; record(state, line.id, `productionLine:${line.id}.status`, 'retooling', 'operating', 'productionLine.retool-completed'); } } continue; }
    if (line.status !== 'operating') continue;
    const facility = state.facilities[line.facilityId]; const design = state.designs[line.designId]; const stockpile = state.stockpiles[line.stockpileId];
    if (facility?.lifecycle.status !== 'operating' || design?.status !== 'standardized' || stockpile == null) continue;
    const strategy = state.industrialStrategy;
    const rampUp = clamp(line.rampUp ?? 1, 0, 1);
    const inputAvailability = clamp(line.inputAvailability ?? 1, 0, 1);
    const allocatedAtFacility = allocatedFactoryUnits(state, line.facilityId);
    const availabilityRatio = facility.industrialCapacity == null || allocatedAtFacility <= 0 ? 1 : clamp(facility.industrialCapacity.usableFactoryUnits / allocatedAtFacility, 0, 1);
    const assignedFactories = Math.max(0, line.assignedFactoryUnits ?? 1) * availabilityRatio;
    const baseOutput = line.baseOutputPerFactory == null ? line.dailyOutput : line.baseOutputPerFactory * assignedFactories;
    const facilityConcentration = clamp(facility.industrialCapacity?.concentration ?? 0, 0, 1);
    const policyOutput = Math.max(0, 1 + (strategy?.factoryOutputModifier ?? 0) + facilityConcentration * (strategy?.concentrationOutputModifier ?? 0)) * direction.productionOutputMultiplier;
    const effectiveEfficiency = clamp(line.efficiency, 0, Math.max(0, (line.efficiencyCap ?? 1) + (strategy?.efficiencyCapModifier ?? 0) + direction.productionEfficiencyCapBonus));
    const output = round(Math.max(0, baseOutput * effectiveEfficiency * rampUp * inputAvailability * policyOutput), 2);
    if (output === 0) continue;
    const before = stockpile.quantity;
    const productionCeiling = stockpile.targetReserve ?? stockpile.capacity;
    if (productionCeiling != null && before >= productionCeiling) continue;
    stockpile.quantity = round(productionCeiling == null ? before + output : Math.min(productionCeiling, before + output), 2);
    record(state, line.id, `stockpile:${stockpile.id}.quantity`, before, stockpile.quantity, 'productionLine.output');
    if (line.rampUp != null && line.rampUp < 1) {
      const beforeRamp = line.rampUp;
      line.rampUp = round(clamp(line.rampUp + (line.rampUpPerDay ?? 0) * direction.productionRampMultiplier, 0, 1), 2);
      if (line.rampUp !== beforeRamp) record(state, line.id, `productionLine:${line.id}.rampUp`, beforeRamp, line.rampUp, 'productionLine.ramp-up');
    }
    if (line.efficiencyGainPerDay != null) {
      const beforeEfficiency = line.efficiency;
      const cap = Math.max(0, (line.efficiencyCap ?? 1) + (strategy?.efficiencyCapModifier ?? 0) + direction.productionEfficiencyCapBonus);
      const gain = line.efficiencyGainPerDay * (strategy?.efficiencyGrowthModifier ?? 1) * direction.productionEfficiencyGainMultiplier;
      line.efficiency = round(clamp(line.efficiency + gain, 0, cap), 3);
      if (line.efficiency !== beforeEfficiency) record(state, line.id, `productionLine:${line.id}.efficiency`, beforeEfficiency, line.efficiency, 'productionLine.efficiency-growth');
    }
  }
}
function advanceFormationEquipment(state: NationKernelState): void {
  const direction = industrialLogisticsDirectionRuntime(state);
  for (const formation of Object.values(state.formations)) {
    for (const equipment of formation.equipment) {
      const stockpile = state.stockpiles[equipment.stockpileId]; const design = stockpile?.designId == null ? undefined : state.designs[stockpile.designId];
      const reliabilityWear = design?.performance?.reliability == null ? 0 : (1 - design.performance.reliability / 100) * 0.002;
      const maintenanceWear = (design?.maintenanceLoad ?? 0) * 0.0004;
      const wearRate = (formation.equipmentWearPerDay ?? reliabilityWear + maintenanceWear) * direction.equipmentWearMultiplier;
      if (wearRate <= 0) continue; const before = equipment.delivered ?? equipment.required; equipment.delivered = round(clamp(before - equipment.required * wearRate, 0, equipment.required), 3); if (Math.floor(before * 10) !== Math.floor(equipment.delivered * 10)) record(state, formation.id, `formation:${formation.id}.equipment.${equipment.stockpileId}`, before, equipment.delivered, 'formation.daily-equipment-wear');
    }
  }
  const formations = Object.values(state.formations).filter((formation) => formation.autoReplenish !== false).sort((a, b) => (b.replenishmentPriority ?? 1) - (a.replenishmentPriority ?? 1));
  for (const formation of formations) {
    for (const equipment of formation.equipment) { const stockpile = state.stockpiles[equipment.stockpileId]; if (stockpile == null) continue; const beforeDelivered = equipment.delivered ?? equipment.required; const missing = Math.max(0, equipment.required - beforeDelivered); const transfer = round(Math.min(missing, Math.max(0, stockpile.quantity - stockpile.reserved) * direction.replenishmentMultiplier), 3); if (transfer <= 0) continue; const beforeStockpile = stockpile.quantity; equipment.delivered = round(beforeDelivered + transfer, 3); stockpile.quantity = round(stockpile.quantity - transfer, 3); if (transfer >= 0.1) record(state, formation.id, `stockpile:${stockpile.id}.quantity`, beforeStockpile, stockpile.quantity, 'formation.auto-replenishment'); }
    const delivered = formation.equipment.reduce((sum, item) => sum + (item.delivered ?? item.required), 0); const required = formation.equipment.reduce((sum, item) => sum + item.required, 0); formation.equipmentReadiness = required === 0 ? 100 : round(delivered / required * 100, 1);
  }
}
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
export function advanceNationKernelDays(state: NationKernelState, days: number): NationKernelState { let next = state; for (let i = 0; i < days; i += 1) { next = clone(next); next.calendar = calendarFor(next.calendar.day + 1); advanceFacilities(next); advanceProductionLines(next); advanceFormationEquipment(next); advanceRegionalServices(next); Object.values(next.operations).forEach((operation) => advanceOperation(next, operation)); advanceCivilizationSystemsDay(next); rebuildMetroSummaries(next); next.budget.stability = round(clamp(next.budget.stability - (next.industrialStrategy?.stabilityPressurePerDay ?? 0), 0, 100), 2); next.observations = next.observations.filter((observation) => next.calendar.day - observation.observedDay <= 360); next.ledger = next.ledger.slice(-Math.max(500, externalDirectionRuntime(next).ledgerRetentionDays)); } return next; }
export function polity(state: NationKernelState, id: KernelId): PolityState | null { return state.polities[id] ?? null; }
