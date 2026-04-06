import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DPP — Dohoda o provedení práce 2026 — vzor online | SmlouvaHned',
  description:
    'Dohoda o provedení práce (DPP) pro brigády a jednorázové úkoly. Max. 300 hod./rok. Dle zákoníku práce 2026. IP doložka, bezodvodový rámec. PDF ihned od 99 Kč.',
  keywords: [
    'DPP', 'dohoda o provedení práce', 'dohoda o provedení práce vzor', 'DPP 2026',
    'dohoda o provedení práce online', 'DPP ke stažení', 'brigáda smlouva',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/dohoda-o-provedeni-prace' },
  openGraph: {
    title: 'DPP — Dohoda o provedení práce 2026 | SmlouvaHned',
    description: 'DPP pro brigády a jednorázové úkoly. Max. 300 hod./rok. Od 99 Kč.',
    url: 'https://smlouvahned.cz/dohoda-o-provedeni-prace',
  },
};

const faq = [
  {
    q: 'Co je dohoda o provedení práce (DPP)?',
    a: 'DPP je dohoda mimo pracovní poměr určená pro brigády, jednorázové nebo příležitostné práce. Lze ji uzavřít maximálně na 300 hodin ročně u jednoho zaměstnavatele.',
  },
  {
    q: 'Kdy se z DPP platí odvody?',
    a: 'Od roku 2024 platí, že pokud odměna z DPP nepřesáhne 11 500 Kč/měsíc (u jednoho zaměstnavatele), nevzniká účast na sociálním ani zdravotním pojištění. Při překročení hranice se odvody platí z celé odměny.',
  },
  {
    q: 'Musí být DPP písemná?',
    a: 'Ano, dle § 75 zákoníku práce musí být dohoda o provedení práce uzavřena písemně.',
  },
  {
    q: 'Co musí DPP obsahovat?',
    a: 'Vymezení pracovního úkolu, rozsah práce (maximálně 300 hodin ročně) a dobu, na kterou se dohoda uzavírá. Odměna není povinnou náležitostí, ale je důrazně doporučena.',
  },
  {
    q: 'Lze uzavřít DPP s více zaměstnavateli najednou?',
    a: 'Ano. Limit 300 hodin platí u každého zaměstnavatele zvlášť. Limit pro bezodvodový rámec (11 500 Kč/měs.) se hodnotí u každého zaměstnavatele individuálně.',
  },
];

export default function DohodaOProvedeniPracePage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Dohoda o provedení práce DPP', item: 'https://smlouvahned.cz/dohoda-o-provedeni-prace' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">DPP — Dohoda o provedení práce</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-orange-400">
            § 75 Zákoníku práce
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Dohoda o provedení práce<br />
            <span className="text-amber-500 italic">vzor DPP 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Pro brigády, jednorázové úkoly i kreativní práce. DPP správně sepsaná — max. 300 hod./rok,
            bezodvodový rámec do 11 500 Kč/měs., IP doložka pro kreativní práce.
          </p>
          <Link href="/dpp"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
            Sestavit DPP →
          </Link>
          <div className="mt-4 text-sm text-slate-500">Od 99 Kč · PDF ihned · Zákoník práce 2026</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Kdy se DPP hodí</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🎨', title: 'Kreativní práce a digitál', desc: 'Grafika, copywriting, překlad, fotografie — jednorázová nebo projektová spolupráce bez dlouhodobého závazku.' },
              { icon: '🛒', title: 'Brigády a výpomoc', desc: 'Sezonní výpomoc, akce, brigády — DPP bez odvodů do 11 500 Kč/měs. a 300 hod./rok.' },
              { icon: '🏫', title: 'Lektoři a koučové', desc: 'Přednášky, workshopy, kurzy — jasné podmínky odměňování a hodinový rozsah.' },
              { icon: '💼', title: 'Jednorázové projekty', desc: 'Zpráva, analýza, příprava dokumentace — konkrétní výstup, konkrétní odměna, bez průběžného zaměstnaneckého vztahu.' },
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

        {/* Limity box */}
        <section className="mb-12 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
          <h3 className="font-black text-white mb-4">Klíčové limity DPP v 2026</h3>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <div className="text-2xl font-black text-amber-400 mb-1">300 hod.</div>
              <div className="text-xs text-slate-400">Max. roční rozsah u jednoho zaměstnavatele</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <div className="text-2xl font-black text-amber-400 mb-1">11 500 Kč</div>
              <div className="text-xs text-slate-400">Měsíční limit bez povinnosti odvodů SP/ZP</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <div className="text-2xl font-black text-amber-400 mb-1">písemně</div>
              <div className="text-xs text-slate-400">Povinná písemná forma dle § 75 ZP</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Limity platné pro rok 2026. Pro přesné daňové a odvodové posouzení doporučujeme konzultaci s účetním nebo mzdovou účetní.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k DPP</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-amber-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte DPP</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro dohodu o provedení práce — správně, přehledně, dle zákoníku práce 2026.
          </p>
          <Link href="/dpp"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
            Sestavit DPP →
          </Link>
          <div className="mt-3 text-xs text-slate-600">Od 99 Kč · § 75 ZP · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/pracovni-smlouva" className="hover:text-slate-300 transition">Pracovní smlouva</Link>
          <Link href="/sluzby" className="hover:text-slate-300 transition">Smlouva o poskytování služeb</Link>
        </div>
      </div>
    </main>
  );
}
