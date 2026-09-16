'use client';

import { useEffect, useRef } from 'react';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import { asAnalyticsContractType, trackEvent } from '@/lib/analytics';
import { subscribeToProductAnalyticsConsent } from '@/lib/analytics-attribution';

type ContextualProductOfferProps = {
  /** Stabilní identifikátor produktu pro analytiku — např. „lease_complete". */
  product: string;
  title: string;
  description: string;
  /** Cena tak, jak ji uvidí čtenář. Autoritou zůstává serverový pricing. */
  price: string;
  cta: string;
  href: string;
  /** Typ dokumentu, kterého se nabídka týká — pro segmentaci v reportingu. */
  contractType?: string;
  /** Slug článku, pokud se komponenta používá v blogu. */
  articleSlug?: string;
  /** Doplňující věta o rozsahu produktu. Zobrazí se drobným písmem. */
  note?: string;
};

/**
 * Kontextová produktová nabídka uvnitř právního obsahu.
 *
 * Vědomě zdrženlivá: žádné odpočty, žádné škrtnuté ceny, žádné vyskakovací
 * okno. Vizuálně navazuje na ostatní bloky článku, aby působila jako další
 * krok v textu, ne jako reklamní banner.
 */
export default function ContextualProductOffer({
  product,
  title,
  description,
  price,
  cta,
  href,
  contractType,
  articleSlug,
  note,
}: ContextualProductOfferProps) {
  const offerRef = useRef<HTMLElement>(null);
  const viewedRef = useRef<string | null>(null);
  const analyticsContractType = asAnalyticsContractType(contractType);

  useEffect(() => {
    const element = offerRef.current;
    // Bez podpory observeru zobrazení neodhadujeme z pouhého načtení stránky.
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const viewKey = `${articleSlug ?? ''}:${product}`;
    let inView = false;
    const recordView = () => {
      if (!inView || document.visibilityState !== 'visible' || viewedRef.current === viewKey) return;
      const recorded = trackEvent('content_offer_view', {
        source: 'blog_article',
        surface: 'contextual_offer',
        offer_type: 'content_bundle',
        product_id: product,
        contract_type: analyticsContractType,
        article_slug: articleSlug,
        variant: 'visible_offer_v1',
      });
      if (recorded) viewedRef.current = viewKey;
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.25);
      recordView();
    }, { threshold: 0.25 });
    observer.observe(element);
    const unsubscribe = subscribeToProductAnalyticsConsent(recordView);
    document.addEventListener('visibilitychange', recordView);
    return () => {
      observer.disconnect();
      unsubscribe();
      document.removeEventListener('visibilitychange', recordView);
    };
  }, [product, analyticsContractType, articleSlug]);

  return (
    <aside ref={offerRef} data-content-offer={product} className="blog-callout my-10 rounded-[1.5rem] p-6">
      <div className="site-kicker">Související produkt</div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">{title}</h3>
        <span className="shrink-0 whitespace-nowrap text-lg font-bold text-[#f2e7c8]">
          {price}
        </span>
      </div>
      <p className="mt-4 text-base leading-8 text-[#d2c8b9]">{description}</p>
      {note && <p className="mt-3 text-sm leading-7 text-[#a99e8f]">{note}</p>}
      <div className="mt-6">
        <TrackedLink
          href={href}
          eventName="content_offer_click"
          eventParams={{
            source: 'blog_article',
            surface: 'contextual_offer',
            offer_type: 'content_bundle',
            product_id: product,
            contract_type: analyticsContractType,
            article_slug: articleSlug,
            destination: href,
            variant: 'visible_offer_v1',
          }}
          // `.site-button-primary` má `white-space: nowrap`; dlouhé české
          // popisky by se na mobilu nevešly do sloupce článku. Na úzkých
          // šířkách proto tlačítko roztáhneme a povolíme zalomení.
          className="site-button-primary w-full justify-center text-center !whitespace-normal sm:w-auto"
        >
          {cta}
        </TrackedLink>
      </div>
    </aside>
  );
}
