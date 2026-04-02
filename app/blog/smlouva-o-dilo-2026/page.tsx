import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Smlouva o dílo 2026: Co musí obsahovat a nejčastější chyby',
  description:
    'Průvodce smlouvou o dílo pro rok 2026. Co musí smlouva obsahovat dle § 2586 OZ, jak se chránit jako objednatel i zhotovitel a kdy nestačí ústní dohoda.',
  keywords: [
    'smlouva o dílo 2026',
    'co musí obsahovat smlouva o dílo',
    'smlouva o dílo vzor',
    'smlouva o dílo stavební práce',
    'smlouva o dílo rekonstrukce',
    'smlouva o dílo chyby',
    'smlouva o dílo náležitosti',
    'smlouva o dílo § 2586',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/smlouva-o-dilo-2026' },
  openGraph: {
    title: 'Smlouva o dílo 2026: Co musí obsahovat a nejčastější chyby',
    description:
      'Zákonné náležitosti smlouvy o dílo dle § 2586 OZ, jak se chránit jako objednatel i zhotovitel a nejčastější chyby při stavebních a řemeslných pracích.',
    url: 'https://smlouvahned.cz/blog/smlouva-o-dilo-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Smlouva o dílo 2026: Co musí obsahovat a nejčastější chyby',
  description: 'Průvodce smlouvou o dílo pro rok 2026. Co musí smlouva obsahovat dle § 2586 OZ, jak se chránit jako objednatel i zhotovitel a kdy nestačí ústní dohoda.',
  url: 'https://smlouvahned.cz/blog/smlouva-o-dilo-2026',
  datePublished: '2026-03-10',
  dateModified: '2026-03-10',
  author: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  publisher: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    logo: { '@type': 'ImageObject', url: 'https://smlouvahned.cz/og-image.png' },
  },
  image: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
};

export default function SmlouvaODiloPage() {
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
        <span className="text-slate-400">Smlouva o dílo 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Podnikání</span>
          <span className="text-xs text-slate-600">10 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-03-20">20. března 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Smlouva o dílo 2026: Co musí obsahovat a nejčastější chyby
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Stavíte, renovujete nebo zadáváte vývoj softwaru? Bez správně sepsané smlouvy o dílo
          riskujete spory o cenu, termín nebo kvalitu výsledku. Zjistěte, co zákon vyžaduje
          a jak se chránit jako objednatel i zhotovitel.
        </p>

        {/* Inline CTA */}
        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Chcete přeskočit teorii?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte si smlouvu o dílo online — formulář pokryje dílo, cenu, termín, akceptaci i záruky. Hotovo za 5 minut.</p>
          <Link
            href="/smlouva-o-dilo"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit smlouvu o dílo →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-smlouva-o-dilo" className="hover:text-amber-400 transition">1. Co je smlouva o dílo a kdy ji použít</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co musí smlouva o dílo obsahovat</a></li>
          <li><a href="#cena-a-zmenove-pozadavky" className="hover:text-amber-400 transition">3. Cena díla a změnové požadavky — základ každého sporu</a></li>
          <li><a href="#predani-a-akceptace" className="hover:text-amber-400 transition">4. Předání díla a akceptační postup</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">5. Nejčastější chyby objednatelů i zhotovitelů</a></li>
          <li><a href="#smlouva-o-dilo-vs-sluzby" className="hover:text-amber-400 transition">6. Smlouva o dílo vs. smlouva o poskytování služeb</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí a doporučení</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-smlouva-o-dilo" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je smlouva o dílo a kdy ji použít</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Smlouva o dílo je smlouva, při níž se zhotovitel zavazuje provést na svůj náklad a nebezpečí
          pro objednatele určité dílo a objednatel se zavazuje dílo převzít a zaplatit cenu.
          Řídí se <strong className="text-slate-300">§ 2586 a násl. zákona č. 89/2012 Sb. (občanský zákoník)</strong>.
        </p>
        <p className="mb-5 text-slate-400 leading-relaxed">
          Klíčovým znakem smlouvy o dílo je <strong className="text-slate-300">výsledek</strong> —
          zhotovitel se nezavazuje pouze pracovat, ale dodat konkrétní dílo v konkrétní kvalitě.
          To ji odlišuje od smlouvy o poskytování služeb, kde jde o samotnou činnost (viz kapitola 6).
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Kdy smlouvu o dílo použít</h3>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Stavební práce — rekonstrukce, přístavba, novostavba</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Řemeslné práce — elektroinstalace, instalatérství, malování, podlahy</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Vývoj softwaru, webových stránek nebo aplikací</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Grafické práce, tisk, výroba reklamních materiálů</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Výroba nábytku, strojů nebo jiných hmotných věcí na zakázku</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Praktická poznámka:</strong> Zákon nevyžaduje, aby smlouva o dílo
          měla písemnou formu. V praxi je však písemná smlouva <strong className="text-slate-300">naprosto nezbytná</strong> —
          při ceně nad desítky tisíc korun je spor bez písemné smlouvy prakticky neřešitelný.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí smlouva o dílo obsahovat</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Zákon vyžaduje jen minimum — ale tím minimem jsou věci, bez nichž smlouva vůbec nemůže fungovat.
          Praktická zkušenost ukazuje, že spory vznikají téměř výhradně tam,
          kde smlouva tyto body neošetřuje dostatečně konkrétně.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Zákonné minimum</h3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Objednatel a zhotovitel — jméno/název, adresa, IČO (u podnikatelů). U fyzické osoby datum narození.' },
            { t: 'Vymezení díla', d: 'Co přesně má být provedeno — co nejkonkrétnější popis. Vágní popis je zárodkem každého sporu.' },
            { t: 'Cena díla', d: 'Buď pevná cena, nebo způsob jejího určení (rozpočet, hodinová sazba, nákladová základna + zisk). Bez ceny je smlouva neúplná.' },
            { t: 'Čas provedení', d: 'Termín dokončení nebo dílčí milníky. Bez termínu nelze uplatnit sankce za prodlení.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-3 text-lg font-black text-white">Klíčová doporučená ujednání</h3>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Platební milníky a zálohová platba</strong> — záloha chrání zhotovitele,
              platba po akceptaci chrání objednatele. Ideálně: záloha 30–50 % při podpisu,
              doplatek po akceptaci díla.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Akceptační postup</strong> — jak probíhá předání díla, co se stane při zjištění vad
              při akceptaci, lhůta pro akceptaci nebo odmítnutí, co se považuje za mlčky přijaté dílo.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Smluvní pokuty</strong> — za prodlení zhotovitele s termínem, za prodlení objednatele
              s platbou. Bez smluvní pokuty máte pouze zákonné nároky, které se obtížně vymáhají.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Záruční podmínky</strong> — délka záruky, způsob uplatnění reklamace,
              lhůta pro odstranění vady. Zákonná záruční lhůta je 2 roky (u staveb 5 let pro skryté vady).
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Postup při vícepracích</strong> — jak se zachází se změnami rozsahu (change request),
              kdo schvaluje vícepráce a v jaké formě. Bez tohoto ujednání se vícepráce stávají nejčastějším
              zdrojem sporů o cenu.
            </div>
          </li>
        </ul>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <p className="mb-3 text-sm text-slate-300">
            Smlouva o dílo na SmlouvaHned pokrývá vymezení díla, platební milníky, akceptační postup, smluvní pokuty i záruční podmínky.
          </p>
          <Link href="/smlouva-o-dilo" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit smlouvu o dílo online →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="cena-a-zmenove-pozadavky" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Cena díla a změnové požadavky — základ každého sporu</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Cena díla a způsob zacházení se změnami rozsahu jsou v praxi nejčastější příčinou sporů mezi
          objednateli a zhotoviteli. Každá ze stran má tendenci vykládat neurčitě formulované podmínky ve svůj prospěch.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Typy ujednání o ceně</h3>
        <div className="mb-6 space-y-3">
          {[
            {
              type: 'Pevná (paušální) cena',
              pros: 'Jistota pro objednatele — ví přesně, kolik zaplatí.',
              cons: 'Riziko pro zhotovitele při podhodnoceném rozsahu. Vícepráce musí být sjednány písemně a výslovně.',
            },
            {
              type: 'Cena dle rozpočtu',
              pros: 'Flexibilita při nejasném rozsahu na začátku projektu.',
              cons: 'Bez jasné metodiky může cena nekontrolovaně narůstat. Vyžaduje průběžné schvalování.',
            },
            {
              type: 'Hodinová sazba (time & material)',
              pros: 'Vhodné pro iterativní práce nebo vývoj softwaru.',
              cons: 'Objednatel nemá předem jistotu celkové ceny. Vyžaduje přesné výkaznictví odpracovaných hodin.',
            },
          ].map(c => (
            <div key={c.type} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 text-sm font-black text-white">{c.type}</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="text-xs text-slate-500"><span className="text-emerald-400">✓</span> {c.pros}</div>
                <div className="text-xs text-slate-500"><span className="text-red-400">✗</span> {c.cons}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mb-3 text-lg font-black text-white">Vícepráce a změnové požadavky</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Vícepráce jsou práce nad rámec původně sjednaného díla. Bez explicitního ujednání platí,
          že zhotovitel je provádí na vlastní riziko — objednatel nemusí vícepráce zaplatit,
          pokud je předem neodsouhlasil.
        </p>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Doporučení:</strong> Sjednejte ve smlouvě, že každá změna rozsahu
          musí být odsouhlasena <strong className="text-slate-300">písemně (e-mailem nebo podpisem change requestu)</strong> před zahájením prací.
          Ústní pokyny k víceprácím se špatně dokazují a jsou zdrojem sporů číslo jedna.
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="predani-a-akceptace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Předání díla a akceptační postup</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Akceptační postup definuje, jak proběhne formální předání a převzetí díla, a je klíčový
          z hlediska platebních podmínek, záruky i případné odpovědnosti za vady.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Jak by měl akceptační proces vypadat</h3>
        <ol className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-black text-amber-400 mt-0.5">1</span>
            <div>
              <strong className="text-slate-300">Oznámení dokončení</strong> — zhotovitel písemně (e-mailem) oznámí objednateli,
              že dílo je dokončeno a připraveno k akceptaci.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-black text-amber-400 mt-0.5">2</span>
            <div>
              <strong className="text-slate-300">Akceptační lhůta</strong> — objednatel má sjednanou lhůtu (typicky 5–10 pracovních dní)
              na provedení akceptační prohlídky.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-black text-amber-400 mt-0.5">3</span>
            <div>
              <strong className="text-slate-300">Akceptace nebo odmítnutí</strong> — objednatel buď dílo akceptuje (podpisem
              nebo e-mailem), nebo písemně uvede konkrétní vady, pro které odmítá přijmout.
              Vágní odmítnutí bez specifikace vad není relevantní.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-black text-amber-400 mt-0.5">4</span>
            <div>
              <strong className="text-slate-300">Mlčky přijaté dílo</strong> — ve smlouvě lze sjednat, že pokud objednatel v akceptační
              lhůtě nereaguje ani dílo neodmítne, považuje se dílo za akceptované. Tato klauzule chrání zhotovitele.
            </div>
          </li>
        </ol>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-emerald-400">✓ Dobré vědět:</strong> Smlouva o dílo ze SmlouvaHned obsahuje
          kompletní akceptační postup včetně lhůt, způsobu odmítnutí a fikce přijetí —
          nemusíte ho složitě formulovat sami.
        </div>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby objednatelů i zhotovitelů</h2>

        <div className="space-y-5">
          {[
            {
              n: '1',
              title: 'Příliš vágní popis díla',
              body: 'Největší zdroj sporů. "Rekonstrukce koupelny" nebo "vývoj webu" nestačí — smlouva musí obsahovat konkrétní specifikaci: co je součástí, jaké materiály, jaký standard provedení, jaké funkce. Čím konkrétnější popis, tím méně prostoru pro spory.',
            },
            {
              n: '2',
              title: 'Chybí termín nebo jsou milníky neurčité',
              body: 'Bez konkrétního termínu dokončení (nebo dílčích milníků) nelze uplatnit smluvní pokutu za prodlení. Formulace "v přiměřené době" nebo "jakmile to bude možné" jsou z hlediska vymahatelnosti bezcenné.',
            },
            {
              n: '3',
              title: 'Žádná smluvní pokuta za prodlení',
              body: 'Bez smluvní pokuty za prodlení s termínem nebo platbou máte jen zákonný nárok na náhradu škody — tedy musíte prokázat, jakou škodu vám prodlení způsobilo. To je v praxi složité a nákladné. Smluvní pokuta je jednodušší a jistější.',
            },
            {
              n: '4',
              title: 'Vícepráce bez písemného souhlasu',
              body: 'Klasická situace: řemeslník udělá víc, než bylo sjednáno, objednatel to ústně odsouhlasí, ale při faktuře odmítá zaplatit. Bez písemného souhlasu (byť e-mailem) jsou vícepráce obtížně vymahatelné.',
            },
            {
              n: '5',
              title: 'Chybí ujednání o vlastnictví výsledku',
              body: 'Zejména u duševního vlastnictví (software, design, grafika) je klíčové sjednat, zda výsledek přechází do vlastnictví objednatele a za jakých podmínek. Bez tohoto ujednání zůstávají autorská práva u zhotovitele.',
            },
            {
              n: '6',
              title: 'Záloha bez zajištění vrácení',
              body: 'Objednatel vyplatí zálohu, zhotovitel nezačne nebo projekt opustí. Bez smluvního ujednání o vrácení zálohy při nesplnění díla se peníze obtížně vracejí. Sjednejte explicitně podmínky vrácení zálohy.',
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
        title="Chcete se těmto chybám vyhnout od začátku?"
        body="Smlouva o dílo na SmlouvaHned obsahuje specifikaci díla, platební milníky, akceptační postup, smluvní pokuty i záruky — ve strukturovaném formuláři, který vás provede každým krokem."
        buttonLabel="Vytvořit smlouvu o dílo"
        href="/smlouva-o-dilo"
      />

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="smlouva-o-dilo-vs-sluzby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Smlouva o dílo vs. smlouva o poskytování služeb</h2>
        <p className="mb-5 text-slate-400 leading-relaxed">
          Rozlišení je prakticky důležité, protože se liší právní režim — zejména nároky z vad,
          záruční lhůty a způsob ukončení.
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="mb-3 text-sm font-black text-amber-400">📐 Smlouva o dílo (§ 2586 OZ)</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">•</span>Závazek k výsledku — konkrétní dílo</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">•</span>Záruka za vady díla (2 roky, stavby 5 let)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">•</span>Právo objednatele na slevu nebo odstoupení při vadách</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">•</span>Cena splatná při převzetí díla</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">•</span>Příklady: rekonstrukce, vývoj webu, zakázková výroba</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/30 p-5">
            <div className="mb-3 text-sm font-black text-slate-300">🔧 Smlouva o poskytování služeb (§ 1746 OZ)</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Závazek k činnosti — ne nutně k výsledku</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Odpovědnost za odborný postup, ne za výsledek</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Cena zpravidla průběžná (měsíčně, hodinově)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Snazší ukončení ze strany objednatele</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Příklady: účetnictví, marketing, konzultace, správa</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed">
          V praxi není vždy snadné typ smlouvy jednoznačně zařadit — záleží na konkrétním obsahu
          závazku. Pokud je výsledek jasně definován (funkční web, hotový byt), jde zpravidla o dílo.
          Pokud jde o průběžné zajišťování určité agendy (správa sociálních sítí, vedení účetnictví), jde zpravidla o služby.
        </p>
      </section>

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí a doporučení</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Smlouva o dílo je základ každé zakázky — ať jde o rekonstrukci koupelny, vývoj aplikace
          nebo výrobu nábytku. Správně sepsaná chrání obě strany; vágní nebo chybějící je zárodkem sporu.
        </p>
        <div className="mb-6 space-y-2">
          {[
            'Popište dílo co nejkonkrétněji — obecné formulace nestačí',
            'Sjednejte termín nebo dílčí milníky s konkrétními daty',
            'Zahrňte smluvní pokuty za prodlení na obou stranách',
            'Vícepráce schvalujte vždy písemně — e-mail stačí',
            'Definujte akceptační postup a co se považuje za přijaté dílo',
            'U díla s autorskými právy sjednejte převod nebo licenci k výsledku',
            'Pro nestandardní zakázky nebo sporné situace konzultujte advokáta',
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
        generatorSuitable="Typické zakázky s jasně definovaným dílem — rekonstrukce, webový projekt, grafické práce, řemeslné práce. Generátor pokryje specifikaci, cenu, termín, akceptaci i záruky."
        lawyerSuitable="Velké stavební zakázky (statisíce až miliony Kč), zákazkový vývoj s komplexními autorskými právy, subdodavatelské řetězce nebo situace kde jedna strana odmítá standardní podmínky."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte smlouvu o dílo online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář pokryje specifikaci díla, cenu, termín, akceptaci, záruky i smluvní pokuty.
          Hotovo za méně než 5 minut, PDF ke stažení ihned po zaplacení.
        </p>
        <Link
          href="/smlouva-o-dilo"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit smlouvu o dílo →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 249 Kč · Dle § 2586 OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ARTICLES ────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/smlouva-o-dilo', label: '📐 Smlouva o dílo — landing page' },
            { href: '/sluzby', label: '🔧 Smlouva o poskytování služeb' },
            { href: '/spoluprace', label: '🤝 Smlouva o spolupráci' },
            { href: '/blog/kupni-smlouva-na-auto-2026', label: '🚗 Kupní smlouva na auto — průvodce' },
            { href: '/', label: '📑 Všechny smlouvy' },
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
