import TrackedLink from '@/app/components/analytics/TrackedLink';
import ProductPathGuide, { type ProductPathGuideItem } from './ProductPathGuide';
import SiteFaqSection from './SiteFaqSection';
import TrustOutputBlock from './TrustOutputBlock';
import RelatedContracts from './RelatedContracts';
import type { ClusterKey } from '@/lib/internal-links';

type GuideFaq = {
  q: string;
  a: string;
};

type GuideItem = {
  title: string;
  text: string;
};

type GuideLandingTrackingContext = {
  pageType: 'situation' | 'package';
  pageKey: 'landlord' | 'vehicle_sale';
};

type GuideLandingPageProps = {
  breadcrumbLabel: string;
  kicker: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  summary: string[];
  suitableFor: GuideItem[];
  contents: GuideItem[];
  suitableSectionLabel?: string;
  suitableSectionTitle?: string;
  contentsSectionLabel?: string;
  contentsSectionTitle?: string;
  mistakesTitle?: string;
  mistakes?: string[];
  faq: GuideFaq[];
  bottomLinks?: { href: string; label: string }[];
  decisionGuide?: {
    label: string;
    title: string;
    intro?: string;
    note?: string;
    items: readonly ProductPathGuideItem[];
  };
  trustBlock?: {
    label: string;
    title: string;
    intro?: string;
    note?: string;
    items: readonly string[];
  };
  trackingContext?: GuideLandingTrackingContext;
  finalCtaTitle?: string;
  finalCtaBody?: string;
  relatedCluster?: ClusterKey;
  currentHref?: string;
};

export default function GuideLandingPage({
  breadcrumbLabel,
  kicker,
  title,
  accent,
  description,
  primaryCta,
  secondaryCta,
  summary,
  suitableFor,
  contents,
  suitableSectionLabel = 'Kdy se hodí',
  suitableSectionTitle = 'Pro jaké situace je dokument vhodný',
  contentsSectionLabel = 'Obsah dokumentu',
  contentsSectionTitle = 'Co dokument obvykle obsahuje',
  mistakesTitle = 'Na co si dát pozor',
  mistakes = [],
  faq,
  bottomLinks = [],
  decisionGuide,
  trustBlock,
  trackingContext,
  finalCtaTitle = 'Pokračujte do formuláře podle své situace',
  finalCtaBody = 'Ve formuláři doplníte hlavní údaje a po dokončení objednávky získáte standardizovaný výstup připravený k závěrečné kontrole a podpisu.',
  relatedCluster,
  currentHref,
}: GuideLandingPageProps) {
  const eventName =
    trackingContext?.pageType === 'package' ? 'package_cta_click' : 'situation_cta_click';

  const trackingParams = trackingContext
    ? trackingContext.pageType === 'package'
      ? {
          source: 'package_page',
          surface: 'package_page',
          package_key: trackingContext.pageKey,
          price_band: '299' as const,
        }
      : {
          source: 'situation_page',
          surface: 'situation_page',
          situation_key: trackingContext.pageKey,
        }
    : undefined;

  return (
    <main className="site-page">
      <div className="site-page-shell py-8 md:py-12">
        <nav className="mb-8 text-xs text-[#9b8f7f]" aria-label="Breadcrumb">
          <TrackedLink
            href="/"
            eventName={eventName}
            eventParams={{
              ...trackingParams,
              cta_type: 'breadcrumb_home',
              destination: '/',
            }}
            className="transition hover:text-[#f2e7c8]"
          >
            SmlouvaHned
          </TrackedLink>
          <span className="mx-2 text-[#705f49]">›</span>
          <span className="text-[#cabb9f]">{breadcrumbLabel}</span>
        </nav>

        <section className="site-content-card px-6 py-8 md:px-10 md:py-12">
          <div className="site-kicker">{kicker}</div>
          <h1 className="site-heading-xl mt-4 max-w-4xl">
            {title}
            <span className="site-gold block">{accent}</span>
          </h1>
          <p className="site-body-lg mt-6 max-w-3xl">{description}</p>

          {summary.length ? (
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {summary.slice(0, 4).map((item) => (
                <div
                  key={item}
                  className="rounded-[1.1rem] border border-[#a6865b22] bg-[rgba(16,13,11,0.22)] px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d6ac60]" />
                    <p className="text-sm leading-7 text-[#ddd5c9]">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <TrackedLink
              href={primaryCta.href}
              eventName={eventName}
              eventParams={{
                ...trackingParams,
                cta_type: 'primary_cta',
                destination: primaryCta.href,
              }}
              className="site-button-primary"
            >
              {primaryCta.label}
            </TrackedLink>
            {secondaryCta ? (
              <TrackedLink
                href={secondaryCta.href}
                eventName={eventName}
                eventParams={{
                  ...trackingParams,
                  cta_type: 'secondary_cta',
                  destination: secondaryCta.href,
                }}
                className="site-button-secondary"
              >
                {secondaryCta.label}
              </TrackedLink>
            ) : null}
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#a79d89]">
            Standardizovaný online produkt pro běžné a typizované situace. Nejde o
            individuální právní poradenství ani o poskytování advokátních služeb.
          </p>
        </section>

        {decisionGuide ? (
          <ProductPathGuide
            className="mt-10"
            label={decisionGuide.label}
            title={decisionGuide.title}
            intro={decisionGuide.intro}
            note={decisionGuide.note}
            items={decisionGuide.items}
            compact
            trackingContext={
              trackingContext
                ? {
                    eventName,
                    source: trackingParams?.source ?? 'landing_page',
                    surface: trackingParams?.surface ?? 'landing_page',
                    extraParams: trackingParams,
                  }
                : undefined
            }
          />
        ) : null}

        {trustBlock ? (
          <TrustOutputBlock
            className="mt-9"
            label={trustBlock.label}
            title={trustBlock.title}
            intro={trustBlock.intro}
            items={trustBlock.items}
            note={trustBlock.note}
            compact
          />
        ) : null}

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="site-content-card p-7 md:p-8">
            <div className="site-kicker">{contentsSectionLabel}</div>
            <h2 className="site-heading-lg mt-4">{contentsSectionTitle}</h2>
            <div className="mt-6 space-y-4">
              {contents.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.15rem] border border-[#a6865b22] bg-[rgba(16,13,11,0.24)] p-5"
                >
                  <h3 className="text-base font-semibold text-[#f2e7c8]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#d7d0c3]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="site-content-card p-7 md:p-8">
              <div className="site-kicker">{suitableSectionLabel}</div>
              <h2 className="site-heading-lg mt-4">{suitableSectionTitle}</h2>
              <div className="mt-6 space-y-4">
                {suitableFor.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.15rem] border border-[#a6865b22] bg-[rgba(16,13,11,0.24)] p-5"
                  >
                    <h3 className="text-base font-semibold text-[#f2e7c8]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#d7d0c3]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {mistakes.length ? (
              <div className="site-content-card-soft p-7 md:p-8">
                <div className="site-kicker">Praktické upozornění</div>
                <h2 className="site-heading-lg mt-4">{mistakesTitle}</h2>
                <ul className="mt-5 space-y-3">
                  {mistakes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-7 text-[#d7d0c3]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d6ac60]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        <SiteFaqSection
          className="mt-10"
          label="Časté otázky"
          title="Co si lidé před výběrem řeší nejčastěji"
          intro="Krátké odpovědi k tomu, kdy zvolit samostatný dokument, kdy širší variantu a kdy celé řešení situace."
          items={faq}
        />

        <section className="mt-10 site-content-card p-7 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <div className="site-kicker">Další krok</div>
              <h2 className="site-heading-lg mt-4">{finalCtaTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d7d0c3]">{finalCtaBody}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <TrackedLink
                  href={primaryCta.href}
                  eventName={eventName}
                  eventParams={{
                    ...trackingParams,
                    cta_type: 'final_primary_cta',
                    destination: primaryCta.href,
                  }}
                  className="site-button-primary"
                >
                  {primaryCta.label}
                </TrackedLink>
                {secondaryCta ? (
                  <TrackedLink
                    href={secondaryCta.href}
                    eventName={eventName}
                    eventParams={{
                      ...trackingParams,
                      cta_type: 'final_secondary_cta',
                      destination: secondaryCta.href,
                    }}
                    className="site-button-secondary"
                  >
                    {secondaryCta.label}
                  </TrackedLink>
                ) : null}
              </div>
            </div>
            <div>
              {bottomLinks.length > 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8f7f]">
                    Další dokumenty
                  </div>
                  <div className="flex flex-col gap-2">
                    {bottomLinks.map(link => (
                      <TrackedLink
                        key={link.href}
                        href={link.href}
                        eventName={eventName}
                        eventParams={{ ...trackingParams, cta_type: 'bottom_link', destination: link.href }}
                        className="text-sm text-[#caa45a] hover:text-[#dcb872] transition-colors"
                      >
                        {link.label} →
                      </TrackedLink>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
      {relatedCluster && currentHref ? (
        <RelatedContracts currentHref={currentHref} cluster={relatedCluster} />
      ) : null}
    </main>
  );
}
