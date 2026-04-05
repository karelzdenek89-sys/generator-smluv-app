import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kontakt | SmlouvaHned',
  description: 'Dotazy k objednávce, technické podpoře nebo fakturaci. Odpovídáme do 2 pracovních dnů. SmlouvaHned.cz neposkytuje právní poradenství — pro právní rady se obraťte na advokáta.',
};

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.08),transparent_45%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full">
        <div className="mb-6">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-amber-400 transition">
            ← SmlouvaHned
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 uppercase italic tracking-tighter">
          Kontakt
        </h1>
        <p className="text-slate-400 text-sm mb-5 max-w-lg">
          Máte dotaz k objednávce, fakturaci nebo technickému výstupu dokumentu? Napište nám — odpovídáme zpravidla do 2 pracovních dnů.
        </p>
        <div className="mb-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-xs text-slate-400 max-w-lg">
          <span className="font-bold text-amber-400">Upozornění:</span>{' '}
          SmlouvaHned.cz neposkytuje právní poradenství. Dotazy na výklad smluv, vhodnost dokumentu pro vaši situaci nebo doporučení v konkrétních případech proto nemůžeme zodpovědět. Pro právní rady se obraťte na advokáta —{' '}
          <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400/80 hover:text-amber-400 underline underline-offset-2 transition">
            seznam advokátů na cak.cz
          </a>.
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <a href="mailto:info@smlouvahned.cz"
            className="group bg-[#0c1426] border border-slate-800 hover:border-amber-500/40 rounded-3xl p-7 transition hover:-translate-y-0.5">
            <div className="text-3xl mb-4">✉️</div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">E-mail</div>
            <div className="font-bold text-white text-sm group-hover:text-amber-400 transition">info@smlouvahned.cz</div>
            <p className="text-xs text-slate-500 mt-1">Objednávky, reklamace, technická podpora</p>
          </a>

          <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-7">
            <div className="text-3xl mb-4">⏱️</div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Rychlost odpovědi</div>
            <div className="font-bold text-white text-sm">Do 2 pracovních dnů</div>
            <p className="text-xs text-slate-500 mt-1">Po–Pá</p>
          </div>
        </div>

        <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-7 mb-8">
          <h2 className="font-black text-white text-sm mb-4 uppercase tracking-wider">Nejčastější dotazy</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Nenašel jsem odkaz ke stažení dokumentu.',
                a: 'Zkontrolujte e-mail (i spam). Pokud odkaz není, pošlete nám ID platby z potvrzení Stripe na info@smlouvahned.cz a dokument vám zašleme.',
              },
              {
                q: 'Potřebuji v dokumentu opravit chybu.',
                a: 'Pošlete nám na e-mail přesný popis chyby a ID vaší objednávky. Pokud je chyba způsobena vaším špatným zadáním, vygenerujeme nový dokument za sníženou cenu.',
              },
              {
                q: 'Nestihl jsem stáhnout dokument do 7 dní.',
                a: 'Kontaktujte nás e-mailem s důkazem platby. V odůvodněných případech odkaz obnovíme.',
              },
              {
                q: 'Potřebuji smlouvu, která není v nabídce.',
                a: 'Napište nám — aktivně rozšiřujeme katalog. Váš podnět zohledníme při plánování dalšího rozvoje.',
              },
            ].map(item => (
              <details key={item.q} className="group border border-white/5 rounded-2xl p-4">
                <summary className="cursor-pointer text-sm font-bold text-white list-none flex justify-between items-center gap-3">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-sm rounded-2xl transition shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            ← Zpět na výběr smluv
          </Link>
        </div>
      </div>
    </main>
  );
}
