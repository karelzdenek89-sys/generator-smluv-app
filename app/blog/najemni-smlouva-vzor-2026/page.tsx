import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import RelatedContracts from '@/app/components/RelatedContracts';
import BlogArticleSchemas from '@/app/components/seo/BlogArticleSchemas';
import RelatedArticles from '@/app/components/blog/RelatedArticles';

export const metadata = blogArticlePageMetadata("najemni-smlouva-vzor-2026", {
  title: "Nájemní smlouva vzor 2026: co musí obsahovat",
  description: "Kompletní průvodce nájemní smlouvou pro rok 2026. Co musí smlouva obsahovat dle OZ, nejčastější chyby pronajímatelů, jak se chránit a kdy nestačí vzor z internetu.",
  keywords: ['nájemní smlouva vzor 2026',
    'co musí obsahovat nájemní smlouva',
    'nájemní smlouva chyby',
    'nájemní smlouva byt 2026',
    'jak napsat nájemní smlouvu',
    'nájemní smlouva náležitosti',
    'nájemní smlouva podle OZ',],
});


export default function NajemniSmlouvaVzor2026Page() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <BlogArticleSchemas slug="najemni-smlouva-vzor-2026" />

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
          Nájemní smlouva vzor 2026: co musí obsahovat
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Pronajímáte byt nebo hledáte nájemní smlouvu pro rok 2026? Tento průvodce vám ukáže, co zákon vyžaduje,
          čeho se vyvarovat a jak smlouvu sestavit tak, aby vás skutečně chránila.
        </p>

        <ArticleInlineCta
          title="Chcete přeskočit teorii?"
          body="Vytvořte si nájemní smlouvu online — formulář vás provede krok za krokem, hotovo za 5 minut."
          buttonLabel="Vytvořit nájemní smlouvu"
          href="/najem"
          articleSlug="najemni-smlouva-vzor-2026"
        />
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
          U nájmu bytu nebo domu zákon písemnou formu vyžaduje. Pokud písemná forma chybí,
          pronajímatel nemůže vůči nájemci namítat neplatnost jen z tohoto důvodu.
          Písemná smlouva je proto <strong className="text-slate-300">naprosto zásadní</strong> pro obě strany:
          zachycuje výši nájemného, jistotu, pravidla užívání i délku nájmu.
        </p>

        <h3 className="mb-3 mt-6 text-lg font-black text-white">Kdy je písemná forma povinná?</h3>
        <ul className="mb-4 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>U nájmu bytu nebo domu podle § 2237 OZ</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Vždy, když potřebujete prokazatelně doložit nájemné, jistotu, dobu nájmu a pravidla užívání</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>V praxi: u každého dlouhodobějšího bydlení</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Praktická poznámka:</strong> U běžného nájmu bytu nebo domu berte písemnou
          smlouvu jako nutnost. Ústní dohody jsou v případě sporu obtížně prokazatelné a často neobsahují všechny
          důležité podmínky.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí nájemní smlouva obsahovat</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Zákon stanoví povinné náležitosti, bez nichž je smlouva neplatná nebo vymahatelnost
          jejích podmínek sporná. Zároveň existuje řada ustanovení, která zákon nevyžaduje,
          ale která v praxi <strong className="text-slate-300">výrazně pomáhají předcházet sporům</strong>.
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
              <strong className="text-slate-300">Kauce a podmínky vrácení</strong> — výše jistoty a případných smluvních pokut
              musí v souhrnu respektovat limit trojnásobku měsíčního nájemného dle § 2254 OZ.
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
              U zvířat nejde o jednoduchý absolutní zákaz: nájemce je může chovat, pokud tím nepůsobí nepřiměřené obtíže.
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
              <strong className="text-slate-300">Smluvní pokuty</strong> — sankce za prodlení, porušení pravidel nebo nevrácení klíčů.
              Musí být přiměřené a u nájmu bytu se spolu s jistotou počítají do limitu podle § 2254 OZ.
            </div>
          </li>
        </ul>

        <ArticleInlineCta
          title="Nájemní smlouva online"
          body="Nájemní smlouva na SmlouvaHned obsahuje všechna povinná i doporučená ustanovení — vyplníte je krok za krokem ve formuláři."
          buttonLabel="Vytvořit nájemní smlouvu"
          href="/najem"
          variant="subtle"
          articleSlug="najemni-smlouva-vzor-2026"
        />
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
              body: 'Mnozí pronajímatelé kauci sjednají, ale zapomínají uvést, za jakých podmínek ji vrátí, na co ji lze použít a jak proběhne vyúčtování. Zákon vyžaduje vrácení jistoty při skončení nájmu, případně započtení řádně specifikovaných dluhů nájemce. Lhůtu a postup vyúčtování je vhodné výslovně upravit ve smlouvě.',
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
        body="Nájemní smlouva na SmlouvaHned vás provede kritickými místy — jistotou, podmínkami výpovědi, pravidly užívání, Airbnb doložkou i přiměřenými sankcemi. Vyplníte formulář a po platbě stáhnete PDF."
        buttonLabel="Vytvořit nájemní smlouvu"
        href="/najem"
        articleSlug="najemni-smlouva-vzor-2026"
      />

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="jak-se-chranit" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak se chránit jako pronajímatel i nájemce</h2>

        <h3 className="mb-3 text-lg font-black text-white">Pronajímatel: klíčové kroky</h3>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span><strong className="text-slate-300">Vždy požadujte písemnou smlouvu</strong> — u nájmu bytu nebo domu je zákonem vyžadovaná a zároveň zásadní pro dokazování dohodnutých podmínek.</span>
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
            <span><strong className="text-slate-300">Smluvní pokuty nastavujte přiměřeně</strong> — u nájmu bytu se jejich souhrn spolu s jistotou počítá do limitu dle § 2254 OZ.</span>
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
          Nájemní smlouva je základní dokument každého pronájmu. Dobře sestavená pomáhá předejít sporům,
          špatná nebo neexistující může v praxi znamenat zbytečné náklady.
        </p>
        <div className="mb-6 space-y-2">
          {[
            'Vždy uzavírejte písemnou smlouvu — i na krátký pronájem',
            'Nezapomeňte na kauci, podmínky vrácení a pravidla užívání',
            'Vytvořte předávací protokol s fotografiemi při každém předání bytu',
            'Smluvní pokuty sjednávejte přiměřeně a hlídejte souhrnný limit s jistotou',
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

      <ArticleInlineCta
        title="Vytvořte nájemní smlouvu online"
        body="Formulář vás provede každou částí smlouvy. Hotovo za méně než 5 minut, PDF ke stažení ihned po zaplacení."
        buttonLabel="Vytvořit nájemní smlouvu"
        href="/najem"
        articleSlug="najemni-smlouva-vzor-2026"
      />

      <ArticleInlineCta
        title="Potřebujete i předávací protokol a potvrzení o kauci?"
        body="Balíček pro pronajímatele (299 Kč) kombinuje nájemní smlouvu s podklady k předání bytu — typicky pro nový pronájem od základu."
        buttonLabel="Otevřít balíček pro pronajímatele"
        href="/balicek-pronajimatel"
        variant="subtle"
        eyebrow="Tematický balíček"
        articleSlug="najemni-smlouva-vzor-2026"
      />

      {/* ── RELATED ARTICLES ────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/najemni-smlouva', label: '🏠 Nájemní smlouva — landing page' },
            { href: '/blog/proc-smlouvahned-misto-vzoru-2026', label: '📖 Proč SmlouvaHned místo vzoru z webu' },
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
      <RelatedArticles currentSlug="najemni-smlouva-vzor-2026" />
    </article>
  );
}
