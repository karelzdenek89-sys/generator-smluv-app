import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Smlouva o spolupráci OSVČ 2026: Co musí obsahovat a jak se chránit',
  description:
    'Průvodce smlouvou o spolupráci pro OSVČ a freelancery. Povinné náležitosti, vymezení předmětu spolupráce, honorář, autorská práva, mlčenlivost a jak se chránit před švarcsystémem.',
  keywords: [
    'smlouva o spolupráci OSVČ',
    'smlouva o spolupráci vzor 2026',
    'freelancer smlouva',
    'smlouva o spolupráci náležitosti',
    'švarcsystém smlouva',
    'smlouva o spolupráci autorská práva',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/smlouva-o-spolupraci-2026' },
  openGraph: {
    title: 'Smlouva o spolupráci OSVČ 2026: Co musí obsahovat a jak se chránit',
    description: 'Povinné náležitosti, honorář, autorská práva, mlčenlivost a ochrana před švarcsystémem. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/smlouva-o-spolupraci-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Smlouva o spolupráci OSVČ 2026: Co musí obsahovat a jak se chránit',
  description:
    'Povinné náležitosti smlouvy o spolupráci pro OSVČ — vymezení předmětu, honorář, autorská práva, mlčenlivost a jak se chránit před švarcsystémem.',
  url: 'https://smlouvahned.cz/blog/smlouva-o-spolupraci-2026',
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
    { '@type': 'ListItem', position: 3, name: 'Smlouva o spolupráci OSVČ 2026: Co musí obsahovat a jak se chránit', item: 'https://smlouvahned.cz/blog/smlouva-o-spolupraci-2026' },
  ],
};

export default function SmlouvaOSpolupraci2026Page() {
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
        <span className="text-slate-400">Smlouva o spolupráci OSVČ 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Podnikání a OSVČ</span>
          <span className="text-xs text-slate-600">9 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-02">2. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Smlouva o spolupráci OSVČ 2026: Co musí obsahovat a jak se chránit
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Pracujete jako freelancer nebo OSVČ a fakturujete klientům? Ústní dohoda nestačí.
          Smlouva o spolupráci chrání váš honorář, autorská práva i dobré jméno — a odděluje vás
          od zaměstnaneckého vztahu, který by mohl přilákat pozornost inspektorátu práce.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Potřebujete smlouvu o spolupráci?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte smlouvu o spolupráci online — s vymezením předmětu, honorářem, autorskými právy a mlčenlivostí. PDF ihned.</p>
          <Link
            href="/spoluprace"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit smlouvu o spolupráci →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-smlouva-o-spolupraci" className="hover:text-amber-400 transition">1. Co je smlouva o spolupráci a kdy ji použít</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co musí smlouva obsahovat</a></li>
          <li><a href="#honorar-platby" className="hover:text-amber-400 transition">3. Honorář a platební podmínky</a></li>
          <li><a href="#autorska-prava" className="hover:text-amber-400 transition">4. Autorská práva a výstupy spolupráce</a></li>
          <li><a href="#svarcsystem" className="hover:text-amber-400 transition">5. Švarcsystém — jak se chránit</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-smlouva-o-spolupraci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je smlouva o spolupráci a kdy ji použít</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Smlouva o spolupráci (nebo také rámcová smlouva o poskytování služeb) je smluvní typ
          uzavíraný dle § 1746 odst. 2 občanského zákoníku jako tzv. inominátní (nepojmenovaná) smlouva.
          Není tedy upravena zvláštním zákonným ustanovením — obsah si strany sjednají dle potřeby.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Typicky ji uzavírají OSVČ, freelanceři, konzultanti nebo agentury s klienty při opakované
          nebo projektové spolupráci. Hodí se všude tam, kde vztah není jednorázový (na to slouží
          smlouva o dílo) a zároveň jde o obchodní vztah mezi dvěma podnikateli — ne zaměstnanecký poměr.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {[
            { t: 'Marketingová agentura', d: 'Správa sociálních sítí, PPC kampaně, SEO — opakující se měsíční výkony.' },
            { t: 'IT freelancer', d: 'Vývoj a správa webů nebo aplikací na měsíční retainer nebo projektové bázi.' },
            { t: 'Konzultant / kouč', d: 'Konzultační hodiny, školení, poradenství — pravidelné nebo ad hoc.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí smlouva obsahovat</h2>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Jméno / název, IČO, sídlo, zastoupení. U OSVČ: jméno, příjmení, IČO, místo podnikání.' },
            { t: 'Předmět spolupráce', d: 'Přesný popis toho, co OSVČ poskytuje — konkrétní výkony, rozsah, výstupy. Čím konkrétnější, tím méně sporů.' },
            { t: 'Způsob a rozsah plnění', d: 'Jak se výkony provádějí — na základě dílčích objednávek, měsíčního retaineru, nebo jinak.' },
            { t: 'Odměna a fakturace', d: 'Výše honoráře, způsob fakturace, splatnost faktury (typicky 14–30 dní), sankce za prodlení.' },
            { t: 'Mlčenlivost', d: 'Povinnost chránit důvěrné informace klienta — nebo přímo odkaz na samostatnou NDA.' },
            { t: 'Ukončení spolupráce', d: 'Výpovědní doba (typicky 1–3 měsíce), výpovědní důvody a postup při ukončení.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/spoluprace" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit smlouvu o spolupráci s přesným vymezením předmětu →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="honorar-platby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Honorář a platební podmínky</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Honorář je srdcem každé smlouvy o spolupráci. Špatně nastavené platební podmínky jsou
          nejčastější příčina sporů mezi OSVČ a klienty. Co sjednat:
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Způsob stanovení odměny</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Měsíční paušál (retainer) — pevná částka za sjednaný rozsah výkonů. Nebo hodinová
              sazba vynásobená odpracovanými hodinami. Nebo projektová cena za konkrétní výstup.
              Způsob musí být ve smlouvě jasně popsán.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Splatnost faktur</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sjednejte splatnost faktury (typicky 14 nebo 30 dní) a úrok z prodlení za pozdní
              platbu (zákonný úrok z prodlení nebo smluvně vyšší). Bez sjednání platí zákonný
              úrok z prodlení dle nařízení vlády č. 351/2013 Sb.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Zálohy a platba předem</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pro větší zakázky nebo nové klienty doporučujeme zálohu 30–50 % před zahájením
              práce. Chrání OSVČ před situací, kdy klient odmítne zaplatit po dodání výstupu.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="autorska-prava" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Autorská práva a výstupy spolupráce</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Pokud OSVČ vytváří texty, grafiku, software, fotografie nebo jiná autorská díla, musí
          smlouva řešit, kdo je vlastníkem výstupů. Bez smluvní úpravy platí, že autor (OSVČ)
          si ponechává autorská práva a klient má pouze licenci k užití.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-white">Licenční model</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              OSVČ si ponechává autorská práva a poskytuje klientovi licenci k užití díla.
              Rozsah licence (teritorium, způsoby užití, exkluzivita) musí být přesně sjednán.
              Vhodné pro fotografy, ilustrátory nebo agentury.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-white">Převod autorských práv</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              OSVČ převede veškerá majetková autorská práva na klienta. Obvyklé u vývoje softwaru
              nebo tvorby marketingových materiálů. Musí být sjednáno výslovně a zpravidla za vyšší
              odměnu.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Pozor:</strong> Morální autorská práva (právo být uveden jako autor, právo na nedotknutelnost díla)
          nelze převést — zůstávají autorovi vždy.
        </div>
      </section>

      {/* ── MID CTA ─────────────────────────────── */}
      <ArticleInlineCta
        title="Potřebujete smlouvu, která vás ochrání?"
        body="Smlouva o spolupráci na SmlouvaHned obsahuje vymezení předmětu, honorář, autorská práva a mlčenlivost. Připraveno pro OSVČ a freelancery dle OZ 2026."
        buttonLabel="Vytvořit smlouvu o spolupráci"
        href="/spoluprace"
      />

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="svarcsystem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Švarcsystém — jak se chránit</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Švarcsystém je nelegální zastřený pracovní poměr — situace, kdy OSVČ fakticky pracuje
          jako zaměstnanec, ale formálně fakturuje jako podnikatel. Hrozí pokuta pro klienta až
          10 milionů Kč a doměření odvodů za celou dobu spolupráce.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
            <div className="mb-3 text-sm font-black text-red-400">Znaky švarcsystému</div>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Jeden klient = 100 % příjmů OSVČ</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Pevná pracovní doba a místo výkonu</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Práce dle pokynů klienta (ne vlastní metodou)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Klient poskytuje nástroje a vybavení</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>Zákaz práce pro jiné klienty</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-3 text-sm font-black text-emerald-400">Jak se chránit</div>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Pracujte pro více klientů</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Smlouva definuje výstupy, ne pracovní dobu</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Vlastní vybavení a pracovní prostředky</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Svoboda volby metod a postupů</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0">✓</span>Žádný zákaz konkurence ve smlouvě</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Vágní předmět spolupráce', body: 'Smlouva říká „marketingová podpora" bez konkrétního popisu výkonů. Klient pak očekává víc, než OSVČ plánovala dodat, a spor o honorář je na světě. Vždy popište konkrétní výkony, rozsah a výstupy.' },
            { n: '2', title: 'Žádná splatnost ani úrok z prodlení', body: 'Smlouva neobsahuje splatnost faktur ani sankci za prodlení. OSVČ pak čeká na platbu 60–90 dní bez zákonného nároku na penále. Sjednejte splatnost 14–30 dní a úrok z prodlení.' },
            { n: '3', title: 'Nevyřešená autorská práva', body: 'OSVČ dodá web, texty nebo grafiku a smlouva mlčí o vlastnictví. Klient předpokládá, že je vše jeho. OSVČ si myslí, že si ponechává práva. Vždy autorská práva ve smlouvě explicitně ošetřete.' },
            { n: '4', title: 'Žádná výpovědní podmínka', body: 'Spolupráce se pokazí a ani jedna strana neví, jak ji ukončit. Bez výpovědní doby mohou nastat spory o to, zda smlouva trvá a zda vznikl nárok na odměnu. Sjednejte výpovědní dobu a podmínky.' },
            { n: '5', title: 'Ústní dohoda bez smlouvy', body: 'Spolupráce funguje na důvěře a e-mailech. Klient neplatí, OSVČ nemá co předložit soudu. Smlouva musí být písemná — i prostá e-mailová korespondence může být důkazem, ale je to nejisté.' },
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
            'Přesně popište předmět spolupráce — konkrétní výkony a výstupy, ne obecné fráze',
            'Sjednejte splatnost faktur a úrok z prodlení — chrání váš cash flow',
            'Vyřešte autorská práva explicitně — kdo vlastní výstupy spolupráce',
            'Sjednejte výpovědní dobu pro případ ukončení spolupráce',
            'Vyhněte se znakům švarcsystému — pracujte pro více klientů, vlastní metodou',
            'Smlouvu uzavřete vždy písemně — e-mailová výměna je nejistý důkaz',
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
        generatorSuitable="Standardní smlouva o spolupráci mezi OSVČ nebo freelancerem a klientem — marketingové, IT, konzultační nebo kreativní služby. Pokrývá předmět, honorář, autorská práva a mlčenlivost."
        lawyerSuitable="Spolupráce s vysokým finančním objemem, mezinárodní klienti, složité licenční modely nebo situace blízká švarcsystému, kde je nutná analýza pracovněprávního rizika."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte smlouvu o spolupráci online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí smlouvy — od předmětu přes honorář po autorská práva. PDF ihned.
        </p>
        <Link
          href="/spoluprace"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit smlouvu o spolupráci →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Dle OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/smlouva-o-spolupraci', label: '🤝 Smlouva o spolupráci — přehled' },
            { href: '/blog/smlouva-o-dilo-2026', label: '🔨 Smlouva o dílo' },
            { href: '/blog/nda-smlouva-mlcenlivost', label: '🔒 NDA smlouva' },
            { href: '/smlouva-o-sluzbach', label: '📋 Smlouva o službách' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
