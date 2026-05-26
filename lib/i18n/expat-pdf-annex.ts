import type { ExpatContractType } from '@/lib/locale';
import type { StoredContractData } from '@/lib/contracts';
import { normalizeLocale } from '@/lib/locale';
import {
  EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_CS,
  EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK,
} from '@/lib/i18n/safety-copy';
import { hasExpatTranslationAnnex } from '@/lib/i18n/expat-translation-registry';
import { hasCheckoutAddon } from '@/lib/checkout-addons';

export type ExpatAnnexLocale = 'en' | 'ua';

export type ExpatAnnexMeta = {
  title: string;
  header: string;
  intro: string;
  nextPageHint: string;
};

const CONTRACT_LABELS: Record<ExpatContractType, { en: string; ua: string }> = {
  lease: { en: 'rental agreement', ua: 'договір оренди' },
  employment: { en: 'employment contract', ua: 'трудовий договір' },
  dpp: { en: 'agreement to perform work (DPP)', ua: 'договір DPP' },
  sublease: { en: 'sublease agreement', ua: 'договір піднайму' },
  power_of_attorney: { en: 'power of attorney', ua: 'довіреність' },
  car_sale: { en: 'vehicle purchase agreement', ua: 'купівельна угода на авто' },
};

const LABOR_EXPAT_TYPES = new Set<ExpatContractType>(['employment', 'dpp']);

/** Ukrainian annex is a short overview of key terms, not a clause-by-clause translation. */
export function isUaSummaryAnnex(contractType: ExpatContractType): boolean {
  return contractType === 'dpp';
}

export function getPage1ExpatNoticeLines(data: StoredContractData): string[] {
  const locale = normalizeLocale(data.lang);
  if (locale === 'cs' || !isExpatContractType(data.contractType)) return [];

  const translationAnnex =
    hasCheckoutAddon(data, 'bilingual_annex') &&
    hasExpatTranslationAnnex(data.contractType, locale);

  if (locale === 'ua' && translationAnnex) {
    if (isUaSummaryAnnex(data.contractType)) {
      return [
        'ЧЕСЬКИЙ ДОГОВІР + ПОЯСНЮВАЛЬНИЙ ОГЛЯД УКРАЇНСЬКОЮ',
        'Нижче — чеський текст договору. Далі в PDF — стислий огляд основних умов (не повний переклад). У разі розбіжностей перевага має чеське формулювання.',
      ];
    }
    return [
      'ЧЕСЬКИЙ ДОГОВІР З ПОЯСНЮВАЛЬНИМ УКРАЇНСЬКИМ ДОДАТКОМ',
      'Нижче — чеський текст договору. Далі — пояснювальний український переклад; він не є засвідченим чи офіційним. У разі розбіжностей перевага має чеське формулювання.',
    ];
  }

  if (translationAnnex) {
    return [
      'CZECH CONTRACT WITH EXPLANATORY ENGLISH TRANSLATION',
      'The contract body below is in Czech. An explanatory English translation follows later in this PDF. It is not certified or official. In case of discrepancy, the Czech wording prevails.',
    ];
  }

  if (locale === 'ua') {
    return [
      'ЧЕСЬКИЙ ДОКУМЕНТ З УКРАЇНСЬКИМИ ПІДКАЗКАМИ',
      'Форма була заповнена з українськими підказками. Згенерований документ залишається насамперед чеською мовою.',
    ];
  }

  return [
    'ENGLISH-GUIDED CZECH CONTRACT',
    'English form guidance is available. The generated document remains primarily in Czech.',
  ];
}

function isExpatContractType(contractType: string): contractType is ExpatContractType {
  return contractType in CONTRACT_LABELS;
}

function laborAnnexIntroUa(label: string): string {
  return [
    `На попередніх сторінках — чеський ${label}.`,
    'Цей додаток — стислий пояснювальний огляд основних умов українською, не повний переклад усіх положень.',
    'У разі розбіжностей перевага має чеське формулювання.',
    EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_CS,
    EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK,
    'SmlouvaHned не є юридичною фірмою і не надає юридичних чи імміграційних консультацій.',
  ].join(' ');
}

export function getExpatAnnexMeta(
  contractType: ExpatContractType,
  locale: ExpatAnnexLocale,
): ExpatAnnexMeta {
  const label = CONTRACT_LABELS[contractType][locale];

  if (locale === 'ua') {
    if (isUaSummaryAnnex(contractType)) {
      return {
        title: 'Пояснювальний український огляд основних умов',
        header: 'ПОЯСНЮВАЛЬНИЙ ОГЛЯД ОСНОВНИХ УМОВ',
        intro: laborAnnexIntroUa(label),
        nextPageHint: 'Огляд починається на наступній сторінці.',
      };
    }

    const laborIntro = LABOR_EXPAT_TYPES.has(contractType)
      ? [
          `На попередніх сторінках — чеський ${label}.`,
          'Цей додаток — пояснювальний український переклад для зручності, не офіційний і не засвідчений.',
          'У разі розбіжностей перевага має чеське формулювання.',
          EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_CS,
          EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK,
          'SmlouvaHned не є юридичною фірмою і не надає юридичних чи імміграційних консультацій.',
        ].join(' ')
      : [
          `На попередніх сторінках — чеський ${label}.`,
          'Цей додаток — пояснювальний український переклад для зручності, не офіційний і не засвідчений.',
          'У разі розбіжностей перевага має чеське формулювання.',
          'SmlouvaHned не є юридичною фірмою і не надає юридичних чи імміграційних консультацій.',
        ].join(' ');

    return {
      title: 'Пояснювальний додаток українською',
      header: 'Пояснювальний додаток українською',
      intro: laborIntro,
      nextPageHint: 'Переклад починається на наступній сторінці.',
    };
  }

  const enLaborIntro = LABOR_EXPAT_TYPES.has(contractType)
    ? `The Czech ${label} in the preceding pages contains the primary Czech wording. This annex is an explanatory English translation for easier understanding only. It is not a certified or official translation. In case of discrepancy, the Czech wording prevails. This document does not verify whether a foreign national is allowed to work in the Czech Republic. Before signing, the parties should verify any applicable work permit, residence or employment requirements. SmlouvaHned is a software tool, not a law firm, and does not provide legal or immigration advice.`
    : `The Czech ${label} in the preceding pages contains the primary Czech wording. This annex is an explanatory English translation for easier understanding only. It is not a certified or official translation. In case of discrepancy, the Czech wording prevails. SmlouvaHned is a software tool, not a law firm, and does not provide legal or immigration advice.`;

  return {
    title: 'Explanatory English Translation Annex',
    header: 'Explanatory English Translation Annex',
    intro: enLaborIntro,
    nextPageHint: 'The translation below starts on the next page.',
  };
}
