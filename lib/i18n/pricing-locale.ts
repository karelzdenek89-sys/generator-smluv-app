import { normalizeLocale } from '@/lib/locale';
import {
  COMPLETE_ARCHIVE_DAYS,
  PRICING_TIER_CONFIG,
  PRICING_UPSELL_COPY,
  type PricingTier,
} from '@/lib/pricing';
import type { ThematicPackageKey } from '@/lib/packages';
import { getTierIncludedItems } from '@/lib/tier-copy';

export type LocalizedPricingTier = {
  title: string;
  shortDescription: string;
  badge?: string;
};

export type LocalizedCheckoutCopy = {
  includedHeading: string;
  packageIncludesHeading: string;
  variantIncludesHeading: string;
  basicItems: readonly string[];
  completeExtraItems: readonly string[];
  upsellTitle: string;
  upsellDescription: string;
  upsellCta: string;
  purchaseBasic: string;
  purchaseComplete: string;
};

const CHECKOUT_BASE_EN = [
  'PDF document assembled from your inputs',
  'Clear structure for review and signature',
  'Download immediately after verified payment',
] as const;

const CHECKOUT_BASE_UK = [
  'PDF-документ зі ваших даних',
  'Зрозуміла структура для перевірки та підпису',
  'Завантаження одразу після підтвердженої оплати',
] as const;

const LEASE_COMPLETE_EXTRA_EN = [
  'Extended clauses on service of documents, penalties and party obligations',
  'Annex with signing instructions and apartment handover checklist',
  `Download link available for ${COMPLETE_ARCHIVE_DAYS} days`,
] as const;

const LEASE_COMPLETE_EXTRA_UK = [
  'Розширені умови про вручення документів, санкції та обов’язки сторін',
  'Додаток з інструкціями для підпису та чеклістом передачі квартири',
  `Посилання для завантаження доступне ${COMPLETE_ARCHIVE_DAYS} днів`,
] as const;

const PACKAGE_EN: Record<
  ThematicPackageKey,
  { title: string; checkoutDescription: string; includedOutputs: readonly string[] }
> = {
  landlord: {
    title: 'Landlord package',
    checkoutDescription:
      'Extended Czech lease with related handover and deposit documents for a standard apartment or house rental.',
    includedOutputs: [
      'Extended Czech rental agreement',
      'Handover protocol annex',
      'Deposit receipt confirmation',
      'Practical signing and handover notes',
      `Download link available for ${COMPLETE_ARCHIVE_DAYS} days`,
    ],
  },
  vehicle_sale: {
    title: 'Vehicle sale package',
    checkoutDescription:
      'Extended Czech vehicle purchase agreement with handover and transfer documents.',
    includedOutputs: [
      'Extended Czech vehicle purchase agreement',
      'Vehicle handover protocol',
      'Keys and documents receipt confirmation',
      'Practical transfer and handover notes',
      `Download link available for ${COMPLETE_ARCHIVE_DAYS} days`,
    ],
  },
  employer_start: {
    title: 'Employer Start 2026',
    checkoutDescription:
      'Czech employment onboarding pack with the extended employment contract, statutory information sheet, related HR documents and DOCX.',
    includedOutputs: [
      'Extended Czech employment contract',
      'Employment information sheet under § 37 Labour Code',
      'Remote-work agreement when home office is selected',
      'Work-equipment handover record',
      'Employer onboarding checklist',
      'PDF and editable DOCX version',
      `Download link available for ${COMPLETE_ARCHIVE_DAYS} days`,
    ],
  },
};

function leaseCompleteExtraForLocale(loc: ReturnType<typeof normalizeLocale>) {
  if (loc === 'ua') return LEASE_COMPLETE_EXTRA_UK;
  return LEASE_COMPLETE_EXTRA_EN;
}

export function getLocalizedPricingTier(
  tier: PricingTier,
  locale?: string | null,
): LocalizedPricingTier {
  const loc = normalizeLocale(locale);
  if (loc === 'cs') {
    const cfg = PRICING_TIER_CONFIG[tier];
    return { title: cfg.title, shortDescription: cfg.shortDescription, badge: cfg.badge };
  }
  if (loc === 'ua') {
    if (tier === 'complete') {
      return {
        title: 'Розширений документ',
        shortDescription: 'Коли потрібні ширші умови та сильніший захист.',
        badge: 'Рекомендовано',
      };
    }
    return {
      title: 'Базовий документ',
      shortDescription: 'Для типових, звичайних ситуацій.',
    };
  }
  if (tier === 'complete') {
    return {
      title: 'Extended document',
      shortDescription: 'When you want broader clauses and stronger protection.',
      badge: 'Recommended',
    };
  }
  return {
    title: 'Basic document',
    shortDescription: 'For typical, straightforward situations.',
  };
}

export function getLocalizedCheckoutCopy(locale?: string | null): LocalizedCheckoutCopy {
  const loc = normalizeLocale(locale);
  if (loc === 'cs') {
    return {
      includedHeading: 'Součástí je',
      packageIncludesHeading: 'Součástí balíčku je',
      variantIncludesHeading: 'Součástí varianty je',
      basicItems: getTierIncludedItems('lease', 'basic'),
      completeExtraItems: [],
      upsellTitle: PRICING_UPSELL_COPY.title,
      upsellDescription: PRICING_UPSELL_COPY.description,
      upsellCta: PRICING_UPSELL_COPY.cta,
      purchaseBasic: PRICING_TIER_CONFIG.basic.title,
      purchaseComplete: PRICING_TIER_CONFIG.complete.title,
    };
  }
  if (loc === 'ua') {
    return {
      includedHeading: 'Включено',
      packageIncludesHeading: 'Пакет включає',
      variantIncludesHeading: 'У цьому рівні',
      basicItems: CHECKOUT_BASE_UK,
      completeExtraItems: LEASE_COMPLETE_EXTRA_UK,
      upsellTitle: 'Потрібен сильніший захист?',
      upsellDescription:
        'Розширений рівень додає детальніші умови та практичні додатки для чутливіших ситуацій.',
      upsellCta: 'Перейти на розширений рівень',
      purchaseBasic: 'Базовий документ',
      purchaseComplete: 'Розширений документ',
    };
  }
  return {
    includedHeading: 'Included',
    packageIncludesHeading: 'Package includes',
    variantIncludesHeading: 'Included in this level',
    basicItems: CHECKOUT_BASE_EN,
    completeExtraItems: LEASE_COMPLETE_EXTRA_EN,
    upsellTitle: 'Need broader protection?',
    upsellDescription:
      'The extended level adds more detailed clauses and practical annexes for sensitive situations.',
    upsellCta: 'Switch to extended level',
    purchaseBasic: 'Basic document',
    purchaseComplete: 'Extended document',
  };
}

export function getLocalizedIncludedItems(
  contractType: string | null | undefined,
  tier: PricingTier,
  packageKey?: string | null,
  locale?: string | null,
): readonly string[] {
  const loc = normalizeLocale(locale);
  const pkg =
    packageKey === 'landlord' || packageKey === 'vehicle_sale' || packageKey === 'employer_start'
      ? packageKey
      : null;
  if (loc !== 'cs' && pkg) {
    return PACKAGE_EN[pkg].includedOutputs;
  }
  if (loc !== 'cs') {
    const copy = getLocalizedCheckoutCopy(loc);
    const leaseExtra = leaseCompleteExtraForLocale(loc);
    if (tier === 'complete' && contractType === 'lease') {
      return [...copy.basicItems, ...leaseExtra];
    }
    if (tier === 'complete') {
      return [...copy.basicItems, ...copy.completeExtraItems];
    }
    return copy.basicItems;
  }
  return getTierIncludedItems(contractType, tier);
}

export function getLocalizedPackagePresentation(
  packageKey: ThematicPackageKey,
  locale?: string | null,
): { title: string; checkoutDescription: string } | null {
  const loc = normalizeLocale(locale);
  if (loc === 'cs') return null;
  const row = PACKAGE_EN[packageKey];
  return { title: row.title, checkoutDescription: row.checkoutDescription };
}

/** Locales with fully localized lease form + checkout copy (EN and Ukrainian). */
export function isExpatProductLocale(locale?: string | null): boolean {
  const loc = normalizeLocale(locale);
  return loc === 'en' || loc === 'ua';
}

/** @deprecated Use isExpatProductLocale */
export function isEnglishProductLocale(locale?: string | null): boolean {
  return isExpatProductLocale(locale);
}
