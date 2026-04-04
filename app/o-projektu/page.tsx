import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'O projektu | SmlouvaHned',
  description:
    'Zjistěte, kdo SmlouvaHned provozuje, jak nástroj funguje a v jakých situacích je vhodné obrátit se na advokáta.',
  alternates: { canonical: 'https://www.smlouvahned.cz/o-projektu' },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'O projektu SmlouvaHned',
  url: 'https://www.smlouvahned.cz/o-projektu',
  description: 'Informace o provozovateli, fungování služby a limitech nástroje SmlouvaHned.',
  mainEntity: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    legalName: 'Karel Zdeněk',
    url: 'https://www.smlouvahned.cz',
    identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: '23660295' },
  },
};

const limits = [
  {
    title: 'Nejsme advokátní kancelář',
    text: 'SmlouvaHned není advokátní kancelář a neposkytuje právní služby podle zákona o advokacii.',
  },
  {
    title: 'Neposkytujeme individuální právní poradenství',
    text: 'Nástroj neposuzuje vaši konkrétní situaci a nedoporučuje, jaké řešení je pro vás právně nejvýhodnější.',
  },
  {
    title: 'Výsledek sporu negarantujeme',
    text: 'Správně sestavený dokument může snížit riziko sporu, ale nezaručuje výsledek případného vymáhání nebo soudního řízení.',
  },
];

export default function OProjektuPage() {
  return (
    <main className="min-h-screen bg-[#05080f] px-6 py-16 text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.06),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-slate-500 transition hover:text-amber-400"
          >
            ← SmlouvaHned
          </Link>
        </div>

        <div className="mb-12">
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Transparentnost</div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Co SmlouvaHned je
            <br />
            <span className="text-amber-500">a kde má své limity</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400">
            SmlouvaHned je online nástroj pro sestavení standardizovaných smluvních dokumentů. Chceme mít jasně
            popsáno, kdo službu provozuje, jak funguje a kdy je rozumnější obrátit se přímo na advokáta.
          </p>
        </div>

        <section className="mb-10 rounded-3xl border border-white/8 bg-[#0c1426] p-7">
          <div className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-amber-400">Provozovatel</div>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            {[
              { label: 'Provozovatel', value: 'Karel Zdeněk' },
              { label: 'IČO', value: '23660295' },
              { label: 'Web', value: 'smlouvahned.cz' },
              { label: 'Kontaktní e-mail', value: 'info@smlouvahned.cz' },
              { label: 'Typ subjektu', value: 'Fyzická osoba podnikatel' },
              { label: 'Povaha služby', value: 'Software pro sestavení standardizovaných dokumentů' },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{item.label}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 space-y-6 text-sm leading-relaxed text-slate-300">
          <div>
            <h2 className="mb-3 text-xl font-black text-white">Jak nástroj funguje</h2>
            <p>
              Uživatel vyplní formulář s konkrétními údaji a systém z nich sestaví dokument podle připravené
              šablony pro daný typ smlouvy. Smyslem nástroje je zjednodušit běžné situace, ve kterých se strany
              na obsahu již shodly a potřebují jej zachytit přehledně a písemně.
            </p>
            <p className="mt-3">
              Obsah šablon vychází z obvyklých náležitostí daného typu dokumentu a z české legislativy platné v
              době poslední textové revize. Při změnách právních předpisů nebo po zjištěných nepřesnostech obsah
              průběžně upravujeme.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-black text-white">Co od služby čekat</h2>
            <p>
              SmlouvaHned pomáhá se strukturovaným zapsáním dohodnutých podmínek. Soustředíme se na srozumitelný
              formulář, jasné vysvětlení variant služby a transparentní obchodní informace.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-black text-white">Co od služby nečekat</h2>
            <div className="space-y-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
              {limits.map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 font-black text-rose-400">×</span>
                  <div>
                    <div className="mb-1 text-sm font-bold text-white">{item.title}</div>
                    <p className="text-xs leading-relaxed text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-black text-white">Kdy doporučujeme advokáta</h2>
            <ul className="space-y-2">
              {[
                'Pokud řešíte vyšší hodnotu plnění nebo složitější majetkovou situaci.',
                'Pokud je ve věci mezinárodní prvek nebo nejistota ohledně rozhodného práva.',
                'Pokud mezi stranami už probíhá spor nebo je pravděpodobné, že vznikne.',
                'Pokud potřebujete individuální návrh nestandardních ustanovení.',
                'Pokud je potřeba notářského zápisu nebo úředního ověření podpisu podle konkrétní situace.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="mt-0.5 shrink-0 text-amber-500">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-slate-400">
              Seznam advokátů najdete na webu{' '}
              <a
                href="https://www.cak.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300"
              >
                České advokátní komory
              </a>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-2 text-sm font-black text-white">Aktuálnost obsahu</div>
            <p className="text-xs leading-relaxed text-slate-400">
              Obsah webu a textové šablony průběžně revidujeme. Poslední textová revize hlavních informací o
              službě proběhla 4. dubna 2026.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-amber-500 py-4 text-center text-sm font-black uppercase text-black transition hover:bg-amber-400"
          >
            Vybrat typ smlouvy →
          </Link>
          <Link
            href="/kontakt"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
          >
            Kontakt
          </Link>
        </div>

        <div className="mt-10 border-t border-white/8 pt-8 text-xs leading-relaxed text-slate-600">
          <p>Provozovatel: Karel Zdeněk · IČO: 23660295 · smlouvahned.cz</p>
          <p className="mt-1">
            SmlouvaHned je software pro tvorbu standardizovaných dokumentů. Neposkytuje právní poradenství a
            není advokátní kanceláří ve smyslu zákona č. 85/1996 Sb.
          </p>
        </div>
      </div>
    </main>
  );
}
