import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Obchodní podmínky | SmlouvaHned',
  description:
    'Obchodní podmínky pro používání platformy SmlouvaHned.cz pro sestavení standardizovaných smluvních dokumentů.',
  alternates: { canonical: 'https://www.smlouvahned.cz/obchodni-podminky' },
};

const priceList = [
  { label: 'Základní dokument', value: '249 Kč vč. DPH' },
  { label: 'Rozšířená ochrana', value: '399 Kč vč. DPH' },
  { label: 'Kompletní balíček', value: '749 Kč vč. DPH' },
];

export default function TermsPage() {
  return (
    <main className="premium-page-bg-ref px-6 py-16 font-sans text-slate-300">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-full -translate-x-1/2 bg-amber-500/4 blur-[120px]" />

      <div className="premium-page-shell-ref max-w-3xl">
        <div className="mb-3">
          <Link href="/" className="premium-back-link-ref">
            ← SmlouvaHned
          </Link>
        </div>

        <div className="premium-page-hero-ref mb-12">
          <h1 className="mb-3 text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
            Obchodní <span className="text-amber-500">podmínky</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Platné od 4. 4. 2026 • SmlouvaHned.cz</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">
          <section className="premium-page-card-soft-ref p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚖</span>
              <div>
                <div className="mb-1 text-sm font-black text-white">Důležité upozornění</div>
                <p className="text-xs leading-relaxed text-rose-200">
                  SmlouvaHned.cz není advokátní kancelář a neposkytuje právní služby ve smyslu zákona č. 85/1996 Sb., o
                  advokacii. Jde o online software pro sestavení standardizovaných smluvních dokumentů podle údajů zadaných
                  uživatelem. U složitých, sporných nebo nestandardních situací doporučujeme konzultaci s advokátem.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">01. Provozovatel a identifikační údaje</h2>
            <p className="mb-3">
              Provozovatelem webu, prodávajícím a poskytovatelem služby je <strong className="text-white">Karel Zdeněk</strong>, IČO
              23660295, s místem podnikání Plzeňská 189, 345 61 Staňkov, kontaktní e-mail:{' '}
              <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">
                info@smlouvahned.cz
              </a>
              . Web SmlouvaHned.cz je obchodní označení online platformy provozované touto osobou.
            </p>
            <div className="space-y-1 rounded-2xl border border-white/5 bg-[#0c1426]/60 p-5 text-sm">
              <p>
                <strong className="text-white">Provozovatel:</strong> Karel Zdeněk
              </p>
              <p>
                <strong className="text-white">IČO:</strong> 23660295
              </p>
              <p>
                <strong className="text-white">Místo podnikání:</strong> Plzeňská 189, 345 61 Staňkov
              </p>
              <p>
                <strong className="text-white">Kontaktní e-mail:</strong>{' '}
                <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">
                  info@smlouvahned.cz
                </a>
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Tyto obchodní podmínky upravují práva a povinnosti mezi poskytovatelem služby a zákazníkem při objednávce
              digitálního obsahu prostřednictvím webu SmlouvaHned.cz.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">02. Předmět služby</h2>
            <p className="mb-3">
              Předmětem služby je umožnění zákazníkovi sestavit standardizovaný smluvní dokument na základě údajů vložených do
              online formuláře. Výstupem je soubor ve formátu PDF určený k závěrečné kontrole a podpisu.
            </p>
            <p>
              Služba je určena pro běžné a typizované situace, ve kterých se strany shodly na obsahu dokumentu.
              Poskytovatel neprovádí individuální právní posouzení konkrétní situace zákazníka a neposkytuje právní
              zastoupení.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">03. Uzavření smlouvy a objednávka</h2>
            <p className="mb-3">
              Smlouva mezi poskytovatelem a zákazníkem vzniká odesláním objednávky a úspěšným provedením platby. Zákazník
              před dokončením objednávky vidí vybraný typ dokumentu, zvolenou variantu, cenu a související podmínky.
            </p>
            <p>
              Zákazník odpovídá za správnost a úplnost údajů vložených do formuláře. Před použitím dokumentu je povinen
              výstup zkontrolovat, zejména identifikační údaje, částky, termíny a další konkrétní podmínky.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">04. Ceny a platební podmínky</h2>
            <div className="mb-3 space-y-2 rounded-2xl border border-white/5 bg-[#0c1426]/60 p-5 text-sm">
              {priceList.map(item => (
                <div key={item.label} className="flex justify-between gap-4">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="mb-3">
              Platba probíhá prostřednictvím zabezpečené platební brány <strong className="text-white">Stripe</strong>. Platební
              údaje nezpracovává poskytovatel přímo. Po potvrzení platby je zákazníkovi zpřístupněn odkaz ke stažení
              dokumentu na stránce a může mu být zaslán také na e-mail, pokud jej při objednávce zadal.
            </p>
            <p>Všechny ceny uvedené na webu jsou konečné, včetně DPH, pokud se na dané plnění DPH vztahuje.</p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">05. Funkčnost digitálního obsahu, kompatibilita a doba dostupnosti</h2>
            <p className="mb-3">
              Výstupem služby je digitální obsah ve formátu PDF. Dokument je zpřístupněn online po úspěšném dokončení
              platby bez nutnosti zakládání uživatelského účtu.
            </p>
            <div className="rounded-2xl border border-white/5 bg-[#0c1426]/60 p-5 text-sm text-slate-300">
              <p>
                <strong className="text-white">Technické požadavky:</strong> běžný webový prohlížeč, funkční internetové
                připojení a zařízení schopné otevřít soubory PDF.
              </p>
              <p className="mt-2">
                <strong className="text-white">Kompatibilita:</strong> dokument je určen pro obvyklé prohlížeče PDF na
                počítači, tabletu nebo mobilním telefonu.
              </p>
              <p className="mt-2">
                <strong className="text-white">Doba dostupnosti odkazu:</strong> 7 dní u Základního dokumentu, 14 dní u
                Rozšířené ochrany a 30 dní u Kompletního balíčku.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">06. Odstoupení od smlouvy</h2>
            <p className="mb-3">
              Zákazník objednává digitální obsah, který je zpřístupněn bezprostředně po zaplacení. Před dokončením objednávky
              zákazník výslovně souhlasí s okamžitým zpřístupněním digitálního obsahu a bere na vědomí, že tím ztrácí právo
              odstoupit od smlouvy ve 14denní lhůtě podle § 1837 písm. l) občanského zákoníku.
            </p>
            <p>
              Pokud by k okamžitému zpřístupnění digitálního obsahu nedošlo a podmínky pro zánik práva na odstoupení nebyly
              splněny, uplatní se obecná zákonná pravidla pro smlouvy uzavírané na dálku.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">07. Práva z vadného plnění a reklamace</h2>
            <p className="mb-3">
              Poskytovatel odpovídá za to, že digitální obsah při zpřístupnění odpovídá smlouvě, zejména že je dostupný,
              čitelný, technicky funkční a odpovídá údajům zadaným zákazníkem v rozsahu, v jakém je výstup vytvářen systémem.
            </p>
            <p className="mb-3">
              Reklamaci lze uplatnit zejména tehdy, pokud dokument nelze stáhnout, nelze jej otevřít, zpřístupnění selhalo
              z technických důvodů na straně poskytovatele nebo výstup neodpovídá zadaným údajům v důsledku chyby systému.
              Tím nejsou dotčena zákonná práva spotřebitele z vadného plnění.
            </p>
            <p className="mb-3">
              Reklamaci nebo stížnost zašlete na{' '}
              <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">
                info@smlouvahned.cz
              </a>
              . Uveďte prosím co nejpřesnější popis problému, identifikaci objednávky a případně screenshot nebo jiný
              podklad. Přijetí reklamace bez zbytečného odkladu potvrdíme a vyřídíme ji v zákonné lhůtě.
            </p>
            <p>Reklamace se nevztahuje na obsahové chyby způsobené nesprávnými nebo neúplnými údaji, které do formuláře zadal zákazník sám.</p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">08. Mimosoudní řešení spotřebitelských sporů</h2>
            <p className="mb-3">
              V případě spotřebitelského sporu, který se nepodaří vyřešit dohodou přímo mezi zákazníkem a poskytovatelem,
              může spotřebitel podat návrh na mimosoudní řešení sporu k subjektu mimosoudního řešení spotřebitelských sporů,
              kterým je:
            </p>
            <div className="rounded-2xl border border-white/5 bg-[#0c1426]/60 p-5 text-sm">
              <p className="font-bold text-white">Česká obchodní inspekce</p>
              <p>Ústřední inspektorát – oddělení ADR</p>
              <p>Gorazdova 1969/24, 120 00 Praha 2</p>
              <p>
                Web:{' '}
                <a href="https://coi.gov.cz/informace-o-adr/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                  coi.gov.cz/informace-o-adr/
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">09. Ochrana osobních údajů a duševní vlastnictví</h2>
            <p className="mb-3">
              Informace o zpracování osobních údajů jsou uvedeny samostatně na stránce{' '}
              <Link href="/gdpr" className="text-amber-400 hover:underline">
                GDPR
              </Link>
              .
            </p>
            <p>
              Software, šablony a vizuální podoba platformy SmlouvaHned.cz jsou duševním vlastnictvím poskytovatele.
              Zákazník je oprávněn používat zakoupený výstup pro své osobní nebo podnikatelské účely v souladu s povahou dokumentu.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">10. Závěrečná ustanovení</h2>
            <p className="mb-3">
              Tyto obchodní podmínky se řídí právním řádem České republiky. Změny obchodních podmínek nemají vliv na objednávky
              dokončené před jejich účinností.
            </p>
            <p>
              Aktuální znění obchodních podmínek je vždy dostupné na adrese <span className="text-white">smlouvahned.cz/obchodni-podminky</span>.
            </p>
          </section>

          <section className="premium-footer-ref flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-[10px] uppercase tracking-widest text-slate-600">Karel Zdeněk · IČO 23660295 · SmlouvaHned.cz © 2026</p>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-[10px] font-black uppercase text-white transition hover:bg-amber-500 hover:text-black"
            >
              Zpět na úvodní stránku
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
