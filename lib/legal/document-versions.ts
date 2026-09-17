import type { ContractType } from '@/lib/contracts';
import { LEGAL_REVIEWED_AT, LEGAL_VERSION } from '@/lib/legal-constants-2026';
import { getLegalChangesForContract, type LegalChange } from './radar';

/**
 * Verzování právních šablon.
 *
 * Každý typ dokumentu má verzi, období platnosti a datum ověření. Dnes všechny
 * šablony sdílejí verzi z lib/legal-constants-2026.ts (jediné místo, kde se
 * mění právní hodnoty). Registr umožňuje verzi posunout jen pro jeden typ,
 * až to bude potřeba, aniž by se měnil renderer.
 *
 * Lifecycle obsahu (docs/LEGAL_RADAR.md): draft → review → published →
 * needs_review → updated / archived. Automatizace smí označit `needs_review`,
 * nikdy sama nepřepíše publikovanou šablonu.
 */

export type DocumentLegalStatus = 'published' | 'needs_review';

export type DocumentLegalVersion = {
  contractType: ContractType;
  version: string;
  validFrom: string;
  validTo: string | null;
  verifiedAt: string;
  status: DocumentLegalStatus;
  /** Legislativní změny z radaru, které se dokumentu týkají. */
  relatedChanges: readonly LegalChange[];
};

const DOCUMENT_TYPES: readonly ContractType[] = [
  'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda', 'general_sale',
  'employment', 'dpp', 'service', 'sublease', 'power_of_attorney', 'debt_acknowledgment', 'cooperation',
];

/** Po kolika dnech od ověření se šablona označí k revizi. */
export const DOCUMENT_REVIEW_INTERVAL_DAYS = 180;

const VALID_FROM_BY_VERSION: Record<string, string> = {
  '2026.2': '2026-07-15',
};

export function getDocumentLegalVersion(contractType: ContractType, now: Date = new Date()): DocumentLegalVersion {
  const verifiedAt = LEGAL_REVIEWED_AT;
  const ageDays = (now.getTime() - Date.parse(verifiedAt)) / 86_400_000;
  const relatedChanges = getLegalChangesForContract(contractType);
  // Šablona potřebuje revizi, když je stará, nebo když se jí týká změna
  // ověřená po posledním ověření šablony a už účinná.
  const newerEffectiveChange = relatedChanges.some(
    (change) => change.status === 'in_force' && change.effectiveFrom !== null && change.effectiveFrom > verifiedAt,
  );
  return {
    contractType,
    version: LEGAL_VERSION,
    validFrom: VALID_FROM_BY_VERSION[LEGAL_VERSION] ?? verifiedAt,
    validTo: null,
    verifiedAt,
    status: ageDays > DOCUMENT_REVIEW_INTERVAL_DAYS || newerEffectiveChange ? 'needs_review' : 'published',
    relatedChanges,
  };
}

export function getAllDocumentLegalVersions(now: Date = new Date()): DocumentLegalVersion[] {
  return DOCUMENT_TYPES.map((contractType) => getDocumentLegalVersion(contractType, now));
}
