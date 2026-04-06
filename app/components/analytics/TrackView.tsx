'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, type AnalyticsEventName, type AnalyticsEventParams } from '@/lib/analytics';

type TrackViewProps = {
  eventName: AnalyticsEventName;
  eventParams?: AnalyticsEventParams;
};

export default function TrackView({ eventName, eventParams }: TrackViewProps) {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent(eventName, {
      ...eventParams,
      pathname: pathname ?? eventParams?.pathname,
    });
  }, [eventName, eventParams, pathname]);

  return null;
}
