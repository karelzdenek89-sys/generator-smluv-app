'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resolveDocumentAccess } from '@/lib/document-access';
import CaseOfferCard from '@/app/components/cases/CaseOfferCard';

type Meta = {
  status: 'pending' | 'paid' | 'error';
  tier?: 'basic' | 'complete';
  packageKey?: string | null;
  contractType?: string;
  lang?: string;
};

/**
 * Doplňuje case activation pro český nájem a auto. Work order zůstává na
 * původním místě uvnitř success page. EN/UA se zatím nezobrazuje, protože
 * soukromý case workspace je v této verzi pouze česky — tím nevznikne jazykový
 * dead-end po jinak lokalizovaném checkoutu.
 */
export default function SuccessCaseFollowup() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id')?.trim() ?? '';
  const [token, setToken] = useState('');
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const resolved = resolveDocumentAccess(new URL(window.location.href), `paid:${sessionId}`);
    const timer = window.setTimeout(() => setToken(resolved), 0);
    return () => window.clearTimeout(timer);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !token) return;
    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;
    const controller = new AbortController();
    const check = async () => {
      try {
        const response = await fetch('/api/contracts/status', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
          body: JSON.stringify({ sessionId, token }), signal: controller.signal,
        });
        const body = (await response.json().catch(() => ({}))) as Meta;
        if (cancelled) return;
        if (response.ok && body.status === 'paid') {
          setMeta(body);
          return;
        }
        if ((response.status === 401 || response.status === 403 || response.status === 404) || attempts >= 7) return;
      } catch {
        if (cancelled || attempts >= 7) return;
      }
      attempts += 1;
      timer = window.setTimeout(check, 1800);
    };
    void check();
    return () => {
      cancelled = true;
      controller.abort();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [sessionId, token]);

  if (
    !meta ||
    meta.status !== 'paid' ||
    (meta.lang && meta.lang !== 'cs') ||
    (meta.contractType !== 'lease' && meta.contractType !== 'car_sale')
  ) return null;

  return (
    <section className="bg-[#05080f] px-6 pb-16" aria-label="Volitelné pokračování po nákupu">
      <div className="mx-auto max-w-xl">
        <CaseOfferCard sessionId={sessionId} token={token} packageKey={meta.packageKey} tier={meta.tier} contractType={meta.contractType} />
      </div>
    </section>
  );
}
