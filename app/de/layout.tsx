import type { Metadata } from 'next';
import { makeLandingMetadata } from '@/lib/i18n/landings';

export const metadata: Metadata = makeLandingMetadata('de');

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
