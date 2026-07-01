import { SITE_URL } from '@/lib/seo/site';

const WHY_SMOLOUVAHNED_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/proc-smlouvahned-misto-vzoru-2026`,
  en: `${SITE_URL}/blog/expat/why-smlouvahned-not-template-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/why-smlouvahned-not-template-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/proc-smlouvahned-misto-vzoru-2026`,
};

/** Slugs (Czech or expat) that share a trilingual hreflang cluster. */
export const BLOG_HREFLANG_CLUSTER_BY_SLUG: Record<string, Record<string, string>> = {
  'proc-smlouvahned-misto-vzoru-2026': WHY_SMOLOUVAHNED_CLUSTER,
  'why-smlouvahned-not-template-2026-guide-en': WHY_SMOLOUVAHNED_CLUSTER,
  'why-smlouvahned-not-template-2026-guide-ua': WHY_SMOLOUVAHNED_CLUSTER,
};

export function getBlogHreflangAlternates(slug: string): Record<string, string> | undefined {
  return BLOG_HREFLANG_CLUSTER_BY_SLUG[slug];
}
