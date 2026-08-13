import type { PartnerContext } from './types';

export type ProviderCapability = 'affiliate' | 'api';

export type ElectronicSignatureProvider = {
  id: string;
  capabilities: readonly ProviderCapability[];
  isConfigured: () => boolean;
  createSigningRequest: (input: {
    documentId: string;
    context: PartnerContext;
    idempotencyKey: string;
  }) => Promise<{ externalRequestId: string; signingUrl?: string }>;
};

export type VehicleHistoryProvider = {
  id: string;
  capabilities: readonly ProviderCapability[];
  isConfigured: () => boolean;
  createVerificationRequest: (input: {
    /** VIN is accepted only in a dedicated explicit flow, never from PartnerContext. */
    vin: string;
    consentVersion: string;
    idempotencyKey: string;
  }) => Promise<{ externalRequestId: string; resultUrl?: string }>;
};

/** No provider adapter is active until reviewed API documentation and credentials exist. */
export const ELECTRONIC_SIGNATURE_PROVIDERS: readonly ElectronicSignatureProvider[] = [];
export const VEHICLE_HISTORY_PROVIDERS: readonly VehicleHistoryProvider[] = [];
