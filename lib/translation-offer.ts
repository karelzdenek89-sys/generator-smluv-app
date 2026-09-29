import type { ContractType } from './contracts';
import { normalizeLocale } from './locale';

/** Contracts that have a complete EN/UA translation (lib/contracts-i18n). */
export const TRANSLATED_CONTRACTS: readonly ContractType[] = [
  'lease',
  'car_sale',
  'employment',
  'dpp',
  'sublease',
  'power_of_attorney',
];

export type TranslationLanguage = 'en' | 'ua';

/**
 * Buyers who fill the form in English or Ukrainian get the complete translation
 * of the contract included in the price — they are exactly the people who need
 * it, and the landing pages and preview already show them the translated text.
 * Czech-language buyers (e.g. a landlord letting to a foreigner) can still add
 * it as the paid `bilingual_annex` add-on.
 */
export function isTranslationIncluded(contractType: unknown, locale: unknown): boolean {
  const normalized = normalizeLocale(locale);
  return (normalized === 'en' || normalized === 'ua')
    && (TRANSLATED_CONTRACTS as readonly string[]).includes(String(contractType ?? ''));
}

export function includedTranslationLanguage(contractType: unknown, locale: unknown): TranslationLanguage | null {
  if (!isTranslationIncluded(contractType, locale)) return null;
  return normalizeLocale(locale) === 'ua' ? 'ua' : 'en';
}

export const INCLUDED_TRANSLATION_ITEM: Record<TranslationLanguage, string> = {
  en: 'Complete English translation of the contract, article by article — included in the price',
  ua: 'Повний переклад договору українською, стаття за статтею — включено в ціну',
};
