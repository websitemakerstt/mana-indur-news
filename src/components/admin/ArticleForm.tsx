'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TiptapEditor } from './TiptapEditor';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
}

interface ArticleFormProps {
  initialData?: any;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featured_image: initialData?.featured_image || '',
    category_id: initialData?.category_id || '',
    status: initialData?.status || 'draft',
    is_breaking: initialData?.is_breaking || false,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    author: initialData?.author || 'KARKA RAMESH',
    source_link: initialData?.source_link || '',
  });

  const featuredImageInputRef = useRef<HTMLInputElement>(null);

  const handleFeaturedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = ''; // Reset input

    const toastId = toast.loading('Uploading image...');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await res.json();
      setFormData({ ...formData, featured_image: data.url });
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image', { id: toastId });
    }
  };

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Failed to load categories. API returned:', data);
          if (data.message && data.message.includes('fetch failed')) {
            console.error('This usually means Supabase credentials are missing or invalid in your .env.local file.');
          }
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error('Categories fetch error:', err);
        setCategories([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check mandatory fields
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Short Description (Excerpt) is required');
      return;
    }
    if (!formData.content.trim() || formData.content === '<p></p>') {
      toast.error('Content is required');
      return;
    }
    if (!formData.category_id) {
      toast.error('Category is required');
      return;
    }
    if (!formData.featured_image.trim()) {
      toast.error('Featured Image is required');
      return;
    }

    setIsLoading(true);

    try {
      const method = initialData ? 'PUT' : 'POST';
      const body = initialData ? { ...formData, id: initialData.id } : formData;

      const res = await fetch('/api/admin/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(`Article ${initialData ? 'updated' : 'created'} successfully`);
        router.push('/admin/news');
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to save article');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    if (!initialData) {
      // Only generate slug for new articles so we don't break existing URLs
      let baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      // If title is entirely non-English (like Telugu), baseSlug will be empty
      if (!baseSlug) baseSlug = 'article';
      
      // Add a unique ID to prevent collisions
      const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
      setFormData({ ...formData, title, slug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (Telugu/English)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Short Description (Excerpt)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <TiptapEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(status) => setFormData({ ...formData, status })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_breaking">Is Breaking News?</Label>
              <Switch
                id="is_breaking"
                checked={formData.is_breaking}
                onCheckedChange={(checked) => setFormData({ ...formData, is_breaking: checked })}
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Article'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(category_id) => setFormData({ ...formData, category_id })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category">
                    {categories.find(c => c.id === formData.category_id)?.name || "Select category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="Upload or paste URL"
                  className="flex-1"
                />
                <input 
                  type="file" 
                  ref={featuredImageInputRef} 
                  onChange={handleFeaturedImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => featuredImageInputRef.current?.click()}
                  className="shrink-0"
                >
                  <Upload size={16} className="mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_link">Source Link (Optional)</Label>
              <Input
                id="source_link"
                value={formData.source_link}
                onChange={(e) => setFormData({ ...formData, source_link: e.target.value })}
                placeholder="e.g. https://example.com/original-story"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
