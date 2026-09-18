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
import { GROWTH_ARTICLES } from '@/lib/portal/articles-growth';
import { GROWTH_GSC_SNAPSHOTS, buildGrowthReport, listGrowthUrls, summarizeGrowthReport } from '@/lib/growth/indexation';
import { PRICE_TRANSPARENCY_LINE } from '@/lib/price-reveal-copy';
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
  const approvedIndex = employers.findIndex((c) => c.key === 'minimalni-mzda-2027');
  ok(approvedIndex > 0 && employers.slice(0, approvedIndex).every(c => c.status === 'in_force'), 'current rules precede the approved future minimum wage');
  eq(employers[approvedIndex].status, 'approved_pending', 'MPSV announcement is approved, not yet in force');
  eq(employers[approvedIndex].effectiveFrom, '2027-01-01', 'minimum wage applies from January 2027');
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
  eq(ANSWER_FIRST_ARTICLES.length, 28, 'answer-first pages: 11 core + 17 growth');
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

function testGrowthClusters() {
  // Growth Engine (2026-09-17): každý cluster má odpověď → postup → nástroj → dokument.
  const expected: Record<string, readonly string[]> = {
    zakazka: [
      'smlouva-s-remeslnikem', 'remeslnik-nedodrzel-termin', 'reklamace-dila', 'zaloha-remeslnikovi', 'viceprace-bez-souhlasu',
      'jak-potvrdit-viceprace', 'zmena-ceny-dila', 'predavaci-protokol-stavby', 'prevzeti-dila-s-vadami', 'odpovednost-za-vady-dila',
      'odstoupeni-od-smlouvy-o-dilo',
    ],
    zamestnavam: [
      'pracovni-smlouva', 'dpp', 'osvc', 'mlcenlivost', 'zmena-podminek', 'ukonceni', 'pracovni-smlouva-2027', 'dpp-2027',
      'nastup-zamestnance', 'dohoda-o-skonceni-pracovniho-pomeru',
    ],
    'prodej-vozidla': [
      'vady-ojeteho-auta', 'postup-prodeje-auta', 'koupe-ojeteho-auta', 'odpovednost-prodavajiciho-za-vady', 'skryta-vada-auta',
      'plna-moc-prepis-auta',
    ],
  };
  for (const [section, slugs] of Object.entries(expected)) {
    const actual = ANSWER_FIRST_ARTICLES.filter((article) => article.section === section).map((article) => article.slug);
    for (const slug of slugs) ok(actual.includes(slug), `growth cluster ${section}: ${slug} published`);
  }
  for (const article of ANSWER_FIRST_ARTICLES) {
    const ctx = `article ${articleHref(article)}`;
    ok(article.metaTitle.length <= 60, `${ctx}: meta title ≤ 60 (SERP)`);
    ok(article.metaDescription.length >= 120 && article.metaDescription.length <= 165, `${ctx}: meta description 120–165`);
    // Nástroj je povinný pro růstové stránky; chybí zatím jen checklist ukončení pracovního poměru (backlog).
    if (GROWTH_ARTICLES.includes(article) && article.slug !== 'dohoda-o-skonceni-pracovniho-pomeru') {
      ok(article.tools.length > 0, `${ctx}: links a free tool`);
    }
    const hubArticles = getPortalSituation(article.situation)?.articles ?? [];
    const section = article.section;
    ok(
      hubArticles.some((link) => link.href === articleHref(article)) || section === 'zamestnavam' || section === 'pro-pronajimatele',
      `${ctx}: reachable from its situation hub`,
    );
  }

  // Měření: každá růstová URL je v registru přesně jednou a bez odhadů.
  const urls = listGrowthUrls();
  eq(new Set(urls.map((url) => url.path)).size, urls.length, 'growth URL register unique');
  ok(urls.length >= 28 + 14 + 3 + 5, 'growth register covers articles, tools, hubs and radar');
  for (const article of ANSWER_FIRST_ARTICLES) ok(urls.some((url) => url.path === articleHref(article)), `growth register: ${articleHref(article)}`);
  for (const snapshot of GROWTH_GSC_SNAPSHOTS) {
    ok(urls.some((url) => url.path === snapshot.path), `GSC snapshot ${snapshot.path} maps to a growth URL`);
    ok(/^\d{4}-\d{2}-\d{2}$/.test(snapshot.observedAt) && snapshot.observedDays > 0, `GSC snapshot ${snapshot.path} dated`);
  }
  const report = buildGrowthReport([
    { landingPage: '/zakazka/zaloha-remeslnikovi', trafficSource: 'portal_page', landingViews: 10, productCtaClicks: 3, toolStarts: 2, builderStarts: 1, purchases: 1, purchaseRevenueCzk: 99 },
    { landingPage: '/zakazka/zaloha-remeslnikovi', trafficSource: 'blog_article', landingViews: 99, productCtaClicks: 9, toolStarts: 9, builderStarts: 9, purchases: 9, purchaseRevenueCzk: 999 },
  ]);
  const row = report.find((entry) => entry.path === '/zakazka/zaloha-remeslnikovi');
  eq(row && [row.landingViews, row.ctaClicks, row.toolStarts, row.documentStarts, row.purchases, row.revenueCzk], [10, 3, 2, 1, 1, 99], 'growth report joins only portal_page funnel');
  eq(row?.snapshot, null, 'new URL has no GSC snapshot (no guessing)');
  const summary = summarizeGrowthReport(report).find((entry) => entry.cluster === 'zakazka');
  eq(summary?.purchases, 1, 'cluster summary aggregates purchases');

  // Věcné opravy po nezávislém review (2026-09-17): přepis vozidla podle MD, zaručená mzda podle MPSV.
  const vehicleTexts = [
    ...PORTAL_TOOLS.filter((tool) => tool.situation === 'auto').flatMap((tool) => [tool.answer, tool.metaDescription, ...(tool.kind === 'checklist' ? tool.sections.flatMap((section) => section.items.map((item) => item.label)) : [])]),
    ...ANSWER_FIRST_ARTICLES.filter((article) => article.situation === 'auto').flatMap((article) => [article.answer, ...article.steps.map((step) => step.text), ...article.risks.map((risk) => risk.text)]),
  ].join('\n');
  ok(!/zelen(ou|á) kart[ua](?![\s\S]{0,80}nepředkládá)/i.test(vehicleTexts), 'vehicle content never lists the green card as a document to present');
  ok(!/ne starší než (1 rok|rok)/i.test(vehicleTexts), 'vehicle content no longer claims a one-year evidenční kontrola');
  ok(/nepředkládá/.test(vehicleTexts) && /2 roky|dva roky/.test(vehicleTexts), 'vehicle content states MD rules: no green card, EK valid 2 years');
  const transferTool = PORTAL_TOOLS.find((tool) => tool.slug === 'prepis-vozidla-co-potrebuji');
  ok(transferTool?.sources.some((source) => source.href.includes('md.gov.cz')), 'transfer checklist cites the Ministry of Transport');
  const wageTexts = [
    ...PORTAL_TOOLS.filter((tool) => tool.situation === 'zamestnavam').flatMap((tool) => [tool.answer, ...(tool.kind === 'checklist' ? tool.sections.flatMap((section) => section.items.map((item) => item.label)) : [])]),
    ...ANSWER_FIRST_ARTICLES.filter((article) => article.situation === 'zamestnavam').flatMap((article) => [article.answer, ...article.steps.map((step) => step.text), ...article.risks.map((risk) => risk.text)]),
    ...LEGAL_CHANGES.flatMap((change) => [...change.whatChanges, ...change.whatToDo]),
  ].join('\n');
  ok(!/zaručen(á|é|ou) mzd[aeuy](?![\s\S]{0,160}(neplatí|zastaral))/i.test(wageTexts), 'employer content never presents zaručená mzda as a live obligation in the business sphere');
  ok(!/skupin[ya]? prací(?![\s\S]{0,160}(neplatí|zastaral))/i.test(wageTexts), 'employer content no longer sends employers to wage groups');

  // Jednotná cenová věta.
  eq(PRICE_TRANSPARENCY_LINE, 'Standard od 99 Kč · Rozšířená varianta od 199 Kč. Konkrétní doporučení podle zadané situace uvidíte před objednávkou.', 'single price transparency line');
}

async function main() {
  testLegalRadar();
  testSituationsAndTools();
  testArticles();
  testGrowthClusters();
  await testCommercialIntents();
  console.log(`Portal content tests passed (${checks} checks: legal radar, situations, tools, articles, growth clusters, commercial intents, subscriptions).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
