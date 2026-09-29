import type { ExpatContractType } from '@/lib/locale';
import type { StoredContractData } from '@/lib/contracts';
import { normalizeLocale } from '@/lib/locale';
import {
  EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_CS,
  EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK,
} from '@/lib/i18n/safety-copy';
import { hasExpatTranslationAnnex } from '@/lib/i18n/expat-translation-registry';
import { includesTranslationAnnex } from '@/lib/checkout-addons';

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

export function getPage1ExpatNoticeLines(data: StoredContractData): string[] {
  const documentLocale = normalizeLocale(data.lang);
  const annexLocale = normalizeLocale(data.annexLanguage ?? data.lang);
  if (!isExpatContractType(data.contractType)) return [];

  const translationAnnex =
    includesTranslationAnnex(data) &&
    hasExpatTranslationAnnex(data.contractType, annexLocale);

  if (documentLocale === 'cs' && !translationAnnex) return [];

  if (annexLocale === 'ua' && translationAnnex) {
    return [
      'ЧЕСЬКИЙ ДОГОВІР З ПОВНИМ ПОЯСНЮВАЛЬНИМ ПЕРЕКЛАДОМ УКРАЇНСЬКОЮ',
      'Нижче — чеський текст договору. Далі — повний пояснювальний український переклад усіх статей із тією самою нумерацією; він не є засвідченим чи офіційним. У разі розбіжностей перевага має чеське формулювання.',
    ];
  }

  if (translationAnnex) {
    return [
      'CZECH CONTRACT WITH A COMPLETE EXPLANATORY ENGLISH TRANSLATION',
      'The contract body below is in Czech. A complete explanatory English translation of every article, with the same numbering, follows later in this PDF. It is not certified or official. In case of discrepancy, the Czech wording prevails.',
    ];
  }

  if (documentLocale === 'ua') {
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

export function getExpatAnnexMeta(
  contractType: ExpatContractType,
  locale: ExpatAnnexLocale,
): ExpatAnnexMeta {
  const label = CONTRACT_LABELS[contractType][locale];

  if (locale === 'ua') {
    const laborIntro = LABOR_EXPAT_TYPES.has(contractType)
      ? [
          `На попередніх сторінках — чеський ${label}.`,
          'Цей додаток — повний пояснювальний український переклад усіх статей із тією самою нумерацією, наданий для зручності; він не офіційний і не засвідчений.',
          'У разі розбіжностей перевага має чеське формулювання.',
          EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_CS,
          EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK,
          'SmlouvaHned не є юридичною фірмою і не надає юридичних чи імміграційних консультацій.',
        ].join(' ')
      : [
          `На попередніх сторінках — чеський ${label}.`,
          'Цей додаток — повний пояснювальний український переклад усіх статей із тією самою нумерацією, наданий для зручності; він не офіційний і не засвідчений.',
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
    ? `The Czech ${label} in the preceding pages contains the primary Czech wording. This annex is a complete explanatory English translation of every article, with the same numbering, for easier understanding only. It is not a certified or official translation. In case of discrepancy, the Czech wording prevails. This document does not verify whether a foreign national is allowed to work in the Czech Republic. Before signing, the parties should verify any applicable work permit, residence or employment requirements. SmlouvaHned is a software tool, not a law firm, and does not provide legal or immigration advice.`
    : `The Czech ${label} in the preceding pages contains the primary Czech wording. This annex is a complete explanatory English translation of every article, with the same numbering, for easier understanding only. It is not a certified or official translation. In case of discrepancy, the Czech wording prevails. SmlouvaHned is a software tool, not a law firm, and does not provide legal or immigration advice.`;

  return {
    title: 'Explanatory English Translation Annex',
    header: 'Explanatory English Translation Annex',
    intro: enLaborIntro,
    nextPageHint: 'The translation below starts on the next page.',
  };
}

export type AnnexSignatureCopy = {
  left: string;
  right: string;
  place: string;
  date: string;
  name: string;
  signature: string;
  note: string;
};

const SIGNATURE_ROLES: Record<ExpatContractType, { en: [string, string]; ua: [string, string] }> = {
  lease: { en: ['Landlord', 'Tenant'], ua: ['Орендодавець', 'Орендар'] },
  car_sale: { en: ['Seller', 'Buyer'], ua: ['Продавець', 'Покупець'] },
  employment: { en: ['Employer', 'Employee'], ua: ['Роботодавець', 'Працівник'] },
  dpp: { en: ['Employer', 'Employee'], ua: ['Роботодавець', 'Працівник'] },
  sublease: { en: ['Sublessor', 'Subtenant'], ua: ['Наймач', 'Піднаймач'] },
  power_of_attorney: { en: ['Principal', 'Agent'], ua: ['Довіритель', 'Повірений'] },
};

/** Localised signature block for the translation annex (the Czech one is printed in Czech). */
export function getAnnexSignatureCopy(contractType: ExpatContractType, locale: ExpatAnnexLocale): AnnexSignatureCopy {
  const [left, right] = SIGNATURE_ROLES[contractType][locale];
  if (locale === 'ua') {
    return {
      left,
      right,
      place: 'У',
      date: 'дата',
      name: 'Ім’я та прізвище (друкованими літерами):',
      signature: '(власноручний підпис)',
      note: `Договір набуває чинності з моменту його підписання сторонами — ${left.toLowerCase()} і ${right.toLowerCase()}. Якщо він підписується в електронній формі, відповідно застосовується Регламент (ЄС) № 910/2014 (eIDAS).`,
    };
  }
  return {
    left,
    right,
    place: 'In',
    date: 'on',
    name: 'Name and surname (in block capitals):',
    signature: '(handwritten signature)',
    note: `The Agreement takes effect upon signature by the ${left} and the ${right}. If it is signed electronically, Regulation (EU) No 910/2014 (eIDAS) applies accordingly.`,
  };
}
