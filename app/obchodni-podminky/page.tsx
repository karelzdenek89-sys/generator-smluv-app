import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Obchodní podmínky | SmlouvaHned',
  description: 'Obchodní podmínky platné pro využívání automatizované platformy SmlouvaHned.cz pro generování právních dokumentů.',
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
          Platné od 1. 1. 2026 • SmlouvaHned.cz
        </p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section className="bg-[#0c1426]/60 border border-rose-500/20 p-6 rounded-[24px]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚖️</span>
              <div>
                <div className="font-black text-white text-sm mb-1">Důležité upozornění</div>
                <p className="text-rose-200 text-xs leading-relaxed">
                  SmlouvaHned <strong>není advokátní kanceláří</strong> a neposkytuje právní služby ve smyslu zákona č. 85/1996 Sb., o advokacii. Platforma je automatizovaný software (SaaS) pro generování standardních právních dokumentů. U složitých, sporných nebo nestandardních případů doporučujeme konzultaci s advokátem.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              01. Provozovatel a identifikační údaje
            </h2>
            <div className="bg-[#0c1426]/60 border border-white/5 rounded-2xl p-5 text-sm">
              <p><strong className="text-white">Obchodní jméno:</strong> SmlouvaHned</p>
              <p><strong className="text-white">IČO:</strong> 23660295</p>
              <p><strong className="text-white">Webová adresa:</strong> smlouvahned.cz</p>
              <p><strong className="text-white">Kontaktní e-mail:</strong> <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a></p>
            </div>
            <p className="mt-3 text-slate-400 text-xs">
              Tyto obchodní podmínky (dále jen „OP") upravují práva a povinnosti mezi Provozovatelem platformy SmlouvaHned (dále jen „Poskytovatel") a uživatelem (dále jen „Zákazník").
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              02. Předmět služby
            </h2>
            <p className="mb-3">
              Předmětem služby je umožnění Zákazníkovi sestavit si vlastní právní dokument na základě jím vložených údajů do inteligentního online formuláře. Výstupem je soubor ve formátu PDF připravený k tisku a použití.
            </p>
            <p>
              Aktuálně dostupné typy dokumentů: Nájemní smlouva, Podnájemní smlouva, Kupní smlouva, Kupní smlouva na vozidlo, Darovací smlouva, Smlouva o dílo, Smlouva o zápůjčce, Smlouva o mlčenlivosti (NDA), Pracovní smlouva, Dohoda o provedení práce (DPP), Smlouva o poskytování služeb, Smlouva o spolupráci, Plná moc, Uznání dluhu.
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
              <div className="flex justify-between"><span className="text-slate-400">Základní dokument</span><span className="font-bold text-white">249 Kč vč. DPH</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Profesionální ochrana (rozšířené klauzule)</span><span className="font-bold text-white">399 Kč vč. DPH</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Kompletní balíček</span><span className="font-bold text-white">749 Kč vč. DPH</span></div>
            </div>
            <p className="mb-3">
              Platba probíhá prostřednictvím zabezpečené platební brány <strong className="text-white">Stripe</strong> (kartou). Ihned po potvrzení platby je Zákazníkovi zpřístupněn odkaz ke stažení dokumentu na stránce a zasílán na e-mail (pokud byl zadán).
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-200 text-xs">
              <strong>Odstoupení od smlouvy:</strong> Vzhledem k povaze digitálního obsahu doručovaného ihned po zaplacení zákazník výslovně souhlasí s tím, že <strong>nemá právo na odstoupení od smlouvy v 14denní lhůtě</strong> dle § 1837 písm. l) OZ, neboť plnění bylo na jeho žádost zahájeno a dokončeno před uplynutím lhůty.
            </div>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              05. Dostupnost dokumentu ke stažení
            </h2>
            <p>
              Odkaz ke stažení PDF dokumentu je aktivní po dobu <strong className="text-white">7 dní</strong> (Základní a Profesionální balíček) nebo <strong className="text-white">30 dní</strong> (Kompletní balíček) od okamžiku zaplacení. Po uplynutí této doby může být dokument nedostupný z důvodu automatického mazání dočasného úložiště. Zákazníkovi doporučujeme dokument ihned po stažení uložit na bezpečném místě. V případě problémů nás kontaktujte na <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a>.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              06. Odpovědnost poskytovatele
            </h2>
            <p className="mb-3">
              Zákazník nese plnou odpovědnost za správnost a pravdivost údajů vložených do formuláře. Poskytovatel neodpovídá za škody vzniklé chybným vyplněním nebo nevhodným použitím vygenerovaného dokumentu v rozporu s platnými zákony.
            </p>
            <p>
              Šablony jsou navrženy pro typické standardní situace a nemusí být vhodné pro atypické nebo sporné případy. Poskytovatel neposkytuje právní poradenství ani právní zastoupení.
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
            <p>
              Zákazník je oprávněn obrátit se na Českou obchodní inspekci (ČOI) nebo využít platformu pro online řešení spotřebitelských sporů EU: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" className="text-amber-400 hover:underline">ec.europa.eu/consumers/odr</a>.
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
              Poskytovatel je oprávněn OP jednostranně měnit. O změnách informuje zveřejněním aktualizované verze na tomto místě. Aktuální znění OP je vždy dostupné na smlouvahned.cz/obchodni-podminky.
            </p>
          </section>

          <section className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">SmlouvaHned © 2026 • Právní jistota na jeden klik</p>
            <Link href="/" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase hover:bg-amber-500 hover:text-black transition">
              Zpět na úvodní stránku
            </Link>
          </section>

        </div>
      </div>
    </main>
  );
}
