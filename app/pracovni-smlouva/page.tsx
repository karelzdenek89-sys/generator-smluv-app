import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pracovní smlouva online 2026 — vzor zdarma ke stažení | SmlouvaHned',
  description:
    'Vygenerujte pracovní smlouvu se všemi zákonnými náležitostmi dle zákoníku práce 2026. Druh práce, místo výkonu, mzda, zkušební doba. PDF ihned od 99 Kč.',
  keywords: [
    'pracovní smlouva', 'pracovní smlouva vzor', 'pracovní smlouva online', 'pracovní smlouva 2026',
    'pracovní smlouva PDF', 'pracovní smlouva ke stažení', 'vzor pracovní smlouvy',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/pracovni-smlouva' },
  openGraph: {
    title: 'Pracovní smlouva online 2026 | SmlouvaHned',
    description: 'Pracovní smlouva dle zákoníku práce 2026. Mzda, zkušební doba, výpověď. Od 99 Kč.',
    url: 'https://smlouvahned.cz/pracovni-smlouva',
  },
};

const faq = [
  {
    q: 'Co musí pracovní smlouva povinně obsahovat?',
    a: 'Dle § 34 zákoníku práce musí pracovní smlouva obsahovat: druh práce, místo výkonu práce a den nástupu do práce. Vše ostatní — mzda, pracovní doba, zkušební doba — je doporučeno sjednat písemně.',
  },
  {
    q: 'Jak dlouhá může být zkušební doba?',
    a: 'U řadových zaměstnanců maximálně 3 měsíce, u vedoucích zaměstnanců maximálně 6 měsíců. Zkušební doba nesmí přesáhnout polovinu sjednané doby trvání pracovního poměru.',
  },
  {
    q: 'Jaká je výpovědní doba?',
    a: 'Zákonná výpovědní doba jsou minimálně 2 měsíce. V pracovní smlouvě lze sjednat delší výpovědní dobu, nesmí být ale delší pro zaměstnavatele než pro zaměstnance.',
  },
  {
    q: 'Je pracovní smlouva na dobu neurčitou povinná?',
    a: 'Pracovní smlouvy na dobu určitou lze sjednávat maximálně dvakrát po sobě a celková délka nesmí přesáhnout 3 roky. Poté musí být sjednaná na dobu neurčitou nebo pracovní poměr skončit.',
  },
  {
    q: 'Čím se liší pracovní smlouva od DPP a DPČ?',
    a: 'Pracovní smlouva zakládá plnohodnotný pracovní poměr s odvody sociálního a zdravotního pojištění. DPP (do 300 hod./rok, do 11 500 Kč/měs.) a DPČ jsou dohody mimo pracovní poměr s odlišným režimem odvodů.',
  },
];

export default function PracovniSmlouvaPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Pracovní smlouva vzor 2026', item: 'https://smlouvahned.cz/pracovni-smlouva' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Co mus\u00ed pracovn\u00ed smlouva povinn\u011b obsahovat?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Z\u00e1kon\u00edk pr\u00e1ce (\u00a7 34) vy\u017eaduje t\u0159i povinn\u00e9 n\u00e1le\u017eitosti: druh pr\u00e1ce, m\u00edsto v\u00fdkonu pr\u00e1ce a den n\u00e1stupu do pr\u00e1ce. Bez t\u011bchto n\u00e1le\u017eitost\u00ed je smlouva vadn\u00e1.\"}}, {\"@type\": \"Question\", \"name\": \"Jak dlouh\u00e1 m\u016f\u017ee b\u00fdt zku\u0161ebn\u00ed doba?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Zku\u0161ebn\u00ed doba u b\u011b\u017en\u00e9ho zam\u011bstnance m\u016f\u017ee b\u00fdt maxim\u00e1ln\u011b 3 m\u011bs\u00edce, u vedouc\u00edho zam\u011bstnance maxim\u00e1ln\u011b 6 m\u011bs\u00edc\u016f. Zku\u0161ebn\u00ed dobu lze sjednat nejpozd\u011bji v den n\u00e1stupu.\"}}, {\"@type\": \"Question\", \"name\": \"Mus\u00ed b\u00fdt v pracovn\u00ed smlouv\u011b uvedena mzda?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Mzda m\u016f\u017ee b\u00fdt uvedena p\u0159\u00edmo v pracovn\u00ed smlouv\u011b nebo v samostatn\u00e9m mzdov\u00e9m v\u00fdm\u011bru. Ob\u011b mo\u017enosti jsou z\u00e1konn\u00e9. \u00dastn\u00ed p\u0159\u00edslib v\u00fd\u0161e mzdy bez p\u00edsemn\u00e9ho z\u00e1znamu nen\u00ed vymahateln\u00fd.\"}}, {\"@type\": \"Question\", \"name\": \"Jak se li\u0161\u00ed pracovn\u00ed smlouva od DPP?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Pracovn\u00ed smlouva zakl\u00e1d\u00e1 klasick\u00fd pracovn\u00ed pom\u011br s pln\u00fdmi pr\u00e1vy zam\u011bstnance (dovolen\u00e1, nemocensk\u00e1, v\u00fdpov\u011bdn\u00ed lh\u016fta). DPP je vhodn\u00e1 pro jednor\u00e1zov\u00e9 pr\u00e1ce do 300 hodin ro\u010dn\u011b a m\u00e1 m\u00e9n\u011b z\u00e1konn\u00e9 ochrany.\"}}]}".replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Pracovní smlouva</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">
            § 34 Zákoníku práce
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Pracovní smlouva online<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Pro zaměstnavatele, kteří chtějí mít pracovní smlouvu správně. Se všemi zákonnými náležitostmi,
            srozumitelně formulovanou — mzda, pracovní doba, zkušební a výpovědní doba.
          </p>
          <Link href="/pracovni"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
            Sestavit pracovní smlouvu →
          </Link>
          <div className="mt-4 text-sm text-slate-500">Od 99 Kč · PDF ihned · Zákoník práce 2026</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Komu je pracovní smlouva určena</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🏢', title: 'Malé firmy a OSVČ se zaměstnanci', desc: 'První zaměstnanec, brigádník na plný úvazek nebo odborník na zkrácenou dobu — správná smlouva od začátku.' },
              { icon: '👔', title: 'HR a personalisté', desc: 'Standardizovaná šablona pro přijímání nových zaměstnanců — rychlé vyplnění, konzistentní podmínky.' },
              { icon: '🔧', title: 'Živnostníci přijímající první zaměstnance', desc: 'Zákoník práce má přísná pravidla — správná smlouva vás chrání před sankcemi a spory.' },
              { icon: '📋', title: 'Zaměstnanci', desc: 'Chcete vědět, co podepisujete? Formulář ukazuje, co každý bod smlouvy znamená.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co pracovní smlouva obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Povinné náležitosti dle § 34 zákoníku práce',
              'Druh práce a stručná náplň pracovní činnosti',
              'Místo výkonu práce',
              'Den nástupu do práce',
              'Mzda nebo plat a způsob odměňování',
              'Délka pracovní doby a rozvrh směn',
              'Délka zkušební doby (max. 3 měsíce)',
              'Výpovědní doba (zákonná minimum 2 měsíce)',
              'Dovolená — zákonný nárok 4 týdny',
              'Druh pracovního poměru — na dobu určitou / neurčitou',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky k pracovní smlouvě</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-amber-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte pracovní smlouvu</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář s přehledným průvodcem — všechny zákonné náležitosti dle zákoníku práce 2026.
          </p>
          <Link href="/pracovni"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
            Sestavit pracovní smlouvu →
          </Link>
          <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Zákoník práce 2026 · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/blog/pracovni-smlouva-2026" className="hover:text-slate-300 transition">📖 Průvodce pracovní smlouvou</Link>
          <Link href="/dohoda-o-provedeni-prace" className="hover:text-slate-300 transition">DPP — Dohoda o provedení práce</Link>
          <Link href="/smlouva-o-dilo-online" className="hover:text-slate-300 transition">Smlouva o dílo</Link>
        </div>
      </div>
    </main>
  );
}
