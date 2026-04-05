interface ArticleTrustBoxProps {
  generatorSuitable: string;
  lawyerSuitable: string;
}

export default function ArticleTrustBox({
  generatorSuitable,
  lawyerSuitable,
}: ArticleTrustBoxProps) {
  return (
    <div className="my-10 rounded-[1.75rem] border border-slate-700/40 bg-gradient-to-br from-slate-800/40 to-slate-900/40 px-6 py-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        Kdy použít generátor a kdy advokáta
      </div>
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
          <div className="mb-1.5 font-bold text-emerald-400">✓ Generátor postačuje</div>
          <p className="leading-relaxed text-slate-300">{generatorSuitable}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
          <div className="mb-1.5 font-bold text-slate-300">⚖ Zvažte advokáta</div>
          <p className="leading-relaxed text-slate-400">{lawyerSuitable}</p>
        </div>
      </div>
    </div>
  );
}
