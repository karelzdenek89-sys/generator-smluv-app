'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { rememberTrafficAttribution } from '@/lib/analytics-attribution';

type SeoLandingTrackerProps = {
  pathname: string;
  label: string;
};

export default function SeoLandingTracker({ pathname, label }: SeoLandingTrackerProps) {
  useEffect(() => {
    rememberTrafficAttribution({
      source: 'seo_landing',
      label,
      pathname,
    });

    trackEvent('seo_landing_view', {
      source: 'seo_landing',
      surface: 'seo_landing',
      pathname,
    });
  }, [label, pathname]);

  return null;
}
