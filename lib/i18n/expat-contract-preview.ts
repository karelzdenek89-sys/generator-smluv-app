import { buildContractSections, type StoredContractData } from '@/lib/contracts';
import type { AppLocale, ExpatContractType } from '@/lib/locale';
import {
  buildExpatTranslationSections,
  isExpatAnnexLocale,
} from '@/lib/i18n/expat-translation-registry';
import type { ContractPreviewLabels } from '@/lib/i18n/lease-preview';

const PREVIEW_LABELS: Record<'en' | 'ua', ContractPreviewLabels> = {
  en: {
    kicker: 'Guided preview',
    intro:
      'This shows the explanatory translation structure from your inputs. The primary Czech contract wording is generated in Czech in the PDF, followed by this explanatory annex.',
    footer:
      'Orientational preview only. After payment you receive the full Czech PDF plus the explanatory English translation annex.',
  },
  ua: {
    kicker: 'Попередній перегляд',
    intro:
      'Структура пояснювального перекладу з ваших даних. Обов’язковий чеський договір у PDF — чеською; далі — цей пояснювальний додаток.',
    footer:
      'Орієнтовний перегляд. Після оплати — повний чеський PDF і пояснювальний український додаток.',
  },
};

const PREVIEW_LABELS_CS: ContractPreviewLabels = {
  kicker: 'Náhled výstupu',
  intro: 'Průběžný náhled struktury dokumentu podle zadaných údajů.',
  footer: 'Zobrazen je orientační náhled. Finální výstup se sestaví podle vyplněných údajů.',
};

export function buildExpatPreviewSections(
  contractType: ExpatContractType,
  locale: AppLocale,
  data: StoredContractData,
) {
  if (!isExpatAnnexLocale(locale)) {
    return buildContractSections(data);
  }
  return buildExpatTranslationSections(contractType, locale, data);
}

export function getExpatPreviewLabels(locale: AppLocale): ContractPreviewLabels {
  if (locale === 'en' || locale === 'ua') return PREVIEW_LABELS[locale];
  return PREVIEW_LABELS_CS;
}

export function getExpatPreviewDateLocale(locale: AppLocale): string {
  if (locale === 'en') return 'en-GB';
  if (locale === 'ua') return 'uk-UA';
  return 'cs-CZ';
}
