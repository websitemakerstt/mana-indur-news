'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Header({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={cn(
      "w-full z-50 sticky top-0 transition-all duration-300 border-b border-border/80 bg-white",
      isScrolled ? "shadow-md py-2" : "shadow-sm py-4"
    )}>
      <div className="w-full pl-[10px] pr-4 md:pr-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className={cn(
            "relative transition-all duration-300",
            isScrolled ? "h-16 w-64" : "h-20 w-72"
          )}>
            <Image
              src="/websiteLogo.jpeg"
              alt="Mana Indur News"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="font-bold hover:text-red-600 transition-colors">HOME</Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="font-bold hover:text-red-600 transition-colors uppercase text-sm"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              if (pathname === '/search') {
                router.push('/');
              } else {
                router.push('/search');
              }
            }}
            className="h-11 w-11 p-0 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            {pathname === '/search' ? <X size={24} className="text-red-600 animate-pulse" /> : <Search size={24} />}
          </Button>
          <Button
            variant="ghost"
            className="lg:hidden h-11 w-11 p-0 flex items-center justify-center rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b absolute w-full z-50 shadow-xl">
          <nav className="flex flex-col p-4">
            <Link
              href="/"
              className="py-3 border-b font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="py-3 border-b font-bold uppercase text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
