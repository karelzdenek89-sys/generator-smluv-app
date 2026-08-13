import type { ContractType } from '@/lib/contracts';

export type PartnerAttribution = {
  partnerClickId: string;
  offerId: string;
  partnerId: string;
  sourceDocumentType: ContractType;
  placement: 'success' | 'download';
  createdAt: string;
  experimentId?: string;
  variant?: string;
};

export function createPartnerClickId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
}
