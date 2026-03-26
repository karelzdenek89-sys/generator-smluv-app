import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podnájemní smlouva online — § 2274 OZ | SmlouvaHned',
  description: 'Vygenerujte podnájemní smlouvu bezpečně a v souladu se zákonem. Souhlas pronajímatele, kauce, pravidla podnájmu. Od 249 Kč, PDF ihned.',
  openGraph: {
    title: 'Podnájemní smlouva online — od 249 Kč | SmlouvaHned',
    description: 'Legální podnájem bytu dle § 2274 OZ. Formulář, PDF, ihned.',
    url: 'https://smlouvahned.cz/podnajem',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
