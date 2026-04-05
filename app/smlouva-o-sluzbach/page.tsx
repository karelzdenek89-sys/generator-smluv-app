import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Smlouva o poskytování služeb online 2026 | SmlouvaHned',
  description:
    'Smlouva o poskytování služeb pro freelancery a agentury. SLA, IP práva, mlčenlivost, smluvní pokuty. Dle § 1746 OZ 2026. Od 249 Kč.',
  keywords: [
    'smlouva o poskytování služeb',
    'smlouva o službách vzor 2026',
    'freelancer smlouva',
    'smlouva o dílo freelancer',
    'smlouva IT služby',
    'smlouva o konzultačních službách',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/smlouva-o-sluzbach' },
  openGraph: {
    title: 'Smlouva o poskytování služeb online 2026 | SmlouvaHned',
    description: 'Smlouva o poskytování služeb pro freelancery a agentury. SLA, IP práva, mlčenlivost. § 1746 OZ. Od 249 Kč.',
    url: 'https://smlouvahned.cz/smlouva-o-sluzbach',
  },
};

const faq = [
  {
    q: 'Jaký je rozdíl mezi smlouvou o dílo a smlouvou o službách?',
    a: 'Smlouva o dílo se uzavírá na zhotovení konkrétního výsledku (webová stránka, stavba, projekt). Smlouva o poskytování služeb pokrývá opakované nebo průběžné plnění (správa systémů, marketing, poradenství). Volba ovlivňuje odpovědnost, způsob fakturace a ukončení.',
  },
  {
    q: 'Kdo vlastní výstupy vytvořené freelancerem?',
    a: 'Bez výslovné dohody platí, že autorská práva zůstávají autorovi (freelancerovi). Pokud chcete výstupy plně vlastnit, smlouva musí obsahovat převod majetkových práv nebo licenci. To je jedna z nejčastěji opomíjených klauzulí.',
  },
  {
    q: 'Co by mělo SLA obsahovat?',
    a: 'Service Level Agreement (SLA) definuje dostupnost služby (99,5 % uptime), reakční dobu při výpadku, způsob reportování incidentů a sankce při nedodržení. U IT služeb je SLA součástí každé profesionální smlouvy.',
  },
  {
    q: 'Jak ošetřit ukončení smlouvy?',
    a: 'Smlouva by měla obsahovat výpovědní dobu (typicky 1–3 měsíce), podmínky pro okamžité ukončení (hrubé porušení), postup při předání projektů a dat, a co se stane s nedokončenými úkoly nebo zaplacenými zálohami.',
  },
];

export default function SmlouvaOSluzbach() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Smlouva o poskytování služeb', item: 'https://smlouvahned.cz/smlouva-o-sluzbach' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Smlouva o službách</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-pink-400">
            § 1746 odst. 2 Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Smlouva o poskytování služeb<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Freelancer, konzultant nebo agentura poskytuje opakované nebo projektové služby. Jasná smlouva pomáhá přehledně zachytit cenu, SLA a IP práva.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/sluzby"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 249 Kč · PDF ke stažení · Dle § 1746 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co smlouva o službách slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '💻', title: 'IT a webové služby', desc: 'Vývoj, správa webu, SLA — jasné podmínky a odpovědnost poskytovatele.' },
              { icon: '📢', title: 'Marketing a PR', desc: 'Kampaně, obsah, reporty — opakované služby s měřitelnými výsledky.' },
              { icon: '🎓', title: 'Konzultace a poradenství', desc: 'Hodinová nebo paušální sazba — flexibilní rozsah a podmínky.' },
              { icon: '🎨', title: 'Grafika a kreativní práce', desc: 'Autorská práva, licencování výstupů — jasné rozdělení IP práv.' },
            ].map(c => (
              <div key={c.title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div>
                  <div className="font-bold text-white text-sm mb-1">{c.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Co smlouva o poskytování služeb obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace poskytovatele a objednatele',
              'Popis poskytovaných služeb a rozsah',
              'Cena — paušál, hodinová sazba nebo pevná částka',
              'SLA — dostupnost, reakční doba, podmínky plnění',
              'Fakturace a platební podmínky',
              'Ochrana autorských a duševních práv (IP)',
              'Mlčenlivost a ochrana obchodního tajemství',
              'Sankce za prodlení nebo nesplnění SLA',
              'Podmínky ukončení smlouvy a výpovědi',
              'Závěrečná установení a rozhodné právo',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-pink-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky ke smlouvě o službách</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-pink-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte smlouvu o službách</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro freelancery a agentury — SLA, IP práva, mlčenlivost, PDF ke stažení po ověřené platbě.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/sluzby"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 249 Kč · § 1746 OZ · PDF ke stažení</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/nda-smlouva" className="hover:text-slate-300 transition">NDA smlouva</Link>
          <Link href="/smlouva-o-dilo-online" className="hover:text-slate-300 transition">Smlouva o dílo</Link>
        </div>
      </div>
    </main>
  );
}

