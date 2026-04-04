import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nájemní smlouva na byt 2026 — vzor | SmlouvaHned',
  description:
    'Nájemní smlouva na byt nebo dům. Kauce, zvířata, předávací protokol, Airbnb doložka. Dle § 2235 OZ 2026. PDF ke stažení od 249 Kč.',
  keywords: [
    'nájemní smlouva byt 2026',
    'nájemní smlouva na byt vzor',
    'nájemní smlouva byt formulář',
    'smlouva o nájmu bytu',
    'nájemní smlouva pronajímatel',
    'nájemní smlouva nájemce',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/najemni-smlouva-byt' },
  openGraph: {
    title: 'Nájemní smlouva na byt 2026 | SmlouvaHned',
    description: 'Nájemní smlouva na byt nebo dům. Kauce, zvířata, předávací protokol. § 2235 OZ. Od 249 Kč.',
    url: 'https://smlouvahned.cz/najemni-smlouva-byt',
  },
};

const faq = [
  {
    q: 'Jak vysoká může být kauce u nájmu bytu?',
    a: 'Zákon stanoví maximální výši kauce na trojnásobek měsíčního nájemného (bez poplatků za služby). Vyšší kauce je neplatná v části přesahující zákonný limit. Kauce musí být vrácena do 1 měsíce od skončení nájmu, po odečtení případných pohledávek pronajímatele.',
  },
  {
    q: 'Může pronajímatel zakázat nájemci chovat zvířata?',
    a: 'Ano. Pronajímatel může zákaz chovu zvířat zahrnout přímo do smlouvy. Obecný zákaz chovu zvířat není považován za nepřiměřeně omezující — jde o věc smluvní svobody. Naopak u smluv bez zákazu nájemce zvíře chovat může, pokud nepoškozuje byt.',
  },
  {
    q: 'Jak dlouhá je výpovědní doba u nájmu bytu?',
    a: 'Pronajímatel může dát výpověď z taxativních zákonných důvodů s tříměsíční výpovědní dobou. Nájemce může dát výpověď bez udání důvodu s tříměsíční lhůtou. U smlouvy na dobu určitou platí odlišná pravidla — doporučujeme smlouvu tomuto přizpůsobit.',
  },
  {
    q: 'Je nájemní smlouva na dobu neurčitou výhodná pro nájemce nebo pronajímatele?',
    a: 'Nájemce má u doby neurčité silnější ochranu — pronajímatel může vypovědět jen ze zákonných důvodů. Pronajímatel má naopak větší flexibilitu u smlouvy na dobu určitou s jasně sjednanou dobou. Volba závisí na záměru obou stran.',
  },
];

export default function NajemniSmlouvaBytPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Nájemní smlouva na byt 2026', item: 'https://smlouvahned.cz/najemni-smlouva-byt' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Nájemní smlouva na byt</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-teal-400">
            § 2235 a násl. Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Nájemní smlouva na byt<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Pronajímáte nebo si pronajímáte byt nebo dům? Nájemní smlouva ochrání obě strany — kauce, pravidla, předání bytu a podmínky ukončení.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/najem"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit nájemní smlouvu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 249 Kč · PDF ke stažení · Dle § 2235 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co nájemní smlouva slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🏠', title: 'Pronájem bytu', desc: 'Ochrana pronajímatele i nájemce — kauce, pravidla, předání bytu.' },
              { icon: '🏡', title: 'Pronájem rodinného domu', desc: 'Větší rozsah, zahrada, parkování — jasné vymezení užívání pozemku.' },
              { icon: '⏰', title: 'Přechodný nájem', desc: 'Krátkodobý pronájem s jasnou dobou trvání — dohodou obou stran.' },
              { icon: '🔄', title: 'Nájem s opcí na koupi', desc: 'Možnost případného odkoupení — opce v samostatné dohodě.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co nájemní smlouva obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace pronajímatele a nájemce',
              'Adresa a popis bytu nebo domu (dispozice, vybavení)',
              'Výše nájemného a způsob a termín platby',
              'Kauce — výše (max. 3 měs. nájemné), podmínky vrácení',
              'Povolení nebo zákaz zvířat',
              'Pravidla podnájmu a Airbnb',
              'Povinnosti ohledně oprav a údržby',
              'Podmínky výpovědi a zákonné výpovědní doby',
              'Předávací protokol se stavem bytu a odečty měřičů',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-teal-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k nájemní smlouvě</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-teal-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte nájemní smlouvu</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro pronájem bytu či domu — kauce, zvířata, pravidla, PDF ke stažení po ověřené platbě.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/najem"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit nájemní smlouvu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 249 Kč · § 2235 OZ · PDF ke stažení</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/podnajemni-smlouva" className="hover:text-slate-300 transition">Podnájemní smlouva</Link>
          <Link href="/najemni-smlouva" className="hover:text-slate-300 transition">Průvodce nájemní smlouvou</Link>
        </div>
      </div>
    </main>
  );
}
