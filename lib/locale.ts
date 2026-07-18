import type { ContractType } from './contracts';
import { EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN } from '@/lib/i18n/safety-copy';
import {
  EXPAT_CONTRACT_CAPABILITY,
  FALLBACK_UI_NOTICE_BY_LOCALE,
  UNSUPPORTED_FORM_NOTICE_BY_LOCALE,
  getLocalizedBuilderCopy,
  type BuilderCopy,
} from '@/lib/i18n/expat-locale-copy';

/** TODO: show on /pracovni and /dpp when locale !== cs (employment + DPP builders). */
export const EMPLOYMENT_WORK_ELIGIBILITY_NOTICE = EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN;

export type AppLocale = 'cs' | 'en' | 'ua';

export const VALID_LOCALE_INPUTS = ['cs', 'en', 'ua', 'ukr', 'uk'] as const;

export const APP_LOCALES: AppLocale[] = ['cs', 'en', 'ua'];

export const EXPAT_CONTRACT_TYPES = [
  'lease',
  'sublease',
  'employment',
  'dpp',
  'power_of_attorney',
  'car_sale',
] as const satisfies readonly ContractType[];

export type ExpatContractType = (typeof EXPAT_CONTRACT_TYPES)[number];

/** @deprecated Use EXPAT_CONTRACT_CAPABILITY[locale] or getExpatContractCapability(). */
export const EXPAT_CONTRACT_EN_CAPABILITY = EXPAT_CONTRACT_CAPABILITY.en;

export { EXPAT_CONTRACT_CAPABILITY, getExpatContractCapability } from '@/lib/i18n/expat-locale-copy';

export const EXPAT_CONTRACT_ROUTES: Record<ContractType, string> = {
  lease: '/najem',
  sublease: '/podnajem',
  employment: '/pracovni',
  dpp: '/dpp',
  power_of_attorney: '/plna-moc',
  car_sale: '/auto',
  gift: '/darovaci',
  work_contract: '/smlouva-o-dilo',
  loan: '/pujcka',
  nda: '/nda',
  general_sale: '/kupni',
  service: '/sluzby',
  debt_acknowledgment: '/uznani-dluhu',
  cooperation: '/spoluprace',
};

/** Browser-only: ?lang= wins, then preferred-locale cookie, else cs. */
export function readBuilderLocaleFromBrowser(): AppLocale {
  if (typeof window === 'undefined') return 'cs';
  const params = new URLSearchParams(window.location.search);
  if (params.has('lang')) {
    const queryLocale = params.get('lang');
    return isSupportedLocaleInput(queryLocale) ? normalizeLocale(queryLocale) : 'cs';
  }
  const match = document.cookie.match(/(?:^|;\s*)preferred-locale=([^;]+)/);
  if (match?.[1]) {
    return normalizeLocale(decodeURIComponent(match[1].trim()));
  }
  return 'cs';
}

export function normalizeLocale(value: unknown): AppLocale {
  const raw = String(value ?? '').trim().toLowerCase();
  if (raw === 'ukr' || raw === 'uk') return 'ua';
  if (raw === 'vn' || raw === 'vi') return 'cs';
  return APP_LOCALES.includes(raw as AppLocale) ? (raw as AppLocale) : 'cs';
}

export function isSupportedLocaleInput(value: unknown): boolean {
  const raw = String(value ?? '').trim().toLowerCase();
  return (VALID_LOCALE_INPUTS as readonly string[]).includes(raw);
}

export function isExpatContract(contractType: ContractType): contractType is ExpatContractType {
  return (EXPAT_CONTRACT_TYPES as readonly ContractType[]).includes(contractType);
}

export function withLocale(href: string, locale: AppLocale): string {
  if (locale === 'cs') return href;
  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}lang=${locale}`;
}

export function getPublicLocalePath(locale: AppLocale): string {
  return locale;
}

export function getContractTypeByPath(pathname: string | null | undefined): ContractType | null {
  const path = (pathname ?? '').split('?')[0].replace(/\/$/, '') || '/';
  const entry = Object.entries(EXPAT_CONTRACT_ROUTES).find(([, route]) => route === path);
  return entry ? (entry[0] as ContractType) : null;
}

export const LEGAL_NOTICE: Record<AppLocale, string> = {
  cs: 'Smlouva bude vygenerovana primarne v cestine. Preklad slouzi pouze pro lepsi porozumeni, neni uredni ani overeny. V pripade rozporu ma prednost ceske zneni. SmlouvaHned neni advokatni kancelar a neposkytuje pravni ani imigracni poradenstvi.',
  en: 'The Czech wording of your contract is authoritative. If you select the bilingual add-on, every Czech clause is paired with an English translation in one PDF. The translation is not certified or official. In case of discrepancy, the Czech wording prevails. SmlouvaHned is not a law firm and does not provide legal or immigration advice.',
  ua: 'Визначальним є чеське формулювання договору. Якщо ви оберете двомовне доповнення, кожне чеське положення буде попарно розміщене з українським перекладом в одному PDF. Переклад не є засвідченим чи офіційним. У разі розбіжностей перевагу має чеське формулювання. SmlouvaHned не є юридичною фірмою і не надає юридичних чи імміграційних консультацій.',
};

export const EN_LEGAL_KEY_TERMS = [
  'not legal advice',
  'not immigration advice',
  'not certified or official translation',
  'Czech wording prevails',
];

export const UNSUPPORTED_FORM_NOTICE = UNSUPPORTED_FORM_NOTICE_BY_LOCALE.en;

export const FALLBACK_ENGLISH_UI_NOTICE = FALLBACK_UI_NOTICE_BY_LOCALE.en;

export type { BuilderCopy } from '@/lib/i18n/expat-locale-copy';

export function getBuilderCopy(contractType: ContractType, locale: AppLocale): BuilderCopy | null {
  if (locale === 'cs' || !isExpatContract(contractType)) return null;
  return getLocalizedBuilderCopy(contractType, locale);
}

export function getUnsupportedFormNotice(locale: AppLocale): string {
  if (locale === 'cs') return UNSUPPORTED_FORM_NOTICE_BY_LOCALE.en;
  return UNSUPPORTED_FORM_NOTICE_BY_LOCALE[locale];
}

export function getFallbackUiNotice(locale: AppLocale): string {
  if (locale === 'cs') return FALLBACK_UI_NOTICE_BY_LOCALE.en;
  return FALLBACK_UI_NOTICE_BY_LOCALE[locale];
}
