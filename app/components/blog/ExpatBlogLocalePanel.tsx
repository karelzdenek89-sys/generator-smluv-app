import TrackedLink from '@/app/components/analytics/TrackedLink';
import type { BlogArticleMeta } from '@/lib/blog-articles';

const COPY = {
  en: {
    flag: '🇬🇧',
    kicker: 'For foreigners in the Czech Republic',
    title: 'Contract guides in English',
    description:
      'Informational articles about typical Czech contracts. Where available, fill the form in English and download a Czech PDF with an explanatory English annex (not certified or official). Czech wording prevails.',
    overviewHref: '/en',
    overviewLabel: 'English contract overview',
    hubLabel: 'Start with the main guide',
    articlesHeading: 'All English guides',
  },
  ua: {
    flag: '🇺🇦',
    kicker: 'Для іноземців у Чехії',
    title: 'Гіди українською',
    description:
      'Інформаційні статті про типові чеські договори. Де доступно — форма українською, PDF переважно чеською з пояснювальним українським додатком (не офіційний переклад). Перевага має чеське формулювання.',
    overviewHref: '/ua',
    overviewLabel: 'Огляд договорів українською',
    hubLabel: 'Почніть з головного гіда',
    articlesHeading: 'Усі гіди українською',
  },
} as const;

type Props = {
  locale: 'en' | 'ua';
  hub: BlogArticleMeta | undefined;
  articles: BlogArticleMeta[];
};

export default function ExpatBlogLocalePanel({ locale, hub, articles }: Props) {
  const copy = COPY[locale];
  const borderClass =
    locale === 'en'
      ? 'border-sky-500/25 bg-sky-500/5 hover:border-sky-400/40'
      : 'border-amber-500/25 bg-amber-500/8 hover:border-amber-400/35';
  const topicArticles = articles.filter((a) => !a.slug.includes('foreigners-czech-contracts-guide'));

  return (
    <div className={`site-content-card rounded-[1.75rem] border p-7 transition ${borderClass}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">
          {copy.flag}
        </span>
        <p className="site-kicker !mb-0">{copy.kicker}</p>
      </div>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">{copy.title}</h3>
      <p className="mt-4 text-base leading-8 text-[#d2c8b9]">{copy.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <TrackedLink
          href={copy.overviewHref}
          eventName="blog_cta_click"
          eventParams={{
            source: 'blog_index',
            surface: 'expat_locale_panel',
            cta_type: `overview_${locale}`,
            destination: copy.overviewHref,
          }}
          className="site-button-primary"
        >
          {copy.overviewLabel}
        </TrackedLink>
      </div>

      {hub ? (
        <TrackedLink
          href={hub.href}
          eventName="blog_cta_click"
          eventParams={{
            source: 'blog_index',
            surface: 'expat_locale_panel',
            cta_type: `hub_${locale}`,
            destination: hub.href,
          }}
          className="mt-6 block rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-[#d6ac60]/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-[#d6ac60]">{copy.hubLabel}</p>
          <p className="mt-2 font-semibold text-[#f2e7c8]">{hub.title}</p>
          <p className="mt-2 text-sm leading-7 text-[#d2c8b9]">{hub.excerpt}</p>
        </TrackedLink>
      ) : null}

      {topicArticles.length > 0 ? (
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#bba98c]">{copy.articlesHeading}</p>
          <ul className="mt-4 space-y-2">
            {topicArticles.map((article) => (
              <li key={article.slug}>
                <TrackedLink
                  href={article.href}
                  eventName="blog_cta_click"
                  eventParams={{
                    source: 'blog_index',
                    surface: 'expat_locale_panel',
                    cta_type: `article_${locale}`,
                    article_slug: article.slug,
                    destination: article.href,
                  }}
                  className="block text-sm leading-7 text-[#d6ac60] hover:underline"
                >
                  {article.title}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
