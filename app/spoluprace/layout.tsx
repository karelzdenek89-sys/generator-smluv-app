import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smlouva o spolupráci online — § 1746 OZ | SmlouvaHned',
  description: 'Vygenerujte smlouvu o spolupráci mezi firmami nebo OSVČ. Podíl na výnosech, IP práva, mlčenlivost, zákaz konkurence. Od 249 Kč, PDF ihned.',
  openGraph: {
    title: 'Smlouva o spolupráci — od 249 Kč | SmlouvaHned',
    description: 'Bezpečná spolupráce s jasnými pravidly. IP, výnosy, mlčenlivost a exit klauzule.',
    url: 'https://smlouvahned.cz/spoluprace',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
