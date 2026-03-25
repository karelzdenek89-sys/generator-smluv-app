import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plná moc online — § 441 OZ | SmlouvaHned',
  description: 'Vygenerujte plnou moc pro nemovitost, soud, banku nebo firmu. Obecná, ověřená nebo jednorázová plná moc. Dle § 441 OZ, 2026. Od 299 Kč.',
  openGraph: {
    title: 'Plná moc online — od 299 Kč | SmlouvaHned',
    description: 'Plná moc pro zastupování před úřady, soudy, bankou nebo katastrem. PDF ihned.',
    url: 'https://smlouvahned.cz/plna-moc',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
