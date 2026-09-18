import { FileText, Languages, Layers3, PencilLine, Check } from 'lucide-react';

const FACTS = [
  {
    value: '14',
    eyebrow: 'Výběr',
    label: 'typů dokumentů pro běžné životní a podnikatelské situace',
    icon: Layers3,
    accent: 'border-[#c9a852]/25 bg-[#c9a852]/7 text-[#e8d092]',
  },
  {
    value: 'PDF',
    eyebrow: 'Výstup',
    label: 'hotový dokument ke stažení po ověřené platbě',
    icon: FileText,
    accent: 'border-sky-300/20 bg-sky-300/6 text-sky-200',
  },
  {
    value: 'DOCX',
    eyebrow: 'Volitelné',
    label: 'editovatelná verze hlavního smluvního dokumentu',
    icon: PencilLine,
    accent: 'border-emerald-300/20 bg-emerald-300/6 text-emerald-200',
  },
  {
    value: 'EN / UA',
    eyebrow: 'Jazyky',
    label: 'nápověda a vybrané dvojjazyčné přílohy',
    icon: Languages,
    accent: 'border-violet-300/20 bg-violet-300/6 text-violet-200',
  },
] as const;

export default function ProductScopeStrip({ className = '' }: { className?: string }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(145deg,rgba(12,20,38,.94),rgba(9,15,29,.92)_55%,rgba(201,168,82,.08))] px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,.32)] md:px-7 md:py-7 ${className}`}
      aria-label="Co nástroj skutečně umí"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#c9a852]/8 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(260px,.65fr)] md:items-end">
          <div>
            <p className="site-kicker mb-2">Co získáte</p>
            <h3 className="max-w-2xl font-serif text-2xl font-semibold text-[#f2e7c8] md:text-3xl">
              Co si z objednávky skutečně odnesete
            </h3>
          </div>
          <p className="text-sm leading-6 text-slate-400 md:text-right">
            Rozsah se liší podle zvoleného dokumentu a varianty. Před objednávkou vždy vidíte konkrétní obsah i cenu.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FACTS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.value}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.055]"
              >
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${item.accent}`}>
                  <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                </div>
                <p className="mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">{item.eyebrow}</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#f2e7c8] md:text-3xl">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.label}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/8 pt-4">
          {['Bez povinné registrace', 'Bez předplatného', 'Archiv odkazu až 90 dní'].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-black/15 px-3 py-1.5 text-[11px] text-slate-300">
              <Check size={13} className="text-[#d8bd73]" aria-hidden="true" />
              {item}
            </span>
          ))}
          <span className="px-1 py-1.5 text-[11px] text-slate-500">Doplňky se zobrazují jen tam, kde dávají smysl.</span>
        </div>
      </div>
    </section>
  );
}
