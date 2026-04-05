import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Darovací smlouva online 2026 — vzor ke stažení | SmlouvaHned',
  description:
    'Darovací smlouva na peníze, auto nebo nemovitost. Právně čistý doklad pro obě strany. Dle § 2055 OZ 2026. PDF ihned ke stažení od 249 Kč.',
  keywords: [
    'darovací smlouva',
    'darovací smlouva vzor 2026',
    'darovací smlouva peníze',
    'darovací smlouva auto',
    'darovací smlouva online',
    'darovací smlouva PDF',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/darovaci-smlouva' },
  openGraph: {
    title: 'Darovací smlouva online 2026 | SmlouvaHned',
    description: 'Darovací smlouva na peníze, auto nebo nemovitost. § 2055 OZ. Od 249 Kč.',
    url: 'https://smlouvahned.cz/darovaci-smlouva',
  },
};

const faq = [
  {
    q: 'Musí být darovací smlouva písemná?',
    a: 'U darování movité věci předané okamžitě písemná forma povinná není — smlouva vzniká předáním. Písemná forma je ale doporučená pro finanční dary, auto a povinná pro nemovitosti. Písemný doklad ochrání obě strany při pozdějších sporech.',
  },
  {
    q: 'Platí se z darování daň?',
    a: 'Od roku 2014 je bezúplatné nabytí majetku v přímé linii (rodiče, děti, prarodiče) a ve vedlejší linii (sourozenci, tety, strýcové) od daně z příjmů osvobozeno. U darování mezi jinými osobami se jedná o příjem, který může podléhat dani z příjmů — doporučujeme ověřit s daňovým poradcem.',
  },
  {
    q: 'Lze darovací smlouvu odvolat?',
    a: 'Ano. Dárce může dar odvolat pro nouzi (pokud se dostane do tíživé finanční situace a obdarovaný mu nepomůže) nebo pro nevděk (pokud obdarovaný dárci nebo osobě jemu blízké úmyslně ublíží). Podmínky odvolání by měla smlouva ošetřit.',
  },
  {
    q: 'Jak darovat auto?',
    a: 'K darování vozidla je potřeba písemná darovací smlouva a přepis na příslušném úřadu. Smlouva by měla obsahovat VIN, SPZ, rok výroby a prohlášení o stavu vozidla. Po podpisu smlouvy jde nový majitel přepsat vozidlo do 10 pracovních dnů.',
  },
];

export default function DarovacijSmlouvaPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Darovací smlouva vzor 2026', item: 'https://smlouvahned.cz/darovaci-smlouva' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Mus\u00ed b\u00fdt darovac\u00ed smlouva p\u00edsemn\u00e1?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"U darov\u00e1n\u00ed movit\u00e9 v\u011bci p\u0159edan\u00e9 okam\u017eit\u011b p\u00edsemn\u00e1 forma povinn\u00e1 nen\u00ed \u2014 smlouva vznik\u00e1 p\u0159ed\u00e1n\u00edm. P\u00edsemn\u00e1 forma je ale doporu\u010den\u00e1 pro finan\u010dn\u00ed dary, auto a povinn\u00e1 pro nemovitosti. P\u00edsemn\u00fd doklad ochr\u00e1n\u00ed ob\u011b strany p\u0159i pozd\u011bj\u0161\u00edch sporech.\"}}, {\"@type\": \"Question\", \"name\": \"Plat\u00ed se z darov\u00e1n\u00ed da\u0148?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Od roku 2014 je bez\u00faplatn\u00e9 nabyt\u00ed majetku v p\u0159\u00edm\u00e9 linii (rodi\u010de, d\u011bti, prarodi\u010de) a ve vedlej\u0161\u00ed linii (sourozenci, tety, str\u00fdcov\u00e9) od dan\u011b z p\u0159\u00edjm\u016f osvobozeno. U darov\u00e1n\u00ed mezi jin\u00fdmi osobami se jedn\u00e1 o p\u0159\u00edjem, kter\u00fd m\u016f\u017ee podl\u00e9hat dani z p\u0159\u00edjm\u016f \u2014 doporu\u010dujeme ov\u011b\u0159it s da\u0148ov\u00fdm poradcem.\"}}, {\"@type\": \"Question\", \"name\": \"Lze darovac\u00ed smlouvu odvolat?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Ano. D\u00e1rce m\u016f\u017ee dar odvolat pro nouzi nebo pro nevd\u011bk (pokud obdarovan\u00fd d\u00e1rci nebo osob\u011b jemu bl\u00edzk\u00e9 \u00famysln\u011b ubl\u00ed\u017e\u00ed). Podm\u00ednky odvol\u00e1n\u00ed by m\u011bla smlouva o\u0161et\u0159it.\"}}, {\"@type\": \"Question\", \"name\": \"Jak darovat auto?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"K darov\u00e1n\u00ed vozidla je pot\u0159eba p\u00edsemn\u00e1 darovac\u00ed smlouva a p\u0159epis na p\u0159\u00edslu\u0161n\u00e9m \u00fa\u0159adu. Smlouva by m\u011bla obsahovat VIN, SPZ, rok v\u00fdroby a prohl\u00e1\u0161en\u00ed o stavu vozidla.\"}}]}".replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Darovací smlouva</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
            § 2055 a násl. Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Darovací smlouva online<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Darujete peníze, auto, movitou věc nebo nemovitost? Darovací smlouva je právním dokladem, že k převodu došlo dobrovolně — chrání dárce i obdarovaného.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/darovaci"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit darovací smlouvu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 249 Kč · PDF ihned · Dle § 2055 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co darování slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '💰', title: 'Darování peněz', desc: 'Rodině, přátelům — jasný doklad o bezúplatném převodu. Ochrana obou stran při pozdějších nárocích.' },
              { icon: '🚗', title: 'Darování auta', desc: 'VIN, převod, stav vozidla, ev. rezervace. Podklad pro přepis na registru vozidel.' },
              { icon: '📦', title: 'Darování movité věci', desc: 'Popis věci, hodnota, podmínky. Může obsahovat dohodu o vrácení v nouzi.' },
              { icon: '🏠', title: 'Darování nemovitosti', desc: 'Adresa, LV, katastrální území — nutný notář a vklad do katastru nemovitostí.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co darovací smlouva obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace dárce a obdarovaného',
              'Předmět daru (přesný popis)',
              'Prohlášení dárce o dobrovolnosti daru',
              'Prohlášení obdarovaného o přijetí daru',
              'Datum a způsob předání',
              'Případná podmínka nebo výminka daru',
              'Prohlášení o absence dluhů váznoucích na daru',
              'Ustanovení o odvolání daru (podstatné zhoršení poměrů)',
              'Doložka o výlučném vlastnictví',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k darovací smlouvě</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-emerald-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte darovací smlouvu</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro darování peněz, auta nebo věci — přesně dle vašich podmínek, PDF ihned.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/darovaci"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit darovací smlouvu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 249 Kč · § 2055 OZ · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/blog/darovaci-smlouva-2026" className="hover:text-slate-300 transition">📖 Průvodce darovací smlouvou</Link>
          <Link href="/kupni-smlouva" className="hover:text-slate-300 transition">Kupní smlouva</Link>
          <Link href="/najemni-smlouva" className="hover:text-slate-300 transition">Nájemní smlouva</Link>
        </div>
      </div>
    </main>
  );
}
