import LocaleLandingPage from '@/app/components/LocaleLandingPage';
import { LANDINGS } from '@/lib/i18n/landings';

export default function EnglishLandingPage() {
  return <LocaleLandingPage locale="en" content={LANDINGS.en} />;
}
