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
      setIsScrolled(window.scrollY > 130);
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
    <>
      {/* Mobile Big Logo Banner (part of normal scroll flow, scrolls away naturally) */}
      <div className="lg:hidden w-full flex justify-center bg-white py-4 border-b border-gray-100">
        <Link href="/" className="relative h-[100px] w-[100px] block">
          <Image
            src="/websiteLogo.jpeg"
            alt="Mana Indur News"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Sticky Header (Sticks perfectly to the top of the body viewport) */}
      <header className={cn(
        "w-full z-50 sticky top-0 transition-all duration-300 border-b border-border/80 bg-white",
        isScrolled ? "shadow-md py-2" : "shadow-sm py-3"
      )}>
        <div className="w-full pl-[10px] pr-4 md:pr-8 flex items-center justify-between">
          {/* Mobile Left Hamburger (visible only on mobile at the top of the page) */}
          <Button
            variant="ghost"
            className={cn(
              "lg:hidden h-11 w-11 p-0 flex items-center justify-center rounded-lg hover:bg-gray-100",
              isScrolled ? "hidden" : "flex"
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>

          {/* Logo (always visible on desktop; on mobile, only when page is scrolled) */}
          <Link href="/" className={cn(
            "flex items-center gap-2 transition-all duration-300",
            !isScrolled ? "hidden lg:flex" : "flex"
          )}>
            <div className={cn(
              "relative transition-all duration-300",
              isScrolled ? "h-12 w-48" : "h-16 w-64"
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
            {/* Search Button */}
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

            {/* Mobile Right Hamburger (visible on mobile only when page is scrolled) */}
            <Button
              variant="ghost"
              className={cn(
                "lg:hidden h-11 w-11 p-0 items-center justify-center rounded-lg hover:bg-gray-100",
                isScrolled ? "flex" : "hidden"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu (nested inside the sticky bar so it remains accessible when open) */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b absolute w-full left-0 z-50 shadow-xl max-h-[calc(100vh-60px)] overflow-y-auto">
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
    </>
  );
}
