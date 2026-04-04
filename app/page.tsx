import type { Metadata } from 'next';
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

const GOLD = '#D4AF37';

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

const mainContracts = [
  {
    href: '/najem',
    title: 'Nájemní smlouva',
    line: 'Byty, domy a nebytové prostory s přehlednými ujednáními.',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path
          d="M18 4L4 16v17h10v-9h8v9h10V16L18 4z"
          stroke={GOLD}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M14 33V24h8v9" stroke={GOLD} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/auto',
    title: 'Kupní smlouva na vozidlo',
    line: 'Převod vlastnictví a technické údaje v jednom dokumentu.',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path d="M6 22h24M10 22l3-8h10l3 8" stroke={GOLD} strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="11" cy="26" r="3" stroke={GOLD} strokeWidth="1.8" />
        <circle cx="25" cy="26" r="3" stroke={GOLD} strokeWidth="1.8" />
        <path d="M4 22v4h4M28 26h4v-4" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/darovaci',
    title: 'Darovací smlouva',
    line: 'Movité i nemovité věci s jednoznačným právním převodem.',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect x="4" y="16" width="28" height="17" rx="2" stroke={GOLD} strokeWidth="1.8" />
        <path d="M4 21h28" stroke={GOLD} strokeWidth="1.8" />
        <path d="M18 16V33" stroke={GOLD} strokeWidth="1.8" />
        <path
          d="M18 16c0 0-5-1-5-5s5-5 5 0M18 16c0 0 5-1 5-5s-5-5-5 0"
          stroke={GOLD}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/smlouva-o-dilo',
    title: 'Smlouva o dílo',
    line: 'Zadání, cena, termíny a předání výsledku díla.',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path d="M24 6l6 6L14 28l-8 2 2-8L24 6z" stroke={GOLD} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M20 10l6 6" stroke={GOLD} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: '/plna-moc',
    title: 'Plná moc',
    line: 'Zmocnění k jednání za vás u úřadů, bank nebo třetích stran.',
    cta: 'Zahájit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect x="6" y="3" width="24" height="30" rx="3" stroke={GOLD} strokeWidth="1.8" />
        <path d="M12 11h12M12 17h12M12 23h7" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

function LogoIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="1" y="1" width="20" height="24" rx="3" stroke={GOLD} strokeWidth="1.8" />
      <path d="M5 8h12M5 12h12M5 16h8" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SectionHeading({ label, title, subtitle, center = false }: {
  label: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <span className="section-label">{label}</span>
      <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-white">{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-sm leading-relaxed text-[#C9D1E1] ${center ? 'mx-auto max-w-xl' : 'max-w-xl'}`}>
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

      <div className="fixed inset-0 -z-10 bg-[#080D1C]" />

      <header id="main-navbar" className="navbar-flat fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between gap-8">
            <Link href="/" className="flex flex-shrink-0 items-center gap-3">
              <LogoIcon />
              <span className="text-[1.0625rem] font-black tracking-tight">
                <span className="text-white">SmlouvaHned</span>
                <span style={{ color: GOLD }}>.cz</span>
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

      <main id="obsah" className="relative bg-[#080D1C] text-[#C9D1E1]">
        {/* 1 — HERO */}
        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 md:pb-20 md:pt-36">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1 lg:max-w-[540px]">
              <h1 className="text-[clamp(2.25rem,4.8vw,3.75rem)] font-black leading-[1.08] tracking-[-0.02em] text-white">
                Smluvní dokument sestavený podle{' '}
                <span style={{ color: GOLD }}>vašich podmínek</span>
              </h1>
              <p className="mt-6 max-w-[480px] text-base leading-[1.75] text-[#C9D1E1]">
                Vyplníte přehledný formulář a získáte dokument připravený k závěrečné kontrole a podpisu.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="#dokumenty" className="cta-primary">
                  Vybrat typ smlouvy →
                </Link>
                <Link href="#jak-to-funguje" className="cta-outline">
                  Jak služba funguje
                </Link>
              </div>
            </div>

            <div className="relative flex flex-shrink-0 justify-center lg:w-[460px] lg:justify-end xl:w-[500px]">
              <div
                className="relative w-full max-w-[400px] overflow-hidden rounded-2xl lg:max-w-none"
                style={{
                  background: '#0c1224',
                  padding: '36px 28px 36px 32px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 28px 72px rgba(0,0,0,0.55)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                />

                <div
                  className="relative overflow-hidden rounded-lg bg-white"
                  style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.45)' }}
                >
                  <div className="px-8 py-7">
                    <div className="mb-3 flex items-center gap-2.5">
                      <svg width="14" height="17" viewBox="0 0 14 17" fill="none" aria-hidden>
                        <rect x="1" y="1" width="12" height="15" rx="2" stroke="#111" strokeWidth="1.4" />
                        <path d="M3.5 6h7M3.5 9h7M3.5 12h4.5" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      <span className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-900">
                        Nájemní smlouva
                      </span>
                    </div>
                    <div className="mb-5 h-px bg-gray-200" />
                    {[
                      {
                        n: '1.',
                        title: 'Pronajímatel',
                        text: 'Pan Jan Novák, nar. 1. 1. 1980, bytem U Lesa 123, 130 00 Praha 3, dále jen „pronajímatel“.',
                      },
                      {
                        n: '2.',
                        title: 'Nájemce',
                        text: 'Pan Petr Svoboda, nar. 5. 5. 1992, bytem Dlouhá 456, 602 00 Brno, dále jen „nájemce“.',
                      },
                      {
                        n: '3.',
                        title: 'Předmět nájmu',
                        text: 'Pronajímatel přenechává nájemci do užívání bytovou jednotku č. 12/3, na adrese U Lesa 123, 130 00 Praha 3.',
                      },
                      {
                        n: '4.',
                        title: 'Cena nájmu',
                        text: 'Nájemné činí 12 000 Kč měsíčně. Splatné vždy do 5. dne příslušného měsíce na účet pronajímatele.',
                      },
                    ].map(s => (
                      <div key={s.n} className="mb-4">
                        <div className="mb-0.5 flex items-baseline gap-2">
                          <span className="text-[8.5px] font-bold text-gray-400">{s.n}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-gray-800">{s.title}</span>
                        </div>
                        <p className="pl-4 text-[8.5px] leading-[1.65] text-gray-500">{s.text}</p>
                      </div>
                    ))}
                    <div className="mt-5 grid grid-cols-2 gap-8 border-t border-gray-200 pt-4">
                      {['Pronajímatel', 'Nájemce'].map(role => (
                        <div key={role}>
                          <div className="mb-1.5 h-px bg-gray-300" />
                          <div className="text-[7px] uppercase tracking-wider text-gray-400">{role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="pointer-events-none absolute bottom-5 right-5 select-none"
                  style={{ transform: 'rotate(-16deg)', transformOrigin: 'bottom center' }}
                  aria-hidden
                >
                  <div
                    style={{
                      width: '7px',
                      height: '110px',
                      background: 'linear-gradient(180deg, #2a2a2a 0%, #1c1c1c 60%, #d4af37 72%, #d4af37 76%, #1c1c1c 78%, #888 88%, #555 100%)',
                      borderRadius: '3.5px 3.5px 1px 1px',
                      boxShadow: '2px 4px 14px rgba(0,0,0,0.5)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-7px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '3.5px solid transparent',
                        borderRight: '3.5px solid transparent',
                        borderTop: '8px solid #555',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 — TRUST ROW */}
        <section aria-label="Důvěra a transparentnost" className="border-y border-[rgba(255,255,255,0.08)] bg-[#060a16]">
          <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  key: 'provozovatel',
                  text: 'Provozovatel uveden',
                  icon: (
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" aria-hidden>
                      <path
                        d="M6 1L1 3.5V7c0 2.8 2.1 5.4 5 6 2.9-.6 5-3.2 5-6V3.5L6 1z"
                        stroke={GOLD}
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  key: 'stripe',
                  text: 'Platba přes Stripe',
                  icon: (
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
                      <rect x="1" y="5.5" width="9" height="7" rx="1.5" stroke={GOLD} strokeWidth="1.3" />
                      <path d="M3 5.5V4a2.5 2.5 0 015 0v1.5" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  key: 'pdf',
                  text: 'PDF po ověřené platbě',
                  icon: (
                    <svg width="10" height="13" viewBox="0 0 10 13" fill="none" aria-hidden>
                      <rect x="1" y="1" width="8" height="11" rx="1.5" stroke={GOLD} strokeWidth="1.3" />
                      <path d="M3 5h4M3 7.5h4M3 10h2" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  key: 'legislativa',
                  text: 'Legislativní aktuálnost',
                  icon: (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 6l2.5 2.5L10 3.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map(t => (
                <div key={t.key} className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    {t.icon}
                  </div>
                  <p className="text-sm font-semibold leading-snug text-white">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 — JAK TO FUNGUJE */}
        <section
          id="jak-to-funguje"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 md:scroll-mt-28 md:py-28"
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
                  className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black"
                  style={{
                    border: '1px solid rgba(212,175,55,0.25)',
                    background: 'rgba(212,175,55,0.08)',
                    color: GOLD,
                  }}
                >
                  {s.step}
                </div>
                <p className="text-sm leading-relaxed text-[#C9D1E1]">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 — 5 HLAVNÍCH SMLUV */}
        <section
          id="dokumenty"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20 md:scroll-mt-28 md:pb-28"
        >
          <div className="mb-12 text-center">
            <span className="section-label inline-block">Nabídka</span>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-white">
              Nejčastější smlouvy a dokumenty
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {mainContracts.map(c => (
              <div key={c.href} className="contract-home-card">
                <div className="mb-4">{c.icon}</div>
                <h3 className="mb-2 text-sm font-black leading-tight text-white">{c.title}</h3>
                <p className="mb-5 flex-grow text-[13px] leading-snug text-[#C9D1E1]">{c.line}</p>
                <Link
                  href={c.href}
                  className="text-xs font-black uppercase tracking-wide transition hover:opacity-90"
                  style={{ color: GOLD }}
                >
                  {c.cta} →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="#vsechny-dokumenty"
              className="inline-flex items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.35)] px-6 py-3 text-sm font-bold text-white transition hover:border-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.04)]"
            >
              Zobrazit všechny dokumenty →
            </Link>
          </div>
        </section>

        {/* 5 — PROČ SMLOUVAHNED */}
        <section
          id="proc-smlouvahned"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20 md:scroll-mt-28 md:pb-28"
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

        {/* 6 — CENÍK */}
        <section
          id="cenik"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20 md:scroll-mt-28 md:pb-28"
        >
          <SectionHeading label="Ceník" title="Úrovně zpracování" center />
          <div className="grid gap-5 md:grid-cols-3 md:items-stretch">
            {pricingTiers.map(tier => (
              <div
                key={tier.name}
                className={`flex flex-col p-7 ${tier.highlighted ? 'panel-gold' : 'panel'}`}
              >
                <div className="mb-6">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#C9D1E1]/80">
                    {tier.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="font-tabular text-[2.5rem] font-black leading-none tracking-tight text-white">
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
                  style={tier.highlighted ? { background: GOLD } : {}}
                >
                  Vybrat dokument
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-[#C9D1E1]/60">Ceny včetně DPH.</p>
        </section>

        {/* 7 — FINAL CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
          <div className="panel-xl px-8 py-16 text-center md:px-16 md:py-20">
            <span className="section-label inline-block">Začít</span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-black tracking-tight text-white">
              Připravte si dokument klidně a systematicky
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#C9D1E1]">
              Vyberte typ smlouvy a projděte formulář — výstup zkontrolujete před podpisem.
            </p>
            <Link href="#dokumenty" className="cta-primary mt-10 inline-flex">
              Vybrat typ smlouvy →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#050811] text-[#C9D1E1]">
        <div
          className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 md:scroll-mt-28"
          id="vsechny-dokumenty"
        >
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xs">
                <Link href="/" className="flex items-center gap-3">
                  <LogoIcon />
                  <div>
                    <div className="font-black tracking-tight">
                      <span className="text-white">SmlouvaHned</span>
                      <span style={{ color: GOLD }}>.cz</span>
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
