'use client';

import { useState, useSyncExternalStore } from 'react';

const subscribeNoop = () => () => {};
const useHydrated = () => useSyncExternalStore(subscribeNoop, () => true, () => false);
import { ArrowRight, Check, FileText, Bell } from 'lucide-react';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import styles from './homepage.module.css';

const STAGES = [
  { label: 'Dohoda', title: 'Nejdřív dobrá smlouva.', description: 'Rozsah práce, cena a termín. Podmínky, ke kterým se můžete vrátit.', document: 'Smlouva o dílo', detail: 'Rozsah · cena · termín · předání', task: 'Připravit podklady k zakázce', next: 'Po zaplacení můžete zdarma založit Moje zakázka.' },
  { label: 'Průběh', title: 'Změny mají své místo.', description: 'Vícepráce nebo jiný termín? Zachyťte změnu samostatným dokumentem.', document: 'Změnový list', detail: 'Co se mění · nová cena · termín', task: 'Potvrdit změnu s druhou stranou', next: 'Zapněte si e-mailové připomínky před termínem.' },
  { label: 'Předání', title: 'Na předání nezapomenout.', description: 'Sepište, co se předalo, a případné vady. Vše zůstane u vaší zakázky.', document: 'Předávací protokol', detail: 'Stav díla · výhrady · podpisy', task: 'Projít checklist předání', next: 'Navazující dokumenty 99 Kč; v Zakázka Plus zahrnuté.' },
] as const;

export default function CaseJourneyPreview({ documentPrice, includesDocuments }: { documentPrice: string; includesDocuments: boolean }) {
  const [selected, setSelected] = useState(0);
  const hydrated = useHydrated();
  const stage = STAGES[selected];
  return (
    <div className={`${styles.glass} ${styles.journey}`} aria-label="Interaktivní ukázka služby Moje zakázka">
      <div className={styles.previewLabel}><span className={styles.liveDot} /> MOJE ZAKÁZKA <span>Ukázka služby</span></div>
      <div className={styles.journeyChoices} role="group" aria-label="Fáze ukázkové zakázky">
        {STAGES.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={selected === index} disabled={!hydrated} onClick={() => setSelected(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>{item.label}
          </button>
        ))}
      </div>
      <div className={styles.journeyBody} aria-live="polite" aria-atomic="true">
        <div key={stage.label} className={styles.journeyReveal}>
          <p className={styles.journeyTitle}>{stage.title}</p>
          <p className={styles.journeyDescription}>{stage.description}</p>
          <div className={styles.documentPaper}>
            <div className={styles.documentTop}><FileText size={22} strokeWidth={1.4} /><span>VÁŠ DOKUMENT</span><span>PDF</span></div>
            <p className={styles.documentName}>{stage.document}</p>
            <p className={styles.documentDetail}>{stage.detail}</p>
            <div className={styles.paperLines} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.paperSignature} aria-hidden="true"><span>Objednatel</span><span>Zhotovitel</span></div>
          </div>
          <div className={styles.previewTask}><Check size={16} /><span>{stage.task}</span></div>
          <div className={styles.previewTask}><Bell size={16} /><span>Termín a připomínky na jednom místě</span></div>
        </div>
      </div>
      <div className={styles.journeyFooter}>
        <p>{selected === 2 ? `Navazující dokumenty ${documentPrice}${includesDocuments ? '; v Zakázka Plus zahrnuté.' : ' za dokument.'}` : stage.next}</p>
        <TrackedLink href="/zakazka" eventName="situation_started" eventParams={{ surface: 'homepage_journey', portal_situation: 'zakazka', cta_type: 'learn_more' }}>
          Prohlédnout Moje zakázka <ArrowRight size={16} />
        </TrackedLink>
      </div>
    </div>
  );
}
