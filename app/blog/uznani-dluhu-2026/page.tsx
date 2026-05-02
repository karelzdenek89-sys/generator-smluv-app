import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import RelatedContracts from '@/app/components/RelatedContracts';

export const metadata: Metadata = {
  title: 'Uznání dluhu 2026: Co to je, co musí obsahovat a proč je důležité',
  description:
    'Průvodce uznáním dluhu pro rok 2026 (§ 2053 OZ). Co je uznání dluhu, jak se liší od smlouvy o půjčce, jaké náležitosti musí mít, jak přerušuje promlčení a nejčastější chyby.',
  keywords: [
    'uznání dluhu vzor 2026',
    'uznání dluhu náležitosti',
    'uznání dluhu promlčení',
    'uznání dluhu § 2053',
    'uznání závazku',
    'uznání dluhu chyby',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/uznani-dluhu-2026' },
  openGraph: {
    title: 'Uznání dluhu 2026: Co to je, co musí obsahovat a proč je důležité',
    description: 'Co je uznání dluhu, náležitosti, přerušení promlčení a nejčastější chyby. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/uznani-dluhu-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Uznání dluhu 2026: Co to je, co musí obsahovat a proč je důležité',
  description:
    'Průvodce uznáním dluhu § 2053 OZ — co je uznání dluhu, náležitosti, jak přerušuje promlčení a nejčastější chyby.',
  url: 'https://smlouvahned.cz/blog/uznani-dluhu-2026',
  datePublished: '2026-04-02',
  dateModified: '2026-04-02',
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
    { '@type': 'ListItem', position: 3, name: 'Uznání dluhu 2026: Co to je, co musí obsahovat a proč je důležité', item: 'https://smlouvahned.cz/blog/uznani-dluhu-2026' },
  ],
};

export default function UznaniDluhu2026Page() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
        <span className="mx-2 text-slate-700">›</span>
        <Link href="/blog" className="hover:text-slate-300 transition">Blog</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-slate-400">Uznání dluhu 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Osobní a finanční</span>
          <span className="text-xs text-slate-600">7 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-02">2. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Uznání dluhu 2026: Co to je, co musí obsahovat a proč je důležité
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Dlužník vám dluží peníze, ale odmítá podepsat novou smlouvu o půjčce? Uznání dluhu je
          rychlé a účinné řešení — potvrzuje existenci závazku, přerušuje promlčení a výrazně
          usnadňuje případné vymáhání. Přečtěte si, co musí uznání dluhu obsahovat a jak ho správně sepsat.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Potřebujete uznání dluhu?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte uznání dluhu online — s přesnou výší dluhu, důvodem vzniku a závazkem splácení. PDF ihned.</p>
          <Link
            href="/uznani-dluhu"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit uznání dluhu →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-uznani-dluhu" className="hover:text-amber-400 transition">1. Co je uznání dluhu a k čemu slouží</a></li>
          <li><a href="#promIceni" className="hover:text-amber-400 transition">2. Jak uznání dluhu přerušuje promlčení</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">3. Co musí uznání dluhu obsahovat</a></li>
          <li><a href="#vymahani" className="hover:text-amber-400 transition">4. Vymáhání dluhu po uznání</a></li>
          <li><a href="#caste-situace" className="hover:text-amber-400 transition">5. Typické situace použití</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-uznani-dluhu" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je uznání dluhu a k čemu slouží</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Uznání dluhu je jednostranné písemné prohlášení dlužníka, kterým potvrzuje, že existuje
          konkrétní dluh vůči věřiteli. Upraveno je § 2053 občanského zákoníku. Uznání dluhu není
          novou smlouvou — nevzniká jím nový závazek, pouze se potvrzuje (a důkazně upevňuje) ten existující.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-3 text-sm font-black text-emerald-400">Co uznání dluhu přináší věřiteli</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Písemný důkaz o existenci závazku</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Přerušení promlčecí doby (nová 3letá lhůta)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Silnější pozice při soudním vymáhání</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Lze sepsat i bez advokáta</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5">
            <div className="mb-3 text-sm font-black text-blue-400">Kdy ho použít</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Půjčka bez písemné smlouvy</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Dluh z nezaplacené faktury</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Blížící se konec promlčecí lhůty</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Potvrzení zbytku dluhu po částečné úhradě</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="promIceni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Jak uznání dluhu přerušuje promlčení</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Obecná promlčecí lhůta u peněžitých pohledávek je <strong className="text-white">3 roky</strong> (§ 629 OZ).
          Po jejím uplynutí může dlužník vznést námitku promlčení a soud pohledávku zamítne.
          Uznání dluhu promlčení přerušuje — od okamžiku uznání začíná běžet nová 10letá promlčecí lhůta (§ 639 OZ).
        </p>

        <div className="mb-5 rounded-2xl border border-white/8 bg-[#0c1426] p-6">
          <div className="mb-4 text-sm font-black text-white">Příklad — proč na načasování záleží</div>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 rounded bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-400">Rok 1</span>
              <div>Věřitel půjčí 50 000 Kč, dlužník nesplácí. Promlčecí lhůta začíná běžet.</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 rounded bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-400">Rok 2,5</span>
              <div>Dlužník podepíše uznání dluhu na 50 000 Kč. Původní 3letá lhůta se přerušuje.</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">Výsledek</span>
              <div>Od podpisu uznání dluhu běží nová <strong className="text-white">10letá</strong> promlčecí lhůta. Věřitel má čas do roku 12,5 od původní půjčky.</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠️ Upozornění:</strong> Pokud promlčecí lhůta již uplynula a dlužník vznesl námitku promlčení,
          uznání dluhu podepsané po promlčení má omezené účinky. Jednejte včas.
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co musí uznání dluhu obsahovat</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zákon (§ 2053 OZ) vyžaduje písemnou formu a podpis dlužníka. V praxi by uznání dluhu mělo obsahovat:
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace dlužníka', d: 'Jméno, příjmení, datum narození, adresa. U firmy: název, IČO, sídlo, zastoupení.' },
            { t: 'Identifikace věřitele', d: 'Jméno, příjmení, datum narození, adresa (nebo IČO). Bez identifikace věřitele je dokument neúplný.' },
            { t: 'Přesná výše dluhu', d: 'Konkrétní částka v Kč. Pokud zbývá jen část dluhu, uveďte původní výši i aktuální zůstatek.' },
            { t: 'Důvod vzniku dluhu', d: 'Z čeho dluh pochází — půjčka ze dne X, nezaplacená faktura č. Y, náhrada škody. Bez důvodu je vymahatelnost slabší.' },
            { t: 'Závazek splatit', d: 'Dlužník výslovně uznává dluh a zavazuje se ho uhradit — ideálně s termínem splacení nebo splátkovým kalendářem.' },
            { t: 'Datum a podpis dlužníka', d: 'Datum podpisu je klíčové pro výpočet nové promlčecí lhůty. Bez podpisu je dokument neplatný.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/uznani-dluhu" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit uznání dluhu s přesnou výší a důvodem →
          </Link>
        </div>
      </section>

      {/* ── MID CTA ─────────────────────────────── */}
      <ArticleInlineCta
        title="Blíží se konec promlčecí lhůty?"
        body="Vytvořte uznání dluhu online a přerušte promlčení. Formulář pokryje výši dluhu, důvod vzniku i závazek splatit. PDF ihned k podpisu."
        buttonLabel="Vytvořit uznání dluhu"
        href="/uznani-dluhu"
      />

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="vymahani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Vymáhání dluhu po uznání</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Uznání dluhu výrazně zjednodušuje soudní vymáhání. Věřitel nemusí prokazovat, jak dluh
          vznikl — stačí doložit podepsané uznání. Postup vymáhání:
        </p>

        <div className="mb-5 space-y-4">
          <div className="flex gap-4 rounded-xl border border-white/8 bg-[#0c1426] p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-sm font-black text-amber-400 border border-amber-500/20">1</div>
            <div>
              <div className="mb-1 text-sm font-black text-white">Předsoudní výzva k zaplacení</div>
              <p className="text-sm text-slate-400 leading-relaxed">Písemná výzva s lhůtou k úhradě. Doporučeně nebo datovou schránkou — doklad o doručení je důležitý pro soud.</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl border border-white/8 bg-[#0c1426] p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-sm font-black text-amber-400 border border-amber-500/20">2</div>
            <div>
              <div className="mb-1 text-sm font-black text-white">Návrh na vydání platebního rozkazu</div>
              <p className="text-sm text-slate-400 leading-relaxed">Rychlý a levný způsob soudního vymáhání — soud vydá platební rozkaz bez ústního jednání. K návrhu přiložte uznání dluhu jako důkaz.</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl border border-white/8 bg-[#0c1426] p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-sm font-black text-amber-400 border border-amber-500/20">3</div>
            <div>
              <div className="mb-1 text-sm font-black text-white">Exekuce</div>
              <p className="text-sm text-slate-400 leading-relaxed">Pravomocný platební rozkaz (nebo rozsudek) je exekuční titul — věřitel může podat návrh na exekuci a vymáhat dluh přes soudního exekutora.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="caste-situace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Typické situace použití</h2>

        <div className="mb-5 space-y-4">
          {[
            { t: 'Půjčka přátelům nebo rodině', d: 'Peníze byly půjčeny ústně nebo jen převodem bez smlouvy. Uznání dluhu vytvoří písemný důkaz o existenci a výši závazku — a zabrání sporům o to, zda šlo o dar nebo půjčku.' },
            { t: 'Nezaplacená faktura', d: 'Odběratel fakturu nezaplatil, ale sám e-mailem potvrdil, že dluh uznává. Takový e-mail může být důkazem uznání — lepší je však formální podpis na uznání dluhu.' },
            { t: 'Blížící se promlčení', d: 'Pohledávka je stará 2,5 roku a věřitel chce promlčení přerušit. Dlužník podepíše uznání dluhu — promlčecí lhůta se obnoví na 10 let od data podpisu.' },
            { t: 'Částečná úhrada dluhu', d: 'Dlužník zaplatil část dluhu. Uznání dluhu potvrdí zůstatek (zbývající výši), aby bylo jasné, co ještě dluží.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 text-sm font-black text-white">{i.t}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Chybí důvod vzniku dluhu', body: 'Uznání dluhu říká pouze „dlužím 50 000 Kč" bez uvedení důvodu. Dlužník pak může namítat, že nevěděl, co podepisuje, nebo zpochybňovat existenci původního závazku. Vždy uveďte, z čeho dluh pochází.' },
            { n: '2', title: 'Ústní uznání dluhu', body: 'Dlužník verbálně přizná, že dluží — svědci to slyšeli. Bez písemné formy uznání dluhu podle § 2053 OZ nevznikají právní účinky (přerušení promlčení). Vždy požadujte písemný dokument s podpisem.' },
            { n: '3', title: 'Podpis bez data', body: 'Uznání dluhu je podepsáno, ale není datováno. Bez data nelze určit, odkdy běží nová promlčecí lhůta. Datum podpisu je klíčový údaj — vždy ho uveďte.' },
            { n: '4', title: 'Čekání příliš dlouho', body: 'Věřitel čeká s uznáním dluhu na „vhodný moment" a mezitím uplyne 3letá promlčecí lhůta. Dlužník vznesl námitku promlčení a pohledávka je nevymahatelná. Jednejte, jakmile je jasné, že dlužník nesplácí.' },
            { n: '5', title: 'Záměna uznání dluhu a nové smlouvy o půjčce', body: 'Věřitel chce uzavřít novou smlouvu, ale dlužník odmítá. Uznání dluhu nevyžaduje souhlas věřitele ani nové ujednání — stačí jednostranný podpis dlužníka. Nepotřebujete novou smlouvu.' },
          ].map(c => (
            <div key={c.n} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-black text-red-400 border border-red-500/20">{c.n}</span>
                <h3 className="font-black text-white">{c.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí</h2>
        <div className="mb-6 space-y-2">
          {[
            'Uznání dluhu musí být písemné a podepsané dlužníkem — ústní uznání nemá právní účinky',
            'Přerušuje 3letou promlčecí lhůtu — od podpisu běží nová 10letá lhůta',
            'Vždy uveďte důvod vzniku dluhu a přesnou výši — bez toho je dokument snáze zpochybnitelný',
            'Datum podpisu je klíčový údaj — bez data nelze určit začátek nové promlčecí lhůty',
            'Jednejte včas — po uplynutí promlčecí lhůty má uznání dluhu omezené účinky',
            'Uznání dluhu je jednostranné — nepotřebujete souhlas věřitele ani novou smlouvu',
          ].map(t => (
            <div key={t} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-0.5 flex-shrink-0 text-amber-400 font-bold">✓</span>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BOX ───────────────────────────── */}
      <ArticleTrustBox
        generatorSuitable="Uznání dluhu z půjčky, nezaplacené faktury nebo jiného závazku — kdy dlužník uznává existenci dluhu a věřitel potřebuje písemný důkaz a přerušení promlčení."
        lawyerSuitable="Vymáhání starých pohledávek (blízko promlčení), spory o existenci dluhu, vysoké pohledávky (nad 500 000 Kč) nebo situace, kdy dlužník zpochybňuje původní závazek."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte uznání dluhu online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí dokumentu — od výše dluhu po závazek splatit. PDF ihned k podpisu.
        </p>
        <Link
          href="/uznani-dluhu"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit uznání dluhu →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Dle OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/uznani-dluhu-vzor', label: '📄 Uznání dluhu — přehled' },
            { href: '/blog/smlouva-o-zapujcce-2026', label: '💰 Smlouva o půjčce' },
            { href: '/pujcka-smlouva', label: '📋 Průvodce smlouvou o půjčce' },
            { href: '/blog/kupni-smlouva-movita-vec', label: '🛒 Kupní smlouva' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
      <RelatedContracts currentHref="/blog/uznani-dluhu-2026" cluster="finance" />
    </article>
  );
}
