import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('elektronicky-podpis-elegalizace-2026');

export default function ElektronickyPodpisElegalizace2026Page() {
  return (
    <ArticlePageLayout
      category="Osobní a právní"
      readTime="8 min"
      dateTime="2026-06-13"
      dateLabel="13. června 2026"
      breadcrumbLabel="Elektronický podpis 2026"
      slug="elektronicky-podpis-elegalizace-2026"
      title="Elektronický podpis a eLegalizace 2026: kdy stačí online podpis a kdy ověřit podpis"
      intro="Elektronický podpis, zaručený podpis a kvalifikovaný podpis mají různou důkazní sílu. eLegalizace a ověření podpisu na Czech POINTu se hodí tam, kde úřad nebo protistrana vyžaduje vyšší jistotu identity. Tento průvodce shrnuje praktické rozdíly pro běžné smlouvy a plné moci v roce 2026."
      toc={[
        { href: '#tri-urovne', label: 'Tři praktické úrovně podpisu' },
        { href: '#elegalizace', label: 'Co je eLegalizace a kdy pomůže' },
        { href: '#kdy-overit', label: 'Kdy podpis raději ověřit' },
        { href: '#priprava', label: 'Jak připravit smlouvu nebo plnou moc' },
        { href: '#oficialni-zdroje', label: 'Oficiální zdroje' },
      ]}
      primaryAction={{
        title: 'Potřebujete plnou moc nebo smlouvu k podpisu?',
        body: 'Generátor SmlouvaHned připraví dokument k tisku nebo PDF — podpis pak zvolíte podle toho, co protistrana nebo úřad vyžaduje.',
        buttonLabel: 'Vytvořit plnou moc',
        href: '/plna-moc',
      }}
      trustBox={{
        generatorSuitable:
          'Běžné smlouvy mezi fyzickými osobami, plná moc pro zastoupení u úřadu, nájemní smlouva nebo kupní smlouva na movitou věc.',
        lawyerSuitable:
          'Notářsky ověřené právní úkony, katastr nemovitostí, mezinárodní zastoupení nebo spory o platnost podpisu.',
      }}
      finalAction={{
        title: 'Zastupujete cizince nebo potřebujete ověřený podpis?',
        body: 'Průvodce plnou mocí pro cizince vysvětluje, kdy stačí běžný podpis a kdy je nutné ověření.',
        buttonLabel: 'Plná moc pro cizince',
        href: '/blog/plna-moc-zastupovani-cizincu-2026',
      }}
      relatedLinks={[
        { href: '/plna-moc', label: 'Plná moc online' },
        { href: '/blog/plna-moc-2026', label: 'Plná moc 2026 — průvodce' },
        { href: '/blog/plna-moc-zastupovani-cizincu-2026', label: 'Plná moc pro cizince' },
        { href: '/najem', label: 'Nájemní smlouva' },
        { href: '/auto', label: 'Kupní smlouva na auto' },
      ]}
    >
      <section id="tri-urovne" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Tři praktické úrovně podpisu
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              'Obvyklý (vlastnoruční) podpis',
              'Nejčastější u smluv mezi fyzickými osobami. Stačí pro nájem bytu, kupní smlouvu na auto nebo DPP u malého zaměstnavatele.',
            ],
            [
              'Zaručený elektronický podpis (AES)',
              'Podpis s vyšší úrovní spolehlivosti identity. V praxi ho poskytují certifikovaní poskytovatelé. Vhodný pro B2B smlouvy online.',
            ],
            [
              'Kvalifikovaný elektronický podpis (QES)',
              'Má účinky obdobné vlastnoručnímu podpisu dle nařízení eIDAS. Používá se tam, kde zákon nebo protistrana vyžaduje nejvyšší úroveň.',
            ],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{title}</div>
              <p className="text-sm leading-7 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="elegalizace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Co je eLegalizace a kdy pomůže
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          eLegalizace je digitální služba pro ověření elektronického podpisu nebo elektronické
          kopie dokumentu. Hodí se, když potřebujete prokázat platnost podpisu v online
          prostředí — například u smluv uzavíraných na dálku mezi podnikateli nebo u zahraniční
          protistrany.
        </p>
        <p className="leading-relaxed text-slate-400">
          eLegalizace nenahrazuje ověření podpisu na Czech POINTu tam, kde úřad výslovně vyžaduje
          úřední ověření identity podpisující osoby — typicky u některých plných mocí nebo
          listin pro cizineckou policii.
        </p>
      </section>

      <section id="kdy-overit" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Kdy podpis raději ověřit
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Plná moc pro zastoupení u registru vozidel, cizinecké policie nebo katastru.',
            'Smlouvy s vysokou hodnotou, kde protistrana trvá na ověřeném podpisu.',
            'Zastupování právnické osoby nebo cizince bez trvalého pobytu v ČR.',
            'Situace, kdy hrozí spor o to, zda dokument skutečně podepsala správná osoba.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="priprava" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Jak připravit smlouvu nebo plnou moc
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Nejdříve připravte obsah dokumentu — identifikace stran, předmět, rozsah oprávnění nebo
          povinností. Teprve potom zvolte formu podpisu. U plné moci vymezte co nejpřesněji, co
          zmocněnec smí a nesmí. U smlouvy dbejte na povinné náležitosti daného typu smlouvy.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pokud plánujete elektronický podpis, ověřte předem, zda protistrana a případný úřad
          akceptují konkrétní typ podpisu. U běžných smluv mezi fyzickými osobami stačí
          obvykle vlastnoruční podpis na vytištěném PDF.
        </p>
      </section>

      <section id="oficialni-zdroje" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Oficiální zdroje</h2>
        <ul className="space-y-3 text-slate-400">
          <li>
            <a
              href="https://www.elegalizace.cz"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              eLegalizace.cz
            </a>
          </li>
          <li>
            <a
              href="https://www.czechpoint.cz"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Czech POINT — ověření podpisu
            </a>
          </li>
          <li>
            <a
              href="https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX:32014R0910"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Nařízení EU eIDAS (910/2014)
            </a>
          </li>
        </ul>
      </section>
    </ArticlePageLayout>
  );
}
