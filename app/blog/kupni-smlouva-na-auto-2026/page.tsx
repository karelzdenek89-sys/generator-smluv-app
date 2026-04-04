import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto 2026: Co musí obsahovat a jak se chránit',
  description:
    'Průvodce kupní smlouvou na auto pro rok 2026. Co musí smlouva obsahovat, jak ověřit vozidlo, nejčastější chyby prodejců i kupujících a proč nestačí rukou psaná dohoda.',
  keywords: [
    'kupní smlouva na auto 2026',
    'co musí obsahovat kupní smlouva na auto',
    'kupní smlouva vozidlo vzor',
    'kupní smlouva auto ojetý vůz',
    'jak prodat auto smlouva',
    'kupní smlouva auto vin',
    'kupní smlouva auto náležitosti',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/blog/kupni-smlouva-na-auto-2026' },
  openGraph: {
    title: 'Kupní smlouva na auto 2026: Co musí obsahovat a jak se chránit',
    description:
      'Zákonné náležitosti kupní smlouvy na auto, jak ověřit vozidlo před koupí a nejčastější chyby při prodeji ojetého vozu.',
    url: 'https://smlouvahned.cz/blog/kupni-smlouva-na-auto-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Kupní smlouva na auto 2026: Co musí obsahovat a jak se chránit',
  description: 'Průvodce kupní smlouvou na auto pro rok 2026. Co musí smlouva obsahovat, jak ověřit vozidlo, nejčastější chyby prodejců i kupujících a proč nestačí rukou psaná dohoda.',
  url: 'https://smlouvahned.cz/blog/kupni-smlouva-na-auto-2026',
  datePublished: '2026-03-15',
  dateModified: '2026-03-15',
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
    { '@type': 'ListItem', position: 3, name: 'Kupní smlouva na auto 2026: Co musí obsahovat a jak se chránit', item: 'https://smlouvahned.cz/blog/kupni-smlouva-na-auto-2026' },
  ],
};

export default function KupniSmlouvaAutoPage() {
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
        <span className="text-slate-400">Kupní smlouva na auto 2026</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">Vozidla</span>
          <span className="text-xs text-slate-600">9 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-03-15">15. března 2026</time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Kupní smlouva na auto 2026: Co musí obsahovat a jak se chránit
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Prodáváte nebo kupujete ojetý vůz? Správně sepsaná kupní smlouva na auto vás ochrání před
          spory o stav vozidla, skryté vady i manipulovaný tachometr. Zjistěte, co nesmí chybět.
        </p>

        {/* Inline CTA */}
        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="mb-3 text-sm font-bold text-white">Chcete přeskočit teorii?</p>
          <p className="mb-4 text-sm text-slate-400">Vytvořte si kupní smlouvu na auto online — formulář pokryje VIN, STK, emise i předání. Hotovo za 5 minut.</p>
          <Link
            href="/auto"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
          >
            Vytvořit kupní smlouvu na auto →
          </Link>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li><a href="#proc-pisemna-smlouva" className="hover:text-amber-400 transition">1. Proč nestačí jen ústní dohoda nebo rukou psaný lístek</a></li>
          <li><a href="#co-musi-obsahovat" className="hover:text-amber-400 transition">2. Co musí kupní smlouva na auto obsahovat</a></li>
          <li><a href="#vin-stkemise" className="hover:text-amber-400 transition">3. VIN, STK a emise — proč jsou klíčové</a></li>
          <li><a href="#jak-overit-vozidlo" className="hover:text-amber-400 transition">4. Jak ověřit vozidlo před podpisem smlouvy</a></li>
          <li><a href="#nejcastejsi-chyby" className="hover:text-amber-400 transition">5. Nejčastější chyby při prodeji ojetého vozu</a></li>
          <li><a href="#predani-a-registrace" className="hover:text-amber-400 transition">6. Předání vozidla a přepis na úřadu</a></li>
          <li><a href="#zaver" className="hover:text-amber-400 transition">7. Shrnutí a doporučení</a></li>
        </ol>
      </nav>

      {/* ── SECTION 1 ───────────────────────────── */}
      <section id="proc-pisemna-smlouva" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Proč nestačí jen ústní dohoda nebo rukou psaný lístek</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Prodej automobilu upravuje <strong className="text-slate-300">§ 2079 a násl. zákona č. 89/2012 Sb. (občanský zákoník)</strong>.
          Zákon písemnou formu kupní smlouvy výslovně nevyžaduje — ale v případě sporu je písemná smlouva
          <strong className="text-slate-300"> jediným přesvědčivým důkazem</strong> o tom, na čem jste se dohodli.
        </p>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Prodej ojetého vozu je jednou z nejčastějších příčin soukromoprávních sporů v ČR. Nejčastěji jde o:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Spory o stav vozu — kupující tvrdí, že vůz nebyl v deklarovaném stavu</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Manipulovaný tachometr — bez smlouvy nelze dokázat, jaký stav km byl při prodeji</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Skryté vady — motor, převodovka, karoserie — o nichž prodávající věděl, ale nesdělil je</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Spory o kupní cenu nebo způsob platby</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Praktická poznámka:</strong> Rukou psaná smlouva sepsaná na parkovišti
          je sice lepší než nic — ale zpravidla postrádá klíčové náležitosti (VIN, přesný popis stavu,
          prohlášení o vadách), bez nichž může být obtížně vymahatelná.
        </div>
      </section>

      {/* ── SECTION 2 ───────────────────────────── */}
      <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí kupní smlouva na auto obsahovat</h2>
        <p className="mb-6 text-slate-400 leading-relaxed">
          Dobře sestavená kupní smlouva na vozidlo musí zachytit všechny okolnosti, které mohou být
          předmětem sporu. Pokud se prodávající a kupující neshodnou na podmínkách,
          rozhodne text smlouvy — <strong className="text-slate-300">nebo její absence</strong>.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Povinné a zásadní náležitosti</h3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Identifikace stran', d: 'Celé jméno, adresa, datum narození nebo rodné číslo prodávajícího i kupujícího. U firem IČO a sídlo.' },
            { t: 'Přesná identifikace vozidla', d: 'Značka, model, rok výroby, VIN (17místný kód), SPZ, barva, typ karoserie, objem a výkon motoru.' },
            { t: 'Stav tachometru', d: 'Konkrétní počet kilometrů ke dni podpisu smlouvy. Základ pro případ sporu o manipulaci.' },
            { t: 'Kupní cena a způsob platby', d: 'Přesná částka v Kč nebo EUR, způsob úhrady (hotovost, bankovní převod), datum splatnosti.' },
            { t: 'Prohlášení o stavu vozidla', d: 'Popis technického stavu, kosmetických vad, stav STK a emisní kontroly, případné nehody v historii.' },
            { t: 'Datum a místo předání', d: 'Kdy a kde proběhne fyzické předání vozidla a klíčů, technického průkazu a dokladů.' },
          ].map(i => (
            <div key={i.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-3 text-lg font-black text-white">Doporučená ujednání, která smlouvu posilují</h3>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Prohlášení o vadách a zástavním právu</strong> — prodávající výslovně prohlásí,
              že vozidlo není zastaveno, není předmětem leasingu a že sdělil všechny mu známé vady.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Smluvní pokuta za nepravdivé prohlášení</strong> — motivuje prodávajícího k pravdivosti
              a dává kupujícímu nárok v případě, že zamlčí vadu.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Stav dokladů a příslušenství</strong> — kolik klíčů je předáváno, zda je servisní knížka,
              zimní pneumatiky, nabíječka (u elektromobilů), dálniční známka.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">✓</span>
            <div>
              <strong className="text-slate-300">Odpovědnost za vady</strong> — prodej "jak stojí a leží" (as is) u ojetých vozů
              je legitimitní, ale musí být výslovně sjednán a nesmí zakrývat úmyslně zamlčené vady.
            </div>
          </li>
        </ul>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
          <p className="mb-3 text-sm text-slate-300">
            Kupní smlouva na auto od SmlouvaHned pokrývá VIN, STK, stav tachometru, prohlášení o vadách i zástavní právo — vše ve strukturovaném formuláři.
          </p>
          <Link href="/auto" className="text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300 transition">
            Vytvořit kupní smlouvu na auto online →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3 ───────────────────────────── */}
      <section id="vin-stkemise" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. VIN, STK a emise — proč jsou klíčové</h2>

        <h3 className="mb-3 text-lg font-black text-white">VIN — jednoznačná identifikace vozidla</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          VIN (Vehicle Identification Number) je 17místný alfanumerický kód, který jednoznačně identifikuje
          každé vozidlo na světě. Najdete ho na štítku pod čelním sklem, v technickém průkazu a
          vyraženém na karoserii (zpravidla v oblasti prahu dveří nebo podlahy).
        </p>
        <p className="mb-5 text-slate-400 leading-relaxed">
          VIN je v smlouvě klíčový z několika důvodů: umožňuje ověřit historii vozu ve veřejných
          databázích (CarVertical, Cebia), odhalit přepsaná čísla nebo kradená vozidla a jednoznačně
          prokázat, o kterém vozu smlouva hovoří.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">STK a emisní kontrola</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Stav STK (Státní technické kontroly) a emisní kontroly má přímý dopad na použitelnost vozidla
          po koupi. Pokud STK brzy vyprší, kupující musí okamžitě investovat do kontroly.
          Ve smlouvě uvádějte:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Datum platnosti STK (s razítkem a příslušnou přilepenou nálepkou)</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Datum poslední emisní kontroly (pro vozy podléhající emisní kontrole)</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Případné závady zjištěné při poslední STK (i tzv. "doporučení")</li>
        </ul>

        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">📌 Pozor:</strong> Pokud prodávající uvede platnou STK, ale v době prodeje
          je STK ve skutečnosti propadlá nebo vozidlo STK neprošlo, jde o podstatnou vadu věci.
          Kupující má právo na slevu z kupní ceny nebo odstoupení od smlouvy.
        </div>
      </section>

      {/* ── SECTION 4 ───────────────────────────── */}
      <section id="jak-overit-vozidlo" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak ověřit vozidlo před podpisem smlouvy</h2>
        <p className="mb-5 text-slate-400 leading-relaxed">
          Před podpisem kupní smlouvy doporučujeme projít následující checklist. Každý bod, který
          vynecháte, může být zdrojem pozdějšího sporu nebo finanční ztráty.
        </p>

        <div className="space-y-4">
          {[
            {
              icon: '🔍',
              title: 'Prověřte historii VINem',
              body: 'Zadejte VIN do databází jako Cebia, CarVertical nebo bezplatně do Carjetu. Zjistíte historii servisů, záznamy o nehodách, počty kilometrů v různých zemích a případná zástavní práva.',
            },
            {
              icon: '🏦',
              title: 'Ověřte zástavní právo',
              body: 'Vozidlo může být předmětem leasingu nebo zajišťovacího převodu vlastnictví — formálně je pak stále v majetku leasingové společnosti, i když je ve fyzické držbě prodávajícího. Tuto informaci lze ověřit v CEZ (Centrální evidence závazků) nebo přes Cebia.',
            },
            {
              icon: '🔧',
              title: 'Nechte prohlédnout mechanikem',
              body: 'Nezávislá technická prohlídka u důvěryhodného servisu stojí zpravidla 1 000–2 500 Kč a může odhalit závady v hodnotě desetitisíců. Rozumný prodávající prohlídku neodmítne.',
            },
            {
              icon: '📋',
              title: 'Zkontrolujte servisní historii',
              body: 'Servisní knížka (fyzická nebo elektronická) dokládá pravidelnou údržbu a opravy. Chybějící záznamy nebo velké časové mezery jsou varovným signálem.',
            },
            {
              icon: '🆔',
              title: 'Ověřte totožnost prodávajícího',
              body: 'Prodávající musí být buď vlastník vozu (dle TP), nebo musí mít plnou moc vlastníka. Požadujte platný občanský průkaz nebo pas a porovnejte jméno s technickým průkazem.',
            },
          ].map(c => (
            <div key={c.title} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <h3 className="font-black text-white">{c.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5 ───────────────────────────── */}
      <section id="nejcastejsi-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby při prodeji ojetého vozu</h2>

        <div className="space-y-5">
          {[
            {
              n: '1',
              title: 'Chybí popis závad a stavu vozidla',
              body: 'Nejčastější příčina sporů. Pokud smlouva neobsahuje prohlášení o stavu, kupující může po prodeji tvrdit, že vada existovala již při koupi. Uveďte konkrétně: škrábanec na zadním nárazníku, opravená nehoda vpravo, opotřebená přední sada brzd.',
            },
            {
              n: '2',
              title: 'Není uveden stav tachometru',
              body: 'Tachometr patří do smlouvy povinně. Bez tohoto údaje nelze prokázat, jaký stav km byl při prodeji — a kupující nemá nárok při odhalení přetočeného tachometru. Přetočení tachometru je přitom trestný čin.',
            },
            {
              n: '3',
              title: 'Prodej vozu zatíženého leasingem',
              body: 'Prodávající, který prodá vozidlo ve vlastnictví leasingové společnosti bez jejího souhlasu, se dopouští trestného činu podvodu. Kupující pak může přijít o vozidlo i o peníze. Vždy vyžadujte prohlášení, že vozidlo není předmětem leasingu nebo zástavy.',
            },
            {
              n: '4',
              title: 'Nepísemná dohoda o ceně',
              body: 'Prodej "za jinou cenu" pro daňové účely (například fakturovaných jen 50 000 Kč místo skutečných 200 000 Kč) je daňovým únikem s právními důsledky pro obě strany. Vždy uvádějte skutečnou kupní cenu.',
            },
            {
              n: '5',
              title: 'Chybí přepis na úřadě',
              body: 'Bez přepisu vozidla v registru zůstáváte v systému stále vlastníkem — odpovídáte za přestupky, pojistné události i dálniční poplatky. Přepis zajistěte nejpozději do 10 pracovních dnů od převzetí vozidla.',
            },
          ].map(c => (
            <div key={c.n} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-black text-red-400 border border-red-500/20">
                  {c.n}
                </span>
                <h3 className="font-black text-white">{c.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MID-ARTICLE CTA ─────────────────────── */}
      <ArticleInlineCta
        title="Prodáváte nebo kupujete auto? Smlouva připravena za 5 minut."
        body="Formulář pokryje VIN, stav tachometru, STK, emise, prohlášení o vadách i zástavní právo. Nemusíte nic vymýšlet — stačí vyplnit údaje."
        buttonLabel="Vytvořit kupní smlouvu na auto"
        href="/auto"
      />

      {/* ── SECTION 6 ───────────────────────────── */}
      <section id="predani-a-registrace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">6. Předání vozidla a přepis na úřadu</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Samotné podepsání smlouvy nestačí — klíčové jsou také praktické kroky po podpisu.
        </p>

        <h3 className="mb-3 text-lg font-black text-white">Co si předat při fyzickém předání vozu</h3>
        <ul className="mb-6 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Klíče (všechny sady) a případně kód imobilizéru nebo radiopřijímače</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Velký a malý technický průkaz</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Servisní knížka (pokud existuje)</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Veškeré příslušenství zmíněné ve smlouvě</li>
        </ul>

        <h3 className="mb-3 text-lg font-black text-white">Přepis na úřadě</h3>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Přepis vozidla na nového majitele se provádí na příslušném obecním úřadě s rozšířenou působností.
          Nový vlastník musí přepis provést <strong className="text-slate-300">do 10 pracovních dnů</strong> od převzetí vozidla.
          K přepisu je nutná:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Kupní smlouva (nebo jiný nabývací titul)</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Technický průkaz vozidla</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Doklad totožnosti nového vlastníka</li>
          <li className="flex items-start gap-2"><span className="mt-1 text-amber-500 flex-shrink-0">•</span>Platné pojistné vozidla (povinné ručení musí být uzavřeno před jízdou)</li>
        </ul>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-emerald-400">✓ Dobré vědět:</strong> Kupní smlouva na auto ze SmlouvaHned je plně přijatelná
          jako nabývací doklad pro přepis na úřadu — odpovídá zákonným požadavkům na identifikaci stran,
          vozidla i převodu vlastnictví.
        </div>
      </section>

      {/* ── SECTION 7: ZÁVĚR ────────────────────── */}
      <section id="zaver" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">7. Shrnutí a doporučení</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          Kupní smlouva na auto je při prodeji ojetého vozidla naprosto zásadní. Chrání obě strany —
          prodávajícího před neoprávněnými reklamacemi, kupujícího před skrytými vadami.
        </p>
        <div className="mb-6 space-y-2">
          {[
            'Vždy uzavírejte písemnou smlouvu — i při prodeji přátelům nebo rodině',
            'Uveďte VIN, přesný stav tachometru, stav STK a emisí',
            'Popište konkrétní vady a stav vozidla — neurčité formulace vás nechrání',
            'Ověřte zástavní právo nebo leasing na vozidle před podpisem',
            'Prověřte historii vozidla přes VIN databáze (Cebia, CarVertical)',
            'Zajistěte přepis na úřadě do 10 pracovních dnů od převzetí',
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
        generatorSuitable="Standardní soukromý prodej osobního automobilu, motocyklu nebo jiného vozidla mezi fyzickými osobami. Generátor pokryje VIN, STK, stav tachometru, prohlášení o vadách i podmínky předání."
        lawyerSuitable="Prodej vozidla zatíženého zástavním právem, spory o stav nebo cenu vozidla, fleetový nebo komerční prodej, nebo situace kde existuje riziko podvodu (podezřelá historie, nejasný vlastník)."
      />

      {/* ── FINAL CTA ───────────────────────────── */}
      <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Připraveni?</div>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Vytvořte kupní smlouvu na auto online</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
          Formulář pokryje VIN, STK, stav tachometru i prohlášení o vadách.
          Hotovo za méně než 5 minut, PDF ke stažení ihned po zaplacení.
        </p>
        <Link
          href="/auto"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
        >
          Vytvořit kupní smlouvu na auto →
        </Link>
        <div className="mt-3 text-xs text-slate-600">Od 249 Kč · Dle § 2079 OZ · Platné pro 2026</div>
      </div>

      {/* ── RELATED ARTICLES ────────────────────── */}
      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">Mohlo by vás zajímat</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/auto', label: '🚗 Kupní smlouva na auto — formulář' },
            { href: '/blog/kupni-smlouva-movita-vec', label: '📦 Kupní smlouva — movitá věc' },
            { href: '/blog/darovaci-smlouva-2026', label: '🎁 Darovací smlouva — průvodce' },
            { href: '/blog/smlouva-o-zapujcce-2026', label: '💰 Smlouva o zápůjčce — průvodce' },
            { href: '/', label: '📑 Všechny smlouvy' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

    </article>
  );
}
