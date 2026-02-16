import { Metadata } from 'next';
import { Suspense } from 'react';
import LeadsTable from '@/components/admin/LeadsTable';

export const metadata: Metadata = {
  title: 'Lead Management | Admin',
  description: 'Manage and track leads from contact form submissions',
};

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Leads</h1>
        <p className="text-sm text-text-muted">
          Track and manage leads from contact form submissions
        </p>
      </div>

      <Suspense fallback={<LeadsTableSkeleton />}>
        <LeadsTable />
      </Suspense>
    </div>
  );
}

function LeadsTableSkeleton() {
  return (
    <div className="border border-border-default rounded-lg">
      <div className="p-5 border-b border-border-default">
        <div className="flex gap-3">
          <div className="h-9 bg-bg-subtle rounded-md w-40 animate-pulse" />
          <div className="h-9 bg-bg-subtle rounded-md w-40 animate-pulse" />
          <div className="h-9 bg-bg-subtle rounded-md w-28 animate-pulse ml-auto" />
        </div>
      </div>
      <div className="p-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-bg-subtle rounded-md mb-2 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
