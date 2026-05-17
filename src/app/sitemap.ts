import { MetadataRoute } from 'next';
import { getCategories, getPublishedArticles } from '@/services/public-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.manaindurnews.in';

  // 1. Fetch all categories
  const categories = await getCategories();
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 2. Fetch all published articles (up to 1000)
  const articles = await getPublishedArticles({ limit: 1000 });
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.published_at || article.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 3. Static Pages
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...articleUrls];
}
