import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Kupní smlouva na věc 2026: Co musí obsahovat + nejčastější chyby',
  description:
    'Průvodce kupní smlouvou na movitou věc pro rok 2026. Zákonné náležitosti dle OZ, jak popsat předmět koupě, odpovědnost za vady, bezpečné předání a nejčastější chyby kupujících i prodávajících.',
  keywords: [
    'kupní smlouva na věc',
    'kupní smlouva movitá věc',
    'kupní smlouva vzor 2026',
    'co musí obsahovat kupní smlouva',
    'kupní smlouva chyby',
    'kupní smlouva OZ',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/kupni-smlouva-movita-vec' },
  openGraph: {
    title: 'Kupní smlouva na věc 2026: Co musí obsahovat + nejčastější chyby',
    description: 'Zákonné náležitosti kupní smlouvy na movitou věc, odpovědnost za vady, bezpečné předání a chyby. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/kupni-smlouva-movita-vec',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Kupní smlouva na věc 2026: Co musí obsahovat a nejčastější chyby',
  description: 'Průvodce kupní smlouvou na movitou věc pro rok 2026. Zákonné náležitosti dle OZ, jak popsat předmět koupě, odpovědnost za vady, bezpečné předání a nejčastější chyby.',
  url: 'https://smlouvahned.cz/blog/kupni-smlouva-movita-vec',
  datePublished: '2026-03-25',
  dateModified: '2026-03-25',
  author: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  publisher: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    logo: { '@type': 'ImageObject', url: 'https://smlouvahned.cz/og-image.png' },
  },
  image: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
};

export default function KupniSmlouvaMovitaVecPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
        <span className="mx-2 text-slate-700">›</span>
        <Link href="/blog" className="hover:text-slate-300 transition">Blog</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-slate-400">Kupní smlouva na věc 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Prodej a koupě</span>
          <span className="text-xs text-slate-600">7 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-03-25">25. března 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Kupní smlouva na věc 2026: Co musí obsahovat a nejčastější chyby
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Prodáváte nebo kupujete věc — elektroniku, nábytek, stroj nebo jiný hodnotný předmět?
          Správná kupní smlouva ochrání obě strany při sporech o stav věci, skrytých vadách nebo
          odmítnutí zaplatit. Bez ní se spoléháte jen na dobrou vůli druhé strany.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Chcete přeskočit teorii?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte si kupní smlouvu online — formulář vás provede krok za krokem, hotovo za 5 minut.</p>
          <Link
            href="/kupni"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit kupní smlouvu →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">1. Co musí kupní smlouva obsahovat</a></li>
          <li><a href="#popis-predmetu" className="hover:text-amber-400 transition">2. Jak správně popsat předmět koupě</a></li>
          <li><a href="#odpovdnost-za-vady" className="hover:text-amber-400 transition">3. Odpovědnost za vady a záruky</a></li>
          <li><a href="#bezpecne-predani" className="hover:text-amber-400 transition">4. Bezpečné předání a zaplacení</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">5. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">6. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co musí kupní smlouva obsahovat</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Kupní smlouva se řídí <strong className="text-slate-300">§ 2079 a násl. zákona č. 89/2012 Sb. (občanský zákoník)</strong>.
          Zákon nestanoví pevný seznam náležitostí pro movité věci, ale z obecných pravidel plyne,
          co smlouva musí obsahovat, aby byla platná a vymahatelná.
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace prodávajícího', d: 'Celé jméno (nebo název firmy), adresa, datum narození nebo IČO. U firem: název, sídlo, IČO, zápis v obchodním rejstříku.' },
            { t: 'Identifikace kupujícího', d: 'Stejné údaje jako u prodávajícího. Obě strany musí být jednoznačně identifikovatelné.' },
            { t: 'Přesný popis předmětu koupě', d: 'Výrobce, model, sériové číslo, rok výroby, barva, velikost — čím přesnější, tím lépe. Nejednoznačný popis je nejčastější příčina sporů.' },
            { t: 'Kupní cena', d: 'Konkrétní částka v Kč, způsob platby (hotovost, převodem), datum splatnosti a číslo účtu pro bezhotovostní platbu.' },
            { t: 'Datum a místo předání', d: 'Kdy a kde dojde k fyzickému předání věci. Od tohoto okamžiku přechází nebezpečí škody na kupujícím.' },
            { t: 'Prohlášení o stavu věci', d: 'Zda věc nemá vady, jaký je její stav, zda je zaplacena (bez zástavního práva, nelegálního původu).' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Kdy je kupní smlouva povinně písemná?</strong> Pro movité věci zákon písemnou formu nevyžaduje —
          věc lze platně prodat i ústní dohodou při předání. V praxi ale doporučujeme písemnou smlouvu
          vždy, kdy hodnota přesahuje 5 000 Kč. Bez ní nemůžete v případě sporu prokázat dohodnuté podmínky.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="popis-predmetu" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Jak správně popsat předmět koupě</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Přesný popis předmětu je nejdůležitější částí kupní smlouvy — a zároveň nejčastěji podceňovanou.
          Vágní popis vede ke sporům o to, co vlastně bylo prodáno, v jakém stavu a s jakým příslušenstvím.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Co zahrnout do popisu věci</h3>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span><span><strong className="text-slate-300">Výrobce a model</strong> — plný název, ne jen „notebook" nebo „pračka"</span></li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span><span><strong className="text-slate-300">Sériové číslo nebo jiný identifikátor</strong> — u elektroniky, nářadí, přístrojů</span></li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span><span><strong className="text-slate-300">Rok výroby nebo datum zakoupení</strong> — relevantní pro odpovědnost za vady</span></li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span><span><strong className="text-slate-300">Stav věci</strong> — nová, použitá, stav X/10, viditelné opotřebení</span></li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span><span><strong className="text-slate-300">Příslušenství a dokumentace</strong> — co je součástí prodeje (kabely, obaly, manuály, záruční list)</span></li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span><span><strong className="text-slate-300">Známé vady nebo nedostatky</strong> — výslovné prohlášení chrání prodávajícího před pozdějšími reklamacemi</span></li>
        </ul>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠ Příklad špatného popisu:</strong> „Jeden notebook."<br />
          <strong className="text-emerald-400 mt-2 inline-block">✓ Správný popis:</strong> „Laptop Lenovo ThinkPad X1 Carbon Gen 10, s/n PF3XY12, rok výroby 2023, 16 GB RAM, 512 GB SSD, barva černá, použitý, funkční stav, mírné škrábance na víku, bez adaptéru."
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="odpovdnost-za-vady" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Odpovědnost za vady a záruky</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zákon stanoví povinnou záruční dobu 2 roky pro spotřebitele při koupi od podnikatele (§ 2165 OZ).
          U prodeje mezi fyzickými osobami (soukromé osoby) zákon záruční dobu nepředepisuje — platí to,
          co si strany dohodnou.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-3 text-sm font-black text-emerald-400">B2C — podnikatel prodává spotřebiteli</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">✓</span>Zákonná záruka 2 roky</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">✓</span>Kupující může reklamovat, opravit, vrátit</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">✓</span>Prodávající nemůže odpovědnost smluvně omezit</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-5">
            <div className="mb-3 text-sm font-black text-slate-400">C2C — fyzická osoba prodává fyzické osobě</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Záruka jen pokud ji smlouva výslovně sjednává</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Lze sjednat kratší záruční dobu (i nulovou)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Prodávající odpovídá za vady, o nichž věděl a mlčel</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠ Důležité:</strong> Prodávající vždy odpovídá za vady, o nichž věděl a úmyslně je zatajil (§ 2103 OZ).
          Klauzule „prodáno v daném stavu, bez nároku na reklamaci" chrání pouze před neznámými vadami,
          nikoli před záměrně skrytými závadami.
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="bezpecne-predani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Bezpečné předání a zaplacení</h2>

        <h3 className="mb-3 text-lg font-black text-white">Předání věci</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Okamžikem předání přechází nebezpečí škody na kupujícím (§ 2121 OZ) — tedy pokud věc
          po předání shoří, rozbije se nebo bude odcizena, je to problém kupujícího. Proto je důležité:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Ve smlouvě uvést přesné datum a místo předání</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Kupující si věc před podpisem prohlédne a případné nedostatky uvede do smlouvy</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Příslušenství a dokumenty se předají spolu s věcí — vyjmenované ve smlouvě</li>
        </ul>

        <h3 className="mb-3 text-lg font-black text-white">Bezpečná platba</h3>
        <ul className="mb-5 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Bankovní převod s identifikovaným účelem</strong> — nejsnadnější pro doložení platby</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Hotovost + příjmový doklad</strong> — prodávající potvrdí příjem podpisem na smlouvě nebo zvláštním příjmovým dokladem</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-red-400">✗</span>
            <span><strong className="text-slate-300">Hotovost bez dokladu</strong> — v případě sporu nemůžete platbu prokázat. Obzvlášť rizikové u vyšších částek.</span>
          </li>
        </ul>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            {
              n: '1',
              title: 'Příliš vágní popis věci',
              body: 'Prodávající uvede jen „notebook" nebo „kolo". Kupující po čase tvrdí, že dostal věc v horším stavu, než čekal. Bez přesného popisu (sériové číslo, stav, vady) nelze prokázat, co bylo předmětem koupě.',
            },
            {
              n: '2',
              title: 'Žádné prohlášení o vadách',
              body: 'Prodávající věc prodá „jak stojí a leží" bez výslovného prohlášení o stavu. Kupující po předání objeví skrytou vadu a tvrdí, že o ní prodávající věděl. Bez jasného prohlášení o stavu věci je pozice prodávajícího obtížná.',
            },
            {
              n: '3',
              title: 'Platba v hotovosti bez dokladu',
              body: 'Kupující zaplatí v hotovosti. Prodávající peníze „neviděl" — nemá co prokázat. Při sporu kupující tvrdí, že nezaplatil nebo zaplatil méně. Vždy potvrzujte platbu podpisem na smlouvě nebo příjmovým dokladem.',
            },
            {
              n: '4',
              title: 'Absence příslušenství ve smlouvě',
              body: 'Prodávající a kupující se ústně dohodnou, že součástí prodeje je i obal, nabíječka a záruční list. Ve smlouvě to ale není. Po předání prodávající tvrdí, že příslušenství nebylo součástí dohody. Vše, co má být předáno, musí být ve smlouvě vyjmenováno.',
            },
            {
              n: '5',
              title: 'Smlouva podepsaná po předání',
              body: 'Strany si věc předají a peníze zaplatí, smlouvu podepíší až druhý den. To může vytvářet nejistotu o tom, kdy přešlo nebezpečí škody a kdy nastaly záruční povinnosti. Smlouvu ideálně podepisujte při fyzickém předání.',
            },
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

      {/* ── MID CTA ─────────────────────────────── */}
      <ArticleInlineCta
        title="Nechcete chyby řešit dodatečně?"
        body="Kupní smlouva na SmlouvaHned pokryje přesný popis věci, prohlášení o stavu, záruční podmínky i způsob platby. Formulář vás provede, PDF stáhnete ihned."
        buttonLabel="Vytvořit kupní smlouvu"
        href="/kupni"
      />

      {/* ── SECTION 6: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Shrnutí</h2>
        <div className="mb-6 space-y-2">
          {[
            'Popis předmětu koupě musí být přesný — výrobce, model, sériové číslo, stav, vady',
            'U prodeje fyzická osoba → fyzická osoba zákon záruční dobu nevyžaduje — sjednejte ji smluvně nebo ji výslovně vyloučte',
            'Prohlášení o stavu věci chrání prodávajícího před pozdějšími reklamacemi',
            'Platbu vždy potvrďte podpisem nebo příjmovým dokladem',
            'Veškeré příslušenství zahrňte do smlouvy — co tam není, nebylo součástí prodeje',
            'Pro věci nad 50 000 Kč nebo nestandardní podmínky zvažte konzultaci advokáta',
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
        generatorSuitable="Prodej nebo koupě movité věci mezi fyzickými osobami nebo od podnikatele — elektronika, nábytek, nářadí, stroje nebo jiné hodnotné předměty. Generátor pokryje popis věci, prohlášení o stavu a způsob předání."
        lawyerSuitable="Prodej věci vyšší hodnoty (nad 200 000 Kč), spory o vady nebo stav věci, koupě věci zatížené zástavním právem nebo probíhající exekucí, obchodní transakce mezi firmami."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte kupní smlouvu online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí smlouvy. Hotovo za méně než 5 minut, PDF ke stažení ihned.
        </p>
        <Link
          href="/kupni"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit kupní smlouvu →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 249 Kč · Dle § 2079 OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/kupni-smlouva', label: '🛒 Kupní smlouva — přehled' },
            { href: '/blog/kupni-smlouva-na-auto-2026', label: '🚗 Kupní smlouva na auto' },
            { href: '/blog/darovaci-smlouva-2026', label: '🎁 Darovací smlouva' },
            { href: '/blog/smlouva-o-zapujcce-2026', label: '💰 Smlouva o zápůjčce' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
