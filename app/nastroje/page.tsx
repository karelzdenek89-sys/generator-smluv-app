import type { Metadata } from 'next';
import Link from 'next/link';
import PortalShell, { PortalDisclaimer, PortalSection } from '@/app/components/portal/PortalShell';
import { PORTAL_SITUATIONS } from '@/lib/portal/situations';
import { PORTAL_TOOLS } from '@/lib/portal/tools';
import { DEFAULT_OG_IMAGE, canonicalUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: { absolute: 'Bezplatné nástroje: checklisty a průvodci pro smlouvy | SmlouvaHned' },
  description:
    'Bezplatné checklisty a rozhodovací průvodci: zakázka a smlouva o dílo, zaměstnávání, prodej a koupě auta, pronájem bytu. Výsledek hned, bez registrace.',
  alternates: { canonical: canonicalUrl('/nastroje') },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: canonicalUrl('/nastroje'),
    siteName: 'SmlouvaHned',
    title: 'Bezplatné nástroje: checklisty a průvodci pro smlouvy',
    description: 'Checklisty a rozhodovací průvodci pro zakázky, zaměstnávání, auto a pronájem. Bez registrace.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ToolsIndexPage() {
  const groups = PORTAL_SITUATIONS.map((situation) => ({
    situation,
    tools: PORTAL_TOOLS.filter((tool) => tool.situation === situation.key),
  })).filter((group) => group.tools.length > 0);

  return (
    <PortalShell
      crumbs={[{ label: 'SmlouvaHned', href: '/' }, { label: 'Nástroje', href: '/nastroje' }]}
      kicker="Bezplatné nástroje"
      title="Checklisty a průvodci, které dají výsledek hned"
      lead="Projděte body, získejte doporučení a teprve potom se rozhodněte, zda potřebujete dokument. Bez e-mailu, bez registrace — údaje zůstávají ve vašem prohlížeči."
    >
      <div className="space-y-12">
        {groups.map(({ situation, tools }) => (
          <PortalSection key={situation.key} id={situation.key} kicker={situation.label} title={situation.title}>
            <div className="grid gap-4 md:grid-cols-2">
              {tools.map((tool) => (
                <Link key={tool.slug} href={`/nastroje/${tool.slug}`} className="site-content-card group flex h-full flex-col rounded-2xl p-5 transition hover:border-[#c9a852]/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {tool.kind === 'wizard' ? 'Rozhodovací průvodce' : 'Checklist'}
                  </span>
                  <span className="mt-2 font-serif italic text-lg font-bold text-white group-hover:text-[#e2c77b]">{tool.title}</span>
                  <span className="mt-2 flex-grow text-sm leading-7 text-slate-400">{tool.description}</span>
                  <span className="mt-4 text-xs font-semibold text-[#c9a852]">Otevřít nástroj →</span>
                </Link>
              ))}
            </div>
          </PortalSection>
        ))}
        <PortalDisclaimer />
      </div>
    </PortalShell>
  );
}
