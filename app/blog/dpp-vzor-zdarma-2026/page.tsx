import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import RelatedContracts from '@/app/components/RelatedContracts';

export const metadata: Metadata = {
  title: 'DPP vzor zdarma 2026 — co v něm chybí a proč na tom záleží',
  description:
    'Stáhnete vzor DPP zdarma — ale je správně pro rok 2026? Porovnáme, co volné šablony vynechávají a kdy se vyplatí použít generátor s citacemi zákoníku práce.',
  keywords: [
    'DPP vzor zdarma 2026',
    'vzor dpp 2026',
    'dohoda o provedení práce vzor zdarma',
    'DPP šablona 2026',
    'dohoda o provedení práce ke stažení',
    'generátor DPP online',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/dpp-vzor-zdarma-2026' },
  openGraph: {
    title: 'DPP vzor zdarma 2026 — co v něm chybí a proč na tom záleží',
    description: 'Volné vzory DPP často postrádají aktuální náležitosti pro rok 2026. Zjistěte, na co si dát pozor.',
    url: 'https://smlouvahned.cz/blog/dpp-vzor-zdarma-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'DPP vzor zdarma 2026 — co v něm chybí a proč na tom záleží',
  description:
    'Porovnání volných vzorů DPP a generátoru s citacemi zákoníku práce. Co šablony zdarma vynechávají a kdy to vadí.',
  url: 'https://smlouvahned.cz/blog/dpp-vzor-zdarma-2026',
  datePublished: '2026-04-18',
  dateModified: '2026-04-18',
  author: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  publisher: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    logo: { '@type': 'ImageObject', url: 'https://smlouvahned.cz/og-image.png' },
  },
  image: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://smlouvahned.cz/blog' },
    { '@type': 'ListItem', position: 3, name: 'DPP vzor zdarma 2026', item: 'https://smlouvahned.cz/blog/dpp-vzor-zdarma-2026' },
  ],
};

export default function DppVzorZdarmaPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />

      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
        <span className="mx-2 text-slate-700">›</span>
        <Link href="/blog" className="hover:text-slate-300 transition">Blog</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-slate-400">DPP vzor zdarma 2026</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Práce a zaměstnání</span>
          <span className="text-xs text-slate-600">7 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-18">18. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          DPP vzor zdarma 2026 — co v něm chybí a proč na tom záleží
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Hledáte vzor dohody o provedení práce ke stažení zdarma? Volné šablony existují — ale většina
          z nich nepočítá se změnami platnými od roku 2024 a 2026. Ukážeme vám konkrétně, co v typickém
          vzoru chybí a kdy to může zaměstnavatele nebo brigádníka skutečně poškodit.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Vytvořte DPP přímo pro váš případ</p>
          <p className="mb-4 text-sm text-slate-400">
            Zadáte jméno, druh práce a odměnu — systém sestaví dohodu se správnými paragrafovými
            citacemi zákoníku práce platného k 1. 1. 2026. PDF ke stažení ihned.
          </p>
          <Link
            href="/dpp"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit DPP online →
          </Link>
        </div>
      </header>

      {/* TOC */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#vzory-zdarma" className="hover:text-amber-400 transition">1. Kde vzory DPP zdarma najdete</a></li>
          <li><a href="#co-chybi" className="hover:text-amber-400 transition">2. Co volné vzory typicky vynechávají</a></li>
          <li><a href="#zmeny-2026" className="hover:text-amber-400 transition">3. Změny v DPP pro rok 2026</a></li>
          <li><a href="#porovnani" className="hover:text-amber-400 transition">4. Vzor zdarma vs. generátor — srovnání</a></li>
          <li><a href="#kdy-zdarma-staci" className="hover:text-amber-400 transition">5. Kdy vzor zdarma stačí</a></li>
          <li><a href="#checklist" className="hover:text-amber-400 transition">6. Checklist správné DPP</a></li>
        </ol>
      </nav>

      {/* SECTION 1 */}
      <section id="vzory-zdarma" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Kde vzory DPP zdarma najdete</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Bezplatné vzory dohody o provedení práce nabízí řada webů — portály pro zaměstnavatele, HR blogy
          i stránky účetních firem. Na první pohled vypadají použitelně: obsahují strany, druh práce,
          odměnu a datum. Problém je v detailech.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Většina volně dostupných šablon pochází z let 2019–2022 a nebyla aktualizována po legislativních
          změnách v roce 2024, které zavedly nová pravidla pro zdravotní pojištění a oznamovací povinnost
          zaměstnavatele vůči správě sociálního zabezpečení.
        </p>
        <ArticleTrustBox
          generatorSuitable="Pravidelná brigáda, přivýdělek nebo jednorázový úkol — DPP se vyplatí vytvořit přesně pro vaši situaci, nikoliv přepisovat obecnou šablonu."
          lawyerSuitable="Pracovník z jiného státu EU, souběh více DPP u jednoho zaměstnavatele nebo nejasnost kolem zdravotního pojištění — konzultujte s odborníkem."
        />
      </section>

      {/* SECTION 2 */}
      <section id="co-chybi" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co volné vzory typicky vynechávají</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Prošli jsme desítky volně dostupných šablon. Tady jsou nejčastější mezery:
        </p>

        <div className="mb-6 space-y-4">
          {[
            {
              problem: 'Chybí vymezení místa výkonu práce',
              dopad: 'Zákoník práce (§ 75) vyžaduje uvedení místa nebo oblasti. Bez toho je dohoda neúplná a zaměstnanec může odmítnout práci kdekoliv.',
            },
            {
              problem: 'Není uveden způsob odměňování',
              dopad: 'Odměna musí být v dohodě sjednána písemně (§ 138 ZP). Vzory bez konkrétní hodinové nebo úkolové sazby jsou právně problematické.',
            },
            {
              problem: 'Chybí ochrana osobních údajů / GDPR doložka',
              dopad: 'Zaměstnavatel zpracovává osobní údaje brigádníka — bez zákonného základu hrozí pokuta od ÚOOÚ.',
            },
            {
              problem: 'Není zmíněn limit 300 hodin ročně u jednoho zaměstnavatele',
              dopad: 'Zákon limit nestanovuje přímo do smlouvy, ale vynechání může vést k nedorozuměním — zejm. při DPP u více zaměstnavatelů.',
            },
            {
              problem: 'Zastaralé sazby pro odvody',
              dopad: 'Vzory z roku 2022 pracují se starým hraničním příjmem pro zdravotní pojištění. Od roku 2024 platí jiná pravidla.',
            },
          ].map(item => (
            <div key={item.problem} className="rounded-2xl border border-rose-500/15 bg-rose-500/5 p-5">
              <p className="mb-1 text-sm font-bold text-rose-300">✗ {item.problem}</p>
              <p className="text-xs leading-relaxed text-slate-400">{item.dopad}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="zmeny-2026" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Změny v DPP pro rok 2026</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Od roku 2024 platí pro dohody o provedení práce nová pravidla, která zůstávají v platnosti i v roce 2026:
        </p>

        <div className="mb-6 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0c1426]">
                <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">Oblast</th>
                <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">Pravidlo 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Limit hodin', '300 hodin ročně u jednoho zaměstnavatele (§ 75 ZP)'],
                ['Srážková daň', 'Příjem do 11 500 Kč/měsíc — 15% srážková daň (bez podpisu prohlášení)'],
                ['Zdravotní pojištění', 'Odvod od příjmu 4 500 Kč/měsíc — zaměstnavatel musí sledovat kumulaci u více DPP'],
                ['Oznamovací povinnost', 'Zaměstnavatel hlásí DPP na ČSSZ do 8 dnů od nástupu'],
                ['Minimální odměna', 'Hodinová odměna nesmí být nižší než minimální mzda (20 800 Kč/měs. → 124 Kč/hod.)'],
              ].map(([oblast, pravidlo]) => (
                <tr key={oblast} className="bg-[#080f1e]">
                  <td className="px-5 py-3 text-xs font-bold text-white">{oblast}</td>
                  <td className="px-5 py-3 text-xs leading-relaxed text-slate-400">{pravidlo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed">
          Volné vzory tyto změny zpravidla nezohledňují — jsou statické a neaktualizují se automaticky.
        </p>
      </section>

      {/* SECTION 4 */}
      <section id="porovnani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Vzor zdarma vs. generátor — srovnání</h2>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Vzor ke stažení zdarma</p>
            {[
              'Blanketní text — nevyplní se automaticky',
              'Zastaralé sazby a pravidla',
              'Chybí citace zákonných paragrafů',
              'Žádná varování u rizikových situací',
              'Nelze přizpůsobit bez znalosti práva',
              'Nelze ověřit datum poslední aktualizace',
            ].map(line => (
              <p key={line} className="mb-1.5 text-xs text-slate-500 line-through decoration-slate-700">✗ {line}</p>
            ))}
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <p className="mb-4 text-xs font-black uppercase tracking-widest text-amber-400">Generátor SmlouvaHned</p>
            {[
              'Dokument sestavený z vašich konkrétních údajů',
              'Aktualizováno k 1. 1. 2026',
              'Citace § 75 a dalších ustanovení ZP přímo v textu',
              'Varování při překročení limitu nebo rizikových volbách',
              'Přizpůsobí se druhu práce, odměně i době trvání',
              'PDF ihned ke stažení po platbě',
            ].map(line => (
              <p key={line} className="mb-1.5 text-xs text-slate-300">✓ {line}</p>
            ))}
          </div>
        </div>

        <ArticleInlineCta
          href="/dpp"
          title="Vytvořit DPP online"
          body="Vyplníte formulář za 3 minuty — systém sestaví dohodu s aktuálními paragrafovými citacemi a správnými náležitostmi pro rok 2026."
          buttonLabel="Vytvořit DPP →"
        />
      </section>

      {/* SECTION 5 */}
      <section id="kdy-zdarma-staci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Kdy vzor zdarma stačí</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Chceme být féroví — volný vzor může v určitých situacích posloužit:
        </p>
        <ul className="mb-4 space-y-2 text-slate-400 text-sm leading-relaxed">
          <li className="flex gap-2"><span className="text-amber-400 flex-shrink-0">→</span> Jde o jednorázovou výpomoc v rodině nebo mezi přáteli na minimální odměnu.</li>
          <li className="flex gap-2"><span className="text-amber-400 flex-shrink-0">→</span> Obě strany si jsou vědomy limitů a podmínek a vzor slouží jen jako písemné zachycení ústní dohody.</li>
          <li className="flex gap-2"><span className="text-amber-400 flex-shrink-0">→</span> Zaměstnavatel má vlastního HR právníka, který vzor před podpisem zkontroluje.</li>
        </ul>
        <p className="text-slate-400 leading-relaxed text-sm">
          Ve všech ostatních případech — pravidelná brigáda, vyšší odměna, pracovník z jiného státu EU,
          nebo opakující se spolupráce — se vyplatí mít dokument sestavený pro konkrétní situaci,
          nikoliv obecnou šablonu.
        </p>
      </section>

      {/* SECTION 6 */}
      <section id="checklist" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Checklist správné DPP pro rok 2026</h2>
        <p className="mb-5 text-slate-400 leading-relaxed">
          Ať použijete jakýkoliv vzor, zkontrolujte před podpisem těchto 8 bodů:
        </p>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-6">
          <ol className="space-y-3">
            {[
              'Jméno, adresa a rodné číslo / datum narození obou stran',
              'Přesný druh práce nebo popis pracovního úkolu',
              'Místo nebo oblast výkonu práce',
              'Výše odměny — hodinová nebo úkolová sazba (min. 124 Kč/hod.)',
              'Maximální rozsah práce — ideálně s odkazem na limit 300 hodin ročně (§ 75 ZP)',
              'Způsob a termín vyplacení odměny',
              'Datum uzavření dohody a podpisy obou stran',
              'Oznamovací povinnost zaměstnavatele vůči ČSSZ (do 8 dnů od nástupu)',
            ].map((item, i) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/30 text-[10px] font-bold text-amber-400">{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <div className="mb-12 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-7">
        <h2 className="mb-2 text-lg font-black text-white">Vytvořte DPP správně napoprvé</h2>
        <p className="mb-5 text-sm leading-relaxed text-slate-400">
          Systém sestaví dohodu o provedení práce přímo z vašich údajů — s citacemi zákoníku práce,
          správnou odměnou a všemi náležitostmi platnými pro rok 2026. Žádné kopírování, žádné
          přepisování jmen v šabloně.
        </p>
        <Link
          href="/dpp"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
        >
          Vytvořit DPP online →
        </Link>
      </div>

      {/* Related */}
      <nav aria-label="Související články">
        <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Související články</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { href: '/blog/dpp-dohoda-provedeni-prace', title: 'DPP 2026 — limity, odvody a jak ji správně napsat' },
            { href: '/blog/dpp-dpc-porovnani-2026', title: 'DPP vs. DPČ — kdy použít kterou dohodu' },
          ].map(a => (
            <Link key={a.href} href={a.href} className="rounded-2xl border border-white/8 bg-[#0c1426] p-4 text-sm font-semibold text-slate-300 transition hover:border-amber-500/30 hover:text-white">
              {a.title} →
            </Link>
          ))}
        </div>
      </nav>
      <RelatedContracts currentHref="/blog/dpp-vzor-zdarma-2026" cluster="prace" />
    </article>
  );
}
