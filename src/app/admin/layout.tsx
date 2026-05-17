'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row relative">
      {/* Sidebar Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top sticky navigation bar */}
        {!isLoginPage && (
          <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b px-4 py-3 h-14 shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="h-9 w-9 text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <Menu size={20} />
              </Button>
              <span className="font-serif font-bold text-red-600 text-base">Mana Indur Admin</span>
            </div>
            <div className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Staff Portal
            </div>
          </header>
        )}

        {/* Content Pane */}
        <main className={`flex-1 p-4 md:p-6 lg:p-8 min-w-0 ${isLoginPage ? '' : 'pt-6 lg:pt-8'}`}>
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
