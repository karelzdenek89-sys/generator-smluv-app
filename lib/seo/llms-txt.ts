import { DOCUMENT_CATALOG } from '@/lib/document-catalog';
import { EXPAT_SEO_LOCALES, EXPAT_SEO_SLUGS, getExpatSeoLandingBySlug } from '@/lib/i18n/expat-seo-landings';
import { getAvailableThematicPackages } from '@/lib/packages';
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
    `- [Sitemap](${url('/sitemap.xml')}): úplný seznam indexovatelných stránek.`,
    '',
  ].join('\n');
}
