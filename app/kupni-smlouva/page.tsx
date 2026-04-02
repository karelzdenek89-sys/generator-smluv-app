import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kupní smlouva online 2026 — vzor ke stažení | SmlouvaHned',
  description:
    'Kupní smlouva na auto, elektroniku, nábytek nebo jakoukoliv věc. Dle § 2079 OZ 2026. Vady, záruka, prohlášení prodávajícího. PDF ihned od 249 Kč.',
  keywords: [
    'kupní smlouva', 'kupní smlouva vzor', 'kupní smlouva online', 'kupní smlouva 2026',
    'kupní smlouva auto', 'kupní smlouva PDF', 'kupní smlouva movitá věc',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/kupni-smlouva' },
  openGraph: {
    title: 'Kupní smlouva online 2026 | SmlouvaHned',
    description: 'Kupní smlouva na auto i movité věci. § 2079 OZ. Vady, záruka, předání. Od 249 Kč.',
    url: 'https://smlouvahned.cz/kupni-smlouva',
  },
};

const faq = [
  {
    q: 'Kdy je kupní smlouva povinná?',
    a: 'Zákon písemnou formu kupní smlouvy u movitých věcí zpravidla nevyžaduje, avšak písemná smlouva chrání obě strany při sporech o vady, cenu nebo stav věci. U nemovitostí je písemná forma povinná.',
  },
  {
    q: 'Co je prohlášení prodávajícího o vadách?',
    a: 'Prodávající v smlouvě uvede, jaké vady mu jsou u předmětu koupě známy. Toto prohlášení chrání kupujícího — pokud se prokáže, že prodávající vadu zatajil, může kupující požadovat slevu nebo odstoupení.',
  },
  {
    q: 'Jak dlouhá je záruční doba u ojetého auta?',
    a: 'U prodeje mezi fyzickými osobami zákon nevyžaduje žádnou záruční dobu. U prodeje od podnikatele spotřebiteli platí zákonná odpovědnost za vady 24 měsíců. V smlouvě lze dobu odpovědnosti za vady omezit nebo vyloučit (pouze u prodejů mimo spotřebitelské vztahy).',
  },
  {
    q: 'Jak bezpečně předat peníze při prodeji auta?',
    a: 'Smlouva může obsahovat podmínky předání kupní ceny — hotovost při podpisu, bankovní převod před předáním, nebo vinkulace. V smlouvě je dobré uvést, že peníze byly předány, aby se předešlo sporům.',
  },
  {
    q: 'Musím k prodeji auta přikládat servisní knížku?',
    a: 'Zákon to přímo nevyžaduje, ale je to standardní praxe. Smlouva by měla uvádět, co kupující přebírá — klíče, TP, servisní knížku, rezervní kolo apod.',
  },
];

export default function KupniSmlouvaPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Co mus\u00ed kupn\u00ed smlouva obsahovat?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Kupn\u00ed smlouva mus\u00ed obsahovat identifikaci stran, p\u0159esn\u00fd popis v\u011bci (u auta VIN, u nemovitosti katastr\u00e1ln\u00ed \u00fadaje), kupn\u00ed cenu a zp\u016fsob/term\u00edn zaplacen\u00ed. Bez p\u0159esn\u00e9ho popisu p\u0159edm\u011btu koup\u011b je smlouva ne\u00fapln\u00e1.\"}}, {\"@type\": \"Question\", \"name\": \"Mus\u00ed b\u00fdt kupn\u00ed smlouva p\u00edsemn\u00e1?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"U nemovitost\u00ed v\u017edy ano \u2014 jinak nen\u00ed vklad do katastru mo\u017en\u00fd. U movit\u00fdch v\u011bc\u00ed z\u00e1kon p\u00edsemnou formu nevy\u017eaduje, ale siln\u011b ji doporu\u010dujeme pro hodnoty nad 5 000 K\u010d.\"}}, {\"@type\": \"Question\", \"name\": \"Jak se br\u00e1nit skryt\u00fdm vad\u00e1m?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Kupn\u00ed smlouva by m\u011bla obsahovat v\u00fdslovn\u00e9 prohl\u00e1\u0161en\u00ed prod\u00e1vaj\u00edc\u00edho o stavu v\u011bci a jej\u00edch vad\u00e1ch. Kupuj\u00edc\u00ed m\u00e1 pr\u00e1vo z odpov\u011bdnosti za vady uplatnit do 2 let od p\u0159ed\u00e1n\u00ed (\u00a7 2165 OZ).\"}}, {\"@type\": \"Question\", \"name\": \"Jak bezpe\u010dn\u011b p\u0159edat platbu?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"P\u0159i vy\u0161\u0161\u00edch \u010d\u00e1stk\u00e1ch doporu\u010dujeme bankovn\u00ed p\u0159evod s jasn\u011b identifikovan\u00fdm \u00fa\u010delem, nebo not\u00e1\u0159skou/advok\u00e1tn\u00ed \u00faschovu. Platba v hotovosti je riskantn\u00ed \u2014 bez p\u0159\u00edjmov\u00e9ho dokladu ji nelze zp\u011btn\u011b prok\u00e1zat.\"}}]}".replace(/</g, '\\u003c') }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Kupní smlouva</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-teal-400">
            § 2079 a násl. Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Kupní smlouva online<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            Prodáváte nebo kupujete auto, elektroniku, nábytek nebo jinou věc?
            Kupní smlouva ochrání obě strany — vady, záruka, prohlášení o stavu, bezpečné předání.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/kupni"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Kupní smlouva na věc →
            </Link>
            <Link href="/auto"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-tight text-white transition hover:bg-white/10">
              Kupní smlouva na auto →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 249 Kč · PDF ihned · Dle § 2079 OZ</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Pro co kupní smlouva slouží</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🚗', title: 'Prodej ojetého auta', desc: 'Stav vozidla, kilometry, technická závady, servisní historie. Ochrana prodávajícího i kupujícího.' },
              { icon: '📱', title: 'Elektronika a spotřebiče', desc: 'Telefony, notebooky, televize. Funkčnost, vady, příslušenství, záruční list.' },
              { icon: '🛋️', title: 'Nábytek a vybavení', desc: 'Pohovky, skříně, kuchyňské linky. Stav, rozměry, podmínky předání a vyzvednutí.' },
              { icon: '🏍️', title: 'Motocykly a kola', desc: 'Stejný rámec jako u auta — stav, evidence, převod vlastnictví, klíče a doklady.' },
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
          <h2 className="text-2xl font-black text-white mb-6">Co kupní smlouva obsahuje</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace prodávajícího a kupujícího',
              'Přesný popis předmětu koupě (VIN, sériové číslo, stav)',
              'Kupní cena a způsob a termín zaplacení',
              'Prohlášení prodávajícího o známých vadách',
              'Odpovědnost za vady a záruční podmínky',
              'Datum a místo předání věci',
              'Co přechází spolu s věcí (klíče, doklady, příslušenství)',
              'Vlastnické právo přechází předáním a zaplacením',
              'Podmínky odstoupení od smlouvy',
              'Smluvní pokuta za nesplnění závazků (dle varianty)',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky ke kupní smlouvě</h2>
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
          <h2 className="text-2xl font-black text-white mb-3">Sestavte kupní smlouvu</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pro prodej věci nebo auta — přesně dle vašich podmínek, PDF ihned.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/kupni"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Kupní smlouva na věc →
            </Link>
            <Link href="/auto"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-tight text-white transition hover:bg-white/10">
              Kupní smlouva na auto →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 249 Kč · § 2079 OZ · PDF ihned</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/darovaci" className="hover:text-slate-300 transition">Darovací smlouva</Link>
          <Link href="/najemni-smlouva" className="hover:text-slate-300 transition">Nájemní smlouva</Link>
        </div>
      </div>
    </main>
  );
}
