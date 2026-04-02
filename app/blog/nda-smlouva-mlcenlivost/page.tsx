import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'NDA smlouva o mlčenlivosti 2026: Co musí obsahovat a nejčastější chyby',
  description:
    'Průvodce NDA smlouvou o mlčenlivosti pro rok 2026. Co chrání NDA, jak vymezit důvěrné informace, smluvní pokuta, jednostranná vs. vzájemná NDA a nejčastější chyby.',
  keywords: [
    'NDA smlouva',
    'smlouva o mlčenlivosti',
    'NDA vzor 2026',
    'co chrání NDA',
    'smlouva o mlčenlivosti chyby',
    'NDA obchodní tajemství',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/nda-smlouva-mlcenlivost' },
  openGraph: {
    title: 'NDA smlouva o mlčenlivosti 2026: Co musí obsahovat a nejčastější chyby',
    description: 'Co chrání NDA, jak vymezit důvěrné informace, smluvní pokuta a nejčastější chyby. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/nda-smlouva-mlcenlivost',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'NDA smlouva o mlčenlivosti 2026: Co musí obsahovat a nejčastější chyby',
  description: 'Průvodce NDA smlouvou pro rok 2026. Co chrání NDA, jak vymezit důvěrné informace, smluvní pokuta, jednostranná vs. vzájemná NDA a nejčastější chyby.',
  url: 'https://smlouvahned.cz/blog/nda-smlouva-mlcenlivost',
  datePublished: '2026-04-01',
  dateModified: '2026-04-01',
  author: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  publisher: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    logo: { '@type': 'ImageObject', url: 'https://smlouvahned.cz/og-image.png' },
  },
  image: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
};

export default function NdaSmlouvaPage() {
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
        <span className="text-slate-400">NDA smlouva o mlčenlivosti 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Podnikatelé a OSVČ</span>
          <span className="text-xs text-slate-600">8 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-01">1. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          NDA smlouva o mlčenlivosti 2026: Co musí obsahovat a nejčastější chyby
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Sdílíte obchodní tajemství, zákaznické databáze nebo know-how s partnerem, dodavatelem nebo
          zaměstnancem? Bez NDA smlouvy nemáte právní ochranu. Tento průvodce vám ukáže, co má NDA
          obsahovat a jak se vyhnout chybám, pro které jsou NDA smlouvy nevymahatelné.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Chcete přeskočit teorii?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte si NDA smlouvu online — jednostrannou nebo vzájemnou, s vymezením rozsahu. PDF ihned.</p>
          <Link
            href="/nda"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit NDA smlouvu →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-chrani-nda" className="hover:text-amber-400 transition">1. Co NDA chrání — a co nechrání</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co musí NDA obsahovat</a></li>
          <li><a href="#jednostranna-vzajemna" className="hover:text-amber-400 transition">3. Jednostranná vs. vzájemná NDA</a></li>
          <li><a href="#trvani" className="hover:text-amber-400 transition">4. Jak dlouho NDA trvá</a></li>
          <li><a href="#sankce" className="hover:text-amber-400 transition">5. Sankce za porušení NDA</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-chrani-nda" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co NDA chrání — a co nechrání</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          NDA (Non-Disclosure Agreement, česky smlouva o mlčenlivosti) je smluvní nástroj pro ochranu
          informací, které nechcete, aby se dostaly ke konkurenci nebo na veřejnost. V českém prostředí
          se řídí obecnými pravidly smluvního práva (§ 1746 OZ) a zákonem o ochraně obchodního tajemství.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-3 text-sm font-black text-emerald-400">✓ Co NDA chrání</div>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">•</span>Obchodní tajemství a know-how</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">•</span>Zákaznické a kontaktní databáze</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">•</span>Finanční údaje, marže, cenové kalkulace</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">•</span>Zdrojový kód a technické specifikace</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">•</span>Obchodní strategie a plány</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-emerald-400">•</span>Výsledky výzkumu a vývoje</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
            <div className="mb-3 text-sm font-black text-red-400">✗ Co NDA nechrání</div>
            <ul className="space-y-1.5 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Veřejně dostupné informace</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Informace, které druhá strana znala před NDA</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Informace získané legálně od třetí strany</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Informace zveřejněné se souhlasem poskytovatele</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Informace, jejichž zveřejnění nařídí zákon nebo soud</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Poznámka:</strong> NDA nenahrazuje ochranu autorskými právy ani ochranu softwaru.
          Pokud sdílíte software nebo umělecká díla, zvažte i licenční smlouvu vedle NDA.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí NDA obsahovat</h2>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Poskytovatel důvěrných informací a příjemce. U firem: název, sídlo, IČO, zastoupení (kdo podepisuje).' },
            { t: 'Definice důvěrných informací', d: 'Nejkritičtější část NDA — přesně vymezuje, co je a co není chráněno. Vágní definice snižuje vymahatelnost.' },
            { t: 'Účel sdílení informací', d: 'Za jakým účelem jsou informace sdíleny — jednání o spolupráci, due diligence, vývoj produktu. Tím se omezí možnost zneužití pro jiné účely.' },
            { t: 'Povinnosti příjemce', d: 'Co příjemce nesmí dělat — sdílet s třetími stranami, kopírovat, používat pro jiné účely. Čím konkrétnější, tím lépe.' },
            { t: 'Doba trvání', d: 'Jak dlouho trvá povinnost mlčenlivosti — typicky 2–5 let po ukončení spolupráce. Možná i na dobu neurčitou.' },
            { t: 'Sankce za porušení', d: 'Smluvní pokuta za každé porušení nebo za celkové porušení smlouvy. Bez sankce je vymáhání složitější.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/nda" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit NDA smlouvu s přesnou definicí důvěrných informací →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="jednostranna-vzajemna" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Jednostranná vs. vzájemná NDA</h2>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-white">Jednostranná NDA</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Chrání informace pouze jedné strany. Typicky: firma sdílí informace s dodavatelem,
              konzultantem nebo potenciálním partnerem. Povinnost mlčenlivosti dopadá jen na příjemce.
            </p>
            <div className="text-xs text-slate-500">Vhodná pro: zaměstnanecké smlouvy, oslovení dodavatele, demo produktu investorovi</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-white">Vzájemná NDA</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Obě strany sdílejí důvěrné informace a obě se zavazují k mlčenlivosti. Typicky: M&A
              jednání, joint venture, výzkumná spolupráce, obchodní partnerství.
            </p>
            <div className="text-xs text-slate-500">Vhodná pro: partnerská jednání, co-development, oboustranné sdílení dat</div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="trvani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak dlouho NDA trvá</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Délku trvání mlčenlivosti si strany sjednají ve smlouvě. Existují dvě základní varianty:
        </p>

        <ul className="mb-5 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
            <div>
              <strong className="text-slate-300">Pevná doba</strong> (nejběžnější) — mlčenlivost trvá X let od podpisu nebo od ukončení spolupráce.
              Typicky 2–5 let. Po uplynutí doby zanikají povinnosti ze smlouvy.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
            <div>
              <strong className="text-slate-300">Na dobu neurčitou</strong> — mlčenlivost trvá po celou dobu existence informací jako obchodního tajemství.
              Obtížněji vymahatelná — soudy někdy posuzují takovou povinnost jako nepřiměřenou.
              Vhodná pro výjimečně citlivé informace (recepty, klíčový know-how).
            </div>
          </li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Doporučení:</strong> Pro standardní obchodní spolupráci sjednejte 3–5 let po ukončení spolupráce.
          Delší doba zvyšuje riziko napadení jako nepřiměřené omezení obchodní soutěže.
        </div>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="sankce" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Sankce za porušení NDA</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          NDA bez sankce je prázdný papír. Pokud příjemce poruší mlčenlivost a smlouva neobsahuje
          smluvní pokutu, musíte prokazovat konkrétní škodu — což je v praxi extrémně obtížné.
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Smluvní pokuta za porušení</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pevně stanovená částka za každé porušení (např. 50 000 Kč za každý prokázaný případ
              sdílení) nebo paušální pokuta za celkové porušení smlouvy. Smluvní pokuta je vymahatelná
              bez prokazování výše škody — stačí prokázat porušení samotné.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Náhrada škody</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vedle nebo místo smluvní pokuty lze požadovat náhradu skutečné škody a ušlého zisku.
              Nevýhoda: musíte prokázat, že ke škodě skutečně došlo a v jaké výši. U úniku informací
              ke konkurenci je to velmi obtížné.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Předběžné opatření</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pokud hrozí bezprostřední zveřejnění, lze se obrátit na soud s žádostí o předběžné
              opatření — zakázat zveřejnění nebo šíření informací, dokud nebude věc rozhodnuta.
              Vyžaduje rychlé jednání (hodiny až dny).
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Příliš vágní definice důvěrných informací', body: 'NDA říká „veškeré informace sdílené v rámci spolupráce jsou důvěrné". Příjemce pak tvrdí, že nevěděl, které konkrétní informace chrání. Definice musí být co nejpřesnější — kategorie informací, označení dokumentů, způsob sdělení.' },
            { n: '2', title: 'Žádná smluvní pokuta', body: 'NDA zakazuje sdílení informací, ale neobsahuje sankci. Pokud příjemce poruší NDA, musíte prokazovat konkrétní finanční škodu — což je u úniku know-how téměř nemožné. Vždy sjednejte smluvní pokutu.' },
            { n: '3', title: 'Podpis NDA až po sdílení informací', body: 'Firmy si NDA posílají e-mailem a mezitím probíhá schůzka, kde sdílejí citlivé informace. NDA chrání jen informace sdílené po jejím podpisu. Informace sdílené před podpisem nejsou pokryty.' },
            { n: '4', title: 'NDA bez definice výjimek', body: 'Smlouva nezahrnuje standardní výjimky (veřejné informace, informace získané legálně od třetí strany). Příjemce pak může namítat, že konkrétní informace byly veřejně dostupné ještě před podpisem NDA — bez výjimek je pozice poskytovatele oslabena.' },
            { n: '5', title: 'Nepřiměřeně dlouhá nebo věčná mlčenlivost', body: 'NDA sjednána na dobu neurčitou nebo na 20 let. Soud může takovou dobu považovat za nepřiměřené omezení a smlouvu (nebo toto ujednání) neuznat. Pro běžnou spolupráci stačí 3–5 let po skončení.' },
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
        body="NDA smlouva na SmlouvaHned obsahuje přesnou definici důvěrných informací, výjimky, dobu trvání a smluvní pokutu. Jednostranná nebo vzájemná — formulář vás provede."
        buttonLabel="Vytvořit NDA smlouvu"
        href="/nda"
      />

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí</h2>
        <div className="mb-6 space-y-2">
          {[
            'Definice důvěrných informací musí být přesná — vágní definice snižuje vymahatelnost',
            'Vždy sjednejte smluvní pokutu za porušení — bez ní je vymáhání extrémně obtížné',
            'NDA podepište před jakýmkoli sdílením citlivých informací — ne po',
            'Zahrňte standardní výjimky (veřejné info, info od třetích stran)',
            'Sjednejte reálnou dobu — 3–5 let po ukončení spolupráce je standard',
            'Pro M&A, investiční jednání nebo sdílení klíčového know-how doporučujeme advokáta',
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
        generatorSuitable="NDA pro běžnou obchodní spolupráci, freelancery, dodavatele nebo zaměstnance. Pokrývá definici důvěrných informací, povinnosti příjemce, dobu trvání a smluvní pokutu."
        lawyerSuitable="M&A procesy a due diligence, mezinárodní NDA se zahraniční stranou, sdílení výzkumných dat nebo klíčového technologického know-how, nebo probíhající spory z porušení NDA."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte NDA smlouvu online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí smlouvy. Hotovo za méně než 5 minut, PDF ke stažení ihned.
        </p>
        <Link
          href="/nda"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit NDA smlouvu →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 249 Kč · Dle OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/nda-smlouva', label: '🔒 NDA smlouva — přehled' },
            { href: '/blog/smlouva-o-dilo-2026', label: '🔨 Smlouva o dílo' },
            { href: '/blog/pracovni-smlouva-2026', label: '👔 Pracovní smlouva' },
            { href: '/smlouva-o-spolupraci', label: '🤝 Smlouva o spolupráci' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
