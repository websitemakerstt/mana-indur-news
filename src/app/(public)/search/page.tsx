'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, X } from 'lucide-react';
import { searchArticles, getPublishedArticles } from '@/services/public-api';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const isBreakingType = searchParams.get('type') === 'breaking';
  
  const [query, setQuery] = useState(isBreakingType ? '' : initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch whenever debounced query or type changes
  useEffect(() => {
    if (isBreakingType) {
      setLoading(true);
      getPublishedArticles({ isBreaking: true, limit: 50 }).then((results) => {
        setArticles(results);
        setLoading(false);
      });
    } else if (debouncedQuery.trim()) {
      setLoading(true);
      searchArticles(debouncedQuery).then((results) => {
        setArticles(results);
        setLoading(false);
      });
      // update URL query param dynamically
      router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    } else {
      setArticles([]);
      router.replace('/search');
    }
  }, [debouncedQuery, isBreakingType, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setQuery(nextVal);
    if (isBreakingType && nextVal.trim() !== '') {
      // Transition back to standard search since user is typing
      router.replace(`/search?q=${encodeURIComponent(nextVal)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col gap-1 mb-6">
        <button 
          onClick={() => router.push('/')} 
          className="text-gray-500 hover:text-red-700 transition-colors flex items-center gap-2 font-semibold text-sm group w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          హోమ్‌కి తిరిగి వెళ్ళండి / Go Back to Home
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {isBreakingType ? 'బ్రేకింగ్ న్యూస్ / Breaking News' : 'శోధన / Search'}
        </h1>
        <button 
          onClick={() => router.push('/')}
          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
          title="Close Search"
        >
          <X size={24} />
        </button>
      </div>
      
      {!isBreakingType && (
        <div className="relative mb-8 max-w-2xl">
          <input
            type="text"
            placeholder="వార్తలను శోధించండి... / Search articles in English or Telugu..."
            value={query}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all shadow-sm text-base"
          />
          {loading && (
            <div className="absolute right-4 top-3.5 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
            </div>
          )}
        </div>
      )}

      {debouncedQuery && !loading && articles.length === 0 && (
        <p className="text-gray-500 mb-8">"{debouncedQuery}" కోసం ఫలితాలు ఏవీ కనుగొనబడలేదు. / No results found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/news/${article.slug}`} className="group">
            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {article.featured_image && (article.featured_image.startsWith('http') || article.featured_image.startsWith('/')) ? (
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Image 
                      src="/websiteLogo.jpeg" 
                      alt="Mana Indur News" 
                      width={120} 
                      height={60} 
                      className="opacity-20 object-contain" 
                    />
                  </div>
                )}
                {article.category && (
                  <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 shadow-md">
                    {article.category.name}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-center text-xs text-gray-500 mb-2 gap-1">
                  <Clock size={14} />
                  <span>{new Date(article.created_at).toLocaleDateString('te-IN')}</span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 mb-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
