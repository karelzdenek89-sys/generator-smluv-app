import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Darovací smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
  description:
    'Kompletní průvodce darovací smlouvou pro rok 2026. Zákonné náležitosti dle OZ, kdy musí být písemná, daňové dopady, odvolání daru a nejčastější chyby při darování nemovitostí i movitých věcí.',
  keywords: [
    'darovací smlouva vzor 2026',
    'co musí obsahovat darovací smlouva',
    'darovací smlouva nemovitost',
    'darovací smlouva movitá věc',
    'darovací smlouva chyby',
    'dar daň 2026',
    'darovací smlouva OZ',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/darovaci-smlouva-2026' },
  openGraph: {
    title: 'Darovací smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
    description:
      'Průvodce darovací smlouvou — zákonné náležitosti, kdy je povinná písemná forma, daňové dopady a kdy lze dar odvolat. Aktuální pro legislativu 2026.',
    url: 'https://smlouvahned.cz/blog/darovaci-smlouva-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Darovací smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
  description: 'Kompletní průvodce darovací smlouvou pro rok 2026. Zákonné náležitosti dle OZ, kdy musí být písemná, daňové dopady, odvolání daru a nejčastější chyby při darování nemovitostí i movitých věcí.',
  url: 'https://smlouvahned.cz/blog/darovaci-smlouva-2026',
  datePublished: '2026-03-15',
  dateModified: '2026-03-15',
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
    { '@type': 'ListItem', position: 3, name: 'Darovací smlouva vzor 2026: Co musí obsahovat a nejčastější chyby', item: 'https://smlouvahned.cz/blog/darovaci-smlouva-2026' },
  ],
};

export default function DarovaciSmlouvaVzor2026Page() {
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
        <span className="text-slate-400">Darovací smlouva vzor 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Osobní a finanční</span>
          <span className="text-xs text-slate-600">7 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-03-15">15. března 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Darovací smlouva vzor 2026: Co musí obsahovat a nejčastější chyby
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Darujete nemovitost, auto nebo jinou hodnotnou věc? Správná darovací smlouva je základ — bez ní
          riskujete spory o vlastnictví, daňové komplikace nebo nevymahatelnou dohodu. Tento průvodce vám
          ukáže, co zákon vyžaduje a čeho se vyvarovat.
        </p>

        {/* Inline CTA */}
        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Chcete přeskočit teorii?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte si darovací smlouvu online — formulář vás provede krok za krokem, hotovo za 5 minut.</p>
          <Link
            href="/darovaci"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit darovací smlouvu →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-darovaci-smlouva" className="hover:text-amber-400 transition">1. Co je darovací smlouva a kdy ji potřebujete</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co musí darovací smlouva obsahovat</a></li>
          <li><a href="#pisemna-forma" className="hover:text-amber-400 transition">3. Kdy je povinná písemná forma</a></li>
          <li><a href="#dan-z-daru" className="hover:text-amber-400 transition">4. Daň z daru v roce 2026</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">5. Nejčastější chyby při darování</a></li>
          <li><a href="#odvolani-daru" className="hover:text-amber-400 transition">6. Kdy lze dar odvolat</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí a doporučení</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-darovaci-smlouva" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je darovací smlouva a kdy ji potřebujete</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Darovací smlouva je právní dokument, kterým dárce bezplatně přenechává věc nebo právo obdarovanému,
          a ten dar přijímá. Řídí se <strong className="text-slate-300">§ 2055 a násl. zákona č. 89/2012 Sb. (občanský zákoník)</strong>.
          Klíčovým znakem je bezúplatnost — dárce nezíská žádnou protihodnotu.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Darovací smlouvu potřebujete vždy, když chcete darování právně doložit. Bez smlouvy se v budoucnu
          může obdarovaný i dárce ocitnout v situaci, kdy nikdo nemůže prokázat, za jakých podmínek k darování
          došlo — a zda vůbec. To platí dvojnásob u darů vyšší hodnoty.
        </p>

        <h3 className="mb-3 mt-6 text-lg font-black text-white">Typické situace, kdy se darovací smlouva uzavírá</h3>
        <ul className="mb-4 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Darování nemovitosti (bytu, domu, pozemku) mezi rodinnými příslušníky</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Darování vozidla nebo jiné hodnotné movité věci</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Darování peněz — zejména jako pomoc při koupi nemovitosti</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Darování obchodního podílu nebo pohledávky</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Darování v rámci dědického plánování (anticipace dědictví)</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Poznámka:</strong> Darování peněz v rodině (manžel, děti, rodiče) je od daně
          z příjmů osvobozeno. Přesto je vhodné mít písemný záznam — zejména pokud jde o vyšší sumy
          darované jako příspěvek na koupi nemovitosti. Banka nebo finanční úřad mohou dokumentaci vyžadovat.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí darovací smlouva obsahovat</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Zákon nestanoví pevný seznam náležitostí darovací smlouvy, avšak z obecných pravidel smluvního práva
          a z judikatury vyplývá, co musí smlouva obsahovat, aby byla platná a vymahatelná.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Povinné náležitosti</h3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace dárce', d: 'Celé jméno, datum narození nebo rodné číslo, adresa trvalého bydliště. U podnikatelů IČO a sídlo.' },
            { t: 'Identifikace obdarovaného', d: 'Stejné údaje jako u dárce. Obdarovaným může být i právnická osoba (spolek, nadace).' },
            { t: 'Přesný předmět daru', d: 'Co přesně se daruje — u nemovitostí: katastrální označení, LV, obec, k. ú. U movitých věcí: popis, VIN (auto), sériové číslo.' },
            { t: 'Projev vůle bezplatně darovat', d: 'Smlouva musí jasně vyjadřovat, že dárce dar poskytuje bezúplatně a obdarovaný jej přijímá.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-3 text-lg font-black text-white">Doporučená — ale klíčová — ujednání</h3>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Datum a místo uzavření smlouvy</strong> — pro právní jistotu a případné prokázání
              předcházení dluhovým problémům (odporovatelnost darování).
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Podmínky daru (věcné břemeno / výhrada)</strong> — dárce může dar podmínit,
              např. právem dožití v darované nemovitosti (§ 2063 OZ).
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Prohlášení o stavu daru</strong> — zejména u nemovitostí a vozidel: zda je dar
              bez závad, zástavního práva, exekuce nebo jiného zatížení.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Ujednání o nákladech</strong> — kdo hradí náklady spojené s převodem vlastnictví
              (vklad do katastru, poplatky, daně).
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Klauzule o odvolání daru</strong> — za jakých podmínek může dárce dar odvolat
              (nevděk, nouze). Jasné smluvní vymezení předchází budoucím sporům.
            </div>
          </li>
        </ul>

        {/* CTA inline */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <p className="mb-3 text-sm text-slate-300">
            Darovací smlouva na SmlouvaHned obsahuje všechna povinná i doporučená ustanovení — formulář vás provede krok za krokem.
          </p>
          <Link href="/darovaci" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit darovací smlouvu online →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="pisemna-forma" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Kdy je povinná písemná forma</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Tato otázka bývá zdrojem mnoha nedorozumění. Občanský zákoník rozlišuje dvě situace:
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-3 text-sm font-black text-emerald-400">Písemná forma POVINNÁ</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">✓</span>Darování nemovitosti (vždy — vklad do katastru)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">✓</span>Darování věci, která není odevzdána zároveň s uzavřením smlouvy</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">✓</span>Darování pohledávky nebo práva (vždy)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">✓</span>Darování vyšší hodnoty — silně doporučeno z praktických důvodů</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-5">
            <div className="mb-3 text-sm font-black text-slate-400">Písemná forma není zákonem vyžadována</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Darování movité věci při současném odevzdání</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Darování menší sumy peněz v hotovosti</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Drobné dary (narozeninový dárek apod.)</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠ Praktické pravidlo:</strong> I tam, kde zákon písemnou smlouvu nevyžaduje,
          doporučujeme ji uzavřít při každém daru přesahujícím 10 000 Kč. Bez písemného záznamu nelze
          v budoucnu prokázat podmínky darování ani to, zda šlo o dar nebo půjčku.
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="dan-z-daru" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Daň z daru v roce 2026</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Daň darovací jako samostatná daň byla v České republice zrušena v roce 2014. Příjmy z darování
          jsou od té doby řešeny v rámci <strong className="text-slate-300">daně z příjmů fyzických nebo právnických osob</strong>.
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Darování v rodině — osvobozeno</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dary mezi příbuznými v přímé linii (rodiče, děti, prarodiče, vnuci) a manželi jsou
              od daně z příjmů zcela osvobozeny. To platí bez ohledu na výši daru.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Darování mimo rodinu — zdaněno</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Obdarovaný musí hodnotu daru zahrnout do daňového přiznání jako ostatní příjem (§ 10 ZDP)
              a zdanit ji sazbou 15 % (fyzické osoby). Výjimka: dary do 15 000 Kč za rok od jednoho dárce
              jsou osvobozeny.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Darování nemovitosti — speciální situace</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Při darování nemovitosti se výše daru pro daňové účely stanovuje dle znaleckého posudku nebo
              dle ceny zjištěné jiným způsobem. Osvobození pro příbuzné platí i zde. Dárce daň neplatí —
              darování není příjmem dárce.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Doporučení:</strong> Daňové dopady darování se liší dle konkrétní situace.
          Pro darování nemovitostí vyšší hodnoty nebo darování mimo příbuzenstvo vždy doporučujeme konzultovat
          daňového poradce.
        </div>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby při darování</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Darování vypadá jednoduše — dárce dá, obdarovaný přijme. Praxe ale ukazuje, že bez správně
          sestavené smlouvy dochází k zbytečným sporům. Zde jsou nejčastější chyby.
        </p>

        <div className="space-y-5">
          {[
            {
              n: '1',
              title: 'Nepřesný popis předmětu daru',
              body: 'Nejčastější chyba: smlouva říká „auto Honda Civic" místo přesného VIN, nebo „byt v Praze" místo katastrálního čísla parcely, LV a přesné adresy. Nepřesný popis vede k pochybnostem o tom, co bylo darováno, a může způsobit, že katastr odmítne vklad zapsat.',
            },
            {
              n: '2',
              title: 'Chybějící souhlas druhého manžela',
              body: 'Pokud je předmět daru součástí společného jmění manželů (SJM), musí dar odsouhlasit oba manželé. Darování majetku ze SJM bez souhlasu druhého manžela je neplatné (§ 714 OZ). To platí i pro auto nebo finanční prostředky na společném účtu.',
            },
            {
              n: '3',
              title: 'Darování jako zastřená půjčka',
              body: 'Rodiče darují dítěti peníze na byt „jako dar", ale interně počítají s tím, že peníze budou vráceny. Bez smlouvy o zápůjčce nejde vymáhat vrácení. A naopak: pokud je smlouva označena jako darování, ale ve skutečnosti šlo o půjčku, může to být problém při dědickém řízení.',
            },
            {
              n: '4',
              title: 'Neuvedení výhrady práva dožití',
              body: 'Dárce daruje dítěti nemovitost, ale chce v ní dožít. Pokud tato výhrada (věcné břemeno dožití nebo výměnek) není zakotvena ve smlouvě a zapsána v katastru, dítě může nemovitost prodat a dárce přijde o domov. Výhradu je nutné uvést přímo v darovací smlouvě.',
            },
            {
              n: '5',
              title: 'Ignorování odporovatelnosti darování',
              body: 'Pokud dárce v době darování měl dluhy a věřitelé mohou prokázat, že darování bylo na jejich úkor, mohou se darování „odporovat" — tedy domáhat se, aby bylo relativně neúčinné vůči nim (§ 589 a násl. OZ). Darování blízkým osobám je odporovatelné do 3 let.',
            },
          ].map(c => (
            <div key={c.n} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-black text-red-400 border border-red-500/20">
                  {c.n}
                </span>
                <h3 className="font-black text-white">{c.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MID-ARTICLE CTA ─────────────────────── */}
      <ArticleInlineCta
        title="Nechcete chyby řešit dodatečně?"
        body="Darovací smlouva na SmlouvaHned pokrývá přesný popis daru, prohlášení o stavu věci, podmínky daru i klauzuli o odvolání. Formulář vás provede, PDF stáhnete ihned."
        buttonLabel="Vytvořit darovací smlouvu"
        href="/darovaci"
      />

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="odvolani-daru" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Kdy lze dar odvolat</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Darování je zpravidla trvalé a nevratné. Přesto zákon připouští dvě situace, kdy dárce může
          dar odvolat — i po předání věci obdarovanému.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Odvolání pro nevděk (§ 2072 OZ)</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Dárce může dar odvolat, pokud obdarovaný dárci nebo jeho blízké osobě úmyslně nebo hrubě
              ublíží. Odvolání musí být písemné a musí obsahovat konkrétní důvod.
            </p>
            <div className="text-xs text-slate-500">Lhůta: 1 rok od okamžiku, kdy se dárce o nevděku dozvěděl</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Odvolání pro nouzi (§ 2068 OZ)</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Upadne-li dárce do takové nouze, že nemá ani na základní obživu, může požadovat, aby
              mu obdarovaný vydal dar zpět nebo zaplatil jeho cenu — maximálně do výše, v jaké
              obdarovaný z daru ještě prospívá.
            </p>
            <div className="text-xs text-slate-500">Předpoklad: dar nesmí být již spotřebován</div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠ Důležité:</strong> Odvolání daru nezpůsobuje automaticky přechod vlastnictví zpět.
          U nemovitostí je nutný nový vklad do katastru nemovitostí. Pokud obdarovaný odmítá dar vrátit,
          je nutné podat žalobu — a právní pomoc advokáta je zde nezbytná.
        </div>
      </section>

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí a doporučení</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Darovací smlouva chrání obě strany — dárce i obdarovaného. Správně sestavená předchází
          sporům o vlastnictví, daňovým komplikacím i rodinným nedorozuměním.
        </p>
        <div className="mb-6 space-y-2">
          {[
            'Vždy uzavírejte písemnou smlouvu — i při darování movité věci vyšší hodnoty',
            'Popis předmětu daru musí být přesný — u nemovitostí katastrální označení, u vozidel VIN',
            'Při darování ze SJM musí souhlasit oba manželé',
            'Chcete-li v darované nemovitosti dožít, zakotvte výhradu dožití přímo ve smlouvě',
            'Darování v přímé linii a mezi manželi je osvobozeno od daně z příjmů',
            'Pro darování nemovitostí nebo darování v hodnotě nad 500 000 Kč zvažte konzultaci advokáta',
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
        generatorSuitable="Darování movitých věcí, vozidel a peněz mezi příbuznými nebo blízkými osobami. Online generátor pokryje povinné náležitosti, prohlášení o stavu daru a podmínky odvolání."
        lawyerSuitable="Darování nemovitostí s výhradou dožití nebo věcným břemenem, darování obchodního podílu, situace, kdy má dárce dluhy (riziko odporovatelnosti), nebo spory po odvolání daru."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte darovací smlouvu online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí smlouvy. Hotovo za méně než 5 minut,
          PDF ke stažení ihned po zaplacení.
        </p>
        <Link
          href="/darovaci"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit darovací smlouvu →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 249 Kč · Dle § 2055 OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ARTICLES ────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/darovaci-smlouva', label: '🎁 Darovací smlouva — přehled' },
            { href: '/uznani-dluhu-vzor', label: '⚖️ Uznání dluhu' },
            { href: '/blog/najemni-smlouva-vzor-2026', label: '🏠 Nájemní smlouva vzor' },
            { href: '/blog/kupni-smlouva-na-auto-2026', label: '🚗 Kupní smlouva na auto' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

    </article>
  );
}
