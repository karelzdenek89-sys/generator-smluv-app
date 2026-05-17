import type { Metadata } from 'next';
import { makeLandingMetadata } from '@/lib/i18n/landings';

export const metadata: Metadata = makeLandingMetadata('ru');

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
