import { Metadata } from 'next';
import { Suspense } from 'react';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Admin',
  description: 'View analytics and behavioral tracking data',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1E293B] mb-1">Analytics</h1>
        <p className="text-sm text-gray-600">
          Track user behavior and conversion metrics
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-5">
            <div className="h-3 bg-gray-100 rounded w-20 mb-2 animate-pulse" />
            <div className="h-7 bg-gray-100 rounded w-14 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="h-64 bg-gray-50 rounded animate-pulse" />
      </div>
    </div>
  );
}
