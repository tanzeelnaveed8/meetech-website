import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getAllProjects } from '@/lib/db/queries/projects';
import Link from 'next/link';
import { FiPlus, FiFolder } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';

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
          <h1 className="text-2xl font-semibold text-[#1E293B] mb-1">Projects</h1>
          <p className="text-sm text-gray-600">Manage all client projects</p>
        </div>
        {['ADMIN', 'EDITOR'].includes(session.user.role) && (
          <Link
            href="/admin/projects/new"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1E293B] rounded-md hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Project
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FiFolder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No projects yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Milestones
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                        {project.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {project.client.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {project.manager.name}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={project.status} type="project" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-32">
                        <ProgressBar progress={project.progress} showLabel={false} height="sm" />
                        <span className="text-xs text-gray-600 mt-1">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {project._count.milestones}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm text-[#1E293B] hover:text-gray-600 font-medium"
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
      </div>
    </div>
  );
}
