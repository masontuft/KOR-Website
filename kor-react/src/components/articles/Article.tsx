import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articles } from '../../content/articlesIndex';
import ArticleSeo from './ArticleSeo';

const CATEGORY_LABELS: Record<string, string> = {
  maintenance: 'Maintenance',
  'ride-planning': 'Ride Planning',
  'cycling-basics': 'Cycling Basics',
};

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith('---')) return raw;
  const second = raw.indexOf('---', 3);
  if (second === -1) return raw;
  return raw.slice(second + 3).trimStart();
}

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [body, setBody] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const meta = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!meta) return;
    setBody(null);
    setLoadError(false);
    fetch(`/content/articles/${meta.slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.text();
      })
      .then((text) => setBody(stripFrontmatter(text)))
      .catch(() => setLoadError(true));
  }, [meta]);

  if (!meta) {
    return (
      <section className="article-page not-found">
        <h1>Article Not Found</h1>
        <p>
          The article you're looking for doesn't exist.{' '}
          <Link to="/articles">Browse all articles →</Link>
        </p>
      </section>
    );
  }

  const relatedArticles = articles.filter((a) => meta.related.includes(a.slug));

  return (
    <>
      <ArticleSeo article={meta} />

      <article className="article-page">
        <header className="article-hero">
          <img
            src={meta.heroImage}
            alt={meta.heroImageAlt}
            className="article-hero-image"
          />
          <div className="article-hero-overlay">
            <nav className="article-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true"> › </span>
              <Link to="/articles">Articles</Link>
              <span aria-hidden="true"> › </span>
              <span>{CATEGORY_LABELS[meta.category] || meta.category}</span>
            </nav>
          </div>
        </header>

        <div className="article-meta">
          <span className="article-meta-category">{CATEGORY_LABELS[meta.category]}</span>
          <span className="article-meta-reading-time">{meta.readingTime} min read</span>
          <time className="article-meta-date" dateTime={meta.datePublished}>
            {new Date(meta.datePublished).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span className="article-meta-author">By {meta.author || 'KOR Cycling Team'}</span>
        </div>

        <div className="article-body">
          {loadError ? (
            <p>Unable to load this article. Please try again later.</p>
          ) : body === null ? (
            <p className="article-loading">Loading…</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          )}
        </div>

        {/* CTA Banner */}
        <section className="cta-banner article-cta">
          <div className="cta-banner-content">
            <h2 className="cta-banner-title">Stop guessing when parts need service.</h2>
            <p className="cta-banner-text">
              KOR connects to Strava and tracks wear on your chain, brake pads, tires, suspension
              and more — then alerts you before they fail.
            </p>
            <div className="cta-banner-buttons">
              <a
                href="https://play.google.com/store/apps/details?id=com.robtuft.newKOR"
                target="_blank"
                rel="noopener noreferrer"
                className="store-button-link"
                aria-label="Download KOR for Android on Google Play"
              >
                <img
                  className="store_buttons_large"
                  src="/images/Google_play_button.svg"
                  alt="Download on Google Play Store"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993"
                target="_blank"
                rel="noopener noreferrer"
                className="store-button-link"
                aria-label="Download KOR for iPhone on the App Store"
              >
                <img
                  className="store_buttons_large"
                  src="/images/Apple_app_store_button.svg"
                  alt="Download on App Store"
                />
              </a>
            </div>
            <div className="cta-banner-secondary">
              <Link className="personal-cta-button" to="/our-app">
                Learn more about KOR →
              </Link>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="article-related">
            <h2>Related Articles</h2>
            <div className="articles-grid articles-grid-related">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  to={`/articles/${related.slug}`}
                  className="article-card"
                >
                  <div className="article-card-image">
                    <img
                      src={related.heroImage}
                      alt={related.heroImageAlt}
                      loading="lazy"
                    />
                  </div>
                  <div className="article-card-body">
                    <span className="article-card-category">
                      {CATEGORY_LABELS[related.category]}
                    </span>
                    <h3 className="article-card-title">{related.title}</h3>
                    <span className="article-card-meta">{related.readingTime} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
};

export default Article;
