import type { Metadata } from 'next';
import { makeLandingMetadata } from '@/lib/i18n/landings';

export const metadata: Metadata = makeLandingMetadata('en');

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
