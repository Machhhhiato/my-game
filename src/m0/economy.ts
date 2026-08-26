import { daysInMonth, nextGameDate, nextMonthStart } from './calendar';
import {
  RESOURCE_IDS,
  type GameDate,
  type M0State,
  type MonthlyLedger,
  type ResourceId,
  type Stocks,
} from './types';

export type ProtectedResource = 'water' | 'food' | 'commonParts';

export const SYSTEM_GUARD_DAYS: Record<ProtectedResource, { hard: number; operating: number }> = {
  water: { hard: 2, operating: 5 },
  food: { hard: 3, operating: 7 },
  commonParts: { hard: 3, operating: 5 },
};

export interface MaintenancePlan {
  repair: number;
  consume: number;
  backlogDelta: number;
}

export interface DailyResourceRate {
  inflow: number;
  outflow: number;
}

function livingPopulation(state: M0State): number {
  return state.population.normal + state.population.unableToWork + state.population.critical;
}

export function waterInflow(state: M0State): number {
  const workers = state.workforce.water;
  if (workers < 2) return 0;
  if (state.waterworks.repaired) return workers >= 6 ? 44 : workers >= 4 ? 36 : 28;
  return workers >= 6 ? 32 : workers >= 4 ? 28 : 24;
}

export function foodInflow(state: M0State): number {
  if (state.workforce.food < 3 || state.workforce.logistics < 2) return 0;
  return state.workforce.food >= 7 ? 42 : state.workforce.food >= 5 ? 30 : 20;
}

export function maintenancePlan(state: M0State): MaintenancePlan {
  if (state.workforce.maintenance < 2) {
    return { repair: 0, consume: 0, backlogDelta: 6 };
  }
  if (state.workforce.maintenance >= 5) {
    return state.maintenanceBacklog > 0
      ? { repair: 6, consume: 5, backlogDelta: -4 }
      : { repair: 6, consume: 3, backlogDelta: 0 };
  }
  if (state.workforce.maintenance >= 3) {
    return { repair: 3, consume: 3, backlogDelta: 0 };
  }
  return { repair: 1, consume: 2, backlogDelta: 2 };
}

export function availableAmount(state: M0State, resource: ResourceId): number {
  const account = state.monthly.resources[resource];
  return Math.max(0, state.stocks[resource].amount + account.accruedInflow - account.accruedOutflow);
}

export function dailyUse(state: M0State, resource: ProtectedResource): number {
  return resource === 'commonParts' ? 3 : Math.max(1, livingPopulation(state));
}

export function coverageDays(state: M0State, resource: ProtectedResource): number {
  return availableAmount(state, resource) / dailyUse(state, resource);
}

export function shouldUseHeadquartersSalvage(state: M0State): boolean {
  if (!state.headquartersSalvage.approved
    || state.oldRepairableParts > 0
    || state.workforce.maintenance < 5) return false;

  const freeParts = availableAmount(state, 'commonParts');
  const projectedAfterRoutineMaintenance = freeParts - Math.min(3, freeParts);
  const operatingAmount = SYSTEM_GUARD_DAYS.commonParts.operating * 3;
  return projectedAfterRoutineMaintenance < operatingAmount;
}

function commonPartsRate(state: M0State): DailyResourceRate {
  const plan = shouldUseHeadquartersSalvage(state)
    ? { repair: 4, consume: 3 }
    : maintenancePlan(state);
  const repairSource = shouldUseHeadquartersSalvage(state) ? plan.repair : state.oldRepairableParts;
  const available = availableAmount(state, 'commonParts');
  const repairCapacity = Math.max(0, state.stocks.commonParts.capacity - available + plan.consume);
  return {
    inflow: Math.min(plan.repair, repairSource, repairCapacity),
    outflow: plan.consume,
  };
}

export function dailyResourceRate(state: M0State, resource: ResourceId): DailyResourceRate {
  if (resource === 'water') return { inflow: waterInflow(state), outflow: livingPopulation(state) };
  if (resource === 'food') return { inflow: foodInflow(state), outflow: livingPopulation(state) };
  if (resource === 'commonParts') return commonPartsRate(state);
  return { inflow: 0, outflow: 0 };
}

export function createEmptyMonthlyLedger(date: GameDate, stocks: Stocks): MonthlyLedger {
  const resources = Object.fromEntries(RESOURCE_IDS.map((resource) => [resource, {
    openingAmount: stocks[resource].amount,
    accruedInflow: 0,
    accruedOutflow: 0,
    accruedOverflow: 0,
    currentDailyInflow: 0,
    currentDailyOutflow: 0,
    projectedRemainingInflow: 0,
    projectedRemainingOutflow: 0,
    projectedClosingAmount: stocks[resource].amount,
    exhaustionDate: null,
  }])) as MonthlyLedger['resources'];

  return {
    year: date.year,
    month: date.month,
    processedDays: date.day - 1,
    settlementDate: nextMonthStart(date),
    resources,
  };
}

function advanceDateBy(date: GameDate, days: number): GameDate {
  let result = date;
  for (let index = 0; index < days; index += 1) result = nextGameDate(result);
  return result;
}

export function refreshMonthlyProjection(state: M0State): void {
  const remainingDays = daysInMonth(state.calendar.year, state.calendar.month) - state.calendar.day + 1;
  state.monthly.processedDays = state.calendar.day - 1;

  for (const resource of RESOURCE_IDS) {
    const stock = state.stocks[resource];
    const account = state.monthly.resources[resource];
    const rate = dailyResourceRate(state, resource);
    let balance = availableAmount(state, resource);
    let projectedInflow = 0;
    let projectedOutflow = 0;
    let exhaustionDate: GameDate | null = null;

    for (let offset = 0; offset < remainingDays; offset += 1) {
      const inflow = Math.max(0, Math.min(rate.inflow, stock.capacity - balance + rate.outflow));
      const outflow = Math.max(0, Math.min(rate.outflow, balance + inflow));
      const shortageAlreadyActive = (resource === 'water' || resource === 'food')
        && state.resourceShortages[resource];
      if (outflow < rate.outflow
        && (resource === 'water' || resource === 'food')
        && !shortageAlreadyActive
        && exhaustionDate === null) {
        exhaustionDate = advanceDateBy(state.calendar, offset);
      }
      balance = Math.max(0, Math.min(stock.capacity, balance + inflow - outflow));
      projectedInflow += inflow;
      projectedOutflow += outflow;
    }

    account.currentDailyInflow = rate.inflow;
    account.currentDailyOutflow = rate.outflow;
    account.projectedRemainingInflow = projectedInflow;
    account.projectedRemainingOutflow = projectedOutflow;
    account.projectedClosingAmount = balance;
    account.exhaustionDate = exhaustionDate;
  }
}
