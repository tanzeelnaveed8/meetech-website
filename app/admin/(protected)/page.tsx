import { Metadata } from 'next';
import Link from 'next/link';
import { FiUsers, FiFolder, FiMessageSquare, FiFileText } from 'react-icons/fi';
import { prisma } from '@/lib/db/client';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Meetech',
  description: 'Project management dashboard',
};

async function getDashboardStats() {
  const [leadsCount, clientsCount, projectsCount, changeRequestsCount] = await Promise.all([
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.user.count({ where: { role: 'CLIENT', isActive: true } }),
    prisma.project.count({ where: { status: { in: ['PLANNING', 'IN_PROGRESS'] } } }),
    prisma.changeRequest.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    leads: leadsCount,
    clients: clientsCount,
    projects: projectsCount,
    changeRequests: changeRequestsCount,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Manage clients, projects, and change requests
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="New Leads"
          count={stats.leads}
          description="Pending inquiries"
          href="/admin/leads"
          icon={FiFileText}
          color="blue"
        />
        <StatCard
          title="Active Clients"
          count={stats.clients}
          description="Total clients"
          href="/admin/clients"
          icon={FiUsers}
          color="green"
        />
        <StatCard
          title="Active Projects"
          count={stats.projects}
          description="In progress"
          href="/admin/projects"
          icon={FiFolder}
          color="purple"
        />
        <StatCard
          title="Pending Requests"
          count={stats.changeRequests}
          description="Awaiting review"
          href="/admin/change-requests"
          icon={FiMessageSquare}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[#1E293B]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionButton
            href="/admin/clients/new"
            label="Create Client"
            description="Add a new client account"
          />
          <ActionButton
            href="/admin/projects/new"
            label="Create Project"
            description="Start a new project"
          />
          <ActionButton
            href="/admin/leads"
            label="View Leads"
            description="Check new inquiries"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  count,
  description,
  href,
  icon: Icon,
  color,
}: {
  title: string;
  count: number;
  description: string;
  href: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Link
      href={href}
      className="block bg-white border border-gray-200 rounded-xl p-6 transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#1E293B] mb-1">{count}</h3>
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
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
      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group"
    >
      <h4 className="text-sm font-semibold text-[#1E293B] mb-1 group-hover:text-gray-900">{label}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </Link>
  );
}
