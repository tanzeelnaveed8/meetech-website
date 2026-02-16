import { auth } from '@/lib/auth/auth';
import { getProjectsByClient } from '@/lib/db/queries/projects';
import ProjectCard from '@/components/client/ProjectCard';
import { FiFolder, FiClock, FiCheckCircle } from 'react-icons/fi';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import type { IconType } from 'react-icons';

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/client/login');
  }

  const projects = await getProjectsByClient(session.user.id);

  const activeProjects = projects.filter(p => ['PLANNING', 'IN_PROGRESS'].includes(p.status));
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-accent p-8 text-text-inverse shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-text-inverse/80">
          Track your projects and stay updated on progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FiFolder}
          label="Total Projects"
          value={projects.length}
          color="blue"
        />
        <StatCard
          icon={FiClock}
          label="In Progress"
          value={activeProjects.length}
          color="orange"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Completed"
          value={completedProjects.length}
          color="green"
        />
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Your Projects</h2>

        {projects.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border-default bg-bg-card">
            <div className="w-20 h-20 bg-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFolder className="w-10 h-10 text-text-disabled" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No projects yet
            </h3>
            <p className="text-text-muted max-w-md mx-auto">
              Your projects will appear here once they are assigned to you by your project manager.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400',
  };

  return (
    <Card hoverable>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
      <p className="text-sm text-text-muted">{label}</p>
    </Card>
  );
}
