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
export interface TerritoryState { control: number; integration: number; development: number; taxBase: number; threat: number; infrastructure?: number; resourcePotential?: number; }
export interface RegionState { id: KernelId; polityId: KernelId; cityIds: KernelId[]; ruralPopulation: number; integration: { registry: number; services: number; justice: number; security: number; executionQuality: number; }; environmentPressure: number; serviceAssignments?: Record<KernelId, number>; resourceEndowments?: Record<KernelId, number>; territory?: TerritoryState; }
export interface CityState { id: KernelId; polityId: KernelId; regionId: KernelId; metroId?: KernelId; geoRef: GeoReference; stage: 'outpost' | 'settlement' | 'town' | 'city' | 'metropolis'; role: string; population: number; builtAreaKm2: number; facilityIds: KernelId[]; }
export interface MetroAreaState { id: KernelId; polityId: KernelId; memberCityIds: KernelId[]; coreCityId: KernelId; totalPopulation: number; sharedNetworkIds: KernelId[]; coordinationLoad: number; }
export interface IndustrialCapacityState { factoryUnits: number; usableFactoryUnits: number; damagedFactoryUnits?: number; concentration: number; damageRisk: number; repairRate: number; }
export interface FacilityState { id: KernelId; moduleId: KernelId; polityId: KernelId; hostCityId?: KernelId; geoRef?: GeoReference; authority: AuthorityState; lifecycle: LifecycleState; maintenanceStaffRequired: number; recurringEffects: EffectSpec[]; industrialCapacity?: IndustrialCapacityState; }
export interface NetworkState { id: KernelId; polityId: KernelId; kind: 'road' | 'rail' | 'water' | 'power' | 'comms' | 'spaceRoute'; endpointIds: KernelId[]; capacity: number; condition: number; redundancy: number; lifecycle: LifecycleState; }
export type DesignKind = 'weapon' | 'vehicle' | 'vessel' | 'launcher' | 'spaceVehicle';
export interface AssetIdentity { modelId: KernelId; generation: number; roleIds: KernelId[]; presentationId: KernelId; designerId?: KernelId; introducedDay?: number; }
export interface ImpactProfile { targetDomains: Array<'personnel' | 'armor' | 'fortification' | 'air' | 'naval' | 'orbital' | 'surface'>; effectiveRangeBand: 'local' | 'regional' | 'theatre' | 'orbital' | 'interplanetary' | 'interstellar'; targetScale: 'squad' | 'formation' | 'facility' | 'capitalShip' | 'orbitalNode' | 'region'; destructiveEffects: Array<'suppress' | 'disable' | 'missionKill' | 'destroy' | 'areaDenial' | 'infrastructureCollapse'>; penetrationClass: 'none' | 'light' | 'medium' | 'heavy' | 'strategic'; areaEffectClass: 'point' | 'site' | 'corridor' | 'district' | 'regional'; demonstratedEffectIds: KernelId[]; comparisonTags: string[]; }
export interface OperationalDemandProfile { personnelRequired?: number; powerDemand?: number; strategicSupplyPerDay?: number; deploymentDays?: number; turnaroundDays?: number; requiredFacilityTags?: string[]; requiredNetworkKinds?: NetworkState['kind'][]; environmentLimits?: string[]; }
export interface ConstraintProfile { limitationTags: string[]; failureModeIds: KernelId[]; collateralRisk: number; politicalRisk: number; escalationRisk: number; minimumReadiness?: number; minimumSupplyDays?: number; counteredByTags: string[]; }
export interface DesignState { id: KernelId; polityId: KernelId; kind: DesignKind; status: 'concept' | 'prototype' | 'standardized' | 'retired'; requiredCapabilityIds: KernelId[]; tags: string[]; productionCost: number; maintenanceLoad: number; identity?: AssetIdentity; performance?: { effectiveness: number; reliability: number; adaptability: number; precision?: number; survivability?: number; mobility?: number; signature?: number; }; impact?: ImpactProfile; operationalDemand?: OperationalDemandProfile; constraints?: ConstraintProfile; sourceIds: KernelId[]; }
export interface ProductionLineState { id: KernelId; polityId: KernelId; facilityId: KernelId; designId: KernelId; stockpileId: KernelId; status: 'planned' | 'retooling' | 'operating' | 'paused'; dailyOutput: number; efficiency: number; capacityRequired: number; assignedFactoryUnits?: number; baseOutputPerFactory?: number; efficiencyCap?: number; efficiencyGainPerDay?: number; productionFamilyId?: KernelId; retoolingDaysRemaining?: number; rampUp?: number; rampUpPerDay?: number; inputAvailability?: number; maintenanceLoad?: number; }
export interface IndustrialStrategyState { policyId: KernelId; technologyRouteId: KernelId; factoryOutputModifier: number; efficiencyCapModifier: number; efficiencyGrowthModifier: number; conversionRetention: number; conversionSpeedModifier: number; concentrationOutputModifier: number; damageRiskModifier: number; civilianConstructionModifier?: number; maintenanceDemandModifier?: number; stabilityPressurePerDay?: number; }
export interface StockpileState { id: KernelId; polityId: KernelId; kind: 'equipment' | 'strategicSupply' | 'spaceComponent'; designId?: KernelId; quantity: number; reserved: number; capacity?: number; targetReserve?: number; condition?: number; sourceFacilityIds: KernelId[]; }
export interface FormationState { id: KernelId; polityId: KernelId; role: 'garrison' | 'field' | 'expeditionary' | 'orbital'; personnel: number; training: number; readiness: number; equipment: Array<{ stockpileId: KernelId; required: number; delivered?: number }>; equipmentReadiness?: number; equipmentWearPerDay?: number; autoReplenish?: boolean; replenishmentPriority?: 0 | 1 | 2 | 3; supplyDays?: number; cohesion?: number; experience?: number; homeRegionId?: KernelId; mission: string; }
export interface VesselState { id: KernelId; polityId: KernelId; designId: KernelId; homeFacilityId?: KernelId; lifecycle: LifecycleState; personnel: number; readiness: number; mission: string; }
export interface FleetState { id: KernelId; polityId: KernelId; domain: 'river' | 'sea' | 'air' | 'orbital' | 'deepSpace'; homeFacilityId?: KernelId; mission: string; vessels: Record<KernelId, { total: number; ready: number; repairing: number; }>; vesselIds?: KernelId[]; personnel: number; supplyDays: number; readiness: number; }
export interface TheatreState { id: KernelId; polityId: KernelId; opponentPolityId: KernelId; regionIds: KernelId[]; objective: string; status: 'watch' | 'crisis' | 'limitedConflict' | 'war' | 'ceasefire'; civilianImpact: number; integrationPressure: number; }
export interface SpaceAssetState { id: KernelId; polityId: KernelId; kind: 'satellite' | 'station' | 'shipyard' | 'launchSite' | 'colony'; lifecycle: LifecycleState; personnel: number; designId?: KernelId; geoRef?: GeoReference; }
export interface SpaceMissionState { id: KernelId; polityId: KernelId; kind: 'launch' | 'observation' | 'orbitalConstruction' | 'deepSpaceSurvey' | 'colonization'; status: 'planned' | 'active' | 'completed' | 'failed'; originFacilityId: KernelId; targetRef: ScopeRef; vehicleDesignId?: KernelId; launchedDay?: number; completedDay?: number; }
export interface BudgetState { treasury: number; monthlyRevenue: number; committedMonthlySpend: number; taxRate: number; administrationCapacity: number; corruption: number; stability: number; }

export interface CampaignState { id: KernelId; theatreId: KernelId; attackerPolityId: KernelId; defenderPolityId: KernelId; attackerFormationIds: KernelId[]; defenderFormationIds: KernelId[]; objective: 'holdRoute' | 'seizeNode' | 'limitedAdvance' | 'breakBlockade' | 'forceNegotiation'; status: 'preparing' | 'active' | 'stalemate' | 'ceasefire' | 'completed' | 'failed'; dayStarted: number; elapsedDays: number; supplyDemand: number; intelligence: number; attackerPressure: number; defenderDepth: number; control: number; attackerExhaustion: number; defenderExhaustion: number; attackerPersonnelLosses: number; defenderPersonnelLosses: number; equipmentLosses: number; civilianImpact: number; infrastructureDamage: number; stopAtExhaustion: number; outcome?: string; }
export interface DiplomaticIssueState { id: KernelId; actorIds: KernelId[]; kind: 'territory' | 'route' | 'resource' | 'security' | 'refugee'; importance: number; tension: number; grievance: number; status: 'open' | 'negotiating' | 'armedConflict' | 'settled' | 'frozen'; }
export interface NegotiationState { id: KernelId; issueId: KernelId; proposerId: KernelId; counterpartId: KernelId; demandLevel: number; concessionValue: number; militaryLeverage: number; economicPressure: number; credibility: number; acceptance: number; status: 'proposed' | 'active' | 'accepted' | 'rejected' | 'suspended'; settlementId?: KernelId; }
export interface PeaceSettlementState { id: KernelId; issueId: KernelId; actorIds: KernelId[]; ceasefire: boolean; withdrawal: number; routeAccess: number; reparations: number; monitoring: number; legitimacy: number; status: 'active' | 'violated' | 'completed'; }
export interface OccupationState { id: KernelId; polityId: KernelId; regionId: KernelId; security: number; resistance: number; registry: number; services: number; justice: number; localCooperation: number; fiscalIntegration: number; reconstruction: number; garrisonDemand: number; serviceDemand: number; coercion: number; civilianTrust: number; displacedPopulation: number; dailyCost: number; status: 'militaryControl' | 'stabilizing' | 'civilAdministration' | 'integrated' | 'failed'; }
export interface StrategicLogisticsState { freightCapacity: number; militaryDemand: number; civilianDemand: number; redundancy: number; disruption: number; stockpileThroughput: number; maritimeThroughput: number; airliftCapacity: number; effectiveCapacity: number; bottleneck: number; }
export interface DemographicDynamicsState { population: number; healthyPopulation: number; dependents: number; displaced: number; birthsPerThousand: number; deathsPerThousand: number; migrationPerDay: number; householdBurden: number; healthAccess: number; workforceParticipation: number; warCasualties: number; }
export interface EconomicAllocationState { output: number; revenue: number; militaryShare: number; civilianShare: number; reconstructionShare: number; researchShare: number; logisticsShare: number; debt: number; inflationPressure: number; civilianAvailability: number; repairFunding: number; }
export interface DomesticPoliticsState { legitimacy: number; warSupport: number; eliteCohesion: number; regionalCompliance: number; polarization: number; emergencyPower: number; protestPressure: number; casualtyTolerance: number; }
export interface MaritimeSystemState { merchantShipping: number; escortCapacity: number; portCapacity: number; routeSecurity: number; convoyLossRate: number; blockadePressure: number; navalReadiness: number; }
export interface AerospaceSystemState { combatAircraft: number; transportAircraft: number; aircraftReadiness: number; airDefense: number; missileStockpile: number; missileReliability: number; airSuperiority: number; fuelAvailability: number; strategicStrikeRisk: number; }
export interface SatelliteSystemState { launchCapacity: number; reconnaissanceSatellites: number; communicationSatellites: number; weatherSatellites: number; orbitalCoverage: number; reliability: number; launchFailureRisk: number; groundStationCapacity: number; }
export interface GlobalUnificationState { independentBlocs: number; controlledTerritoryRatio: number; integratedPopulationRatio: number; commonInstitutionScore: number; externalRecognition: number; resistancePressure: number; sharedInfrastructure: number; stage: 'fragmented' | 'contestedOrder' | 'hegemonicSettlement' | 'globalUnion'; }
export type AuthorityModel = 'councilRepublic' | 'technocraticDirectorate' | 'centralCommand';
export type CivilizationEthic = 'cooperation' | 'security' | 'equality' | 'merit' | 'openness' | 'continuity';
export interface PoliticalIdentityState { authority: AuthorityModel; ethics: CivilizationEthic[]; civicIds: KernelId[]; reformCooldownDays: number; lastReformDay?: number; }
export interface DomesticFactionState { id: KernelId; name: string; influence: number; satisfaction: number; demand: string; alignedEthic: CivilizationEthic; }
export interface StrategicEventOption { id: KernelId; title: string; summary: string; legitimacyDelta?: number; factionSatisfaction?: Record<KernelId, number>; institutionDelta?: number; recognitionDelta?: number; resistanceDelta?: number; debtDelta?: number; }
export interface StrategicEventState { id: KernelId; title: string; summary: string; category: 'political' | 'social' | 'economic' | 'diplomatic' | 'military' | 'scientific'; triggeredDay: number; status: 'active' | 'resolved' | 'expired'; optionIds: KernelId[]; resolvedOptionId?: KernelId; }
export interface StrategicSituationState { id: KernelId; title: string; summary: string; category: StrategicEventState['category']; progress: number; pressure: number; status: 'developing' | 'critical' | 'resolved' | 'failed'; linkedEventId?: KernelId; }
export interface InternationalOrganizationState { id: KernelId; name: string; memberPolityIds: KernelId[]; cohesion: number; legitimacy: number; commonBudget: number; rule: 'consensus' | 'weightedVote' | 'centralMandate'; }
export interface CooperationProjectState { id: KernelId; organizationId: KernelId; title: string; kind: 'research' | 'infrastructure' | 'relief' | 'space' | 'security'; contribution: number; partnerContribution: number; progress: number; requiredProgress: number; status: 'proposed' | 'active' | 'completed' | 'failed'; }
export interface DevelopmentEffect { legitimacy?: number; regionalCompliance?: number; factionSatisfaction?: Record<KernelId, number>; commonInstitution?: number; recognition?: number; resistance?: number; sharedInfrastructure?: number; logisticsCapacity?: number; logisticsRedundancy?: number; satelliteReliability?: number; orbitalCoverage?: number; civilianAvailability?: number; healthAccess?: number; debt?: number; }
export interface CivilizationTechnologyState { id: KernelId; title: string; domain: 'infrastructure' | 'agriculture' | 'space' | 'security' | 'medicine' | 'energy'; timelineYears: string; summary: string; failureCost: string; prerequisiteIds: KernelId[]; progress: number; workRequired: number; status: 'locked' | 'available' | 'researching' | 'completed'; effects: DevelopmentEffect; }
export interface CivilizationPolicyState { id: KernelId; title: string; category: 'economic' | 'political' | 'social' | 'diplomatic' | 'security' | 'ecological'; summary: string; durationDays: number; remainingDays: number; cooldownDays: number; status: 'available' | 'active' | 'cooldown'; dailyEffects: DevelopmentEffect; completionEffects?: DevelopmentEffect; }
export interface NationalDevelopmentProjectState { id: KernelId; title: string; category: 'infrastructure' | 'social' | 'security' | 'space' | 'ecological'; summary: string; requiredTechnologyIds: KernelId[]; progress: number; workRequired: number; status: 'locked' | 'available' | 'building' | 'completed'; effects: DevelopmentEffect; }
export type StrategicDirectionDomain = 'nation'|'politics'|'society'|'events'|'research'|'economy'|'construction'|'industry'|'equipment'|'logistics'|'regions'|'diplomacy'|'intelligence'|'military'|'army'|'navy'|'air'|'space'|'war'|'global'|'archive';
export interface StrategicDirectionMetrics { immediatePower: number; civilianBenefit: number; resilience: number; legitimacy: number; resourceCost: number; escalationRisk: number; }
export interface StrategicDirectionOption { id: KernelId; domain: StrategicDirectionDomain; title: string; stance: string; summary: string; beneficiary: string; burdenBearer: string; prerequisite: string; metrics: StrategicDirectionMetrics; consequences: string[]; }
export interface StrategicDirectionSelectionState { domain: StrategicDirectionDomain; selectedOptionId?: KernelId; selectedDay?: number; revisionCooldownDays: number; }
export interface CivilizationSystemsState {
  campaigns: Record<KernelId, CampaignState>; diplomaticIssues: Record<KernelId, DiplomaticIssueState>; negotiations: Record<KernelId, NegotiationState>; settlements: Record<KernelId, PeaceSettlementState>; occupations: Record<KernelId, OccupationState>;
  identity: PoliticalIdentityState; factions: Record<KernelId, DomesticFactionState>; events: Record<KernelId, StrategicEventState>; eventOptions: Record<KernelId, StrategicEventOption>; situations: Record<KernelId, StrategicSituationState>; organizations: Record<KernelId, InternationalOrganizationState>; cooperationProjects: Record<KernelId, CooperationProjectState>;
  technologies: Record<KernelId, CivilizationTechnologyState>; policies: Record<KernelId, CivilizationPolicyState>; developmentProjects: Record<KernelId, NationalDevelopmentProjectState>;
  strategicDirections: Record<StrategicDirectionDomain, StrategicDirectionSelectionState>;
  logistics: StrategicLogisticsState; demographics: DemographicDynamicsState; economy: EconomicAllocationState; politics: DomesticPoliticsState; maritime: MaritimeSystemState; aerospace: AerospaceSystemState; satellites: SatelliteSystemState; globalUnification: GlobalUnificationState;
}

export interface RelationState { id: KernelId; actorAId: KernelId; actorBId: KernelId; stance: 'unknown' | 'contact' | 'neutral' | 'cooperative' | 'tense' | 'hostile' | 'war'; trustAtoB: number; trustBtoA: number; agreementIds: KernelId[]; grievanceIds: KernelId[]; }
export interface AgreementState { id: KernelId; actorIds: KernelId[]; kind: 'trade' | 'transit' | 'research' | 'defense' | 'integration' | 'space'; status: 'proposed' | 'active' | 'expired' | 'broken'; startedDay?: number; expiresDay?: number; sourceIds: KernelId[]; }
export interface ObservationState { observerId: KernelId; subjectId: KernelId; fieldId: KernelId; knownValue?: number | string; confidence: number; observedDay: number; source: 'scout' | 'trade' | 'diplomacy' | 'sensor' | 'rumor'; }

export type EffectTiming = 'onStart' | 'perDay' | 'onComplete';
export type EffectSpec =
  | { kind: 'quantity'; timing: EffectTiming; target: ScopeRef; quantityId: KernelId; operation: 'add' | 'multiply' | 'set'; value: number; reasonKey: string; }
  | { kind: 'capability'; timing: EffectTiming; targetPolityId: KernelId; capability: CapabilityState; reasonKey: string; }
  | { kind: 'region'; timing: EffectTiming; region: RegionState; reassignCityIds?: KernelId[]; reasonKey: string; }
  | { kind: 'regionProgress'; timing: EffectTiming; regionId: KernelId; integrationDelta?: Partial<RegionState['integration']>; territoryDelta?: Partial<TerritoryState>; ruralPopulationDelta?: number; reasonKey: string; }
  | { kind: 'polityProfile'; timing: EffectTiming; polityId: KernelId; templateId: KernelId; archetype: PolityArchetype; simulationTier: SimulationTier; strategicIntent: string[]; reasonKey: string; }
  | { kind: 'city'; timing: EffectTiming; city: CityState; initialQuantities?: Record<KernelId, number>; reasonKey: string; }
  | { kind: 'populationTransfer'; timing: EffectTiming; fromCityId: KernelId; toCityId: KernelId; amount: number; reasonKey: string; }
  | { kind: 'lifecycle'; timing: EffectTiming; facilityId: KernelId; status: LifecycleStatus; reasonKey: string; }
  | { kind: 'facility'; timing: EffectTiming; facility: FacilityState; reasonKey: string; }
  | { kind: 'network'; timing: EffectTiming; network: NetworkState; reasonKey: string; }
  | { kind: 'design'; timing: EffectTiming; design: DesignState; reasonKey: string; }
  | { kind: 'productionLine'; timing: EffectTiming; productionLine: ProductionLineState; reasonKey: string; }
  | { kind: 'productionLineConfig'; timing: EffectTiming; productionLineId: KernelId; designId?: KernelId; stockpileId?: KernelId; status?: ProductionLineState['status']; dailyOutput?: number; efficiency?: number; assignedFactoryUnits?: number; baseOutputPerFactory?: number; efficiencyCap?: number; efficiencyGainPerDay?: number; productionFamilyId?: KernelId; rampUp?: number; inputAvailability?: number; maintenanceLoad?: number; reasonKey: string; }
  | { kind: 'industrialStrategy'; timing: EffectTiming; strategy: IndustrialStrategyState; reasonKey: string; }
  | { kind: 'stockpile'; timing: EffectTiming; stockpile: StockpileState; reasonKey: string; }
  | { kind: 'formation'; timing: EffectTiming; formation: FormationState; reasonKey: string; }
  | { kind: 'vessel'; timing: EffectTiming; vessel: VesselState; fleetId?: KernelId; reasonKey: string; }
  | { kind: 'spaceAsset'; timing: EffectTiming; spaceAsset: SpaceAssetState; reasonKey: string; }
  | { kind: 'spaceMission'; timing: EffectTiming; spaceMission: SpaceMissionState; reasonKey: string; }
  | { kind: 'fleet'; timing: EffectTiming; fleetId: KernelId; readinessDelta?: number; supplyDaysDelta?: number; vesselReadiness?: Array<{ vesselId: KernelId; readyDelta: number; repairingDelta: number }>; reasonKey: string; }
  | { kind: 'relation'; timing: EffectTiming; relationId: KernelId; deltaAtoB: number; deltaBtoA: number; reasonKey: string; };
export interface ResourceDemand { target: ScopeRef; quantityId: KernelId; amount: number; }
export interface StockpileDemand { stockpileId: KernelId; amount: number; }
export interface OperationPrerequisites { capabilityIds?: KernelId[]; facilityIds?: KernelId[]; networkIds?: KernelId[]; productionLineIds?: KernelId[]; completedOperationIds?: KernelId[]; designIds?: KernelId[]; }
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
  budget: BudgetState; industrialStrategy?: IndustrialStrategyState; designs: Record<KernelId, DesignState>; productionLines: Record<KernelId, ProductionLineState>; stockpiles: Record<KernelId, StockpileState>; formations: Record<KernelId, FormationState>; vessels: Record<KernelId, VesselState>;
  fleets: Record<KernelId, FleetState>; theatres: Record<KernelId, TheatreState>; spaceAssets: Record<KernelId, SpaceAssetState>; spaceMissions: Record<KernelId, SpaceMissionState>;
  relations: Record<KernelId, RelationState>; agreements: Record<KernelId, AgreementState>; observations: ObservationState[]; operations: Record<KernelId, OperationState>; ledger: LedgerEntry[];
  civilizationSystems?: CivilizationSystemsState;
}
