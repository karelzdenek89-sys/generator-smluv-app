import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';

export const metadata = blogArticlePageMetadata('najem-na-dobu-urcitou-neurcitou-2026');

export default function NajemNaDobuUrcitouNeurcitou2026Page() {
  return (
    <ArticlePageLayout
      category="Bydlení"
      readTime="8 min"
      dateTime="2026-07-09"
      dateLabel="9. července 2026"
      breadcrumbLabel="Nájem na dobu určitou nebo neurčitou"
      slug="najem-na-dobu-urcitou-neurcitou-2026"
      title="Nájem na dobu určitou nebo neurčitou 2026: co vybrat do smlouvy"
      intro="Doba nájmu ovlivní, jak dlouho strany s nájmem počítají, jak budou řešit pokračování vztahu a jak se budou orientovat při budoucím ukončení. Nejde jen o formální kolonku: dobu nájmu je vhodné napsat jednoznačně a spolu s ní promyslet předání bytu, kauci a navazující komunikaci."
      toc={[
        { href: '#zakladni-rozdil', label: 'Základní rozdíl' },
        { href: '#doba-urcita', label: 'Kdy dává smysl doba určitá' },
        { href: '#doba-neurcita', label: 'Kdy dává smysl doba neurčitá' },
        { href: '#prodlouzeni', label: 'Prodloužení a pokračování nájmu' },
        { href: '#co-zapsat', label: 'Co napsat do smlouvy' },
      ]}
      primaryAction={{
        title: 'Chcete nastavit dobu nájmu přímo ve smlouvě?',
        body: 'Formulář nájemní smlouvy vede přes dobu nájmu, nájemné, kauci, služby a pravidla předání bytu.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      trustBox={{
        generatorSuitable:
          'Běžný nájem bytu nebo domu, kde se pronajímatel a nájemce shodli na délce nájmu a hlavních podmínkách užívání.',
        lawyerSuitable:
          'Probíhající spor o skončení nájmu, složité ubytovací uspořádání nebo nestandardní situace s více nájemci či vlastníky.',
      }}
      finalAction={{
        title: 'Připravte nájemní smlouvu podle své situace',
        body: 'Zadejte strany, byt, dobu nájmu, nájemné a kauci do strukturovaného formuláře.',
        buttonLabel: 'Otevřít formulář nájemní smlouvy',
        href: '/najem',
      }}
      relatedLinks={[
        { href: '/najem', label: 'Nájemní smlouva - formulář online' },
        { href: '/blog/najemni-smlouva-vzor-2026', label: 'Co musí obsahovat nájemní smlouva' },
        { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu bytu' },
        { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu bytu' },
      ]}
    >
      <section id="zakladni-rozdil" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Základní rozdíl je v konci nájmu</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U nájmu na dobu určitou smlouva obsahuje konkrétní datum nebo jinak jednoznačně určený okamžik skončení. U
          nájmu na dobu neurčitou konečné datum sjednáno není. Pokud dobu nájmu ve smlouvě vůbec neurčíte, občanský
          zákoník vychází z toho, že nájem byl sjednán na dobu neurčitou.
        </p>
        <p className="leading-relaxed text-slate-400">
          Volba sama o sobě neřeší všechny budoucí situace. Je proto vhodné vedle doby nájmu zapsat i předávací
          postup, způsob komunikace a termín vyúčtování služeb nebo vrácení jistoty po skončení nájmu.
        </p>
      </section>

      <section id="doba-urcita" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Kdy dává smysl doba určitá</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Doba určitá se hodí, když obě strany vědí, že byt bude potřeba jen do určitého období: například po dobu
          studia, projektu, plánované rekonstrukce nebo do konkrétního data. Výhodou je předem známý horizont, který
          usnadňuje plánování.
        </p>
        <p className="leading-relaxed text-slate-400">
          Do smlouvy napište začátek i konec přesně. Věta „na rok“ bez návaznosti na datum podpisu může při sporu
          vyvolat zbytečné otázky. Pokud chcete nájem opakovaně prodlužovat, stanovte si praktický postup, kdy se
          strany ozvou a jak prodloužení písemně potvrdí.
        </p>
      </section>

      <ArticleInlineCta
        title="Nastavte dobu nájmu rovnou ve smlouvě"
        body="Vyplňte datum začátku, zvolený režim nájmu a další podmínky v jednom přehledném dokumentu."
        buttonLabel="Pokračovat k nájemní smlouvě"
        href="/najem"
        variant="subtle"
        articleSlug="najem-na-dobu-urcitou-neurcitou-2026"
      />

      <section id="doba-neurcita" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Kdy dává smysl doba neurčitá</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Doba neurčitá bývá vhodná, když strany plánují dlouhodobý nájem bez pevně známého konce. Neznamená to ale,
          že vztah nejde ukončit. Pravidla výpovědi se u nájmu bytu řídí zákonem a liší se podle toho, kdo výpověď
          dává a z jaké situace vychází.
        </p>
        <p className="leading-relaxed text-slate-400">
          Proto má smysl vyhnout se nejasným formulacím typu „nájem podle potřeby“. Pro nájem na dobu neurčitou je
          čitelnější výslovně napsat, že se sjednává bez určení konce, a navázat na zákonná pravidla ukončení.
        </p>
      </section>

      <section id="prodlouzeni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Prodloužení a pokračování nájmu</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U doby určité je nejčistší sepsat dodatek ještě před koncem nájmu. Občanský zákoník zároveň obsahuje pravidlo
          pro situaci, kdy nájemce po skončení dál byt užívá alespoň tři měsíce a pronajímatel jej v té době písemně
          nevyzve k opuštění bytu: nájem se za zákonných podmínek obnoví na stejnou dobu, nejvýše na dva roky.
        </p>
        <p className="leading-relaxed text-slate-400">
          Proto nenechávejte konec doby určité „vyšumět“. Pro pronajímatele i nájemce je bezpečnější mít jasnou
          písemnou stopu, zda nájem pokračuje, končí, nebo se mění jeho podmínky.
        </p>
      </section>

      <section id="co-zapsat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Co ve smlouvě zkontrolovat</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Je doba nájmu určena jako určitá nebo neurčitá bez pochybností?',
            'Obsahuje doba určitá konkrétní datum začátku a konce?',
            'Je popsán postup pro případné prodloužení nebo předání bytu?',
            'Jsou vedle doby nájmu srozumitelně nastaveny kauce, služby a předávací protokol?',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          Zdroj: <a className="text-amber-400 hover:text-amber-300" href="https://e-sbirka.gov.cz/sb/2012/89" target="_blank" rel="noreferrer">občanský zákoník, zejména § 2237 a § 2285</a>.
        </p>
      </section>
    </ArticlePageLayout>
  );
}
