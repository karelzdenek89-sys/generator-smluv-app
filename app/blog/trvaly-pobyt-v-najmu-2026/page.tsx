import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import OfficialSources from '@/app/components/blog/OfficialSources';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { canonicalUrl } from '@/lib/seo/site';

const SLUG = 'trvaly-pobyt-v-najmu-2026';

export const metadata = {
  ...blogArticlePageMetadata(SLUG, {
    keywords: [
      'trvalý pobyt v nájmu 2026',
      'souhlas pronajímatele trvalý pobyt',
      'nájemní smlouva trvalý pobyt',
      'doklad o ubytování cizinec',
    ],
  }),
  alternates: {
    canonical: canonicalUrl(`/blog/${SLUG}`),
    languages: getBlogHreflangAlternates(SLUG),
  },
};

export default function TrvalyPobytVNajmuPage() {
  return (
    <ArticlePageLayout
      category="Bydlení"
      readTime="9 min"
      dateTime="2026-08-13"
      dateLabel="13. srpna 2026"
      breadcrumbLabel="Trvalý pobyt v nájmu 2026"
      slug={SLUG}
      title="Trvalý pobyt v nájmu 2026: souhlas a pravidla pro cizince"
      intro="Pojem trvalý pobyt se v praxi používá pro dvě různé věci. U občana ČR jde o evidenční adresu, kterou lze zpravidla doložit platnou nájemní smlouvou. U cizince se v pobytovém řízení řeší samostatný doklad o ubytování s vlastními požadavky. Článek obě situace odděluje; není imigračním ani individuálním právním poradenstvím."
      toc={[
        { href: '#obcan-cr', label: 'Trvalý pobyt občana ČR v nájmu' },
        { href: '#pronajimatel', label: 'Co může pronajímatel po skončení nájmu' },
        { href: '#cizinec', label: 'Doklad o ubytování pro cizince' },
        { href: '#checklist', label: 'Praktický checklist dokumentů' },
      ]}
      primaryAction={{
        title: 'Potřebujete jasnou nájemní smlouvu?',
        body: 'Ve formuláři určíte strany, byt, dobu nájmu, nájemné, služby i předání. Smlouva sama nezaručuje přijetí v konkrétním pobytovém řízení.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní nájem bytu s jasným vlastníkem či oprávněným pronajímatelem, přesnou adresou, dobou trvání a podmínkami užívání.',
        lawyerSuitable:
          'Zamítnutí pobytové žádosti, sporné oprávnění k podnájmu, nesoučinnost vlastníka, nepravdivé údaje o adrese nebo spor o právo byt užívat.',
      }}
      finalAction={{
        title: 'Mějte právo užívat byt zachycené písemně',
        body: 'Přehledná nájemní smlouva je důležitý podklad. Pro pobytové řízení vždy ověřte i aktuální požadavky Ministerstva vnitra.',
        buttonLabel: 'Otevřít formulář nájemní smlouvy',
        href: '/najem',
      }}
      relatedLinks={[
        { href: '/najem', label: 'Nájemní smlouva online' },
        { href: '/blog/najemni-smlouva-vzor-2026', label: 'Nájemní smlouva 2026' },
        { href: '/blog/podnajem-vs-najem-cizinci-2026', label: 'Podnájem vs. nájem pro cizince' },
        { href: '/blog/predani-bytu-najemci-2026', label: 'Předání bytu nájemci' },
      ]}
    >
      <section id="obcan-cr" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Občan ČR zpravidla doloží právo byt užívat smlouvou
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Při ohlášení změny místa trvalého pobytu musí občan prokázat totožnost a oprávnění užívat
          dům, byt nebo obytnou místnost. Podle gov.cz lze oprávnění doložit například platnou
          nájemní smlouvou, podnájemní smlouvou, smlouvou o ubytování nebo obdobným dokumentem.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pokud nájemce právo užívání prokáže platnou smlouvou, nepotřebuje k samotnému přihlášení
          ještě samostatný souhlas pronajímatele. Oficiální průvodce MMR a gov.cz uvádějí, že zákaz
          přihlášení trvalého pobytu v nájemní smlouvě je neúčinný a ohlašovna k němu nepřihlíží.
        </p>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5 text-sm leading-7 text-slate-400">
          <ul className="space-y-2">
            <li>• Trvalý pobyt má evidenční význam.</li>
            <li>• Nezakládá vlastnické právo ani nové právo byt užívat.</li>
            <li>• Neprodlouží skončený nájem a sám o sobě nebrání vyklizení.</li>
          </ul>
        </div>
      </section>

      <section id="pronajimatel" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Po skončení nájmu může pronajímatel žádat zrušení adresy
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pronajímatel nemůže platnému nájemci zabránit v ohlášení trvalého pobytu. Jiná situace
          nastane, když nájem skončil, bývalý nájemce se odstěhoval a adresu si nezměnil. Vlastník
          může na příslušné ohlašovně podat návrh na zrušení údaje o místu trvalého pobytu.
        </p>
        <p className="leading-relaxed text-slate-400">
          Podle gov.cz musí být současně splněno, že zaniklo užívací právo a dotyčný už v bytě
          fakticky nebydlí. K doložení se hodí ukončená nájemní smlouva, dohoda o skončení nebo
          výpověď a předávací protokol. Samotný zápis trvalého pobytu není nástrojem pro řešení
          sporu o vystěhování.
        </p>
      </section>

      <ArticleInlineCta
        title="Předání bytu zachyťte protokolem"
        body="Nájemní dokumentace má kromě smlouvy zahrnovat i stav bytu, klíče, měřidla a datum skutečného předání."
        buttonLabel="Připravit nájemní smlouvu"
        href="/najem"
        variant="subtle"
        articleSlug={SLUG}
      />

      <section id="cizinec" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Cizinec řeší doklad o ubytování podle typu pobytového řízení
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U žádostí cizinců nejde automaticky o stejný institut jako u změny trvalého pobytu občana
          ČR. Informační portál pro cizince uvádí, že doklad o ubytování je až na výjimky povinnou
          náležitostí žádostí o dlouhodobé vízum a o přechodný, dlouhodobý nebo trvalý pobyt.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Ubytování lze podle konkrétního řízení doložit potvrzením o zajištění ubytování, nájemní či
          podnájemní smlouvou nebo vlastnictvím. Platná nájemní smlouva podepsaná oběma stranami
          zpravidla nepotřebuje úředně ověřené podpisy; portál ale doporučuje ověřenou kopii, protože
          dokument zůstává ve správním spise.
        </p>
        <p className="leading-relaxed text-slate-400">
          U podnájmu se dokládá také vazba mezi vlastníkem a osobou, která byt poskytuje — typicky
          hlavní nájemní smlouva nebo jiné oprávnění. Přesná forma, stáří dokumentu a způsob podání
          se mohou lišit podle řízení, státní příslušnosti a procesní situace. Generátor nemůže
          zaručit, že úřad dokument v konkrétní žádosti přijme.
        </p>
      </section>

      <section id="checklist" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Praktický checklist před použitím smlouvy jako podkladu
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Je ve smlouvě přesná a aktuální adresa včetně jednoznačného označení bytu?',
            'Je pronajímatel vlastníkem nebo má doložitelné oprávnění byt přenechat k užívání?',
            'Je smlouva stále platná; u doby určité máte i aktuální dodatek o prodloužení?',
            'U podnájmu máte hlavní nájemní smlouvu nebo jiný doklad o vazbě k vlastníkovi?',
            'Ověřili jste na ipc.gov.cz aktuální požadavky právě pro svůj typ pobytového řízení?',
            'Máte pro skončení nájmu předávací protokol s datem, stavem bytu a předáním klíčů?',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <OfficialSources
        sources={[
          { label: 'gov.cz: Nájem a trvalý pobyt', href: 'https://portal.gov.cz/rozcestniky/najem-a-trvaly-pobyt-RZC-96' },
          { label: 'gov.cz: Ohlášení změny místa trvalého pobytu', href: 'https://portal.gov.cz/sluzby-vs/ohlaseni-zmeny-mista-trvaleho-pobytu-S605' },
          { label: 'MMR: Řešení častých situací v nájemním bydlení', href: 'https://mmr.gov.cz/cs/microsites/bydleni-pro-zivot/vas-pruvodce-najemnimi-vztahy/reseni-castych-situaci-v-najemnim-bydleni' },
          { label: 'Informační portál pro cizince: Doklad o ubytování', href: 'https://ipc.gov.cz/formulare-a-dokumenty/nalezitosti-dokumenty/doklad-o-ubytovani/' },
        ]}
      />
    </ArticlePageLayout>
  );
}
