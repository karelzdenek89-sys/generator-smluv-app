import type { Metadata } from 'next';
import Link from 'next/link';
import TrackView from '@/app/components/analytics/TrackView';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import WizardToolView from '@/app/components/portal/WizardToolView';
import PortalShell, {
  EscalationNotice,
  LinkList,
  PortalCard,
  PortalDisclaimer,
  PortalSection,
} from '@/app/components/portal/PortalShell';
import { LegalStatusBadge } from '@/app/components/portal/LegalChangeCard';
import { getLegalChangesForAudience } from '@/lib/legal/radar';
import { THEMATIC_PACKAGE_CONFIG } from '@/lib/packages';
import { getAnswerFirstArticlesBySection, articleHref } from '@/lib/portal/articles';
import { getPortalSituation } from '@/lib/portal/situations';
import { getPortalTool, getPortalToolsForSituation } from '@/lib/portal/tools';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';
import { faqPageSchema, jsonLdScript } from '@/lib/schemas';
import { DEFAULT_OG_IMAGE, canonicalUrl } from '@/lib/seo/site';

const situation = getPortalSituation('zamestnavam');
const EMPLOYER_START = THEMATIC_PACKAGE_CONFIG.employer_start;

export const metadata: Metadata = {
  title: { absolute: 'Zaměstnávám: pracovní smlouva, DPP, OSVČ, ukončení — co potřebujete vyřešit | SmlouvaHned' },
  description:
    'Rozcestník pro zaměstnavatele: pracovní smlouva, DPP nebo OSVČ, mlčenlivost, změna podmínek, ukončení pracovního poměru a změny 2027. Průvodce a dokumenty online.',
  alternates: { canonical: canonicalUrl('/zamestnavam') },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: canonicalUrl('/zamestnavam'),
    siteName: 'SmlouvaHned',
    title: 'Zaměstnávám — co potřebujete vyřešit?',
    description: 'Pracovní smlouva, DPP, OSVČ, mlčenlivost, změna podmínek, ukončení. Průvodce a dokumenty.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const faq = [
  {
    question: 'Jak poznám, jestli potřebuji pracovní smlouvu, nebo stačí DPP?',
    answer:
      'Pravidelná dlouhodobá práce pod vaším vedením patří do pracovní smlouvy. DPP je pro práci do 300 hodin ročně u jednoho zaměstnavatele. Průvodce „Jaký vztah potřebuji?“ vám odpoví během minuty.',
  },
  {
    question: 'Můžu člověka zaměstnat „na IČO“?',
    answer:
      'Jen pokud skutečně podniká samostatně — vlastní prostředky, riziko, více klientů. Práce podle vašich pokynů a v určené době je závislá práce a musí být v pracovněprávním vztahu.',
  },
  {
    question: 'Kolik stojí dokumenty?',
    answer: `Pracovní smlouva nebo DPP stojí ${PRICING_TIER_CONFIG.basic.priceLabel} (základní) nebo ${PRICING_TIER_CONFIG.complete.priceLabel} (rozšířená). Balíček ${EMPLOYER_START.title} s informací podle § 37 ZP a nástupními podklady stojí ${EMPLOYER_START.priceLabel}. Průvodci a checklisty jsou zdarma.`,
  },
];

export default function ZamestnavamHubPage() {
  const wizard = getPortalTool('jaky-vztah-potrebuji');
  const tools = getPortalToolsForSituation('zamestnavam').filter((tool) => tool.slug !== 'jaky-vztah-potrebuji');
  const articles = getAnswerFirstArticlesBySection('zamestnavam');
  const radar = getLegalChangesForAudience('employers').slice(0, 4);

  return (
    <PortalShell
      crumbs={[{ label: 'SmlouvaHned', href: '/' }, { label: 'Zaměstnávám', href: '/zamestnavam' }]}
      kicker="Zaměstnávám"
      title="Co potřebujete vyřešit?"
      lead="Ne paragrafy, ale situace: přijímám člověka, potřebuji brigádníka, spolupracuji s OSVČ, chráním know-how, měním podmínky, končím pracovní poměr. Ke každé máte odpověď, nástroj a dokument."
    >
      <TrackView eventName="situation_viewed" eventParams={{ portal_situation: 'zamestnavam', surface: 'situation_hub' }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(faq)) }} />

      <div className="space-y-16">
        <PortalSection id="situace" kicker="Vyberte situaci" title="Šest nejčastějších situací zaměstnavatele">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.slug} href={articleHref(article)} className="site-content-card group flex h-full flex-col rounded-2xl p-5 transition hover:border-[#c9a852]/40">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">{article.question}</span>
                <span className="mt-2 font-serif italic text-lg font-bold text-white group-hover:text-[#e2c77b]">{article.title}</span>
                <span className="mt-2 flex-grow text-sm leading-7 text-slate-400">{article.answer.split('. ')[0]}.</span>
                <span className="mt-4 text-xs font-semibold text-slate-400">Odpověď a postup →</span>
              </Link>
            ))}
          </div>
        </PortalSection>

        {wizard && wizard.kind === 'wizard' ? (
          <PortalSection id="pruvodce" kicker="Rozhodovací průvodce zdarma" title="Jaký vztah potřebuji?">
            <p className="mb-6 max-w-2xl text-sm leading-7 text-slate-400">
              Několik otázek o délce, řízení práce a rozsahu hodin. Výsledkem je doporučení s vysvětlením — a upozornění tam,
              kde rozhoduje skutečný průběh vztahu, ne název smlouvy.
            </p>
            <WizardToolView tool={wizard} />
          </PortalSection>
        ) : null}

        <PortalSection id="dokumenty" kicker="Dokumenty online" title="Vytvořit dokument">
          <div className="grid gap-4 md:grid-cols-2">
            <PortalCard highlighted>
              <h3 className="font-serif italic text-xl font-bold text-white">Pracovní smlouva</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">Druh práce, místo, nástup, zkušební doba podle flexinovely, mzda a home office. {PRICING_TIER_CONFIG.basic.priceLabel} / {PRICING_TIER_CONFIG.complete.priceLabel}.</p>
              <TrackedLink href="/pracovni" eventName="situation_started" eventParams={{ portal_situation: 'zamestnavam', surface: 'situation_hub', cta_type: 'employment' }} className="site-button-primary mt-4">
                Vytvořit pracovní smlouvu →
              </TrackedLink>
            </PortalCard>
            <PortalCard>
              <h3 className="font-serif italic text-xl font-bold text-white">Dohoda o provedení práce</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">Do 300 hodin ročně, s hlídáním minimální hodinové mzdy a rozhodné částky pro pojištění. {PRICING_TIER_CONFIG.basic.priceLabel} / {PRICING_TIER_CONFIG.complete.priceLabel}.</p>
              <TrackedLink href="/dpp" eventName="situation_started" eventParams={{ portal_situation: 'zamestnavam', surface: 'situation_hub', cta_type: 'dpp' }} className="site-button-secondary mt-4">
                Vytvořit DPP →
              </TrackedLink>
            </PortalCard>
            <PortalCard>
              <h3 className="font-serif italic text-xl font-bold text-white">{EMPLOYER_START.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">{EMPLOYER_START.comparisonNote} {EMPLOYER_START.priceLabel}.</p>
              <TrackedLink href={EMPLOYER_START.href} eventName="bundle_viewed" eventParams={{ portal_situation: 'zamestnavam', surface: 'situation_hub', package_key: 'employer_start', price_band: '599' }} className="site-button-secondary mt-4">
                Zobrazit balíček →
              </TrackedLink>
            </PortalCard>
            <PortalCard>
              <h3 className="font-serif italic text-xl font-bold text-white">Spolupráce s OSVČ a mlčenlivost</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">Smlouva o spolupráci, smlouva o dílo nebo NDA pro dodavatele a spolupracovníky mimo pracovní poměr.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/spoluprace" className="site-button-secondary">Smlouva o spolupráci</Link>
                <Link href="/nda" className="site-button-secondary">NDA</Link>
              </div>
            </PortalCard>
          </div>
        </PortalSection>

        <PortalSection id="nastroje" kicker="Zdarma" title="Checklisty pro zaměstnavatele">
          <div className="grid gap-4 md:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/nastroje/${tool.slug}`} className="site-content-card group rounded-2xl p-5 transition hover:border-[#c9a852]/40">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Checklist</span>
                <span className="mt-2 block font-serif italic text-lg font-bold text-white group-hover:text-[#e2c77b]">{tool.title}</span>
                <span className="mt-2 block text-sm leading-7 text-slate-400">{tool.description}</span>
              </Link>
            ))}
          </div>
        </PortalSection>

        <PortalSection id="zmeny-2027" kicker="Legislativní radar" title="Co se pro zaměstnavatele mění">
          <ul className="space-y-3">
            {radar.map((change) => (
              <li key={change.key} className="site-content-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
                <div className="min-w-0">
                  <Link href={`/zmeny-2027/zamestnavatele#${change.key}`} className="font-semibold text-white transition hover:text-[#e2c77b]">{change.title}</Link>
                  <div className="text-xs text-slate-400">{change.dateLabel}</div>
                </div>
                <LegalStatusBadge status={change.status} />
              </li>
            ))}
          </ul>
          <Link href="/zmeny-2027/zamestnavatele" className="mt-4 inline-block text-sm font-semibold text-[#e2c77b] transition hover:text-white">
            Všechny změny pro zaměstnavatele →
          </Link>
        </PortalSection>

        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className="font-serif italic text-2xl font-bold text-white md:text-3xl">Časté otázky</h2>
          <dl className="mt-5 grid gap-4 md:grid-cols-3">
            {faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-400">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <LinkList eyebrow="Související průvodci" items={[
            { href: '/blog/pracovni-smlouva-2026', label: 'Pracovní smlouva 2026 — vzor' },
            { href: '/blog/dpp-dohoda-provedeni-prace', label: 'DPP 2026: limit 300 hodin' },
            { href: '/blog/flexinovela-zakoniku-prace-2026', label: 'Flexinovela zákoníku práce' },
            { href: '/blog/svarcsystem-osvc-2026', label: 'Švarcsystém — rizika' },
          ]} />
          <LinkList eyebrow="Dokumenty" items={situation.documents} />
        </div>

        <EscalationNotice text="Výpověď ze strany zaměstnavatele, spor o švarcsystém, hromadné propouštění nebo zaměstnávání cizinců mimo běžné režimy — tam doporučujeme individuální právní posouzení." />
        <PortalDisclaimer />
      </div>
    </PortalShell>
  );
}
