import type { ContractType } from '@/lib/contracts';
import type { PricingTier } from '@/lib/pricing';
import type { MonetizationMode } from '@/lib/monetization-policy';

export const PARTNER_CONTEXT_KEYS = [
  'contractType',
  'documentTier',
  'locale',
  'country',
  'transactionCategory',
  'userRole',
  'valueBand',
  'customerType',
  'monetizationMode',
  'paid',
  'completed',
] as const;

export type PartnerLocale = 'cs' | 'en' | 'ua';
export type PartnerUserRole =
  | 'landlord'
  | 'tenant'
  | 'seller'
  | 'buyer'
  | 'employer'
  | 'employee'
  | 'customer'
  | 'client'
  | 'contractor'
  | 'supplier'
  | 'freelancer'
  | 'company'
  | 'unknown';
export type PartnerTransactionCategory =
  | 'residential_lease'
  | 'commercial_lease'
  | 'vehicle_used'
  | 'vehicle_other'
  | 'employment'
  | 'dpp'
  | 'construction_new_build'
  | 'construction_reconstruction'
  | 'construction_other'
  | 'business_services'
  | 'freelance_services'
  | 'general'
  | 'unknown';
export type PartnerValueBand =
  | 'unknown'
  | 'under_50k'
  | '50k_100k'
  | '100k_250k'
  | '250k_500k'
  | '500k_1m'
  | '1m_2m'
  | '2m_5m'
  | '5m_plus';
export type PartnerCustomerType = 'consumer' | 'business' | 'unknown';

/**
 * Privacy-safe DTO used by partner eligibility. It is deliberately categorical:
 * no names, contact details, identifiers, free text, exact prices or session IDs.
 */
export type PartnerContext = {
  contractType: ContractType;
  documentTier: PricingTier;
  locale: PartnerLocale;
  country: 'CZ';
  transactionCategory: PartnerTransactionCategory;
  userRole: PartnerUserRole;
  valueBand: PartnerValueBand;
  customerType: PartnerCustomerType;
  monetizationMode: MonetizationMode;
  paid: boolean;
  completed: boolean;
};

export type PartnerOfferCategory =
  | 'electronic_signature'
  | 'vehicle_history'
  | 'insurance'
  | 'landlord_services'
  | 'construction_planning'
  | 'invoicing'
  | 'hr_payroll';

export type PublicPartnerOffer = {
  id: string;
  partnerId: string;
  provider: string;
  category: PartnerOfferCategory;
  title: string;
  description: string;
  cta: string;
  disclosure: string;
  href: string;
  isAffiliate: boolean;
  destination: 'partner' | 'cross_sell';
  experimentId?: string;
  variant?: string;
};
