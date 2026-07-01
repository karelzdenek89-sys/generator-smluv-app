import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import InformativeDisclaimer from '@/app/components/blog/InformativeDisclaimer';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import {
  EXPAT_BLOG_CONTRACT_LINKS,
  getExpatBlogArticle,
  type ExpatBlogArticle,
} from '@/lib/i18n/expat-blog-articles';
import { getExpatSeoLanding } from '@/lib/i18n/expat-seo-landings';
import { EXPAT_CONTRACT_ROUTES, withLocale, type AppLocale } from '@/lib/locale';

type Props = {
  article: ExpatBlogArticle;
};

function seoLandingLinkLabel(article: ExpatBlogArticle): string | null {
  if (!article.seoLandingHref || article.contractKey === 'hub') return null;
  const seo = getExpatSeoLanding(article.contractKey, article.audience);
  if (!seo) return null;
  return article.audience === 'en'
    ? `Full page: ${seo.h1}`
    : `Сторінка: ${seo.h1}`;
}

export default function ExpatBlogArticleView({ article }: Props) {
  const locale: AppLocale = article.audience;
  const contractLinks = EXPAT_BLOG_CONTRACT_LINKS[locale];
  const hubSlug =
    locale === 'en' ? 'foreigners-czech-contracts-guide-en' : 'foreigners-czech-contracts-guide-ua';
  const isExpatHubArticle = article.slug === hubSlug;
  const seoLinkLabel = seoLandingLinkLabel(article);
  const finalCtaHref =
    article.finalCta.href ??
    (article.builderHref === '/en' || article.builderHref === '/ua'
      ? article.expatHubHref
      : article.builderHref);

  return (
    <article className="blog-listing mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-8 text-xs text-[#bba98c]" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-[#d6ac60]">
          SmlouvaHned
        </Link>
        <span className="mx-2 text-[#7a6f5f]">›</span>
        <Link href="/blog" className="transition hover:text-[#d6ac60]">
          {article.ui.breadcrumbBlog}
        </Link>
        <span className="mx-2 text-[#7a6f5f]">›</span>
        <span className="text-[#d2c8b9]">{article.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[rgba(166,134,91,0.22)] bg-[rgba(21,16,13,0.32)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d6ac60]">
            {article.category}
          </span>
          <span className="text-xs text-[#bba98c]">
            {article.readTime} {article.ui.readTime}
          </span>
          <time className="text-xs text-[#bba98c]" dateTime={article.dateTime}>
            {article.dateLabel}
          </time>
        </div>
        <h1 className="site-heading-lg text-[#f2e7c8]">{article.title}</h1>
        <p className="site-body-lg mt-5 text-[#d2c8b9]">{article.intro}</p>

        <InformativeDisclaimer locale={locale} className="mt-6" />

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href={article.expatHubHref} className="link-gold-elegant">
            {article.ui.backToExpats}
          </Link>
          {article.seoLandingHref && seoLinkLabel ? (
            <Link href={article.seoLandingHref} className="link-gold-elegant">
              {seoLinkLabel} →
            </Link>
          ) : null}
        </div>
      </header>

      <ArticleInlineCta
        title={article.primaryCta.title}
        body={article.primaryCta.body}
        buttonLabel={article.primaryCta.buttonLabel}
        href={article.builderHref}
      />

      {article.seoLandingHref && seoLinkLabel && article.contractKey !== 'hub' ? (
        <p className="mb-10 text-center text-sm text-[#bba98c]">
          <Link href={article.seoLandingHref} className="font-semibold text-[#d6ac60] hover:underline">
            {seoLinkLabel} →
          </Link>
        </p>
      ) : null}

      {article.contractKey === 'hub' && isExpatHubArticle ? (
        <section className="site-content-card mb-10 rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold text-[#f2e7c8]">{article.ui.contractLinksTitle}</h2>
          <ul className="mt-5 space-y-4">
            {contractLinks.map((item) => {
              const seo = getExpatSeoLanding(item.contract, locale);
              return (
              <li
                key={item.contract}
                className="flex flex-col gap-2 border-b border-[rgba(166,134,91,0.12)] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold text-[#f2e7c8]">
                    {locale === 'en' ? item.labelEn : item.labelUa}
                  </div>
                  <div className="mt-2 flex flex-col gap-1 text-sm">
                    <Link
                      href={`/blog/expat/${item.guideSlug}`}
                      className="text-[#d6ac60] hover:underline"
                    >
                      {locale === 'en' ? 'Read guide →' : 'Читати гід →'}
                    </Link>
                    <Link href={item.seoHref} className="text-[#bba98c] hover:text-[#d6ac60] hover:underline">
                      {locale === 'en'
                        ? `Contract overview: ${seo?.h1 ?? item.labelEn}`
                        : `Огляд: ${seo?.h1 ?? item.labelUa}`}{' '}
                      →
                    </Link>
                  </div>
                </div>
                <TrackedLink
                  href={withLocale(EXPAT_CONTRACT_ROUTES[item.contract], locale)}
                  eventName="blog_cta_click"
                  eventParams={{
                    source: 'blog_expat_hub',
                    surface: 'contract_link',
                    article_slug: item.guideSlug,
                    destination: withLocale(EXPAT_CONTRACT_ROUTES[item.contract], locale),
                  }}
                  className="site-button-secondary shrink-0 text-center text-sm"
                >
                  {locale === 'en' ? 'Open form' : 'Відкрити форму'}
                </TrackedLink>
              </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <nav
        className="site-content-card mb-10 rounded-[1.75rem] p-6"
        aria-label={article.ui.tocTitle}
      >
        <div className="site-kicker">{article.ui.tocTitle}</div>
        <ol className="mt-4 space-y-2 text-sm text-[#d2c8b9]">
          {article.toc.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition hover:text-[#d6ac60]">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {article.sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10 scroll-mt-6">
          <h2 className="site-heading-md mb-4 text-[#f2e7c8]">{section.title}</h2>
          {section.paragraphs.map((p) => (
            <p key={p} className="mb-4 text-base leading-8 text-[#d2c8b9]">
              {p}
            </p>
          ))}
          {section.bullets?.length ? (
            <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-[#d2c8b9]">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <ArticleTrustBox
        generatorSuitable={article.trustBox.generatorSuitable}
        lawyerSuitable={article.trustBox.lawyerSuitable}
      />

      <ArticleInlineCta
        title={article.finalCta.title}
        body={article.finalCta.body}
        buttonLabel={article.finalCta.buttonLabel}
        href={finalCtaHref}
        variant="subtle"
      />

      <InformativeDisclaimer locale={locale} className="mt-10" />

      {article.relatedSlugs.length > 0 ? (
        <section className="mt-12 border-t border-[rgba(166,134,91,0.15)] pt-10">
          <h2 className="site-kicker">{article.ui.relatedHub}</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <TrackedLink
                href={article.builderHref}
                eventName="blog_cta_click"
                eventParams={{
                  source: 'blog_expat_related',
                  surface: 'contract_link',
                  article_slug: article.slug,
                  destination: article.builderHref,
                }}
                className="font-semibold text-[#d6ac60] hover:underline"
              >
                {article.primaryCta.buttonLabel}
              </TrackedLink>
            </li>
            {finalCtaHref !== article.builderHref ? (
              <li>
                <TrackedLink
                  href={finalCtaHref}
                  eventName="blog_cta_click"
                  eventParams={{
                    source: 'blog_expat_related',
                    surface: 'contract_link_secondary',
                    article_slug: article.slug,
                    destination: finalCtaHref,
                  }}
                  className="font-semibold text-[#d6ac60] hover:underline"
                >
                  {article.finalCta.buttonLabel}
                </TrackedLink>
              </li>
            ) : null}
            {article.relatedSlugs.map((slug) => {
              const related = getExpatBlogArticle(slug);
              if (!related) return null;
              return (
                <li key={slug}>
                  <Link href={`/blog/expat/${slug}`} className="text-[#d6ac60] hover:underline">
                    {related.title}
                  </Link>
                </li>
              );
            })}
            {article.contractKey !== 'hub' ? (
              <li>
                <Link href={`/blog/expat/${hubSlug}`} className="text-[#d6ac60] hover:underline">
                  {getExpatBlogArticle(hubSlug)?.title}
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      <p className="mt-8 text-center text-xs text-[#8a7d6c]">
        <Link href="/blog" className="hover:text-[#d6ac60]">
          ← {article.ui.breadcrumbBlog}
        </Link>
      </p>
    </article>
  );
}
