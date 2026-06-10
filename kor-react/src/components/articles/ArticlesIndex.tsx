import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { articles, ArticleMeta } from '../../content/articlesIndex';

const CATEGORY_LABELS: Record<ArticleMeta['category'], string> = {
  maintenance: 'Maintenance',
  'ride-planning': 'Ride Planning',
  'cycling-basics': 'Cycling Basics',
};

const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';

const ArticlesIndex: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ArticleMeta['category'] | 'all'>('all');

  const filtered =
    activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Cycling Maintenance &amp; Ride Planning Articles — KOR</title>
        <meta
          name="description"
          content="Expert cycling guides on bike maintenance schedules, ride planning, and component care — backed by KOR's wear-tracking data."
        />
        <link rel="canonical" href={`${baseUrl}/articles`} />
      </Helmet>

      <section className="articles-index">
        <div className="articles-index-header">
          <h1>Cycling Articles</h1>
          <p className="articles-index-subtitle">
            Practical guides on maintenance, ride planning, and keeping your bike rolling.
          </p>
        </div>

        <div className="articles-filter">
          {(['all', 'maintenance', 'ride-planning', 'cycling-basics'] as const).map((cat) => (
            <button
              key={cat}
              className={`articles-filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="articles-empty">No articles yet — check back soon.</p>
        ) : (
          <div className="articles-grid">
            {filtered.map((article) => (
              <Link
                key={article.slug}
                to={`/articles/${article.slug}`}
                className="article-card"
              >
                <div className="article-card-image">
                  <img
                    src={article.heroImage}
                    alt={article.heroImageAlt}
                    loading="lazy"
                  />
                </div>
                <div className="article-card-body">
                  <span className="article-card-category">
                    {CATEGORY_LABELS[article.category]}
                  </span>
                  <h2 className="article-card-title">{article.title}</h2>
                  <p className="article-card-description">{article.description}</p>
                  <span className="article-card-meta">{article.readingTime} min read</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ArticlesIndex;
