import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('autorska-prava-smlouva-o-dilo-2026', {
  title: 'Autorská práva ve smlouvě o dílo a spolupráci 2026: Kdo vlastní výsledek',
  description:
    'Jak ve smlouvě s freelancerem nebo agenturou ošetřit autorská práva k softwaru, designu, textům nebo fotografiím. Licence vs. převod, výhradnost, dílo zaměstnanecké.',
});

export default function AutorskaPravaSmlouvaODilo2026Page() {
  return (
    <ArticlePageLayout
      category="Podnikání a spolupráce"
      readTime="10 min"
      dateTime="2026-05-29"
      dateLabel="29. května 2026"
      dateModified="2026-05-29"
      dateModifiedLabel="29. května 2026"
      breadcrumbLabel="Autorská práva ve smlouvě 2026"
      slug="autorska-prava-smlouva-o-dilo-2026"
      title="Autorská práva ve smlouvě o dílo a spolupráci 2026: Kdo vlastní výsledek"
      intro="Při objednání softwaru, grafiky, webu nebo textu od freelancera nebo agentury vzniká dílo chráněné autorským zákonem. Kdo ho po dokončení vlastní, kdo ho smí používat, šířit, upravovat — to neurčuje fakturace, ale smlouva. Tento průvodce shrnuje rozdíl mezi licencí a převodem, ukazuje typické chyby a vysvětluje, kdy se uplatní režim zaměstnaneckého díla."
      toc={[
        { href: '#autorske-pravo', label: 'Co je autorské právo a co chrání' },
        { href: '#licence-vs-prevod', label: 'Licence vs. převod — jak to v ČR funguje' },
        { href: '#typy-licenci', label: 'Typy licencí: výhradní, nevýhradní, územní, časová' },
        { href: '#zamestnanecke-dilo', label: 'Zaměstnanecké dílo' },
        { href: '#kolektivni-dilo-software', label: 'Kolektivní dílo a software' },
        { href: '#caste-chyby', label: 'Časté chyby v B2B smlouvách' },
        { href: '#checklist', label: 'Checklist pro objednatele i zhotovitele' },
      ]}
      primaryAction={{
        title: 'Sjednáváte smlouvu s freelancerem nebo agenturou?',
        body: 'Smlouva o dílo a smlouva o spolupráci od SmlouvaHned obsahují klauzule o autorských právech, licenci a výhradnosti.',
        buttonLabel: 'Vybrat typ smlouvy',
        href: '/smlouva-o-dilo',
      }}
      finalAction={{
        title: 'Dílo s jasnými autorskými právy',
        body: 'Strukturovaný formulář pokryje licenční ujednání, výhradnost i odměnu.',
        buttonLabel: 'Vytvořit dokument',
        href: '/smlouva-o-dilo',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní zakázky — vývoj webu, grafický návrh, copywriting, fotografie, drobný software. Smlouva o dílo a o spolupráci pokrývá běžné situace s konkrétním výstupem.',
        lawyerSuitable:
          'Vysokohodnotné softwarové projekty, licence na obrázky a hudbu pro masové šíření, sporné nároky autorů na dodatečnou odměnu, mezinárodní distribuce, kolektivní díla a hromadné správce práv (OSA, INTERGRAM, DILIA).',
      }}
      relatedLinks={[
        { href: '/smlouva-o-dilo', label: '🛠️ Smlouva o dílo' },
        { href: '/spoluprace', label: '🤝 Smlouva o spolupráci' },
        { href: '/sluzby', label: '💼 Smlouva o poskytování služeb' },
        { href: '/nda', label: '🔐 NDA — smlouva o mlčenlivosti' },
        { href: '/blog/smlouva-o-dilo-2026', label: '📘 Smlouva o dílo — průvodce' },
        { href: '/slovnik#smlouva-o-dilo', label: '📖 Slovník: Smlouva o dílo' },
      ]}
    >
      <section id="autorske-pravo" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Co je autorské právo a co chrání
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Autorské právo v ČR upravuje zákon č. 121/2000 Sb., autorský zákon. Chrání
          výsledky tvůrčí činnosti autora, které mají povahu jedinečnosti — typicky:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Literární díla (texty, články, knihy, scénáře, marketingové texty s vyšší tvůrčí přidanou hodnotou)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Výtvarná a fotografická díla (grafický design, ilustrace, fotografie)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Hudební a zvukově obrazová díla</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Software (počítačový program včetně přípravných materiálů)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Architektonická a kartografická díla</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Databáze (zvláštní právo pořizovatele databáze)</span>
          </li>
        </ul>
        <p className="mb-4 leading-relaxed text-slate-400">
          Důležité jsou dvě roviny autorského práva:
        </p>
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Osobnostní práva autora</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Právo na autorství (podpis), právo rozhodnout o zveřejnění, právo na
              nedotknutelnost díla. Tato práva jsou nepřenosná a nezcizitelná — zůstávají
              autorovi i po smlouvě.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Majetková práva autora</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Právo dílo užít — rozmnožovat, rozšiřovat, sdělovat veřejnosti, upravovat,
              zařadit do jiného díla. Tato práva lze udělit smlouvou — formou licence.
              Trvají po dobu života autora a 70 let po jeho smrti.
            </p>
          </div>
        </div>
      </section>

      <section id="licence-vs-prevod" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Licence vs. 'převod" — jak to v ČR funguje
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          V anglosaském světě (USA, UK) se běžně mluví o 'transfer of copyright" — převodu
          autorského práva. České autorské právo tento institut v plné šíři nezná.
          Majetková autorská práva se v ČR <strong className="text-slate-300">
            neudělují převodem, ale licencí
          </strong>. Smlouva, která říká 'převádím na vás autorské právo k tomuto dílu",
          se vykládá jako licenční smlouva — soud rozhodne, jaký rozsah licence ze smlouvy
          plyne.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          To má v praxi několik důsledků:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Pokud chcete jako objednatel maximální kontrolu nad dílem, je nutné si
              vyjednat <strong className="text-slate-300">výhradní licenci k všem
              způsobům užití na celou dobu trvání majetkových práv</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Pokud licence v smlouvě není výslovně sjednána, použijí se podpůrná pravidla
              autorského zákona — obvykle nevýhradní licence na účel objednání. To bývá
              úzké.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Osobnostní práva autor neztrácí ani při 'úplném" převodu — má právo žádat
              uvedení svého jména a chránit dílo před znetvořením.
            </span>
          </li>
        </ul>
      </section>

      <section id="typy-licenci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Typy licencí: výhradní, nevýhradní, územní, časová
        </h2>
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Nevýhradní licence</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Autor smí stejné dílo poskytnout i jiným osobám. Vhodné pro tvorbu šablon,
              stock fotografie, opakovaně použitelné designové prvky. Pokud smlouva
              výhradnost neuvádí, jde o nevýhradní licenci.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Výhradní licence</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Nabyvatel je jediný, kdo smí dílo užít v daném rozsahu — sám autor jeho užití
              nesmí poskytnout třetí osobě, ani sám dílo užít nad rámec, který si
              ponechal. Výhradní licence vyžaduje písemnou formu.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Územní rozsah</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Licence může být omezena na konkrétní území (ČR, EU, celý svět). Pro online
              obsah má smysl uvádět 'celosvětově" — internet hranice nemá.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Časový rozsah</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Licence může být časově omezená (např. 5 let, doba trvání kampaně) nebo na
              celou dobu trvání majetkových práv (život autora + 70 let). Pro investici do
              loga, identity nebo softwaru je vhodná dlouhodobá licence.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Způsoby užití</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Autorský zákon rozlišuje konkrétní způsoby užití — rozmnožování, rozšiřování,
              pronájem, sdělování veřejnosti, úprava. Licence by měla vyjmenovat, které
              způsoby zahrnuje. Klauzule 'licence ke všem způsobům užití" je obvyklá a
              v praxi nejširší.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
            <div className="mb-1 text-sm font-black text-white">Sublicence a postoupení</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Standardně nabyvatel licence nesmí udělit sublicenci ani licenci postoupit.
              Pokud objednatel počítá s tím, že dílo bude sdílet například v rámci skupiny
              firem nebo poskytne třetí straně, je nutné to ve smlouvě výslovně sjednat.
            </p>
          </div>
        </div>
      </section>

      <section id="zamestnanecke-dilo" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Zaměstnanecké dílo
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pokud autor dílo vytvořil ke splnění svých povinností vyplývajících z pracovního
          poměru, jde o tzv. <strong className="text-slate-300">zaměstnanecké dílo</strong>.
          Zaměstnavatel vykonává majetková práva k tomuto dílu, není-li ujednáno jinak.
          Autorovi zůstávají osobnostní práva.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Klíčové: režim zaměstnaneckého díla se vztahuje na výsledky vytvořené v rámci
          pracovní smlouvy. Pro DPP a DPČ se uplatní jen tehdy, pokud to konkrétní úprava
          připouští a stranami sjednáno. Pro spolupráci s OSVČ na fakturu se zaměstnanecké
          dílo neuplatní — tam je nutné mít licenční ujednání ve smlouvě.
        </p>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-blue-400">📌 Praktický důsledek:</strong> Pokud řešíte
          vývoj produktu kombinací interních zaměstnanců a externích freelancerů, máte
          dva právní režimy najednou. Zaměstnanecká část je 'automaticky" u firmy,
          freelancerská část vyžaduje výslovná licenční ustanovení.
        </div>
      </section>

      <section id="kolektivni-dilo-software" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Kolektivní dílo a software
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U softwaru je situace zvláštní. Počítačový program vytvořený autorem na objednávku
          může být podle autorského zákona posuzován obdobně jako zaměstnanecké dílo, pokud
          jsou splněny zákonné podmínky — zejména jde-li o program vytvořený fyzickou osobou
          na základě smlouvy o dílo nebo pracovní smlouvy. V praxi je ale stále vhodné mít
          výslovně upravenou licenci, předání zdrojových kódů, rozsah užití, právo na úpravy,
          sublicence, open-source komponenty a předání dokumentace.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Režim se liší podle toho, zda dodavatelem je přímo fyzická osoba–autor, nebo
          firma či agentura, která zapojuje více autorů. U agentury bývá klíčové, kdo smí
          poskytnout licenci a zda smlouva pokrývá i díla subdodavatelů.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          U softwaru autorský zákon stanoví zvláštní pravidla. Software vytvořený několika
          osobami ve společné práci je obvykle <strong className="text-slate-300">
            kolektivním dílem
          </strong> — jednotlivé příspěvky se obtížně oddělují. Práva k kolektivnímu dílu
          vykonává osoba, z jejíhož podnětu a pod jejímž vedením dílo vzniklo, typicky
          firma jako objednatel.
        </p>
        <p className="leading-relaxed text-slate-400">
          U open-source komponent, které freelancer použije při vývoji, se uplatňují licence
          příslušných projektů (MIT, Apache 2.0, GPL …). Smlouva by měla obsahovat
          prohlášení zhotovitele, že použité open-source komponenty jsou kompatibilní s
          předpokládaným užitím a že firma získává čistou licenci na vlastní kód.
        </p>
      </section>

      <section id="caste-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          6. Časté chyby v B2B smlouvách
        </h2>
        <div className="space-y-4">
          {[
            {
              t: 'Klauzule převádím autorské právo',
              d: 'V ČR je nahrazena výkladem jako licence. Pokud má smlouva fungovat i ve sporu, je vhodné použít přesnou formulaci typu: autor poskytuje výhradní licenci ke všem způsobům užití díla ve veškerém rozsahu, na celou dobu trvání majetkových autorských práv, na celosvětovém území.',
            },
            {
              t: 'Žádná zmínka o autorských právech',
              d: 'Při sporu se použijí podpůrná pravidla — nevýhradní licence v rozsahu účelu objednání. Pro objednatele bývá výsledek úzký a překvapivý.',
            },
            {
              t: 'Cena nezahrnuje licenci',
              d: 'Pokud smlouva říká, že honorář pokrývá pouze vytvoření díla, autor může po dokončení požadovat zvláštní odměnu za užití. Klauzule typu dohodnutá odměna zahrnuje i odměnu za poskytnutí licence tomu předchází.',
            },
            {
              t: 'Chybějící úprava budoucích změn a derivátů',
              d: 'Software bývá upravován po dodání. Pokud licence nezahrnuje právo dílo upravovat, vytvářet odvozená díla a překládat, je objednatel u každé budoucí změny vázán na souhlas autora.',
            },
            {
              t: 'Nezohledněné stock prvky a třetí strany',
              d: 'Grafici a vývojáři často používají stock fotografie, fonty, ikony, knihovny. Smlouva by měla říkat, kdo zajišťuje licence k těmto třetím stranám a kdo nese odpovědnost za případné porušení.',
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 text-sm font-black text-white">{c.t}</div>
              <p className="text-sm leading-relaxed text-slate-400">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="checklist" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          7. Checklist pro objednatele i zhotovitele
        </h2>
        <h3 className="mb-3 text-lg font-black text-white">Objednatel by měl ve smlouvě hledat:</h3>
        <ul className="mb-6 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Výslovnou výhradní licenci, pokud chce dílo užívat sám</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Územní rozsah 'celosvětově" a časový 'na celou dobu trvání majetkových práv"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Právo upravovat, vytvářet odvozená díla, překládat, zařadit do jiného díla</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Právo poskytovat sublicence (důležité pro skupiny firem a další distribuci)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Klauzuli 'cena zahrnuje odměnu za poskytnutí licence"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Prohlášení autora, že dílo neporušuje práva třetích osob</span>
          </li>
        </ul>
        <h3 className="mb-3 text-lg font-black text-white">Zhotovitel by měl ve smlouvě hlídat:</h3>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Jasné vymezení rozsahu díla — co je 'součástí" a co je již vícepráce</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Právo uvést dílo v portfoliu (osobnostní právo, ale stojí za výslovnou klauzuli)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Vyloučení odpovědnosti za zákazníky podklady a třetí strany</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-emerald-500">✓</span>
            <span>Splatnost odměny svázanou s předáním díla a podpisem akceptačního protokolu</span>
          </li>
        </ul>
      </section>
    </ArticlePageLayout>
  );
}
