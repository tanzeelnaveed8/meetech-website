'use client';

import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

interface OverviewData {
  totalEvents: number;
  totalSessions: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
}

interface ConversionFunnelData {
  stages: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

interface TopPagesData {
  pages: Array<{
    path: string;
    views: number;
  }>;
}

interface DeviceBreakdownData {
  devices: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

interface CTAPerformanceData {
  ctas: Array<{
    ctaId: string;
    clicks: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnelData | null>(null);
  const [topPages, setTopPages] = useState<TopPagesData | null>(null);
  const [deviceBreakdown, setDeviceBreakdown] = useState<DeviceBreakdownData | null>(null);
  const [ctaPerformance, setCTAPerformance] = useState<CTAPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const [overviewRes, funnelRes, pagesRes, devicesRes, ctaRes] = await Promise.all([
        fetch(`/api/analytics/reports?type=overview&${params}`),
        fetch(`/api/analytics/reports?type=conversion-funnel&${params}`),
        fetch(`/api/analytics/reports?type=top-pages&${params}`),
        fetch(`/api/analytics/reports?type=device-breakdown&${params}`),
        fetch(`/api/analytics/reports?type=cta-performance&${params}`),
      ]);

      if (!overviewRes.ok || !funnelRes.ok || !pagesRes.ok || !devicesRes.ok || !ctaRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [overviewData, funnelData, pagesData, devicesData, ctaData] = await Promise.all([
        overviewRes.json(),
        funnelRes.json(),
        pagesRes.json(),
        devicesRes.json(),
        ctaRes.json(),
      ]);

      setOverview(overviewData.report);
      setConversionFunnel(funnelData.report);
      setTopPages(pagesData.report);
      setDeviceBreakdown(devicesData.report);
      setCTAPerformance(ctaData.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setDateRange({
              startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
              endDate: format(new Date(), 'yyyy-MM-dd'),
            })}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange({
              startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
              endDate: format(new Date(), 'yyyy-MM-dd'),
            })}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Events"
            value={overview.totalEvents.toLocaleString()}
          />
          <StatCard
            title="Total Sessions"
            value={overview.totalSessions.toLocaleString()}
          />
          <StatCard
            title="Unique Visitors"
            value={overview.uniqueVisitors.toLocaleString()}
          />
          <StatCard
            title="Avg Session Duration"
            value={formatDuration(overview.avgSessionDuration)}
          />
        </div>
      )}

      {/* Conversion Funnel */}
      {conversionFunnel && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold mb-4 text-gray-900">Conversion Funnel</h2>
          <div className="space-y-4">
            {conversionFunnel.stages.map((stage, index) => (
              <div key={stage.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                  <span className="text-sm text-gray-600">
                    {stage.count.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-gray-900' :
                      index === 1 ? 'bg-gray-700' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        {topPages && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold mb-4 text-gray-900">Top Pages</h2>
            <div className="space-y-3">
              {topPages.pages.map((page) => (
                <div key={page.path} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate flex-1">{page.path}</span>
                  <span className="text-sm font-medium text-gray-900 ml-4">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              ))}
              {topPages.pages.length === 0 && (
                <p className="text-sm text-gray-500">No page views yet</p>
              )}
            </div>
          </div>
        )}

        {/* Device Breakdown */}
        {deviceBreakdown && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold mb-4 text-gray-900">Device Breakdown</h2>
            <div className="space-y-4">
              {deviceBreakdown.devices.map((device) => (
                <div key={device.type}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {device.type}
                    </span>
                    <span className="text-sm text-gray-600">
                      {device.count.toLocaleString()} ({device.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              {deviceBreakdown.devices.length === 0 && (
                <p className="text-sm text-gray-500">No device data yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA Performance */}
      {ctaPerformance && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold mb-4 text-gray-900">CTA Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CTA ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ctaPerformance.ctas.map((cta) => (
                  <tr key={cta.ctaId}>
                    <td className="px-4 py-3 text-sm text-gray-900">{cta.ctaId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {cta.clicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {ctaPerformance.ctas.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-sm text-gray-500 text-center">
                      No CTA clicks yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="text-xs font-medium text-gray-600 mb-2">{title}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}
