'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { PartnerContext, PublicPartnerOffer } from '@/lib/partners/types';
import { createPartnerClickId } from '@/lib/partners/attribution';
import {
  analyticsAttributionEventParams,
  isProductAnalyticsConsentGranted,
  subscribeToProductAnalyticsConsent,
  type CheckoutAnalyticsAttribution,
} from '@/lib/analytics-attribution';

type PartnerNextStepsProps = {
  offers: readonly PublicPartnerOffer[];
  context: PartnerContext;
  sourcePage: 'success' | 'download';
  attributionId?: string | null;
  analyticsAttribution?: CheckoutAnalyticsAttribution | null;
};

const SECTION_COPY = {
  cs: { heading: 'Další kroky', label: 'Navazující služby', affiliate: 'Partnerský odkaz' },
  en: { heading: 'Next steps', label: 'Related services', affiliate: 'Partner link' },
  ua: { heading: 'Наступні кроки', label: 'Супутні послуги', affiliate: 'Партнерське посилання' },
} as const;

const ORDER_SCOPED_TRACKING = { inheritAttribution: false } as const;

function analyticsParams(
  offer: PublicPartnerOffer,
  context: PartnerContext,
  sourcePage: PartnerNextStepsProps['sourcePage'],
  attributionId?: string | null,
  analyticsAttribution?: CheckoutAnalyticsAttribution | null,
) {
  return {
    source: sourcePage,
    surface: 'post_payment',
    source_page: sourcePage,
    offer_type: 'partner' as const,
    product_id: offer.id,
    partner_id: offer.partnerId,
    provider: offer.provider,
    offer_category: offer.category,
    user_role: context.userRole,
    contract_type: context.contractType,
    locale: context.locale,
    placement: sourcePage,
    experiment_id: offer.experimentId,
    variant: offer.variant,
    monetization_mode: context.monetizationMode,
    partner_transaction_id: attributionId ?? undefined,
    ...analyticsAttributionEventParams(analyticsAttribution),
  };
}

export default function PartnerNextSteps({
  offers,
  context,
  sourcePage,
  attributionId,
  analyticsAttribution,
}: PartnerNextStepsProps) {
  const copy = SECTION_COPY[context.locale];
  const eligibleSent = useRef(false);
  const viewed = useRef(new Set<string>());
  const cardRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (offers.length === 0) return;
    const recordEligible = () => {
      if (eligibleSent.current) return;
      const results = offers.map((offer) => trackEvent('partner_offer_eligible', analyticsParams(
        offer, context, sourcePage, attributionId, analyticsAttribution,
      ), ORDER_SCOPED_TRACKING));
      eligibleSent.current = results.every(Boolean);
    };
    recordEligible();
    return subscribeToProductAnalyticsConsent(recordEligible);
  }, [offers, context, sourcePage, attributionId, analyticsAttribution]);

  useEffect(() => {
    if (offers.length === 0 || typeof IntersectionObserver === 'undefined') return;
    let observer: IntersectionObserver | null = null;
    const startObserver = () => {
      if (observer || !isProductAnalyticsConsentGranted()) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const offerId = entry.target.getAttribute('data-offer-id');
          const offer = offers.find((item) => item.id === offerId);
          if (!offer || viewed.current.has(offer.id)) continue;
          const sent = trackEvent('partner_offer_viewed', analyticsParams(
            offer, context, sourcePage, attributionId, analyticsAttribution,
          ), ORDER_SCOPED_TRACKING);
          if (sent) {
            viewed.current.add(offer.id);
            observer?.unobserve(entry.target);
          }
        }
      }, { threshold: 0.5 });
      for (const element of cardRefs.current.values()) observer.observe(element);
    };
    startObserver();
    const unsubscribe = subscribeToProductAnalyticsConsent(startObserver);
    return () => {
      unsubscribe();
      observer?.disconnect();
    };
  }, [offers, context, sourcePage, attributionId, analyticsAttribution]);

  if (offers.length === 0) return null;

  return (
    <section className="mt-10 space-y-4" aria-label={copy.label}>
      <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {copy.heading}
      </h2>
      {offers.slice(0, 3).map((offer) => (
        <article
          key={offer.id}
          data-offer-id={offer.id}
          ref={(element) => {
            if (element) cardRefs.current.set(offer.id, element);
            else cardRefs.current.delete(offer.id);
          }}
          className="rounded-2xl border border-slate-800/90 bg-[#0c1426] p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-base font-semibold text-white sm:text-lg">{offer.title}</h3>
            {offer.isAffiliate ? (
              <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {copy.affiliate}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-500">{offer.provider}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{offer.description}</p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">{offer.disclosure}</p>
          <a
            href={offer.href}
            target="_blank"
            rel={offer.isAffiliate ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer'}
            onClick={() => trackEvent('partner_offer_clicked', {
              ...analyticsParams(offer, context, sourcePage, attributionId, analyticsAttribution),
              partner_click_id: createPartnerClickId(),
            }, ORDER_SCOPED_TRACKING)}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-amber-500/60 hover:text-white sm:w-auto"
          >
            {offer.cta}
          </a>
        </article>
      ))}
    </section>
  );
}
