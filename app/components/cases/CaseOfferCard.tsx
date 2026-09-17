'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { rememberCaseAccess } from '@/lib/cases/client-access';
import { isFeatureEnabled } from '@/lib/feature-flags';
import type { CaseKind } from '@/lib/cases/types';

type OfferState = 'idle' | 'creating' | 'created' | 'error';
type SupportedContractType = 'work_contract' | 'lease' | 'car_sale';

const OFFER_COPY: Record<SupportedContractType, {
  kind: CaseKind;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  infoHref: string;
  infoLabel: string;
}> = {
  work_contract: {
    kind: 'work_order',
    kicker: 'Pokračovat v celé zakázce',
    title: 'Pokračovat jako zakázka',
    body: 'Uložte si termín, fázi a další kroky. Můžete zapnout připomínky před termínem a připravovat navazující dokumenty.',
    cta: 'Pokračovat jako zakázka',
    infoHref: '/zakazka',
    infoLabel: 'Jak zakázka funguje',
  },
  lease: {
    kind: 'rental',
    kicker: 'Pokračovat v průběhu pronájmu',
    title: 'Uložit jako pronájem',
    body: 'Uložte si praktický průběh pronájmu, nejbližší termín a další kroky od předání bytu po ukončení a vypořádání kauce.',
    cta: 'Pokračovat v pronájmu',
    infoHref: '/pro-pronajimatele',
    infoLabel: 'Přehled pro pronajímatele',
  },
  car_sale: {
    kind: 'vehicle_transfer',
    kicker: 'Pokračovat po kupní smlouvě',
    title: 'Uložit převod vozidla',
    body: 'Uložte si předání vozidla, přepis a potvrzení dokončení. Případ slouží pro termíny, checklist a praktické kroky, ne pro právní posuzování sporů.',
    cta: 'Pokračovat v převodu vozidla',
    infoHref: '/prodej-vozidla',
    infoLabel: 'Jak převod vozidla probíhá',
  },
};

export default function CaseOfferCard({
  sessionId,
  token,
  packageKey,
  tier,
  contractType,
}: {
  sessionId: string;
  token: string;
  packageKey: string | null | undefined;
  tier: 'basic' | 'complete' | undefined;
  /** Backward-compatible: the original success page only renders this card for work_contract. */
  contractType?: string;
}) {
  const supported: SupportedContractType | null = contractType === 'lease' || contractType === 'car_sale' || contractType === 'work_contract'
    ? contractType
    : contractType === undefined
      ? 'work_contract'
      : null;
  const copy = supported ? OFFER_COPY[supported] : null;
  const [state, setState] = useState<OfferState>('idle');
  const [result, setResult] = useState<{ caseId: string; token: string; path: string; emailSent: boolean } | null>(null);
  const [error, setError] = useState('');
  const viewed = useRef(false);
  const enabled = Boolean(copy) && isFeatureEnabled('caseEngine')
    && (copy?.kind !== 'rental' || isFeatureEnabled('caseRental'))
    && (copy?.kind !== 'vehicle_transfer' || isFeatureEnabled('caseVehicle'));

  useEffect(() => {
    if (!enabled || !copy || viewed.current) return;
    viewed.current = true;
    trackEvent('case_offer_viewed', {
      surface: 'success_page',
      case_kind: copy.kind as never,
      contract_type: supported ?? undefined,
      package_key: packageKey as never,
      tier,
    }, { inheritAttribution: false });
  }, [enabled, copy, supported, packageKey, tier]);

  if (!enabled || !copy || !supported) return null;

  const create = async () => {
    setState('creating');
    setError('');
    try {
      const response = await fetch('/api/cases/from-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ sessionId, token }),
      });
      const body = (await response.json().catch(() => ({}))) as { caseId?: string; token?: string; path?: string; emailSent?: boolean; error?: string };
      if (!response.ok || !body.caseId || !body.token || !body.path) {
        setError(body.error ?? 'Případ se nepodařilo založit. Zkuste to prosím znovu.');
        setState('error');
        return;
      }
      rememberCaseAccess(body.caseId, body.token);
      try { sessionStorage.setItem(`sh_case_created:${body.caseId}`, '1'); } catch { /* ignore */ }
      setResult({ caseId: body.caseId, token: body.token, path: body.path, emailSent: Boolean(body.emailSent) });
      setState('created');
    } catch {
      setError('Spojení se nezdařilo. Zkuste to prosím znovu.');
      setState('error');
    }
  };

  const includedWorkDocs = supported === 'work_contract' && packageKey === 'work_order';

  return (
    <section className="mt-6 rounded-2xl border border-[#c9a852]/40 bg-[#c9a852]/[0.07] p-6" aria-labelledby="case-offer-title">
      <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">{copy.kicker}</div>
      <h2 id="case-offer-title" className="mt-2 font-serif text-2xl font-bold italic text-white">{copy.title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        {copy.body}
        {supported === 'work_contract' ? ` ${includedWorkDocs ? 'Navazující dokumenty máte v ceně balíčku Zakázka Plus.' : 'Vybrané navazující dokumenty lze v zakázce vytvořit samostatně.'}` : ''}
      </p>
      <ul className="mt-3 space-y-1 text-xs leading-6 text-slate-400">
        <li>• Případ je volitelný a neblokuje stažení zaplaceného dokumentu.</li>
        <li>• Obsah smlouvy ani citlivé identifikační údaje protistrany se do případu automaticky nekopírují.</li>
        <li>• Případ můžete exportovat nebo kdykoli smazat.</li>
      </ul>

      {state === 'created' && result ? (
        <div className="mt-5 space-y-3" role="status">
          <a href={`${result.path}#access=${encodeURIComponent(result.token)}`} className="site-button-primary">Otevřít případ →</a>
          <p className="text-xs leading-6 text-slate-400">{result.emailSent ? 'Návratový odkaz jsme poslali na e-mail z objednávky.' : 'Nový návratový odkaz si můžete kdykoli vyžádat na stránce Moje případy.'}</p>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={create} disabled={state === 'creating'} className="site-button-primary disabled:opacity-60">{state === 'creating' ? 'Ukládám případ…' : copy.cta}</button>
          <Link href={copy.infoHref} className="text-xs font-semibold text-slate-400 transition hover:text-white">{copy.infoLabel}</Link>
        </div>
      )}
      {state === 'error' ? <p role="alert" className="mt-3 text-sm text-red-300">{error}</p> : null}
    </section>
  );
}
