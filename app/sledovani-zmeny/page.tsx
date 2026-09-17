import type { Metadata } from 'next';
import { Suspense } from 'react';
import LegislationWatchManager from './LegislationWatchManager';

export const metadata: Metadata = {
  title: 'Správa legislativního upozornění',
  description: 'Potvrďte nebo zrušte funkční upozornění na změnu legislativního stavu či data účinnosti. Stránka slouží pouze ke správě vašeho bezpečného upozornění.',
  robots: { index: false, follow: false, noarchive: true },
};

export default function WatchPage() {
  return <Suspense fallback={<main className="site-page" />}><LegislationWatchManager /></Suspense>;
}
