import Link from 'next/link';

interface ArticleInlineCtaProps {
  /** Tučný titulek — krátká výzva */
  title: string;
  /** Popisný text pod titulkem */
  body: string;
  /** Text na tlačítku */
  buttonLabel: string;
  /** URL produktové stránky */
  href: string;
  /** Volitelná vizuální varianta: 'primary' (amber) nebo 'subtle' (slate) */
  variant?: 'primary' | 'subtle';
}

/**
 * Inline konverzní CTA blok pro použití uvnitř blogových článků.
 * Umísťuj ho na klíčová místa: po sekci s nejčastějšími chybami,
 * po sekci „co musí obsahovat" nebo kdekoliv je uživatel emocionálně
 * připraven hledat řešení.
 */
export default function ArticleInlineCta({
  title,
  body,
  buttonLabel,
  href,
  variant = 'primary',
}: ArticleInlineCtaProps) {
  const isPrimary = variant === 'primary';
  return (
    <div
      className={`my-8 rounded-2xl border p-5 ${
        isPrimary
          ? 'border-amber-500/20 bg-amber-500/8'
          : 'border-slate-700/60 bg-slate-800/30'
      }`}
    >
      <p className="mb-1 text-sm font-bold text-white">{title}</p>
      <p className="mb-4 text-sm text-slate-400">{body}</p>
      <Link
        href={href}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-tight transition ${
          isPrimary
            ? 'bg-amber-500 text-black hover:bg-amber-400'
            : 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white'
        }`}
      >
        {buttonLabel} →
      </Link>
    </div>
  );
}
