'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { forgetCaseAccess, resolveCaseAccessFromLocation } from '@/lib/cases/client-access';
import { forgetCaseHubAccess } from '@/lib/cases/hub-client-access';
import type { CaseKind, PublicCase } from '@/lib/cases/types';
import { daysUntil, formatCzechDate, getStageDefinition, stagesForKind } from '@/lib/cases/workflow';

type ResolveResponse = {
  case: PublicCase;
  documentPriceLabel: string | null;
  documentsIncluded: boolean;
  sharedDefaults: Record<string, string>;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'unauthorized' | 'error' | 'deleted';

type Message = { tone: 'info' | 'error' | 'success'; text: string };

const KIND_LABEL: Record<CaseKind, string> = {
  work_order: 'Zakázka',
  rental: 'Pronájem',
  vehicle_transfer: 'Vozidlo',
};

const ROLE_LABEL: Record<string, string> = {
  contractor: 'zhotovitel',
  customer: 'objednatel',
  landlord: 'pronajímatel',
  tenant: 'nájemce',
  seller: 'prodávající',
  buyer: 'kupující',
  unknown: 'uživatel případu',
};

const PUBLIC_HUB: Record<CaseKind, string> = {
  work_order: '/zakazka',
  rental: '/pro-pronajimatele',
  vehicle_transfer: '/prodej-vozidla',
};

async function postJson<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
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
  const reminderId = searchParams.get('reminder')?.trim() ?? '';
  const [token, setToken] = useState('');
  const [state, setState] = useState<LoadState>('idle');
  const [data, setData] = useState<ResolveResponse | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const trackedReturn = useRef(false);
  const trackedReminder = useRef(false);
  const record = data?.case ?? null;

  useEffect(() => {
    if (!caseId) {
      const timer = window.setTimeout(() => setState('unauthorized'), 0);
      return () => window.clearTimeout(timer);
    }
    const access = resolveCaseAccessFromLocation(new URL(window.location.href), caseId);
    const timer = window.setTimeout(() => {
      setToken(access);
      setState(access ? 'loading' : 'unauthorized');
    }, 0);
    return () => window.clearTimeout(timer);
  }, [caseId]);

  const load = useCallback(async () => {
    if (!caseId || !token) return;
    const response = await postJson<ResolveResponse>('/api/cases/resolve', {
      caseId,
      token,
      returning: !trackedReturn.current,
    });
    if (!response.ok) {
      setState(response.status === 403 || response.status === 404 ? 'unauthorized' : 'error');
      return;
    }
    trackedReturn.current = true;
    setData(response.data);
    setState('ready');
    if (reminderId && !trackedReminder.current) {
      trackedReminder.current = true;
      trackEvent('reminder_clicked', {
        surface: 'case_engine',
        case_kind: response.data.case.kind as never,
        case_stage: response.data.case.stage,
      }, { inheritAttribution: false });
    }
  }, [caseId, token, reminderId]);

  useEffect(() => {
    if (state === 'loading') void load();
  }, [state, load]);

  const applyAction = useCallback(async (action: Record<string, unknown>, successText?: string) => {
    if (!record) return false;
    setBusy(true);
    setMessage(null);
    try {
      const response = await postJson<{ case: PublicCase | null; deleted?: boolean }>('/api/cases/update', { caseId, token, action });
      if (!response.ok) {
        if (response.status === 403) setState('unauthorized');
        else setMessage({ tone: 'error', text: response.data.error ?? 'Změnu se nepodařilo uložit.' });
        return false;
      }
      if (response.data.deleted) {
        forgetCaseAccess(caseId);
        setState('deleted');
        return true;
      }
      if (response.data.case) {
        setData((current) => current ? { ...current, case: response.data.case as PublicCase } : current);
      }
      if (successText) setMessage({ tone: 'success', text: successText });
      return true;
    } catch {
      setMessage({ tone: 'error', text: 'Spojení se nezdařilo. Zkuste to prosím znovu.' });
      return false;
    } finally {
      setBusy(false);
    }
  }, [record, caseId, token]);

  const days = useMemo(() => record ? daysUntil(record.deadline) : null, [record]);

  if (state === 'unauthorized') {
    return (
      <Shell title="Odkaz k případu je neplatný nebo vypršel">
        <p className="text-sm leading-7 text-slate-400">Otevřete případ z bezpečného odkazu v e-mailu, nebo si na stránce Moje případy nechte poslat nový.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/moje-pripady" className="site-button-primary">Otevřít Moje případy</Link>
          <Link href="/" className="site-button-secondary">Zpět na SmlouvaHned</Link>
        </div>
      </Shell>
    );
  }

  if (state === 'deleted') {
    return (
      <Shell title="Případ byl smazán">
        <p className="text-sm leading-7 text-slate-400">Pracovní stav, úkoly, připomínky a návratové odkazy byly odstraněny. Samostatně zakoupené dokumenty zůstávají dostupné podle podmínek objednávky.</p>
        <Link href="/moje-pripady" className="site-button-secondary mt-6">Zpět na Moje případy</Link>
      </Shell>
    );
  }

  if (state === 'error') {
    return (
      <Shell title="Případ se nepodařilo načíst">
        <p className="text-sm leading-7 text-slate-400">Zkuste stránku obnovit. Pokud problém přetrvává, napište na info@smlouvahned.cz.</p>
        <button type="button" onClick={() => setState('loading')} className="site-button-primary mt-6">Zkusit znovu</button>
      </Shell>
    );
  }

  if (!record || !data) {
    return <Shell title="Načítáme případ"><div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#c9a852] border-t-transparent" aria-label="Načítání" /></Shell>;
  }

  if (record.kind === 'work_order') {
    return (
      <Shell title="Tato zakázka používá rozšířené pracovní prostředí">
        <p className="text-sm leading-7 text-slate-400">Moje zakázka obsahuje navazující dokumenty a vlastní workflow. Otevřete ji v původním pracovním prostředí.</p>
        <a href={`/moje-zakazka?id=${encodeURIComponent(caseId)}#access=${encodeURIComponent(token)}`} className="site-button-primary mt-6">Otevřít Moje zakázka</a>
      </Shell>
    );
  }

  const stage = getStageDefinition(record.kind, record.stage);
  const stages = stagesForKind(record.kind);
  const nextTask = record.tasks.find((task) => !task.done);

  const saveDeadline = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const deadline = String(new FormData(event.currentTarget).get('deadline') ?? '').trim();
    await applyAction({ type: 'set_deadline', deadline: deadline || null }, 'Důležitý termín uložen.');
  };

  const saveNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!note.trim()) return;
    if (await applyAction({ type: 'add_note', note }, 'Poznámka uložena.')) setNote('');
  };

  const exportCase = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/cases/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ caseId, token }),
      });
      if (!response.ok) {
        setMessage({ tone: 'error', text: 'Export se nepodařilo připravit.' });
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `smlouvahned-pripad-${caseId}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage({ tone: 'error', text: 'Export se nepodařilo připravit.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="site-page">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <nav className="mb-6 text-xs text-slate-400" aria-label="Drobečková navigace">
          <Link href="/" className="transition hover:text-slate-300">SmlouvaHned</Link>
          <span className="mx-2 text-slate-700">›</span>
          <Link href="/moje-pripady" className="transition hover:text-slate-300">Moje případy</Link>
          <span className="mx-2 text-slate-700">›</span>
          <span>{record.title}</span>
        </nav>

        <header className="mb-8">
          <p className="site-kicker mb-3">{KIND_LABEL[record.kind]} · {ROLE_LABEL[record.ownerRole] ?? ROLE_LABEL.unknown}</p>
          <h1 className="font-serif text-3xl font-bold italic text-white md:text-4xl">{record.title}</h1>
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <Info label="Stav" value={stage?.label ?? 'Aktivní'} />
            <Info label="Důležitý termín" value={record.deadline ? `${formatCzechDate(record.deadline)}${days !== null ? days > 0 ? ` · za ${days} dní` : days === 0 ? ' · dnes' : ` · před ${Math.abs(days)} dny` : ''}` : 'Nenastaven'} />
            <Info label="Další krok" value={nextTask?.label ?? stage?.nextSteps[0] ?? 'Případ je uzavřený'} />
          </dl>
        </header>

        {message ? <Status message={message} /> : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <section className="site-content-card rounded-2xl p-6" aria-labelledby="progress-title">
              <h2 id="progress-title" className="font-serif text-xl font-bold italic text-white">Průběh případu</h2>
              <ol className="mt-4 flex flex-wrap gap-2" aria-label="Fáze případu">
                {stages.map((item) => {
                  const definition = getStageDefinition(record.kind, item);
                  const active = item === record.stage;
                  return (
                    <li key={item}>
                      <button type="button" disabled={busy || active} onClick={() => void applyAction({ type: 'set_stage', stage: item }, `Fáze změněna: ${definition?.label ?? item}.`)} aria-current={active ? 'step' : undefined} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? 'border-[#c9a852] bg-[#c9a852] text-[#040c1a]' : 'border-white/10 text-slate-400 hover:border-[#c9a852]/50 hover:text-white'}`}>
                        {definition?.short ?? item}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-sm leading-7 text-slate-400">{stage?.description}</p>
              <div className="mt-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Co dál</div>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-300">
                  {stage?.nextSteps.map((step) => <li key={step} className="flex gap-2"><span className="text-[#c9a852]">→</span><span>{step}</span></li>)}
                </ul>
              </div>
              {stage?.escalation ? <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3 text-xs leading-6 text-slate-300">{stage.escalation}</p> : null}
            </section>

            <section className="site-content-card rounded-2xl p-6" aria-labelledby="tasks-title">
              <h2 id="tasks-title" className="font-serif text-xl font-bold italic text-white">Praktické kroky</h2>
              <ul className="mt-4 space-y-2">
                {record.tasks.map((task) => (
                  <li key={task.key} className={`rounded-xl border p-3 ${task.done ? 'border-emerald-500/25 bg-emerald-500/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input type="checkbox" checked={task.done} disabled={busy} onChange={(event) => void applyAction({ type: 'toggle_task', taskKey: task.key, done: event.target.checked })} className="mt-1 h-4 w-4 accent-[#c9a852]" />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm ${task.done ? 'text-slate-400 line-through decoration-slate-600' : 'text-white'}`}>{task.label}</span>
                        {task.href ? <Link href={task.href} className="mt-1 inline-block text-xs font-semibold text-[#e2c77b] transition hover:text-white">Otevřít související krok →</Link> : null}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section className="site-content-card rounded-2xl p-6" aria-labelledby="history-title">
              <h2 id="history-title" className="font-serif text-xl font-bold italic text-white">Historie a poznámky</h2>
              <form onSubmit={saveNote} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="case-note">Poznámka</label>
                <input id="case-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder="Krátká poznámka k průběhu" className="site-input flex-1" />
                <button type="submit" disabled={busy || !note.trim()} className="site-button-secondary">Uložit poznámku</button>
              </form>
              <ol className="mt-5 space-y-2 text-sm">
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
              <h2 id="deadline-title" className="font-serif text-xl font-bold italic text-white">Termín a připomínky</h2>
              <form onSubmit={saveDeadline} className="mt-4">
                <label htmlFor="case-deadline" className="mb-2 block text-xs font-bold text-slate-300">Nejbližší důležitý termín</label>
                <input id="case-deadline" name="deadline" type="date" defaultValue={record.deadline ?? ''} className="site-input w-full" />
                <button type="submit" disabled={busy} className="site-button-secondary mt-3 w-full">Uložit termín</button>
              </form>
              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={record.remindersEnabled} disabled={busy || !record.deadline || record.stage === 'closed'} onChange={(event) => void applyAction({ type: 'set_reminders', enabled: event.target.checked }, event.target.checked ? 'Připomínky zapnuty.' : 'Připomínky vypnuty.')} className="mt-1 h-4 w-4 accent-[#c9a852]" />
                <span><span className="block text-sm font-semibold text-white">E-mailové připomínky</span><span className="mt-1 block text-xs leading-5 text-slate-400">Funkční upozornění před nastaveným termínem, nikoli newsletter.</span></span>
              </label>
            </section>

            <section className="site-content-card rounded-2xl p-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Související informace</div>
              <p className="mt-2 text-sm leading-7 text-slate-400">Veřejný rozcestník zůstává oddělený od soukromých dat případu.</p>
              <Link href={PUBLIC_HUB[record.kind]} className="site-button-secondary mt-4 w-full">Otevřít rozcestník</Link>
            </section>

            <section className="site-content-card rounded-2xl p-6" aria-labelledby="data-title">
              <h2 id="data-title" className="font-serif text-xl font-bold italic text-white">Vaše data</h2>
              <p className="mt-2 text-xs leading-6 text-slate-400">Case Engine ukládá pracovní stav a minimum údajů nutných pro pokračování. Obsah původní smlouvy sem automaticky nekopírujeme.</p>
              <div className="mt-4 grid gap-2">
                <button type="button" disabled={busy} onClick={() => void exportCase()} className="site-button-secondary">Exportovat případ</button>
                <button type="button" disabled={busy} onClick={async () => {
                  if (!window.confirm('Zneplatnit všechny odkazy ke všem vašim případům včetně přehledu Moje případy? Přístup se uzavře. Nový odkaz si vyžádáte e-mailem.')) return;
                  if (await applyAction({ type: 'revoke_links' }, 'Odkazy byly zneplatněny.')) {
                    forgetCaseAccess(caseId);
                    forgetCaseHubAccess();
                    setState('unauthorized');
                  }
                }} className="site-button-secondary">Zneplatnit všechny moje odkazy</button>
                <button type="button" disabled={busy} onClick={() => {
                  if (window.confirm('Opravdu chcete tento případ smazat? Tuto akci nelze vrátit.')) void applyAction({ type: 'delete' });
                }} className="rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/10">Smazat případ</button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="site-content-card rounded-2xl p-4"><dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</dt><dd className="mt-1 text-sm font-semibold text-white">{value}</dd></div>;
}

function Status({ message }: { message: Message }) {
  const classes = message.tone === 'error'
    ? 'border-red-500/30 bg-red-500/10 text-red-200'
    : message.tone === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      : 'border-white/10 bg-white/[0.03] text-slate-300';
  return <div role="status" className={`mb-6 rounded-2xl border p-4 text-sm ${classes}`}>{message.text}</div>;
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="site-page"><div className="mx-auto max-w-2xl px-6 py-20"><Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-[#e2c77b]">← SmlouvaHned</Link><h1 className="mt-6 font-serif text-3xl font-bold italic text-white">{title}</h1><div className="mt-5">{children}</div></div></main>;
}
