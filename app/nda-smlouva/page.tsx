import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NDA — Smlouva o mlčenlivosti online 2026 | SmlouvaHned',
  description:
    'Smlouva o mlčenlivosti (NDA) online — jednostranná nebo oboustranná. Ochrana know-how, obchodního tajemství a citlivých informací. Dle § 504 OZ. Od 249 Kč.',
  keywords: [
    'NDA smlouva',
    'smlouva o mlčenlivosti vzor 2026',
    'NDA online česky',
    'smlouva o mlčenlivosti formulář',
    'NDA jednostranná',
    'NDA oboustranná',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/nda-smlouva' },
  openGraph: {
    title: 'NDA — Smlouva o mlčenlivosti online 2026 | SmlouvaHned',
    description: 'NDA smlouva — ochrana obchodního tajemství a citlivých informací. § 504 OZ. Od 249 Kč.',
    url: 'https://smlouvahned.cz/nda-smlouva',
  },
};

const faq = [
  {
    q: 'Jak dlouho platí NDA?',
    a: 'Doba platnosti NDA je věcí dohody — typicky 2 až 5 let. Lze sjednat i na dobu neurčitou s výpovědní dobou nebo na dobu trvání spolupráce plus X let po jejím skončení. Smlouva by měla dobu závazku výslovně uvádět.',
  },
  {
    q: 'Jaký je rozdíl mezi jednostrannou a oboustrannou NDA?',
    a: 'U jednostranné NDA je zavázána pouze jedna strana (zpravidla ta, která přijímá informace). Oboustranná NDA zavazuje obě strany — vhodná, pokud si obě strany sdílejí navzájem citlivé informace při spolupráci nebo obchodním jednání.',
  },
  {
    q: 'Je NDA vymahatelná u soudu?',
    a: 'Ano, pokud je smlouva správně sepsána — obsahuje konkrétní definici důvěrných informací, jasné povinnosti a smluvní pokutu nebo náhradu škody. Vágní formulace ztěžují vymahatelnost. Proto je důležité informace přesně definovat.',
  },
  {
    q: 'Musí být NDA notářsky ověřena?',
    a: 'Ne. Notářské ověření není pro NDA vyžadováno. Stačí písemná smlouva podepsaná oběma stranami. Doporučujeme smlouvu podepsat v papírové formě nebo s uznávaným elektronickým podpisem.',
  },
];

export default function NdaSmlouvaPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'NDA smlouva o mlčenlivosti', item: 'https://smlouvahned.cz/nda-smlouva' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Co chr\u00e1n\u00ed NDA smlouva?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"NDA (Non-Disclosure Agreement, smlouva o ml\u010denlivosti) chr\u00e1n\u00ed d\u016fv\u011brn\u00e9 informace \u2014 obchodn\u00ed tajemstv\u00ed, know-how, z\u00e1kaznick\u00e9 datab\u00e1ze, finan\u010dn\u00ed data nebo produktov\u00e9 pl\u00e1ny. Bez NDA je ochrana t\u011bchto informac\u00ed minim\u00e1ln\u00ed.\"}}, {\"@type\": \"Question\", \"name\": \"Jak dlouho plat\u00ed NDA?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"D\u00e9lku trv\u00e1n\u00ed ml\u010denlivosti si strany sjednaj\u00ed ve smlouv\u011b. Typicky 2\u20135 let po skon\u010den\u00ed spolupr\u00e1ce. Lze sjednat i dobu neur\u010ditou, ale pro obchodn\u00ed tajemstv\u00ed je to m\u00e9n\u011b vymahateln\u00e9.\"}}, {\"@type\": \"Question\", \"name\": \"Jak\u00e1 sankce plat\u00ed za poru\u0161en\u00ed NDA?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"NDA by m\u011bla obsahovat smluvn\u00ed pokutu za poru\u0161en\u00ed \u2014 jinak m\u00e1te n\u00e1rok pouze na n\u00e1hradu \u0161kody, kterou mus\u00edte prok\u00e1zat. Smluvn\u00ed pokuta je jednodu\u0161\u0161\u00ed na vym\u00e1h\u00e1n\u00ed a funguje jako odstra\u0161uj\u00edc\u00ed prvek.\"}}, {\"@type\": \"Question\", \"name\": \"Mus\u00ed b\u00fdt NDA oboustrann\u00e1?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"NDA m\u016f\u017ee b\u00fdt jednostrann\u00e1 (chr\u00e1n\u00ed informace jen jedn\u00e9 strany) nebo vz\u00e1jemn\u00e1 (ob\u011b strany si chr\u00e1n\u00ed sv\u00e9 informace). Vz\u00e1jemn\u00e1 NDA je vhodn\u00e1 p\u0159i rovnocenn\u00e9 obchodn\u00ed spolupr\u00e1ci.\"}}]}".replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">NDA Smlouva</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
            § 504 OZ — obchodní tajemství
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Smlouva o mlčenlivosti (NDA)<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Sdílíte citlivé informace, obchodní plány nebo technické know-how? NDA smlouva závazně vymezí, co je důvěrné a co druhá strana nesmí zveřejnit ani použít.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/nda"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit NDA smlouvu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 249 Kč · PDF ke stažení · Dle § 504 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co NDA slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🤝', title: 'Obchodní jednání', desc: 'Sdílení podkladů a plánů před uzavřením smlouvy — ochrana v případě, že jednání neuspěje.' },
              { icon: '💻', title: 'Spolupráce s freelancery', desc: 'Přístup k interním systémům, datům a know-how — zákaz jejich dalšího používání po skončení.' },
              { icon: '👨‍💼', title: 'Zaměstnanecké vztahy', desc: 'Ochrana firemního know-how po skončení zaměstnání — non-compete doložka, zákaz náboru.' },
              { icon: '📊', title: 'Investorská jednání', desc: 'Sdílení finančních dat a byznys plánu — výměna informací pod podmínkou mlčenlivosti.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co NDA smlouva obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Definice důvěrných informací — co přesně je chráněno',
              'Povinnosti přijímající strany',
              'Výjimky z mlčenlivosti (veřejně dostupné informace)',
              'Doba trvání závazku mlčenlivosti',
              'Sankce za porušení — smluvní pokuta (pro. variantu)',
              'Jednostranná nebo oboustranná povinnost',
              'Ustanovení o nekonkurenci a non-solicitation (pro. variantu)',
              'Vrácení nebo likvidace důvěrných materiálů',
              'Rozhodné právo a řešení sporů',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-violet-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k NDA smlouvě</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-violet-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte NDA smlouvu</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro ochranu citlivých informací — jednostranná nebo oboustranná, PDF ke stažení po ověřené platbě.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/nda"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit NDA smlouvu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 249 Kč · § 504 OZ · PDF ke stažení</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/sluzby" className="hover:text-slate-300 transition">Smlouva o poskytování služeb</Link>
          <Link href="/spoluprace" className="hover:text-slate-300 transition">Smlouva o spolupráci</Link>
        </div>
      </div>
    </main>
  );
}
