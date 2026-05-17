'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
  category: { name: string } | null;
}

export default function NewsListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      toast.error('Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Article deleted successfully');
        fetchArticles();
      } else {
        toast.error('Failed to delete article');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage News</h1>
          <p className="text-gray-500">Create and edit news articles</p>
        </div>
        <Button 
          className="gap-2 bg-red-600 hover:bg-red-700" 
          render={<Link href="/admin/news/new" />}
          nativeButton={false}
        >
          <Plus size={18} />
          New Article
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading articles...</TableCell>
                </TableRow>
              ) : articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">No articles found</TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-md truncate">
                      {article.title}
                    </TableCell>
                    <TableCell>
                      {article.category?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(article.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" render={<Link href={`/news/${article.slug}`} target="_blank" />} title="View Public Page" nativeButton={false}>
                          <ExternalLink size={18} className="text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon" render={<Link href={`/admin/news/edit/${article.id}`} />} nativeButton={false}>
                          <Pencil size={18} className="text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                          <Trash2 size={18} className="text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
