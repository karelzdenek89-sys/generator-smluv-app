process.env.SMLOUVAHNED_FAKE_REDIS = '1';

import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { memoryRedis } from '@/lib/redis-memory';
import {
  LEGAL_AUDIENCES,
  LEGAL_AUDIENCE_HUBS,
  LEGAL_CHANGES,
  LEGAL_CHANGE_STATUSES,
  LEGAL_CHANGE_STATUS_LABELS,
  getLegalChangesForAudience,
  getLegalChangesNeedingReview,
  getRadarVerifiedAt,
} from '@/lib/legal/radar';
import { getAllDocumentLegalVersions } from '@/lib/legal/document-versions';
import { ANSWER_FIRST_ARTICLES, articleHref } from '@/lib/portal/articles';
import { HOMEPAGE_SITUATIONS, PORTAL_SITUATIONS, getPortalSituation } from '@/lib/portal/situations';
import { PORTAL_TOOLS } from '@/lib/portal/tools';
import {
  buildCommercialIntent,
  getDeliverablePartners,
  getPartnerDeliveryStates,
  persistCommercialIntent,
  summarizeCommercialIntents,
  withdrawCommercialIntent,
} from '@/lib/partners/commercial-intent';
import { PARTNER_LEAD_CONSENT_VERSION } from '@/lib/partners/lead-consent';
import { SUBSCRIPTION_PLANS, isSubscriptionPlanPurchasable } from '@/lib/subscriptions/plans';
import { isFeatureEnabled } from '@/lib/feature-flags';

let checks = 0;
function ok(condition: unknown, message: string) {
  checks += 1;
  assert.ok(condition, message);
}
function eq<T>(actual: T, expected: T, message: string) {
  checks += 1;
  assert.deepEqual(actual, expected, message);
}

const ROOT = join(__dirname, '..');
const MARKETING_BANNED = [/neprůstřeln/i, /maximální ochran/i, /nejlepší smlouv/i, /ušetř(íte|ete) tisíce/i, /schválen[oa]? advokátem/i];

function walkPages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walkPages(path) : entry === 'page.tsx' ? [path] : [];
  });
}

/** Interní odkaz musí vést na existující route (app/<path>/page.tsx, dynamickou routu nebo kotvu). */
function routeExists(href: string): boolean {
  const [pathname] = href.split('#');
  const [cleanPath] = pathname.split('?');
  if (cleanPath === '/' || cleanPath === '') return true;
  const segments = cleanPath.replace(/^\//, '').split('/');
  let dir = join(ROOT, 'app');
  for (const segment of segments) {
    const direct = join(dir, segment);
    if (existsSync(direct) && statSync(direct).isDirectory()) {
      dir = direct;
      continue;
    }
    const dynamic = readdirSync(dir).find((entry) => /^\[.+\]$/.test(entry) && statSync(join(dir, entry)).isDirectory());
    if (!dynamic) return false;
    dir = join(dir, dynamic);
  }
  return existsSync(join(dir, 'page.tsx'));
}

function dynamicSlugKnown(href: string): boolean {
  const [pathname] = href.split('#');
  if (pathname.startsWith('/nastroje/')) return PORTAL_TOOLS.some((tool) => `/nastroje/${tool.slug}` === pathname);
  if (pathname.startsWith('/zmeny-2027/')) return LEGAL_AUDIENCES.some((key) => LEGAL_AUDIENCE_HUBS[key].href === pathname);
  for (const section of ['zakazka', 'zamestnavam', 'pro-pronajimatele', 'prodej-vozidla']) {
    if (pathname.startsWith(`/${section}/`)) return ANSWER_FIRST_ARTICLES.some((article) => articleHref(article) === pathname);
  }
  if (pathname.startsWith('/blog/')) return existsSync(join(ROOT, 'app', pathname.replace(/^\//, ''), 'page.tsx'));
  return true;
}

function assertInternalLink(href: string, context: string) {
  if (href.startsWith('http')) return;
  ok(routeExists(href), `${context}: link ${href} must resolve to a route`);
  ok(dynamicSlugKnown(href), `${context}: link ${href} must resolve to a known slug`);
}

function testLegalRadar() {
  ok(LEGAL_CHANGES.length >= 8, 'radar has a meaningful number of entries');
  eq(new Set(LEGAL_CHANGES.map((change) => change.key)).size, LEGAL_CHANGES.length, 'radar keys unique');
  eq([...LEGAL_CHANGE_STATUSES], ['in_force', 'approved_pending', 'in_progress', 'proposal'], 'four explicit statuses');
  eq(LEGAL_CHANGE_STATUS_LABELS.in_force, 'PLATÍ', 'status label PLATÍ');
  eq(LEGAL_CHANGE_STATUS_LABELS.approved_pending, 'SCHVÁLENO – ČEKÁ NA ÚČINNOST', 'status label approved');
  eq(LEGAL_CHANGE_STATUS_LABELS.in_progress, 'PROJEDNÁVÁ SE', 'status label in progress');
  eq(LEGAL_CHANGE_STATUS_LABELS.proposal, 'NÁVRH', 'status label proposal');

  for (const change of LEGAL_CHANGES) {
    const ctx = `radar ${change.key}`;
    ok(change.audiences.length > 0, `${ctx}: audience`);
    ok(change.sources.length > 0, `${ctx}: at least one official source`);
    for (const source of change.sources) {
      ok(/^https:\/\/(www\.)?(e-sbirka\.cz|mpsv\.gov\.cz|cssz\.gov\.cz|financnisprava\.gov\.cz|psp\.cz|mpo\.gov\.cz|eur-lex\.europa\.eu|ec\.europa\.eu|transport\.ec\.europa\.eu|mfcr\.gov\.cz)\//.test(source.href), `${ctx}: source ${source.href} is an official domain`);
    }
    ok(/^\d{4}-\d{2}-\d{2}$/.test(change.verifiedAt), `${ctx}: verifiedAt ISO`);
    ok(change.whatChanges.length > 0 && change.whatToDo.length > 0, `${ctx}: what changes / what to do`);
    if (change.status === 'in_force') ok(change.effectiveFrom !== null && change.effectiveFrom <= '2026-09-17', `${ctx}: in_force must have a past effective date`);
    if (change.status === 'in_progress' || change.status === 'proposal') ok(change.effectiveFrom === null, `${ctx}: unapproved change must not carry an effective date`);
    if (change.status === 'approved_pending') ok(change.effectiveFrom !== null && change.effectiveFrom > '2026-09-17', `${ctx}: approved_pending has a future effective date`);
    ok(!/nová právní úprava platí|již platí/i.test(change.summary) || change.status === 'in_force', `${ctx}: unapproved change is not described as in force`);
    for (const document of change.affectedDocuments) assertInternalLink(document.href, ctx);
    for (const pattern of MARKETING_BANNED) ok(!pattern.test(`${change.title} ${change.summary}`), `${ctx}: no banned marketing phrase`);
  }

  for (const audience of LEGAL_AUDIENCES) {
    const hub = LEGAL_AUDIENCE_HUBS[audience];
    ok(hub.href === `/zmeny-2027/${hub.slug}`, `${audience}: hub href matches slug`);
    ok(getLegalChangesForAudience(audience).length >= 1, `${audience}: hub has entries`);
    for (const link of hub.nextSteps) assertInternalLink(link.href, `hub ${audience}`);
    ok(hub.metaDescription.length <= 200, `${audience}: meta description length`);
  }
  const employers = getLegalChangesForAudience('employers');
  ok(employers.findIndex((c) => c.status === 'in_force') < employers.findIndex((c) => c.status === 'in_progress'), 'in-force entries sort before in-progress');
  eq(getLegalChangesNeedingReview(new Date('2026-09-17T00:00:00Z')).length, 0, 'nothing needs review on verification day');
  ok(getLegalChangesNeedingReview(new Date('2027-01-01T00:00:00Z')).length === LEGAL_CHANGES.length, 'everything needs review after 90 days');
  ok(/^\d{4}-\d{2}-\d{2}$/.test(getRadarVerifiedAt()), 'radar verified date');

  const versions = getAllDocumentLegalVersions(new Date('2026-09-17T00:00:00Z'));
  eq(versions.length, 14, 'every contract type has a legal version');
  ok(versions.every((version) => version.version && version.validFrom && version.verifiedAt), 'versions carry version/valid_from/verified_at');
  ok(versions.every((version) => version.status === 'published'), 'templates published as of release');
  ok(versions.find((version) => version.contractType === 'employment')!.relatedChanges.length >= 2, 'employment template links radar changes');
}

function testSituationsAndTools() {
  eq(PORTAL_SITUATIONS.length, 7, 'seven situations incl. radar');
  eq(HOMEPAGE_SITUATIONS.length, 6, 'homepage shows six action situations');
  for (const situation of PORTAL_SITUATIONS) {
    const ctx = `situation ${situation.key}`;
    ok(situation.primaryCta.label.length > 3 && !/ukázk/i.test(situation.primaryCta.label), `${ctx}: primary CTA is an action`);
    assertInternalLink(situation.hubHref, ctx);
    assertInternalLink(situation.primaryCta.href, ctx);
    for (const link of [...situation.documents, ...situation.tools, ...situation.articles]) assertInternalLink(link.href, ctx);
    if (situation.caseFlow) assertInternalLink(situation.caseFlow.href, ctx);
  }
  eq(getPortalSituation('zakazka').primaryCta.label, 'Začít zakázku', 'zakázka CTA copy');

  eq(PORTAL_TOOLS.length, 14, 'fourteen tools (13 checklists + 1 wizard)');
  eq(new Set(PORTAL_TOOLS.map((tool) => tool.slug)).size, PORTAL_TOOLS.length, 'tool slugs unique');
  for (const tool of PORTAL_TOOLS) {
    const ctx = `tool ${tool.slug}`;
    ok(tool.answer.length > 80, `${ctx}: answer-first summary`);
    ok(tool.metaDescription.length <= 220, `${ctx}: meta description length`);
    ok(tool.sources.length > 0, `${ctx}: sources`);
    assertInternalLink(tool.primaryDocument.href, ctx);
    for (const link of tool.related) assertInternalLink(link.href, ctx);
    if (tool.kind === 'checklist') {
      const keys = tool.sections.flatMap((section) => section.items.map((item) => item.key));
      eq(new Set(keys).size, keys.length, `${ctx}: item keys unique`);
      ok(keys.length >= 8, `${ctx}: enough items to be useful`);
      for (const section of tool.sections) for (const item of section.items) if (item.link) assertInternalLink(item.link.href, ctx);
    } else {
      const questionKeys = new Set(tool.questions.map((question) => question.key));
      const outcomeKeys = new Set(tool.outcomes.map((outcome) => outcome.key));
      ok(questionKeys.has(tool.start), `${ctx}: start question exists`);
      for (const question of tool.questions) {
        for (const option of question.options) {
          if (option.next.startsWith('result:')) ok(outcomeKeys.has(option.next.slice(7)), `${ctx}: outcome ${option.next} exists`);
          else ok(questionKeys.has(option.next), `${ctx}: next question ${option.next} exists`);
        }
      }
      for (const outcome of tool.outcomes) {
        ok(outcome.documents.length > 0, `${ctx}: outcome ${outcome.key} offers a document`);
        for (const link of [...outcome.documents, ...outcome.related]) assertInternalLink(link.href, ctx);
      }
      ok(tool.outcomes.some((outcome) => outcome.caution), `${ctx}: at least one outcome flags individual assessment`);
    }
    for (const pattern of MARKETING_BANNED) ok(!pattern.test(`${tool.title} ${tool.description} ${tool.answer}`), `${ctx}: no banned marketing phrase`);
  }
}

function testArticles() {
  eq(ANSWER_FIRST_ARTICLES.length, 11, 'eleven answer-first pages');
  eq(new Set(ANSWER_FIRST_ARTICLES.map(articleHref)).size, ANSWER_FIRST_ARTICLES.length, 'article hrefs unique');
  for (const article of ANSWER_FIRST_ARTICLES) {
    const ctx = `article ${articleHref(article)}`;
    ok(article.answer.length >= 120 && article.answer.length <= 700, `${ctx}: concise answer first`);
    ok(article.steps.length >= 3 && article.risks.length >= 2, `${ctx}: steps and risks`);
    ok(article.sources.length > 0, `${ctx}: official sources`);
    ok(article.documents.length > 0, `${ctx}: leads to a document`);
    ok(article.metaTitle.length <= 70, `${ctx}: meta title ≤ 70`);
    ok(article.metaDescription.length <= 230, `${ctx}: meta description ≤ 230`);
    ok(/^\d{4}-\d{2}-\d{2}$/.test(article.verifiedAt), `${ctx}: verified date`);
    for (const link of [...article.documents, ...article.tools, ...article.related]) assertInternalLink(link.href, ctx);
    for (const pattern of MARKETING_BANNED) ok(!pattern.test(`${article.title} ${article.answer}`), `${ctx}: no banned marketing phrase`);
    ok(!/advokát[a-z]* (SmlouvaHned|Karel)/i.test(article.answer), `${ctx}: never presents the operator as a lawyer`);
  }
  ok(walkPages(join(ROOT, 'app', 'zakazka')).length >= 2, 'zakazka routes exist');
}

async function testCommercialIntents() {
  memoryRedis.reset();
  const partners = getPartnerDeliveryStates();
  ok(partners.length >= 1, 'partner delivery states defined');
  ok(partners.every((partner) => ['enabled', 'temporary_pause', 'disabled'].includes(partner.state)), 'explicit partner states');
  eq(getDeliverablePartners('legal_consultation').length, 0, 'no partner deliverable by default (fail closed)');
  eq(isFeatureEnabled('commercialIntents'), false, 'commercial intents flag off by default');
  eq(isFeatureEnabled('caseEngine'), true, 'case engine on by default');

  const base = {
    subjectType: 'email' as const,
    subjectValue: 'Jan@Example.cz',
    category: 'legal_consultation',
    requestedService: 'Posouzení sporu o vady díla',
    urgency: 'month',
    budgetBand: '50k_250k',
    broadLocation: 'praha',
    contact: { email: 'jan@example.cz', phone: '+420123456789', contact_name: 'Jan' },
    partnerId: 'legal_consultation_placeholder',
    purpose: 'Kontaktování ohledně právní konzultace k vadám díla',
    fieldsShared: ['email'],
    consentTextVersion: PARTNER_LEAD_CONSENT_VERSION,
  };
  const built = buildCommercialIntent(base);
  ok(built.ok, 'valid intent builds');
  if (!built.ok) return;
  eq(built.lead.status, 'pending', 'lead pending when partner not ready');
  eq(built.lead.deliveryMethod, 'none', 'no delivery method when partner disabled');
  eq(Object.keys(built.intent.contact), ['email'], 'only consented fields stored');
  ok(!built.intent.subjectRef.includes('@'), 'subject reference is hashed');
  eq(built.consent.fieldsShared, ['email'], 'consent lists shared fields');
  eq(built.consent.consentTextVersion, PARTNER_LEAD_CONSENT_VERSION, 'consent version recorded');

  for (const [field, value] of [
    ['category', 'marketing_database'],
    ['urgency', 'yesterday'],
    ['partnerId', 'unknown_partner'],
    ['consentTextVersion', 'old'],
    ['fieldsShared', []],
    ['purpose', ''],
  ] as const) {
    const invalid = buildCommercialIntent({ ...base, [field]: value });
    ok(!invalid.ok && invalid.field === (field === 'partnerId' ? 'partnerId' : field), `intent rejects invalid ${field}`);
  }
  const missingContact = buildCommercialIntent({ ...base, contact: { phone: '123' }, fieldsShared: ['email'] });
  ok(!missingContact.ok && missingContact.field === 'email', 'consented field must be provided');

  await persistCommercialIntent(built);
  const summary = await summarizeCommercialIntents();
  eq(summary.intents, 1, 'summary counts the intent');
  eq(summary.leadsPending, 1, 'summary counts pending lead');
  eq(summary.leadsSent, 0, 'nothing sent');
  ok(!JSON.stringify(summary).includes('jan@example.cz'), 'summary contains no contact data');

  ok(await withdrawCommercialIntent(built.intent.id, built.consent.id, built.lead.id), 'withdrawal succeeds');
  const stored = await memoryRedis.get<{ contact: Record<string, string>; status: string }>(`partner:intent:${built.intent.id}`);
  eq(stored?.contact, {}, 'contact erased on withdrawal');
  eq(stored?.status, 'withdrawn', 'intent withdrawn');
  eq(await withdrawCommercialIntent(built.intent.id, 'wrong', built.lead.id), false, 'mismatched ids rejected');

  eq(SUBSCRIPTION_PLANS.length, 3, 'three recurring plans defined');
  for (const plan of SUBSCRIPTION_PLANS) eq(isSubscriptionPlanPurchasable(plan.key), false, `${plan.key} is not purchasable without a subscription backend`);
}

async function main() {
  testLegalRadar();
  testSituationsAndTools();
  testArticles();
  await testCommercialIntents();
  console.log(`Portal content tests passed (${checks} checks: legal radar, situations, tools, articles, commercial intents, subscriptions).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
