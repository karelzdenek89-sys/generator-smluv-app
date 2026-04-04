import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import NavbarClient from '@/app/components/NavbarClient';

export const metadata: Metadata = {
  title: 'SmlouvaHned | Smluvni dokumenty online',
  description:
    'Sestavte smluvni dokument podle vasich podminek. Prehledny formular, bezpecna platba, PDF pripravene k podpisu.',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  legalName: 'Karel Zdenek',
  url: 'https://smlouvahned.cz',
  logo: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
  areaServed: 'CZ',
  taxID: '23660295',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@smlouvahned.cz',
    availableLanguage: 'Czech',
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
      <path d="M4.2 17.3h21.6M15 13.4v12.4M15 13.4c0 0-4-1-4-4s4-4 4 0M15 13.4c0 0 4-1 4-4s-4-4-4 0" stroke="var(--gold)" strokeWidth="1.5" />
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
  { href: '#dokumenty', label: 'Typy dokumentu' },
  { href: '#cenik', label: 'Cenik' },
  { href: '/blog', label: 'Pravni pruvodce' },
  { href: '/o-projektu', label: 'O nas' },
];

const trustItems = [
  { icon: <ShieldIcon />, text: 'Aktualizovano pro ceskou legislativu 2024/2025' },
  { icon: <LockIcon />, text: 'Platba zabezpecena pres Stripe' },
  { icon: <FileIcon />, text: 'PDF ihned po zaplaceni pripravene k podpisu' },
  { icon: <CheckIcon />, text: 'Proverene pravniky pravne konzistentni' },
];

const contractCards = [
  {
    href: '/najem',
    title: 'Najemni smlouva',
    subtitle: 'Byty, domy, nebytove prostory',
    icon: <HouseIcon />,
  },
  {
    href: '/auto',
    title: 'Kupni smlouva',
    subtitle: 'na vozidlo',
    icon: <CarIcon />,
  },
  {
    href: '/darovaci',
    title: 'Darovaci smlouva',
    subtitle: 'Majetek, penize, movite veci',
    icon: <GiftIcon />,
  },
  {
    href: '/smlouva-o-dilo',
    title: 'Smlouva o dilo',
    subtitle: 'Prace, sluzby, projekty',
    icon: <PenIcon />,
  },
  {
    href: '#vsechny-dokumenty',
    title: 'Dalsi dokumenty',
    subtitle: 'Plna moc, vypoved a dalsi',
    icon: <DocumentIcon />,
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />

      <NavbarClient />
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

            <Link href="#dokumenty" className="nav-cta-ref">
              Vybrat typ smlouvy <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative pb-16 pt-[94px] text-[#d5dbea] md:pt-[112px]">
        <section className="mx-auto max-w-[1220px] px-5 md:px-8">
          <div className="hero-frame-ref">
            <div className="hero-grid-ref">
              <div className="hero-copy-ref">
                <h1 className="hero-title-ref">
                  <span>Smluvni dokument</span>
                  <span>sestaveny podle vasich</span>
                  <span>podminek</span>
                </h1>

                <p className="hero-lead-ref">
                  Vyplnte prehledny formular a behem nekolika minut ziskate profesionalne zpracovany dokument pripraveny k podpisu.
                  Pro bezne zivotni i podnikatelske situace.
                </p>

                <div className="hero-cta-row-ref">
                  <Link href="#dokumenty" className="btn-primary-ref">
                    Vybrat typ smlouvy <span aria-hidden>→</span>
                  </Link>
                  <Link href="#jak-to-funguje" className="btn-outline-ref">
                    Jak sluzba funguje
                  </Link>
                </div>

                <div className="trust-row-ref">
                  {trustItems.map(item => (
                    <div key={item.text} className="trust-item-ref">
                      <div className="trust-icon-ref">{item.icon}</div>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-visual-ref">
                <div className="hero-visual-inner-ref">
                  <Image
                    src="/images/hero-reference.png"
                    alt="Nahled smlouvy a pera"
                    width={1200}
                    height={900}
                    priority
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <section id="dokumenty" className="contracts-panel-ref">
              <p className="contracts-label-ref">Vyberte dokument, ktery potrebujete</p>
              <h2 className="contracts-title-ref">Nejcastejsi smlouvy a dokumenty</h2>

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
                <Link href="#vsechny-dokumenty">Zobrazit vsechny typy dokumentu <span aria-hidden>→</span></Link>
              </div>
            </section>
          </div>
        </section>

        <section id="jak-to-funguje" className="mx-auto mt-12 max-w-[1220px] px-5 md:px-8">
          <div className="steps-shell-ref">
            {[
              'Vyberete typ dokumentu a projdete prehledny formular.',
              'Pred platbou uvidite souhrn vsech zadanych podminek.',
              'Po zaplaceni dostanete PDF pripravene k podpisu.',
            ].map((text, index) => (
              <div key={text} className="step-item-ref">
                <div className="step-index-ref">0{index + 1}</div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="cenik" className="mx-auto mt-8 max-w-[1220px] px-5 md:px-8">
          <div className="pricing-shell-ref">
            {[
              { title: 'Zakladni', price: '249 Kc', text: 'Pro bezne situace a standardni smluvni vztahy.' },
              { title: 'Rozsirena ochrana', price: '399 Kc', text: 'Vice ochrannych klauzuli a pokrocilejsi obsah.' },
              { title: 'Kompletni', price: '749 Kc', text: 'Instrukce, checklist a delsi archivace dokumentu.' },
            ].map(item => (
              <div key={item.title} className="pricing-card-ref">
                <h3>{item.title}</h3>
                <p className="price-ref">{item.price}</p>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="vsechny-dokumenty" className="footer-ref">
        <div className="mx-auto max-w-[1220px] px-5 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-2 text-sm text-[#97a3bb] md:flex-row md:items-center md:justify-between">
            <p>© 2024–2026 SmlouvaHned · Karel Zdenek · ICO 23660295</p>
            <div className="flex gap-4">
              <Link href="/obchodni-podminky">Obchodni podminky</Link>
              <Link href="/gdpr">GDPR</Link>
              <Link href="/kontakt">Kontakt</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
