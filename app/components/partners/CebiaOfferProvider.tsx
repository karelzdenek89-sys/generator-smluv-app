'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { PublicPartnerOffer } from '@/lib/partners/types';

const CebiaOfferContext = createContext<PublicPartnerOffer | null>(null);

export function CebiaOfferProvider({
  offer,
  children,
}: {
  offer: PublicPartnerOffer | null;
  children: ReactNode;
}) {
  return <CebiaOfferContext.Provider value={offer}>{children}</CebiaOfferContext.Provider>;
}

export function useCebiaOffer() {
  return useContext(CebiaOfferContext);
}
