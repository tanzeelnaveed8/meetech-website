import { Metadata } from 'next';
import Link from 'next/link';
import { FiUsers, FiFolder, FiMessageSquare, FiFileText, FiArrowRight } from 'react-icons/fi';
import { prisma } from '@/lib/db/client';
import Card from '@/components/ui/Card';
import type { IconType } from 'react-icons';

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
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-muted">
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
      <Card>
        <h2 className="text-lg font-semibold mb-4 text-text-primary">Quick Actions</h2>
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
      </Card>
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
  icon: IconType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
  };

  return (
    <Link href={href}>
      <Card hoverable className="group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <FiArrowRight className="w-4 h-4 text-text-disabled group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-1">{count}</h3>
        <p className="text-sm font-medium text-text-primary mb-1">{title}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </Card>
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
      className="block p-4 border border-border-default rounded-lg hover:border-accent hover:bg-accent-muted transition-all duration-200 group"
    >
      <h4 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-accent">{label}</h4>
      <p className="text-xs text-text-muted">{description}</p>
    </Link>
  );
}
