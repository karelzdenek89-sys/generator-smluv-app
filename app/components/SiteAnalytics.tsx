import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/** Cookieless návštěvnost a Core Web Vitals na Vercel (bez dalšího consent banneru). */
export default function SiteAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
