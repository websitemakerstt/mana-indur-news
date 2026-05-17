'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  articleId: string;
  initialViews: number;
}

export function ViewCounter({ articleId, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    let active = true;

    async function incrementAndFetchViews() {
      try {
        // 1. Insert a new record to trigger the DB increment
        const { error: insertError } = await supabase
          .from('article_views')
          .insert([{ article_id: articleId }]);

        if (insertError) {
          console.error('Error recording view:', insertError);
        }

        // 2. Fetch the fresh view count from articles table
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select('view_count')
          .eq('id', articleId)
          .single();

        if (fetchError) {
          console.error('Error fetching fresh views:', fetchError);
          return;
        }

        if (active && data) {
          setViews(data.view_count || 0);
        }
      } catch (err) {
        console.error('Failed to handle view counter increment:', err);
      }
    }

    incrementAndFetchViews();

    return () => {
      active = false;
    };
  }, [articleId]);

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-700 font-semibold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-xs">
      <Eye size={16} className="text-gray-500" />
      <span>{views}</span>
    </div>
  );
}
