import type { AppLocale } from '@/lib/locale';

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'note'; text: string }
  | { kind: 'callout'; label: string; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'rows'; label?: string; rows: Array<{ label: string; value: string }> }
  | { kind: 'record'; title: string; text: string; meta: Array<{ label: string; value: string }> };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  slug: 'terms' | 'privacy';
  locale: Exclude<AppLocale, 'cs'>;
  title: string;
  titleAccent: string;
  version: string;
  metaTitle: string;
  metaDescription: string;
  /** Odkaz na závazné české znění. */
  prevailingNotice: string;
  czechHref: string;
  czechLinkLabel: string;
  sections: LegalSection[];
  footer: string;
  backLabel: string;
};
