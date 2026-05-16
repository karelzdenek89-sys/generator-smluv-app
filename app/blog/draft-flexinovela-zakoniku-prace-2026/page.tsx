import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

/**
 * DRAFT — čeká na právní revizi před publikací.
 * - `robots: { index: false, follow: false }` (nepustit do indexu)
 * - NEpřidáno do BLOG_ARTICLES (aby se neobjevoval v RelatedArticles)
 * - NEpřidáno do app/sitemap.ts
 *
 * Po revizi advokátem:
 *   1) Přesunout obsah do `app/blog/flexinovela-zakoniku-prace-2026/page.tsx`
 *   2) Odstranit `robots: { index: false }`
 *   3) Doplnit záznam do `lib/blog-articles.ts` (BLOG_ARTICLES)
 *   4) Přidat do `app/sitemap.ts`
 */
export const metadata: Metadata = {
  title: 'Flexinovela zákoníku práce 2026: Co se mění u DPP, DPČ a pracovních smluv',
  description:
    'Přehled hlavních změn, které do pracovněprávních vztahů přinesla novela zákoníku práce (tzv. flexinovela) — povinnosti zaměstnavatelů u DPP, nové oznamovací povinnosti, dopady na zaměstnance.',
  robots: { index: false, follow: false },
};

export default function DraftFlexinovelaPage() {
  return (
    <ArticlePageLayout
      category="Práce a zaměstnání"
      readTime="11 min"
      dateTime="2026-05-16"
      dateLabel="16. května 2026"
      dateModified="2026-05-16"
      dateModifiedLabel="16. května 2026"
      breadcrumbLabel="Flexinovela zákoníku práce 2026"
      slug="draft-flexinovela-zakoniku-prace-2026"
      title="Flexinovela zákoníku práce 2026: Co se mění u DPP, DPČ a pracovních smluv"
      intro="Tzv. flexinovela zákoníku práce přinesla od konce roku 2024 a v průběhu roku 2025 řadu úprav, které se promítají i do roku 2026. Cílem novely byla flexibilita pracovněprávních vztahů — krátkodobé úvazky, dohody mimo pracovní poměr i home office. Tento průvodce shrnuje hlavní změny, kterých se týkají běžné situace u DPP, DPČ a klasické pracovní smlouvy."
      toc={[
        { href: '#proc-flexinovela', label: 'Proč flexinovela vznikla a co řeší' },
        { href: '#dpp-zmeny', label: 'Klíčové změny u DPP' },
        { href: '#dpc-zmeny', label: 'Klíčové změny u DPČ' },
        { href: '#pracovni-pomer', label: 'Změny u pracovního poměru' },
        { href: '#home-office', label: 'Home office a práce na dálku' },
        { href: '#sankce-kontrola', label: 'Sankce a kontroly inspekce práce' },
        { href: '#co-delat', label: 'Co by měl zaměstnavatel obvykle zkontrolovat' },
      ]}
      primaryAction={{
        title: 'Vytváříte novou DPP nebo pracovní smlouvu?',
        body: 'Šablony SmlouvaHned jsou aktualizované pro stav zákoníku práce platný v roce 2026 — formulář vás provede povinnými náležitostmi.',
        buttonLabel: 'Vybrat typ dohody',
        href: '/dpp',
      }}
      finalAction={{
        title: 'Pracovní dokument za 5 minut',
        body: 'Strukturovaný formulář pokryje povinné náležitosti dle zákoníku práce platného v roce 2026.',
        buttonLabel: 'Vytvořit dokument',
        href: '/',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní DPP, DPČ a pracovní smlouva pro běžné situace — krátkodobé úvazky, drobné brigády, opakovaná činnost pravidelného rozsahu, klasický pracovní poměr u malého zaměstnavatele.',
        lawyerSuitable:
          'Spory s inspekcí práce, podezření ze švarcsystému, řetězení dohod, mezinárodní vyslání zaměstnanců, kolektivní vyjednávání, hromadné propouštění nebo specifické režimy (chráněné dílny, agenturní zaměstnávání).',
      }}
      relatedLinks={[
        { href: '/dpp', label: '⚙️ DPP — formulář online' },
        { href: '/pracovni', label: '👔 Pracovní smlouva — formulář' },
        { href: '/blog/dpp-dohoda-provedeni-prace', label: '📘 DPP — průvodce' },
        { href: '/blog/dpp-dpc-porovnani-2026', label: '⚖️ DPP nebo DPČ — porovnání' },
        { href: '/blog/pracovni-smlouva-2026', label: '👔 Pracovní smlouva — průvodce' },
        { href: '/slovnik#dpp', label: '📖 Slovník: DPP' },
      ]}
    >
      <section id="proc-flexinovela" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Proč flexinovela vznikla a co řeší
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Novela zákoníku práce, kterou veřejnost zná pod přezdívkou 'flexinovela", reagovala na
          potřebu modernizace pracovněprávních vztahů a zároveň na povinnost transpozice
          evropských směrnic — zejména směrnice 2019/1152 o transparentních a předvídatelných
          pracovních podmínkách a směrnice 2019/1158 o rovnováze mezi pracovním a soukromým
          životem. Účinnost novely byla rozprostřena postupně, hlavní část se týká přelomu let
          2024 a 2025; pro rok 2026 už jde o etablovaný právní stav.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pro zaměstnavatele a OSVČ to znamená tři typy změn:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Nové informační a oznamovací povinnosti</strong>{' '}
              — zaměstnavatel musí informovat o širším okruhu skutečností a u dohod oznamovat
              příslušné instituci údaje, které dříve oznamovány nebyly.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Posílení postavení dohod o pracích konaných mimo pracovní poměr</strong>{' '}
              — u DPP a DPČ vznikla řada nových povinností (rozvrh pracovní doby), současně se
              dohodáři přiblížili klasickým zaměstnancům v některých nárocích.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              <strong className="text-slate-300">Flexibilnější uspořádání práce</strong> — práce
              na dálku, sdílené pracovní místo, předvídatelnost pracovní doby u zkrácených
              úvazků.
            </span>
          </li>
        </ul>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-blue-400">📌 Pozn.:</strong> Tento článek shrnuje obecný stav
          po flexinovele. Konkrétní paragrafy a lhůty se mohou v detailu lišit podle stavu
          předpisu k datu, kdy věc řešíte — vždy se vyplatí ověřit aktuální znění na portálu{' '}
          <a
            href="https://www.zakonyprolidi.cz/cs/2006-262"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline underline-offset-2"
          >
            zakonyprolidi.cz
          </a>
          .
        </div>
      </section>

      <section id="dpp-zmeny" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Klíčové změny u DPP
        </h2>
        <p className="mb-5 leading-relaxed text-slate-400">
          Dohoda o provedení práce (DPP) prošla nejvýraznější proměnou. Limit 300 hodin ročně u
          jednoho zaměstnavatele zůstává, ale přibyly povinnosti, které řadu zaměstnavatelů
          překvapily.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Povinný písemný rozvrh pracovní doby</h3>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zaměstnavatel musí dohodáři předem písemně sdělit rozvrh pracovní doby — kdy bude
          práci konat. Pravidlo má kořeny v požadavku evropské směrnice na předvídatelnost
          pracovních podmínek. Rozvrh nemusí být na celý kalendářní rok, lze ho stanovovat na
          kratší období, vždy ale s dostatečným předstihem.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Oznamovací povinnost vůči ČSSZ</h3>
        <p className="mb-4 leading-relaxed text-slate-400">
          U DPP přibyla povinnost oznamovat skutečnosti rozhodné pro účast na nemocenském
          pojištění a pro vznik / zánik tohoto vztahu. Oznámení je elektronické a má pevně
          stanovené lhůty.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Dovolená u dohodářů</h3>
        <p className="mb-4 leading-relaxed text-slate-400">
          Dohodáři získali za stanovených podmínek nárok na dovolenou — v praxi to znamená, že
          při dlouhodobé a pravidelné spolupráci přes DPP nelze tento nárok ignorovat. Konkrétní
          výpočet vychází z odpracovaných hodin a obecné úpravy dovolené v zákoníku práce.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Limity příjmu pro zdanění a pojištění</h3>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pro účast na sociálním a zdravotním pojištění z DPP platí měsíční limit, jehož
          překročení vede k povinné účasti na pojištění a k odpovídajícím odvodům. Konkrétní
          částka se v čase mění (vychází z průměrné mzdy) — aktuální hodnotu lze ověřit na
          stránkách ČSSZ a finanční správy.
        </p>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <p className="mb-3 text-sm text-slate-300">
            <strong>Pokud DPP používáte pro krátkodobou nebo příležitostnou činnost</strong>,
            stojí za to mít připraven písemný rozvrh, evidenci odpracovaných hodin a
            elektronickou cestu k oznámení vůči ČSSZ.
          </p>
        </div>
      </section>

      <section id="dpc-zmeny" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Klíčové změny u DPČ
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Dohoda o pracovní činnosti (DPČ) byla od počátku určena pro vztah, který nedosáhne
          parametrů plného úvazku — typicky do poloviny stanovené týdenní pracovní doby
          (obvykle 20 hodin týdně v průměru za období nejdéle 52 týdnů). Flexinovela u DPČ
          posílila informační povinnosti a zarovnala některé instituty s pracovním poměrem.
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Rozšířená povinnost písemného informování o základních podmínkách (druh práce,
              místo výkonu, předpokládaný rozsah, odměna, výpovědní doba, evidence atd.)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Nárok na dovolenou za splnění stanovených podmínek (analogicky k DPP)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Vyšší předvídatelnost pracovní doby — pokud zaměstnavatel rozvrh mění, musí
              respektovat přiměřené lhůty
            </span>
          </li>
        </ul>
      </section>

      <section id="pracovni-pomer" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Změny u pracovního poměru
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U klasické pracovní smlouvy zůstává jádro stejné — tři podstatné náležitosti (druh
          práce, místo výkonu, den nástupu) a písemná forma. Flexinovela ale rozšířila okruh
          informací, které musí zaměstnavatel zaměstnanci sdělit nejpozději v určené lhůtě od
          vzniku pracovního poměru.
        </p>
        <h3 className="mb-3 text-lg font-black text-white">Co se rozšířilo</h3>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Informace o době trvání a podmínkách zkušební doby</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Postup výpovědi a délky výpovědních dob</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Údaje o odborném vzdělávání zajišťovaném zaměstnavatelem</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Označení instituce, které jsou odváděny pojistné a daně</span>
          </li>
        </ul>
        <p className="leading-relaxed text-slate-400">
          Informace mohou být součástí pracovní smlouvy nebo zvláštního písemného sdělení.
          Pokud informaci zaměstnavatel neposkytne, neznamená to neplatnost pracovní smlouvy,
          ale otevírá to prostor k námitkám a případným sankcím.
        </p>
      </section>

      <section id="home-office" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Home office a práce na dálku
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Práce na dálku (home office) je po flexinovele upravena výslovně a vyžaduje
          písemnou dohodu mezi zaměstnavatelem a zaměstnancem. Dohoda by měla obsahovat
          místo výkonu práce, způsob komunikace, rozvrh, evidenci docházky, otázku nákladů
          (typicky paušál) a způsob ukončení režimu.
        </p>
        <p className="leading-relaxed text-slate-400">
          Některé skupiny zaměstnanců (pečující o dítě do určitého věku, těhotné zaměstnankyně,
          zaměstnanci pečující o závislou osobu) mají právo o home office žádat a zaměstnavatel
          žádost musí buď akceptovat, nebo písemně odůvodnit, proč ji odmítá. Detaily se mohou
          v praxi lišit podle konkrétní situace.
        </p>
      </section>

      <section id="sankce-kontrola" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          6. Sankce a kontroly inspekce práce
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Státní úřad inspekce práce (SÚIP) provádí kontroly dodržování zákoníku práce a
          souvisejících předpisů. Za porušení informačních a oznamovacích povinností hrozí
          správní pokuty řádově ve statisících korun pro právnické osoby, u podnikajících
          fyzických osob menší částky. Nejcitlivější oblastí je u dohod tzv. švarcsystém —
          výkon závislé práce mimo pracovněprávní vztah, který je samostatně sankčně
          postihován.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pro zaměstnavatele je proto v praxi důležité mít zdokumentované:
        </p>
        <ul className="mt-3 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Písemnou dohodu se všemi povinnými náležitostmi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Rozvrh pracovní doby (zejména u DPP)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Evidenci odpracovaných hodin</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Doklad o splnění oznamovací povinnosti vůči ČSSZ</span>
          </li>
        </ul>
      </section>

      <section id="co-delat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          7. Co by měl zaměstnavatel obvykle zkontrolovat
        </h2>
        <ol className="space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              1
            </span>
            <span>
              <strong className="text-slate-300">Šablony dohod a smluv</strong> — obsahují
              všechny náležitosti vyžadované po flexinovele? (informování o zkušební době, o
              výpovědi, o odborném vzdělávání, o sociálním pojištění)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              2
            </span>
            <span>
              <strong className="text-slate-300">Proces nástupu</strong> — kdy a jak dohodáři
              předáváte písemný rozvrh? Probíhá to před zahájením činnosti?
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              3
            </span>
            <span>
              <strong className="text-slate-300">Oznamovací cesta vůči ČSSZ</strong> — kdo a
              jak elektronicky podává oznámení? Mám doložené odeslání?
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              4
            </span>
            <span>
              <strong className="text-slate-300">Evidence pracovní doby</strong> — máme
              evidenci, ze které lze prokázat dodržení rozvrhu i limitů (300 hod./rok u DPP,
              průměrných 20 hod./týden u DPČ)?
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              5
            </span>
            <span>
              <strong className="text-slate-300">Home office dohody</strong> — máme písemnou
              úpravu se všemi náležitostmi (místo, rozvrh, náklady, ukončení)?
            </span>
          </li>
        </ol>
        <div className="mt-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-emerald-400">✓ Tip:</strong> Pokud nasazujete novou šablonu
          dohody nebo pracovní smlouvy, je vhodné šablonu jednou ročně revidovat — zákoník
          práce a navazující předpisy se v posledních letech vyvíjejí rychle a změny mívají
          dopad i na běžné krátké dohody.
        </div>
      </section>
    </ArticlePageLayout>
  );
}
