import type { ContractType } from './contracts';
import { getEffectiveArchiveDays } from './packages';
import type { PricingTier } from './pricing';

export type CheckoutAddonKey =
  | 'docx'
  | 'signing_checklist'
  | 'handover_protocol'
  | 'extended_archive'
  | 'bilingual_annex';

export type CheckoutAddonConfig = {
  key: CheckoutAddonKey;
  title: string;
  priceCzk: number;
  priceLabel: string;
  description: string;
  includedItem: string;
  contracts?: readonly ContractType[];
  localeMode?: 'any' | 'foreign';
  unavailableWhenComplete?: boolean;
};

const HANDOVER_CONTRACTS: readonly ContractType[] = ['lease', 'car_sale'];
const BILINGUAL_ANNEX_CONTRACTS: readonly ContractType[] = [
  'lease',
  'car_sale',
  'employment',
  'dpp',
  'sublease',
  'power_of_attorney',
];

export const CHECKOUT_ADDON_CONFIG: Record<CheckoutAddonKey, CheckoutAddonConfig> = {
  docx: {
    key: 'docx',
    title: 'Editovatelná DOCX verze',
    priceCzk: 49,
    priceLabel: '+49 Kč',
    description: 'K PDF přidá editovatelný soubor pro pozdější úpravy v textovém editoru.',
    includedItem: 'Editovatelná DOCX verze dokumentu',
  },
  signing_checklist: {
    key: 'signing_checklist',
    title: 'Checklist před podpisem',
    priceCzk: 49,
    priceLabel: '+49 Kč',
    description: 'Praktický kontrolní seznam, co projít před tiskem, podpisem a předáním.',
    includedItem: 'Checklist před podpisem a použitím dokumentu',
    unavailableWhenComplete: true,
  },
  handover_protocol: {
    key: 'handover_protocol',
    title: 'Předávací protokol',
    priceCzk: 79,
    priceLabel: '+79 Kč',
    description: 'Navazující protokol pro předání bytu nebo vozidla se stavem a podpisy.',
    includedItem: 'Předávací protokol jako příloha k dokumentu',
    contracts: HANDOVER_CONTRACTS,
  },
  extended_archive: {
    key: 'extended_archive',
    title: 'Dostupnost 90 dní',
    priceCzk: 39,
    priceLabel: '+39 Kč',
    description: 'Odkaz ke stažení zůstane dostupný 90 dní od zaplacení.',
    includedItem: 'Dostupnost odkazu ke stažení 90 dní',
  },
  bilingual_annex: {
    key: 'bilingual_annex',
    title: 'Dvojjazyčná příloha',
    priceCzk: 99,
    priceLabel: '+99 Kč',
    description: 'Vysvětlující cizojazyčná příloha k českému dokumentu pro snazší kontrolu.',
    includedItem: 'Dvojjazyčná vysvětlující příloha k českému dokumentu',
    contracts: BILINGUAL_ANNEX_CONTRACTS,
    localeMode: 'foreign',
  },
};

export const CHECKOUT_ADDONS = Object.values(CHECKOUT_ADDON_CONFIG);

export function isCheckoutAddonKey(value: unknown): value is CheckoutAddonKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(CHECKOUT_ADDON_CONFIG, value);
}

export function normalizeStoredCheckoutAddons(value: unknown): CheckoutAddonKey[] {
  if (!Array.isArray(value)) return [];

  const selected: CheckoutAddonKey[] = [];
  for (const item of value) {
    if (!isCheckoutAddonKey(item)) continue;
    if (selected.includes(item)) continue;
    selected.push(item);
  }

  return selected;
}

export function hasCheckoutAddon(
  data: Record<string, unknown>,
  key: CheckoutAddonKey,
): boolean {
  const raw = data.addOns ?? data.addons;
  return normalizeStoredCheckoutAddons(raw).includes(key);
}


export function getAvailableCheckoutAddons(
  contractType: string | null | undefined,
  tier: PricingTier,
  packageKey?: string | null,
  locale?: string | null,
): readonly CheckoutAddonConfig[] {
  const normalizedContract = String(contractType ?? '') as ContractType;
  const normalizedLocale = String(locale ?? 'cs').toLowerCase();
  const archiveDays = getEffectiveArchiveDays(tier, packageKey);
  const isPackage = Boolean(packageKey);

  return CHECKOUT_ADDONS.filter((addon) => {
    if (addon.contracts && !addon.contracts.includes(normalizedContract)) return false;
    if (addon.localeMode === 'foreign' && normalizedLocale === 'cs') return false;
    if (addon.unavailableWhenComplete && (tier === 'complete' || isPackage)) return false;
    if (addon.key === 'handover_protocol' && isPackage) return false;
    if (addon.key === 'extended_archive' && archiveDays >= 90) return false;
    return true;
  });
}

export function normalizeCheckoutAddons(
  value: unknown,
  contractType: string | null | undefined,
  tier: PricingTier,
  packageKey?: string | null,
  locale?: string | null,
): CheckoutAddonKey[] {
  if (!Array.isArray(value)) return [];

  const available = new Set(
    getAvailableCheckoutAddons(contractType, tier, packageKey, locale).map((addon) => addon.key),
  );
  const selected: CheckoutAddonKey[] = [];

  for (const item of value) {
    if (typeof item !== 'string') continue;
    if (!available.has(item as CheckoutAddonKey)) continue;
    if (selected.includes(item as CheckoutAddonKey)) continue;
    selected.push(item as CheckoutAddonKey);
  }

  return selected;
}

export function getCheckoutAddonsTotalCzk(addOns: readonly CheckoutAddonKey[]): number {
  return addOns.reduce((sum, key) => sum + CHECKOUT_ADDON_CONFIG[key].priceCzk, 0);
}

export function getCheckoutAddonIncludedItems(addOns: readonly CheckoutAddonKey[]): string[] {
  return addOns.map((key) => CHECKOUT_ADDON_CONFIG[key].includedItem);
}

export function getArchiveDaysWithAddons(
  tier: PricingTier,
  packageKey?: string | null,
  addOns: readonly CheckoutAddonKey[] = [],
): number {
  if (addOns.includes('extended_archive')) return 90;
  return getEffectiveArchiveDays(tier, packageKey);
}

export function getCheckoutAddonMetadata(addOns: readonly CheckoutAddonKey[]): string {
  return addOns.join(',');
}
