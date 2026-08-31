import type { M0State } from './types';

type PopulationAccountingState = Pick<M0State, 'population'> & Partial<Pick<M0State, 'settlement'>>;

export function actionTeamLivingPopulation(state: Pick<M0State, 'population'>): number {
  return state.population.normal + state.population.unableToWork + state.population.critical;
}

export function supportedPopulation(state: PopulationAccountingState): number {
  return actionTeamLivingPopulation(state) + (state.settlement?.servedPopulation ?? 0);
}

export function mobileSettlementWorkforce(state: Partial<Pick<M0State, 'settlement'>>): number {
  return state.settlement
    ? Math.max(0, state.settlement.workforceEligible - state.settlement.workforceAssigned)
    : 0;
}

export function unifiedWorkablePopulation(state: PopulationAccountingState): number {
  return state.population.normal + mobileSettlementWorkforce(state);
}
