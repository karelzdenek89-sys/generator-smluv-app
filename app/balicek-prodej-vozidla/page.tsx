import type { Metadata } from 'next';
import TrackView from '@/app/components/analytics/TrackView';
import GuideLandingPage from '@/app/components/GuideLandingPage';

export const metadata: Metadata = {
  title: 'Balíček pro prodej vozidla | SmlouvaHned',
  description:
    'Praktické řešení pro standardní převod vozidla. Kupní smlouva na vozidlo v komplexní variantě, předávací protokol, potvrzení o převzetí vozidla, klíčů a dokladů a související podklady k převodu.',
  alternates: { canonical: 'https://smlouvahned.cz/balicek-prodej-vozidla' },
  openGraph: {
    title: 'Balíček pro prodej vozidla | SmlouvaHned',
    description:
      'Tematický balíček pro standardní převod vozidla včetně souvisejících podkladů k předání.',
    url: 'https://smlouvahned.cz/balicek-prodej-vozidla',
    type: 'website',
  },
};

const faq = [
  {
    q: 'Čím se balíček liší od samostatné kupní smlouvy na vozidlo?',
    a: 'Balíček nevychází jen ze samotné smlouvy. Vedle kupní smlouvy na vozidlo v komplexní variantě obsahuje také předávací protokol, potvrzení o převzetí vozidla, klíčů a dokladů a navazující podklady k převodu.',
  },
  {
    q: 'Kdy obvykle stačí samostatná kupní smlouva na vozidlo?',
    a: 'Pokud potřebujete pouze zachytit samotný převod vozidla a neřešíte zvlášť podklady k fyzickému předání, klíčům nebo dokladům.',
  },
  {
    q: 'Co po dokončení objednávky získám?',
    a: 'Získáte standardizovaný výstup odpovídající balíčku pro prodej vozidla: kupní smlouvu na vozidlo v komplexní variantě a navazující podklady určené ke kontrole, podpisu a předání.',
  },
  {
    q: 'Obsahuje balíček individuální právní službu?',
    a: 'Ne. Jde o standardizovaný online produkt pro běžné a typizované situace. U sporných nebo nestandardních případů doporučujeme konzultaci s advokátem.',
  },
];

export default function BalicekProdejVozidlaPage() {
  return (
    <>
      <TrackView
        eventName="package_page_view"
        eventParams={{
          source: 'package_page',
          surface: 'package_page',
          package_key: 'vehicle_sale',
          price_band: '299',
        }}
      />
      <GuideLandingPage
        breadcrumbLabel="Balíček pro prodej vozidla"
        kicker="Tematický balíček"
        title="Balíček pro prodej vozidla"
        accent="pro standardní převod a předání vozidla"
        description="Praktické řešení pro situaci, kdy vedle samotné kupní smlouvy potřebujete i podklady k předání vozidla, klíčů, dokladů a navazujícímu převodu."
        primaryCta={{
          href: '/auto?package=vehicle_sale',
          label: 'Pokračovat k balíčku pro prodej vozidla',
        }}
        secondaryCta={{
          href: '/prodej-vozidla',
          label: 'Zobrazit podklady pro prodej vozidla',
        }}
        summary={[
          'Kupní smlouva na vozidlo v komplexní variantě podle zadaných údajů.',
          'Předávací protokol pro zachycení stavu vozidla, klíčů a příslušenství.',
          'Potvrzení o převzetí vozidla, klíčů a dokladů jako navazující podklad.',
          'Praktické podklady k podpisu, předání a dalším krokům po převodu.',
        ]}
        decisionGuide={{
          label: 'Kdy zvolit co',
          title: 'Jeden dokument, širší varianta nebo celé řešení převodu vozidla',
          intro:
            'Pokud řešíte jen samotnou kupní smlouvu, stačí samostatný dokument. Pokud vedle smlouvy potřebujete i podklady k předání vozidla, klíčů a dokladů, dává smysl tematický balíček.',
          items: [
            {
              key: 'vehicle-basic',
              title: 'Základní dokument',
              priceLabel: '99 Kč',
              description:
                'Pro běžný převod vozidla, kdy potřebujete samotnou kupní smlouvu se standardním rozsahem.',
              href: '/auto',
              cta: 'Pokračovat ke kupní smlouvě →',
            },
            {
              key: 'vehicle-complete',
              title: 'Rozšířený dokument',
              priceLabel: '199 Kč',
              description:
                'Pro širší rozsah samostatné kupní smlouvy a detailnější zachycení stavu vozidla.',
              href: '/auto',
              cta: 'Vybrat rozšířenou variantu →',
              badge: 'Širší rozsah',
            },
            {
              key: 'vehicle-package',
              title: 'Tematický balíček',
              priceLabel: '299 Kč',
              description:
                'Pro řešení celé situace kolem převodu vozidla, předání klíčů, dokladů a souvisejících podkladů.',
              href: '/auto?package=vehicle_sale',
              cta: 'Otevřít balíček →',
              badge: 'Celá situace',
              highlight: true,
            },
          ],
        }}
        suitableSectionLabel="Pro jaké situace"
        suitableSectionTitle="Kdy se balíček obvykle hodí"
        suitableFor={[
          {
            title: 'Prodáváte nebo kupujete vozidlo a řešíte celé předání',
            text: 'Balíček dává smysl, pokud vedle smlouvy potřebujete zachytit i fyzické předání vozidla, klíčů, dokladů a základního stavu.',
          },
          {
            title: 'Chcete mít předání doložené přehledně',
            text: 'Vedle hlavního dokumentu dostanete i samostatné podklady k tomu, co bylo při převodu skutečně předáno.',
          },
          {
            title: 'Nechcete skládat více podkladů zvlášť',
            text: 'Balíček je vhodný tam, kde je praktičtější připravit smlouvu i navazující dokumenty v jednom toku.',
          },
        ]}
        contentsSectionLabel="Co balíček obsahuje"
        contentsSectionTitle="Výstup pro standardní převod vozidla v jednom kroku"
        contents={[
          {
            title: 'Kupní smlouva na vozidlo v komplexní variantě',
            text: 'Rozšířená samostatná smlouva s detailnějším zachycením stavu vozidla a podmínek převodu.',
          },
          {
            title: 'Předávací protokol k vozidlu',
            text: 'Podklad pro fyzické předání vozidla, stavu tachometru, příslušenství a klíčů.',
          },
          {
            title: 'Potvrzení o převzetí vozidla, klíčů a dokladů',
            text: 'Samostatný dokument navázaný na skutečné převzetí a předání mezi stranami.',
          },
          {
            title: 'Praktické podklady k převodu',
            text: 'Stručné podklady, které pomohou s podpisem, předáním a navazujícími kroky po převodu.',
          },
        ]}
        trackingContext={{ pageType: 'package', pageKey: 'vehicle_sale' }}
        mistakesTitle="Kdy obvykle stačí samostatný dokument"
        mistakes={[
          'Pokud potřebujete pouze samotnou kupní smlouvu bez navazujících podkladů k předání.',
          'Pokud neřešíte motorové vozidlo, ale jinou movitou věc.',
          'Pokud je situace nestandardní nebo právně složitější.',
        ]}
        faq={faq}
        finalCtaTitle="Pokračujte do balíčku podle údajů o převodu vozidla"
        finalCtaBody="Formulář vás provede hlavními údaji k převodu. Po dokončení objednávky získáte balíček připravený k závěrečné kontrole, podpisu a standardnímu předání vozidla."
        bottomLinks={[
          { href: '/auto?package=vehicle_sale', label: 'Otevřít formulář balíčku' },
          { href: '/prodej-vozidla', label: 'Podklady pro prodej vozidla' },
          { href: '/auto', label: 'Samostatná kupní smlouva na vozidlo' },
        ]}
        relatedCluster="auto"
        currentHref="/balicek-prodej-vozidla"
      />
    </>
  );
}
