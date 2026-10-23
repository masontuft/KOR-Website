/** One run of text inside a paragraph, heading or list item. */
export interface Inline {
  t: string;
  b?: 1;
  i?: 1;
  href?: string;
}

export type LegalBlock =
  | { type: 'h2' | 'h3' | 'p'; inlines: Inline[] }
  | { type: 'ul'; items: Inline[][] };

export interface LegalDoc {
  title: string;
  description: string;
  meta: { label: string; value: string }[];
  blocks: LegalBlock[];
}

export interface LegalDocIndexEntry {
  slug: string;
  route: string;
  footerLabel: string;
  title: string;
  description: string;
}
