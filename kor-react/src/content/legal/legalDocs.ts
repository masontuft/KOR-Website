import generated from './legalDocs.generated.json';
import config from './legalDocs.config.json';
import type { LegalDoc, LegalDocIndexEntry } from './legalTypes';

/** Parsed legal documents, written by scripts/sync-legal-docs.mjs. */
export const legalDocs = generated as unknown as Record<string, LegalDoc>;

/** Route/slug/label list for routing and the footer. Comes from the config, so it never drifts from the sync script. */
export const legalDocIndex: LegalDocIndexEntry[] = config.docs.map((d) => ({
  slug: d.slug,
  route: d.route,
  footerLabel: d.footerLabel,
  title: d.title,
  description: d.description,
}));
