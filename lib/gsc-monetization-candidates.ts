export type GscCandidateClassification =
  | 'free_experiment_candidate'
  | 'paid_candidate'
  | 'low_data';

export type GscPageSnapshot = {
  page: string;
  impressions: number;
  clicks: number;
  ctrPercent: number;
  averagePosition: number;
  source: string;
  observedAt: string | null;
};

/**
 * The only page-level GSC evidence supplied for this work. It is deliberately
 * labelled as a snapshot, not as a live Search Console integration.
 */
export const GSC_PAGE_SNAPSHOTS: readonly GscPageSnapshot[] = [
  {
    page: '/blog/dpp-dohoda-provedeni-prace',
    impressions: 2497,
    clicks: 5,
    ctrPercent: 0.2,
    averagePosition: 9.7,
    source: 'user-provided GSC snapshot',
    observedAt: null,
  },
];

export function classifyGscSnapshot(snapshot: GscPageSnapshot): GscCandidateClassification {
  if (snapshot.impressions < 300) return 'low_data';
  const firstPageOpportunity = snapshot.averagePosition > 0 && snapshot.averagePosition <= 15;
  const weakCtr = snapshot.ctrPercent < 1;
  const weakClicks = snapshot.clicks <= Math.max(10, Math.ceil(snapshot.impressions * 0.01));
  return firstPageOpportunity && weakCtr && weakClicks
    ? 'free_experiment_candidate'
    : 'paid_candidate';
}
