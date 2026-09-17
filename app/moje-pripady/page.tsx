import type { Metadata } from 'next';
import { Suspense } from 'react';
import CaseHub from './CaseHub';

export const metadata: Metadata = {
  title: 'Moje případy',
  description: 'Soukromý přehled uložených případů, důležitých termínů a dalších kroků. Přístup získáte bezpečným odkazem zaslaným na e-mail z objednávky.',
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noarchive: true } },
};

export default function MyCasesPage() {
  return <Suspense fallback={<main className="site-page" />}><CaseHub /></Suspense>;
}
