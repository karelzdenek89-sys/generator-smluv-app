'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { asAnalyticsContractType, trackEvent } from '@/lib/analytics';

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
  const viewedRef = useRef(false);
  const analyticsContractType = asAnalyticsContractType(contractType);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackEvent('content_offer_view', {
      source: 'blog_article',
      surface: 'contextual_offer',
      offer_type: 'content_bundle',
      product_id: product,
      contract_type: analyticsContractType,
      article_slug: articleSlug,
    });
  }, [product, analyticsContractType, articleSlug]);

  return (
    <aside className="blog-callout my-10 rounded-[1.5rem] p-6">
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
        <Link
          href={href}
          onClick={() =>
            trackEvent('content_offer_click', {
              source: 'blog_article',
              surface: 'contextual_offer',
              offer_type: 'content_bundle',
              product_id: product,
              contract_type: analyticsContractType,
              article_slug: articleSlug,
              destination: href,
            })
          }
          // `.site-button-primary` má `white-space: nowrap`; dlouhé české
          // popisky by se na mobilu nevešly do sloupce článku. Na úzkých
          // šířkách proto tlačítko roztáhneme a povolíme zalomení.
          className="site-button-primary w-full justify-center text-center !whitespace-normal sm:w-auto"
        >
          {cta}
        </Link>
      </div>
    </aside>
  );
}
