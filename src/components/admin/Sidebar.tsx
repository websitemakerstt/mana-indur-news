'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  ListTree, 
  Zap, 
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Manage News', href: '/admin/news', icon: Newspaper },
  { label: 'Categories', href: '/admin/categories', icon: ListTree },
  { label: 'Breaking News', href: '/admin/breaking', icon: Zap },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/admin/auth/logout', { method: 'POST' });
    if (res.ok) {
      toast.success('Logged out successfully');
      window.location.href = '/admin/login';
    }
  };

  if (pathname === '/admin/login') return null;

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-red-600">Mana Indur Admin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive 
                  ? "bg-red-50 text-red-600" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
