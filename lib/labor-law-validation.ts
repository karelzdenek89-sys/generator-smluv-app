import {
  DPP_MAX_HOURS_PER_YEAR,
  MIN_WAGE_HOURLY_2026_CZK,
  MIN_WAGE_MONTHLY_2026_CZK,
  ZP_TRIAL_FIXED_TERM_MAX_RATIO,
  ZP_TRIAL_MONTHS_LEADERSHIP,
  ZP_TRIAL_MONTHS_STANDARD,
} from '@/lib/legal-constants-2026';
import { parseMoney } from '@/lib/money';

export type LaborValidationLocale = 'cs' | 'en' | 'ua';

export type LaborValidationIssue = {
  code:
    | 'hourly_wage_below_minimum'
    | 'monthly_wage_below_minimum'
    | 'notice_period_below_minimum'
    | 'trial_period_invalid'
    | 'trial_period_above_role_maximum'
    | 'trial_period_above_fixed_term_half'
    | 'fixed_term_dates_invalid'
    | 'dpp_hours_required_for_fixed_remuneration'
    | 'dpp_hours_above_maximum'
    | 'dpp_fixed_remuneration_below_minimum';
  field: string;
  actual?: number;
  minimum?: number;
  maximum?: number;
};

type EmploymentLegalData = {
  salaryType?: unknown;
  salary?: unknown;
  hourlyRate?: unknown;
  workHours?: unknown;
  noticePeriod?: unknown;
  trialPeriodMonths?: unknown;
  employmentType?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  isManager?: unknown;
  isExecutive?: unknown;
  isLeader?: unknown;
  jobTitle?: unknown;
};

type DppLegalData = {
  remunerationType?: unknown;
  hourlyRate?: unknown;
  totalRemuneration?: unknown;
  estimatedHours?: unknown;
  durationType?: unknown;
  startDate?: unknown;
  endDate?: unknown;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function finiteNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateOnly(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day
  ) return null;
  return parsed;
}

function addCalendarMonths(date: Date, months: number): Date {
  const targetMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(
    targetMonth.getUTCFullYear(),
    targetMonth.getUTCMonth() + 1,
    0,
  )).getUTCDate();
  targetMonth.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return targetMonth;
}

function isLeadershipRole(data: EmploymentLegalData): boolean {
  return /vedouc|ředitel|manager|director/i.test(String(data.jobTitle ?? ''))
    || Boolean(data.isManager || data.isExecutive || data.isLeader);
}

export function getMaximumFixedTermTrialMonths(
  startDateValue: unknown,
  endDateValue: unknown,
  roleMaximum: number,
): number | null {
  const startDate = parseDateOnly(startDateValue);
  const endDate = parseDateOnly(endDateValue);
  if (!startDate || !endDate || endDate.getTime() < startDate.getTime()) return null;

  // The fixed term includes its final calendar day. The probation period is
  // expressed by the builder in whole calendar months and must fit into one
  // half of that inclusive term (§ 35(5) ZP).
  const fixedTermDuration = endDate.getTime() + DAY_MS - startDate.getTime();
  const latestTrialEndExclusive = startDate.getTime()
    + fixedTermDuration * ZP_TRIAL_FIXED_TERM_MAX_RATIO;

  let maximum = 0;
  for (let months = 1; months <= roleMaximum; months += 1) {
    if (addCalendarMonths(startDate, months).getTime() <= latestTrialEndExclusive) {
      maximum = months;
    }
  }
  return maximum;
}

/** Defensive rendering fallback; checkout validation still rejects any rewrite. */
export function getEffectiveTrialPeriodMonths<T extends object>(input: T): number {
  const data = input as EmploymentLegalData;
  const requested = finiteNumber(data.trialPeriodMonths);
  if (requested === null || !Number.isInteger(requested) || requested <= 0) return 0;
  const roleMaximum = isLeadershipRole(data)
    ? ZP_TRIAL_MONTHS_LEADERSHIP
    : ZP_TRIAL_MONTHS_STANDARD;
  const fixedTermMaximum = data.employmentType === 'fixed'
    ? getMaximumFixedTermTrialMonths(data.startDate, data.endDate, roleMaximum)
    : null;
  return Math.min(requested, fixedTermMaximum === null ? roleMaximum : fixedTermMaximum);
}

export function getEmploymentLegalIssues(data: EmploymentLegalData): LaborValidationIssue[] {
  const issues: LaborValidationIssue[] = [];
  const salaryType = data.salaryType === 'hourly'
    || (!String(data.salary ?? '').trim() && String(data.hourlyRate ?? '').trim())
    ? 'hourly'
    : 'monthly';

  if (salaryType === 'hourly') {
    const hourlyRate = parseMoney(data.hourlyRate);
    if (hourlyRate !== null && hourlyRate < MIN_WAGE_HOURLY_2026_CZK) {
      issues.push({
        code: 'hourly_wage_below_minimum',
        field: 'hourlyRate',
        actual: hourlyRate,
        minimum: MIN_WAGE_HOURLY_2026_CZK,
      });
    }
  } else {
    const salary = parseMoney(data.salary);
    const weeklyHours = finiteNumber(data.workHours) ?? 40;
    if (salary !== null && weeklyHours > 0) {
      const proportionalMinimum = Math.ceil(
        MIN_WAGE_MONTHLY_2026_CZK * Math.min(weeklyHours, 40) / 40 * 100,
      ) / 100;
      if (salary < proportionalMinimum) {
        issues.push({
          code: 'monthly_wage_below_minimum',
          field: 'salary',
          actual: salary,
          minimum: proportionalMinimum,
        });
      }
    }
  }

  const noticePeriod = finiteNumber(data.noticePeriod);
  if (noticePeriod !== null && (!Number.isInteger(noticePeriod) || noticePeriod < 2)) {
    issues.push({
      code: 'notice_period_below_minimum',
      field: 'noticePeriod',
      actual: noticePeriod,
      minimum: 2,
    });
  }

  const trialPeriod = finiteNumber(data.trialPeriodMonths);
  if (trialPeriod !== null && (!Number.isInteger(trialPeriod) || trialPeriod < 0)) {
    issues.push({ code: 'trial_period_invalid', field: 'trialPeriodMonths', actual: trialPeriod });
    return issues;
  }

  if (trialPeriod !== null && trialPeriod > 0) {
    const roleMaximum = isLeadershipRole(data)
      ? ZP_TRIAL_MONTHS_LEADERSHIP
      : ZP_TRIAL_MONTHS_STANDARD;
    if (trialPeriod > roleMaximum) {
      issues.push({
        code: 'trial_period_above_role_maximum',
        field: 'trialPeriodMonths',
        actual: trialPeriod,
        maximum: roleMaximum,
      });
    }

    if (data.employmentType === 'fixed') {
      const startDate = parseDateOnly(data.startDate);
      const endDate = parseDateOnly(data.endDate);
      if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
        issues.push({ code: 'fixed_term_dates_invalid', field: 'endDate' });
      } else {
        const fixedTermMaximum = getMaximumFixedTermTrialMonths(
          data.startDate,
          data.endDate,
          roleMaximum,
        );
        if (fixedTermMaximum !== null && trialPeriod > fixedTermMaximum) {
          issues.push({
            code: 'trial_period_above_fixed_term_half',
            field: 'trialPeriodMonths',
            actual: trialPeriod,
            maximum: fixedTermMaximum,
          });
        }
      }
    }
  } else if (data.employmentType === 'fixed') {
    const startDate = parseDateOnly(data.startDate);
    const endDate = parseDateOnly(data.endDate);
    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      issues.push({ code: 'fixed_term_dates_invalid', field: 'endDate' });
    }
  }

  return issues;
}

export function getDppLegalIssues(data: DppLegalData): LaborValidationIssue[] {
  const issues: LaborValidationIssue[] = [];
  const estimatedHours = finiteNumber(data.estimatedHours);

  if (estimatedHours !== null && estimatedHours > DPP_MAX_HOURS_PER_YEAR) {
    issues.push({
      code: 'dpp_hours_above_maximum',
      field: 'estimatedHours',
      actual: estimatedHours,
      maximum: DPP_MAX_HOURS_PER_YEAR,
    });
  }

  const remunerationType = data.remunerationType === 'hourly'
    || (!String(data.totalRemuneration ?? '').trim() && String(data.hourlyRate ?? '').trim())
    ? 'hourly'
    : 'fixed';
  if (remunerationType === 'hourly') {
    const hourlyRate = parseMoney(data.hourlyRate);
    if (hourlyRate !== null && hourlyRate < MIN_WAGE_HOURLY_2026_CZK) {
      issues.push({
        code: 'hourly_wage_below_minimum',
        field: 'hourlyRate',
        actual: hourlyRate,
        minimum: MIN_WAGE_HOURLY_2026_CZK,
      });
    }
  } else {
    const totalRemuneration = parseMoney(data.totalRemuneration);
    if (totalRemuneration !== null && (estimatedHours === null || estimatedHours <= 0)) {
      issues.push({
        code: 'dpp_hours_required_for_fixed_remuneration',
        field: 'estimatedHours',
      });
    } else if (totalRemuneration !== null && estimatedHours !== null && estimatedHours > 0) {
      const effectiveHourlyRate = totalRemuneration / estimatedHours;
      if (effectiveHourlyRate < MIN_WAGE_HOURLY_2026_CZK) {
        issues.push({
          code: 'dpp_fixed_remuneration_below_minimum',
          field: 'totalRemuneration',
          actual: effectiveHourlyRate,
          minimum: MIN_WAGE_HOURLY_2026_CZK,
        });
      }
    }
  }

  if (data.durationType === 'fixed') {
    const startDate = parseDateOnly(data.startDate);
    const endDate = parseDateOnly(data.endDate);
    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      issues.push({ code: 'fixed_term_dates_invalid', field: 'endDate' });
    }
  }

  return issues;
}

function czk(value: number | undefined, locale: LaborValidationLocale): string {
  return new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : locale === 'ua' ? 'uk-UA' : 'en-GB', {
    minimumFractionDigits: value && value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function getLaborValidationMessage(
  issue: LaborValidationIssue,
  locale: LaborValidationLocale,
): string {
  const messages = {
    cs: {
      hourly_wage_below_minimum: `Hodinová mzda nebo odměna musí být v roce 2026 alespoň ${czk(issue.minimum, locale)} Kč.`,
      monthly_wage_below_minimum: `Zadaná měsíční mzda je pod poměrnou minimální mzdou ${czk(issue.minimum, locale)} Kč pro uvedený týdenní úvazek.`,
      notice_period_below_minimum: 'Obecná výpovědní doba musí být zadána v celých měsících a činit nejméně 2 měsíce; zvláštní jednoměsíční minimum podle § 52 písm. f) až h) se uplatní podle skutečného důvodu výpovědi.',
      trial_period_invalid: 'Zkušební dobu zadejte jako nezáporný počet celých měsíců.',
      trial_period_above_role_maximum: `Zkušební doba může činit nejvýše ${issue.maximum} měsíců (§ 35 ZP).`,
      trial_period_above_fixed_term_half: `U zadané doby určité lze ve formuláři sjednat zkušební dobu nejvýše ${issue.maximum} měsíců, aby nepřesáhla polovinu pracovního poměru (§ 35 odst. 5 ZP).`,
      fixed_term_dates_invalid: 'Datum konce doby určité nesmí předcházet dni nástupu.',
      dpp_hours_required_for_fixed_remuneration: 'U pevné odměny doplňte předpokládaný počet hodin, aby bylo možné ověřit minimální hodinovou odměnu.',
      dpp_hours_above_maximum: `Rozsah DPP nesmí překročit ${issue.maximum} hodin za kalendářní rok u jednoho zaměstnavatele (§ 75 ZP).`,
      dpp_fixed_remuneration_below_minimum: `Pevná odměna podle zadaného počtu hodin odpovídá pouze ${czk(issue.actual, locale)} Kč/hod.; minimum pro rok 2026 je ${czk(issue.minimum, locale)} Kč/hod.`,
    },
    en: {
      hourly_wage_below_minimum: `Hourly pay must be at least CZK ${czk(issue.minimum, locale)} in 2026.`,
      monthly_wage_below_minimum: `The monthly pay is below the proportional minimum of CZK ${czk(issue.minimum, locale)} for the stated weekly hours.`,
      notice_period_below_minimum: 'Enter the general notice period as a whole number of at least 2 months; the special one-month statutory minimum under Section 52(f)–(h) depends on the actual reason for notice.',
      trial_period_invalid: 'Enter probation as a non-negative whole number of months.',
      trial_period_above_role_maximum: `Probation may not exceed ${issue.maximum} months (Section 35).`,
      trial_period_above_fixed_term_half: `For this fixed term, the builder permits at most ${issue.maximum} whole months of probation so it does not exceed half of the employment term (Section 35(5)).`,
      fixed_term_dates_invalid: 'The fixed-term end date must not precede the start date.',
      dpp_hours_required_for_fixed_remuneration: 'For fixed remuneration, add estimated hours so the minimum hourly pay can be checked.',
      dpp_hours_above_maximum: `A DPP may not exceed ${issue.maximum} hours per calendar year for one employer (Section 75).`,
      dpp_fixed_remuneration_below_minimum: `Based on the entered hours, fixed remuneration equals only CZK ${czk(issue.actual, locale)}/hour; the 2026 minimum is CZK ${czk(issue.minimum, locale)}/hour.`,
    },
    ua: {
      hourly_wage_below_minimum: `Погодинна оплата у 2026 році має становити щонайменше ${czk(issue.minimum, locale)} Kč.`,
      monthly_wage_below_minimum: `Місячна зарплата нижча за пропорційний мінімум ${czk(issue.minimum, locale)} Kč для зазначеного тижневого часу.`,
      notice_period_below_minimum: 'Загальний строк попередження вкажіть цілою кількістю щонайменше 2 місяці; спеціальний мінімум один місяць за § 52(f)–(h) залежить від фактичної підстави.',
      trial_period_invalid: 'Вкажіть випробувальний строк як невід’ємну цілу кількість місяців.',
      trial_period_above_role_maximum: `Випробувальний строк не може перевищувати ${issue.maximum} місяців (§ 35).`,
      trial_period_above_fixed_term_half: `Для цього строкового договору форма допускає не більше ${issue.maximum} повних місяців випробування, щоб не перевищити половину строку (§ 35(5)).`,
      fixed_term_dates_invalid: 'Дата закінчення строкового договору не може передувати даті початку.',
      dpp_hours_required_for_fixed_remuneration: 'Для фіксованої винагороди вкажіть орієнтовні години, щоб перевірити мінімальну погодинну оплату.',
      dpp_hours_above_maximum: `DPP не може перевищувати ${issue.maximum} годин на календарний рік в одного роботодавця (§ 75).`,
      dpp_fixed_remuneration_below_minimum: `За вказаними годинами фіксована винагорода становить лише ${czk(issue.actual, locale)} Kč/год; мінімум у 2026 році — ${czk(issue.minimum, locale)} Kč/год.`,
    },
  } as const;

  return messages[locale][issue.code];
}
