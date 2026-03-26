import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pracovní smlouva online — § 34 zákoníku práce | SmlouvaHned',
  description: 'Vygenerujte pracovní smlouvu se všemi zákonnými náležitostmi. Druh práce, místo výkonu, mzda, zkušební doba. Dle zákoníku práce 2026. Od 249 Kč.',
  openGraph: {
    title: 'Pracovní smlouva online — od 249 Kč | SmlouvaHned',
    description: 'Právně správná pracovní smlouva dle § 34 ZP. Vyplňte formulář, stáhněte PDF.',
    url: 'https://smlouvahned.cz/pracovni',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
