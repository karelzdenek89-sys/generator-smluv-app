'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { rememberCaseAccess } from '@/lib/cases/client-access';
import { CASE_PAGE_PATH } from '@/lib/cases/emails';
import { isFeatureEnabled } from '@/lib/feature-flags';

type OfferState = 'idle' | 'creating' | 'created' | 'error';

/**
 * Nabídka „Pokračovat jako zakázka“ po ověřené platbě smlouvy o dílo.
 * Zobrazuje se až po stažení dokumentu — jednorázový funnel se nemění.
 */
export default function CaseOfferCard({
  sessionId,
  token,
  packageKey,
  tier,
}: {
  sessionId: string;
  token: string;
  packageKey: string | null | undefined;
  tier: 'basic' | 'complete' | undefined;
}) {
  const [state, setState] = useState<OfferState>('idle');
  const [result, setResult] = useState<{ caseId: string; token: string; emailSent: boolean } | null>(null);
  const [error, setError] = useState('');
  const viewed = useRef(false);
  const enabled = isFeatureEnabled('caseEngine');

  useEffect(() => {
    if (!enabled || viewed.current) return;
    viewed.current = true;
    trackEvent('case_offer_viewed', {
      surface: 'success_page',
      case_kind: 'work_order',
      contract_type: 'work_contract',
      package_key: packageKey === 'work_order' ? 'work_order' : undefined,
      tier,
    }, { inheritAttribution: false });
  }, [enabled, packageKey, tier]);

  if (!enabled) return null;

  const create = async () => {
    setState('creating');
    setError('');
    try {
      const response = await fetch('/api/cases/from-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, token }),
      });
      const body = (await response.json().catch(() => ({}))) as { caseId?: string; token?: string; emailSent?: boolean; error?: string };
      if (!response.ok || !body.caseId || !body.token) {
        setError(body.error ?? 'Zakázku se nepodařilo založit. Zkuste to prosím znovu.');
        setState('error');
        return;
      }
      rememberCaseAccess(body.caseId, body.token);
      try { sessionStorage.setItem(`sh_case_created:${body.caseId}`, '1'); } catch { /* ignore */ }
      setResult({ caseId: body.caseId, token: body.token, emailSent: Boolean(body.emailSent) });
      setState('created');
    } catch {
      setError('Spojení se nezdařilo. Zkuste to prosím znovu.');
      setState('error');
    }
  };

  const included = packageKey === 'work_order';

  return (
    <section className="mt-6 rounded-2xl border border-[#c9a852]/40 bg-[#c9a852]/[0.07] p-6" aria-labelledby="case-offer-title">
      <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Pokračovat v celé zakázce</div>
      <h2 id="case-offer-title" className="mt-2 font-serif italic text-2xl font-bold text-white">Pokračovat jako zakázka</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Uložte si termín, fázi a další kroky. Připomínky před termínem předání, předávací protokol, změnový list a vícepráce
        {included ? ' máte v ceně balíčku Zakázka Plus' : ' vytvoříte v zakázce za 99 Kč za dokument'}. Bez registrace — vracíte se odkazem z e-mailu.
      </p>
      <ul className="mt-3 space-y-1 text-xs leading-6 text-slate-400">
        <li>• Do zakázky se neukládá obsah smlouvy ani údaje protistrany.</li>
        <li>• Zakázku můžete kdykoli exportovat nebo smazat.</li>
      </ul>

      {state === 'created' && result ? (
        <div className="mt-5 space-y-3" role="status">
          <Link
            href={`${CASE_PAGE_PATH}?id=${encodeURIComponent(result.caseId)}#access=${encodeURIComponent(result.token)}`}
            className="site-button-primary"
          >
            Otevřít zakázku →
          </Link>
          <p className="text-xs leading-6 text-slate-400">
            {result.emailSent
              ? 'Návratový odkaz jsme poslali na e-mail z objednávky.'
              : 'Návratový odkaz si můžete kdykoli vyžádat e-mailem na stránce Moje zakázka.'}
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={create} disabled={state === 'creating'} className="site-button-primary disabled:opacity-60">
            {state === 'creating' ? 'Zakládám zakázku…' : 'Pokračovat jako zakázka'}
          </button>
          <Link href="/zakazka" className="text-xs font-semibold text-slate-400 transition hover:text-white">Jak zakázka funguje</Link>
        </div>
      )}
      {state === 'error' ? <p role="alert" className="mt-3 text-sm text-red-300">{error}</p> : null}
    </section>
  );
}
