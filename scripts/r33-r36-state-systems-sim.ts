import { advanceNationKernelDays, setEconomicAllocation, validateNationKernel } from '../src/v2/nationKernel';
import { createCivilizationTestState } from './civilization-sim-fixture';
import type { NationKernelState } from '../src/v2/nationKernel/types';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const base = createCivilizationTestState();
const centralized = structuredClone(base) as NationKernelState; centralized.civilizationSystems!.logistics.freightCapacity = 105; centralized.civilizationSystems!.logistics.redundancy = 8; centralized.civilizationSystems!.logistics.disruption = 48; centralized.civilizationSystems!.maritime.routeSecurity = 30;
const redundant = structuredClone(base) as NationKernelState; redundant.civilizationSystems!.logistics.freightCapacity = 72; redundant.civilizationSystems!.logistics.redundancy = 82; redundant.civilizationSystems!.logistics.disruption = 18; redundant.civilizationSystems!.maritime.routeSecurity = 76;
const centralizedAfter = advanceNationKernelDays(centralized, 1); const redundantAfter = advanceNationKernelDays(redundant, 1);
assert(redundantAfter.civilizationSystems!.logistics.effectiveCapacity > centralizedAfter.civilizationSystems!.logistics.effectiveCapacity, 'redundant multimodal logistics did not outperform a disrupted central corridor');
assert(redundantAfter.civilizationSystems!.logistics.bottleneck < centralizedAfter.civilizationSystems!.logistics.bottleneck, 'redundancy did not reduce civilian and military bottlenecks');

let warEconomy = setEconomicAllocation(base, { militaryShare: 0.46, civilianShare: 0.16, reconstructionShare: 0.08, researchShare: 0.1, logisticsShare: 0.2 });
let balancedEconomy = setEconomicAllocation(base, { militaryShare: 0.22, civilianShare: 0.32, reconstructionShare: 0.16, researchShare: 0.14, logisticsShare: 0.16 });
warEconomy.civilizationSystems!.politics.emergencyPower = 72; warEconomy.civilizationSystems!.demographics.displaced = 90_000; warEconomy.civilizationSystems!.demographics.warCasualties = 140;
balancedEconomy.civilizationSystems!.politics.emergencyPower = 12; balancedEconomy.civilizationSystems!.demographics.displaced = 90_000; balancedEconomy.civilizationSystems!.demographics.warCasualties = 20;
warEconomy = advanceNationKernelDays(warEconomy, 360); balancedEconomy = advanceNationKernelDays(balancedEconomy, 360);
const war = warEconomy.civilizationSystems!; const balanced = balancedEconomy.civilizationSystems!;
assert(war.economy.civilianAvailability < balanced.economy.civilianAvailability && war.economy.inflationPressure > balanced.economy.inflationPressure, 'military-heavy allocation did not create civilian scarcity and inflation pressure');
assert(war.politics.legitimacy < balanced.politics.legitimacy && war.politics.polarization > balanced.politics.polarization && war.politics.regionalCompliance < balanced.politics.regionalCompliance, 'emergency mobilization did not create domestic political costs');
assert(war.demographics.healthAccess < balanced.demographics.healthAccess && war.demographics.householdBurden > balanced.demographics.householdBurden, 'civilian allocation did not affect health and household burden');
assert(balanced.demographics.displaced < war.demographics.displaced, 'reconstruction allocation did not resettle displaced population faster');
assert(balanced.demographics.workforceParticipation > war.demographics.workforceParticipation, 'health and household conditions did not affect workforce participation');
for (const state of [centralizedAfter, redundantAfter, warEconomy, balancedEconomy]) { const validation = validateNationKernel(state); assert(validation.ok, validation.errors.join(', ')); }

console.log(JSON.stringify({ ok: true, logisticsShock: { centralized: centralizedAfter.civilizationSystems!.logistics, redundant: redundantAfter.civilizationSystems!.logistics }, economy360Days: { war: war.economy, balanced: balanced.economy }, society360Days: { war: war.demographics, balanced: balanced.demographics }, politics360Days: { war: war.politics, balanced: balanced.politics } }, null, 2));
