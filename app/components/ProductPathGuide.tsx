import TrackedLink from '@/app/components/analytics/TrackedLink';
import type { AnalyticsEventName, AnalyticsEventParams, PriceBand } from '@/lib/analytics';
import type { ThematicPackageKey } from '@/lib/packages';

const PRICE_BANDS: readonly PriceBand[] = ['99', '199', '299', '399', '599'];

/**
 * Odvodí cenové pásmo z popisku ceny („399 Kč" → „399").
 *
 * Neznámý popisek raději nechá pásmo nevyplněné, než aby ho zařadil špatně —
 * nový produkt se tak v reportingu neschová pod cizí cenovku.
 */
function priceBandFromLabel(priceLabel: string): PriceBand | undefined {
  return PRICE_BANDS.find((band) => priceLabel.startsWith(band));
}

export type ProductPathGuideItem = {
  key: string;
  title: string;
  priceLabel: string;
  description: string;
  href: string;
  cta: string;
  badge?: string;
  highlight?: boolean;
  /**
   * Klíč balíčku, pokud tato karta nabízí balíček místo samostatného dokumentu.
   * Kliknutí na ni navíc odešle `bundle_selected`, aby šlo měřit, jak často
   * návštěvník v rozhodovacím bodě zvolí balíček proti jednomu dokumentu.
   */
  bundleKey?: ThematicPackageKey;
};

export type ProductPathGuideTrackingContext = {
  eventName: AnalyticsEventName;
  source: string;
  surface: string;
  extraParams?: AnalyticsEventParams;
};

type ProductPathGuideProps = {
  label: string;
  title: string;
  intro?: string;
  note?: string;
  items: readonly ProductPathGuideItem[];
  className?: string;
  compact?: boolean;
  trackingContext?: ProductPathGuideTrackingContext;
};

export default function ProductPathGuide({
  label,
  title,
  intro,
  note,
  items,
  className = '',
  compact = false,
  trackingContext,
}: ProductPathGuideProps) {
  return (
    <section className={className}>
      <div className={compact ? 'site-content-card p-6 md:p-7' : ''}>
        <div className={compact ? 'mb-6' : 'mb-8'}>
          <span className="section-label">{label}</span>
          <h2 className="font-heading-serif text-[clamp(1.5rem,2.7vw,2.05rem)] font-semibold tracking-tight text-[var(--gold-light)]">
            {title}
          </h2>
          {intro ? (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#d3d8e4]">{intro}</p>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <TrackedLink
              key={item.key}
              href={item.href}
              eventName={trackingContext?.eventName ?? 'homepage_pricing_path_click'}
              eventParams={{
                source: trackingContext?.source ?? 'homepage',
                surface: trackingContext?.surface ?? 'homepage',
                cta_type: item.key,
                price_band: priceBandFromLabel(item.priceLabel),
                destination: item.href,
                ...trackingContext?.extraParams,
              }}
              extraEventName={item.bundleKey ? 'bundle_selected' : undefined}
              extraEventParams={
                item.bundleKey
                  ? {
                      source: trackingContext?.source ?? 'homepage',
                      surface: trackingContext?.surface ?? 'homepage',
                      offer_type: 'content_bundle',
                      product_id: item.bundleKey,
                      package_key: item.bundleKey,
                      price_band: priceBandFromLabel(item.priceLabel),
                      destination: item.href,
                    }
                  : undefined
              }
              className={`interactive-card flex flex-col rounded-[1.35rem] border p-5 no-underline ${
                item.highlight
                  ? 'border-[rgba(214,172,96,0.28)] bg-[rgba(214,172,96,0.09)]'
                  : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.035)]'
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b6bece]">
                    {item.title}
                  </div>
                  <div className="mt-2 text-[2rem] font-black tracking-tight text-white">
                    {item.priceLabel}
                  </div>
                </div>
                {item.badge ? (
                  <span className="rounded-full border border-[rgba(214,172,96,0.26)] bg-[rgba(214,172,96,0.08)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gold-light)]">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <p className="flex-grow text-sm leading-relaxed text-[#d3d8e4]">{item.description}</p>
              <span className="link-gold-elegant mt-5 text-sm font-semibold">{item.cta}</span>
            </TrackedLink>
          ))}
        </div>

        {note ? (
          <p className="mt-5 text-xs leading-relaxed text-[#9b8f7f]">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
