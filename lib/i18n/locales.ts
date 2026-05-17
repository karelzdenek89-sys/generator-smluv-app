export type Locale = 'cs' | 'en' | 'uk' | 'ru' | 'vn' | 'de';

export const DEFAULT_LOCALE: Locale = 'cs';

export const FOREIGN_LOCALES: ReadonlyArray<Exclude<Locale, 'cs'>> = ['en', 'uk', 'ru', 'vn', 'de'];

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
  segment: '' | 'en' | 'uk' | 'ru' | 'vn' | 'de';
  /** does this locale require a Cyrillic/Vietnamese-capable font? */
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
  uk: {
    locale: 'uk',
    htmlLang: 'uk',
    ogLocale: 'uk_UA',
    nativeName: 'Українська',
    englishName: 'Ukrainian',
    flag: '🇺🇦',
    segment: 'uk',
    needsExtendedFont: true,
  },
  ru: {
    locale: 'ru',
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    nativeName: 'Русский',
    englishName: 'Russian',
    flag: '🇷🇺',
    segment: 'ru',
    needsExtendedFont: true,
  },
  vn: {
    locale: 'vn',
    htmlLang: 'vi',
    ogLocale: 'vi_VN',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    flag: '🇻🇳',
    segment: 'vn',
    needsExtendedFont: true,
  },
  de: {
    locale: 'de',
    htmlLang: 'de',
    ogLocale: 'de_DE',
    nativeName: 'Deutsch',
    englishName: 'German',
    flag: '🇩🇪',
    segment: 'de',
    needsExtendedFont: false,
  },
};

/**
 * "Prevailing language" disclaimer shown at top of bilingual PDF.
 * Avoids the riskier formulation "Czech version is legally binding", which
 * could be misread as the document itself being legal advice. Instead uses
 * a standard prevailing-language clause and explicitly states the translation
 * is NOT certified / official.
 */
export const PDF_BILINGUAL_DISCLAIMER: Record<Exclude<Locale, 'cs'>, string> = {
  en: 'In case of any discrepancy between language versions, the Czech wording prevails. The translation is provided for convenience only and is not a certified or official translation.',
  uk: 'У разі будь-яких розбіжностей між мовними версіями переважає чеська. Переклад надається лише для зручності і не є офіційним або засвідченим перекладом.',
  ru: 'В случае каких-либо расхождений между языковыми версиями преимущественную силу имеет чешская. Перевод предоставляется исключительно для удобства и не является официальным или заверенным переводом.',
  vn: 'Trong trường hợp có bất kỳ sự khác biệt nào giữa các phiên bản ngôn ngữ, bản tiếng Séc được ưu tiên áp dụng. Bản dịch chỉ được cung cấp để tiện theo dõi và không phải là bản dịch chính thức hoặc có công chứng.',
  de: 'Bei Abweichungen zwischen den Sprachfassungen ist der tschechische Wortlaut maßgebend. Die Übersetzung dient ausschließlich der besseren Verständlichkeit und ist keine beglaubigte oder amtliche Übersetzung.',
};

/** Czech-side prevailing-language line, always shown next to the foreign one. */
export const PDF_BILINGUAL_DISCLAIMER_CS =
  'V případě jakýchkoli rozporů mezi jazykovými verzemi je rozhodující české znění. Překlad slouží pouze pro orientaci a nejedná se o úřední ani ověřený překlad.';

export function detectLocaleFromPath(pathname: string): Locale {
  for (const meta of Object.values(LOCALE_META)) {
    if (!meta.segment) continue;
    if (pathname === `/${meta.segment}` || pathname.startsWith(`/${meta.segment}/`)) {
      return meta.locale;
    }
  }
  return DEFAULT_LOCALE;
}

export function localeHomePath(locale: Locale): string {
  const seg = LOCALE_META[locale].segment;
  return seg ? `/${seg}` : '/';
}
