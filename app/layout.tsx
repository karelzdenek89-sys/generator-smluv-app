import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SmlouvaHned | Profesionální smlouvy online — od 249 Kč',
    template: '%s | SmlouvaHned',
  },
  description:
    'Vygenerujte si nájemní smlouvu, kupní smlouvu, darovací smlouvu, smlouvu o dílo, zápůjčce nebo NDA za 3 minuty. Aktualizováno pro legislativu 2026. Od 249 Kč.',
  keywords: [
    'nájemní smlouva',
    'kupní smlouva',
    'darovací smlouva',
    'smlouva o dílo',
    'smlouva o zápůjčce',
    'NDA',
    'mlčenlivost',
    'generátor smluv',
    'online smlouva',
    'šablona smlouvy',
    'právní dokument',
    'smlouva PDF',
    '2026',
  ],
  authors: [{ name: 'SmlouvaHned', url: BASE_URL }],
  creator: 'SmlouvaHned',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: BASE_URL,
    siteName: 'SmlouvaHned',
    title: 'SmlouvaHned | Profesionální smlouvy online — od 249 Kč',
    description:
      'Nájemní smlouva, kupní smlouva, NDA a další — s paragrafy OZ, okamžité PDF ke stažení.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SmlouvaHned — Generátor smluv',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmlouvaHned | Profesionální smlouvy online',
    description: '14 typů smluv s paragrafy OZ. Formulář → PDF. Od 249 Kč.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  url: 'https://smlouvahned.cz',
  logo: 'https://smlouvahned.cz/og-image.png',
  description: 'Generátor právních smluv online — nájemní smlouva, kupní smlouva, smlouva o dílo, NDA a další. Od 249 Kč, PDF ihned.',
  inLanguage: 'cs',
  areaServed: 'CZ',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@smlouvahned.cz',
    availableLanguage: 'Czech',
  },
  founder: {
    '@type': 'Person',
    name: 'Karel Zdeněk',
  },
  taxID: '23660295',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SmlouvaHned',
  url: 'https://smlouvahned.cz',
  inLanguage: 'cs',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://smlouvahned.cz/blog?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#04070E" />
        <meta
          name="seznam-wmt"
          content="xQaMUlE4cn6PrnQkBxclmM5kzajCqWAD"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="antialiased bg-[#04070E] text-slate-200" style={{colorScheme: 'dark'}}>
        {children}
      </body>
    </html>
  );
}