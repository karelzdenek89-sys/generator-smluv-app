import type { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbSchema, jsonLdScript } from '@/lib/schemas';
import { BASIC_ARCHIVE_DAYS, COMPLETE_ARCHIVE_DAYS, PRICING_TIERS } from '@/lib/pricing';
import { getAvailableThematicPackages } from '@/lib/packages';
import { CHECKOUT_ADDONS } from '@/lib/checkout-addons';
import { getMonetizationPolicy } from '@/lib/monetization-policy';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { CASE_DOCUMENT_PRICE_LABEL } from '@/lib/cases/documents';
import { SELLER_IDENTIFICATION } from '@/lib/legal/seller';
import { SITE_URL } from '@/lib/seo/site';

/**
 * Jediný veřejný ceník. Všechny částky se čtou z konfigurace, ze které počítá
 * i pokladna (lib/pricing, lib/packages, lib/checkout-addons), takže se ceník
 * nemůže rozejít s tím, co zákazník skutečně zaplatí.
 */

const canonicalUrl = `${SITE_URL}/cenik`;
const FREE_BASIC_DPP = getMonetizationPolicy('dpp', 'cs').mode === 'free_experiment';

export const metadata: Metadata = {
  title: 'Ceník smluv a balíčků 2026',
  description:
    'Všechny ceny SmlouvaHned na jednom místě: základní a rozšířený dokument, tematické balíčky, doplňky a navazující dokumenty. Ceny jsou konečné.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Ceník smluv a balíčků 2026',
    description: 'Ceny dokumentů, balíčků a doplňků SmlouvaHned na jednom místě. Ceny jsou konečné, bez předplatného.',
    url: canonicalUrl,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned — ceník' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ceník smluv a balíčků 2026',
    description: 'Ceny dokumentů, balíčků a doplňků SmlouvaHned. Ceny jsou konečné, bez předplatného.',
    images: ['/og-image.png'],
  },
};

const cardClass = 'rounded-2xl border border-white/8 bg-[#0c1426] p-6';
const headingClass = 'mb-5 text-xs font-black uppercase tracking-[0.18em] text-amber-400';

export default function PricingPage() {
  const packages = getAvailableThematicPackages();
  const caseEngine = isFeatureEnabled('caseEngine');
  const breadcrumb = breadcrumbSchema([
    { label: 'SmlouvaHned', href: '/' },
    { label: 'Ceník', href: '/cenik' },
  ]);

  return (
    <main className="min-h-screen bg-[#05080f] px-6 py-16 text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-slate-300">
            SmlouvaHned
          </Link>
          <span className="mx-2 text-slate-700">›</span>
          <span className="text-slate-400">Ceník</span>
        </nav>

        <header className="mb-12">
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
            Ceník
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tighter text-white md:text-5xl">
            Ceník 2026
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400">
            Platíte jednorázově za konkrétní dokument nebo balíček — bez registrace, předplatného
            a skrytých poplatků. Uvedené ceny jsou konečné; prodávající není plátcem DPH.
            Platba kartou, Apple Pay nebo Google Pay přes Stripe.
          </p>
        </header>

        <div className="space-y-12">
          <section aria-labelledby="cenik-dokumenty">
            <h2 id="cenik-dokumenty" className={headingClass}>Jednotlivé dokumenty</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.key} className={`${cardClass} ${tier.highlighted ? 'border-amber-500/30' : ''}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-bold text-white">{tier.title}</h3>
                    <span className="whitespace-nowrap text-xl font-black text-amber-400">{tier.priceLabel}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{tier.shortDescription}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
                    {tier.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="text-amber-500" aria-hidden>✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {FREE_BASIC_DPP ? (
              <p className="mt-3 text-sm text-slate-400">
                Základní dohoda o provedení práce (DPP) je v aktivním experimentu zdarma; rozšířená DPP
                stojí jako ostatní rozšířené dokumenty.
              </p>
            ) : null}
          </section>

          <section aria-labelledby="cenik-balicky">
            <h2 id="cenik-balicky" className={headingClass}>Balíčky</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Balíček obsahuje hlavní dokument v rozšířené variantě a navazující podklady pro danou
              situaci. Odkaz ke stažení je dostupný {COMPLETE_ARCHIVE_DAYS} dní.
            </p>
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.key} className={cardClass}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-bold text-white">{pkg.title}</h3>
                    <span className="whitespace-nowrap text-xl font-black text-amber-400">{pkg.priceLabel}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{pkg.suitableFor}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
                    {pkg.includedOutputs.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-amber-500" aria-hidden>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={pkg.href} className="mt-4 inline-block text-sm font-semibold text-amber-400 hover:text-amber-300">
                    Více o balíčku →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cenik-doplnky">
            <h2 id="cenik-doplnky" className={headingClass}>Volitelné doplňky</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Doplňky si přidáte v pokladně k hotovému dokumentu. Nabídka se řídí typem dokumentu
              a zvolenou variantou — co už je ve variantě nebo balíčku zahrnuto, se znovu nenabízí.
            </p>
            <div className={`${cardClass} divide-y divide-white/5`}>
              {CHECKOUT_ADDONS.map((addon) => (
                <div key={addon.key} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="text-sm font-semibold text-white">{addon.title}</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-400">{addon.description}</div>
                  </div>
                  <span className="flex-shrink-0 whitespace-nowrap text-sm font-black text-amber-400">{addon.priceLabel}</span>
                </div>
              ))}
            </div>
          </section>

          {caseEngine ? (
            <section aria-labelledby="cenik-zakazka">
              <h2 id="cenik-zakazka" className={headingClass}>Moje zakázka</h2>
              <div className={cardClass}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-bold text-white">Navazující dokument k zakázce</h3>
                  <span className="whitespace-nowrap text-xl font-black text-amber-400">{CASE_DOCUMENT_PRICE_LABEL}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Předávací protokol, změnový list, potvrzení víceprací a další dokumenty v průběhu
                  zakázky. U zakázky založené z balíčku Zakázka Plus jsou v ceně balíčku.
                </p>
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-sm leading-relaxed text-slate-400">
            <p>
              Dostupnost odkazu ke stažení: základní dokument {BASIC_ARCHIVE_DAYS} dní, rozšířený
              dokument a balíčky {COMPLETE_ARCHIVE_DAYS} dní, s doplňkem archivace 90 dní.
              Podrobnosti o platbě, odstoupení a reklamaci jsou v{' '}
              <Link href="/obchodni-podminky#ceny" className="text-amber-400 underline underline-offset-2 hover:text-amber-300">
                obchodních podmínkách
              </Link>
              , odpovědi na časté otázky v{' '}
              <Link href="/faq" className="text-amber-400 underline underline-offset-2 hover:text-amber-300">
                FAQ
              </Link>
              .
            </p>
            <p className="mt-3 text-xs">Prodávající: {SELLER_IDENTIFICATION}.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
