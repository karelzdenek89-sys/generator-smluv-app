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
