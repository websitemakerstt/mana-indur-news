'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Zap, Search, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  created_at: string;
  published_at: string | null;
  status: string;
  is_breaking: boolean;
  category?: {
    name: string;
  } | null;
}

export default function BreakingNewsAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      if (!res.ok) throw new Error('Failed to load articles');
      const data = await res.json();
      setArticles(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleToggleBreaking = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    const newStatus = !currentStatus;

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_breaking: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update article');
      }

      // Update state locally
      setArticles((prev) =>
        prev.map((art) => (art.id === id ? { ...art, is_breaking: newStatus } : art))
      );
      toast.success(newStatus ? 'Article added to Breaking News!' : 'Article removed from Breaking News.');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group breaking news and regular news
  const breakingArticles = filteredArticles.filter((a) => a.is_breaking);
  const regularArticles = filteredArticles.filter((a) => !a.is_breaking);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="text-red-600 animate-pulse" /> Breaking News Manager
        </h1>
        <p className="text-muted-foreground mt-1">
          Add or remove articles from the breaking news scrolling ticker on the homepage.
        </p>
      </div>

      {/* Breaking News Summary Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase text-red-800 dark:text-red-400 flex items-center gap-1.5">
              <Zap size={16} /> Active Tickers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-red-700 dark:text-red-400">
              {articles.filter((a) => a.is_breaking).length}
            </div>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
              Articles currently spinning on the home ticker.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30 col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
              <AlertCircle size={16} /> Quick Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-blue-800/90 dark:text-blue-400/90 leading-relaxed space-y-1">
            <p>1. Use the switches below to instantly add/remove articles to the homepage breaking news ticker.</p>
            <p>2. Keep it fresh: Try to limit breaking news to 3-5 of the most urgent recent stories.</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles by title to toggle breaking news status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-card border-border/80"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Breaking News List */}
          <Card className="border border-border/80">
            <CardHeader className="border-b border-border/60 bg-muted/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Badge className="bg-red-700 font-extrabold uppercase animate-pulse">LIVE NOW</Badge>
                Active Breaking News
              </CardTitle>
              <CardDescription>
                These stories are currently active on the ticker.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60 p-0">
              {breakingArticles.length > 0 ? (
                breakingArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                    <div className="space-y-1 pr-4">
                      <h3 className="font-bold text-gray-900 leading-snug">{article.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        {article.category?.name && (
                          <Badge variant="outline" className="text-[10px] py-0.5">
                            {article.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Switch
                        checked={article.is_breaking}
                        onCheckedChange={() => handleToggleBreaking(article.id, article.is_breaking)}
                        disabled={updatingId === article.id}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <Zap size={32} className="opacity-20 text-red-500" />
                  <p>No active breaking news articles found.</p>
                  <p className="text-xs">Use the list below or search to activate a story.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Regular News List */}
          <Card className="border border-border/80">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-lg font-bold">All Recent Articles</CardTitle>
              <CardDescription>
                Toggle the switch to elevate any of these stories to breaking news status.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60 p-0">
              {regularArticles.length > 0 ? (
                regularArticles.slice(0, 15).map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                    <div className="space-y-1 pr-4">
                      <h3 className="font-medium text-gray-900 leading-snug">{article.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        <Badge variant="secondary" className="text-[10px] py-0.5 capitalize">
                          {article.status}
                        </Badge>
                        {article.category?.name && (
                          <Badge variant="outline" className="text-[10px] py-0.5">
                            {article.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Switch
                        checked={article.is_breaking}
                        onCheckedChange={() => handleToggleBreaking(article.id, article.is_breaking)}
                        disabled={updatingId === article.id}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No other articles found matching search query.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
