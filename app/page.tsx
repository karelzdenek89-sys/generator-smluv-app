import type { Metadata } from 'next';
import Link from 'next/link';
import NavbarClient from '@/app/components/NavbarClient';

export const metadata: Metadata = {
  title: 'SmlouvaHned | Standardizované smluvní dokumenty online',
  description:
    'Online nástroj pro tvorbu standardizovaných smluvních dokumentů pro běžné situace. Přehledný formulář, bezpečná platba a PDF připravené ke kontrole a podpisu.',
  alternates: { canonical: 'https://www.smlouvahned.cz' },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  legalName: 'Karel Zdeněk',
  url: 'https://www.smlouvahned.cz',
  logo: 'https://www.smlouvahned.cz/og-image.png',
  areaServed: 'CZ',
  inLanguage: 'cs-CZ',
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'IČO',
    value: '23660295',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'info@smlouvahned.cz',
    availableLanguage: ['cs'],
  },
};

function LogoIcon() {
  return (
    <svg width="23" height="27" viewBox="0 0 23 27" fill="none" aria-hidden>
      <rect x="1" y="1" width="21" height="25" rx="3" stroke="var(--gold)" strokeWidth="1.7" />
      <path d="M6 9h11M6 13h11M6 17h7" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
      <path
        d="M9 1l7 3.1v5.4c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V4.1L9 1z"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5.7 10.2l2.2 2.1 4.5-4.4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="17" height="19" viewBox="0 0 17 19" fill="none" aria-hidden>
      <rect x="2" y="8" width="13" height="9" rx="1.8" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M5 8V5.9C5 4 6.6 2.5 8.5 2.5S12 4 12 5.9V8" stroke="var(--gold)" strokeWidth="1.5" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="17" height="19" viewBox="0 0 17 19" fill="none" aria-hidden>
      <rect x="2" y="1.8" width="13" height="15.5" rx="1.8" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M5 6h7M5 9.2h7M5 12.4h4" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" stroke="var(--gold)" strokeWidth="1.4" />
      <path d="M5.4 9.2L7.9 11.7 12.9 6.8" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path d="M15 5L4.5 13.7V25h7.5v-6.6h6V25h7.5V13.7L15 5z" stroke="var(--gold)" strokeWidth="1.7" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path d="M5 16h20M8.5 16l2.5-6h8l2.5 6" stroke="var(--gold)" strokeWidth="1.7" />
      <circle cx="9.2" cy="20.5" r="2.2" stroke="var(--gold)" strokeWidth="1.7" />
      <circle cx="20.8" cy="20.5" r="2.2" stroke="var(--gold)" strokeWidth="1.7" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <rect x="4.2" y="13.4" width="21.6" height="12.4" rx="1.8" stroke="var(--gold)" strokeWidth="1.7" />
      <path
        d="M4.2 17.3h21.6M15 13.4v12.4M15 13.4c0 0-4-1-4-4s4-4 4 0M15 13.4c0 0 4-1 4-4s-4-4-4 0"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path d="M20.3 6.1l3.6 3.6L11.2 22.4l-5 1.3 1.3-5L20.3 6.1z" stroke="var(--gold)" strokeWidth="1.7" />
      <path d="M17.8 8.6l3.6 3.6" stroke="var(--gold)" strokeWidth="1.7" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <rect x="7" y="4.5" width="16" height="21" rx="2" stroke="var(--gold)" strokeWidth="1.7" />
      <path d="M11 11h8M11 15h8M11 19h5" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const navLinks = [
  { href: '#jak-to-funguje', label: 'Jak to funguje' },
  { href: '#dokumenty', label: 'Typy dokumentů' },
  { href: '#cenik', label: 'Ceník' },
  { href: '/blog', label: 'Právní průvodce' },
  { href: '/o-projektu', label: 'O projektu' },
];

const trustItems = [
  { icon: <ShieldIcon />, text: 'Šablony průběžně revidované pro českou legislativu 2026' },
  { icon: <LockIcon />, text: 'Bezpečná platba přes Stripe bez zpracování karty na našem webu' },
  { icon: <FileIcon />, text: 'PDF ke stažení ihned po zaplacení a dostupné po omezenou dobu online' },
  { icon: <CheckIcon />, text: 'Transparentní provozovatel, obchodní podmínky, GDPR a kontakt veřejně na webu' },
];

const contractCards = [
  { href: '/najem', title: 'Nájemní smlouva', subtitle: 'Byty, domy, nebytové prostory', icon: <HouseIcon /> },
  { href: '/auto', title: 'Kupní smlouva na vozidlo', subtitle: 'Osobní auta, motocykly, přívěsy', icon: <CarIcon /> },
  { href: '/darovaci', title: 'Darovací smlouva', subtitle: 'Majetek, peníze, movité věci', icon: <GiftIcon /> },
  { href: '/smlouva-o-dilo', title: 'Smlouva o dílo', subtitle: 'Práce, služby, projekty', icon: <PenIcon /> },
  { href: '#vsechny-dokumenty', title: 'Další dokumenty', subtitle: 'Plná moc, zápůjčka a další', icon: <DocumentIcon /> },
];

const pricingTiers = [
  {
    title: 'Základní dokument',
    price: '249 Kč',
    intro: 'Pro běžné situace, kdy potřebujete přehledný finální dokument v PDF.',
    points: [
      'Dokument sestavený podle vyplněných údajů',
      'Základní smluvní struktura pro standardní použití',
      'Dostupnost odkazu ke stažení po dobu 7 dnů',
    ],
  },
  {
    title: 'Rozšířený dokument',
    price: '399 Kč',
    intro: 'Pro případy, kdy chcete doplnit ochranná ustanovení a sankční klauzule.',
    points: [
      'Vše ze Základního dokumentu',
      'Rozšířené klauzule podle typu dokumentu',
      'Dostupnost odkazu ke stažení po dobu 14 dnů',
    ],
  },
  {
    title: 'Kompletní balíček',
    price: '749 Kč',
    intro: 'Pro uživatele, kteří chtějí i doprovodné podklady a delší dostupnost.',
    points: [
      'Vše z Rozšířeného dokumentu',
      'Checklist a doprovodné instrukce podle varianty',
      'Dostupnost odkazu ke stažení po dobu 30 dnů',
    ],
  },
];

const allDocumentCards = [
  { href: '/najem', title: 'Nájemní smlouva', subtitle: 'Byt, dům, nebytové prostory' },
  { href: '/auto', title: 'Kupní smlouva na vozidlo', subtitle: 'Auto, motocykl, přívěs' },
  { href: '/kupni', title: 'Kupní smlouva', subtitle: 'Movité věci, B2B i spotřebitel' },
  { href: '/darovaci', title: 'Darovací smlouva', subtitle: 'Majetek, peníze, movité věci' },
  { href: '/smlouva-o-dilo', title: 'Smlouva o dílo', subtitle: 'Práce, projekty, zakázky' },
  { href: '/sluzby', title: 'Smlouva o službách', subtitle: 'Opakované nebo jednorázové služby' },
  { href: '/spoluprace', title: 'Smlouva o spolupráci', subtitle: 'Obchodní partnerství, B2B' },
  { href: '/pracovni', title: 'Pracovní smlouva', subtitle: 'HPP, zaměstnanecký poměr' },
  { href: '/dpp', title: 'Dohoda o provedení práce', subtitle: 'DPP, vedlejší příjem' },
  { href: '/pujcka', title: 'Smlouva o zápůjčce', subtitle: 'Peníze, movité věci' },
  { href: '/uznani-dluhu', title: 'Uznání dluhu', subtitle: 'Potvrzení závazku a splácení' },
  { href: '/nda', title: 'NDA – Mlčenlivost', subtitle: 'Ochrana informací a obchodního tajemství' },
  { href: '/podnajem', title: 'Podnájemní smlouva', subtitle: 'Podnájem bytu nebo prostor' },
  { href: '/plna-moc', title: 'Plná moc', subtitle: 'Obecná i speciální plná moc' },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />

      <div className="home-reference-bg fixed inset-0 -z-10" aria-hidden />

      <header id="main-navbar" className="navbar-flat fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-[1220px] px-5 md:px-8">
          <div className="flex h-[78px] items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <LogoIcon />
              <span className="font-heading-serif text-[1.55rem] leading-none text-[#f5f6f8] md:text-[1.72rem]">
                SmlouvaHned.cz
              </span>
            </Link>

            <nav className="hidden items-center gap-2 lg:flex">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="nav-link-ref">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link href="#dokumenty" className="nav-cta-ref hidden lg:inline-flex">
                Vybrat dokument <span aria-hidden>→</span>
              </Link>
              <NavbarClient />
            </div>
          </div>
        </div>
      </header>

      <main className="relative pb-16 pt-[94px] text-[#d5dbea] md:pt-[112px]">
        <section className="mx-auto max-w-[1220px] px-5 md:px-8">
          <div className="hero-frame-ref hero-frame-monolith-ref">
            <div className="hero-monolith-ref">
              <p className="hero-monolith-kicker-ref">Online nástroj pro standardizované smluvní dokumenty</p>

              <div className="hero-dossier-stage-ref" aria-hidden>
                <div className="hero-dossier-shadow-ref" />
                <div className="hero-dossier-ref">
                  <div className="hero-dossier-spine-ref" />
                  <div className="hero-dossier-surface-ref">
                    <div className="hero-dossier-corner-ref" />
                    <div className="hero-dossier-brand-ref">SmlouvaHned.cz</div>
                    <h1 className="hero-dossier-title-ref">
                      <span>Standardizovaný dokument</span>
                      <span>sestavený podle</span>
                      <span>vašich údajů</span>
                    </h1>
                    <p className="hero-dossier-subtitle-ref">
                      Dokument pro běžné životní a podnikatelské situace, připravený ke kontrole a podpisu.
                    </p>
                    <div className="hero-dossier-foil-line-ref" />
                    <div className="hero-dossier-foil-line-ref short" />
                  </div>
                </div>
                <div className="hero-dossier-back-ref" />
              </div>

              <p className="hero-monolith-lead-ref">
                Vyplníte přehledný formulář, zvolíte variantu a po zaplacení získáte finální dokument v PDF.
                Služba je určena pro standardizované dokumenty, ne pro individuální právní poradenství.
              </p>

              <div className="hero-monolith-cta-row-ref">
                <Link href="#dokumenty" className="btn-primary-ref">
                  Vybrat dokument <span aria-hidden>→</span>
                </Link>
                <Link href="#jak-to-funguje" className="btn-outline-ref">
                  Jak služba funguje
                </Link>
              </div>
            </div>

            <section className="premium-page-card-soft-ref mt-6 p-6">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
                Jasně vymezená služba pro běžné situace
              </div>
              <p className="max-w-4xl text-sm leading-relaxed text-slate-300 md:text-base">
                SmlouvaHned je online nástroj pro tvorbu standardizovaných smluvních dokumentů. Nejde o individuální právní poradenství.
                Právě proto na webu otevřeně uvádíme, kdy je služba vhodná a kdy už doporučujeme obrátit se na advokáta.
              </p>
            </section>

            <div className="trust-row-ref">
              {trustItems.map(item => (
                <div key={item.text} className="trust-item-ref">
                  <div className="trust-icon-ref">{item.icon}</div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <section className="premium-page-card-ref mt-6 p-8">
              <div className="section-heading-ref mb-6 text-left">
                <p className="section-kicker-ref">Po dokončení objednávky</p>
                <h2 className="section-title-ref">Co přesně získáte po zaplacení</h2>
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                Hotový dokument v PDF připravený k podpisu, sestavený podle údajů, které zadáte ve formuláři.
                U vybraných typů dokumentů také odpovídající přílohy a doprovodné podklady podle zvolené varianty.
              </p>
              <div className="premium-page-grid-ref two mt-8">
                <div className="premium-note-card-ref p-6">
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-amber-400">Preview struktury dokumentu</div>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {[
                      'Identifikace smluvních stran',
                      'Vymezení předmětu smlouvy',
                      'Cena, termíny a podmínky plnění',
                      'Odpovědnost, sankce a závěrečná ustanovení',
                      'Podpisová část a přílohy dle typu dokumentu',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 text-amber-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="premium-note-card-ref p-6">
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-amber-400">Varianty služby</div>
                  <div className="space-y-4 text-sm text-slate-300">
                    <div>
                      <div className="font-bold text-white">Základní dokument</div>
                      <p className="mt-1 text-slate-400">Přehledný finální dokument v PDF pro standardní použití.</p>
                    </div>
                    <div>
                      <div className="font-bold text-white">Rozšířený dokument</div>
                      <p className="mt-1 text-slate-400">Doplňuje ochranná ustanovení a další rozšířené klauzule.</p>
                    </div>
                    <div>
                      <div className="font-bold text-white">Kompletní balíček</div>
                      <p className="mt-1 text-slate-400">Obsahuje i doprovodné podklady a delší dostupnost odkazu.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="dokumenty" className="contracts-panel-ref mt-6">
              <p className="contracts-label-ref">Vyberte dokument, který potřebujete</p>
              <h2 className="contracts-title-ref">Nejčastější smlouvy a dokumenty</h2>

              <div className="contracts-grid-ref">
                {contractCards.map(card => (
                  <Link key={card.title} href={card.href} className="contract-card-ref">
                    <div className="contract-card-icon-ref">{card.icon}</div>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </Link>
                ))}
              </div>

              <div className="contracts-more-ref">
                <Link href="#vsechny-dokumenty">
                  Zobrazit všechny typy dokumentů <span aria-hidden>→</span>
                </Link>
              </div>
            </section>
          </div>
        </section>

        <section id="jak-to-funguje" className="mx-auto mt-12 max-w-[1220px] px-5 md:px-8">
          <div className="section-heading-ref">
            <p className="section-kicker-ref">Jednoduchý postup</p>
            <h2 className="section-title-ref">Jak služba funguje</h2>
          </div>
          <div className="steps-shell-ref">
            {[
              'Vyberete typ dokumentu a vyplníte formulář s konkrétními podmínkami.',
              'Před platbou zkontrolujete souhrn údajů, vybranou variantu a cenu.',
              'Po zaplacení si stáhnete PDF dokument a můžete jej zkontrolovat před podpisem.',
            ].map((text, index) => (
              <div key={text} className="step-item-ref">
                <div className="step-index-ref">0{index + 1}</div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="cenik" className="mx-auto mt-8 max-w-[1220px] px-5 md:px-8">
          <div className="section-heading-ref">
            <p className="section-kicker-ref">Vyberte úroveň zpracování</p>
            <h2 className="section-title-ref">Ceník a obsah balíčků</h2>
          </div>
          <div className="pricing-shell-ref">
            {pricingTiers.map((item, index) => (
              <div key={item.title} className={`pricing-card-ref ${index === 1 ? 'pricing-card-featured-ref' : ''}`}>
                {index === 1 ? <div className="pricing-badge-ref">Doporučená volba</div> : null}
                <h3>{item.title}</h3>
                <p className="price-ref">{item.price}</p>
                <p>{item.intro}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#bdc7d9]">
                  {item.points.map(point => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-[2px] text-[var(--gold)]">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="vsechny-dokumenty" className="mx-auto mt-8 max-w-[1220px] px-5 md:px-8">
          <div className="section-heading-ref">
            <p className="section-kicker-ref">Kompletní přehled</p>
            <h2 className="section-title-ref">Všechny typy dokumentů</h2>
          </div>
          <div className="contracts-grid-ref" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {allDocumentCards.map(card => (
              <Link key={card.href} href={card.href} className="contract-card-ref">
                <div className="contract-card-icon-ref">
                  <DocumentIcon />
                </div>
                <h3>{card.title}</h3>
                <p>{card.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer-ref">
        <div className="mx-auto max-w-[1220px] px-5 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-2 text-sm text-[#97a3bb] md:flex-row md:items-center md:justify-between">
            <p>© 2024-2026 SmlouvaHned · Karel Zdeněk · IČO 23660295</p>
            <div className="flex gap-4">
              <Link href="/obchodni-podminky">Obchodní podmínky</Link>
              <Link href="/gdpr">GDPR</Link>
              <Link href="/kontakt">Kontakt</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
