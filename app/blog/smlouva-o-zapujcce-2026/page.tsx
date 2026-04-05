import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Smlouva o zápůjčce 2026: Vzor + nejčastější chyby při půjčce peněz',
  description:
    'Průvodce smlouvou o zápůjčce (půjčce) pro rok 2026. Co musí obsahovat dle § 2390 OZ, jak nastavit úrok, splátkový kalendář, co dělat při nesplacení a proč nestačí SMS.',
  keywords: [
    'smlouva o zápůjčce',
    'smlouva o půjčce vzor 2026',
    'půjčka smlouva',
    'zapůjčka peněz smlouva',
    'co musí obsahovat smlouva o půjčce',
    'smlouva o zápůjčce OZ',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/smlouva-o-zapujcce-2026' },
  openGraph: {
    title: 'Smlouva o zápůjčce 2026: Vzor + nejčastější chyby při půjčce peněz',
    description: 'Zákonné náležitosti zápůjčky, úrok, splátkový kalendář, vymáhání. Dle § 2390 OZ, aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/smlouva-o-zapujcce-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Smlouva o zápůjčce 2026: Vzor + nejčastější chyby při půjčce peněz',
  description: 'Průvodce smlouvou o zápůjčce pro rok 2026. Co musí obsahovat dle § 2390 OZ, jak nastavit úrok, splátkový kalendář a co dělat při nesplacení.',
  url: 'https://smlouvahned.cz/blog/smlouva-o-zapujcce-2026',
  datePublished: '2026-03-28',
  dateModified: '2026-03-28',
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
    { '@type': 'ListItem', position: 3, name: 'Smlouva o zápůjčce 2026: Vzor + nejčastější chyby při půjčce peněz', item: 'https://smlouvahned.cz/blog/smlouva-o-zapujcce-2026' },
  ],
};

export default function SmlouvaOZapujcce2026Page() {
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
        <span className="text-slate-400">Smlouva o zápůjčce 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Osobní a finanční</span>
          <span className="text-xs text-slate-600">8 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-03-28">28. března 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Smlouva o zápůjčce 2026: Vzor a nejčastější chyby při půjčce peněz
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Půjčujete peníze příteli, partnerovi nebo rodině? Bez písemné smlouvy
          riskujete, že dluh nebude nikdy splacen — a přijdete o peníze i vztah.
          Tento průvodce vám ukáže, co zákon vyžaduje a jak se chránit.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Chcete přeskočit teorii?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte si smlouvu o zápůjčce online — formulář vás provede krok za krokem, hotovo za 5 minut.</p>
          <Link
            href="/pujcka"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit smlouvu o zápůjčce →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-zapujcka" className="hover:text-amber-400 transition">1. Co je smlouva o zápůjčce a proč ji potřebujete</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co smlouva musí obsahovat</a></li>
          <li><a href="#urok" className="hover:text-amber-400 transition">3. Úrok — jak ho nastavit správně</a></li>
          <li><a href="#splatky" className="hover:text-amber-400 transition">4. Splátkový kalendář a zajištění dluhu</a></li>
          <li><a href="#nesplaceni" className="hover:text-amber-400 transition">5. Co dělat, když dlužník nezaplatí</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-zapujcka" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je smlouva o zápůjčce a proč ji potřebujete</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Smlouva o zápůjčce je právní dokument, jímž věřitel přenechává dlužníkovi peníze nebo věci určené
          druhově (fungibilní věci) a dlužník se zavazuje vrátit stejné množství ve stejném druhu a kvalitě.
          Řídí se <strong className="text-slate-300">§ 2390 a násl. zákona č. 89/2012 Sb. (OZ)</strong>.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Bez písemné smlouvy vznikají tato rizika:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-red-400">•</span>Dlužník tvrdí, že šlo o dar, ne půjčku</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-red-400">•</span>Věřitel nemůže prokázat výši ani podmínky půjčky</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-red-400">•</span>Bez smlouvy nelze zahájit soudní vymáhání efektivně</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-red-400">•</span>Promlčecí doba bez uznání dluhu je pouze 3 roky</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Půjčka vs. zápůjčka:</strong> Správný právní termín dle OZ je „zápůjčka" (§ 2390).
          Hovorový výraz „půjčka" je v praxi přijatelný, ale v titulku smlouvy doporučujeme použít
          zákonný termín „smlouva o zápůjčce". Právně jde o totéž.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co smlouva musí obsahovat</h2>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace věřitele', d: 'Celé jméno, datum narození nebo rodné číslo, adresa trvalého bydliště. U podnikatelů IČO a sídlo.' },
            { t: 'Identifikace dlužníka', d: 'Stejné údaje jako u věřitele. Oba musí být jednoznačně identifikovatelní.' },
            { t: 'Výše zápůjčky', d: 'Přesná částka v Kč. U věcí: druh, množství a kvalita. Vágní výše (\"přibližně\") způsobuje problémy při vymáhání.' },
            { t: 'Datum poskytnutí', d: 'Kdy věřitel peníze dlužníkovi předá (nebo kdy mu je přepošle na účet). Od tohoto data zpravidla běží úrok.' },
            { t: 'Datum splatnosti', d: 'Kdy dlužník peníze vrátí. Může být jednorázové nebo ve splátkách (splátkový kalendář jako příloha).' },
            { t: 'Způsob vrácení', d: 'Hotovost nebo bankovní převod. Pokud převodem, uveďte číslo účtu věřitele.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-3 text-lg font-black text-white">Doporučená ujednání navíc</h3>
        <ul className="mb-4 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">✓</span><span><strong className="text-slate-300">Smluvní pokuta za prodlení</strong> — jinak máte nárok pouze na zákonný úrok z prodlení</span></li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">✓</span><span><strong className="text-slate-300">Rozhodčí nebo soudní doložka</strong> — jak se řeší spory</span></li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">✓</span><span><strong className="text-slate-300">Uznání závazku</strong> — dlužník výslovně potvrdí, že dluh existuje a ve výše uvedené výši</span></li>
        </ul>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/pujcka" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit smlouvu o zápůjčce se splátkovým kalendářem online →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="urok" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Úrok — jak ho nastavit správně</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zápůjčka může být bezúročná nebo úročená. Zákon výši úroku neomezuje pevnou hranicí,
          ale extrémní úroky jsou v rozporu s dobrými mravy a soud je může snížit.
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Bezúročná zápůjčka</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pokud smlouva úrok nezmiňuje, je zápůjčka bezúročná. Dlužník vrací pouze jistinu.
              U zápůjček příbuzným nebo blízkým osobám je bezúročnost běžná — nevzniká tím žádný zdanitelný příjem.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Sjednaný úrok</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Úrok se sjednává jako roční procentní sazba (p.a.) — např. 5 % p.a. Nad 20 % p.a. hrozí
              napadení smlouvy jako lichevní. Praxi soudy posuzují případ od případu, ale přiměřenost
              se odvíjí od průměrných bankovních sazeb (v ČR cca 5–8 % p.a. pro spotřebitelské úvěry).
            </p>
            <div className="text-xs text-slate-500">
              Příklad: půjčka 100 000 Kč na 1 rok při 6 % p.a. = úrok 6 000 Kč, dlužník vrátí 106 000 Kč.
            </div>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Daňové aspekty úroku</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Přijatý úrok je příjmem věřitele a musí být zahrnut do daňového přiznání. Bezúročná zápůjčka
              příbuznému (přímá linie, manžel) je od daně osvobozena. U dalších osob záleží na výši
              a okolnostech — doporučujeme ověřit s daňovým poradcem.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="splatky" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Splátkový kalendář a zajištění dluhu</h2>

        <h3 className="mb-3 text-lg font-black text-white">Splátkový kalendář</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          U půjček nad 20 000 Kč nebo u půjček na delší dobu je vhodné sjednat splátkový kalendář.
          Kalendář může být součástí smlouvy nebo přílohou. Obsahuje:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Datum každé splátky</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Výši splátky (jistina + úrok zvlášť nebo dohromady)</li>
          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-amber-500">•</span>Zbývající dluh po každé splátce</li>
        </ul>

        <h3 className="mb-3 text-lg font-black text-white">Zajištění dluhu</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Pro vyšší půjčky je vhodné dluh zajistit. Možnosti:
        </p>
        <ul className="mb-4 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
            <div><strong className="text-slate-300">Zástavní právo k věci</strong> — dlužník ručí konkrétní věcí (auto, šperky). Zástavní právo musí být zapsáno v registru (u vozidel v CRV).</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
            <div><strong className="text-slate-300">Ručení třetí osoby</strong> — ručitel se zavazuje splnit dluh, pokud dlužník nesplatí. Smlouva o ručení musí být písemná.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
            <div><strong className="text-slate-300">Notářský zápis s doložkou vykonatelnosti</strong> — dlužník souhlasí s přímou exekucí bez soudního řízení. Nejsilnější forma zajištění.</div>
          </li>
        </ul>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="nesplaceni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Co dělat, když dlužník nezaplatí</h2>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white flex items-center gap-2"><span className="text-amber-400">1.</span> Výzva k úhradě</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Zašlete písemnou výzvu k úhradě (e-mailem s potvrzením přijetí nebo doporučeně poštou).
              Uveďte výši dluhu, číslo smlouvy, datum splatnosti a lhůtu k úhradě (typicky 15–30 dnů).
              Bez výzvy nelze přistoupit k vymáhání.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white flex items-center gap-2"><span className="text-amber-400">2.</span> Uznání dluhu</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pokud hrozí promlčení (3 roky od splatnosti), požádejte dlužníka o podpis uznání dluhu
              (§ 2053 OZ). Uznání prodlouží promlčecí dobu na 10 let od uznání.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white flex items-center gap-2"><span className="text-amber-400">3.</span> Soudní vymáhání</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              U nižších částek (do 50 000 Kč) lze podat návrh na vydání platebního rozkazu — soud
              rozhodne bez jednání. Platební rozkaz se stane podkladem pro exekuci, pokud dlužník
              nepodá odpor do 15 dnů od doručení.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Promlčení:</strong> Pohledávka ze zápůjčky se promlčuje za 3 roky od splatnosti (§ 629 OZ).
          Po promlčení nemůžete dluh soudně vymáhat — dlužník může promlčení namítnout a soud žalobu zamítne.
          Proto je důležité jednat včas nebo si zajistit uznání dluhu.
        </div>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Pouze ústní dohoda nebo SMS', body: 'Věřitel půjčí na základě ústní dohody nebo textové zprávy. Dlužník pak tvrdí, že šlo o dar. Bez písemné smlouvy s podpisy je vymáhání extrémně obtížné — i pokud máte SMS jako důkaz, soud posuzuje jeho věrohodnost.' },
            { n: '2', title: 'Neurčená splatnost', body: 'Smlouva říká „dlužník vrátí, jak to půjde" nebo „do konce roku" bez konkrétního data. Bez přesného data splatnosti nelze počítat promlčecí dobu ani uplatnit smluvní pokutu za prodlení.' },
            { n: '3', title: 'Chybějící uznání závazku', body: 'Věřitel půjčí peníze bez písemné smlouvy a spoléhá na dobrou vůli dlužníka. Tři roky po splatnosti se dluh promlčí a věřitel přichází o možnost vymáhání. Řešení: uzavřete smlouvu nebo si alespoň nechte podepsat uznání dluhu.' },
            { n: '4', title: 'Příliš vysoký úrok', body: 'Věřitel sjedná úrok 30–50 % p.a. Soud může takový úrok snížit jako rozporný s dobrými mravy nebo označit smlouvu za lichevní. Přiměřený úrok v roce 2026 je orientačně do 15 % p.a. pro soukromé půjčky.' },
            { n: '5', title: 'Platba v hotovosti bez dokladu', body: 'Věřitel předá peníze v hotovosti a ve smlouvě je pouze „dlužník přijal peníze". Po sporech dlužník tvrdí, že peníze nedostal. Potvrďte předání peněz podpisem v den předání nebo proveďte převod na účet, který slouží jako důkaz.' },
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
        body="Smlouva o zápůjčce na SmlouvaHned pokryje výši dluhu, splatnost, úrok, splátkový kalendář a uznání závazku. Formulář vás provede, PDF stáhnete ihned."
        buttonLabel="Vytvořit smlouvu o zápůjčce"
        href="/pujcka"
      />

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí</h2>
        <div className="mb-6 space-y-2">
          {[
            'Vždy uzavírejte písemnou smlouvu — ústní dohoda nebo SMS není dostatečná',
            'Uveďte přesnou výši, datum poskytnutí a datum splatnosti',
            'Úrok nastavte přiměřeně (do 15 % p.a.) — extrémní úroky soud může snížit',
            'Pro vyšší částky použijte splátkový kalendář a zvažte zajištění (ručení, zástavní právo)',
            'Pokud dlužník nezaplatí, jednejte do 3 let od splatnosti — jinak se dluh promlčí',
            'Notářský zápis s doložkou vykonatelnosti umožní přímou exekuci bez soudu',
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
        generatorSuitable="Zápůjčka peněz mezi fyzickými osobami nebo podnikateli — bezúročná nebo úročená, jednorázová nebo splátkový kalendář. Generátor pokryje výši, splatnost, úrok a uznání závazku."
        lawyerSuitable="Zápůjčky nad 500 000 Kč, zajištění zástavním právem k nemovitosti, notářský zápis s doložkou vykonatelnosti, nebo situace, kdy dlužník odmítá platit a je třeba soudní vymáhání."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte smlouvu o zápůjčce online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí smlouvy. Hotovo za méně než 5 minut, PDF ke stažení ihned.
        </p>
        <Link
          href="/pujcka"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit smlouvu o zápůjčce →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 249 Kč · Dle § 2390 OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/pujcka-smlouva', label: '💰 Smlouva o zápůjčce — přehled' },
            { href: '/uznani-dluhu-vzor', label: '⚖️ Uznání dluhu' },
            { href: '/blog/darovaci-smlouva-2026', label: '🎁 Darovací smlouva' },
            { href: '/blog/nda-smlouva-mlcenlivost', label: '🔒 NDA smlouva' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
