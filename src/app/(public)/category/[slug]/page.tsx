import { getPublishedArticles, getCategories } from '@/services/public-api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} News`,
    description: `Latest news and updates from the ${category.name} category on Mana Indur News.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const articles = await getPublishedArticles({
    limit: 20,
    categorySlug: category.slug,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Header */}
      <div className="bg-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 uppercase">{category.name}</h1>
          <p className="text-red-100">{category.name} నుండి తాజా వార్తలు</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group h-full flex">
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col w-full">
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    {article.featured_image ? (
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <Image src="/websiteLogo.jpeg" alt="Mana Indur News" width={120} height={60} className="opacity-20 object-contain" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-1">
                      <Clock size={14} />
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 mb-3 leading-snug">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3 mt-auto">
                        {article.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">ఎలాంటి వార్తలు కనుగొనబడలేదు</h3>
            <p className="text-gray-500">ప్రస్తుతం ఈ కేటగిరీలో ఎలాంటి వార్తలు ప్రచురించబడలేదు.</p>
            <Link href="/">
              <span className="inline-block mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                హోమ్‌కి వెళ్లండి
              </span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
