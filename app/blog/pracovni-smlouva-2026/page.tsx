import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import RelatedContracts from '@/app/components/RelatedContracts';
import BlogArticleSchemas from '@/app/components/seo/BlogArticleSchemas';
import RelatedArticles from '@/app/components/blog/RelatedArticles';
import { faqPageSchema, jsonLdScript } from '@/lib/schemas';

const faq = [
  {
    q: 'Co musí pracovní smlouva obsahovat podle zákona?',
    a: 'Zákoník práce vyžaduje druh práce, místo výkonu práce a den nástupu. Další podmínky lze uvést ve smlouvě nebo v samostatných dokumentech, například mzdovém výměru.',
  },
  {
    q: 'Kdy použít pracovní smlouvu místo DPP nebo DPČ?',
    a: 'Pracovní smlouva je vhodná pro pravidelný pracovní poměr s plným rozshem práv a povinností. DPP nebo DPČ se hodí pro krátkodobou nebo příležitostnou práci do zákonných limitů hodin.',
  },
  {
    q: 'Musí být mzda přímo ve smlouvě?',
    a: 'Ne. Výši mzdy lze uvést v pracovní smlouvě nebo v samostatném mzdovém výměru. Důležité je, aby zaměstnanec měl písemně sjednané mzdové podmínky.',
  },
  {
    q: 'Jak dlouhá může být zkušební doba?',
    a: 'U běžného zaměstnance maximálně 4 měsíce, u vedoucího zaměstnance 8 měsíců. Musí být sjednána nejpozději v den nástupu do práce.',
  },
  {
    q: 'Nahrazuje online generátor právní poradenství?',
    a: 'Ne. Generátor připraví standardizovaný dokument podle vámi zadaných údajů. U agenturního zaměstnávání, cizinců nebo složitých konkurenčních doložek je vhodné obrátit se na advokáta.',
  },
];

const faqSchema = faqPageSchema(faq.map((item) => ({ question: item.q, answer: item.a })));

export const metadata = blogArticlePageMetadata("pracovni-smlouva-2026", {
  title: "Pracovní smlouva vzor 2026 | Co musí obsahovat",
  description: "Co musí obsahovat pracovní smlouva v roce 2026, na co si dát pozor před podpisem a kdy použít pracovní smlouvu místo DPP nebo DPČ.",
  keywords: ['pracovní smlouva vzor 2026',
    'co musí obsahovat pracovní smlouva',
    'pracovní smlouva zákoník práce',
    'pracovní smlouva zkušební doba',
    'pracovní smlouva chyby',
    'pracovní smlouva zaměstnanec',
    'jak napsat pracovní smlouvu',],
});


export default function PracovniSmlouvaVzor2026Page() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <BlogArticleSchemas slug="pracovni-smlouva-2026" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
        <span className="mx-2 text-slate-700">›</span>
        <Link href="/blog" className="hover:text-slate-300 transition">Blog</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-slate-400">Pracovní smlouva vzor 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Práce a zaměstnání</span>
          <span className="text-xs text-slate-600">9 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-03-20">20. března 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Pracovní smlouva vzor 2026: Co musí obsahovat
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Přijímáte nového zaměstnance nebo si nejste jisti, zda vaše pracovní smlouva splňuje zákonné
          požadavky? Zákoník práce je přísný — smlouva bez povinných náležitostí nebo s neplatnými
          ustanoveními vás jako zaměstnavatele vystavuje zbytečnému riziku.
        </p>

        <ArticleInlineCta
          title="Chcete přeskočit teorii?"
          body="Vytvořte si pracovní smlouvu online — formulář vás provede krok za krokem, hotovo za 5 minut."
          buttonLabel="Vytvořit pracovní smlouvu"
          href="/pracovni"
          articleSlug="pracovni-smlouva-2026"
        />
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#tri-povinne-nalezitosti" className="hover:text-amber-400 transition">1. Tři povinné náležitosti dle zákoníku práce</a></li>
          <li><a href="#co-smlouva-obsahovat-musi" className="hover:text-amber-400 transition">2. Co smlouva obsahovat musí a co doporučujeme přidat</a></li>
          <li><a href="#zkusebni-doba" className="hover:text-amber-400 transition">3. Zkušební doba: pravidla a chyby</a></li>
          <li><a href="#mzda-a-precsas" className="hover:text-amber-400 transition">4. Mzda, přesčas a benefity ve smlouvě</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">5. Nejčastější chyby zaměstnavatelů</a></li>
          <li><a href="#vypoved" className="hover:text-amber-400 transition">6. Výpověď a skončení pracovního poměru</a></li>
          <li><a href="#checklist" className="hover:text-amber-400 transition">7. Checklist před podpisem</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">8. Shrnutí a doporučení</a></li>
          <li><a href="#faq" className="hover:text-amber-400 transition">9. Časté otázky</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="tri-povinne-nalezitosti" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Tři povinné náležitosti dle zákoníku práce</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Pracovní smlouva se řídí <strong className="text-slate-300">zákonem č. 262/2006 Sb. (zákoník práce)</strong>.
          Na rozdíl od smluv dle občanského zákoníku je zákoník práce kogentní — mnohá jeho ustanovení
          nelze smluvně obejít, a to ani v neprospěch zaměstnance.
        </p>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Zákon v <strong className="text-slate-300">§ 34 odst. 1 zákoníku práce</strong> stanoví tři povinné
          náležitosti, bez nichž pracovní smlouva není platně uzavřena:
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Druh práce',
              d: 'Co přesně bude zaměstnanec vykonávat. Čím přesnější popis, tím snazší je hodnotit, zda zaměstnanec plní, co má.',
            },
            {
              n: '2',
              t: 'Místo výkonu práce',
              d: 'Konkrétní adresa pracoviště. Může být i více míst nebo celé území ČR — záleží na dohodě.',
            },
            {
              n: '3',
              t: 'Den nástupu do práce',
              d: 'Přesné datum prvního pracovního dne. Od tohoto dne vzniká pracovní poměr a práva i povinnosti obou stran.',
            },
          ].map(i => (
            <div key={i.n} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-black text-amber-400">
                {i.n}
              </div>
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Klíčové:</strong> Chybí-li ve smlouvě byť jedna z těchto tří náležitostí,
          pracovní poměr sice může fakticky vzniknout (zaměstnanec začne pracovat), ale smlouva je vadná.
          To může způsobit komplikace při výpovědi nebo sporech. Vždy ověřte, že smlouva všechny tři
          obsahuje ještě před podpisem.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-smlouva-obsahovat-musi" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co smlouva obsahovat musí a co doporučujeme přidat</h2>

        <h3 className="mb-3 text-lg font-black text-white">Zákonem vyžadované informace</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Mimo tří povinných náležitostí musí zaměstnavatel zaměstnanci poskytnout — buď přímo ve smlouvě,
          nebo v samostatném dokumentu (§ 37 ZP) — tyto informace:
        </p>
        <ul className="mb-6 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Délka dovolené a způsob jejího čerpání</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Výpovědní lhůty</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Délka pracovní doby a její rozvržení</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Mzdové nebo platové podmínky (výše mzdy nebo odkaz na kolektivní smlouvu)</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Druh a rozsah výkonu práce (pokud není ve smlouvě)</li>
        </ul>

        <h3 className="mb-3 text-lg font-black text-white">Doporučená ujednání</h3>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Mlčenlivost a ochrana obchodního tajemství</strong> — bez tohoto ustanovení je ochrana
              informací v zákoníku práce minimální. Mlčenlivost může být sjednána i pro dobu po skončení
              pracovního poměru.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Konkurenční doložka</strong> — zakazuje zaměstnanci po skončení pracovního poměru
              pracovat pro konkurenci (max. 1 rok, § 310 ZP). Musí být kompenzována alespoň polovinou průměrného
              výdělku za každý měsíc plnění.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Práce z domova (home office)</strong> — podmínky a rozsah práce z domova, příspěvek
              na náklady. Zákoník práce vyžaduje pro home office písemnou dohodu od roku 2023.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Odpovědnost za škodu a svěřené hodnoty</strong> — pokud zaměstnanec hospodaří
              s penězi nebo zbožím, je vhodné uzavřít dohodu o hmotné odpovědnosti.
            </div>
          </li>
        </ul>

        <ArticleInlineCta
          title="Pracovní smlouva online"
          body="Pracovní smlouva na SmlouvaHned pokrývá všechny zákonné náležitosti i doporučená ujednání — mlčenlivost, home office i zkušební dobu."
          buttonLabel="Vytvořit pracovní smlouvu"
          href="/pracovni"
          variant="subtle"
          articleSlug="pracovni-smlouva-2026"
        />
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="zkusebni-doba" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Zkušební doba: pravidla a chyby</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zkušební doba je jedním z nejčastějších témat pracovních smluv — a zároveň zdrojem mnoha chyb.
          Řídí se <strong className="text-slate-300">§ 35 zákoníku práce</strong>.
        </p>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Délka zkušební doby', d: 'Max. 4 měsíce (zaměstnanec), max. 8 měsíců (vedoucí zaměstnanec) — dle aktuálního znění § 35 zákoníku práce. Kratší zkušební dobu lze sjednat — delší ne.' },
            { t: 'Kdy musí být sjednána', d: 'Nejpozději v den nástupu do práce. Po nástupu ji nelze dodatečně sjednat ani prodloužit.' },
            { t: 'Nesmí přesáhnout polovinu doby', d: 'U pracovního poměru na dobu určitou nesmí zkušební doba přesáhnout polovinu sjednané doby trvání.' },
            { t: 'Prodloužení pro nemoc a překážky', d: 'Zkušební doba se prodlužuje o dny, kdy zaměstnanec nepracoval pro překážky v práci nebo čerpal dovolenou.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠ Časté pochybení:</strong> Zaměstnavatel omylem sjedná zkušební dobu
          delší než 4 měsíce (nebo 8 pro vedoucí). Taková ujednání jsou neplatná — zkušební doba se automaticky
          zkrátí na zákonné maximum. Přitom zaměstnavatel počítá s delší dobou a může být překvapen, že
          zaměstnance nelze ve zkušební době propustit bez udání důvodu o týden déle.
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="mzda-a-precsas" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Mzda, přesčas a benefity ve smlouvě</h2>

        <h3 className="mb-3 text-lg font-black text-white">Mzda ve smlouvě vs. v mzdovém výměru</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Výši mzdy lze uvést přímo v pracovní smlouvě nebo v samostatném mzdovém výměru. Oba přístupy
          jsou zákonné. Praxe se liší:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 text-slate-500 flex-shrink-0">→</span>
            <span><strong className="text-slate-300">Mzda ve smlouvě</strong> — přehledné, ale změna mzdy vyžaduje písemný dodatek ke smlouvě.</span>
          </li>
          <li className="flex items-start gap-2"><span className="mt-1 text-slate-500 flex-shrink-0">→</span>
            <span><strong className="text-slate-300">Mzda v mzdovém výměru</strong> — flexibilnější, změnu lze provést vydáním nového výměru bez úpravy smlouvy.</span>
          </li>
        </ul>

        <h3 className="mb-3 text-lg font-black text-white">Přesčas — co smlouva musí a může říkat</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Přesčasová práce je regulována zákonem:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Max. 8 hodin přesčasů týdně, max. 150 hodin ročně na příkaz zaměstnavatele</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Dalších 125 hodin ročně lze sjednat individuálně se zaměstnancem</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Přesčas se kompenzuje příplatkem 25 % nebo náhradním volnem (po dohodě)</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>U vedoucích lze sjednat mzdu „s přihlédnutím k přesčasům" — ale pouze do rozsahu 150/325 hodin ročně</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Tip:</strong> Benefity (stravenkový paušál, sick days, příspěvek na sport) nelze přímo vymáhat,
          pokud nejsou zakotveny ve smlouvě nebo interní směrnici zaměstnavatele. Zaměstnanec, který spoléhá
          na ústně přislíbené benefity bez smlouvy, nemá právní nárok na jejich poskytnutí.
        </div>

        <p className="mt-6 text-slate-400 leading-relaxed">
          Pokud nejde o pravidelný pracovní poměr, ale o krátkodobou práci do zákonných limitů, může být
          vhodnější{' '}
          <Link href="/dohoda-o-provedeni-prace" className="text-amber-400 hover:text-amber-300 transition">
            dohoda o provedení práce
          </Link>
          . Rozdíly mezi pracovní smlouvou, DPP a DPČ shrnujeme v{' '}
          <Link href="/blog/dpp-dpc-porovnani-2026" className="text-amber-400 hover:text-amber-300 transition">
            porovnání DPP a DPČ
          </Link>
          ; k minimální mzdě a odměně u DPP viz{' '}
          <Link href="/blog/minimalni-mzda-dpp-pracovni-smlouva-2026" className="text-amber-400 hover:text-amber-300 transition">
            článek o minimální mzdě a DPP
          </Link>
          .
        </p>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby zaměstnavatelů</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Zákoník práce chrání zaměstnance — a zaměstnavatele, kteří smlouvy podceňují, čekají zbytečné
          komplikace. Zde jsou nejčastější pochybení.
        </p>

        <div className="space-y-5">
          {[
            {
              n: '1',
              title: 'Příliš obecný druh práce',
              body: 'Popis „pracovník kanceláře" nebo „obchodní zástupce" je příliš vágní. Pokud zaměstnavatel přiděluje práci mimo rámec sjednaného druhu, zaměstnanec ji může odmítnout bez právních důsledků. Druh práce by měl být konkrétní, ale ne tak úzký, aby omezoval běžnou operativu.',
            },
            {
              n: '2',
              title: 'Neexistence konkurenční doložky',
              body: 'Zaměstnavatel investuje do zaměstnance a školení, zaměstnanec pak odejde ke konkurenci a využije vše, co se naučil. Bez sjednané konkurenční doložky (§ 310 ZP) se tomu nelze bránit. Doložku je nutné sjednat přímo v pracovní smlouvě — dodatečně lze, ale jen se souhlasem zaměstnance.',
            },
            {
              n: '3',
              title: 'Chybějící dohoda o home office',
              body: 'Od roku 2023 musí být podmínky práce z domova sjednány písemně. Ústní dohoda nestačí. Bez písemné dohody nemůže zaměstnavatel home office nařídit — ani odvolat. Zaměstnanec na home office má také právo na příspěvek na náklady (energie, internet), pokud není smluvně dohodnuto jinak.',
            },
            {
              n: '4',
              title: 'Neplatná nebo chybějící mlčenlivost',
              body: 'Zákoník práce ukládá zaměstnancům povinnost mlčenlivosti pouze v omezeném rozsahu. Pro citlivé obchodní informace, klientské databáze nebo know-how je nutné sjednat mlčenlivost výslovně — a ideálně i na dobu po skončení pracovního poměru.',
            },
            {
              n: '5',
              title: 'Neurčitá nebo neplatná výpovědní lhůta',
              body: 'Zákonná výpovědní lhůta je 2 měsíce (§ 51 ZP). Smlouvou ji lze prodloužit, ale jen symetricky — stejně pro zaměstnavatele i zaměstnance. Nelze sjednat delší lhůtu jen pro zaměstnance. Neplatná ujednání se jednoduše ignorují a uplatní se zákonná lhůta.',
            },
            {
              n: '6',
              title: 'Podpis smlouvy až po nástupu',
              body: 'Zákon (§ 34 odst. 3 ZP) vyžaduje písemnou pracovní smlouvu. Pokud zaměstnanec nastoupí bez podepsané smlouvy a zaměstnavatel mu ji dá podepsat za týden, existuje právní nejistota o podmínkách pracovního poměru za ten týden. Smlouva musí být podepsána nejpozději v den nástupu.',
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
        body="Pracovní smlouva na SmlouvaHned pokrývá tři povinné náležitosti, zkušební dobu, mlčenlivost, home office i výpovědní lhůtu. Formulář vás provede, PDF stáhnete ihned."
        buttonLabel="Vytvořit pracovní smlouvu"
        href="/pracovni"
        articleSlug="pracovni-smlouva-2026"
      />

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="vypoved" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Výpověď a skončení pracovního poměru</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zákoník práce přísně reguluje, jak lze pracovní poměr ukončit. Zaměstnavatel má méně možností
          než zaměstnanec — a musí dodržet přesná pravidla.
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Výpověď ze strany zaměstnance</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Zaměstnanec může dát výpověď kdykoliv bez udání důvodu. Výpovědní lhůta: minimálně 2 měsíce
              (nebo delší, pokud je tak sjednáno). Lhůta začíná prvním dnem měsíce následujícího po doručení výpovědi.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Výpověď ze strany zaměstnavatele</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Zaměstnavatel může dát výpověď pouze z důvodů taxativně vyjmenovaných v zákoně (§ 52 ZP):
              organizační důvody (nadbytečnost), zdravotní způsobilost, nesplňování předpokladů nebo
              závažné porušení pracovní kázně.
            </p>
            <div className="text-xs text-slate-500">
              Výpověď musí být písemná, doručena zaměstnanci a musí obsahovat přesný zákonný důvod. Nesprávný nebo chybějící důvod → výpověď je neplatná.
            </div>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Okamžité zrušení pracovního poměru</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Možné pro obě strany, ale jen v zákonem stanovených případech. Zaměstnavatel: zvlášť hrubé
              porušení pracovní kázně nebo odsouzení pro trestný čin. Zaměstnanec: zaměstnavatel neposlal
              mzdu do 15 dnů po splatnosti, nebo závažně ohrožuje zdraví zaměstnance.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Poznámka:</strong> Spory ze skončení pracovního poměru patří k nejčastějším
          pracovněprávním sporům. Pro neplatnou výpověď zaměstnavatele platí: zaměstnanec může do 2 měsíců
          uplatnit neplatnost u soudu a domáhat se náhrady mzdy za dobu neplatného rozvázání.
        </div>
      </section>

      {/* ── SECTION 7: CHECKLIST ────────────────── */}
      <section id="checklist" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Checklist před podpisem pracovní smlouvy</h2>
        <p className="mb-5 text-slate-400 leading-relaxed">
          Než smlouvu podepíšete, projděte si tyto body. U standardní pracovní smlouvy je můžete vyřešit
          přes{' '}
          <Link href="/pracovni" className="text-amber-400 hover:text-amber-300 transition">
            online generátor pracovní smlouvy
          </Link>
          ; u složitějších situací doporučujeme konzultaci s odborníkem.
        </p>
        <div className="space-y-2">
          {[
            'Druh práce je konkrétní, ale ne příliš úzce vymezený',
            'Místo výkonu práce a den nástupu jsou uvedeny správně',
            'Zkušební doba je sjednána v den nástupu a nepřesahuje zákonný limit',
            'Mzdové podmínky jsou písemně sjednány ve smlouvě nebo mzdovém výměru',
            'Home office, mlčenlivost a konkurenční doložka jsou zakotveny, pokud je potřebujete',
            'Smlouva je podepsána nejpozději v den nástupu do práce',
            'Víte, zda potřebujete pracovní smlouvu, nebo spíše DPP či DPČ',
          ].map((t) => (
            <div key={t} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-0.5 flex-shrink-0 text-amber-400 font-bold">✓</span>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 8: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">8. Shrnutí a doporučení</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Pracovní smlouva je základ každého pracovního vztahu. Správně sestavená chrání zaměstnavatele i
          zaměstnance — a předchází zbytečným sporům.
        </p>
        <div className="mb-6 space-y-2">
          {[
            'Smlouva musí vždy obsahovat druh práce, místo výkonu a den nástupu',
            'Zkušební dobu sjednejte v den nástupu — dodatečně ji nelze přidat',
            'Konkurenční doložku a mlčenlivost zakotvěte přímo ve smlouvě',
            'Home office vyžaduje od roku 2023 písemnou dohodu',
            'Mzdu uveďte ve smlouvě nebo v samostatném mzdovém výměru — ústní příslib nestačí',
            'Pro složité situace (agenturní zaměstnávání, zahraniční pracovníci, výrazná konkurenční doložka) doporučujeme advokáta',
          ].map(t => (
            <div key={t} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-0.5 flex-shrink-0 text-amber-400 font-bold">✓</span>
              {t}
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-400 leading-relaxed">
          Podrobný přehled náležitostí najdete také na stránce{' '}
          <Link href="/pracovni-smlouva" className="text-amber-400 hover:text-amber-300 transition">
            pracovní smlouva — průvodce
          </Link>
          .
        </p>
      </section>

      <section id="faq" className="mb-12 scroll-mt-6">
        <h2 className="mb-6 text-2xl font-black tracking-tight text-white">9. Časté otázky</h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-amber-500/30"
            >
              <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                <span>{item.q}</span>
                <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── TRUST BOX ───────────────────────────── */}
      <ArticleTrustBox
        generatorSuitable="Standardní pracovní smlouva pro jednoho zaměstnance — na dobu určitou i neurčitou, se zkušební dobou, mlčenlivostí a home office doložkou. Generátor pokryje všechny zákonné náležitosti."
        lawyerSuitable="Agenturní zaměstnávání, hromadné propouštění, převod podniku, zaměstnávání cizinců, složité konkurenční doložky nebo spory ze skončení pracovního poměru."
      />

      <ArticleInlineCta
        title="Vytvořte pracovní smlouvu online"
        body="Formulář vás provede každou částí smlouvy. Hotovo za méně než 5 minut, PDF ke stažení ihned po zaplacení."
        buttonLabel="Vytvořit pracovní smlouvu"
        href="/pracovni"
        articleSlug="pracovni-smlouva-2026"
      />

      {/* ── RELATED ARTICLES ────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/pracovni', label: '👔 Vytvořit pracovní smlouvu' },
            { href: '/pracovni-smlouva', label: '📋 Pracovní smlouva — průvodce' },
            { href: '/dohoda-o-provedeni-prace', label: '📄 Dohoda o provedení práce' },
            { href: '/blog/dpp-dpc-porovnani-2026', label: '⚖️ DPP vs. DPČ' },
            { href: '/blog/minimalni-mzda-dpp-pracovni-smlouva-2026', label: '💰 Minimální mzda a DPP' },
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

      <RelatedContracts currentHref="/blog/pracovni-smlouva-2026" cluster="prace" />
      <RelatedArticles currentSlug="pracovni-smlouva-2026" />
    </article>
  );
}
