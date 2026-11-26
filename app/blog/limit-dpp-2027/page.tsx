import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import OfficialSources from '@/app/components/blog/OfficialSources';
import { DPP_THRESHOLD_2027_SOURCE, LABOR_RATES_2026, LABOR_RATES_2027 } from '@/lib/legal/labor-rates';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';

const SLUG = 'limit-dpp-2027';
const limit = LABOR_RATES_2027.dppMonthlyThreshold;
const amount = (value: number) => value.toLocaleString('cs-CZ');

export const metadata = blogArticlePageMetadata(SLUG);

export default function LimitDpp2027Page() {
  return (
    <ArticlePageLayout
      category="Práce a zaměstnání"
      readTime="5 min"
      dateTime="2026-11-27"
      dateLabel="27. listopadu 2026"
      breadcrumbLabel="Limit DPP 2027"
      slug={SLUG}
      title={`Limit DPP 2027 je ${amount(limit)} Kč měsíčně. Kdy se platí odvody?`}
      intro={`Od 1. ledna 2027 se u dohody o provedení práce zvyšuje rozhodná částka pro účast na pojištění na ${amount(limit)} Kč za kalendářní měsíc u jednoho zaměstnavatele. Pojistné se odvádí už při dosažení této částky. V roce 2026 je hranice ${amount(LABOR_RATES_2026.dppMonthlyThreshold)} Kč.`}
      toc={[
        { href: '#od-kolika', label: 'Od kolika korun se platí pojistné' },
        { href: '#scitani-dohod', label: 'Kdy se příjmy z dohod sčítají' },
        { href: '#zdravotni-pojisteni', label: 'Zdravotní pojištění pod limitem' },
        { href: '#limit-hodin-a-evidence', label: 'Limit hodin a evidence zaměstnanců' },
      ]}
      trustBox={{
        generatorSuitable: 'Písemná DPP pro sjednání práce, hrubé odměny a doby, na kterou se dohoda uzavírá.',
        lawyerSuitable: 'Sporné posouzení vztahu nebo práce ve více státech. Odvody a konkrétní čistou odměnu ověřte u mzdové účetní.',
      }}
      finalAction={{
        title: 'Připravujete dohodu na rok 2027?',
        body: 'Ve formuláři DPP uvedete sjednanou práci, dobu trvání a hrubou odměnu.',
        buttonLabel: 'Vytvořit dohodu o provedení práce',
        href: '/dpp',
      }}
      relatedLinks={[
        { href: '/blog/dovolena-dpp-2026', label: 'Nárok na dovolenou u DPP a výpočet' },
        { href: '/blog/dpp-dohoda-provedeni-prace', label: 'Co musí obsahovat DPP' },
        { href: '/zmeny-2027', label: 'Přehled změn pro rok 2027' },
      ]}
    >
      <section id="od-kolika" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Od kolika korun se v roce 2027 platí pojistné</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Rozhoduje započitatelný hrubý příjem zúčtovaný za kalendářní měsíc. Při dosažení hranice vzniká účast na
          nemocenském a důchodovém pojištění. Stejná hranice se používá pro posouzení, zda je pracovník z DPP
          zaměstnancem pro účely veřejného zdravotního pojištění.
        </p>
        <ul className="list-disc space-y-2 pl-5 leading-relaxed text-slate-400">
          <li><strong>Méně než {amount(limit)} Kč.</strong> Z této DPP se v daném měsíci sociální ani zdravotní pojistné neodvádí, pokud u téhož zaměstnavatele součet příjmů z DPP zůstane pod hranicí.</li>
          <li><strong>Od {amount(limit)} Kč včetně.</strong> Pojistné se počítá z vyměřovacího základu podle pravidel daného pojištění, nikoli jen z části odměny nad hranicí. U zdravotního pojištění může hrát roli minimální vyměřovací základ.</li>
        </ul>
      </section>

      <section id="scitani-dohod" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Kdy se příjmy z více DPP sčítají</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Sečtěte všechny započitatelné příjmy z DPP u stejného zaměstnavatele v daném měsíci. Příjmy z DPP
          u různých zaměstnavatelů posuzujte zvlášť. K rozhodné částce pro DPP se nepřičítá příjem z pracovního
          poměru ani z DPČ, a to ani u stejného zaměstnavatele.
        </p>
        <ul className="list-disc space-y-2 pl-5 leading-relaxed text-slate-400">
          <li><strong>Dvě DPP u stejné firmy.</strong> Odměny 7 000 Kč a 5 500 Kč dají v jednom měsíci dohromady {amount(limit)} Kč. Hranice je dosažena.</li>
          <li><strong>Dvě DPP u různých firem.</strong> Každý zaměstnavatel posuzuje jen vlastní zúčtovanou odměnu. Při odměnách 7 000 Kč a 5 500 Kč hranice dosažena není ani u jednoho.</li>
        </ul>
      </section>

      <section id="zdravotni-pojisteni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Kdo řeší zdravotní pojištění pod limitem</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pokud jste účastníkem českého veřejného zdravotního pojištění, ověřte, kdo za vás pojistné hradí.
          Při DPP pod hranicí ho může pokrývat jiné zaměstnání, samostatná výdělečná činnost nebo status státního
          pojištěnce. Pokud žádný z těchto důvodů netrvá ani část kalendářního měsíce, může vzniknout povinnost
          přihlásit se u zdravotní pojišťovny jako osoba bez zdanitelných příjmů (OBZP) a platit si pojistné.
        </p>
        <p className="leading-relaxed text-slate-400">
          Částka {amount(limit)} Kč určuje účast na pojištění. Výši čisté odměny ovlivňují i pravidla daně z příjmů,
          Prohlášení poplatníka a případné slevy. Pro výpočet čisté odměny si nechte ověřit celý mzdový výpočet.
        </p>
      </section>

      <section id="limit-hodin-a-evidence" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Co hlídat vedle měsíční hranice</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U DPP lze u jednoho zaměstnavatele odpracovat nejvýše 300 hodin za kalendářní rok. Sčítají se hodiny
          skutečně odpracované na jeho DPP. Tento roční limit sledujte samostatně vedle měsíční hranice pro pojištění
          a podmínek vzniku dovolené.
        </p>
        <p className="leading-relaxed text-slate-400">
          Zaměstnavatel vede evidenci zaměstnanců a podává jednotné měsíční hlášení (JMHZ) i u DPP, ze kterých účast
          na pojištění nevznikla. Před zpracováním lednových mezd aktualizujte hranici v mzdovém systému a zkontrolujte,
          zda přehled správně sčítá více dohod stejného zaměstnance.
        </p>
      </section>

      <OfficialSources sources={[
        { label: 'e-Sbírka — Sdělení MPSV č. 184/2026 Sb., rozhodná částka od 1. ledna 2027', href: DPP_THRESHOLD_2027_SOURCE },
        { label: 'ČSSZ — Jak se u DPP posuzuje účast na pojištění a souběh dohod', href: 'https://www.cssz.gov.cz/web/cz/-/dohody-o-provedeni-prace-pravidla-pro-ucast-na-pojisteni-od-1-1-2025' },
        { label: 'VZP — Dohody o provedení práce a zdravotní pojištění', href: 'https://www.vzp.cz/platci/informace/zamestnavatel/dohody-o-provedeni-prace' },
        { label: 'VZP — Kdy je nutné hradit pojistné jako OBZP', href: 'https://www.vzp.cz/platci/informace/obzp/kdo-je-obzp' },
        { label: 'ČSSZ — Jednotné měsíční hlášení zaměstnavatele', href: 'https://www.cssz.gov.cz/co-je-jmhz-' },
        { label: 'Zákoník práce, § 75 — Rozsah práce na DPP', href: 'https://ppropo.mpsv.cz/zakon_262_2006' },
      ]} />
    </ArticlePageLayout>
  );
}
