import type { Metadata } from 'next';
import { Suspense } from 'react';
import CaseHub from './CaseHub';

export const metadata: Metadata = {
  title: 'Moje případy',
  description: 'Soukromý přehled uložených situací, termínů a dalších kroků.',
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noarchive: true } },
};

export default function MyCasesPage() {
  return <Suspense fallback={<main className="site-page" />}><CaseHub /></Suspense>;
}
