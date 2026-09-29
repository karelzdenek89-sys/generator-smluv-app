'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { Pause, Play } from 'lucide-react';
import type { BilingualShowcaseSample, ShowcaseLanguage } from '@/lib/marketing/bilingual-showcase';
import styles from './bilingual-showcase.module.css';

type UiLocale = 'cs' | 'en' | 'ua';

const STEP_MS = 6000;

const UI: Record<UiLocale, {
  docsLabel: string;
  langsLabel: string;
  csHead: string;
  trHead: Record<ShowcaseLanguage, string>;
  langName: Record<ShowcaseLanguage, string>;
  foot: [string, string, string];
  pause: string;
  play: string;
  note: string;
}> = {
  cs: {
    docsLabel: 'Ukázková smlouva',
    langsLabel: 'Jazyk překladu',
    csHead: 'Česky · rozhodující znění',
    trHead: { en: 'English · vysvětlující překlad', ua: 'Українська · vysvětlující překlad' },
    langName: { en: 'English', ua: 'Українська' },
    foot: ['Stejné číslování článků', 'Vaše údaje v obou jazycích', 'Celý text, ne shrnutí'],
    pause: 'Pozastavit ukázku',
    play: 'Spustit ukázku',
    note: 'Výřez ze skutečného výstupu generátoru se vzorovými údaji.',
  },
  en: {
    docsLabel: 'Sample contract',
    langsLabel: 'Translation language',
    csHead: 'Czech · prevailing text',
    trHead: { en: 'English · explanatory translation', ua: 'Ukrainian · explanatory translation' },
    langName: { en: 'English', ua: 'Українська' },
    foot: ['Same article numbering', 'Your details in both languages', 'Full text, not a summary'],
    pause: 'Pause the demo',
    play: 'Play the demo',
    note: 'Excerpt of real generator output with sample details.',
  },
  ua: {
    docsLabel: 'Зразок договору',
    langsLabel: 'Мова перекладу',
    csHead: 'Чеською · основний текст',
    trHead: { en: 'English · пояснювальний переклад', ua: 'Українською · пояснювальний переклад' },
    langName: { en: 'English', ua: 'Українська' },
    foot: ['Та сама нумерація статей', 'Ваші дані обома мовами', 'Повний текст, а не резюме'],
    pause: 'Зупинити демонстрацію',
    play: 'Запустити демонстрацію',
    note: 'Фрагмент реального результату генератора зі зразковими даними.',
  },
};

const HTML_LANG: Record<ShowcaseLanguage, string> = { en: 'en', ua: 'uk' };

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const readReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

export default function BilingualShowcase({
  samples,
  uiLocale = 'cs',
  initialLanguage = 'en',
}: {
  samples: BilingualShowcaseSample[];
  uiLocale?: UiLocale;
  initialLanguage?: ShowcaseLanguage;
}) {
  const ui = UI[uiLocale];
  const otherLanguage: ShowcaseLanguage = initialLanguage === 'en' ? 'ua' : 'en';
  const languages: ShowcaseLanguage[] = [initialLanguage, otherLanguage];
  // Auto-play walks through every contract in both languages: doc0/lang0, doc0/lang1, doc1/lang0, …
  const [step, setStep] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const rootRef = useRef<HTMLDivElement>(null);

  const total = samples.length * languages.length;
  const docIndex = Math.floor(step / languages.length) % Math.max(samples.length, 1);
  const language = languages[step % languages.length];
  const sample = samples[docIndex];
  const paused = stopped || hovered || !visible || reducedMotion;

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || total < 2) return;
    const timer = window.setTimeout(() => setStep((current) => (current + 1) % total), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [paused, step, total]);

  if (!sample) return null;
  const translation = sample.translations[language];
  const rows = sample.cs.paragraphs.length;

  const choose = (nextDoc: number, nextLanguage: ShowcaseLanguage) => {
    setStopped(true);
    setStep(nextDoc * languages.length + languages.indexOf(nextLanguage));
  };

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-lang={language}
      data-paused={paused ? 'true' : 'false'}
      style={{ '--step-ms': `${STEP_MS}ms` } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className={styles.toolbar}>
        <div className={styles.docs} role="group" aria-label={ui.docsLabel}>
          {samples.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className={styles.chip}
              aria-pressed={index === docIndex}
              onClick={() => choose(index, language)}
            >
              {item.label[uiLocale]}
            </button>
          ))}
        </div>
        <div className={styles.langs} role="group" aria-label={ui.langsLabel}>
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              className={styles.chip}
              aria-pressed={item === language}
              onClick={() => choose(docIndex, item)}
            >
              {ui.langName[item]}
              {item === language && !stopped && !reducedMotion ? <span key={step} className={styles.progress} aria-hidden="true" /> : null}
            </button>
          ))}
          {!reducedMotion ? (
            <button
              type="button"
              className={styles.pause}
              aria-label={stopped ? ui.play : ui.pause}
              onClick={() => setStopped((value) => !value)}
            >
              {stopped ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
            </button>
          ) : null}
        </div>
      </div>

      <div className={styles.sheet}>
        <div className={styles.head}>
          <span className={styles.headCs}>{ui.csHead}</span>
          <span className={styles.swap} aria-hidden="true"><span className={styles.swapIcon}>⇄</span></span>
          <span className={styles.headTr}>{ui.trHead[language]}</span>
        </div>

        <div className={styles.titleRow}>
          <p className={styles.title} lang="cs">{sample.cs.title}</p>
          <span aria-hidden="true" />
          <p key={`title-${sample.key}-${language}`} className={`${styles.title} ${styles.titleTr}`} lang={HTML_LANG[language]}>
            {translation.title}
          </p>
        </div>

        <ol className={styles.rows} style={{ '--rows': rows } as CSSProperties}>
          {sample.cs.paragraphs.map((paragraph, index) => (
            <li key={`${sample.key}-${index}`} className={styles.row} style={{ '--i': index } as CSSProperties}>
              <p className={styles.para} lang="cs">
                <span className={styles.num}>({index + 1})</span>{paragraph}
              </p>
              <span className={styles.bridge} aria-hidden="true"><span className={styles.pulse} /></span>
              <p key={`${sample.key}-${language}-${index}`} className={`${styles.para} ${styles.paraTr}`} lang={HTML_LANG[language]}>
                <span className={styles.num}>({index + 1})</span>{translation.paragraphs[index]}
              </p>
            </li>
          ))}
        </ol>

        <div className={styles.foot}>
          {ui.foot.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <p className={styles.note}>{ui.note}</p>
    </div>
  );
}
