import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedContracts from '@/app/components/RelatedContracts';

export const metadata: Metadata = {
  title: 'Smlouva o zápůjčce (půjčka) online 2026 | SmlouvaHned',
  description:
    'Smlouva o zápůjčce peněz — splátky, úroky, zajištění. Dle § 2390 OZ 2026. Ochrana věřitele i dlužníka. PDF ihned ke stažení od 99 Kč.',
  keywords: [
    'smlouva o zápůjčce',
    'půjčka smlouva vzor 2026',
    'smlouva o půjčce peněz',
    'zápůjčka smlouva online',
    'smlouva o půjčce vzor',
    'půjčka mezi přáteli smlouva',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/pujcka-smlouva' },
  openGraph: {
    title: 'Smlouva o zápůjčce (půjčka) online 2026 | SmlouvaHned',
    description: 'Smlouva o zápůjčce peněz — splátky, úroky, zajištění. § 2390 OZ. Od 99 Kč.',
    url: 'https://smlouvahned.cz/pujcka-smlouva',
  },
};

const faq = [
  {
    q: 'Musí být smlouva o půjčce písemná?',
    a: 'Zákon písemnou formu nevyžaduje, ale pro sumu vyšší než několik tisíc korun je písemná smlouva zásadní. Bez ní je obtížné prokázat výši půjčky, termín splatnosti nebo sjednaný úrok — zejména v soudním sporu.',
  },
  {
    q: 'Jak vysoký může být úrok?',
    a: 'Zákon nestanoví maximální výši úroku u zápůjček mezi nepodnikajícími fyzickými osobami, ale úrok nesmí být v rozporu s dobrými mravy. U spotřebitelských úvěrů platí přísnější pravidla. Doporučujeme sjednat úrok odpovídající obvyklé tržní hladině.',
  },
  {
    q: 'Co se stane, když dlužník nesplácí?',
    a: 'Věřitel může dlužníka upomenout a následně pohledávku vymáhat soudně. Pokud smlouva obsahuje smluvní pokutu nebo exekuční doložku (formou notářského zápisu), je vymáhání výrazně snazší. Uznání dluhu obnoví promlčecí lhůtu na 10 let.',
  },
  {
    q: 'Jak dlouhá je promlčecí lhůta?',
    a: 'Obecná promlčecí lhůta u zápůjčky je 3 roky od splatnosti. Pokud dlužník svůj dluh písemně uzná, promlčecí lhůta se obnoví na 10 let od uznání. Proto je uznání dluhu důležitým nástrojem věřitele při vymáhání starších pohledávek.',
  },
];

export default function PujckaSmlouvaPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
            { '@type': 'ListItem', position: 2, name: 'Smlouva o půjčce vzor 2026', item: 'https://smlouvahned.cz/pujcka-smlouva' },
          ],
        }).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Co mus\u00ed smlouva o z\u00e1p\u016fj\u010dce obsahovat?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Smlouva o z\u00e1p\u016fj\u010dce (\u00a7 2390 OZ) mus\u00ed identifikovat v\u011b\u0159itele a dlu\u017en\u00edka, stanovit v\u00fd\u0161i z\u00e1p\u016fj\u010dky, datum poskytnut\u00ed, splatnost a p\u0159\u00edpadnou \u00farokovou sazbu. Bez p\u00edsemn\u00e9 smlouvy je v p\u0159\u00edpad\u011b sporu obt\u00ed\u017en\u00e9 prok\u00e1zat podm\u00ednky.\"}}, {\"@type\": \"Question\", \"name\": \"Lze sjednat \u00farok u p\u016fj\u010dky mezi fyzick\u00fdmi osobami?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Ano. \u00darok je p\u0159\u00edpustn\u00fd, ale mus\u00ed b\u00fdt p\u0159im\u011b\u0159en\u00fd \u2014 extr\u00e9mn\u011b vysok\u00e9 \u00faroky jsou v rozporu s dobr\u00fdmi mravy a mohou b\u00fdt soudem sn\u00ed\u017eeny. Z\u00e1konn\u00e1 hranice nen\u00ed pevn\u011b stanovena, ale praxi pova\u017eujeme \u00farok nad 2\u00d7 pr\u016fm\u011brnou sazbu bankovn\u00edch \u00fav\u011br\u016f za problematick\u00fd.\"}}, {\"@type\": \"Question\", \"name\": \"Co se stane, kdy\u017e dlu\u017en\u00edk nezaplat\u00ed?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"V\u011b\u0159itel m\u016f\u017ee po splatnosti pohled\u00e1vku vym\u00e1hat soudn\u011b. Bez p\u00edsemn\u00e9 smlouvy mus\u00ed existenci a v\u00fd\u0161i dluhu prok\u00e1zat jinak (SMS, e-mail, sv\u011bdci). Smlouva s uzn\u00e1n\u00edm z\u00e1vazku a smluvn\u00ed pokutou v\u00fdrazn\u011b zjednodu\u0161uje vym\u00e1h\u00e1n\u00ed.\"}}, {\"@type\": \"Question\", \"name\": \"Je p\u016fj\u010dka p\u0159\u00edbuzn\u00fdm bez\u00faro\u010dn\u00e1 osvobozena od dan\u011b?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Bez\u00faro\u010dn\u00e1 z\u00e1p\u016fj\u010dka p\u0159\u00edbuzn\u00e9mu nen\u00ed automaticky p\u0159\u00edjmem z darov\u00e1n\u00ed \u2014 jde o z\u00e1p\u016fj\u010dku, ne dar. Pokud ale v\u011b\u0159itel od za\u010d\u00e1tku v\u00ed, \u017ee ji nebude cht\u00edt zp\u011bt, m\u016f\u017ee finan\u010dn\u00ed \u00fa\u0159ad situaci posuzovat jako dar.\"}}]}".replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Smlouva o zápůjčce</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-rose-400">
            § 2390 a násl. Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Smlouva o zápůjčce<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Půjčujete nebo přijímáte peníze? Písemná smlouva o zápůjčce jasně zachytí výši, termín splatnosti, úroky a podmínky — a ochrání obě strany při sporech.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/pujcka"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 99 Kč · PDF ihned · Dle § 2390 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co zápůjčka slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '👥', title: 'Půjčka mezi přáteli', desc: 'Jasné podmínky předcházejí sporům. Ochrana věřitele i dlužníka v případě neshod.' },
              { icon: '👨‍💼', title: 'Podnikatelská zápůjčka', desc: 'Mezi firmami nebo OSVČ — splátky, úroky, zajištění. Podklad pro daňové účely.' },
              { icon: '📅', title: 'Splátková dohoda', desc: 'Rozložení splácení na měsíční částky s přesným splátkový kalendářem.' },
              { icon: '💹', title: 'Úročená zápůjčka', desc: 'Sjednaný úrok nad rámec jistiny — kompenzace za poskytnutí peněz.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co smlouva o zápůjčce obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace věřitele a dlužníka',
              'Výše zápůjčky a měna',
              'Datum předání peněz',
              'Termín splatnosti nebo splátkový kalendář',
              'Úrok (nebo výslovné ujednání o bezúročnosti)',
              'Smluvní pokuta za prodlení se splácením',
              'Zajištění pohledávky (zástavní právo, ručení) — pro. varianta',
              'Prohlášení o faktickém předání peněz',
              'Podmínky předčasného splacení',
              'Závěrečná установení a podpisy',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-rose-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky ke smlouvě o zápůjčce</h2>
          <div className="space-y-3">
            {faq.map(item => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-rose-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte smlouvu o zápůjčce</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro půjčku peněz — splátky, úroky, zajištění, PDF ihned.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/pujcka"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 99 Kč · § 2390 OZ · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/uznani-dluhu" className="hover:text-slate-300 transition">Uznání dluhu</Link>
          <Link href="/kupni-smlouva" className="hover:text-slate-300 transition">Kupní smlouva</Link>
        </div>
      </div>
      <RelatedContracts currentHref="/pujcka-smlouva" cluster="finance" />
    </main>
  );
}
