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
 * Konkrétní cena se ukazuje v souhrnu objednávky před platbou.
 */

import { normalizeLocale, type AppLocale } from '@/lib/locale';
import type { ThematicPackageKey } from '@/lib/packages';

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

export type PackageBuilderFlowCopy = {
  priceHeading: string;
  backToStandalone: string;
  selectedProductLabel?: string;
  selectedProductBody?: string;
  relatedPrompt?: string;
  relatedPackageLabel?: string;
  relatedGuidePrompt?: string;
  relatedGuideLabel?: string;
};

/** Jazyk příloh balíčku — samostatně, aby šel použít i v platebním okně. */
export const PACKAGE_APPENDIX_LANGUAGE_NOTICE: Record<AppLocale, string> = {
  cs: '',
  en: 'Supporting package documents are provided in Czech.',
  ua: 'Супровідні документи пакета надаються чеською мовою.',
};


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
      body: 'V tomto formuláři volíte mezi základním a rozšířeným dokumentem. Pokud chcete řešit i předání vozidla, klíčů a dokladů, pokračujte tematickým balíčkem. Přesnou cenu uvidíte v souhrnu před platbou.',
      cta: 'Zobrazit balíček →',
    },
    employer_start: {
      badge: 'Nový personální balíček',
      title: 'Zaměstnavatel Start 2026',
      body: 'Pracovní smlouva, informace podle § 37 ZP, podklady k home office a vybavení, nástupní checklist a DOCX. Přesnou cenu uvidíte v souhrnu před platbou.',
      cta: 'Zobrazit obsah balíčku →',
    },
    work_order: {
      badge: 'Balíček k zakázce',
      title: 'Zakázka Plus',
      body: 'Připravte smlouvu, platební podmínky, vícepráce a předání díla v jednom balíčku. Přesnou cenu uvidíte v souhrnu před platbou.',
      cta: 'Zobrazit obsah balíčku →',
    },
  },
  en: {
    vehicle_sale: {
      badge: 'Thematic package',
      title: 'Vehicle sale package',
      body: 'Choose a basic or extended document. If you also need to cover the handover of the vehicle, keys and documents, continue with the thematic package. Review the exact price before payment.',
      cta: 'View package →',
    },
    employer_start: {
      badge: 'Employer package',
      title: 'Employer Start 2026',
      body: 'Employment contract, the information sheet under § 37 of the Labour Code, remote-work and equipment records, an onboarding checklist and DOCX. Review the exact price before payment.',
      cta: 'View package contents →',
    },
  },
  ua: {
    vehicle_sale: {
      badge: 'Тематичний пакет',
      title: 'Пакет для продажу автомобіля',
      body: 'Оберіть базовий або розширений документ. Для передачі автомобіля, ключів і документів скористайтеся тематичним пакетом. Точну ціну ви побачите перед оплатою.',
      cta: 'Переглянути пакет →',
    },
    employer_start: {
      badge: 'Кадровий пакет',
      title: 'Zaměstnavatel Start 2026',
      body: 'Трудовий договір, інформація за § 37 Трудового кодексу, документи щодо дистанційної роботи та обладнання, чекліст прийому на роботу і DOCX. Точну ціну ви побачите перед оплатою.',
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

const FLOW_COPY: Record<
  AppLocale,
  Partial<Record<ThematicPackageKey, PackageBuilderFlowCopy>>
> = {
  cs: {
    vehicle_sale: {
      priceHeading: 'Cena balíčku',
      backToStandalone: 'Řešíte jen samotnou kupní smlouvu? Vraťte se na samostatný dokument.',
      selectedProductLabel: 'Zvolený produkt',
      selectedProductBody:
        'Součástí výstupu bude kupní smlouva na vozidlo v komplexní variantě, předávací protokol, potvrzení o převzetí vozidla, klíčů a dokladů a praktické podklady k převodu.',
      relatedPrompt: 'Řešíte vedle samotné smlouvy i fyzické předání vozidla, klíčů a dokladů?',
      relatedPackageLabel: 'Zobrazit Balíček pro prodej vozidla',
      relatedGuidePrompt: 'Pokud si chcete nejprve ujasnit, která cesta je pro vás vhodná, otevřete',
      relatedGuideLabel: 'podklady pro prodej vozidla',
    },
    employer_start: {
      priceHeading: 'Cena balíčku',
      backToStandalone: 'Potřebujete jen pracovní smlouvu? Zvolte samostatný dokument.',
    },
  },
  en: {
    vehicle_sale: {
      priceHeading: 'Package price',
      backToStandalone: 'Only need the purchase agreement? Return to the standalone document.',
      selectedProductLabel: 'Selected product',
      selectedProductBody:
        'The output includes the extended vehicle purchase agreement, a handover report, confirmation of the vehicle, keys and documents received, and practical transfer materials.',
      relatedPrompt: 'Do you also need to record the physical handover of the vehicle, keys and documents?',
      relatedPackageLabel: 'View the vehicle sale package',
      relatedGuidePrompt: 'If you first want to compare the available paths, open',
      relatedGuideLabel: 'vehicle sale documents overview',
    },
    employer_start: {
      priceHeading: 'Package price',
      backToStandalone: 'Only need the employment contract? Choose the standalone document.',
    },
  },
  ua: {
    vehicle_sale: {
      priceHeading: 'Ціна пакета',
      backToStandalone: 'Потрібен лише договір купівлі-продажу? Поверніться до окремого документа.',
      selectedProductLabel: 'Обраний продукт',
      selectedProductBody:
        'Результат містить розширений договір купівлі-продажу авто, протокол передачі, підтвердження отримання автомобіля, ключів і документів та практичні матеріали для переоформлення.',
      relatedPrompt: 'Потрібно також зафіксувати передачу автомобіля, ключів і документів?',
      relatedPackageLabel: 'Переглянути пакет для продажу авто',
      relatedGuidePrompt: 'Щоб спочатку порівняти доступні варіанти, відкрийте',
      relatedGuideLabel: 'огляд документів для продажу авто',
    },
    employer_start: {
      priceHeading: 'Ціна пакета',
      backToStandalone: 'Потрібен лише трудовий договір? Оберіть окремий документ.',
    },
  },
};

export function getPackageBuilderFlowCopy(
  key: ThematicPackageKey,
  locale?: string | null,
): PackageBuilderFlowCopy | null {
  return FLOW_COPY[normalizeLocale(locale)][key] ?? null;
}

/** Upozornění na jazyk příloh; prázdné v češtině. */
export function getPackageAppendixNotice(locale?: string | null): string {
  return PACKAGE_APPENDIX_LANGUAGE_NOTICE[normalizeLocale(locale)];
}
