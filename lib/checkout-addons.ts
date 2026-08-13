import type { ContractType } from './contracts';
import { getEffectiveArchiveDays, packageIncludesDocx } from './packages';
import type { PricingTier } from './pricing';
import { normalizeLocale, type AppLocale } from './locale';

export type CheckoutAddonKey =
  | 'docx'
  | 'signing_checklist'
  | 'handover_protocol'
  | 'extended_archive'
  | 'bilingual_annex';

export type AnnexLanguage = 'en' | 'ua';

export type CheckoutAddonConfig = {
  key: CheckoutAddonKey;
  title: string;
  priceCzk: number;
  priceLabel: string;
  description: string;
  includedItem: string;
  contracts?: readonly ContractType[];
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
    title: 'Archiv 90 dní',
    priceCzk: 39,
    priceLabel: '+39 Kč',
    description: 'Odkaz ke stažení zůstane dostupný 90 dní od zaplacení.',
    includedItem: 'Archiv a dostupnost odkazu ke stažení 90 dní',
  },
  bilingual_annex: {
    key: 'bilingual_annex',
    title: 'Dvojjazyčná příloha',
    priceCzk: 99,
    priceLabel: '+99 Kč',
    description: 'Vysvětlující cizojazyčná příloha k českému dokumentu pro snazší kontrolu.',
    includedItem: 'Dvojjazyčná vysvětlující příloha k českému dokumentu',
    contracts: BILINGUAL_ANNEX_CONTRACTS,
  },
};

export const CHECKOUT_ADDONS = Object.values(CHECKOUT_ADDON_CONFIG);

const LOCALIZED_ADDON_COPY: Record<Exclude<AppLocale, 'cs'>, Record<CheckoutAddonKey, Pick<CheckoutAddonConfig, 'title' | 'description' | 'includedItem'>>> = {
  en: {
    docx: { title: 'Editable DOCX version', description: 'Adds an editable file for later changes in a word processor.', includedItem: 'Editable DOCX version of the document' },
    signing_checklist: { title: 'Pre-signing checklist', description: 'A practical checklist for review before printing, signing and handover.', includedItem: 'Checklist before signing and using the document' },
    handover_protocol: { title: 'Handover record', description: 'A related record for handing over an apartment or vehicle, including condition and signatures.', includedItem: 'Handover record as an annex to the document' },
    extended_archive: { title: '90-day archive', description: 'The download link remains available for 90 days after payment.', includedItem: 'Archive and download-link availability for 90 days' },
    bilingual_annex: { title: 'Bilingual annex', description: 'An explanatory foreign-language annex to the Czech document for easier review.', includedItem: 'Bilingual explanatory annex to the Czech document' },
  },
  ua: {
    docx: { title: 'Редагована версія DOCX', description: 'Додає редагований файл для подальших змін у текстовому редакторі.', includedItem: 'Редагована версія документа DOCX' },
    signing_checklist: { title: 'Чекліст перед підписанням', description: 'Практичний список для перевірки перед друком, підписанням і переданням.', includedItem: 'Чекліст перед підписанням і використанням документа' },
    handover_protocol: { title: 'Протокол передання', description: 'Пов’язаний протокол передання квартири або автомобіля із зазначенням стану та підписами.', includedItem: 'Протокол передання як додаток до документа' },
    extended_archive: { title: 'Архів на 90 днів', description: 'Посилання для завантаження залишається доступним 90 днів після оплати.', includedItem: 'Архів і доступність посилання для завантаження протягом 90 днів' },
    bilingual_annex: { title: 'Двомовний додаток', description: 'Пояснювальний іншомовний додаток до чеського документа для зручнішої перевірки.', includedItem: 'Двомовний пояснювальний додаток до чеського документа' },
  },
};

function localizeAddon(addon: CheckoutAddonConfig, locale?: string | null): CheckoutAddonConfig {
  const normalized = normalizeLocale(locale);
  if (normalized === 'cs') return addon;
  return { ...addon, ...LOCALIZED_ADDON_COPY[normalized][addon.key] };
}

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
  const archiveDays = getEffectiveArchiveDays(tier, packageKey);
  const isPackage = Boolean(packageKey);

  return CHECKOUT_ADDONS.filter((addon) => {
    if (addon.contracts && !addon.contracts.includes(normalizedContract)) return false;
    if (addon.key === 'docx' && packageIncludesDocx(packageKey)) return false;
    if (addon.unavailableWhenComplete && (tier === 'complete' || isPackage)) return false;
    if (addon.key === 'handover_protocol' && isPackage) return false;
    if (addon.key === 'extended_archive' && archiveDays >= 90) return false;
    return true;
  }).map((addon) => localizeAddon(addon, locale));
}

export function normalizeAnnexLanguage(value: unknown): AnnexLanguage | null {
  if (value === 'en') return 'en';
  if (value === 'ua' || value === 'uk' || value === 'ukr') return 'ua';
  return null;
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

export function getCheckoutAddonIncludedItems(addOns: readonly CheckoutAddonKey[], locale?: string | null): string[] {
  return addOns.map((key) => localizeAddon(CHECKOUT_ADDON_CONFIG[key], locale).includedItem);
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
