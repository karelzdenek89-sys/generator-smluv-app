/**
 * Shared helpers for foreign-language section builders. Keeps formatting
 * locale-neutral so values like dates and amounts read naturally inside
 * an English (or other foreign) sentence even though the underlying user
 * data was entered in Czech.
 */

import type { Locale } from '../i18n/locales';
import type { ContractSection, StoredContractData } from '../contracts';

export type ParaPair = { title?: string; body: string[] };

/** Placeholder for an empty field — the same em dash the Czech builders print. */
export const EMPTY = '—';

/** Mirrors the Czech `asText`: trimmed value, or the fallback when empty. */
export function txt(value: unknown, fallback: string = EMPTY): string {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (str === '') return fallback;
  return str.length > 1000 ? `${str.substring(0, 1000)}…` : str;
}

/** Mirrors the Czech `formatAmount` (cs-CZ digit grouping, em dash when empty). */
export function amt(value: unknown): string {
  if (value === null || value === undefined || value === '') return EMPTY;
  const num = Number(value);
  return Number.isFinite(num) ? num.toLocaleString('cs-CZ') : EMPTY;
}

const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Mirrors the Czech `formatDate`: ISO dates from date inputs are rendered in the
 * target language (EN "1 October 2026", UA "01.10.2026"); anything else the
 * user typed is kept verbatim, an empty value becomes the em dash.
 */
export function dateIn(locale: 'en' | 'ua', value: unknown, fallback: string = EMPTY): string {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (!str) return fallback;
  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!iso) return str;
  const [, year, month, day] = iso;
  return locale === 'en'
    ? `${parseInt(day, 10)} ${EN_MONTHS[parseInt(month, 10) - 1]} ${year}`
    : `${day}.${month}.${year}`;
}

/** Today's date in the target language (used where the Czech builder prints today()). */
export function todayIn(locale: 'en' | 'ua'): string {
  const now = new Date();
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return dateIn(locale, iso);
}

/** Mirrors the Czech `disputeClause` in lib/contracts.ts. */
export function disputeClauseIn(locale: 'en' | 'ua', d: StoredContractData, isLaborLaw = false): string {
  if (isLaborLaw) {
    return locale === 'en'
      ? 'Employment disputes shall be decided by the court having subject-matter jurisdiction under § 9(1) of Act No. 99/1963 Coll., the Code of Civil Procedure. Before bringing an action, the parties shall attempt to settle the dispute amicably.'
      : 'Трудові спори вирішує суд, до предметної підсудності якого вони належать, відповідно до § 9 ч. 1 Закону № 99/1963 Sb., Цивільний процесуальний кодекс. Перед поданням позову сторони зобов’язані спробувати врегулювати спір мирним шляхом.';
  }
  if (d.disputeResolution === 'mediation') {
    return locale === 'en'
      ? 'The contracting parties undertake to resolve any disputes amicably in the first place. If no agreement is reached, either party may use mediation under Act No. 202/2012 Coll., on Mediation, or refer the matter to the court of the Czech Republic having subject-matter and territorial jurisdiction.'
      : 'Сторони договору зобов’язуються вирішувати можливі спори насамперед мирним шляхом. Якщо згоди не буде досягнуто, будь-яка зі сторін може скористатися медіацією відповідно до Закону № 202/2012 Sb., про медіацію, або звернутися до суду Чеської Республіки, до предметної та територіальної підсудності якого належить спір.';
  }
  return locale === 'en'
    ? 'Any disputes shall preferably be resolved amicably. If no agreement is reached, the dispute shall be decided by the court of the Czech Republic having subject-matter and territorial jurisdiction.'
    : 'Можливі спори вирішуватимуться переважно мирним шляхом. Якщо згоди не буде досягнуто, спір вирішуватиме суд Чеської Республіки, до предметної та територіальної підсудності якого він належить.';
}

function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Builds the per-section `translations` payload aligned with the CZ post-filter
 * body indices. Pass the locale builders that mirror the CZ conditional shape.
 *
 * Empty strings inside the returned body arrays are filtered out, exactly like
 * the CZ builder's `.filter(Boolean)` pass, so each foreign body item at
 * index `i` lines up 1-to-1 with `section.body[i]`.
 */
export function buildBilingualTranslations(
  builders: Partial<Record<Exclude<Locale, 'cs'>, () => ParaPair[]>>,
): Array<NonNullable<ContractSection['translations']>> {
  const per: Partial<Record<Exclude<Locale, 'cs'>, ParaPair[]>> = {};
  let sectionCount = 0;
  for (const [loc, fn] of Object.entries(builders) as Array<[Exclude<Locale, 'cs'>, () => ParaPair[]]>) {
    const out = fn();
    per[loc] = out;
    if (out.length > sectionCount) sectionCount = out.length;
  }

  const result: Array<NonNullable<ContractSection['translations']>> = [];
  for (let i = 0; i < sectionCount; i++) {
    const entry: NonNullable<ContractSection['translations']> = {};
    for (const loc of Object.keys(per) as Array<Exclude<Locale, 'cs'>>) {
      const sec = per[loc]?.[i];
      if (!sec) continue;
      const trimmedBody = sec.body.map(b => clean(b)).filter(b => b !== '');
      if (sec.title || trimmedBody.length > 0) {
        entry[loc] = { title: sec.title, body: trimmedBody };
      }
    }
    result.push(entry);
  }
  return result;
}

