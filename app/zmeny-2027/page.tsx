import type { Metadata } from 'next';
import Link from 'next/link';
import TrackView from '@/app/components/analytics/TrackView';
import LegalChangeCard, { LegalStatusBadge } from '@/app/components/portal/LegalChangeCard';
import PortalShell, { PortalDisclaimer, PortalSection, formatIsoDateCz } from '@/app/components/portal/PortalShell';
import {
  LEGAL_AUDIENCE_LIST,
  LEGAL_CHANGES,
  LEGAL_CHANGE_STATUSES,
  LEGAL_CHANGE_STATUS_DESCRIPTIONS,
  getRadarVerifiedAt,
} from '@/lib/legal/radar';
import { DEFAULT_OG_IMAGE, canonicalUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: { absolute: 'Změny 2027: legislativní radar pro zaměstnavatele, OSVČ, spotřebitele a řidiče | SmlouvaHned' },
  description:
    'Legislativní radar 2027: každá změna se statusem (platí / schváleno / projednává se), datem účinnosti, dopadem na dokumenty a oficiálním zdrojem. Bez marketingu.',
  alternates: { canonical: canonicalUrl('/zmeny-2027') },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: canonicalUrl('/zmeny-2027'),
    siteName: 'SmlouvaHned',
    title: 'Změny 2027: legislativní radar',
    description: 'Co platí, co je schválené a co se projednává — s oficiálními zdroji a datem ověření.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function LegalRadarPage() {
  const verifiedAt = getRadarVerifiedAt();
  const counts = Object.fromEntries(
    LEGAL_CHANGE_STATUSES.map((status) => [status, LEGAL_CHANGES.filter((change) => change.status === status).length]),
  ) as Record<(typeof LEGAL_CHANGE_STATUSES)[number], number>;

  return (
    <PortalShell
      crumbs={[{ label: 'SmlouvaHned', href: '/' }, { label: 'Změny 2027', href: '/zmeny-2027' }]}
      kicker="Legislativní radar"
      title="Změny 2027: co platí, co je schválené a co se teprve projednává"
      lead="Každá položka má explicitní status, datum, dopad na vaše dokumenty a odkaz na oficiální zdroj. U konkrétní změny si můžete zapnout bezplatné e-mailové upozornění na změnu statusu nebo data účinnosti. Návrh zákona nikdy neprezentujeme jako platné právo."
      updatedAt={verifiedAt}
      verifiedAt={verifiedAt}
    >
      <TrackView eventName="situation_viewed" eventParams={{ portal_situation: 'zmeny-2027', surface: 'legal_radar' }} />

      <div className="space-y-14">
        <section aria-labelledby="statuses-title">
          <h2 id="statuses-title" className="sr-only">Jak číst statusy</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LEGAL_CHANGE_STATUSES.map((status) => (
              <div key={status} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-2">
                  <LegalStatusBadge status={status} />
                  <span className="text-xs text-slate-400">{counts[status]}</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">{LEGAL_CHANGE_STATUS_DESCRIPTIONS[status]}</p>
              </div>
            ))}
          </div>
        </section>

        <PortalSection id="koho-se-tyka" kicker="Vyberte, koho se změny týkají" title="Tematické přehledy">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {LEGAL_AUDIENCE_LIST.map((hub) => {
              const hubChanges = LEGAL_CHANGES.filter((change) => change.audiences.includes(hub.key));
              return (
                <Link key={hub.key} href={hub.href} className="site-content-card group flex h-full flex-col rounded-2xl p-5 transition hover:border-[#c9a852]/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">{hub.shortTitle}</span>
                  <span className="mt-2 font-serif italic text-lg font-bold text-white group-hover:text-[#e2c77b]">{hub.title}</span>
                  <span className="mt-2 flex-grow text-sm leading-7 text-slate-400">{hub.description}</span>
                  <span className="mt-4 text-xs text-slate-400">{hubChanges.length} položek · otevřít →</span>
                </Link>
              );
            })}
          </div>
        </PortalSection>

        <PortalSection id="vsechny-zmeny" kicker="Kompletní přehled" title="Všechny sledované změny">
          <div className="space-y-5">
            {LEGAL_CHANGES.map((change) => (
              <LegalChangeCard key={change.key} change={change} compact />
            ))}
          </div>
        </PortalSection>

        <section className="rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-labelledby="method-title">
          <h2 id="method-title" className="font-serif italic text-xl font-bold text-white">Jak radar vzniká</h2>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-400">
            <li>• Zdrojem jsou výhradně oficiální předpisy a úřady: e-Sbírka, Poslanecká sněmovna, MPSV, ČSSZ, Finanční správa, MPO, EUR-Lex.</li>
            <li>• Každá položka nese datum poslední ruční kontroly (naposledy {formatIsoDateCz(verifiedAt)}). Položky po 90 dnech označujeme interně k revizi.</li>
            <li>• Automatizace smí označit, že je potřeba kontrola; nikdy sama nemění právní obsah dokumentů. Nové verze šablon procházejí ručním review.</li>
          </ul>
        </section>

        <PortalDisclaimer />
      </div>
    </PortalShell>
  );
}
