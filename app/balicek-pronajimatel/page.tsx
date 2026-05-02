import type { Metadata } from 'next';
import TrackView from '@/app/components/analytics/TrackView';
import GuideLandingPage from '@/app/components/GuideLandingPage';

export const metadata: Metadata = {
  title: 'Balíček pro pronajímatele | SmlouvaHned',
  description:
    'Praktické řešení pro standardní pronájem bytu nebo domu. Nájemní smlouva v komplexní variantě, předávací protokol, potvrzení o převzetí kauce a související podklady k podpisu a předání.',
  alternates: { canonical: 'https://smlouvahned.cz/balicek-pronajimatel' },
  openGraph: {
    title: 'Balíček pro pronajímatele | SmlouvaHned',
    description:
      'Tematický balíček pro pronajímatele, kteří chtějí mít hlavní dokument i podklady k předání bytu pohromadě.',
    url: 'https://smlouvahned.cz/balicek-pronajimatel',
    type: 'website',
  },
};

const faq = [
  {
    q: 'Čím se balíček liší od samostatné nájemní smlouvy?',
    a: 'Balíček nevychází jen ze samotné smlouvy. Vedle nájemní smlouvy v komplexní variantě obsahuje také předávací protokol, potvrzení o převzetí kauce a související podklady k předání bytu.',
  },
  {
    q: 'Kdy obvykle stačí samostatná nájemní smlouva?',
    a: 'Pokud potřebujete pouze zachytit samotný nájemní vztah a neřešíte navazující podklady k předání bytu nebo k převzetí jistoty.',
  },
  {
    q: 'Co po dokončení objednávky získám?',
    a: 'Získáte standardizovaný výstup odpovídající balíčku pro pronajímatele: nájemní smlouvu v komplexní variantě a navazující podklady určené ke kontrole, podpisu a běžnému předání bytu.',
  },
  {
    q: 'Obsahuje balíček individuální právní službu?',
    a: 'Ne. Jde o standardizovaný online produkt pro běžné a typizované situace. U sporných nebo nestandardních případů doporučujeme konzultaci s advokátem.',
  },
];

export default function BalicekPronajimatelPage() {
  return (
    <>
      <TrackView
        eventName="package_page_view"
        eventParams={{
          source: 'package_page',
          surface: 'package_page',
          package_key: 'landlord',
          price_band: '299',
        }}
      />
      <GuideLandingPage
        breadcrumbLabel="Balíček pro pronajímatele"
        kicker="Tematický balíček"
        title="Balíček pro pronajímatele"
        accent="pro standardní pronájem bytu nebo domu"
        description="Praktické řešení pro situaci, kdy vedle samotné nájemní smlouvy potřebujete i navazující podklady k předání bytu a k převzetí kauce."
        primaryCta={{ href: '/najem?package=landlord', label: 'Pokračovat k balíčku pro pronajímatele' }}
        secondaryCta={{
          href: '/pro-pronajimatele',
          label: 'Zobrazit dokumenty pro pronajímatele',
        }}
        summary={[
          'Nájemní smlouva v komplexní variantě podle zadaných údajů.',
          'Předávací protokol pro standardní předání bytu nebo domu.',
          'Potvrzení o převzetí kauce jako samostatný navazující podklad.',
          'Praktické podklady k podpisu, předání a archivaci dokumentů.',
        ]}
        decisionGuide={{
          label: 'Kdy zvolit co',
          title: 'Jeden dokument, širší varianta nebo celé řešení pronájmu',
          intro:
            'Pokud řešíte jen samotnou nájemní smlouvu, stačí samostatný dokument. Pokud vedle smlouvy potřebujete i podklady k předání bytu a ke kauci, dává smysl tematický balíček.',
          items: [
            {
              key: 'landlord-basic',
              title: 'Základní dokument',
              priceLabel: '99 Kč',
              description:
                'Pro běžnou situaci, kdy potřebujete samotnou nájemní smlouvu se standardním rozsahem.',
              href: '/najem',
              cta: 'Pokračovat k nájemní smlouvě →',
            },
            {
              key: 'landlord-complete',
              title: 'Rozšířený dokument',
              priceLabel: '199 Kč',
              description:
                'Pro širší rozsah samostatné nájemní smlouvy a praktičtější podklady k jejímu použití.',
              href: '/najem',
              cta: 'Vybrat rozšířenou variantu →',
              badge: 'Širší rozsah',
            },
            {
              key: 'landlord-package',
              title: 'Tematický balíček',
              priceLabel: '299 Kč',
              description:
                'Pro řešení celé situace kolem pronájmu, předání bytu a potvrzení o převzetí kauce.',
              href: '/najem?package=landlord',
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
            title: 'Pronajímáte byt nebo dům a řešíte celé předání',
            text: 'Balíček dává smysl, pokud vedle smlouvy potřebujete zachytit i stav bytu, vybavení, klíče a předání mezi stranami.',
          },
          {
            title: 'Chcete mít kauci a předání podchycené zvlášť',
            text: 'Vedle hlavního dokumentu dostanete i samostatné podklady pro potvrzení převzetí jistoty a pro běžné předání nemovitosti.',
          },
          {
            title: 'Nechcete skládat více podkladů zvlášť',
            text: 'Balíček je vhodný tam, kde je praktičtější připravit smlouvu i navazující dokumenty v jednom toku.',
          },
        ]}
        contentsSectionLabel="Co balíček obsahuje"
        contentsSectionTitle="Výstup pro standardní pronájem v jednom kroku"
        contents={[
          {
            title: 'Nájemní smlouva v komplexní variantě',
            text: 'Rozšířená samostatná nájemní smlouva pro standardní pronájem bytu nebo domu.',
          },
          {
            title: 'Předávací protokol',
            text: 'Podklad pro zachycení stavu bytu, měřidel, vybavení a předaných klíčů.',
          },
          {
            title: 'Potvrzení o převzetí kauce',
            text: 'Samostatný dokument navázaný na jistotu v rámci nájemního vztahu.',
          },
          {
            title: 'Praktické podklady k použití',
            text: 'Stručné podklady, které pomohou s podpisem, předáním a běžnou archivací dokumentů.',
          },
        ]}
        trackingContext={{ pageType: 'package', pageKey: 'landlord' }}
        mistakesTitle="Kdy obvykle stačí samostatný dokument"
        mistakes={[
          'Pokud potřebujete pouze samotnou nájemní smlouvu bez podkladů k předání bytu.',
          'Pokud neřešíte potvrzení o převzetí kauce jako samostatný dokument.',
          'Pokud jde o jiný typ vztahu, například podnájem.',
        ]}
        faq={faq}
        finalCtaTitle="Pokračujte do balíčku podle údajů z vaší situace"
        finalCtaBody="Formulář vás provede hlavními údaji k pronájmu. Po dokončení objednávky získáte balíček připravený k závěrečné kontrole, podpisu a standardnímu předání bytu."
        bottomLinks={[
          { href: '/najem?package=landlord', label: 'Otevřít formulář balíčku' },
          { href: '/pro-pronajimatele', label: 'Dokumenty pro pronajímatele' },
          { href: '/najem', label: 'Samostatná nájemní smlouva' },
        ]}
        relatedCluster="bydleni"
        currentHref="/balicek-pronajimatel"
      />
    </>
  );
}
