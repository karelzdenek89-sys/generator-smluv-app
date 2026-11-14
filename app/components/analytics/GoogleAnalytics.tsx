'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  getGoogleAnalyticsConsent,
  subscribeToAnalyticsConsentChange,
} from '@/lib/analytics-attribution';
import {
  clearGoogleAnalyticsCookies,
  enableGoogleAnalytics,
  isGoogleAnalyticsExcludedPath,
  pauseGoogleAnalytics,
  revokeGoogleAnalytics,
} from '@/lib/google-analytics';

function syncGoogleAnalytics(measurementId: string, pathname: string) {
  const consent = getGoogleAnalyticsConsent();
  if (consent !== 'granted') {
    if (consent === 'denied') revokeGoogleAnalytics(measurementId);
    else clearGoogleAnalyticsCookies();
    return;
  }
  if (isGoogleAnalyticsExcludedPath(pathname)) {
    pauseGoogleAnalytics(measurementId);
    return;
  }
  enableGoogleAnalytics(measurementId);
}

/**
 * Načte GA4 až po souhlasu s analytikou. Renderuje se jen tehdy, když je
 * nastavené NEXT_PUBLIC_GA_MEASUREMENT_ID (viz app/layout.tsx).
 */
export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    syncGoogleAnalytics(measurementId, pathname);
    return subscribeToAnalyticsConsentChange(() => {
      syncGoogleAnalytics(measurementId, window.location.pathname);
    });
  }, [measurementId, pathname]);

  return null;
}
