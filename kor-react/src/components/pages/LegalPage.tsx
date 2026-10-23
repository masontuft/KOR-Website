import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { legalDocs, legalDocIndex } from '../../content/legal/legalDocs';
import type { Inline } from '../../content/legal/legalTypes';
import './LegalPage.css';

const SITE = 'https://jmrcycling.com';
const CONTACT_EMAIL = 'masontuft@jmrcycling.com';
// Bare emails and URLs in the doc text become links, even if the author didn't link them in Google Docs.
const AUTOLINK = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|https?:\/\/[^\s)]+[^\s).,;:])/g;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const plainText = (inlines: Inline[]) => inlines.map((s) => s.t).join('');

function renderText(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(AUTOLINK).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes('@') ? `mailto:${part}` : part;
    return (
      <a key={`${keyPrefix}-${i}`} href={href} rel="noopener noreferrer">
        {part}
      </a>
    );
  });
}

function renderInlines(inlines: Inline[], keyPrefix: string): React.ReactNode {
  return inlines.map((seg, i) => {
    const key = `${keyPrefix}-${i}`;
    let node: React.ReactNode = seg.href ? (
      <a key={key} href={seg.href} rel="noopener noreferrer">
        {seg.t}
      </a>
    ) : (
      <React.Fragment key={key}>{renderText(seg.t, key)}</React.Fragment>
    );
    if (seg.i) node = <em key={`${key}-i`}>{node}</em>;
    if (seg.b) node = <strong key={`${key}-b`}>{node}</strong>;
    return node;
  });
}

interface LegalPageProps {
  slug: string;
}

/**
 * Renders one legal document from src/content/legal/legalDocs.generated.json.
 * The text is owned by a Google Doc; edit the doc, not this file. See docs/LEGAL_DOCS.md.
 */
const LegalPage: React.FC<LegalPageProps> = ({ slug }) => {
  const doc = legalDocs[slug];
  const entry = legalDocIndex.find((d) => d.slug === slug);

  // Anchor ids for each section heading, unique within the page.
  const sections = useMemo(() => {
    if (!doc) return [];
    const seen: Record<string, number> = {};
    return doc.blocks.map((b) => {
      if (b.type !== 'h2' && b.type !== 'h3') return null;
      const base = slugify(plainText(b.inlines)) || 'section';
      seen[base] = (seen[base] || 0) + 1;
      return seen[base] > 1 ? `${base}-${seen[base]}` : base;
    });
  }, [doc]);

  const title = doc?.title || entry?.title || 'Legal';
  const description = doc?.description || entry?.description || '';
  const canonical = entry ? `${SITE}${entry.route}` : SITE;

  if (!doc) {
    return (
      <section className="legal-page">
        <Helmet>
          <title>{`${title} | KOR`}</title>
          <link rel="canonical" href={canonical} />
        </Helmet>
        <div className="legal-wrap">
          <h1 className="legal-title">{title}</h1>
          <p className="legal-body-text">
            This document is temporarily unavailable. Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will send you a copy.
          </p>
        </div>
      </section>
    );
  }

  const toc = doc.blocks
    .map((b, i) => (b.type === 'h2' ? { id: sections[i] as string, text: plainText(b.inlines) } : null))
    .filter((x): x is { id: string; text: string } => x !== null);

  return (
    <section className="legal-page">
      <Helmet>
        <title>{`${title} | KOR`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="legal-wrap">
        <header className="legal-header">
          <h1 className="legal-title">{doc.title}</h1>
          {doc.meta.length > 0 && (
            <dl className="legal-meta">
              {doc.meta.map((m) => (
                <div key={m.label} className="legal-meta-row">
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        <div className="legal-layout">
          {toc.length > 2 && (
            <nav className="legal-toc" aria-label="On this page">
              <p className="legal-toc-label">On this page</p>
              <ol>
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <article className="legal-content">
            {doc.blocks.map((b, i) => {
              const key = `b${i}`;
              if (b.type === 'h2') {
                return (
                  <h2 key={key} id={sections[i] as string}>
                    {renderInlines(b.inlines, key)}
                  </h2>
                );
              }
              if (b.type === 'h3') {
                return (
                  <h3 key={key} id={sections[i] as string}>
                    {renderInlines(b.inlines, key)}
                  </h3>
                );
              }
              if (b.type === 'ul') {
                return (
                  <ul key={key}>
                    {b.items.map((item, j) => (
                      <li key={`${key}-${j}`}>{renderInlines(item, `${key}-${j}`)}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={key}>{renderInlines(b.inlines, key)}</p>;
            })}
          </article>
        </div>

        <aside className="legal-related" aria-label="Other legal documents">
          <p className="legal-toc-label">Other legal documents</p>
          <ul>
            {legalDocIndex
              .filter((d) => d.slug !== slug)
              .map((d) => (
                <li key={d.slug}>
                  <Link to={d.route}>{d.title}</Link>
                </li>
              ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default LegalPage;
