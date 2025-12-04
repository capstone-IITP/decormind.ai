'use client';

import { useEffect, useRef, Suspense, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Inner component that uses useSearchParams
function TopLoaderContent({
  color = '#22d3ee',
  height = 3,
  showSpinner = true,
  shadow = true,
  zIndex = 1600,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef('');
  const timersRef = useRef([]);
  const isNavigatingRef = useRef(false);
  const progressBarRef = useRef(null);
  const spinnerRef = useRef(null);
  const completedRef = useRef(false);

  // Clear all timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  // Function to complete loading animation
  const completeLoading = useCallback(() => {
    if (!isNavigatingRef.current || completedRef.current) return;

    completedRef.current = true;

    if (progressBarRef.current) {
      progressBarRef.current.style.width = '100%';

      const timer = setTimeout(() => {
        if (progressBarRef.current) {
          progressBarRef.current.style.display = 'none';
          progressBarRef.current.style.width = '0%';
        }

        if (spinnerRef.current) {
          spinnerRef.current.style.display = 'none';
        }

        isNavigatingRef.current = false;
        completedRef.current = false;
      }, 300);

      timersRef.current.push(timer);
    }
  }, []);

  // Function to start loading animation
  const startLoading = useCallback(() => {
    // Don't start if already navigating
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;
    completedRef.current = false;
    clearTimers();

    // Show progress bar and set initial progress
    if (progressBarRef.current) {
      progressBarRef.current.style.display = 'block';
      progressBarRef.current.style.width = '10%';
    }

    // Show spinner if enabled
    if (showSpinner && spinnerRef.current) {
      spinnerRef.current.style.display = 'block';
    }

    // Simulate progress
    const timer1 = setTimeout(() => {
      if (progressBarRef.current && isNavigatingRef.current && !completedRef.current) {
        progressBarRef.current.style.width = '30%';
      }
    }, 100);

    const timer2 = setTimeout(() => {
      if (progressBarRef.current && isNavigatingRef.current && !completedRef.current) {
        progressBarRef.current.style.width = '50%';
      }
    }, 300);

    const timer3 = setTimeout(() => {
      if (progressBarRef.current && isNavigatingRef.current && !completedRef.current) {
        progressBarRef.current.style.width = '70%';
      }
    }, 600);

    const timer4 = setTimeout(() => {
      if (progressBarRef.current && isNavigatingRef.current && !completedRef.current) {
        progressBarRef.current.style.width = '90%';
      }
    }, 900);

    // Force complete loading after a timeout
    const timer5 = setTimeout(() => {
      if (isNavigatingRef.current && !completedRef.current) {
        completeLoading();
      }
    }, 2000);

    timersRef.current = [timer1, timer2, timer3, timer4, timer5];
  }, [showSpinner, clearTimers, completeLoading]);

  // Track route changes
  useEffect(() => {
    const currentPath = pathname + searchParams.toString();

    // Only trigger loading if the path has changed
    if (currentPath !== prevPathRef.current && prevPathRef.current !== '') {
      startLoading();

      // Force complete the loading after navigation
      const forceCompleteTimer = setTimeout(() => {
        if (isNavigatingRef.current && !completedRef.current) {
          completeLoading();
        }
      }, 1000);

      timersRef.current.push(forceCompleteTimer);
    }

    // Update previous path
    prevPathRef.current = currentPath;

    // Clean up timers on unmount
    return () => clearTimers();
  }, [pathname, searchParams, showSpinner, startLoading, completeLoading]);

  // Add global event listeners for navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Intercept link clicks for regular links
      const handleLinkClick = (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');

        // ✅ FIXED: Use Regex for case-insensitive "javascript:" check
        // This satisfies the Snyk XSS warning by catching "JaVaScRiPt:", " javascript:", etc.
        if (href &&
          !href.startsWith('#') &&
          !/^\s*javascript:/i.test(href) &&
          !link.hasAttribute('download') &&
          !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          startLoading();
        }
      };

      // Listen for popstate events (back/forward navigation)
      const handlePopState = () => {
        startLoading();
      };

      document.addEventListener('click', handleLinkClick);
      window.addEventListener('popstate', handlePopState);

      // Listen for page load complete
      window.addEventListener('load', completeLoading);

      return () => {
        document.removeEventListener('click', handleLinkClick);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('load', completeLoading);
        clearTimers();
      };
    }
  }, [startLoading, completeLoading, clearTimers]);

  return (
    <>
      <div
        ref={progressBarRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: `${height}px`,
          width: '0%',
          backgroundColor: color,
          transition: 'width 300ms ease-in-out',
          zIndex,
          boxShadow: shadow ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none',
          display: 'none',
        }}
      />
      {showSpinner && (
        <div
          ref={spinnerRef}
          style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex,
            border: `2px solid ${color}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            animation: 'nprogress-spinner 400ms linear infinite',
            display: 'none',
          }}
        />
      )}
      <style jsx global>{`
        @keyframes nprogress-spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

export default function NextTopLoader(props) {
  return (
    <Suspense fallback={null}>
      <TopLoaderContent {...props} />
    </Suspense>
  );
}
