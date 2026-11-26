import { buildContractSections, type ContractSection, type StoredContractData } from '@/lib/contracts';
import { buildExpatTranslationSections } from '@/lib/i18n/expat-translation-registry';
import type { LeasePreviewForm } from '@/lib/i18n/lease-preview';
import type { AppLocale } from '@/lib/locale';

export function buildLeasePreviewSections(
  locale: AppLocale,
  form: LeasePreviewForm,
  packageKey: string | null,
): ContractSection[] {
  const payload = {
    ...form,
    contractType: 'lease',
    packageKey,
    lang: locale,
    utilitiesIncludedText: '',
    tier: 'basic',
  } as StoredContractData;

  if (locale === 'en' || locale === 'ua') return buildExpatTranslationSections('lease', locale, payload);
  return buildContractSections(payload);
}
