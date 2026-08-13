import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import RelatedContracts from '@/app/components/RelatedContracts';
import BlogArticleSchemas from '@/app/components/seo/BlogArticleSchemas';
import RelatedArticles from '@/app/components/blog/RelatedArticles';
import { getContextualOffer } from '@/lib/marketing/contextual-offers';
import { getMonetizationPolicy } from '@/lib/monetization-policy';
import {
  DPP_MONTHLY_THRESHOLD_2026_CZK,
  MIN_WAGE_HOURLY_2026_CZK,
  MIN_WAGE_MONTHLY_2026_CZK,
} from '@/lib/legal-constants-2026';

const dppThreshold2026 = DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ');
const minimumMonthlyWage2026 = MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('cs-CZ');
const minimumHourlyWage2026 = MIN_WAGE_HOURLY_2026_CZK.toLocaleString('cs-CZ', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const metadata = blogArticlePageMetadata("dpp-vzor-zdarma-2026", {
  title: "DPP vzor zdarma 2026 — co v něm chybí a proč na tom záleží",
  description: "Stáhnete vzor DPP zdarma — ale je správně pro rok 2026? Porovnáme, co volné šablony vynechávají a kdy se vyplatí použít generátor s citacemi zákoníku práce.",
  keywords: ['DPP vzor zdarma 2026',
    'vzor dpp 2026',
    'dohoda o provedení práce vzor zdarma',
    'DPP šablona 2026',
    'dohoda o provedení práce ke stažení',
    'generátor DPP online',],
});


export default function DppVzorZdarmaPage() {
  const dppOffer = getContextualOffer('dpp');
  const freeBasic = getMonetizationPolicy('dpp', 'cs').mode === 'free_experiment';

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <BlogArticleSchemas slug="dpp-vzor-zdarma-2026" />

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
          <time className="text-xs text-slate-600" dateTime="2026-05-20">20. května 2026</time>
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
            citacemi zákoníku práce aktuálními pro rok 2026. PDF ke stažení ihned.
          </p>
          <Link
            href="/dpp"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            {dppOffer.cta} →
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
                ['Pojistné a daň', `Pro rok 2026 sledujte rozhodný příjem ${dppThreshold2026} Kč/měsíc; daňový režim závisí na prohlášení poplatníka a konkrétní situaci`],
                ['Zdravotní pojištění', `U DPP vzniká účast při dosažení příjmu ${dppThreshold2026} Kč za měsíc u jednoho zaměstnavatele; hranice 4 500 Kč platí pro DPČ`],
                ['Oznamovací povinnost', 'Od 1. 7. 2026 registrace nebo předregistrace před zahájením práce; úplná registrace do 8 dnů od nástupu'],
                ['Minimální odměna', `Hodinová odměna nesmí být nižší než minimální mzda pro rok 2026 (${minimumMonthlyWage2026} Kč/měs. → ${minimumHourlyWage2026} Kč/hod.)`],
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
              'Průběžně aktualizováno pro rok 2026',
              'Citace § 75 a dalších ustanovení ZP přímo v textu',
              'Varování při překročení limitu nebo rizikových volbách',
              'Přizpůsobí se druhu práce, odměně i době trvání',
              freeBasic
                ? 'Základní PDF ihned ke stažení zdarma, bez registrace'
                : 'PDF ihned ke stažení po platbě',
            ].map(line => (
              <p key={line} className="mb-1.5 text-xs text-slate-300">✓ {line}</p>
            ))}
          </div>
        </div>

        <ArticleInlineCta
          href="/dpp"
          title={dppOffer.title}
          body="Vyplníte formulář za 3 minuty — systém sestaví dohodu s aktuálními paragrafovými citacemi a správnými náležitostmi pro rok 2026."
          buttonLabel={`${dppOffer.cta} →`}
          articleSlug="dpp-vzor-zdarma-2026"
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
              `Výše odměny — hodinová nebo úkolová sazba (min. ${minimumHourlyWage2026} Kč/hod. v roce 2026)`,
              'Maximální rozsah práce — ideálně s odkazem na limit 300 hodin ročně (§ 75 ZP)',
              'Způsob a termín vyplacení odměny',
              'Datum uzavření dohody a podpisy obou stran',
              'Registrace nebo předregistrace na ČSSZ před zahájením práce a úplná registrace do 8 dnů od nástupu',
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
          {dppOffer.cta} →
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
      <RelatedArticles currentSlug="dpp-vzor-zdarma-2026" />
    </article>
  );
}
