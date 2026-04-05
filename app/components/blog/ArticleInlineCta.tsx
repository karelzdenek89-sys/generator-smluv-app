import Link from 'next/link';

interface ArticleInlineCtaProps {
  title: string;
  body: string;
  buttonLabel: string;
  href: string;
  variant?: 'primary' | 'subtle';
  relatedHref?: string;
  relatedLabel?: string;
}

export default function ArticleInlineCta({
  title,
  body,
  buttonLabel,
  href,
  variant = 'primary',
  relatedHref = '/#dokumenty',
  relatedLabel = 'Zobrazit související dokumenty',
}: ArticleInlineCtaProps) {
  const isPrimary = variant === 'primary';

  return (
    <div
      className={`my-10 rounded-[1.75rem] border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)] ${
        isPrimary
          ? 'border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-[#0f172b] to-[#0a1325]'
          : 'border-slate-700/60 bg-gradient-to-br from-slate-800/60 to-slate-900/50'
      }`}
    >
      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Praktický krok dál</div>
      <p className="mb-2 text-lg font-black text-white">{title}</p>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-slate-300">{body}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={href}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black uppercase tracking-tight transition ${
            isPrimary
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white'
          }`}
        >
          {buttonLabel} <span aria-hidden>→</span>
        </Link>
        <Link
          href={relatedHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-amber-500/25 hover:text-white"
        >
          {relatedLabel} <span aria-hidden>↗</span>
        </Link>
      </div>
    </div>
  );
}
