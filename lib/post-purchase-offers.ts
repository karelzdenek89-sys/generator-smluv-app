/**
 * Navazující nabídky zobrazované až po zaplacení.
 *
 * Záměrně obecný registr, nikoli komponenta pro jednu smlouvu: nabídka se
 * vybírá podle typu dokumentu, který zákazník právě koupil.
 *
 * Pravidla, která tento modul vynucuje:
 *  - Nabídka se nikdy nezobrazí před dokončením platby. Volá se pouze ze
 *    success a download stránky, aby nesnižovala důvěryhodnost nákupu smlouvy.
 *  - Bez zapnutého flagu i bez cílové URL zůstává nabídka skrytá. Nikdy
 *    neukazujeme službu, kterou zatím nelze použít.
 *  - Je-li odkaz provizní, musí být viditelně označen jako partnerský.
 *  - Cílové URL se čte z prostředí. Do repozitáře nepatří žádný konkrétní
 *    affiliate odkaz ani partnerský identifikátor.
 */

import type { ContractType } from './contracts';
import { isFeatureEnabled, type FeatureFlagKey } from './feature-flags';
import { normalizeLocale } from './locale';

export type PostPurchaseOffer = {
  /** Stabilní identifikátor pro analytiku. */
  id: string;
  /** Typy dokumentů, u kterých nabídka dává smysl. Prázdné pole = všechny. */
  documentTypes: readonly ContractType[];
  title: string;
  description: string;
  cta: string;
  href: string;
  /** Doplňující věta pod nabídkou — rozsah služby, omezení, upozornění. */
  disclosure?: string;
  /** Placený partnerský odkaz musí být v UI označen. */
  isAffiliate: boolean;
  enabled: boolean;
};

type OfferCopy = {
  title: string;
  description: string;
  cta: string;
  disclosure?: string;
};

type OfferDefinition = {
  id: string;
  documentTypes: readonly ContractType[];
  /** Znění nabídky podle jazyka rozhraní. Klíč `cs` je povinný fallback. */
  copy: Record<'cs' | 'en' | 'ua', OfferCopy>;
  flag: FeatureFlagKey;
  /**
   * Cílová URL a příznak provize se čtou až při volání, ne při inicializaci
   * modulu. Konfigurace se tak nemůže „zamrznout" podle pořadí importů a
   * nabídka vždy odpovídá aktuálnímu prostředí. Každá proměnná se uvádí
   * celým literálem, aby ji Next.js dokázal nahradit v klientském bundlu.
   */
  resolveHref: () => string | undefined;
  resolveIsAffiliate: () => boolean;
};

const VEHICLE_DOCUMENT_TYPES: readonly ContractType[] = ['car_sale'];

function envUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  // Pouze absolutní https odkaz. Chrání před tím, aby překlep v konfiguraci
  // vytvořil relativní odkaz kamsi do aplikace.
  return /^https:\/\//i.test(trimmed) ? trimmed : undefined;
}

function isAffiliateFlag(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

const OFFER_DEFINITIONS: readonly OfferDefinition[] = [
  {
    id: 'esign',
    documentTypes: [],
    copy: {
      cs: {
        title: 'Chcete dokument podepsat elektronicky?',
        description: 'Hotové PDF můžete odeslat oběma stranám k elektronickému podpisu.',
        cta: 'Pokračovat k elektronickému podpisu',
        disclosure:
          'Službu elektronického podpisu poskytuje samostatný poskytovatel. Ověřte si, zda zvolený typ podpisu odpovídá požadavkům na váš dokument.',
      },
      en: {
        title: 'Do you want to sign the document electronically?',
        description: 'You can send the finished PDF to both parties for an electronic signature.',
        cta: 'Continue to electronic signature',
        disclosure:
          'The electronic signature service is provided by a separate provider. Check whether the signature type you choose meets the requirements for your document.',
      },
      ua: {
        title: 'Хочете підписати документ електронно?',
        description: 'Готовий PDF можна надіслати обом сторонам для електронного підпису.',
        cta: 'Перейти до електронного підпису',
        disclosure:
          'Послугу електронного підпису надає окремий постачальник. Перевірте, чи обраний тип підпису відповідає вимогам до вашого документа.',
      },
    },
    flag: 'esignOffer',
    resolveHref: () => envUrl(process.env.NEXT_PUBLIC_ESIGN_OFFER_URL),
    resolveIsAffiliate: () => isAffiliateFlag(process.env.NEXT_PUBLIC_ESIGN_OFFER_IS_AFFILIATE),
  },
  {
    id: 'vehicle_history',
    documentTypes: VEHICLE_DOCUMENT_TYPES,
    copy: {
      cs: {
        title: 'Než vozidlo převezmete',
        description:
          'Kupní smlouva řeší právní podmínky převodu. Samostatně si můžete prověřit dostupnou historii vozidla podle VIN.',
        cta: 'Prověřit historii vozidla',
        disclosure:
          'Prověření historie zajišťuje samostatný poskytovatel a jeho rozsah závisí na dostupných záznamech. Nejde o součást zakoupeného dokumentu.',
      },
      en: {
        title: 'Before you take over the vehicle',
        description:
          'The purchase agreement covers the legal terms of the transfer. Separately, you can check the available vehicle history by VIN.',
        cta: 'Check the vehicle history',
        disclosure:
          'The history check is carried out by a separate provider and its scope depends on the available records. It is not part of the document you purchased.',
      },
      ua: {
        title: 'Перш ніж приймати автомобіль',
        description:
          'Договір купівлі-продажу регулює правові умови передачі. Окремо ви можете перевірити доступну історію автомобіля за VIN.',
        cta: 'Перевірити історію автомобіля',
        disclosure:
          'Перевірку історії здійснює окремий постачальник, і її обсяг залежить від доступних записів. Це не входить до придбаного документа.',
      },
    },
    flag: 'vehicleHistoryOffer',
    resolveHref: () => envUrl(process.env.NEXT_PUBLIC_VEHICLE_HISTORY_OFFER_URL),
    resolveIsAffiliate: () =>
      isAffiliateFlag(process.env.NEXT_PUBLIC_VEHICLE_HISTORY_OFFER_IS_AFFILIATE),
  },
];

function matchesDocumentType(
  offer: OfferDefinition,
  contractType: string | null | undefined,
): boolean {
  if (offer.documentTypes.length === 0) return true;
  return offer.documentTypes.includes(String(contractType ?? '') as ContractType);
}

/**
 * Nabídky, které se smí zobrazit po zaplacení dokumentu daného typu.
 * Vrací prázdné pole, dokud nejsou flag i cílová URL nastavené.
 */
export function getPostPurchaseOffers(
  contractType: string | null | undefined,
  locale?: string | null,
): readonly PostPurchaseOffer[] {
  const lang = normalizeLocale(locale);
  const copyLang: 'cs' | 'en' | 'ua' = lang === 'en' || lang === 'ua' ? lang : 'cs';
  const resolved: PostPurchaseOffer[] = [];

  for (const offer of OFFER_DEFINITIONS) {
    if (!isFeatureEnabled(offer.flag)) continue;
    if (!matchesDocumentType(offer, contractType)) continue;
    const href = offer.resolveHref();
    if (!href) continue;

    const copy = offer.copy[copyLang];
    resolved.push({
      id: offer.id,
      documentTypes: offer.documentTypes,
      title: copy.title,
      description: copy.description,
      cta: copy.cta,
      href,
      disclosure: copy.disclosure,
      isAffiliate: offer.resolveIsAffiliate(),
      enabled: true,
    });
  }

  return resolved;
}
