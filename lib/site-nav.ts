/**
 * Jediný zdroj položek hlavní navigace.
 *
 * Do 17. 9. 2026 měly homepage a SiteHeader vlastní, rozcházející se seznamy —
 * homepage neuváděla FAQ a používala jiný popisek pro Nástroje. Obě plochy teď
 * čtou odsud, takže se rozejít nemůžou.
 */
export type SiteNavItem = {
  /** Cesta z libovolné stránky. */
  href: string;
  /** Kotva použitelná přímo na homepage (bez zbytečného přenačtení). */
  homeHref?: string;
  label: string;
};

export const SITE_NAV_ITEMS: readonly SiteNavItem[] = [
  { href: '/#situace', homeHref: '#situace', label: 'Situace' },
  { href: '/#smlouvy', homeHref: '#smlouvy', label: 'Dokumenty' },
  { href: '/nastroje', label: 'Nástroje' },
  { href: '/zmeny-2027', label: 'Změny 2027' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
];

export const SITE_NAV_ACCOUNT: SiteNavItem = {
  href: '/moje',
  label: 'Můj účet',
};

export const SITE_NAV_MY_CASES: SiteNavItem = {
  href: '/moje-pripady',
  label: 'Moje případy',
};

export const SITE_NAV_MY_DOCUMENTS: SiteNavItem = {
  href: '/zakaznicka-zona',
  label: 'Moje dokumenty',
};

export const SITE_NAV_CUSTOMER_ITEMS: readonly SiteNavItem[] = [
  SITE_NAV_ACCOUNT,
  SITE_NAV_MY_CASES,
  SITE_NAV_MY_DOCUMENTS,
];

/** Hlavní CTA v hlavičce. */
export const SITE_NAV_PRIMARY_CTA = { href: '/#smlouvy', label: 'Vybrat' };

export function siteNavHref(item: SiteNavItem, onHomepage: boolean): string {
  return onHomepage && item.homeHref ? item.homeHref : item.href;
}
