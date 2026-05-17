import LocaleLandingPage from '@/app/components/LocaleLandingPage';
import { LANDINGS } from '@/lib/i18n/landings';

export default function RussianLandingPage() {
  return <LocaleLandingPage locale="ru" content={LANDINGS.ru} />;
}
