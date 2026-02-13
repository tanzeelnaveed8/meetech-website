import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  updatedAt: Date | string;
  manager: {
    name: string;
  };
  _count: {
    milestones: number;
    files: number;
    changeRequests: number;
  };
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link href={`/client/projects/${project.id}`}>
      <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer overflow-hidden relative">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>

        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4 group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <StatusBadge status={project.status} type="project" />
        </div>

        <p className="text-sm text-gray-600 mb-5 line-clamp-2 min-h-[40px]">
          {truncateText(project.description, 120)}
        </p>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Progress</span>
            <span className="text-xs font-bold text-blue-600">{project.progress}%</span>
          </div>
          <ProgressBar progress={project.progress} showLabel={false} />
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <FiUser className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">{project.manager.name}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span className="text-xs">{format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span className="font-medium">{project._count.milestones} Milestones</span>
              <span className="text-gray-300">•</span>
              <span className="font-medium">{project._count.files} Files</span>
            </div>
            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
