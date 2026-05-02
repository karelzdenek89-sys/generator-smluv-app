import Link from 'next/link';
import type { ReactNode } from 'react';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import ArticleInlineCta from './ArticleInlineCta';
import ArticleTrustBox from './ArticleTrustBox';
import { articleSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schemas';

type TocItem = {
  href: string;
  label: string;
};

type RelatedLink = {
  href: string;
  label: string;
};

type ArticleAction = {
  title: string;
  body: string;
  buttonLabel: string;
  href: string;
};

type ArticlePageLayoutProps = {
  category: string;
  readTime: string;
  dateTime: string;
  dateLabel: string;
  breadcrumbLabel: string;
  title: string;
  intro: string;
  toc: readonly TocItem[];
  primaryAction?: ArticleAction;
  finalAction?: ArticleAction;
  trustBox: {
    generatorSuitable: string;
    lawyerSuitable: string;
  };
  relatedLinks: readonly RelatedLink[];
  children: ReactNode;
  slug?: string;
};

export default function ArticlePageLayout({
  category,
  readTime,
  dateTime,
  dateLabel,
  breadcrumbLabel,
  title,
  intro,
  toc,
  primaryAction,
  finalAction,
  trustBox,
  relatedLinks,
  children,
  slug,
}: ArticlePageLayoutProps) {
  const articleUrl = slug ? `/blog/${slug}` : '/blog';
  const article = articleSchema({
    title,
    description: intro,
    url: articleUrl,
    datePublished: dateTime,
  });
  const crumbs = breadcrumbSchema([
    { label: 'SmlouvaHned', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: breadcrumbLabel, href: articleUrl },
  ]);
  return (
    <article className="blog-shell mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />
      <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-slate-300">
          SmlouvaHned
        </Link>
        <span className="mx-2 text-slate-700">›</span>
        <Link href="/blog" className="transition hover:text-slate-300">
          Blog
        </Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-slate-400">{breadcrumbLabel}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            {category}
          </span>
          <span className="text-xs text-slate-600">{readTime}</span>
          <time className="text-xs text-slate-600" dateTime={dateTime}>
            {dateLabel}
          </time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">{intro}</p>

        {primaryAction ? (
          <div className="mt-7">
            <ArticleInlineCta
              title={primaryAction.title}
              body={primaryAction.body}
              buttonLabel={primaryAction.buttonLabel}
              href={primaryAction.href}
            />
          </div>
        ) : null}
      </header>

      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
          Obsah článku
        </div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          {toc.map((item, index) => (
            <li key={item.href}>
              <a href={item.href} className="transition hover:text-amber-400">
                {index + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {children}

      <ArticleTrustBox
        generatorSuitable={trustBox.generatorSuitable}
        lawyerSuitable={trustBox.lawyerSuitable}
      />

      {finalAction ? (
        <ArticleInlineCta
          title={finalAction.title}
          body={finalAction.body}
          buttonLabel={finalAction.buttonLabel}
          href={finalAction.href}
          variant="subtle"
        />
      ) : null}

      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">
          Související stránky
        </div>
        <div className="flex flex-wrap gap-3">
          {relatedLinks.map((link) => (
            <TrackedLink
              key={link.href}
              href={link.href}
              eventName="blog_cta_click"
              eventParams={{
                source: 'blog_article',
                surface: 'blog_article',
                cta_type: 'related_link',
              }}
              className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white"
            >
              {link.label}
            </TrackedLink>
          ))}
        </div>
      </div>
    </article>
  );
}
