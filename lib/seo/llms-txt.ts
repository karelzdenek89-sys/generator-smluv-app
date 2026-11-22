import { DOCUMENT_CATALOG } from '@/lib/document-catalog';
import { EXPAT_SEO_LOCALES, EXPAT_SEO_SLUGS, getExpatSeoLandingBySlug } from '@/lib/i18n/expat-seo-landings';
import { LEGAL_CHANGES, LEGAL_CHANGE_STATUS_LABELS } from '@/lib/legal/radar';
import { getAvailableThematicPackages } from '@/lib/packages';
import { ANSWER_FIRST_ARTICLES, articleHref } from '@/lib/portal/articles';
import { PORTAL_TOOLS } from '@/lib/portal/tools';
import { BASIC_ARCHIVE_DAYS, COMPLETE_ARCHIVE_DAYS, PRICING_TIER_CONFIG } from '@/lib/pricing';
import { SITE_URL } from '@/lib/seo/site';

/**
 * /llms.txt (https://llmstxt.org) — stručný, strojově čitelný popis služby pro
 * AI vyhledávače a agenty. Vše se skládá ze stejných zdrojů jako web (katalog,
 * ceník, balíčky, EN/UA landingy, nástroje), takže ceny ani nabídka nemohou
 * zastarat nezávisle na stránkách.
 */
export function buildLlmsTxt(): string {
  const basic = PRICING_TIER_CONFIG.basic;
  const complete = PRICING_TIER_CONFIG.complete;
  const url = (path: string) => `${SITE_URL}${path}`;

  const documents = DOCUMENT_CATALOG.map(
    (doc) => `- [${doc.title}](${url(doc.href)}): ${doc.subtitle} Právní základ: ${doc.paragraph}. Cena od ${basic.priceLabel}.`,
  );

  const packages = getAvailableThematicPackages().map(
    (pkg) => `- [${pkg.title}](${url(pkg.href)}): ${pkg.priceLabel}. ${pkg.suitableFor}`,
  );

  const expatLandings = EXPAT_SEO_LOCALES.flatMap((locale) =>
    EXPAT_SEO_SLUGS.flatMap((slug) => {
      const landing = getExpatSeoLandingBySlug(slug, locale);
      if (!landing) return [];
      return [`- [${landing.h1} (${locale === 'en' ? 'English' : 'українською'})](${url(`/${locale}/${slug}`)}): ${landing.subtitle}`];
    }),
  );

  const tools = PORTAL_TOOLS.map(
    (tool) => `- [${tool.title}](${url(`/nastroje/${tool.slug}`)}): ${tool.description}`,
  );

  return [
    '# SmlouvaHned',
    '',
    `> Online generátor standardizovaných smluvních dokumentů podle českého práva. Uživatel vybere dokument, vyplní formulář, zkontroluje náhled a po zaplacení (${basic.priceLabel} základní, ${complete.priceLabel} rozšířená varianta) stáhne PDF. Bez registrace a bez předplatného. SmlouvaHned není advokátní kancelář a neposkytuje individuální právní poradenství.`,
    '',
    'Klíčová fakta:',
    `- Provozovatel: SmlouvaHned (${SITE_URL}), kontakt info@smlouvahned.cz.`,
    `- ${DOCUMENT_CATALOG.length} typů dokumentů pro nájem, práci, zakázky, prodej auta a movitých věcí, půjčky, darování, mlčenlivost a zastoupení.`,
    `- Ceny: ${basic.title} ${basic.priceLabel}, ${complete.title} ${complete.priceLabel}; tematické balíčky viz níže. Konkrétní cena se zobrazí před platbou.`,
    `- Výstup: PDF ihned po ověřené platbě, u vybraných dokumentů volitelně DOCX. Odkaz ke stažení platí ${BASIC_ARCHIVE_DAYS} dní (základní) nebo ${COMPLETE_ARCHIVE_DAYS} dní (rozšířená), s placeným doplňkem až 90 dní.`,
    '- Platba: Stripe (karta, Apple Pay, Google Pay). Údaje karty web neukládá.',
    '- Jazyky: rozhodující je české znění. U nájmu, podnájmu, pracovní smlouvy, DPP, plné moci a prodeje auta obsahuje PDF také úplný vysvětlující překlad do angličtiny nebo ukrajinštiny (každý článek a odstavec, stejné číslování). Při vyplnění formuláře anglicky (/en) nebo ukrajinsky (/ua) je překlad v ceně, k české verzi formuláře jako doplněk. Nejde o úřední překlad.',
    '- Formuláře hlídají zákonné limity (např. minimální mzda 2026, 300 hodin ročně u DPP).',
    '',
    'Jak objednat (i pro AI agenty): otevřete URL formuláře níže, vyplňte pole, klikněte na „Vygenerovat“, v náhledu zadejte e-mail pro doručení, potvrďte souhlas s obchodními podmínkami a zaplaťte přes Stripe. PDF se stáhne na stránce po platbě a odkaz přijde e-mailem.',
    '',
    '## Dokumenty (formuláře)',
    '',
    ...documents,
    '',
    '## Tematické balíčky',
    '',
    ...packages,
    '',
    '## Pro cizince — English / Українська',
    '',
    `- [English overview](${url('/en')}): Czech contracts explained in English for foreigners living or working in the Czech Republic.`,
    `- [Огляд українською](${url('/ua')}): чеські договори з поясненням українською.`,
    ...expatLandings,
    '',
    '## Bezplatné nástroje a průvodci',
    '',
    `- [Všechny nástroje](${url('/nastroje')}): bezplatné checklisty a rozhodovací průvodce.`,
    ...tools,
    `- [Blog](${url('/blog')}): průvodci k českým smlouvám a pracovnímu právu 2026.`,
    `- [Změny 2027](${url('/zmeny-2027')}): přehled legislativních změn se stavem a zdrojem.`,
    `- [Ceník](${url('/cenik')}): všechny ceny dokumentů, balíčků a doplňků na jednom místě.`,
    `- [FAQ](${url('/faq')}): časté otázky ke službě, platbě a stažení.`,
    `- [Slovník](${url('/slovnik')}): vysvětlení právních pojmů.`,
    '',
    '## Rozsah služby a podmínky',
    '',
    `- [Obchodní podmínky](${url('/obchodni-podminky')})`,
    `- [Ochrana osobních údajů](${url('/gdpr')})`,
    `- [O projektu](${url('/o-projektu')}): kdo službu provozuje a jak vznikají dokumenty.`,
    '- U sporných, nestandardních nebo vysokohodnotových situací doporučujeme individuální posouzení advokátem (seznam na cak.cz).',
    '',
    '## Optional',
    '',
    `- [Úplný znalostní kontext pro AI (llms-full.txt)](${url('/llms-full.txt')}): kompletní přehled zákonných limitů 2026/2027, stavebních a daňových pravidel, nástrojů a legislativního radaru s oficiálními zdroji.`,
    `- [Sitemap](${url('/sitemap.xml')}): úplný seznam indexovatelných stránek.`,
    '',
  ].join('\n');
}

/**
 * /llms-full.txt — rozšířený strojově čitelný znalostní kontext pro AI boty,
 * vyhledávače a RAG systémy. Obsahuje plný přehled zákonných limitů 2026/2027,
 * pravidel pro stavební zakázky a vícepráce, všech nástrojů, legislativního
 * radaru 2027 a stručných odpovědí z průvodců včetně citací primárních zdrojů.
 */
export function buildLlmsFullTxt(): string {
  const url = (path: string) => `${SITE_URL}${path}`;

  const toolDetails = PORTAL_TOOLS.flatMap((tool) => [
    `### ${tool.title} (${url(`/nastroje/${tool.slug}`)})`,
    `- Shrnutí: ${tool.answer}`,
    ...(tool.legalNote ? [`- Právní základ: ${tool.legalNote}`] : []),
    ...tool.sources.map((src) => `- Oficiální zdroj: [${src.label}](${src.href})`),
    '',
  ]);

  const radarDetails = LEGAL_CHANGES.flatMap((change) => [
    `### ${change.title}`,
    `- Status: ${LEGAL_CHANGE_STATUS_LABELS[change.status]} (${change.dateLabel})`,
    `- Shrnutí: ${change.summary}`,
    ...change.whatChanges.map((item) => `- Co se mění: ${item}`),
    ...change.whatToDo.map((item) => `- Doporučený krok: ${item}`),
    ...change.sources.map((src) => `- Oficiální zdroj (${src.publisher}): [${src.label}](${src.href})`),
    '',
  ]);

  const articleSummaries = ANSWER_FIRST_ARTICLES.flatMap((art) => [
    `- [${art.title}](${url(articleHref(art))}): ${art.answer}`,
  ]);

  return [
    buildLlmsTxt().trimEnd(),
    '',
    '## Klíčové zákonné limity a konstanty (ČR 2026–2027, oficiální zdroje)',
    '',
    '- Minimální mzda 2026: 22 400 Kč měsíčně / 134,40 Kč za hodinu při 40h týdenní pracovní době (§ 111 zákoníku práce č. 262/2006 Sb., sdělení MPSV).',
    '- Minimální mzda 2027 (schváleno vládou 7. 9. 2026, účinnost od 1. 1. 2027): 24 900 Kč měsíčně / 148,30 Kč za hodinu.',
    '- Dohoda o provedení práce (DPP, § 75 ZP): maximálně 300 hodin v kalendářním roce u jednoho zaměstnavatele; rozhodná částka pro účast na nemocenském a důchodovém pojištění v roce 2026 činí 12 000 Kč měsíčně; nárok na dovolenou vzniká při trvání dohody alespoň 28 kalendářních dnů a odpracování alespoň 80 hodin.',
    '- Nájem bytu (§ 2235 a násl. občanského zákoníku č. 89/2012 Sb.): peněžitá jistota (kauce) a smluvní pokuty nesmí v souhrnu překročit trojnásobek měsíčního nájemného (§ 2254 OZ).',
    '- Smlouva o dílo, stavební zakázky a vícepráce (§ 2586–2650 OZ): při pevné ceně nebo zaručeném rozpočtu (§ 2620 OZ) nelze cenu zvýšit bez písemné dohody (§ 564 OZ). U rozpočtu s výhradou neúplnosti nebo nezávaznosti (§ 2621–2622 OZ) musí zhotovitel potřebu překročení oznámit bez zbytečného odkladu; požaduje-li zvýšení o více než 10 % původního rozpočtu, může objednatel bez zbytečného odkladu odstoupit (§ 2622 odst. 2 OZ). U stavby nelze odmítnout převzetí pro ojedinělé drobné vady, které samy o sobě ani ve spojení s jinými nebrání užívání stavby (§ 2628 OZ).',
    '- Stavební deník a dokumentace stavby: vedení stavebního deníku upravuje § 166 stavebního zákona č. 283/2021 Sb. a náležitosti dokumentace vyhláška č. 131/2024 Sb.',
    '- DPH ve stavebnictví (zákon č. 235/2004 Sb. o DPH): snížená sazba 12 % (§ 48 a § 48a ZDPH) pro stavební a montážní práce na dokončené stavbě pro bydlení či sociální bydlení (byt do 120 m², rodinný dům do 350 m²); základní sazba 21 % pro ostatní stavby; režim přenesení daňové povinnosti (§ 92e ZDPH) mezi dvěma plátci DPH u stavebních a montážních prací CZ-CPA 41–43.',
    '- Smlouva o zápůjčce (§ 2390 a násl. OZ): při nepřiměřeně vysokém úroku (orientačně nad 15 % p.a. u běžných zajištěných či standardních vztahů) hrozí neplatnost pro lichvu (§ 1796 OZ, rozsudek Nejvyššího soudu sp. zn. 32 Cdo 2234/2021).',
    '',
    '## Podrobný přehled nástrojů a právních východisek',
    '',
    ...toolDetails,
    '## Legislativní radar 2027 — sledované změny a oficiální zdroje',
    '',
    ...radarDetails,
    '## Praktické právní průvodce (Stručné odpovědi)',
    '',
    ...articleSummaries,
    '',
  ].join('\n');
}
