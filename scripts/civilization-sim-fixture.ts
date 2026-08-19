import { advanceNationKernelDays, installCivilizationSystems, startOperation } from '../src/v2/nationKernel';
import { createDiplomaticConflictSave } from '../src/v2/nationKernel/saveFixtures';
import type { NationKernelState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function start(state: NationKernelState, operationId: string): NationKernelState { const next = startOperation(state, operationId); assert(next !== state, `operation did not start: ${operationId}`); return next; }

export function createCivilizationTestState(): NationKernelState {
  let state = createDiplomaticConflictSave().state;
  state = advanceNationKernelDays(start(state, 'operation.r28b.industrial-standard'), 12);
  state = start(state, 'operation.r28b.guard-equipment-design'); state = start(state, 'operation.r29a.mobile-heavy-equipment-design'); state = advanceNationKernelDays(state, 14);
  state = advanceNationKernelDays(start(state, 'operation.r28b.military-assembly-works'), 15);
  state = advanceNationKernelDays(start(state, 'operation.r28b.guard-equipment-line'), 4); state = advanceNationKernelDays(state, 18);
  state = advanceNationKernelDays(start(state, 'operation.r28b.border-guard-formation'), 6);
  state = advanceNationKernelDays(start(state, 'operation.r29a.mobile-heavy-tooling'), 8);
  state = advanceNationKernelDays(start(state, 'operation.r29a.retool-mobile-heavy-line'), 6); state = advanceNationKernelDays(state, 25);
  state = advanceNationKernelDays(start(state, 'operation.r29a.mobile-reserve-formation'), 8);
  state.designs['design.test.peer-line'] = { id: 'design.test.peer-line', polityId: 'polity.neighbor', kind: 'vehicle', status: 'standardized', requiredCapabilityIds: [], tags: ['ground'], productionCost: 1.5, maintenanceLoad: 0.28, performance: { effectiveness: 64, reliability: 68, adaptability: 66 }, sourceIds: ['fixture'] };
  state.stockpiles['stockpile.test.peer-equipment'] = { id: 'stockpile.test.peer-equipment', polityId: 'polity.neighbor', kind: 'equipment', designId: 'design.test.peer-line', quantity: 20, reserved: 0, capacity: 30, targetReserve: 18, sourceFacilityIds: [] };
  state.formations['formation.test.peer-field'] = { id: 'formation.test.peer-field', polityId: 'polity.neighbor', role: 'field', personnel: 10_000, training: 66, readiness: 72, equipment: [{ stockpileId: 'stockpile.test.peer-equipment', required: 10, delivered: 10 }], equipmentReadiness: 100, supplyDays: 16, cohesion: 65, experience: 12, homeRegionId: 'region.neighbor', mission: 'deny-border-route' };
  state = installCivilizationSystems(state, {
    logistics: { freightCapacity: 72, militaryDemand: 28, civilianDemand: 44, redundancy: 35 },
    maritime: { merchantShipping: 35, escortCapacity: 16, portCapacity: 30, routeSecurity: 64, navalReadiness: 62 },
    aerospace: { combatAircraft: 36, transportAircraft: 8, aircraftReadiness: 68, airDefense: 42, missileStockpile: 24, missileReliability: 72, airSuperiority: 18, fuelAvailability: 75, strategicStrikeRisk: 12 },
    satellites: { launchCapacity: 2, reconnaissanceSatellites: 1, communicationSatellites: 1, weatherSatellites: 1, orbitalCoverage: 28, reliability: 78, launchFailureRisk: 18, groundStationCapacity: 55 },
  });
  return state;
}
