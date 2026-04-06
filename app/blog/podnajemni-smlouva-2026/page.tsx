import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Podnájemní smlouva 2026: Co musí obsahovat a souhlas pronajímatele',
  description:
    'Průvodce podnájemní smlouvou pro rok 2026. Kdy potřebujete souhlas pronajímatele, co musí smlouva obsahovat, práva podnájemce a nejčastější chyby při podnájmu bytu.',
  keywords: [
    'podnájemní smlouva',
    'podnájem bytu 2026',
    'podnájemní smlouva vzor',
    'souhlas pronajímatele podnájem',
    'podnájem práva podnájemce',
    'podnájemní smlouva chyby',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/podnajemni-smlouva-2026' },
  openGraph: {
    title: 'Podnájemní smlouva 2026: Co musí obsahovat a souhlas pronajímatele',
    description: 'Souhlas pronajímatele, práva podnájemce, povinné náležitosti a nejčastější chyby. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/podnajemni-smlouva-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Podnájemní smlouva 2026: Co musí obsahovat a souhlas pronajímatele',
  description:
    'Kdy potřebujete souhlas pronajímatele, co musí podnájemní smlouva obsahovat, práva podnájemce a nejčastější chyby při podnájmu bytu.',
  url: 'https://smlouvahned.cz/blog/podnajemni-smlouva-2026',
  datePublished: '2026-04-02',
  dateModified: '2026-04-02',
  author: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  publisher: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    logo: { '@type': 'ImageObject', url: 'https://smlouvahned.cz/og-image.png' },
  },
  image: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
};
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://smlouvahned.cz/blog' },
    { '@type': 'ListItem', position: 3, name: 'Podnájemní smlouva 2026: Co musí obsahovat a souhlas pronajímatele', item: 'https://smlouvahned.cz/blog/podnajemni-smlouva-2026' },
  ],
};

export default function PodnajemniSmlouvaPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
        <span className="mx-2 text-slate-700">›</span>
        <Link href="/blog" className="hover:text-slate-300 transition">Blog</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-slate-400">Podnájemní smlouva 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Bydlení</span>
          <span className="text-xs text-slate-600">8 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-02">2. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Podnájemní smlouva 2026: Co musí obsahovat a souhlas pronajímatele
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Podnájem je situace, kdy nájemce přenechá byt nebo jeho část třetí osobě — podnájemci.
          Bez správně sepsané smlouvy a (zpravidla) souhlasu pronajímatele riskujete výpověď z nájmu.
          Přečtěte si, na co si dát pozor, než podnájem uzavřete.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Potřebujete podnájemní smlouvu?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte podnájemní smlouvu online — s právem podnájemce, povinnostmi, výší podnájemného a výpovědními podmínkami. PDF ihned.</p>
          <Link
            href="/podnajem"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit podnájemní smlouvu →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-podnajem" className="hover:text-amber-400 transition">1. Co je podnájem a jak se liší od nájmu</a></li>
          <li><a href="#souhlas-pronajimatele" className="hover:text-amber-400 transition">2. Souhlas pronajímatele — kdy je povinný</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">3. Co musí podnájemní smlouva obsahovat</a></li>
          <li><a href="#prava-podnajemce" className="hover:text-amber-400 transition">4. Práva a povinnosti podnájemce</a></li>
          <li><a href="#skonceni-podnajem" className="hover:text-amber-400 transition">5. Ukončení podnájmu</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-podnajem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je podnájem a jak se liší od nájmu</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Podnájem je upraven § 2215 a násl. občanského zákoníku. Nájemce (ten, kdo má byt pronajatý
          od vlastníka) přenechá byt nebo jeho část podnájemci za úplatu. Vlastník nemovitosti se
          podnájemního vztahu přímo neúčastní — smluvní vztah je pouze mezi nájemcem a podnájemcem.
        </p>

        <div className="mb-5 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="px-4 py-3 text-left font-black text-white">Vlastnost</th>
                <th className="px-4 py-3 text-left font-black text-white">Nájem</th>
                <th className="px-4 py-3 text-left font-black text-white">Podnájem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-400">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Pronajímatel</td>
                <td className="px-4 py-3">Vlastník nemovitosti</td>
                <td className="px-4 py-3">Nájemce (ne vlastník)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Právní základ</td>
                <td className="px-4 py-3">§ 2201 OZ</td>
                <td className="px-4 py-3">§ 2215 OZ</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Souhlas třetí strany</td>
                <td className="px-4 py-3">Nepotřebný</td>
                <td className="px-4 py-3">Zpravidla souhlas vlastníka</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Ochrana</td>
                <td className="px-4 py-3">Silná (OZ + zákon)</td>
                <td className="px-4 py-3">Slabší než u nájmu</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠️ Důležité:</strong> Podnájemní smlouva nemůže dát podnájemci větší práva, než má nájemce
          sám ze své nájemní smlouvy. Pokud nájemní smlouva podnájem zakazuje nebo omezuje, platí tato omezení i pro podnájemce.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="souhlas-pronajimatele" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Souhlas pronajímatele — kdy je povinný</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zákon rozlišuje dvě situace podle toho, zda nájemce v bytě sám bydlí:
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-3 text-sm font-black text-emerald-400">Nájemce v bytě bydlí</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Nájemce přijme do bytu další osobu (podnájemce), ale sám v bytě nadále bydlí.
              V tomto případě <strong className="text-white">souhlas pronajímatele není ze zákona nutný</strong>,
              ale nájemce musí pronajímatele o záměru informovat.
            </p>
            <div className="text-xs text-slate-500">§ 2215 odst. 1 OZ</div>
          </div>
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
            <div className="mb-3 text-sm font-black text-red-400">Nájemce v bytě nebydlí</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Nájemce přenechá celý byt podnájemci a sám tam nebydlí.
              V tomto případě <strong className="text-white">je souhlas pronajímatele povinný</strong>.
              Podnájem bez souhlasu může vést k výpovědi nájemní smlouvy.
            </p>
            <div className="text-xs text-slate-500">§ 2215 odst. 2 OZ</div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Doporučení:</strong> Vždy si vyžádejte souhlas pronajímatele písemně — i v případech,
          kde zákon výslovně nevyžaduje. Chrání to nájemce i podnájemce před budoucími spory.
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co musí podnájemní smlouva obsahovat</h2>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Nájemce (jako „pronajímatel" v podnájemní smlouvě) a podnájemce — jméno, adresa, datum narození nebo IČO.' },
            { t: 'Přesné označení předmětu', d: 'Adresa, číslo bytu, podlaží, velikost. Pokud se podnajímá jen část — přesný popis pokoje nebo místnosti.' },
            { t: 'Výše podnájemného', d: 'Měsíční částka podnájemného a způsob úhrady. Zálohy na energie — jejich výše a způsob vyúčtování.' },
            { t: 'Doba podnájmu', d: 'Na dobu určitou (datum začátku a konce) nebo neurčitou. Délka nesmí překročit dobu nájemní smlouvy nájemce.' },
            { t: 'Stav předmětu podnájmu', d: 'Předávací protokol s popisem stavu bytu a vybavení. Fotodokumentace jako příloha chrání obě strany.' },
            { t: 'Výpovědní podmínky', d: 'Výpovědní doba, důvody výpovědi. Podnájemce nemá zákonnou ochranu před výpovědí jako nájemce.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/podnajem" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit podnájemní smlouvu se všemi náležitostmi →
          </Link>
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="prava-podnajemce" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Práva a povinnosti podnájemce</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Podnájemce má výrazně slabší právní ochranu než nájemce. Klíčové rozdíly:
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Podnájemce nemá zákonnou ochranu před výpovědí</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Na rozdíl od nájemce nemá podnájemce zákonem chráněné výpovědní důvody. Nájemce
              může podnájem vypovědět podle podmínek sjednaných ve smlouvě — proto je důležité
              výpovědní podmínky přesně sjednat.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Skončení nájmu = skončení podnájmu</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pokud skončí nájemní smlouva nájemce (výpověď od vlastníka, konec doby určité),
              automaticky zaniká i podnájem — bez ohledu na to, jak je podnájemní smlouva sepsána.
              Podnájemce nemá vůči vlastníkovi žádný nárok na pokračování bydlení.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Kauce (jistota)</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nájemce může po podnájemci požadovat kauci (jistotu) — maximálně trojnásobek
              měsíčního podnájemného. Kauci musí vrátit při skončení podnájmu, pokud nevznikly
              škody nebo dluhy.
            </p>
          </div>
        </div>
      </section>

      {/* ── MID CTA ─────────────────────────────── */}
      <ArticleInlineCta
        title="Chcete mít podnájem právně v pořádku?"
        body="Podnájemní smlouva na SmlouvaHned obsahuje přesné označení předmětu, výši podnájemného, kauce a výpovědní podmínky. Připraveno dle OZ 2026."
        buttonLabel="Vytvořit podnájemní smlouvu"
        href="/podnajem"
      />

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="skonceni-podnajem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Ukončení podnájmu</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Podnájem lze ukončit několika způsoby:
        </p>

        <ul className="mb-5 space-y-3 text-slate-400">
          {[
            { t: 'Uplynutí doby', d: 'Podnájem na dobu určitou skončí automaticky uplynutím sjednané doby. Nevyžaduje výpověď.' },
            { t: 'Výpověď nájemce', d: 'Nájemce může dát podnájemci výpověď dle podmínek smlouvy. Výpovědní dobu si strany sjednají — zákon ji výslovně nestanoví.' },
            { t: 'Výpověď podnájemce', d: 'Podnájemce může smlouvu vypovědět dle sjednaných podmínek nebo dohodou.' },
            { t: 'Dohoda', d: 'Kdykoliv se strany dohodnou na ukončení — doporučujeme písemnou formu.' },
            { t: 'Zánik nájemní smlouvy', d: 'Skončí-li nájemní smlouva nájemce (výpověď od vlastníka), zanikne automaticky i podnájem.' },
          ].map(i => (
            <li key={i.t} className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
              <div>
                <strong className="text-slate-300">{i.t}:</strong>{' '}
                <span>{i.d}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Podnájem bez souhlasu pronajímatele', body: 'Nájemce přenechá celý byt podnájemci bez souhlasu vlastníka. Výsledek: výpověď z nájmu, která automaticky ukončí i podnájem — a podnájemce skončí na ulici bez právní ochrany.' },
            { n: '2', title: 'Žádná předávací dokumentace', body: 'Byt se předá bez protokolu a fotodokumentace. Při skončení podnájmu nastane spor o stav bytu a vrácení kauce — bez důkazů se těžko hájí nájemce i podnájemce.' },
            { n: '3', title: 'Podnájem na delší dobu než nájemní smlouva', body: 'Nájemní smlouva nájemce je do 31. 12. 2026 a podnájemní smlouva je uzavřena do 30. 6. 2027. Překrytí je neplatné — podnájem nemůže trvat déle než nájem sám.' },
            { n: '4', title: 'Žádná výpovědní podmínka', body: 'Smlouva výpovědní podmínky neobsahuje. Zákon výpovědní dobu u podnájmu nestanoví — bez sjednání vládne právní nejistota o tom, jak podnájem skončit.' },
            { n: '5', title: 'Podnájemné vyšší než nájemné', body: 'Nájemce si chce na podnájmu vydělat více, než platí vlastníkovi. To samo o sobě zákon nezakazuje, ale může být v rozporu s nájemní smlouvou — vždy zkontrolujte, co nájemní smlouva říká.' },
          ].map(c => (
            <div key={c.n} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-black text-red-400 border border-red-500/20">{c.n}</span>
                <h3 className="font-black text-white">{c.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí</h2>
        <div className="mb-6 space-y-2">
          {[
            'Podnájem celého bytu (bez nájemce) vyžaduje písemný souhlas pronajímatele',
            'Podnájemní smlouva nemůže dát podnájemci více práv, než má nájemce sám',
            'Doba podnájmu nesmí přesáhnout dobu nájemní smlouvy nájemce',
            'Vždy sepište předávací protokol s fotodokumentací',
            'Sjednejte výpovědní podmínky — zákon výpovědní dobu u podnájmu nestanoví',
            'Skončením nájmu nájemce automaticky zaniká i podnájem — podnájemce nemá ochranu vůči vlastníkovi',
          ].map(t => (
            <div key={t} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-0.5 flex-shrink-0 text-amber-400 font-bold">✓</span>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BOX ───────────────────────────── */}
      <ArticleTrustBox
        generatorSuitable="Standardní podnájem bytu nebo pokoje mezi fyzickými osobami, kde nájemní smlouva podnájem nezakazuje a pronajímatel dal souhlas. Pokrývá předmět, podnájemné, kauci a výpovědní podmínky."
        lawyerSuitable="Podnájem komerčních prostor, spory s pronajímatelem o platnost podnájmu, situace kde nájemní smlouva obsahuje omezení nebo zákaz podnájmu."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte podnájemní smlouvu online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí smlouvy — od předmětu podnájmu po výpovědní podmínky. PDF ihned.
        </p>
        <Link
          href="/podnajem"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit podnájemní smlouvu →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Dle OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/podnajemni-smlouva', label: '🏠 Podnájemní smlouva — přehled' },
            { href: '/blog/najemni-smlouva-vzor-2026', label: '🔑 Nájemní smlouva' },
            { href: '/najemni-smlouva', label: '📋 Průvodce nájemní smlouvou' },
            { href: '/najem', label: '📝 Vytvořit nájemní smlouvu' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
