import type { GameDate } from './types';

const DAYS_BEFORE_MONTH = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334] as const;

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  return 31;
}

export function isValidGameDate(date: GameDate): boolean {
  return Number.isInteger(date.year)
    && date.year >= 1
    && Number.isInteger(date.month)
    && date.month >= 1
    && date.month <= 12
    && Number.isInteger(date.day)
    && date.day >= 1
    && date.day <= daysInMonth(date.year, date.month);
}

export function nextGameDate(date: GameDate): GameDate {
  const lastDay = daysInMonth(date.year, date.month);
  if (date.day < lastDay) return { ...date, day: date.day + 1 };
  if (date.month < 12) return { year: date.year, month: date.month + 1, day: 1 };
  return { year: date.year + 1, month: 1, day: 1 };
}

export function nextMonthStart(date: Pick<GameDate, 'year' | 'month'>): GameDate {
  return date.month === 12
    ? { year: date.year + 1, month: 1, day: 1 }
    : { year: date.year, month: date.month + 1, day: 1 };
}

export function compareGameDates(left: GameDate, right: GameDate): number {
  return gameDateOrdinal(left) - gameDateOrdinal(right);
}

export function gameDateOrdinal(date: GameDate): number {
  const completedYears = date.year - 1;
  const leapDays = Math.floor(completedYears / 4)
    - Math.floor(completedYears / 100)
    + Math.floor(completedYears / 400);
  const leapAdjustment = date.month > 2 && isLeapYear(date.year) ? 1 : 0;
  return completedYears * 365
    + leapDays
    + DAYS_BEFORE_MONTH[date.month]
    + leapAdjustment
    + date.day - 1;
}

export function formatGameDate(date: GameDate): string {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}
