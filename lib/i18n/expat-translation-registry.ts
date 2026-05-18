import type { ContractSection, StoredContractData } from '@/lib/contracts';
import type { AppLocale, ExpatContractType } from '@/lib/locale';
import { isExpatContract } from '@/lib/locale';
import { buildCarContractSectionsEn } from '@/lib/i18n/car-contract-en';
import { buildCarContractSectionsUa } from '@/lib/i18n/car-contract-ua';
import { buildDppContractSectionsEn } from '@/lib/i18n/dpp-contract-en';
import { buildDppContractSectionsUa } from '@/lib/i18n/dpp-contract-ua';
import { buildEmploymentContractSectionsEn } from '@/lib/i18n/employment-contract-en';
import { buildEmploymentContractSectionsUa } from '@/lib/i18n/employment-contract-ua';
import { buildLeaseContractSectionsEn } from '@/lib/i18n/lease-contract-en';
import { buildLeaseContractSectionsUk } from '@/lib/i18n/lease-contract-uk';
import { buildPowerOfAttorneyContractSectionsEn } from '@/lib/i18n/poa-contract-en';
import { buildPowerOfAttorneyContractSectionsUa } from '@/lib/i18n/poa-contract-ua';
import { buildSubleaseContractSectionsEn } from '@/lib/i18n/sublease-contract-en';
import { buildSubleaseContractSectionsUa } from '@/lib/i18n/sublease-contract-ua';

export type ExpatAnnexLocale = 'en' | 'ua';

type SectionBuilder = (data: StoredContractData) => ContractSection[];

const BUILDERS: Record<ExpatContractType, Record<ExpatAnnexLocale, SectionBuilder>> = {
  lease: {
    en: buildLeaseContractSectionsEn,
    ua: buildLeaseContractSectionsUk,
  },
  employment: {
    en: buildEmploymentContractSectionsEn,
    ua: buildEmploymentContractSectionsUa,
  },
  dpp: {
    en: buildDppContractSectionsEn,
    ua: buildDppContractSectionsUa,
  },
  sublease: {
    en: buildSubleaseContractSectionsEn,
    ua: buildSubleaseContractSectionsUa,
  },
  power_of_attorney: {
    en: buildPowerOfAttorneyContractSectionsEn,
    ua: buildPowerOfAttorneyContractSectionsUa,
  },
  car_sale: {
    en: buildCarContractSectionsEn,
    ua: buildCarContractSectionsUa,
  },
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

export function buildExpatTranslationSections(
  contractType: ExpatContractType,
  locale: ExpatAnnexLocale,
  data: StoredContractData,
): ContractSection[] {
  return BUILDERS[contractType][locale](data);
}
