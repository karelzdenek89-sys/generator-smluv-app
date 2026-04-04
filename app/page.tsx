import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import NavbarClient from '@/app/components/NavbarClient';

export const metadata: Metadata = {
  title: 'SmlouvaHned | Generátor smluv online — od 249 Kč',
  description:
    'Sestavte smluvní dokument podle svých podmínek: strukturovaný formulář a výstup k podpisu. Nájem, koupě vozidla, darování, dílo, plná moc. Od 249 Kč.',
  openGraph: {
    title: 'SmlouvaHned | Generátor smluv online',
    description: 'Softwarový nástroj pro tvorbu smluv. Formulář → dokument → stažení. Od 249 Kč.',
    url: 'https://smlouvahned.cz',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
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
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@smlouvahned.cz',
    contactType: 'customer service',
    availableLanguage: 'Czech',
  },
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
  description:
    'Online nástroj pro interaktivní tvorbu standardizovaných smluvních dokumentů. Výstup ve formátu PDF.',
  provider: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'CZK',
    lowPrice: '249',
    highPrice: '749',
    offerCount: '3',
    offers: [
      { '@type': 'Offer', name: 'Základní', price: '249', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Rozšířená ochrana', price: '399', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Kompletní', price: '749', priceCurrency: 'CZK' },
    ],
  },
};

const pricingTiers = [
  {
    name: 'Základní',
    price: '249',
    blurb: 'Povinná struktura dle OZ, dynamické vyplnění, odkaz ke stažení 7 dní.',
    highlighted: false,
  },
  {
    name: 'Rozšířená ochrana',
    price: '399',
    blurb: 'Navíc smluvní pokuty, rozšířená odpovědnost a odkaz 14 dní.',
    highlighted: true,
  },
  {
    name: 'Kompletní',
    price: '749',
    blurb: 'Instrukce, checklist, předávací protokol dle typu, archivace 30 dní a e-mailová podpora.',
    highlighted: false,
  },
];

const strokeGold = 'var(--gold)';

const mainContracts = [
  {
    href: '/najem',
    title: 'Nájemní smlouva',
    line: 'Byty, domy a nebytové prostory',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path
          d="M18 4L4 16v17h10v-9h8v9h10V16L18 4z"
          stroke={strokeGold}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M14 33V24h8v9" stroke={strokeGold} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/auto',
    title: 'Kupní smlouva na vozidlo',
    line: 'Bezpečný převod vozidla',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path d="M6 22h24M10 22l3-8h10l3 8" stroke={strokeGold} strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="11" cy="26" r="3" stroke={strokeGold} strokeWidth="1.8" />
        <circle cx="25" cy="26" r="3" stroke={strokeGold} strokeWidth="1.8" />
        <path d="M4 22v4h4M28 26h4v-4" stroke={strokeGold} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/darovaci',
    title: 'Darovací smlouva',
    line: 'Majetek, peníze a movité věci',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect x="4" y="16" width="28" height="17" rx="2" stroke={strokeGold} strokeWidth="1.8" />
        <path d="M4 21h28" stroke={strokeGold} strokeWidth="1.8" />
        <path d="M18 16V33" stroke={strokeGold} strokeWidth="1.8" />
        <path
          d="M18 16c0 0-5-1-5-5s5-5 5 0M18 16c0 0 5-1 5-5s-5-5-5 0"
          stroke={strokeGold}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/smlouva-o-dilo',
    title: 'Smlouva o dílo',
    line: 'Práce, služby a projekty',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path d="M24 6l6 6L14 28l-8 2 2-8L24 6z" stroke={strokeGold} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M20 10l6 6" stroke={strokeGold} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: '/plna-moc',
    title: 'Plná moc',
    line: 'Úřady, banky a zastoupení',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect x="6" y="3" width="24" height="30" rx="3" stroke={strokeGold} strokeWidth="1.8" />
        <path d="M12 11h12M12 17h12M12 23h7" stroke={strokeGold} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

function LogoIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="1" y="1" width="20" height="24" rx="3" stroke={strokeGold} strokeWidth="1.8" />
      <path d="M5 8h12M5 12h12M5 16h8" stroke={strokeGold} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CzechFlagIcon() {
  return (
    <svg width="22" height="15" viewBox="0 0 22 15" aria-hidden className="overflow-hidden rounded-sm shadow-sm">
      <rect width="22" height="7.5" fill="#ffffff" />
      <rect y="7.5" width="22" height="7.5" fill="#d7141a" />
      <path d="M0 0 L11 7.5 L0 15 Z" fill="#11457e" />
    </svg>
  );
}

function SectionHeading({
  label,
  title,
  subtitle,
  center = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 md:mb-12 ${center ? 'text-center' : ''}`}>
      <span className="section-label">{label}</span>
      <h2 className="font-heading-serif text-[clamp(1.9rem,3vw,2.7rem)] font-semibold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm leading-relaxed text-[#c9d1e1] ${center ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema).replace(/</g, '\\u003c'),
        }}
      />

      <NavbarClient />

      <div className="home-ambient-bg fixed inset-0 -z-10" aria-hidden />

      <header id="main-navbar" className="navbar-flat fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between gap-8">
            <Link href="/" className="flex flex-shrink-0 items-center gap-3">
              <LogoIcon />
              <span className="text-[1.0625rem] font-semibold tracking-tight text-[#f2f4f8]">
                SmlouvaHned<span className="text-[var(--gold)]">.cz</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {[
                { label: 'Jak to funguje', href: '#jak-to-funguje' },
                { label: 'Typy dokumentů', href: '#dokumenty' },
                { label: 'Ceník', href: '#cenik' },
                { label: 'Právní průvodce', href: '/blog' },
                { label: 'O nás', href: '/o-projektu' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3.5 py-2 text-sm text-[#C9D1E1] transition hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-shrink-0 items-center">
              <Link href="#dokumenty" className="btn-nav-outline text-xs sm:text-sm">
                Vybrat typ smlouvy →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="obsah" className="relative text-[#d7dee8]">
        {/* HERO */}
        <section className="relative mx-auto max-w-7xl px-6 pb-8 pt-28 md:pb-10 md:pt-36">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-14 xl:gap-20">
            <div className="max-w-[620px]">
              <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]/85">
                Online tvorba standardizovaných smluvních dokumentů
              </div>

              <h1 className="font-heading-serif text-[clamp(2.35rem,5vw,4.35rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--gold-light)] [text-shadow:0_2px_34px_rgba(0,0,0,0.26)]">
                Smluvní dokument
                <br />
                sestavený podle vašich
                <br />
                podmínek
              </h1>

              <div className="mt-7 max-w-[540px] space-y-4 text-[1rem] leading-[1.8] text-[#d1d8e3]">
                <p>
                  Vyplníte přehledný formulář a během několika minut získáte profesionálně zpracovaný dokument.
                </p>
                <p>
                  Připravený k závěrečné kontrole a podpisu — pro běžné životní i podnikatelské situace.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <Link href="#dokumenty" className="cta-primary">
                  Vybrat typ smlouvy →
                </Link>
                <Link href="#jak-to-funguje" className="cta-outline">
                  Jak služba funguje
                </Link>
              </div>

              <div className="mt-10 border-t border-white/[0.1] pt-7">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      key: 'cz',
                      text: 'Aktualizováno pro českou legislativu 2024/2025',
                      node: <CzechFlagIcon />,
                    },
                    {
                      key: 'stripe',
                      text: 'Platba zabezpečena přes Stripe',
                      node: (
                        <svg width="14" height="15" viewBox="0 0 11 13" fill="none" aria-hidden>
                          <rect x="1" y="5.5" width="9" height="7" rx="1.5" stroke={strokeGold} strokeWidth="1.3" />
                          <path d="M3 5.5V4a2.5 2.5 0 015 0v1.5" stroke={strokeGold} strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      ),
                    },
                    {
                      key: 'pdf',
                      text: 'PDF po ověřené platbě připravené k podpisu',
                      node: (
                        <svg width="12" height="15" viewBox="0 0 10 13" fill="none" aria-hidden>
                          <rect x="1" y="1" width="8" height="11" rx="1.5" stroke={strokeGold} strokeWidth="1.3" />
                          <path d="M3 5h4M3 7.5h4M3 10h2" stroke={strokeGold} strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      ),
                    },
                    {
                      key: 'legal',
                      text: 'Prověřené právníky, právně konzistentní',
                      node: (
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path
                            d="M2 6l2.5 2.5L10 3.5"
                            stroke={strokeGold}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                    },
                  ].map(t => (
                    <div
                      key={t.key}
                      className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(197,160,89,0.25)] bg-[rgba(197,160,89,0.08)]"
                        >
                          {t.node}
                        </div>
                        <p className="text-[12px] leading-snug text-[#b8c2d2]">{t.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div
                className="relative w-full max-w-[620px] overflow-hidden rounded-[24px] border border-white/[0.08]"
                style={{
                  boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 14px 45px rgba(0,0,0,0.35)',
                }}
              >
                <Image
                  src="/images/hero-reference.png"
                  alt="Náhled nájemní smlouvy a dokumentové desky"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* JAK TO FUNGUJE */}
        <section
          id="jak-to-funguje"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 py-12 md:scroll-mt-28 md:py-16"
        >
          <SectionHeading label="Postup" title="Jak to funguje" center />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', text: 'Vyberete typ dokumentu a projdete strukturovaný formulář.' },
              { step: '02', text: 'Před platbou zkontrolujete souhrn zadaných podmínek.' },
              { step: '03', text: 'Zvolíte úroveň zpracování podle potřebné ochrany stran.' },
              { step: '04', text: 'Po dokončení objednávky stáhnete vygenerovaný dokument.' },
            ].map(s => (
              <div key={s.step} className="panel p-6">
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-xs font-black"
                  style={{
                    border: '1px solid rgba(197,160,89,0.28)',
                    background: 'rgba(197,160,89,0.08)',
                    color: 'var(--gold)',
                  }}
                >
                  {s.step}
                </div>
                <p className="text-sm leading-relaxed text-[#C9D1E1]">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5 HLAVNÍCH SMLUV */}
        <div className="documents-band">
          <section
            id="dokumenty"
            className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 md:scroll-mt-28 md:py-20"
          >
            <div className="mb-10 text-center">
              <span className="section-label inline-block">Vyberte dokument, který potřebujete</span>
              <h2 className="font-heading-serif text-[clamp(2rem,3vw,2.8rem)] font-semibold tracking-tight text-[var(--gold-light)]">
                Nejčastější smlouvy a dokumenty
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {mainContracts.map(c => (
                <div key={c.href} className="contract-home-card">
                  <div className="mb-4">{c.icon}</div>
                  <h3 className="font-heading-serif mb-2 text-[1.05rem] font-semibold leading-tight text-[var(--gold-light)]">
                    {c.title}
                  </h3>
                  <p className="mb-5 flex-grow text-[13px] leading-snug text-[#9aa5b8]">{c.line}</p>
                  <Link href={c.href} className="link-gold-elegant text-xs font-bold uppercase tracking-wide">
                    {c.cta} →
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="#vsechny-dokumenty" className="link-gold-elegant inline-block text-sm font-semibold">
                Zobrazit všechny typy dokumentů →
              </Link>
            </div>
          </section>
        </div>

        {/* PROČ SMLOUVAHNED */}
        <section
          id="proc-smlouvahned"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-14 md:scroll-mt-28 md:pb-20"
        >
          <SectionHeading
            label="Odlišení"
            title="Proč SmlouvaHned"
            subtitle="Spojuje to, co u běžného vzoru chybí: váš konkrétní obsah, přehledný postup a férové podmínky."
            center
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'Obsah podle vaší dohody',
                body: 'Dokument se skládá z údajů, které zadáte — nejde o doplnění anonymní šablony stažené z internetu.',
              },
              {
                title: 'Kontrola před závazkem',
                body: 'Souhrn podmínek vidíte ještě před dokončením platby, takže víte, co objednáváte.',
              },
              {
                title: 'Rychle a srozumitelně',
                body: 'Formulář vede krok za krokem bez zbytečného právnického kódu.',
              },
              {
                title: 'Transparentní provoz',
                body: 'Provozovatel, identifikační údaje a podmínky služby jsou veřejně dostupné v patičce webu.',
              },
            ].map(card => (
              <div key={card.title} className="panel p-6">
                <h3 className="mb-2 text-base font-black text-white">{card.title}</h3>
                <p className="text-sm leading-relaxed text-[#C9D1E1]">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CENÍK */}
        <section
          id="cenik"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-14 md:scroll-mt-28 md:pb-20"
        >
          <SectionHeading label="Ceník" title="Úrovně zpracování" center />
          <div className="grid gap-5 md:grid-cols-3 md:items-stretch">
            {pricingTiers.map(tier => (
              <div key={tier.name} className={`flex flex-col p-7 ${tier.highlighted ? 'panel-gold' : 'panel'}`}>
                <div className="mb-6">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#C9D1E1]/80">
                    {tier.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="font-tabular text-[2.6rem] font-black leading-none tracking-tight text-white">
                      {tier.price}
                    </span>
                    <span className="mb-1 text-lg font-black text-[#C9D1E1]/70">Kč</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#C9D1E1]">{tier.blurb}</p>
                </div>
                <Link
                  href="#dokumenty"
                  className={`mt-auto block rounded-[10px] py-3.5 text-center text-sm font-black uppercase tracking-tight transition ${
                    tier.highlighted
                      ? 'text-[#080d1c] hover:opacity-90'
                      : 'border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-white hover:bg-[rgba(255,255,255,0.07)]'
                  }`}
                  style={
                    tier.highlighted
                      ? { background: 'linear-gradient(145deg, var(--gold-deep), var(--gold-light))' }
                      : {}
                  }
                >
                  Vybrat dokument
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-[#C9D1E1]/60">Ceny včetně DPH.</p>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-28">
          <div className="panel-xl px-8 py-14 text-center md:px-16 md:py-16">
            <span className="section-label inline-block">Začít</span>
            <h2 className="font-heading-serif text-[clamp(1.9rem,3.5vw,2.9rem)] font-semibold tracking-tight text-white">
              Připravte si dokument klidně a systematicky
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#C9D1E1]">
              Vyberte typ smlouvy a projděte formulář — výstup zkontrolujete před podpisem.
            </p>
            <Link href="#dokumenty" className="cta-primary mt-9 inline-flex">
              Vybrat typ smlouvy →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#050811] text-[#C9D1E1]">
        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 md:scroll-mt-28" id="vsechny-dokumenty">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-3">
                <LogoIcon />
                <div>
                  <div className="font-black tracking-tight">
                    <span className="text-white">SmlouvaHned</span>
                    <span className="text-[var(--gold)]">.cz</span>
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[#C9D1E1]/50">
                    Softwarový nástroj pro tvorbu dokumentů
                  </div>
                </div>
              </Link>
              <p className="mt-5 text-sm leading-relaxed text-[#C9D1E1]/70">
                Softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů.
              </p>
              <div className="mt-4 space-y-0.5 text-xs text-[#C9D1E1]/55">
                <p>Provozovatel: Karel Zdeněk</p>
                <p>IČO: 23660295 · Plzeňská 189, 345 61 Staňkov</p>
                <p>
                  <a href="mailto:info@smlouvahned.cz" className="transition hover:text-white">
                    info@smlouvahned.cz
                  </a>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#C9D1E1]/45">
                  Navigace
                </div>
                <div className="flex flex-col gap-2.5 text-sm text-[#C9D1E1]/70">
                  {[
                    ['#dokumenty', 'Smlouvy'],
                    ['#jak-to-funguje', 'Jak to funguje'],
                    ['#cenik', 'Ceník'],
                    ['/blog', 'Blog'],
                    ['/o-projektu', 'O projektu'],
                    ['/zakaznicka-zona', 'Moje dokumenty'],
                    ['/kontakt', 'Kontakt'],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="transition hover:text-white">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#C9D1E1]/45">
                  Bydlení a majetek
                </div>
                <div className="flex flex-col gap-2.5 text-sm text-[#C9D1E1]/70">
                  {[
                    ['/najem', 'Nájemní smlouva'],
                    ['/podnajem', 'Podnájemní smlouva'],
                    ['/auto', 'Kupní smlouva (auto)'],
                    ['/kupni', 'Kupní smlouva'],
                    ['/darovaci', 'Darovací smlouva'],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="transition hover:text-white">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#C9D1E1]/45">
                  Práce a podnikání
                </div>
                <div className="flex flex-col gap-2.5 text-sm text-[#C9D1E1]/70">
                  {[
                    ['/pracovni', 'Pracovní smlouva'],
                    ['/dpp', 'DPP'],
                    ['/sluzby', 'Smlouva o službách'],
                    ['/smlouva-o-dilo', 'Smlouva o dílo'],
                    ['/spoluprace', 'Smlouva o spolupráci'],
                    ['/nda', 'NDA smlouva'],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="transition hover:text-white">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#C9D1E1]/45">
                  Finance a ostatní
                </div>
                <div className="flex flex-col gap-2.5 text-sm text-[#C9D1E1]/70">
                  {[
                    ['/pujcka', 'Smlouva o zápůjčce'],
                    ['/uznani-dluhu', 'Uznání dluhu'],
                    ['/plna-moc', 'Plná moc'],
                    ['/gdpr', 'Ochrana osobních údajů'],
                    ['/obchodni-podminky', 'Obchodní podmínky'],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="transition hover:text-white">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-[rgba(255,255,255,0.06)] pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-[#C9D1E1]/45">
              © 2024–2026 SmlouvaHned · Karel Zdeněk · IČO 23660295 · Není advokátní kanceláří.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[#C9D1E1]/45">
              {[
                ['/obchodni-podminky', 'Obchodní podmínky'],
                ['/gdpr', 'Ochrana osobních údajů'],
                ['/kontakt', 'Kontakt'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="transition hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}