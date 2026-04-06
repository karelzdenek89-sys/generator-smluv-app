import { THEMATIC_PACKAGE_CONFIG } from './packages';

type SituationCard = {
  title: string;
  text: string;
};

type SituationDecisionItem = {
  key: string;
  title: string;
  priceLabel: string;
  description: string;
  href: string;
  cta: string;
  badge?: string;
  highlight?: boolean;
};

type SituationFaq = {
  q: string;
  a: string;
};

export type SituationLandingConfig = {
  key: 'landlord' | 'vehicle_sale';
  slug: 'pro-pronajimatele' | 'prodej-vozidla';
  href: string;
  title: string;
  breadcrumbLabel: string;
  kicker: string;
  accent: string;
  description: string;
  metadataTitle: string;
  metadataDescription: string;
  openGraphTitle: string;
  openGraphDescription: string;
  summary: readonly string[];
  suitableSectionLabel: string;
  suitableSectionTitle: string;
  contentsSectionLabel: string;
  contentsSectionTitle: string;
  suitableFor: readonly SituationCard[];
  contents: readonly SituationCard[];
  decisionGuide: {
    label: string;
    title: string;
    intro: string;
    note?: string;
    items: readonly SituationDecisionItem[];
  };
  trustBlock: {
    label: string;
    title: string;
    intro: string;
    items: readonly string[];
    note?: string;
  };
  faq: readonly SituationFaq[];
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  bottomLinks: readonly { href: string; label: string }[];
  homepageTitle: string;
  homepageText: string;
  homepageCta: string;
};

const landlordPackage = THEMATIC_PACKAGE_CONFIG.landlord;
const vehiclePackage = THEMATIC_PACKAGE_CONFIG.vehicle_sale;

export const SITUATION_LANDING_CONFIG: Record<
  SituationLandingConfig['key'],
  SituationLandingConfig
> = {
  landlord: {
    key: 'landlord',
    slug: 'pro-pronajimatele',
    href: '/pro-pronajimatele',
    title: 'Dokumenty pro pronajímatele',
    breadcrumbLabel: 'Pro pronajímatele',
    kicker: 'Řešení podle situace',
    accent: 'pro standardní pronájem bytu nebo domu',
    description:
      'Situační stránka pro pronajímatele, kteří řeší nejen samotnou nájemní smlouvu, ale i předání bytu, převzetí kauce a navazující podklady. Pomůže vám vybrat správnou cestu podle rozsahu situace.',
    metadataTitle: 'Dokumenty pro pronajímatele | SmlouvaHned',
    metadataDescription:
      'Přehled řešení pro standardní pronájem bytu nebo domu. Kdy stačí nájemní smlouva, kdy dává smysl širší varianta a kdy je vhodný balíček pro pronajímatele.',
    openGraphTitle: 'Dokumenty pro pronajímatele | SmlouvaHned',
    openGraphDescription:
      'Přehledný rozcestník pro pronajímatele: nájemní smlouva, širší varianta i tematický balíček s podklady k předání bytu.',
    summary: [
      'Určeno pro běžný a typizovaný pronájem bytu nebo domu, kdy potřebujete hlavní dokument i přehled navazujících kroků.',
      'Pomůže vám rozhodnout, zda stačí samostatná nájemní smlouva, širší varianta nebo celé řešení s podklady k předání bytu a převzetí kauce.',
      'Výstupy jsou určeny ke kontrole a podpisu. Nejde o individuální právní poradenství ani o poskytování advokátních služeb.',
    ],
    suitableSectionLabel: 'Pro koho je určena',
    suitableSectionTitle: 'Kdy tato stránka dává smysl',
    contentsSectionLabel: 'Dostupná řešení',
    contentsSectionTitle: 'Jaké cesty máte v rámci SmlouvaHned',
    suitableFor: [
      {
        title: 'Pronajímatel řeší celý proces',
        text: 'Když vedle nájemní smlouvy potřebujete promyslet i předání bytu, vybavení, měřidla a převzetí kauce.',
      },
      {
        title: 'Chcete zvolit přiměřenou variantu',
        text: 'Když si nejste jistí, zda stačí samotný dokument, nebo je praktičtější širší varianta či celý balíček.',
      },
      {
        title: 'Hledáte přehledné řešení bez chaosu',
        text: 'Když nechcete lovit více samostatných vzorů, ale mít jasno, které podklady dávají pro vaši situaci smysl.',
      },
    ],
    contents: [
      {
        title: 'Základní dokument — 99 Kč',
        text: 'Samostatná nájemní smlouva pro běžný pronájem se standardním rozsahem.',
      },
      {
        title: 'Rozšířený dokument — 199 Kč',
        text: 'Rozšířená samostatná nájemní smlouva s širším rozsahem ustanovení a praktičtějšími podklady.',
      },
      {
        title: 'Balíček pro pronajímatele — 299 Kč',
        text: 'Nájemní smlouva v komplexní variantě plus předávací protokol, potvrzení o převzetí kauce a navazující podklady.',
      },
      {
        title: 'Doplňující průvodce',
        text: 'Můžete se opřít i o orientační průvodce k nájemní smlouvě, kauci, předání bytu a dalším souvisejícím tématům.',
      },
    ],
    decisionGuide: {
      label: 'Kdy zvolit co',
      title: 'Samotný dokument, širší varianta nebo celé řešení pronájmu',
      intro:
        'Pokud řešíte jen samotnou nájemní smlouvu, stačí samostatný dokument. Pokud vedle smlouvy řešíte i předání bytu a kauci, bývá praktičtější tematický balíček.',
      note:
        'Balíček pro pronajímatele navazuje na nájemní smlouvu v komplexní variantě a rozšiřuje ji o podklady pro standardní předání bytu.',
      items: [
        {
          key: 'landlord-basic',
          title: 'Základní dokument',
          priceLabel: '99 Kč',
          description: 'Pro běžnou situaci, kdy potřebujete samotnou nájemní smlouvu se standardním rozsahem.',
          href: '/najem',
          cta: 'Pokračovat k nájemní smlouvě →',
        },
        {
          key: 'landlord-complete',
          title: 'Rozšířený dokument',
          priceLabel: '199 Kč',
          description: 'Pro širší rozsah nájemní smlouvy, podrobnější ustanovení a praktičtější podklady k použití.',
          href: '/najem',
          cta: 'Vybrat rozšířenou variantu →',
          badge: 'Širší rozsah',
        },
        {
          key: 'landlord-package',
          title: 'Tematický balíček',
          priceLabel: '299 Kč',
          description: 'Pro řešení celé situace kolem pronájmu, předání bytu a potvrzení o převzetí kauce.',
          href: '/balicek-pronajimatel',
          cta: 'Zobrazit balíček pro pronajímatele →',
          badge: 'Celá situace',
          highlight: true,
        },
      ],
    },
    trustBlock: {
      label: 'Co získáte po dokončení objednávky',
      title: 'Výstup podle zvolené cesty',
      intro:
        'Po dokončení objednávky získáte standardizovaný digitální výstup podle údajů zadaných ve formuláři. Rozsah závisí na tom, zda zvolíte samostatný dokument, širší variantu nebo tematický balíček.',
      items: [
        'Samostatnou nájemní smlouvu nebo širší variantu připravenou podle zadaných údajů.',
        'U tematického balíčku také navazující podklady k předání bytu a převzetí kauce.',
        'Výstup určený k závěrečné kontrole a podpisu.',
        'U vyšších variant i praktičtější podklady k práci s dokumenty.',
      ],
      note:
        'Stránka slouží jako orientační rozcestník pro běžné a typizované situace. U složitých nebo sporných případů doporučujeme konzultaci s advokátem.',
    },
    faq: [
      {
        q: 'Kdy stačí samotná nájemní smlouva?',
        a: 'Pokud řešíte běžný pronájem a potřebujete hlavně písemně zachytit nájemné, kauci, zálohy a základní pravidla užívání.',
      },
      {
        q: 'Kdy dává smysl širší varianta za 199 Kč?',
        a: 'Když chcete podrobnější úpravu samostatné nájemní smlouvy a praktičtější podklady k jejímu použití.',
      },
      {
        q: 'Kdy dává smysl balíček pro pronajímatele za 299 Kč?',
        a: 'Pokud vedle samotné smlouvy potřebujete i podklady k předání bytu a potvrzení o převzetí kauce.',
      },
      {
        q: 'Je tato stránka vhodná i pro podnájem?',
        a: 'Primárně ne. Pokud řešíte podnájem, použijte podnájemní smlouvu, protože právní vztah je jiný než u nájmu s vlastníkem.',
      },
      {
        q: 'Jde o individuální právní službu?',
        a: 'Ne. Jde o standardizovaný online produkt pro běžné a typizované situace. U nestandardních případů doporučujeme konzultaci s advokátem.',
      },
    ],
    primaryCta: { href: landlordPackage.href, label: 'Zobrazit balíček pro pronajímatele' },
    secondaryCta: { href: '/najem', label: 'Pokračovat k nájemní smlouvě' },
    bottomLinks: [
      { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele' },
      { href: '/najem', label: 'Nájemní smlouva' },
      { href: '/najemni-smlouva', label: 'Průvodce nájemní smlouvou' },
      { href: '/blog/predani-bytu-najemci-2026', label: 'Jak správně předat byt nájemci' },
      { href: '/podnajem', label: 'Podnájemní smlouva' },
    ],
    homepageTitle: 'Dokumenty pro pronajímatele',
    homepageText:
      'Orientační stránka pro běžný pronájem bytu nebo domu. Pomůže vybrat mezi samotnou nájemní smlouvou, širší variantou a balíčkem s podklady k předání bytu.',
    homepageCta: 'Otevřít situaci →',
  },
  vehicle_sale: {
    key: 'vehicle_sale',
    slug: 'prodej-vozidla',
    href: '/prodej-vozidla',
    title: 'Podklady pro prodej vozidla',
    breadcrumbLabel: 'Prodej vozidla',
    kicker: 'Řešení podle situace',
    accent: 'pro standardní převod a předání vozidla',
    description:
      'Situační stránka pro prodávající i kupující, kteří řeší nejen samotnou kupní smlouvu na vozidlo, ale i předání klíčů, dokladů a navazujících podkladů k převodu.',
    metadataTitle: 'Podklady pro prodej vozidla | SmlouvaHned',
    metadataDescription:
      'Přehled řešení pro standardní převod vozidla. Kdy stačí kupní smlouva na vozidlo, kdy dává smysl širší varianta a kdy je vhodný balíček pro prodej vozidla.',
    openGraphTitle: 'Podklady pro prodej vozidla | SmlouvaHned',
    openGraphDescription:
      'Přehledný rozcestník pro převod vozidla: kupní smlouva, širší varianta i tematický balíček s podklady k předání.',
    summary: [
      'Určeno pro běžný a typizovaný převod vozidla mezi stranami, které se shodly na ceně a základních podmínkách převodu.',
      'Pomůže vám rozhodnout, zda stačí samostatná kupní smlouva na vozidlo, širší varianta nebo celé řešení s podklady k předání vozidla.',
      'Výstupy jsou určeny ke kontrole a podpisu. Nejde o individuální právní poradenství ani o poskytování advokátních služeb.',
    ],
    suitableSectionLabel: 'Pro koho je určena',
    suitableSectionTitle: 'Kdy tato stránka dává smysl',
    contentsSectionLabel: 'Dostupná řešení',
    contentsSectionTitle: 'Jaké cesty máte v rámci SmlouvaHned',
    suitableFor: [
      {
        title: 'Prodávající řeší převod jako celek',
        text: 'Když vedle smlouvy potřebujete zachytit i předání vozidla, klíčů, dokladů a základního stavu vozidla.',
      },
      {
        title: 'Kupující chce mít předání pod kontrolou',
        text: 'Když chcete vedle kupní smlouvy i přehledný podklad o tom, co bylo při převodu skutečně předáno.',
      },
      {
        title: 'Hledáte přirozenou cestu podle rozsahu situace',
        text: 'Když si nejste jistí, zda vám stačí samotný dokument, nebo je vhodnější širší varianta či balíček s navazujícími podklady.',
      },
    ],
    contents: [
      {
        title: 'Základní dokument — 99 Kč',
        text: 'Samostatná kupní smlouva na vozidlo pro běžný převod se standardním rozsahem.',
      },
      {
        title: 'Rozšířený dokument — 199 Kč',
        text: 'Rozšířená samostatná kupní smlouva na vozidlo s detailnějším zachycením stavu a praktičtějšími podklady.',
      },
      {
        title: 'Balíček pro prodej vozidla — 299 Kč',
        text: 'Kupní smlouva v komplexní variantě plus předávací protokol, potvrzení o převzetí a podklady k převodu.',
      },
      {
        title: 'Doplňující průvodce',
        text: 'Můžete se opřít i o orientační průvodce ke kupní smlouvě, dokladům, předání vozidla a přepisu.',
      },
    ],
    decisionGuide: {
      label: 'Kdy zvolit co',
      title: 'Samotný dokument, širší varianta nebo celé řešení převodu vozidla',
      intro:
        'Pokud řešíte pouze samotnou kupní smlouvu, stačí samostatný dokument. Balíček pro prodej vozidla je určen pro situace, kdy chcete vedle smlouvy i podklady k předání vozidla, klíčů a dokladů.',
      note:
        'Balíček pro prodej vozidla navazuje na kupní smlouvu v komplexní variantě a rozšiřuje ji o podklady pro standardní předání a převod.',
      items: [
        {
          key: 'vehicle-basic',
          title: 'Základní dokument',
          priceLabel: '99 Kč',
          description: 'Pro běžný převod vozidla, kdy potřebujete samotnou kupní smlouvu se standardním rozsahem.',
          href: '/auto',
          cta: 'Pokračovat ke kupní smlouvě →',
        },
        {
          key: 'vehicle-complete',
          title: 'Rozšířený dokument',
          priceLabel: '199 Kč',
          description: 'Pro širší rozsah kupní smlouvy, detailnější zachycení stavu vozidla a praktičtější podklady.',
          href: '/auto',
          cta: 'Vybrat rozšířenou variantu →',
          badge: 'Širší rozsah',
        },
        {
          key: 'vehicle-package',
          title: 'Tematický balíček',
          priceLabel: '299 Kč',
          description: 'Pro řešení celé situace kolem převodu vozidla, předání klíčů, dokladů a navazujících podkladů.',
          href: '/balicek-prodej-vozidla',
          cta: 'Zobrazit balíček pro prodej vozidla →',
          badge: 'Celá situace',
          highlight: true,
        },
      ],
    },
    trustBlock: {
      label: 'Co získáte po dokončení objednávky',
      title: 'Podklady podle zvolené cesty',
      intro:
        'Po dokončení objednávky získáte standardizovaný digitální výstup podle údajů zadaných ve formuláři. Rozsah závisí na tom, zda zvolíte samostatnou kupní smlouvu, širší variantu nebo tematický balíček.',
      items: [
        'Kupní smlouvu na vozidlo nebo širší variantu připravenou podle zadaných údajů.',
        'U tematického balíčku také navazující podklady k předání vozidla, klíčů a dokladů.',
        'Výstup určený k závěrečné kontrole a podpisu.',
        'U vyšších variant i praktičtější podklady k práci s dokumenty.',
      ],
      note:
        'Stránka slouží jako orientační rozcestník pro běžné a typizované situace. U složitých nebo sporných případů doporučujeme konzultaci s advokátem.',
    },
    faq: [
      {
        q: 'Kdy stačí samotná kupní smlouva na vozidlo?',
        a: 'Pokud řešíte běžný převod vozidla a potřebujete hlavně písemně zachytit cenu, identifikaci vozidla, stav tachometru a základní podmínky převodu.',
      },
      {
        q: 'Kdy dává smysl širší varianta za 199 Kč?',
        a: 'Když chcete detailnější zachycení stavu vozidla, širší ustanovení a praktičtější podklady k použití samostatné kupní smlouvy.',
      },
      {
        q: 'Kdy dává smysl balíček pro prodej vozidla za 299 Kč?',
        a: 'Pokud vedle samotné smlouvy potřebujete i podklady k fyzickému předání vozidla, klíčů, dokladů a navazujícím krokům po podpisu.',
      },
      {
        q: 'Je tato stránka vhodná i pro jinou movitou věc než auto?',
        a: 'Primárně ne. Pokud řešíte jinou movitou věc, bývá vhodnější obecná kupní smlouva, protože převod vozidla má vlastní praktická specifika.',
      },
      {
        q: 'Jde o individuální právní službu?',
        a: 'Ne. Jde o standardizovaný online produkt pro běžné a typizované situace. U nestandardních případů doporučujeme konzultaci s advokátem.',
      },
    ],
    primaryCta: { href: vehiclePackage.href, label: 'Zobrazit balíček pro prodej vozidla' },
    secondaryCta: { href: '/auto', label: 'Pokračovat ke kupní smlouvě na vozidlo' },
    bottomLinks: [
      { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
      { href: '/auto', label: 'Kupní smlouva na vozidlo' },
      { href: '/blog/kupni-smlouva-na-auto-2026', label: 'Průvodce kupní smlouvou na vozidlo' },
      { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Jak správně předat vozidlo kupujícímu' },
      { href: '/kupni', label: 'Obecná kupní smlouva' },
    ],
    homepageTitle: 'Podklady pro prodej vozidla',
    homepageText:
      'Orientační stránka pro běžný převod vozidla. Pomůže vybrat mezi samotnou kupní smlouvou, širší variantou a balíčkem s podklady k předání auta.',
    homepageCta: 'Otevřít situaci →',
  },
};

export const SITUATION_LANDINGS = Object.values(
  SITUATION_LANDING_CONFIG,
) as readonly SituationLandingConfig[];

export function getSituationLandingConfig(
  key: SituationLandingConfig['key'],
): SituationLandingConfig {
  return SITUATION_LANDING_CONFIG[key];
}
