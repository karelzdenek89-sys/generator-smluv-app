interface ArticleTrustBoxProps {
  /** Co produktový generátor zvládne dobře */
  generatorSuitable: string;
  /** Kdy raději zvolit advokáta */
  lawyerSuitable: string;
}

/**
 * Trust box pro blogové články — objektivně informuje uživatele,
 * kdy je online generátor dostačující a kdy je vhodné sáhnout
 * po individuální právní pomoci. Posiluje důvěryhodnost produktu
 * a snižuje riziko negativního dojmu u uživatelů s atypickými případy.
 */
export default function ArticleTrustBox({
  generatorSuitable,
  lawyerSuitable,
}: ArticleTrustBoxProps) {
  return (
    <div className="my-10 rounded-2xl border border-slate-700/40 bg-slate-800/25 px-6 py-5">
      <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
        Kdy použít generátor a kdy advokáta
      </div>
      <div className="grid gap-4 sm:grid-cols-2 text-sm">
        <div>
          <div className="mb-1.5 font-bold text-emerald-400">✓ Generátor postačuje</div>
          <p className="text-slate-400 leading-relaxed">{generatorSuitable}</p>
        </div>
        <div>
          <div className="mb-1.5 font-bold text-slate-400">⚖ Zvažte advokáta</div>
          <p className="text-slate-500 leading-relaxed">{lawyerSuitable}</p>
        </div>
      </div>
    </div>
  );
}
