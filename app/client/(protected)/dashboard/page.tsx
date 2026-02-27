import { auth } from '@/lib/auth/auth';
import { getProjectsByClient } from '@/lib/db/queries/projects';
import ProjectCard from '@/components/client/ProjectCard';
import { FiFolder, FiArrowRight } from 'react-icons/fi';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/95 via-blue-950/70 to-indigo-950/70 p-7 sm:p-8 shadow-[0_30px_80px_rgba(30,64,175,0.45)]">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px, 40px 40px' }} />
        <div className="relative z-10">
          <p className="text-text-inverse/70 text-sm font-medium mb-1">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-inverse tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-text-inverse/80 mt-1.5 text-sm sm:text-base max-w-lg">
            Track your projects, upload requirements, and schedule meetings all from one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href="/client/dashboard?modal=booking"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 text-text-inverse text-sm font-medium hover:bg-white/25 transition-colors"
            >
              Book a Meeting <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <HeroStat label="Projects" value={String(projects.length)} />
            <HeroStat label="Active" value={String(activeProjects.length)} />
            <HeroStat label="Completed" value={String(completedProjects.length)} />
            <HeroStat label="Response" value="< 24h" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          title="Book a Meeting"
          description="Pick a slot and discuss progress."
          href="/client/dashboard?modal=booking"
        />
        <QuickAction
          title="Open Messages"
          description="Chat directly with your manager."
          href="/client/dashboard?modal=messages"
        />
        <QuickAction
          title="Update Profile"
          description="Keep contact details up to date."
          href="/client/dashboard?modal=profile"
        />
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

function QuickAction({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/15 bg-slate-900/60 backdrop-blur-xl p-4 hover:border-blue-400/40 hover:shadow-[0_16px_40px_rgba(37,99,235,0.2)] transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <FiArrowRight className="w-4 h-4 text-blue-300" />
      </div>
      <p className="text-xs text-text-muted mt-1">{description}</p>
    </Link>
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

