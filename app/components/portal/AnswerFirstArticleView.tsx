import Link from 'next/link';
import TrackView from '@/app/components/analytics/TrackView';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import PortalShell, {
  EscalationNotice,
  LinkList,
  OfficialSourceList,
  PortalCard,
  PortalDisclaimer,
  type PortalCrumb,
} from './PortalShell';
import { CONTENT_AUTHOR } from '@/lib/author';
import { articleHref, type AnswerFirstArticle } from '@/lib/portal/articles';
import { articleSchema, faqPageSchema, jsonLdScript } from '@/lib/schemas';

const SECTION_CRUMBS: Record<AnswerFirstArticle['section'], PortalCrumb> = {
  zakazka: { label: 'Řeším zakázku', href: '/zakazka' },
  zamestnavam: { label: 'Zaměstnávám', href: '/zamestnavam' },
  'pro-pronajimatele': { label: 'Pro pronajímatele', href: '/pro-pronajimatele' },
  'prodej-vozidla': { label: 'Prodej vozidla', href: '/prodej-vozidla' },
};

/**
 * Answer-first stránka: otázka → stručná odpověď → co udělat → na co si dát
 * pozor → oficiální zdroje → dokument / nástroj. Server komponenta, důležitý
 * obsah je v HTML (bez klientského renderu).
 */
export default function AnswerFirstArticleView({ article }: { article: AnswerFirstArticle }) {
  const href = articleHref(article);
  const crumbs: PortalCrumb[] = [
    { label: 'SmlouvaHned', href: '/' },
    SECTION_CRUMBS[article.section],
    { label: article.title, href },
  ];
  const schema = articleSchema({
    title: article.title,
    description: article.answer,
    url: href,
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    authorName: CONTENT_AUTHOR.name,
    authorJobTitle: CONTENT_AUTHOR.jobTitle,
    authorUrl: CONTENT_AUTHOR.url,
  });
  const primaryDocument = article.documents[0];

  return (
    <PortalShell
      crumbs={crumbs}
      kicker={article.question}
      title={article.title}
      updatedAt={article.updatedAt}
      verifiedAt={article.verifiedAt}
      width="narrow"
    >
      <TrackView eventName="situation_viewed" eventParams={{ portal_situation: article.situation, surface: 'answer_article', source: href }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }} />
      {article.faq?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(article.faq.map((item) => ({ question: item.q, answer: item.a })))) }}
        />
      ) : null}

      <article className="space-y-10">
        <section aria-labelledby="answer-title">
          <PortalCard highlighted>
            <h2 id="answer-title" className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Stručná odpověď</h2>
            <p className="text-lg leading-8 text-white">{article.answer}</p>
          </PortalCard>
          <div className="mt-5 space-y-3">
            {article.context.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-400">{paragraph}</p>
            ))}
          </div>
        </section>

        {primaryDocument ? (
          <div className="flex flex-wrap items-center gap-3">
            <TrackedLink
              href={primaryDocument.href}
              eventName="situation_started"
              eventParams={{ portal_situation: article.situation, surface: 'answer_article', cta_type: 'primary_document' }}
              className="site-button-primary"
            >
              {primaryDocument.label} →
            </TrackedLink>
            {article.tools[0] ? (
              <Link href={article.tools[0].href} className="site-button-secondary">{article.tools[0].label}</Link>
            ) : null}
          </div>
        ) : null}

        <section aria-labelledby="steps-title">
          <h2 id="steps-title" className="font-serif italic text-2xl font-bold text-white">Co máte udělat</h2>
          <ol className="mt-5 space-y-4">
            {article.steps.map((step, index) => (
              <li key={step.title} className="site-content-card flex gap-4 rounded-2xl p-5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#c9a852]/30 text-sm font-bold text-[#c9a852]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="risks-title">
          <h2 id="risks-title" className="font-serif italic text-2xl font-bold text-white">Na co si dát pozor</h2>
          <ul className="mt-5 space-y-3">
            {article.risks.map((risk) => (
              <li key={risk.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <h3 className="font-semibold text-white">{risk.title}</h3>
                <p className="mt-1 text-sm leading-7 text-slate-400">{risk.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {article.escalation ? <EscalationNotice text={article.escalation} /> : null}

        {article.faq?.length ? (
          <section aria-labelledby="faq-title">
            <h2 id="faq-title" className="font-serif italic text-2xl font-bold text-white">Časté otázky</h2>
            <dl className="mt-5 space-y-4">
              {article.faq.map((item) => (
                <div key={item.q} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
                  <dt className="font-semibold text-white">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-7 text-slate-400">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <OfficialSourceList sources={article.sources} />

        <section aria-labelledby="next-title" className="rounded-2xl border border-[#c9a852]/25 bg-[#0c1426] p-6">
          <h2 id="next-title" className="font-serif italic text-2xl font-bold text-white">Vytvořit dokument nebo pokračovat</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <LinkList eyebrow="Dokumenty" items={article.documents} />
            <LinkList eyebrow="Nástroje zdarma" items={article.tools} />
          </div>
          <div className="mt-6">
            <LinkList eyebrow="Související" items={article.related} />
          </div>
        </section>

        <div className="text-xs text-slate-500">
          Autor: <span className="text-slate-400">{CONTENT_AUTHOR.name}</span> · {CONTENT_AUTHOR.jobTitle}
        </div>
        <PortalDisclaimer />
      </article>
    </PortalShell>
  );
}
