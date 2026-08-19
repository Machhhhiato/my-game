import {
  advanceNationKernelDays,
  createGlobalUnificationPlaytestState,
  globalUnificationReadiness,
  ratifyGlobalSettlement,
  setEconomicAllocation,
  setOccupationApproach,
  validateNationKernel,
} from '../src/v2/nationKernel';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

let state = createGlobalUnificationPlaytestState();
const negotiation = state.civilizationSystems!.negotiations['negotiation.final-order'];
assert(negotiation.status === 'accepted' && negotiation.settlementId != null, 'playtest should begin with a ratifiable settlement');
state = ratifyGlobalSettlement(state, negotiation.settlementId);
state = setEconomicAllocation(state, { militaryShare: .21, civilianShare: .28, reconstructionShare: .24, researchShare: .12, logisticsShare: .15 });
state = setOccupationApproach(state, 'occupation.final-bloc', 25, 30);
state = advanceNationKernelDays(state, 720);

const readiness = globalUnificationReadiness(state);
const validation = validateNationKernel(state);
assert(validation.ok, validation.errors.join(', '));
assert(state.civilizationSystems!.globalUnification.stage === 'globalUnion', 'recommended playtest route did not reach global union in two years');
assert(readiness != null && Object.values(readiness).every((item) => item.met), 'playtest route bypassed or missed a global-unification gate');

console.log(JSON.stringify({
  ok: true,
  stage: state.civilizationSystems!.globalUnification.stage,
  occupation: state.civilizationSystems!.occupations['occupation.final-bloc'].status,
  debtRatio: state.civilizationSystems!.economy.debt / state.civilizationSystems!.economy.output,
  readiness,
}, null, 2));
