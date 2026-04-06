'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAnalyticsDefaultsForPathname, trackEvent } from '@/lib/analytics';

export interface ContractLandingBenefit {
  icon: string;
  text: string;
}

export interface ContractLandingFaq {
  q: string;
  a: string;
}

export interface ContractLandingAlternative {
  label: string;
  href: string;
  text: string;
}

export interface ContractLandingSectionProps {
  badge: string;
  h1Main: string;
  h1Accent?: string;
  h1Suffix?: string;
  subtitle: string;
  benefits: ContractLandingBenefit[];
  contents: string[];
  whenSuitable: string[];
  whenOther?: ContractLandingAlternative[];
  faq: ContractLandingFaq[];
  ctaLabel?: string;
  formId?: string;
  guideHref?: string;
  guideLabel?: string;
}

export default function ContractLandingSection({
  badge,
  h1Main,
  h1Accent,
  h1Suffix,
  subtitle,
  benefits,
  contents,
  whenSuitable,
  whenOther,
  faq,
  ctaLabel = 'Pokračovat k vytvoření dokumentu',
  formId = 'formular',
  guideHref,
  guideLabel = 'Průvodce k tomuto dokumentu',
}: ContractLandingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const currentPath = pathname ?? '/';
    const packageKey =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('package')
        : null;
    const defaults = getAnalyticsDefaultsForPathname(currentPath);

    trackEvent('builder_view', {
      ...defaults,
      source: 'builder',
      surface: 'builder',
      entry_mode: packageKey ? 'package_flow' : 'single_document',
      package_key:
        packageKey === 'landlord' || packageKey === 'vehicle_sale'
          ? packageKey
          : undefined,
    });

    if (packageKey === 'landlord' || packageKey === 'vehicle_sale') {
      trackEvent('package_flow_entered', {
        ...defaults,
        source: 'package_landing',
        surface: 'builder',
        package_key: packageKey,
        entry_mode: 'package_flow',
        price_band: '299',
      });
    }
  }, [pathname]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-12 lg:px-8 lg:pt-16">
        <div className="max-w-3xl">
          <div className="site-kicker">{badge}</div>
          <h1 className="site-heading-xl mt-5 max-w-4xl text-[#f2e7c8]">
            {h1Main} {h1Accent ? <span className="site-gold">{h1Accent}</span> : null}
            {h1Suffix ? <> {h1Suffix}</> : null}
          </h1>
          <p className="site-body-lg mt-6 max-w-3xl text-[#ddd5c7]">{subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => scrollTo(formId)} className="site-button-primary">
              {ctaLabel}
            </button>
            <button onClick={() => scrollTo('obsah')} className="site-button-secondary">
              Co dokument obsahuje
            </button>
          </div>

          {guideHref ? (
            <div className="mt-6">
              <Link href={guideHref} className="text-sm font-medium text-[#d6ac60] hover:text-[#e0b870]">
                {guideLabel}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {benefits.map((item) => (
            <div key={item.text} className="site-content-card-soft rounded-[1.5rem] px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">{item.icon}</span>
                <p className="text-sm leading-7 text-[#ddd5c7]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="obsah" className="mx-auto max-w-7xl border-t border-[rgba(166,134,91,0.12)] px-4 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="site-content-card rounded-[1.75rem] p-7">
            <div className="site-kicker">Obsah dokumentu</div>
            <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">Co dokument obsahuje</h2>
            <p className="site-body mt-4 text-[#d2c8b9]">
              Strukturovaný obsah obvyklý pro tento typ dokumentu, sestavený podle vašich podmínek.
            </p>
            <ul className="mt-6 space-y-4">
              {contents.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-8 text-[#e3dbcf]">
                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(214,172,96,0.14)] text-xs font-bold text-[#d6ac60]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="site-content-card rounded-[1.75rem] p-7">
              <div className="site-kicker">Vhodné použití</div>
              <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">Kdy je tento dokument vhodný</h2>
              <ul className="mt-6 space-y-4">
                {whenSuitable.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-8 text-[#ddd5c7]">
                    <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(166,134,91,0.18)] text-xs text-[#d6ac60]">
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {whenOther?.length ? (
              <div className="site-content-card rounded-[1.75rem] p-7">
                <div className="site-kicker">Jiný typ dokumentu</div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">
                  Kdy už je lepší zvolit jiný postup
                </h3>
                <div className="mt-6 space-y-3">
                  {whenOther.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-[1.25rem] border border-[rgba(166,134,91,0.12)] bg-[rgba(20,15,12,0.3)] px-5 py-4 transition hover:border-[rgba(214,172,96,0.28)]"
                    >
                      <div className="text-sm font-semibold text-[#d6ac60]">{item.label}</div>
                      <p className="mt-1 text-sm leading-7 text-[#d2c8b9]">{item.text}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-[rgba(166,134,91,0.12)] px-4 py-14 lg:px-8">
        <div className="max-w-3xl">
          <div className="site-kicker">Časté otázky</div>
          <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">Nejčastější dotazy</h2>
        </div>
        <div className="mt-8 max-w-3xl space-y-3">
          {faq.map((item, index) => (
            <div key={item.q} className="site-content-card-soft overflow-hidden rounded-[1.5rem]">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                aria-expanded={openFaq === index}
              >
                <span className="text-base font-semibold leading-7 text-[#f2e7c8]">{item.q}</span>
                <span className="text-xl text-[#d6ac60]">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index ? (
                <div className="border-t border-[rgba(166,134,91,0.12)] px-6 pb-5 pt-4 text-base leading-8 text-[#d2c8b9]">
                  {item.a}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
