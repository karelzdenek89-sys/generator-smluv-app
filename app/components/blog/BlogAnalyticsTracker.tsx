'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import {
  isProductAnalyticsConsentGranted,
  rememberTrafficAttributionIfEmpty,
  subscribeToProductAnalyticsConsent,
} from '@/lib/analytics-attribution';

export default function BlogAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === '/blog' || !pathname.startsWith('/blog/')) return;

    const articleSlug = pathname.replace('/blog/', '').split('?')[0];

    let sent = false;
    const recordView = () => {
      if (sent || !isProductAnalyticsConsentGranted()) return;
      rememberTrafficAttributionIfEmpty({
        source: 'blog_article',
        label: `Článek: ${articleSlug}`,
        article_slug: articleSlug,
        pathname,
      });
      trackEvent('blog_article_view', {
        surface: 'blog_article',
        source: 'blog_article',
        article_slug: articleSlug,
        pathname,
      });
      sent = true;
    };
    recordView();
    return subscribeToProductAnalyticsConsent(recordView);
  }, [pathname]);

  return null;
}
