import type { ContractType } from '@/lib/contracts';

export type ExpatUiLocale = 'en' | 'ua';

export type ExpatContractType =
  | 'lease'
  | 'sublease'
  | 'employment'
  | 'dpp'
  | 'power_of_attorney'
  | 'car_sale';

export type BuilderCopy = {
  title: string;
  description: string;
  steps: string[];
  fields: string[];
};

const CAPABILITY_FULL_EN =
  'English-guided form · Czech PDF + explanatory English annex (not certified or official).';
const CAPABILITY_FULL_UA =
  'Форма українською · чеський PDF + пояснювальний український додаток (не офіційний переклад).';

export const EXPAT_CONTRACT_CAPABILITY: Record<
  ExpatUiLocale,
  Record<ExpatContractType, string>
> = {
  en: {
    lease: CAPABILITY_FULL_EN,
    employment: CAPABILITY_FULL_EN,
    dpp: CAPABILITY_FULL_EN,
    sublease: CAPABILITY_FULL_EN,
    power_of_attorney: CAPABILITY_FULL_EN,
    car_sale: CAPABILITY_FULL_EN,
  },
  ua: {
    lease: CAPABILITY_FULL_UA,
    employment: CAPABILITY_FULL_UA,
    dpp: 'Форма українською · чеський PDF + пояснювальний огляд основних умов (DPP, не повний переклад).',
    sublease: CAPABILITY_FULL_UA,
    power_of_attorney: CAPABILITY_FULL_UA,
    car_sale: CAPABILITY_FULL_UA,
  },
};

const BUILDER_COPY_EN: Record<ExpatContractType, BuilderCopy> = {
  lease: {
    title: 'Rental Agreement',
    description:
      'Create a Czech rental agreement for an apartment or house, with rent, deposit, utilities, handover and house rules.',
    steps: ['Landlord', 'Tenant', 'Apartment', 'Term', 'Rent and payments', 'Handover protocol', 'Rules', 'Summary and payment'],
    fields: ['Full name', 'ID or date of birth', 'Address', 'E-mail', 'Apartment address', 'Rent amount', 'Deposit', 'Start date', 'Bank account'],
  },
  sublease: {
    title: 'Sublease Agreement',
    description: 'Create a Czech sublease agreement for a room, apartment or part of an apartment with landlord consent.',
    steps: ['Main tenant', 'Subtenant', 'Property', 'Landlord consent', 'Term', 'Payments', 'Rules', 'Summary and payment'],
    fields: ['Full name', 'ID or date of birth', 'Address', 'Consent date', 'Rent amount', 'Deposit', 'Start date', 'Handover date'],
  },
  employment: {
    title: 'Employment Contract',
    description: 'Create a Czech employment contract with job type, workplace, start date, salary and working time.',
    steps: ['Employer', 'Employee', 'Job and workplace', 'Employment term', 'Working time', 'Salary', 'Additional clauses', 'Summary and payment'],
    fields: ['Company name', 'Company ID', 'Employee name', 'Date of birth', 'Job title', 'Workplace', 'Start date', 'Salary'],
  },
  dpp: {
    title: 'DPP Agreement',
    description: 'Create a Czech agreement to perform work for short-term or occasional work up to the statutory hourly limit.',
    steps: ['Employer', 'Worker', 'Task', 'Duration', 'Remuneration', 'Summary and payment'],
    fields: ['Employer name', 'Worker name', 'Task description', 'Workplace', 'Estimated hours', 'Reward', 'Payment account'],
  },
  power_of_attorney: {
    title: 'Power of Attorney',
    description: 'Create a Czech power of attorney for representation before authorities, banks, courts or for a specific transaction.',
    steps: ['Type of authorization', 'Principal', 'Agent', 'Scope', 'Validity', 'Summary and payment'],
    fields: ['Principal name', 'Agent name', 'ID or date of birth', 'Address', 'Scope of authorization', 'Valid until'],
  },
  car_sale: {
    title: 'Car Purchase Agreement',
    description: 'Create a Czech vehicle purchase agreement with VIN, mileage, price, defects, documents and handover terms.',
    steps: ['Seller and buyer', 'Vehicle', 'Price and payment', 'Handover', 'Technical condition', 'Legal settings', 'Summary and payment'],
    fields: ['Seller name', 'Buyer name', 'VIN', 'License plate', 'Mileage', 'Purchase price', 'Known defects', 'Handover date'],
  },
};

const BUILDER_COPY_UA: Record<ExpatContractType, BuilderCopy> = {
  lease: {
    title: 'Договір оренди',
    description:
      'Створіть чеський договір оренди квартири чи будинку: орендна плата, застава, комунальні послуги, передача та правила користування.',
    steps: ['Орендодавець', 'Орендар', 'Помешкання', 'Строк', 'Платежі', 'Протокол передачі', 'Правила', 'Підсумок і оплата'],
    fields: ['ПІБ', 'Ідентифікаційний номер / дата народження', 'Адреса', 'E-mail', 'Адреса квартири', 'Орендна плата', 'Застава', 'Дата початку', 'Банківський рахунок'],
  },
  sublease: {
    title: 'Договір піднайму',
    description: 'Чеський договір піднайму кімнати, квартири чи її частини за згодою орендодавця.',
    steps: ['Головний орендар', 'Піднаймач', 'Помешкання', 'Згода орендодавця', 'Строк', 'Платежі', 'Правила', 'Підсумок і оплата'],
    fields: ['ПІБ', 'Ідентифікаційний номер / дата народження', 'Адреса', 'Дата згоди', 'Орендна плата', 'Застава', 'Дата початку', 'Дата передачі'],
  },
  employment: {
    title: 'Трудовий договір',
    description: 'Чеський трудовий договір: посада, місце роботи, дата початку, зарплата та робочий час.',
    steps: ['Роботодавець', 'Працівник', 'Посада і місце', 'Строк', 'Робочий час', 'Зарплата', 'Додаткові умови', 'Підсумок і оплата'],
    fields: ['Назва компанії', 'IČO', 'ПІБ працівника', 'Дата народження', 'Посада', 'Місце роботи', 'Дата початку', 'Зарплата'],
  },
  dpp: {
    title: 'Договір DPP',
    description: 'Чеський договір про виконання роботи (DPP) для короткострокової або випадкової праці.',
    steps: ['Роботодавець', 'Працівник', 'Завдання', 'Тривалість', 'Винагорода', 'Підсумок і оплата'],
    fields: ['Роботодавець', 'Працівник', 'Опис роботи', 'Місце', 'Орієнтовні години', 'Винагорода', 'Рахунок'],
  },
  power_of_attorney: {
    title: 'Довіреність',
    description: 'Чеська довіреність для представництва перед органами, банками, судами або для конкретної угоди.',
    steps: ['Тип повноваження', 'Довіритель', 'Повірений', 'Обсяг', 'Строк', 'Підсумок і оплата'],
    fields: ['Довіритель', 'Повірений', 'Ідентифікаційний номер / дата народження', 'Адреса', 'Обсяг повноважень', 'Дійсна до'],
  },
  car_sale: {
    title: 'Купівля авто',
    description: 'Чеська купівельна угода на авто: VIN, пробіг, ціна, вади, документи та передача.',
    steps: ['Продавець і покупець', 'Авто', 'Ціна і оплата', 'Передача', 'Технічний стан', 'Правові умови', 'Підсумок і оплата'],
    fields: ['Продавець', 'Покупець', 'VIN', 'Державний номер', 'Пробіг', 'Ціна', 'Відомі вади', 'Дата передачі'],
  },
};

const CZECH_ONLY_BUILDER: BuilderCopy = {
  title: 'Donation Agreement',
  description: 'This builder is currently available in Czech only.',
  steps: [],
  fields: [],
};

export function getExpatContractCapability(locale: ExpatUiLocale, key: ExpatContractType): string {
  return EXPAT_CONTRACT_CAPABILITY[locale][key];
}

export function getLocalizedBuilderCopy(
  contractType: ContractType,
  locale: ExpatUiLocale,
): BuilderCopy | null {
  const expatTypes: ExpatContractType[] = [
    'lease',
    'sublease',
    'employment',
    'dpp',
    'power_of_attorney',
    'car_sale',
  ];
  if (!expatTypes.includes(contractType as ExpatContractType)) {
    return locale === 'ua'
      ? { ...CZECH_ONLY_BUILDER, title: 'Договір дарування', description: 'Ця форма наразі доступна лише чеською.' }
      : CZECH_ONLY_BUILDER;
  }
  if (locale === 'ua') return BUILDER_COPY_UA[contractType as ExpatContractType];
  return BUILDER_COPY_EN[contractType as ExpatContractType];
}

export const UNSUPPORTED_FORM_NOTICE_BY_LOCALE: Record<ExpatUiLocale, string> = {
  en: 'This form is currently available in Czech only. Selected core contracts offer English form guidance; the generated document remains primarily in Czech.',
  ua: 'Ця форма наразі доступна лише чеською. Для обраних основних договорів є українські підказки у формі; документ генерується переважно чеською.',
};

export const BUILDER_NOTICE_LABELS: Record<
  ExpatUiLocale,
  { steps: string; keyFields: string; safetyStrip: string; guidedTitleFallback: string }
> = {
  en: {
    steps: 'Steps',
    keyFields: 'Key fields',
    safetyStrip:
      'Safety terms: not legal advice; not immigration advice; not certified or official translation; Czech wording prevails.',
    guidedTitleFallback: 'English-guided Czech contract',
  },
  ua: {
    steps: 'Кроки',
    keyFields: 'Ключові поля',
    safetyStrip:
      'Безпека: не юридична консультація; не імміграційна консультація; переклад не офіційний; перевага має чеське формулювання.',
    guidedTitleFallback: 'Чеський договір з підказками українською',
  },
};

export type OtherContractLink = { title: string; href: string };

const OTHER_CONTRACTS_EN: OtherContractLink[] = [
  { title: 'Donation Agreement', href: '/darovaci' },
  { title: 'Loan Agreement', href: '/pujcka' },
  { title: 'NDA', href: '/nda' },
  { title: 'General Purchase Agreement', href: '/kupni' },
  { title: 'Work Contract', href: '/smlouva-o-dilo' },
  { title: 'Services Agreement', href: '/sluzby' },
  { title: 'Debt Acknowledgment', href: '/uznani-dluhu' },
  { title: 'Cooperation Agreement', href: '/spoluprace' },
];

const OTHER_CONTRACTS_UK: OtherContractLink[] = [
  { title: 'Договір дарування', href: '/darovaci' },
  { title: 'Договір позики', href: '/pujcka' },
  { title: 'NDA (угода про нерозголошення)', href: '/nda' },
  { title: 'Купівельна угода', href: '/kupni' },
  { title: 'Договір про виконання робіт', href: '/smlouva-o-dilo' },
  { title: 'Договір про надання послуг', href: '/sluzby' },
  { title: 'Визнання боргу', href: '/uznani-dluhu' },
  { title: 'Договір про співпрацю', href: '/spoluprace' },
];

export const OTHER_CONTRACTS_CZECH_ONLY_HINT: Record<ExpatUiLocale, string> = {
  en: 'These Czech-only forms open as fully Czech pages because localized guidance is not available for them yet.',
  ua: 'Ці форми відкриваються як повністю чеські сторінки, оскільки локалізованих підказок для них поки немає.',
};

export function getOtherContractsForLocale(locale: ExpatUiLocale): OtherContractLink[] {
  if (locale === 'ua') return OTHER_CONTRACTS_UK;
  return OTHER_CONTRACTS_EN;
}

export function getBuilderNoticeLabels(locale: ExpatUiLocale) {
  return BUILDER_NOTICE_LABELS[locale];
}

export const FALLBACK_UI_NOTICE_BY_LOCALE: Record<ExpatUiLocale, string> = {
  en: 'This form is displayed in English for guidance. The contract is generated primarily in Czech. Where available, an explanatory English translation may be included in the PDF. It is not certified or official.',
  ua: 'Форма показана українською для зручності. Договір генерується переважно чеською. За наявності до PDF може бути додано пояснювальний український переклад. Він не є засвідченим чи офіційним.',
};
