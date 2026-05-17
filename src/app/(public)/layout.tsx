import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import { getCategories } from '@/services/public-api';
import { BreakingNewsPopup } from '@/components/news/BreakingNewsPopup';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" />
      <BreakingNewsPopup />
    </>
  );
}
