import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import { DPP_MAX_HOURS_PER_YEAR } from '@/lib/legal-constants-2026';

export const metadata = blogArticlePageMetadata('smlouva-o-dilo-vs-dpp-2026');

export default function SmlouvaODiloVsDpp2026Page() {
  return (
    <ArticlePageLayout
      category="Práce a podnikání"
      readTime="8 min"
      dateTime="2026-07-01"
      dateLabel="1. července 2026"
      breadcrumbLabel="Smlouva o dílo vs. DPP"
      slug="smlouva-o-dilo-vs-dpp-2026"
      title="Smlouva o dílo nebo DPP 2026: Kdy co použít a jak se vyhnout švarcsystému"
      intro="DPP a smlouva o dílo řeší odlišné situace — dohoda o práci vs. dodání konkrétního výsledku. Špatná volba může vést k doplatkům odvodů, sankcím od inspekce práce nebo sporům o to, zda šlo o závislou práci. Tento průvodce pomůže zvolit správný typ smlouvy."
      toc={[
        { href: '#zakladni-rozdil', label: 'Základní rozdíl mezi DPP a smlouvou o dílo' },
        { href: '#kdy-dpp', label: 'Kdy dává smysl DPP' },
        { href: '#kdy-dilo', label: 'Kdy dává smysl smlouva o dílo' },
        { href: '#svarcsystem', label: 'Riziko švarcsystému' },
        { href: '#rozhodovaci-logika', label: 'Praktická rozhodovací logika' },
      ]}
      primaryAction={{
        title: 'Potřebujete rychle zvolit správný dokument?',
        body: 'Porovnejte DPP a smlouvu o dílo podle typu spolupráce — generátor vás provede náležitostmi pro rok 2026.',
        buttonLabel: 'Vytvořit DPP',
        href: '/dpp',
      }}
      trustBox={{
        generatorSuitable:
          'Krátkodobé brigády (DPP), jednorázové zakázky s konkrétním výstupem (smlouva o dílo), běžná spolupráce OSVČ s malou firmou.',
        lawyerSuitable:
          'Podezření na švarcsystém, řetězení dohod, spory s inspekcí práce, mezinárodní pracovní vztahy nebo složité B2B smlouvy.',
      }}
      finalAction={{
        title: 'Chcete detailní srovnání DPP a DPČ?',
        body: 'Samostatný průvodce rozebírá limity hodin, odvody a praktické rozdíly mezi oběma dohodami.',
        buttonLabel: 'DPP nebo DPČ — srovnání',
        href: '/blog/dpp-dpc-porovnani-2026',
      }}
      relatedLinks={[
        { href: '/dpp', label: 'DPP — formulář' },
        { href: '/smlouva-o-dilo', label: 'Smlouva o dílo' },
        { href: '/blog/svarcsystem-osvc-2026', label: 'Švarcsystém' },
        { href: '/blog/dpp-dpc-porovnani-2026', label: 'DPP vs. DPČ' },
        { href: '/blog/smlouva-o-dilo-freelancer-2026', label: 'Smlouva o dílo pro freelancera' },
      ]}
    >
      <section id="zakladni-rozdil" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Základní rozdíl mezi DPP a smlouvou o dílo
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [
              'DPP (dohoda o provedení práce)',
              'Pracovněprávní vztah — zaměstnanec vykonává práci pro zaměstnavatele. Vztahuje se zákoník práce, limity hodin, minimální mzda, evidence.',
            ],
            [
              'Smlouva o dílo',
              'Občanskoprávní vztah — zhotovitel dodává konkrétní výsledek (dílo). Vztahuje se občanský zákoník, fakturace, autorská práva.',
            ],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{title}</div>
              <p className="text-sm leading-7 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kdy-dpp" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Kdy dává smysl DPP</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            `Krátkodobá práce do ${DPP_MAX_HOURS_PER_YEAR} hodin ročně u jednoho zaměstnavatele.`,
            'Brigáda se sjednanou hodinovou odměnou a konkrétním druhem práce.',
            'Sezónní nebo jednorázová pomoc — úklid, inventura, akce, sklad.',
            'Zaměstnavatel řídí, kdy a jak se práce vykonává.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="kdy-dilo" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Kdy dává smysl smlouva o dílo
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Dodání konkrétního výsledku — web, logo, text, rekonstrukce, software.',
            'OSVČ fakturuje za dílo, ne za odpracované hodiny v pracovním poměru.',
            'Objednatel neřídí denní pracovní dobu zhotovitele, ale akceptuje výsledek.',
            'Spolupráce s externím dodavatelem, ne se zaměstnancem na dohodu.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="svarcsystem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Riziko švarcsystému</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Švarcsystém nastává, když OSVČ fakticky vykonává závislou práci, ale formálně jde o
          smlouvu o dílo nebo o jiný občanskoprávní vztah. Inspekce práce posuzuje znaky
          závislé práce — podřízenost, stanovenou pracovní dobu, použití prostředků
          zaměstnavatele, opakovanost vztahu.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pokud spolupráce vypadá jako zaměstnání, správnou cestou je pracovní smlouva nebo
          DPP/DPČ — ne smlouva o dílo s fakturou.
        </p>
      </section>

      <section id="rozhodovaci-logika" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Praktická rozhodovací logika
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Dodávám konkrétní výsledek? → smlouva o dílo.',
            'Pracuji podle pokynů zaměstnavatele na hodiny? → DPP nebo pracovní smlouva.',
            'Spolupráce trvá dlouhodobě a opakuje se? → spíše pracovní poměr nebo DPČ, ne série DPP.',
            'Nejste si jisti? → konzultace s advokátem nebo inspekce práce.',
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
