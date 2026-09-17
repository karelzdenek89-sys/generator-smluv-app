import { renderEmailShell, sendTransactionalEmail, type TransactionalEmailResult } from '@/lib/email/transactional';
import { SITE_URL } from '@/lib/seo/site';
import type { CaseRecord, CaseReminder } from './types';
import { formatCzechDate } from './workflow';
import { WORK_ORDER_STAGE_DEFINITIONS } from './workflow';

export const CASE_PAGE_PATH = '/moje-zakazka';

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
}

/** Odkaz k případu: identifikátor v query, tajný token pouze ve fragmentu. */
export function buildCaseUrl(caseId: string, token: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams({ id: caseId, ...(extra ?? {}) });
  return `${baseUrl()}${CASE_PAGE_PATH}?${params.toString()}#access=${encodeURIComponent(token)}`;
}

export async function sendCaseAccessEmail(options: {
  to: string;
  caseTitle: string;
  url: string;
  idempotencyKey: string;
  reason: 'created' | 'requested';
}): Promise<TransactionalEmailResult> {
  const heading = options.reason === 'created' ? 'Vaše zakázka je založena' : 'Návratový odkaz k zakázce';
  const intro =
    options.reason === 'created'
      ? `Zakázka „${options.caseTitle}“ je uložena. Tímto odkazem se k ní kdykoli vrátíte — bez hesla a bez registrace.`
      : `Požádali jste o návratový odkaz k zakázce „${options.caseTitle}“. Odkaz je platný 30 dní.`;
  return sendTransactionalEmail({
    to: options.to,
    subject: options.reason === 'created' ? `Moje zakázka: ${options.caseTitle}` : `Návratový odkaz: ${options.caseTitle}`,
    idempotencyKey: options.idempotencyKey,
    html: renderEmailShell({
      heading,
      intro,
      ctaLabel: 'Otevřít zakázku',
      ctaUrl: options.url,
      secondary: 'Odkaz nikomu nepřeposílejte — kdo jej má, vidí stav zakázky. V zakázce můžete všechny odkazy kdykoli zneplatnit.',
      footerNote: 'Pokud jste o zakázku nežádali, tento e-mail ignorujte. Zakázka bez aktivity se po 12 měsících automaticky smaže.',
    }),
    text: `${heading}\n\n${intro}\n\nOtevřít zakázku: ${options.url}\n\nOdkaz nikomu nepřeposílejte.`,
  });
}

export function reminderCopy(record: Pick<CaseRecord, 'title' | 'deadline' | 'stage'>, reminder: Pick<CaseReminder, 'offsetDays'>) {
  const deadline = formatCzechDate(record.deadline);
  const days = reminder.offsetDays;
  const when = days === 1 ? 'zítra' : `za ${days} dní`;
  const stage = WORK_ORDER_STAGE_DEFINITIONS[record.stage];
  const action =
    record.stage === 'closed'
      ? 'Zakázka je uzavřená — připomínku můžete ignorovat nebo si zkontrolovat archiv dokumentů.'
      : record.stage === 'defects'
        ? 'Zkontrolujte, zda byly vady odstraněny, a potvrďte převzetí opravy zápisem.'
        : days <= 7
          ? 'Připravte předávací protokol a domluvte termín přejímky díla.'
          : 'Zkontrolujte průběh prací a zapište případné změny rozsahu nebo vícepráce.';
  return {
    subject: `Zakázka „${record.title}“: termín ${deadline} je ${when}`,
    heading: `Termín dokončení je ${when}`,
    intro: `Zakázka „${record.title}“ má termín dokončení ${deadline}. Aktuální fáze: ${stage.label}.`,
    action,
  };
}

export async function sendReminderEmail(options: {
  to: string;
  record: CaseRecord;
  reminder: CaseReminder;
  url: string;
}): Promise<TransactionalEmailResult> {
  const copy = reminderCopy(options.record, options.reminder);
  return sendTransactionalEmail({
    to: options.to,
    subject: copy.subject,
    idempotencyKey: `case-reminder-${options.record.id}-${options.reminder.id}`,
    html: renderEmailShell({
      heading: copy.heading,
      intro: copy.intro,
      secondary: `Doporučený další krok: ${copy.action}`,
      ctaLabel: 'Otevřít zakázku a připravit dokument',
      ctaUrl: options.url,
      footerNote: 'Připomínky lze v zakázce kdykoli vypnout. Toto je funkční upozornění k vaší zakázce, nikoli obchodní sdělení.',
    }),
    text: `${copy.heading}\n\n${copy.intro}\n\nDoporučený další krok: ${copy.action}\n\nOtevřít zakázku: ${options.url}`,
  });
}
