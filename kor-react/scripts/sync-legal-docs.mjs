#!/usr/bin/env node
// Pulls each legal document from its Google Doc and writes the parsed result to
// src/content/legal/legalDocs.generated.json, which the LegalPage component renders.
//
//   node scripts/sync-legal-docs.mjs                  fetch every doc from Google
//   node scripts/sync-legal-docs.mjs --only terms     fetch one doc
//   node scripts/sync-legal-docs.mjs --from-dir DIR   read DIR/<slug>.html instead of fetching
//   node scripts/sync-legal-docs.mjs --dry-run        parse and report, write nothing
//
// If a doc fails (not shared, Google error, or the parsed result looks wrong) the previous
// version of that doc is kept, the others are still updated, and the script exits 1 so the
// workflow can flag it. A broken fetch can therefore never blank out a live legal page.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseLegalHtml } from './legal-docs-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = path.join(root, 'src/content/legal/legalDocs.config.json');
const OUTPUT = path.join(root, 'src/content/legal/legalDocs.generated.json');

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

async function fetchDocHtml(docId) {
  const url = `https://docs.google.com/document/d/${docId}/export?format=html`;
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'kor-legal-sync/1.0' },
    signal: AbortSignal.timeout(30_000),
  });
  const type = res.headers.get('content-type') || '';
  if (!res.ok) {
    throw new Error(
      `Google returned HTTP ${res.status}. Is the doc shared as "Anyone with the link can view"?`
    );
  }
  if (!type.includes('text/html')) throw new Error(`Unexpected content-type: ${type}`);
  const html = await res.text();
  if (!html.includes('doc-content')) {
    throw new Error('Response was not a Google Doc export (sign-in page?). Check sharing.');
  }
  return html;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

const config = await readJson(CONFIG, null);
if (!config?.docs?.length) {
  console.error(`No docs configured in ${CONFIG}`);
  process.exit(1);
}

const only = option('--only');
const fromDir = option('--from-dir');
const previous = await readJson(OUTPUT, {});
const next = {};
const failures = [];

for (const cfg of config.docs) {
  const keepPrevious = () => {
    if (previous[cfg.slug]) next[cfg.slug] = previous[cfg.slug];
  };
  if (only && only !== cfg.slug) {
    keepPrevious();
    continue;
  }
  try {
    const html = fromDir
      ? await readFile(path.join(fromDir, `${cfg.slug}.html`), 'utf8')
      : await fetchDocHtml(cfg.docId);
    const doc = parseLegalHtml(html, cfg);
    next[cfg.slug] = doc;
    const words = JSON.stringify(doc.blocks).length;
    console.log(`ok    ${cfg.slug.padEnd(14)} ${doc.blocks.length} blocks, ${doc.meta.length} meta  (${words} bytes)`);
  } catch (err) {
    failures.push(cfg.slug);
    keepPrevious();
    console.error(`FAIL  ${cfg.slug.padEnd(14)} ${err.message}`);
    // GitHub Actions annotation; harmless elsewhere.
    console.error(`::error title=Legal doc sync failed (${cfg.slug})::${err.message}`);
  }
}

if (!flag('--dry-run')) {
  const text = JSON.stringify(next, null, 2) + '\n';
  const old = await readFile(OUTPUT, 'utf8').catch(() => '');
  if (text !== old) {
    await writeFile(OUTPUT, text);
    console.log(`wrote ${path.relative(root, OUTPUT)}`);
  } else {
    console.log('no changes');
  }
}

process.exit(failures.length ? 1 : 0);
