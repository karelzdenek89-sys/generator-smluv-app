import type { AppLocale, ExpatContractType } from '@/lib/locale';
import { EXPAT_CONTRACT_ROUTES } from '@/lib/locale';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export type ExpatSeoContent = {
  contractKey: ExpatContractType;
  slug: string;
  builderHref: string;
  canonical: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    openGraphTitle: string;
    openGraphDescription: string;
    openGraphLocale: string;
  };
  breadcrumbLabel: string;
  kicker: string;
  h1: string;
  subtitle: string;
  cta: string;
  backToExpats: string;
  faq: { q: string; a: string }[];
  legalBullets: string[];
};

type LocalePack = Omit<
  ExpatSeoContent,
  'contractKey' | 'slug' | 'builderHref' | 'canonical'
>;

function build(
  contractKey: ExpatContractType,
  slug: string,
  locale: 'en' | 'ua',
  pack: LocalePack,
): ExpatSeoContent {
  const segment = locale;
  const builderPath = EXPAT_CONTRACT_ROUTES[contractKey];
  return {
    contractKey,
    slug,
    builderHref: `${builderPath}?lang=${locale}`,
    canonical: `${BASE_URL}/${segment}/${slug}`,
    ...pack,
  };
}

const LEASE_EN: LocalePack = {
  metadata: {
    title: 'Rental Agreement in the Czech Republic | English-Guided Czech Lease | SmlouvaHned',
    description:
      'Create a Czech rental agreement for foreigners and landlords. English-guided form, Czech PDF with explanatory English annex. Not certified or official.',
    keywords: [
      'rental agreement Czech Republic',
      'lease agreement Czech Republic foreigners',
      'Prague rental contract',
      'Czech rental agreement English',
      'apartment lease Prague expat',
    ],
    openGraphTitle: 'Rental Agreement in the Czech Republic | SmlouvaHned',
    openGraphDescription:
      'English-guided Czech rental agreement with explanatory English translation annex. Czech wording prevails.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Rental agreement',
  kicker: 'Foreigners & landlords in Czechia',
  h1: 'Rental Agreement in the Czech Republic',
  subtitle:
    'Fill in the rental form in English and generate a Czech rental agreement with an explanatory English translation annex. Czech wording prevails.',
  cta: 'Create rental agreement',
  backToExpats: 'All expat contracts',
  faq: [
    {
      q: 'Is this a certified English translation?',
      a: 'No. The Czech lease is the primary document. Any English annex is explanatory only and not certified or official.',
    },
    {
      q: 'Can I use this for a visa or residence permit?',
      a: 'SmlouvaHned does not guarantee acceptance by any authority. Requirements vary. This is not legal or immigration advice.',
    },
    { q: 'Who is this for?', a: 'Foreign tenants and landlords in the Czech Republic who want an English-guided form and a Czech contract PDF.' },
    {
      q: 'What do I receive after payment?',
      a: 'A PDF with the Czech lease plus an explanatory English translation annex where supported.',
    },
  ],
  legalBullets: [
    'SmlouvaHned is a software tool, not a law firm.',
    'We do not provide legal or immigration advice.',
    'The contract is primarily in Czech; the English annex is not certified or official.',
    'In case of discrepancy, the Czech wording prevails.',
  ],
};

const LEASE_UA: LocalePack = {
  metadata: {
    title: 'Договір оренди в Чехії | Форма українською | SmlouvaHned',
    description:
      'Чеський договір оренди для іноземців. Форма українською, PDF з пояснювальним українським додатком. Не офіційний переклад.',
    keywords: [
      'договір оренди Чехія',
      'оренда квартири Прага',
      'чеський договір оренди українською',
      'найм житла Чехія іноземці',
    ],
    openGraphTitle: 'Договір оренди в Чехії | SmlouvaHned',
    openGraphDescription: 'Чеський договір оренди з пояснювальним українським додатком.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'Договір оренди',
  kicker: 'Іноземці та орендодавці в Чехії',
  h1: 'Договір оренди в Чехії',
  subtitle:
    'Форма українською → чеський PDF з пояснювальним українським додатком. Перевага має чеське формулювання.',
  cta: 'Створити договір оренди',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Чи це офіційний переклад?', a: 'Ні. Основний документ — чеською. Додаток пояснювальний, не засвідчений.' },
    { q: 'Чи підійде для візи?', a: 'Ми не гарантуємо прийняття органами. Це не імміграційна консультація.' },
    { q: 'Для кого?', a: 'Для іноземних орендарів і орендодавців у Чехії.' },
    { q: 'Що після оплати?', a: 'PDF з чеським договором і пояснювальним додатком.' },
  ],
  legalBullets: [
    'SmlouvaHned — програмний інструмент, не юридична фірма.',
    'Не надаємо юридичних чи імміграційних консультацій.',
    'Перевага має чеське формулювання.',
  ],
};

const EMPLOYMENT_EN: LocalePack = {
  metadata: {
    title: 'Employment Contract Czech Republic | English Form | SmlouvaHned',
    description:
      'Create a Czech employment contract (pracovní smlouva) with an English-guided form. Czech PDF plus explanatory English annex for foreigners working in Czechia.',
    keywords: [
      'Czech employment contract',
      'employment contract Czech Republic foreigners',
      'pracovní smlouva English',
      'work contract Prague expat',
      'Labour Code Czech Republic template',
    ],
    openGraphTitle: 'Employment Contract Czech Republic | SmlouvaHned',
    openGraphDescription: 'English-guided Czech employment contract for expats.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Employment contract',
  kicker: 'Working in the Czech Republic',
  h1: 'Employment Contract in the Czech Republic',
  subtitle:
    'Standard Czech employment contract with English form guidance. Covers job, workplace, salary and working time under the Czech Labour Code.',
  cta: 'Create employment contract',
  backToExpats: 'All expat contracts',
  faq: [
    { q: 'Is this a full Czech employment contract?', a: 'Yes — a Czech pracovní smlouva PDF is generated from your inputs, with optional explanatory English annex.' },
    { q: 'Does this replace a work permit?', a: 'No. We do not provide immigration advice. Verify work authorization separately if required.' },
    { q: 'Can my employer use this?', a: 'Yes, for typical employment relationships between employer and employee in Czechia.' },
    { q: 'English annex for HR?', a: 'The annex helps non-Czech speakers understand structure; Czech wording prevails.' },
  ],
  legalBullets: [
    'Not legal advice. Verify work eligibility with official sources.',
    'Czech wording prevails over the explanatory annex.',
    'SmlouvaHned is not a law firm.',
  ],
};

const EMPLOYMENT_UA: LocalePack = {
  metadata: {
    title: 'Трудовий договір Чехія | Форма українською | SmlouvaHned',
    description:
      'Чеський трудовий договір (pracovní smlouva) з формою українською та пояснювальним додатком для іноземців, які працюють у Чехії.',
    keywords: [
      'трудовий договір Чехія',
      'pracovní smlouva українською',
      'працевлаштування іноземців Чехія',
      'трудовий кодекс Чехія',
    ],
    openGraphTitle: 'Трудовий договір Чехія | SmlouvaHned',
    openGraphDescription: 'Чеський трудовий договір з формою українською.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'Трудовий договір',
  kicker: 'Праця в Чехії',
  h1: 'Трудовий договір у Чехії',
  subtitle: 'Стандартний чеський трудовий договір з підказками українською. Посада, місце, зарплата, робочий час.',
  cta: 'Створити трудовий договір',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Чи це повний чеський договір?', a: 'Так — PDF чеською з ваших даних, з пояснювальним додатком.' },
    { q: 'Чи замінює дозвіл на роботу?', a: 'Ні. Імміграційні питання перевіряйте окремо.' },
    { q: 'Для роботодавця?', a: 'Так, для типових трудових відносин у Чехії.' },
    { q: 'Додаток українською?', a: 'Пояснювальний, не офіційний; перевага чеської версії.' },
  ],
  legalBullets: ['Не юридична консультація.', 'Перевага чеського формулювання.', 'Не юридична фірма.'],
};

const DPP_EN: LocalePack = {
  metadata: {
    title: 'DPP Agreement Czech Republic | Short-Term Work | SmlouvaHned',
    description:
      'Czech dohoda o provedení práce (DPP) with English-guided form. For occasional work up to 300 hours/year per employer. Czech PDF + explanatory annex.',
    keywords: [
      'DPP agreement Czech Republic',
      'dohoda o provedení práce English',
      'short term work Czech Republic',
      '300 hours DPP',
      'Czech side job contract',
    ],
    openGraphTitle: 'DPP Agreement Czech Republic | SmlouvaHned',
    openGraphDescription: 'English-guided DPP contract for expats in Czechia.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'DPP agreement',
  kicker: 'Occasional work in Czechia',
  h1: 'DPP Agreement (Dohoda o provedení práce)',
  subtitle:
    'Create a Czech DPP for short-term or occasional work. English form guidance; Czech PDF with explanatory annex (DPP overview, not full legal translation).',
  cta: 'Create DPP agreement',
  backToExpats: 'All expat contracts',
  faq: [
    { q: 'What is DPP?', a: 'A Czech agreement to perform work — limited hours per year with one employer under the Labour Code.' },
    { q: '300-hour limit?', a: 'The form reminds you of the statutory cap; exceeding it may require a different contract type.' },
    { q: 'English annex on DPP?', a: 'Ukrainian/English annex explains key terms; Czech DPP text in the PDF prevails.' },
    { q: 'For freelancers?', a: 'DPP is employment-like; for B2B services use a different contract type.' },
  ],
  legalBullets: ['Not tax or social security advice.', 'Czech wording prevails.', 'Verify hours and insurance rules for your situation.'],
};

const DPP_UA: LocalePack = {
  metadata: {
    title: 'ДПП Чехія | Договір про виконання роботи | SmlouvaHned',
    description:
      'Чеська ДПП (dohoda o provedení práce) з формою українською. До 300 годин на рік у одного роботодавця. PDF + пояснювальний огляд умов.',
    keywords: ['ДПП Чехія', 'dohoda o provedení práce', 'підробіток Чехія', '300 годин ДПП'],
    openGraphTitle: 'ДПП Чехія | SmlouvaHned',
    openGraphDescription: 'ДПП з формою українською для іноземців.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'ДПП',
  kicker: 'Підробіток у Чехії',
  h1: 'Договір ДПП (dohoda o provedení práce)',
  subtitle: 'Чеська ДПП з підказками українською. PDF чеською + пояснювальний огляд (не повний переклад).',
  cta: 'Створити ДПП',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Що таке ДПП?', a: 'Угода про виконання роботи за чеським трудовим кодексом.' },
    { q: 'Ліміт 300 годин?', a: 'Форма нагадує про законний ліміт на одного роботодавця.' },
    { q: 'Український додаток?', a: 'Пояснювальний огляд; чеський текст договору має перевагу.' },
    { q: 'Для ФОП?', a: 'ДПП — трудовий формат; для послуг B2B інший договір.' },
  ],
  legalBullets: ['Не податкова консультація.', 'Перевага чеської версії.'],
};

const SUBLEASE_EN: LocalePack = {
  metadata: {
    title: 'Sublease Agreement Czech Republic | English Form | SmlouvaHned',
    description:
      'Czech sublease (podnájemní smlouva) for tenants subletting a flat or room. English-guided form, landlord consent, Czech PDF + English annex.',
    keywords: [
      'sublease agreement Czech Republic',
      'podnájemní smlouva English',
      'sublet Prague apartment',
      'Czech sublease contract foreigners',
    ],
    openGraphTitle: 'Sublease Agreement Czech Republic | SmlouvaHned',
    openGraphDescription: 'English-guided Czech sublease for expats.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Sublease',
  kicker: 'Subletting in Czechia',
  h1: 'Sublease Agreement in the Czech Republic',
  subtitle:
    'If you rent a flat and sublet a room or the whole unit, use a Czech sublease with landlord consent (Civil Code § 2274).',
  cta: 'Create sublease agreement',
  backToExpats: 'All expat contracts',
  faq: [
    { q: 'Do I need landlord consent?', a: 'Generally yes for subletting a flat when you are not living there; the form captures consent details.' },
    { q: 'Difference from lease?', a: 'Sublease is between tenant and subtenant; the head lease with the owner remains separate.' },
    { q: 'Deposit and rent?', a: 'You set sublease rent, deposit and handover terms in the form.' },
    { q: 'English annex?', a: 'Explanatory only; Czech sublease wording prevails.' },
  ],
  legalBullets: ['Not legal advice.', 'Verify head lease allows subletting.', 'Czech wording prevails.'],
};

const SUBLEASE_UA: LocalePack = {
  metadata: {
    title: 'Піднайм Чехія | Піднаймна угода | SmlouvaHned',
    description:
      'Чеський піднайм (podnájemní smlouva) з формою українською. Згода власника, завдаток, PDF + пояснювальний додаток.',
    keywords: ['піднайм Чехія', 'podnájemní smlouva', 'суборенда Прага', 'піднайм квартири'],
    openGraphTitle: 'Піднайм Чехія | SmlouvaHned',
    openGraphDescription: 'Піднайм з формою українською.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'Піднайм',
  kicker: 'Піднайм у Чехії',
  h1: 'Договір піднайму в Чехії',
  subtitle: 'Якщо ви орендуєте квартиру і здаєте кімнату або всю квартиру — чеський піднайм із згодою власника.',
  cta: 'Створити піднайм',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Чи потрібна згода власника?', a: 'Зазвичай так; форма фіксує згоду.' },
    { q: 'Відмінність від оренди?', a: 'Піднайм між орендарем і піднаймачем; основний договір окремо.' },
    { q: 'Завдаток?', a: 'Вказуєте в формі разом із орендною платою.' },
    { q: 'Додаток?', a: 'Пояснювальний; перевага чеської версії.' },
  ],
  legalBullets: ['Не юридична консультація.', 'Перевірте основний договір оренди.'],
};

const POA_EN: LocalePack = {
  metadata: {
    title: 'Power of Attorney Czech Republic | Plná moc | SmlouvaHned',
    description:
      'Czech power of attorney (plná moc) for bank, property, court or general representation. English-guided form and Czech PDF with explanatory annex.',
    keywords: [
      'power of attorney Czech Republic',
      'plná moc English',
      'Czech POA template foreigners',
      'representation Czech Republic',
    ],
    openGraphTitle: 'Power of Attorney Czech Republic | SmlouvaHned',
    openGraphDescription: 'English-guided Czech power of attorney.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Power of attorney',
  kicker: 'Representation in Czechia',
  h1: 'Power of Attorney in the Czech Republic',
  subtitle:
    'Authorize someone to act for you — property sale, bank matters, court or general tasks. Check if notarized form is required for your use case.',
  cta: 'Create power of attorney',
  backToExpats: 'All expat contracts',
  faq: [
    { q: 'Notarized signature required?', a: 'Some authorities require verified signatures; the form notes when you may need legalization.' },
    { q: 'General vs specific POA?', a: 'Choose type in the form — scope is adapted (property, court, company, bank, general).' },
    { q: 'Can the agent delegate?', a: 'Only if substitution is explicitly allowed in the document.' },
    { q: 'English annex?', a: 'Explanatory; Czech plná moc prevails.' },
  ],
  legalBullets: ['Not legal advice.', 'Some acts require notarized POA — verify with the recipient.', 'Czech wording prevails.'],
};

const POA_UA: LocalePack = {
  metadata: {
    title: 'Довіреність Чехія | Plná moc | SmlouvaHned',
    description:
      'Чеська довіреність (plná moc) для банку, нерухомості, суду. Форма українською, PDF + пояснювальний додаток.',
    keywords: ['довіреність Чехія', 'plná moc', 'довіреність банк Чехія', 'представництво Чехія'],
    openGraphTitle: 'Довіреність Чехія | SmlouvaHned',
    openGraphDescription: 'Довіреність з формою українською.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'Довіреність',
  kicker: 'Представництво в Чехії',
  h1: 'Довіреність у Чехії',
  subtitle: 'Уповноважте особу діяти від вашого імені. Перевірте, чи потрібна нотаріальна форма.',
  cta: 'Створити довіреність',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Нотаріус потрібен?', a: 'Деякі установи вимагають засвідчений підпис — уточніть у отримувача.' },
    { q: 'Типи довіреності?', a: 'У формі обираєте: загальна, нерухомість, суд, фірма, банк.' },
    { q: 'Передоручення?', a: 'Лише якщо це прямо дозволено.' },
    { q: 'Додаток?', a: 'Пояснювальний; перевага чеської версії.' },
  ],
  legalBullets: ['Не юридична консультація.', 'Перевага чеського формулювання.'],
};

const CAR_EN: LocalePack = {
  metadata: {
    title: 'Car Sale Agreement Czech Republic | Kupní smlouva | SmlouvaHned',
    description:
      'Czech car purchase contract between private parties. VIN, mileage, STK, price and handover. English-guided form + Czech PDF with explanatory annex.',
    keywords: [
      'car sale agreement Czech Republic',
      'kupní smlouva auto English',
      'used car contract Prague',
      'vehicle purchase agreement Czech',
      'VIN contract Czech Republic',
    ],
    openGraphTitle: 'Car Sale Agreement Czech Republic | SmlouvaHned',
    openGraphDescription: 'English-guided Czech car sale contract.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Car sale',
  kicker: 'Buying or selling a car',
  h1: 'Car Sale Agreement in the Czech Republic',
  subtitle:
    'Private sale of a car, motorcycle or trailer. Document VIN, technical condition, price, handover and ownership transfer.',
  cta: 'Create car sale contract',
  backToExpats: 'All expat contracts',
  faq: [
    { q: 'Is notarization required?', a: 'Usually not for standard private car sales; signatures of both parties suffice.' },
    { q: 'What about vehicle registration?', a: 'Buyer registers at the traffic inspectorate (MD) after signing; keep the contract for the transfer.' },
    { q: 'VIN and odometer?', a: 'The form captures VIN, mileage and known defects to reduce disputes.' },
    { q: 'English annex?', a: 'Explanatory only; Czech kupní smlouva prevails.' },
  ],
  legalBullets: ['Not legal advice.', 'Check liens and STK validity.', 'Czech wording prevails.'],
};

const CAR_UA: LocalePack = {
  metadata: {
    title: 'Купівля авто Чехія | Kupní smlouva | SmlouvaHned',
    description:
      'Чеська купівля-продаж авто між приватними особами. VIN, пробіг, STK, ціна. Форма українською + PDF.',
    keywords: ['купівля авто Чехія', 'kupní smlouva auto', 'договір продажу авто Прага', 'VIN договір'],
    openGraphTitle: 'Купівля авто Чехія | SmlouvaHned',
    openGraphDescription: 'Договір купівлі авто з формою українською.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'Купівля авто',
  kicker: 'Продаж або купівля авто',
  h1: 'Договір купівлі-продажу авто в Чехії',
  subtitle: 'Приватний продаж авто, мото або причепа. VIN, стан, ціна, передача.',
  cta: 'Створити договір',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Нотаріус?', a: 'Зазвичай не потрібен для звичайного продажу між фізособами.' },
    { q: 'Перепис авто?', a: 'Покупець реєструє на MD; зберігайте договір.' },
    { q: 'VIN і пробіг?', a: 'Форма фіксує дані та відомі вади.' },
    { q: 'Додаток?', a: 'Пояснювальний; перевага чеської версії.' },
  ],
  legalBullets: ['Не юридична консультація.', 'Перевірте заставу та STK.'],
};

const SLUG_BY_CONTRACT: Record<ExpatContractType, string> = {
  lease: 'rental-agreement-czech-republic',
  employment: 'employment-contract-czech-republic',
  dpp: 'dpp-agreement-czech-republic',
  sublease: 'sublease-agreement-czech-republic',
  power_of_attorney: 'power-of-attorney-czech-republic',
  car_sale: 'car-sale-agreement-czech-republic',
};

const CONTENT: Record<ExpatContractType, { en: LocalePack; ua: LocalePack }> = {
  lease: { en: LEASE_EN, ua: LEASE_UA },
  employment: { en: EMPLOYMENT_EN, ua: EMPLOYMENT_UA },
  dpp: { en: DPP_EN, ua: DPP_UA },
  sublease: { en: SUBLEASE_EN, ua: SUBLEASE_UA },
  power_of_attorney: { en: POA_EN, ua: POA_UA },
  car_sale: { en: CAR_EN, ua: CAR_UA },
};

export const EXPAT_SEO_SLUGS = Object.values(SLUG_BY_CONTRACT);

export const EXPAT_SEO_LOCALES = ['en', 'ua'] as const;

export function getExpatSeoSlug(contractKey: ExpatContractType): string {
  return SLUG_BY_CONTRACT[contractKey];
}

export function getExpatContractKeyBySeoSlug(slug: string): ExpatContractType | null {
  const entry = Object.entries(SLUG_BY_CONTRACT).find(([, s]) => s === slug);
  return entry ? (entry[0] as ExpatContractType) : null;
}

export function getExpatSeoLanding(
  contractKey: ExpatContractType,
  locale: AppLocale,
): ExpatSeoContent | null {
  if (locale !== 'en' && locale !== 'ua') return null;
  const slug = SLUG_BY_CONTRACT[contractKey];
  return build(contractKey, slug, locale, CONTENT[contractKey][locale]);
}

export function getExpatSeoLandingBySlug(
  slug: string,
  locale: AppLocale,
): ExpatSeoContent | null {
  const key = getExpatContractKeyBySeoSlug(slug);
  if (!key) return null;
  return getExpatSeoLanding(key, locale);
}

export function getExpatSeoHref(locale: 'en' | 'ua', contractKey: ExpatContractType): string {
  return `/${locale}/${SLUG_BY_CONTRACT[contractKey]}`;
}
