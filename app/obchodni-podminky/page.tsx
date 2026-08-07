import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BASIC_ARCHIVE_DAYS,
  COMPLETE_ARCHIVE_DAYS,
  PRICING_TIER_CONFIG,
} from '@/lib/pricing';
import { THEMATIC_PACKAGE_CONFIG } from '@/lib/packages';
import { CHECKOUT_ADDON_CONFIG } from '@/lib/checkout-addons';
import { SITE_URL } from '@/lib/seo/site';

const canonicalUrl = `${SITE_URL}/obchodni-podminky`;

export const metadata: Metadata = {
  title: 'Obchodní podmínky',
  description: 'Obchodní podmínky platné pro využívání automatizované platformy SmlouvaHned.cz pro tvorbu standardizovaných smluvních dokumentů.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Obchodní podmínky',
    description: 'Obchodní podmínky platformy SmlouvaHned.cz pro tvorbu standardizovaných smluvních dokumentů.',
    url: canonicalUrl,
    siteName: 'SmlouvaHned',
    type: 'website',
    locale: 'cs_CZ',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - obchodni podminky' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Obchodní podmínky | SmlouvaHned',
    description: 'Pravidla objednávky, platby, dostupnosti dokumentů a reklamací na SmlouvaHned.cz.',
    images: ['/og-image.png'],
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-300 py-16 px-6 font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-amber-500/4 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-3">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-amber-400 transition">
            ← SmlouvaHned
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 uppercase italic tracking-tighter">
          Obchodní <span className="text-amber-500">podmínky</span>
        </h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.25em] mb-12">
          Verze 2026-07-15 • SmlouvaHned.cz
        </p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section className="bg-[#0c1426]/60 border border-white/8 p-6 rounded-[24px]">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400/80 mb-3">Charakter služby</div>
            <p className="text-slate-300 text-sm leading-relaxed">
              SmlouvaHned.cz je <strong className="text-white">automatizovaný softwarový nástroj</strong> (SaaS) pro tvorbu standardizovaných smluvních dokumentů. Provozovatelem je fyzická osoba — podnikatel Karel Zdeněk (IČO 23660295). Platforma není advokátní kanceláří a neposkytuje právní služby ve smyslu zákona č. 85/1996 Sb., o advokacii. Pro složité, sporné nebo nestandardní situace doporučujeme konzultaci s advokátem (seznam na <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">cak.cz</a>).
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              01. Provozovatel a identifikační údaje
            </h2>
            <p className="mb-3 text-slate-300">
              Provozovatelem webu, prodávajícím a poskytovatelem služby je <strong className="text-white">Karel Zdeněk</strong>, IČO 23660295, s místem podnikání Plzeňská 189, 345 61 Staňkov, kontaktní e-mail: <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a>. Web SmlouvaHned.cz je obchodní označení online platformy provozované touto osobou.
            </p>
            <div className="bg-[#0c1426]/60 border border-white/5 rounded-2xl p-5 text-sm space-y-1">
              <p><strong className="text-white">Provozovatel:</strong> Karel Zdeněk</p>
              <p><strong className="text-white">IČO:</strong> 23660295</p>
              <p><strong className="text-white">Místo podnikání:</strong> Plzeňská 189, 345 61 Staňkov</p>
              <p><strong className="text-white">Obchodní označení platformy:</strong> SmlouvaHned.cz</p>
              <p><strong className="text-white">Kontaktní e-mail:</strong> <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a></p>
            </div>
            <p className="mt-3 text-slate-400 text-xs">
              Tyto obchodní podmínky (dále jen „OP“) upravují práva a povinnosti mezi Poskytovatelem (Karel Zdeněk, IČO 23660295, dále jen „Poskytovatel“) a uživatelem (dále jen „Zákazník“).
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              02. Předmět služby
            </h2>
            <p className="mb-3">
              Předmětem služby je umožnění Zákazníkovi sestavit strukturovaný smluvní dokument na základě údajů vložených do online formuláře. Platforma funguje jako softwarový nástroj (SaaS) pro automatizovanou tvorbu standardizovaných dokumentů — neposkytuje právní poradenství ani právní zastoupení. Výstupem je soubor ve formátu PDF a, pokud si jej Zákazník objedná, také editovatelný DOCX nebo související příloha či checklist, určené k závěrečné kontrole a podpisu.
            </p>
            <p>
              Aktuálně dostupné typy dokumentů: Nájemní smlouva, Podnájemní smlouva, Kupní smlouva, Kupní smlouva na vozidlo, Darovací smlouva, Smlouva o dílo, Smlouva o zápůjčce, Smlouva o mlčenlivosti (NDA), Pracovní smlouva, Dohoda o provedení práce (DPP), Smlouva o poskytování služeb, Smlouva o spolupráci, Plná moc, Uznání dluhu.
            </p>
            <p className="mt-3 text-slate-400 text-xs">
              PDF lze otevřít v běžné aktuální čtečce PDF a vytisknout na formát A4. Volitelný DOCX je určen pro aktuální Microsoft Word, LibreOffice nebo jiný editor podporující formát Office Open XML; vzhled se může mezi editory nepatrně lišit. Soubory nejsou chráněny DRM a k jejich použití není potřeba účet ani předplatné.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              03. Uzavření smlouvy a objednávka
            </h2>
            <p className="mb-3">
              Smlouva mezi Poskytovatelem a Zákazníkem vzniká dokončením objednávky — tj. vyplněním formuláře a úspěšným provedením platby. Zákazník bere na vědomí, že vložené údaje musí být pravdivé a úplné.
            </p>
            <p>
              Zákazník je povinen zkontrolovat vygenerovaný dokument před jeho použitím. Poskytovatel neodpovídá za škody vzniklé chybným vyplněním formuláře.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              04. Ceny a platební podmínky
            </h2>
            <div className="bg-[#0c1426]/60 border border-white/5 rounded-2xl p-5 space-y-2 text-sm mb-3">
              <div className="flex justify-between"><span className="text-slate-400">{PRICING_TIER_CONFIG.basic.title}</span><span className="font-bold text-white">{PRICING_TIER_CONFIG.basic.priceLabel}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">{PRICING_TIER_CONFIG.complete.title}</span><span className="font-bold text-white">{PRICING_TIER_CONFIG.complete.priceLabel}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Tematický balíček</span><span className="font-bold text-white">{THEMATIC_PACKAGE_CONFIG.landlord.priceLabel}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Zaměstnavatel Start 2026</span><span className="font-bold text-white">{THEMATIC_PACKAGE_CONFIG.employer_start.priceLabel}</span></div>
            </div>
            <div className="bg-[#0c1426]/60 border border-white/5 rounded-2xl p-5 space-y-2 text-sm mb-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Volitelné doplňky v checkoutu</p>
              {Object.values(CHECKOUT_ADDON_CONFIG).map((addon) => (
                <div key={addon.key} className="flex justify-between gap-4">
                  <span className="text-slate-400">{addon.title}</span>
                  <span className="font-bold text-white">{addon.priceLabel}</span>
                </div>
              ))}
            </div>
            <p className="mb-3 text-xs text-slate-500">
              Poskytovatel není plátcem DPH. Uvedené ceny jsou konečné.
            </p>
            <p className="mb-3">
              Platba probíhá prostřednictvím zabezpečené platební brány <strong className="text-white">Stripe</strong> (kartou). Ihned po potvrzení platby je Zákazníkovi zpřístupněn odkaz ke stažení dokumentu na stránce a zaslán na povinně uvedený doručovací e-mail.
            </p>
            <div className="bg-[#0c1426]/60 border border-white/8 rounded-xl p-4 text-slate-300 text-xs leading-relaxed">
              <strong className="text-white">Digitální obsah a právo na odstoupení:</strong> Předmětem plnění je digitální obsah (vygenerovaný PDF, případně DOCX dokument) doručovaný ihned po potvrzení platby. V souladu s § 1837 písm. l) OZ zákazník před dokončením objednávky výslovně potvrzuje, že souhlasí s okamžitým zahájením plnění, a bere na vědomí, že úplným dodáním digitálního obsahu ztrácí právo na odstoupení od smlouvy ve lhůtě 14 dnů dle § 1829 OZ. Čas a verze tohoto potvrzení se evidují u objednávky a zákazník je obdrží v potvrzovacím e-mailu na trvalém nosiči.
            </div>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              05. Dostupnost dokumentu ke stažení
            </h2>
            <p>
              Odkaz ke stažení dokumentu a objednaných doplňků je aktivní po dobu <strong className="text-white">{BASIC_ARCHIVE_DAYS} dní</strong> ({PRICING_TIER_CONFIG.basic.title}) nebo <strong className="text-white">{COMPLETE_ARCHIVE_DAYS} dní</strong> ({PRICING_TIER_CONFIG.complete.title} a tematický balíček) od okamžiku zaplacení. Pokud si Zákazník zakoupí doplněk Dostupnost 90 dní, je odkaz dostupný <strong className="text-white">90 dní</strong> od zaplacení. Po uplynutí této doby může být dokument nedostupný z důvodu automatického mazání dočasného úložiště. Zákazníkovi doporučujeme dokument ihned po stažení uložit na bezpečném místě. V případě problémů nás kontaktujte na <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a>.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              06. Odpovědnost poskytovatele
            </h2>
            <p className="mb-3">
              Zákazník nese plnou odpovědnost za správnost a pravdivost údajů vložených do formuláře. Poskytovatel neodpovídá za škody vzniklé chybným vyplněním nebo nevhodným použitím vygenerovaného dokumentu v rozporu s platnými zákony.
            </p>
            <p className="mb-3">
              Šablony jsou navrženy pro typické standardní situace a nemusí být vhodné pro atypické nebo sporné případy. Poskytovatel neposkytuje právní poradenství ani právní zastoupení.
            </p>
            <p>
              Celková odpovědnost Poskytovatele za škodu vzniklou Zákazníkovi v souvislosti s jednou objednávkou je omezena částkou skutečně zaplacenou Zákazníkem za tuto objednávku, nestanoví-li kogentní právní úprava jinak. Toto omezení se neuplatní v případě úmyslu nebo hrubé nedbalosti Poskytovatele.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              07. Reklamace a stížnosti
            </h2>
            <p className="mb-3">
              Reklamaci nebo stížnost podávejte na <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a>. Reklamaci vyřídíme do 30 dnů od jejího doručení.
            </p>
            <p className="mb-3">
              Reklamaci lze uplatnit zejména v případě, kdy vygenerovaný dokument neodpovídá zadaným údajům (technická chyba systému). Reklamace se nevztahuje na nevhodné použití dokumentu nebo chyby vzniklé nesprávným vyplněním ze strany Zákazníka.
            </p>
            <p className="mb-3">
              Zákazník je oprávněn obrátit se na <strong className="text-white">Českou obchodní inspekci (ČOI)</strong> jako subjekt mimosoudního řešení spotřebitelských sporů. Návrh na mimosoudní řešení sporu lze podat na adrese:{' '}
              <a href="https://adr.coi.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">adr.coi.cz</a>.
            </p>
            <p className="mb-3">
              Evropská platforma pro online řešení spotřebitelských sporů (ODR) byla k 20. červenci 2025 ukončena. Pro mimosoudní řešení spotřebitelského sporu proto použijte výše uvedený portál České obchodní inspekce.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              08. Duševní vlastnictví
            </h2>
            <p>
              Vygenerovaný dokument je ve vlastnictví Zákazníka a může jej použít pro osobní i podnikatelské účely. Šablony, software a vizuální design platformy SmlouvaHned jsou duševním vlastnictvím Poskytovatele a nesmí být kopírovány ani distribuovány bez souhlasu.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              09. Závěrečná ustanovení
            </h2>
            <p className="mb-3">
              Tyto OP se řídí právním řádem České republiky. Případné spory budou řešeny věcně a místně příslušným soudem.
            </p>
            <p>
              Poskytovatel je oprávněn OP jednostranně měnit. O podstatných změnách informuje zákazníky — spotřebitele zveřejněním aktualizované verze na tomto místě a zasláním informace na e-mailovou adresu zadanou při objednávce, a to nejméně 14 dní před nabytím účinnosti změny. Změna OP nemá vliv na objednávky dokončené před její účinností. Aktuální znění OP je vždy dostupné na smlouvahned.cz/obchodni-podminky.
            </p>
          </section>

          <section className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Karel Zdeněk · IČO 23660295 · SmlouvaHned.cz © 2026</p>
            <Link href="/" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase hover:bg-amber-500 hover:text-black transition">
              Zpět na úvodní stránku
            </Link>
          </section>

        </div>
      </div>
    </main>
  );
}


