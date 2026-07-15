import type { StoredContractData } from '@/lib/contracts';
import {
  DPP_MONTHLY_THRESHOLD_2026_CZK,
  DPP_MAX_HOURS_PER_YEAR,
  ZP_TRIAL_MONTHS_LEADERSHIP,
  ZP_TRIAL_MONTHS_STANDARD,
} from '@/lib/legal-constants-2026';

const emptyLine = '—';

export {
  formatAmount,
  asText,
  formatDate,
  today,
} from '@/lib/i18n/lease-contract-en';

/** Czech-style amounts for explanatory UA annexes (e.g. 40 000). */
export function formatAmountCs(amount?: unknown): string {
  if (amount === null || amount === undefined || amount === '') return emptyLine;
  const num = Number(amount);
  if (!Number.isFinite(num)) return emptyLine;
  return num.toLocaleString('cs-CZ');
}

/** Czech-style dates for explanatory UA annexes (e.g. 1. 6. 2026). */
export function formatDateCs(value: unknown, fallback = emptyLine): string {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (!str) return fallback;
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${parseInt(day, 10)}. ${parseInt(month, 10)}. ${year}`;
  }
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, d, m, y] = slashMatch;
    return `${parseInt(d, 10)}. ${parseInt(m, 10)}. ${y}`;
  }
  return str;
}

export function pluralMonthsEn(count: number): string {
  const n = Math.abs(Math.trunc(count));
  return n === 1 ? '1 month' : `${n} months`;
}

export function pluralMonthsUa(count: number): string {
  const n = Math.abs(Math.trunc(count));
  if (n === 1) return '1 місяць';
  if (n >= 2 && n <= 4) return `${n} місяці`;
  return `${n} місяців`;
}

export function disputeClauseEn(d: StoredContractData): string {
  switch (d.disputeResolution) {
    case 'mediation':
      return 'The parties shall first seek an amicable settlement. If no agreement is reached, either party may use mediation under Act No. 202/2012 Coll. on mediation, or bring the dispute before the competent court of the Czech Republic.';
    default:
      return 'Disputes shall first be resolved amicably. If no agreement is reached, the dispute shall be decided by the competent court of the Czech Republic.';
  }
}

export function disputeClauseUa(d: StoredContractData): string {
  switch (d.disputeResolution) {
    case 'mediation':
      return 'Сторони спочатку намагаються вирішити спір мирно. За відсутності згоди — медіація за законом ЧР № 202/2012 Зб. про медіацію або компетентний суд Чехії.';
    default:
      return 'Спори спочатку вирішуються мирно. За відсутності згоди — компетентний суд Чехії.';
  }
}

export function disputeClauseLaborEn(): string {
  return 'Labour disputes shall be decided by the competent court under Section 9(1) of Act No. 99/1963 Coll., the Civil Procedure Code. The parties shall attempt amicable settlement before filing a claim.';
}

export function disputeClauseLaborUa(): string {
  return 'Трудові спори вирішує компетентний суд відповідно до § 9(1) закону ЧР № 99/1963 Зб. (OSŘ). Сторони зобов’язуються спочатку намагатися вирішити спір мирно.';
}

export const DPP_THRESHOLD_NOTE_EN = `For 2026, decisive monthly gross income for insurance participation on a work-performance agreement (DPP) with one employer is CZK ${DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ')}. When reached or exceeded, insurance participation and related employer obligations arise; below the threshold the maximum is therefore CZK 11,999. The employer fulfils reporting duties through the Single Monthly Employer Report (JMHZ) under current ČSSZ guidance.`;

export const DPP_THRESHOLD_NOTE_UA = `У 2026 році вирішальний місячний брутто-дохід для участі у страхуванні за DPP у одного роботодавця становить ${DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ')} Kč. Після досягнення цієї суми виникають страхування та пов’язані обов’язки; нижче порогу максимум становить 11 999 Kč. Роботодавець виконує звітні обов’язки через Єдиний місячний звіт роботодавця (JMHZ) за актуальними правилами ČSSZ.`;

export const DPP_HOURS_LIMIT_EN = `Work under a DPP must not exceed ${DPP_MAX_HOURS_PER_YEAR} hours per calendar year with one employer (Section 75(2) of the Labour Code).`;

export const DPP_HOURS_LIMIT_UA = `Обсяг роботи за DPP не може перевищувати ${DPP_MAX_HOURS_PER_YEAR} годин на календарний рік у одного роботодавця (§ 75(2) трудового кодексу ЧР).`;

export const DPP_VACATION_NOTE_UA =
  'Право на відпустку за DPP виникає за § 77a трудового кодексу ЧР (з 1. 1. 2024): договір має тривати безперервно щонайменше 4 тижні у того ж роботодавця, а працівник має відпрацювати щонайменше 4-кратний фіктивний тижневий робочий час (20 год). Розрахунок робить роботодавець за § 213 та § 77a.';

export const ZP_TRIAL_STANDARD_EN = ZP_TRIAL_MONTHS_STANDARD;
export const ZP_TRIAL_LEADERSHIP_EN = ZP_TRIAL_MONTHS_LEADERSHIP;
