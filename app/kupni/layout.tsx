import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kupní smlouva online — § 2079 OZ | SmlouvaHned',
  description: 'Vygenerujte kupní smlouvu na jakoukoliv věc — elektroniku, nábytek, vozidlo. Právně správná smlouva dle § 2079 OZ. Hotovo za 3 minuty, 249 Kč.',
  openGraph: {
    title: 'Kupní smlouva online — od 249 Kč | SmlouvaHned',
    description: 'Prodej movité věci bezpečně a právně čistě. Kupní smlouva dle občanského zákoníku.',
    url: 'https://smlouvahned.cz/kupni',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
