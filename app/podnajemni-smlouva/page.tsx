import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Podnájemní smlouva online 2026 — vzor ke stažení | SmlouvaHned',
  description:
    'Podnájemní smlouva se souhlasem pronajímatele. Kauce, pravidla, předávací protokol. Dle § 2274 OZ 2026. PDF ke stažení po ověřené platbě od 249 Kč.',
  keywords: [
    'podnájemní smlouva',
    'podnájemní smlouva vzor 2026',
    'podnájem byt smlouva',
    'podnájemní smlouva formulář',
    'podnájemní smlouva online',
    'podnájem souhlasem',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/podnajemni-smlouva' },
  openGraph: {
    title: 'Podnájemní smlouva online 2026 | SmlouvaHned',
    description: 'Podnájemní smlouva se souhlasem pronajímatele. Kauce, pravidla, předávací protokol. § 2274 OZ. Od 249 Kč.',
    url: 'https://smlouvahned.cz/podnajemni-smlouva',
  },
};

const faq = [
  {
    q: 'Je souhlas pronajímatele s podnájmem povinný?',
    a: 'Ano. Nájemce může dát byt do podnájmu jen s předchozím písemným souhlasem pronajímatele. Bez souhlasu by šlo o podstatné porušení smlouvy a pronajímatel by mohl nájem vypovědět. Výjimkou je případ, kdy nájemce v bytě sám trvale bydlí — pak může ubytovat další osoby bez souhlasu, ale stále musí pronajímatele informovat.',
  },
  {
    q: 'Jak vysoká může být kauce u podnájmu?',
    a: 'Zákon pro podnájem žádný strop nestanoví — kauce je věcí dohody. U nájmu bytu je zákonný limit 3 měsíční nájemné. Pro podnájem platí smluvní volnost, ale příliš vysoká kauce může být považována za nepřiměřenou — doporučujeme 1–3 měsíce.',
  },
  {
    q: 'Může podnájemník byt dál podnajmout?',
    a: 'Nikoli bez souhlasu podnajímatele. Řetězový podnájem je nutno výslovně zakázat nebo podmínit souhlasem — smlouva by to měla ošetřit.',
  },
  {
    q: 'Co se stane s podnájmem, pokud skončí hlavní nájem?',
    a: 'Podnájemní smlouva nemůže trvat déle než nájemní smlouva, na jejímž základě vznikla. Pokud hlavní nájemce ztratí nájem, podnájem zaniká. Je dobré tuto skutečnost ve smlouvě výslovně uvést.',
  },
];

export default function PodnajemniSmlouvaPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Podnájemní smlouva vzor 2026', item: 'https://smlouvahned.cz/podnajemni-smlouva' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Podnájemní smlouva</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-400">
            § 2274 a násl. Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Podnájemní smlouva<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Podnajímáte část nebo celý byt? Podnájemní smlouva vyžaduje souhlas pronajímatele a musí mít jasná pravidla pro kauce, pravidla bydlení a ukončení.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/podnajem"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit podnájemní smlouvu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 249 Kč · PDF ke stažení · Dle § 2274 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co podnájemní smlouva slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🏠', title: 'Podnájem celého bytu', desc: 'Nájemce odjíždí a podnajímá byt — vyžaduje souhlas pronajímatele a písemný doklad.' },
              { icon: '🛏️', title: 'Podnájem pokoje', desc: 'Spolubydlícímu — sdílené bydlení, pravidla společných prostor, jasné hranice.' },
              { icon: '⏰', title: 'Krátkodobý podnájem', desc: 'Dočasné ubytování s jasnou dobou trvání — například pro sezónní práci.' },
              { icon: '🌍', title: 'Airbnb a pronájmy', desc: 'Krátkodobé pronájmy — vyžadují souhlas pronajímatele i písemnou smlouvu.' },
            ].map(c => (
              <div key={c.title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div>
                  <div className="font-bold text-white text-sm mb-1">{c.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Co podnájemní smlouva obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace podnajímatele a podnájemce',
              'Adresa a popis bytu nebo části bytu',
              'Výše podnájemného a způsob platby',
              'Kauce — výše a podmínky vrácení',
              'Souhlas pronajímatele s podnájmem',
              'Pravidla bydlení a užívání společných prostor',
              'Zákaz dalšího podnájmu',
              'Doba trvání podnájmu a výpovědní podmínky',
              'Předávací protokol se stavem bytu',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-yellow-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k podnájemní smlouvě</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-yellow-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte podnájemní smlouvu</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro podnájem bytu nebo pokoje — se souhlasem pronajímatele, PDF ke stažení po ověřené platbě.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/podnajem"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit podnájemní smlouvu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 249 Kč · § 2274 OZ · PDF ke stažení</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/najemni-smlouva" className="hover:text-slate-300 transition">Nájemní smlouva</Link>
          <Link href="/darovaci" className="hover:text-slate-300 transition">Darovací smlouva</Link>
        </div>
      </div>
    </main>
  );
}
