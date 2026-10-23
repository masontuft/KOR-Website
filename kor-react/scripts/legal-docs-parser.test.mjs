// Run with: node --test scripts/
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLegalHtml } from './legal-docs-parser.mjs';

const filler = (n) => Array.from({ length: n }, (_, i) => `<p class="c1"><span class="c0">Paragraph number ${i} with enough ordinary words to count toward the minimum size of a real legal document.</span></p>`).join('');

// Shaped like Google's export: generated classes, wrapped links, headings with ids.
const structured = `<html><head><style>.c2{font-weight:700}.c3{font-style:italic}</style></head><body><div class="doc-content">
<h1 class="c5" id="h.a"><span class="c6">Terms of Service</span></h1>
<p class="c1"><span>Effective Date: 10/22/2026</span></p>
<h2 id="h.b"><span>1. First</span></h2>
${filler(6)}
<p><span class="c2">Bold lead.</span><span> then plain, see </span><a href="https://www.google.com/url?q=https://www.garmin.com/en-US/privacy/connect/&amp;sa=D"><span>Garmin</span></a></p>
<ul class="c4"><li class="c0"><span>one</span></li><li class="c0"><span>two</span></li></ul>
<h2><span>2. Second</span></h2>${filler(5)}
<h3><span>2.1 Sub</span></h3>${filler(4)}
</div></body></html>`;

test('structured doc: title, meta, headings, bold, link unwrapping, lists', () => {
  const d = parseLegalHtml(structured, { minBlocks: 5, minWords: 100 });
  assert.equal(d.title, 'Terms of Service');
  assert.deepEqual(d.meta, [{ label: 'Effective Date', value: '10/22/2026' }]);
  assert.deepEqual(d.blocks.filter((b) => b.type === 'h2').map((b) => b.inlines[0].t), ['1. First', '2. Second']);
  assert.equal(d.blocks.filter((b) => b.type === 'h3').length, 1);
  const ul = d.blocks.find((b) => b.type === 'ul');
  assert.equal(ul.items.length, 2);
  const mixed = d.blocks.find((b) => b.type === 'p' && b.inlines[0].b);
  assert.deepEqual(mixed.inlines[0], { t: 'Bold lead.', b: 1 });
  assert.equal(mixed.inlines[2].href, 'https://www.garmin.com/en-US/privacy/connect/');
});

const flat = `<html><body><div class="doc-content">
<p><span>ACME LLC</span></p>
<p><span>I. THINGS WE COLLECT</span></p>
${filler(4)}
<p><span>1.   Cookies and such</span></p>
<p><span>·   First bullet</span></p><p><span>·   Second bullet</span></p>
${filler(4)}
<p><span>II. CONTACT US</span></p>${filler(3)}
<p><span>Last Updated: This policy was last updated on 1/2/2027.</span></p>
</div></body></html>`;

test('flat doc: roman and numbered headings, dot bullets, dropped lines, last-updated date', () => {
  const d = parseLegalHtml(flat, { title: 'Policy', dropLines: ['^ACME LLC$'], minBlocks: 5, minWords: 100 });
  assert.deepEqual(d.blocks.filter((b) => b.type === 'h2').map((b) => b.inlines[0].t), ['I. THINGS WE COLLECT', 'II. CONTACT US']);
  assert.equal(d.blocks.find((b) => b.type === 'h3').inlines[0].t, '1. Cookies and such');
  assert.equal(d.blocks.find((b) => b.type === 'ul').items.length, 2);
  assert.deepEqual(d.meta, [{ label: 'Last Updated', value: '1/2/2027' }]);
  assert.ok(!JSON.stringify(d.blocks).includes('ACME LLC'));
});

test('rejects a sign-in page or truncated doc instead of publishing it', () => {
  assert.throws(() => parseLegalHtml('<html><body><div class="doc-content"><p>Sign in</p></div></body></html>', { title: 'X' }), /blocks parsed/);
});
