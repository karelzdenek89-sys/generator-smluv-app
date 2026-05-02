import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedContracts from '@/app/components/RelatedContracts';

export const metadata: Metadata = {
  title: 'Smlouva o spolupráci online 2026 — vzor ke stažení | SmlouvaHned',
  description:
    'Smlouva o spolupráci OSVČ nebo firem. Podíl na výnosech, IP práva, mlčenlivost, exit klauzule. Dle § 1746 OZ 2026. Od 99 Kč.',
  keywords: [
    'smlouva o spolupráci vzor 2026',
    'smlouva o spolupráci OSVČ',
    'smlouva o obchodní spolupráci',
    'smlouva o spolupráci online',
    'obchodní spolupráce smlouva',
    'smlouva o partnerství',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/smlouva-o-spolupraci' },
  openGraph: {
    title: 'Smlouva o spolupráci online 2026 | SmlouvaHned',
    description: 'Smlouva o spolupráci OSVČ nebo firem. Podíl na výnosech, IP práva, mlčenlivost, exit. § 1746 OZ. Od 99 Kč.',
    url: 'https://smlouvahned.cz/smlouva-o-spolupraci',
  },
};

const faq = [
  {
    q: 'Je smlouva o spolupráci to samé jako společnost nebo joint venture?',
    a: 'Ne. Smlouva o spolupráci upravuje obchodní vztah dvou samostatných subjektů — nevzniká nová právní entita. Každá strana zůstává samostatným podnikatelským subjektem se svými povinnostmi vůči finančnímu úřadu a sociální/zdravotní pojišťovně.',
  },
  {
    q: 'Jak rozdělit výnosy ze spolupráce?',
    a: 'Smlouva by měla přesně definovat, co tvoří základ pro výpočet (hrubé výnosy, čistý zisk, konkrétní faktury) a v jakém poměru se výnosy dělí. Doporučujeme zahrnout i postup při vyúčtování a termíny výplat.',
  },
  {
    q: 'Co je exit klauzule a proč ji potřebuji?',
    a: 'Exit klauzule definuje, jak spolupráce může skončit — výpověď s výpovědní dobou, okamžité ukončení při hrubém porušení, nebo odkoupení podílu druhé strany. Bez ní může ukončení spolupráce způsobit spory o nevyplacené odměny nebo duševní vlastnictví.',
  },
  {
    q: 'Musím smlouvu o spolupráci registrovat?',
    a: 'Ne. Smlouva o spolupráci nevyžaduje žádnou registraci ani notářské ověření. Písemná forma je doporučena zejména při hodnotnějších spolupracích — chrání obě strany v případě sporu.',
  },
];

export default function SmlouvaOSpolupraci() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Smlouva o spolupráci vzor 2026', item: 'https://smlouvahned.cz/smlouva-o-spolupraci' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Smlouva o spolupráci</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-lime-400">
            § 1746 odst. 2 Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Smlouva o spolupráci<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Spolupracujete s jinou OSVČ nebo firmou na společném projektu? Smlouva o spolupráci jasně vymezí role, podíl na výnosech, IP práva a co se stane při ukončení.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/spoluprace"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 99 Kč · PDF ihned · Dle § 1746 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co smlouva o spolupráci slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🤝', title: 'Spolupráce dvou OSVČ', desc: 'Sdílení zákazníků, dovedností, výnosů — bez zakládání společnosti.' },
              { icon: '🏢', title: 'Obchodní partnerství', desc: 'Joint venture bez právní entity — jasné podmínky a exit.' },
              { icon: '💼', title: 'Referral a affiliate', desc: 'Odměna za přivedené zákazníky — provize z prodeje nebo služeb.' },
              { icon: '📋', title: 'Projektová spolupráce', desc: 'Sdílené náklady a výnosy — na konkrétní zakázce nebo souprojektu.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co smlouva o spolupráci obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace obou spolupracujících stran',
              'Předmět a oblast spolupráce',
              'Rozdělení rolí a odpovědností',
              'Podíl na výnosech nebo odměnách',
              'Náklady — kdo co hradí',
              'Ochrana duševního vlastnictví (IP)',
              'Mlčenlivost a zákaz přetahování zákazníků',
              'Zákaz konkurence (omezení v čase a rozsahu)',
              'Exit klauzule — podmínky ukončení',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-lime-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky ke smlouvě o spolupráci</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-lime-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-lime-500/20 bg-gradient-to-br from-lime-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte smlouvu o spolupráci</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro spolupráci — role, výnosy, IP práva, exit, PDF ihned.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/spoluprace"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 99 Kč · § 1746 OZ · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/nda-smlouva" className="hover:text-slate-300 transition">NDA smlouva</Link>
          <Link href="/smlouva-o-sluzbach" className="hover:text-slate-300 transition">Smlouva o službách</Link>
        </div>
      </div>
      <RelatedContracts currentHref="/smlouva-o-spolupraci" cluster="b2b" />
    </main>
  );
}
