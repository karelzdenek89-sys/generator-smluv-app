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
import { rememberTrafficAttribution } from '@/lib/analytics-attribution';

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
    const destination = eventParams?.destination ?? hrefToString(href);

    if (sourcePath.startsWith('/blog/')) {
      const slug = defaults.article_slug;
      rememberTrafficAttribution({
        source: 'blog_article',
        label: `Článek: ${slug ?? sourcePath}`,
        article_slug: slug,
        pathname: sourcePath,
      });
    } else if (eventParams?.surface === 'seo_landing' || eventParams?.source === 'seo_landing') {
      rememberTrafficAttribution({
        source: 'seo_landing',
        label: `SEO: ${sourcePath}`,
        pathname: sourcePath,
      });
    } else if (eventParams?.surface === 'package_page') {
      rememberTrafficAttribution({
        source: 'package_page',
        label: 'Balíčková stránka',
        pathname: sourcePath,
      });
    } else if (eventParams?.surface === 'situation_page') {
      rememberTrafficAttribution({
        source: 'situation_page',
        label: 'Situační stránka',
        pathname: sourcePath,
      });
    }

    trackEvent(eventName, {
      ...defaults,
      source: eventParams?.source ?? defaults.source ?? sourcePath,
      destination,
      ...eventParams,
    });
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
