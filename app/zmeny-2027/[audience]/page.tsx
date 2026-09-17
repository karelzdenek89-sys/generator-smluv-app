import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrackView from '@/app/components/analytics/TrackView';
import LegalChangeCard from '@/app/components/portal/LegalChangeCard';
import PortalShell, { LinkList, PortalDisclaimer } from '@/app/components/portal/PortalShell';
import {
  LEGAL_AUDIENCES,
  LEGAL_AUDIENCE_HUBS,
  LEGAL_AUDIENCE_LIST,
  getLegalChangesForAudience,
  getRadarVerifiedAt,
  type LegalAudience,
} from '@/lib/legal/radar';
import { DEFAULT_OG_IMAGE, canonicalUrl } from '@/lib/seo/site';

type RouteProps = { params: Promise<{ audience: string }> };

export const dynamicParams = false;

function resolveAudience(slug: string): LegalAudience | null {
  return LEGAL_AUDIENCES.find((key) => LEGAL_AUDIENCE_HUBS[key].slug === slug) ?? null;
}

export async function generateStaticParams() {
  return LEGAL_AUDIENCE_LIST.map((hub) => ({ audience: hub.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { audience } = await params;
  const key = resolveAudience(audience);
  if (!key) return {};
  const hub = LEGAL_AUDIENCE_HUBS[key];
  return {
    title: { absolute: `${hub.metaTitle} | SmlouvaHned` },
    description: hub.metaDescription,
    alternates: { canonical: canonicalUrl(hub.href) },
    openGraph: {
      type: 'website',
      locale: 'cs_CZ',
      url: canonicalUrl(hub.href),
      siteName: 'SmlouvaHned',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function LegalRadarAudiencePage({ params }: RouteProps) {
  const { audience } = await params;
  const key = resolveAudience(audience);
  if (!key) notFound();
  const hub = LEGAL_AUDIENCE_HUBS[key];
  const changes = getLegalChangesForAudience(key);
  const verifiedAt = getRadarVerifiedAt();

  return (
    <PortalShell
      crumbs={[
        { label: 'SmlouvaHned', href: '/' },
        { label: 'Změny 2027', href: '/zmeny-2027' },
        { label: hub.shortTitle, href: hub.href },
      ]}
      kicker="Legislativní radar 2027"
      title={hub.title}
      lead={hub.description}
      updatedAt={verifiedAt}
      verifiedAt={verifiedAt}
      aside={
        <>
          <div className="site-content-card rounded-2xl p-5">
            <LinkList eyebrow="Další krok" items={hub.nextSteps} />
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <LinkList
              eyebrow="Ostatní přehledy"
              items={LEGAL_AUDIENCE_LIST.filter((item) => item.key !== key).map((item) => ({ href: item.href, label: item.shortTitle }))}
            />
          </div>
        </>
      }
    >
      <TrackView eventName="legal_change_viewed" eventParams={{ portal_situation: 'zmeny-2027', surface: 'legal_radar_hub', legal_change_key: hub.slug }} />
      <div className="space-y-5">
        {changes.length === 0 ? (
          <p className="text-sm text-slate-400">Pro tuto skupinu zatím nesledujeme žádnou ověřenou změnu.</p>
        ) : (
          changes.map((change) => <LegalChangeCard key={change.key} change={change} />)
        )}
        <div className="pt-4">
          <Link href="/zmeny-2027" className="text-xs font-semibold text-slate-400 transition hover:text-white">← Celý radar 2027</Link>
        </div>
        <PortalDisclaimer />
      </div>
    </PortalShell>
  );
}
