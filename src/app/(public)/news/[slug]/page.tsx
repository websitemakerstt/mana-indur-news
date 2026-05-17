import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getPublishedArticles, getPopularArticles } from '@/services/public-api';
import { Metadata, ResolvingMetadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Share2, ExternalLink, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ViewCounter } from '@/components/news/ViewCounter';
import { PopularArticlesSection } from '@/components/news/PopularArticlesSection';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const imageUrl = article.featured_image 
    ? (article.featured_image.startsWith('http') ? article.featured_image : 'https://www.manaindurnews.in' + article.featured_image) 
    : 'https://www.manaindurnews.in/websiteLogo.jpeg';

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      url: `https://www.manaindurnews.in/news/${article.slug}`,
      siteName: 'Mana Indur News',
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Fetch related news (same category - max 5)
  const relatedNews = await getPublishedArticles({
    limit: 6,
    categorySlug: article.category?.slug,
  });

  const filteredRelatedNews = relatedNews.filter((n) => n.id !== article.id).slice(0, 5);

  // Fetch popular articles (most viewed - max 25)
  const popularArticles = await getPopularArticles(25);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Article Content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              {article.category && (
                <Link href={`/category/${article.category.slug}`}>
                  <Badge className="bg-red-700 hover:bg-red-800 mb-4">{article.category.name}</Badge>
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 leading-tight mb-4">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Author Info & View Counter */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200/80 gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  {/* Circular Avatar with Logo Style Initial */}
                  <div className="relative h-9 w-9 rounded-full overflow-hidden bg-red-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm border border-red-700">
                    {article.author ? article.author.substring(0, 2) : 'MI'}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                    <span className="font-bold text-gray-900">By {article.author || 'Mana Indur News'}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 font-medium">
                      {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {/* View Counter */}
                <ViewCounter articleId={article.id} initialViews={article.view_count || 0} />
              </div>

              {/* Social Media Sharing Block (Referencing Image Design) */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {/* Visual Share Box */}
                <div className="relative flex items-center bg-white border border-gray-200 rounded px-4 py-2.5 text-sm font-bold text-gray-700 shadow-xs gap-2">
                  <Share2 size={16} className="text-gray-500" />
                  <span className="border-l pl-2 border-gray-200">Share</span>
                  {/* Subtle right-pointing arrow element */}
                  <div className="absolute top-[35%] -right-1.5 w-3 h-3 bg-white border-t border-r border-gray-200 rotate-45 z-10" />
                </div>                 {/* Facebook (Dark Blue) */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://www.manaindurnews.in/news/${article.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-[#4e69a2] hover:bg-[#3b5998] text-white flex items-center justify-center rounded shadow-xs transition-colors duration-200 cursor-pointer"
                  title="Share on Facebook"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>

                {/* X (Cyan / Light Blue) */}
                <a 
                  href={`https://twitter.com/intent/tweet?url=https://www.manaindurnews.in/news/${article.slug}&text=${encodeURIComponent(article.title)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-[#26c6da] hover:bg-[#00abf0] text-white flex items-center justify-center rounded shadow-xs transition-colors duration-200 cursor-pointer"
                  title="Share on X"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Pinterest (Red) */}
                <a 
                  href={`https://pinterest.com/pin/create/button/?url=https://www.manaindurnews.in/news/${article.slug}&media=${encodeURIComponent(article.featured_image || '')}&description=${encodeURIComponent(article.title)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-[#cb2027] hover:bg-[#a61a20] text-white flex items-center justify-center rounded shadow-xs transition-colors duration-200 cursor-pointer"
                  title="Pin on Pinterest"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.211-.174.257-.402.15-1.503-.699-2.44-2.895-2.44-4.654 0-3.79 2.758-7.275 7.944-7.275 4.166 0 7.414 2.97 7.414 6.945 0 4.135-2.611 7.462-6.233 7.462-1.214 0-2.354-.629-2.746-1.379l-.749 2.848c-.27 1.03-1.006 2.325-1.498 3.12 1.02.309 2.09.475 3.197.475 6.617 0 12-5.367 12-11.987C24.017 5.367 18.646 0 12.017 0z"/>
                  </svg>
                </a>

                {/* WhatsApp (Green) */}
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' https://www.manaindurnews.in/news/' + article.slug)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-[#70c050] hover:bg-[#5cbe62] text-white flex items-center justify-center rounded shadow-xs transition-colors duration-200 cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </header>

            {article.featured_image && (article.featured_image.startsWith('http') || article.featured_image.startsWith('/')) && (
              <figure className="mb-10 relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </figure>
            )}

            {/* Article Content Body using Prose */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-red-700 hover:prose-a:text-red-800 prose-img:rounded-xl mt-8 font-serif text-gray-850 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.source_link && (
              <div className="mt-8 pt-4 border-t border-border/60 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-gray-700">మరింత సమాచారం / మూలం:</span>
                <a 
                  href={article.source_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-red-700 hover:text-red-800 font-medium inline-flex items-center gap-1.5 underline transition-colors break-all"
                >
                  {article.source_link}
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </article>

          {/* Sidebar (Max 5 Related Articles) */}
          <aside className="space-y-8">
            <div className="bg-card rounded-2xl p-6 border border-border/80 shadow-xs">
              <h3 className="text-xl font-bold font-heading border-l-4 border-red-700 pl-3 mb-6 uppercase text-gray-900">సంబంధిత వార్తలు</h3>
              <div className="space-y-6">
                {filteredRelatedNews.length > 0 ? filteredRelatedNews.map((related) => (
                  <Link key={related.id} href={`/news/${related.slug}`} className="group flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {related.featured_image && (related.featured_image.startsWith('http') || related.featured_image.startsWith('/')) ? (
                        <Image
                          src={related.featured_image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Image src="/websiteLogo.jpeg" alt="Mana Indur" fill className="object-contain opacity-20 p-2" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold font-heading text-gray-900 text-sm line-clamp-3 group-hover:text-red-700 transition-colors leading-tight mb-2">
                        {related.title}
                      </h4>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Clock size={12} />
                        <span>{new Date(related.created_at).toLocaleDateString('te-IN')}</span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-muted-foreground">సంబంధిత వార్తలు కనుగొనబడలేదు.</p>
                )}
              </div>
            </div>
          </aside>
          
        </div>

        {/* Paginated Most Popular News Section at the Bottom */}
        <PopularArticlesSection articles={popularArticles} />
      </main>
    </div>
  );
}
