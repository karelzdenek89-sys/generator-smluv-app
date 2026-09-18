import Link from 'next/link';
import {
  DIFFERENTIATION_COMPARISON,
  DIFFERENTIATION_PILLARS,
} from '@/lib/marketing/differentiation';

const CARD_LABELS = ['V dokumentu', 'Při vyplňování', 'Podle situace', 'Před platbou'] as const;

export default function DifferentiationSection() {
  const { generic, ours } = DIFFERENTIATION_COMPARISON;

  return (
    <section className="pt-20 md:pt-24" aria-labelledby="proc-smlouvahned-heading">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <p className="site-kicker mb-2">Jak dokument vzniká</p>
          <h2
            id="proc-smlouvahned-heading"
            className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-[#f2e7c8] md:text-5xl"
          >
            Víte, co je v dokumentu — a z čeho to vychází.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-slate-400 lg:justify-self-end">
          Formulář skládá dokument z vašich údajů. U vybraných ustanovení ukáže právní oporu a u některých voleb upozorní na možné riziko. Nehodnotí ale váš konkrétní případ.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {DIFFERENTIATION_PILLARS.map((item, index) => (
          <article
            key={item.title}
            className="group relative min-h-[220px] overflow-hidden rounded-[1.6rem] border border-white/9 bg-[linear-gradient(145deg,rgba(12,20,38,.88),rgba(7,12,23,.95))] p-6 shadow-[0_20px_55px_rgba(0,0,0,.28)] md:p-7"
          >
            <div className="pointer-events-none absolute -right-5 -top-8 font-serif text-[110px] font-semibold leading-none text-white/[0.025]" aria-hidden="true">
              {item.icon}
            </div>
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-[#c9a852]/20 bg-[#c9a852]/7 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#d9bf79]">
                  {CARD_LABELS[index]}
                </span>
                <span className="font-mono text-[11px] text-slate-600">0{index + 1}</span>
              </div>
              <div className="mt-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a852]/25 bg-[#c9a852]/8 font-serif text-xl font-semibold text-[#d8bd73] shadow-[0_0_30px_rgba(201,168,82,.08)]">
                {item.icon}
              </div>
              <h3 className="mt-5 font-serif text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">{item.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-5 py-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{generic.label}</p>
          <div className="space-y-2">
            {generic.lines.map((line) => (
              <p key={line} className="flex gap-2 text-xs leading-5 text-slate-500">
                <span aria-hidden="true">—</span><span>{line}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#c9a852]/22 bg-[#c9a852]/[0.055] px-5 py-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#d8bd73]">{ours.label}</p>
          <div className="space-y-2">
            {ours.lines.map((line) => (
              <p key={line} className="flex gap-2 text-xs leading-5 text-slate-300">
                <span className="text-[#d8bd73]" aria-hidden="true">✓</span><span>{line}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <aside className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#0c1426]/55 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-sm font-semibold text-white">Kdy už je lepší advokát</p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
            Pokud už probíhá spor, situace je nestandardní nebo potřebujete individuální posouzení konkrétního rizika.
          </p>
        </div>
        <div className="flex shrink-0 gap-4 text-sm">
          <Link href="/o-projektu" className="font-semibold text-[#d8bd73] hover:text-white">Rozsah služby →</Link>
          <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">Seznam ČAK</a>
        </div>
      </aside>
    </section>
  );
}
