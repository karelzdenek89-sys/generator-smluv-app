import type { AppLocale } from '@/lib/locale';
import type { StoredContractData } from '@/lib/contracts';
import { buildLeaseContractSectionsEn } from '@/lib/i18n/lease-contract-en';
import { buildLeaseContractSectionsUk } from '@/lib/i18n/lease-contract-uk';
import { buildContractSections } from '@/lib/contracts';

type LeasePreviewForm = {
  landlordName: string;
  landlordId: string;
  landlordAddress: string;
  landlordOP: string;
  tenantName: string;
  tenantId: string;
  tenantAddress: string;
  tenantOP: string;
  flatAddress: string;
  flatLayout: string;
  flatArea: string;
  flatUnitNumber: string;
  ownershipSheet: string;
  cadastralArea: string;
  parcelNumber: string;
  floor: string;
  startDate: string;
  handoverDate: string;
  duration: 'fixed' | 'indefinite';
  endDate: string;
  rentAmount: string;
  utilityAmount: string;
  depositAmount: string;
  paymentDay: string;
  bankAccount: string;
  variableSymbol: string;
  keysCount: string;
  electricityMeter: string;
  electricityMeterSerial: string;
  gasMeter: string;
  gasMeterSerial: string;
  waterMeter: string;
  waterMeterSerial: string;
  hotWaterMeter: string;
  hotWaterMeterSerial: string;
  equipmentList: string;
  knownDefects: string;
  allowPets: boolean;
  allowSmoking: boolean;
  allowAirbnb: boolean;
  strictPenalties: boolean;
  inspectionAllowed: boolean;
  maxOccupants: string;
  businessUseAllowed: boolean;
  includeInflationIndexation: boolean;
};

export type ContractPreviewLabels = {
  kicker: string;
  intro: string;
  footer: string;
};

const PREVIEW_LABELS: Record<'en' | 'ua', ContractPreviewLabels> = {
  en: {
    kicker: 'Guided preview',
    intro:
      'This preview shows the contract structure assembled from your inputs. With the bilingual add-on, the final PDF pairs each Czech clause with its English counterpart.',
    footer:
      'Orientational preview only. The bilingual add-on produces one clause-paired CZ+EN PDF; the Czech wording prevails.',
  },
  ua: {
    kicker: 'Попередній перегляд',
    intro:
      'Цей перегляд показує структуру договору, складену з ваших даних. З двомовним доповненням кожне чеське положення в PDF попарно розміщується з українським.',
    footer:
      'Лише орієнтовний перегляд. Двомовне доповнення створює один PDF CZ+UA з попарними положеннями; перевагу має чеське формулювання.',
  },
};

const PLAIN_COPY = {
  en: {
    title: 'CZECH RENTAL AGREEMENT (primary Czech wording) — summary preview',
    handoverTitle: 'HANDOVER PROTOCOL (Czech annex) — summary preview',
    durationFixed: (end: string) => `fixed until ${end}`,
    durationIndefinite: 'indefinite',
    pets: (v: boolean) => (v ? 'allowed' : 'not allowed'),
    smoking: (v: boolean) => (v ? 'allowed' : 'not allowed'),
    airbnb: (v: boolean) => (v ? 'allowed' : 'not allowed'),
    penalties: (v: boolean) => (v ? 'yes' : 'no'),
    inspection: (v: boolean) => (v ? 'yes' : 'no'),
    business: (v: boolean) => (v ? 'allowed' : 'living only'),
    indexation: (v: boolean) => (v ? 'yes (CPI)' : 'no'),
    defects: 'No obvious defects stated.',
  },
  ua: {
    title: 'ЧЕСЬКИЙ ДОГОВІР ОРЕНДИ (основне чеське формулювання) — стислий перегляд',
    handoverTitle: 'ПРОТОКОЛ ПЕРЕДАЧІ (чеський додаток) — стислий перегляд',
    durationFixed: (end: string) => `строковий до ${end}`,
    durationIndefinite: 'безстроковий',
    pets: (v: boolean) => (v ? 'дозволено' : 'заборонено'),
    smoking: (v: boolean) => (v ? 'дозволено' : 'заборонено'),
    airbnb: (v: boolean) => (v ? 'дозволено' : 'заборонено'),
    penalties: (v: boolean) => (v ? 'так' : 'ні'),
    inspection: (v: boolean) => (v ? 'так' : 'ні'),
    business: (v: boolean) => (v ? 'дозволено' : 'лише проживання'),
    indexation: (v: boolean) => (v ? 'так (індекс)' : 'ні'),
    defects: 'Без заявлених явних вад.',
  },
} as const;

export function isExpatLeaseLocale(locale: AppLocale): locale is 'en' | 'ua' {
  return locale === 'en' || locale === 'ua';
}

export function getContractPreviewLabels(locale: AppLocale): ContractPreviewLabels | null {
  if (!isExpatLeaseLocale(locale)) return null;
  return PREVIEW_LABELS[locale];
}

export function buildLeasePreviewSections(
  locale: AppLocale,
  form: LeasePreviewForm,
  packageKey: string | null,
): ReturnType<typeof buildContractSections> {
  const payload = {
    ...form,
    contractType: 'lease',
    packageKey,
    lang: locale,
    utilitiesIncludedText: '',
    tier: 'basic',
  } as StoredContractData;

  if (locale === 'en') return buildLeaseContractSectionsEn(payload);
  if (locale === 'ua') return buildLeaseContractSectionsUk(payload);
  return buildContractSections(payload);
}

export function buildLeasePlainPreview(
  locale: AppLocale,
  form: LeasePreviewForm,
  monthlyTotal: number,
): string {
  if (!isExpatLeaseLocale(locale)) {
    return buildLeasePlainPreviewCs(form, monthlyTotal);
  }

  const c = PLAIN_COPY[locale];
  const duration =
    form.duration === 'fixed'
      ? c.durationFixed(form.endDate || '................')
      : c.durationIndefinite;

  if (locale === 'ua') {
    return `
${c.title}

Орендодавець · Орендар:
${form.landlordName || '................'} · ${form.tenantName || '................'}

Адреса: ${form.flatAddress || '................'}
Оренда: ${form.rentAmount || '0'} Kč · Послуги: ${form.utilityAmount || '0'} Kč · Разом: ${monthlyTotal} Kč/міс.
Грошова застава (кауція): ${form.depositAmount || '0'} Kč · Строк: ${duration}

Правила: тварини ${c.pets(form.allowPets)} · куріння ${c.smoking(form.allowSmoking)} · Airbnb ${c.airbnb(form.allowAirbnb)}

Повний чеський текст договору буде в PDF після оплати.
    `.trim();
  }

  return `
${c.title}

Landlord · Tenant:
${form.landlordName || '................'} · ${form.tenantName || '................'}

Apartment: ${form.flatAddress || '................'}
Rent: ${form.rentAmount || '0'} CZK · Services: ${form.utilityAmount || '0'} CZK · Total: ${monthlyTotal} CZK/month
Deposit: ${form.depositAmount || '0'} CZK · Term: ${duration}

Rules: pets ${c.pets(form.allowPets)} · smoking ${c.smoking(form.allowSmoking)} · Airbnb ${c.airbnb(form.allowAirbnb)}

The full Czech contract text is assembled in the PDF after payment.
  `.trim();
}

export function buildLeaseHandoverPreview(locale: AppLocale, form: LeasePreviewForm): string {
  if (!isExpatLeaseLocale(locale)) {
    return buildLeaseHandoverPreviewCs(form);
  }

  const c = PLAIN_COPY[locale];
  if (locale === 'ua') {
    return `
${c.handoverTitle}

Адреса: ${form.flatAddress || '................'}
Орендодавець: ${form.landlordName || '................'}
Орендар: ${form.tenantName || '................'}
Дата передачі: ${form.handoverDate || '................'}

Лічильники, ключі та обладнання з форми потраплять у чеський протокол у PDF.
    `.trim();
  }

  return `
${c.handoverTitle}

Apartment: ${form.flatAddress || '................'}
Landlord: ${form.landlordName || '................'}
Tenant: ${form.tenantName || '................'}
Handover date: ${form.handoverDate || '................'}

Meters, keys and equipment from your form are inserted into the Czech protocol annex in the PDF.
  `.trim();
}

function buildLeasePlainPreviewCs(form: LeasePreviewForm, monthlyTotal: number): string {
  return `
NÁJEMNÍ SMLOUVA O NÁJMU BYTU
uzavřená dle § 2235 a násl. zákona č. 89/2012 Sb., občanský zákoník

I. SMLUVNÍ STRANY

Pronajímatel:
Jméno a příjmení: ${form.landlordName || '................'}
Rodné číslo / datum narození: ${form.landlordId || '................'}
Trvalé bydliště: ${form.landlordAddress || '................'}
Číslo OP: ${form.landlordOP || '................'}

Nájemce:
Jméno a příjmení: ${form.tenantName || '................'}
Rodné číslo / datum narození: ${form.tenantId || '................'}
Trvalé bydliště: ${form.tenantAddress || '................'}
Číslo OP: ${form.tenantOP || '................'}

II. PŘEDMĚT NÁJMU

Adresa bytu: ${form.flatAddress || '................'}
Dispozice: ${form.flatLayout || '................'}
Výměra: ${form.flatArea ? form.flatArea + ' m²' : '................'}

III. DOBA NÁJMU

Začátek nájmu: ${form.startDate || '................'}
Předání bytu: ${form.handoverDate || '................'}
Doba nájmu: ${
    form.duration === 'fixed'
      ? `určitá do ${form.endDate || '................'}`
      : 'neurčitá'
  }

IV. NÁJEMNÉ A PLATBY

Měsíční nájemné: ${form.rentAmount || '0'} Kč
Služby: ${form.utilityAmount || '0'} Kč
Celkem měsíčně: ${monthlyTotal} Kč
Kauce: ${form.depositAmount || '0'} Kč
  `.trim();
}

function buildLeaseHandoverPreviewCs(form: LeasePreviewForm): string {
  return `
PŘEDÁVACÍ PROTOKOL

k nájemní smlouvě k bytu na adrese ${form.flatAddress || '................'}

Pronajímatel: ${form.landlordName || '................'}
Nájemce: ${form.tenantName || '................'}
Datum předání: ${form.handoverDate || '................'}

Počet klíčů: ${form.keysCount || '................'}
Známé vady / poznámky: ${form.knownDefects || 'Bez zjevných vad.'}
  `.trim();
}
