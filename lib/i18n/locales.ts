export type Locale = 'cs' | 'en' | 'ua';

export const DEFAULT_LOCALE: Locale = 'cs';

export const FOREIGN_LOCALES: ReadonlyArray<Exclude<Locale, 'cs'>> = ['en', 'ua'];

export const ALL_LOCALES: ReadonlyArray<Locale> = ['cs', ...FOREIGN_LOCALES];

export type LocaleMeta = {
  locale: Locale;
  /** value for html lang and hreflang */
  htmlLang: string;
  /** value for OG locale */
  ogLocale: string;
  /** native name shown in language switcher */
  nativeName: string;
  /** English name (for menus) */
  englishName: string;
  /** flag emoji (purely decorative) */
  flag: string;
  /** root URL segment; 'cs' has empty (default route) */
  segment: '' | 'en' | 'ua';
  needsExtendedFont: boolean;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  cs: {
    locale: 'cs',
    htmlLang: 'cs',
    ogLocale: 'cs_CZ',
    nativeName: 'Česky',
    englishName: 'Czech',
    flag: '🇨🇿',
    segment: '',
    needsExtendedFont: false,
  },
  en: {
    locale: 'en',
    htmlLang: 'en',
    ogLocale: 'en_US',
    nativeName: 'English',
    englishName: 'English',
    flag: '🇬🇧',
    segment: 'en',
    needsExtendedFont: false,
  },
  ua: {
    locale: 'ua',
    htmlLang: 'uk',
    ogLocale: 'uk_UA',
    nativeName: 'Українська',
    englishName: 'Ukrainian',
    flag: '🇺🇦',
    segment: 'ua',
    needsExtendedFont: true,
  },
};

/**
 * "Prevailing language" disclaimer shown at top of bilingual PDF.
 */
export const PDF_BILINGUAL_DISCLAIMER: Record<Exclude<Locale, 'cs'>, string> = {
  en: 'In case of any discrepancy between language versions, the Czech wording prevails. The translation is provided for convenience only and is not a certified or official translation.',
  ua: 'У разі будь-яких розбіжностей між мовними версіями переважає чеська. Переклад надається лише для зручності і не є офіційним або засвідченим перекладом.',
};

/** Czech-side prevailing-language line, always shown next to the foreign one. */
export const PDF_BILINGUAL_DISCLAIMER_CS =
  'V případě jakýchkoli rozporů mezi jazykovými verzemi je rozhodující české znění. Překlad slouží pouze pro orientaci a nejedná se o úřední ani ověřený překlad.';

const RETIRED_PATH_SEGMENTS = ['uk', 'ru', 'vn', 'vi', 'de'] as const;

export function detectLocaleFromPath(pathname: string): Locale {
  if (pathname === '/ua' || pathname.startsWith('/ua/')) return 'ua';
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  for (const seg of RETIRED_PATH_SEGMENTS) {
    if (pathname === `/${seg}` || pathname.startsWith(`/${seg}/`)) {
      return seg === 'uk' ? 'ua' : 'en';
    }
  }
  return DEFAULT_LOCALE;
}

export function localeHomePath(locale: Locale): string {
  const seg = LOCALE_META[locale].segment;
  return seg ? `/${seg}` : '/';
}
