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
    slug: 'how-to-measure-chain-wear',
    title: 'How to Measure Chain Wear: Checker Tool & Ruler Methods',
    description:
      'Step-by-step guide to measuring bike chain wear with a chain checker or 12-inch ruler. Know the 0.5% threshold and when to replace before cassette damage occurs.',
    category: 'maintenance',
    tags: ['chain wear', 'chain checker', 'drivetrain', 'maintenance', 'chain measurement'],
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
    heroImage: '/images/articles/how-to-measure-chain-wear.webp',
    heroImageAlt:
      'Close-up of a bicycle chain and cassette drivetrain with measuring tool on trail background',
    author: 'KOR Cycling Team',
    schemaType: 'HowTo',
    readingTime: 6,
    related: ['bike-maintenance-schedule', 'when-to-replace-bike-chain', 'when-to-replace-cassette'],
  },
  {
    slug: 'when-to-replace-bike-chain',
    title: 'When to Replace Your Bike Chain (Mileage + Wear Signs)',
    description:
      'Know exactly when to replace your bike chain: the 0.5% wear rule, mileage ranges by speed, and the cost of waiting too long. Drivetrain lifespan explained.',
    category: 'maintenance',
    tags: ['chain', 'drivetrain', 'maintenance', 'chain wear', 'chain replacement'],
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
    heroImage: '/images/articles/when-to-replace-bike-chain.webp',
    heroImageAlt: 'Close-up of a bicycle chain and cassette showing drivetrain wear on a mountain bike',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'how-to-measure-chain-wear', 'when-to-replace-cassette'],
  },
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
