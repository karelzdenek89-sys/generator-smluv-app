/**
 * Nabídka tematického balíčku v builderu — ve všech podporovaných jazycích.
 *
 * Upsell blok s CTA je aktivní nabídka, i když balíček není propagován na
 * `/en` ani `/ua`. Cizojazyčnému zákazníkovi se proto nesmí zobrazit česky.
 *
 * Zároveň platí, že přílohy balíčků jsou dnes pouze české, i když hlavní
 * smlouva má cizojazyčné vedení a volitelnou vysvětlující přílohu. Tuhle
 * informaci musí zákazník dostat ještě před vstupem do placeného toku,
 * ne až z obecného právního upozornění v platebním okně.
 *
 * Nájemní builder má vlastní lokalizovanou sadu v `lease-form.ts`; odsud
 * přebírá pouze upozornění na jazyk příloh.
 *
 * Ceny se berou z `THEMATIC_PACKAGE_CONFIG`, aby se text nikdy nerozešel
 * s ceníkem.
 */

import { normalizeLocale, type AppLocale } from '@/lib/locale';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';
import { THEMATIC_PACKAGE_CONFIG, type ThematicPackageKey } from '@/lib/packages';

export type PackageUpsellCopy = {
  badge: string;
  title: string;
  body: string;
  cta: string;
  /**
   * Jazyk příloh balíčku. Prázdné v češtině — tam je čeština očekávaná.
   * V EN/UA se zobrazuje vždy, protože přílohy nejsou přeložené.
   */
  appendixNotice: string;
};

/** Jazyk příloh balíčku — samostatně, aby šel použít i v platebním okně. */
export const PACKAGE_APPENDIX_LANGUAGE_NOTICE: Record<AppLocale, string> = {
  cs: '',
  en: 'Supporting package documents are provided in Czech.',
  ua: 'Супровідні документи пакета надаються чеською мовою.',
};

const BASIC = PRICING_TIER_CONFIG.basic.priceLabel;
const COMPLETE = PRICING_TIER_CONFIG.complete.priceLabel;
const VEHICLE = THEMATIC_PACKAGE_CONFIG.vehicle_sale.priceLabel;
const EMPLOYER = THEMATIC_PACKAGE_CONFIG.employer_start.priceLabel;
const WORK_ORDER = THEMATIC_PACKAGE_CONFIG.work_order.priceLabel;

type LocalizedEntry = Omit<PackageUpsellCopy, 'appendixNotice'>;

/**
 * `work_order` je uvedený jen v češtině — Zakázka Plus je česky-only produkt
 * a v cizojazyčném builderu se nesmí nabízet. `landlord` zde chybí záměrně,
 * nájemní builder má vlastní lokalizovanou sadu.
 */
const COPY: Record<AppLocale, Partial<Record<ThematicPackageKey, LocalizedEntry>>> = {
  cs: {
    vehicle_sale: {
      badge: 'Tematický balíček',
      title: 'Balíček pro prodej vozidla',
      body: `V tomto formuláři volíte mezi samostatným dokumentem za ${BASIC} a širší variantou za ${COMPLETE}. Pokud chcete řešit i předání vozidla, klíčů a dokladů, pokračujte tematickým balíčkem za ${VEHICLE}.`,
      cta: 'Zobrazit balíček →',
    },
    employer_start: {
      badge: 'Nový personální balíček',
      title: 'Zaměstnavatel Start 2026',
      body: `Pracovní smlouva, informace podle § 37 ZP, podklady k home office a vybavení, nástupní checklist a DOCX za ${EMPLOYER}.`,
      cta: 'Zobrazit obsah balíčku →',
    },
    work_order: {
      badge: 'Balíček k zakázce',
      title: 'Zakázka Plus',
      body: `Připravte smlouvu, platební podmínky, vícepráce a předání díla v jednom balíčku za ${WORK_ORDER}.`,
      cta: 'Zobrazit obsah balíčku →',
    },
  },
  en: {
    vehicle_sale: {
      badge: 'Thematic package',
      title: 'Vehicle sale package',
      body: `This form offers a single document for ${BASIC} or an extended version for ${COMPLETE}. If you also need to cover the handover of the vehicle, keys and documents, continue with the thematic package for ${VEHICLE}.`,
      cta: 'View package →',
    },
    employer_start: {
      badge: 'Employer package',
      title: 'Employer Start 2026',
      body: `Employment contract, the information sheet under § 37 of the Labour Code, remote-work and equipment records, an onboarding checklist and DOCX for ${EMPLOYER}.`,
      cta: 'View package contents →',
    },
  },
  ua: {
    vehicle_sale: {
      badge: 'Тематичний пакет',
      title: 'Пакет для продажу автомобіля',
      body: `У цій формі ви обираєте окремий документ за ${BASIC} або розширений варіант за ${COMPLETE}. Якщо потрібно також оформити передачу автомобіля, ключів і документів, продовжуйте з тематичним пакетом за ${VEHICLE}.`,
      cta: 'Переглянути пакет →',
    },
    employer_start: {
      badge: 'Кадровий пакет',
      title: 'Zaměstnavatel Start 2026',
      body: `Трудовий договір, інформація за § 37 Трудового кодексу, документи щодо дистанційної роботи та обладнання, чекліст прийому на роботу і DOCX за ${EMPLOYER}.`,
      cta: 'Переглянути вміст пакета →',
    },
  },
};

/**
 * Znění nabídky balíčku pro daný jazyk.
 *
 * Vrací `null`, pokud se balíček v tomto jazyce nenabízí — pak se upsell
 * blok nesmí vykreslit vůbec.
 */
export function getPackageUpsellCopy(
  key: ThematicPackageKey,
  locale?: string | null,
): PackageUpsellCopy | null {
  const loc = normalizeLocale(locale);
  const entry = COPY[loc][key];
  if (!entry) return null;
  return { ...entry, appendixNotice: PACKAGE_APPENDIX_LANGUAGE_NOTICE[loc] };
}

/** Upozornění na jazyk příloh; prázdné v češtině. */
export function getPackageAppendixNotice(locale?: string | null): string {
  return PACKAGE_APPENDIX_LANGUAGE_NOTICE[normalizeLocale(locale)];
}
