import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import Card from '@/components/ui/Card';

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
      <Card hoverable className="group relative overflow-hidden border-white/15 bg-gradient-to-br from-slate-900/80 to-slate-900/55 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_40%)]" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-text-primary flex-1 pr-0 sm:pr-4 group-hover:text-accent transition-colors duration-200 break-words">
            {project.name}
          </h3>
          <StatusBadge status={project.status} type="project" />
        </div>

        <p className="text-sm text-text-muted mb-5 line-clamp-2 min-h-[40px]">
          {truncateText(project.description, 120)}
        </p>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-muted">Progress</span>
            <span className="text-xs font-bold text-accent">{project.progress}%</span>
          </div>
          <ProgressBar progress={project.progress} showLabel={false} />
        </div>

        <div className="space-y-3 pt-4 border-t border-border-default">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
            <div className="flex items-center text-text-muted">
              <FiUser className="w-4 h-4 mr-2 text-text-disabled" />
              <span className="font-medium">{project.manager.name}</span>
            </div>
            <div className="flex items-center text-text-muted">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span className="text-xs">{format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-2 text-[11px] text-text-muted flex-wrap">
              <span className="rounded-full border border-white/10 bg-slate-800/70 px-2 py-1 font-medium">
                {project._count.milestones} Milestones
              </span>
              <span className="rounded-full border border-white/10 bg-slate-800/70 px-2 py-1 font-medium">
                {project._count.files} Files
              </span>
              <span className="rounded-full border border-white/10 bg-slate-800/70 px-2 py-1 font-medium">
                {project._count.changeRequests} Requests
              </span>
            </div>
            <FiArrowRight className="w-5 h-5 text-text-disabled group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
