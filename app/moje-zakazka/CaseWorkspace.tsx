'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { createCheckoutAuthorization } from '@/lib/checkout-authorization';
import { forgetCaseAccess, resolveCaseAccessFromLocation } from '@/lib/cases/client-access';
import {
  CASE_DOCUMENT_DEFINITIONS,
  CASE_DOCUMENT_LIST,
  type CaseDocumentDefinition,
} from '@/lib/cases/documents';
import type { CaseDocumentKind, CaseStage, PublicCase } from '@/lib/cases/types';
import {
  WORK_ORDER_STAGE_DEFINITIONS,
  WORK_ORDER_STAGE_LIST,
  daysUntil,
  formatCzechDate,
  getOpenTasksForStage,
  getRecommendedDocuments,
  stageIndex,
} from '@/lib/cases/workflow';

type ResolveResponse = {
  case: PublicCase;
  documentPriceLabel: string;
  documentsIncluded: boolean;
  sharedDefaults: Record<string, string>;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'unauthorized' | 'error' | 'deleted';

const PRICE_MODE_LABEL: Record<PublicCase['priceMode'], string> = {
  after_completion: 'platba po dokončení',
  with_deposit: 'záloha + doplatek',
  milestones: 'platby po etapách',
  unknown: 'podle smlouvy',
};

const ROLE_LABEL: Record<PublicCase['ownerRole'], string> = {
  contractor: 'zhotovitel',
  customer: 'objednatel',
  unknown: 'strana smlouvy',
};

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<{ ok: boolean; status: number; data: T & { error?: string; field?: string } }> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string; field?: string };
  return { ok: response.ok, status: response.status, data };
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function CaseWorkspace() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('id')?.trim() ?? '';
  const paidDocumentId = searchParams.get('paid') === '1' ? searchParams.get('doc')?.trim() ?? '' : '';
  const returnedSessionId = searchParams.get('session_id')?.trim() ?? '';
  const cancelled = searchParams.get('cancelled') === '1';
  const reminderId = searchParams.get('reminder')?.trim() ?? '';

  const [token, setToken] = useState('');
  const [state, setState] = useState<LoadState>('idle');
  const [data, setData] = useState<ResolveResponse | null>(null);
  const [message, setMessage] = useState<{ tone: 'info' | 'error' | 'success'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [openDocument, setOpenDocument] = useState<CaseDocumentKind | null>(null);
  const trackedReturn = useRef(false);

  const record = data?.case ?? null;

  useEffect(() => {
    if (!caseId) {
      const timer = window.setTimeout(() => setState('unauthorized'), 0);
      return () => window.clearTimeout(timer);
    }
    const resolved = resolveCaseAccessFromLocation(new URL(window.location.href), caseId);
    const timer = window.setTimeout(() => {
      setToken(resolved);
      setState(resolved ? 'loading' : 'unauthorized');
    }, 0);
    return () => window.clearTimeout(timer);
  }, [caseId]);

  const load = useCallback(async () => {
    if (!caseId || !token) return;
    const returning = !trackedReturn.current && (Boolean(reminderId) || !sessionStorage.getItem(`sh_case_created:${caseId}`));
    const response = await postJson<ResolveResponse>('/api/cases/resolve', { caseId, token, returning });
    if (!response.ok) {
      setState(response.status === 403 || response.status === 404 ? 'unauthorized' : 'error');
      return;
    }
    trackedReturn.current = true;
    if (reminderId && !sessionStorage.getItem(`sh_case_reminder_click:${reminderId}`)) {
      trackEvent('reminder_clicked', { case_kind: 'work_order', case_stage: response.data.case.stage, surface: 'case_page' });
      try { sessionStorage.setItem(`sh_case_reminder_click:${reminderId}`, '1'); } catch { /* ignore */ }
    }
    setData(response.data);
    setState('ready');
  }, [caseId, token, reminderId]);

  useEffect(() => {
    if (state !== 'loading') return;
    void load();
  }, [state, load]);

  // Návrat z platební brány: dokud webhook nedorazí, ověř stav u Stripe.
  // Effect závisí jen na primitivech (id, token, stav dokumentu), aby ho
  // každá odpověď „pending“ neresetovala — jinak by se pokusy nepočítaly
  // a dvousekundový rozestup by se neuplatnil.
  const paidDocumentStatus = record?.documents.find((item) => item.id === paidDocumentId)?.status ?? null;
  useEffect(() => {
    if (!paidDocumentId || !token || paidDocumentStatus !== 'pending_payment') return;
    let attempts = 0;
    let cancelledPoll = false;
    let timer: number | undefined;
    const poll = async () => {
      if (cancelledPoll) return;
      attempts += 1;
      const response = await postJson<{ case: PublicCase; status: 'ready' | 'pending' }>('/api/cases/documents/sync', {
        caseId,
        token,
        documentId: paidDocumentId,
        ...(returnedSessionId ? { sessionId: returnedSessionId } : {}),
      });
      if (cancelledPoll) return;
      if (response.ok && response.data.case) {
        if (response.data.status === 'ready') {
          setData((current) => (current ? { ...current, case: response.data.case } : current));
          setMessage({ tone: 'success', text: 'Platba přijata. Dokument je připravený ke stažení.' });
          return;
        }
      }
      if (attempts < 8) timer = window.setTimeout(poll, 2000);
      else setMessage({ tone: 'info', text: 'Platbu ještě ověřujeme. Pokud dokument nebude do několika minut připravený, obnovte stránku.' });
    };
    void poll();
    return () => {
      cancelledPoll = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [paidDocumentId, paidDocumentStatus, token, caseId, returnedSessionId]);

  useEffect(() => {
    if (cancelled) setMessage({ tone: 'info', text: 'Platba nebyla dokončena. Dokument zůstal uložený — můžete ji dokončit kdykoli.' });
  }, [cancelled]);

  const applyAction = useCallback(
    async (action: Record<string, unknown>, successText?: string) => {
      if (!record) return false;
      setBusy(true);
      setMessage(null);
      try {
        const response = await postJson<{ case: PublicCase | null; deleted?: boolean }>('/api/cases/update', { caseId, token, action });
        if (!response.ok) {
          setMessage({ tone: 'error', text: response.data.error ?? 'Změnu se nepodařilo uložit.' });
          return false;
        }
        if (response.data.deleted) {
          forgetCaseAccess(caseId);
          setState('deleted');
          return true;
        }
        if (response.data.case) setData((current) => (current ? { ...current, case: response.data.case as PublicCase } : current));
        if (successText) setMessage({ tone: 'success', text: successText });
        return true;
      } catch {
        setMessage({ tone: 'error', text: 'Spojení se nezdařilo. Zkuste to prosím znovu.' });
        return false;
      } finally {
        setBusy(false);
      }
    },
    [record, caseId, token],
  );

  const days = useMemo(() => (record ? daysUntil(record.deadline) : null), [record]);

  if (state === 'unauthorized') {
    return (
      <Shell title="Odkaz k zakázce je neplatný nebo vypršel">
        <p className="text-sm leading-7 text-slate-400">
          Otevřete zakázku odkazem z e-mailu, nebo si nechte poslat nový návratový odkaz. Odkazy platí 30 dní a lze je v zakázce zneplatnit.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/moje-zakazka/obnovit" className="site-button-primary">Poslat návratový odkaz</Link>
          <Link href="/zakazka" className="site-button-secondary">Jak zakázka funguje</Link>
        </div>
      </Shell>
    );
  }
  if (state === 'deleted') {
    return (
      <Shell title="Zakázka byla smazána">
        <p className="text-sm leading-7 text-slate-400">Údaje zakázky, připomínky i návratové odkazy byly odstraněny. Zaplacené dokumenty zůstávají dostupné podle podmínek objednávky.</p>
        <Link href="/zakazka" className="site-button-secondary mt-6">Zpět na Řeším zakázku</Link>
      </Shell>
    );
  }
  if (state === 'error') {
    return (
      <Shell title="Zakázku se nepodařilo načíst">
        <p className="text-sm leading-7 text-slate-400">Zkuste stránku obnovit. Pokud problém přetrvává, napište na info@smlouvahned.cz.</p>
        <button type="button" onClick={() => setState('loading')} className="site-button-primary mt-6">Zkusit znovu</button>
      </Shell>
    );
  }
  if (!record || !data) {
    return (
      <Shell title="Načítáme zakázku">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#c9a852] border-t-transparent" aria-label="Načítání" />
      </Shell>
    );
  }

  const stage = WORK_ORDER_STAGE_DEFINITIONS[record.stage];
  const openTasks = getOpenTasksForStage(record);
  const recommended = getRecommendedDocuments(record.stage);

  return (
    <main className="site-page">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <nav className="mb-6 text-xs text-slate-400" aria-label="Drobečková navigace">
          <Link href="/" className="transition hover:text-slate-300">SmlouvaHned</Link>
          <span className="mx-2 text-slate-700">›</span>
          <Link href="/zakazka" className="transition hover:text-slate-300">Řeším zakázku</Link>
          <span className="mx-2 text-slate-700">›</span>
          <span className="text-slate-400">Moje zakázka</span>
        </nav>

        <header className="mb-8">
          <p className="site-kicker mb-3">Moje zakázka · {ROLE_LABEL[record.ownerRole]}</p>
          <TitleEditor title={record.title} busy={busy} onSave={(title) => applyAction({ type: 'set_title', title }, 'Název uložen.')} />
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="site-content-card rounded-2xl p-4">
              <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fáze</dt>
              <dd className="mt-1 text-sm font-semibold text-white">{stage.label}</dd>
            </div>
            <div className="site-content-card rounded-2xl p-4">
              <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Termín dokončení</dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {formatCzechDate(record.deadline)}
                {days !== null ? <span className="ml-2 text-xs font-normal text-slate-400">{days > 0 ? `za ${days} dní` : days === 0 ? 'dnes' : `před ${Math.abs(days)} dny`}</span> : null}
              </dd>
            </div>
            <div className="site-content-card rounded-2xl p-4">
              <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cena a režim</dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {record.priceAmountCzk ? `${record.priceAmountCzk.toLocaleString('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} Kč` : '—'}
                <span className="ml-2 text-xs font-normal text-slate-400">{PRICE_MODE_LABEL[record.priceMode]}</span>
              </dd>
            </div>
          </dl>
        </header>

        {message ? (
          <div
            role="status"
            className={`mb-6 rounded-2xl border p-4 text-sm ${message.tone === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-200' : message.tone === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-slate-300'}`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <section className="site-content-card rounded-2xl p-6" aria-labelledby="stage-title">
              <h2 id="stage-title" className="font-serif italic text-xl font-bold text-white">Průběh zakázky</h2>
              <ol className="mt-4 flex flex-wrap gap-2" aria-label="Fáze zakázky">
                {WORK_ORDER_STAGE_LIST.map((item) => {
                  const active = item.key === record.stage;
                  const done = stageIndex(item.key) < stageIndex(record.stage);
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        disabled={busy || active}
                        onClick={() => applyAction({ type: 'set_stage', stage: item.key }, `Fáze změněna: ${item.label}.`)}
                        aria-current={active ? 'step' : undefined}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? 'border-[#c9a852] bg-[#c9a852] text-[#040c1a]' : done ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-white/10 text-slate-400 hover:border-[#c9a852]/50 hover:text-white'}`}
                      >
                        {item.short}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-sm leading-7 text-slate-400">{stage.description}</p>
              <div className="mt-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Doporučené další kroky</div>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-300">
                  {stage.nextSteps.map((step) => (
                    <li key={step} className="flex gap-2"><span className="text-[#c9a852]">→</span><span>{step}</span></li>
                  ))}
                </ul>
              </div>
              {stage.escalation ? (
                <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3 text-xs leading-6 text-slate-300">{stage.escalation}</p>
              ) : null}
            </section>

            <section className="site-content-card rounded-2xl p-6" aria-labelledby="tasks-title">
              <h2 id="tasks-title" className="font-serif italic text-xl font-bold text-white">Úkoly</h2>
              <ul className="mt-4 space-y-2">
                {record.tasks.map((task) => {
                  const relevant = openTasks.some((item) => item.key === task.key) || task.done;
                  return (
                    <li key={task.key} className={`rounded-xl border p-3 ${task.done ? 'border-emerald-500/25 bg-emerald-500/[0.04]' : relevant ? 'border-white/10 bg-white/[0.02]' : 'border-white/5 opacity-60'}`}>
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.done}
                          disabled={busy}
                          onChange={(event) => applyAction({ type: 'toggle_task', taskKey: task.key, done: event.target.checked })}
                          className="mt-1 h-4 w-4 accent-[#c9a852]"
                        />
                        <span className="min-w-0">
                          <span className={`block text-sm ${task.done ? 'text-slate-400 line-through decoration-slate-600' : 'text-white'}`}>{task.label}</span>
                          <span className="mt-1 flex flex-wrap gap-3 text-xs">
                            <span className="text-slate-400">{WORK_ORDER_STAGE_DEFINITIONS[task.stage].short}</span>
                            {task.documentKind ? (
                              <button type="button" onClick={() => setOpenDocument(task.documentKind ?? null)} className="font-semibold text-[#e2c77b] transition hover:text-white">
                                Připravit: {CASE_DOCUMENT_DEFINITIONS[task.documentKind].shortTitle}
                              </button>
                            ) : null}
                            {task.href ? <Link href={task.href} className="font-semibold text-slate-400 transition hover:text-white">Návod →</Link> : null}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="site-content-card rounded-2xl p-6" aria-labelledby="documents-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="documents-title" className="font-serif italic text-xl font-bold text-white">Dokumenty zakázky</h2>
                <span className="text-xs text-slate-400">
                  {data.documentsIncluded ? 'Navazující dokumenty jsou v ceně balíčku Zakázka Plus' : `Navazující dokument ${data.documentPriceLabel}`}
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm text-slate-400">
                <div className="font-semibold text-white">Smlouva o dílo{record.origin.packageKey === 'work_order' ? ' + přílohy Zakázka Plus' : record.origin.tier === 'complete' ? ' (rozšířená)' : ' (základní)'}</div>
                <div className="mt-1 text-xs leading-6">Hotové PDF najdete v e-mailu z objednávky nebo v sekci <Link href="/zakaznicka-zona" className="text-[#e2c77b]">Moje dokumenty</Link>.</div>
              </div>

              {record.documents.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {record.documents.map((document) => (
                    <DocumentRow
                      key={document.id}
                      document={document}
                      busy={busy}
                      onDownload={async () => {
                        setBusy(true);
                        try {
                          const response = await fetch('/api/cases/documents/download', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ caseId, token, documentId: document.id }),
                          });
                          if (!response.ok) {
                            const body = (await response.json().catch(() => ({}))) as { error?: string };
                            setMessage({ tone: 'error', text: body.error ?? 'Dokument se nepodařilo stáhnout.' });
                            return;
                          }
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          const anchor = window.document.createElement('a');
                          anchor.href = url;
                          anchor.download = `${document.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
                          anchor.click();
                          URL.revokeObjectURL(url);
                        } finally {
                          setBusy(false);
                        }
                      }}
                      onPay={async (consent) => {
                        setBusy(true);
                        try {
                          const response = await postJson<{ url?: string; ready?: boolean }>('/api/cases/documents/checkout', {
                            caseId,
                            token,
                            documentId: document.id,
                            consent,
                          });
                          if (!response.ok || !response.data.url) {
                            setMessage({ tone: 'error', text: response.data.error ?? 'Platbu se nepodařilo zahájit.' });
                            return;
                          }
                          window.location.href = response.data.url;
                        } finally {
                          setBusy(false);
                        }
                      }}
                    />
                  ))}
                </ul>
              ) : null}

              <div className="mt-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Vytvořit navazující dokument</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {CASE_DOCUMENT_LIST.map((definition) => {
                    const isRecommended = recommended.includes(definition.kind);
                    return (
                      <button
                        key={definition.kind}
                        type="button"
                        onClick={() => {
                          setOpenDocument(definition.kind);
                          trackEvent('followup_document_viewed', { case_kind: 'work_order', case_stage: record.stage, document_kind: definition.kind, surface: 'case_page' });
                        }}
                        className={`rounded-xl border p-3 text-left transition ${isRecommended ? 'border-[#c9a852]/45 bg-[#c9a852]/[0.07]' : 'border-white/10 bg-white/[0.02] hover:border-[#c9a852]/40'}`}
                      >
                        <span className="block text-sm font-semibold text-white">{definition.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">{definition.whenToUse}</span>
                        {isRecommended ? <span className="mt-2 inline-block text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Doporučeno v této fázi</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {openDocument ? (
              <DocumentForm
                definition={CASE_DOCUMENT_DEFINITIONS[openDocument]}
                defaults={data.sharedDefaults}
                included={data.documentsIncluded}
                priceLabel={data.documentPriceLabel}
                busy={busy}
                onCancel={() => setOpenDocument(null)}
                onSubmit={async (values, consent) => {
                  setBusy(true);
                  setMessage(null);
                  try {
                    trackEvent('followup_document_started', { case_kind: 'work_order', case_stage: record.stage, document_kind: openDocument, surface: 'case_page' });
                    const response = await postJson<{ case?: PublicCase; documentId?: string; ready?: boolean; url?: string }>('/api/cases/documents/create', {
                      caseId,
                      token,
                      kind: openDocument,
                      data: values,
                      consent,
                    });
                    if (response.data.case) setData((current) => (current ? { ...current, case: response.data.case as PublicCase } : current));
                    if (!response.ok) {
                      setMessage({ tone: 'error', text: response.data.error ?? 'Dokument se nepodařilo připravit.' });
                      return;
                    }
                    if (response.data.ready) {
                      setOpenDocument(null);
                      setMessage({ tone: 'success', text: 'Dokument je připravený ke stažení.' });
                      return;
                    }
                    if (response.data.url) {
                      window.location.href = response.data.url;
                    }
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            ) : null}

            <section className="site-content-card rounded-2xl p-6" aria-labelledby="timeline-title">
              <h2 id="timeline-title" className="font-serif italic text-xl font-bold text-white">Historie a poznámky</h2>
              <NoteForm busy={busy} onSubmit={(note) => applyAction({ type: 'add_note', note }, 'Poznámka uložena.')} />
              <ol className="mt-4 space-y-2 text-sm">
                {[...record.events].reverse().slice(0, 30).map((event) => (
                  <li key={event.id} className="flex gap-3 border-l border-white/10 pl-3">
                    <time dateTime={event.at} className="w-32 flex-shrink-0 text-xs text-slate-400">{formatDateTime(event.at)}</time>
                    <span className={event.type === 'note' ? 'text-slate-200' : 'text-slate-400'}>{event.label}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="site-content-card rounded-2xl p-6" aria-labelledby="deadline-title">
              <h2 id="deadline-title" className="font-serif italic text-xl font-bold text-white">Termín a připomínky</h2>
              <DeadlineForm deadline={record.deadline} busy={busy} onSave={(deadline) => applyAction({ type: 'set_deadline', deadline }, 'Termín uložen.')} />
              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={record.remindersEnabled}
                  disabled={busy || !record.deadline}
                  onChange={(event) => applyAction({ type: 'set_reminders', enabled: event.target.checked }, event.target.checked ? 'Připomínky zapnuty.' : 'Připomínky vypnuty.')}
                  className="mt-1 h-4 w-4 accent-[#c9a852]"
                />
                <span>
                  <span className="block text-sm font-semibold text-white">E-mailové připomínky termínu</span>
                  <span className="block text-xs leading-6 text-slate-400">30, 14 a 7 dní předem a den před termínem, vždy s konkrétním dalším krokem. Kdykoli vypnete.</span>
                </span>
              </label>
              {record.reminders.length > 0 ? (
                <ul className="mt-4 space-y-1 text-xs text-slate-400">
                  {record.reminders.map((reminder) => (
                    <li key={reminder.id} className="flex justify-between gap-2">
                      <span>{reminder.offsetDays} {reminder.offsetDays === 1 ? 'den' : 'dní'} předem</span>
                      <span className={reminder.status === 'sent' ? 'text-emerald-300' : reminder.status === 'cancelled' ? 'text-slate-400' : 'text-slate-400'}>
                        {reminder.status === 'sent' ? 'odesláno' : reminder.status === 'cancelled' ? 'zrušeno' : formatCzechDate(reminder.dueAt.slice(0, 10))}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6" aria-labelledby="privacy-title">
              <h2 id="privacy-title" className="font-serif italic text-lg font-bold text-white">Data a přístup</h2>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                Zakázka je vedena pro <span className="text-slate-300">{record.ownerEmailMasked}</span>. Neobsahuje obsah smlouvy ani údaje protistrany. Bez aktivity se smaže {formatCzechDate(record.expiresAt.slice(0, 10))}.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    const response = await fetch('/api/cases/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ caseId, token }) });
                    if (!response.ok) { setMessage({ tone: 'error', text: 'Export se nezdařil.' }); return; }
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const anchor = window.document.createElement('a');
                    anchor.href = url;
                    anchor.download = `zakazka-${caseId.slice(0, 8)}.json`;
                    anchor.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="site-button-secondary justify-center text-xs"
                >
                  Exportovat údaje (JSON)
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (!window.confirm('Zneplatnit všechny odkazy k této zakázce a dosud vydané odkazy do přehledu Moje případy pro tento e-mail? Ostatní případy zůstanou uložené; pro další přístup bude potřeba nový odkaz z e-mailu.')) return;
                    if (await applyAction({ type: 'revoke_links' }, 'Odkazy byly zneplatněny.')) {
                      forgetCaseAccess(caseId);
                      setState('unauthorized');
                    }
                  }}
                  className="site-button-secondary justify-center text-xs"
                >
                  Zneplatnit návratové odkazy
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm('Smazat zakázku včetně připomínek a připravených dokumentů? Tuto akci nelze vrátit.')) {
                      void applyAction({ type: 'delete' });
                    }
                  }}
                  className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Smazat zakázku
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6" aria-labelledby="help-title">
              <h2 id="help-title" className="font-serif italic text-lg font-bold text-white">Návody k této fázi</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/nastroje/checklist-predani-zakazky" className="text-slate-300 transition hover:text-[#e2c77b]">Checklist předání zakázky</Link></li>
                <li><Link href="/nastroje/pruvodce-vicepracemi" className="text-slate-300 transition hover:text-[#e2c77b]">Průvodce vícepracemi</Link></li>
                <li><Link href="/zakazka/remeslnik-nedodrzel-termin" className="text-slate-300 transition hover:text-[#e2c77b]">Řemeslník nedodržel termín</Link></li>
                <li><Link href="/zakazka/reklamace-dila" className="text-slate-300 transition hover:text-[#e2c77b]">Reklamace díla a vady</Link></li>
              </ul>
              <p className="mt-4 text-xs leading-6 text-slate-400">
                Potřebujete rozpočet stavby? Samostatná služba <a href="https://www.planstavby.cz/?utm_source=smlouvahned&utm_medium=cross_sell&utm_campaign=case" target="_blank" rel="noopener noreferrer" className="text-[#e2c77b] underline underline-offset-2">PlanStavby.cz</a>. Údaje ze zakázky se nepřenášejí.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="site-page">
      <div className="mx-auto max-w-xl px-6 py-20">
        <p className="site-kicker mb-3">Moje zakázka</p>
        <h1 className="font-serif italic text-3xl font-bold text-white">{title}</h1>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

function TitleEditor({ title, busy, onSave }: { title: string; busy: boolean; onSave: (title: string) => Promise<boolean> }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [syncedTitle, setSyncedTitle] = useState(title);
  if (syncedTitle !== title) {
    // Prop se změnila (uložení na serveru) — srovnat lokální hodnotu během renderu.
    setSyncedTitle(title);
    setValue(title);
  }
  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif italic text-3xl font-bold text-white md:text-4xl">{title}</h1>
        <button type="button" onClick={() => setEditing(true)} className="text-xs text-slate-400 transition hover:text-white">Přejmenovat</button>
      </div>
    );
  }
  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        if (await onSave(value)) setEditing(false);
      }}
    >
      <label htmlFor="case-title" className="sr-only">Název zakázky</label>
      <input id="case-title" value={value} onChange={(event) => setValue(event.target.value)} maxLength={120} className="rounded-lg border border-white/15 bg-[#0c1426] px-3 py-2 text-lg font-semibold text-white" />
      <button type="submit" disabled={busy} className="site-button-primary text-xs">Uložit</button>
      <button type="button" onClick={() => { setEditing(false); setValue(title); }} className="text-xs text-slate-400">Zrušit</button>
    </form>
  );
}

function DeadlineForm({ deadline, busy, onSave }: { deadline: string | null; busy: boolean; onSave: (deadline: string | null) => Promise<boolean> }) {
  const [value, setValue] = useState(deadline ?? '');
  const [syncedDeadline, setSyncedDeadline] = useState(deadline);
  if (syncedDeadline !== deadline) {
    setSyncedDeadline(deadline);
    setValue(deadline ?? '');
  }
  return (
    <form
      className="mt-3 flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave(value || null);
      }}
    >
      <div className="flex-1">
        <label htmlFor="case-deadline" className="block text-xs font-semibold text-slate-400">Termín dokončení podle smlouvy</label>
        <input id="case-deadline" type="date" value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-[#0c1426] px-3 py-2 text-sm text-white" />
      </div>
      <button type="submit" disabled={busy || value === (deadline ?? '')} className="site-button-secondary text-xs disabled:opacity-40">Uložit termín</button>
    </form>
  );
}

function NoteForm({ busy, onSubmit }: { busy: boolean; onSubmit: (note: string) => Promise<boolean> }) {
  const [note, setNote] = useState('');
  return (
    <form
      className="mt-4 flex flex-col gap-2 sm:flex-row"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!note.trim()) return;
        if (await onSubmit(note)) setNote('');
      }}
    >
      <label htmlFor="case-note" className="sr-only">Poznámka</label>
      <input id="case-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder="Poznámka k průběhu (např. domluven termín přejímky)" className="flex-1 rounded-lg border border-white/15 bg-[#0c1426] px-3 py-2 text-sm text-white placeholder:text-slate-400" />
      <button type="submit" disabled={busy || !note.trim()} className="site-button-secondary text-xs disabled:opacity-40">Přidat</button>
    </form>
  );
}

function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-xs leading-6 text-slate-400">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-[#c9a852]" />
      <span>
        Přijímám <Link href="/obchodni-podminky" className="text-[#e2c77b] underline underline-offset-2" target="_blank">obchodní podmínky</Link> a beru na vědomí{' '}
        <Link href="/gdpr" className="text-[#e2c77b] underline underline-offset-2" target="_blank">zásady ochrany osobních údajů</Link>. Výslovně souhlasím s okamžitým dodáním digitálního obsahu před uplynutím lhůty pro odstoupení a beru na vědomí, že jeho úplným dodáním ztrácím právo na odstoupení od smlouvy dle § 1837 písm. l) OZ.
      </span>
    </label>
  );
}

function DocumentRow({
  document,
  busy,
  onDownload,
  onPay,
}: {
  document: PublicCase['documents'][number];
  busy: boolean;
  onDownload: () => Promise<void>;
  onPay: (consent: ReturnType<typeof createCheckoutAuthorization>['consent']) => Promise<void>;
}) {
  const [consent, setConsent] = useState(false);
  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{document.title}</div>
          <div className="text-xs text-slate-400">
            {formatDateTime(document.createdAt)} · {document.entitlement === 'included' ? 'v ceně balíčku' : document.status === 'ready' ? 'zaplaceno' : 'čeká na platbu'}
          </div>
        </div>
        {document.status === 'ready' ? (
          <button type="button" disabled={busy} onClick={() => void onDownload()} className="site-button-primary text-xs">Stáhnout PDF</button>
        ) : null}
      </div>
      {document.status === 'pending_payment' ? (
        <div className="mt-3 space-y-3">
          <ConsentCheckbox checked={consent} onChange={setConsent} />
          <button
            type="button"
            disabled={busy || !consent}
            onClick={() => void onPay(createCheckoutAuthorization('').consent)}
            className="site-button-secondary text-xs disabled:opacity-40"
          >
            Dokončit platbu
          </button>
        </div>
      ) : null}
    </li>
  );
}

function DocumentForm({
  definition,
  defaults,
  included,
  priceLabel,
  busy,
  onCancel,
  onSubmit,
}: {
  definition: CaseDocumentDefinition;
  defaults: Record<string, string>;
  included: boolean;
  priceLabel: string;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, string>, consent: ReturnType<typeof createCheckoutAuthorization>['consent'] | null) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of definition.fields) {
      if (field.shared && defaults[field.key]) initial[field.key] = defaults[field.key];
    }
    return initial;
  });
  const [consent, setConsent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [definition.kind]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void onSubmit(values, included ? null : createCheckoutAuthorization('').consent);
  };

  return (
    <form ref={formRef} onSubmit={submit} className="site-content-card scroll-mt-24 rounded-2xl border-[#c9a852]/40 p-6" aria-labelledby="doc-form-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="site-kicker mb-2">Navazující dokument</p>
          <h2 id="doc-form-title" className="font-serif italic text-xl font-bold text-white">{definition.title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">{definition.description}</p>
        </div>
        <span className="rounded-full border border-[#c9a852]/40 px-3 py-1 text-xs font-semibold text-[#e2c77b]">{included ? 'V ceně balíčku' : priceLabel}</span>
      </div>
      <p className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 text-xs leading-6 text-slate-400">{definition.legalBasis}</p>
      <p className="mt-2 text-[11px] leading-5 text-slate-400">
        Dokument je standardizovaná šablona sestavená z údajů, které zadáte. Nejde o právní posouzení vaší situace ani o právní službu; u sporných vad nebo vyšších částek doporučujeme advokáta.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {definition.fields.map((field) => {
          const id = `doc-${definition.kind}-${field.key}`;
          const common = {
            id,
            name: field.key,
            required: field.required,
            value: values[field.key] ?? '',
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              setValues((current) => ({ ...current, [field.key]: event.target.value })),
            className: 'mt-1 w-full rounded-lg border border-white/15 bg-[#0c1426] px-3 py-2 text-sm text-white placeholder:text-slate-400',
          };
          return (
            <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label htmlFor={id} className="block text-xs font-semibold text-slate-300">
                {field.label}{field.required ? ' *' : ''}
              </label>
              {field.type === 'textarea' ? (
                <textarea {...common} rows={3} placeholder={field.placeholder} maxLength={4000} />
              ) : field.type === 'select' ? (
                <select {...common}>
                  <option value="">— vyberte —</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <input {...common} type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'} placeholder={field.placeholder} maxLength={200} inputMode={field.type === 'money' ? 'decimal' : undefined} />
              )}
              {field.help ? <p className="mt-1 text-xs text-slate-400">{field.help}</p> : null}
            </div>
          );
        })}
      </div>

      {!included ? (
        <div className="mt-5">
          <ConsentCheckbox checked={consent} onChange={setConsent} />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={busy || (!included && !consent)} className="site-button-primary disabled:opacity-40">
          {included ? 'Vytvořit dokument' : `Připravit a zaplatit ${priceLabel}`}
        </button>
        <button type="button" onClick={onCancel} className="site-button-secondary">Zrušit</button>
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-400">Údaje dokumentu se ukládají v zakázce. Jména stran se předvyplní u dalšího dokumentu.</p>
    </form>
  );
}
