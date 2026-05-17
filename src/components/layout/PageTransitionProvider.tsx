'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function PageTransitionLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  // 1. Listen for pathname / searchParams change to mark loading as finished
  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setShowSpinner(false);
      }, 300); // Allow fade out transition
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // 2. Intercept global link clicks
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      // Find the closest parent anchor tag
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');

      // Skip special/external/fragment links
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target === '_blank' ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      // Check if it is a local internal path
      try {
        const url = new URL(href, window.location.href);
        const isInternal = url.origin === window.location.origin;
        const isDifferentPath = url.pathname !== window.location.pathname || url.search !== window.location.search;

        if (isInternal && isDifferentPath) {
          // Reset progress and start loading
          setIsLoading(true);
          setProgress(10);
          setShowSpinner(false);
        }
      } catch (e) {
        // Invalid URL structure, ignore
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // 3. Simulated progress increments
  useEffect(() => {
    if (!isLoading) return;

    // Fast initial climb, slow near the end
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Hold at 90% until page resolves
        const increment = Math.max(1, (90 - prev) / 6); // Natural logarithmic ease
        return prev + increment;
      });
    }, 120);

    // Show spinner if loading takes more than 150ms
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true);
    }, 150);

    return () => {
      clearInterval(timer);
      clearTimeout(spinnerTimer);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <>
      {/* Top red loading bar */}
      <div 
        className="fixed top-0 left-0 h-[3.5px] bg-gradient-to-r from-red-600 via-orange-500 to-red-700 z-[9999] transition-all duration-300 ease-out shadow-[0_1px_8px_rgba(239,68,68,0.5)]"
        style={{ width: `${progress}%` }}
      />

      {/* Screen blur + simple circle loader overlay */}
      {showSpinner && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1.5px] z-[9998] flex items-center justify-center animate-fade-in-loader">
          <style>{`
            @keyframes fadeInLoader {
              from { opacity: 0; backdrop-filter: blur(0px); }
              to { opacity: 1; backdrop-filter: blur(1.5px); }
            }
            .animate-fade-in-loader {
              animation: fadeInLoader 0.25s ease-out forwards;
            }
          `}</style>
          {/* Simple high-fidelity circle loader */}
          <div className="animate-spin rounded-full h-10 w-10 border-[3.5px] border-red-100 border-t-red-600 shadow-sm"></div>
        </div>
      )}
    </>
  );
}

export function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionLoaderInner />
    </Suspense>
  );
}
