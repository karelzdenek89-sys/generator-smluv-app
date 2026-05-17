/**
 * Shared helpers for foreign-language section builders. Keeps formatting
 * locale-neutral so values like dates and amounts read naturally inside
 * an English (or other foreign) sentence even though the underlying user
 * data was entered in Czech.
 */

import type { Locale } from '../i18n/locales';
import type { ContractSection, StoredContractData } from '../contracts';

export type ParaPair = { title?: string; body: string[] };

export function pad(n: unknown): string {
  if (n === null || n === undefined) return '';
  return String(n);
}

export function fmtDate(value: unknown, locale: string = 'en-GB'): string {
  if (!value) return '';
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale);
}

export function fmtAmount(value: unknown): string {
  if (value === null || value === undefined || value === '') return '0';
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString('cs-CZ') : String(value);
}

export function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function ordinal(n: string | number): string {
  const s = String(n);
  if (s === '1') return '1st';
  if (s === '2') return '2nd';
  if (s === '3') return '3rd';
  return `${s}th`;
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

export type _D = StoredContractData; // re-export alias for brevity in builders
