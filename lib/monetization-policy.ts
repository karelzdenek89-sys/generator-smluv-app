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
  /**
   * Vyhodnocený experiment se nemaže — zůstává v registru s `mode: 'paid'`
   * a datem ukončení, aby se stejný kandidát nenavrhl znovu bez znalosti
   * toho, jak dopadl minule.
   */
  retiredOn?: string;
  retiredReason?: string;
};

const PAID_REASON: Record<PartnerLocale, string> = {
  cs: 'Výchozí placený režim; bez aktivního a doloženého experimentu.',
  en: 'Default paid mode; no active, evidence-based experiment applies.',
  ua: 'Стандартний платний режим; активний обґрунтований експеримент не застосовується.',
};

function disabledExperimentReason(locale: PartnerLocale, experimentId: string | null): string {
  if (locale === 'en') return `Experiment ${experimentId} is disabled by the global kill switch.`;
  if (locale === 'ua') return `Експеримент ${experimentId} вимкнено глобальним аварійним перемикачем.`;
  return `Experiment ${experimentId} je vypnut globálním kill switchem.`;
}

const DECLARED_POLICIES: readonly DeclaredMonetizationPolicy[] = [
  {
    contractType: 'dpp',
    locale: 'cs',
    mode: 'paid',
    reason:
      'Experiment gsc_dpp_free_2026_08 ukončen 2026-09-11 bez měřitelného výsledku; ' +
      'výchozí placený režim.',
    experimentId: 'gsc_dpp_free_2026_08',
    variant: 'basic_pdf_free',
    enabledFrom: '2026-08-13',
    source: 'gsc_underperformer',
    retiredOn: '2026-09-11',
    retiredReason:
      'Za 29 dní běhu neposkytl experiment žádná data. Produktové stránky DPP ' +
      '(/dpp, /dohoda-o-provedeni-prace) měly za 169 dní 16 prokliků, tedy ~3 měsíčně — ' +
      'na rozdíl v konverzi je to o dva řády málo. Signál navíc pocházel z blogového ' +
      'článku, ne z produktové stránky, takže nulová cena na něj nemohla působit: ' +
      'CTR článku ve výsledcích vyhledávání cena neovlivňuje. ' +
      'Podrobnosti u GSC_PAGE_SNAPSHOTS.',
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
      reason: declared?.reason ?? PAID_REASON[locale],
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
      reason: disabledExperimentReason(locale, declared.experimentId),
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
