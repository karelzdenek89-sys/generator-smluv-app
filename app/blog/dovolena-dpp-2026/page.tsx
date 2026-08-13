import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import OfficialSources from '@/app/components/blog/OfficialSources';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { canonicalUrl } from '@/lib/seo/site';

const SLUG = 'dovolena-dpp-2026';

export const metadata = {
  ...blogArticlePageMetadata(SLUG, {
    keywords: ['dovolená DPP 2026', 'nárok na dovolenou DPP', '80 hodin DPP', 'výpočet dovolené DPP'],
  }),
  alternates: {
    canonical: canonicalUrl(`/blog/${SLUG}`),
    languages: getBlogHreflangAlternates(SLUG),
  },
};

export default function DovolenaDppPage() {
  return (
    <ArticlePageLayout
      category="Práce a zaměstnání"
      readTime="8 min"
      dateTime="2026-08-13"
      dateLabel="13. srpna 2026"
      breadcrumbLabel="Dovolená u DPP 2026"
      slug={SLUG}
      title="Dovolená u DPP 2026: nárok, 80 hodin a výpočet"
      intro="Také práce na dohodu o provedení práce může založit právo na placenou dovolenou. V roce 2026 rozhodují dvě současně splněné podmínky: nepřetržité trvání dohody alespoň 28 kalendářních dní a nejméně 80 hodin započtených pro účely dovolené. Přehled vychází z aktuálních informací MPSV a zákoníku práce; neřeší individuální mzdový nebo pojistný případ."
      toc={[
        { href: '#podminky', label: 'Podmínky 28 dní a 80 hodin' },
        { href: '#vypocet', label: 'Jak se dovolená počítá' },
        { href: '#cerpani', label: 'Čerpání a proplacení' },
        { href: '#evidence', label: 'Co má hlídat zaměstnavatel' },
      ]}
      primaryAction={{
        title: 'Potřebujete připravit DPP?',
        body: 'V základním českém režimu vytvoříte DPP zdarma. Ve formuláři nastavíte práci, dobu, rozsah hodin i odměnu.',
        buttonLabel: 'Vytvořit DPP zdarma',
        href: '/dpp',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní DPP s jasně popsanou prací, předpokládaným rozsahem, dobou trvání a odměnou, u níž zaměstnavatel samostatně vede evidenci pracovní doby a dovolené.',
        lawyerSuitable:
          'Spor o zůstatek dovolené, navazující dohody s nejasnou nepřetržitostí, odvetné ukončení vztahu nebo širší spor o odměnu, odvody či evidenci.',
      }}
      finalAction={{
        title: 'Sepište základ DPP konzistentně',
        body: 'Začněte písemnou dohodou s konkrétní prací, dobou trvání, rozsahem a odměnou; dovolenou a pracovní dobu pak průběžně evidujte.',
        buttonLabel: 'Otevřít formulář DPP',
        href: '/dpp',
      }}
      relatedLinks={[
        { href: '/dpp', label: 'DPP online zdarma' },
        { href: '/blog/dpp-dohoda-provedeni-prace', label: 'DPP 2026: pravidla a limity' },
        { href: '/blog/dpp-dpc-porovnani-2026', label: 'DPP nebo DPČ' },
        { href: '/blog/minimalni-mzda-dpp-pracovni-smlouva-2026', label: 'Minimální mzda a DPP' },
      ]}
    >
      <section id="podminky" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Nárok vzniká až po splnění obou podmínek
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zákoník práce používá pro dovolenou u DPP a DPČ fiktivní týdenní pracovní dobu 20 hodin.
          Nárok za daný kalendářní rok vznikne, pokud pracovněprávní vztah v tomto roce nepřetržitě
          trvá alespoň 28 kalendářních dní a zaměstnanec za jeho trvání odpracuje pro účely dovolené
          alespoň čtyřnásobek této týdenní doby, tedy 80 hodin.
        </p>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5 text-sm leading-7 text-slate-400">
          <ul className="space-y-2">
            <li>• 82 hodin během dohody trvající jen 25 dní nestačí — chybí podmínka trvání.</li>
            <li>• Tříměsíční dohoda se 70 započtenými hodinami nestačí — chybí hodinová podmínka.</li>
            <li>• Při splnění 28 dní i 80 hodin vzniká poměrná část dovolené automaticky ze zákona.</li>
          </ul>
        </div>
        <p className="mt-4 leading-relaxed text-slate-400">
          Do započtené doby mohou vstoupit i některé náhradní doby, například již čerpaná dovolená
          nebo vybrané překážky v práci. Proto nemusí být konečný údaj vždy totožný jen se součtem
          fyzicky odpracovaných směn.
        </p>
      </section>

      <section id="vypocet" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Jak se dovolená u DPP počítá
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          MPSV uvádí vzorec: počet celých násobků fiktivní 20hodinové týdenní pracovní doby dělený
          52, násobený 20 hodinami a výměrou dovolené v týdnech. Výsledek se zaokrouhluje na celé
          hodiny nahoru.
        </p>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-7 text-slate-300">
          <div className="font-bold text-amber-400">Příklad MPSV</div>
          <p className="mt-2">
            Z 215 započtených hodin vznikne 10 celých dvacetihodinových násobků. Při čtyřtýdenní
            výměře je výpočet 10 ÷ 52 × 20 × 4 = 15,38 hodiny, tedy po zaokrouhlení 16 hodin dovolené.
          </p>
        </div>
        <p className="mt-4 leading-relaxed text-slate-400">
          Samotné dosažení 80 hodin tedy neznamená automaticky „čtyři týdny volna“. Jde o vstupní
          podmínku; konkrétní počet hodin dovolené je poměrný podle započtené doby a výměry dovolené
          u zaměstnavatele.
        </p>
      </section>

      <ArticleInlineCta
        title="Začněte správně sepsanou DPP"
        body="Základní českou DPP vytvoříte zdarma; evidenci směn, dovolené a zákonné povinnosti zaměstnavatele je potřeba vést průběžně mimo samotný dokument."
        buttonLabel="Přejít do formuláře DPP"
        href="/dpp"
        variant="subtle"
        articleSlug={SLUG}
      />

      <section id="cerpani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Čerpání dovolené a proplacení při skončení dohody
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Dobu čerpání zásadně určuje zaměstnavatel podle pravidel zákoníku práce. U dlouhodobě
          trvající dohody by neměl automaticky počítat s tím, že se veškerá dovolená vyřeší až
          proplacením na konci. Zákon směřuje především k tomu, aby zaměstnanec dovolenou skutečně
          vyčerpal.
        </p>
        <p className="leading-relaxed text-slate-400">
          U krátké dohody, která skončí s nevyčerpanou dovolenou, může být zbývající nárok při
          skončení pracovněprávního vztahu nahrazen penězi. Konkrétní postup závisí na průběhu dohody
          a mzdových podkladech; při sporu je vhodná kontrola mzdovou účetní nebo advokátem.
        </p>
      </section>

      <section id="evidence" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Co má hlídat zaměstnavatel
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'DPP musí být písemná a jedno vyhotovení dostává zaměstnanec.',
            'Zaměstnanec musí dostat zákonné informace o dovolené a způsobu určování její délky, pokud už nejsou v dohodě.',
            'Evidence pracovní doby musí umožnit ověřit 80hodinovou podmínku i následný výpočet.',
            'Dovolená a některé náhradní doby se nezapočítávají do limitu 300 hodin skutečné práce na DPP u jednoho zaměstnavatele za rok.',
            'Podmínky dovolené se nesmí zaměnit s měsíčními hranicemi pro pojistné nebo zdanění.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <OfficialSources
        sources={[
          { label: 'MPSV: Dohoda o provedení práce', href: 'https://mpsv.gov.cz/slovnik-pojmu-dohoda-o-provedeni-prace' },
          { label: 'MPSV: Novinky v pracovním právu — dovolená u DPP a příklady', href: 'https://mpsv.gov.cz/novinky-v-pracovnim-pravu' },
          { label: 'e-Sbírka: zákon č. 262/2006 Sb., zákoník práce, aktuální znění', href: 'https://e-sbirka.gov.cz/sb/2006/262/2026-01-01' },
        ]}
      />
    </ArticlePageLayout>
  );
}
