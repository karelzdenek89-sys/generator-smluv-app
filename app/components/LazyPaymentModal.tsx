'use client';

import dynamic from 'next/dynamic';

const LazyPaymentModal = dynamic(() => import('@/app/components/PaymentModal'), {
  ssr: false,
  loading: () => null,
});

export default LazyPaymentModal;
