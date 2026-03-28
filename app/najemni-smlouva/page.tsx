import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nájemní smlouva jednoduše a správně — vzor 2026 online',
  description:
    'Vytvořte nájemní smlouvu na byt nebo dům online. Vhodné pro běžné pronájmy, bez složitého hledání vzorů. Aktuální dle OZ 2026, předávací protokol v ceně. Od 249 Kč.',
  keywords: [
    'nájemní smlouva',
    'nájemní smlouva vzor',
    'nájemní smlouva 2026',
    'nájemní smlouva online',
    'nájemní smlouva ke stažení',
    'nájemní smlouva byt',
    'smlouva o nájmu bytu',
    'nájemní smlouva PDF',
    'vzor nájemní smlouvy',
    'nájemní smlouva zdarma',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/najemni-smlouva' },
  openGraph: {
    title: 'Nájemní smlouva jednoduše a správně — vzor 2026',
    description:
      'Nájemní smlouva online pro pronajímatele i nájemníky. Aktuální dle OZ 2026. Předávací protokol v ceně. Od 249 Kč.',
    url: 'https://smlouvahned.cz/najemni-smlouva',
    type: 'website',
  },
};

const faq = [
  {
    q: 'Jak dlouho vytvoření smlouvy trvá?',
    a: 'Vyplnění formuláře zabere většinou méně než 5 minut. PDF ke stažení obdržíte ihned po zaplacení — bez čekání.',
  },
  {
    q: 'Je smlouva aktuální pro rok 2026?',
    a: 'Ano. Šablona reflektuje platný občanský zákoník (zákon č. 89/2012 Sb.) a aktuální smluvní praxi. Pravidelně ji aktualizujeme.',
  },
  {
    q: 'Potřebuji k tomu právníka?',
    a: 'Pro standardní pronájem bytu nebo domu právník potřeba není — nájemní smlouva nevyžaduje notářské ověření ani advokátní doložku. Pokud jde o nestandardní situaci (spor, neobvyklé podmínky, vysoká hodnota), doporučujeme konzultaci s advokátem.',
  },
  {
    q: 'Co obsahuje předávací protokol a proč ho potřebuji?',
    a: 'Předávací protokol je příloha smlouvy, která zachycuje stav bytu, odečty měřidel a soupis vybavení ke dni předání. Chrání vás při vracení kauce — bez protokolu je těžké prokázat, v jakém stavu byl byt předán.',
  },
  {
    q: 'Jaký je rozdíl mezi základní smlouvou a rozšířenou právní ochranou?',
    a: 'Základní dokument obsahuje všechna povinná zákonná ustanovení. Rozšířená právní ochrana (+200 Kč) přidává smluvní pokuty za porušení povinností, detailní odpovědnostní klauzule a sankce za prodlení — váš protějšek ví, že smlouva má reálné důsledky.',
  },
  {
    q: 'Je moje platba a osobní údaje v bezpečí?',
    a: 'Platbu zpracovává výhradně Stripe — vaše platební data se k nám nikdy nedostanou. Osobní údaje jsou uchovávány šifrovaně po dobu max. 7 dní, poté automaticky smazány.',
  },
];

const contents = [
  { icon: '👤', label: 'Identifikace stran', desc: 'Pronajímatel i nájemce — jméno, adresa, rodné číslo / IČO, kontakt.' },
  { icon: '🏠', label: 'Popis předmětu nájmu', desc: 'Adresa, číslo bytu, patro, výměra, vybavení a příslušenství.' },
  { icon: '💰', label: 'Výše nájmu a služeb', desc: 'Nájemné, zálohy na energie a služby, den splatnosti, číslo účtu.' },
  { icon: '🔑', label: 'Kauce a podmínky vrácení', desc: 'Výše kauce (max. 3× nájemné), lhůta pro vrácení, podmínky srážek.' },
  { icon: '📅', label: 'Doba nájmu', desc: 'Na dobu určitou nebo neurčitou, výpovědní podmínky dle OZ.' },
  { icon: '📋', label: 'Práva a povinnosti', desc: 'Pravidla pro zvířata, kouření, Airbnb, podnájem, opravy, kontroly.' },
  { icon: '📄', label: 'Předávací protokol', desc: 'Stav bytu, odečty měřidel, soupis vybavení — automatická příloha.' },
  { icon: '⚖️', label: 'Sankce a ochranné klauzule', desc: 'Smluvní pokuty za prodlení, porušení podmínek a ochranu pro obě strany (ve variantě Rozšířená právní ochrana).' },
];

const steps = [
  { n: '01', title: 'Vyplníte údaje', desc: 'Pronajímatel, nájemce, byt, nájemné, kauce, pravidla. Formulář vás provede každou sekcí.' },
  { n: '02', title: 'Zkontrolujete souhrn', desc: 'Před platbou vidíte přehled všech podmínek. Nic nezaplatíte, dokud si vše neověříte.' },
  { n: '03', title: 'Vyberete variantu', desc: 'Základní smlouva (249 Kč) nebo rozšířená ochrana se sankcemi (399 Kč).' },
  { n: '04', title: 'Stáhnete PDF', desc: 'Ihned po zaplacení obdržíte kompletní nájemní smlouvu včetně předávacího protokolu.' },
];

export default function NajemniSmlouvaPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.09),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.05),transparent_50%)]" />

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/6">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div>
              <div className="font-black tracking-tight text-white leading-tight">SmlouvaHned</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Právní dokumenty online</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-slate-400 md:flex">
            <Link href="/#vyber-smlouvy" className="hover:text-white transition">Všechny smlouvy</Link>
            <Link href="/blog/najemni-smlouva-vzor-2026" className="hover:text-white transition">Průvodce</Link>
            <Link href="/najem" className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-tight text-black hover:bg-amber-400 transition">
              Vytvořit smlouvu →
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative z-10">

        {/* ── BREADCRUMB ─────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
            <span className="mx-2 text-slate-700">›</span>
            <span className="text-slate-400">Nájemní smlouva</span>
          </nav>
        </div>

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Aktuální pro legislativu 2026
          </div>

          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Nájemní smlouva<br />
            <span className="text-amber-500 italic">jednoduše a správně</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
            Vhodné pro běžné pronájmy bytů a domů. Bez složitého hledání vzorů —
            formulář vás provede krok za krokem a hotovo máte během několika minut.
          </p>

          <ul className="mt-5 flex flex-wrap gap-3">
            {[
              '✓ Aktuální dle OZ 2026',
              '✓ Předávací protokol v ceně',
              '✓ PDF ihned ke stažení',
              '✓ Platba přes Stripe',
            ].map(b => (
              <li key={b} className="rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-xs font-semibold text-slate-300">
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/najem"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.3)] transition hover:bg-amber-400 hover:shadow-[0_0_55px_rgba(245,158,11,0.4)]"
            >
              Vytvořit nájemní smlouvu
              <span className="text-lg">→</span>
            </Link>
            <Link href="/blog/najemni-smlouva-vzor-2026" className="text-sm text-slate-500 hover:text-slate-300 transition underline underline-offset-4 decoration-slate-700">
              Přečíst průvodce nájemní smlouvou
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-600">
            Standardní smluvní vzor. Nevhodné pro nestandardní situace nebo právní spory — v těchto případech doporučujeme advokáta.
          </p>
        </section>

        {/* ── PRO KOHO ───────────────────────────────────── */}
        <section className="border-y border-white/6 bg-white/[0.02] py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Pro koho</div>
            <h2 className="mb-10 text-2xl font-black tracking-tight text-white md:text-3xl">Komu nájemní smlouva pomůže</h2>

            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: '🏠',
                  title: 'Pronajímatelé bytů',
                  points: [
                    'Jasná pravidla pro nájemníky',
                    'Ochrana kauce a majetku',
                    'Podmínky pro zvířata a Airbnb',
                    'Předávací protokol jako příloha',
                  ],
                },
                {
                  icon: '👤',
                  title: 'Nájemníci',
                  points: [
                    'Přehledné podmínky pronájmu',
                    'Jasná práva a povinnosti',
                    'Ochrana před nejasnostmi',
                    'Podmínky vrácení kauce',
                  ],
                },
                {
                  icon: '📅',
                  title: 'Dlouhodobý pronájem',
                  points: [
                    'Smlouva na dobu určitou i neurčitou',
                    'Podmínky výpovědi dle OZ',
                    'Indexace nájemného',
                    'Platné pro 12+ měsíců',
                  ],
                },
              ].map(c => (
                <div key={c.title} className="rounded-3xl border border-white/8 bg-[#0c1426] p-6">
                  <div className="mb-3 text-3xl">{c.icon}</div>
                  <h3 className="mb-4 font-black text-white">{c.title}</h3>
                  <ul className="space-y-2">
                    {c.points.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="mt-0.5 flex-shrink-0 text-amber-500">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CO SMLOUVA OBSAHUJE ─────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-14">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Obsah dokumentu</div>
          <h2 className="mb-2 text-2xl font-black tracking-tight text-white md:text-3xl">Co nájemní smlouva obsahuje</h2>
          <p className="mb-10 max-w-xl text-sm text-slate-500">
            Dokument je sestavován dynamicky dle vašich podmínek. Každá sekce odpovídá standardní smluvní praxi.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contents.map(c => (
              <div key={c.label} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
                <div className="mb-2 text-2xl">{c.icon}</div>
                <div className="mb-1 text-sm font-black text-white">{c.label}</div>
                <p className="text-xs leading-relaxed text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── JAK TO FUNGUJE ─────────────────────────────── */}
        <section className="border-y border-white/6 bg-white/[0.02] py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Postup</div>
            <h2 className="mb-10 text-2xl font-black tracking-tight text-white md:text-3xl">Jak to funguje — 4 kroky</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(s => (
                <div key={s.n} className="relative">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-sm font-black text-amber-400">
                    {s.n}
                  </div>
                  <h3 className="mb-2 font-black text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CENÍK ──────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-14">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Ceník</div>
          <h2 className="mb-10 text-2xl font-black tracking-tight text-white md:text-3xl">Vyberte variantu</h2>

          <div className="grid gap-5 md:grid-cols-2 lg:max-w-2xl">
            {/* Základní */}
            <div className="rounded-3xl border border-slate-800 bg-[#0c1426] p-7">
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">Základní smlouva</div>
              <div className="mb-1 text-4xl font-black text-white">249 Kč</div>
              <p className="mb-5 text-sm text-slate-400">Kompletní nájemní smlouva připravená k podpisu</p>
              <ul className="mb-6 space-y-2">
                {[
                  'Všechna zákonná povinná ustanovení',
                  'Přizpůsobená vašim podmínkám',
                  'Předávací protokol jako příloha',
                  'PDF ihned ke stažení',
                  'Platné pro legislativu 2026',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 flex-shrink-0 text-amber-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/najem" className="block rounded-2xl border border-white/15 bg-white/5 py-3 text-center text-sm font-black uppercase tracking-tight text-white transition hover:bg-white/10">
                Vytvořit smlouvu
              </Link>
            </div>

            {/* Profesionální */}
            <div className="relative rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-[#0c1426] p-7 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                Nejčastěji voleno
              </div>
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-amber-500">Rozšířená právní ochrana</div>
              <div className="mb-1 text-4xl font-black text-white">399 Kč</div>
              <p className="mb-5 text-sm text-slate-400">Smluvní pokuty, odpovědnost a sankce za prodlení</p>
              <ul className="mb-6 space-y-2">
                {[
                  'Vše ze základní smlouvy',
                  'Smluvní pokuty za porušení povinností',
                  'Sankce za prodlení s platbou',
                  'Detailní odpovědnostní ustanovení',
                  'Podmínky pro spory a doručování',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 flex-shrink-0 text-amber-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/najem" className="block rounded-2xl bg-amber-500 py-3 text-center text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
                Vytvořit s profesionální ochranou →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────── */}
        <section className="border-t border-white/6 bg-white/[0.02] py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Časté otázky</div>
            <h2 className="mb-10 text-2xl font-black tracking-tight text-white md:text-3xl">Odpovědi na časté otázky</h2>

            <div className="grid gap-3 lg:grid-cols-2">
              {faq.map(item => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-amber-500/30 open:bg-amber-500/[0.04]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-white">
                    <span className="text-sm leading-snug">{item.q}</span>
                    <span className="flex-shrink-0 text-lg text-slate-600 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>

            <p className="mt-8 text-sm text-slate-500">
              Hledáte více informací? Přečtěte si náš{' '}
              <Link href="/blog/najemni-smlouva-vzor-2026" className="text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
                průvodce nájemní smlouvou 2026
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent px-8 py-12 text-center">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Připraveni začít?</div>
            <h2 className="mx-auto mb-4 max-w-lg text-3xl font-black tracking-tight text-white md:text-4xl">
              Vytvořte nájemní smlouvu dnes
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-400">
              Formulář zabere méně než 5 minut. Výsledkem je kompletní nájemní smlouva s předávacím protokolem, připravená k podpisu.
            </p>
            <Link
              href="/najem"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-10 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_50px_rgba(245,158,11,0.3)] transition hover:bg-amber-400"
            >
              Vytvořit nájemní smlouvu
              <span className="text-lg">→</span>
            </Link>
            <div className="mt-4 text-xs text-slate-600">
              Od 249 Kč · PDF ihned · Dle § 2201 OZ · Bez závazků
            </div>
          </div>
        </section>

        {/* ── RELATED + FOOTER NAV ───────────────────────── */}
        <section className="border-t border-white/6 py-10">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/podnajem', label: '🏘️ Podnájemní smlouva' },
                { href: '/blog/najemni-smlouva-vzor-2026', label: '📖 Průvodce nájemní smlouvou 2026' },
                { href: '/pracovni-smlouva', label: '💼 Pracovní smlouva' },
                { href: '/kupni-smlouva', label: '🛒 Kupní smlouva' },
                { href: '/pujcka', label: '💰 Smlouva o zápůjčce' },
                { href: '/', label: '📋 Všechny smlouvy' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
