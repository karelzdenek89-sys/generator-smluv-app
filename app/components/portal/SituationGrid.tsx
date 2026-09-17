import Link from 'next/link';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import { HOMEPAGE_SITUATIONS, type PortalSituation } from '@/lib/portal/situations';

/**
 * „Co právě řešíte?“ — hlavní rozcestník podle situace. Hlavní CTA vždy
 * znamená skutečnou akci (začít dokument), hub je sekundární odkaz.
 */
export default function SituationGrid({
  situations = HOMEPAGE_SITUATIONS,
  surface,
}: {
  situations?: readonly PortalSituation[];
  surface: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {situations.map((situation) => (
        <article key={situation.key} className="site-content-card flex h-full flex-col rounded-2xl p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a852]">{situation.label}</p>
          <h3 className="mt-3 font-serif italic text-xl font-bold text-white">{situation.title}</h3>
          <p className="mt-2 flex-grow text-sm leading-7 text-slate-400">{situation.description}</p>
          <div className="mt-5 flex flex-col gap-2">
            <TrackedLink
              href={situation.primaryCta.href}
              eventName="situation_started"
              eventParams={{ portal_situation: situation.key, surface, cta_type: 'primary' }}
              extraEventName="homepage_situation_click"
              extraEventParams={{ portal_situation: situation.key, surface }}
              className="inline-flex items-center justify-center rounded-xl bg-[#c9a852] px-4 py-3 text-sm font-bold text-[#040c1a] transition hover:bg-[#d4b86a]"
            >
              {situation.primaryCta.label} →
            </TrackedLink>
            {situation.secondaryCta ? (
              <Link href={situation.secondaryCta.href} className="text-center text-xs font-semibold text-slate-400 transition hover:text-white">
                {situation.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
