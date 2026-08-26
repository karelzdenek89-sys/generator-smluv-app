'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import {
  isProductAnalyticsConsentGranted,
  rememberTrafficAttributionIfEmpty,
  subscribeToProductAnalyticsConsent,
} from '@/lib/analytics-attribution';

export default function HomepageAnalyticsTracker() {
  useEffect(() => {
    let sent = false;
    const recordView = () => {
      if (sent || !isProductAnalyticsConsentGranted()) return;
      rememberTrafficAttributionIfEmpty({
        source: 'homepage',
        label: 'Homepage',
        pathname: '/',
      });
      trackEvent('homepage_view', {
        source: 'homepage',
        surface: 'homepage',
        pathname: '/',
      });
      sent = true;
    };
    recordView();
    return subscribeToProductAnalyticsConsent(recordView);
  }, []);

  return null;
}
