import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ContractGridPremium from '@/app/components/ContractGridPremium';
import { SEO_LANDINGS, CLUSTER_LABELS, type ClusterKey } from '@/lib/internal-links';

export const metadata: Metadata = {
  title: { absolute: 'Generování smluv online 2026 — PDF ihned ke stažení | SmlouvaHned' },
  description:
    '14 typů smluv online dle OZ 2026 — nájemní, kupní, pracovní, NDA a další. Vyplníte formulář, PDF s citacemi § stahujete ihned. Od 99 Kč.',
  alternates: { canonical: 'https://smlouvahned.cz' },
  openGraph: {
    title: 'Generování smluv online 2026 — PDF ihned ke stažení | SmlouvaHned',
    description:
      '14 typů smluv online dle OZ 2026 — nájemní, kupní, pracovní, NDA a další. Formulář → PDF s citacemi § ihned. Od 99 Kč.',
    url: 'https://smlouvahned.cz',
    siteName: 'SmlouvaHned',
    type: 'website',
    locale: 'cs_CZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generování smluv online 2026 | SmlouvaHned',
    description: '14 typů smluv dle OZ 2026 — formulář → PDF ihned. Od 99 Kč.',
  },
};

const faqItems = [
  {
    question: 'Jsou dokumenty připraveny k podpisu?',
    answer: 'Výstupem je kompletně vyplněný PDF dokument strukturovaný dle příslušných ustanovení občanského zákoníku č. 89/2012 Sb. Obsah dokumentu závisí na vašich vstupech — před podpisem doporučujeme všechna data zkontrolovat.',
  },
  {
    question: 'Čím se liší Základní dokument od Rozšířeného dokumentu?',
    answer: 'Základní dokument obsahuje povinná strukturální ustanovení. Rozšířený dokument přidává klauzule o smluvních pokutách za porušení povinností, podrobnější odpovědnostní ustanovení a sankční mechanismy pro případ nesplnění závazku.',
  },
  {
    question: 'Jak celý proces funguje?',
    answer: 'Vyberete typ smlouvy, vyplníte formulář krok za krokem a vygenerujete dokument. Po odemčení obdržíte hotové PDF ke stažení. U tematického balíčku také průvodní instrukce a checklist.',
  },
  {
    question: 'Co obdržím po zaplacení?',
    answer: 'Ihned po dokončení platby obdržíte odkaz ke stažení vygenerovaného PDF. Platnost odkazu: Základní dokument 7 dní, Rozšířený dokument 30 dní. U Rozšířeného dokumentu také praktické podklady k podpisu a archivaci. U tematických balíčků také předávací dokumentace a checklist.',
  },
  {
    question: 'Jsou bezpečně uložena moje data?',
    answer: 'Údaje jsou uloženy pouze dočasně v šifrovaném úložišti po dobu 7–30 dní dle zakoupeného dokumentu a poté automaticky smazány. Platební údaje zpracovává výhradně Stripe — na naše servery se nikdy nedostanou.',
  },
  {
    question: 'Je to náhrada individuální právní služby?',
    answer: 'Ne. Dokumenty na tomto webu představují standardní smluvní vzory pro typické situace. Nejsou náhradou za individuální právní poradenství. V případě nestandardních nebo složitějších případů doporučujeme konzultaci s advokátem.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SmlouvaHned — Generátor smluv',
  url: 'https://smlouvahned.cz',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'cs',
  description: 'Online softwarový nástroj pro interaktivní tvorbu a stažení standardizovaných smluvních dokumentů — nájemní smlouva, kupní smlouva, NDA a další. Výstup ve formátu PDF. Není advokátní kanceláří.',
  featureList: [
    'Interaktivní formulář pro tvorbu smluvních dokumentů',
    'Okamžitý export do PDF',
    '14 typů standardizovaných dokumentů',
    'Citace konkrétních paragrafů OZ a zákoníku práce přímo v dokumentu',
    'Upozornění na právní rizika při vyplnění formuláře',
    'Ochranné klauzule a smluvní sankce v základní variantě',
    'Šablony aktualizované dle české legislativy k 1. 1. 2026',
    'Šifrované dočasné úložiště dat — automatické smazání po 7–30 dnech',
  ],
  provider: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'CZK',
    lowPrice: '99',
    highPrice: '299',
    offerCount: '3',
    offers: [
      { '@type': 'Offer', name: 'Základní dokument', price: '99', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Rozšířený dokument', price: '199', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Tematický balíček', price: '299', priceCurrency: 'CZK' },
    ],
  },
};


export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040c1a] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, '\\u003c') }} />

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col">

        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Podepisování právního dokumentu plnicím perem"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_50%]"
          />
          <div className="absolute inset-0 bg-[#040c1a]/38" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040c1a]/20 via-transparent to-[#040c1a]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040c1a]/60 via-[#040c1a]/10 to-transparent" />
        </div>

        {/* Navbar */}
        <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#040c1a]/80 text-xs font-black text-[#c9a852]">
              SH
            </div>
            <div>
              <div className="font-serif italic text-sm font-semibold tracking-tight text-white">SmlouvaHned</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Smluvní dokumenty online</div>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-[13px] text-slate-400 md:flex">
            <Link href="#smlouvy" className="hover:text-white transition-colors duration-150">Smlouvy</Link>
            <Link href="#jak-to-funguje" className="hover:text-white transition-colors duration-150">Postup</Link>
            <Link href="/blog" className="hover:text-white transition-colors duration-150">Blog</Link>
            <Link href="/zakaznicka-zona"
              className="rounded-lg border border-[#c9a852]/30 px-4 py-1.5 text-[#c9a852] transition-all duration-200 hover:border-[#c9a852]/60 hover:text-[#d4b86a]">
              Moje dokumenty
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-24 pt-6 md:px-10">
          <div className="max-w-2xl">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c9a852]/25 bg-[#040c1a]/70 px-4 py-2 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a852]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a852]">
                Aktualizováno · Česká legislativa 2026
              </span>
            </div>

            <h1 className="font-serif italic text-6xl font-bold leading-[1.10] tracking-tight text-white md:text-7xl lg:text-[5rem]">
              Smluvní dokumenty
              <br />
              <span className="text-[#c9a852]">sestavené přesně</span>
              <br />
              podle vašich údajů.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-300">
              Vyplníte přehledný formulář — systém sestaví dokument podle vašich podmínek
              a výsledkem je standardizované PDF připravené k podpisu, strukturované dle
              občanského zákoníku č. 89/2012 Sb.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-slate-400">
              <span>Hotový PDF dokument ihned ke stažení</span>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="#smlouvy"
                className="inline-flex items-center gap-2 rounded-xl bg-[#c9a852] px-8 py-4 text-base font-bold text-[#040c1a] transition-all duration-200 hover:bg-[#d4b86a] hover:shadow-[0_0_32px_rgba(201,168,82,0.35)]"
              >
                Vybrat typ smlouvy <span>→</span>
              </Link>
              <Link href="#jak-to-funguje" className="inline-flex items-center gap-1.5 text-base text-slate-400 transition-colors hover:text-white">
                Jak to funguje? <span className="text-xs">↓</span>
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2">
              {['✓ Zákonná struktura OZ/ZP', '✓ PDF ihned ke stažení', '✓ Bezpečná platba Stripe', '✓ Data smazána po 7–30 dnech'].map(t => (
                <span key={t} className="text-sm text-slate-400">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <div className="h-8 w-px bg-gradient-to-b from-transparent to-[#c9a852]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a852]">Smlouvy</span>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:px-10">

        {/* ── DIFFERENTIATOR ───────────────────────────────────────────────────── */}
        <section className="pt-20 md:pt-24">
          <div className="mb-10 text-center">
            <p className="site-kicker mb-2">Proč SmlouvaHned</p>
            <h2 className="font-serif italic text-4xl font-bold text-white md:text-5xl">
              Smlouvy s paragrafy,<br />
              <span className="text-[#c9a852]">ne bez nich.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
              Každý dokument cituje konkrétní ustanovení zákona, obsahuje ochranné klauzule
              a upozorňuje na rizika — to, co jiné generátory vynechávají.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: '§',
                title: 'Citace zákonů přímo v dokumentu',
                desc: 'Každá klauzule odkazuje na konkrétní paragraf OZ nebo zákoníku práce. Víte, co podepisujete a proč to tam je.',
              },
              {
                icon: '⚠',
                title: 'Upozornění na rizika při vyplnění',
                desc: 'Formulář varuje u nebezpečných voleb — příliš vysoký úrok, neplatná rozhodčí doložka v B2C, chybějící souhlas pronajímatele.',
              },
              {
                icon: '✓',
                title: 'Klauzule, na které se zapomíná',
                desc: 'Záruky u stavebního díla, smluvní pokuty v pracovní smlouvě, daňové dopady darování. V základu, ne jako drahý doplněk.',
              },
            ].map(item => (
              <div key={item.title} className="site-content-card rounded-[1.5rem] p-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a852]/30 bg-[#c9a852]/8 font-bold text-[#c9a852]">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-serif italic text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
            {[
              ['Typický generátor smluv', 'Blanketní text bez zákonného základu', 'Zapomíná na sankce a záruky', 'Žádná varování při vyplnění'],
              null,
              ['SmlouvaHned', 'Citace § OZ a ZP přímo v dokumentu', 'Ochranné klauzule v základní variantě', 'Upozornění u každé rizikové volby'],
            ].map((col, i) =>
              col === null ? (
                <div key={i} className="hidden sm:flex items-center justify-center text-2xl text-slate-700">vs.</div>
              ) : (
                <div key={i} className={`rounded-2xl border px-5 py-4 ${i === 0 ? 'border-slate-800 bg-slate-900/40' : 'border-[#c9a852]/20 bg-[#c9a852]/5'}`}>
                  <p className={`mb-3 text-xs font-black uppercase tracking-widest ${i === 0 ? 'text-slate-500' : 'text-[#c9a852]'}`}>{col[0]}</p>
                  {col.slice(1).map(line => (
                    <p key={line} className={`mb-1.5 text-xs ${i === 0 ? 'text-slate-500 line-through decoration-slate-700' : 'text-slate-300'}`}>
                      {i === 2 ? '✓ ' : '✗ '}{line}
                    </p>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── CONTRACT SELECTION ─────────────────────────────────────────────── */}
        <section id="smlouvy" className="pt-0 md:pt-0">
          <div className="mb-10 max-w-xl">
            <p className="site-kicker mb-2">Katalog dokumentů</p>
            <h2 className="font-serif italic text-4xl font-bold text-white md:text-5xl">Vyberte typ dokumentu</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              14 typů smluv sestavených dynamicky podle vašich údajů.
              Aktualizováno dle OZ č. 89/2012 Sb. ve znění k 1. 1. 2026.
            </p>
          </div>
          <ContractGridPremium />
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── GUIDES INDEX (interní linkbuilding) ───────────────────────────── */}
        <section id="pruvodci" aria-labelledby="pruvodci-title">
          <div className="mb-10 max-w-2xl">
            <p className="site-kicker mb-2">Průvodci a vzory smluv</p>
            <h2 id="pruvodci-title" className="font-serif italic text-4xl font-bold text-white md:text-5xl">
              Vyberte si průvodce ke své smlouvě
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              Každý dokument má vlastního průvodce s vysvětlením, co řeší, jak se připravit a jaké jsou nejčastější chyby.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(CLUSTER_LABELS) as ClusterKey[]).map((cluster) => {
              const items = SEO_LANDINGS.filter((l) => l.cluster === cluster);
              if (items.length === 0) return null;
              return (
                <div key={cluster}>
                  <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-[#c9a852]">
                    {CLUSTER_LABELS[cluster]}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-slate-300 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
        <section id="jak-to-funguje">
          <div className="mb-10 text-center">
            <p className="site-kicker mb-2">Postup</p>
            <h2 className="font-serif italic text-4xl font-bold text-white md:text-5xl">Čtyři kroky ke kompletnímu dokumentu</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {[
              { step: '01', title: 'Vyplníte údaje', desc: 'Zadáte strany, podmínky a hodnoty dohody. Formulář vás provede každou důležitou částí bez právního žargonu.' },
              { step: '02', title: 'Zkontrolujete souhrn', desc: 'Před platbou vidíte přehled všech podmínek. Ověříte, co dokument bude obsahovat, ještě než cokoli zaplatíte.' },
              { step: '03', title: 'Vygenerujete dokument', desc: 'Zobrazí se náhled sestavený podle vašich dat. Zvolíte variantu — Základní nebo Rozšířený se smluvními pokutami.' },
              { step: '04', title: 'Stáhnete PDF', desc: 'Po odemčení dokumentu obdržíte kompletní PDF připravené k tisku a podpisu. Ihned, bez čekání.' },
            ].map(s => (
              <div key={s.step} className="site-content-card rounded-[1.5rem] p-6">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9a852]/30 text-sm font-bold text-[#c9a852]">
                  {s.step}
                </div>
                <h3 className="mb-2 font-serif italic text-base font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── FOR WHOM ─────────────────────────────────────────────────────────── */}
        <section>
          <div className="mb-10 text-center">
            <p className="site-kicker mb-2">Pro koho</p>
            <h2 className="font-serif italic text-4xl font-bold text-white md:text-5xl">Komu SmlouvaHned pomůže</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Pronajímatelé', desc: 'Nájemní a podnájemní smlouvy s předávacím protokolem. Jasná pravidla pro kauce, zvířata a Airbnb.' },
              { title: 'Podnikatelé a OSVČ', desc: 'Smlouvy o dílo, o spolupráci, o službách, NDA. Ochrana know-how, smluvní pokuty, exit klauzule.' },
              { title: 'Zaměstnavatelé', desc: 'Pracovní smlouvy a dohody (DPP, DPČ) se všemi zákonnými náležitostmi dle zákoníku práce 2026.' },
              { title: 'Fyzické osoby', desc: 'Darovací smlouvy, kupní smlouvy, uznání dluhu, plné moci. Bezpečné transakce i mimo rodinu.' },
            ].map(c => (
              <div key={c.title} className="site-content-card rounded-[1.5rem] p-6">
                <h3 className="mb-2 font-serif italic text-base font-semibold text-[#c9a852]">{c.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 px-2 py-1 text-sm text-slate-500 text-center">
            Používají pronajímatelé, OSVČ i HR oddělení malých firem po celé ČR.
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── BLOG ─────────────────────────────────────────────────────────────── */}
        <section>
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="site-kicker mb-2">Průvodce</p>
              <h2 className="font-serif italic text-4xl font-bold text-white md:text-5xl">Než smlouvu vytvoříte</h2>
            </div>
            <Link href="/blog" className="text-sm text-slate-400 transition-colors hover:text-white">
              Všechny průvodce →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { tag: 'Bydlení', title: 'Nájemní smlouva 2026 — co musí obsahovat a čeho se vyvarovat', href: '/blog/najemni-smlouva-vzor-2026', ctaHref: '/najem', cta: 'Vytvořit nájemní smlouvu' },
              { tag: 'Prodej vozidla', title: 'Kupní smlouva na auto — VIN, STK, vady a bezpečné předání', href: '/blog/kupni-smlouva-na-auto-2026', ctaHref: '/auto', cta: 'Vytvořit kupní smlouvu' },
              { tag: 'OSVČ', title: 'Smlouva o dílo 2026 — pevná cena, sankce a akceptační postup', href: '/blog/smlouva-o-dilo-2026', ctaHref: '/smlouva-o-dilo', cta: 'Vytvořit smlouvu o dílo' },
            ].map(a => (
              <div key={a.href} className="site-content-card flex flex-col rounded-[1.5rem] overflow-hidden">
                <div className="flex-grow p-6">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a852]">{a.tag}</p>
                  <h3 className="font-serif italic text-base font-semibold text-white leading-snug">
                    <Link href={a.href} className="hover:text-[#c9a852] transition-colors">{a.title}</Link>
                  </h3>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[#c9a852]/10 px-6 py-4">
                  <Link href={a.href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2">Číst průvodce →</Link>
                  <Link href={a.ctaHref} className="rounded-lg border border-[rgba(166,134,91,0.3)] bg-[rgba(166,134,91,0.05)] px-3 py-1.5 text-[11px] font-semibold text-[#d6ac60] hover:border-[rgba(214,172,96,0.55)] hover:bg-[rgba(166,134,91,0.1)] transition-all">{a.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
        <section id="faq">
          <div className="mb-8">
            <p className="site-kicker mb-2">FAQ</p>
            <h2 className="font-serif italic text-4xl font-bold text-white md:text-5xl">Časté otázky</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map(item => (
              <details key={item.question} className="site-content-card-soft group rounded-[1.5rem] p-5 open:border-[rgba(214,172,96,0.3)]">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[15px] font-semibold text-white">{item.question}</span>
                    <span className="flex-shrink-0 text-[#c9a852]/50 transition-transform duration-200 group-open:rotate-45 group-open:text-[#c9a852]">+</span>
                  </div>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
        <section className="mt-20 md:mt-24">
          <div className="site-content-card relative overflow-hidden rounded-[1.75rem]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,168,82,0.05),transparent_60%)]" />
            <div className="relative px-8 py-12 text-center md:py-14">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a852]">Začít</p>
              <h2 className="font-serif italic text-4xl font-bold text-white md:text-5xl">
                Váš dokument je na pár kliknutí
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                Vyplníte přehledný formulář, systém sestaví dokument podle vašich podmínek. Výstupem je
                standardizovaný smluvní dokument připravený k podpisu — strukturovaný dle platné české legislativy.
              </p>
              <a
                href="#smlouvy"
                className="site-button-primary mt-8"
              >
                Vybrat typ smlouvy <span>→</span>
              </a>
            </div>
          </div>
        </section>


      </div>
    </main>
  );
}
