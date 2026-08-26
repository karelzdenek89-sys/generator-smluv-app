'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { createPartnerClickId } from '@/lib/partners/attribution';
import type { PublicPartnerOffer } from '@/lib/partners/types';
import {
  isProductAnalyticsConsentGranted,
  subscribeToProductAnalyticsConsent,
} from '@/lib/analytics-attribution';

type PartnerEditorialOfferProps = {
  offer: PublicPartnerOffer;
  sourcePage: string;
};

function analyticsParams(offer: PublicPartnerOffer, sourcePage: string) {
  return {
    source: sourcePage,
    surface: 'seo_article_after_product_cta',
    source_page: sourcePage,
    offer_type: 'partner' as const,
    product_id: offer.id,
    partner_id: offer.partnerId,
    provider: offer.provider,
    offer_category: offer.category,
    contract_type: 'car_sale' as const,
    locale: 'cs',
    placement: 'article' as const,
  };
}

export default function PartnerEditorialOffer({ offer, sourcePage }: PartnerEditorialOfferProps) {
  const cardRef = useRef<HTMLElement>(null);
  const eligibleSent = useRef(false);
  const viewedSent = useRef(false);

  useEffect(() => {
    const recordEligible = () => {
      if (eligibleSent.current) return;
      eligibleSent.current = trackEvent(
        'partner_offer_eligible',
        analyticsParams(offer, sourcePage),
      );
    };
    recordEligible();
    return subscribeToProductAnalyticsConsent(recordEligible);
  }, [offer, sourcePage]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    let observer: IntersectionObserver | null = null;
    const startObserver = () => {
      if (viewedSent.current || observer || !isProductAnalyticsConsentGranted()) return;
      observer = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting || viewedSent.current) return;
        viewedSent.current = trackEvent(
          'partner_offer_viewed',
          analyticsParams(offer, sourcePage),
        );
        if (viewedSent.current) observer?.disconnect();
      }, { threshold: 0.5 });
      observer.observe(element);
    };
    startObserver();
    const unsubscribe = subscribeToProductAnalyticsConsent(startObserver);
    return () => {
      unsubscribe();
      observer?.disconnect();
    };
  }, [offer, sourcePage]);

  return (
    <aside
      ref={cardRef}
      aria-label="Samostatná služba pro prověření historie vozidla"
      className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-black tracking-tight text-white">{offer.title}</h2>
        {offer.isAffiliate ? (
          <span className="rounded-full border border-sky-400/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
            Partnerský odkaz
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{offer.provider}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{offer.description}</p>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{offer.disclosure}</p>
      <a
        href={offer.href}
        target="_blank"
        rel={offer.isAffiliate ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer'}
        onClick={() => trackEvent('partner_offer_clicked', {
          ...analyticsParams(offer, sourcePage),
          partner_click_id: createPartnerClickId(),
        })}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-sky-400/30 px-5 py-3 text-center text-sm font-semibold text-sky-100 transition hover:border-sky-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:w-auto"
      >
        {offer.cta}
        <span aria-hidden="true" className="ml-2">↗</span>
        <span className="sr-only"> (otevře se v nové kartě)</span>
      </a>
    </aside>
  );
}
