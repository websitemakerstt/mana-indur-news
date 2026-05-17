'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicArticle } from '@/services/public-api';

interface PopularArticlesSectionProps {
  articles: PublicArticle[];
}

export function PopularArticlesSection({ articles }: PopularArticlesSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const articlesPerPage = 5;
  const maxArticles = 25;

  // Limit articles to maximum 25
  const limitedArticles = articles.slice(0, maxArticles);
  const totalPages = Math.ceil(limitedArticles.length / articlesPerPage);

  if (limitedArticles.length === 0) return null;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  // Get current page's articles
  const startIndex = currentPage * articlesPerPage;
  const pageArticles = limitedArticles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <section className="space-y-6 pt-10 border-t border-gray-200 mt-12 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-4">
        <h2 className="text-xl md:text-2xl font-bold font-heading border-l-4 border-red-700 pl-3 uppercase text-gray-900 tracking-tight">
          అత్యంత ప్రజాదరణ పొందిన వార్తలు / Most Popular News
        </h2>

        {/* Page counter summary */}
        {totalPages > 1 && (
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full w-fit">
            పేజీ / Page {currentPage + 1} of {totalPages}
          </div>
        )}
      </div>

      {/* Grid wrapper with horizontal layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 min-h-[310px] transition-all duration-300">
        {pageArticles.map((article) => {
          return (
            <Link key={article.id} href={`/news/${article.slug}`} className="group h-full flex flex-col relative">

              <Card className="overflow-hidden border border-border/60 bg-card hover:shadow-md hover:border-red-100 transition-all duration-300 h-full flex flex-col w-full rounded-xl">
                {/* Featured Image */}
                <div className="relative h-32 w-full overflow-hidden bg-muted">
                  {article.featured_image && (article.featured_image.startsWith('http') || article.featured_image.startsWith('/')) ? (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <Image src="/websiteLogo.jpeg" alt="Mana Indur" fill className="object-contain opacity-20 p-2" />
                    </div>
                  )}
                  {article.category && (
                    <Badge className="absolute top-2 left-2 bg-black/75 hover:bg-black/90 text-[9px] py-0 px-1 border-0">
                      {article.category.name}
                    </Badge>
                  )}
                </div>

                {/* Card Content */}
                <CardContent className="p-3 flex flex-col flex-1">
                  {/* View counter badge */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2 font-medium">
                    <span className="flex items-center gap-0.5">
                      <Clock size={11} className="text-gray-400" />
                      {new Date(article.created_at).toLocaleDateString('te-IN', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-0.5 text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                      <Eye size={11} />
                      {article.view_count || 0}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 font-heading text-xs group-hover:text-red-700 transition-colors line-clamp-3 mb-1 flex-1 leading-snug">
                    {article.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer hover:border-gray-300 disabled:hover:bg-white shadow-xs"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Bullet Indicators */}
          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageClick(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentPage === i 
                    ? 'bg-red-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Go to Page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer hover:border-gray-300 disabled:hover:bg-white shadow-xs"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
