import LocaleLandingPage from '@/app/components/LocaleLandingPage';
import { LANDINGS } from '@/lib/i18n/landings';

export default function UkrainianLandingPage() {
  return <LocaleLandingPage locale="uk" content={LANDINGS.uk} />;
}
