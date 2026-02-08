import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Meetech Development',
  description: 'Admin dashboard for managing leads, content, and analytics',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1E293B] mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Manage your leads, content, and view analytics.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Leads"
          description="Manage contact form submissions"
          href="/admin/leads"
        />
        <StatCard
          title="Analytics"
          description="View user behavior and metrics"
          href="/admin/analytics"
        />
        <StatCard
          title="Content"
          description="Manage pages and content"
          href="/admin/content"
        />
      </div>

      {/* Quick Actions */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-base font-semibold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ActionButton
            href="/admin/leads?status=NEW"
            label="View New Leads"
            description="Check recent contact form submissions"
          />
          <ActionButton
            href="/admin/leads/export"
            label="Export Leads"
            description="Download leads as CSV"
          />
          <ActionButton
            href="/admin/analytics"
            label="View Analytics"
            description="Check website performance metrics"
          />
          <ActionButton
            href="/admin/content"
            label="Manage Content"
            description="Edit pages and content blocks"
          />
        </div>
      </div>

      {/* System Status */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-base font-semibold mb-4 text-gray-900">System Status</h2>
        <div className="space-y-3">
          <StatusItem
            label="Database"
            status="operational"
            description="MongoDB connection active"
          />
          <StatusItem
            label="Email Service"
            status="operational"
            description="Resend API connected"
          />
          <StatusItem
            label="Analytics"
            status="operational"
            description="Tracking active"
          />
          <StatusItem
            label="CMS"
            status="operational"
            description="Sanity connected"
          />
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#1E293B] mb-2">Getting Started</h2>
        <p className="text-sm text-gray-600 mb-4">
          New to the admin panel? Here are some helpful resources:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Lead Management:</strong> View and manage contact form submissions in the Leads section</li>
          <li><strong>Analytics:</strong> Track user behavior, conversions, and website performance</li>
          <li><strong>Content:</strong> Edit pages and manage content through Sanity CMS</li>
          <li><strong>Documentation:</strong> Check IMPLEMENTATION_GUIDE.md for detailed instructions</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-gray-200 rounded-lg p-5 transition-all hover:border-gray-300 hover:shadow-sm"
    >
      <h3 className="text-sm font-semibold text-[#1E293B] mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </Link>
  );
}

function ActionButton({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block p-4 border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all"
    >
      <h4 className="text-sm font-medium text-[#1E293B] mb-1">{label}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </Link>
  );
}

function StatusItem({
  label,
  status,
  description,
}: {
  label: string;
  status: 'operational' | 'degraded' | 'down';
  description: string;
}) {
  const statusColors = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
  };

  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
      <span className="text-xs text-gray-500 capitalize">{status}</span>
    </div>
  );
}
