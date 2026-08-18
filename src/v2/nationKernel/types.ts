import type { GeoReference } from '../types';

export type KernelId = string;
export type ScopeKind = 'world' | 'polity' | 'region' | 'metro' | 'city' | 'site' | 'facility' | 'network' | 'fleet' | 'theatre';
export interface ScopeRef { kind: ScopeKind; id: KernelId; }
export type QuantityKind = 'count' | 'coverageDays' | 'supplyUnit' | 'capacity' | 'coverage' | 'ratio' | 'score';
export type QuantityDisplay = 'exact' | 'coverage' | 'status' | 'trend' | 'hidden';
export type DevelopmentStage = 'survival' | 'settlement' | 'regional' | 'unifiedNation' | 'spaceflight' | 'interstellar';
export type QuantityPanel = 'topbar' | 'nation' | 'city' | 'military' | 'diplomacy' | 'space' | 'report';
export interface QuantityDefinition { id: KernelId; kind: QuantityKind; unit: string; display: QuantityDisplay; min?: number; max?: number; precision: number; source: 'stored' | 'derived'; presentation: { panel: QuantityPanel; visibleFrom: DevelopmentStage; copyKey: string; }; }
export interface QuantityValue { current: number; capacity?: number; updatedDay: number; sourceIds: KernelId[]; }
export type QuantityBook = Record<string, Record<KernelId, QuantityValue>>;

export type LifecycleStatus = 'planned' | 'surveyed' | 'building' | 'trial' | 'operating' | 'degraded' | 'offline' | 'retired';
export interface AuthorityState { ownerId: KernelId; operatorId: KernelId; maintenanceOwnerId: KernelId; commandAuthorityId: KernelId; serviceScopes: ScopeRef[]; }
export interface LifecycleState { status: LifecycleStatus; condition: number; maintenanceBacklog: number; startedDay?: number; lastMaintainedDay?: number; }
export interface WorkforceState { healthy: number; dependents: number; essential: number; maintenance: number; publicServices: number; administration: number; defense: number; }
export interface PopulationSummary { residents: number; temporary: number; dependents: number; healthyWorkforce: number; migrationPressure: number; housingPressure: number; }
export type SimulationTier = 'dormant' | 'strategic' | 'regional' | 'active' | 'full';
export type PolityArchetype = 'community' | 'mobile' | 'cityState' | 'regionalState' | 'planetaryState' | 'orbitalColony' | 'interstellarState';
export interface CapabilityState { id: KernelId; maturity: 'theory' | 'prototype' | 'replicable' | 'scaled' | 'integrated'; sourceIds: KernelId[]; }

export interface PolityState {
  id: KernelId; templateId: KernelId; archetype: PolityArchetype; simulationTier: SimulationTier;
  territoryRegionIds: KernelId[]; population: PopulationSummary; workforce: WorkforceState;
  capabilities: Record<KernelId, CapabilityState>; activeOperationIds: KernelId[]; cohesion: number; strategicIntent: string[];
}
export interface RegionState { id: KernelId; polityId: KernelId; cityIds: KernelId[]; ruralPopulation: number; integration: { registry: number; services: number; justice: number; security: number; executionQuality: number; }; environmentPressure: number; serviceAssignments?: Record<KernelId, number>; }
export interface CityState { id: KernelId; polityId: KernelId; regionId: KernelId; metroId?: KernelId; geoRef: GeoReference; stage: 'outpost' | 'settlement' | 'town' | 'city' | 'metropolis'; role: string; population: number; builtAreaKm2: number; facilityIds: KernelId[]; }
export interface MetroAreaState { id: KernelId; polityId: KernelId; memberCityIds: KernelId[]; coreCityId: KernelId; totalPopulation: number; sharedNetworkIds: KernelId[]; coordinationLoad: number; }
export interface FacilityState { id: KernelId; moduleId: KernelId; polityId: KernelId; hostCityId?: KernelId; geoRef?: GeoReference; authority: AuthorityState; lifecycle: LifecycleState; maintenanceStaffRequired: number; recurringEffects: EffectSpec[]; }
export interface NetworkState { id: KernelId; polityId: KernelId; kind: 'road' | 'rail' | 'water' | 'power' | 'comms' | 'spaceRoute'; endpointIds: KernelId[]; capacity: number; condition: number; redundancy: number; lifecycle: LifecycleState; }
export interface FleetState { id: KernelId; polityId: KernelId; domain: 'river' | 'sea' | 'air' | 'orbital' | 'deepSpace'; homeFacilityId?: KernelId; mission: string; vessels: Record<KernelId, { total: number; ready: number; repairing: number; }>; personnel: number; supplyDays: number; readiness: number; }
export interface TheatreState { id: KernelId; polityId: KernelId; opponentPolityId: KernelId; regionIds: KernelId[]; objective: string; status: 'watch' | 'crisis' | 'limitedConflict' | 'war' | 'ceasefire'; civilianImpact: number; integrationPressure: number; }
export interface SpaceAssetState { id: KernelId; polityId: KernelId; kind: 'satellite' | 'station' | 'shipyard' | 'launchSite' | 'colony'; lifecycle: LifecycleState; personnel: number; geoRef?: GeoReference; }

export interface RelationState { id: KernelId; actorAId: KernelId; actorBId: KernelId; stance: 'unknown' | 'contact' | 'neutral' | 'cooperative' | 'tense' | 'hostile' | 'war'; trustAtoB: number; trustBtoA: number; agreementIds: KernelId[]; grievanceIds: KernelId[]; }
export interface ObservationState { observerId: KernelId; subjectId: KernelId; fieldId: KernelId; knownValue?: number | string; confidence: number; observedDay: number; source: 'scout' | 'trade' | 'diplomacy' | 'sensor' | 'rumor'; }

export type EffectTiming = 'onStart' | 'perDay' | 'onComplete';
export type EffectSpec =
  | { kind: 'quantity'; timing: EffectTiming; target: ScopeRef; quantityId: KernelId; operation: 'add' | 'multiply' | 'set'; value: number; reasonKey: string; }
  | { kind: 'capability'; timing: EffectTiming; targetPolityId: KernelId; capability: CapabilityState; reasonKey: string; }
  | { kind: 'city'; timing: EffectTiming; city: CityState; initialQuantities?: Record<KernelId, number>; reasonKey: string; }
  | { kind: 'populationTransfer'; timing: EffectTiming; fromCityId: KernelId; toCityId: KernelId; amount: number; reasonKey: string; }
  | { kind: 'lifecycle'; timing: EffectTiming; facilityId: KernelId; status: LifecycleStatus; reasonKey: string; }
  | { kind: 'facility'; timing: EffectTiming; facility: FacilityState; reasonKey: string; }
  | { kind: 'network'; timing: EffectTiming; network: NetworkState; reasonKey: string; }
  | { kind: 'fleet'; timing: EffectTiming; fleetId: KernelId; readinessDelta?: number; supplyDaysDelta?: number; vesselReadiness?: Array<{ vesselId: KernelId; readyDelta: number; repairingDelta: number }>; reasonKey: string; }
  | { kind: 'relation'; timing: EffectTiming; relationId: KernelId; deltaAtoB: number; deltaBtoA: number; reasonKey: string; };
export interface ResourceDemand { target: ScopeRef; quantityId: KernelId; amount: number; }
export interface OperationPrerequisites { capabilityIds?: KernelId[]; facilityIds?: KernelId[]; networkIds?: KernelId[]; completedOperationIds?: KernelId[]; }
export type OperationKind = 'research' | 'engineering' | 'policy' | 'military' | 'diplomacy' | 'survey' | 'emergency';
export interface OperationState {
  id: KernelId; definitionId: KernelId; kind: OperationKind; polityId: KernelId; scope: ScopeRef; status: 'planned' | 'active' | 'blocked' | 'completed' | 'cancelled';
  staffRequired: number; workRequired: number; workDone: number; durationDays?: number; elapsedDays: number; prerequisites?: OperationPrerequisites; startDemands: ResourceDemand[]; effects: EffectSpec[]; startedDay?: number; completedDay?: number;
}
export interface LedgerEntry { day: number; sourceId: KernelId; target: string; before: number | string; after: number | string; reasonKey: string; }
export interface KernelCalendar { day: number; year: number; month: number; phase: 'early' | 'mid' | 'late'; }
export interface NationKernelState {
  version: 1; seed: number; playerPolityId: KernelId; calendar: KernelCalendar; quantityDefinitions: Record<KernelId, QuantityDefinition>; quantities: QuantityBook;
  polities: Record<KernelId, PolityState>; regions: Record<KernelId, RegionState>; cities: Record<KernelId, CityState>; metros: Record<KernelId, MetroAreaState>; facilities: Record<KernelId, FacilityState>; networks: Record<KernelId, NetworkState>;
  fleets: Record<KernelId, FleetState>; theatres: Record<KernelId, TheatreState>; spaceAssets: Record<KernelId, SpaceAssetState>;
  relations: Record<KernelId, RelationState>; observations: ObservationState[]; operations: Record<KernelId, OperationState>; ledger: LedgerEntry[];
}
