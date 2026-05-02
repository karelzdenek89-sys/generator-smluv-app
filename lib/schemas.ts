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
};

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: ArticleSchemaInput) {
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
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: 'SmlouvaHned',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmlouvaHned',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/og-image.png`,
      },
    },
  };
}

export function jsonLdScript(schema: object) {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
