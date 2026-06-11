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

export const articles: ArticleMeta[] = [
  {
    slug: 'bike-maintenance-schedule',
    title: 'Bike Maintenance Schedule: What to Service and When',
    description:
      'Complete bike maintenance schedule: chain, cassette, brakes, tires, suspension & more — with mileage intervals, checklists, and a master component table.',
    category: 'maintenance',
    tags: ['maintenance', 'bike care', 'chain', 'brakes', 'tires', 'suspension'],
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
    heroImage: '/images/articles/bike-maintenance-schedule.webp',
    heroImageAlt: 'Cyclist performing maintenance on a clean mountain bike outdoors in natural light',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 12,
    related: ['when-to-replace-bike-chain', 'how-to-measure-chain-wear', 'when-to-replace-cassette'],
  },
];
