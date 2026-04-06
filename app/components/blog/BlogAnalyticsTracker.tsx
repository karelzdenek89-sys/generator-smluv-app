'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function BlogAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === '/blog' || !pathname.startsWith('/blog/')) return;

    trackEvent('blog_article_view', {
      surface: 'blog_article',
      source: 'blog_article',
      pathname,
    });
  }, [pathname]);

  return null;
}
