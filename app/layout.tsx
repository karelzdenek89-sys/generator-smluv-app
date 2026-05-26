import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { headers } from 'next/headers';
import { detectLocaleFromPath, FOREIGN_LOCALES, LOCALE_META } from '@/lib/i18n/locales';
import './globals.css';
import CookiesBanner from '@/app/components/CookiesBanner';
import Footer from '@/app/components/Footer';
import ForeignVisitorBanner from '@/app/components/ForeignVisitorBanner';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

// hreflang alternates advertised on every page that doesn't override metadata.
// Critical for the CZ homepage — without these Google can't discover the
// /en and /ua expat landing variants from the root URL.
const rootLanguageAlternates: Record<string, string> = {
  cs: BASE_URL,
  'x-default': BASE_URL,
};
for (const l of FOREIGN_LOCALES) {
  rootLanguageAlternates[LOCALE_META[l].htmlLang] = `${BASE_URL}/${LOCALE_META[l].segment}`;
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Generování smluv online 2026 — hotový PDF dokument za 5 minut | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Generování smluv online bez právníka. Nájemní smlouva, kupní smlouva, smlouva o dílo, NDA a další — vyplníte formulář, dostanete PDF připravené k podpisu. Dle legislativy 2026.',
  keywords: [
    'generování smluv online',
    'generátor smluv',
    'nájemní smlouva',
    'kupní smlouva',
    'darovací smlouva',
    'smlouva o dílo',
    'smlouva o zápůjčce',
    'NDA',
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
    title: 'Generování smluv online 2026 — hotový PDF dokument za 5 minut | SmlouvaHned',
    description:
      'Generování smluv online bez právníka. Nájemní smlouva, kupní smlouva, NDA a další — formulář, PDF ihned ke stažení. Dle legislativy 2026.',
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
    title: 'SmlouvaHned | Smluvní dokumenty online',
    description: '14 typů dokumentů. Strukturovaný formulář → PDF. Od 99 Kč.',
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
    languages: rootLanguageAlternates,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  legalName: 'Karel Zdeněk',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  description: 'Softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů online — nájemní smlouva, kupní smlouva, smlouva o dílo, NDA a další. Od 99 Kč.',
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
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') ?? '';
  const locale = detectLocaleFromPath(pathname);
  const lang = LOCALE_META[locale].htmlLang;
  const showCzechSiteSchemas = locale === 'cs';
  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://api.stripe.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.stripe.com" />
        <meta name="theme-color" content="#060912" />
        <meta
          name="seznam-wmt"
          content="zK8529Fk6nDwr8TdyohYqF2LU7YpQVCf"
        />
        {showCzechSiteSchemas ? (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
              }}
            />
          </>
        ) : null}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#060912] text-[#d7dee8]`}
        style={{ colorScheme: 'dark' }}
      >
        <ForeignVisitorBanner />
        {children}
        <Footer />
        <CookiesBanner />
      </body>
    </html>
  );
}
