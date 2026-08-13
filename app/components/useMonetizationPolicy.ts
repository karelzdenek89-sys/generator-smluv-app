'use client';

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ContractType } from '@/lib/contracts';
import type { PartnerLocale } from '@/lib/partners/types';
import type { PublicMonetizationPolicy } from '@/lib/monetization-policy';

const MonetizationPolicyContext = createContext<PublicMonetizationPolicy | null>(null);

export function MonetizationPolicyProvider({
  initialPolicy,
  children,
}: {
  initialPolicy: PublicMonetizationPolicy;
  children: ReactNode;
}) {
  return createElement(MonetizationPolicyContext.Provider, { value: initialPolicy }, children);
}

export function useMonetizationPolicy(contractType: ContractType, locale: PartnerLocale) {
  const initialPolicy = useContext(MonetizationPolicyContext);
  const [fetchedPolicy, setFetchedPolicy] = useState<PublicMonetizationPolicy | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(
      `/api/monetization/policy?contractType=${encodeURIComponent(contractType)}&locale=${encodeURIComponent(locale)}`,
      { cache: 'no-store', signal: controller.signal },
    )
      .then((response) => response.ok ? response.json() : null)
      .then((value: PublicMonetizationPolicy | null) => setFetchedPolicy(value))
      .catch(() => {
        // Keep the server-provided policy; routes without a provider retain their paid fallback.
      });
    return () => controller.abort();
  }, [contractType, locale]);

  if (fetchedPolicy?.contractType === contractType && fetchedPolicy.locale === locale) {
    return fetchedPolicy;
  }

  if (initialPolicy?.contractType === contractType && initialPolicy.locale === locale) {
    return initialPolicy;
  }

  return null;
}
