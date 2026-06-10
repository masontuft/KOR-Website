import React from 'react';
import { Helmet } from 'react-helmet';
import { ArticleMeta } from '../../content/articlesIndex';

interface ArticleSeoProps {
  article: ArticleMeta;
}

const ArticleSeo: React.FC<ArticleSeoProps> = ({ article }) => {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';
  const canonicalUrl = `${baseUrl}/articles/${article.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': article.schemaType === 'HowTo' ? 'HowTo' : article.schemaType === 'FAQPage' ? 'FAQPage' : 'Article',
    headline: article.title,
    description: article.description,
    image: `${baseUrl}${article.heroImage}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: 'KOR Cycling Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KOR (Keep On Rolling)',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/KOR_app_Logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${baseUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <Helmet>
      <title>{article.title} — KOR</title>
      <meta name="description" content={article.description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={`${article.title} — KOR`} />
      <meta property="og:description" content={article.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={`${baseUrl}${article.heroImage}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${article.title} — KOR`} />
      <meta name="twitter:description" content={article.description} />
      <meta name="twitter:image" content={`${baseUrl}${article.heroImage}`} />
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
};

export default ArticleSeo;
