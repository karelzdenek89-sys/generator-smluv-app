import type { Metadata } from 'next';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import { BLOG_ARTICLES, BLOG_CLUSTERS } from '@/lib/blog-articles';

export const metadata: Metadata = {
  title: 'Blog | Právní průvodce 2026',
  description:
    'Praktické průvodce ke smlouvám a běžným právním situacím. Obecně informační obsah aktuální pro legislativu 2026.',
  alternates: { canonical: 'https://smlouvahned.cz/blog' },
};

export default function BlogIndexPage() {
  return (
    <div className="blog-listing mx-auto max-w-5xl px-6 py-12">
      <div className="max-w-3xl">
        <div className="site-kicker">Právní průvodce</div>
        <h1 className="site-heading-lg mt-4 text-[#f2e7c8]">
          Praktické články k běžným smluvním situacím
        </h1>
        <p className="site-body-lg mt-5 text-[#d2c8b9]">
          Obecně informační obsah, který pomáhá zorientovat se v běžných dokumentech a
          situacích. Nejde o individuální právní poradenství. Články přirozeně navazují
          na dokumenty, situační stránky a tematické balíčky v rámci SmlouvaHned.
        </p>
      </div>

      <div className="site-content-card mt-10 rounded-[1.75rem] p-7">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="site-kicker">Obsah blogu</div>
            <div className="mt-3 text-lg font-semibold text-[#f2e7c8]">
              K čemu blog slouží
            </div>
          </div>
          <p className="text-base leading-8 text-[#d2c8b9] md:col-span-2">
            Články mají obecně informační charakter. Pomáhají pochopit, co v běžné
            situaci řešit, jaké podklady bývají potřeba a kdy stačí samostatný
            dokument nebo kdy je praktičtější širší řešení. U složitých nebo
            sporných případů doporučujeme konzultaci s advokátem.
          </p>
        </div>
      </div>

      <section className="mt-10">
        <div className="site-kicker">Obsah podle situace</div>
        <h2 className="site-heading-md mt-4">Dva hlavní obsahové okruhy</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {BLOG_CLUSTERS.map((cluster) => (
            <div key={cluster.key} className="site-content-card rounded-[1.75rem] p-7">
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">
                {cluster.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-[#d2c8b9]">
                {cluster.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink
                  href={cluster.situationHref}
                  eventName="blog_cta_click"
                  eventParams={{
                    source: 'blog_index',
                    surface: 'blog_cluster',
                    cta_type: 'cluster_situation',
                    destination: cluster.situationHref,
                  }}
                  className="site-button-secondary"
                >
                  Zobrazit situační stránku
                </TrackedLink>
                <TrackedLink
                  href={cluster.packageHref}
                  eventName="blog_cta_click"
                  eventParams={{
                    source: 'blog_index',
                    surface: 'blog_cluster',
                    cta_type: 'cluster_package',
                    destination: cluster.packageHref,
                  }}
                  className="site-button-primary"
                >
                  {cluster.packageLabel}
                </TrackedLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-6">
        {BLOG_ARTICLES.map((article) => (
          <TrackedLink
            key={article.slug}
            href={article.href}
            eventName="blog_cta_click"
            eventParams={{
              source: 'blog_index',
              surface: 'blog_listing',
              cta_type: 'article_card',
              article_slug: article.slug,
              destination: article.href,
            }}
            className="blog-card block rounded-[1.75rem] p-7 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(214,172,96,0.28)]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[rgba(166,134,91,0.18)] bg-[rgba(21,16,13,0.32)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d6ac60]">
                {article.category}
              </span>
              <span className="text-xs text-[#bba98c]">{article.readTime}</span>
              <span className="text-xs text-[#bba98c]">{article.date}</span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">
              {article.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-[#d2c8b9]">{article.excerpt}</p>
            <div className="mt-6 text-sm font-semibold text-[#d6ac60]">Číst článek</div>
          </TrackedLink>
        ))}
      </div>
    </div>
  );
}
