'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Clock, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BreakingArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
  category?: {
    name: string;
  };
}

export function BreakingNewsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [article, setArticle] = useState<BreakingArticle | null>(null);

  useEffect(() => {
    // Show only once per browser session to maintain high UX standard
    const hasSeenPopup = sessionStorage.getItem('hasSeenBreakingPopup');
    if (hasSeenPopup) return;

    let active = true;

    async function fetchLatestBreakingNews() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            created_at,
            category:categories(name)
          `)
          .eq('status', 'published')
          .eq('is_breaking', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching breaking news popup:', error);
          return;
        }

        if (active && data && data.length > 0) {
          setArticle(data[0] as any);
          
          // Trigger popup after exactly 5 seconds
          const timer = setTimeout(() => {
            if (active) {
              setIsOpen(true);
              setIsRendered(true);
              sessionStorage.setItem('hasSeenBreakingPopup', 'true');
            }
          }, 5000);

          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error('Failed to trigger breaking news popup:', err);
      }
    }

    fetchLatestBreakingNews();

    return () => {
      active = false;
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remove from DOM after transition finishes
    setTimeout(() => {
      setIsRendered(false);
    }, 300);
  };

  if (!isRendered || !article) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out bg-black/60 backdrop-blur-xs ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`bg-white w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative flex flex-col max-h-[92vh] md:max-h-[90vh] transition-all duration-300 ease-out transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Top Header Alert Panel */}
        <div className="bg-red-600 text-white px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-bold text-xs uppercase tracking-wider font-heading">
              బ్రేకింగ్ న్యూస్ / BREAKING NEWS
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none cursor-pointer"
            title="Close Alert"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 min-h-0">
          {/* Featured Image */}
          {article.featured_image && (article.featured_image.startsWith('http') || article.featured_image.startsWith('/')) && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm mb-4">
              <Image 
                src={article.featured_image} 
                alt={article.title} 
                fill 
                sizes="(max-width: 512px) 100vw, 512px"
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-3">
            {/* Meta category & time */}
            <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold">
              {article.category && (
                <span className="text-red-600 font-bold bg-red-50 px-2.5 py-0.5 rounded-full">
                  {article.category.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-gray-400" />
                {new Date(article.created_at).toLocaleDateString('te-IN')}
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-lg md:text-xl font-bold font-heading text-gray-900 leading-snug hover:text-red-600 transition-colors">
              <Link href={`/news/${article.slug}`} onClick={handleClose}>
                {article.title}
              </Link>
            </h3>

            {/* Description excerpt */}
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {article.excerpt || "తాజా సమాచారం కోసం పూర్తి వార్తను ఇప్పుడే చదవండి..."}
            </p>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="px-6 pb-6 pt-2 flex-shrink-0">
          <Link 
            href={`/news/${article.slug}`} 
            onClick={handleClose} 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-center py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 tracking-wide cursor-pointer group"
          >
            <span>పూర్తి కథనం చదవండి / Read Full Story</span>
            <Play size={14} className="fill-current transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
