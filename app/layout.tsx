import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import CookiesBanner from '@/app/components/CookiesBanner';

const sansFont = localFont({
  src: [
    { path: '../public/fonts/Roboto-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Roboto-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

const serifFont = localFont({
  src: [
    { path: '../public/fonts/Roboto-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Roboto-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-serif',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SmlouvaHned | Standardizované smluvní dokumenty online',
    template: '%s | SmlouvaHned',
  },
  description:
    'Online nástroj pro sestavení standardizovaných smluvních dokumentů pro běžné životní a podnikatelské situace. Přehledný formulář, bezpečná platba a PDF dokument určený ke kontrole a podpisu.',
  keywords: [
    'nájemní smlouva',
    'kupní smlouva',
    'darovací smlouva',
    'smlouva o dílo',
    'smlouva o zápůjčce',
    'NDA',
    'mlčenlivost',
    'online smlouva',
    'šablona smlouvy',
    'smluvní dokument',
    'PDF dokument',
    '2026',
  ],
  authors: [{ name: 'SmlouvaHned', url: BASE_URL }],
  creator: 'SmlouvaHned',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: BASE_URL,
    siteName: 'SmlouvaHned',
    title: 'SmlouvaHned | Standardizované smluvní dokumenty online',
    description:
      'Nájemní smlouva, kupní smlouva, NDA a další standardizované dokumenty online. Přehledný formulář a PDF dokument určený ke kontrole a podpisu.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SmlouvaHned – standardizované smluvní dokumenty online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmlouvaHned | Standardizované smluvní dokumenty online',
    description: 'Typové smluvní dokumenty online. Přehledný formulář, bezpečná platba a PDF výstup.',
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
  legalName: 'Karel Zdeněk',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  description:
    'Online software pro sestavení standardizovaných smluvních dokumentů pro běžné životní a podnikatelské situace.',
  inLanguage: 'cs',
  areaServed: 'CZ',
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
  url: BASE_URL,
  inLanguage: 'cs',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
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
        <meta name="theme-color" content="#060912" />
        <meta name="seznam-wmt" content="xQaMUlE4cn6PrnQkBxclmM5kzajCqWAD" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }}
        />
      </head>
      <body
        className={`${sansFont.variable} ${serifFont.variable} bg-[#060912] text-[#d7dee8] antialiased`}
        style={{ colorScheme: 'dark' }}
      >
        {children}
        <CookiesBanner />
      </body>
    </html>
  );
}
