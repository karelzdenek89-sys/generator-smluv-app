import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kontakt | SmlouvaHned',
  description:
    'Dotazy k objednávce, fakturaci nebo technickému výstupu dokumentu. SmlouvaHned neposkytuje individuální právní poradenství.',
};

export default function KontaktPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05080f] px-6 py-20 text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.08),transparent_45%)]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-slate-500 transition hover:text-amber-400"
          >
            ← SmlouvaHned
          </Link>
        </div>

        <h1 className="mb-3 text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
          Kontakt
        </h1>
        <p className="mb-5 max-w-lg text-sm text-slate-400">
          Máte dotaz k objednávce, fakturaci, reklamaci nebo technickému zpřístupnění dokumentu? Napište nám, odpovídáme
          zpravidla do 2 pracovních dnů.
        </p>

        <div className="mb-10 max-w-lg rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-xs text-slate-400">
          <span className="font-bold text-amber-400">Upozornění:</span>{' '}
          SmlouvaHned neposkytuje individuální právní poradenství. Nemůžeme proto posuzovat vhodnost dokumentu pro vaši
          konkrétní situaci ani doporučovat právní postup. U složitých nebo sporných případů doporučujeme obrátit se na
          advokáta.
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-2">
          <a
            href="mailto:info@smlouvahned.cz"
            className="group rounded-3xl border border-slate-800 bg-[#0c1426] p-7 transition hover:-translate-y-0.5 hover:border-amber-500/40"
          >
            <div className="mb-4 text-3xl">✉️</div>
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-amber-400">E-mail</div>
            <div className="text-sm font-bold text-white transition group-hover:text-amber-400">info@smlouvahned.cz</div>
            <p className="mt-1 text-xs text-slate-500">Objednávky, reklamace, technická podpora</p>
          </a>

          <div className="rounded-3xl border border-slate-800 bg-[#0c1426] p-7">
            <div className="mb-4 text-3xl">⏱️</div>
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-amber-400">Rychlost odpovědi</div>
            <div className="text-sm font-bold text-white">Obvykle do 2 pracovních dnů</div>
            <p className="mt-1 text-xs text-slate-500">Po–Pá</p>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-800 bg-[#0c1426] p-7">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Nejčastější dotazy</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Nenašel jsem odkaz ke stažení dokumentu.',
                a: 'Zkontrolujte e-mail včetně složky spam. Pokud odkaz nenajdete, pošlete nám identifikaci objednávky nebo potvrzení o platbě na info@smlouvahned.cz.',
              },
              {
                q: 'Potřebuji v dokumentu opravit chybu.',
                a: 'Pošlete nám popis problému a identifikaci objednávky. Pokud jde o technický problém nebo nesoulad se zadanými údaji, navrhneme další postup v rámci reklamace nebo technické podpory.',
              },
              {
                q: 'Nestihl jsem stáhnout dokument v době dostupnosti odkazu.',
                a: 'Kontaktujte nás e-mailem s identifikací objednávky. Prověříme, zda je možné odkaz znovu zpřístupnit.',
              },
              {
                q: 'Potřebuji smlouvu, která není v nabídce.',
                a: 'Můžete nám poslat podnět na e-mail. Nabídku průběžně rozšiřujeme, ale nemůžeme slíbit zařazení každého typu dokumentu.',
              },
            ].map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-white">
                  <span>{item.q}</span>
                  <span className="flex-shrink-0 text-slate-500 transition-transform group-open:rotate-45">+</span>
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
      </div>
    </main>
  );
}

