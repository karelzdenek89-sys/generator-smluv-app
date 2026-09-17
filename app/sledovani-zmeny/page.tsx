import type { Metadata } from 'next';
import { Suspense } from 'react';
import LegislationWatchManager from './LegislationWatchManager';

export const metadata: Metadata = {
  title: 'Správa legislativního upozornění',
  description: 'Potvrzení nebo zrušení funkčního upozornění na změnu legislativního stavu.',
  robots: { index: false, follow: false, noarchive: true },
};

export default function WatchPage() {
  return <Suspense fallback={<main className="site-page" />}><LegislationWatchManager /></Suspense>;
}
