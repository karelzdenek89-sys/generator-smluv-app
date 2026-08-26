import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import CookiesBanner from '@/app/components/CookiesBanner';
import Footer from '@/app/components/Footer';
import RouteChrome from '@/app/components/RouteChrome';
import SiteAnalytics from '@/app/components/SiteAnalytics';
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

const LOCALE_BOOTSTRAP_SCRIPT = `(()=>{try{const p=location.pathname.replace(/\\/$/,"")||"/";const s=p.split("/")[1]||"";let l=s==="ua"?"uk":s==="en"?"en":"cs";if(p.startsWith("/blog/expat/")){l=p.endsWith("-ua")?"uk":p.endsWith("-en")?"en":l}if(l==="cs"&&new Set(["/najem","/podnajem","/pracovni","/dpp","/plna-moc","/auto"]).has(p)){const q=new URLSearchParams(location.search).get("lang");l=q==="ua"||q==="uk"||q==="ukr"?"uk":q==="en"?"en":"cs"}document.documentElement.lang=l}catch{}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Generování smluv online 2026 — PDF za 5 minut | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Generování smluv online. Nájemní a kupní smlouva, smlouva o dílo, DPP, NDA a další — vyplníte formulář a stáhnete PDF připravené k podpisu. Dle legislativy 2026.',
  authors: [{ name: 'SmlouvaHned', url: BASE_URL }],
  creator: 'SmlouvaHned',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: BASE_URL,
    siteName: 'SmlouvaHned',
    title: 'Generování smluv online 2026 — PDF dokument za 5 minut',
    description:
      'Generování smluv online. Nájemní a kupní smlouva, smlouva o dílo, NDA a další — vyplníte formulář a stáhnete PDF ihned. Dle legislativy 2026.',
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="dns-prefetch" href="https://checkout.stripe.com" />
        <meta name="theme-color" content="#060912" />
        <meta
          name="seznam-wmt"
          content="1kRt8NQO2kwavM4MjoHzXWCI6dxVOV"
        />
        <script dangerouslySetInnerHTML={{ __html: LOCALE_BOOTSTRAP_SCRIPT }} />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#060912] text-[#d7dee8]`}
        style={{ colorScheme: 'dark' }}
      >
        <RouteChrome />
        {children}
        <Footer />
        <CookiesBanner />
        <SiteAnalytics />
      </body>
    </html>
  );
}
