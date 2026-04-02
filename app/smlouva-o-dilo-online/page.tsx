import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Smlouva o dílo online 2026 — vzor ke stažení | SmlouvaHned',
  description:
    'Smlouva o dílo pro řemeslníky, freelancery i objednatele. Termíny, cena, sankce, záruky. Dle § 2586 OZ. PDF ihned od 249 Kč. Vhodné pro standardní zakázky.',
  keywords: [
    'smlouva o dílo', 'smlouva o dílo vzor', 'smlouva o dílo online', 'smlouva o dílo 2026',
    'smlouva o dílo PDF', 'smlouva o dílo ke stažení', 'smlouva o dílo freelancer',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/smlouva-o-dilo-online' },
  openGraph: {
    title: 'Smlouva o dílo online 2026 | SmlouvaHned',
    description: 'Smlouva o dílo s termíny, sankcemi a zárukou. § 2586 OZ. Od 249 Kč.',
    url: 'https://smlouvahned.cz/smlouva-o-dilo-online',
  },
};

const faq = [
  {
    q: 'Pro koho je smlouva o dílo vhodná?',
    a: 'Pro každý vztah, kde jedna strana objednává a druhá provádí konkrétní dílo — stavební práce, webové stránky, grafiku, rekonstrukci, řemeslné práce nebo software. Na rozdíl od pracovní smlouvy se sjednává výsledek, ne práce samotná.',
  },
  {
    q: 'Jaký je rozdíl mezi smlouvou o dílo a smlouvou o poskytování služeb?',
    a: 'Smlouva o dílo se uzavírá, když je předmětem konkrétní výsledek (hotový web, vymalovaný byt, zpracovaný projekt). Smlouva o poskytování služeb se hodí pro průběžnou spolupráci bez vázanosti na konkrétní výstup.',
  },
  {
    q: 'Musím v smlouvě uvést cenu?',
    a: 'Ano. Cenu lze sjednat pevnou částkou, hodinovou sazbou nebo odkazem na ceník. Pokud cena není určena, platí cena obvyklá — to je riziková situace pro obě strany.',
  },
  {
    q: 'Co jsou záruky a reklamace u smlouvy o dílo?',
    a: 'Zhotovitel odpovídá za vady díla po záruční dobu. U stavebních prací platí zákonná záruční doba 5 let. V smlouvě lze záruční dobu sjednat i delší.',
  },
  {
    q: 'Co když objednatel nezaplatí?',
    a: 'Smlouva může obsahovat klauzuli o smluvní pokutě za prodlení s platbou, zákonném úroku z prodlení a podmínkách zadržení díla do zaplacení.',
  },
];

export default function SmlouvaODiloOnlinePage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Smlouva o dílo online 2026', item: 'https://smlouvahned.cz/smlouva-o-dilo-online' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Co mus\u00ed smlouva o d\u00edlo obsahovat?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Smlouva o d\u00edlo (\u00a7 2586 OZ) mus\u00ed p\u0159esn\u011b vymezit d\u00edlo (co m\u00e1 b\u00fdt zhotoveno), cenu nebo zp\u016fsob jej\u00edho ur\u010den\u00ed a term\u00edn dokon\u010den\u00ed. \u010c\u00edm p\u0159esn\u011bj\u0161\u00ed popis d\u00edla, t\u00edm snaz\u0161\u00ed je \u0159e\u0161it spory o kvalitu nebo rozsah.\"}}, {\"@type\": \"Question\", \"name\": \"Kdy pou\u017e\u00edt smlouvu o d\u00edlo m\u00edsto smlouvy o slu\u017eb\u00e1ch?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Smlouvu o d\u00edlo pou\u017eijte tehdy, kdy\u017e v\u00fdsledkem je konkr\u00e9tn\u00ed d\u00edlo \u2014 v\u00fdrobek, stavba, software, design. Smlouvu o slu\u017eb\u00e1ch pou\u017eijte, pokud se sjedn\u00e1v\u00e1 pr\u016fb\u011b\u017en\u00e1 \u010dinnost (poradenstv\u00ed, spr\u00e1va, maintenance).\"}}, {\"@type\": \"Question\", \"name\": \"Jak zakotvit smluvn\u00ed pokutu?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Smluvn\u00ed pokuta za prodlen\u00ed se sjedn\u00e1v\u00e1 jako % z ceny d\u00edla za ka\u017ed\u00fd den prodlen\u00ed, nebo jako pevn\u00e1 \u010d\u00e1stka. Bez smluvn\u00ed pokuty m\u00e1te n\u00e1rok pouze na n\u00e1hradu \u0161kody, kterou mus\u00edte prok\u00e1zat.\"}}, {\"@type\": \"Question\", \"name\": \"Kdo vlastn\u00ed v\u00fdsledek d\u00edla?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"V\u00fdsledek d\u00edla p\u0159ech\u00e1z\u00ed na objednatele p\u0159ed\u00e1n\u00edm a zaplacen\u00edm ceny. Pokud d\u00edlo vzniklo autorskou tvorbou (software, grafika), je vhodn\u00e9 v\u00fdslovn\u011b sjednat licenci nebo p\u0159evod autorsk\u00fdch pr\u00e1v ve smlouv\u011b.\"}}]}".replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Smlouva o dílo</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-fuchsia-400">
            § 2586 a násl. Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Smlouva o dílo online<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Řemeslníci, freelanceři, stavební firmy i objednatelé. Smlouva o dílo s jasnými termíny,
            cenou, sankcemi a zárukami — pro standardní zakázky od webů po rekonstrukce.
          </p>
          <Link href="/smlouva-o-dilo"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
            Sestavit smlouvu o dílo →
          </Link>
          <div className="mt-4 text-sm text-slate-500">Od 249 Kč · PDF ihned · Dle § 2586 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro koho je smlouva o dílo</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🔨', title: 'Řemeslníci a živnostníci', desc: 'Stavební práce, malování, rekonstrukce, montáže. Jasná cena, termín předání a záruky.' },
              { icon: '💻', title: 'Freelanceři a agentury', desc: 'Weby, grafika, software, marketing. IP práva, milníky, podmínky revizí a předání.' },
              { icon: '🏗️', title: 'Stavební firmy', desc: '5letá zákonná záruka na stavební práce. Podmínky předání, vícepráce, kolaudace.' },
              { icon: '📱', title: 'Objednatelé', desc: 'Chráníte se před nedodáním, zpožděním nebo nekvalitním výstupem — sankce v smlouvě fungují.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co smlouva o dílo obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Přesný popis předmětu díla a specifikace výstupu',
              'Cena díla — pevná, hodinová nebo dle ceníku',
              'Termín zahájení a dokončení, případné milníky',
              'Platební podmínky — záloha, splátky, doplatek po předání',
              'Podmínky předání a akceptace díla',
              'Záruční doba a odpovědnost za vady',
              'Smluvní pokuty za prodlení s předáním nebo platbou',
              'Podmínky pro vícepráce a změny rozsahu',
              'Vlastnictví IP práv po zaplacení',
              'Podmínky odstoupení od smlouvy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky ke smlouvě o dílo</h2>
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
          <h2 className="text-2xl font-black text-white mb-3">Sestavte smlouvu o dílo</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář vás provede každou důležitou částí — vyplnění zabere méně než 5 minut.
          </p>
          <Link href="/smlouva-o-dilo"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
            Sestavit smlouvu o dílo →
          </Link>
          <div className="mt-3 text-xs text-slate-600">Od 249 Kč · § 2586 OZ · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/sluzby" className="hover:text-slate-300 transition">Smlouva o poskytování služeb</Link>
          <Link href="/nda" className="hover:text-slate-300 transition">Smlouva o mlčenlivosti</Link>
          <Link href="/pracovni-smlouva" className="hover:text-slate-300 transition">Pracovní smlouva</Link>
        </div>
      </div>
    </main>
  );
}
