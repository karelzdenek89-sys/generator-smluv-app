import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { CZECH_BLOG_ARTICLES } from '../lib/blog-articles';
import { czechBlogSitemapEntries } from '../lib/seo/sitemap-blog';
import { SITE_URL } from '../lib/seo/site';
import {
  EMPLOYMENT_WORK_ELIGIBILITY_NOTICE,
  EN_LEGAL_KEY_TERMS,
  EXPAT_CONTRACT_TYPES,
  LEGAL_NOTICE,
  normalizeLocale,
  withLocale,
} from '../lib/locale';
import {
  getLeaseFormUi,
  LEASE_FORM_PRIMARY_CZECH_MARKERS,
  LEASE_FORM_PRIMARY_EN_MARKERS,
} from '../lib/i18n/lease-form';
import { getLocalizedIncludedItems } from '../lib/i18n/pricing-locale';
import { buildLeaseContractSectionsEn } from '../lib/i18n/lease-contract-en';
import { buildLeaseContractSectionsUk } from '../lib/i18n/lease-contract-uk';
import { buildEmploymentContractSectionsEn } from '../lib/i18n/employment-contract-en';
import { buildDppContractSectionsEn } from '../lib/i18n/dpp-contract-en';
import { buildExpatTranslationSections, hasExpatTranslationAnnex } from '../lib/i18n/expat-translation-registry';
import { LEASE_USE_NOTICE_EN } from '../lib/i18n/safety-copy';
import { renderContractPdf } from '../lib/pdf';
import { extractPdfText } from '../lib/pdf-text';
import type { StoredContractData } from '../lib/contracts';
import { EXPAT_CONTRACT_CAPABILITY } from '../lib/locale';
import {
  getBuilderNoticeLabels,
  getLocalizedBuilderCopy,
  getOtherContractsForLocale,
  OTHER_CONTRACTS_CZECH_ONLY_HINT,
} from '../lib/i18n/expat-locale-copy';
import {
  buildLeasePlainPreview,
  buildLeasePreviewSections,
  getContractPreviewLabels,
} from '../lib/i18n/lease-preview';
import { getExpatBlogArticle } from '../lib/i18n/expat-blog-articles';
import {
  getCarFormUi,
  getDppFormUi,
  getEmploymentFormUi,
  getPoaFormUi,
  getSubleaseFormUi,
} from '../lib/i18n/expat-builder-forms';
import { formatRemoteWorkForContract, REMOTE_WORK_KEYS } from '../lib/i18n/employment-remote-work';
import { buildExpatPreviewSections } from '../lib/i18n/expat-contract-preview';

const root = process.cwd();
const read = (path: string) => readFileSync(`${root}/${path}`, 'utf8');

const MARKETING_SURFACE_FILES = [
  'app/[locale]/page.tsx',
  'app/components/BuilderLocaleNotice.tsx',
  'lib/locale.ts',
  'lib/pdf.ts',
] as const;

const FORBIDDEN_MARKETING = [
  'bilingual pdf',
  'bilingual output',
  'czech-english pdf',
  'english translation included',
  'translated contract',
  'bilingvní pdf',
  'česko-anglická smlouva',
  'překlad smlouvy',
  'certified translation guaranteed',
  'official translation guaranteed',
  'guaranteed for authorities',
  'accepted by foreign police',
  'visa-ready',
  'suitable for immigration proceedings',
  'immigration advice provided',
];

function testLocalePropagation() {
  assert.equal(withLocale('/najem', 'en'), '/najem?lang=en');
  assert.equal(withLocale('/pracovni', 'ua'), '/pracovni?lang=ua');
  assert.equal(normalizeLocale('vi'), 'cs');
  assert.equal(normalizeLocale('vn'), 'cs');
  assert.equal(normalizeLocale('ua'), 'ua');
  assert.equal(normalizeLocale('ukr'), 'ua');
  assert.equal(normalizeLocale('uk'), 'ua');
  assert.equal(normalizeLocale('ru'), 'cs');
  assert.equal(normalizeLocale('de'), 'cs');
  assert.equal(normalizeLocale('garbage'), 'cs');

  const landing = read('app/[locale]/page.tsx');
  assert.match(landing, /Most used contracts for foreigners in the Czech Republic/);
  assert.match(landing, /English-guided form|English-guided forms are available for rental/i);
  assert.match(landing, /Available in Czech/);
  assert.match(landing, /redirect\('\/en'\)/);
  assert.match(landing, /іноземців у Чехії/);
  assert.match(landing, /getExpatSeoHref/);
  assert.match(read('lib/i18n/expat-seo-landings.ts'), /rental-agreement-czech-republic/);
  assert.doesNotMatch(landing, /\/ru/);
  assert.doesNotMatch(landing, /\/de/);
  assert.doesNotMatch(landing, /\/vn/);
  assert.doesNotMatch(landing, /🇻🇳/);
  assert.match(landing, /item\.flag/);

  const homepage = read('app/page.tsx');
  assert.match(homepage, /Potřebujete smlouvu v cizím jazyce/);
  assert.match(homepage, /LanguageSwitcher current="cs"/);
  assert.match(homepage, /ExpatEntryLinks/);
  assert.match(read('lib/i18n/locales.ts'), /nativeName/);
  assert.match(read('app/components/LanguageSwitcher.tsx'), /m\.flag/);
  assert.match(homepage, /Потрібен договір іншою мовою/);
  assert.doesNotMatch(homepage, /\/vn/);
  assert.doesNotMatch(homepage, /Bạn cần|ngôn ngữ|label: 'VI'/);

  const builderLocale = read('app/components/BuilderLocaleNotice.tsx');
  assert.match(builderLocale, /queryLocale/);
  assert.match(builderLocale, /readBuilderLocaleFromBrowser/);
  assert.match(read('lib/locale.ts'), /preferred-locale/);
  assert.doesNotMatch(builderLocale, /readCookie/);

  const proxy = read('proxy.ts');
  assert.match(proxy, /langQuery === 'cs'/);
  assert.match(proxy, /preferred-locale', 'cs'/);

  const sitemap = read('app/sitemap.ts');
  assert.match(read('lib/seo/site.ts'), /https:\/\/www\.smlouvahned\.cz/);
  assert.match(read('public/robots.txt'), /https:\/\/www\.smlouvahned\.cz\/sitemap\.xml/);
  assert.match(read('next.config.ts'), /securityHeaders/);
  assert.match(read('next.config.ts'), /redirects\(\)/);
  assert.match(sitemap, /EXPAT_BUILDER_SITEMAP/);
  assert.match(sitemap, /getExpatSeoPageHreflangAlternates/);
  assert.match(sitemap, /expatBlogSitemapEntries/);
  assert.match(sitemap, /czechBlogSitemapEntries/);
  assert.match(read('lib/blog-articles.ts'), /dpp-vzor-zdarma-2026/);
  assert.doesNotMatch(sitemap, /cs: `\$\{BASE_URL\}\/`,\s*\n\s*en: `\$\{BASE_URL\}\/en\/\$\{slug\}`/);
  assert.doesNotMatch(sitemap, /\/ru/);
  assert.doesNotMatch(sitemap, /\/de/);
  assert.doesNotMatch(sitemap, /\/vn/);

  const seoPage = read('app/[locale]/[expatSeoSlug]/page.tsx');
  assert.match(seoPage, /title: \{ absolute:/);
  assert.match(seoPage, /\/opengraph-image/);
  assert.doesNotMatch(seoPage, /DEFAULT_OG_IMAGE/);

  const expatBlogPage = read('app/blog/expat/[slug]/page.tsx');
  assert.match(expatBlogPage, /getExpatBlogHreflangAlternates/);
  assert.match(expatBlogPage, /inLanguage=\{lang\}/);
  assert.match(read('app/blog/expat/[slug]/opengraph-image.tsx'), /getExpatBlogArticle/);
  assert.match(read('app/blog/expat/[slug]/opengraph-image.tsx'), /status: 404/);
  assert.match(read('app/[locale]/opengraph-image.tsx'), /renderExpatHubOgImage/);
  assert.match(read('app/[locale]/opengraph-image.tsx'), /status: 404/);
  assert.match(read('app/[locale]/[expatSeoSlug]/opengraph-image.tsx'), /getExpatSeoLandingBySlug/);
  const rootLayout = read('app/layout.tsx');
  const localeLayout = read('app/[locale]/layout.tsx');
  assert.doesNotMatch(rootLayout, /next\/headers/);
  assert.match(rootLayout, /RouteChrome/);
  assert.match(read('app/components/RouteChrome.tsx'), /usePathname/);
  assert.doesNotMatch(read('app/components/ForeignVisitorBanner.tsx'), /next\/headers/);
  assert.match(read('app/page.tsx'), /organizationSchema/);
  assert.match(localeLayout, /ExpatLocaleSchemas/);
  assert.match(localeLayout, /document\.documentElement\.lang/);
  for (const retired of ['de', 'ru', 'vn', 'uk']) {
    const retiredLayout = read(`app/${retired}/layout.tsx`);
    assert.match(retiredLayout, /index: false/);
    assert.doesNotMatch(retiredLayout, /makeLandingMetadata/);
  }
  assert.match(proxy, /LOCALIZED_BUILDER_PATHS/);
  assert.match(proxy, /public pages stay cacheable/);
}

function testNoMisleadingBilingualMarketing() {
  const blob = MARKETING_SURFACE_FILES.map(read).join('\n').toLowerCase();
  for (const phrase of FORBIDDEN_MARKETING) {
    assert.ok(!blob.includes(phrase), `Misleading marketing phrase found: ${phrase}`);
  }
}

function testSupportedBuilders() {
  const requiredEnglishTitles = [
    'Rental Agreement',
    'Sublease Agreement',
    'Employment Contract',
    'DPP Agreement',
    'Power of Attorney',
    'Car Purchase Agreement',
  ];

  const enByType: Record<string, string> = {
    lease: 'Rental Agreement',
    sublease: 'Sublease Agreement',
    employment: 'Employment Contract',
    dpp: 'DPP Agreement',
    power_of_attorney: 'Power of Attorney',
    car_sale: 'Car Purchase Agreement',
  };
  for (const title of requiredEnglishTitles) {
    const type = Object.entries(enByType).find(([, t]) => t === title)?.[0];
    assert.ok(type, `Unknown title in test list: ${title}`);
    assert.equal(getLocalizedBuilderCopy(type as 'lease', 'en')?.title, title);
  }
  assert.equal(getLocalizedBuilderCopy('lease', 'ua')?.title, 'Договір оренди');

  assert.deepEqual(EXPAT_CONTRACT_TYPES, [
    'lease',
    'sublease',
    'employment',
    'dpp',
    'power_of_attorney',
    'car_sale',
  ]);
}

function testOrdersApiSecurity() {
  const ordersRoute = read('app/api/orders/route.ts');
  assert.match(ordersRoute, /email-only enumeration/i);
  assert.match(ordersRoute, /resolveEmailFromPortalToken/);
  assert.doesNotMatch(
    ordersRoute,
    /get\('email'\)[\s\S]*return NextResponse\.json\(\{ orders \}\)/,
  );
  const customerZone = read('app/zakaznicka-zona/page.tsx');
  assert.doesNotMatch(customerZone, /\/api\/orders\?email=/);
  assert.match(customerZone, /hash\.replace/);
  assert.match(customerZone, /JSON\.stringify\(\{ access \}\)/);
  assert.match(ordersRoute, /export async function POST/);
}

function testUnsupportedContracts() {
  const noticeComponent = `${read('app/components/BuilderLocaleNotice.tsx')}\n${read('lib/locale.ts')}`;
  assert.match(noticeComponent, /getUnsupportedFormNotice/);
  assert.match(noticeComponent, /Czech-only form|Лише чеська форма/);
}

function testLegalCopy() {
  const allCopy = [
    LEGAL_NOTICE.en,
    read('lib/locale.ts'),
    read('app/[locale]/page.tsx'),
    read('app/components/BuilderLocaleNotice.tsx'),
  ].join('\n');

  for (const term of EN_LEGAL_KEY_TERMS) {
    assert.ok(allCopy.includes(term), `Missing legal safety term: ${term}`);
  }
}

function testLegalAccuracyRegressions() {
  const csLease = getLeaseFormUi('cs');
  const enLease = getLeaseFormUi('en');
  const uaLease = getLeaseFormUi('ua');
  for (const copy of [csLease.form.depositWarning, enLease.form.depositWarning, uaLease.form.depositWarning]) {
    assert.match(copy, /3|trojnásob|three/i, 'lease deposit warning must use the 3x statutory cap');
    assert.doesNotMatch(copy, /6|six|šestinásob/i, 'lease deposit warning must not use the old 6x cap');
  }

  const najem = read('app/najem/page.tsx');
  assert.match(najem, /depositNum > rentNum \* 3/);
  assert.doesNotMatch(najem, /depositNum > rentNum \* 6|rentNum \* 6/);

  const preview = read('lib/i18n/lease-preview.ts');
  const annex = read('lib/i18n/expat-pdf-annex.ts');
  assert.match(preview, /primary Czech wording/);
  assert.match(annex, /primary Czech wording/);
  assert.doesNotMatch(`${preview}\n${annex}`, /legally binding|CZECH RENTAL AGREEMENT \(binding\)|обов.?язков/i);

  const carBlog = read('app/blog/kupni-smlouva-na-auto-2026/page.tsx');
  const pdf = read('lib/pdf.ts');
  const contracts = read('lib/contracts.ts');
  assert.match(carBlog, /10 pracovních dnů/);
  assert.match(pdf, /10 pracovních dnů/);
  assert.match(contracts, /10 pracovních dnů[\s\S]{0,220}zápis změny vlastníka/);
  assert.doesNotMatch(carBlog, /15 dnů|15 dní/);
  assert.doesNotMatch(pdf, /zápis změny vlastníka[\s\S]{0,160}15/);
  assert.doesNotMatch(contracts, /zápis změny vlastníka[\s\S]{0,220}15/);

  const dppPages = [
    read('app/dohoda-o-provedeni-prace/page.tsx'),
    read('app/blog/dpp-dohoda-provedeni-prace/page.tsx'),
    read('app/blog/dpp-vzor-zdarma-2026/page.tsx'),
    read('app/blog/dpp-dpc-porovnani-2026/page.tsx'),
    read('app/pracovni-smlouva/page.tsx'),
    read('lib/pdf.ts'),
  ].join('\n');
  assert.match(dppPages, /12 000 Kč/);
  assert.doesNotMatch(dppPages, /11 500 Kč|11500|Do 12 000 Kč|Do 12 000 Kč\/měs/);
  assert.match(dppPages, /Do 11 999 Kč|účast od 12 000 Kč|nedosáhne rozhodného příjmu 12 000 Kč/);

  const dppGuide = read('app/blog/dpp-dohoda-provedeni-prace/page.tsx');
  const dppFreeGuide = read('app/blog/dpp-vzor-zdarma-2026/page.tsx');
  const dppBuilder = read('app/dpp/page.tsx');
  assert.doesNotMatch(dppGuide, /20,80 Kč|nejpozději v den nástupu/);
  assert.match(dppGuide, /Od 1\. července 2026|předregistraci/);
  assert.match(dppGuide, /účast na nemocenském pojištění|výkonu rozhodnutí či exekuci/);
  assert.doesNotMatch(dppFreeGuide, /Odvod od příjmu 4 500 Kč\/měsíc/);
  assert.match(dppFreeGuide, /hranice 4 500 Kč platí pro DPČ/);
  assert.match(dppFreeGuide, /před zahájením práce/);
  assert.doesNotMatch(dppBuilder, /m\?sto|v\?\?i|\?{4,}|Tla\?\?/);
}

function testLeaseEnBuilderUi() {
  const en = getLeaseFormUi('en');
  const najem = read('app/najem/page.tsx');

  assert.equal(withLocale('/najem', 'en'), '/najem?lang=en');
  assert.equal(en.isEnglish, true);
  assert.equal(en.form.sections.landlord.title, 'Landlord');
  assert.equal(en.form.placeholders.fullName, 'Full name');
  assert.ok(en.notices.legal.includes('Czech wording prevails'));
  assert.equal(en.notices.leaseUse, LEASE_USE_NOTICE_EN);

  const enBlob = JSON.stringify(en);
  for (const marker of LEASE_FORM_PRIMARY_CZECH_MARKERS) {
    assert.ok(!enBlob.includes(marker), `EN lease UI still contains Czech marker: ${marker}`);
  }

  assert.match(najem, /getLeaseFormUi\(builderLocale\)/);
  assert.match(najem, /ui\.form\.placeholders\.fullName/);
  assert.match(najem, /ui\.notices\.legal/);
  assert.match(najem, /lang: builderLocale/);
  assert.match(najem, /ui\.isEnglish/);

  const landing = read('app/[locale]/page.tsx');
  assert.match(landing, /coreContractCopy/);
  assert.match(landing, /withLocale\(contract\.href, locale\)/);
}

function testLeaseEnCheckoutItems() {
  const items = getLocalizedIncludedItems('lease', 'basic', null, 'en');
  const blob = items.join(' ').toLowerCase();
  assert.ok(items.length > 0);
  assert.ok(blob.includes('pdf document'));
  assert.ok(!blob.includes('vyplnění dokumentu'));
  assert.ok(!blob.includes('přehledná struktura'));
}

function testLeaseUkCheckoutItems() {
  const items = getLocalizedIncludedItems('lease', 'basic', null, 'ua');
  const blob = items.join(' ').toLowerCase();
  assert.ok(items.length > 0);
  assert.ok(blob.includes('pdf-документ'));
  assert.ok(!blob.includes('pdf document'));
  assert.ok(!blob.includes('vyplnění dokumentu'));
}

function testLeaseLocaleRegression() {
  assert.equal(normalizeLocale('garbage'), 'cs');
  assert.equal(normalizeLocale('vi'), 'cs');
  assert.equal(normalizeLocale('vn'), 'cs');

  const cs = getLeaseFormUi('cs');
  assert.equal(cs.isEnglish, false);
  assert.equal(cs.form.sections.landlord.title, 'Pronajímatel');

  const najem = read('app/najem/page.tsx');
  assert.match(najem, /useBuilderLocale/);
  assert.doesNotMatch(
    najem,
    /placeholder=\{?['"]Celé jméno['"]\}?/,
    'Hardcoded Czech placeholder should not remain in najem builder',
  );
}

function testUnsupportedContractFromEnLanding() {
  const landing = read('app/[locale]/page.tsx');
  assert.match(landing, /getOtherContractsForLocale/);
  assert.match(landing, /OTHER_CONTRACTS_CZECH_ONLY_HINT/);
  const enOther = getOtherContractsForLocale('en');
  assert.ok(enOther.some((c) => c.title === 'Donation Agreement'));
  assert.match(OTHER_CONTRACTS_CZECH_ONLY_HINT.en, /Czech-only/i);
}

function testEmploymentEligibilityInBuilders() {
  const safety = read('lib/i18n/safety-copy.ts');
  const pracovni = read('app/pracovni/page.tsx');
  const dpp = read('app/dpp/page.tsx');
  const notice = read('app/components/BuilderLocaleNotice.tsx');

  assert.ok(safety.includes('EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN'));
  assert.ok(
    EMPLOYMENT_WORK_ELIGIBILITY_NOTICE.includes(
      'does not verify whether a foreign national is allowed to work',
    ),
  );
  assert.ok(
    EMPLOYMENT_WORK_ELIGIBILITY_NOTICE.includes(
      'Before signing, the parties should verify',
    ),
  );
  assert.match(pracovni, /BuilderLocaleNotice contractType="employment"/);
  assert.match(dpp, /BuilderLocaleNotice contractType="dpp"/);
  assert.match(notice, /getEmploymentWorkEligibilityNotice/);
}

function testLeaseEnglishContractSections() {
  const data: StoredContractData = {
    contractType: 'lease',
    tier: 'basic',
    lang: 'en',
    landlordName: 'Jan Novak',
    tenantName: 'John Doe',
    flatAddress: 'Prague',
    rentAmount: '20000',
    startDate: '2026-06-01',
    duration: 'fixed',
    endDate: '2027-05-31',
    depositAmount: '20000',
  };
  const sections = buildLeaseContractSectionsEn(data);
  assert.ok(sections.some((s) => s.title.includes('PARTIES')));
  assert.ok(sections.some((s) => s.body.some((line) => line.includes('Landlord:'))));
  assert.match(read('lib/pdf.ts'), /buildExpatTranslationSections/);
  assert.match(read('lib/pdf.ts'), /renderExpatTranslationAnnex/);
  const ukSections = buildLeaseContractSectionsUk(data);
  assert.ok(ukSections.some((s) => s.title.includes('СТОРОНИ')));
  const enText = sections.flatMap((section) => section.body).join(' ');
  const ukText = ukSections.flatMap((section) => section.body).join(' ');
  assert.match(enText, /Section 2285/);
  assert.match(ukText, /§ 2285/);
  assert.doesNotMatch(`${enText}\n${ukText}`, /Section 2230|§ 2230|within one month|протягом місяця/);
  assert.doesNotMatch(read('lib/contracts-i18n/lease.ts'), /§ 2230/);
  assert.doesNotMatch(read('app/najemni-smlouva/page.tsx'), /vrátit do jednoho měsíce/);
}

function testExpatCapabilityDifferentiation() {
  assert.match(EXPAT_CONTRACT_CAPABILITY.en.lease, /English-guided form/i);
  assert.match(EXPAT_CONTRACT_CAPABILITY.en.lease, /explanatory English annex/i);
  assert.match(EXPAT_CONTRACT_CAPABILITY.ua.lease, /українськ/i);
  assert.match(EXPAT_CONTRACT_CAPABILITY.en.employment, /English-guided form/i);
  assert.match(EXPAT_CONTRACT_CAPABILITY.ua.dpp, /огляд основних умов/i);
  assert.match(EXPAT_CONTRACT_CAPABILITY.en.sublease, /English-guided form/i);
  assert.match(EXPAT_CONTRACT_CAPABILITY.en.power_of_attorney, /English-guided form/i);
  assert.match(EXPAT_CONTRACT_CAPABILITY.en.car_sale, /English-guided form/i);
}

function testExpatBuilderFormsLocalized() {
  const czechLandingMarkers = ['Sestaveno dle', 'Vyplňte údaje dokumentu', 'Zobrazí se náhled'];
  for (const locale of ['en', 'ua'] as const) {
    const sub = getSubleaseFormUi(locale);
    assert.equal(sub.isLocalized, true);
    assert.ok(sub.fields.landlordName);
    assert.ok(sub.landing.benefits.length >= 3);
    assert.ok(sub.landing.faq.length >= 2);
    for (const m of czechLandingMarkers) {
      assert.ok(!JSON.stringify(sub.landing).includes(m), `sublease ${locale} still has CS: ${m}`);
    }
    const emp = getEmploymentFormUi(locale);
    assert.ok(emp.page.placeholders.jobTitle);
    assert.equal(emp.remoteWorkValues.full, REMOTE_WORK_KEYS.full);
    const dpp = getDppFormUi(locale);
    assert.ok(dpp.fields.employerIco);
    assert.ok(dpp.options.durationFixed);
    const poa = getPoaFormUi(locale);
    assert.equal(poa.isLocalized, true);
    assert.ok(poa.fields.principalName);
    const car = getCarFormUi(locale);
    assert.equal(car.isLocalized, true);
    assert.ok(car.fields.sellerName);
  }
  assert.equal(formatRemoteWorkForContract(REMOTE_WORK_KEYS.full, 'en'), 'full remote (100 %)');
  assert.equal(formatRemoteWorkForContract('plný remote (100 %)', 'cs'), 'plný home office (100 %)');
  const subleasePreview = buildExpatPreviewSections('sublease', 'en', {
    contractType: 'sublease',
    tier: 'basic',
    lang: 'en',
    landlordName: 'Jan Novak',
    tenantName: 'John Doe',
    flatAddress: 'Prague',
    rentAmount: '15000',
    startDate: '2026-06-01',
    duration: 'fixed',
    endDate: '2027-05-31',
  } as StoredContractData);
  assert.ok(subleasePreview.length > 0);
}

function testExpatContractTranslationBuilders() {
  assert.equal(hasExpatTranslationAnnex('employment', 'en'), true);
  assert.equal(hasExpatTranslationAnnex('gift', 'en'), false);

  const employment: StoredContractData = {
    contractType: 'employment',
    tier: 'basic',
    lang: 'en',
    employerName: 'ACME s.r.o.',
    employeeName: 'Jane Doe',
    jobTitle: 'Developer',
    workPlace: 'Prague',
    startDate: '2026-06-01',
    salary: '50000',
    salaryType: 'monthly',
  };
  const enSections = buildEmploymentContractSectionsEn(employment);
  assert.ok(enSections.some((s) => s.title === 'I. PARTIES'));
  assert.ok(buildExpatTranslationSections('dpp', 'en', { ...employment, contractType: 'dpp', taskDescription: 'IT support', workPlace: 'Prague', estimatedHours: '40' }).length > 3);
  assert.ok(buildDppContractSectionsEn({ ...employment, contractType: 'dpp', taskDescription: 'Task', workPlace: 'Brno', estimatedHours: '20' }).some((s) => s.title.includes('TASK')));
}

function testLeaseUkBuilderUi() {
  const uaForm = getLeaseFormUi('ua');
  assert.equal(withLocale('/najem', 'ua'), '/najem?lang=ua');
  assert.equal(uaForm.isEnglish, true);
  assert.equal(uaForm.form.sections.landlord.title, 'Орендодавець');
  assert.equal(uaForm.form.placeholders.fullName, 'Повне ім’я');
  assert.ok(uaForm.notices.legal.includes('чеськ'));
  assert.equal(uaForm.form.title, 'Заповніть дані документа');
  assert.equal(uaForm.paymentModal.includedHeading, 'Включено');

  const ukSurface = [
    uaForm.form.title,
    uaForm.form.sections.landlord.title,
    uaForm.form.sections.tenant.title,
    uaForm.sidebar.generateCta,
    uaForm.paymentModal.unlockHeading,
    uaForm.checkoutSummary.title,
    uaForm.tierSelector.heading,
    ...uaForm.landing.benefits.map((b) => b.text),
  ].join('\n');
  for (const marker of LEASE_FORM_PRIMARY_CZECH_MARKERS) {
    assert.ok(!ukSurface.includes(marker), `UA lease UI still contains Czech marker: ${marker}`);
  }
  for (const marker of LEASE_FORM_PRIMARY_EN_MARKERS) {
    assert.ok(!ukSurface.includes(marker), `UA lease UI still contains English marker: ${marker}`);
  }
}

function testBuilderNoticeUkCopy() {
  const notice = read('app/components/BuilderLocaleNotice.tsx');
  assert.match(notice, /getLeaseUseNotice/);
  assert.match(notice, /getEmploymentWorkEligibilityNotice/);
  assert.match(notice, /getBuilderNoticeLabels/);
  assert.equal(getBuilderNoticeLabels('ua').steps, 'Кроки');
  assert.equal(getBuilderNoticeLabels('ua').keyFields, 'Ключові поля');
}

function testUkLandingLocalizedCards() {
  const landing = read('app/[locale]/page.tsx');
  assert.match(landing, /coreContractCopy/);
  assert.match(landing, /getLocalizedBuilderCopy/);
  assert.match(landing, /getOtherContractsForLocale/);
  assert.equal(getLocalizedBuilderCopy('lease', 'ua')?.title, 'Договір оренди');
  assert.equal(getLocalizedBuilderCopy('gift', 'ua')?.title, 'Договір дарування');
}

async function testLeaseUkPdfTextContent() {
  const minimalLease: StoredContractData = {
    contractType: 'lease',
    tier: 'basic',
    lang: 'ua',
    addOns: ['bilingual_annex'],
    landlordName: 'Орендодавець Тест',
    tenantName: 'Орендар Тест',
    flatAddress: 'Praha 1',
    rentAmount: '20000',
    startDate: '2026-06-01',
    endDate: '2027-05-31',
    duration: 'fixed',
    handoverDate: '2026-06-01',
  };
  const pdf = await renderContractPdf(minimalLease);
  const text = await extractPdfText(pdf);
  const lower = text.toLowerCase();
  assert.match(lower, /чеський договір з пояснювальним|чеський договір/i);
  assert.match(lower, /пояснювальний додаток українською/);
  assert.match(lower, /i\. сторони|сторони/);
  assert.match(lower, /орендодавець тест/);
}

function testLeasePreviewHelpers() {
  const form = {
    landlordName: 'Jan Novák',
    tenantName: 'John Doe',
    flatAddress: 'Praha',
    rentAmount: '15000',
    utilityAmount: '3000',
    depositAmount: '30000',
    startDate: '2026-01-01',
    handoverDate: '2026-01-01',
    duration: 'indefinite' as const,
    endDate: '',
    landlordId: '',
    landlordAddress: '',
    landlordOP: '',
    tenantId: '',
    tenantAddress: '',
    tenantOP: '',
    flatLayout: '',
    flatArea: '',
    flatUnitNumber: '',
    ownershipSheet: '',
    cadastralArea: '',
    parcelNumber: '',
    floor: '',
    paymentDay: '15',
    bankAccount: '',
    variableSymbol: '',
    keysCount: '2',
    electricityMeter: '',
    electricityMeterSerial: '',
    gasMeter: '',
    gasMeterSerial: '',
    waterMeter: '',
    waterMeterSerial: '',
    hotWaterMeter: '',
    hotWaterMeterSerial: '',
    equipmentList: '',
    knownDefects: '',
    allowPets: false,
    allowSmoking: false,
    allowAirbnb: false,
    strictPenalties: true,
    inspectionAllowed: true,
    maxOccupants: '2',
    businessUseAllowed: false,
    includeInflationIndexation: false,
  };

  const csSections = buildLeasePreviewSections('cs', form, null);
  const csTitles = csSections.map(s => s.title).join(' ');
  assert.match(csTitles, /SMLUVNÍ STRANY|strany/i);

  const enSections = buildLeasePreviewSections('en', form, null);
  const enTitles = enSections.map(s => s.title).join(' ');
  assert.match(enTitles, /Parties/i);

  const enPlain = buildLeasePlainPreview('en', form, 18000);
  assert.match(enPlain, /CZECH RENTAL AGREEMENT \(primary Czech wording\)/i);
  assert.doesNotMatch(enPlain, /binding/i);
  assert.match(enPlain, /John Doe/);

  const csPlain = buildLeasePlainPreview('cs', form, 18000);
  assert.match(csPlain, /NÁJEMNÍ SMLOUVA/i);

  assert.ok(getContractPreviewLabels('en')?.kicker);
  assert.equal(getContractPreviewLabels('cs'), null);
}

function testSeoRentalLandingPage() {
  const page = read('lib/i18n/expat-seo-landings.ts');
  assert.match(page, /Rental Agreement in the Czech Republic/);
  const pageFlat = page.replace(/\s+/g, ' ');
  assert.match(
    pageFlat,
    /Fill in the rental form in English and generate a Czech rental agreement with an explanatory English translation annex/,
  );
  assert.match(page, /Create rental agreement/);
  assert.match(page, /builderHref: `\$\{builderPath\}\?lang=\$\{locale\}`/);
  assert.match(page, /not a law firm/i);
  assert.match(page, /not certified or official/i);
  assert.match(page, /does not guarantee acceptance by any authority/i);
  assert.match(page, /explanatory English translation annex/i);
  assert.match(page, /EXPAT_CONTRACT_ROUTES\[contractKey\]/);
  assert.match(page, /Договір оренди в Чехії/);
  assert.match(page, /пояснювальним українським додатком/);

  const forbidden = [
    'visa-ready',
    'accepted by foreign police',
    'certified translation guaranteed',
    'we provide legal advice',
    'immigration advice provided',
  ];
  const lower = page.toLowerCase();
  for (const phrase of forbidden) {
    assert.ok(!lower.includes(phrase), `SEO page contains forbidden phrase: ${phrase}`);
  }
}

function testLocalizedBlogArticles() {
  const articles = read('lib/blog-articles.ts');
  const expatArticles = read('lib/i18n/expat-blog-articles.ts');
  const expatView = read('app/components/blog/ExpatBlogArticleView.tsx');
  const sitemap = read('app/sitemap.ts');
  const landing = read('app/[locale]/page.tsx');

  const enRental = getExpatBlogArticle('rental-agreement-czech-republic-guide-en');
  const uaRental = getExpatBlogArticle('rental-agreement-czech-republic-guide-ua');
  assert.ok(enRental);
  assert.ok(uaRental);
  assert.equal(enRental.builderHref, '/najem?lang=en');
  assert.equal(uaRental.builderHref, '/najem?lang=ua');
  assert.equal(enRental.seoLandingHref, '/en/rental-agreement-czech-republic');
  assert.equal(uaRental.seoLandingHref, '/ua/rental-agreement-czech-republic');
  const enEmployment = getExpatBlogArticle('employment-contract-czech-republic-guide-en');
  assert.ok(enEmployment);
  assert.equal(enEmployment.seoLandingHref, '/en/employment-contract-czech-republic');
  assert.match(enRental.disclaimer.body, /not a substitute/i);
  assert.match(enRental.sections.map((section) => section.paragraphs.join(' ')).join(' '), /not a certified translation/i);

  assert.match(articles, /EXPAT_BLOG_META/);
  assert.match(articles, /EXPAT_BLOG_ARTICLES_LIST/);
  assert.match(expatArticles, /rental-agreement-czech-republic-guide-en/);
  assert.match(expatArticles, /rental-agreement-czech-republic-guide-ua/);
  assert.match(expatArticles, /employment-contract-czech-republic-guide-en/);
  assert.match(expatArticles, /power-of-attorney-czech-republic-guide-ua/);
  assert.match(expatView, /withLocale\(EXPAT_CONTRACT_ROUTES\[item\.contract\], locale\)/);
  assert.match(expatView, /item\.seoHref/);
  assert.match(expatArticles, /getExpatSeoHref/);
  assert.match(read('lib/locale.ts'), /readBuilderLocaleFromBrowser/);
  assert.match(read('lib/packages.ts'), /getStripePriceIdForCheckout/);
  assert.match(expatArticles, /getExpatBlogAlternateSlug/);
  assert.match(sitemap, /expatBlogSitemapEntries/);
  assert.match(read('app/[locale]/layout.tsx'), /ExpatLocaleSchemas/);
  assert.match(landing, /\/blog\/expat\/foreigners-czech-contracts-guide-en/);
  assert.match(landing, /\/blog\/expat\/foreigners-czech-contracts-guide-ua/);
  assert.doesNotMatch(expatArticles.toLowerCase(), /visa-ready|accepted by foreign police|certified translation guaranteed|official translation guaranteed/);
}

function testExpatSeoLandingPages() {
  const seo = read('lib/i18n/expat-seo-landings.ts');
  const seoPage = read('app/[locale]/[expatSeoSlug]/page.tsx');
  const sitemap = read('app/sitemap.ts');
  assert.match(seo, /employment-contract-czech-republic/);
  assert.match(seo, /dpp-agreement-czech-republic/);
  assert.match(seo, /sublease-agreement-czech-republic/);
  assert.match(seo, /power-of-attorney-czech-republic/);
  assert.match(seo, /car-sale-agreement-czech-republic/);
  assert.match(seoPage, /getExpatSeoLandingBySlug/);
  assert.match(seoPage, /EXPAT_SEO_SLUGS/);
  assert.match(seoPage, /\/opengraph-image/);
  assert.doesNotMatch(seoPage, /DEFAULT_OG_IMAGE/);
  assert.match(read('app/[locale]/[expatSeoSlug]/opengraph-image.tsx'), /renderExpatSeoOgImageBySlug/);
  assert.match(sitemap, /EXPAT_SEO_SLUGS/);
  assert.match(sitemap, /EXPAT_BUILDER_SITEMAP\.map/);
  assert.match(sitemap, /getExpatSeoPageHreflangAlternates/);
  assert.match(read('app/components/seo/ExpatContractSeoPage.tsx'), /blogGuideHref/);
  assert.match(read('app/najem/layout.tsx'), /getExpatContractHreflangAlternates\('lease'\)/);
}

function testE2eFlowStaticPaths() {
  const seo = read('lib/i18n/expat-seo-landings.ts');
  const seoPage = read('app/[locale]/[expatSeoSlug]/page.tsx');
  const najem = read('app/najem/page.tsx');
  assert.match(seo, /builderHref: `\$\{builderPath\}\?lang=\$\{locale\}`/);
  assert.match(seoPage, /getExpatSeoLandingBySlug/);
  assert.match(seoPage, /EXPAT_SEO_SLUGS/);
  assert.match(najem, /lang: builderLocale/);
  assert.match(najem, /BuilderCheckoutSummary/);
  assert.match(read('lib/packages.ts'), /getLocalizedIncludedItems/);
}

async function testLeaseEnPdfTextContent() {
  const minimalLease: StoredContractData = {
    contractType: 'lease',
    tier: 'basic',
    lang: 'en',
    addOns: ['bilingual_annex'],
    landlordName: 'Landlord Test',
    tenantName: 'Tenant Test',
    flatAddress: 'Prague 1',
    rentAmount: '20000',
    startDate: '2026-06-01',
    handoverDate: '2026-06-01',
  };
  const pdf = await renderContractPdf(minimalLease);
  const text = await extractPdfText(pdf);
  const lower = text.toLowerCase();

  assert.match(lower, /nájemní|najemni|smluvn/i, 'Czech lease body expected');
  assert.match(lower, /explanatory english translation annex/i);
  assert.match(lower, /not a certified or official translation/i);
  assert.match(lower, /czech wording prevails/i);
  assert.match(lower, /i\. parties|landlord test/i);
  assert.match(lower, /explanatory handover protocol summary/i);

  const forbidden = [
    'visa-ready',
    'accepted by foreign police',
    'guaranteed for authorities',
    'certified translation guaranteed',
    'immigration advice provided',
  ];
  for (const phrase of forbidden) {
    assert.ok(!lower.includes(phrase), `PDF contains forbidden phrase: ${phrase}`);
  }
}

async function testEmploymentEnPdfTextContent() {
  const data: StoredContractData = {
    contractType: 'employment',
    tier: 'basic',
    lang: 'en',
    addOns: ['bilingual_annex'],
    employerName: 'ACME s.r.o.',
    employerIco: '12345678',
    employerAddress: 'Prague',
    employeeName: 'Jane Worker',
    employeeBirth: '1990-01-01',
    employeeAddress: 'Brno',
    jobTitle: 'Developer',
    workPlace: 'Prague',
    startDate: '2026-06-01',
    salary: '50000',
    salaryType: 'monthly',
    employmentType: 'indefinite',
  };
  const pdf = await renderContractPdf(data);
  const lower = (await extractPdfText(pdf)).toLowerCase();
  assert.match(lower, /pracovní|zaměstnavatel|zákoník práce/i);
  assert.match(lower, /explanatory english translation annex/i);
  assert.match(lower, /i\. parties|preamble/i);
  assert.match(lower, /employer: acme/i);
}

async function testDppUaPdfTextContent() {
  const data: StoredContractData = {
    contractType: 'dpp',
    tier: 'basic',
    lang: 'ua',
    addOns: ['bilingual_annex'],
    employerName: 'ACME s.r.o.',
    employerIco: '12345678',
    employerAddress: 'Praha',
    employeeName: 'Jan Brigádník',
    employeeBirth: '1995-05-05',
    employeeAddress: 'Brno',
    taskDescription: 'IT support',
    workPlace: 'Praha',
    estimatedHours: '80',
    totalRemuneration: '40000',
    remunerationType: 'fixed',
    durationType: 'fixed',
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    contractDate: '2026-05-18',
  };
  const text = await extractPdfText(await renderContractPdf(data));
  const lower = text.toLowerCase();

  assert.match(lower, /dohoda|provedení práce/i);
  assert.match(text, /огляд основних умов/i);
  assert.match(text, /переваг[ау] має чеське формулювання/i);
  assert.match(text, /не перевіряє, чи має іноземець право працювати в чеській республіці/i);
  assert.match(lower, /neověřuje, zda má cizinec oprávnění pracovat/i);

  assert.ok(!/юридично обов.?язков/i.test(text), 'must not claim legally binding UA version');
  assert.ok(!/legally binding version/i.test(lower));
  assert.match(lower, /не повний переклад/);
  assert.ok(!/є повний переклад|kompletní překlad smlouvy|complete translation of the contract/i.test(lower));

  assert.match(text, /40\s000/);
  assert.ok(!/40,000/.test(text), 'amounts must use Czech spacing, not comma thousands');
  assert.match(text, /1\.\s*6\.\s*2026/);
  assert.ok(!/\b1\/6\/2026\b/.test(text), 'dates must not use slash format in UA annex');
  assert.match(text, /робочого часу|відпочинку|розкладу змін/i);
}

async function testPdfFallback() {
  const minimalLease: StoredContractData = {
    contractType: 'lease',
    tier: 'basic',
    lang: 'en',
    landlordName: 'Landlord',
    tenantName: 'Tenant',
    flatAddress: 'Praha',
    rentAmount: '20000',
    startDate: '2026-01-01',
  };
  const csPdf = await renderContractPdf({ ...minimalLease, lang: 'cs' });
  const enPdf = await renderContractPdf(minimalLease);
  const enText = (await extractPdfText(enPdf)).toLowerCase();
  assert.ok(enPdf.length > 1000, 'Expected generated English-aware lease PDF');
  assert.match(enText, /english-guided czech contract/i);
  assert.doesNotMatch(enText, /explanatory english translation annex/i);

  const enPdfWithAnnex = await renderContractPdf({ ...minimalLease, addOns: ['bilingual_annex'] });
  const enAnnexText = (await extractPdfText(enPdfWithAnnex)).toLowerCase();
  assert.match(enAnnexText, /explanatory english translation annex/i);
  assert.ok(
    enPdfWithAnnex.length > csPdf.length + 4000,
    'EN lease PDF should be substantially larger than CS-only (Czech body + English translation annex)',
  );

  const garbageLang: StoredContractData = {
    ...minimalLease,
    lang: 'garbage',
  };
  const fallbackPdf = await renderContractPdf(garbageLang);
  assert.ok(fallbackPdf.length > 1000, 'Unknown language must fallback to cs without crashing');
}

async function main() {
  testLocalePropagation();
  testNoMisleadingBilingualMarketing();
  testSupportedBuilders();
  testUnsupportedContracts();
  testOrdersApiSecurity();
  testLegalCopy();
  testLegalAccuracyRegressions();
  testLeaseEnBuilderUi();
  testLeaseEnCheckoutItems();
  testLeaseUkCheckoutItems();
  testLeaseLocaleRegression();
  testUnsupportedContractFromEnLanding();
  testEmploymentEligibilityInBuilders();
  testLeaseEnglishContractSections();
  testExpatCapabilityDifferentiation();
  testExpatBuilderFormsLocalized();
  testExpatContractTranslationBuilders();
  testLeaseUkBuilderUi();
  testBuilderNoticeUkCopy();
  testUkLandingLocalizedCards();
  testSeoRentalLandingPage();
  testExpatSeoLandingPages();
  testLocalizedBlogArticles();
  testE2eFlowStaticPaths();
  testLeasePreviewHelpers();
  await testLeaseEnPdfTextContent();
  await testLeaseUkPdfTextContent();
  await testEmploymentEnPdfTextContent();
  await testDppUaPdfTextContent();
  await testPdfFallback();
  testCzechBlogSitemapCoverage();
  console.log('i18n expat tests passed');
}

function testCzechBlogSitemapCoverage() {
  const urls = new Set(czechBlogSitemapEntries().map((entry) => entry.url));
  for (const article of CZECH_BLOG_ARTICLES) {
    const expected = `${SITE_URL}${article.href}`;
    assert.ok(urls.has(expected), `Sitemap missing Czech blog article: ${article.href}`);
  }
  assert.ok(urls.has(`${SITE_URL}/blog/dpp-vzor-zdarma-2026`), 'Sitemap must include dpp-vzor-zdarma-2026');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
