import Link from 'next/link';
import {
  WHY_US_CZ_EXCERPT,
  WHY_US_CZ_HREF,
  WHY_US_CZ_SLUG,
  WHY_US_CZ_TITLE,
  WHY_US_EN_HREF,
  WHY_US_UA_HREF,
} from '@/lib/marketing/why-us-article';

type WhyUsArticleCalloutProps = {
  className?: string;
  /** Skryt na stránce samotného článku */
  currentSlug?: string;
  compact?: boolean;
};

export default function WhyUsArticleCallout({
  className = '',
  currentSlug,
  compact = false,
}: WhyUsArticleCalloutProps) {
  if (currentSlug === WHY_US_CZ_SLUG) return null;

  return (
    <aside
      className={`rounded-[1.25rem] border border-[#c9a852]/25 bg-[#c9a852]/6 ${compact ? 'p-5' : 'p-6 md:p-7'} ${className}`}
      aria-labelledby="why-us-callout-title"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">
        Srovnání s běžným vzorem
      </p>
      <h2
        id="why-us-callout-title"
        className={`mt-2 font-semibold text-[#f2e7c8] ${compact ? 'text-base' : 'text-lg'}`}
      >
        <Link href={WHY_US_CZ_HREF} className="hover:text-[#d6ac60] transition-colors">
          {WHY_US_CZ_TITLE}
        </Link>
      </h2>
      <p className={`mt-2 leading-relaxed text-[#a79d89] ${compact ? 'text-sm' : 'text-base'}`}>
        {WHY_US_CZ_EXCERPT}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Link
          href={WHY_US_EN_HREF}
          hrefLang="en"
          className="rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-amber-500/30 hover:text-amber-300"
        >
          English
        </Link>
        <Link
          href={WHY_US_UA_HREF}
          hrefLang="uk"
          className="rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-amber-500/30 hover:text-amber-300"
        >
          Українська
        </Link>
      </div>
    </aside>
  );
}
