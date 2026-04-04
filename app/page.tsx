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

// ── Icons ─────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 mt-0.5" style={{color: '#C9A96E'}} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Logo icon — document SVG
function LogoIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="20" height="24" rx="3" stroke="#C9A96E" strokeWidth="1.8"/>
      <path d="M5 8h12M5 12h12M5 16h8" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ label, title, subtitle, center = false }: {
  label: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <span className="section-label">{label}</span>
      <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm leading-relaxed text-slate-400 ${center ? 'mx-auto max-w-xl' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Quick contract card icons ─────────────────────────────────────────────────
const quickContracts = [
  {
    href: '/najem',
    title: 'Nájemní smlouva',
    sub: 'Byty, domy, nebytové prostory',
    cta: 'Vytvořit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4L4 16v17h10v-9h8v9h10V16L18 4z" stroke="#C9A96E" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M14 33V24h8v9" stroke="#C9A96E" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/auto',
    title: 'Kupní smlouva na vozidlo',
    sub: 'Bezpečný převod vozidla',
    cta: 'Vytvořit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M6 22h24M10 22l3-8h10l3 8" stroke="#C9A96E" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="11" cy="26" r="3" stroke="#C9A96E" strokeWidth="1.8"/>
        <circle cx="25" cy="26" r="3" stroke="#C9A96E" strokeWidth="1.8"/>
        <path d="M4 22v4h4M28 26h4v-4" stroke="#C9A96E" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/darovaci',
    title: 'Darovací smlouva',
    sub: 'Majetek, peníze, movité věci',
    cta: 'Vytvořit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="16" width="28" height="17" rx="2" stroke="#C9A96E" strokeWidth="1.8"/>
        <path d="M4 21h28" stroke="#C9A96E" strokeWidth="1.8"/>
        <path d="M18 16V33" stroke="#C9A96E" strokeWidth="1.8"/>
        <path d="M18 16c0 0-5-1-5-5s5-5 5 0M18 16c0 0 5-1 5-5s-5-5-5 0" stroke="#C9A96E" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/smlouva-o-dilo',
    title: 'Smlouva o dílo',
    sub: 'Práce, služby, projekty',
    cta: 'Vytvořit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M24 6l6 6L14 28l-8 2 2-8L24 6z" stroke="#C9A96E" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M20 10l6 6" stroke="#C9A96E" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: '#vyber-smlouvy',
    title: 'Další dokumenty',
    sub: 'Plná moc, výpověď a další',
    cta: 'Zobrazit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="3" width="24" height="30" rx="3" stroke="#C9A96E" strokeWidth="1.8"/>
        <path d="M12 11h12M12 17h12M12 23h7" stroke="#C9A96E" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    ),
  },
];

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

      {/* ── Background ───────────────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 bg-[#080B15]" />

      {/* ══════════════════════════════════════════════════════════════════
          FLAT NAVBAR
      ══════════════════════════════════════════════════════════════════ */}
      <header id="main-navbar" className="navbar-flat fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between gap-8">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <LogoIcon />
              <span className="text-[1.0625rem] font-black tracking-tight">
                <span className="text-white">SmlouvaHned</span>
                <span style={{color: '#C9A96E'}}>.cz</span>
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {[
                { label: 'Jak to funguje', href: '#jak-to-funguje' },
                { label: 'Typy dokumentů', href: '#vyber-smlouvy' },
                { label: 'Ceník', href: '#cenik' },
                { label: 'Právní průvodce', href: '/blog' },
                { label: 'O nás', href: '/o-projektu' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="rounded-lg px-3.5 py-2 text-sm text-slate-400 transition hover:text-slate-200">
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden items-center gap-3 lg:flex flex-shrink-0">
              <Link href="/zakaznicka-zona" className="btn-gold-outline">
                Přihlásit se
              </Link>
              <Link href="#vyber-smlouvy" className="btn-gold-filled">
                Vybrat typ smlouvy →
              </Link>
            </div>

            {/* Mobile CTA */}
            <Link href="#vyber-smlouvy"
              className="lg:hidden btn-gold-filled text-xs px-3 py-2">
              Vybrat smlouvu →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <div className="relative text-slate-200 bg-[#080B15]">

        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 pt-28 pb-20 md:pt-36 md:pb-32">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

            {/* Left — text block */}
            <div className="flex-1 lg:max-w-[540px]">

              {/* Overline */}
              <div className="mb-6 text-[11px] font-bold uppercase tracking-[0.22em]" style={{color: '#C9A96E'}}>
                Rychle · Jednoduše · Právně správně
              </div>

              {/* H1 */}
              <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-black leading-[1.06] tracking-[-0.02em] text-white">
                Smluvní dokument sestavený podle{' '}
                <span style={{color: '#C9A96E'}}>vašich podmínek</span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 max-w-[480px] text-base leading-[1.8] text-slate-400">
                Vyplníte přehledný formulář a během několika minut získáte
                profesionálně zpracovaný dokument připravený k podpisu.
                Pro běžné životní i podnikatelské situace.
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="#vyber-smlouvy" className="cta-primary">
                  Vybrat typ smlouvy →
                </Link>
                <Link href="#jak-to-funguje" className="cta-outline">
                  Jak služba funguje
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/[0.05] pt-7 sm:grid-cols-4">
                {[
                  { icon: 'shield', text: 'Aktualizováno pro českou legislativu 2024/2025' },
                  { icon: 'lock',   text: 'Platba zabezpečena přes Stripe' },
                  { icon: 'doc',    text: 'PDF ihned po zaplacení připravené k podpisu' },
                  { icon: 'check',  text: 'Prověřené právníky právně konzistentní' },
                ].map(t => (
                  <div key={t.text} className="flex flex-col items-start gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{background: 'rgba(201,169,110,0.10)'}}>
                      {t.icon === 'shield' && (
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none"><path d="M6 1L1 3.5V7c0 2.8 2.1 5.4 5 6 2.9-.6 5-3.2 5-6V3.5L6 1z" stroke="#C9A96E" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                      )}
                      {t.icon === 'lock' && (
                        <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><rect x="1" y="5.5" width="9" height="7" rx="1.5" stroke="#C9A96E" strokeWidth="1.3"/><path d="M3 5.5V4a2.5 2.5 0 015 0v1.5" stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      )}
                      {t.icon === 'doc' && (
                        <svg width="10" height="13" viewBox="0 0 10 13" fill="none"><rect x="1" y="1" width="8" height="11" rx="1.5" stroke="#C9A96E" strokeWidth="1.3"/><path d="M3 5h4M3 7.5h4M3 10h2" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      )}
                      {t.icon === 'check' && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3.5" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <span className="text-[10.5px] leading-snug text-slate-500">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Realistic document preview */}
            <div className="relative flex-shrink-0 lg:w-[460px] xl:w-[500px] flex justify-center lg:justify-end">
              {/* Leather / portfolio background */}
              <div className="relative w-full max-w-[400px] lg:max-w-none rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(150deg, #0F1530 0%, #0A0E22 55%, #0D1228 100%)',
                  padding: '36px 28px 36px 32px',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 8px 24px rgba(0,0,0,0.55)',
                }}>
                {/* Subtle leather-like border accent */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.04)'}} />

                {/* The printed document — white paper */}
                <div className="relative bg-white rounded-lg overflow-hidden"
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)',
                    transform: 'rotate(0.4deg)',
                  }}>
                  <div className="px-8 py-7">
                    {/* Document header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
                        <rect x="1" y="1" width="12" height="15" rx="2" stroke="#111" strokeWidth="1.4"/>
                        <path d="M3.5 6h7M3.5 9h7M3.5 12h4.5" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-900">Nájemní smlouva</span>
                    </div>
                    <div className="h-px bg-gray-200 mb-5" />

                    {/* Numbered sections */}
                    {[
                      {
                        n: '1.',
                        title: 'Pronajímatel',
                        text: 'Pan Jan Novák, nar. 1. 1. 1980, bytem U Lesa 123, 130 00 Praha 3, dále jen „pronajímatel".',
                      },
                      {
                        n: '2.',
                        title: 'Nájemce',
                        text: 'Pan Petr Svoboda, nar. 5. 5. 1992, bytem Dlouhá 456, 602 00 Brno, dále jen „nájemce".',
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
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-[8.5px] font-bold text-gray-400">{s.n}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-gray-800">{s.title}</span>
                        </div>
                        <p className="text-[8.5px] leading-[1.65] text-gray-500 pl-4">{s.text}</p>
                      </div>
                    ))}

                    {/* Signature */}
                    <div className="mt-5 pt-4 border-t border-gray-200 grid grid-cols-2 gap-8">
                      {['Pronajímatel', 'Nájemce'].map(role => (
                        <div key={role}>
                          <div className="h-px bg-gray-300 mb-1.5" />
                          <div className="text-[7px] text-gray-400 uppercase tracking-wider">{role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative pen element */}
                <div className="absolute bottom-5 right-5 pointer-events-none select-none"
                  style={{transform: 'rotate(-18deg)', transformOrigin: 'bottom center'}}>
                  <div style={{
                    width: '7px',
                    height: '110px',
                    background: 'linear-gradient(180deg, #2a2a2a 0%, #1c1c1c 60%, #C9A96E 72%, #C9A96E 76%, #1c1c1c 78%, #888 88%, #555 100%)',
                    borderRadius: '3.5px 3.5px 1px 1px',
                    boxShadow: '1px 2px 10px rgba(0,0,0,0.7)',
                    position: 'relative',
                  }}>
                    {/* Nib */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-7px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '3.5px solid transparent',
                      borderRight: '3.5px solid transparent',
                      borderTop: '8px solid #555',
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TRUST BAR — ČOI / ÚOOÚ / GDPR
        ══════════════════════════════════════════════════════════════════ */}
        <div className="border-y border-white/[0.05]" style={{background: '#060914'}}>
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="text-center mb-4">
              <span className="text-[9px] font-black uppercase tracking-[0.28em] text-slate-600">
                Důvěřují nám tisíce klientů
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {/* ČOI */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border"
                  style={{borderColor: 'rgba(201,169,110,0.25)', background: 'rgba(201,169,110,0.05)'}}>
                  <span className="text-[9px] font-black" style={{color: '#C9A96E'}}>ČOI</span>
                </div>
                <span className="text-[11px] text-slate-500 max-w-[140px] leading-tight">
                  V souladu s předpisy na ochranu spotřebitele
                </span>
              </div>

              <div className="hidden h-7 w-px bg-white/[0.06] sm:block" />

              {/* ÚOOÚ */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border"
                  style={{borderColor: 'rgba(201,169,110,0.25)', background: 'rgba(201,169,110,0.05)'}}>
                  <span className="text-[8px] font-black" style={{color: '#C9A96E'}}>ÚOOÚ</span>
                </div>
                <span className="text-[11px] text-slate-500 max-w-[140px] leading-tight">
                  Respektujeme ochranu osobních údajů (GDPR)
                </span>
              </div>

              <div className="hidden h-7 w-px bg-white/[0.06] sm:block" />

              {/* Seriózní služba */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border"
                  style={{borderColor: 'rgba(201,169,110,0.25)', background: 'rgba(201,169,110,0.05)'}}>
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M7 1L1 3.5V7.5c0 3.2 2.4 6.1 6 6.5 3.6-.4 6-3.3 6-6.5V3.5L7 1z" stroke="#C9A96E" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M4.5 8l2 2 3-3" stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-300 leading-none">Seriózní služba</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Transparentní podmínky</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            QUICK CONTRACT CARDS
        ══════════════════════════════════════════════════════════════════ */}
        <section id="vyber-smlouvy" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="text-center mb-10">
            <span className="section-label inline-block">Vyberte dokument, který potřebujete</span>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-white">
              Nejčastější smlouvy a dokumenty
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {quickContracts.map(c => (
              <Link key={c.href} href={c.href} className="contract-icon-card">
                <div className="mb-4">{c.icon}</div>
                <h3 className="text-sm font-black text-white leading-tight mb-1.5">{c.title}</h3>
                <p className="text-[11px] text-slate-500 leading-snug mb-4">{c.sub}</p>
                <span className="text-[11px] font-bold" style={{color: '#C9A96E'}}>
                  {c.cta} →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="#vse-smlouvy"
              className="text-sm transition hover:text-white"
              style={{color: '#C9A96E'}}>
              Zobrazit všechny typy dokumentů →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FULL CONTRACT CATALOG
        ══════════════════════════════════════════════════════════════════ */}
        <section id="vse-smlouvy" className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-label">Všechny dokumenty</span>
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-white">
                Kompletní nabídka
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400 md:text-right">
              Každý dokument sestaven dynamicky dle vašich údajů.<br />
              Aktualizováno pro legislativu 2026.
            </p>
          </div>
          <ContractCatalog />
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            JAK TO FUNGUJE — 4 KROKY
        ══════════════════════════════════════════════════════════════════ */}
        <section id="jak-to-funguje" className="reveal mx-auto max-w-7xl px-6 py-24 md:py-32">
          <SectionHeading
            label="Postup"
            title="Čtyři kroky ke kompletnímu dokumentu"
            center
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <div key={s.step} className="panel relative overflow-hidden p-6">
                <div className="absolute -right-1 -top-2 select-none text-[5rem] font-black leading-none text-white opacity-[0.03] pointer-events-none">
                  {s.step}
                </div>
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black"
                    style={{border: '1px solid rgba(201,169,110,0.20)', background: 'rgba(201,169,110,0.07)', color: '#C9A96E'}}>
                    {s.step}
                  </div>
                  <h3 className="mb-2 text-[15px] font-black text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PROČ SMLOUVAHNED — DIFFERENTIATORS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <SectionHeading
            label="Proč to funguje"
            title="Není to vzor z internetu."
            subtitle="Je to softwarový nástroj, který sestaví dokument podle vašich podmínek."
            center
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg className="h-5 w-5" style={{color: '#C9A96E'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Sestavení',
                title: 'Dynamicky sestavený dokument',
                desc: 'Každý dokument se sestaví na základě toho, co do formuláře zadáte — strany, podmínky, hodnoty. Výsledek odpovídá vaší dohodě.',
              },
              {
                icon: (
                  <svg className="h-5 w-5" style={{color: '#C9A96E'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Výstup',
                title: 'Strukturovaný výstup ve formátu PDF',
                desc: 'Žádné prázdné kolonky ani šablony k přepisování. Výsledkem je kompletní dokument sestavený podle vašich podmínek — k závěrečné kontrole a podpisu.',
              },
              {
                icon: (
                  <svg className="h-5 w-5" style={{color: '#C9A96E'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Rychlost',
                title: 'Hotovo do 10 minut',
                desc: 'Formulář je přehledný a strukturovaný. Vyplníte jej i bez právního vzdělání — průvodce vás provede každým krokem.',
              },
              {
                icon: (
                  <svg className="h-5 w-5" style={{color: '#C9A96E'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                tag: 'Bezpečnost',
                title: 'Šifrované dočasné úložiště',
                desc: 'Vaše data jsou uložena dočasně a automaticky smazána po uplynutí platnosti odkazu. Platby zpracovává výhradně Stripe.',
              },
            ].map(card => (
              <div key={card.tag} className="panel flex flex-col p-6">
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.20em]" style={{color: 'rgba(201,169,110,0.65)'}}>{card.tag}</div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{border: '1px solid rgba(201,169,110,0.14)', background: 'rgba(201,169,110,0.07)'}}>
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
          <SectionHeading label="Pro koho" title="Komu SmlouvaHned pomůže" center />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '🏠', title: 'Pronajímatelé', desc: 'Nájemní a podnájemní smlouvy s předávacím protokolem. Jasná pravidla pro nájemníky.' },
              { emoji: '🏢', title: 'Podnikatelé a OSVČ', desc: 'Smlouvy o dílo, spolupráci, služby, NDA. Ochrana IP, smluvní pokuty, exit klauzule.' },
              { emoji: '👔', title: 'Zaměstnavatelé', desc: 'Pracovní smlouvy a DPP/DPČ se zákonnou strukturou dle zákoníku práce 2026.' },
              { emoji: '👤', title: 'Fyzické osoby', desc: 'Darovací smlouvy, kupní smlouvy, uznání dluhu, plné moci. Bezpečné transakce.' },
            ].map(c => (
              <div key={c.title} className="panel p-6">
                <div className="mb-3 text-3xl">{c.emoji}</div>
                <h3 className="mb-2 text-base font-black text-white">{c.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Compliance note */}
          <div className="mt-4 rounded-2xl px-5 py-4 text-sm text-slate-400"
            style={{border: '1px solid rgba(201,169,110,0.09)', background: 'rgba(201,169,110,0.02)'}}>
            <span className="font-bold" style={{color: 'rgba(201,169,110,0.75)'}}>Vhodné pro:</span>{' '}
            Standardní situace, kde se strany dohodly a potřebují podmínky zachytit písemně.{' '}
            <span className="text-slate-300">Není náhradou za individuální právní poradenství</span> — pro složitější případy nebo spory doporučujeme advokáta.
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PROČ NE VZOR — COMPARISON TABLE
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <SectionHeading
            label="Proč ne vzor zdarma"
            title="Čím se liší od stažení vzoru?"
            center
          />

          <div className="panel-lg overflow-hidden">
            <div className="grid grid-cols-3 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Kritérium</div>
              <div className="border-l border-white/[0.05] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Vzor zdarma</div>
              <div className="border-l px-6 py-4 text-xs font-black uppercase tracking-[0.14em]"
                style={{borderColor: 'rgba(201,169,110,0.12)', color: '#C9A96E'}}>SmlouvaHned</div>
            </div>
            {[
              { label: 'Přizpůsobení vašim datům', bad: 'Obecný vzor s prázdnými místy', good: 'Vyplněno dle zadaných podmínek' },
              { label: 'Aktuálnost', bad: 'Datum aktualizace neznámé', good: 'Aktualizováno pro 2026' },
              { label: 'Struktura dle OZ', bad: 'Různá kvalita, neznámý zdroj', good: 'Dle příslušných § OZ' },
              { label: 'Podpora při otázkách', bad: '—', good: 'E-mail do 2 pracovních dnů' },
              { label: 'Průvodní instrukce', bad: '—', good: 'Kompletní balíček' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.015]">
                <div className="px-6 py-3.5 text-sm font-medium text-slate-300">{row.label}</div>
                <div className="flex items-center gap-2 border-l border-white/[0.04] px-6 py-3.5 text-sm text-slate-500">
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-red-500/50" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {row.bad}
                </div>
                <div className="flex items-center gap-2 border-l px-6 py-3.5 text-sm text-emerald-400"
                  style={{borderColor: 'rgba(201,169,110,0.08)'}}>
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
              <span className="section-label">Průvodce a tipy</span>
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-white">
                Než smlouvu vytvoříte
              </h2>
            </div>
            <Link href="/blog" className="text-sm text-slate-400 transition hover:text-white">
              Všechny průvodce →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                borderColor: 'rgba(201,169,110,0.25)',
                topColor: 'rgba(201,169,110,0.40)',
                tagColor: '#C9A96E',
                tag: 'Bydlení',
                title: 'Nájemní smlouva 2026 — co musí obsahovat a čeho se vyvarovat',
                excerpt: 'Které klauzule chrání pronajímatele, které nájemce, a co se nejčastěji opomíjí.',
                href: '/blog/najemni-smlouva-vzor-2026',
                ctaLabel: 'Vytvořit nájemní smlouvu',
                ctaHref: '/najem',
              },
              {
                borderColor: 'rgba(56,189,248,0.20)',
                topColor: 'rgba(56,189,248,0.40)',
                tagColor: '#38BDF8',
                tag: 'Prodej vozidla',
                title: 'Kupní smlouva na auto — VIN, STK, vady a bezpečné předání',
                excerpt: 'Co zkontrolovat před podpisem a jak se bránit, pokud kupující tvrdí, že auto mělo vady.',
                href: '/blog/kupni-smlouva-na-auto-2026',
                ctaLabel: 'Vytvořit kupní smlouvu',
                ctaHref: '/auto',
              },
              {
                borderColor: 'rgba(167,139,250,0.20)',
                topColor: 'rgba(167,139,250,0.40)',
                tagColor: '#A78BFA',
                tag: 'OSVČ a podnikatelé',
                title: 'Smlouva o dílo 2026 — pevná cena, sankce a akceptační postup',
                excerpt: 'Kdy použít smlouvu o dílo, jak nastavit cenu díla a co dělat, když objednatel nezaplatí.',
                href: '/blog/smlouva-o-dilo-2026',
                ctaLabel: 'Vytvořit smlouvu o dílo',
                ctaHref: '/smlouva-o-dilo',
              },
            ].map(article => (
              <div key={article.href}
                className="panel flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12]">
                <div className="h-[2px] w-full" style={{background: article.topColor}} />
                <div className="flex flex-grow flex-col p-6">
                  <div className="mb-3 text-[10px] font-black uppercase tracking-[0.20em]" style={{color: article.tagColor}}>
                    {article.tag}
                  </div>
                  <h3 className="mb-3 flex-grow text-sm font-black leading-snug text-white">
                    <Link href={article.href} className="transition hover:text-gold">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{article.excerpt}</p>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.05] px-6 py-4">
                  <Link href={article.href}
                    className="text-xs text-slate-500 underline underline-offset-4 decoration-slate-700 hover:text-slate-300 transition">
                    Číst průvodce →
                  </Link>
                  <Link href={article.ctaHref}
                    className="rounded-xl px-3 py-1.5 text-[11px] font-black uppercase tracking-tight transition"
                    style={{border: '1px solid rgba(201,169,110,0.20)', background: 'rgba(201,169,110,0.07)', color: '#C9A96E'}}>
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
          <SectionHeading
            label="Ceník"
            title="Vyberte úroveň zpracování"
            subtitle="Liší se rozsahem smluvních ujednání, doprovodným materiálem a délkou archivace. Zákonný základ mají všechny varianty společný."
            center
          />

          <div className="grid gap-5 md:grid-cols-3 md:items-start">
            {pricingTiers.map((tier) => (
              <div key={tier.name}
                className={`relative flex flex-col p-7 transition-all duration-200 ${
                  tier.highlighted
                    ? 'panel-gold md:-translate-y-4'
                    : 'panel-xl opacity-90'
                }`}>

                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black whitespace-nowrap"
                      style={{background: '#C9A96E'}}>
                      {tier.badge}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.20em] text-slate-500">
                    {tier.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="font-tabular text-[2.75rem] font-black leading-none tracking-tight text-white">
                      {tier.price}
                    </span>
                    <span className="mb-1 text-lg font-black text-slate-500">{tier.currency}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{tier.description}</div>
                </div>

                <ul className="mb-6 flex-grow space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="mb-6 border-t border-white/[0.06] pt-5 text-xs leading-relaxed text-slate-500">
                  {tier.note}
                </p>

                <Link href={tier.href}
                  className={`block rounded-[12px] py-3.5 text-center text-sm font-black uppercase tracking-tight transition hover:-translate-y-px ${
                    tier.highlighted
                      ? 'text-black hover:opacity-90'
                      : 'border border-white/[0.10] bg-white/[0.04] text-white hover:bg-white/[0.08]'
                  }`}
                  style={tier.highlighted ? {background: '#C9A96E'} : {}}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Ceny jsou uvedeny vč. DPH · Platba přes Stripe · Vrácení peněz při technické chybě systému
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            GARANCE + METODIKA
        ══════════════════════════════════════════════════════════════════ */}
        <section className="reveal mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="panel-lg overflow-hidden"
            style={{border: '1px solid rgba(16,185,129,0.13)', borderTopColor: 'rgba(16,185,129,0.24)'}}>
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-8 md:p-10">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] text-xl">🛡️</div>
                <h3 className="mb-3 text-base font-black text-white">Garance technické správnosti</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Pokud váš dokument nebude obsahovat všechna povinná pole nebo narazíte na technickou chybu,{' '}
                  <span className="font-bold text-white">vrátíme 100 % částky</span> a smlouvu opravíme zdarma.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Garance se vztahuje na technické chyby systému, nikoli na nesprávné vstupy od zákazníka.
                </p>
              </div>
              <div className="hidden w-px bg-white/[0.06] md:block" />
              <div className="block h-px bg-white/[0.06] md:hidden" />
              <div className="flex-1 p-8 md:p-10">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/[0.08] text-xl">📜</div>
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
            <span className="section-label">FAQ</span>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-white">
              Časté otázky
            </h2>
          </div>

          <div className="space-y-2">
            {faqItems.map((item) => (
              <details key={item.question}
                className="group panel overflow-hidden"
                style={{transition: 'border-color 200ms'}}>
                <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-6 px-6 py-5">
                  <span className="text-sm font-bold text-white md:text-[15px]">{item.question}</span>
                  <span className="flex-shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-45 text-xl leading-none"
                    style={{color: undefined}}>+</span>
                </summary>
                <div className="border-t border-white/[0.05] px-6 pb-5 pt-4">
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
          <div className="panel-xl text-center px-8 py-20 md:px-16 md:py-24"
            style={{
              border: '1px solid rgba(201,169,110,0.18)',
              borderTopColor: 'rgba(201,169,110,0.32)',
            }}>
            <span className="section-label inline-block">Začít</span>
            <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-black tracking-tight text-white">
              Sestavte smluvní dokument systematicky
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300 md:text-base">
              Formulář vyplníte za přibližně 5 minut. Výsledkem je strukturovaný dokument
              sestavený podle vašich podmínek — k závěrečné kontrole a podpisu.
            </p>
            <Link href="#vyber-smlouvy"
              className="mt-10 inline-flex items-center rounded-[14px] px-10 text-base font-black uppercase tracking-tight transition hover:opacity-90 hover:-translate-y-[2px] active:translate-y-0 text-black"
              style={{background: '#C9A96E', paddingTop: '1.125rem', paddingBottom: '1.125rem'}}>
              Vytvořit smlouvu →
            </Link>
            <div className="mt-5 text-xs text-slate-500">
              Provozovatel: Karel Zdeněk · IČO: 23660295 · Není advokátní kanceláří
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <footer className="border-t border-white/[0.05]" style={{background: '#050810'}}>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
              {/* Brand column */}
              <div className="max-w-xs">
                <Link href="/" className="flex items-center gap-3">
                  <LogoIcon />
                  <div>
                    <div className="font-black tracking-tight">
                      <span className="text-white">SmlouvaHned</span>
                      <span style={{color: '#C9A96E'}}>.cz</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-600 mt-0.5">Softwarový nástroj pro tvorbu dokumentů</div>
                  </div>
                </Link>
                <p className="mt-5 text-sm leading-relaxed text-slate-500">
                  Softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů.
                  Není advokátní kanceláří.
                </p>
                <div className="mt-4 space-y-0.5 text-xs text-slate-600">
                  <p>Provozovatel: Karel Zdeněk</p>
                  <p>IČO: 23660295 · Plzeňská 189, 345 61 Staňkov</p>
                  <p>
                    <a href="mailto:info@smlouvahned.cz" className="transition hover:text-white">info@smlouvahned.cz</a>
                  </p>
                  <p className="mt-1 text-slate-700">SmlouvaHned.cz je obchodní označení platformy provozované výše uvedenou osobou.</p>
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
                      ['/pujcka', 'Smlouva o zápůjčce'],
                      ['/uznani-dluhu', 'Uznání dluhu'],
                      ['/plna-moc', 'Plná moc'],
                      ['/gdpr', 'Ochrana osobních údajů'],
                      ['/vop', 'Obchodní podmínky'],
                    ].map(([href, label]) => (
                      <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.04] pt-8 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-slate-600">
                © 2024–2026 SmlouvaHned · Karel Zdeněk · IČO 23660295 · Není advokátní kanceláří.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                {[
                  ['/vop', 'Obchodní podmínky'],
                  ['/gdpr', 'Ochrana osobních údajů'],
                  ['/kontakt', 'Kontakt'],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
