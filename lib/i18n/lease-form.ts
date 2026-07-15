import type { AppLocale } from '@/lib/locale';
import { LEGAL_NOTICE } from '@/lib/locale';
import { LEASE_USE_NOTICE_CS, LEASE_USE_NOTICE_EN, LEASE_USE_NOTICE_UK } from '@/lib/i18n/safety-copy';
import { UK_LEASE_FORM_CONTENT } from '@/lib/i18n/lease-form-uk-content';
import { LEASE_CS_LANDING_FAQ } from '@/lib/seo/lease-builder-seo';

export type LeaseFormUi = {
  isEnglish: boolean;
  header: {
    docType: string;
    close: string;
  };
  notices: {
    legal: string;
    leaseUse: string;
    pdf: string;
  };
  landing: {
    badge: string;
    h1Main: string;
    h1Accent: string;
    subtitle: string;
    benefits: { icon: string; text: string }[];
    contents: string[];
    whenSuitable: string[];
    whenOther: { label: string; href: string; text: string }[];
    faq: { q: string; a: string }[];
    ctaLabel: string;
    guideLabel: string;
  };
  package: {
    landlordBundleTitle: string;
    landlordBundleDesc: string;
    landlordBundleNote: string;
    backToSingle: string;
    thematicBadge: string;
    thematicTitle: string;
    thematicDesc: string;
    thematicHint: string;
    thematicCta: string;
    landlordBundleGuideLabel: string;
    packageFlowNote: string;
  };
  form: {
    title: string;
    requiredHint: string;
    sections: {
      landlord: { index: string; title: string; subtitle: string };
      tenant: { index: string; title: string; subtitle: string };
      property: { index: string; title: string; subtitle: string };
      term: { index: string; title: string; subtitle: string };
      handover: { index: string; title: string; subtitle: string };
      rules: { index: string; title: string; subtitle: string };
      tier: { index: string; title: string; subtitlePackage: string; subtitleChoice: string };
    };
    labels: {
      startDate: string;
      handoverDate: string;
      metersHeading: string;
      maxOccupants: string;
      dispute: string;
    };
    placeholders: {
      fullName: string;
      birthId: string;
      address: string;
      idCard: string;
      emailOptional: string;
      phoneOptional: string;
      flatAddress: string;
      layout: string;
      unitNumber: string;
      area: string;
      floor: string;
      ownershipSheet: string;
      cadastral: string;
      parcelOptional: string;
      rent: string;
      utilities: string;
      deposit: string;
      bankAccount: string;
      paymentDay: string;
      variableSymbol: string;
      utilitiesDetail: string;
      keysCount: string;
      electricityReading: string;
      electricitySerial: string;
      gasReading: string;
      gasSerial: string;
      coldWaterReading: string;
      coldWaterSerial: string;
      hotWaterReading: string;
      hotWaterSerial: string;
      lateVacatePenalty: string;
      equipment: string;
      defects: string;
    };
    duration: {
      fixed: string;
      indefinite: string;
      indefiniteHint: string;
    };
    depositWarning: string;
    paymentSummary: {
      heading: string;
      rent: string;
      utilities: string;
      total: string;
    };
    toggles: {
      pets: { label: string; hint: string };
      smoking: { label: string; hint: string };
      airbnb: { label: string; hint: string };
      penalties: { label: string; hint: string };
      inspection: { label: string; hint: string };
      business: { label: string; hint: string };
      indexation: { label: string; hint: string };
    };
    dispute: {
      court: string;
      mediation: string;
      arbitration: string;
      arbitrationWarning: string;
    };
    tierLinkIntro: string;
    tierLinkLandlord: string;
    tierLinkGuide: string;
    tierPackageGuideNote: string;
  };
  sidebar: {
    completionTitle: string;
    completionHint: string;
    badgeReady: string;
    badgeGood: string;
    badgeFill: string;
    riskTitle: string;
    riskOk: string;
    riskLabels: { good: string; average: string; improve: string };
    previewTitle: string;
    previewHint: string;
    protocolTitle: string;
    protocolHint: string;
    generateCta: string;
    generateHint: string;
    documentTitle: string;
    checkoutTitle: string;
    checkoutDocument: string;
    expatDeliverablesTitle?: string;
    expatDeliverables?: string[];
  };
  validation: {
    alertPrefix: string;
    fields: {
      landlordName: string;
      tenantName: string;
      flatAddress: string;
      rentAmount: string;
      startDate: string;
      endDate: string;
    };
    checkoutError: string;
    paymentError: string;
  };
  risk: {
    partyId: string;
    unitId: string;
    endDate: string;
    deposit: string;
    airbnb: string;
    smoking: string;
    penalties: string;
    inspection: string;
    handover: string;
    utilities: string;
    depositMax: string;
  };
  tier: {
    sectionTitle: string;
    sectionSubtitle: string;
    packageProduct: string;
    packageNote: string;
  };
  paymentModal: {
    close: string;
    unlockHeading: string;
    readyTitle: string;
    readySubtitle: string;
    unlockTitle: string;
    unlockSubtitleEmpty: string;
    unlockSubtitleReady: string;
    tierHeading: string;
    includedHeading: string;
    consentLabel: string;
    payCta: string;
    payCtaWithPrice: string;
    processing: string;
    secureNote: string;
    footerSecure: string;
    gdprRequired: string;
    tierBasicTitle: string;
    tierCompleteTitle: string;
    tierBasicDesc: string;
    tierCompleteDesc: string;
  };
  checkoutSummary: {
    title: string;
    documentLabel: string;
    packageIncludes: string;
    variantIncludes: string;
    afterOrder: string;
    afterOrderVariant: string;
    selectedTier: string;
    upgradeCta: string;
    upgradeTitle: string;
    upgradeDescription: string;
    upgradeButton: string;
  };
  tierSelector: {
    heading: string;
    intro: string;
    basicLabel: string;
    completeLabel: string;
    basicDesc: string;
    completeDesc: string;
    completeBadge: string;
    completeHighlights: readonly string[];
  };
};

const LEASE_FORM_CS: LeaseFormUi = {
  isEnglish: false,
  header: { docType: 'Nájemní smlouva', close: 'Zavřít' },
  notices: {
    legal: LEGAL_NOTICE.cs,
    leaseUse: LEASE_USE_NOTICE_CS,
    pdf: LEGAL_NOTICE.cs,
  },
  landing: {
    badge: '§ 2235 a násl. občanského zákoníku',
    h1Main: 'Nájemní smlouva online 2026',
    h1Accent: '',
    subtitle:
      'Vytvořte nájemní smlouvu na byt nebo dům online — bez registrace. Vyplníte strany, nájemné, kauci a pravidla užívání a stáhnete hotový dokument ve formátu PDF; volitelně i editovatelný DOCX.',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 2235–2301 OZ (nájemní smlouva na byt)' },
      { icon: '📄', text: 'PDF ke stažení ihned po zaplacení, volitelně DOCX' },
      { icon: '🏠', text: 'Pokrývá dobu určitou i neurčitou, kauci a zálohy na služby' },
      { icon: '🔒', text: 'Vhodné pro pronájem bytu, domu nebo jeho části' },
    ],
    contents: [
      'Identifikaci pronajímatele a nájemce',
      'Přesný popis bytu (adresa, dispozice, číslo jednotky)',
      'Výši nájmu, záloh na služby a způsob platby',
      'Výši a podmínky kauce (jistoty)',
      'Dobu nájmu a podmínky ukončení',
      'Práva a povinnosti stran (domácí zvířata, kouření, podnájem)',
      'Stav bytu při předání a předávací podmínky',
      'Závěrečná ustanovení, GDPR a vyšší moc',
    ],
    whenSuitable: [
      'Pronájem celého bytu nebo domu soukromé osobě',
      'Pronájem části nemovitosti (pokoj, garsonka)',
      'Uzavření nájemního vztahu na dobu určitou nebo neurčitou',
      'Případy, kdy potřebujete mít jasně ošetřené podmínky užívání nemovitosti',
    ],
    whenOther: [
      {
        label: 'Podnájemní smlouva',
        href: '/podnajem',
        text: 'Pokud sám jste nájemcem a dáváte byt nebo jeho část do podnájmu.',
      },
    ],
    faq: [...LEASE_CS_LANDING_FAQ],
    ctaLabel: 'Vytvořit nájemní smlouvu',
    guideLabel: 'Průvodce nájemní smlouvou — co obsahuje, kdy ji použít a nejčastější chyby',
  },
  package: {
    landlordBundleTitle: 'Balíček pro pronajímatele',
    landlordBundleDesc:
      'Pokud chcete řešit i předání bytu a potvrzení o převzetí kauce, pokračujte tematickým balíčkem pro pronajímatele.',
    landlordBundleNote:
      'Pokud si nejste jistí, kterou cestu zvolit, pomůže vám orientační stránka Dokumenty pro pronajímatele.',
    backToSingle: 'Řešíte jen samotnou nájemní smlouvu? Vraťte se na samostatný dokument →',
    thematicBadge: 'Tematický balíček',
    thematicTitle: 'Balíček pro pronajímatele',
    thematicDesc:
      'Pokud chcete řešit i předání bytu a potvrzení o převzetí kauce, pokračujte tematickým balíčkem pro pronajímatele.',
    thematicHint:
      'Pokud si nejste jistí, kterou cestu zvolit, pomůže vám orientační stránka Dokumenty pro pronajímatele.',
    thematicCta: 'Otevřít balíček →',
    landlordBundleGuideLabel: 'Dokumenty pro pronajímatele',
    packageFlowNote: 'Nájemní smlouva v komplexní variantě a navazující podklady v jednom výstupu.',
  },
  form: {
    title: 'Vyplňte údaje dokumentu',
    requiredHint: 'Všechna povinná pole jsou označena *',
    sections: {
      landlord: { index: '01', title: 'Pronajímatel', subtitle: 'Přesná identifikace výrazně zvyšuje vymahatelnost smlouvy.' },
      tenant: { index: '02', title: 'Nájemce', subtitle: 'Vyplň co nejpřesněji, zejména OP a adresu.' },
      property: { index: '03', title: 'Nemovitost', subtitle: 'Tady se rozhoduje, jestli je byt ve smlouvě popsán profesionálně, nebo jen přibližně.' },
      term: { index: '04', title: 'Doba nájmu a platby', subtitle: 'Základ každé funkční smlouvy je jasný termín, cena a splatnost.' },
      handover: { index: '05', title: 'Předávací protokol', subtitle: 'Tohle je přesně ta část, která při sporu rozhoduje o škodě a vrácení kauce.' },
      rules: { index: '06', title: 'Pravidla nájmu', subtitle: 'Tady nastavuješ, jak tvrdý nebo měkký režim bude smlouva mít.' },
      tier: {
        index: '07',
        title: 'Vyberte úroveň zpracování',
        subtitlePackage: 'V balíčku pro pronajímatele je zahrnuta nájemní smlouva v komplexní variantě a navazující podklady.',
        subtitleChoice:
          'Základní varianta obsahuje standardní dokument. Rozšířená varianta přidává širší rozsah klauzulí a praktičtější podklady.',
      },
    },
    labels: {
      startDate: 'Začátek nájmu',
      handoverDate: 'Předání bytu',
      metersHeading: 'Stav měřidel při předání',
      maxOccupants: 'Maximální počet osob',
      dispute: 'Řešení sporů',
    },
    placeholders: {
      fullName: 'Celé jméno',
      birthId: 'Rodné číslo / datum narození',
      address: 'Trvalé bydliště',
      idCard: 'Číslo OP',
      emailOptional: 'E-mail (volitelné)',
      phoneOptional: 'Telefon (volitelné)',
      flatAddress: 'Adresa bytu',
      layout: 'Dispozice (např. 2+kk)',
      unitNumber: 'Číslo jednotky',
      area: 'Výměra bytu (m²)',
      floor: 'Podlaží / patro',
      ownershipSheet: 'List vlastnictví č.',
      cadastral: 'Katastrální území (název)',
      parcelOptional: 'Číslo parcely (volitelné)',
      rent: 'Nájem (Kč)',
      utilities: 'Služby (Kč)',
      deposit: 'Kauce (Kč)',
      bankAccount: 'Číslo účtu',
      paymentDay: 'Den splatnosti',
      variableSymbol: 'Variabilní symbol',
      utilitiesDetail:
        'Co zahrnují služby? Např. voda, teplo, úklid společných prostor, osvětlení domu, internet...',
      keysCount: 'Počet klíčů (ks)',
      electricityReading: 'Elektroměr — stav (kWh)',
      electricitySerial: 'Elektroměr — číslo měřiče',
      gasReading: 'Plynoměr — stav (m³)',
      gasSerial: 'Plynoměr — číslo měřiče',
      coldWaterReading: 'Vodoměr studená voda — stav (m³)',
      coldWaterSerial: 'Vodoměr studená — číslo měřiče',
      hotWaterReading: 'Vodoměr teplá voda — stav (m³)',
      hotWaterSerial: 'Vodoměr teplá — číslo měřiče',
      lateVacatePenalty: 'Sankce za pozdní vyklizení, např. jednodenní nájemné',
      equipment: 'Seznam vybavení bytu. Např. kuchyňská linka, trouba, lednice, myčka, postel, skříně...',
      defects: 'Známé vady / poškození / poznámky. Např. oděrky na podlaze, prasklina u umyvadla, chybějící žaluzie...',
    },
    duration: {
      fixed: 'Doba určitá',
      indefinite: 'Doba neurčitá',
      indefiniteHint: 'U doby neurčité není datum konce potřeba.',
    },
    depositWarning: '⚠ Jistota a případné smluvní pokuty nesmí v souhrnu přesáhnout 3× měsíční nájemné (§ 2254 OZ).',
    paymentSummary: {
      heading: 'Souhrn plateb',
      rent: 'Měsíční nájem',
      utilities: 'Služby',
      total: 'Celkem',
    },
    toggles: {
      pets: { label: 'Domácí zvířata', hint: 'Nastaví se pravidla odpovědnosti za škody, zvýšené náklady a nepřiměřené obtíže podle § 2258 OZ.' },
      smoking: { label: 'Kouření v bytě', hint: 'Povolení kouření zvyšuje riziko škod.' },
      airbnb: { label: 'Airbnb / krátkodobý podnájem', hint: 'Vysoce rizikové nastavení pro pronajímatele.' },
      penalties: { label: 'Přísnější smluvní pokuty', hint: 'Sankce musí zůstat přiměřené a spolu s jistotou respektovat limit podle § 2254 OZ.' },
      inspection: { label: 'Právo kontroly bytu', hint: 'Pronajímatel může po oznámení zkontrolovat stav bytu.' },
      business: { label: 'Povolit podnikání v bytě', hint: 'Obvykle je lepší nechat byt pouze k bydlení.' },
      indexation: {
        label: 'Inflační doložka (indexace nájemného)',
        hint: 'Nájemné se každoročně upraví podle indexu spotřebitelských cen ČSÚ. Alternativa k jednostrannému zvýšení dle § 2249 OZ.',
      },
    },
    dispute: {
      court: 'Obecný soud (výchozí)',
      mediation: 'Mediace (zákon č. 202/2012 Sb.)',
      arbitration: 'Rozhodčí řízení (Rozhodčí soud HK ČR)',
      arbitrationWarning:
        '⚠ U spotřebitelských smluv (B2C) bývá rozhodčí doložka neúčinná dle zák. č. 216/1994 Sb. Doporučujeme ji použít pouze ve vztazích mezi podnikateli (B2B).',
    },
    tierLinkIntro:
      'Potřebujete také předávací protokol, odečty měřidel a potvrzení o kauci?',
    tierLinkLandlord: 'Zobrazit Balíček pro pronajímatele',
    tierLinkGuide: 'dokumenty pro pronajímatele',
    tierPackageGuideNote:
      'Pokud si chcete nejprve ujasnit, která cesta je pro vás vhodná, otevřete',
  },
  sidebar: {
    completionTitle: 'Stav vyplnění',
    completionHint: 'Čím kompletnější údaje, tím silnější výsledná smlouva.',
    badgeReady: 'Skoro hotovo',
    badgeGood: 'Dobré',
    badgeFill: 'Doplň údaje',
    riskTitle: 'Analýza smlouvy',
    riskOk: 'Smlouva je zatím nastavena velmi dobře. Rizikové prvky nejsou detekovány.',
    riskLabels: { good: 'Dobré nastavení', average: 'Průměrná ochrana', improve: 'Doporučená doplnění' },
    previewTitle: 'Náhled výstupu',
    previewHint: 'Tady se okamžitě propisují všechny změny z formuláře.',
    protocolTitle: 'Předávací protokol',
    protocolHint: 'Automaticky generovaná příloha ke smlouvě.',
    generateCta: 'Vygenerovat smlouvu →',
    generateHint: 'Zobrazí se náhled dokumentu připraveného k odemčení',
    documentTitle: 'Nájemní smlouva',
    checkoutTitle: 'Shrnutí objednávky',
    checkoutDocument: 'Nájemní smlouva',
  },
  validation: {
    alertPrefix: 'Vyplňte prosím',
    fields: {
      landlordName: 'jméno pronajímatele',
      tenantName: 'jméno nájemce',
      flatAddress: 'adresu bytu',
      rentAmount: 'výši nájemného',
      startDate: 'datum začátku nájmu',
      endDate: 'datum konce nájmu (doba určitá)',
    },
    checkoutError: 'Nepodařilo se vytvořit checkout session.',
    paymentError: 'Chyba platební brány. Zkuste to prosím znovu nebo kontaktujte info@smlouvahned.cz',
  },
  risk: {
    partyId: 'Doplňte identifikaci smluvních stran. Bez přesných údajů je vymahatelnost slabší.',
    unitId: 'Byt není dostatečně přesně identifikován (číslo jednotky / katastrální území).',
    endDate: 'U doby určité chybí datum konce nájmu.',
    deposit: 'Doporučená doplnění: Kauce by měla být alespoň dvojnásobek měsíčního nájemného.',
    airbnb: 'Airbnb / krátkodobý podnájem je povolen. Riziko škod, sousedských sporů a obcházení účelu nájmu je vysoké.',
    smoking: 'Kouření v bytě zvyšuje riziko škod a sporů při vrácení kauce.',
    penalties: 'Pokuty sjednávejte přiměřeně. U nájmu bytu se jejich souhrn spolu s jistotou počítá do limitu podle § 2254 OZ.',
    inspection: 'Doporučujeme povolit pravidelnou kontrolu bytu. To zvyšuje kontrolu nad stavem nemovitosti.',
    handover: 'Doplňte údaje pro předávací protokol (klíče / vybavení). To usnadňuje dokazování škody.',
    utilities: 'Doporučujeme specifikovat, co přesně zahrnují služby a zálohy.',
    depositMax: 'Kauce přesahuje zákonné maximum trojnásobku měsíčního nájemného (§ 2254 OZ). Pokud jsou sjednány i smluvní pokuty, počítají se do stejného limitu.',
  },
  tier: {
    sectionTitle: 'Zvolený produkt',
    sectionSubtitle: 'V balíčku pro pronajímatele je zahrnuta nájemní smlouva v komplexní variantě a navazující podklady.',
    packageProduct: 'Zvolený produkt',
    packageNote: 'Komplexní nájemní smlouva a související podklady.',
  },
  paymentModal: {
    close: 'Zavřít',
    unlockHeading: 'Odemknout dokument',
    readyTitle: 'Váš dokument je připraven',
    readySubtitle: 'Po zaplacení získáte PDF ihned ke stažení',
    unlockTitle: 'Nájemní smlouva',
    unlockSubtitleEmpty: 'Doplňte zbývající údaje ve formuláři a vyberte variantu dokumentu.',
    unlockSubtitleReady: 'Dokument je sestavený podle vyplněných údajů. Vyberte variantu, zaplaťte přes Stripe a stáhněte PDF ihned.',
    tierHeading: 'Varianta dokumentu',
    includedHeading: 'Součástí je',
    consentLabel:
      'Přijímám obchodní podmínky a beru na vědomí zásady ochrany osobních údajů. Výslovně souhlasím s okamžitým dodáním digitálního obsahu před uplynutím lhůty pro odstoupení a beru na vědomí, že jeho úplným dodáním ztrácím právo odstoupit dle § 1837 písm. l) OZ.',
    payCta: 'Zaplatit a stáhnout PDF',
    payCtaWithPrice: 'Odemknout a stáhnout',
    processing: 'Přesměrování na platbu…',
    secureNote: 'Platba probíhá bezpečně přes Stripe. Údaje karty se na naše servery nedostávají.',
    footerSecure: 'Zabezpečená platba přes Stripe · PDF ihned · bez registrace',
    gdprRequired: 'Potvrďte prosím souhlas se zpracováním osobních údajů.',
    tierBasicTitle: 'Základní dokument',
    tierCompleteTitle: 'Rozšířený dokument',
    tierBasicDesc: 'Pro běžné a standardní situace.',
    tierCompleteDesc: 'Pro situace, kde požadujete širší rozsah a vyšší míru jistoty.',
  },
  checkoutSummary: {
    title: 'Dokument připraven k odemknutí',
    documentLabel: 'Vybraný dokument',
    packageIncludes: 'Součástí balíčku je',
    variantIncludes: 'Součástí varianty je',
    afterOrder:
      'Po zaplacení získáte výstup odpovídající tomuto balíčku ihned ke stažení, připravený k závěrečné kontrole a podpisu.',
    afterOrderVariant:
      'Po zaplacení získáte výstup odpovídající zvolené variantě ihned ke stažení, připravený k závěrečné kontrole a podpisu.',
    selectedTier: 'Vybraná varianta',
    upgradeCta: 'Přejít na rozšířenou variantu',
    upgradeTitle: 'Potřebujete širší ochranu?',
    upgradeDescription:
      'Rozšířená varianta přidává podrobnější klauzule a praktické přílohy pro náročnější pronájem.',
    upgradeButton: 'Přejít na rozšířenou variantu',
  },
  tierSelector: {
    heading: 'Vyberte úroveň zpracování dokumentu',
    intro:
      'Základní varianta obsahuje standardní dokument. Rozšířená varianta přidává širší rozsah klauzulí a praktičtější podklady.',
    basicLabel: 'Základní dokument',
    completeLabel: 'Rozšířený dokument',
    basicDesc: 'Plnohodnotná nájemní smlouva pro běžný a přímočarý pronájem.',
    completeDesc:
      'Rozšířená varianta pro citlivější nájemní vztahy, kde je důležité podrobnější nastavení povinností a předání.',
    completeBadge: 'Doporučená volba',
    completeHighlights: ['doručování a sankce', 'podrobnější režim služeb a kauce', 'checklist předání bytu'],
  },
};

export const LEASE_FORM_EN: LeaseFormUi = {
  isEnglish: true,
  header: { docType: 'Rental agreement', close: 'Close' },
  notices: {
    legal: LEGAL_NOTICE.en,
    leaseUse: LEASE_USE_NOTICE_EN,
    pdf: LEGAL_NOTICE.en,
  },
  landing: {
    badge: 'Czech Civil Code § 2235 et seq.',
    h1Main: 'Rental agreement for an',
    h1Accent: 'apartment online',
    subtitle:
      'Create a Czech rental agreement for an apartment or house. The template covers rent, deposit, utilities, handover and house rules, structured under the Czech Civil Code (Act No. 89/2012 Coll.).',
    benefits: [
      { icon: '⚖️', text: 'Structured under Czech Civil Code § 2235–2301 (apartment lease)' },
      { icon: '📄', text: 'PDF download immediately after payment' },
      { icon: '🏠', text: 'Fixed or indefinite term, deposit and service charges' },
      { icon: '🔒', text: 'Suitable for renting an apartment, house or part of a property' },
    ],
    contents: [
      'Landlord and tenant identification',
      'Precise description of the apartment (address, layout, unit number)',
      'Rent, utility advances and payment method',
      'Security deposit amount and conditions',
      'Lease term and termination rules',
      'Rights and obligations (pets, smoking, subletting)',
      'Condition at handover and handover protocol',
      'Final provisions, GDPR and force majeure',
    ],
    whenSuitable: [
      'Renting a whole apartment or house to a private person',
      'Renting part of a property (room, studio)',
      'Fixed-term or indefinite lease',
      'When you need clear rules for use of the property',
    ],
    whenOther: [
      {
        label: 'Sublease agreement',
        href: '/podnajem',
        text: 'If you are the tenant and sublet the apartment or part of it to someone else.',
      },
    ],
    faq: [
      {
        q: 'What is the difference between a lease and a sublease?',
        a: 'A lease is signed with the owner. A sublease applies when the tenant further rents the apartment or part of it — usually with the landlord’s consent.',
      },
      {
        q: 'Is a written lease required?',
        a: 'Czech law does not require a written form, but strongly recommends it. Oral agreements are hard to prove in disputes.',
      },
      {
        q: 'How high can the security deposit be?',
        a: 'Under § 2254 of the Civil Code, the deposit may be at most three times the monthly rent. It must be returned after the lease ends if no damage occurred.',
      },
      {
        q: 'Do I get the document right after payment?',
        a: 'Yes — the PDF is available for download immediately after payment.',
      },
      {
        q: 'Does a notary need to certify the lease?',
        a: 'For a standard apartment lease, notarisation is not required. Signatures of both parties are sufficient.',
      },
    ],
    ctaLabel: 'Create rental agreement',
    guideLabel: 'Lease guide — contents, when to use it, common mistakes',
  },
  package: {
    landlordBundleTitle: 'Landlord package',
    landlordBundleDesc:
      'If you also need handover paperwork and deposit confirmation, continue with the landlord thematic package.',
    landlordBundleNote: 'Not sure which path to choose? See the overview page',
    landlordBundleGuideLabel: 'Documents for landlords',
    backToSingle: 'Only need the lease itself? Return to the standalone document →',
    thematicBadge: 'Thematic package',
    thematicTitle: 'Landlord package',
    thematicDesc:
      'If you also need handover paperwork and deposit confirmation, continue with the landlord thematic package.',
    thematicHint: 'Not sure which path to choose? See the overview page',
    thematicCta: 'Open package →',
    packageFlowNote: 'Extended lease and related documents in one output.',
  },
  form: {
    title: 'Fill in the document details',
    requiredHint: 'All required fields are marked *',
    sections: {
      landlord: { index: '01', title: 'Landlord', subtitle: 'Accurate identification improves enforceability.' },
      tenant: { index: '02', title: 'Tenant', subtitle: 'Fill in as precisely as possible, especially ID and address.' },
      property: { index: '03', title: 'Property', subtitle: 'A precise description protects both parties in disputes.' },
      term: { index: '04', title: 'Term and payments', subtitle: 'Clear dates, rent and due dates are essential.' },
      handover: { index: '05', title: 'Handover protocol', subtitle: 'This section often decides deposit disputes.' },
      rules: { index: '06', title: 'House rules', subtitle: 'Set how strict or flexible the lease will be.' },
      tier: {
        index: '07',
        title: 'Choose document level',
        subtitlePackage: 'The landlord package includes the extended lease and related documents.',
        subtitleChoice: 'Basic includes standard clauses. Extended adds stronger protection and practical annexes.',
      },
    },
    labels: {
      startDate: 'Lease start date',
      handoverDate: 'Handover date',
      metersHeading: 'Meter readings at handover',
      maxOccupants: 'Maximum number of occupants',
      dispute: 'Dispute resolution',
    },
    placeholders: {
      fullName: 'Full name',
      birthId: 'National ID / date of birth',
      address: 'Permanent address',
      idCard: 'ID card number',
      emailOptional: 'E-mail (optional)',
      phoneOptional: 'Phone (optional)',
      flatAddress: 'Apartment address',
      layout: 'Layout (e.g. 2+kk)',
      unitNumber: 'Unit number',
      area: 'Floor area (m²)',
      floor: 'Floor',
      ownershipSheet: 'Land registry sheet no.',
      cadastral: 'Cadastral area (name)',
      parcelOptional: 'Parcel number (optional)',
      rent: 'Rent (CZK)',
      utilities: 'Utilities / services (CZK)',
      deposit: 'Security deposit (CZK)',
      bankAccount: 'Bank account number',
      paymentDay: 'Due day of month',
      variableSymbol: 'Variable symbol',
      utilitiesDetail:
        'What do the service charges include? E.g. water, heating, common-area cleaning, house lighting, internet...',
      keysCount: 'Number of keys',
      electricityReading: 'Electricity meter — reading (kWh)',
      electricitySerial: 'Electricity meter — serial no.',
      gasReading: 'Gas meter — reading (m³)',
      gasSerial: 'Gas meter — serial no.',
      coldWaterReading: 'Cold water meter — reading (m³)',
      coldWaterSerial: 'Cold water meter — serial no.',
      hotWaterReading: 'Hot water meter — reading (m³)',
      hotWaterSerial: 'Hot water meter — serial no.',
      lateVacatePenalty: 'Late-vacating penalty, e.g. one day of rent',
      equipment: 'List of equipment. E.g. kitchen, oven, fridge, dishwasher, bed, wardrobes...',
      defects: 'Known defects / damage / notes. E.g. floor scratches, cracked sink, missing blinds...',
    },
    duration: {
      fixed: 'Fixed term',
      indefinite: 'Indefinite term',
      indefiniteHint: 'No end date is required for an indefinite lease.',
    },
    depositWarning: '⚠ The deposit and any contractual penalties may not exceed 3× monthly rent in aggregate (§ 2254 Civil Code).',
    paymentSummary: {
      heading: 'Payment summary',
      rent: 'Monthly rent',
      utilities: 'Services',
      total: 'Total',
    },
    toggles: {
      pets: { label: 'Pets', hint: 'Allow or prohibit keeping pets in the apartment.' },
      smoking: { label: 'Smoking in the apartment', hint: 'Allowing smoking increases damage risk.' },
      airbnb: { label: 'Airbnb / short-term subletting', hint: 'High risk for landlords.' },
      penalties: { label: 'Stricter contractual penalties', hint: 'Recommended. Stronger protection for non-payment and failure to vacate.' },
      inspection: { label: 'Right to inspect the apartment', hint: 'Landlord may check the condition after notice.' },
      business: { label: 'Allow business use of the apartment', hint: 'Usually better to restrict use to living only.' },
      indexation: {
        label: 'Inflation indexation clause',
        hint: 'Rent adjusted annually per Czech Statistical Office consumer price index. Alternative to unilateral increase under § 2249 Civil Code.',
      },
    },
    dispute: {
      court: 'General court (default)',
      mediation: 'Mediation (Act No. 202/2012 Coll.)',
      arbitration: 'Arbitration (Arbitration Court of the Czech Chamber of Commerce)',
      arbitrationWarning:
        '⚠ In B2C relationships, arbitration clauses are often ineffective under Act No. 216/1994 Coll. Use mainly for B2B relationships.',
    },
    tierLinkIntro:
      'Need handover paperwork, meter readings and deposit confirmation as well?',
    tierLinkLandlord: 'View Landlord package',
    tierLinkGuide: 'documents for landlords',
    tierPackageGuideNote: 'If you are not sure which path fits, open',
  },
  sidebar: {
    completionTitle: 'Completion',
    completionHint: 'The more complete your data, the stronger the resulting contract.',
    badgeReady: 'Almost done',
    badgeGood: 'Good',
    badgeFill: 'Add details',
    riskTitle: 'Completeness check',
    riskOk: 'The lease is set up well so far. No major risks detected.',
    riskLabels: { good: 'Good setup', average: 'Average protection', improve: 'Suggested improvements' },
    previewTitle: 'Output preview',
    previewHint:
      'Guided preview of the translation structure. The primary Czech contract and handover protocol wording are generated in Czech in the PDF.',
    protocolTitle: 'Handover protocol',
    protocolHint: 'Czech handover protocol annex — filled from your meter and key details.',
    expatDeliverablesTitle: 'After payment you receive',
    expatDeliverables: [
      'Czech rental agreement PDF (primary Czech wording)',
      'Explanatory English translation annex',
      'Handover protocol annex (Czech)',
      'Signing guide and checklist (Complete tier, Czech)',
    ],
    generateCta: 'Generate contract →',
    generateHint: 'Opens a preview ready to unlock',
    documentTitle: 'Rental agreement',
    checkoutTitle: 'Order summary',
    checkoutDocument: 'Rental agreement',
  },
  validation: {
    alertPrefix: 'Please fill in',
    fields: {
      landlordName: 'landlord name',
      tenantName: 'tenant name',
      flatAddress: 'apartment address',
      rentAmount: 'rent amount',
      startDate: 'lease start date',
      endDate: 'lease end date (fixed term)',
    },
    checkoutError: 'Could not create checkout session.',
    paymentError: 'Payment gateway error. Please try again or contact info@smlouvahned.cz',
  },
  risk: {
    partyId: 'Add party identification. Incomplete data weakens enforceability.',
    unitId: 'The apartment is not identified precisely enough (unit number / cadastral area).',
    endDate: 'Fixed-term lease is missing an end date.',
    deposit: 'Suggested improvement: deposit should be at least twice the monthly rent.',
    airbnb: 'Airbnb / short-term subletting is allowed. High risk of damage, neighbour disputes and misuse.',
    smoking: 'Smoking in the apartment increases damage and deposit disputes.',
    penalties: 'We recommend enabling stricter penalties for stronger protection.',
    inspection: 'We recommend allowing periodic inspections to monitor the property.',
    handover: 'Add handover protocol details (keys / equipment) to prove condition.',
    utilities: 'Specify what service charges and advances include.',
    depositMax: 'Deposit exceeds the statutory maximum of 3 monthly rents (§ 2254 Civil Code). The excess is unenforceable.',
  },
  tier: {
    sectionTitle: 'Selected product',
    sectionSubtitle: 'The landlord package includes the extended lease and related documents.',
    packageProduct: 'Selected product',
    packageNote: 'Extended lease and related documents.',
  },
  paymentModal: {
    close: 'Close',
    unlockHeading: 'Unlock document',
    readyTitle: 'Your document is ready',
    readySubtitle: 'Unlock access to the full PDF',
    unlockTitle: 'Rental agreement',
    unlockSubtitleEmpty: 'Complete the remaining fields and choose a document level.',
    unlockSubtitleReady: 'Your document is assembled. Choose a level and complete payment.',
    tierHeading: 'Document level',
    includedHeading: 'Included',
    consentLabel:
      'I accept the Terms and acknowledge the Privacy Policy. I expressly consent to immediate delivery of the digital content before the withdrawal period ends and acknowledge that, once fully delivered, I lose the right of withdrawal under § 1837(l) of the Czech Civil Code.',
    payCta: 'Pay and download PDF',
    payCtaWithPrice: 'Unlock and download',
    processing: 'Redirecting to payment…',
    secureNote: 'Payment is processed securely by Stripe. Card details are not stored on our servers.',
    footerSecure: 'Secure payment via Stripe · PDF available immediately',
    gdprRequired: 'Please confirm consent to personal data processing.',
    tierBasicTitle: 'Basic document',
    tierCompleteTitle: 'Extended document',
    tierBasicDesc: 'For typical, straightforward situations.',
    tierCompleteDesc: 'When you want broader clauses and stronger protection.',
  },
  checkoutSummary: {
    title: 'Order summary',
    documentLabel: 'Selected document',
    packageIncludes: 'Package includes',
    variantIncludes: 'Included in this level',
    afterOrder: 'After payment you will receive the output for this package, ready for final review and signature.',
    afterOrderVariant:
      'After payment you will receive the output for the selected level, ready for final review and signature.',
    selectedTier: 'Selected level',
    upgradeCta: 'Switch to extended level',
    upgradeTitle: 'Need broader protection?',
    upgradeDescription:
      'The extended level adds more detailed clauses and practical annexes for sensitive rentals.',
    upgradeButton: 'Switch to extended level',
  },
  tierSelector: {
    heading: 'Choose document level',
    intro:
      'Basic includes standard clauses. Extended adds broader protection and practical annexes.',
    basicLabel: 'Basic document',
    completeLabel: 'Extended document',
    basicDesc: 'Full rental agreement for typical, straightforward leases.',
    completeDesc:
      'Extended level for sensitive rentals where handover, penalties and obligations need more detail.',
    completeBadge: 'Recommended',
    completeHighlights: ['delivery and penalties', 'utilities and deposit detail', 'handover checklist'],
  },
};

const LEASE_FORM_UK: LeaseFormUi = {
  ...LEASE_FORM_EN,
  isEnglish: true,
  header: UK_LEASE_FORM_CONTENT.header,
  notices: {
    legal: LEGAL_NOTICE.ua,
    leaseUse: LEASE_USE_NOTICE_UK,
    pdf: LEGAL_NOTICE.ua,
  },
  landing: UK_LEASE_FORM_CONTENT.landing,
  package: UK_LEASE_FORM_CONTENT.package,
  form: {
    ...LEASE_FORM_EN.form,
    ...UK_LEASE_FORM_CONTENT.form,
  },
  sidebar: UK_LEASE_FORM_CONTENT.sidebar,
  validation: UK_LEASE_FORM_CONTENT.validation,
  risk: UK_LEASE_FORM_CONTENT.risk,
  tier: UK_LEASE_FORM_CONTENT.tier,
  paymentModal: {
    ...LEASE_FORM_EN.paymentModal,
    ...UK_LEASE_FORM_CONTENT.paymentModal,
  },
  checkoutSummary: UK_LEASE_FORM_CONTENT.checkoutSummary,
  tierSelector: UK_LEASE_FORM_CONTENT.tierSelector,
};

export { LEASE_FORM_PRIMARY_EN_MARKERS } from '@/lib/i18n/lease-form-uk-content';

/** Primary Czech field labels that must not appear as form placeholders in EN UI. */
export const LEASE_FORM_PRIMARY_CZECH_MARKERS = [
  'Celé jméno',
  'Rodné číslo',
  'Trvalé bydliště',
  'Číslo OP',
  'Vyplňte údaje dokumentu',
  'Pronajímatel',
  'Nájemce',
  'Vygenerovat smlouvu',
] as const;

export function getLeaseFormUi(locale: AppLocale): LeaseFormUi {
  if (locale === 'cs') return LEASE_FORM_CS;
  if (locale === 'ua') return LEASE_FORM_UK;
  if (locale === 'en') return LEASE_FORM_EN;
  return LEASE_FORM_EN;
}

export function isLeaseFormLocalized(locale: AppLocale): boolean {
  return locale !== 'cs';
}
