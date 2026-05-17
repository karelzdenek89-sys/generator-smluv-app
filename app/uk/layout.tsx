import type { Metadata } from 'next';
import { makeLandingMetadata } from '@/lib/i18n/landings';

export const metadata: Metadata = makeLandingMetadata('uk');

export default function UkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
