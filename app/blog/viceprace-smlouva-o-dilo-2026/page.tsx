import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('viceprace-smlouva-o-dilo-2026', {
  title: 'Vícepráce a změny díla 2026: jak předejít sporu o cenu',
  description:
    'Jak ve smlouvě o dílo upravit vícepráce, změnové listy, fixaci ceny a předání díla. Praktický průvodce pro objednatele i zhotovitele.',
});

export default function VicepraceSmlouvaODilo2026Page() {
  return (
    <ArticlePageLayout
      category="Podnikání a zakázky"
      readTime="9 min"
      dateTime="2026-05-29"
      dateLabel="29. května 2026"
      dateModified="2026-05-29"
      dateModifiedLabel="29. května 2026"
      breadcrumbLabel="Vícepráce a změny díla 2026"
      slug="viceprace-smlouva-o-dilo-2026"
      title="Vícepráce a změny díla 2026: jak předejít sporu o cenu"
      intro="Vícepráce jsou nejčastější zdroj sporů ve smlouvě o dílo — u stavby, rekonstrukce i u softwaru. Objednatel počítá s pevnou cenou, zhotoviteli během práce přibyly úkoly a obě strany se neumí domluvit na tom, kdo má co platit. Tento průvodce shrnuje, jak vícepráce ve smlouvě předem ošetřit, jaký je rozdíl mezi pevnou cenou a rozpočtem a kdy lze cenu zákonem upravit."
      toc={[
        { href: '#co-jsou-viceprace', label: 'Co jsou vícepráce a kde vznikají' },
        { href: '#pevna-cena-vs-rozpocet', label: 'Pevná cena, rozpočet, hodinová sazba' },
        { href: '#zmena-ceny-zakonem', label: 'Změna ceny díla podle zákona' },
        { href: '#zmenovy-list', label: 'Změnový list a předávací protokol' },
        { href: '#stavba-vs-software', label: 'Stavba vs. software — odlišnosti' },
        { href: '#dopurucene-klauzule', label: 'Doporučené klauzule do smlouvy' },
      ]}
      primaryAction={{
        title: 'Připravujete smlouvu o dílo?',
        body: 'Smlouva o dílo SmlouvaHned obsahuje strukturu pro pevnou cenu, vícepráce, akceptaci a vady. Formulář vás provede klíčovými body.',
        buttonLabel: 'Vytvořit smlouvu o dílo',
        href: '/smlouva-o-dilo',
      }}
      finalAction={{
        title: 'Smlouva o dílo s jasnou cenou',
        body: 'Strukturovaný formulář pokryje vícepráce, milníky i smluvní pokuty.',
        buttonLabel: 'Vytvořit dokument',
        href: '/smlouva-o-dilo',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní zakázky s konkrétním předmětem — drobné stavební úpravy, řemeslnické práce, drobný software, design, marketingový projekt. Formulář pokrývá pevnou cenu i rozpočet.',
        lawyerSuitable:
          'Stavby vyšší hodnoty s veřejnoprávními pravidly, dílo s veřejnou zakázkou, mezinárodní dodavatelé, řešení reklamací po dokončení s vysokou hodnotou škody, exkluzivní vývoj softwaru s licenčními koncepty.',
      }}
      relatedLinks={[
        { href: '/smlouva-o-dilo', label: '🛠️ Smlouva o dílo — formulář' },
        { href: '/blog/expat/work-contract-variations-czechia-2026-guide-en', label: '🇬🇧 English guide (expats)' },
        { href: '/blog/expat/work-contract-variations-czechia-2026-guide-ua', label: '🇺🇦 Український гід' },
        { href: '/sluzby', label: '💼 Smlouva o poskytování služeb' },
        { href: '/blog/smlouva-o-dilo-2026', label: '📘 Smlouva o dílo — průvodce' },
        { href: '/blog/smlouva-o-dilo-cena-a-platby', label: '💰 Cena a platby ve smlouvě o dílo' },
        { href: '/slovnik#smluvni-pokuta', label: '📖 Slovník: Smluvní pokuta' },
      ]}
    >
      <section id="co-jsou-viceprace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Co jsou vícepráce a kde vznikají
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Vícepráce jsou plnění zhotovitele nad rámec původně sjednaného předmětu díla.
          Mohou vzniknout třemi cestami:
        </p>
        <div className="space-y-3">
          {[
            {
              t: 'Vyžádané vícepráce',
              d: 'Objednatel během realizace požaduje něco navíc — nové prvky, dodatečné funkce, vyšší standard materiálu. Pokud se nedohodne cena dopředu, řeší se zpětně, což bývá zdrojem napětí.',
            },
            {
              t: 'Nezbytné vícepráce',
              d: 'Během provádění díla se ukáže, že bez určité činnosti dílo nelze dokončit nebo by nemělo požadovanou kvalitu — typicky skryté závady, neočekávané podmínky (např. nečekaný stav podloží u stavby, špatně zdokumentovaný legacy kód u software).',
            },
            {
              t: 'Vícepráce z chybného zadání',
              d: 'Objednatel poskytl podklady, ze kterých nešel plný rozsah práce odhadnout (např. neúplná dokumentace stavu, nejasný brief). Zhotovitel musel během práce řešit věci nad rámec původního plánu.',
            },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-sm leading-relaxed text-slate-400">{i.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 leading-relaxed text-slate-400">
          Bez výslovné úpravy ve smlouvě se každá kategorie chová jinak — některé vícepráce
          se hradí, jiné jsou součástí původní ceny. To bývá překvapení pro obě strany.
        </p>
      </section>

      <section id="pevna-cena-vs-rozpocet" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Pevná cena, rozpočet, hodinová sazba
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Občanský zákoník pro cenu díla rozeznává tři základní režimy:
        </p>
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Pevná (paušální) cena</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Strany se dohodnou na konečné částce za celé dílo. Zhotovitel nese riziko
              vyšších nákladů, objednatel ne. Pevnou cenu lze měnit jen za podmínek
              stanovených zákonem nebo smlouvou (typicky vyžádané změny rozsahu, podstatné
              změny podmínek).
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Cena podle rozpočtu</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Cena je určena rozpočtem — položkovým seznamem. Občanský zákoník rozlišuje
              pevnou cenu, cenu podle rozpočtu, rozpočet s výhradou nezaručené úplnosti a
              nezávazný rozpočet. Pokud je cena sjednána podle rozpočtu, je důležité výslovně
              uvést, zda je rozpočet závazný, nezávazný nebo s výhradou nezaručené úplnosti.
              Bez jasné výhrady nelze automaticky počítat s tím, že zhotovitel bude moci cenu
              jednostranně navýšit — právě tato kvalifikace rozhoduje, kdy lze žádat zvýšení
              ceny.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Hodinová (denní) sazba</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Cena se účtuje za skutečně odpracovaný čas. Pro objednatele je tato cesta
              flexibilní, ale nese největší riziko překročení. Vyplatí se zafixovat
              maximální cenový strop, povinnost zhotovitele dopředu hlásit potřebu
              překročení.
            </p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-amber-400">Pozor:</strong> Typ ceny (závazný rozpočet,
          nezávazný rozpočet, výhrada nezaručené úplnosti) je v praxi důležitější než samotný
          součet položek. Bez výslovného vymezení hrozí spor, zda zhotovitel smí cenu navýšit.
        </div>
      </section>

      <section id="zmena-ceny-zakonem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Změna ceny díla podle zákona
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Občanský zákoník upravuje, kdy lze cenu díla měnit i bez výslovné dohody:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Vyžádané změny rozsahu</strong> — pokud
              objednatel prokazatelně požaduje rozšíření díla nad původní rozsah, měly by se
              strany dohodnout na úpravě ceny a lhůty před provedením prací.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Nepředvídatelné okolnosti při ceně podle rozpočtu</strong>{' '}
              — pokud se v průběhu díla ukáže, že rozpočet bude překročen o významnou
              část (zákon zmiňuje výraznou změnu), zhotovitel musí objednatele upozornit.
              Objednatel pak může od smlouvy odstoupit, nebo navýšení akceptovat.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Podstatná změna okolností</strong> — obecný
              institut, který umožňuje úpravu smlouvy při zásadní změně podmínek, na které
              strany při uzavření nemohly počítat.
            </span>
          </li>
        </ul>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-blue-400">📌 Pozor:</strong> Pokud se objevila vícepráce
          a zhotovitel objednatele bez prodlení neupozornil, hrozí, že na navýšení nebude
          mít právo. Komunikace má v této oblasti zásadní význam — písemný záznam (e-mail,
          změnový list) bývá rozhodující.
        </div>
      </section>

      <section id="zmenovy-list" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Změnový list a předávací protokol
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Spory o vícepráce skoro vždy končí u jedné otázky: kdo o tom věděl, co bylo
          písemně potvrzeno. Praxe se osvědčila se dvěma dokumenty:
        </p>
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Změnový list (Change Order)</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Jednoduchý dokument zachycující: popis víceprác, důvod, dopad na cenu,
              dopad na termín, podpis obou stran. Bez podpisu objednatele zhotovitel
              vícepráce neprovádí (nebo provádí na vlastní riziko). Standardní praxe ve
              stavebnictví, v softwaru se zavádí s o něco menší formalitou (potvrzení v
              ticketovacím systému, podepsaný PDF dokument).
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Předávací protokol</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Dokumentuje stav díla v okamžiku předání — funkční rozsah, případné vady,
              soupis vyřízených změnových listů. Předání bez výhrad bývá důležitý okamžik
              pro běh záruční lhůty a pro splatnost koncové faktury.
            </p>
          </div>
        </div>
      </section>

      <section id="stavba-vs-software" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Stavba vs. software — odlišnosti
        </h2>
        <h3 className="mb-3 text-lg font-black text-white">Stavby a rekonstrukce</h3>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Typicky cena podle rozpočtu se závaznou položkovou strukturou.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Vícepráce vznikají často z nečekaného stavu — skryté závady, neúplná dokumentace existující stavby.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Formálnost změnových listů je zpravidla vyšší — povinné podpisy stavbyvedoucího, technika dozoru.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Stavební deník je obvyklý důkazní prostředek — průběžně zachycuje stav, počasí, mimořádné okolnosti.</span>
          </li>
        </ul>
        <h3 className="mb-3 text-lg font-black text-white">Vývoj softwaru</h3>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Často hybridní model — část pevná (MVP, klíčové funkce), část hodinová (postupný rozvoj).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Vícepráce vznikají z chybného nebo neúplného zadání (briefu), nečekaného stavu legacy kódu, integrace s třetími systémy.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Změnové listy se v praxi řeší v ticketovacím systému s odsouhlasením objednatele před zahájením.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>U agilního vývoje má praktický smysl pracovat s rámcovou smlouvou a sprintovým rozpočtem.</span>
          </li>
        </ul>
      </section>

      <section id="dopurucene-klauzule" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          6. Doporučené klauzule do smlouvy
        </h2>
        <p className="mb-5 leading-relaxed text-slate-400">
          Smlouva o dílo, která vícepráce ošetřuje, obvykle obsahuje tyto prvky:
        </p>
        <div className="space-y-3">
          {[
            {
              t: 'Definice dílo a vícepráce',
              d: 'Jasné vymezení rozsahu — co je předmětem, co je výslovně mimo. Příloha se specifikací bývá zásadní.',
            },
            {
              t: 'Cena a její režim',
              d: 'Pevná / podle rozpočtu / hodinová. U rozpočtu výslovně uvést, zda je závazný, nezávazný nebo s výhradou nezaručené úplnosti — od toho závisí, kdy lze cenu měnit.',
            },
            {
              t: 'Postup při změnách rozsahu',
              d: 'Zhotovitel písemně oznámí potřebu změny, navrhne cenový a časový dopad, objednatel do stanovené lhůty potvrdí. Bez potvrzení zhotovitel vícepráce neprovádí.',
            },
            {
              t: 'Limit ceny',
              d: 'Maximální možné navýšení (např. cena bez výslovného dodatku nepřekročí 110 % původní ceny).',
            },
            {
              t: 'Sankce za nedodržení',
              d: 'Smluvní pokuta za pozdní dodání, za neoznámení potřeby víceprác. Symetrická i pro objednatele — sankce za pozdní platbu, za nedodání podkladů.',
            },
            {
              t: 'Akceptační protokol',
              d: 'Postup předání díla a jeho převzetí, lhůta pro reklamaci, podpis obou stran.',
            },
            {
              t: 'Záruka a odpovědnost za vady',
              d: 'Délka záruční doby, postup reklamace, povinnost odstranění vad v určité lhůtě.',
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-1 text-sm font-black text-white">{c.t}</div>
              <p className="text-sm leading-relaxed text-slate-400">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    </ArticlePageLayout>
  );
}
