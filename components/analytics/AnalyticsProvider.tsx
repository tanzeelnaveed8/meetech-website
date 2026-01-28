'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, initScrollTracking } from '@/lib/analytics/tracker';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on mount and route change
    trackPageView();
  }, [pathname]);

  useEffect(() => {
    // Initialize scroll tracking
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);

  return <>{children}</>;
}
