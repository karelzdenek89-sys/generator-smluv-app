import Link from 'next/link';
import SeoLandingTracker from '@/app/components/analytics/SeoLandingTracker';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import { getPublicLocalePath, LEGAL_NOTICE, type AppLocale } from '@/lib/locale';
import { LEASE_USE_NOTICE_EN, LEASE_USE_NOTICE_UK } from '@/lib/i18n/safety-copy';
import type { ExpatSeoContent } from '@/lib/i18n/expat-seo-landings';
import { SITE_URL, absoluteUrl } from '@/lib/seo/site';

type Props = {
  locale: AppLocale;
  content: ExpatSeoContent;
};

function extraNotice(locale: AppLocale, contractKey: ExpatSeoContent['contractKey']) {
  if (contractKey !== 'lease') return null;
  return locale === 'ua' ? LEASE_USE_NOTICE_UK : LEASE_USE_NOTICE_EN;
}

export default function ExpatContractSeoPage({ locale, content }: Props) {
  const expatHref = `/${getPublicLocalePath(locale)}`;
  const landingPathname = new URL(content.canonical).pathname;
  const leaseNotice = extraNotice(locale, content.contractKey);
  const faqHeading = locale === 'ua' ? 'Часті запитання' : 'FAQ';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: content.expatHubLabel, item: absoluteUrl(expatHref) },
      { '@type': 'ListItem', position: 3, name: content.h1, item: content.canonical },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.h1,
    description: content.subtitle,
    url: content.canonical,
    inLanguage: locale === 'ua' ? 'uk' : 'en',
    isPartOf: { '@type': 'WebSite', name: 'SmlouvaHned', url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-[#040c1a] text-slate-200">
      <SeoLandingTracker pathname={landingPathname} label={content.breadcrumbLabel} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema).replace(/</g, '\\u003c') }}
      />

      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition">
            SmlouvaHned
          </Link>
          <span className="mx-2">›</span>
          <Link href={expatHref} className="hover:text-slate-300 transition">
            {content.expatHubLabel}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">{content.breadcrumbLabel}</span>
        </nav>

        <p className="site-kicker mb-4">{content.kicker}</p>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-5xl leading-tight">
          {content.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{content.subtitle}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <TrackedLink
            href={content.builderHref}
            eventName="seo_landing_cta_click"
            eventParams={{
              source: 'seo_landing',
              surface: 'seo_landing',
              pathname: landingPathname,
              cta_type: 'hero_primary',
              destination: content.builderHref,
            }}
            data-testid={`seo-${content.contractKey}-cta`}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-4 text-sm font-black uppercase tracking-wide text-black hover:brightness-110 transition"
          >
            {content.cta}
          </TrackedLink>
          <Link
            href={content.blogGuideHref}
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-4 text-sm font-semibold text-slate-300 hover:border-white/30 hover:text-white transition"
          >
            {content.blogGuideLabel}
          </Link>
          <Link
            href={expatHref}
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-4 text-sm font-semibold text-slate-300 hover:border-white/30 hover:text-white transition"
          >
            {content.backToExpats}
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-sky-400/25 bg-sky-400/10 p-6 text-sm leading-7 text-sky-50">
          <p className="font-bold text-sky-100">{locale === 'ua' ? 'Важливо' : 'Important'}</p>
          <p className="mt-2">{LEGAL_NOTICE[locale]}</p>
          {leaseNotice ? <p className="mt-2">{leaseNotice}</p> : null}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">{faqHeading}</h2>
        <div className="space-y-4">
          {content.faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 open:border-amber-500/30"
            >
              <summary className="cursor-pointer font-semibold text-white">{item.q}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>

        <ul className="mt-10 space-y-2 text-sm leading-7 text-slate-400">
          {content.legalBullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-8 text-center space-y-4">
          <TrackedLink
            href={content.builderHref}
            eventName="seo_landing_cta_click"
            eventParams={{
              source: 'seo_landing',
              surface: 'seo_landing',
              pathname: landingPathname,
              cta_type: 'footer_primary',
              destination: content.builderHref,
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 px-8 py-4 text-sm font-black uppercase tracking-wide text-black hover:brightness-110 transition"
          >
            {content.cta}
          </TrackedLink>
          <p>
            <Link href={content.blogGuideHref} className="text-sm font-semibold text-amber-200 hover:text-amber-100">
              {content.blogGuideLabel} →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
