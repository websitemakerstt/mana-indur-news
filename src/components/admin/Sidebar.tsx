'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  ListTree, 
  Zap, 
  LogOut,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Manage News', href: '/admin/news', icon: Newspaper },
  { label: 'Categories', href: '/admin/categories', icon: ListTree },
  { label: 'Breaking News', href: '/admin/breaking', icon: Zap },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await fetch('/api/admin/auth/logout', { method: 'POST' });
    if (res.ok) {
      toast.success('Logged out successfully');
      window.location.href = '/admin/login';
    }
  };

  if (pathname === '/admin/login') return null;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[998] lg:hidden animate-fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar drawer container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r flex flex-col z-[999] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:min-h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header Title with Mobile Close button */}
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold text-red-600 tracking-tight font-serif">Mana Indur Admin</h1>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          )}
        </div>

        {/* Navigation links list */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-semibold",
                  isActive 
                    ? "bg-red-50 text-red-600" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon size={18} className={cn("flex-shrink-0", isActive ? "text-red-600" : "text-gray-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 text-sm font-semibold"
            onClick={handleLogout}
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-red-600" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
