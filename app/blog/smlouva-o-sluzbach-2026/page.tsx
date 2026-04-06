import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Smlouva o poskytování služeb 2026: Vzor, náležitosti a jak se chránit',
  description:
    'Průvodce smlouvou o poskytování služeb pro rok 2026. Povinné náležitosti, rozdíl oproti smlouvě o dílo, odpovědnost za vady, reklamace, výpovědní podmínky a nejčastější chyby.',
  keywords: [
    'smlouva o poskytování služeb',
    'smlouva o službách vzor 2026',
    'smlouva o dílo vs smlouva o službách',
    'smlouva o poskytování služeb náležitosti',
    'smlouva o službách freelancer',
    'smlouva o poskytování služeb reklamace',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/smlouva-o-sluzbach-2026' },
  openGraph: {
    title: 'Smlouva o poskytování služeb 2026: Vzor, náležitosti a jak se chránit',
    description: 'Náležitosti, rozdíl oproti smlouvě o dílo, reklamace a nejčastější chyby. Aktuální pro 2026.',
    url: 'https://smlouvahned.cz/blog/smlouva-o-sluzbach-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Smlouva o poskytování služeb 2026: Vzor, náležitosti a jak se chránit',
  description:
    'Povinné náležitosti smlouvy o poskytování služeb, rozdíl oproti smlouvě o dílo, odpovědnost za vady, reklamace a nejčastější chyby.',
  url: 'https://smlouvahned.cz/blog/smlouva-o-sluzbach-2026',
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
    { '@type': 'ListItem', position: 3, name: 'Smlouva o poskytování služeb 2026: Vzor, náležitosti a jak se chránit', item: 'https://smlouvahned.cz/blog/smlouva-o-sluzbach-2026' },
  ],
};

export default function SmlouvaOSluzbach2026Page() {
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
        <span className="text-slate-400">Smlouva o poskytování služeb 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Podnikání a OSVČ</span>
          <span className="text-xs text-slate-600">8 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-04-02">2. dubna 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Smlouva o poskytování služeb 2026: Vzor, náležitosti a jak se chránit
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Poskytujete nebo objednáváte služby? Bez písemné smlouvy riskujete spory o rozsah, cenu
          i odpovědnost za výsledek. Přečtěte si, co musí smlouva o poskytování služeb obsahovat
          a v čem se liší od smlouvy o dílo.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Potřebujete smlouvu o službách?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte smlouvu o poskytování služeb online — s popisem služby, cenou, reklamačními podmínkami a výpovědí. PDF ihned.</p>
          <Link
            href="/sluzby"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit smlouvu o službách →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#sluzby-vs-dilo" className="hover:text-amber-400 transition">1. Smlouva o službách vs. smlouva o dílo</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co musí smlouva o službách obsahovat</a></li>
          <li><a href="#cena-platby" className="hover:text-amber-400 transition">3. Cena a platební podmínky</a></li>
          <li><a href="#odpovědnost-vady" className="hover:text-amber-400 transition">4. Odpovědnost a reklamace</a></li>
          <li><a href="#ukonceni" className="hover:text-amber-400 transition">5. Ukončení smlouvy</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">6. Nejčastější chyby</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="sluzby-vs-dilo" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Smlouva o službách vs. smlouva o dílo</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Smlouva o poskytování služeb (§ 1746 odst. 2 OZ, inominátní smlouva) a smlouva o dílo
          (§ 2586 OZ) jsou si podobné, ale mají zásadní rozdíl v předmětu plnění.
        </p>

        <div className="mb-5 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="px-4 py-3 text-left font-black text-white">Vlastnost</th>
                <th className="px-4 py-3 text-left font-black text-white">Smlouva o službách</th>
                <th className="px-4 py-3 text-left font-black text-white">Smlouva o dílo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-400">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Předmět</td>
                <td className="px-4 py-3">Proces (výkon činnosti)</td>
                <td className="px-4 py-3">Výsledek (konkrétní dílo)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Závazek</td>
                <td className="px-4 py-3">Vynaložit odbornou péči</td>
                <td className="px-4 py-3">Dodat funkční dílo</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Příklady</td>
                <td className="px-4 py-3">Správa sítí, účetnictví, poradenství</td>
                <td className="px-4 py-3">Web, rekonstrukce, software</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-300">Záruky</td>
                <td className="px-4 py-3">Odpovědnost za péči, ne výsledek</td>
                <td className="px-4 py-3">Záruční doba za vady díla</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Jak vybrat správný typ:</strong> Pokud objednáváte konkrétní výstup (nový web, projekt),
          zvolte smlouvu o dílo. Pokud objednáváte průběžnou péči nebo opakující se výkony (správa, konzultace),
          zvolte smlouvu o poskytování služeb.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí smlouva o službách obsahovat</h2>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Poskytovatel a objednatel — jméno/název, IČO, sídlo, zastoupení.' },
            { t: 'Popis služeb', d: 'Přesný popis poskytovaných služeb, jejich rozsah a způsob plnění. Co patří do smlouvy a co je mimo.' },
            { t: 'Cena a způsob fakturace', d: 'Měsíční paušál nebo hodinová sazba, způsob fakturace, splatnost. DPH status poskytovatele.' },
            { t: 'Místo a způsob poskytnutí', d: 'Kde se služby poskytují — remote, na místě objednatele, kombinace. Požadavky na součinnost objednatele.' },
            { t: 'Délka trvání', d: 'Na dobu určitou nebo neurčitou. Výpovědní podmínky pro oba případy.' },
            { t: 'Mlčenlivost a data', d: 'Povinnost mlčenlivosti, pravidla pro nakládání s daty objednatele (zvláště pokud jde o osobní údaje).' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <Link href="/sluzby" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit smlouvu o poskytování služeb →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="cena-platby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Cena a platební podmínky</h2>

        <div className="mb-5 space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Paušální měsíční cena</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pevná částka za sjednaný rozsah výkonů měsíčně. Výhoda: předvídatelný cash flow pro obě strany.
              Nevýhoda: pokud objednatel využije víc, než je sjednáno, musí smlouva definovat, jak se přesčas účtuje.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Hodinová sazba</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Výkon se účtuje dle skutečně odpracovaných hodin. Nutný reporting — výkaz hodin k faktuře.
              Objednatel platí jen za skutečný výkon, ale nemá předvídatelné náklady.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-2 text-sm font-black text-white">Sankce za pozdní platbu</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sjednejte úrok z prodlení nebo smluvní pokutu za pozdní platbu. Zákonný úrok z prodlení
              platí automaticky, ale smluvně sjednaný může být vyšší a motivuje k včasnému placení.
            </p>
          </div>
        </div>
      </section>

      {/* ── MID CTA ─────────────────────────────── */}
      <ArticleInlineCta
        title="Chcete smlouvu o službách na míru?"
        body="Formulář na SmlouvaHned pokrývá popis služeb, cenu, reklamační podmínky i výpověď. Připraveno pro OSVČ, agentury i firmy dle OZ 2026."
        buttonLabel="Vytvořit smlouvu o službách"
        href="/sluzby"
      />

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="odpovědnost-vady" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Odpovědnost a reklamace</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          U smlouvy o poskytování služeb se zavazuje poskytovatel ke <strong className="text-white">
          kvalitní péči</strong> (standardu odborníka v daném oboru) — ne ke konkrétnímu výsledku.
          Odpovědnost za výsledek musí být ve smlouvě výslovně sjednána.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-white">Co řešit ve smlouvě</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">→</span>Standard kvality (dle best practices, dle pokynů objednatele)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">→</span>Postup při reklamaci (lhůta, forma, způsob řešení)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">→</span>Omezení odpovědnosti poskytovatele (cap na náhradu škody)</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">→</span>Vyloučení odpovědnosti za výsledky mimo kontrolu poskytovatele</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-3 text-sm font-black text-white">Součinnost objednatele</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">→</span>Pokud objednatel neposkytne součinnost, poskytovatel nenese odpovědnost za prodlení</li>
              <li className="flex items-start gap-2"><span className="flex-shrink-0 text-amber-400">→</span>Sjednejte povinnosti objednatele výslovně — přístupy, podklady, schvalování</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="ukonceni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Ukončení smlouvy</h2>

        <ul className="mb-5 space-y-3 text-slate-400">
          {[
            { t: 'Výpověď (smlouva na dobu neurčitou)', d: 'Sjednejte výpovědní dobu — typicky 1–3 měsíce. Bez sjednání platí přiměřená výpovědní doba dle okolností.' },
            { t: 'Uplynutí doby (smlouva na dobu určitou)', d: 'Automatické ukončení bez výpovědi. Lze sjednat automatické prodloužení, pokud žádná strana nevypoví.' },
            { t: 'Odstoupení od smlouvy', d: 'Možné při podstatném porušení smlouvy — definujte ve smlouvě, co je podstatné porušení (neplacení, opakovaná nekvalita).' },
            { t: 'Dohoda', d: 'Kdykoliv se strany dohodnou — doporučujeme písemnou formu s vyrovnáním závazků (nedokončené výkony, neuhrazené faktury).' },
          ].map(i => (
            <li key={i.t} className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
              <div><strong className="text-slate-300">{i.t}:</strong> {i.d}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Nejčastější chyby</h2>

        <div className="space-y-5">
          {[
            { n: '1', title: 'Vágní popis služeb', body: 'Smlouva říká „správa sociálních sítí" bez konkrétního počtu příspěvků, platforem nebo reportingového formátu. Objednatel čeká víc, poskytovatel méně. Výsledek: spor o rozsah a odměnu.' },
            { n: '2', title: 'Žádná odpovědnost objednatele za součinnost', body: 'Poskytovatel nemůže pracovat, protože objednatel nedodá podklady nebo schválení. Smlouva mlčí o povinnostech objednatele. Poskytovatel fakturuje, objednatel odmítá platit.' },
            { n: '3', title: 'Neošetřeno nakládání s daty', body: 'Poskytovatel zpracovává osobní údaje zákazníků objednatele. Smlouva neobsahuje zpracovatelskou smlouvu dle GDPR. Objednatel i poskytovatel riskují pokutu od ÚOOÚ.' },
            { n: '4', title: 'Žádná výpovědní podmínka', body: 'Spolupráce se pokazí a ani jedna strana neví, jak ji legálně ukončit. Bez výpovědní doby může být ukončení smlouvy soudním sporem.' },
            { n: '5', title: 'Smlouva o dílo místo smlouvy o službách', body: 'Marketingová agentura uzavře smlouvu o dílo na „průběžnou správu sociálních sítí". Na dílo platí přísnější záruky a akceptační povinnosti — agentura pak odpovídá za výsledky, které nemá plně pod kontrolou.' },
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
            'Přesně popište rozsah služeb — co patří do smlouvy a co je mimo (a za příplatek)',
            'Sjednejte povinnosti objednatele — bez součinnosti nejde pracovat',
            'Pokud zpracováváte osobní údaje: přidejte zpracovatelskou smlouvu dle GDPR',
            'Sjednejte výpovědní podmínky pro případ ukončení spolupráce',
            'Vyberte správný smluvní typ: průběžné výkony = smlouva o službách, konkrétní výstup = smlouva o dílo',
            'Smlouva musí být písemná — e-mailová korespondence je nejistý důkaz při sporu',
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
        generatorSuitable="Smlouva o průběžném poskytování služeb — správa sítí, účetnictví, IT podpora, poradenství nebo jiné opakující se výkony mezi podnikateli."
        lawyerSuitable="Služby s vysokou odpovědností (právní, finanční, lékařské poradenství), mezinárodní smlouvy o službách, smlouvy obsahující komplexní zpracování osobních údajů nebo exkluzivitu."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte smlouvu o službách online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář vás provede popisem služeb, cenou i výpovědí. PDF ke stažení ihned.
        </p>
        <Link
          href="/sluzby"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit smlouvu o službách →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 99 Kč · Dle OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ─────────────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/smlouva-o-sluzbach', label: '📋 Smlouva o službách — přehled' },
            { href: '/blog/smlouva-o-dilo-2026', label: '🔨 Smlouva o dílo' },
            { href: '/blog/smlouva-o-spolupraci-2026', label: '🤝 Smlouva o spolupráci' },
            { href: '/blog/nda-smlouva-mlcenlivost', label: '🔒 NDA smlouva' },
            { href: '/', label: '📋 Všechny smlouvy' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white">{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
