import Link from 'next/link';
import { BLOG_ARTICLES, type BlogArticleMeta } from '@/lib/blog-articles';
import { WHY_US_CZ_SLUG } from '@/lib/marketing/why-us-article';

type Props = {
  currentSlug: string;
  /** Maximální počet souvisejících článků (default 3) */
  limit?: number;
};

/**
 * Vybere související články podle clusteru s fallbackem na ostatní clustery,
 * vyloučí current. Cíl: 3+ vnitřních prolinků pro každý článek (RankBrain + dwell time).
 */
function pickRelated(currentSlug: string, limit: number): BlogArticleMeta[] {
  const current = BLOG_ARTICLES.find((a) => a.slug === currentSlug);
  if (!current) return BLOG_ARTICLES.slice(0, limit) as BlogArticleMeta[];

  const sameCluster = BLOG_ARTICLES.filter(
    (a) => a.slug !== currentSlug && a.cluster === current.cluster,
  );
  const others = BLOG_ARTICLES.filter(
    (a) => a.slug !== currentSlug && a.cluster !== current.cluster,
  );

  const pool = [...sameCluster, ...others];
  const whyUs = BLOG_ARTICLES.find((a) => a.slug === WHY_US_CZ_SLUG);
  const withWhyUs =
    currentSlug !== WHY_US_CZ_SLUG && whyUs && !pool.some((a) => a.slug === WHY_US_CZ_SLUG)
      ? [whyUs, ...pool]
      : pool;

  return withWhyUs.slice(0, limit);
}

export default function RelatedArticles({ currentSlug, limit = 3 }: Props) {
  const items = pickRelated(currentSlug, limit);
  if (items.length === 0) return null;

  return (
    <section className="mt-14 border-t border-white/8 pt-10" aria-labelledby="related-articles-heading">
      <div className="mb-5 text-[11px] font-black uppercase tracking-widest text-slate-500">
        Další články z blogu
      </div>
      <h2 id="related-articles-heading" className="mb-6 text-xl font-black tracking-tight text-white">
        Mohlo by vás zajímat
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((article) => (
          <Link
            key={article.slug}
            href={article.href}
            className="group block rounded-2xl border border-white/8 bg-[#0c1426] p-5 transition hover:-translate-y-0.5 hover:border-amber-500/30"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {article.category}
              </span>
              <span className="text-[11px] text-slate-600">{article.readTime}</span>
            </div>
            <h3 className="mb-2 text-sm font-black leading-snug tracking-tight text-white transition group-hover:text-amber-400">
              {article.title}
            </h3>
            <p className="line-clamp-3 text-xs leading-relaxed text-slate-500">
              {article.excerpt}
            </p>
            <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Číst článek →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
