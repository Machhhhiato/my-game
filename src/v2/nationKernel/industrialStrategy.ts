import type { IndustrialStrategyState, KernelId } from './types';

interface IndustrialModifierSet {
  factoryOutputModifier: number;
  efficiencyCapModifier: number;
  efficiencyGrowthModifier: number;
  conversionRetention: number;
  conversionSpeedModifier: number;
  concentrationOutputModifier: number;
  damageRiskModifier: number;
  civilianConstructionModifier: number;
  maintenanceDemandModifier: number;
  stabilityPressurePerDay: number;
}

const POLICIES: Record<KernelId, Partial<IndustrialModifierSet>> = {
  'policy.industry.civilian-economy': { factoryOutputModifier: -0.12, civilianConstructionModifier: 0.18, maintenanceDemandModifier: 0.9, stabilityPressurePerDay: 0 },
  'policy.industry.limited-mobilization': { factoryOutputModifier: 0.02, civilianConstructionModifier: 0, maintenanceDemandModifier: 1, stabilityPressurePerDay: 0 },
  'policy.industry.war-economy': { factoryOutputModifier: 0.15, civilianConstructionModifier: -0.22, maintenanceDemandModifier: 1.18, stabilityPressurePerDay: 0.015 },
};

const ROUTES: Record<KernelId, Partial<IndustrialModifierSet>> = {
  'technology-route.industry.balanced': { efficiencyGrowthModifier: 1, conversionRetention: 0.4, conversionSpeedModifier: 1, concentrationOutputModifier: 0.08, damageRiskModifier: 1 },
  'technology-route.industry.concentrated': { efficiencyCapModifier: 0.1, efficiencyGrowthModifier: 0.8, conversionRetention: 0.2, conversionSpeedModifier: 0.8, concentrationOutputModifier: 0.15, damageRiskModifier: 1.25 },
  'technology-route.industry.flexible': { efficiencyGrowthModifier: 1.25, conversionRetention: 0.7, conversionSpeedModifier: 1.35, concentrationOutputModifier: 0, damageRiskModifier: 0.7 },
};

const BASE: IndustrialModifierSet = {
  factoryOutputModifier: 0,
  efficiencyCapModifier: 0,
  efficiencyGrowthModifier: 1,
  conversionRetention: 0.35,
  conversionSpeedModifier: 1,
  concentrationOutputModifier: 0,
  damageRiskModifier: 1,
  civilianConstructionModifier: 0,
  maintenanceDemandModifier: 1,
  stabilityPressurePerDay: 0,
};

export const INDUSTRIAL_POLICY_IDS = Object.freeze(Object.keys(POLICIES));
export const INDUSTRIAL_TECHNOLOGY_ROUTE_IDS = Object.freeze(Object.keys(ROUTES));

export function createIndustrialStrategy(policyId: KernelId, technologyRouteId: KernelId): IndustrialStrategyState | null {
  const policy = POLICIES[policyId];
  const route = ROUTES[technologyRouteId];
  if (policy == null || route == null) return null;
  const merged = { ...BASE };
  for (const modifiers of [policy, route]) {
    for (const [key, value] of Object.entries(modifiers)) {
      if (value == null) continue;
      if (key === 'factoryOutputModifier' || key === 'efficiencyCapModifier' || key === 'concentrationOutputModifier' || key === 'civilianConstructionModifier' || key === 'stabilityPressurePerDay') merged[key] += value;
      else merged[key as keyof IndustrialModifierSet] = value;
    }
  }
  return { policyId, technologyRouteId, ...merged };
}
