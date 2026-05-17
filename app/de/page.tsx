import LocaleLandingPage from '@/app/components/LocaleLandingPage';
import { LANDINGS } from '@/lib/i18n/landings';

export default function GermanLandingPage() {
  return <LocaleLandingPage locale="de" content={LANDINGS.de} />;
}
