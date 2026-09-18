import { createHash, randomBytes } from 'node:crypto';
import { redis } from '@/lib/redis';
import { renderEmailShell, sendTransactionalEmail, type TransactionalEmailResult } from '@/lib/email/transactional';
import { SITE_URL } from '@/lib/seo/site';
import { issueCaseAccessToken } from './access';
import { getAccessGeneration, issueAccessGeneration } from './access-generation';
import { casePagePath } from './emails';
import { listCasesForEmail } from './store';
import { getStageDefinition } from './workflow';

const HUB_TOKEN_RE = /^[a-f0-9]{64}$/;
const HUB_TTL_SECONDS = 60 * 60 * 24 * 30;
const HUB_PATH = '/moje-pripady';

type HubAccessRecord = {
  email: string;
  issuedAt: string;
  generation?: string;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function hubKey(token: string): string {
  return `case:hub-access:${hashToken(token)}`;
}

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
}

export function buildCaseHubUrl(token: string): string {
  return `${baseUrl()}${HUB_PATH}#access=${encodeURIComponent(token)}`;
}

export async function issueCaseHubAccessToken(email: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  await redis.set(hubKey(token), { email: email.trim().toLowerCase(), issuedAt: new Date().toISOString(), generation: await issueAccessGeneration(email) } satisfies HubAccessRecord, { ex: HUB_TTL_SECONDS });
  return token;
}

export async function resolveCaseHubAccess(token: string): Promise<HubAccessRecord | null> {
  if (!HUB_TOKEN_RE.test(token)) return null;
  const record = await redis.get<HubAccessRecord>(hubKey(token));
  if (!record || typeof record.email !== 'string' || !record.email.includes('@')) return null;
  if ((record.generation ?? 'legacy') !== await getAccessGeneration(record.email)) return null;
  return { ...record, generation: record.generation ?? 'legacy' };
}

export async function sendCaseHubAccessEmail(email: string): Promise<{ cases: number; result: TransactionalEmailResult | null }> {
  const records = await listCasesForEmail(email, 50);
  if (records.length === 0) return { cases: 0, result: null };
  const token = await issueCaseHubAccessToken(email);
  const result = await sendTransactionalEmail({
    to: email,
    subject: 'Moje případy — bezpečný návratový odkaz',
    idempotencyKey: `case-hub-${hashToken(token).slice(0, 24)}`,
    html: renderEmailShell({
      heading: 'Vaše případy na jednom místě',
      intro: 'Bezpečným odkazem otevřete přehled uložených případů, termínů a dalších kroků.',
      ctaLabel: 'Otevřít Moje případy',
      ctaUrl: buildCaseHubUrl(token),
      secondary: 'Odkaz je platný 30 dní. Nikomu jej nepřeposílejte — funguje jako přístupový klíč k přehledu vašich případů.',
      footerNote: 'Tento e-mail je funkční zpráva vyžádaná pro přístup k uloženým případům, nikoli newsletter ani obchodní sdělení.',
    }),
    text: `Moje případy\n\nOtevřít přehled: ${buildCaseHubUrl(token)}\n\nOdkaz platí 30 dní a nikomu jej nepřeposílejte.`,
  });
  return { cases: records.length, result };
}

export async function buildCaseHubPayload(email: string, generation: string, offset = 0) {
  const records = await listCasesForEmail(email, 51, offset);
  return Promise.all(records.map(async (record) => {
    const token = await issueCaseAccessToken(record.id, email, undefined, generation);
    const stage = getStageDefinition(record.kind, record.stage);
    const nextTask = record.tasks.find((task) => !task.done);
    return {
      id: record.id,
      kind: record.kind,
      title: record.title,
      stage: record.stage,
      stageLabel: stage?.label ?? 'Aktivní',
      deadline: record.deadline,
      nextStep: nextTask?.label ?? stage?.nextSteps[0] ?? (record.stage === 'closed' ? 'Případ je uzavřený' : 'Pokračovat v případu'),
      documentsCount: record.documents.filter((document) => document.status === 'ready').length,
      token,
      path: `${casePagePath(record.kind)}?id=${encodeURIComponent(record.id)}`,
      updatedAt: record.updatedAt,
    };
  }));
}
