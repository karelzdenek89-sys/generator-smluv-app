export type PreferredPublicLocale = 'cs' | 'en' | 'ua';

export type LegacyLangRedirect = {
  preferredLocale: PreferredPublicLocale | null;
  search: string;
};

function normalizeQueryLocale(value: string | null): PreferredPublicLocale | null {
  const locale = value?.trim().toLowerCase();
  if (locale === 'cs' || locale === 'en') return locale;
  if (locale === 'ua' || locale === 'uk' || locale === 'ukr') return 'ua';
  return null;
}

/**
 * Returns a query string without the legacy `lang` parameter for public pages.
 * The transactional success page keeps `lang` because it selects the purchased
 * document language when the download URL is assembled.
 */
export function getLegacyLangRedirect(
  pathname: string,
  input: URLSearchParams,
): LegacyLangRedirect | null {
  if (pathname === '/success' || !input.has('lang')) return null;

  const searchParams = new URLSearchParams(input);
  const preferredLocale = normalizeQueryLocale(searchParams.get('lang'));
  searchParams.delete('lang');

  return {
    preferredLocale,
    search: searchParams.toString(),
  };
}
