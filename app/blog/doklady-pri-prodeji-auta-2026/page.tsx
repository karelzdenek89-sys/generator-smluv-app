import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata("doklady-pri-prodeji-auta-2026", {
  title: "Jaké doklady předat při prodeji auta 2026: Přehled pro běžný převod vozidla",
  description: "Přehled dokladů a podkladů, které se při běžném prodeji auta předávají kupujícímu. Jak pracovat s technickými doklady, klíči a dalšími přílohami převodu.",
});


export default function DokladyPriProdejiAuta2026Page() {
  return (
    <>

      <ArticlePageLayout
        category="Vozidla"
        readTime="6 min"
        dateTime="2026-04-06"
        dateLabel="6. dubna 2026"
        breadcrumbLabel="Jaké doklady předat při prodeji auta 2026"
        slug="doklady-pri-prodeji-auta-2026"
        title="Jaké doklady předat při prodeji auta: Přehled pro běžný převod vozidla"
        intro="Při prodeji auta nejde jen o podpis kupní smlouvy. V praxi je důležité, aby obě strany měly jasno i v tom, jaké doklady a podklady byly při převodu skutečně předány."
        toc={[
          { href: '#proc-na-dokladech-zalezi', label: 'Proč na dokladech záleží' },
          { href: '#co-se-obvykle-predava', label: 'Co se obvykle předává' },
          { href: '#jak-to-zachytit', label: 'Jak předání dokladů zachytit písemně' },
          { href: '#kdy-resit-cele-situacne', label: 'Kdy řešit převod jako celek' },
        ]}
        primaryAction={{
          title: 'Prodáváte nebo kupujete vozidlo?',
          body: 'Kupní smlouva na vozidlo s VIN, cenou a seznamem předávaných dokladů — PDF připravené k podpisu.',
          buttonLabel: 'Vytvořit kupní smlouvu na auto',
          href: '/auto',
        }}
        trustBox={{
          generatorSuitable:
            'Běžný prodej auta nebo jiného motorového vozidla, kdy chcete mít vedle smlouvy i jasně zachycené předání klíčů a dokladů.',
          lawyerSuitable:
            'Převod zatíženého vozidla, nejasný původ vozidla, probíhající spor o vlastnictví nebo nestandardní obchodní podmínky mezi stranami.',
        }}
        finalAction={{
          title: 'Chcete smlouvu s prvky předávacího protokolu?',
          body: 'Rozšířená kupní smlouva zachytí předané klíče, doklady a stav vozidla — PDF k podpisu.',
          buttonLabel: 'Otevřít formulář kupní smlouvy',
          href: '/auto',
        }}
        relatedLinks={[
          { href: '/auto', label: 'Kupní smlouva na vozidlo — formulář online' },
          { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla po podpisu smlouvy' },
          { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Předání vozidla kupujícímu' },
        ]}
      >
        <section id="proc-na-dokladech-zalezi" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Proč na dokladech záleží</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud není zachyceno, jaké doklady byly při prodeji předány, může mezi stranami později vzniknout spor o to, kdo co převzal nebo kdo měl dodat další podklady k převodu.
          </p>
          <p className="leading-relaxed text-slate-400">
            V běžné situaci nejde o složitou právní otázku, ale o pořádek v převodu. Právě proto je praktické spojit kupní smlouvu s přehledným podkladem k předání.
          </p>
        </section>

        <section id="co-se-obvykle-predava" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co se obvykle předává</h2>
          <ul className="space-y-3 text-slate-400">
            {[
              'klíče a dálkové ovladače',
              'technické doklady a další podklady k provozu vozidla',
              'servisní dokumentace, pokud je k dispozici',
              'doklady o pravidelných kontrolách nebo údržbě',
              'další příslušenství, které bylo součástí dohody',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="jak-to-zachytit" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Jak předání dokladů zachytit písemně</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Nejpraktičtější bývá navázat předání dokladů na předávací protokol. V jednom místě tak zachytíte vozidlo, klíče, příslušenství i seznam předaných podkladů. Výhodou je, že vše podepisují obě strany najednou.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pokud by se doklady předávaly později nebo odděleně, je vhodné i tuto skutečnost písemně zachytit, aby bylo zřejmé, co bylo předáno při podpisu a co následně.
          </p>
        </section>

        <section id="kdy-resit-cele-situacne" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Kdy řešit převod jako celek</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud řešíte jen samotnou smlouvu, může stačit samostatný dokument. Jakmile ale vedle smlouvy potřebujete zachytit i fyzické předání vozidla a seznam předaných dokladů, bývá praktičtější pracovat s širší sadou navazujících podkladů.
          </p>
          <p className="leading-relaxed text-slate-400">
            V produktu SmlouvaHned tuto roli plní tematický balíček pro prodej vozidla. Je určen pro běžnou situaci a pomáhá udržet celé předání přehledné.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
