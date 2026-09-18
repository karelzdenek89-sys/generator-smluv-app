import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ContractGridPremium from '@/app/components/ContractGridPremium';
import DifferentiationSection from '@/app/components/marketing/DifferentiationSection';
import ProductScopeStrip from '@/app/components/marketing/ProductScopeStrip';
import ExpatEntryLinks from '@/app/components/ExpatEntryLinks';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import HomepageAnalyticsTracker from '@/app/components/analytics/HomepageAnalyticsTracker';
import { FOREIGN_LOCALES, LOCALE_META } from '@/lib/i18n/locales';
import { getAvailableThematicPackages, getEffectivePriceBand } from '@/lib/packages';
import { getFreeBasicPdfCopy } from '@/lib/monetization-copy';
import { getMonetizationPolicy, isFreeBasicPolicy } from '@/lib/monetization-policy';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';
import { PRICE_TRANSPARENCY_LINE } from '@/lib/price-reveal-copy';
import { SITE_URL } from '@/lib/seo/site';
import SituationGrid from '@/app/components/portal/SituationGrid';
import { LEGAL_CHANGES, LEGAL_CHANGE_STATUS_LABELS } from '@/lib/legal/radar';
import { PORTAL_TOOLS } from '@/lib/portal/tools';
import { ANSWER_FIRST_ARTICLES, articleHref } from '@/lib/portal/articles';
import { HOMEPAGE_SITUATIONS } from '@/lib/portal/situations';
import CaseJourneyPreview from '@/app/components/marketing/CaseJourneyPreview';
import ContentFinder, { type FinderItem } from '@/app/components/marketing/ContentFinder';
import styles from '@/app/components/marketing/homepage.module.css';
import { CASE_DOCUMENT_PRICE_LABEL } from '@/lib/cases/documents';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { SITE_NAV_CUSTOMER_ITEMS, SITE_NAV_ITEMS, siteNavHref } from '@/lib/site-nav';

const HOMEPAGE_BASE_URL = SITE_URL;
const HOMEPAGE_TOOLS = [
  'jaky-vztah-potrebuji',
  'checklist-pred-smlouvou-o-dilo',
  'checklist-prodeje-auta',
  'checklist-uzavreni-najmu',
]
  .map((slug) => PORTAL_TOOLS.find((tool) => tool.slug === slug))
  .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
const HOMEPAGE_RADAR = LEGAL_CHANGES.slice(0, 4);
const FEATURED_ANSWERS = ['remeslnik-nedodrzel-termin', 'viceprace-bez-souhlasu', 'koupe-ojeteho-auta', 'dpp']
  .map((slug) => ANSWER_FIRST_ARTICLES.find((article) => article.slug === slug))
  .filter((article): article is NonNullable<typeof article> => Boolean(article));

/** Lokální hledání — dotaz neopouští prohlížeč. */
const FINDER_ITEMS: FinderItem[] = [
  ...Array.from(new Map(HOMEPAGE_SITUATIONS.flatMap((situation) => situation.documents)
    .map((document) => [document.href, document])).values())
    .map((document) => ({ title: document.label, href: document.href, kind: 'Dokument' as const, keywords: '' })),
  ...PORTAL_TOOLS.map((tool) => ({ title: tool.title, href: `/nastroje/${tool.slug}`, kind: 'Nástroj zdarma' as const, keywords: tool.description })),
  ...ANSWER_FIRST_ARTICLES.map((article) => ({ title: article.title, href: articleHref(article), kind: 'Návod' as const, keywords: article.question })),
];

const HOME_DPP_POLICY = getMonetizationPolicy('dpp', 'cs');
const FREE_BASIC_DPP = isFreeBasicPolicy(HOME_DPP_POLICY);
const HOME_BASIC_PRICE_LABEL = `od ${PRICING_TIER_CONFIG.basic.priceLabel}`;
const HOME_DPP_MERCHANDISING = {
  mode: HOME_DPP_POLICY.mode,
  priceLabel: FREE_BASIC_DPP ? getFreeBasicPdfCopy('cs').priceLabel : HOME_BASIC_PRICE_LABEL,
  badgeLabel: FREE_BASIC_DPP ? 'ZÁKLADNÍ PDF ZDARMA' : null,
  subtitle: FREE_BASIC_DPP
    ? 'DPP 2026 do 300 hodin ročně. Základní PDF vytvoříte bez registrace a bez platby.'
    : null,
  experimentId: HOME_DPP_POLICY.experimentId,
  variant: HOME_DPP_POLICY.variant,
};

const homepageLanguageAlternates: Record<string, string> = {
  cs: HOMEPAGE_BASE_URL,
  'x-default': HOMEPAGE_BASE_URL,
};
for (const locale of FOREIGN_LOCALES) {
  homepageLanguageAlternates[LOCALE_META[locale].htmlLang] = `${HOMEPAGE_BASE_URL}/${LOCALE_META[locale].segment}`;
}

export const metadata: Metadata = {
  title: { absolute: 'Smlouvy online pro životní a podnikatelské situace — PDF ihned | SmlouvaHned' },
  description: FREE_BASIC_DPP
    ? 'Smlouvy online podle situace: zakázka, zaměstnávání, pronájem, auto, půjčka. 14 typů smluv dle OZ 2026, základní DPP zdarma, další od 99 Kč. Nástroje zdarma.'
    : 'Smlouvy online podle situace: zakázka, zaměstnávání, pronájem, auto, půjčka. 14 typů smluv dle OZ 2026 od 99 Kč, PDF ihned. Nástroje zdarma a radar změn 2027.',
  alternates: { canonical: HOMEPAGE_BASE_URL, languages: homepageLanguageAlternates },
  openGraph: {
    title: 'Smlouvy online pro životní a podnikatelské situace — PDF ihned',
    description: FREE_BASIC_DPP
      ? 'Vyberte, co právě řešíte. 14 typů smluv dle OZ 2026, základní DPP zdarma, další od 99 Kč. Nástroje zdarma a pokračování zakázky.'
      : 'Vyberte, co právě řešíte. 14 typů smluv dle OZ 2026 od 99 Kč, PDF ihned. Nástroje zdarma, radar změn 2027 a pokračování zakázky.',
    url: HOMEPAGE_BASE_URL,
    siteName: 'SmlouvaHned',
    type: 'website',
    locale: 'cs_CZ',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned — generování smluv online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smlouvy online pro životní a podnikatelské situace',
    description: FREE_BASIC_DPP
      ? '14 typů smluv dle OZ 2026 — základní DPP zdarma, další dokumenty od 99 Kč. Nástroje zdarma.'
      : '14 typů smluv dle OZ 2026 — formulář → PDF ihned. Od 99 Kč. Nástroje zdarma.',
    images: ['/og-image.png'],
  },
};

const faqItems = [
  {
    question: 'Jak SmlouvaHned funguje?',
    answer: 'Vyberete situaci nebo konkrétní dokument, vyplníte formulář a průběžně kontrolujete náhled. Před objednávkou vidíte zvolenou variantu a cenu. Po dokončení získáte standardizovaný dokument podle vašich vstupů.',
  },
  {
    question: 'Kolik dokument stojí?',
    answer: FREE_BASIC_DPP
      ? `Základní DPP je v aktivním experimentu zdarma. Ostatní základní dokumenty stojí ${PRICING_TIER_CONFIG.basic.priceLabel} a rozšířená varianta ${PRICING_TIER_CONFIG.complete.priceLabel}. Tematické balíčky mají cenu podle svého obsahu. ${PRICE_TRANSPARENCY_LINE}`
      : `Základní dokument stojí ${PRICING_TIER_CONFIG.basic.priceLabel} a rozšířená varianta ${PRICING_TIER_CONFIG.complete.priceLabel}. Tematické balíčky mají cenu podle svého obsahu. ${PRICE_TRANSPARENCY_LINE}`,
  },
  {
    question: 'Dostanu jen PDF?',
    answer: 'PDF je základní výstup. V checkoutu lze podle typu dokumentu přidat editovatelný DOCX, checklist před podpisem, předávací protokol, delší archiv nebo u vybraných dokumentů dvojjazyčnou vysvětlující přílohu. Některé z těchto výstupů jsou už zahrnuté v tematických balíčcích.',
  },
  {
    question: 'Musím se registrovat nebo platit předplatné?',
    answer: 'Ne. Jednotlivé dokumenty vytvoříte bez povinné registrace a bez předplatného. K zakoupeným dokumentům se můžete vrátit přes Moje dokumenty. U nájmu, převodu vozidla a smlouvy o dílo můžete volitelně pokračovat v soukromém případu pomocí bezpečného návratového odkazu.',
  },
  {
    question: 'Co jsou Moje případy a Moje zakázka?',
    answer: 'Moje případy jsou volitelné pokračování po nákupu pro pronájem, převod vozidla a smlouvu o dílo. Uložíte si stav, důležitý termín a checklist a můžete zapnout e-mailové připomínky. Moje zakázka je specializované rozhraní pro smlouvu o dílo, kde lze navíc připravovat navazující dokumenty. Přístup funguje bez povinného účtu přes bezpečný návratový odkaz.',
  },
  {
    question: 'Je SmlouvaHned advokátní kancelář?',
    answer: 'Ne. SmlouvaHned je softwarový nástroj pro sestavení standardizovaných dokumentů z vašich vstupů. Nejde o individuální právní poradenství. U nestandardních, sporných nebo hodnotově významných situací je vhodné obrátit se na advokáta.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SmlouvaHned — Generátor smluv',
  url: HOMEPAGE_BASE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'cs',
  description: 'Online softwarový nástroj pro interaktivní tvorbu a stažení standardizovaných smluvních dokumentů. Není advokátní kanceláří.',
  featureList: [
    'Rozcestník podle životní nebo podnikatelské situace',
    '14 typů standardizovaných dokumentů',
    'Interaktivní formulář s průběžným náhledem',
    'PDF po dokončení objednávky',
    'Volitelná editovatelná DOCX verze',
    'Checklisty, předávací protokoly a delší archiv podle typu dokumentu',
    'Anglická a ukrajinská nápověda u vybraných formulářů',
    'Bezplatné checklisty a rozhodovací průvodci',
    'Legislativní radar 2027 s oficiálními zdroji',
    'Moje případy pro pronájem, převod vozidla a zakázku: termíny, checklisty a připomínky',
    'Dobrovolný zákaznický účet s přihlášením a ověřeným propojením dokumentů a případů',
  ],
  provider: { '@type': 'Organization', name: 'SmlouvaHned', url: HOMEPAGE_BASE_URL },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'CZK',
    lowPrice: FREE_BASIC_DPP ? '0' : String(PRICING_TIER_CONFIG.basic.priceCzk),
    highPrice: '599',
    offerCount: FREE_BASIC_DPP ? '5' : '4',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  legalName: 'Karel Zdeněk',
  url: HOMEPAGE_BASE_URL,
  logo: `${HOMEPAGE_BASE_URL}/og-image.png`,
  description: 'Softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů online.',
  areaServed: 'CZ',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@smlouvahned.cz',
    availableLanguage: ['Czech', 'English', 'Ukrainian'],
  },
  taxID: '23660295',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SmlouvaHned',
  url: HOMEPAGE_BASE_URL,
  inLanguage: 'cs',
};

function Divider() {
  return <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-20" />;
}

export default function Home() {
  const packages = getAvailableThematicPackages();

  return (
    <main className={`${styles.home} relative min-h-screen overflow-hidden text-slate-200`}>
      <HomepageAnalyticsTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }} />

      <section className={styles.hero}>
        <div className={styles.aurora} aria-hidden="true" />
        <nav className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#040c1a]/80 text-xs font-black text-[#c9a852]">SH</div>
            <div>
              <div className="font-serif text-sm font-semibold tracking-tight text-white">SmlouvaHned</div>
              <div className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-400 sm:block">Smluvní dokumenty online</div>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-[13px] text-slate-300 md:flex">
            {SITE_NAV_ITEMS.map((item) => (
              <Link key={item.href} href={siteNavHref(item, true)} className="transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
            <details className="group relative">
              <summary className="cursor-pointer list-none rounded-lg border border-[#c9a852]/30 px-4 py-1.5 text-[#c9a852] transition hover:border-[#c9a852]/60 hover:text-[#d4b86a] [&::-webkit-details-marker]:hidden">Moje <span aria-hidden="true" className="ml-1 text-[10px] transition-transform group-open:rotate-180">▾</span></summary>
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[#c9a852]/25 bg-[#040c1a]/95 p-2 text-sm shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
                {SITE_NAV_CUSTOMER_ITEMS.map((item) => <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-white">{item.label}</Link>)}
              </div>
            </details>
            <LanguageSwitcher current="cs" variant="desktop" />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher current="cs" variant="desktop" />
            <details className="group relative">
              <summary className="flex cursor-pointer select-none list-none items-center gap-1.5 rounded-lg border border-[#c9a852]/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#c9a852] [&::-webkit-details-marker]:hidden" aria-label="Otevřít menu">
                Menu <span aria-hidden="true" className="text-[10px] transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-[#c9a852]/25 bg-[#040c1a]/95 p-2 text-sm shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
                {[...SITE_NAV_ITEMS, ...SITE_NAV_CUSTOMER_ITEMS].map((item) => (
                  <Link key={item.href} href={siteNavHref(item, true)} className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-white">{item.label}</Link>
                ))}
              </div>
            </details>
          </div>
        </nav>

        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroCapsules}>
              <span className={`${styles.capsule} ${styles.pulse}`}>Právní obsah průběžně aktualizován</span>
              <span className={`${styles.capsule} ${styles.capsuleIce}`}>PDF po dokončení objednávky</span>
              <span className={`${styles.capsule} ${styles.capsuleMint}`}>Nástroje zdarma</span>
            </div>
            <h1 className={styles.heroTitle}>
              Smlouvy online
              <span>pro důležité <em>životní</em> a podnikatelské situace</span>
            </h1>
            <p className={styles.heroLead}>Od první dohody až po poslední předání.</p>
            <p className={styles.heroDescription}>
              Vyberete dokument, doplníte údaje a před objednávkou zkontrolujete náhled i cenu.
              Po zaplacení stáhnete PDF; podle typu dokumentu lze přidat DOCX nebo další podklady.
              U nájmu, převodu vozidla a smlouvy o dílo můžete pokračovat v Moje případy — soukromém přehledu s termíny, checklistem a připomínkami.
            </p>
            <div className={styles.heroActions}>
              <TrackedLink href="#situace" eventName="situation_started" eventParams={{ surface: 'homepage_hero', cta_type: 'choose_situation' }} className={styles.primaryAction}>
                Vybrat, co řeším <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
              <Link href="#smlouvy" className={styles.secondaryAction}>Vím, jaký dokument potřebuji <span aria-hidden="true">↓</span></Link>
            </div>
            <p className={styles.heroPrice}><strong>Dokumenty {HOME_BASIC_PRICE_LABEL}</strong><span>· Rozšířená varianta od {PRICING_TIER_CONFIG.complete.priceLabel} · Bez registrace a předplatného</span></p>
            <p className={styles.heroFootnote}>{FREE_BASIC_DPP ? 'Základní DPP zdarma. ' : ''}Konkrétní cenu a obsah zvolené varianty uvidíte před objednávkou.</p>
          </div>
          <div className="lg:scale-[0.94] lg:origin-center">
            <CaseJourneyPreview documentPrice={CASE_DOCUMENT_PRICE_LABEL} includesDocuments={isFeatureEnabled('zakazkaPlus')} />
          </div>
        </div>

        <div className={`${styles.glass} ${styles.expatBar}`}>
          <p><strong>Bydlíte nebo pracujete v Česku?</strong> Nápověda také v angličtině a ukrajinštině.</p>
          <ExpatEntryLinks showBlogLink />
        </div>
        <p className={styles.scopeNote} aria-label="Rozsah služby">
          <strong>Standardizovaný dokument, ne individuální právní rada.</strong>{' '}
          SmlouvaHned skládá dokument z vašich vstupů. U sporné nebo nestandardní situace je vhodné individuální posouzení.{' '}
          <Link href="/o-projektu">Rozsah služby</Link>.
        </p>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <section id="situace" className="scroll-mt-24 pt-16 md:pt-20" aria-labelledby="situace-title">
          <div className={`${styles.sectionIntro} ${styles.reveal}`}>
            <div>
              <span className={`${styles.capsule} ${styles.capsuleQuiet} ${styles.sectionKicker}`}>01 · Co právě řešíte?</span>
              <h2 id="situace-title">Začněte svou situací, ne paragrafem</h2>
            </div>
            <p>Vyberte konkrétní situaci, nebo vyhledejte dokument, návod či bezplatný nástroj. Když už přesně víte, co potřebujete, můžete jít rovnou ke smlouvě.</p>
          </div>
          <ContentFinder items={FINDER_ITEMS} />
          <SituationGrid surface="homepage_situations" editorial />
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link href="/nastroje" className="transition-colors hover:text-white">Všechny nástroje zdarma →</Link>
            <Link href="/zmeny-2027" className="transition-colors hover:text-white">Legislativní radar 2027 →</Link>
          </div>
        </section>

        <Divider />

        <section id="jak-to-funguje" aria-labelledby="jak-to-funguje-title">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className={styles.reveal}>
              <p className="site-kicker mb-2">Jak služba funguje</p>
              <h2 id="jak-to-funguje-title" className="font-serif italic text-3xl font-bold text-[#f2e7c8] md:text-4xl">
                Od výběru dokumentu až po další krok.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Formulář slouží k sestavení dokumentu. U pronájmu, převodu vozidla a zakázky si po nákupu můžete uložit stav, termín a checklist; účet k tomu není potřeba.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { step: '01', title: 'Vyberete situaci', text: 'Dostanete relevantní dokument, návod nebo bezplatný checklist.' },
                { step: '02', title: 'Vyplníte údaje', text: 'Formulář vás provede podmínkami a průběžný náhled ukazuje vznikající dokument.' },
                { step: '03', title: 'Znáte cenu předem', text: 'Před objednávkou vidíte variantu, cenu a případné volitelné doplňky.' },
                { step: '04', title: 'Stáhnete a pokračujete', text: 'PDF získáte po dokončení objednávky. U nájmu, převodu vozidla a zakázky můžete dobrovolně založit případ a vracet se k termínům, checklistu a dalším krokům.' },
              ].map((item) => (
                <div key={item.step} className={`${styles.glass} ${styles.tile} ${styles.reveal} p-5`}>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#e8d092]">{item.step} · {item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <ProductScopeStrip className="mt-10" />

          <div className={`${styles.glass} ${styles.reveal} relative mt-6 overflow-hidden p-6 md:p-7`} aria-labelledby="moje-pripady-home-title">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-300/8 blur-3xl" aria-hidden="true" />
            <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-stretch">
              <div>
                <div className="flex items-center gap-2">
                  <p className="site-kicker">Moje případy</p>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/7 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-200">po nákupu</span>
                </div>
                <h3 id="moje-pripady-home-title" className="mt-3 max-w-2xl font-serif text-2xl font-semibold text-[#f2e7c8] md:text-3xl">
                  Po zaplacení máte další kroky pod kontrolou.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  U nájmu, převodu vozidla a smlouvy o dílo můžete po zaplacení uložit stav, důležitý termín a checklist.
                  U zakázky navíc navazují další dokumenty.
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {[
                    { no: '01', title: 'Pronájem', text: 'Předání bytu a vypořádání jistoty.' },
                    { no: '02', title: 'Převod vozidla', text: 'Předání, přepis a dokončení převodu.' },
                    { no: '03', title: 'Zakázka', text: 'Fáze, termín a navazující dokumenty.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/8 bg-black/15 p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[9px] font-black tracking-[0.15em] text-[#d8bd73]">{item.no}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/70 shadow-[0_0_10px_rgba(110,231,183,.45)]" aria-hidden="true" />
                      </div>
                      <div className="mt-2 text-xs font-semibold text-white">{item.title}</div>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Link href="/moje-pripady" className="text-sm font-bold text-[#e8d092] transition hover:text-white">
                    Otevřít Moje případy →
                  </Link>
                  <span className="text-xs text-slate-500">Přístup přes návratový odkaz, bez povinného účtu.</span>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-[#07111e]/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.07)] md:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Příklad přehledu</p>
                    <p className="mt-1 font-serif text-xl font-semibold text-white">Pronájem bytu</p>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/8 px-2.5 py-1 text-[9px] font-bold text-emerald-200">Aktivní</span>
                </div>
                <div className="mt-5 space-y-2.5">
                  {[
                    ['Další krok', 'Předání bytu'],
                    ['Termín', '30. 9. 2026'],
                    ['Checklist', '3 z 5 hotovo'],
                    ['Připomínka', 'Zapnuta'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/6 bg-white/[0.025] px-3.5 py-3">
                      <span className="text-[11px] text-slate-500">{label}</span>
                      <span className="text-xs font-semibold text-slate-200">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] leading-5 text-slate-500">
                  Ukázka rozhraní. Skutečný obsah se liší podle typu případu.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        <section id="smlouvy" className="scroll-mt-24" aria-labelledby="smlouvy-title">
          <div className="mb-9 max-w-2xl">
            <p className="site-kicker mb-2">Dokumenty online</p>
            <h2 id="smlouvy-title" className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Víte, jaký dokument potřebujete?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Vyberte přímo z katalogu. Základní cena je viditelná už na kartě dokumentu; před platbou vždy uvidíte přesnou cenu zvolené varianty.
            </p>
          </div>
          <ContractGridPremium dppMerchandising={HOME_DPP_MERCHANDISING} />
        </section>

        <section id="balicky" className="mt-14 scroll-mt-24" aria-labelledby="balicky-title">
          <div className="max-w-2xl">
            <p className="site-kicker mb-2">Více dokumentů v jednom toku</p>
            <h2 id="balicky-title" className="font-serif italic text-3xl font-bold text-[#f2e7c8] md:text-4xl">Balíčky pro celý praktický scénář</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">Hlavní smlouva a navazující podklady pohromadě. Obsah i cena jsou u každého balíčku uvedené předem.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {packages.map((item) => (
              <article key={item.key} className={`${styles.glass} ${styles.tile} ${styles.reveal} flex h-full flex-col p-6 ${item.key === 'employer_start' ? '!border-[#c9a852]/45' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a852]">{item.key === 'employer_start' ? 'Personální balíček' : item.badge}</p>
                  <span className="shrink-0 text-sm font-semibold text-white">{item.priceLabel}</span>
                </div>
                <h3 className="mt-4 font-serif italic text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 flex-grow text-sm leading-7 text-slate-400">{item.comparisonNote}</p>
                <TrackedLink
                  href={item.href}
                  eventName="homepage_package_click"
                  eventParams={{ package_key: item.key, price_band: getEffectivePriceBand('complete', item.key), destination: item.href, surface: 'homepage_packages' }}
                  className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#c9a852]/35 bg-[#c9a852]/10 px-4 py-3 text-sm font-bold text-[#e2c77b] transition hover:border-[#c9a852]/65 hover:bg-[#c9a852]/15"
                >
                  Zobrazit obsah balíčku →
                </TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        <section id="pomoc-zdarma" aria-labelledby="pomoc-zdarma-title">
          <div className="mb-9 max-w-2xl">
            <p className="site-kicker mb-2">Pomoc zdarma</p>
            <h2 id="pomoc-zdarma-title" className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Nejdřív si ujasněte postup</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">Návody, checklisty a legislativní radar jsou zdarma. Nevyžadují e-mail ani registraci.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-serif italic text-2xl font-bold text-white">Praktické nástroje</h3>
                  <Link href="/nastroje" className="text-sm font-semibold text-[#c9a852] hover:text-[#f2d58a]">Všechny nástroje →</Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {HOMEPAGE_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/nastroje/${tool.slug}`} className={`${styles.glass} ${styles.tile} ${styles.toolTile}`}>
                      <small>{tool.kind === 'wizard' ? 'Průvodce' : 'Checklist'}</small>
                      <strong>{tool.title}</strong>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-serif italic text-2xl font-bold text-white">Konkrétní odpovědi</h3>
                  <Link href="/blog" className="text-sm font-semibold text-[#c9a852] hover:text-[#f2d58a]">Další průvodce →</Link>
                </div>
                <div className={styles.readingList}>
                  {FEATURED_ANSWERS.map((article) => (
                    <TrackedLink key={article.slug} href={articleHref(article)} eventName="situation_started" eventParams={{ surface: 'homepage_answers', portal_situation: article.situation, cta_type: 'read_guide' }} className={`${styles.glass} ${styles.tile}`}>
                      <span><small>Návod zdarma</small>{article.question}</span>
                      <ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" />
                    </TrackedLink>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${styles.glass} ${styles.reveal} h-fit p-6`}>
              <span className={`${styles.capsule} ${styles.capsuleIce} ${styles.sectionKicker}`}>Legislativní radar 2027</span>
              <h3 className="font-serif italic text-2xl font-bold text-[#f2e7c8]">Co dnes platí a co se mění</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">U jednotlivých změn rozlišujeme účinná pravidla, schválené změny a návrhy. Každá položka uvádí oficiální zdroj a datum kontroly. U konkrétní změny si můžete zdarma zapnout e-mailové upozornění na změnu jejího statusu nebo data účinnosti.</p>
              <ul className="mt-5 space-y-4">
                {HOMEPAGE_RADAR.map((change) => (
                  <li key={change.key} className="border-b border-white/6 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/zmeny-2027#${change.key}`} className="text-sm leading-6 text-slate-300 transition-colors hover:text-white">{change.title}</Link>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${change.status === 'in_force' ? 'border-emerald-500/40 text-emerald-300' : change.status === 'approved_pending' ? 'border-sky-500/40 text-sky-300' : 'border-amber-500/40 text-amber-300'}`}>
                        {LEGAL_CHANGE_STATUS_LABELS[change.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/zmeny-2027" className="mt-5 inline-block text-sm font-semibold text-[#c9a852] hover:text-[#f2d58a]">Otevřít celý radar →</Link>
            </div>
          </div>
        </section>

        <DifferentiationSection />

        <Divider />

        <section id="faq" aria-labelledby="faq-title">
          <div className="mb-8 max-w-2xl">
            <p className="site-kicker mb-2">FAQ</p>
            <h2 id="faq-title" className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Časté otázky před vytvořením dokumentu</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className={`${styles.glass} group p-5 open:border-[rgba(214,172,96,0.35)]`}>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[15px] font-semibold text-white">{item.question}</span>
                    <span className="shrink-0 text-[#c9a852]/50 transition-transform duration-200 group-open:rotate-45 group-open:text-[#c9a852]">+</span>
                  </div>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <div className={`${styles.glass} relative overflow-hidden`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,168,82,0.08),transparent_60%)]" />
            <div className="relative px-8 py-11 text-center md:py-14">
              <p className="site-kicker mb-3">Začněte podle své situace</p>
              <h2 className="mx-auto max-w-3xl font-serif italic text-3xl font-bold text-[#f2e7c8] md:text-4xl">Vyberte, co právě řešíte. Dokument až ve chvíli, kdy dává smysl.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">Bez povinné registrace. Cenu a obsah varianty uvidíte před objednávkou.</p>
              <TrackedLink href="#situace" eventName="situation_started" eventParams={{ surface: 'homepage_final_cta', cta_type: 'choose_situation' }} className={`${styles.primaryAction} mt-7`}>
                Vybrat, co řeším <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
