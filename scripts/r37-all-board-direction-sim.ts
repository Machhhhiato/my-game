import {
  advanceNationKernelDays,
  createGlobalUnificationPlaytestState,
  selectStrategicDirection,
  strategicBoardObjects,
  strategicDirectionOptions,
  validateNationKernel,
} from '../src/v2/nationKernel';
import type { NationKernelState, StrategicDirectionDomain } from '../src/v2/nationKernel';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const catalog = strategicDirectionOptions();
const domains = [...new Set(Object.values(catalog).map((option) => option.domain))] as StrategicDirectionDomain[];

function withVariant(state: NationKernelState, variant: 1 | 2 | 4): NationKernelState {
  return domains.reduce((next, domain) => {
    const option = Object.values(catalog).find((item) => item.domain === domain && item.id === `direction.${domain}.${variant}`);
    assert(option != null, `missing ${domain} direction ${variant}`);
    return selectStrategicDirection(next, domain, option.id);
  }, state);
}

function run(variant: 1 | 2 | 4, days: number): NationKernelState {
  const state = advanceNationKernelDays(withVariant(createGlobalUnificationPlaytestState(), variant), days);
  const validation = validateNationKernel(state);
  assert(validation.ok, validation.errors.join(', '));
  const objects = strategicBoardObjects(state);
  assert(domains.every((domain) => objects[domain].length === 4), 'every board must expose four runtime objects');
  assert(Object.values(objects).flat().every((object) => [object.capacity, object.readiness, object.pressure].every(Number.isFinite)), 'runtime objects contain an invalid metric');
  return state;
}

const horizons = [30, 90, 360, 720].map((days) => {
  const command = run(1, days); const distributed = run(2, days); const care = run(4, days);
  const summarize = (state: NationKernelState) => { const systems = state.civilizationSystems!; const campaign = systems.campaigns['campaign.final-corridor']; return { civilian: systems.economy.civilianAvailability, legitimacy: systems.politics.legitimacy, compliance: systems.politics.regionalCompliance, effectiveLogistics: systems.logistics.effectiveCapacity, campaignLosses: campaign.attackerPersonnelLosses, campaignControl: campaign.control, institution: systems.globalUnification.commonInstitutionScore, recognition: systems.globalUnification.externalRecognition, archiveEntries: state.ledger.length }; };
  return { days, command: summarize(command), distributed: summarize(distributed), care: summarize(care) };
});

assert(horizons[0].care.civilian > horizons[0].command.civilian, 'care route did not improve civilian availability');
assert(horizons[0].distributed.effectiveLogistics > horizons[0].care.effectiveLogistics, 'distributed route did not preserve its logistics advantage');
assert(horizons[0].command.campaignControl > horizons[0].care.campaignControl, 'command route did not retain its military tempo tradeoff');
console.log(JSON.stringify({ ok: true, domains: domains.length, runtimeObjects: domains.length * 4, horizons }, null, 2));
