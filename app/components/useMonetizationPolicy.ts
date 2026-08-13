'use client';

import { useEffect, useState } from 'react';
import type { ContractType } from '@/lib/contracts';
import type { PartnerLocale } from '@/lib/partners/types';
import type { PublicMonetizationPolicy } from '@/lib/monetization-policy';

export function useMonetizationPolicy(contractType: ContractType, locale: PartnerLocale) {
  const [policy, setPolicy] = useState<PublicMonetizationPolicy | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(
      `/api/monetization/policy?contractType=${encodeURIComponent(contractType)}&locale=${encodeURIComponent(locale)}`,
      { cache: 'no-store', signal: controller.signal },
    )
      .then((response) => response.ok ? response.json() : null)
      .then((value: PublicMonetizationPolicy | null) => setPolicy(value))
      .catch(() => {
        // Paid remains the UI fallback when the policy endpoint is unavailable.
      });
    return () => controller.abort();
  }, [contractType, locale]);

  return policy;
}
