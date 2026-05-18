const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${BASE_URL}${item.href}`,
    })),
  };
}

export type ArticleSchemaInput = {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
  /**
   * Volitelný „job title" autora. Pro SmlouvaHned VŽDY platí:
   * autorovo postavení je „Zakladatel a provozovatel SmlouvaHned"
   * — NIKOLI advokát, právník, koncipient. Karel Zdeněk není advokát.
   */
  authorJobTitle?: string;
  authorUrl?: string;
};

/**
 * Doplní časové pásmo k ISO date řetězci (např. „2026-04-15") na
 * „2026-04-15T08:00:00+02:00" — Google Rich Results doporučuje
 * datetime s timezone, jinak hlásí non-critical warning.
 */
function toIsoDateTimeCz(date: string): string {
  if (!date) return date;
  if (date.includes('T')) return date;
  return `${date}T08:00:00+02:00`;
}

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
  authorName,
  authorJobTitle,
  authorUrl,
}: ArticleSchemaInput) {
  const author = authorName
    ? {
        '@type': 'Person' as const,
        name: authorName,
        ...(authorJobTitle ? { jobTitle: authorJobTitle } : {}),
        ...(authorUrl ? { url: authorUrl } : {}),
        worksFor: {
          '@type': 'Organization',
          name: 'SmlouvaHned',
          url: BASE_URL,
        },
      }
    : { '@type': 'Organization' as const, name: 'SmlouvaHned', url: BASE_URL };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'cs',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `${BASE_URL}${url}`,
    },
    image: image
      ? image.startsWith('http')
        ? image
        : `${BASE_URL}${image}`
      : `${BASE_URL}/og-image.png`,
    datePublished: toIsoDateTimeCz(datePublished),
    dateModified: toIsoDateTimeCz(dateModified || datePublished),
    author,
    publisher: {
      '@type': 'Organization',
      name: 'SmlouvaHned',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    },
  };
}

export type SoftwareApplicationSchemaInput = {
  name: string;
  slug: string;
  description?: string;
  /**
   * Pokud false (default), použije se třístupňový pricing 99/199/299 Kč.
   * Pokud true, jen 99/199 Kč (pro produkty bez tematického balíčku).
   */
  twoTierOnly?: boolean;
};

export function softwareApplicationSchema({
  name,
  slug,
  description,
  twoTierOnly = false,
}: SoftwareApplicationSchemaInput) {
  const url = `${BASE_URL}${slug}`;
  const offers = twoTierOnly
    ? [
        { '@type': 'Offer', name: 'Základní dokument', price: '99', priceCurrency: 'CZK', url },
        { '@type': 'Offer', name: 'Rozšířený dokument', price: '199', priceCurrency: 'CZK', url },
      ]
    : [
        { '@type': 'Offer', name: 'Základní dokument', price: '99', priceCurrency: 'CZK', url },
        { '@type': 'Offer', name: 'Rozšířený dokument', price: '199', priceCurrency: 'CZK', url },
        { '@type': 'Offer', name: 'Tematický balíček', price: '299', priceCurrency: 'CZK', url },
      ];

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'cs',
    ...(description ? { description } : {}),
    provider: {
      '@type': 'Organization',
      name: 'SmlouvaHned',
      url: BASE_URL,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'CZK',
      lowPrice: '99',
      highPrice: twoTierOnly ? '199' : '299',
      offerCount: String(offers.length),
      offers,
    },
  };
}

export type FaqItem = { question: string; answer: string };

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function jsonLdScript(schema: object) {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

export type ExpatLocaleSchemaLocale = 'en' | 'ua';

/** Organization JSON-LD tuned for /en and /ua expat landings. */
export function organizationSchemaLocalized(locale: ExpatLocaleSchemaLocale) {
  const isEn = locale === 'en';
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'SmlouvaHned',
    legalName: 'Karel Zdeněk',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
    description: isEn
      ? 'Online tool for Czech contracts with English-guided forms for foreigners. Czech PDF output; selected contracts include an explanatory English annex (not certified or official).'
      : 'Онлайн-інструмент для чеських договорів з формою українською для іноземців. PDF чеською; для оренди — пояснювальний український додаток (не офіційний переклад).',
    inLanguage: isEn ? 'en' : 'uk',
    areaServed: { '@type': 'Country', name: 'Czech Republic' },
    availableLanguage: isEn ? ['English', 'Czech'] : ['Ukrainian', 'Czech'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plzeňská 189',
      addressLocality: 'Staňkov',
      postalCode: '345 61',
      addressCountry: 'CZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@smlouvahned.cz',
      availableLanguage: isEn ? ['English', 'Czech'] : ['Ukrainian', 'Czech'],
    },
    founder: { '@type': 'Person', name: 'Karel Zdeněk' },
    taxID: '23660295',
  };
}

/** WebSite JSON-LD for locale hub pages (/en, /ua). */
export function websiteSchemaLocalized(locale: ExpatLocaleSchemaLocale) {
  const isEn = locale === 'en';
  const localeUrl = `${BASE_URL}/${locale}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${localeUrl}#website`,
    name: 'SmlouvaHned',
    alternateName: isEn
      ? 'SmlouvaHned — contracts for foreigners in the Czech Republic'
      : 'SmlouvaHned — договори для іноземців у Чехії',
    url: localeUrl,
    inLanguage: isEn ? 'en' : 'uk',
    description: isEn
      ? 'English-guided Czech rental, employment, DPP, sublease, power of attorney and car sale contracts for expats in Czechia.'
      : 'Чеські договори оренди, праці, DPP, піднайму, довіреності та купівлі авто з формою українською для іноземців у Чехії.',
    publisher: { '@id': `${BASE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
