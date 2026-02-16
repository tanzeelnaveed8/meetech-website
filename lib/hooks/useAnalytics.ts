'use client';

import { useState, useEffect } from 'react';

interface AnalyticsReport {
  overview?: any;
  conversionFunnel?: any;
  topPages?: any;
  deviceBreakdown?: any;
  ctaPerformance?: any;
}

/**
 * Custom hook for fetching analytics reports
 */
export function useAnalytics(
  reportType: string,
  startDate: Date,
  endDate: Date
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [reportType, startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        type: reportType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/analytics/reports?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics report');
      }

      const result = await response.json();
      setData(result.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchReport();
  };

  return { data, loading, error, refetch };
}

/**
 * Custom hook for tracking page views
 */
export function usePageTracking() {
  useEffect(() => {
    // Track page view on mount
    if (typeof window !== 'undefined') {
      const { trackPageView } = require('@/lib/analytics/tracker');
      trackPageView();
    }
  }, []);
}

/**
 * Custom hook for scroll depth tracking
 */
export function useScrollTracking() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { initScrollTracking } = require('@/lib/analytics/tracker');
      const cleanup = initScrollTracking();
      return cleanup;
    }
  }, []);
}

/**
 * Custom hook for managing analytics consent
 */
export function useAnalyticsConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check stored consent on mount
    const stored = localStorage.getItem('analytics_consent');
    if (stored !== null) {
      setConsent(stored === 'true');
    }
  }, []);

  const grantConsent = () => {
    const { setAnalyticsConsent } = require('@/lib/analytics/tracker');
    setAnalyticsConsent(true);
    setConsent(true);
  };

  const denyConsent = () => {
    const { setAnalyticsConsent } = require('@/lib/analytics/tracker');
    setAnalyticsConsent(false);
    setConsent(false);
  };

  return { consent, grantConsent, denyConsent };
}
