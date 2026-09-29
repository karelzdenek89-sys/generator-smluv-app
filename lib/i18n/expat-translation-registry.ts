import { buildContractSections, type ContractSection, type StoredContractData } from '@/lib/contracts';
import type { AppLocale, ExpatContractType } from '@/lib/locale';
import { isExpatContract } from '@/lib/locale';

export type ExpatAnnexLocale = 'en' | 'ua';

/**
 * Note printed under an annex title whose Czech counterpart is a form drawn by
 * the PDF renderer (e.g. the handover protocol) rather than prose to translate.
 */
const FORM_ANNEX_NOTE: Record<ExpatAnnexLocale, string> = {
  en: 'This annex is a form in the Czech part of this document; it is completed and signed there.',
  ua: 'Цей додаток є формою в чеській частині цього документа; заповнюється та підписується там.',
};

export function isExpatAnnexLocale(locale: AppLocale): locale is ExpatAnnexLocale {
  return locale === 'en' || locale === 'ua';
}

export function hasExpatTranslationAnnex(
  contractType: string,
  locale: AppLocale,
): locale is ExpatAnnexLocale {
  return isExpatAnnexLocale(locale) && isExpatContract(contractType as ExpatContractType);
}

export function isTranslatedSignatureTitle(title: string): boolean {
  const upper = title.toUpperCase();
  return upper.includes('SIGNATURES') || upper.includes('ПІДПИСИ');
}

/**
 * The complete foreign-language rendering of the Czech contract.
 *
 * It is read from the translations that lib/contracts-i18n attaches to every
 * Czech section, paragraph by paragraph — so the annex and the preview always
 * carry the same articles, numbering and clauses as the Czech text, for every
 * tier, package and option. scripts/translation-parity-tests.ts guarantees
 * each Czech paragraph has its translation; a missing one falls back to the
 * Czech wording rather than silently disappearing.
 */
export function buildExpatTranslationSections(
  contractType: ExpatContractType,
  locale: ExpatAnnexLocale,
  data: StoredContractData,
): ContractSection[] {
  return buildContractSections({ ...data, contractType }).map((section) => {
    const translation = section.translations?.[locale];
    const title = translation?.title?.trim() || section.title;
    const body = translation?.body && translation.body.length === section.body.length
      ? translation.body
      : section.body;
    if (body.length === 0 && !isTranslatedSignatureTitle(title)) {
      return { title, body: [FORM_ANNEX_NOTE[locale]] };
    }
    return { title, body };
  });
}
