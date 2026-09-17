import type { Metadata } from 'next';
import { Suspense } from 'react';
import CaseWorkspace from './CaseWorkspace';

export const metadata: Metadata = {
  title: 'Moje zakázka',
  description: 'Soukromý přehled vaší zakázky: aktuální fáze, termín dokončení, e-mailové připomínky, úkoly a navazující dokumenty. Přístup pouze návratovým odkazem.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function CasePage() {
  return (
    <Suspense fallback={<main className="site-page" />}>
      <CaseWorkspace />
    </Suspense>
  );
}
