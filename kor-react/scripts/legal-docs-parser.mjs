// Turns the HTML that Google Docs produces (File > Download > Web page, i.e.
// /export?format=html) into the block structure the LegalPage component renders.
//
// Two document shapes are supported:
//   1. Structured docs   - real Heading 1/2/3 styles and bulleted lists. Heading 1 is the
//                          title, Heading 2 a section, Heading 3 a sub-section.
//   2. Flat docs         - everything is a normal paragraph (the original privacy policy).
//                          Headings are recognised by their shape: "VII. CONTACT US",
//                          "3. Children's Privacy", "Personal Information:", and "·" bullets.
//
// Pure functions only, so it can be unit tested without the network.

import * as cheerio from 'cheerio';

const NBSP = / /g;
const META_LABELS = /^(effective date|last updated|operator|applies to|version)\s*:\s*(.+)$/i;
const ROMAN_HEADING = /^[IVXL]+\.\s+\S/;
const NUMBER_HEADING = /^\d+\.\s+\S/;
const BULLET = /^[·•▪‣\-–]\s+/;
const DATE = /\d{1,2}\/\d{1,2}\/\d{4}/;

const clean = (s) => s.replace(NBSP, ' ').replace(/\s+/g, ' ');

/** Google puts bold/italic into generated classes like .c3{font-weight:700}; find them. */
function styleClasses($) {
  const bold = new Set();
  const italic = new Set();
  $('style').each((_, el) => {
    const css = $(el).text();
    for (const m of css.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]*)\}/g)) {
      if (/font-weight\s*:\s*(700|bold)/i.test(m[2])) bold.add(m[1]);
      if (/font-style\s*:\s*italic/i.test(m[2])) italic.add(m[1]);
    }
  });
  return { bold, italic };
}

/** Google wraps outbound links as https://www.google.com/url?q=REAL&sa=D... */
function cleanHref(href) {
  if (!href) return undefined;
  let url = href;
  try {
    const u = new URL(href, 'https://docs.google.com');
    if (u.hostname.endsWith('google.com') && u.pathname === '/url' && u.searchParams.get('q')) {
      url = u.searchParams.get('q');
    }
  } catch {
    return undefined;
  }
  return /^(https?:|mailto:)/i.test(url) ? url : undefined;
}

function pushInline(line, text, flags) {
  if (!text) return;
  const prev = line[line.length - 1];
  const same =
    prev && !!prev.b === !!flags.b && !!prev.i === !!flags.i && prev.href === flags.href;
  if (same) {
    prev.t += text;
    return;
  }
  const seg = { t: text };
  if (flags.b) seg.b = 1;
  if (flags.i) seg.i = 1;
  if (flags.href) seg.href = flags.href;
  line.push(seg);
}

/** Walk an element and return its text as lines (split on <br>), each a list of Inline runs. */
function readLines($, el, classes) {
  const lines = [[]];
  const walk = (node, flags) => {
    $(node)
      .contents()
      .each((_, child) => {
        if (child.type === 'text') {
          pushInline(lines[lines.length - 1], clean(child.data), flags);
          return;
        }
        if (child.type !== 'tag') return;
        const name = child.name.toLowerCase();
        if (name === 'br') {
          lines.push([]);
          return;
        }
        const cls = (child.attribs.class || '').split(/\s+/);
        const next = { ...flags };
        if (name === 'b' || name === 'strong' || cls.some((c) => classes.bold.has(c))) next.b = true;
        if (name === 'i' || name === 'em' || cls.some((c) => classes.italic.has(c))) next.i = true;
        if (name === 'a') next.href = cleanHref(child.attribs.href);
        walk(child, next);
      });
  };
  walk(el, {});
  // Empty lines are kept on purpose: they mark paragraph gaps for the flat-doc heuristics.
  return lines.map(trimLine);
}

function trimLine(line) {
  if (line.length === 0) return line;
  line[0].t = line[0].t.replace(/^\s+/, '');
  line[line.length - 1].t = line[line.length - 1].t.replace(/\s+$/, '');
  return line.filter((s) => s.t.length > 0);
}

const textOf = (line) => line.map((s) => s.t).join('');

/** Remove a leading marker such as "· " from the first run. */
function stripLead(line, re) {
  const out = line.map((s) => ({ ...s }));
  out[0].t = out[0].t.replace(re, '');
  return out.filter((s) => s.t.length > 0);
}

/** A heading is shown as plain text, so drop emphasis and links. */
const plain = (line) => [{ t: clean(textOf(line)).trim() }];

export function parseLegalHtml(html, cfg = {}) {
  const $ = cheerio.load(html);
  const root = $('.doc-content').length ? $('.doc-content').first() : $('body').first();
  if (!root.length) throw new Error('No document body found in the HTML');

  const classes = styleClasses($);
  const drop = (cfg.dropLines || []).map((p) => new RegExp(p, 'i'));
  const structured = root.find('h1, h2, h3').length > 0;

  let title = '';
  const meta = [];
  const blocks = [];
  let seenHeading = false;
  let pendingList = null;

  const flushList = () => {
    if (pendingList) {
      blocks.push({ type: 'ul', items: pendingList });
      pendingList = null;
    }
  };
  const addMeta = (label, value) => {
    const l = label.replace(/\b\w/g, (c) => c.toUpperCase());
    // "Last Updated: This Privacy Policy was last updated on 10/22/2026." -> keep just the date
    const date = value.match(DATE);
    const v = /^last updated$/i.test(label) && date ? date[0] : value.replace(/\.$/, '');
    const existing = meta.find((m) => m.label === l);
    if (existing) existing.value = v;
    else meta.push({ label: l, value: v });
  };

  const handleLine = (line, prevBlank) => {
    const text = clean(textOf(line)).trim();
    if (!text) return;
    if (drop.some((re) => re.test(text))) return;

    const metaHit = text.match(META_LABELS);
    if (metaHit && (!seenHeading || /^last updated$/i.test(metaHit[1]))) {
      addMeta(metaHit[1], metaHit[2].trim());
      return;
    }

    if (!structured) {
      if (BULLET.test(text)) {
        (pendingList ||= []).push(stripLead(line, BULLET));
        return;
      }
      if (ROMAN_HEADING.test(text) && text.length <= 80 && !/[.!?]$/.test(text)) {
        flushList();
        seenHeading = true;
        blocks.push({ type: 'h2', inlines: [{ t: text.replace(/\s+/g, ' ') }] });
        return;
      }
      if (NUMBER_HEADING.test(text) && text.length <= 80 && !/[.!?:;,]$/.test(text)) {
        flushList();
        seenHeading = true;
        blocks.push({ type: 'h3', inlines: [{ t: text.replace(/\s+/g, ' ') }] });
        return;
      }
      if (prevBlank && text.length <= 40 && /:$/.test(text)) {
        flushList();
        blocks.push({ type: 'h3', inlines: [{ t: text.slice(0, -1) }] });
        return;
      }
    }
    flushList();
    blocks.push({ type: 'p', inlines: line });
  };

  root.children().each((_, el) => {
    const name = el.name.toLowerCase();
    if (/^h[1-6]$/.test(name)) {
      flushList();
      const line = readLines($, el, classes).flat();
      const text = clean(textOf(line)).trim();
      if (!text || drop.some((re) => re.test(text))) return;
      if (name === 'h1' && !title) {
        title = text;
        return;
      }
      seenHeading = true;
      blocks.push({ type: name === 'h1' || name === 'h2' ? 'h2' : 'h3', inlines: plain(line) });
      return;
    }
    if (name === 'ul' || name === 'ol') {
      flushList();
      const items = [];
      $(el)
        .find('li')
        .each((__, li) => {
          // Only the li's own text; nested lists are visited as their own li elements.
          const own = $(li).clone();
          own.children('ul, ol').remove();
          const line = readLines($, own, classes).flat();
          if (clean(textOf(line)).trim()) items.push(line);
        });
      if (items.length) blocks.push({ type: 'ul', items });
      return;
    }
    if (name === 'p' || name === 'div') {
      const lines = readLines($, el, classes);
      lines.forEach((line, i) => handleLine(line, i === 0 || textOf(lines[i - 1] || []) === ''));
      if (lines.every((l) => textOf(l) === '')) flushList();
      return;
    }
  });
  flushList();

  const finalTitle = cfg.title || title;
  const problems = [];
  const words = blocks.reduce(
    (n, b) =>
      n +
      (b.type === 'ul'
        ? b.items.reduce((m, it) => m + clean(textOf(it)).split(' ').length, 0)
        : clean(textOf(b.inlines)).split(' ').length),
    0
  );
  if (!finalTitle) problems.push('no title (add a Heading 1, or set "title" in the config)');
  if (blocks.length < (cfg.minBlocks ?? 10)) {
    problems.push(`only ${blocks.length} blocks parsed (expected at least ${cfg.minBlocks ?? 10})`);
  }
  if (blocks.filter((b) => b.type === 'h2' || b.type === 'h3').length < 3) {
    problems.push('fewer than 3 headings found');
  }
  if (words < (cfg.minWords ?? 300)) {
    problems.push(`only ${words} words parsed (expected at least ${cfg.minWords ?? 300})`);
  }
  if (problems.length) throw new Error(problems.join('; '));

  return { title: finalTitle, description: cfg.description || '', meta, blocks };
}
