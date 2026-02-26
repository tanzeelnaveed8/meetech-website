import { auth } from '@/lib/auth/auth';
import { getProjectsByClient } from '@/lib/db/queries/projects';
import ProjectCard from '@/components/client/ProjectCard';
import { FiFolder, FiClock, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import type { IconType } from 'react-icons';

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/client/login');
  }

  const projects = await getProjectsByClient(session.user.id);

  const activeProjects = projects.filter(p => ['PLANNING', 'IN_PROGRESS'].includes(p.status));
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');

  const firstName = session.user.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-accent p-7 sm:p-8 shadow-lg">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px, 40px 40px' }} />
        <div className="relative z-10">
          <p className="text-text-inverse/70 text-sm font-medium mb-1">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-inverse tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-text-inverse/80 mt-1.5 text-sm sm:text-base max-w-lg">
            Track your projects, upload requirements, and schedule meetings — all from one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href="/client/book-meeting"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 text-text-inverse text-sm font-medium hover:bg-white/25 transition-colors"
            >
              Book a Meeting <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard icon={FiFolder} label="Total Projects" value={projects.length} color="blue" />
        <StatCard icon={FiClock} label="In Progress" value={activeProjects.length} color="orange" />
        <StatCard icon={FiCheckCircle} label="Completed" value={completedProjects.length} color="green" />
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Your Projects
          </h2>
          {projects.length > 0 && (
            <span className="text-xs font-semibold text-text-muted bg-bg-subtle px-3 py-1 rounded-full border border-border-default">
              {projects.length} total
            </span>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border-default bg-bg-card">
            <div className="w-16 h-16 bg-accent-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiFolder className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1.5">
              No projects yet
            </h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              Your projects will appear here once they are assigned to you by your project manager.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: IconType;
  label: string;
  value: number;
  color: 'blue' | 'orange' | 'green';
}) {
  const styles = {
    blue: {
      icon: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
      value: 'text-blue-600 dark:text-blue-400',
    },
    orange: {
      icon: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
      value: 'text-orange-600 dark:text-orange-400',
    },
    green: {
      icon: 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400',
      value: 'text-green-600 dark:text-green-400',
    },
  };

  return (
    <Card hoverable className="group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${styles[color].icon} transition-transform group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className={`text-2xl font-bold ${styles[color].value}`}>{value}</p>
          <p className="text-xs font-medium text-text-muted mt-0.5">{label}</p>
        </div>
      </div>
    </Card>
  );
}
