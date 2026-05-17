import { ArticleForm } from '@/components/admin/ArticleForm';
import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Article</h1>
        <p className="text-gray-500">Modify existing news story</p>
      </div>
      <ArticleForm initialData={article} />
    </div>
  );
}
