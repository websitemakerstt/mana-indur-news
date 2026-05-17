import { ArticleForm } from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Article</h1>
        <p className="text-gray-500">Publish a new news story</p>
      </div>
      <ArticleForm />
    </div>
  );
}
