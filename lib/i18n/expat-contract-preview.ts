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
      'This preview shows the contract structure assembled from your inputs. With the bilingual add-on, every Czech clause is paired with its English counterpart in one PDF.',
    footer:
      'Orientational preview only. The bilingual add-on produces one clause-paired CZ+EN PDF; the Czech wording prevails.',
  },
  ua: {
    kicker: 'Попередній перегляд',
    intro:
      'Цей перегляд показує структуру договору, складену з ваших даних. З двомовним доповненням кожне чеське положення попарно розміщується з українським в одному PDF.',
    footer:
      'Лише орієнтовний перегляд. Двомовне доповнення створює один PDF CZ+UA з попарними положеннями; перевагу має чеське формулювання.',
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
