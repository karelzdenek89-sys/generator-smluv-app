import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smlouva o poskytování služeb online — § 1746 OZ | SmlouvaHned',
  description: 'Vygenerujte smlouvu o poskytování služeb pro freelancery, agentury i firmy. IT, marketing, konzultace. Paušál, hodinová sazba nebo pevná cena. Od 299 Kč.',
  openGraph: {
    title: 'Smlouva o poskytování služeb — od 299 Kč | SmlouvaHned',
    description: 'Freelanceři a agentury — chraňte se profesionální smlouvou. SLA, IP, mlčenlivost.',
    url: 'https://smlouvahned.cz/sluzby',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
