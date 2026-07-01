import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('smlouva-o-dilo-freelancer-2026');

export default function SmlouvaODiloFreelancer2026Page() {
  return (
    <ArticlePageLayout
      category="Podnikání a zakázky"
      readTime="9 min"
      dateTime="2026-07-01"
      dateLabel="1. července 2026"
      breadcrumbLabel="Smlouva o dílo pro freelancera"
      slug="smlouva-o-dilo-freelancer-2026"
      title="Smlouva o dílo pro freelancera 2026: Ochrana před nezaplacením a převod autorských práv"
      intro="Freelancer nebo OSVČ bez smlouvy spoléhá na ústní dohodu — a ta se při sporu špatně dokazuje. Smlouva o dílo by měla jasně popsat, co se dodá, kdy se platí, kdo vlastní výsledek a jak se řeší změny rozsahu. Tento průvodce shrnuje praktické body pro rok 2026."
      toc={[
        { href: '#proc-smlouva', label: 'Proč freelancer potřebuje smlouvu o dílo' },
        { href: '#predmet-cena', label: 'Předmět díla a cena' },
        { href: '#autorska-prava', label: 'Autorská práva a licence' },
        { href: '#viceprace', label: 'Vícepráce a změny' },
        { href: '#chyby', label: 'Nejčastější chyby' },
      ]}
      primaryAction={{
        title: 'Potřebujete smlouvu o dílo?',
        body: 'Generátor SmlouvaHned vás provede popisem díla, cenou, termíny a předáním — včetně ustanovení o autorských právech.',
        buttonLabel: 'Vytvořit smlouvu o dílo',
        href: '/smlouva-o-dilo',
      }}
      trustBox={{
        generatorSuitable:
          'Jednorázové zakázky pro OSVČ — web, design, text, fotografie, drobné stavební práce, konzultace s konkrétním výstupem.',
        lawyerSuitable:
          'Velké IT projekty s komplexními licencemi, stavební díla s vysokou hodnotou, spory o švarcsystém nebo mezinárodní B2B smlouvy.',
      }}
      finalAction={{
        title: 'Chcete detailněji řešit autorská práva?',
        body: 'Specializovaný průvodce vysvětluje rozdíl mezi licencí a převodem autorských práv u freelancera.',
        buttonLabel: 'Autorská práva ve smlouvě o dílo',
        href: '/blog/autorska-prava-smlouva-o-dilo-2026',
      }}
      relatedLinks={[
        { href: '/smlouva-o-dilo', label: 'Smlouva o dílo — formulář' },
        { href: '/blog/smlouva-o-dilo-2026', label: 'Průvodce smlouvou o dílo' },
        { href: '/blog/autorska-prava-smlouva-o-dilo-2026', label: 'Autorská práva' },
        { href: '/blog/viceprace-smlouva-o-dilo-2026', label: 'Vícepráce' },
        { href: '/blog/svarcsystem-osvc-2026', label: 'Švarcsystém' },
      ]}
    >
      <section id="proc-smlouva" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Proč freelancer potřebuje smlouvu o dílo
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Smlouva o dílo (§ 2586 a násl. OZ) se hodí tam, kde zhotovitel dodává konkrétní
          výsledek — ne průběžnou činnost. Freelancer tak má písemně zachyceno, co přesně
          dodá, za kolik a do kdy. Objednatel zase ví, kdy a za jakých podmínek přebírá dílo.
        </p>
        <p className="leading-relaxed text-slate-400">
          Bez smlouvy hrozí nejasnosti u rozsahu práce, termínu platby i vlastnictví výsledku.
          U opakované spolupráce může inspekce práce posuzovat vztah jako závislou práci —
          proto je důležité správně zvolit typ smlouvy.
        </p>
      </section>

      <section id="predmet-cena" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Předmět díla a cena</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Předmět díla musí být popsán tak, aby bylo možné posoudit, zda byl výsledek dodán.
          U webu jde o konkrétní funkcionalitu, u designu o počet návrhů a formáty, u textu o
          rozsah a účel. Cena může být pevná, položková nebo s milníky — důležité je, aby
          odpovídala dohodnutému rozsahu.
        </p>
        <ul className="space-y-3 text-slate-400">
          {[
            'Záloha a doplatek — kdy se platí a co spouští fakturaci.',
            'Splatnost faktury — typicky 14–30 dnů od předání díla.',
            'Akceptace díla — jak objednatel potvrdí, že výsledek odpovídá smlouvě.',
            'Sankce za prodlení — smluvní pokuta nebo úrok z prodlení.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="autorska-prava" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Autorská práva a licence
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Autor díla je zpravidla zhotovitel — freelancer. Objednatel získá práva až smlouvou:
          buď licencí (oprávnění užívat dílo) nebo převodem autorských práv. U běžných
          zakázek stačí nevýhradní licence pro daný účel; u exkluzivního užití je třeba
          výslovně sjednat výhradní licenci nebo převod.
        </p>
        <p className="leading-relaxed text-slate-400">
          Bez ustanovení o autorských právech zůstává výsledek ve prospěch autora a objednatel
          může mít problém s legálním užitím — například publikovat web, tisknout materiály
          nebo upravovat kód.
        </p>
      </section>

      <section id="viceprace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Vícepráce a změny</h2>
        <p className="leading-relaxed text-slate-400">
          Změny rozsahu jsou běžné — klient chce navíc stránku, další kolo úprav nebo
          rozšíření funkcionality. Ve smlouvě by mělo být, jak se vícepráce oceňují a kdo je
          musí písemně schválit. Bez toho hrozí spor o cenu i termín dokončení.
        </p>
      </section>

      <section id="chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Neurčitý popis díla — „vytvoření webu" bez specifikace rozsahu.',
            'Chybějící ustanovení o autorských právech.',
            'Platba až po akceptaci bez definice, co akceptace znamená.',
            'Použití DPP místo smlouvy o dílo u projektového výstupu.',
            'Absence pravidel pro vícepráce a změny zadání.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </ArticlePageLayout>
  );
}
