import Image from 'next/image';
import Link from 'next/link';
import { getPublishedArticles, getCategories } from '@/services/public-api';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const breakingNews = await getPublishedArticles({ limit: 5, isBreaking: true });
  const latestNews = await getPublishedArticles({ limit: 5 });
  const categories = await getCategories();

  // 1. Hero Grid Articles (Top 5 latest articles)
  const heroGridArticles = latestNews.slice(0, 5);
  const mainHeroArticle = heroGridArticles[0];
  const sideGridArticles = heroGridArticles.slice(1);

  // 2. Fetch Breaking News Section Articles (latest 4 breaking news articles)
  const breakingSectionNews = await getPublishedArticles({ limit: 4, isBreaking: true });

  // 3. Dynamic Category Section News (parallel fetch latest 4 articles for each category)
  const categorySections = await Promise.all(
    categories.map(async (category) => {
      const articles = await getPublishedArticles({
        limit: 4,
        categorySlug: category.slug,
      });
      return {
        category,
        articles,
      };
    })
  );

  // Filter out categories that don't have any published articles (keep only active sections)
  const activeCategorySections = categorySections.filter(
    (section) => section.articles.length > 0
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4 flex items-center overflow-hidden">
          <div className="font-bold uppercase tracking-wider text-sm whitespace-nowrap mr-4 flex-shrink-0 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            బ్రేకింగ్ న్యూస్
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap inline-block">
              {breakingNews.map((news, i) => (
                <span key={news.id} className="mx-4">
                  <Link href={`/news/${news.slug}`} className="hover:underline font-heading">
                    {news.title}
                  </Link>
                  {i < breakingNews.length - 1 && <span className="mx-4">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 space-y-14">
        {/* Premium Featured News Grid (Latest 5 Articles) */}
        {mainHeroArticle ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl md:text-2xl font-bold font-heading border-l-4 border-red-700 pl-3 uppercase text-gray-900 tracking-tight">
                ప్రధాన వార్తలు / Featured News
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Column: Big Card (Occupies 40% / 2 cols of 5) */}
              <div className="lg:col-span-2 lg:h-[540px]">
                <Link href={`/news/${mainHeroArticle.slug}`} className="group block relative h-[380px] lg:h-full w-full rounded-xl overflow-hidden shadow-md bg-black">
                  {mainHeroArticle.featured_image && (mainHeroArticle.featured_image.startsWith('http') || mainHeroArticle.featured_image.startsWith('/')) ? (
                    <Image
                      src={mainHeroArticle.featured_image}
                      alt={mainHeroArticle.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <Image src="/websiteLogo.jpeg" alt="Mana Indur News" width={200} height={100} className="opacity-20 object-contain" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                    {mainHeroArticle.category && (
                      <Badge className="bg-red-700 mb-3 hover:bg-red-800 tracking-wider text-xs">{mainHeroArticle.category.name}</Badge>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-white mb-3 group-hover:text-red-300 transition-colors line-clamp-3 leading-snug">
                      {mainHeroArticle.title}
                    </h2>
                    <p className="text-gray-200 text-sm line-clamp-2 mb-4 hidden md:block">
                      {mainHeroArticle.excerpt || "పూర్తి కథనాన్ని చదవండి..."}
                    </p>
                    <div className="flex items-center text-gray-300 text-xs gap-1.5 font-medium">
                      <Clock size={14} className="text-gray-400" />
                      <span>{new Date(mainHeroArticle.created_at).toLocaleDateString('te-IN')}</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right Column: 4 Small Cards (Occupies 60% / 3 cols of 5) arranged in 2x2 */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:h-[540px]">
                  {sideGridArticles.map((article) => (
                    <Link 
                      key={article.id} 
                      href={`/news/${article.slug}`} 
                      className="group block relative h-[240px] lg:h-auto rounded-xl overflow-hidden shadow-md bg-black"
                    >
                      {article.featured_image && (article.featured_image.startsWith('http') || article.featured_image.startsWith('/')) ? (
                        <Image
                          src={article.featured_image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <Image src="/websiteLogo.jpeg" alt="Mana Indur News" width={120} height={60} className="opacity-20 object-contain" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-5 w-full z-10">
                        {article.category && (
                          <Badge className="bg-red-700 mb-2 hover:bg-red-800 text-[10px] py-0.5 px-1.5">{article.category.name}</Badge>
                        )}
                        <h3 className="text-base md:text-lg font-bold font-heading text-white mb-2 group-hover:text-red-300 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        <div className="flex items-center text-gray-300 text-[11px] gap-1 font-medium">
                          <Clock size={12} className="text-gray-400" />
                          <span>{new Date(article.created_at).toLocaleDateString('te-IN')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Graceful filler cards if there are fewer than 5 articles */}
                  {Array.from({ length: Math.max(0, 4 - sideGridArticles.length) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="border border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center h-[240px] lg:h-auto text-gray-400 text-xs font-semibold"
                    >
                      వార్తలు త్వరలో వస్తాయి / More News Coming Soon
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        ) : (
          <div className="h-[400px] rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-muted-foreground">ఎలాంటి వార్తలు కనుగొనబడలేదు. పబ్లిషింగ్ ప్రారంభించండి!</p>
          </div>
        )}

        {/* 1. Breaking News Section */}
        {breakingSectionNews.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <h2 className="text-xl md:text-2xl font-bold font-heading border-l-4 border-red-700 pl-3 uppercase text-gray-900 tracking-tight">
                  బ్రేకింగ్ న్యూస్ / Breaking News
                </h2>
              </div>
              <Link 
                href="/search?type=breaking" 
                className="text-xs md:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group transition-colors cursor-pointer"
              >
                <span>అన్ని చూడండి / See All</span>
                <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {breakingSectionNews.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group h-full flex">
                  <Card className="overflow-hidden border border-border/60 bg-card hover:shadow-md hover:border-red-200 transition-all duration-300 h-full flex flex-col w-full rounded-xl">
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      {article.featured_image && (article.featured_image.startsWith('http') || article.featured_image.startsWith('/')) ? (
                        <Image
                          src={article.featured_image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <Image src="/websiteLogo.jpeg" alt="Mana Indur News" width={120} height={60} className="opacity-20 object-contain" />
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 shadow-sm text-[10px] animate-pulse">
                        Breaking
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="flex items-center text-xs text-muted-foreground mb-2 gap-1 font-medium">
                        <Clock size={14} className="text-gray-400" />
                        <span>{new Date(article.created_at).toLocaleDateString('te-IN')}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 font-heading text-sm group-hover:text-red-700 transition-colors line-clamp-3 mb-2 flex-1 leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
                          {article.excerpt}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. Dynamic Category Sections */}
        {activeCategorySections.map((section) => (
          <section key={section.category.id} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl md:text-2xl font-bold font-heading border-l-4 border-red-700 pl-3 uppercase text-gray-900 tracking-tight">
                {section.category.name}
              </h2>
              <Link 
                href={`/category/${section.category.slug}`} 
                className="text-xs md:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group transition-colors cursor-pointer"
              >
                <span>అన్ని చూడండి / See All</span>
                <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {section.articles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group h-full flex">
                  <Card className="overflow-hidden border border-border/60 bg-card hover:shadow-md transition-all duration-300 h-full flex flex-col w-full rounded-xl">
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      {article.featured_image && (article.featured_image.startsWith('http') || article.featured_image.startsWith('/')) ? (
                        <Image
                          src={article.featured_image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <Image src="/websiteLogo.jpeg" alt="Mana Indur News" width={120} height={60} className="opacity-20 object-contain" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="flex items-center text-xs text-muted-foreground mb-2 gap-1 font-medium">
                        <Clock size={14} className="text-gray-400" />
                        <span>{new Date(article.created_at).toLocaleDateString('te-IN')}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 font-heading text-sm group-hover:text-red-700 transition-colors line-clamp-3 mb-2 flex-1 leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
                          {article.excerpt}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

