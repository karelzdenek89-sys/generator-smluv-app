import { FileCheck2, FileText, Languages, PencilLine } from 'lucide-react';

const FACTS = [
  {
    value: '14',
    eyebrow: 'Výběr',
    title: 'typů dokumentů',
    text: 'Nájem, auto, práce, podnikání a další běžné situace.',
    icon: FileCheck2,
  },
  {
    value: 'PDF',
    eyebrow: 'Výstup',
    title: 'ke stažení po platbě',
    text: 'Hotový dokument dostanete po ověření platby.',
    icon: FileText,
  },
  {
    value: 'DOCX',
    eyebrow: 'Volitelně',
    title: 'editovatelná verze',
    text: 'Pro pozdější úpravy hlavního smluvního dokumentu.',
    icon: PencilLine,
  },
  {
    value: 'EN / UA',
    eyebrow: 'Jazyky',
    title: 'nápověda a přílohy',
    text: 'U vybraných dokumentů také dvojjazyčná vysvětlující příloha.',
    icon: Languages,
  },
] as const;

export default function ProductScopeStrip({ className = '' }: { className?: string }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.75rem] border border-[#c9a852]/18 bg-[radial-gradient(circle_at_12%_0%,rgba(201,168,82,0.12),transparent_34%),linear-gradient(145deg,rgba(17,29,55,0.86),rgba(7,13,26,0.92))] px-5 py-6 shadow-[0_22px_55px_rgba(0,0,0,0.28)] md:px-7 md:py-7 ${className}`}
      aria-labelledby="product-scope-title"
    >
      <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a852]">V ceně podle zvolené varianty</p>
          <h3 id="product-scope-title" className="mt-2 font-serif text-2xl font-semibold text-[#f2e7c8] md:text-3xl">
            Co získáte po dokončení dokumentu
          </h3>
        </div>
        <p className="max-w-sm text-xs leading-5 text-slate-400">
          Přesný obsah i cenu uvidíte před objednávkou.
        </p>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {FACTS.map(({ value, eyebrow, title, text, icon: Icon }) => (
          <article
            key={value}
            className="group relative min-h-44 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#c9a852]/30 hover:bg-white/[0.055] md:p-5"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#c9a852]/8 blur-2xl transition group-hover:bg-[#c9a852]/14" aria-hidden="true" />
            <div className="relative flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c9a852]/25 bg-[#c9a852]/8 text-[#e8d092]">
                <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">{eyebrow}</span>
            </div>
            <p className="relative mt-5 font-serif text-2xl font-semibold tracking-tight text-[#e8d092] md:text-3xl">{value}</p>
            <p className="relative mt-1 text-xs font-semibold text-slate-200">{title}</p>
            <p className="relative mt-2 text-[11px] leading-5 text-slate-400">{text}</p>
          </article>
        ))}
      </div>

      <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-3">
        {[
          'Bez povinného účtu',
          'Volitelné checklisty a protokoly',
          'Návrat k nákupu přes Moje dokumenty',
        ].map((item) => (
          <div key={item} className="rounded-xl border border-white/8 bg-black/15 px-3 py-2.5 text-[11px] leading-4 text-slate-300">
            <span className="mr-2 text-[#c9a852]" aria-hidden="true">✓</span>{item}
          </div>
        ))}
      </div>
    </section>
  );
}
