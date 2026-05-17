import { supabase } from '@/lib/supabase';

export interface PublicArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  is_breaking: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  meta_title?: string;
  meta_description?: string;
  source_link?: string;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
}

/**
 * Fetch published articles
 * @param limit Number of articles to return (default 10)
 * @param categorySlug Filter by category slug
 * @param isBreaking Filter for breaking news only
 */
export async function getPublishedArticles({
  limit = 10,
  categorySlug,
  isBreaking,
}: {
  limit?: number;
  categorySlug?: string;
  isBreaking?: boolean;
} = {}): Promise<PublicArticle[]> {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (isBreaking) {
    query = query.eq('is_breaking', true);
  }

  // If a category slug is provided, we need to handle the join filtering.
  // Supabase JS doesn't easily let you filter by a joined table's column directly in a single pass without inner joins,
  // but we can fetch the category ID first or use postgrest nested filters.
  if (categorySlug) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (catData) {
      query = query.eq('category_id', catData.id);
    } else {
      return []; // Category not found
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching published articles:', error);
    return [];
  }

  return (data as any) || [];
}

/**
 * Fetch most popular articles (ordered by view_count desc)
 * @param limit Number of articles to return (default 25)
 */
export async function getPopularArticles(limit: number = 25): Promise<PublicArticle[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular articles:', error);
    return [];
  }

  return (data as any) || [];
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<PublicArticle | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }

  return data as any;
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<PublicCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

/**
 * Search published articles by title keyword.
 */
export async function searchArticles(query: string): Promise<PublicArticle[]> {
  if (!query) return [];
  
  try {
    // 1. Fetch categories matching the query slug
    const { data: matchedCategories } = await supabase
      .from('categories')
      .select('id')
      .ilike('slug', `%${query}%`);
      
    const matchedCategoryIds = matchedCategories?.map((c) => c.id) || [];
    
    // 2. Build article search query
    let baseQuery = supabase
      .from('articles')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('status', 'published');

    if (matchedCategoryIds.length > 0) {
      // Match by title, slug, OR matching category_id
      baseQuery = baseQuery.or(`title.ilike.%${query}%,slug.ilike.%${query}%,category_id.in.(${matchedCategoryIds.join(',')})`);
    } else {
      // Fallback to title or slug
      baseQuery = baseQuery.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
    }

    const { data, error } = await baseQuery.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }
    return (data as any) || [];
  } catch (error) {
    console.error('Failed to perform category-slug-based article search:', error);
    return [];
  }
}

/**
 * Increment view count for an article using an RPC or direct update
 * Note: Direct update from public requires RLS policy allowing it, or an RPC.
 * If RLS blocks update, this might fail silently, which is fine for public views.
 */
export async function incrementArticleView(articleId: string) {
  // Ideally, this uses an RPC function to avoid concurrency issues.
  // For now, we will insert a record into article_views.
  await supabase.from('article_views').insert([
    {
      article_id: articleId,
      // ip_address could be extracted from request headers in server components
    },
  ]);
}
