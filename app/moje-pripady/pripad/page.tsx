import type { Metadata } from 'next';
import { Suspense } from 'react';
import CaseWorkspace from './CaseWorkspace';

export const metadata: Metadata = {
  title: 'Můj případ',
  description: 'Soukromý přehled uložené situace: stav, termín, úkoly a připomínky. Přístup pouze bezpečným návratovým odkazem.',
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noarchive: true } },
};

export default function CasePage() {
  return (
    <Suspense fallback={<main className="site-page" />}>
      <CaseWorkspace />
    </Suspense>
  );
}
