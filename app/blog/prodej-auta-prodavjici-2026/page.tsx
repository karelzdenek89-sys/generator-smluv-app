import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';

export const metadata = blogArticlePageMetadata('prodej-auta-prodavjici-2026');

export default function ProdejAutaProdavajici2026Page() {
  return (
    <ArticlePageLayout
      category="Vozidla"
      readTime="8 min"
      dateTime="2026-07-09"
      dateLabel="9. července 2026"
      breadcrumbLabel="Prodej auta pro prodávajícího"
      slug="prodej-auta-prodavjici-2026"
      title="Prodej auta 2026: checklist pro prodávajícího před podpisem a přepisem"
      intro="Dobře připravený prodej auta není jen o podpisu kupní smlouvy. Prodávající potřebuje předem sladit údaje o vozidle, platební podmínky, předání klíčů a dokladů i následný zápis změny vlastníka. Písemný záznam chrání obě strany před nedorozuměním."
      toc={[
        { href: '#pred-podpisem', label: 'Co připravit před podpisem' },
        { href: '#smlouva', label: 'Co zachytit v kupní smlouvě' },
        { href: '#predani', label: 'Předávací protokol' },
        { href: '#prepis', label: 'Přepis vozidla' },
        { href: '#checklist', label: 'Rychlý checklist' },
      ]}
      primaryAction={{
        title: 'Prodáváte auto mezi soukromými osobami?',
        body: 'Formulář kupní smlouvy zachytí VIN, cenu, stav tachometru, známé vady i podmínky předání.',
        buttonLabel: 'Vytvořit kupní smlouvu na auto',
        href: '/auto',
      }}
      trustBox={{
        generatorSuitable:
          'Běžný prodej vozidla mezi stranami, které se shodly na ceně a chtějí písemně zachytit stav vozu a předání.',
        lawyerSuitable:
          'Spor o technický stav, zástavu, leasing, dědictví, dovoz vozidla nebo situace, kdy druhá strana odmítá součinnost při přepisu.',
      }}
      finalAction={{
        title: 'Připravte si smlouvu i podklady k předání',
        body: 'Doplňte údaje o stranách a vozidle, cenu, známé vady a předávací podmínky do jednoho přehledného dokumentu.',
        buttonLabel: 'Otevřít formulář prodeje vozidla',
        href: '/auto',
      }}
      relatedLinks={[
        { href: '/auto', label: 'Kupní smlouva na auto - formulář' },
        { href: '/prodej-vozidla', label: 'Podklady pro prodej vozidla' },
        { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Předání vozidla kupujícímu' },
        { href: '/blog/prepis-auta-online-portal-dopravy-2026', label: 'Přepis auta přes Portál dopravy' },
      ]}
    >
      <section id="pred-podpisem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co připravit před podpisem</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zkontrolujte, že údaje ve smlouvě odpovídají dokladům a skutečnému vozidlu. Základem je identifikace stran,
          značka a model, VIN, registrační značka, stav tachometru, kupní cena a domluvený okamžik předání.
        </p>
        <p className="leading-relaxed text-slate-400">
          Před podpisem má smysl sepsat známé vady a nedostatky konkrétně. Obecná věta o tom, že kupující vozidlo
          „viděl“, nenahradí popis toho, co strany skutečně zaznamenaly. U platby si předem ujasněte způsob, datum a
          potvrzení o převzetí peněz.
        </p>
      </section>

      <section id="smlouva" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co zachytit v kupní smlouvě</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'přesnou identifikaci prodávajícího a kupujícího,',
            'jednoznačnou identifikaci vozidla včetně VIN,',
            'kupní cenu, způsob úhrady a potvrzení o jejím převzetí,',
            'známé vady, stav tachometru a případné příslušenství,',
            'okamžik předání vozidla, klíčů a dokladů.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
      </section>

      <ArticleInlineCta
        title="Sestavte kupní smlouvu na vozidlo online"
        body="Formulář vede přes VIN, kupní cenu, stav vozidla, známé vady a podmínky předání."
        buttonLabel="Pokračovat ke kupní smlouvě"
        href="/auto"
        variant="subtle"
        articleSlug="prodej-auta-prodavjici-2026"
      />

      <section id="predani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Předávací protokol oddělí podpis od skutečného předání</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Do protokolu zapište datum a čas předání, stav tachometru, počet klíčů, předané doklady a výbavu. Doplňte i
          stav paliva a viditelné poškození, ideálně s fotodokumentací. Jde o praktický důkaz, jaký byl stav vozu v
          okamžiku, kdy jej kupující převzal.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pokud se kupní cena platí při předání, nechte si příjem peněz potvrdit přímo ve smlouvě nebo v samostatném
          potvrzení. Záznam by měl uvádět částku, způsob platby a datum.
        </p>
      </section>

      <section id="prepis" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Po podpisu následuje přepis</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Ministerstvo dopravy uvádí, že žádost o zápis změny vlastníka se podává do 10 pracovních dnů od převodu
          vlastnického práva. Standardně jde o společnou žádost dosavadního a nového vlastníka; jednat lze i přes
          zmocněnce. Úkon lze řešit na kterémkoli obecním úřadě obce s rozšířenou působností.
        </p>
        <p className="leading-relaxed text-slate-400">
          Nespoléhejte pouze na ústní domluvu, že přepis vyřídí druhá strana. Do smlouvy nebo protokolu je praktické
          napsat, kdo, kdy a s jakými podklady bude součinnost zajišťovat.
        </p>
      </section>

      <section id="checklist" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Rychlý checklist prodávajícího</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Porovnat VIN a registrační údaje s doklady.',
            'Popsat známé vady a stav tachometru konkrétně.',
            'Dohodnout cenu a doložit převzetí platby.',
            'Sepsat předávací protokol, klíče, doklady a výbavu.',
            'Navázat podpis na včasnou součinnost při přepisu.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          Zdroj: <a className="text-amber-400 hover:text-amber-300" href="https://md.gov.cz/Zivotni-situace/Registr-vozidel/zmena-vlastnika" target="_blank" rel="noreferrer">Ministerstvo dopravy - změna vlastníka vozidla</a>.
        </p>
      </section>
    </ArticlePageLayout>
  );
}
