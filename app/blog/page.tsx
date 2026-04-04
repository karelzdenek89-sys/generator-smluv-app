import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog – Průvodce smlouvami 2026',
  description:
    'Praktické průvodce k právním smlouvám – co musí obsahovat, jak se chránit a jak se vyhnout nejčastějším chybám. Aktuální pro legislativu 2026.',
  alternates: { canonical: 'https://smlouvahned.cz/blog' },
};

const articles = [
  {
    slug: 'uznani-dluhu-2026',
    title: 'Uznání dluhu 2026: Co to je, co musí obsahovat a proč je důležité',
    excerpt:
      'Co je uznání dluhu (§ 2053 OZ), jak přerušuje promlčecí lhůtu, co musí obsahovat a jak ho použít při vymáhání nezaplacené půjčky nebo faktury.',
    category: 'Osobní a finanční',
    readTime: '7 min',
    date: '2026-04-02',
    tag: 'Uznání dluhu',
  },
  {
    slug: 'smlouva-o-sluzbach-2026',
    title: 'Smlouva o poskytování služeb 2026: Vzor, náležitosti a jak se chránit',
    excerpt:
      'Průvodce smlouvou o službách – rozdíl oproti smlouvě o dílo, co musí obsahovat, jak sjednat cenu, odpovědnost za vady a výpovědní podmínky.',
    category: 'Podnikání a OSVČ',
    readTime: '8 min',
    date: '2026-04-02',
    tag: 'Smlouva o službách',
  },
  {
    slug: 'plna-moc-2026',
    title: 'Plná moc 2026: Kdy ji potřebujete, co musí obsahovat a kdy je nutný notář',
    excerpt:
      'Generální vs. speciální plná moc, kdy stačí prostá písemná forma, kdy je nutný ověřený podpis nebo notář, povinné náležitosti a nejčastější chyby.',
    category: 'Osobní a právní',
    readTime: '7 min',
    date: '2026-04-02',
    tag: 'Plná moc',
  },
  {
    slug: 'smlouva-o-spolupraci-2026',
    title: 'Smlouva o spolupráci OSVČ 2026: Co musí obsahovat a jak se chránit',
    excerpt:
      'Průvodce smlouvou o spolupráci pro OSVČ a freelancery – vymezení předmětu, honorář, autorská práva, mlčenlivost a jak se chránit před švarcsystémem.',
    category: 'Podnikání a OSVČ',
    readTime: '9 min',
    date: '2026-04-02',
    tag: 'Smlouva o spolupráci',
  },
  {
    slug: 'podnajemni-smlouva-2026',
    title: 'Podnájemní smlouva 2026: Co musí obsahovat a souhlas pronajímatele',
    excerpt:
      'Kdy potřebujete souhlas pronajímatele, co musí podnájemní smlouva obsahovat, práva podnájemce a nejčastější chyby při podnájmu bytu.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '2026-04-02',
    tag: 'Podnájemní smlouva',
  },
  {
    slug: 'dpp-dohoda-provedeni-prace',
    title: 'DPP dohoda o provedení práce 2026: Limity, odvody a jak ji správně napsat',
    excerpt:
      'Limit 300 hodin ročně, srážková daň, nová oznamovací povinnost na ČSSZ, povinné náležitosti a nejčastější chyby zaměstnavatelů.',
    category: 'Práce a zaměstnání',
    readTime: '9 min',
    date: '2026-04-02',
    tag: 'DPP',
  },
  {
    slug: 'nda-smlouva-mlcenlivost',
    title: 'NDA smlouva o mlčenlivosti 2026: Co chrání, co ne a jak ji napsat správně',
    excerpt:
      'Praktický průvodce dohodou o mlčenlivosti – co NDA chrání a co ne, jednostranná vs. vzájemná NDA, délka trvání, sankce za porušení a nejčastější chyby.',
    category: 'Podnikání',
    readTime: '8 min',
    date: '2026-04-01',
    tag: 'NDA',
  },
  {
    slug: 'smlouva-o-zapujcce-2026',
    title: 'Smlouva o zápůjčce (půjčce) 2026: Vzor, náležitosti a jak ji napsat správně',
    excerpt:
      'Průvodce smlouvou o zápůjčce dle § 2390 OZ – povinné náležitosti, sjednání úroku, splátkový kalendář, zajištění a co dělat, když dlužník nesplácí.',
    category: 'Osobní a finanční',
    readTime: '8 min',
    date: '2026-03-28',
    tag: 'Smlouva o půjčce',
  },
  {
    slug: 'kupni-smlouva-movita-vec',
    title: 'Kupní smlouva na movitou věc 2026: Vzor a náležitosti',
    excerpt:
      'Co musí obsahovat kupní smlouva na movitou věc dle § 2079 OZ – přesný popis předmětu, cena, předání, záruky a jak se chránit před vadami při prodeji mezi soukromými osobami.',
    category: 'Osobní a finanční',
    readTime: '7 min',
    date: '2026-03-25',
    tag: 'Kupní smlouva',
  },
  {
    slug: 'pracovni-smlouva-2026',
    title: 'Pracovní smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
    excerpt:
      'Tři povinné náležitosti dle zákoníku práce, zkušební doba, mlčenlivost, home office doložka a nejčastější chyby zaměstnavatelů. Aktuální pro legislativu 2026.',
    category: 'Práce a zaměstnání',
    readTime: '9 min',
    date: '2026-03-20',
    tag: 'Pracovní smlouva',
  },
  {
    slug: 'darovaci-smlouva-2026',
    title: 'Darovací smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
    excerpt:
      'Zákonné náležitosti darovací smlouvy, kdy je povinná písemná forma, daňové dopady darování v rodině i mimo ni, výhrada dožití a kdy lze dar odvolat.',
    category: 'Osobní a finanční',
    readTime: '7 min',
    date: '2026-03-15',
    tag: 'Darovací smlouva',
  },
  {
    slug: 'smlouva-o-dilo-2026',
    title: 'Smlouva o dílo 2026: Co musí obsahovat a nejčastější chyby',
    excerpt:
      'Průvodce smlouvou o dílo dle § 2586 OZ – specifikace díla, cena, termín, akceptační postup, smluvní pokuty a záruky. Jak se chránit jako objednatel i zhotovitel.',
    category: 'Podnikání',
    readTime: '10 min',
    date: '2026-03-10',
    tag: 'Smlouva o dílo',
  },
  {
    slug: 'kupni-smlouva-na-auto-2026',
    title: 'Kupní smlouva na auto 2026: Co musí obsahovat a jak se chránit',
    excerpt:
      'Zákonné náležitosti kupní smlouvy na auto – VIN, stav tachometru, STK, prohlášení o vadách. Jak ověřit vozidlo a nejčastější chyby při prodeji ojetého vozu.',
    category: 'Vozidla',
    readTime: '9 min',
    date: '2026-03-05',
    tag: 'Kupní smlouva na auto',
  },
  {
    slug: 'najemni-smlouva-vzor-2026',
    title: 'Nájemní smlouva vzor 2026: Co musí obsahovat a nejčastější chyby',
    excerpt:
      'Kompletní průvodce nájemní smlouvou – zákonné náležitosti, nejčastější chyby pronajímatelů i nájemníků, jak se chránit a kdy nestačí vzor z internetu.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '2026-03-01',
    tag: 'Nájemní smlouva',
  },
];

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Blog</div>
      <h1 className="mb-3 text-3xl font-black tracking-tight text-white md:text-4xl">Průvodce právními smlouvami</h1>
      <p className="mb-12 max-w-2xl text-slate-400">
        Praktické informace ke smlouvám – co musí obsahovat, jak se chránit a jak se vyhnout nejčastějším chybám.
        V každém článku najdete i rychlou cestu ke konkrétnímu generátoru a souvisejícím dokumentům.
      </p>

      <div className="grid gap-6">
        {articles.map(article => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group rounded-3xl border border-white/8 bg-[#0c1426] p-7 transition hover:border-white/15 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {article.category}
              </span>
              <span className="text-xs text-slate-600">{article.readTime} čtení</span>
              <span className="text-xs text-slate-700">{article.date}</span>
            </div>
            <h2 className="mb-3 text-xl font-black leading-snug text-white transition group-hover:text-amber-100">
              {article.title}
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">{article.excerpt}</p>
            <div className="mt-5 flex items-center gap-2 text-sm font-bold text-amber-400 transition group-hover:text-amber-300">
              Číst článek <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
