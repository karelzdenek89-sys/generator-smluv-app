import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'O projektu | SmlouvaHned — Jak nástroj vznikl a jak funguje',
  description:
    'SmlouvaHned.cz je softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů. Provozovatel: Karel Zdeněk, IČO 23660295. Zjistěte, jak šablony vznikají a proč nejde o advokátní kancelář.',
  openGraph: {
    title: 'O projektu | SmlouvaHned',
    description:
      'Jak vznikly šablony, kdo provozuje nástroj a proč SmlouvaHned.cz neposkytuje právní poradenství.',
    url: 'https://smlouvahned.cz/o-projektu',
  },
  alternates: { canonical: 'https://smlouvahned.cz/o-projektu' },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'O projektu SmlouvaHned.cz',
  url: 'https://smlouvahned.cz/o-projektu',
  description:
    'Informace o provozovateli, metodice tvorby šablon a povaze softwarového nástroje SmlouvaHned.cz.',
  mainEntity: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    legalName: 'Karel Zdeněk',
    url: 'https://smlouvahned.cz',
    identifier: { '@type': 'PropertyValue', propertyID: 'ICO', value: '23660295' },
  },
};

export default function OProjektuPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 py-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.06),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-amber-400 transition">
            ← SmlouvaHned
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400 mb-3">Transparentnost</div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4">
            Proč SmlouvaHned.cz<br />
            <span className="text-amber-500">vzniklo a jak funguje</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            Věříme, že poctivý digitální produkt se nemusí schovávat za vágní firemní jazyk. Tato stránka říká přesně, co SmlouvaHned.cz je — a co není.
          </p>
        </div>

        {/* Identifikace */}
        <section className="mb-10">
          <div className="bg-[#0c1426] border border-white/8 rounded-3xl p-7">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-400 mb-5">Provozovatel</div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Provozovatel', value: 'Karel Zdeněk' },
                { label: 'IČO', value: '23660295' },
                { label: 'Web', value: 'smlouvahned.cz' },
                { label: 'Kontaktní e-mail', value: 'info@smlouvahned.cz' },
                { label: 'Povaha subjektu', value: 'Fyzická osoba — podnikatel (OSVČ)' },
                { label: 'Povaha nástroje', value: 'SaaS — document automation software' },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Co to je */}
        <section className="mb-10 space-y-6 text-sm leading-relaxed text-slate-300">
          <div>
            <h2 className="text-xl font-black text-white mb-3">Co SmlouvaHned.cz je</h2>
            <p>
              SmlouvaHned.cz je <strong className="text-white">softwarový nástroj kategorie „document automation"</strong> — interaktivní generátor smluvních dokumentů. Funguje tak, že uživatel vyplní formulář s konkrétními podmínkami a systém na základě těchto vstupů sestaví strukturovaný PDF dokument.
            </p>
            <p className="mt-3">
              Šablony jsou postaveny na analýze textu příslušných zákonů — zejména zákona č. 89/2012 Sb. (občanský zákoník) a dalších relevantních předpisů. Každé pole v šabloně odpovídá konkrétní smluvní náležitosti. Povinné náležitosti jsou obsaženy vždy; nepovinná ujednání jsou ve formuláři označena.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-3">Jak šablony vznikají</h2>
            <p>
              Každý typ dokumentu prošel při tvorbě strukturální analýzou: jaké náležitosti zákon pro daný typ smlouvy vyžaduje, jaká ujednání jsou obvyklá v praxi a kde jsou nejčastější mezery v ručně přepisovaných vzorech. Výsledkem je modulární šablona — algoritmus sestavuje konkrétní dokument na základě toho, co uživatel do formuláře zadá.
            </p>
            <p className="mt-3">
              Šablony jsou průběžně aktualizovány při legislativních změnách. Datum poslední revize je u každého generátoru zobrazeno.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-3">Co SmlouvaHned.cz není</h2>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-3">
              {[
                {
                  title: 'Není advokátní kanceláří',
                  desc: 'SmlouvaHned.cz neposkytuje právní služby ve smyslu zákona č. 85/1996 Sb., o advokacii. Provozovatel není advokát ani jiný právní profesionál zapsaný v komoře.',
                },
                {
                  title: 'Neposkytuje individuální právní poradenství',
                  desc: 'Nástroj nevyhodnocuje vhodnost dokumentu pro konkrétní situaci uživatele. Neřekne vám, zda je konkrétní ujednání pro vás výhodné nebo nevýhodné.',
                },
                {
                  title: 'Negarantuje výsledek sporu',
                  desc: 'Žádná smlouva nevylučuje budoucí spor. Kvalitně sestavený dokument spor znesnadňuje a usnadňuje vymáhání — nezaručuje vítězství.',
                },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-rose-400 font-black mt-0.5 flex-shrink-0">✕</span>
                  <div>
                    <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-3">Kdy doporučujeme advokáta</h2>
            <p>
              Generátor je vhodný pro standardní situace, kde se strany shodly na podmínkách a potřebují je správně zachytit písemně. Pokud vaše situace zahrnuje tyto faktory, doporučujeme konzultaci s advokátem:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                'Vyšší finanční hodnota transakce (jednotky milionů Kč a více)',
                'Mezinárodní prvek (zahraniční strana, jiné rozhodné právo)',
                'Probíhající nebo hrozící spor mezi stranami',
                'Nestandardní podmínky, které formulář neumožňuje zachytit',
                'Potřeba notářského zápisu nebo úřední ověření',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-amber-500 font-black mt-0.5 flex-shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-slate-400">
              Seznam advokátů ve vašem regionu najdete na webu České advokátní komory:{' '}
              <a
                href="https://www.cak.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition"
              >
                cak.cz
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-3">Zodpovědnost za obsah dokumentu</h2>
            <p>
              Obsah každého vygenerovaného dokumentu je dán vstupy uživatele. Provozovatel odpovídá za funkčnost nástroje a správnost struktury šablony — nikoliv za obsahovou správnost konkrétního dokumentu, který závisí na tom, co uživatel do formuláře zadal.
            </p>
            <p className="mt-3">
              Doporučujeme každý dokument před podpisem zkontrolovat — zejména identifikační údaje stran, předmět smlouvy, ceny a termíny.
            </p>
          </div>
        </section>

        {/* Aktuálnost */}
        <section className="mb-10">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🔄</span>
              <div>
                <div className="font-black text-white text-sm mb-2">Sledujeme legislativní vývoj</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Při relevantní změně zákona aktualizujeme dotčené šablony. Datum poslední revize každé šablony je zobrazeno v generátoru. Tento nástroj byl spuštěn pro českou legislativu platnou v roce 2026 a bude průběžně udržován.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-sm text-center rounded-2xl transition shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
            Vybrat typ smlouvy →
          </Link>
          <Link
            href="/kontakt"
            className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm text-center rounded-2xl transition uppercase tracking-wider"
          >
            Kontakt
          </Link>
        </div>

        {/* Legal note */}
        <div className="mt-10 pt-8 border-t border-white/8 text-xs text-slate-600 leading-relaxed">
          <p>Provozovatel: Karel Zdeněk · IČO: 23660295 · smlouvahned.cz</p>
          <p className="mt-1">SmlouvaHned.cz je softwarový nástroj pro tvorbu standardizovaných dokumentů. Neposkytuje právní poradenství a není advokátní kanceláří ve smyslu zákona č. 85/1996 Sb.</p>
        </div>

      </div>
    </main>
  );
}
