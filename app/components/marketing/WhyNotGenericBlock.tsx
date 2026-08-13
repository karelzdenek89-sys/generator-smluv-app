'use client';

import Link from 'next/link';
import { useBuilderLocale } from '@/app/components/BuilderLocaleNotice';
import type { ContractType } from '@/lib/contracts';
import { resolveDocumentHint } from '@/lib/marketing/differentiation';
import { getWhyNotGenericCopy } from '@/lib/i18n/why-not-generic-copy';
import type { MonetizationMode } from '@/lib/monetization-policy';

type WhyNotGenericBlockProps = {
  className?: string;
  /** Např. „u nájemní smlouvy“ — pro české SEO stránky */
  documentHint?: string;
  seoPath?: string;
  contractType?: ContractType | null;
  monetizationMode?: MonetizationMode;
  compact?: boolean;
  showComparison?: boolean;
};

export default function WhyNotGenericBlock({
  className = '',
  documentHint,
  seoPath,
  contractType,
  monetizationMode,
  compact = false,
  showComparison = true,
}: WhyNotGenericBlockProps) {
  const locale = useBuilderLocale();
  const copy = getWhyNotGenericCopy(locale);
  const resolvedHint = resolveDocumentHint({
    explicit: documentHint,
    seoPath,
    contractType,
    locale,
  });
  const intro = resolvedHint ? copy.introWithHint(resolvedHint) : copy.introGeneric;
  const bullets = contractType === 'dpp'
    && locale === 'cs'
    && monetizationMode === 'free_experiment'
    ? [
        ...copy.bullets.slice(0, -1),
        'Tady nejdřív doplníte údaje, projdete náhled a základní PDF zdarma vygenerujete po dokončení formuláře.',
      ]
    : copy.bullets;

  return (
    <aside
      className={`rounded-[1.5rem] border border-[#a6865b22] bg-[rgba(16,13,11,0.28)] ${compact ? 'p-5 md:p-6' : 'p-7 md:p-8'} ${className}`}
      aria-labelledby="why-not-generic-title"
    >
      <p className="site-kicker">{copy.kicker}</p>
      <h2
        id="why-not-generic-title"
        className={`mt-3 font-serif italic font-bold text-[#f2e7c8] ${compact ? 'text-xl' : 'text-2xl md:text-3xl'}`}
      >
        {copy.title}
      </h2>
      <p className={`mt-3 max-w-3xl leading-relaxed text-[#a79d89] ${compact ? 'text-sm' : 'text-base'}`}>
        {intro}
      </p>

      {showComparison ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-xl border border-[#a6865b18] bg-[rgba(8,6,5,0.35)] px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8f8472]">
              {copy.generic.label}
            </p>
            <ul className="mt-3 space-y-2">
              {copy.generic.lines.map((line) => (
                <li key={line} className="flex items-start gap-2 text-[#9b8f7f]">
                  <span aria-hidden className="shrink-0 text-[#705f49]">
                    ✗
                  </span>
                  <span className="leading-6">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[#d6ac6044] bg-[rgba(214,172,96,0.06)] px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d6ac60]">
              {copy.ours.label}
            </p>
            <ul className="mt-3 space-y-2">
              {copy.ours.lines.map((line) => (
                <li key={line} className="flex items-start gap-2 text-[#ddd5c9]">
                  <span aria-hidden className="shrink-0 text-[#d6ac60]">
                    ✓
                  </span>
                  <span className="leading-6">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <ul className={`mt-5 space-y-3 ${compact ? 'text-sm' : 'text-base'}`}>
        {bullets.map((line) => (
          <li key={line} className="flex items-start gap-3 text-[#ddd5c9]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6ac60]" aria-hidden />
            <span className="leading-7">{line}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-[#8f8472]">
        {copy.footer}{' '}
        <Link href="/o-projektu" className="text-[#d6ac60] underline-offset-2 hover:underline">
          {copy.footerLink}
        </Link>
      </p>
    </aside>
  );
}
