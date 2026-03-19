// // components/client/ClientDashboardContent.tsx
// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import {
//      LayoutDashboard,
//      CheckSquare,
//      MessageSquare,
//      Activity,
//      Calendar,
//      Settings,
//      ChevronRight,
//      Clock,
//      Users,
//      FileText,
//      Paperclip,
//      MoreHorizontal,
//      Star,
//      Bell,
//      Search,
//      Plus
// } from 'lucide-react';
// import { useState } from 'react';
// import ProjectCard from './ProjectCard';

// interface Project {
//      id: string;
//      name: string;
//      description: string;
//      status: string;
//      progress: number;
//      updatedAt: Date | string;
//      expectedEndDate: Date | string | null;
//      manager: {
//           name: string;
//      };
//      _count: {
//           milestones: number;
//           files: number;
//           changeRequests: number;
//      };
// }

// interface ClientDashboardContentProps {
//      projects: Project[];
//      activeProjects: Project[];
//      completedProjects: Project[];
//      firstName: string;
//      userInitials: string;
//      projectsCount: number;
//      userEmail: string;
// }

// export default function ClientDashboardContent({
//      projects,
//      activeProjects,
//      completedProjects,
//      firstName,
//      userInitials,
//      projectsCount,
//      userEmail }: ClientDashboardContentProps) {
//      console.log("Projects", projects)


//      return (
//           <div className="flex text-text-primary p-4 md:p-10">


//                {/* ===== MAIN CONTENT ===== */}
//                <main className="flex-1 overflow-y-auto ">

//                     <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-4">

//                          <nav className="flex text-text-muted p-2 rounded-lg border border-accent/15 bg-accent/10" aria-label="Breadcrumb">
//                               <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
//                                    <li className="inline-flex items-center">
//                                         <a href="/" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
//                                              <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /></svg>
//                                              Home
//                                         </a>
//                                    </li>
//                                    <li>
//                                         <div className="flex items-center space-x-1.5">
//                                              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
//                                              <a href="#" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">Client</a>
//                                         </div>
//                                    </li>
//                                    <li aria-current="page">
//                                         <div className="flex items-center space-x-1.5">
//                                              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
//                                              <span className="inline-flex items-center text-sm font-medium text-body-subtle">Dashboard</span>
//                                         </div>
//                                    </li>
//                               </ol>
//                          </nav>
//                          <div className=" w-full flex justify-end md:items-center gap-4">


//                               <a href='/client/book-meeting' className="px-4 py-2 bg-accent/80 hover:bg-accent/60 rounded-xl text-sm font-medium flex items-center gap-2 transition">
//                                    <Plus size={16} />
//                                    New Project
//                               </a>
//                               <a href="/client/profile" className="w-10 h-10 hidden md:inline-flex items-center justify-center hover:bg-accent/80 rounded-xl transition bg-accent/80 ">
//                                    <span className="">{userInitials}</span>
//                               </a>
//                          </div>
//                     </div>


//                     <div className="py-8 w-full xl:w-[80%]">
//                          {/* Header */}
//                          <div className="flex items-center justify-between mb-8">
//                               <div>
//                                    <h2 className="text-3xl lg:text-5xl font-bold">Welcome back, {firstName}</h2>
//                                    <p className="text-text-muted mt-1 text-sm">
//                                         Track your projects, upload requirements, and schedule meetings all from one place.
//                                    </p>
//                               </div>

//                          </div>

//                          {/* Quick Stats */}
//                          <div className="my-8 grid grid-cols-2  md:grid-cols-4  gap-3 ">
//                               <StatCard
//                                    label="Projects"
//                                    value={projectsCount}
//                               // color="blue"
//                               />
//                               <StatCard
//                                    label="Active"
//                                    value={activeProjects.length}
//                               // color="green"
//                               />
//                               <StatCard
//                                    label="Completed"
//                                    value={completedProjects.length}
//                               // color="purple"
//                               />
//                               <StatCard
//                                    label="Response"
//                                    value="<24h"
//                               // color="yellow"
//                               />
//                          </div>

//                          {/* Projects Grid */}
//                          <div className="mt-10">
//                               <h3 className="font-semibold mb-4 text-3xl">Your Projects</h3>
//                               <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4">
//                                    {projects.slice(0, 3).map((project) => (
//                                         <ProjectCard key={project.id} project={project} />
//                                    ))}
//                               </div>
//                          </div>
//                          {/* Today Section */}

//                     </div>
//                </main>
//           </div>
//      );
// }

// // ===== Helper Components =====

// function StatCard({ label, value }: { label: string; value: number | string }) {
   

//      return (
//           <div className={`bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 rounded-xl p-4 border`}>
//                <p className="text-xs text-white/60">{label}</p>
//                <p className="text-xl font-bold mt-1">{value}</p>
//           </div>
//      );
// }

// components/client/ClientDashboardContent.tsx
// components/client/ClientDashboardContent.tsx
'use client';

import Link from 'next/link';
import {
     LayoutDashboard,
     Activity,
     ChevronRight,
     Clock,
     Search,
     Plus,
     ArrowRight,
     TrendingUp,
     CheckCircle2,
     Sparkles,
     Home
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
     id: string;
     name: string;
     description: string;
     status: string;
     progress: number;
     updatedAt: Date | string;
     expectedEndDate: Date | string | null;
     manager: {
          name: string;
     };
     _count: {
          milestones: number;
          files: number;
          changeRequests: number;
     };
}

interface ClientDashboardContentProps {
     projects: Project[];
     activeProjects: Project[];
     completedProjects: Project[];
     firstName: string;
     userInitials: string;
     projectsCount: number;
     userEmail: string;
}

export default function ClientDashboardContent({
     projects,
     activeProjects,
     completedProjects,
     firstName,
     userInitials,
     projectsCount,
     userEmail
}: ClientDashboardContentProps) {
     const [greeting, setGreeting] = useState('Welcome back');
     const [searchQuery, setSearchQuery] = useState('');
     const [isHovering, setIsHovering] = useState<string | null>(null);

     useEffect(() => {
          const hour = new Date().getHours();
          if (hour < 12) setGreeting('Good morning');
          else if (hour < 18) setGreeting('Good afternoon');
          else setGreeting('Good evening');
     }, []);

     const filteredProjects = projects.filter(project =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
     );

     const quickActions = [
          { icon: Plus, label: 'New Project', href: '/client/book-meeting', primary: true },
     ];

     return (
          <div className="min-h-screen">
               <div className="flex">
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-10">
                         {/* Header with Breadcrumb and Actions */}
                         <div className="flex flex-col lg:flex-row lg:justify-between items-center space-y-4 lg:space-y-0">
                              <motion.nav
                                   initial={{ opacity: 0, x: -20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   className="flex text-text-muted p-2 rounded-lg border border-accent/15 bg-accent/10 backdrop-blur-sm"
                                   aria-label="Breadcrumb"
                              >
                                   <ol className="inline-flex items-center space-x-1 md:space-x-2">
                                        <li className="inline-flex items-center">
                                             <a href="/" className="inline-flex items-center text-sm font-medium text-body hover:text-brand transition-colors group">
                                                  <Home size={16} className="mr-1.5 group-hover:scale-110 transition-transform" />
                                                  Home
                                             </a>
                                        </li>
                                        <li>
                                             <div className="flex items-center space-x-1.5">
                                                  <ChevronRight size={14} className="text-body" />
                                                  <a href="#" className="inline-flex items-center text-sm font-medium text-body hover:text-brand transition-colors">Client</a>
                                             </div>
                                        </li>
                                        <li aria-current="page">
                                             <div className="flex items-center space-x-1.5">
                                                  <ChevronRight size={14} className="text-body" />
                                                  <span className="inline-flex items-center text-sm font-medium text-brand">Dashboard</span>
                                             </div>
                                        </li>
                                   </ol>
                              </motion.nav>

                              <div className="flex items-start gap-3">
                                   <div className="flex items-center gap-2">
                                        {quickActions.map((action) => (
                                             <Link
                                                  key={action.label}
                                                  href={action.href}
                                                  className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20 group"
                                             >
                                                  <action.icon size={16} />
                                                  {action.label}
                                             </Link>
                                        ))}
                                   </div>

                                   <Link
                                        href="/client/profile"
                                        className="w-10 h-10 hidden md:inline-flex items-center justify-center hover:bg-accent/30 rounded-xl transition-all bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20 group"
                                   >
                                        <span className="font-medium group-hover:scale-110 transition-transform">{userInitials}</span>
                                   </Link>
                              </div>
                         </div>

                         <div className="py-8 w-full mt-12">
                              {/* Greeting Section */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.5 }}
                                   className="mb-8"
                              >
                                   <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r capitalize from-text-primary to-text-primary/80 bg-clip-text">
                                             {greeting}, {firstName}
                                        </h1>
                                        <Sparkles className="text-yellow-500 animate-pulse" size={28} />
                                   </div>
                                   <p className="text-text-muted text-sm lg:text-base max-w-2xl">
                                        Track your projects, upload requirements, and schedule meetings all from one place.
                                        Here's what's happening with your projects today.
                                   </p>
                              </motion.div>

                              {/* Stats Cards */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.5, delay: 0.1 }}
                                   className="my-8 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
                              >
                                   <StatCard
                                        icon={LayoutDashboard}
                                        label="Projects"
                                        value={projectsCount}
                                   />
                                   <StatCard
                                        icon={Activity}
                                        label="Active"
                                        value={activeProjects.length}
                                   />
                                   <StatCard
                                        icon={CheckCircle2}
                                        label="Completed"
                                        value={completedProjects.length}
                                   />
                                   <StatCard
                                        icon={TrendingUp}
                                        label="Response"
                                        value="<24h"
                                   />
                              </motion.div>

                              {/* Projects Section */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.5, delay: 0.3 }}
                                   className="mt-16"
                              >
                                   <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-semibold text-2xl lg:text-3xl">Your Projects</h2>
                                        {searchQuery && (
                                             <p className="text-sm text-text-muted">
                                                  Found {filteredProjects.length} projects
                                             </p>
                                        )}
                                        <Link
                                             href="/client/projects"
                                             className="px-2 py-1 rounded-xl text-[10px] font-medium flex items-center gap-2 transition-all bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 group hover:text-accent"
                                        >
                                             <ArrowRight size={16} />
                                             View All
                                        </Link>
                                   </div>

                                   <AnimatePresence mode="wait">
                                        {filteredProjects.length > 0 ? (
                                             <motion.div
                                                  key="projects"
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  exit={{ opacity: 0 }}
                                                  className="grid md:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6"
                                             >
                                                  {filteredProjects.slice(0, 4).map((project, index) => (
                                                       <motion.div
                                                            key={project.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            onHoverStart={() => setIsHovering(project.id)}
                                                            onHoverEnd={() => setIsHovering(null)}
                                                            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                                       >
                                                            <ProjectCard project={project}  />
                                                       </motion.div>
                                                  ))}
                                             </motion.div>
                                        ) : (
                                             <motion.div
                                                  key="no-results"
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  exit={{ opacity: 0 }}
                                                  className="flex flex-col items-center justify-center py-12 px-4 bg-accent/10 rounded-2xl border border-accent/20"
                                             >
                                                  <Search size={48} className="text-text-muted mb-4" />
                                                  <h3 className="text-lg font-medium mb-2">No projects found</h3>
                                                  <p className="text-text-muted text-sm mb-4 text-center">
                                                       We couldn't find any projects matching "{searchQuery}"
                                                  </p>
                                                  <button
                                                       onClick={() => setSearchQuery('')}
                                                       className="px-4 py-2 bg-brand text-white rounded-xl text-sm hover:bg-brand/80 transition-colors"
                                                  >
                                                       Clear search
                                                  </button>
                                             </motion.div>
                                        )}
                                   </AnimatePresence>

                                   {projects.length > 4 && (
                                        <div className="mt-6 text-center">
                                             <Link
                                                  href="/client/projects"
                                                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent/20 hover:bg-accent/30 rounded-xl text-sm font-medium transition-all group"
                                             >
                                                  View all {projects.length} projects
                                                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                             </Link>
                                        </div>
                                   )}
                              </motion.div>
                         </div>
                    </main>
               </div>
          </div>
     );
}

// ===== Helper Components =====

interface StatCardProps {
     icon: React.ElementType;
     label: string;
     value: number | string;
     trend?: string; // Made optional
}

function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
     return (
          <motion.div
               whileHover={{ scale: 1, y: -0.5 }}
               className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 hover:border-accent/30 rounded-xl p-4 lg:p-5 border transition-all cursor-pointer backdrop-blur-sm group"
          >
               <div className="flex items-start justify-between">
                    <div>
                         <p className="text-xs text-text-muted mb-1">{label}</p>
                         <p className="text-xl lg:text-2xl font-bold mb-1">{value}</p>
                         {trend && <p className="text-xs text-text-muted opacity-75">{trend}</p>}
                    </div>
                    <div className="p-2 rounded-lg bg-bg-page/50 group-hover:scale-110 transition-transform text-accent">
                         <Icon size={18} />
                    </div>
               </div>
          </motion.div>
     );
}