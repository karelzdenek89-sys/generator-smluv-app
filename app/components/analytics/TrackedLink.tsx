'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';
import {
  getAnalyticsDefaultsForPathname,
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from '@/lib/analytics';

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: ComponentProps<typeof Link>['href'];
  eventName: AnalyticsEventName;
  eventParams?: AnalyticsEventParams;
};

function hrefToString(href: TrackedLinkProps['href']) {
  if (typeof href === 'string') return href;
  return href.pathname ?? '';
}

export default function TrackedLink({
  href,
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    const sourcePath = pathname ?? '/';
    const defaults = getAnalyticsDefaultsForPathname(sourcePath);

    trackEvent(eventName, {
      ...defaults,
      source: eventParams?.source ?? defaults.source ?? sourcePath,
      destination: eventParams?.destination ?? hrefToString(href),
      ...eventParams,
    });
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
