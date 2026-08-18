import type { GeoReference } from '../types';

export type KernelId = string;
export type ScopeKind = 'world' | 'polity' | 'region' | 'metro' | 'city' | 'site' | 'facility' | 'network' | 'fleet' | 'theatre' | 'formation' | 'vessel' | 'spaceAsset';
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
export type PolityArchetype = 'community' | 'mobile' | 'cityState' | 'regionalState' | 'nationState' | 'planetaryState' | 'orbitalColony' | 'interstellarState';
export interface CapabilityState { id: KernelId; maturity: 'theory' | 'prototype' | 'replicable' | 'scaled' | 'integrated'; sourceIds: KernelId[]; }

export interface PolityState {
  id: KernelId; templateId: KernelId; archetype: PolityArchetype; simulationTier: SimulationTier;
  territoryRegionIds: KernelId[]; population: PopulationSummary; workforce: WorkforceState;
  capabilities: Record<KernelId, CapabilityState>; activeOperationIds: KernelId[]; cohesion: number; strategicIntent: string[];
}
export interface TerritoryState { control: number; integration: number; development: number; taxBase: number; threat: number; }
export interface RegionState { id: KernelId; polityId: KernelId; cityIds: KernelId[]; ruralPopulation: number; integration: { registry: number; services: number; justice: number; security: number; executionQuality: number; }; environmentPressure: number; serviceAssignments?: Record<KernelId, number>; territory?: TerritoryState; }
export interface CityState { id: KernelId; polityId: KernelId; regionId: KernelId; metroId?: KernelId; geoRef: GeoReference; stage: 'outpost' | 'settlement' | 'town' | 'city' | 'metropolis'; role: string; population: number; builtAreaKm2: number; facilityIds: KernelId[]; }
export interface MetroAreaState { id: KernelId; polityId: KernelId; memberCityIds: KernelId[]; coreCityId: KernelId; totalPopulation: number; sharedNetworkIds: KernelId[]; coordinationLoad: number; }
export interface FacilityState { id: KernelId; moduleId: KernelId; polityId: KernelId; hostCityId?: KernelId; geoRef?: GeoReference; authority: AuthorityState; lifecycle: LifecycleState; maintenanceStaffRequired: number; recurringEffects: EffectSpec[]; }
export interface NetworkState { id: KernelId; polityId: KernelId; kind: 'road' | 'rail' | 'water' | 'power' | 'comms' | 'spaceRoute'; endpointIds: KernelId[]; capacity: number; condition: number; redundancy: number; lifecycle: LifecycleState; }
export type DesignKind = 'weapon' | 'vehicle' | 'vessel' | 'launcher' | 'spaceVehicle';
export interface DesignState { id: KernelId; polityId: KernelId; kind: DesignKind; status: 'concept' | 'prototype' | 'standardized' | 'retired'; requiredCapabilityIds: KernelId[]; tags: string[]; productionCost: number; maintenanceLoad: number; sourceIds: KernelId[]; }
export interface ProductionLineState { id: KernelId; polityId: KernelId; facilityId: KernelId; designId: KernelId; stockpileId: KernelId; status: 'planned' | 'retooling' | 'operating' | 'paused'; dailyOutput: number; efficiency: number; capacityRequired: number; }
export interface StockpileState { id: KernelId; polityId: KernelId; kind: 'equipment' | 'strategicSupply' | 'spaceComponent'; designId?: KernelId; quantity: number; reserved: number; capacity?: number; sourceFacilityIds: KernelId[]; }
export interface FormationState { id: KernelId; polityId: KernelId; role: 'garrison' | 'field' | 'expeditionary' | 'orbital'; personnel: number; training: number; readiness: number; equipment: Array<{ stockpileId: KernelId; required: number }>; homeRegionId?: KernelId; mission: string; }
export interface VesselState { id: KernelId; polityId: KernelId; designId: KernelId; homeFacilityId?: KernelId; lifecycle: LifecycleState; personnel: number; readiness: number; mission: string; }
export interface FleetState { id: KernelId; polityId: KernelId; domain: 'river' | 'sea' | 'air' | 'orbital' | 'deepSpace'; homeFacilityId?: KernelId; mission: string; vessels: Record<KernelId, { total: number; ready: number; repairing: number; }>; vesselIds?: KernelId[]; personnel: number; supplyDays: number; readiness: number; }
export interface TheatreState { id: KernelId; polityId: KernelId; opponentPolityId: KernelId; regionIds: KernelId[]; objective: string; status: 'watch' | 'crisis' | 'limitedConflict' | 'war' | 'ceasefire'; civilianImpact: number; integrationPressure: number; }
export interface SpaceAssetState { id: KernelId; polityId: KernelId; kind: 'satellite' | 'station' | 'shipyard' | 'launchSite' | 'colony'; lifecycle: LifecycleState; personnel: number; designId?: KernelId; geoRef?: GeoReference; }
export interface SpaceMissionState { id: KernelId; polityId: KernelId; kind: 'launch' | 'observation' | 'orbitalConstruction' | 'deepSpaceSurvey' | 'colonization'; status: 'planned' | 'active' | 'completed' | 'failed'; originFacilityId: KernelId; targetRef: ScopeRef; vehicleDesignId?: KernelId; launchedDay?: number; completedDay?: number; }
export interface BudgetState { treasury: number; monthlyRevenue: number; committedMonthlySpend: number; taxRate: number; administrationCapacity: number; corruption: number; stability: number; }

export interface RelationState { id: KernelId; actorAId: KernelId; actorBId: KernelId; stance: 'unknown' | 'contact' | 'neutral' | 'cooperative' | 'tense' | 'hostile' | 'war'; trustAtoB: number; trustBtoA: number; agreementIds: KernelId[]; grievanceIds: KernelId[]; }
export interface AgreementState { id: KernelId; actorIds: KernelId[]; kind: 'trade' | 'transit' | 'research' | 'defense' | 'integration' | 'space'; status: 'proposed' | 'active' | 'expired' | 'broken'; startedDay?: number; expiresDay?: number; sourceIds: KernelId[]; }
export interface ObservationState { observerId: KernelId; subjectId: KernelId; fieldId: KernelId; knownValue?: number | string; confidence: number; observedDay: number; source: 'scout' | 'trade' | 'diplomacy' | 'sensor' | 'rumor'; }

export type EffectTiming = 'onStart' | 'perDay' | 'onComplete';
export type EffectSpec =
  | { kind: 'quantity'; timing: EffectTiming; target: ScopeRef; quantityId: KernelId; operation: 'add' | 'multiply' | 'set'; value: number; reasonKey: string; }
  | { kind: 'capability'; timing: EffectTiming; targetPolityId: KernelId; capability: CapabilityState; reasonKey: string; }
  | { kind: 'region'; timing: EffectTiming; region: RegionState; reassignCityIds?: KernelId[]; reasonKey: string; }
  | { kind: 'polityProfile'; timing: EffectTiming; polityId: KernelId; templateId: KernelId; archetype: PolityArchetype; simulationTier: SimulationTier; strategicIntent: string[]; reasonKey: string; }
  | { kind: 'city'; timing: EffectTiming; city: CityState; initialQuantities?: Record<KernelId, number>; reasonKey: string; }
  | { kind: 'populationTransfer'; timing: EffectTiming; fromCityId: KernelId; toCityId: KernelId; amount: number; reasonKey: string; }
  | { kind: 'lifecycle'; timing: EffectTiming; facilityId: KernelId; status: LifecycleStatus; reasonKey: string; }
  | { kind: 'facility'; timing: EffectTiming; facility: FacilityState; reasonKey: string; }
  | { kind: 'network'; timing: EffectTiming; network: NetworkState; reasonKey: string; }
  | { kind: 'design'; timing: EffectTiming; design: DesignState; reasonKey: string; }
  | { kind: 'productionLine'; timing: EffectTiming; productionLine: ProductionLineState; reasonKey: string; }
  | { kind: 'stockpile'; timing: EffectTiming; stockpile: StockpileState; reasonKey: string; }
  | { kind: 'formation'; timing: EffectTiming; formation: FormationState; reasonKey: string; }
  | { kind: 'vessel'; timing: EffectTiming; vessel: VesselState; fleetId?: KernelId; reasonKey: string; }
  | { kind: 'spaceAsset'; timing: EffectTiming; spaceAsset: SpaceAssetState; reasonKey: string; }
  | { kind: 'spaceMission'; timing: EffectTiming; spaceMission: SpaceMissionState; reasonKey: string; }
  | { kind: 'fleet'; timing: EffectTiming; fleetId: KernelId; readinessDelta?: number; supplyDaysDelta?: number; vesselReadiness?: Array<{ vesselId: KernelId; readyDelta: number; repairingDelta: number }>; reasonKey: string; }
  | { kind: 'relation'; timing: EffectTiming; relationId: KernelId; deltaAtoB: number; deltaBtoA: number; reasonKey: string; };
export interface ResourceDemand { target: ScopeRef; quantityId: KernelId; amount: number; }
export interface StockpileDemand { stockpileId: KernelId; amount: number; }
export interface OperationPrerequisites { capabilityIds?: KernelId[]; facilityIds?: KernelId[]; networkIds?: KernelId[]; completedOperationIds?: KernelId[]; designIds?: KernelId[]; }
export type OperationKind = 'research' | 'design' | 'production' | 'engineering' | 'policy' | 'military' | 'diplomacy' | 'space' | 'survey' | 'emergency';
export interface OperationState {
  id: KernelId; definitionId: KernelId; kind: OperationKind; polityId: KernelId; scope: ScopeRef; status: 'planned' | 'active' | 'blocked' | 'completed' | 'cancelled';
  staffRequired: number; workRequired: number; workDone: number; durationDays?: number; elapsedDays: number; prerequisites?: OperationPrerequisites; startDemands: ResourceDemand[]; startStockpileDemands?: StockpileDemand[]; effects: EffectSpec[]; startedDay?: number; completedDay?: number;
}
export interface LedgerEntry { day: number; sourceId: KernelId; target: string; before: number | string; after: number | string; reasonKey: string; }
export interface KernelCalendar { day: number; year: number; month: number; phase: 'early' | 'mid' | 'late'; }
export interface NationKernelState {
  version: 1; seed: number; playerPolityId: KernelId; calendar: KernelCalendar; quantityDefinitions: Record<KernelId, QuantityDefinition>; quantities: QuantityBook;
  polities: Record<KernelId, PolityState>; regions: Record<KernelId, RegionState>; cities: Record<KernelId, CityState>; metros: Record<KernelId, MetroAreaState>; facilities: Record<KernelId, FacilityState>; networks: Record<KernelId, NetworkState>;
  budget: BudgetState; designs: Record<KernelId, DesignState>; productionLines: Record<KernelId, ProductionLineState>; stockpiles: Record<KernelId, StockpileState>; formations: Record<KernelId, FormationState>; vessels: Record<KernelId, VesselState>;
  fleets: Record<KernelId, FleetState>; theatres: Record<KernelId, TheatreState>; spaceAssets: Record<KernelId, SpaceAssetState>; spaceMissions: Record<KernelId, SpaceMissionState>;
  relations: Record<KernelId, RelationState>; agreements: Record<KernelId, AgreementState>; observations: ObservationState[]; operations: Record<KernelId, OperationState>; ledger: LedgerEntry[];
}
