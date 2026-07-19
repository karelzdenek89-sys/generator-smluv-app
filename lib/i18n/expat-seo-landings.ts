import type { AppLocale, ExpatContractType } from '@/lib/locale';
import { EXPAT_CONTRACT_ROUTES } from '@/lib/locale';
import { SITE_URL } from '@/lib/seo/site';

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
  expatHubLabel: string;
  blogGuideLabel: string;
  blogGuideHref: string;
  faq: { q: string; a: string }[];
  legalBullets: string[];
};

type LocalePack = Omit<
  ExpatSeoContent,
  | 'contractKey'
  | 'slug'
  | 'builderHref'
  | 'canonical'
  | 'blogGuideHref'
  | 'expatHubLabel'
  | 'blogGuideLabel'
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
    canonical: `${SITE_URL}/${segment}/${slug}`,
    blogGuideHref: `/blog/expat/${slug}-guide-${locale}`,
    expatHubLabel: locale === 'ua' ? 'Іноземці в Чехії' : 'Expats in Czechia',
    blogGuideLabel: locale === 'ua' ? 'Детальний гід (стаття)' : 'Read the detailed guide',
    ...pack,
  };
}

export function getExpatBlogGuideSlug(
  contractKey: ExpatContractType,
  locale: 'en' | 'ua',
): string {
  return `${SLUG_BY_CONTRACT[contractKey]}-guide-${locale}`;
}

const LEASE_EN: LocalePack = {
  metadata: {
    title: 'Rental Agreement in the Czech Republic | English-Guided Czech Lease | SmlouvaHned',
    description:
      'Create a Czech rental agreement for foreigners and landlords. English-guided form with an optional Czech-English version pairing every clause in one document.',
    keywords: [
      'rental agreement Czech Republic',
      'lease agreement Czech Republic foreigners',
      'Prague rental contract',
      'Czech rental agreement English',
      'apartment lease Prague expat',
    ],
    openGraphTitle: 'Rental Agreement in the Czech Republic | SmlouvaHned',
    openGraphDescription:
      'English-guided rental agreement with an optional Czech-English clause-paired version. Czech wording prevails.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Rental agreement',
  kicker: 'Foreigners & landlords in Czechia',
  h1: 'Rental Agreement in the Czech Republic',
  subtitle:
    'Fill in the form in English. At checkout you can add a Czech-English rental agreement with every clause paired in one document. Czech wording prevails.',
  cta: 'Create rental agreement',
  backToExpats: 'All expat contracts',
  faq: [
    {
      q: 'Is this a certified English translation?',
      a: 'No. The English wording is provided for understanding and is not certified or official. In case of discrepancy, the Czech wording prevails.',
    },
    {
      q: 'Can I use this for a visa or residence permit?',
      a: 'SmlouvaHned does not guarantee acceptance by any authority. Requirements vary. This is not legal or immigration advice.',
    },
    { q: 'Who is this for?', a: 'Foreign tenants and landlords in the Czech Republic who want an English-guided form and a Czech contract PDF.' },
    {
      q: 'What do I receive after payment?',
      a: 'The selected Czech lease PDF. If you add the Czech-English option, each Czech clause is followed by its English wording in the same document.',
    },
  ],
  legalBullets: [
    'SmlouvaHned is a software tool, not a law firm.',
    'We do not provide legal or immigration advice.',
    'The English wording is not certified or official.',
    'In case of discrepancy, the Czech wording prevails.',
  ],
};

const LEASE_UA: LocalePack = {
  metadata: {
    title: 'Договір оренди в Чехії | Форма українською | SmlouvaHned',
    description:
      'Чеський договір оренди для іноземців. Форма українською та додаткова версія CZ+UA з попарними положеннями в одному документі.',
    keywords: [
      'договір оренди Чехія',
      'оренда квартири Прага',
      'чеський договір оренди українською',
      'найм житла Чехія іноземці',
    ],
    openGraphTitle: 'Договір оренди в Чехії | SmlouvaHned',
    openGraphDescription: 'Договір оренди з додатковою чесько-українською версією та попарними положеннями.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'Договір оренди',
  kicker: 'Іноземці та орендодавці в Чехії',
  h1: 'Договір оренди в Чехії',
  subtitle:
    'Заповніть форму українською. Під час оплати можна додати чесько-українську версію з попарними положеннями. Перевагу має чеське формулювання.',
  cta: 'Створити договір оренди',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Чи це офіційний переклад?', a: 'Ні. Український текст не є офіційним або засвідченим. У разі розбіжностей переважає чеське формулювання.' },
    { q: 'Чи підійде для візи?', a: 'Ми не гарантуємо прийняття органами. Це не імміграційна консультація.' },
    { q: 'Для кого?', a: 'Для іноземних орендарів і орендодавців у Чехії.' },
    { q: 'Що після оплати?', a: 'Обраний чеський PDF. Якщо додати версію CZ+UA, після кожного чеського положення буде наведено український текст у тому самому документі.' },
  ],
  legalBullets: [
    'SmlouvaHned — програмний інструмент, не юридична фірма.',
    'Не надаємо юридичних чи імміграційних консультацій.',
    'Перевагу має чеське формулювання.',
  ],
};

const EMPLOYMENT_EN: LocalePack = {
  metadata: {
    title: 'Employment Contract Czech Republic | English Form | SmlouvaHned',
    description:
      'Create a Czech employment contract (pracovní smlouva) with an English-guided form and optional paired Czech-English PDF for foreigners working in Czechia.',
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
    { q: 'Is this a full Czech employment contract?', a: 'Yes — a Czech pracovní smlouva PDF is generated from your inputs, with an optional paired Czech-English version.' },
    { q: 'Does this replace a work permit?', a: 'No. We do not provide immigration advice. Verify work authorization separately if required.' },
    { q: 'Can my employer use this?', a: 'Yes, for typical employment relationships between employer and employee in Czechia.' },
    { q: 'Czech-English PDF for HR?', a: 'Each Czech clause is followed by English wording; Czech wording prevails.' },
  ],
  legalBullets: [
    'Not legal advice. Verify work eligibility with official sources.',
    'Czech wording prevails over the paired English translation.',
    'SmlouvaHned is not a law firm.',
  ],
};

const EMPLOYMENT_UA: LocalePack = {
  metadata: {
    title: 'Трудовий договір Чехія | Форма українською | SmlouvaHned',
    description:
      'Чеський трудовий договір (pracovní smlouva) з формою українською та додатковим попарним PDF CZ+UA.',
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
    { q: 'Чи це повний чеський договір?', a: 'Так. Додатково можна обрати PDF CZ+UA, де після кожного чеського положення наведено український текст.' },
    { q: 'Чи замінює дозвіл на роботу?', a: 'Ні. Імміграційні питання перевіряйте окремо.' },
    { q: 'Для роботодавця?', a: 'Так, для типових трудових відносин у Чехії.' },
    { q: 'Чи є версія CZ+UA?', a: 'Так. У додатковому PDF кожне чеське положення супроводжується українським текстом. Переклад не є офіційним; переважає чеське формулювання.' },
  ],
  legalBullets: ['Не юридична консультація.', 'Перевага чеського формулювання.', 'Не юридична фірма.'],
};

const DPP_EN: LocalePack = {
  metadata: {
    title: 'DPP Agreement Czech Republic | Short-Term Work | SmlouvaHned',
    description:
      'Czech dohoda o provedení práce (DPP) with English-guided form. For occasional work up to 300 hours/year per employer. Optional paired Czech-English PDF.',
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
    'Create a Czech DPP for short-term or occasional work. English form guidance with an optional PDF pairing each Czech clause with English wording.',
  cta: 'Create DPP agreement',
  backToExpats: 'All expat contracts',
  faq: [
    { q: 'What is DPP?', a: 'A Czech agreement to perform work — limited hours per year with one employer under the Labour Code.' },
    { q: '300-hour limit?', a: 'The form reminds you of the statutory cap; exceeding it may require a different contract type.' },
    { q: 'Paired translation for DPP?', a: 'Choose CZ+EN or CZ+UA to place the translation directly below each Czech clause. Czech wording prevails.' },
    { q: 'For freelancers?', a: 'DPP is employment-like; for B2B services use a different contract type.' },
  ],
  legalBullets: ['Not tax or social security advice.', 'Czech wording prevails.', 'Verify hours and insurance rules for your situation.'],
};

const DPP_UA: LocalePack = {
  metadata: {
    title: 'ДПП Чехія | Договір про виконання роботи | SmlouvaHned',
    description:
      'Чеська ДПП (dohoda o provedení práce) з формою українською. До 300 годин на рік у одного роботодавця. Додатковий попарний PDF CZ+UA.',
    keywords: ['ДПП Чехія', 'dohoda o provedení práce', 'підробіток Чехія', '300 годин ДПП'],
    openGraphTitle: 'ДПП Чехія | SmlouvaHned',
    openGraphDescription: 'ДПП з формою українською для іноземців.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'ДПП',
  kicker: 'Підробіток у Чехії',
  h1: 'Договір ДПП (dohoda o provedení práce)',
  subtitle: 'Чеська ДПП з підказками українською та додатковим PDF, де кожне чеське положення має український переклад.',
  cta: 'Створити ДПП',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    { q: 'Що таке ДПП?', a: 'Угода про виконання роботи за чеським трудовим кодексом.' },
    { q: 'Ліміт 300 годин?', a: 'Форма нагадує про законний ліміт на одного роботодавця.' },
    { q: 'Чи є версія CZ+UA?', a: 'Так, переклад наведено безпосередньо під кожним чеським положенням; чеський текст має перевагу.' },
    { q: 'Для ФОП?', a: 'ДПП — трудовий формат; для послуг B2B інший договір.' },
  ],
  legalBullets: ['Не податкова консультація.', 'Перевага чеської версії.'],
};

const SUBLEASE_EN: LocalePack = {
  metadata: {
    title: 'Sublease Agreement Czech Republic | English Form | SmlouvaHned',
    description:
      'Czech sublease (podnájemní smlouva) for tenants subletting a flat or room. English-guided form, landlord consent and optional paired Czech-English PDF.',
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
    { q: 'Czech-English version?', a: 'Each Czech clause is followed by English wording in the same PDF; Czech wording prevails.' },
  ],
  legalBullets: ['Not legal advice.', 'Verify head lease allows subletting.', 'Czech wording prevails.'],
};

const SUBLEASE_UA: LocalePack = {
  metadata: {
    title: 'Піднайм Чехія | Піднаймна угода | SmlouvaHned',
    description:
      'Чеський піднайм (podnájemní smlouva) з формою українською. Згода власника, кауція та додатковий попарний PDF CZ+UA.',
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
    { q: 'Грошова застава (кауція)?', a: 'Вказуєте у формі разом з орендною платою.' },
    { q: 'Чи є версія CZ+UA?', a: 'Так. У додатковому PDF положення наведені попарно чеською та українською. Переклад не є офіційним; переважає чеське формулювання.' },
  ],
  legalBullets: ['Не юридична консультація.', 'Перевірте основний договір оренди.'],
};

const POA_EN: LocalePack = {
  metadata: {
    title: 'Power of Attorney Czech Republic | Plná moc | SmlouvaHned',
    description:
      'Czech power of attorney (plná moc) for bank, property, court or general representation. English-guided form and optional paired Czech-English PDF.',
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
    { q: 'Czech-English version?', a: 'Each Czech clause is followed by English wording in the same PDF; Czech plná moc prevails.' },
  ],
  legalBullets: ['Not legal advice.', 'Some acts require notarized POA — verify with the recipient.', 'Czech wording prevails.'],
};

const POA_UA: LocalePack = {
  metadata: {
    title: 'Довіреність Чехія | Plná moc | SmlouvaHned',
    description:
      'Чеська довіреність (plná moc) для банку, нерухомості та суду. Форма українською та додатковий попарний PDF CZ+UA.',
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
    { q: 'Чи є версія CZ+UA?', a: 'Так. У додатковому PDF положення наведені попарно чеською та українською. Переклад не є офіційним; переважає чеське формулювання.' },
  ],
  legalBullets: ['Не юридична консультація.', 'Перевага чеського формулювання.'],
};

const CAR_EN: LocalePack = {
  metadata: {
    title: 'Car Sale Agreement in Czech Republic 2026 | PDF Contract',
    description:
      'Create a Czech car sale agreement for buying or selling a vehicle in the Czech Republic. Practical contract template for foreigners, with PDF output.',
    keywords: [
      'car sale agreement Czech Republic',
      'kupní smlouva auto English',
      'used car contract Prague',
      'vehicle purchase agreement Czech',
      'VIN contract Czech Republic',
      'car sale contract Czechia 2026',
    ],
    openGraphTitle: 'Car Sale Agreement in Czech Republic 2026 | SmlouvaHned',
    openGraphDescription: 'English-guided Czech car sale contract with PDF output for foreigners.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Car sale',
  kicker: 'Buying or selling a car',
  h1: 'Car Sale Agreement in the Czech Republic',
  subtitle:
    'Private sale of a car, motorcycle or trailer in Czechia. Document VIN, technical condition, price, handover and what you need for the vehicle transfer.',
  cta: 'Create car sale contract',
  backToExpats: 'All expat contracts',
  faq: [
    {
      q: 'Is a written car sale agreement required in Czechia?',
      a: 'For a standard private sale between individuals, a written kupní smlouva is strongly recommended. It documents price, vehicle details and handover — and you will need it for registration and transfer.',
    },
    {
      q: 'What should be included in a Czech car sale agreement?',
      a: 'At minimum: seller and buyer details, make and model, VIN, mileage, price, payment terms, handover date, known defects and signatures. Our form guides you through these fields in English.',
    },
    {
      q: 'Who handles the vehicle transfer?',
      a: 'After signing, the buyer typically registers the vehicle at the traffic inspectorate (obecní/obvodní úřad obce s rozšířenou působností). The signed contract supports the ownership change.',
    },
    {
      q: 'What documents are needed?',
      a: 'Usually the signed contract, technical certificate (small or large TP), proof of identity, and registration documents. Requirements can vary — check with the local office before your visit.',
    },
    {
      q: 'Can foreigners buy or sell a car in Czechia?',
      a: 'Yes, if you meet the administrative requirements for registration and have valid identification. The contract itself is in Czech; our English form helps you fill it correctly.',
    },
    { q: 'Is notarization required?', a: 'Usually not for standard private car sales; signatures of both parties suffice.' },
    { q: 'VIN and odometer?', a: 'The form captures VIN, mileage and known defects to reduce disputes.' },
    { q: 'Czech-English version?', a: 'Each Czech clause is followed by English wording in the same PDF; Czech kupní smlouva prevails.' },
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
    { q: 'Чи є версія CZ+UA?', a: 'Так. У додатковому PDF положення наведені попарно чеською та українською. Переклад не є офіційним; переважає чеське формулювання.' },
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
