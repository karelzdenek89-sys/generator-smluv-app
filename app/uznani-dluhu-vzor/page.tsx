import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedContracts from '@/app/components/RelatedContracts';

export const metadata: Metadata = {
  title: 'Uznání dluhu online 2026 — vzor ke stažení | SmlouvaHned',
  description:
    'Uznání dluhu obnoví promlčecí lhůtu na 10 let. Splátky, smluvní pokuta, exekuční doložka. Dle § 2053 OZ 2026. Od 99 Kč.',
  keywords: [
    'uznání dluhu vzor 2026',
    'uznání dluhu online',
    'uznání závazku',
    'uznání dluhu formulář',
    'promlčení dluhu',
    'uznání dluhu promlčení',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/uznani-dluhu-vzor' },
  openGraph: {
    title: 'Uznání dluhu online 2026 | SmlouvaHned',
    description: 'Uznání dluhu obnoví promlčecí lhůtu na 10 let. Splátky, smluvní pokuta. § 2053 OZ. Od 99 Kč.',
    url: 'https://smlouvahned.cz/uznani-dluhu-vzor',
  },
};

const faq = [
  {
    q: 'Jak dlouhá je promlčecí lhůta po uznání dluhu?',
    a: 'Po platném uznání dluhu běží nová desetiletá promlčecí lhůta od okamžiku uznání. To je zásadní rozdíl oproti obecné tříleté lhůtě. Věřitel tak získá výrazně delší čas na vymáhání pohledávky.',
  },
  {
    q: 'Co musí uznání dluhu obsahovat?',
    a: 'Podle § 2053 OZ musí dlužník uznat dluh co do důvodu a výše. To znamená, že musí být jasné, z čeho dluh vznikl a kolik přesně dlužník dluží. Vágní uznání bez uvedení výše nemá zákonem předvídané účinky.',
  },
  {
    q: 'Jaký je rozdíl oproti smlouvě o zápůjčce?',
    a: 'Smlouva o zápůjčce se uzavírá při poskytnutí peněz. Uznání dluhu se podepisuje zpětně, když dluh již existuje — buď proto, že nebyl splněn, nebo proto, že blíží splatnosti a věřitel chce obnovit promlčecí lhůtu.',
  },
  {
    q: 'Lze uznání dluhu napadnout?',
    a: 'Dlužník může namítat, že ho podepsal pod nátlakem nebo v omylu, nebo že dluh fakticky neexistuje. Uznání dluhu sice přenáší důkazní břemeno — ale dlužník může závazkový vztah zpochybnit. Čím přesnější a konkrétnější uznání je, tím lépe obstojí.',
  },
];

export default function UznaniDluhuVzorPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Uznání dluhu vzor 2026', item: 'https://smlouvahned.cz/uznani-dluhu-vzor' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Uznání dluhu</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            § 2053 Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Uznání dluhu<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Dlužník písemně uznává svůj závazek. Promlčecí lhůta se obnovuje na 10 let a věřitel získává silnější nástroj pro případ vymáhání.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/uznani-dluhu"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit uznání dluhu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 99 Kč · PDF ihned · Dle § 2053 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co uznání dluhu slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '⏰', title: 'Obnovení promlčecí lhůty', desc: 'Pohledávka blíží ke 3leté lhůtě — uznání dluhu obnoví lhůtu na 10 let.' },
              { icon: '📅', title: 'Dohoda o splátkách', desc: 'Dluh rozložen na měsíční platby — jasné podmínky a smluvní pokuta za prodlení.' },
              { icon: '🔒', title: 'Zajištění starší pohledávky', desc: 'Zpevnění pozice věřitele — přenáší důkazní břemeno na dlužníka.' },
              { icon: '⚖️', title: 'Notářský zápis', desc: 'Podklad pro přímou vykonatelnost — exekuční doložka bez nutnosti soudu.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co uznání dluhu obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace věřitele a dlužníka',
              'Přesná výše dluhu a měna',
              'Původ dluhu (z čeho dluh vznikl)',
              'Uznání dluhu dlužníkem výslovným prohlášením',
              'Splátkový kalendář nebo termín jednorázového splacení',
              'Smluvní pokuta za prodlení se splácením',
              'Úrok z prodlení',
              'Prohlášení o dobrovolnosti uznání',
              'Exekuční doložka (u notářského zápisu)',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-red-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k uznání dluhu</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-red-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte uznání dluhu</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro uznaní dluhu — obnovení promlčecí lhůty, splátky, PDF ihned.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/uznani-dluhu"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit uznání dluhu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 99 Kč · § 2053 OZ · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/pujcka-smlouva" className="hover:text-slate-300 transition">Smlouva o zápůjčce</Link>
          <Link href="/kupni-smlouva" className="hover:text-slate-300 transition">Kupní smlouva</Link>
        </div>
      </div>
      <RelatedContracts currentHref="/uznani-dluhu-vzor" cluster="finance" />
    </main>
  );
}
