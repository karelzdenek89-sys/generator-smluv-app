import { renderEmailShell, sendTransactionalEmail, type TransactionalEmailResult } from '@/lib/email/transactional';
import { SITE_URL } from '@/lib/seo/site';
import type { CaseKind, CaseRecord, CaseReminder } from './types';
import { formatCzechDate, getStageDefinition } from './workflow';

export const CASE_PAGE_PATH = '/moje-zakazka';
export const CASE_HUB_ITEM_PATH = '/moje-pripady/pripad';

function baseUrl(): string { return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, ''); }
export function casePagePath(kind: CaseKind): string { return kind === 'work_order' ? CASE_PAGE_PATH : CASE_HUB_ITEM_PATH; }

export function buildCaseUrl(caseId: string, token: string, extra?: Record<string, string>, kind: CaseKind = 'work_order'): string {
  const params = new URLSearchParams({ id: caseId, ...(extra ?? {}) });
  return `${baseUrl()}${casePagePath(kind)}?${params.toString()}#access=${encodeURIComponent(token)}`;
}

const CASE_NOUN: Record<CaseKind, { one: string; title: string }> = {
  work_order: { one: 'zakázka', title: 'Zakázka' },
  rental: { one: 'pronájem', title: 'Pronájem' },
  vehicle_transfer: { one: 'převod vozidla', title: 'Převod vozidla' },
};

export async function sendCaseAccessEmail(options: {
  to: string;
  record: Pick<CaseRecord, 'id' | 'kind' | 'title'>;
  url: string;
  idempotencyKey: string;
  reason: 'created' | 'requested';
}): Promise<TransactionalEmailResult> {
  const noun = CASE_NOUN[options.record.kind];
  // Compatibility: old callers may still build the default /moje-zakazka URL.
  const targetUrl = options.record.kind === 'work_order'
    ? options.url
    : options.url.replace(`${CASE_PAGE_PATH}?`, `${CASE_HUB_ITEM_PATH}?`);
  const heading = options.reason === 'created' ? `${noun.title} je uložený` : `Návratový odkaz: ${noun.one}`;
  const intro = options.reason === 'created'
    ? `Případ „${options.record.title}“ je uložen. Tímto odkazem se k němu můžete vracet bez hesla a bez registrace.`
    : `Požádali jste o návratový odkaz k případu „${options.record.title}“. Odkaz je platný 30 dní.`;
  return sendTransactionalEmail({
    to: options.to,
    subject: options.reason === 'created' ? `${noun.title}: ${options.record.title}` : `Návratový odkaz: ${options.record.title}`,
    idempotencyKey: options.idempotencyKey,
    html: renderEmailShell({
      heading, intro, ctaLabel: 'Otevřít případ', ctaUrl: targetUrl,
      secondary: 'Odkaz nikomu nepřeposílejte — kdo jej má, může vidět stav případu. V případu můžete všechny odkazy kdykoli zneplatnit.',
      footerNote: 'Pokud jste o případ nežádali, tento e-mail ignorujte. Aktivní případ se bez další změny po 12 měsících automaticky smaže; uzavřený dříve. SmlouvaHned je softwarový nástroj pro standardizované dokumenty a administrativní workflow, neposkytuje právní služby.',
    }),
    text: `${heading}\n\n${intro}\n\nOtevřít případ: ${targetUrl}\n\nOdkaz nikomu nepřeposílejte.`,
  });
}

function reminderAction(record: Pick<CaseRecord, 'kind' | 'stage'>, days: number): string {
  if (record.kind === 'rental') {
    if (record.stage === 'rental_handover_in') return 'Připravte předávací podklady a zkontrolujte stav bytu, měřidla a klíče.';
    if (record.stage === 'rental_renewal') return 'Rozhodněte, zda nájem prodloužíte, a připravte odpovídající písemný dokument.';
    if (record.stage === 'rental_ending' || record.stage === 'rental_handover_out') return 'Připravte převzetí bytu a podklady k vypořádání kauce.';
    return days <= 7 ? 'Zkontrolujte nejbližší krok pronájmu a připravte související podklady.' : 'Ověřte, zda se nemění podmínky nebo termíny pronájmu.';
  }
  if (record.kind === 'vehicle_transfer') {
    if (record.stage === 'vehicle_handover') return 'Připravte předání vozidla, klíčů a dokladů a zkontrolujte související checklist.';
    if (record.stage === 'vehicle_registration') return 'Zkontrolujte podklady potřebné k přepisu a kdo jej dokončí.';
    if (record.stage === 'vehicle_issue') return 'Shromážděte smlouvu, předávací podklady a komunikaci; složitější spor může vyžadovat individuální právní posouzení.';
    return 'Zkontrolujte nejbližší praktický krok převodu vozidla.';
  }
  if (record.stage === 'closed') return 'Zakázka je uzavřená — připomínku můžete ignorovat nebo zkontrolovat archiv dokumentů.';
  if (record.stage === 'defects') return 'Zkontrolujte, zda byly vady odstraněny, a potvrďte převzetí opravy zápisem.';
  return days <= 7 ? 'Připravte předávací protokol a domluvte termín přejímky díla.' : 'Zkontrolujte průběh prací a zapište případné změny rozsahu nebo vícepráce.';
}

export function reminderCopy(record: Pick<CaseRecord, 'kind' | 'title' | 'deadline' | 'stage'>, reminder: Pick<CaseReminder, 'offsetDays'>) {
  const deadline = formatCzechDate(record.deadline);
  const days = reminder.offsetDays;
  const when = days === 1 ? 'zítra' : `za ${days} dní`;
  const stage = getStageDefinition(record.kind, record.stage);
  const label = record.kind === 'work_order' ? 'Termín dokončení' : 'Důležitý termín';
  return {
    subject: `${record.title}: ${label.toLowerCase()} ${deadline} je ${when}`,
    heading: `${label} je ${when}`,
    intro: `Případ „${record.title}“ má termín ${deadline}. Aktuální fáze: ${stage?.label ?? 'aktivní'}.`,
    action: reminderAction(record, days),
  };
}

export async function sendReminderEmail(options: { to: string; record: CaseRecord; reminder: CaseReminder; url: string }): Promise<TransactionalEmailResult> {
  const copy = reminderCopy(options.record, options.reminder);
  return sendTransactionalEmail({
    to: options.to,
    subject: copy.subject,
    idempotencyKey: `case-reminder-${options.record.id}-${options.reminder.id}`,
    html: renderEmailShell({
      heading: copy.heading, intro: copy.intro, secondary: `Doporučený další krok: ${copy.action}`,
      ctaLabel: 'Otevřít případ', ctaUrl: options.url,
      footerNote: 'Připomínky lze v případu kdykoli vypnout. Toto je funkční upozornění k uloženému případu, nikoli obchodní sdělení. SmlouvaHned je softwarový nástroj pro standardizované dokumenty a administrativní workflow, neposkytuje právní služby.',
    }),
    text: `${copy.heading}\n\n${copy.intro}\n\nDoporučený další krok: ${copy.action}\n\nOtevřít případ: ${options.url}`,
  });
}
