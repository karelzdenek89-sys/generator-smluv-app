import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plná moc online 2026 — vzor ke stažení | SmlouvaHned',
  description:
    'Plná moc pro zastoupení před úřadem, bankou nebo v obchodní věci. Obecná, jednorázová nebo ověřená verze. Dle § 441 OZ 2026. Od 99 Kč.',
  keywords: [
    'plná moc online',
    'plná moc vzor 2026',
    'plná moc formulář',
    'plná moc ke stažení',
    'plná moc ověřená',
    'plná moc úřad',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/plna-moc-online' },
  openGraph: {
    title: 'Plná moc online 2026 | SmlouvaHned',
    description: 'Plná moc pro zastoupení před úřadem, bankou nebo v obchodní věci. § 441 OZ. Od 99 Kč.',
    url: 'https://smlouvahned.cz/plna-moc-online',
  },
};

const faq = [
  {
    q: 'Musí být plná moc úředně ověřena?',
    a: 'Záleží na účelu. Pro většinu soukromých záležitostí stačí prostá písemná forma. Pro zastoupení při prodeji nemovitosti, na katastru nebo u notáře bývá vyžadováno úřední ověření podpisu zmocnitele (Czech POINT, notář). Požadavky konkrétního úřadu doporučujeme ověřit předem.',
  },
  {
    q: 'Jak dlouho platí plná moc?',
    a: 'Pokud není v plné moci uvedena doba platnosti, platí do odvolání nebo do splnění úkonu. Lze ji kdykoli odvolat písemným prohlášením zmocnitele. Pro jednorázové úkoly je vhodné uvést konkrétní datum nebo podmínku zániku.',
  },
  {
    q: 'Může zmocněnec jednat i sám za sebe?',
    a: 'Zmocněnec by neměl jednat jménem zmocnitele v záležitostech, kde má protichůdný zájem (například prodávat svůj majetek sobě jako zmocněnci druhé strany). Takové jednání je ze zákona neplatné, pokud to zmocnitel výslovně nepřipustil.',
  },
  {
    q: 'Je rozdíl mezi plnou mocí a substitucí?',
    a: 'Plná moc je přímé zmocnění od zmocnitele zmocněnci. Substituce je situace, kdy zmocněnec přenese svá oprávnění na třetí osobu — to je přípustné jen pokud to plná moc výslovně dovoluje nebo pokud to vyžaduje povaha věci.',
  },
];

export default function PlnaMocOnlinePage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Plná moc online 2026', item: 'https://smlouvahned.cz/plna-moc-online' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(71,85,105,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Plná moc</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-500/20 bg-slate-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            § 441 a násl. Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Plná moc online<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Potřebujete pověřit jinou osobu jednáním za vás? Plná moc vymezí rozsah oprávnění — co zmocněnec může udělat a co nikoli.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/plna-moc"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit plnou moc →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 99 Kč · PDF ihned · Dle § 441 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co plná moc slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🏛️', title: 'Zastoupení na úřadě', desc: 'Stavební úřad, katastr, živnostenský úřad — zmocněnec jedná za zmocnitele.' },
              { icon: '🏦', title: 'Zastoupení v bance', desc: 'Výběr, převody, správa účtu — omezená či neomezená moc na bankovní účet.' },
              { icon: '🤝', title: 'Obchodní jednání', desc: 'Podepisování smluv za firmu — přesně vymezený rozsah oprávnění.' },
              { icon: '📦', title: 'Jednorázová záležitost', desc: 'Vyzvednutí zásilky, podpis konkrétní smlouvy — časově či věcně omezená moc.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co plná moc obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace zmocnitele a zmocněnce',
              'Přesné vymezení rozsahu zmocnění',
              'Jednorázová nebo opakovaná plná moc',
              'Datum vystavení a případná doba platnosti',
              'Možnost dalšího zmocnění (substituce)',
              'Podmínky odvolání plné moci',
              'Ověření podpisu zmocnitele (pro úřední záležitosti)',
              'Odkaz na konkrétní úkon nebo předmět',
              'Potvrzení o přijetí zmocnění',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-slate-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k plné moci</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-slate-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-500/20 bg-gradient-to-br from-slate-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte plnou moc</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro zmocnění — obecná, jednorázová nebo ověřená verze, PDF ihned.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/plna-moc"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit plnou moc →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 99 Kč · § 441 OZ · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/najemni-smlouva" className="hover:text-slate-300 transition">Nájemní smlouva</Link>
          <Link href="/kupni-smlouva" className="hover:text-slate-300 transition">Kupní smlouva</Link>
        </div>
      </div>
    </main>
  );
}
