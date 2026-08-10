'use client';

import { useEffect, useRef } from 'react';
import { getPostPurchaseOffers } from '@/lib/post-purchase-offers';
import { asAnalyticsContractType, trackEvent } from '@/lib/analytics';

type PostPurchaseOffersProps = {
  /** Typ zakoupeného dokumentu — určuje, které nabídky dávají smysl. */
  contractType?: string | null;
  /** Odkud se nabídka zobrazuje: success stránka nebo stránka stažení. */
  sourcePage: 'success' | 'download';
  locale?: string;
};

/**
 * Navazující nabídky po dokončené platbě.
 *
 * Vykresluje se až po zaplacení, nikdy v checkoutu. Bez zapnutého flagu a bez
 * cílové URL nevrátí `getPostPurchaseOffers` nic a komponenta zmizí beze stopy.
 */
/** Rámcové popisky sekce. Znění samotných nabídek řeší post-purchase-offers.ts. */
const SECTION_COPY: Record<'cs' | 'en' | 'ua', {
  heading: string;
  label: string;
  affiliateLabel: string;
}> = {
  cs: { heading: 'Další kroky', label: 'Navazující služby', affiliateLabel: 'Partnerský odkaz' },
  en: { heading: 'Next steps', label: 'Related services', affiliateLabel: 'Partner link' },
  ua: { heading: 'Наступні кроки', label: 'Супутні послуги', affiliateLabel: 'Партнерське посилання' },
};

export default function PostPurchaseOffers({
  contractType,
  sourcePage,
  locale = 'cs',
}: PostPurchaseOffersProps) {
  const offers = getPostPurchaseOffers(contractType, locale);
  const analyticsContractType = asAnalyticsContractType(contractType);
  const sectionCopy = SECTION_COPY[locale === 'en' || locale === 'ua' ? locale : 'cs'];
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current || offers.length === 0) return;
    viewedRef.current = true;
    for (const offer of offers) {
      trackEvent('post_purchase_offer_view', {
        source: sourcePage,
        surface: 'post_purchase',
        source_page: sourcePage,
        offer_type: 'post_purchase',
        product_id: offer.id,
        contract_type: analyticsContractType,
        locale,
      });
    }
  }, [offers, sourcePage, analyticsContractType, locale]);

  if (offers.length === 0) return null;

  return (
    <section className="mt-10 space-y-4" aria-label={sectionCopy.label}>
      <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {sectionCopy.heading}
      </h2>
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="rounded-2xl border border-slate-800/90 bg-[#0c1426] p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-base font-semibold text-white sm:text-lg">{offer.title}</h3>
            {offer.isAffiliate && (
              <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {sectionCopy.affiliateLabel}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{offer.description}</p>
          {offer.disclosure && (
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{offer.disclosure}</p>
          )}
          <a
            href={offer.href}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            onClick={() =>
              trackEvent('post_purchase_offer_click', {
                source: sourcePage,
                surface: 'post_purchase',
                source_page: sourcePage,
                offer_type: 'post_purchase',
                product_id: offer.id,
                contract_type: analyticsContractType,
                locale,
              })
            }
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-amber-500/60 hover:text-white sm:w-auto"
          >
            {offer.cta}
          </a>
        </div>
      ))}
    </section>
  );
}
