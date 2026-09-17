import type { Metadata } from 'next';
import Link from 'next/link';
import TrackView from '@/app/components/analytics/TrackView';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import PortalShell, {
  EscalationNotice,
  LinkList,
  PortalCard,
  PortalDisclaimer,
  PortalSection,
} from '@/app/components/portal/PortalShell';
import { CASE_DOCUMENT_LIST, CASE_DOCUMENT_PRICE_LABEL } from '@/lib/cases/documents';
import { WORK_ORDER_STAGE_LIST } from '@/lib/cases/workflow';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { THEMATIC_PACKAGE_CONFIG } from '@/lib/packages';
import { getPortalSituation } from '@/lib/portal/situations';
import { getPortalToolsForSituation } from '@/lib/portal/tools';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';
import { faqPageSchema, jsonLdScript } from '@/lib/schemas';
import { DEFAULT_OG_IMAGE, canonicalUrl } from '@/lib/seo/site';

const situation = getPortalSituation('zakazka');
const WORK_ORDER = THEMATIC_PACKAGE_CONFIG.work_order;

export const metadata: Metadata = {
  title: { absolute: 'Řeším zakázku: smlouva o dílo, vícepráce, předání a vady na jednom místě | SmlouvaHned' },
  description:
    'Zakázka od smlouvy po předání: smlouva o dílo, změnový list, vícepráce, předávací protokol a evidence vad s termíny a připomínkami. Bez registrace.',
  alternates: { canonical: canonicalUrl('/zakazka') },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: canonicalUrl('/zakazka'),
    siteName: 'SmlouvaHned',
    title: 'Řeším zakázku — od smlouvy po předání',
    description: 'Smlouva o dílo, vícepráce, předání a vady jako jeden průběh s termíny a připomínkami.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const faq = [
  {
    question: 'Co je „Moje zakázka“?',
    answer:
      'Po zaplacení smlouvy o dílo můžete zakázku uložit jako případ: uvidíte termín, fázi, doporučené další kroky a připomínky. Navazující dokumenty (změnový list, vícepráce, předávací protokol, vady) vytvoříte přímo v zakázce. Bez registrace — vracíte se odkazem z e-mailu.',
  },
  {
    question: 'Kolik to stojí?',
    answer: `Smlouva o dílo stojí ${PRICING_TIER_CONFIG.basic.priceLabel} (základní) nebo ${PRICING_TIER_CONFIG.complete.priceLabel} (rozšířená). Balíček Zakázka Plus za ${WORK_ORDER.priceLabel} obsahuje smlouvu i všechny navazující dokumenty. U samostatné smlouvy stojí každý navazující dokument v zakázce ${CASE_DOCUMENT_PRICE_LABEL}. Založení zakázky, termíny a připomínky jsou zdarma.`,
  },
  {
    question: 'Musím se registrovat?',
    answer: 'Ne. Zakázku otevřete návratovým odkazem, který přijde na e-mail z objednávky. Odkaz můžete kdykoli zneplatnit a zakázku smazat.',
  },
  {
    question: 'Nahrazuje to právníka?',
    answer: 'Ne. Jde o standardizované dokumenty a přehled kroků pro běžnou zakázku. U sporů, staveb vyšší hodnoty nebo neobvyklých podmínek doporučujeme individuální právní posouzení.',
  },
];

export default function ZakazkaHubPage() {
  const caseEngine = isFeatureEnabled('caseEngine');
  const zakazkaPlus = isFeatureEnabled('zakazkaPlus');
  const tools = getPortalToolsForSituation('zakazka');

  return (
    <PortalShell
      crumbs={[{ label: 'SmlouvaHned', href: '/' }, { label: 'Řeším zakázku', href: '/zakazka' }]}
      kicker="Řeším zakázku"
      title="Zakázka od smlouvy po předání"
      lead="Smlouva o dílo je začátek. Během zakázky přijdou změny rozsahu, vícepráce, termín, předání a někdy vady. SmlouvaHned vám dá dokumenty pro každý krok, pohlídá termín a připomene, co je na řadě."
    >
      <TrackView eventName="situation_viewed" eventParams={{ portal_situation: 'zakazka', surface: 'situation_hub' }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(faq)) }} />

      <div className="space-y-16">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]" aria-labelledby="start-title">
          <PortalCard highlighted>
            <h2 id="start-title" className="font-serif italic text-2xl font-bold text-white">Začít zakázku</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Vyplníte údaje o stranách, díle, ceně a termínu. Před platbou vidíte přesnou cenu a vyberete variantu.
              Po zaplacení {caseEngine ? 'můžete pokračovat jako zakázka s termíny a připomínkami.' : 'stáhnete hotové PDF.'}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-slate-400">
              <li>• Základní smlouva o dílo — {PRICING_TIER_CONFIG.basic.priceLabel}</li>
              <li>• Rozšířená smlouva o dílo — {PRICING_TIER_CONFIG.complete.priceLabel}</li>
              {zakazkaPlus ? <li>• Zakázka Plus (smlouva + všechny navazující dokumenty) — {WORK_ORDER.priceLabel}</li> : null}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLink
                href="/smlouva-o-dilo"
                eventName="situation_started"
                eventParams={{ portal_situation: 'zakazka', surface: 'situation_hub', cta_type: 'primary' }}
                extraEventName="situation_cta_click"
                extraEventParams={{ surface: 'situation_page', destination: '/smlouva-o-dilo' }}
                className="site-button-primary"
              >
                Začít zakázku →
              </TrackedLink>
              {zakazkaPlus ? (
                <TrackedLink
                  href="/balicek-zakazka"
                  eventName="bundle_viewed"
                  eventParams={{ portal_situation: 'zakazka', surface: 'situation_hub', package_key: 'work_order', price_band: '399' }}
                  className="site-button-secondary"
                >
                  Zakázka Plus
                </TrackedLink>
              ) : null}
            </div>
          </PortalCard>
          <PortalCard>
            <h2 className="font-serif italic text-xl font-bold text-white">Máte už zakázku?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Otevřete ji odkazem z e-mailu, nebo si nechte poslat nový návratový odkaz. Bez hesla, bez registrace.
            </p>
            <Link href="/moje-zakazka/obnovit" className="site-button-secondary mt-5">Poslat návratový odkaz</Link>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Pro odhad ceny stavby nebo rozpočet použijte samostatnou službu{' '}
              <a href="https://www.planstavby.cz/?utm_source=smlouvahned&utm_medium=cross_sell&utm_campaign=zakazka" target="_blank" rel="noopener noreferrer" className="text-[#e2c77b] underline underline-offset-2">PlanStavby.cz</a>
              . Údaje z vaší smlouvy se nepřenášejí.
            </p>
          </PortalCard>
        </section>

        <PortalSection id="prubeh" kicker="Jak zakázka probíhá" title="Šest fází, ke každé správný dokument">
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WORK_ORDER_STAGE_LIST.map((stage, index) => (
              <li key={stage.key} className="site-content-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c9a852]/30 text-sm font-bold text-[#c9a852]">{index + 1}</span>
                  <h3 className="font-semibold text-white">{stage.label}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{stage.description}</p>
                {stage.documents.length > 0 ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Dokumenty: {stage.documents.map((kind) => CASE_DOCUMENT_LIST.find((doc) => doc.kind === kind)?.shortTitle).filter(Boolean).join(', ')}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </PortalSection>

        {caseEngine ? (
          <PortalSection id="moje-zakazka" kicker="Moje zakázka" title="Pokračujte v celé situaci, ne jen v prvním PDF">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="space-y-4 text-sm leading-7 text-slate-400">
                <p>
                  Po zaplacení smlouvy o dílo nabídneme <strong className="text-white">Pokračovat jako zakázka</strong>. Zakázka drží termín,
                  cenový režim, aktuální fázi, vytvořené dokumenty a doporučené další kroky.
                </p>
                <p>
                  Připomínky přijdou 30, 14 a 7 dní před termínem a den předem — vždy s konkrétním krokem
                  („Blíží se termín předání. Připravte předávací protokol.“), ne jen „máte připomínku“.
                </p>
                <p>
                  Do zakázky neukládáme obsah smlouvy ani údaje protistrany — jen to, co potřebujete k pokračování.
                  Zakázku můžete kdykoli exportovat nebo smazat.
                </p>
              </div>
              <div className="site-content-card rounded-2xl p-5">
                <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Navazující dokumenty v zakázce</div>
                <ul className="space-y-3">
                  {CASE_DOCUMENT_LIST.map((document) => (
                    <li key={document.kind}>
                      <div className="text-sm font-semibold text-white">{document.title}</div>
                      <div className="text-xs leading-6 text-slate-500">{document.whenToUse}</div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {zakazkaPlus ? `V balíčku Zakázka Plus jsou všechny v ceně. ` : ''}U samostatné smlouvy {CASE_DOCUMENT_PRICE_LABEL} za dokument.
                </p>
              </div>
            </div>
          </PortalSection>
        ) : null}

        <PortalSection id="nastroje" kicker="Zdarma" title="Nástroje k zakázce">
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/nastroje/${tool.slug}`} className="site-content-card group rounded-2xl p-5 transition hover:border-[#c9a852]/40">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tool.kind === 'wizard' ? 'Průvodce' : 'Checklist'}</span>
                <span className="mt-2 block font-serif italic text-lg font-bold text-white group-hover:text-[#e2c77b]">{tool.title}</span>
                <span className="mt-2 block text-sm leading-7 text-slate-400">{tool.description}</span>
              </Link>
            ))}
          </div>
        </PortalSection>

        <PortalSection id="odpovedi" kicker="Odpovědi" title="Co lidé u zakázek řeší nejčastěji">
          <div className="grid gap-6 md:grid-cols-2">
            <LinkList eyebrow="Praktické odpovědi" items={situation.articles} />
            <LinkList eyebrow="Dokumenty" items={situation.documents} />
          </div>
        </PortalSection>

        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className="font-serif italic text-2xl font-bold text-white md:text-3xl">Časté otázky</h2>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-400">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <EscalationNotice text="Spor o kvalitu díla, nejasné vlastnictví pozemku nebo stavby, významná odpovědnost za škodu, veřejná zakázka nebo neobvyklé rozdělení rizik — tam může situace vyžadovat individuální právní posouzení." />
        <PortalDisclaimer />
      </div>
    </PortalShell>
  );
}
