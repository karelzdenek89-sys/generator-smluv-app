import Link from 'next/link';
import type { LandingContent } from '@/lib/i18n/landings';
import { FOREIGN_LOCALES, LOCALE_META, type Locale } from '@/lib/i18n/locales';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

type Props = {
  locale: Exclude<Locale, 'cs'>;
  content: LandingContent;
};

export default function LocaleLandingPage({ locale, content }: Props) {
  const meta = LOCALE_META[locale];
  const baseUrl = `${BASE_URL}/${meta.segment}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: meta.htmlLang,
    mainEntity: content.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SmlouvaHned',
    url: baseUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: meta.htmlLang,
    description: content.metaDescription,
    provider: { '@type': 'Organization', name: 'SmlouvaHned', url: BASE_URL },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: meta.englishName, item: baseUrl },
    ],
  };

  const otherLocales = FOREIGN_LOCALES.filter(l => l !== locale);

  return (
    <main className="site-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />

      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <div className="mb-4 text-xs uppercase tracking-[0.2em] text-amber-300/80">
          {content.kicker}
        </div>
        <h1 className="font-heading-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-white">
          {content.h1Line1}
          <br />
          {content.h1Line2}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-[#bfc7d4]">{content.intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/najem" className="cta-primary">
            {content.ctaPrimary}
          </Link>
          <Link href="/dpp" className="cta-outline">
            {content.ctaSecondary}
          </Link>
        </div>

        <p className="mt-6 text-sm text-amber-200/80">{content.warningBanner}</p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-heading-serif text-3xl text-white mb-6">{content.contractsHeading}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {content.contracts.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className="interactive-card block p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
            >
              <div className="text-white font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-[#a8b1c0]">{c.blurb}</div>
              <div className="mt-3 text-xs uppercase tracking-wider text-amber-300/80">
                {content.openCzechForm}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-heading-serif text-3xl text-white mb-6">{content.howItWorksHeading}</h2>
        <ol className="space-y-4 text-[#bfc7d4]">
          {content.howItWorks.map(step => (
            <li key={step.title}>
              <span className="text-amber-300 font-semibold">{step.title}</span>{' '}
              {step.description}
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-heading-serif text-3xl text-white mb-6">{content.whyHeading}</h2>
        <ul className="space-y-3 text-[#bfc7d4]">
          {content.whyBullets.map(b => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-heading-serif text-3xl text-white mb-6">{content.faqHeading}</h2>
        <div className="space-y-6">
          {content.faq.map(item => (
            <div key={item.q}>
              <h3 className="text-white font-semibold">{item.q}</h3>
              <p className="mt-2 text-[#bfc7d4]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-amber-300/30 bg-amber-300/[0.04] p-6">
          <h2 className="font-heading-serif text-2xl text-white mb-2">
            {content.disclaimerHeading}
          </h2>
          <p className="text-[#bfc7d4]">{content.disclaimerBody}</p>
          {content.legalNotes && content.legalNotes.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-[#a8b1c0] list-disc pl-5">
              {content.legalNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 text-sm text-[#8a93a3]">
          <span className="block mb-3">
            <Link href="/" className="link-gold-elegant">
              {content.switchToCzech}
            </Link>
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-[#8a93a3]">
            {content.alsoAvailableIn}:{' '}
            {otherLocales.map((l, i) => (
              <span key={l}>
                <Link
                  href={`/${LOCALE_META[l].segment}`}
                  hrefLang={LOCALE_META[l].htmlLang}
                  className="hover:text-white transition-colors"
                >
                  {LOCALE_META[l].flag} {LOCALE_META[l].nativeName}
                </Link>
                {i < otherLocales.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </span>
        </div>
      </section>
    </main>
  );
}
