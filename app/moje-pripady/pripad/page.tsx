import type { Metadata } from 'next';
import { Suspense } from 'react';
import CaseWorkspace from './CaseWorkspace';

export const metadata: Metadata = {
  title: 'Můj případ',
  description: 'Soukromý přehled konkrétního případu: aktuální stav, důležité termíny, praktické úkoly, připomínky a historie. Přístup je chráněn bezpečným odkazem.',
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noarchive: true } },
};

export default function CasePage() {
  return (
    <Suspense fallback={<main className="site-page" />}>
      <CaseWorkspace />
    </Suspense>
  );
}
