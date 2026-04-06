import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Plná moc 2026: Kdy ji potřebujete, co musí obsahovat a kdy je nutný notář',
  description:
    'Průvodce plnou mocí pro rok 2026. Co je generální vs. speciální plná moc, kdy vyžaduje úředně ověřený podpis nebo notářské ověření, povinné náležitosti a nejčastější chyby.',
  keywords: [
    'plná moc vzor 2026',
    'plná moc náležitosti',
    'generální plná moc',
    'speciální plná moc',
    'plná moc notář',
    'plná moc ověřený podpis',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/plna-moc-2026' },
  openGraph: {
    title: 'Plná moc 2026: Kdy ji potřebujete, co musí obsahovat a kdy je nutný notář',
    description: 'Generální vs. speciální plná moc, ověřený podpis, notářské ověření a nejčastější chyby. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/plna-moc-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Plná moc 2026: Kdy ji potřebujete, co musí obsahovat a kdy je nutný notář',
  description:
    'Co je generální vs. speciální plná moc, kdy vyžaduje ověřený podpis nebo notáře, povinné náležitosti a nejčastější chyby při udělení plné moci.',
  url: 'https://smlouvahned.cz/blog/plna-moc-2026',
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
    { '@type': 'ListItem', position: 3, name: 'Plná moc 2026: Kdy ji potřebujete, co musí obsahovat a kdy je nutný notář', item: 'https://smlouvahned.cz/blog/plna-moc-2026' },
  ],
};

export default function PlnaMoc2026Page() {
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
        <span className="text-slate-400">Plná moc 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Osobní a právní</span>
          <span className="text-xs text-slate-600">7 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-02">2. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Plná moc 2026: Kdy ji potřebujete, co musí obsahovat a kdy je nutný notář
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Plná moc umožňuje jednat jménem jiné osoby — vyřídit úřad, zastoupit při podpisu smlouvy
          nebo spravovat nemovitost. Ale pozor: špatně sepsaná nebo nesprávně ověřená plná moc je
          neplatná. Přečtěte si, kdy stačí jednoduchá plná moc a kdy musíte k notáři.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Potřebujete plnou moc?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte plnou moc online — pro úřady, soudy, správu nemovitostí nebo zastoupení při podpisu smlouvy. PDF ihned.</p>
          <Link
            href="/plna-moc"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit plnou moc →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#co-je-plna-moc" className="hover:text-amber-400 transition">1. Co je plná moc a jak funguje</a></li>
          <li><a href="#typy-plne-moci" className="hover:text-amber-400 transition">2. Generální vs. speciální plná moc</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">3. Co musí plná moc obsahovat</a></li>
          <li><a href="#overeni-podpisu" className="hover:text-amber-400 transition">4. Kdy je nutné ověření podpisu nebo notář</a></li>
          <li><a href="#odvolani-zaniku" className="hover:text-amber-400 transition">5. Odvolání a zánik plné moci</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="co-je-plna-moc" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je plná moc a jak funguje</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Plná moc (zmocnění) je jednostranné právní jednání, kterým zmocnitel (ten, kdo plnou moc
          uděluje) opravňuje zmocněnce (toho, kdo jedná) jednat svým jménem. Upravena je § 441 a násl.
          občanského zákoníku.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Zmocněnec jedná jménem zmocnitele — důsledky jeho jednání dopadají přímo na zmocnitele.
          Pokud zmocněnec překročí rozsah plné moci, zmocnitel za takové jednání neodpovídá
          (ledaže ho schválí dodatečně).
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {[
            { t: 'Zastoupení na úřadě', d: 'Vyřízení agendy na katastru, finančním úřadě, živnostenském úřadě nebo cizinecké policii.' },
            { t: 'Zastoupení při podpisu', d: 'Podpis smlouvy o koupi bytu, nájemní smlouvy nebo obchodní smlouvy jménem zmocnitele.' },
            { t: 'Správa majetku', d: 'Spravování nemovitosti, vybírání nájmu nebo jednání se správcem domu po dobu nepřítomnosti.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="typy-plne-moci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Generální vs. speciální plná moc</h2>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-amber-400">Speciální plná moc</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Opravňuje zmocněnce k jedné konkrétní věci nebo skupině věcí — podpis konkrétní
              smlouvy, zastoupení na konkrétním úřadním řízení, prodej konkrétní nemovitosti.
            </p>
            <div className="text-xs text-slate-500">Doporučená forma pro většinu situací — omezuje riziko zneužití.</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-amber-400">Generální plná moc</div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Opravňuje zmocněnce jednat ve všech věcech zmocnitele — komplexní správa majetku,
              zastoupení ve všech právních věcech. Velmi silný nástroj, vyžaduje vysokou důvěru
              ve zmocněnce.
            </p>
            <div className="text-xs text-slate-500">Vhodná pro dlouhodobou nepřítomnost (zahraničí, nemoc). Vyžaduje notářské ověření.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-amber-400">⚠️ Upozornění:</strong> Generální plná moc nenahrazuje opatrovnictví ani
          správu dědictví. Na dispozici s nemovitostmi (prodej, zástavní právo) je vždy nutná speciální plná moc
          s přesným označením nemovitosti.
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co musí plná moc obsahovat</h2>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace zmocnitele', d: 'Jméno, příjmení, datum narození, adresa trvalého bydliště (nebo IČO u firem).' },
            { t: 'Identifikace zmocněnce', d: 'Jméno, příjmení, datum narození, adresa. U právníka nebo notáře také číslo průkazu.' },
            { t: 'Rozsah zmocnění', d: 'Přesné vymezení, k čemu je zmocněnec oprávněn jednat. U speciální plné moci: konkrétní úkon, nemovitost, řízení.' },
            { t: 'Doba platnosti', d: 'Plná moc může být časově omezená (do konkrétního data) nebo neurčitá. Bez data platí do odvolání.' },
            { t: 'Datum a podpis zmocnitele', d: 'Plná moc musí být datována a podepsána zmocnitelem. Bez podpisu je neplatná.' },
            { t: 'Ověření podpisu', d: 'Kde to vyžaduje zákon nebo protistrany — úředně ověřený podpis nebo notářsky ověřená plná moc.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/plna-moc" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit plnou moc s přesným vymezením zmocnění →
          </Link>
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="overeni-podpisu" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Kdy je nutné ověření podpisu nebo notář</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Ne každá plná moc potřebuje ověřený podpis. Zákon a praxe rozlišují tři úrovně:
        </p>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-5">
            <div className="mb-2 text-sm font-black text-emerald-400">Prostá písemná plná moc (bez ověření)</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Postačuje pro většinu běžných úkonů — zastoupení na úřadě, podpis nájemní smlouvy,
              vyřízení agend na živnostenském úřadě, zastoupení v bankovním řízení (pokud banka nevyžaduje víc).
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-2 text-sm font-black text-amber-400">Úředně ověřený podpis (Czech POINT, notář)</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vyžaduje katastr nemovitostí při podání návrhu na vklad, soudy pro zastoupení v řízení,
              řada správních úřadů, banky při dispozici s účtem. Ověření provede Czech POINT nebo notář.
            </p>
          </div>
          <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-5">
            <div className="mb-2 text-sm font-black text-red-400">Notářsky ověřená (notářská) plná moc</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nutná pro generální plnou moc, prodej nemovitosti jménem zmocnitele (zástavní právo,
              darování nemovitosti) a zastoupení v zahraničí. Notář sepíše plnou moc jako notářský zápis
              nebo ověří podpis jako zvláštní úkon.
            </p>
          </div>
        </div>
      </section>

      {/* ── MID CTA ─────────────────────────────── */}
      <ArticleInlineCta
        title="Potřebujete plnou moc rychle?"
        body="Vytvořte plnou moc online za pár minut — speciální nebo generální, pro úřady i soukromé úkony. Formulář vás provede každou částí. PDF ihned."
        buttonLabel="Vytvořit plnou moc"
        href="/plna-moc"
      />

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="odvolani-zaniku" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Odvolání a zánik plné moci</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Plná moc zaniká v těchto případech:
        </p>

        <ul className="mb-5 space-y-3 text-slate-400">
          {[
            { t: 'Odvolání zmocnitelem', d: 'Zmocnitel může plnou moc kdykoli odvolat — i bez udání důvodu. Odvolání musí být sděleno zmocněnci.' },
            { t: 'Výpověď zmocněncem', d: 'Zmocněnec může zmocnění odmítnout nebo vypovědět s přiměřenou lhůtou.' },
            { t: 'Splnění účelu', d: 'Speciální plná moc zanikne splněním úkonu, ke kterému byla udělena.' },
            { t: 'Uplynutí doby', d: 'Časově omezená plná moc zanikne uplynutím sjednané doby.' },
            { t: 'Smrt nebo zánik', d: 'Smrtí zmocnitele nebo zmocněnce (nebo zánikem právnické osoby) plná moc zaniká — pokud smlouva nestanoví jinak.' },
          ].map(i => (
            <li key={i.t} className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
              <div><strong className="text-slate-300">{i.t}:</strong> {i.d}</div>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Poznámka:</strong> Pokud zmocněnec jednal v dobré víře (nevěděl o odvolání plné moci),
          jeho jednání je vůči třetím osobám stále platné. Proto oznamte odvolání plné moci nejen zmocněnci,
          ale i protistranám, se kterými zmocněnec jednal.
        </div>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Příliš obecné vymezení rozsahu', body: 'Plná moc říká „zastupuji v právních věcech" bez bližší specifikace. Třetí osoby nebo úřady ji odmítnou přijmout, protože není jasné, k čemu konkrétně zmocněnec oprávněn je.' },
            { n: '2', title: 'Chybí ověření podpisu', body: 'Plná moc pro katastr nemovitostí nebo soud nemá úředně ověřený podpis. Řízení je zastaveno nebo návrh odmítnut. Vždy předem ověřte, jakou formu přijímá konkrétní úřad nebo instituce.' },
            { n: '3', title: 'Plná moc bez data', body: 'Plná moc není datována. Třetí osoby nevědí, zda je aktuální, a mohou ji odmítnout. Vždy datum udělení uveďte.' },
            { n: '4', title: 'Generální plná moc bez notáře', body: 'Zmocnitel vystaví generální plnou moc bez notářského ověření. Tato forma je pro mnohé účely (dispozice s nemovitostmi) nedostačující a zmocněnec ji nebude moci použít.' },
            { n: '5', title: 'Zapomenutá plná moc stále platí', body: 'Zmocnitel vystaví plnou moc pro jednorázový úkon, ale po jeho splnění ji výslovně neodvolá. Plná moc nadále platí a zmocněnec může jednat dál — s reálnými důsledky pro zmocnitele.' },
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
            'Speciální plná moc je bezpečnější — přesně vymezuje, k čemu zmocněnec oprávněn je',
            'Pro katastr a soudy: úředně ověřený podpis (Czech POINT nebo notář)',
            'Pro generální plnou moc a dispozice s nemovitostmi: notářský zápis',
            'Vždy uveďte datum udělení — bez data je plná moc zpochybnitelná',
            'Po splnění účelu plnou moc výslovně odvolejte — i písemně',
            'Odvolání oznamte nejen zmocněnci, ale i protistranám, se kterými jednal',
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
        generatorSuitable="Speciální plná moc pro zastoupení na úřadě, podpis smlouvy nebo správu majetku — kde stačí prostá písemná forma nebo úředně ověřený podpis."
        lawyerSuitable="Generální plná moc, dispozice s nemovitostmi (prodej, zástavní právo), zastoupení v soudním řízení nebo mezinárodní plná moc pro použití v zahraničí."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte plnou moc online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede každou částí plné moci — od rozsahu zmocnění po dobu platnosti. PDF ihned.
        </p>
        <Link
          href="/plna-moc"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit plnou moc →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Dle OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/plna-moc-online', label: '📋 Plná moc — přehled' },
            { href: '/blog/darovaci-smlouva-2026', label: '🎁 Darovací smlouva' },
            { href: '/blog/kupni-smlouva-movita-vec', label: '🛒 Kupní smlouva' },
            { href: '/blog/smlouva-o-zapujcce-2026', label: '💰 Smlouva o půjčce' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
