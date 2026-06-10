export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: 'maintenance' | 'ride-planning' | 'cycling-basics';
  tags: string[];
  datePublished: string;
  dateModified: string;
  heroImage: string;
  heroImageAlt: string;
  author: string;
  schemaType: 'Article' | 'HowTo' | 'FAQPage';
  readingTime: number;
  related: string[];
}

export const articles: ArticleMeta[] = [];
