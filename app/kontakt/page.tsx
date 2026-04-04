import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kontakt | SmlouvaHned',
  description:
    'Dotazy k objednávce, platbě, fakturaci nebo technickému zpřístupnění dokumentu. Odpovídáme obvykle do 2 pracovních dnů.',
  alternates: { canonical: 'https://www.smlouvahned.cz/kontakt' },
};

const supportTopics = [
  'číslo nebo popis objednávky',
  'e-mail použitý při objednávce, pokud byl zadán',
  'stručný popis problému nebo dotazu',
  'screenshot nebo přesnou citaci chybové hlášky, pokud je k dispozici',
];

export default function KontaktPage() {
  return (
    <main className="premium-page-bg-ref flex min-h-screen items-center justify-center px-6 py-20 text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.08),transparent_45%)]" />

      <div className="premium-page-shell-ref max-w-2xl">
        <div className="mb-6">
          <Link href="/" className="premium-back-link-ref">
            ← SmlouvaHned
          </Link>
        </div>

        <div className="premium-page-hero-ref mb-8">
          <h1 className="mb-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">Kontakt</h1>
          <p className="max-w-lg text-sm text-slate-400">
            Máte dotaz k objednávce, fakturaci, reklamaci nebo technickému zpřístupnění dokumentu? Napište nám a přidejte
            co nejvíce informací, abychom vám mohli odpovědět co nejrychleji.
          </p>
        </div>

        <div className="premium-page-card-soft-ref mb-10 max-w-lg px-5 py-4 text-xs text-slate-400">
          <span className="font-bold text-amber-400">Poznámka:</span>{' '}
          SmlouvaHned neposkytuje individuální právní poradenství. Dotazy na právní výklad, posouzení konkrétní situace
          nebo doporučení vhodného právního postupu proto nemůžeme řešit. V takovém případě doporučujeme obrátit se na
          advokáta.
        </div>

        <div className="premium-page-grid-ref two mb-10">
          <a
            href="mailto:info@smlouvahned.cz"
            className="premium-page-card-ref group p-7 transition hover:-translate-y-0.5 hover:border-amber-500/40"
          >
            <div className="mb-4 text-3xl">E-mail</div>
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-amber-400">Hlavní kontakt</div>
            <div className="text-sm font-bold text-white transition group-hover:text-amber-400">info@smlouvahned.cz</div>
            <p className="mt-2 text-xs text-slate-500">Objednávky, reklamace, technická podpora, fakturace</p>
          </a>

          <div className="premium-page-card-ref p-7">
            <div className="mb-4 text-3xl">Čas odpovědi</div>
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-amber-400">Orientačně</div>
            <div className="text-sm font-bold text-white">Obvykle do 2 pracovních dnů</div>
            <p className="mt-2 text-xs text-slate-500">Po–Pá, podle vytížení podpory</p>
          </div>
        </div>

        <div className="premium-page-card-ref mb-8 p-7">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Co je dobré do zprávy uvést</h2>
          <ul className="space-y-2">
            {supportTopics.map(item => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="mt-0.5 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="premium-page-card-ref mb-8 p-7">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Nejčastější dotazy</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Nenašel jsem odkaz ke stažení dokumentu.',
                a: 'Zkontrolujte e-mailovou schránku včetně složky spam, pokud jste při objednávce zadali e-mail. Pokud odkaz nenajdete, napište nám a připojte identifikaci objednávky nebo potvrzení o platbě.',
              },
              {
                q: 'V dokumentu jsem našel technickou chybu.',
                a: 'Pošlete nám přesný popis problému, identifikaci objednávky a ideálně i screenshot nebo citaci chybové části. Podle typu problému navrhneme další postup.',
              },
              {
                q: 'Nestihl jsem dokument stáhnout včas.',
                a: 'Napište nám s identifikací objednávky. Pokud bude možné objednávku bezpečně ověřit, pokusíme se vám pomoci s obnovením přístupu.',
              },
              {
                q: 'Hledám dokument, který není v nabídce.',
                a: 'Můžete nám napsat, o jaký typ dokumentu jde. Nové typy dokumentů přidáváme postupně podle poptávky a vhodnosti pro standardizované použití.',
              },
            ].map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-white">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-slate-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase text-black transition hover:bg-amber-400"
          >
            ← Zpět na výběr smluv
          </Link>
        </div>

        <div className="premium-footer-ref mt-10 text-center text-xs leading-relaxed text-slate-600">
          <p>Provozovatel: Karel Zdeněk · IČO: 23660295 · Plzeňská 189, 345 61 Staňkov</p>
          <p className="mt-1">
            SmlouvaHned je obchodní označení online služby provozované touto osobou. Neposkytujeme právní poradenství.
          </p>
        </div>
      </div>
    </main>
  );
}
