import LocaleLandingPage from '@/app/components/LocaleLandingPage';
import { LANDINGS } from '@/lib/i18n/landings';

export default function VietnameseLandingPage() {
  return <LocaleLandingPage locale="vn" content={LANDINGS.vn} />;
}
