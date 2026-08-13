import type { ContractType } from '@/lib/contracts';
import { normalizeLocale } from '@/lib/locale';
import { parseMoney } from '@/lib/money';
import { normalizePricingTier } from '@/lib/pricing';
import type { ThematicPackageKey } from '@/lib/packages';
import type { MonetizationMode } from '@/lib/monetization-policy';
import type {
  PartnerContext,
  PartnerCustomerType,
  PartnerTransactionCategory,
  PartnerUserRole,
  PartnerValueBand,
} from './types';

const CONTRACT_TYPES = new Set<ContractType>([
  'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda', 'general_sale',
  'employment', 'dpp', 'service', 'sublease', 'power_of_attorney',
  'debt_acknowledgment', 'cooperation',
]);

const NEW_BUILD_TERMS = [
  'novostav', 'nová stavba', 'nova stavba', 'stavba domu', 'rodinného domu',
  'rodinneho domu', 'new build', 'new construction', 'новобуд',
] as const;
const RECONSTRUCTION_TERMS = [
  'rekonstruk', 'renovac', 'přestav', 'prestav', 'oprava', 'výměna', 'vymena',
  'renovation', 'reconstruction', 'реконструк', 'ремонт',
] as const;
const CONSTRUCTION_TERMS = [
  'stavb', 'zednick', 'tesař', 'tesar', 'střech', 'strech',
  'fasád', 'fasad', 'elektroinstal', 'vodoinstal', 'výkop', 'vykop',
  'beton', 'základov', 'zakladov', 'demolic', 'obklad', 'dlaž', 'dlaz',
  'construction', 'building work', 'будів',
] as const;

const AMOUNT_FIELD_BY_CONTRACT: Partial<Record<ContractType, readonly string[]>> = {
  lease: ['rentAmount'],
  car_sale: ['priceAmount'],
  work_contract: ['priceAmount'],
  general_sale: ['priceAmount'],
  employment: ['salary', 'hourlyRate'],
  dpp: ['remuneration', 'hourlyRate'],
  service: ['priceAmount'],
};

const BASE_CATEGORY: Record<ContractType, PartnerTransactionCategory> = {
  lease: 'residential_lease',
  car_sale: 'vehicle_used',
  gift: 'general',
  work_contract: 'business_services',
  loan: 'general',
  nda: 'business_services',
  general_sale: 'general',
  employment: 'employment',
  dpp: 'dpp',
  service: 'business_services',
  sublease: 'residential_lease',
  power_of_attorney: 'general',
  debt_acknowledgment: 'general',
  cooperation: 'business_services',
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

const ALLOWED_ROLES: Partial<Record<ContractType, readonly PartnerUserRole[]>> = {
  car_sale: ['buyer', 'seller', 'unknown'],
  lease: ['tenant', 'landlord', 'unknown'],
  work_contract: ['customer', 'contractor', 'unknown'],
  employment: ['employer', 'employee', 'unknown'],
  dpp: ['employer', 'employee', 'unknown'],
  cooperation: ['client', 'supplier', 'freelancer', 'company', 'unknown'],
};

function resolveRole(
  contractType: ContractType,
  packageKey: ThematicPackageKey | string | null | undefined,
  raw: Record<string, unknown>,
): PartnerUserRole {
  if (packageKey === 'landlord') return 'landlord';
  if (packageKey === 'vehicle_sale') return 'seller';
  if (packageKey === 'employer_start') return 'employer';
  const selected = raw.partnerUserRole;
  const allowed = ALLOWED_ROLES[contractType] ?? ['unknown'];
  if (typeof selected === 'string' && allowed.includes(selected as PartnerUserRole)) {
    return selected as PartnerUserRole;
  }
  return 'unknown';
}

function resolveCustomerType(role: PartnerUserRole): PartnerCustomerType {
  if (['employer', 'landlord', 'contractor', 'supplier', 'freelancer', 'company'].includes(role)) {
    return 'business';
  }
  if (role === 'tenant' || role === 'buyer' || role === 'seller' || role === 'employee') {
    return 'consumer';
  }
  return 'unknown';
}

function resolveCategory(
  contractType: ContractType,
  raw: Record<string, unknown>,
): PartnerTransactionCategory {
  if (contractType === 'cooperation') return 'freelance_services';
  if (contractType !== 'work_contract') return BASE_CATEGORY[contractType];
  const text = [raw.workTitle, raw.workDescription]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLocaleLowerCase('cs-CZ');
  if (NEW_BUILD_TERMS.some((term) => text.includes(term))) return 'construction_new_build';
  if (RECONSTRUCTION_TERMS.some((term) => text.includes(term))) return 'construction_reconstruction';
  if (CONSTRUCTION_TERMS.some((term) => text.includes(term))) return 'construction_other';
  return 'business_services';
}

function resolveValueBand(contractType: ContractType, raw: Record<string, unknown>): PartnerValueBand {
  const fields = AMOUNT_FIELD_BY_CONTRACT[contractType] ?? [];
  const amount = fields.map((field) => parseMoney(raw[field])).find((value) => value !== null) ?? null;
  if (amount === null) return 'unknown';
  if (amount < 50_000) return 'under_50k';
  if (amount < 100_000) return '50k_100k';
  if (amount < 250_000) return '100k_250k';
  if (amount < 500_000) return '250k_500k';
  if (amount < 1_000_000) return '500k_1m';
  if (amount < 2_000_000) return '1m_2m';
  if (amount < 5_000_000) return '2m_5m';
  return '5m_plus';
}

export function isContractType(value: unknown): value is ContractType {
  return typeof value === 'string' && CONTRACT_TYPES.has(value as ContractType);
}

export function buildPartnerContext(input: {
  contractType: unknown;
  documentTier?: unknown;
  locale?: unknown;
  packageKey?: ThematicPackageKey | string | null;
  rawContractData?: unknown;
  monetizationMode?: MonetizationMode;
  paid: boolean;
  completed: boolean;
}): PartnerContext | null {
  if (!isContractType(input.contractType)) return null;
  const raw = asRecord(input.rawContractData);
  const role = resolveRole(input.contractType, input.packageKey, raw);
  const locale = normalizeLocale(typeof input.locale === 'string' ? input.locale : null);

  // Construct a fresh object field by field. Never spread raw checkout data here.
  return {
    contractType: input.contractType,
    documentTier: normalizePricingTier(typeof input.documentTier === 'string' ? input.documentTier : null),
    locale,
    country: 'CZ',
    transactionCategory: resolveCategory(input.contractType, raw),
    userRole: role,
    valueBand: resolveValueBand(input.contractType, raw),
    customerType: resolveCustomerType(role),
    monetizationMode: input.monetizationMode ?? 'paid',
    paid: input.paid === true,
    completed: input.completed === true,
  };
}
