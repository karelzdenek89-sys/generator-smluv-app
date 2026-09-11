import { getArchiveDaysWithAddons, normalizeStoredCheckoutAddons } from '@/lib/checkout-addons';
import { normalizeThematicPackageKeyForContract } from '@/lib/packages';
import type { StoredContractData } from '@/lib/contracts';

export type ArchiveRetentionDraft = {
  /** Uložené drafty ho mají vždy — zapisuje se při vytvoření checkoutu. */
  contractType: StoredContractData['contractType'];
  tier?: string;
  packageKey?: string | null;
  addOns?: unknown;
  payload?: Partial<StoredContractData> & { addOns?: unknown; packageKey?: unknown };
};

export type PaidTier = 'basic' | 'professional' | 'complete';

export function normalizePaidTier(value?: string | null): PaidTier {
  const raw = String(value ?? 'basic').toLowerCase();
  if (raw === 'professional') return 'professional';
  if (raw === 'complete' || raw === 'premium') return 'complete';
  return 'basic';
}

/**
 * Archivní lhůta, kterou zákazník skutečně zaplatil: tier, tematický balíček
 * i add-on `extended_archive` dohromady.
 *
 * Musí ji používat i failsafe ve stahovací routě, který dopisuje `paid`, když
 * Stripe hlásí zaplaceno dřív, než dorazí webhook. Kdyby tam zůstala jen
 * tierová konstanta, objednávka s 90denním archivem by dostala 7 nebo 30 dní —
 * a protože webhook už uložené `expiresAt` respektuje, zkrácení by se nikdy
 * samo neopravilo a zákazník by tiše přišel o archiv, který si zaplatil.
 */
export function resolveArchiveTtlSeconds(
  draft: ArchiveRetentionDraft,
  metadataTier?: string | null,
  metadataPackageKey?: string | null,
): number {
  const tier = normalizePaidTier(metadataTier || draft.tier);
  const contractType = draft.payload?.contractType || draft.contractType;
  const packageKey =
    normalizeThematicPackageKeyForContract(metadataPackageKey, contractType) ??
    normalizeThematicPackageKeyForContract(draft.packageKey, contractType) ??
    normalizeThematicPackageKeyForContract(
      typeof draft.payload?.packageKey === 'string' ? draft.payload.packageKey : null,
      contractType,
    );
  const addOns = normalizeStoredCheckoutAddons(draft.addOns ?? draft.payload?.addOns);
  return (
    getArchiveDaysWithAddons(
      tier === 'professional' ? 'complete' : tier,
      packageKey,
      addOns,
    ) *
    60 *
    60 *
    24
  );
}
