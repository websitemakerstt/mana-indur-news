'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Copy, Check, FileImage, Trash2, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface MediaItem {
  url: string;
  source: string;
  articleTitle?: string;
}

export default function MediaLibraryAdmin() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchExistingMedia = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      if (!res.ok) throw new Error('Failed to load media source');
      const data = await res.json();
      
      // Parse images from all articles
      const items: MediaItem[] = [];
      const seenUrls = new Set<string>();

      if (Array.isArray(data)) {
        data.forEach((article: any) => {
          if (article.featured_image && typeof article.featured_image === 'string') {
            const url = article.featured_image;
            if (!seenUrls.has(url)) {
              seenUrls.add(url);
              items.push({
                url,
                source: 'Article Cover',
                articleTitle: article.title
              });
            }
          }
        });
      }

      // Check localStorage for session uploads to supplement the list
      try {
        const localUploads = JSON.parse(localStorage.getItem('news_media_uploads') || '[]');
        localUploads.forEach((url: string) => {
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            items.push({
              url,
              source: 'Uploaded recently',
            });
          }
        });
      } catch (e) {
        console.error('Failed to parse local uploads', e);
      }

      setMediaItems(items);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingMedia();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = ''; // Reset input
    setUploading(true);
    const toastId = toast.loading('Uploading media file to R2 Cloud Storage...');

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
      const newUrl = data.url;

      // Update state
      const newItem: MediaItem = {
        url: newUrl,
        source: 'Uploaded recently',
      };

      setMediaItems((prev) => [newItem, ...prev]);

      // Save to localStorage for persistence
      try {
        const localUploads = JSON.parse(localStorage.getItem('news_media_uploads') || '[]');
        localStorage.setItem('news_media_uploads', JSON.stringify([newUrl, ...localUploads]));
      } catch (e) {}

      toast.success('File uploaded successfully!', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredItems = mediaItems.filter((item) =>
    item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.articleTitle && item.articleTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileImage className="text-red-600" /> Media Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload images to Cloudflare R2 and copy their URLs for use in article content or featured cover images.
          </p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-red-700 hover:bg-red-800 flex items-center gap-2"
          >
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </div>

      {/* Upload Drag and Drop Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border/80 rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer group bg-card"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-4 rounded-full bg-red-50 text-red-700 group-hover:scale-105 transition-transform">
            <Upload size={32} />
          </div>
          <h3 className="font-bold text-lg mt-2 text-gray-900">Drag & drop your image here</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Supports PNG, JPEG, GIF, and WEBP formats up to 5MB.
          </p>
        </div>
      </div>

      {/* Search and Library Grid */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by URL or article title..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <Card key={index} className="overflow-hidden border border-border/60 hover:shadow-md transition-shadow group flex flex-col h-full bg-card">
                  <div className="relative h-44 w-full bg-muted flex items-center justify-center overflow-hidden">
                    {item.url.startsWith('http') || item.url.startsWith('/') ? (
                      <Image
                        src={item.url}
                        alt="Media upload"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="text-muted-foreground text-xs p-4 break-all text-center">
                        {item.url}
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-[10px]">
                      {item.source}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1">
                      {item.articleTitle && (
                        <p className="text-[10px] font-semibold text-red-800 dark:text-red-400 truncate uppercase">
                          Used in: {item.articleTitle}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono truncate break-all select-all">
                        {item.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyUrl(item.url)}
                        className="flex-1 text-xs gap-1"
                      >
                        {copiedUrl === item.url ? (
                          <>
                            <Check size={14} className="text-green-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy URL
                          </>
                        )}
                      </Button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-secondary hover:bg-muted text-gray-700 rounded-md transition-colors"
                        title="View Full Image"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <FileImage size={48} className="opacity-20" />
                <p className="font-medium text-lg">No media files found</p>
                <p className="text-sm">Upload new images to populate the media library.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
