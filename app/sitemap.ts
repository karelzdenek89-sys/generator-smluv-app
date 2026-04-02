import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/najem`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/auto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/darovaci`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/smlouva-o-dilo`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pujcka`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/nda`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/kupni`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pracovni`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/dpp`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sluzby`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/podnajem`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/plna-moc`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/uznani-dluhu`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/spoluprace`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Blog
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/najemni-smlouva-vzor-2026`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/blog/kupni-smlouva-na-auto-2026`,
      lastModified: new Date('2026-03-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/blog/smlouva-o-dilo-2026`,
      lastModified: new Date('2026-03-10'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/blog/darovaci-smlouva-2026`,
      lastModified: new Date('2026-03-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/blog/pracovni-smlouva-2026`,
      lastModified: new Date('2026-03-20'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/blog/kupni-smlouva-movita-vec`,
      lastModified: new Date('2026-03-25'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/blog/smlouva-o-zapujcce-2026`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/blog/nda-smlouva-mlcenlivost`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    // SEO landing pages
    {
      url: `${BASE_URL}/najemni-smlouva`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/smlouva-o-dilo-online`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/pracovni-smlouva`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/kupni-smlouva`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/dohoda-o-provedeni-prace`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/darovaci-smlouva`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/nda-smlouva`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/pujcka-smlouva`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/podnajemni-smlouva`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/plna-moc-online`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/uznani-dluhu-vzor`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/smlouva-o-sluzbach`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/smlouva-o-spolupraci`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/najemni-smlouva-byt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.93,
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/obchodni-podminky`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/gdpr`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
