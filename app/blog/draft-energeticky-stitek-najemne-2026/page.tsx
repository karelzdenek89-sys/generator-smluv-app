import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

/**
 * DRAFT — čeká na právní revizi.
 */
export const metadata: Metadata = {
  title: 'Energetický štítek (PENB) a nájemné 2026: Co potřebujete vědět při pronájmu bytu',
  description:
    'Průkaz energetické náročnosti budovy, jeho povinné předložení nájemci, dopad na výši nájemného a vyúčtování energií. Praktický průvodce pro pronajímatele i nájemce.',
  robots: { index: false, follow: false },
};

export default function DraftEnergetickyStitekPage() {
  return (
    <ArticlePageLayout
      category="Bydlení"
      readTime="9 min"
      dateTime="2026-05-16"
      dateLabel="16. května 2026"
      dateModified="2026-05-16"
      dateModifiedLabel="16. května 2026"
      breadcrumbLabel="Energetický štítek a nájemné 2026"
      slug="draft-energeticky-stitek-najemne-2026"
      title="Energetický štítek (PENB) a nájemné 2026: Co potřebujete vědět při pronájmu bytu"
      intro="Průkaz energetické náročnosti budovy (PENB) — laicky energetický štítek — se stal v posledních letech standardní součástí inzerce i nájemních smluv. Pro rok 2026 platí jeho povinné zveřejnění v inzerátu a předání nájemci. Tento průvodce shrnuje, kdy je PENB povinný, co znamenají jednotlivé třídy A–G, a jak energetický štítek souvisí s vyúčtováním energií a férovou cenou nájmu."
      toc={[
        { href: '#co-je-penb', label: 'Co je PENB a kdy je povinný' },
        { href: '#tridy-a-g', label: 'Třídy A–G a co znamenají' },
        { href: '#inzerce', label: 'Povinnost v inzerci a v nájemní smlouvě' },
        { href: '#vliv-na-najem', label: 'Vliv energetické náročnosti na nájem' },
        { href: '#vyuctovani', label: 'Vyúčtování energií u nájmu bytu' },
        { href: '#caste-otazky', label: 'Časté otázky' },
      ]}
      primaryAction={{
        title: 'Připravujete nájemní smlouvu?',
        body: 'Šablona nájemní smlouvy SmlouvaHned obsahuje místo pro uvedení energetické třídy a způsobu vyúčtování energií.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      finalAction={{
        title: 'Nájemní smlouva pro rok 2026',
        body: 'Vyplníte strany, parametry bytu, nájemné, kauci, vyúčtování. PDF získáte ihned.',
        buttonLabel: 'Vytvořit dokument',
        href: '/najem',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní pronájem bytu, kde má pronajímatel k dispozici PENB nebo platnou alternativu (např. vyúčtování energií za posledních 3 roky pro budovy postavené před účinností povinnosti).',
        lawyerSuitable:
          'Spor o platnost smlouvy z důvodu chybějícího PENB, pokuty od Státní energetické inspekce, komplexní revitalizace s dopadem na klasifikaci, kombinace s podporami a dotacemi.',
      }}
      relatedLinks={[
        { href: '/najem', label: '🏠 Nájemní smlouva — formulář' },
        { href: '/blog/najemni-smlouva-vzor-2026', label: '📘 Nájemní smlouva — průvodce' },
        { href: '/blog/valorizace-najemneho-2026', label: '📈 Valorizace nájemného' },
        { href: '/balicek-pronajimatel', label: '📦 Balíček pro pronajímatele' },
        { href: '/slovnik#najemni-smlouva', label: '📖 Slovník: Nájemní smlouva' },
      ]}
    >
      <section id="co-je-penb" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Co je PENB a kdy je povinný
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Průkaz energetické náročnosti budovy (PENB) je dokument, který informuje o
          energetické náročnosti budovy nebo její samostatné části (typicky bytu). Vychází
          ze zákona o hospodaření energií č. 406/2000 Sb. a navazující vyhlášky. Vystavuje
          ho energetický specialista zapsaný v seznamu Ministerstva průmyslu a obchodu.
          Platnost PENB je obvykle 10 let — pokud nedojde k zásadní rekonstrukci, která by
          klasifikaci změnila.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          PENB je v praxi povinný zejména při:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Výstavbě nové budovy a jejím dokončení.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Větší změně dokončené budovy (typicky stavební úpravy nad určitou intenzitu).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Prodeji budovy nebo její ucelené části.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Pronájmu budovy nebo její ucelené části (typicky byt).</span>
          </li>
        </ul>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-blue-400">📌 Pozn.:</strong> U starších budov, pro které
          PENB nikdy nebyl zpracován a vlastník ho nemůže získat za přiměřených podmínek,
          umožňuje zákon nahradit klasifikaci doloženým vyúčtováním energií za období
          posledních tří let. Tato výjimka je úzká — vyplatí se ji konzultovat s
          energetickým specialistou.
        </div>
      </section>

      <section id="tridy-a-g" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Třídy A–G a co znamenají
        </h2>
        <p className="mb-5 leading-relaxed text-slate-400">
          Klasifikace probíhá v sedmi třídách od A do G — analogicky s energetickými štítky
          spotřebičů. Třída se vztahuje k roční měrné spotřebě energie na celkovou
          podlahovou plochu (kWh/m² · rok). Konkrétní hranice se v čase upravují vyhláškou.
        </p>
        <div className="space-y-2">
          {[
            { c: 'A', l: 'Mimořádně úsporná', d: 'Pasivní a nízkoenergetické budovy s rekuperací, kvalitní izolací.' },
            { c: 'B', l: 'Velmi úsporná', d: 'Nové domy s vysokým standardem zateplení a moderním vytápěním.' },
            { c: 'C', l: 'Úsporná', d: 'Standard nově stavěných domů (požadavek pro novostavby).' },
            { c: 'D', l: 'Méně úsporná', d: 'Starší domy po částečné rekonstrukci, panelové domy po revitalizaci.' },
            { c: 'E', l: 'Nehospodárná', d: 'Starší nezateplené domy, panelové domy v původním stavu.' },
            { c: 'F', l: 'Velmi nehospodárná', d: 'Starší cihlové domy s minimální izolací, nemoderní vytápění.' },
            { c: 'G', l: 'Mimořádně nehospodárná', d: 'Historické budovy bez izolace, lokální topení na pevná paliva.' },
          ].map((t) => (
            <div
              key={t.c}
              className="flex items-start gap-4 rounded-2xl border border-white/8 bg-[#0c1426] p-4"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-2xl font-black text-amber-400">
                {t.c}
              </div>
              <div>
                <div className="font-bold text-white">{t.l}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{t.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 leading-relaxed text-slate-400">
          Pro nájemce má třída zásadní praktický význam — určuje, kolik bude pravděpodobně
          platit za energie. Mezi třídou B a třídou F může být rozdíl ve výši ročních
          nákladů na vytápění v řádu desítek tisíc korun.
        </p>
      </section>

      <section id="inzerce" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Povinnost v inzerci a v nájemní smlouvě
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          V inzerátu prodeje nebo pronájmu musí být uvedena klasifikační třída energetické
          náročnosti — typicky písmenem A–G a slovním označením. Pokud pronajímatel třídu
          neuvede, vystavuje se riziku pokuty od Státní energetické inspekce.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          V okamžiku uzavření nájemní smlouvy je pronajímatel povinen předat nájemci PENB —
          buď v listinné, nebo elektronické podobě. V praxi se PENB stává přílohou nájemní
          smlouvy a jeho předání se v textu smlouvy potvrzuje.
        </p>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-amber-400">✓ V praxi se osvědčilo:</strong> V nájemní
          smlouvě uvést větu typu 'Pronajímatel předal nájemci průkaz energetické náročnosti
          budovy (PENB) ze dne …, třída …, který tvoří přílohu č. … této smlouvy." Tím je
          splněna informační i důkazní rovina.
        </div>
      </section>

      <section id="vliv-na-najem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Vliv energetické náročnosti na nájem
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zákon přímo neříká, že nájem v bytě třídy F musí být nižší než v bytě třídy B.
          Cenu určuje trh a dohoda smluvních stran. V praxi ale třída zásadně ovlivňuje:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Celkové měsíční náklady nájemce</strong> —
              součet nájmu a energií. Pro nájemce je relevantní celá tato částka, ne jen
              čisté nájemné.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Atraktivitu nabídky</strong> — pronajímatel
              bytu třídy E nebo F obvykle naráží na delší dobu obsazení a vyšší fluktuaci.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Vyjednávací pozici</strong> — nájemce má
              při třídě F větší argument pro nižší nájemné nebo pro vyšší zápočet záloh.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Možnost dotace</strong> — programy Nová
              zelená úsporám pro pronajímatele (revitalizace, výměna oken, fotovoltaika)
              mohou energetickou náročnost vylepšit s podporou státu.
            </span>
          </li>
        </ul>
      </section>

      <section id="vyuctovani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Vyúčtování energií u nájmu bytu
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Vedle PENB má nájem druhou energetickou stránku — vyúčtování záloh za služby
          (teplo, teplá voda, studená voda, společné prostory). Postup vyúčtování upravuje
          zákon č. 67/2013 Sb. a navazující vyhlášky.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">Klíčová pravidla:</p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Vyúčtování se zpracovává za zúčtovací období (typicky kalendářní rok) a
              musí být doručeno do 4 měsíců od jeho konce.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Nájemce má lhůtu pro vznesení námitek (zpravidla 30 dnů od doručení).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Přeplatek se vrací typicky do 4 měsíců od skončení reklamačního období,
              nedoplatek bývá splatný ve stejné lhůtě.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Rozúčtování tepla mezi nájemce v domě se řídí samostatnou vyhláškou — část
              spotřeby se rozpočítává podle podlahové plochy, část podle náměrů
              individuálních měřidel.
            </span>
          </li>
        </ul>
        <p className="leading-relaxed text-slate-400">
          U bytů, kde má nájemce vlastní samostatné odběry (elektřina, plyn), si nájemce
          obvykle uzavírá smlouvu přímo s dodavatelem a vyúčtování řeší mimo nájemní vztah.
          V nájemní smlouvě je pak vhodné uvést, kdo odběry 'přepíše" a kdy.
        </p>
      </section>

      <section id="caste-otazky" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          6. Časté otázky
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Musím mít PENB i u pronájmu jednoho pokoje?',
              a: 'Povinnost se týká pronájmu ucelené části budovy. U pronájmu pokoje v rámci sdíleného bydlení (typicky nájem jednotlivé místnosti) se v praxi vykládá různě — vyplatí se mít alespoň základní informaci o energetické třídě domu.',
            },
            {
              q: 'Stačí mi starý PENB z roku 2018?',
              a: 'PENB platí typicky 10 let, takže PENB z roku 2018 obvykle ještě platí. Pokud ale mezitím proběhla větší rekonstrukce, je vhodné nechat zpracovat nový — jinak dokument neodpovídá aktuálnímu stavu.',
            },
            {
              q: 'Co když pronajímatel PENB nemá a já jako nájemce už podepsal smlouvu?',
              a: 'Smlouva tím obvykle neztrácí platnost, ale pronajímatel poruší informační povinnost. Nájemce může písemně PENB vyžadovat; v případě neposkytnutí lze nahlásit Státní energetické inspekci. V praxi je vhodnější zkusit nejprve dohodu.',
            },
            {
              q: 'Kde najdu seznam energetických specialistů?',
              a: 'Seznam vede Ministerstvo průmyslu a obchodu. Zpracování PENB pro byt v bytovém domě stojí v praxi řádově nižší tisíce korun, pro rodinný dům vyšší.',
            },
          ].map((c) => (
            <div key={c.q} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 text-sm font-black text-white">{c.q}</div>
              <p className="text-sm leading-relaxed text-slate-400">{c.a}</p>
            </div>
          ))}
        </div>
      </section>
    </ArticlePageLayout>
  );
}
