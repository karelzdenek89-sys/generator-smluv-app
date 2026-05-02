import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import RelatedContracts from '@/app/components/RelatedContracts';

export const metadata: Metadata = {
  title: 'Nájemní smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
  description:
    'Kompletní průvodce nájemní smlouvou pro rok 2026. Co musí smlouva obsahovat dle OZ, nejčastější chyby pronajímatelů, jak se chránit a kdy nestačí vzor z internetu.',
  keywords: [
    'nájemní smlouva vzor 2026',
    'co musí obsahovat nájemní smlouva',
    'nájemní smlouva chyby',
    'nájemní smlouva byt 2026',
    'jak napsat nájemní smlouvu',
    'nájemní smlouva náležitosti',
    'nájemní smlouva podle OZ',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/najemni-smlouva-vzor-2026' },
  openGraph: {
    title: 'Nájemní smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
    description:
      'Průvodce nájemní smlouvou — zákonné náležitosti, chyby pronajímatelů, jak se chránit. Aktuální pro legislativu 2026.',
    url: 'https://smlouvahned.cz/blog/najemni-smlouva-vzor-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Nájemní smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
  description: 'Kompletní průvodce nájemní smlouvou pro rok 2026. Co musí smlouva obsahovat dle OZ, nejčastější chyby pronajímatelů, jak se chránit a kdy nestačí vzor z internetu.',
  url: 'https://smlouvahned.cz/blog/najemni-smlouva-vzor-2026',
  datePublished: '2026-03-01',
  dateModified: '2026-03-01',
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
    { '@type': 'ListItem', position: 3, name: 'Nájemní smlouva vzor 2026: Co musí obsahovat a nejčastější chyby', item: 'https://smlouvahned.cz/blog/najemni-smlouva-vzor-2026' },
  ],
};

export default function NajemniSmlouvaVzor2026Page() {
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
        <span className="text-slate-400">Nájemní smlouva vzor 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Bydlení</span>
          <span className="text-xs text-slate-600">8 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-03-01">1. března 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Nájemní smlouva vzor 2026: Co musí obsahovat a nejčastější chyby
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Pronajímáte byt nebo hledáte nájemní smlouvu pro rok 2026? Tento průvodce vám ukáže, co zákon vyžaduje,
          čeho se vyvarovat a jak smlouvu sestavit tak, aby vás skutečně chránila.
        </p>

        {/* Inline CTA */}
        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Chcete přeskočit teorii?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte si nájemní smlouvu online — formulář vás provede krok za krokem, hotovo za 5 minut.</p>
          <Link
            href="/najemni-smlouva"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit nájemní smlouvu →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-najemni-smlouva" className="hover:text-amber-400 transition">1. Co je nájemní smlouva a kdy je povinná</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co musí nájemní smlouva obsahovat</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">3. Nejčastější chyby při sestavování smlouvy</a></li>
          <li><a href="#jak-se-chranit" className="hover:text-amber-400 transition">4. Jak se chránit jako pronajímatel i nájemce</a></li>
          <li><a href="#predavaci-protokol" className="hover:text-amber-400 transition">5. Proč je předávací protokol klíčový</a></li>
          <li><a href="#vzor-nebo-vlastni" className="hover:text-amber-400 transition">6. Vzor z internetu, nebo vlastní smlouva?</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí a doporučení</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-najemni-smlouva" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je nájemní smlouva a kdy je povinná</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Nájemní smlouva je písemná dohoda, která upravuje práva a povinnosti pronajímatele a nájemce při
          nájmu bytu nebo domu. Řídí se zejména ustanoveními <strong className="text-slate-300">§ 2201 a násl. zákona č. 89/2012 Sb. (občanský zákoník)</strong>.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zákon písemnou formu nájemní smlouvy přímo nevyžaduje — pokud ji nevyžaduje alespoň jedna ze stran.
          Přesto je písemná smlouva <strong className="text-slate-300">naprosto zásadní</strong>. Bez ní nemáte žádný
          důkaz o dohodnutých podmínkách: výši nájemného, kauci, pravidlech nebo délce pronájmu.
        </p>

        <h3 className="mb-3 mt-6 text-lg font-black text-white">Kdy je písemná forma povinná?</h3>
        <ul className="mb-4 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Pokud to alespoň jedna ze stran požaduje</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Pokud je nájem sjednán na dobu delší než jeden rok</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>V praxi: vždy — ochrana obou stran to vyžaduje</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Praktická poznámka:</strong> I při krátkodobém pronájmu, kde zákon písemnou smlouvu nevyžaduje,
          je písemná dohoda silně doporučena. Ústní dohody jsou v případě sporu téměř neprokazatelné.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí nájemní smlouva obsahovat</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Zákon stanoví povinné náležitosti, bez nichž je smlouva neplatná nebo vymahatelnost
          jejích podmínek sporná. Zároveň existuje řada ustanovení, která zákon nevyžaduje,
          ale která vás v praxi <strong className="text-slate-300">zásadně chrání</strong>.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Povinné náležitosti dle OZ</h3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Celé jméno, adresa, datum narození nebo rodné číslo (u fyzických osob), případně IČO (u podnikatelů).' },
            { t: 'Předmět nájmu', d: 'Přesná adresa, číslo bytu, patro, příslušenství (sklep, garážové stání). Čím přesnější, tím lépe.' },
            { t: 'Výše nájemného', d: 'Konkrétní částka v Kč, den splatnosti, způsob platby (bankovní převod, číslo účtu, VS).' },
            { t: 'Doba nájmu', d: 'Na dobu určitou (s datem ukončení) nebo neurčitou (s podmínkami výpovědi).' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-3 text-lg font-black text-white">Doporučená — ale klíčová — ujednání</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Tato ustanovení zákon přímo nevyžaduje, ale jejich absence je jednou z
          <strong className="text-slate-300"> nejčastějších příčin sporů</strong> mezi pronajímateli a nájemníky:
        </p>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Kauce a podmínky vrácení</strong> — výše (max. trojnásobek nájemného dle § 2254 OZ),
              lhůta pro vrácení, na co ji lze použít.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Zálohy na služby a jejich vyúčtování</strong> — kolik platí nájemce za vodu, teplo, elektřinu,
              internet, výtah a jak probíhá roční vyúčtování.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Pravidla užívání</strong> — zvířata, kouření, podnájem, Airbnb, maximální počet osob, podnikání v bytě.
              Bez těchto pravidel nájemce může dělat cokoliv zákon nezakazuje.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Odpovědnost za opravy</strong> — kdo hradí drobné opravy, co je povinností pronajímatele.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Smluvní pokuty</strong> — sankce za prodlení s nájmem, porušení pravidel, nevrácení klíčů.
              Bez smluvní pokuty máte jen zákonné nároky, které jsou těžko vymahatelné.
            </div>
          </li>
        </ul>

        {/* CTA inline */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <p className="mb-3 text-sm text-slate-300">
            Nájemní smlouva na SmlouvaHned obsahuje všechna povinná i doporučená ustanovení — vyplníte je krok za krokem ve formuláři.
          </p>
          <Link href="/najemni-smlouva" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit nájemní smlouvu online →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Nejčastější chyby při sestavování nájemní smlouvy</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Zkušenosti z praxe ukazují, že se pronajímatelé i nájemníci dopouštějí opakujících se chyb.
          Níže jsou ty nejzásadnější — a jak se jim vyhnout.
        </p>

        <div className="space-y-5">
          {[
            {
              n: '1',
              title: 'Chybí nebo je nejasná výše kauce',
              body: 'Mnozí pronajímatelé kauci sjednají, ale zapomínají uvést, za jakých podmínek ji vrátí, na co ji lze použít a v jaké lhůtě. To vede ke sporům po skončení nájmu. Zákon říká, že kauce musí být vrácena do 1 měsíce od skončení nájmu — pokud smlouva nestanoví jinak.',
            },
            {
              n: '2',
              title: 'Neurčité podmínky pro výpověď',
              body: 'Nájemní smlouva na dobu neurčitou vyžaduje výpovědní lhůtu. Bez jasně sjednané výpovědní doby platí zákonná pravidla, která jsou složitá a pro pronajímatele nevýhodná. Výpověď nájemníkovi bez jeho zavinění vyžaduje závažný důvod a tříměsíční výpovědní lhůtu.',
            },
            {
              n: '3',
              title: 'Žádná pravidla pro Airbnb a podnájem',
              body: 'Pokud smlouva výslovně nezakazuje nebo neupravuje krátkodobý pronájem (Airbnb, Booking) nebo podnájem, nájemce může toto právo bez souhlasu pronajímatele uplatnit. § 2274 OZ umožňuje podnájem se souhlasem pronajímatele — ten souhlas si zajistěte smluvně.',
            },
            {
              n: '4',
              title: 'Chybějící nebo neúplný předávací protokol',
              body: 'Bez dokumentovaného stavu bytu při předání není možné prokázat, jaké škody způsobil nájemce. Bez protokolu se kauce vrátí i za škody, které nájemce nezpůsobil — nebo naopak pronajímatel neoprávněně sráží za předexistující poškození.',
            },
            {
              n: '5',
              title: 'Neaktuální vzor z internetu',
              body: 'Volně dostupné vzory nájemních smluv jsou často staré 5–10 let a neodpovídají aktuálnímu znění OZ. Velká novela občanského zákoníku proběhla v roce 2021 (NOZ 2012 s novelami). Smlouva sestavená na zastaralém vzoru může obsahovat neplatná nebo nevymahatelná ustanovení.',
            },
            {
              n: '6',
              title: 'Příliš obecné podmínky bez konkrétních čísel',
              body: 'Formulace jako „nájemce uhradí přiměřené náklady" nebo „po dohodě stran" jsou v praxi nevymahatelné. Vždy uvádějte konkrétní čísla: výši pokut, lhůty, peněžní limity.',
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
        body="Nájemní smlouva na SmlouvaHned pokrývá všechna kritická místa automaticky — kauci, podmínky výpovědi, Airbnb doložku i smluvní pokuty. Vyplníte formulář, stáhnete PDF."
        buttonLabel="Vytvořit nájemní smlouvu"
        href="/najem"
      />

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="jak-se-chranit" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak se chránit jako pronajímatel i nájemce</h2>

        <h3 className="mb-3 text-lg font-black text-white">Pronajímatel: klíčové kroky</h3>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Vždy požadujte písemnou smlouvu</strong> — i na krátký pronájem. Bez ní nemáte žádnou právní páku.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Sjednejte kauci formálně v smlouvě</strong> — výši, podmínky použití i lhůtu vrácení.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Zdokumentujte stav bytu předávacím protokolem</strong> — fotografie, popis, odečty. Podepisuje pronajímatel i nájemce.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Zahrňte smluvní pokuty</strong> — za prodlení s nájmem, za porušení pravidel. Bez sankce je smlouva jen papírem.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Explicitně upravte Airbnb a podnájem</strong> — jinak to nájemce může dělat bez souhlasu.</span>
          </li>
        </ul>

        <h3 className="mb-3 text-lg font-black text-white">Nájemce: na co si dát pozor</h3>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500">✓</span>
            <span><strong className="text-slate-300">Čtěte smlouvu celou</strong> — zejména podmínky kauce, pravidla pro výpověď a co je zakázáno.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500">✓</span>
            <span><strong className="text-slate-300">Trvejte na předávacím protokolu</strong> — bez něj riskujete, že budete platit za škody, které jste nezpůsobili.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500">✓</span>
            <span><strong className="text-slate-300">Ověřte, kdo je skutečný vlastník</strong> — pronajímatel musí mít právo pronajímat. Výpis z katastru nemovitostí je online zdarma.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500">✓</span>
            <span><strong className="text-slate-300">Neplatte kauci bez smlouvy</strong> — čelíte riziku, že ji nikdy neuvidíte.</span>
          </li>
        </ul>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="predavaci-protokol" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Proč je předávací protokol klíčový</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Předávací protokol je samostatná příloha nájemní smlouvy. Zachycuje <strong className="text-slate-300">stav bytu ke dni předání</strong> —
          případná poškození, stav vybavení, odečty vody, elektřiny a plynu.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Bez protokolu je po skončení nájmu obtížné nebo nemožné prokázat:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Jaké škody existovaly před nastěhováním nájemce</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Jaký byl stav spotřebičů a vybavení při předání</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Kolik klíčů bylo předáno</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Jaké byly odečty měřidel — základ pro vyúčtování</li>
        </ul>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-emerald-400">✓ Dobré vědět:</strong> Nájemní smlouvy vytvořené na SmlouvaHned automaticky generují
          předávací protokol jako přílohu — není třeba hledat šablonu zvlášť. Protokol obsahuje soupis
          vybavení, místa pro odečty měřidel a podpisy obou stran.
        </div>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="vzor-nebo-vlastni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Vzor z internetu, nebo vlastní smlouva?</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Na internetu je dostupná celá řada vzorů nájemních smluv — zdarma ke stažení, v PDF i Word.
          Proč tedy platit za smlouvu?
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
            <div className="mb-3 text-sm font-black text-red-400">❌ Vzor z internetu</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Zpravidla zastaralý (5–10 let)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Obecný — nezohledňuje vaše podmínky</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Chybí klauzule pro váš konkrétní případ</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Musíte sami vyplnit a zkontrolovat</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Může obsahovat neplatná ustanovení</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-3 text-sm font-black text-emerald-400">✓ Smlouva na SmlouvaHned</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-500">✓</span>Aktualizováno pro legislativu 2026</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-500">✓</span>Přizpůsobeno přesně vašim podmínkám</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-500">✓</span>Předávací protokol automaticky jako příloha</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-500">✓</span>Formulář vás provede krok za krokem</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-500">✓</span>Volitelné smluvní pokuty a ochranné klauzule</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed">
          Pro standardní pronájem bytu nebo domu je online generátor smluv
          <strong className="text-slate-400"> plně dostačující</strong>. Doporučujeme advokáta v případě
          nestandardních podmínek, sporů nebo transakcí s vysokou hodnotou.
        </p>
      </section>

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí a doporučení</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Nájemní smlouva je základní dokument každého pronájmu. Správně sestavená vás chrání,
          špatná nebo neexistující vás může přijít draho.
        </p>
        <div className="mb-6 space-y-2">
          {[
            'Vždy uzavírejte písemnou smlouvu — i na krátký pronájem',
            'Nezapomeňte na kauci, podmínky vrácení a pravidla užívání',
            'Vytvořte předávací protokol s fotografiemi při každém předání bytu',
            'Sjednávejte smluvní pokuty — bez nich smlouva postrádá reálnou vymahatelnost',
            'Používejte aktuální smlouvy — legislativa se mění, vzory z roku 2015 nestačí',
            'Pro nestandardní situace (spory, dědictví, komerční pronájem) konzultujte advokáta',
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
        generatorSuitable="Standardní pronájem bytu nebo domu, kdy potřebujete aktuální smlouvu s kaucí, pravidly užívání a smluvními pokutami. Online generátor vás provede formulářem a vydá hotové PDF."
        lawyerSuitable="Komerční pronájem nebytových prostor, složité podmínky (opční právo, investice nájemce do nemovitosti), probíhající spory nebo velmi vysoká hodnota nájmu."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte nájemní smlouvu online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí smlouvy. Hotovo za méně než 5 minut,
          PDF ke stažení ihned po zaplacení.
        </p>
        <Link
          href="/najemni-smlouva"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit nájemní smlouvu →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Dle § 2201 OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ARTICLES ────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/najemni-smlouva', label: '🏠 Nájemní smlouva — landing page' },
            { href: '/podnajem', label: '🏘️ Podnájemní smlouva' },
            { href: '/kupni-smlouva', label: '🛒 Kupní smlouva' },
            { href: '/pracovni-smlouva', label: '💼 Pracovní smlouva' },
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

      <RelatedContracts currentHref="/blog/najemni-smlouva-vzor-2026" cluster="bydleni" />
    </article>
  );
}
