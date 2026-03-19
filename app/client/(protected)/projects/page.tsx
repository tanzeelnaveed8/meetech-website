import { auth } from '@/lib/auth/auth';
import { getProjectsByClient } from '@/lib/db/queries/projects';
import ProjectCard from '@/components/client/ProjectCard';
import { FiFolder, FiArrowRight, FiFilter, FiPlus } from 'react-icons/fi';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Spinner from "@/components/ui/Spinner"


interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  updatedAt: Date | string;
  expectedEndDate?: Date | string | null; 
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

export default async function ProjectsPage() {
  const session = await auth();



  if (!session?.user?.id) {
    redirect('/client/login');
  }

  const projects = await getProjectsByClient(session.user.id);

  const activeProjects = projects.filter(p => ['PLANNING', 'IN_PROGRESS'].includes(p.status));
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');

  const firstName = session.user.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8 p-4 md:p-10">
            {/* Projects Overview Banner */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-4 lg:mb-10">

        <nav className="flex text-text-muted p-2 rounded-lg border border-accent/15 bg-accent/10" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a href="/" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
                <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /></svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                <a href="#" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">Client</a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                <span className="inline-flex items-center text-sm font-medium text-body-subtle">Your Projects</span>
              </div>
            </li>
          </ol>
        </nav>

      </div>
            <div className="relative overflow-hidden  mt-16">
                 {/* Pattern Overlay */}
                
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">

                      {/* Left Side: Context */}
                      <div className="flex-1">
                           

                           <h1 className="text-3xl md:text-5xl font-bold text-text-inverse tracking-tight">
                                All Projects
                           </h1>

                           <p className="text-text-inverse/80 mt-3 text-sm sm:text-base max-w-md leading-relaxed">
                                Manage your active initiatives, monitor progress, and access deliverables across your entire portfolio.
                           </p>

                           
                      </div>

                      {/* Right Side: Quick Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                <HeroStat label="Projects" value={String(projects.length)} />
                                <HeroStat label="Active" value={String(activeProjects.length)} />
                                <HeroStat label="Completed" value={String(completedProjects.length)} />
                                <HeroStat label="Response" value="< 24h" />
                         
                      </div>

                 </div>
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
          <div className="text-center py-16 rounded-2xl border border-white/15 bg-slate-900/55 backdrop-blur-xl">
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


function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur">
      <p className="text-[10px] uppercase tracking-wide text-blue-100/75">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

