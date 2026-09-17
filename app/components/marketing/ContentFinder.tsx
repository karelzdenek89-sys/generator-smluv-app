'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import styles from './homepage.module.css';

export type FinderItem = { title: string; href: string; kind: 'Návod' | 'Nástroj zdarma' | 'Dokument'; keywords: string };
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
// Do hydratace je pole jen ke \u010dten\u00ed: psan\u00ed p\u0159ed p\u0159ipojen\u00edm Reactu by se ztratilo.
const subscribeNoop = () => () => {};
const useHydrated = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

export default function ContentFinder({ items }: { items: FinderItem[] }) {
  const [query, setQuery] = useState('');
  const id = useId();
  const hydrated = useHydrated();
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const results = words.length ? items.filter(item => words.every(word => normalize(`${item.title} ${item.keywords}`).includes(word))).slice(0, 6) : [];
  return (
    <div className={styles.finder}>
      <label htmlFor={id}>Hledáte něco konkrétního?</label>
      <div className={`${styles.glass} ${styles.finderInput}`}>
        <Search size={19} aria-hidden="true" />
        <input id={id} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Např. vícepráce, nájem, prodej auta…" autoComplete="off" disabled={!hydrated} data-hydrated={hydrated ? "true" : "false"} aria-describedby={`${id}-hint`} aria-controls={words.length ? `${id}-results` : undefined} />
        {query ? <button type="button" onClick={() => setQuery('')} aria-label="Vymazat hledání"><X size={18} /></button> : <span className={styles.finderHint}>Návody · nástroje · dokumenty</span>}
      </div>
      <p id={`${id}-hint`} className={styles.searchPrivacy}>Hledáte pouze v obsahu webu. Text hledání nikam neodesíláme.</p>
      <div role="status" className="sr-only">{words.length ? (results.length ? `Nalezeno ${results.length} výsledků.` : 'Žádný výsledek. Zkuste obecnější výraz.') : ''}</div>
      {words.length ? (
        <div id={`${id}-results`} className={`${styles.glass} ${styles.finderResults}`}>
          {results.length ? results.map(item => (
            <TrackedLink key={item.href} href={item.href} eventName="situation_started" eventParams={{ surface: 'homepage_search', cta_type: 'search_result' }}>
              <span><small>{item.kind}</small>{item.title}</span><ArrowUpRight size={19} aria-hidden="true" />
            </TrackedLink>
          )) : <p>Nenašli jsme přesnou shodu. Zkuste kratší výraz nebo si vyberte situaci níže.</p>}
        </div>
      ) : null}
    </div>
  );
}
