import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrackView from '@/app/components/analytics/TrackView';
import ChecklistToolView from '@/app/components/portal/ChecklistToolView';
import WizardToolView from '@/app/components/portal/WizardToolView';
import PortalShell, {
  LinkList,
  OfficialSourceList,
  PortalCard,
  PortalDisclaimer,
} from '@/app/components/portal/PortalShell';
import { getPortalSituation } from '@/lib/portal/situations';
import { PORTAL_TOOLS, getPortalTool } from '@/lib/portal/tools';
import { faqPageSchema, jsonLdScript } from '@/lib/schemas';
import { DEFAULT_OG_IMAGE, canonicalUrl } from '@/lib/seo/site';

type RouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return PORTAL_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getPortalTool(slug);
  if (!tool) return {};
  const href = `/nastroje/${tool.slug}`;
  return {
    title: { absolute: `${tool.metaTitle} | SmlouvaHned` },
    description: tool.metaDescription,
    alternates: { canonical: canonicalUrl(href) },
    openGraph: {
      type: 'website',
      locale: 'cs_CZ',
      url: canonicalUrl(href),
      siteName: 'SmlouvaHned',
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: tool.metaTitle, description: tool.metaDescription },
  };
}

export default async function ToolPage({ params }: RouteProps) {
  const { slug } = await params;
  const tool = getPortalTool(slug);
  if (!tool) notFound();
  const situation = getPortalSituation(tool.situation);
  const href = `/nastroje/${tool.slug}`;
  const faq = tool.kind === 'wizard'
    ? tool.outcomes.slice(0, 4).map((outcome) => ({ question: outcome.title, answer: outcome.summary }))
    : [{ question: tool.title, answer: tool.answer }];

  return (
    <PortalShell
      crumbs={[
        { label: 'SmlouvaHned', href: '/' },
        { label: 'Nástroje', href: '/nastroje' },
        { label: tool.title, href },
      ]}
      kicker={tool.kind === 'wizard' ? 'Rozhodovací průvodce zdarma' : 'Checklist zdarma'}
      title={tool.title}
      lead={tool.description}
      updatedAt={tool.updatedAt}
      verifiedAt={tool.updatedAt}
      width="narrow"
    >
      <TrackView eventName="situation_viewed" eventParams={{ portal_situation: tool.situation, surface: 'tool_page', tool_key: tool.slug, tool_kind: tool.kind }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(faq)) }} />

      <div className="space-y-10">
        <PortalCard highlighted>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Stručná odpověď</div>
          <p className="text-base leading-8 text-white">{tool.answer}</p>
          {tool.legalNote ? <p className="mt-3 text-xs leading-6 text-slate-400">{tool.legalNote}</p> : null}
        </PortalCard>

        {tool.kind === 'checklist' ? <ChecklistToolView tool={tool} /> : <WizardToolView tool={tool} />}

        <OfficialSourceList sources={tool.sources} />

        <section className="rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-labelledby="related-title">
          <h2 id="related-title" className="font-serif italic text-xl font-bold text-white">Související</h2>
          <div className="mt-4">
            <LinkList items={[...tool.related, { href: situation.hubHref, label: situation.title }]} />
          </div>
          <Link href="/nastroje" className="mt-4 inline-block text-xs font-semibold text-slate-400 transition hover:text-white">
            ← Všechny nástroje
          </Link>
        </section>

        <PortalDisclaimer />
      </div>
    </PortalShell>
  );
}
