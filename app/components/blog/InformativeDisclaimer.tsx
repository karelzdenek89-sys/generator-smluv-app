/**
 * Striktní informativní disclaimer pro blog články.
 *
 * Účel: jednoznačně oddělit informativní obsah od advokátní služby
 * ve smyslu zákona č. 85/1996 Sb., o advokacii. SmlouvaHned je
 * softwarový nástroj, ne advokátní kancelář.
 */
export default function InformativeDisclaimer({
  className = '',
}: {
  className?: string;
}) {
  return (
    <aside
      className={`rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs leading-relaxed text-slate-400 ${className}`}
      role="note"
      aria-label="Právní upozornění"
    >
      <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">
        Informativní obsah
      </div>
      <p>
        Tento článek má výhradně <strong className="text-slate-300">informativní charakter</strong>{' '}
        a vychází z platného znění českých právních předpisů k uvedenému datu. SmlouvaHned je
        softwarový nástroj pro tvorbu standardizovaných dokumentů — <strong className="text-slate-300">není advokátní kanceláří</strong> a neposkytuje právní poradenství
        ve smyslu zákona č. 85/1996 Sb., o advokacii.
      </p>
      <p className="mt-2">
        Pro konkrétní právní situaci, nestandardní případy, transakce vyšší hodnoty nebo
        probíhající spory doporučujeme konzultaci s advokátem — seznam advokátů České
        advokátní komory na{' '}
        <a
          href="https://www.cak.cz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300"
        >
          cak.cz
        </a>
        .
      </p>
    </aside>
  );
}
