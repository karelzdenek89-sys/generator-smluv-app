import {
  DPP_MONTHLY_THRESHOLD_2026_CZK,
  MIN_WAGE_HOURLY_2026_CZK,
  MIN_WAGE_MONTHLY_2026_CZK,
} from '../legal-constants-2026';

export const MINIMUM_WAGE_2027_SOURCE = 'https://e-sbirka.gov.cz/sb/2026/171?zalozka=text';
export const DPP_THRESHOLD_2027_SOURCE = 'https://e-sbirka.gov.cz/sb/2026/184';

export const LABOR_RATES_2026 = {
  year: 2026,
  hourlyMinimum: MIN_WAGE_HOURLY_2026_CZK,
  monthlyMinimum: MIN_WAGE_MONTHLY_2026_CZK,
  dppMonthlyThreshold: DPP_MONTHLY_THRESHOLD_2026_CZK,
} as const;

export const LABOR_RATES_2027 = {
  year: 2027,
  hourlyMinimum: 148.3,
  monthlyMinimum: 24_900,
  dppMonthlyThreshold: 12_500,
} as const;

export const CURRENT_LABOR_TERMS_VERSION = 2;
export const LEGACY_LABOR_TERMS_VERSION = 1;

export function parseLaborDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const isoDate = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== isoDate ? null : date;
}

export function getLaborRates(startDate: unknown, fixedEndDate?: unknown) {
  const startYear = parseLaborDate(startDate)?.getUTCFullYear();
  const endYear = parseLaborDate(fixedEndDate)?.getUTCFullYear();

  // A fixed term has a single stated rate. With no breakdown of future hours
  // or pay changes, check it against the higher published floor it overlaps.
  return (startYear ?? 0) >= 2027 || (endYear ?? 0) >= 2027
    ? LABOR_RATES_2027
    : LABOR_RATES_2026;
}

export function getDppDocumentLaborRates(startDate: unknown, fixedEndDate?: unknown) {
  const start = getLaborRates(startDate);
  const last = fixedEndDate ? getLaborRates(startDate, fixedEndDate) : LABOR_RATES_2027;
  return start.year === last.year ? [start] : [start, last];
}

export function getProportionalMonthlyMinimum(fullTimeMinimum: number, weeklyHours: number) {
  return Math.ceil(fullTimeMinimum * Math.min(weeklyHours, 40) / 40 * 100) / 100;
}

export function formatHourlyMinimum(amount: number, locale: 'cs-CZ' | 'en-GB' | 'uk-UA' = 'cs-CZ') {
  return amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
