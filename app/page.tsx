import type { Metadata } from 'next';
import Link from 'next/link';
import ContractCatalog from '@/app/components/ContractCatalog';
import ScrollRevealInit from '@/app/components/ScrollRevealInit';
import NavbarClient from '@/app/components/NavbarClient';

export const metadata: Metadata = {
  title: 'SmlouvaHned | Automatizovaný generátor smluv online — od 249 Kč',
  description: 'Sestavte smluvní dokument systematicky — strukturovaný formulář, aktuální legislativa, výstup ve formátu PDF. Nájemní, kupní, darovací smlouva, DPP, NDA a další. Od 249 Kč.',
  openGraph: {
    title: 'SmlouvaHned | Automatizovaný generátor smluv online',
    description: 'Softwarový nástroj pro tvorbu smluv. Formulář → strukturovaný dokument → PDF ke stažení. Od 249 Kč.',
    url: 'https://smlouvahned.cz',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

const pricingTiers = [
  {
    name: 'Základní dokument',
    price: '249',
    currency: 'Kč',
    description: 'Standardní dokumenty pro přímočaré situace',
    features: [
      'Všechna zákonná povinná ustanovení dle OZ',
      'Dokument sestavený dynamicky dle zadaných údajů',
      'PDF ke stažení ihned po platbě',
      'Aktualizováno pro českou legislativu 2026',
      'Odkaz ke stažení platný 7 dní',
    ],
    note: 'Vhodné tam, kde jsou podmínky jasné, obě strany se dohodly a nepředpokládají komplikace.',
    cta: 'Vytvořit smlouvu',
    href: '#vyber-smlouvy',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Rozšířený dokument',
    price: '399',
    currency: 'Kč',
    description: 'Smluvní pokuty, odpovědnost a sankční mechanismy',
    features: [
      'Vše ze základního balíčku',
      'Smluvní pokuty za porušení povinností',
      'Rozšířené odpovědnostní a doručovací klauzule',
      'Podrobná prohlášení smluvních stran',
      'Mechanismy pro případ nesplnění závazku',
      'Odkaz ke stažení platný 14 dní',
    ],
    note: 'Doporučujeme pro nájmy, prodeje vozidel, smlouvy o dílo a obchodní vztahy, kde záleží na jasně ošetřené odpovědnosti.',
    cta: 'Vytvořit smlouvu',
    href: '#vyber-smlouvy',
    highlighted: true,
    badge: 'Nejčastěji voleno',
  },
  {
    name: 'Kompletní balíček',
    price: '749',
    currency: 'Kč',
    description: 'Úplná dokumentace s podporou a 30denní archivací',
    features: [
      'Vše z Rozšířeného dokumentu',
      'Průvodní instrukce k podpisu a archivaci',
      'Předávací protokol (dle typu smlouvy)',
      'Checklist: co ověřit před podpisem',
      'Dokument v systému po dobu 30 dní',
      'Prioritní e-mailová podpora — odpověď do 24 hodin',
    ],
    note: 'Vhodné pro situace s vyšší hodnotou transakce nebo tam, kde potřebujete mít kompletní dokumentaci a rychlou podporu.',
    cta: 'Vytvořit smlouvu',
    href: '#vyber-smlouvy',
    highlighted: false,
    badge: null,
  },
];

const faqItems = [
  {
    question: 'Jsou dokumenty připraveny k podpisu?',
    answer: 'Ano — výstupem je kompletně vyplněný PDF dokument strukturovaný dle příslušných ustanovení občanského zákoníku č. 89/2012 Sb. Písemná smlouva nevyžaduje účast notáře ani advokáta, pokud zákon pro daný typ nestanoví jinak. Obsah dokumentu závisí na vašich vstupech — před podpisem doporučujeme všechna data zkontrolovat.',
  },
  {
    question: 'Čím se liší Základní dokument od Rozšířeného dokumentu?',
    answer: 'Základní dokument obsahuje povinná strukturální ustanovení. Rozšířený dokument přidává klauzule o smluvních pokutách za porušení povinností, podrobnější odpovědnostní ustanovení a sankční mechanismy pro případ nesplnění závazku.',
  },
  {
    question: 'Jak celý proces funguje?',
    answer: 'Vyberete typ smlouvy, vyplníte formulář krok za krokem, zvolíte úroveň zpracování a po zaplacení obdržíte hotové PDF ke stažení. U Kompletního balíčku také průvodní instrukce a checklist.',
  },
  {
    question: 'Co obdržím po zaplacení?',
    answer: 'Ihned po dokončení platby obdržíte odkaz ke stažení vygenerovaného PDF. Platnost odkazu: Základní 7 dní, Rozšířený 14 dní, Kompletní 30 dní. U Kompletního balíčku také průvodní instrukce k podpisu, checklist a (dle typu smlouvy) předávací protokol.',
  },
  {
    question: 'Proč nezvolit bezplatný vzor z internetu?',
    answer: 'Volně dostupné vzory jsou zpravidla obecné a nezohledňují vaše konkrétní podmínky. V řadě případů postrádají klauzule, které jsou pro vaši ochranu klíčové. Dokumenty na tomto webu jsou sestavovány dynamicky na základě vámi zadaných podmínek — výsledkem je dokument odpovídající vaší konkrétní situaci, nikoli neurčitý vzor.',
  },
  {
    question: 'Jsou bezpečně uložena moje data?',
    answer: 'Údaje jsou uloženy pouze dočasně v šifrovaném úložišti po dobu 7–30 dní dle zakoupeného balíčku (Základní 7 dní, Rozšířený 14 dní, Kompletní 30 dní) a poté automaticky smazány. Platební údaje zpracovává výhradně Stripe — na naše servery se nikdy nedostanou.',
  },
  {
    question: 'Je to náhrada individuální právní služby?',
    answer: 'Ne. Dokumenty na tomto webu představují standardní smluvní vzory pro typické situace. Nejsou náhradou za individuální právní poradenství. V případě nestandardních nebo složitějších případů doporučujeme konzultaci s advokátem.',
  },
];

// ── Structured Data ───────────────────────────────────────────────────────────

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  legalName: 'Karel Zdeněk',
  url: 'https://smlouvahned.cz',
  logo: 'https://smlouvahned.cz/og-image.png',
  foundingDate: '2024',
  areaServed: { '@type': 'Country', name: 'CZ' },
  contactPoint: { '@type': 'ContactPoint', email: 'info@smlouvahned.cz', contactType: 'customer service', availableLanguage: 'Czech' },
  identifier: { '@type': 'PropertyValue', propertyID: 'ICO', value: '23660295' },
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
  provider: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'CZK',
    lowPrice: '249',
    highPrice: '749',
    offerCount: '3',
    offers: [
      { '@type': 'Offer', name: 'Základní dokument', price: '249', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Rozšířený dokument', price: '399', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Kompletní balíček', price: '749', priceCurrency: 'CZK' },
    ],
  },
};

// ── Check icon ────────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-amber-400 mt-0.5" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* Client-side enhancers */}
      <ScrollRevealInit />
      <NavbarClient />

      {/* ── Fixed Ambient Background ─────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[#04070E]">
        {/* Top amber halo — calmer, deeper */}
        <div className="absolute inset-0"
          style={{background: 'radial-gradient(ellipse 55% 35% at 50% -8%, rgba(245,158,11,0.09) 0%, transparent 62%)'}} />
        {/* Subtle deep blue mid-depth — adds dimension without noise */}
        <div className="absolute inset-0"
          style={{background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(30,58,138,0.08) 0%, transparent 60%)'}} />
        {/* Right corner cool accent — very subtle */}
        <div className="absolute inset-0"
          style={{background: 'radial-gradient(circle at 88% 12%, rgba(59,130,246,0.05) 0%, transparent 30%)'}} />
        {/* Refined grid — 48px, slightly tighter */}
        <div className="absolute inset-0 opacity-[0.022]"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px'}} />
      </div>

      {/* ── Floating Navbar ───────────────────────────────────────────────── */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-6xl">
        <div id="floating-navbar" className="glass-2 card-luminous flex items-center justify-between px-5 py-0 h-14 rounded-[18px]"
          style={{borderRadius: '18px'}}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-xs font-black text-black shadow-[0_0_16px_rgba(245,158,11,0.4)]">SH</div>
            <div className="hidden sm:block">
              <div className="text-sm font-black tracking-tight text-white leading-none">SmlouvaHned</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 leading-none mt-0.5">Dokumenty online</div>
            </div>
          </Link>
          {/* Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: 'Smlouvy', href: '#vyber-smlouvy' },
              { label: 'Jak to funguje', href: '#jak-to-funguje' },
              { label: 'Ceník', href: '#cenik' },
              { label: 'Blog', href: '/blog' },
              { label: 'O projektu', href: '/o-projektu' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
          {/* CTA */}
          <Link href="#vyber-smlouvy"
            className="flex-shrink-0 rounded-[14px] bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
            style={{boxShadow: '0 0 20px rgba(245,158,11,0.3)'}}>
            Vytvořit smlouvu →
          </Link>
        </div>
      </header>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <div className="relative text-slate-200 bg-[#04070E]">

        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 pt-36 pb-20 md:pt-44 md:pb-32">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

            {/* Left — text block */}
            <div className="flex-1 lg:max-w-[580px]">
              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.20em] text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                Aktualizováno · Legislativa 2026
              </div>

              {/* H1 */}
              <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-black leading-[1.04] tracking-[-0.02em] text-white">
                Smluvní dokument<br />
                sestavený<br />
                <span className="italic text-amber-500" style={{letterSpacing: '-0.01em'}}>podle vašich podmínek.</span>
              </h1>

              {/* Subheadline */}
              <p className="mt-7 max-w-lg text-[1.0625rem] leading-[1.8] text-slate-400">
                Vyplňte přehledný formulář. Systém sestaví strukturovaný
                dokument a vygeneruje PDF k závěrečné kontrole a podpisu — od&nbsp;249&nbsp;Kč.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="#vyber-smlouvy"
                  className="shadow-cta inline-flex items-center rounded-[16px] bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400 hover:-translate-y-[2px] active:translate-y-0">
                  Vybrat typ smlouvy →
                </Link>
                <Link href="#jak-to-funguje"
                  className="inline-flex items-center rounded-[16px] border border-white/10 px-5 py-4 text-sm text-slate-400 transition hover:border-white/18 hover:text-slate-200"
                  style={{backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.03)'}}>
                  Jak to funguje? ↓
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { icon: '🔒', label: 'Platby přes Stripe' },
                  { icon: '📄', label: 'PDF ihned ke stažení' },
                  { icon: '📋', label: '14 typů dokumentů' },
                  { icon: '🏢', label: 'IČO 23660295' },
                ].map(t => (
                  <div key={t.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-[13px]">{t.icon}</span>
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Floating PDF Preview */}
            <div className="relative flex-shrink-0 lg:w-[420px] xl:w-[460px] flex justify-center lg:justify-end">
              {/* Ambient glow behind card */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="h-[320px] w-[320px] rounded-full opacity-20"
                  style={{background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)', filter: 'blur(40px)'}} />
              </div>

              {/* PDF Card */}
              <div className="pdf-float glass-4 card-floating w-full max-w-[360px] lg:max-w-none overflow-hidden"
                style={{transform: 'perspective(1400px) rotateX(2deg) rotateY(-4deg) rotate(-1deg) translateY(-6px)'}}>

                {/* PDF Top bar */}
                <div className="px-5 pt-5 pb-4"
                  style={{background: 'rgba(6,10,20,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-400">SmlouvaHned.cz</div>
                      <div className="mt-0.5 text-[13px] font-black text-white tracking-wide">NÁJEMNÍ SMLOUVA</div>
                    </div>
                    <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-amber-400">
                      Rozšířená
                    </div>
                  </div>
                  <div className="h-[1.5px] w-full rounded-full"
                    style={{background: 'linear-gradient(90deg, #F59E0B 0%, #FCD34D 50%, rgba(245,158,11,0.3) 100%)'}} />
                </div>

                {/* PDF body — light paper */}
                <div className="px-5 py-5" style={{background: '#F9F8F3'}}>
                  {/* Parties */}
                  <div className="mb-4">
                    <div className="mb-2 text-[7.5px] font-black uppercase tracking-[0.22em] text-slate-400">Smluvní strany</div>
                    <div className="space-y-1.5 text-[8.5px] leading-relaxed text-slate-700">
                      <div><span className="font-bold text-slate-900">Pronajímatel:</span> Jan Novák, nar. 15. 3. 1980, Hlavní 12, Praha 1</div>
                      <div><span className="font-bold text-slate-900">Nájemce:</span> Petra Svobodová, nar. 2. 7. 1992, Nová 5, Brno</div>
                    </div>
                  </div>

                  {/* Key terms box */}
                  <div className="mb-4 rounded-lg border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
                    <div className="mb-2 text-[7px] font-black uppercase tracking-[0.2em] text-slate-400">Klíčové podmínky</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[8px] text-slate-600">
                      {[
                        ['Předmět', 'Byt 2+1, 58 m²'],
                        ['Nájemné', '18 500 Kč/měs.'],
                        ['Kauce', '37 000 Kč'],
                        ['Výpovědní lhůta', '3 měsíce'],
                      ].map(([k, v]) => (
                        <div key={k}><span className="font-bold text-slate-700">{k}:</span> {v}</div>
                      ))}
                    </div>
                  </div>

                  {/* Sections list */}
                  <div className="space-y-1.5">
                    {[
                      '§ 1 — Předmět nájmu a popis nemovitosti',
                      '§ 2 — Nájemné a způsob platby',
                      '§ 3 — Kauce a podmínky vrácení',
                      '§ 4 — Smluvní pokuta za prodlení',
                      '§ 5 — Práva a povinnosti stran',
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-[8px] text-slate-600">
                        <div className="h-[1.5px] w-3 flex-shrink-0 rounded-full bg-amber-400" />
                        {s}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-[7.5px] italic text-slate-400">
                      <div className="h-[1.5px] w-3 flex-shrink-0 rounded-full bg-slate-300" />
                      + 8 dalších ustanovení…
                    </div>
                  </div>

                  {/* Signature lines */}
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {['Pronajímatel', 'Nájemce'].map(role => (
                      <div key={role}>
                        <div className="h-px bg-slate-300" />
                        <div className="mt-1 text-[7px] text-slate-400">{role}</div>
                      </div>
                    ))}
                  </div>

                  {/* Footer note */}
                  <div className="mt-3 text-[6.5px] text-slate-400 text-center">
                    Vygenerováno SmlouvaHned.cz · Standardní smluvní vzor
                  </div>
                </div>
              </div>

              {/* Floating badge — generated (muted emerald, no neon) */}
              <div className="absolute -bottom-3 -left-3 flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-[rgba(6,22,16,0.82)] px-3 py-1.5 text-[11px] font-semibold text-emerald-400/90"
                style={{backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)'}}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                PDF vygenerováno
              </div>

              {/* Floating badge — price */}
              <div className="absolute -top-3 -right-1 rounded-full border border-amber-500/28 bg-[rgba(20,14,4,0.82)] px-3 py-1.5 text-[12px] font-black text-amber-400/90"
                style={{backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)'}}>
                od 249 Kč
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SOCIAL PROOF STRIP
        ══════════════════════════════════════════════════════════════════ */}
        <div className="border-y border-white/[0.05] py-4"
          style={{backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.016)'}}>
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                { icon: '✓', text: 'PDF ke stažení ihned po ověřené platbě' },
                { icon: '✓', text: 'Šablony strukturovány dle platného OZ' },
                { icon: '✓', text: '14 typů dokumentů v jednom místě' },
                { icon: '✓', text: 'Provozovatel ověřen · IČO 23660295' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-amber-500 font-black text-[10px]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            JAK TO FUNGUJE — 4 KROKY
        ══════════════════════════════════════════════════════════════════ */}
        <section id="jak-to-funguje" className="reveal mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mb-12 text-center">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Postup</div>
            <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">
              Čtyři kroky ke kompletnímu dokumentu
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Vyplníte údaje',
                desc: 'Formulář vás provede každou důležitou částí dohody — srozumitelně, bez právního žargonu.',
              },
              {
                step: '02',
                title: 'Zkontrolujete souhrn',
                desc: 'Před platbou vidíte přehled podmínek. Víte, co dokument bude obsahovat, ještě než zaplatíte.',
              },
              {
                step: '03',
                title: 'Zvolíte rozsah',
                desc: 'Základ se zákonnou strukturou, nebo rozšířená verze se smluvními pokutami. Volíte podle situace.',
              },
              {
                step: '04',
                title: 'Stáhnete PDF',
                desc: 'Po zaplacení obdržíte kompletní PDF sestavené podle vašich údajů — ihned, bez čekání.',
              },
            ].map(s => (
              <div key={s.step} className="glass-1 card-luminous relative overflow-hidden p-6">
                {/* Ghost step number */}
                <div className="absolute -right-2 -top-3 select-none text-[5rem] font-black leading-none text-white opacity-[0.04]">
                  {s.step}
                </div>
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-xs font-black text-amber-400">
                    {s.step}
                  </div>
                  <h3 className="mb-2 text-base font-black text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            VÝBĚR SMLUV
        ══════════════════════════════════════════════════════════════════ */}
        <section id="vyber-smlouvy" className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Nejčastější situace</div>
              <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">Vyberte typ dokumentu</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400 md:text-right">
              Každý dokument je sestaven dynamicky dle vašich údajů.<br />
              Aktualizováno pro legislativu 2026.
            </p>
          </div>
          <ContractCatalog />
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PROČ SMLOUVAHNED — DIFFERENTIATORS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="mb-12 text-center">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Proč to funguje</div>
            <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">
              Není to vzor z internetu.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Je to softwarový nástroj, který sestaví dokument podle vašich podmínek.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Sestavení',
                title: 'Dynamicky sestavený dokument',
                desc: 'Každý dokument se sestaví na základě toho, co do formuláře zadáte — strany, podmínky, hodnoty. Výsledek odpovídá vaší dohodě.',
              },
              {
                icon: (
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Výstup',
                title: 'PDF rovnou k podpisu',
                desc: 'Žádné prázdné kolonky ani šablony k přepisování. Výsledkem je kompletní dokument — stačí vytisknout nebo zaslat e-mailem.',
              },
              {
                icon: (
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Rychlost',
                title: 'Hotovo do 10 minut',
                desc: 'Formulář je přehledný a strukturovaný. Vyplníte jej i bez právního vzdělání — průvodce vás provede každým krokem.',
              },
              {
                icon: (
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Bezpečnost',
                title: 'Šifrované dočasné úložiště',
                desc: 'Vaše data jsou uložena dočasně a automaticky smazána po uplynutí platnosti odkazu. Platby zpracovává výhradně Stripe.',
              },
            ].map(card => (
              <div key={card.tag}
                className="glass-1 card-luminous flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5"
                style={{transition: 'all 200ms cubic-bezier(0.2,0,0,1)'}}>
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/70">{card.tag}</div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/8">
                  {card.icon}
                </div>
                <h3 className="mb-2 text-sm font-black text-white leading-snug">{card.title}</h3>
                <p className="flex-grow text-sm leading-relaxed text-slate-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PRO KOHO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="mb-10 text-center">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Pro koho</div>
            <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">Komu SmlouvaHned pomůže</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '🏠', title: 'Pronajímatelé', desc: 'Nájemní a podnájemní smlouvy s předávacím protokolem. Jasná pravidla pro nájemníky.' },
              { emoji: '🏢', title: 'Podnikatelé a OSVČ', desc: 'Smlouvy o dílo, spolupráci, služby, NDA. Ochrana IP, smluvní pokuty, exit klauzule.' },
              { emoji: '👔', title: 'Zaměstnavatelé', desc: 'Pracovní smlouvy a DPP/DPČ se zákonnou strukturou dle zákoníku práce 2026.' },
              { emoji: '👤', title: 'Fyzické osoby', desc: 'Darovací smlouvy, kupní smlouvy, uznání dluhu, plné moci. Bezpečné transakce.' },
            ].map(c => (
              <div key={c.title} className="glass-1 card-luminous p-6 transition-all duration-200 hover:-translate-y-0.5">
                <div className="mb-3 text-3xl">{c.emoji}</div>
                <h3 className="mb-2 text-base font-black text-white">{c.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Compliance note */}
          <div className="mt-4 rounded-2xl border border-amber-500/12 bg-amber-500/[0.04] px-5 py-4 text-sm text-slate-400">
            <span className="font-bold text-amber-400/80">Vhodné pro:</span> Standardní situace, kde se strany dohodly a potřebují podmínky zachytit písemně.{' '}
            <span className="text-slate-300">Není náhradou za individuální právní poradenství</span> — pro složitější případy nebo spory doporučujeme advokáta.
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            UKÁZKOVÝ VÝSTUP — COMPARISON
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="mb-10 text-center">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Proč ne vzor zdarma</div>
            <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">Čím se liší od stažení vzoru?</h2>
          </div>

          {/* Comparison table */}
          <div className="glass-1 card-luminous overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-white/6 bg-white/[0.025]">
              <div className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Kritérium</div>
              <div className="border-l border-white/6 px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Vzor zdarma</div>
              <div className="border-l border-amber-500/15 px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-amber-400">SmlouvaHned</div>
            </div>
            {/* Rows */}
            {[
              { label: 'Přizpůsobení vašim datům', bad: 'Obecný vzor s prázdnými místy', good: 'Vyplněno dle zadaných podmínek' },
              { label: 'Aktuálnost', bad: 'Datum aktualizace neznámé', good: 'Aktualizováno pro 2026' },
              { label: 'Struktura dle OZ', bad: 'Různá kvalita, neznámý zdroj', good: 'Dle příslušných § OZ' },
              { label: 'Podpora při otázkách', bad: '—', good: 'E-mail do 2 pracovních dnů' },
              { label: 'Průvodní instrukce', bad: '—', good: 'Kompletní balíček' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/4 last:border-0 transition-colors hover:bg-white/[0.018]">
                <div className="px-5 py-3.5 text-sm font-medium text-slate-300">{row.label}</div>
                <div className="flex items-center gap-2 border-l border-white/4 px-5 py-3.5 text-sm text-slate-500">
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-red-500/60" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {row.bad}
                </div>
                <div className="flex items-center gap-2 border-l border-amber-500/10 px-5 py-3.5 text-sm text-emerald-400">
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {row.good}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            BLOG PRŮVODCE
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Průvodce a tipy</div>
              <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">Než smlouvu vytvoříte</h2>
            </div>
            <Link href="/blog" className="text-sm text-slate-400 transition hover:text-white">Všechny průvodce →</Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                accentColor: 'text-amber-400',
                accentBorder: 'border-amber-500/20',
                tag: 'Bydlení',
                title: 'Nájemní smlouva 2026 — co musí obsahovat a čeho se vyvarovat',
                excerpt: 'Které klauzule chrání pronajímatele, které nájemce, a co se nejčastěji opomíjí.',
                href: '/blog/najemni-smlouva-vzor-2026',
                ctaLabel: 'Vytvořit nájemní smlouvu',
                ctaHref: '/najem',
              },
              {
                accentColor: 'text-sky-400',
                accentBorder: 'border-sky-500/20',
                tag: 'Prodej vozidla',
                title: 'Kupní smlouva na auto — VIN, STK, vady a bezpečné předání',
                excerpt: 'Co zkontrolovat před podpisem a jak se bránit, pokud kupující tvrdí, že auto mělo vady.',
                href: '/blog/kupni-smlouva-na-auto-2026',
                ctaLabel: 'Vytvořit kupní smlouvu',
                ctaHref: '/auto',
              },
              {
                accentColor: 'text-violet-400',
                accentBorder: 'border-violet-500/20',
                tag: 'OSVČ a podnikatelé',
                title: 'Smlouva o dílo 2026 — pevná cena, sankce a akceptační postup',
                excerpt: 'Kdy použít smlouvu o dílo, jak nastavit cenu díla a co dělat, když objednatel nezaplatí.',
                href: '/blog/smlouva-o-dilo-2026',
                ctaLabel: 'Vytvořit smlouvu o dílo',
                ctaHref: '/smlouva-o-dilo',
              },
            ].map(article => (
              <div key={article.href}
                className="glass-1 card-luminous flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-white/12">
                {/* Top accent line */}
                <div className={`h-[2px] w-full ${article.accentColor === 'text-amber-400' ? 'bg-amber-500/40' : article.accentColor === 'text-sky-400' ? 'bg-sky-500/40' : 'bg-violet-500/40'}`} />
                <div className="flex flex-grow flex-col p-6">
                  <div className={`mb-3 text-[10px] font-black uppercase tracking-[0.2em] ${article.accentColor}`}>{article.tag}</div>
                  <h3 className="mb-3 flex-grow text-sm font-black leading-snug text-white">
                    <Link href={article.href} className="hover:text-amber-400 transition">{article.title}</Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{article.excerpt}</p>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-white/5 px-6 py-4">
                  <Link href={article.href} className="text-xs text-slate-500 underline underline-offset-4 decoration-slate-700 hover:text-slate-300 transition">
                    Číst průvodce →
                  </Link>
                  <Link href={article.ctaHref}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-tight text-amber-400 transition hover:bg-amber-500/20">
                    {article.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════════════════════════ */}
        <section id="cenik" className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="mb-12 text-center">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Ceník</div>
            <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">Vyberte úroveň zpracování</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
              Liší se rozsahem smluvních ujednání, doprovodným materiálem a délkou archivace.
              Zákonný základ mají všechny varianty společný.
            </p>
          </div>

          {/* Cards wrapper — featured card is elevated */}
          <div className="grid gap-5 md:grid-cols-3 md:items-start">
            {pricingTiers.map((tier) => (
              <div key={tier.name}
                className={`relative flex flex-col rounded-[24px] p-7 transition-all duration-200 ${
                  tier.highlighted
                    ? 'glass-3 card-luminous-amber md:-translate-y-4'
                    : 'glass-1 card-luminous opacity-90'
                }`}>
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-amber-500 px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black whitespace-nowrap"
                      style={{boxShadow: '0 0 24px rgba(245,158,11,0.45), 0 2px 6px rgba(245,158,11,0.3)'}}>
                      {tier.badge}
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{tier.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="font-tabular text-[2.75rem] font-black leading-none tracking-tight text-white">
                      {tier.price}
                    </span>
                    <span className="mb-1 text-lg font-black text-slate-500">{tier.currency}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{tier.description}</div>
                </div>

                {/* Features */}
                <ul className="mb-6 flex-grow space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Note */}
                <p className="mb-6 border-t border-white/6 pt-5 text-xs leading-relaxed text-slate-500">
                  {tier.note}
                </p>

                {/* CTA */}
                <Link href={tier.href}
                  className={`block rounded-[16px] py-3.5 text-center text-sm font-black uppercase tracking-tight transition hover:-translate-y-px ${
                    tier.highlighted
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'border border-white/10 bg-white/[0.05] text-white hover:bg-white/10'
                  }`}
                  style={tier.highlighted ? {boxShadow: '0 0 20px rgba(245,158,11,0.22)'} : {}}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Fine print */}
          <p className="mt-6 text-center text-xs text-slate-600">
            Ceny jsou uvedeny vč. DPH · Platba přes Stripe · Vrácení peněz při technické chybě systému
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            GARANCE + METODIKA
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="glass-1 rounded-[24px] overflow-hidden"
            style={{border: '1px solid rgba(16,185,129,0.15)', borderTopColor: 'rgba(16,185,129,0.25)'}}>
            <div className="flex flex-col gap-0 md:flex-row">
              {/* Guarantee */}
              <div className="flex-1 p-8 md:p-10">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xl">🛡️</div>
                <h3 className="mb-3 text-base font-black text-white">Garance technické správnosti</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Pokud váš dokument nebude obsahovat všechna povinná pole nebo narazíte na technickou chybu,{' '}
                  <span className="font-bold text-white">vrátíme 100 % částky</span> a smlouvu opravíme zdarma.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">Garance se vztahuje na technické chyby systému, nikoli na nesprávné vstupy od zákazníka.</p>
              </div>
              {/* Divider */}
              <div className="hidden w-px bg-white/6 md:block" />
              <div className="block h-px bg-white/6 md:hidden" />
              {/* Methodology */}
              <div className="flex-1 p-8 md:p-10">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xl">📜</div>
                <h3 className="mb-3 text-base font-black text-white">Metodika a aktualizace 2026</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Šablony reflektují aktuální znění{' '}
                  <span className="font-bold text-white">Občanského zákoníku č. 89/2012 Sb.</span>{' '}
                  ve znění k 1. 1. 2026. Každé ustanovení odpovídá konkrétnímu paragrafu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════════════════════ */}
        <section id="faq" className="reveal mx-auto max-w-4xl px-6 pb-20 md:pb-28">
          <div className="mb-10">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">FAQ</div>
            <h2 className="text-[clamp(1.875rem,3vw,2.75rem)] font-black tracking-tight text-white">Časté otázky</h2>
          </div>

          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <details key={item.question}
                className="group glass-1 overflow-hidden rounded-[18px] border border-white/[0.06] open:border-amber-500/20"
                style={{transition: 'border-color 200ms'}}>
                <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-6 px-6 py-5">
                  <span className="text-sm font-bold text-white md:text-base">{item.question}</span>
                  <span className="flex-shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-45 group-open:text-amber-400 text-xl leading-none">+</span>
                </summary>
                <div className="border-t border-white/5 px-6 pb-5 pt-4">
                  <p className="text-sm leading-relaxed text-slate-400">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-24 md:pb-32">
          <div className="relative overflow-hidden rounded-[28px] px-8 py-20 text-center md:px-16 md:py-24"
            style={{
              background: 'linear-gradient(160deg, rgba(245,158,11,0.08) 0%, rgba(8,12,24,0.82) 55%)',
              border: '1px solid rgba(245,158,11,0.20)',
              borderTopColor: 'rgba(245,158,11,0.40)',
              backdropFilter: 'blur(36px)',
              WebkitBackdropFilter: 'blur(36px)',
            }}>
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[300px] w-[600px] opacity-20"
                style={{background: 'radial-gradient(ellipse, rgba(245,158,11,0.4) 0%, transparent 70%)', filter: 'blur(60px)'}} />
            </div>

            <div className="relative z-10">
              <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Začít</div>
              <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-black tracking-tight text-white">
                Váš dokument je na pár kliknutí
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300 md:text-base">
                Formulář vyplníte za přibližně 5 minut. Výsledkem je strukturovaný dokument
                sestavený podle vašich podmínek — k závěrečné kontrole a podpisu.
              </p>
              <Link href="#vyber-smlouvy"
                className="shadow-cta mt-10 inline-flex items-center rounded-[18px] bg-amber-500 px-10 text-base font-black uppercase tracking-tight text-black transition hover:bg-amber-400 hover:-translate-y-[2px] active:translate-y-0"
                style={{paddingTop: '1.125rem', paddingBottom: '1.125rem'}}>
                Vytvořit smlouvu →
              </Link>
              <div className="mt-5 text-xs text-slate-500">
                Provozovatel: Karel Zdeněk · IČO: 23660295 · Není advokátní kanceláří
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <footer className="border-t border-white/[0.05]"
          style={{background: 'rgba(4,7,14,0.95)'}}>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
              {/* Brand column */}
              <div className="max-w-xs">
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
                  <div>
                    <div className="font-black tracking-tight text-white">SmlouvaHned</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-600">Softwarový nástroj pro tvorbu dokumentů</div>
                  </div>
                </Link>
                <p className="mt-5 text-sm leading-relaxed text-slate-500">
                  Softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů.
                  Není advokátní kanceláří.
                </p>
                <div className="mt-4 space-y-0.5 text-xs text-slate-600">
                  <p>Provozovatel: Karel Zdeněk</p>
                  <p>IČO: 23660295</p>
                  <p>
                    <a href="mailto:info@smlouvahned.cz" className="hover:text-amber-400 transition">info@smlouvahned.cz</a>
                  </p>
                </div>
              </div>

              {/* Links grid */}
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                <div>
                  <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Navigace</div>
                  <div className="flex flex-col gap-2.5 text-sm text-slate-500">
                    {[
                      ['#vyber-smlouvy', 'Smlouvy'],
                      ['#jak-to-funguje', 'Jak to funguje'],
                      ['#cenik', 'Ceník'],
                      ['/blog', 'Blog'],
                      ['#faq', 'FAQ'],
                      ['/o-projektu', 'O projektu'],
                      ['/zakaznicka-zona', 'Moje dokumenty'],
                      ['/kontakt', 'Kontakt'],
                    ].map(([href, label]) => (
                      <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Bydlení & Majetek</div>
                  <div className="flex flex-col gap-2.5 text-sm text-slate-500">
                    {[
                      ['/najem', 'Nájemní smlouva'],
                      ['/podnajem', 'Podnájemní smlouva'],
                      ['/auto', 'Kupní smlouva (auto)'],
                      ['/kupni', 'Kupní smlouva'],
                      ['/darovaci', 'Darovací smlouva'],
                    ].map(([href, label]) => (
                      <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Práce & Podnikání</div>
                  <div className="flex flex-col gap-2.5 text-sm text-slate-500">
                    {[
                      ['/pracovni', 'Pracovní smlouva'],
                      ['/dpp', 'DPP'],
                      ['/sluzby', 'Smlouva o službách'],
                      ['/smlouva-o-dilo', 'Smlouva o dílo'],
                      ['/spoluprace', 'Smlouva o spolupráci'],
                      ['/nda', 'NDA smlouva'],
                    ].map(([href, label]) => (
                      <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Finance & Ostatní</div>
                  <div className="flex flex-col gap-2.5 text-sm text-slate-500">
                    {[
                      ['/pujcka', 'Zápůjčka'],
                      ['/uznani-dluhu', 'Uznání dluhu'],
                      ['/plna-moc', 'Plná moc'],
                      ['/obchodni-podminky', 'Obchodní podmínky'],
                      ['/gdpr', 'GDPR'],
                    ].map(([href, label]) => (
                      <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
                    ))}
                  </div>
                  <div className="mt-6 mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Blog průvodce</div>
                  <div className="flex flex-col gap-2.5 text-sm text-slate-500">
                    {[
                      ['/blog/najemni-smlouva-vzor-2026', 'Nájemní smlouva 2026'],
                      ['/blog/kupni-smlouva-na-auto-2026', 'Kupní smlouva na auto'],
                      ['/blog/smlouva-o-dilo-2026', 'Smlouva o dílo 2026'],
                    ].map(([href, label]) => (
                      <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment trust */}
            <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.05] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Zabezpečená platba</span>
                <div className="flex items-center gap-2 ml-1">
                  {/* Stripe */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5">
                    <svg className="h-3 w-auto" viewBox="0 0 60 25" fill="none" aria-label="Stripe">
                      <path d="M5.5 9.8c0-1.5 1.2-2.1 3.2-2.1 2.8 0 6.4.9 9.2 2.4V4.4C15.3 3 12.1 2.4 8.7 2.4 3.5 2.4 0 5.1 0 10c0 7.7 10.6 6.5 10.6 9.8 0 1.8-1.6 2.4-3.7 2.4-3.2 0-7.3-1.3-10.6-3.1v5.8c3.6 1.6 7.3 2.2 10.6 2.2 5.4 0 9.2-2.7 9.2-7.6C16.1 11.8 5.5 13.2 5.5 9.8z" fill="#635BFF" transform="translate(1,0)" />
                      <text x="20" y="17" fontSize="13" fontWeight="800" fill="#635BFF" fontFamily="Arial">stripe</text>
                    </svg>
                  </div>
                  {/* Visa */}
                  <div className="flex items-center justify-center rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5">
                    <svg className="h-3 w-auto" viewBox="0 0 60 20" aria-label="Visa">
                      <text x="0" y="16" fontSize="18" fontWeight="900" fill="#1A1F71" fontFamily="Arial" letterSpacing="-1">VISA</text>
                    </svg>
                  </div>
                  {/* Mastercard */}
                  <div className="flex items-center justify-center rounded-lg border border-white/8 bg-white/[0.04] px-2 py-1.5">
                    <svg className="h-4 w-auto" viewBox="0 0 38 24" aria-label="Mastercard">
                      <circle cx="15" cy="12" r="10" fill="#EB001B" />
                      <circle cx="23" cy="12" r="10" fill="#F79E1B" />
                      <path d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z" fill="#FF5F00" />
                    </svg>
                  </div>
                  {/* SSL */}
                  <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5">
                    <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400">SSL</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-600">Platební údaje zpracovává výhradně Stripe. My je nikdy nevidíme.</div>
            </div>

            {/* Legal footer */}
            <div className="mt-6 border-t border-white/[0.04] pt-6">
              <div className="mb-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3 text-[11px] leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-500">Upozornění:</span>{' '}
                SmlouvaHned.cz je softwarový nástroj pro tvorbu standardizovaných dokumentů. Není advokátní kanceláří a neposkytuje právní poradenství ve smyslu zák. č. 85/1996 Sb.
                Pro nestandardní případy nebo transakce s vyšší hodnotou doporučujeme konzultaci s advokátem — seznam na{' '}
                <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-400 underline underline-offset-2 transition">cak.cz</a>.
              </div>
              <p className="text-[11px] text-slate-600">
                © 2024–2026 Karel Zdeněk, IČO: 23660295 · SmlouvaHned.cz je softwarový nástroj pro tvorbu dokumentů, nikoli advokátní kancelář.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
