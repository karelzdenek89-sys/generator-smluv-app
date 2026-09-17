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
import { SEO_LANDINGS, CLUSTER_LABELS, type ClusterKey } from '@/lib/internal-links';
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
/** Lokální hledání napříč dokumenty, nástroji a návody — bez odesílání dotazu na server. */
const FINDER_ITEMS: FinderItem[] = [
  ...Array.from(new Map(HOMEPAGE_SITUATIONS.flatMap(situation => situation.documents)
    .map(document => [document.href, document])).values())
    .map(document => ({ title: document.label, href: document.href, kind: 'Dokument' as const, keywords: '' })),
  ...PORTAL_TOOLS.map(tool => ({ title: tool.title, href: `/nastroje/${tool.slug}`, kind: 'Nástroj zdarma' as const, keywords: tool.description })),
  ...ANSWER_FIRST_ARTICLES.map(article => ({ title: article.title, href: articleHref(article), kind: 'Návod' as const, keywords: article.question })),
];
const FEATURED_ANSWERS = ['remeslnik-nedodrzel-termin', 'viceprace-bez-souhlasu', 'koupe-ojeteho-auta', 'dpp']
  .map(slug => ANSWER_FIRST_ARTICLES.find(article => article.slug === slug))
  .filter((article): article is NonNullable<typeof article> => Boolean(article));
/** Čísla pod hero jsou odvozená z dat, ne opsaná: katalog, návody, nástroje, radar. */
const HOMEPAGE_STATS = [
  { value: '14', label: 'typů dokumentů' },
  { value: String(ANSWER_FIRST_ARTICLES.length), label: 'návodů zdarma' },
  { value: String(PORTAL_TOOLS.length), label: 'nástrojů zdarma' },
  { value: String(LEGAL_CHANGES.length), label: 'sledovaných změn 2027' },
] as const;
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
for (const l of FOREIGN_LOCALES) {
  homepageLanguageAlternates[LOCALE_META[l].htmlLang] = `${HOMEPAGE_BASE_URL}/${LOCALE_META[l].segment}`;
}

export const metadata: Metadata = {
  title: { absolute: 'Smlouvy online pro životní a podnikatelské situace — PDF ihned | SmlouvaHned' },
  description:
    FREE_BASIC_DPP
      ? 'Smlouvy online podle situace: zakázka, zaměstnávání, pronájem, auto, půjčka. 14 typů smluv dle OZ 2026, základní DPP zdarma, další od 99 Kč. Nástroje zdarma.'
      : 'Smlouvy online podle situace: zakázka, zaměstnávání, pronájem, auto, půjčka. 14 typů smluv dle OZ 2026 od 99 Kč, PDF ihned. Nástroje zdarma a radar změn 2027.',
  alternates: { canonical: HOMEPAGE_BASE_URL, languages: homepageLanguageAlternates },
  openGraph: {
    title: 'Smlouvy online pro životní a podnikatelské situace — PDF ihned',
    description:
      FREE_BASIC_DPP
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
    question: 'Jsou dokumenty připraveny k podpisu?',
    answer: 'Výstupem je kompletně vyplněný PDF dokument strukturovaný podle příslušné české právní úpravy pro daný typ dokumentu. Obsah dokumentu závisí na vašich vstupech — před podpisem doporučujeme všechna data zkontrolovat.',
  },
  {
    question: 'Čím se liší Základní dokument od Rozšířeného dokumentu?',
    answer: 'Základní dokument obsahuje povinná strukturální ustanovení. Rozšířený dokument přidává klauzule o smluvních pokutách za porušení povinností, podrobnější odpovědnostní ustanovení a sankční mechanismy pro případ nesplnění závazku.',
  },
  {
    question: 'Jak celý proces funguje?',
    answer: 'Vyberete typ smlouvy, vyplníte formulář krok za krokem a vygenerujete dokument. Po dokončení obdržíte hotové PDF ke stažení. U tematického balíčku také průvodní instrukce a checklist.',
  },
  {
    question: 'Jak dokument získám?',
    answer: FREE_BASIC_DPP
      ? 'Základní DPP v aktivním experimentu vygenerujete bez platby a bez registrace; zabezpečený odkaz ke stažení platí 24 hodin. U placených dokumentů získáte PDF ihned po dokončení platby, základní dokument na 7 dní a rozšířený na 30 dní.'
      : 'Ihned po dokončení platby obdržíte odkaz ke stažení vygenerovaného PDF. Platnost odkazu: Základní dokument 7 dní, Rozšířený dokument 30 dní. U Rozšířeného dokumentu také praktické podklady k podpisu a archivaci. U tematických balíčků také předávací dokumentace a checklist.',
  },
  {
    question: 'Jsou bezpečně uložena moje data?',
    answer: FREE_BASIC_DPP
      ? 'Údaje bezplatné základní DPP jsou v šifrovaném úložišti dostupné 24 hodin. U placených dokumentů je doba 7–30 dní, případně 90 dní s doplňkem archivace; poté se data automaticky smažou. Volitelná Moje zakázka (jen u smlouvy o dílo) se uchovává 12 měsíců od poslední změny, uzavřená 6 měsíců. Platební údaje zpracovává výhradně Stripe.'
      : 'Údaje dokumentu jsou uloženy pouze dočasně v šifrovaném úložišti po dobu 7–30 dní dle zakoupeného dokumentu, případně 90 dní s doplňkem archivace, a poté automaticky smazány. Volitelná Moje zakázka (jen u smlouvy o dílo) se uchovává 12 měsíců od poslední změny, uzavřená 6 měsíců, a kdykoli ji můžete smazat. Platební údaje zpracovává výhradně Stripe — na naše servery se nikdy nedostanou.',
  },
  {
    question: 'Je to náhrada individuální právní služby?',
    answer: 'Ne. Dokumenty na tomto webu představují standardní smluvní vzory pro typické situace. Nejsou náhradou za individuální právní poradenství. V případě nestandardních nebo složitějších případů doporučujeme konzultaci s advokátem.',
  },
  {
    question: 'Co je „Moje zakázka“ a musím se registrovat?',
    answer: 'Po zaplacení smlouvy o dílo můžete zakázku uložit jako případ: uvidíte termín, fázi, doporučené kroky a dostanete připomínky před termínem předání. Navazující dokumenty (změnový list, vícepráce, předávací protokol, vady) vytvoříte přímo v zakázce. Registrace není potřeba — vracíte se odkazem z e-mailu, zakázku můžete kdykoli smazat.',
  },
  {
    question: 'Jsou nástroje a legislativní radar zdarma?',
    answer: 'Ano. Checklisty, rozhodovací průvodci i radar změn 2027 jsou bezplatné a nevyžadují e-mail ani registraci. Platíte pouze za vygenerovaný dokument. ' + PRICE_TRANSPARENCY_LINE,
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
  url: HOMEPAGE_BASE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'cs',
  description: 'Online softwarový nástroj pro interaktivní tvorbu a stažení standardizovaných smluvních dokumentů — nájemní smlouva, kupní smlouva, NDA a další. Výstup ve formátu PDF. Není advokátní kanceláří.',
  featureList: [
    'Rozcestník podle životní nebo podnikatelské situace',
    'Bezplatné checklisty a rozhodovací průvodci',
    'Legislativní radar 2027 s explicitním statusem změn a oficiálními zdroji',
    'Pokračování zakázky: termíny, připomínky a navazující dokumenty (Moje zakázka)',
    'Interaktivní formulář pro tvorbu smluvních dokumentů',
    'Okamžitý export do PDF',
    '14 typů standardizovaných dokumentů',
    'Citace konkrétních paragrafů OZ a zákoníku práce přímo v dokumentu',
    'Upozornění na typicky problematické volby ve formuláři (bez individuálního posouzení)',
    'Ochranné klauzule a smluvní sankce v rozšířené variantě',
    'Šablony průběžně aktualizované pro českou legislativu v roce 2026',
    FREE_BASIC_DPP
      ? 'Šifrované dočasné úložiště dat — základní DPP 24 hodin, placené dokumenty 7–30 dní'
      : 'Šifrované dočasné úložiště dat — automatické smazání po 7–30 dnech',
  ],
  provider: { '@type': 'Organization', name: 'SmlouvaHned', url: HOMEPAGE_BASE_URL },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'CZK',
    lowPrice: FREE_BASIC_DPP ? '0' : '99',
    highPrice: '599',
    offerCount: FREE_BASIC_DPP ? '5' : '4',
    offers: [
      ...(FREE_BASIC_DPP
        ? [{ '@type': 'Offer', name: 'Základní DPP', price: '0', priceCurrency: 'CZK' }]
        : []),
      { '@type': 'Offer', name: 'Základní dokument', price: '99', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Rozšířený dokument', price: '199', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Tematický balíček', price: '299', priceCurrency: 'CZK' },
      { '@type': 'Offer', name: 'Zaměstnavatel Start 2026', price: '599', priceCurrency: 'CZK' },
    ],
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
    availableLanguage: 'Czech',
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

export default function Home() {
  return (
    <main className={`${styles.home} relative min-h-screen overflow-hidden text-slate-200`}>
      <HomepageAnalyticsTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }} />

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.aurora} aria-hidden="true" />
        {/* Navbar */}
        <nav className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#040c1a]/80 text-xs font-black text-[#c9a852]">
              SH
            </div>
            <div>
              <div className="font-serif text-sm font-semibold tracking-tight text-white">SmlouvaHned</div>
              <div className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:block">Smluvní dokumenty online</div>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-[13px] text-slate-400 md:flex">
            <Link href="#situace" className="hover:text-white transition-colors duration-150">Situace</Link>
            <Link href="#smlouvy" className="hover:text-white transition-colors duration-150">Dokumenty</Link>
            <Link href="/nastroje" className="hover:text-white transition-colors duration-150">Nástroje</Link>
            <Link href="/zmeny-2027" className="hover:text-white transition-colors duration-150">Změny 2027</Link>
            <Link href="/blog" className="hover:text-white transition-colors duration-150">Blog</Link>
            <Link href="/zakaznicka-zona"
              className="rounded-lg border border-[#c9a852]/30 px-4 py-1.5 text-[#c9a852] transition-all duration-200 hover:border-[#c9a852]/60 hover:text-[#d4b86a]">
              Moje dokumenty
            </Link>
            <LanguageSwitcher current="cs" variant="desktop" />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher current="cs" variant="desktop" />
            {/* Mobilní menu bez JS: stejné vstupy jako na desktopu (Situace, Dokumenty, Nástroje, Změny 2027, Blog). */}
            <details className="group relative">
              <summary
                className="flex cursor-pointer select-none list-none items-center gap-1.5 rounded-lg border border-[#c9a852]/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#c9a852] [&::-webkit-details-marker]:hidden"
                aria-label="Otevřít menu"
              >
                Menu <span aria-hidden="true" className="text-[10px] transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-[#c9a852]/25 bg-[#040c1a]/95 p-2 text-sm shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
                {[
                  { href: '#situace', label: 'Situace' },
                  { href: '#smlouvy', label: 'Dokumenty' },
                  { href: '/nastroje', label: 'Nástroje zdarma' },
                  { href: '/zmeny-2027', label: 'Změny 2027' },
                  { href: '/blog', label: 'Blog' },
                  { href: '/zakaznicka-zona', label: 'Moje dokumenty' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </nav>

        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroCapsules}>
              <span className={`${styles.capsule} ${styles.pulse}`}>Legislativa 2026 · aktualizováno</span>
              <span className={`${styles.capsule} ${styles.capsuleIce}`}>PDF ihned po platbě</span>
              <span className={`${styles.capsule} ${styles.capsuleMint}`}>Návody a nástroje zdarma</span>
            </div>
            <h1 className={styles.heroTitle}>
              Smlouvy online
              <span>pro důležité <em>životní</em> a podnikatelské situace</span>
            </h1>
            <p className={styles.heroLead}>Od první dohody až po poslední předání.</p>
            <p className={styles.heroDescription}>
              Pronajímáte byt, zadáváte práci nebo prodáváte auto? Nejdřív zjistíte postup a cenu,
              pak si připravíte smlouvu. U smlouvy o dílo můžete pokračovat v Moje zakázka —
              termín, připomínky a další dokumenty na jednom místě.
            </p>
            <div className={styles.heroActions}>
              <TrackedLink href="#situace" eventName="situation_started" eventParams={{ surface: 'homepage_hero', cta_type: 'choose_situation' }} className={styles.primaryAction}>
                Vybrat, co řeším <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
              <Link href="#smlouvy" className={styles.secondaryAction}>Vím, jaký dokument potřebuji <span aria-hidden="true">↓</span></Link>
            </div>
            <p className={styles.heroPrice}><strong>Dokumenty {HOME_BASIC_PRICE_LABEL}</strong><span>· Rozšířená varianta od {PRICING_TIER_CONFIG.complete.priceLabel} · Bez registrace a předplatného</span></p>
            <p className={styles.heroFootnote}>{FREE_BASIC_DPP ? 'Základní DPP zdarma. ' : ''}Konkrétní doporučení podle zadané situace uvidíte před objednávkou.</p>
          </div>
          <CaseJourneyPreview documentPrice={CASE_DOCUMENT_PRICE_LABEL} includesDocuments={isFeatureEnabled('zakazkaPlus')} />
        </div>
        <div className={styles.stats} aria-label="Rozsah obsahu">
          {HOMEPAGE_STATS.map((item) => (
            <div key={item.label} className={`${styles.glass} ${styles.stat}`}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className={`${styles.glass} ${styles.expatBar}`}>
          <p><strong>Bydlíte nebo pracujete v Česku?</strong> Nápověda také v angličtině a ukrajinštině.</p>
          <ExpatEntryLinks showBlogLink />
        </div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:px-10">

        {/* ── SITUACE ──────────────────────────────────────────────────────────── */}
        <section id="situace" className="scroll-mt-24 pt-16 md:pt-20" aria-labelledby="situace-title">
          <div className={`${styles.sectionIntro} ${styles.reveal}`}>
            <div><span className={`${styles.capsule} ${styles.capsuleQuiet} ${styles.sectionKicker}`}>01 · Co právě řešíte?</span>
              <h2 id="situace-title">Začněte svou situací, ne paragrafem</h2>
            </div>
            <p>Rovnou ke smlouvě, nebo nejdřív k návodu. U zakázky, zaměstnávání, auta a pronájmu také k bezplatnému checklistu či průvodci. {PRICE_TRANSPARENCY_LINE}</p>
          </div>
          <ContentFinder items={FINDER_ITEMS} />
          <SituationGrid surface="homepage_situations" editorial />
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link href="/zmeny-2027" className="transition-colors hover:text-white">Sleduji změny zákonů → Legislativní radar 2027</Link>
            <Link href="/nastroje" className="transition-colors hover:text-white">Všechny nástroje zdarma →</Link>
          </div>
        </section>

        <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-20" />

        {/* ── ODPOVĚDI ─────────────────────────────────────────────────────────── */}
        <section id="odpovedi" aria-labelledby="odpovedi-title">
          <div className={`${styles.sectionIntro} ${styles.reveal}`}>
            <div><span className={`${styles.capsule} ${styles.capsuleQuiet} ${styles.sectionKicker}`}>02 · Nejdřív odpověď</span><h2 id="odpovedi-title">Když nevíte, jak dál</h2></div>
            <p>Konkrétní otázky, srozumitelný postup a odkazy na oficiální zdroje. Návody si přečtete zdarma, bez registrace.</p>
          </div>
          <div className={`${styles.readingList} ${styles.reveal}`}>
            {FEATURED_ANSWERS.map(article => (
              <TrackedLink key={article.slug} href={articleHref(article)} eventName="situation_started" eventParams={{ surface: 'homepage_answers', portal_situation: article.situation, cta_type: 'read_guide' }} className={`${styles.glass} ${styles.tile}`}>
                <span><small>{article.situation === 'zakazka' ? 'Zakázka' : article.situation === 'auto' ? 'Prodej a koupě auta' : 'Zaměstnávání'} · Návod zdarma</small>{article.question}</span>
                <ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" />
              </TrackedLink>
            ))}
          </div>
        </section>

        <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-20" />

        {/* ── NÁSTROJE ZDARMA + RADAR ──────────────────────────────────────────── */}
        <section id="nastroje" className="scroll-mt-24" aria-labelledby="nastroje-title">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className={styles.reveal}>
              <span className={`${styles.capsule} ${styles.capsuleMint} ${styles.sectionKicker}`}>03 · Nástroje zdarma</span>
              <h2 id="nastroje-title" className="font-serif italic text-3xl font-bold text-[#f2e7c8] md:text-4xl">Rozhodněte se dřív, než něco zaplatíte</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-400">
                Checklisty a průvodci dají výsledek hned — bez e-mailu a bez registrace.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {HOMEPAGE_TOOLS.map((tool) => (
                  <Link key={tool.slug} href={`/nastroje/${tool.slug}`} className={`${styles.glass} ${styles.tile} ${styles.toolTile}`}>
                    <small>{tool.kind === 'wizard' ? 'Průvodce' : 'Checklist'}</small>
                    <strong>{tool.title}</strong>
                  </Link>
                ))}
              </div>
              <Link href="/nastroje" className="mt-5 inline-block text-sm font-semibold text-[#c9a852] transition-colors hover:text-[#f2d58a]">
                Všechny nástroje →
              </Link>
            </div>
            <div className={`${styles.glass} ${styles.reveal} p-6`}>
              <span className={`${styles.capsule} ${styles.capsuleIce} ${styles.sectionKicker}`}>Legislativní radar 2027</span>
              <h3 className="font-serif italic text-2xl font-bold text-[#f2e7c8]">Co platí, co je schválené a co se teprve projednává</h3>
              <ul className="mt-4 space-y-3">
                {HOMEPAGE_RADAR.map((change) => (
                  <li key={change.key} className="flex items-start justify-between gap-3 text-sm">
                    <Link href={`/zmeny-2027#${change.key}`} className="text-slate-300 transition-colors hover:text-white">{change.title}</Link>
                    <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      change.status === 'in_force' ? 'border-emerald-500/40 text-emerald-300' : change.status === 'approved_pending' ? 'border-sky-500/40 text-sky-300' : 'border-amber-500/40 text-amber-300'
                    }`}>
                      {LEGAL_CHANGE_STATUS_LABELS[change.status]}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">Každá položka má datum účinnosti, oficiální zdroj a datum poslední kontroly.</p>
              <Link href="/zmeny-2027" className="mt-4 inline-block text-sm font-semibold text-[#c9a852] transition-colors hover:text-[#f2d58a]">
                Otevřít radar 2027 →
              </Link>
            </div>
          </div>
        </section>

        <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-20" />

        {/* ── PROPOJENÉ DOKUMENTY ──────────────────────────────────────────────── */}
        <section id="propojene-dokumenty" className="scroll-mt-24" aria-labelledby="propojene-title">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="site-kicker mb-2">Výhoda propojených dokumentů</p>
              <h2 id="propojene-title" className="font-serif italic text-3xl font-bold text-[#f2e7c8] md:text-4xl">
                Neprodáváme PDF. Pomáháme vyřídit celou situaci.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                Smlouva je jen začátek. U zakázky přijde změna rozsahu, vícepráce, předání a někdy vady.
                U pronájmu předání bytu, kauce a ukončení. Dokumenty na sebe navazují; u smlouvy o dílo můžete pokračovat v Moje zakázka s termínem, připomínkami a dalšími dokumenty.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {[
                  'Odpověď na otázku dřív, než cokoli vyplníte',
                  'Bezplatný checklist nebo průvodce k rozhodnutí',
                  'Dokument sestavený podle vašich údajů, PDF ihned',
                  'U zakázky pokračování s termíny, připomínkami a navazujícími dokumenty',
                ].map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-[#c9a852]">✓</span><span>{item}</span></li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/zakazka" className="site-button-primary">Jak funguje Moje zakázka →</Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { step: 'Odpověď', text: 'Články a odpovědi s oficiálními zdroji a datem ověření.' },
                { step: 'Rozhodnutí', text: 'Checklisty a průvodci, které dají výsledek bez e-mailu.' },
                { step: 'Dokument', text: '14 typů smluv, transparentní cena, PDF po platbě.' },
                { step: 'Případ', text: 'Termíny, připomínky a navazující dokumenty v jednom průběhu (u smlouvy o dílo).' },
              ].map((item, index) => (
                <div key={item.step} className={`${styles.glass} ${styles.tile} ${styles.reveal} p-5`}>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#e8d092]"><span className="text-slate-500">0{index + 1}</span>{item.step}</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DifferentiationSection />

        <ProductScopeStrip className="mt-10" />

        <section id="balicky" className="mt-14 scroll-mt-24" aria-labelledby="balicky-title">
          <div className="max-w-2xl">
            <p className="site-kicker mb-2">Více dokumentů v jednom toku</p>
            <h2 id="balicky-title" className="font-serif italic text-3xl font-bold text-[#f2e7c8] md:text-4xl">
              Balíčky pro celý praktický scénář
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              K hlavní smlouvě dostanete i navazující dokumenty, které se při předání nebo nástupu běžně řeší zvlášť.
            </p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {getAvailableThematicPackages().map((item) => (
              <article
                key={item.key}
                className={`${styles.glass} ${styles.tile} ${styles.reveal} flex h-full flex-col p-6 ${
                  item.key === 'employer_start' ? '!border-[#c9a852]/45' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a852]">
                    {item.key === 'employer_start' ? 'Novinka · personální balíček' : item.badge}
                  </p>
                  <span className="text-sm font-semibold text-white">Placený balíček</span>
                </div>
                <h3 className="mt-4 font-serif italic text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 flex-grow text-sm leading-7 text-slate-400">{item.comparisonNote}</p>
                <TrackedLink
                  href={item.href}
                  eventName="homepage_package_click"
                  eventParams={{
                    package_key: item.key,
                    price_band: getEffectivePriceBand('complete', item.key),
                    destination: item.href,
                    surface: 'homepage_packages',
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#c9a852]/35 bg-[#c9a852]/10 px-4 py-3 text-sm font-bold text-[#e2c77b] transition hover:border-[#c9a852]/65 hover:bg-[#c9a852]/15"
                >
                  Zobrazit obsah balíčku →
                </TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── CONTRACT SELECTION ─────────────────────────────────────────────── */}
        <section id="smlouvy" className="pt-0 md:pt-0">
          <div className="mb-10 max-w-xl">
            <p className="site-kicker mb-2">Katalog dokumentů</p>
            <h2 className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Vyberte typ dokumentu</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              {FREE_BASIC_DPP
                ? `14 typů smluv sestavených podle vašich údajů. Základní DPP vytvoříte zdarma, ostatní dokumenty ${HOME_BASIC_PRICE_LABEL}.`
                : `14 typů smluv sestavených podle vašich údajů. Stažení je placené. ${PRICE_TRANSPARENCY_LINE}`}
              {' '}
              Průběžně aktualizováno pro českou legislativu v roce 2026.
            </p>
          </div>
          <ContractGridPremium dppMerchandising={HOME_DPP_MERCHANDISING} />

          <div
            className="mt-10 rounded-2xl border border-[#c9a852]/25 bg-[#0c1426]/90 p-6 md:p-8"
            aria-labelledby="expat-catalog-heading"
          >
            <p className="site-kicker mb-2">For foreigners · Для іноземців</p>
            <h3
              id="expat-catalog-heading"
              className="font-serif italic text-2xl font-bold text-white md:text-3xl"
            >
              Jste cizinec v ČR? Formuláře s nápovědou v angličtině nebo ukrajinštině
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Přehled hlavních smluv (nájem, práce, auto, plná moc) s vysvětlením v cizím jazyce.
              PDF zůstává v češtině; u vybraných smluv může být přiložen orientační překlad (ne úřední).
            </p>
            <ExpatEntryLinks className="mt-5 flex flex-wrap gap-2" showBlogLink />
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#c9a852]/20 to-transparent md:my-24" />

        {/* ── GUIDES INDEX (interní linkbuilding) ───────────────────────────── */}
        <section id="pruvodci" aria-labelledby="pruvodci-title">
          <div className="mb-10 max-w-2xl">
            <p className="site-kicker mb-2">Průvodci a vzory smluv</p>
            <h2 id="pruvodci-title" className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">
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
                    {items.slice(0, 3).map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-slate-300 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {items.length > 3 ? (
                      <li>
                        <Link href="/blog" className="text-sm font-semibold text-[#c9a852] hover:text-[#f2d58a] transition-colors">
                          Další průvodce na blogu →
                        </Link>
                      </li>
                    ) : null}
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
            <h2 className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Od situace k hotovému dokumentu</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {[
              { step: '01', title: 'Vyberete situaci', desc: 'Dostanete stručnou odpověď, postup a bezplatný checklist nebo průvodce. Teprve potom se rozhodnete, zda potřebujete dokument.' },
              { step: '02', title: 'Vyplníte údaje', desc: 'Zadáte strany, podmínky a hodnoty dohody. Formulář vás provede každou důležitou částí bez právního žargonu; cenu znáte předem.' },
              { step: '03', title: 'Zkontrolujete a zaplatíte', desc: 'Před platbou vidíte souhrn a přesnou cenu. Zvolíte variantu — Základní, Rozšířený nebo tematický balíček.' },
              { step: '04', title: 'Stáhnete PDF a pokračujete', desc: 'PDF připravené k podpisu ihned. U zakázky můžete pokračovat s termíny, připomínkami a navazujícími dokumenty.' },
            ].map(s => (
              <div key={s.step} className={`${styles.glass} ${styles.tile} ${styles.reveal} p-6`}>
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#c9a852]/40 bg-[#c9a852]/10 text-sm font-bold text-[#e8d092] shadow-[0_0_16px_rgba(197,160,89,0.25)]">
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
            <h2 className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Komu SmlouvaHned pomůže</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Pronajímatelé', desc: 'Nájemní a podnájemní smlouvy s předávacím protokolem. Jasná pravidla pro kauce, zvířata a Airbnb.' },
              { title: 'Podnikatelé a OSVČ', desc: 'Smlouvy o dílo, o spolupráci, o službách, NDA. Ochrana know-how, smluvní pokuty, exit klauzule.' },
              { title: 'Zaměstnavatelé', desc: 'Pracovní smlouvy a DPP se zákonnou strukturou dle zákoníku práce 2026 a navazující nástupní dokumentace.' },
              { title: 'Fyzické osoby', desc: 'Darovací smlouvy, kupní smlouvy, uznání dluhu, plné moci. Bezpečné transakce i mimo rodinu.' },
            ].map(c => (
              <div key={c.title} className={`${styles.glass} ${styles.tile} ${styles.reveal} p-6`}>
                <h3 className="mb-2 font-serif italic text-base font-semibold text-[#e8d092]">{c.title}</h3>
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
              <h2 className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Než smlouvu vytvoříte</h2>
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
              <div key={a.href} className={`${styles.glass} ${styles.tile} ${styles.reveal} flex flex-col overflow-hidden`}>
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
            <h2 className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">Časté otázky</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map(item => (
              <details key={item.question} className={`${styles.glass} group p-5 open:border-[rgba(214,172,96,0.35)]`}>
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
          <div className={`${styles.glass} relative overflow-hidden`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,168,82,0.08),transparent_60%)]" />
            <div className="relative px-8 py-12 text-center md:py-14">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a852]">Začít</p>
              <h2 className="font-serif italic text-4xl font-bold text-[#f2e7c8] md:text-5xl">
                Co právě řešíte?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                Vyberte situaci, získejte odpověď a postup, a když je čas na dokument, vyplníte přehledný formulář.
                Výstupem je standardizovaný smluvní dokument připravený k podpisu — s možností pokračovat v celé situaci.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="#situace" className="site-button-primary">
                  Vybrat, co řeším <span>→</span>
                </a>
                <a href="#smlouvy" className="site-button-secondary">
                  Vybrat typ smlouvy
                </a>
              </div>
            </div>
          </div>
        </section>


      </div>
    </main>
  );
}
