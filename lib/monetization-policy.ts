import type { ContractType } from '@/lib/contracts';
import type { PartnerLocale } from '@/lib/partners/types';

export type MonetizationMode = 'paid' | 'freemium' | 'free_experiment';

export type PublicMonetizationPolicy = {
  contractType: ContractType;
  locale: PartnerLocale;
  mode: MonetizationMode;
  reason: string;
  experimentId: string | null;
  variant: string | null;
  enabledFrom: string | null;
};

type DeclaredMonetizationPolicy = PublicMonetizationPolicy & {
  source: 'gsc_underperformer' | 'commercial_default';
};

const PAID_REASON = 'Výchozí placený režim; bez aktivního a doloženého experimentu.';

const DECLARED_POLICIES: readonly DeclaredMonetizationPolicy[] = [
  {
    contractType: 'dpp',
    locale: 'cs',
    mode: 'free_experiment',
    reason: 'GSC kandidát: vysoké imprese, pozice na první stránce a dlouhodobě slabé CTR.',
    experimentId: 'gsc_dpp_free_2026_08',
    variant: 'basic_pdf_free',
    enabledFrom: '2026-08-13',
    source: 'gsc_underperformer',
  },
];

function flagEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

export function freeExperimentsEnabled(
  env?: { FREE_FUNNEL_EXPERIMENTS_ENABLED?: string },
): boolean {
  return flagEnabled(env?.FREE_FUNNEL_EXPERIMENTS_ENABLED ?? process.env['FREE_FUNNEL_EXPERIMENTS_ENABLED']);
}

export function getMonetizationPolicy(
  contractType: ContractType,
  locale: PartnerLocale,
  env?: { FREE_FUNNEL_EXPERIMENTS_ENABLED?: string },
): PublicMonetizationPolicy {
  const declared = DECLARED_POLICIES.find(
    (policy) => policy.contractType === contractType && policy.locale === locale,
  );

  if (!declared || declared.mode === 'paid') {
    return {
      contractType,
      locale,
      mode: 'paid',
      reason: declared?.reason ?? PAID_REASON,
      experimentId: null,
      variant: null,
      enabledFrom: null,
    };
  }

  if (!freeExperimentsEnabled(env)) {
    return {
      contractType,
      locale,
      mode: 'paid',
      reason: `Experiment ${declared.experimentId} je vypnut globálním kill switchem.`,
      experimentId: declared.experimentId,
      variant: declared.variant,
      enabledFrom: declared.enabledFrom,
    };
  }

  return {
    contractType,
    locale,
    mode: declared.mode,
    reason: declared.reason,
    experimentId: declared.experimentId,
    variant: declared.variant,
    enabledFrom: declared.enabledFrom,
  };
}

export function isFreeBasicPolicy(policy: PublicMonetizationPolicy): boolean {
  return policy.mode === 'free_experiment';
}

export function getDeclaredMonetizationPolicies(): readonly DeclaredMonetizationPolicy[] {
  return DECLARED_POLICIES;
}
