import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { headers } from 'next/headers';
import { detectLocaleFromPath, LOCALE_META } from '@/lib/i18n/locales';
import './globals.css';
import CookiesBanner from '@/app/components/CookiesBanner';
import Footer from '@/app/components/Footer';
import ForeignVisitorBanner from '@/app/components/ForeignVisitorBanner';
import SiteAnalytics from '@/app/components/SiteAnalytics';
import SiteHeader from '@/app/components/SiteHeader';
import { OG_IMAGE_PATH, SITE_URL } from '@/lib/seo/site';

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

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Generování smluv online 2026 — hotový PDF dokument za 5 minut | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Generování smluv online bez právníka. Nájemní smlouva, kupní smlouva, smlouva o dílo, NDA a další — vyplníte formulář, dostanete PDF připravené k podpisu. Dle legislativy 2026.',
  authors: [{ name: 'SmlouvaHned', url: BASE_URL }],
  creator: 'SmlouvaHned',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: BASE_URL,
    siteName: 'SmlouvaHned',
    title: 'Generování smluv online 2026 — hotový PDF dokument za 5 minut',
    description:
      'Generování smluv online bez právníka. Nájemní smlouva, kupní smlouva, NDA a další — formulář, PDF ihned ke stažení. Dle legislativy 2026.',
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: 'SmlouvaHned — Generátor smluv',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmlouvaHned | Smluvní dokumenty online',
    description: '14 typů dokumentů. Strukturovaný formulář, PDF ihned a volitelné add-ony podle potřeby.',
    images: [OG_IMAGE_PATH],
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
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  legalName: 'Karel Zdeněk',
  url: BASE_URL,
  logo: `${BASE_URL}${OG_IMAGE_PATH}`,
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
  const showSiteHeader =
    locale === 'cs' &&
    pathname !== '' &&
    pathname !== '/' &&
    !pathname.startsWith('/success') &&
    !pathname.startsWith('/api');
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
        {showSiteHeader ? <SiteHeader /> : null}
        {children}
        <Footer />
        <CookiesBanner />
        <SiteAnalytics />
      </body>
    </html>
  );
}
