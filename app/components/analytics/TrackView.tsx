'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, type AnalyticsEventName, type AnalyticsEventParams } from '@/lib/analytics';
import {
  isProductAnalyticsConsentGranted,
  rememberTrafficAttributionIfEmpty,
  subscribeToProductAnalyticsConsent,
} from '@/lib/analytics-attribution';

type TrackViewProps = {
  eventName: AnalyticsEventName;
  eventParams?: AnalyticsEventParams;
};

export default function TrackView({ eventName, eventParams }: TrackViewProps) {
  const pathname = usePathname();

  useEffect(() => {
    let sent = false;
    const recordView = () => {
      if (sent || !isProductAnalyticsConsentGranted()) return;
      if (pathname && eventName === 'package_page_view') {
        rememberTrafficAttributionIfEmpty({
          source: 'package_page',
          label: 'Balíčková stránka',
          pathname,
        });
      } else if (pathname && eventName === 'situation_page_view') {
        rememberTrafficAttributionIfEmpty({
          source: 'situation_page',
          label: 'Situační stránka',
          pathname,
        });
      }
      trackEvent(eventName, {
        ...eventParams,
        pathname: pathname ?? eventParams?.pathname,
      });
      sent = true;
    };
    recordView();
    return subscribeToProductAnalyticsConsent(recordView);
  }, [eventName, eventParams, pathname]);

  return null;
}
