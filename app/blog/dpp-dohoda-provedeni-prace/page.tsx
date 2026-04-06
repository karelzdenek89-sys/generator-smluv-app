import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'DPP dohoda o provedení práce 2026: Limity, odvody a jak ji správně napsat',
  description:
    'Průvodce dohodou o provedení práce pro rok 2026. Limit 300 hodin ročně, srážková daň do 11 500 Kč, zdravotní pojištění, povinné náležitosti a nejčastější chyby zaměstnavatelů.',
  keywords: [
    'DPP dohoda o provedení práce',
    'dohoda o provedení práce vzor 2026',
    'DPP limit hodin',
    'DPP odvody',
    'DPP srážková daň',
    'dohoda o provedení práce chyby',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/dpp-dohoda-provedeni-prace' },
  openGraph: {
    title: 'DPP dohoda o provedení práce 2026: Limity, odvody a jak ji správně napsat',
    description: 'Limit 300 hodin, srážková daň, zdravotní pojištění a nejčastější chyby. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/dpp-dohoda-provedeni-prace',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'DPP dohoda o provedení práce 2026: Limity, odvody a jak ji správně napsat',
  description:
    'Průvodce dohodou o provedení práce pro rok 2026. Limit 300 hodin ročně, srážková daň, zdravotní pojištění, povinné náležitosti a nejčastější chyby.',
  url: 'https://smlouvahned.cz/blog/dpp-dohoda-provedeni-prace',
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
    { '@type': 'ListItem', position: 3, name: 'DPP dohoda o provedení práce 2026: Limity, odvody a jak ji správně napsat', item: 'https://smlouvahned.cz/blog/dpp-dohoda-provedeni-prace' },
  ],
};

export default function DppPage() {
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
        <span className="text-slate-400">DPP dohoda o provedení práce 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Práce a zaměstnání</span>
          <span className="text-xs text-slate-600">9 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-02">2. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          DPP dohoda o provedení práce 2026: Limity, odvody a jak ji správně napsat
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Dohoda o provedení práce je nejoblíbenější forma brigády a přivýdělku — ale skrývá řadu pastí.
          Změny od roku 2024 přinesly nová pravidla pro zdravotní pojištění a oznamovací povinnosti.
          Přečtěte si, jak DPP napsat správně, aby vás nepřekvapila pokuta z kontroly.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Potřebujete DPP hned?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte dohodu o provedení práce online — s výpočtem hodinové odměny, správným vymezením práce a všemi povinnostmi zaměstnavatele. PDF ihned.</p>
          <Link
            href="/dpp"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit DPP →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-dpp" className="hover:text-amber-400 transition">1. Co je DPP a kdy ji použít</a></li>
          <li><a href="#limit-hodin" className="hover:text-amber-400 transition">2. Limit 300 hodin ročně — jak se počítá</a></li>
          <li><a href="#odvody-dane" className="hover:text-amber-400 transition">3. Odvody a daně v roce 2026</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">4. Co musí DPP obsahovat</a></li>
          <li><a href="#povinnosti-zamestnavatele" className="hover:text-amber-400 transition">5. Povinnosti zaměstnavatele</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-dpp" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je DPP a kdy ji použít</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Dohoda o provedení práce (DPP) je pracovněprávní vztah upravený § 75 zákoníku práce. Na rozdíl
          od pracovní smlouvy nebo dohody o pracovní činnosti (DPČ) je administrativně nejlehčí — ale
          platí pro ni přísný limit hodin a specifická pravidla pro odvody.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {[
            { t: 'Brigádník', d: 'Student nebo důchodce na pravidelné brigádě do 300 hodin ročně u jednoho zaměstnavatele.' },
            { t: 'Jednorázová práce', d: 'Překlad dokumentu, grafický návrh, oprava webu — konkrétní výstup za sjednanou odměnu.' },
            { t: 'Sezónní výpomoc', d: 'Výpomoc v sezóně, na akci nebo projektu bez nutnosti zakládat živnost nebo s.r.o.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 DPP vs. DPČ:</strong> Dohoda o pracovní činnosti (DPČ) nemá limit hodin, ale odvody jsou
          povinné od nižšího výdělku. DPP je výhodnější pro kratší spolupráci s výdělkem pod rozhodnou hranicí.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="limit-hodin" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Limit 300 hodin ročně — jak se počítá</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zákoník práce stanovuje, že u jednoho zaměstnavatele lze na DPP odpracovat nejvýše
          <strong className="text-white"> 300 hodin ročně</strong> (v rámci kalendářního roku 1. 1. — 31. 12.).
          Limit se počítá za každého zaměstnavatele zvlášť — u dvou zaměstnavatelů tak lze mít celkem 600 hodin.
        </p>

        <div className="mb-5 space-y-3">
          {[
            { label: 'Do limitu se počítají', text: 'Všechny hodiny odpracované u daného zaměstnavatele v kalendářním roce, bez ohledu na počet uzavřených DPP.' },
            { label: 'Překročení limitu', text: 'Pokud zaměstnanec překročí 300 hodin, musí zaměstnavatel přejít na DPČ nebo pracovní smlouvu — případně hrozí sankce z kontroly inspektorátu práce.' },
            { label: 'Více DPP u jednoho zaměstnavatele', text: 'Nelze obejít limit uzavřením více DPP na různé práce u téhož zaměstnavatele — hodiny se sčítají.' },
          ].map(i => (
            <div key={i.label} className="flex gap-4 rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mt-0.5 flex-shrink-0 text-amber-400 font-bold text-sm">→</div>
              <div>
                <div className="mb-1 text-sm font-black text-white">{i.label}</div>
                <p className="text-sm text-slate-400 leading-relaxed">{i.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="odvody-dane" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Odvody a daně v roce 2026</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Daňový a odvodový režim DPP závisí na výši měsíční odměny. Klíčová hranice pro rok 2026:
        </p>

        <div className="mb-6 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="px-4 py-3 text-left font-black text-white">Měsíční odměna</th>
                <th className="px-4 py-3 text-left font-black text-white">Daň</th>
                <th className="px-4 py-3 text-left font-black text-white">SP + ZP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="bg-emerald-500/5">
                <td className="px-4 py-3 text-slate-300">Do 11 500 Kč</td>
                <td className="px-4 py-3 text-emerald-400">Srážková 15 % (bez podpisu prohlášení)</td>
                <td className="px-4 py-3 text-emerald-400">Bez odvodů</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-300">Do 11 500 Kč (s prohlášením)</td>
                <td className="px-4 py-3 text-slate-400">Zálohová 15 % — sleva na poplatníka</td>
                <td className="px-4 py-3 text-emerald-400">Bez odvodů</td>
              </tr>
              <tr className="bg-red-500/5">
                <td className="px-4 py-3 text-slate-300">Nad 11 500 Kč</td>
                <td className="px-4 py-3 text-slate-400">Zálohová 15–23 %</td>
                <td className="px-4 py-3 text-red-400">SP + ZP povinné</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠️ Upozornění:</strong> Hranice 11 500 Kč je pro rok 2026 — každoročně se může měnit (váže se
          na čtvrtinu průměrné mzdy). Vždy ověřte aktuální hranici na webu MPSV nebo daňového portálu.
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Co musí DPP obsahovat</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zákoník práce (§ 75) stanoví minimální náležitosti DPP. Smlouva musí být uzavřena písemně
          a obsahovat:
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Jméno, příjmení, datum narození, adresa zaměstnance. Název, sídlo, IČO, zastoupení zaměstnavatele.' },
            { t: 'Vymezení práce', d: 'Co přesně zaměstnanec dělá — druh práce, výstup nebo rozsah. Čím konkrétnější, tím lépe pro obě strany.' },
            { t: 'Rozsah práce (hodiny)', d: 'Sjednaný nebo odhadovaný rozsah hodin. Nutné sledovat, aby nebyl překročen limit 300 hodin.' },
            { t: 'Doba, na kterou se uzavírá', d: 'DPP lze uzavřít na dobu určitou (konkrétní projekt) nebo neurčitou s možností výpovědi.' },
            { t: 'Odměna za práci', d: 'Minimálně ve výši minimální mzdy za hodinu (pro 2026: 20,80 Kč/hod). Způsob výplaty.' },
            { t: 'BOZP prohlášení', d: 'Poučení o bezpečnosti a ochraně zdraví při práci — nutné před zahájením práce.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/dpp" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit DPP se všemi náležitostmi dle zákoníku práce →
          </Link>
        </div>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="povinnosti-zamestnavatele" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Povinnosti zaměstnavatele</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Uzavření DPP s sebou nese administrativní povinnosti, které mnozí zaměstnavatelé podceňují:
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Oznámení na ČSSZ</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Od roku 2024 je zaměstnavatel povinen hlásit nástup každého zaměstnance na DPP na ČSSZ
              (ePortál ČSSZ), a to nejpozději v den nástupu. Platí i pro DPP pod 11 500 Kč, kde se
              odvody neplatí. Sankce za nesplnění: až 100 000 Kč.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Evidence pracovní doby</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Zaměstnavatel musí vést evidenci odpracovaných hodin u každého zaměstnance na DPP.
              Slouží k doložení dodržení limitu 300 hodin a ke správnému výpočtu odměny.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Výplatní páska a zúčtovací list</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Zaměstnavatel je povinen vydat zaměstnanci písemný doklad o výplatě (zúčtovací list)
              za každý kalendářní měsíc, ve kterém byla odměna vyplacena.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Potvrzení o zaměstnání (Zápočtový list)</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Při skončení DPP je zaměstnavatel povinen vydat potvrzení o zaměstnání (§ 313 ZP),
              i když se jedná „pouze" o brigádu na dohodu.
            </p>
          </div>
        </div>
      </section>

      {/* ── MID CTA ─────────────────────────────── */}
      <ArticleInlineCta
        title="Nechcete zapomenout na žádnou povinnost?"
        body="Formulář na SmlouvaHned pokrývá všechny zákonné náležitosti DPP — vymezení práce, hodinový rozsah, odměnu i BOZP prohlášení. Připraveno dle zákoníku práce 2026."
        buttonLabel="Vytvořit DPP"
        href="/dpp"
      />

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Neoznámení na ČSSZ', body: 'Od roku 2024 je povinné nahlásit každého zaměstnance na DPP na ČSSZ nejpozději v den nástupu — i u brigád pod hranici odvodů. Mnoho zaměstnavatelů tuto povinnost stále nezná. Pokuta může dosáhnout 100 000 Kč.' },
            { n: '2', title: 'Překročení limitu 300 hodin', body: 'Zaměstnavatel nevede evidenci hodin a zjistí překročení limitu až při kontrole z inspektorátu práce. Řešení: pravidelně sledovat hodiny a v případě delší spolupráce přejít včas na DPČ.' },
            { n: '3', title: 'Příliš vágní vymezení práce', body: 'DPP říká pouze „pomocné práce" nebo „administrativa". Inspektorát může takovou smlouvu považovat za zastřený pracovní poměr (tzv. švarcsystém), pokud zaměstnanec fakticky vykonává práci jako zaměstnanec.' },
            { n: '4', title: 'Odměna pod minimální mzdou', body: 'Hodinová odměna na DPP musí odpovídat alespoň minimální mzdě (pro 2026: 20,80 Kč/hod). Nižší odměna je protiprávní a může být základem pro doplatek i penále.' },
            { n: '5', title: 'Ústní DPP', body: 'Zákoník práce vyžaduje písemnou formu. Ústní dohoda je neplatná — v případě sporu neexistuje důkaz o podmínkách práce ani o výši odměny.' },
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
            'DPP lze uzavřít na max. 300 hodin ročně u jednoho zaměstnavatele — sledujte evidenci',
            'Od roku 2024: každý zaměstnanec na DPP musí být nahlášen na ČSSZ nejpozději v den nástupu',
            'Bez odvodů: odměna do 11 500 Kč/měsíc (srážková daň 15 % bez podpisu prohlášení)',
            'Smlouva musí být písemná a obsahovat vymezení práce, rozsah hodin a odměnu',
            'Hodinová odměna nesmí klesnout pod minimální mzdu (2026: 20,80 Kč/hod)',
            'Při skončení vydejte zaměstnanci potvrzení o zaměstnání (zápočtový list)',
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
        generatorSuitable="DPP pro brigádníky, studenty, přivýdělek nebo jednorázové práce. Pokrývá vymezení práce, hodinový rozsah, odměnu a BOZP prohlášení dle zákoníku práce 2026."
        lawyerSuitable="Opakovaná spolupráce se stejným člověkem, kde hrozí posouzení jako zastřený pracovní poměr (švarcsystém). Situace s převzetím zahraničního zaměstnance nebo práce vyžadující zvláštní oprávnění."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte DPP online za 5 minut</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí dohody — od vymezení práce po odměnu a BOZP. PDF ke stažení ihned.
        </p>
        <Link
          href="/dpp"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit DPP →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Dle ZP · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/dohoda-o-provedeni-prace', label: '📄 DPP — přehled' },
            { href: '/blog/pracovni-smlouva-2026', label: '👔 Pracovní smlouva' },
            { href: '/pracovni-smlouva', label: '📋 Průvodce pracovní smlouvou' },
            { href: '/blog/smlouva-o-dilo-2026', label: '🔨 Smlouva o dílo' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
