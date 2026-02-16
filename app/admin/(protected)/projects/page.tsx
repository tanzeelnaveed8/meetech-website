import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getAllProjects } from '@/lib/db/queries/projects';
import Link from 'next/link';
import { FiPlus, FiFolder } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import Card from '@/components/ui/Card';

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user || !['ADMIN', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Projects</h1>
          <p className="text-sm text-text-muted">Manage all client projects</p>
        </div>
        {['ADMIN', 'EDITOR'].includes(session.user.role) && (
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-sm"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Project
          </Link>
        )}
      </div>

      <Card padding="none">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FiFolder className="w-12 h-12 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-muted">No projects yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle border-b border-border-default">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Milestones
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-bg-subtle transition-colors duration-150">
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-text-primary">{project.name}</div>
                      <div className="text-xs text-text-muted mt-0.5 truncate max-w-xs">
                        {project.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary">
                      {project.client.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary">
                      {project.manager.name}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={project.status} type="project" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-32">
                        <ProgressBar progress={project.progress} showLabel={false} height="sm" />
                        <span className="text-xs text-text-muted mt-1">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-muted">
                      {project._count.milestones}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm text-accent hover:text-accent-hover font-medium transition-colors duration-200"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
