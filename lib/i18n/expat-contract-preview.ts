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
      'This is the English translation of your contract, built from your inputs. In the PDF the primary Czech wording comes first, followed by this complete translation with the same numbering.',
    footer:
      'Preview only. After payment you receive the Czech PDF with the complete English translation of every article.',
  },
  ua: {
    kicker: 'Попередній перегляд',
    intro:
      'Це український переклад вашого договору з ваших даних. У PDF спочатку основний чеський текст, далі — цей повний переклад із тією самою нумерацією.',
    footer:
      'Лише перегляд. Після оплати — чеський PDF з повним українським перекладом кожної статті.',
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
