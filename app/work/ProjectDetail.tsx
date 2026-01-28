"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
     ArrowUpRight,
     Monitor,
     Layout,
     Smartphone,
     Zap,
     X,
     ExternalLink,
     Eye,
     ArrowRight,
     Briefcase,
     Rocket,
     Calendar,
} from "lucide-react";

/**
 * PROJECT DATA & TYPES
 */
interface Project {
     id: number;
     title: string;
     category: "Websites" | "Dashboards" | "Mobile Apps";
     imgUrl: string;
     img2?: string;
     description: string;
     link: string;
     tags: string[];
}

const ProjectDetail = ({ project, category, close }: { project: any; category: string; close: () => void }) => {
     useEffect(() => {
          document.body.style.overflow = 'hidden';
          return () => { document.body.style.overflow = 'unset'; };
     }, []);

     const isMobile = category === "Mobile Apps";

     return (
          <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
          >
               <div className="absolute inset-0 bg-bg-page/90 backdrop-blur-xl" onClick={close} />

               <motion.div
                    layoutId={`card-${project.id}`}
                    className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-bg-surface border border-border-default rounded-[2.5rem] shadow-2xl overflow-hidden"
               >
                    <button onClick={close} className="absolute top-8 right-8 z-30 p-2 rounded-full bg-bg-card/50 backdrop-blur-md border border-border-subtle text-text-primary hover:scale-110 transition-transform">
                         <X size={24} />
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                         {/* Visual Side */}
                         <div className="lg:col-span-5 bg-bg-subtle relative overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border-subtle">
                              {/* Browser/Mobile Frame Container */}
                              <div className={`w-full h-full relative  overflow-hidden border-4 border-text-primary/10`}>
                                   <div className={`h-6 w-full bg-border-subtle/50 flex items-center px-3 gap-1 border-b border-border-subtle ${isMobile ? 'justify-center' : ''}`}>
                                        {isMobile ? (
                                             <div className="w-12 h-1 bg-text-primary/20 rounded-full" />
                                        ) : (
                                             <>
                                                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                             </>
                                        )}
                                   </div>

                                   <div className="absolute inset-0 pt-6 overflow-hidden bg-white">
                                        <motion.div
                                             animate={{ y: ["0%", "-60%", "0%"] }}
                                             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                             className="w-full"
                                        >
                                             <img src={project.imgUrl} alt="" className="w-full h-auto" />
                                             <img src={project.imgUrl} alt="" className="w-full h-auto" />
                                        </motion.div>
                                   </div>
                              </div>
                         </div>

                         {/* Content Side */}
                         <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center">
                              <div className="flex gap-2 mb-8">
                                   {project.tags.map((tag: string, i: number) => (
                                        <span key={i} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent bg-accent-muted border border-accent/10 rounded">
                                             {tag}
                                        </span>
                                   ))}
                              </div>

                              <h2 className="text-4xl md:text-5xl font-black text-text-primary uppercase tracking-tight mb-6">
                                   {project.title}<span className="text-accent">.</span>
                              </h2>

                              <p className="text-text-body text-xl mb-12 leading-relaxed opacity-80">
                                   {project.description}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                                   <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-widest">
                                             <Briefcase size={14} className="text-accent" /> Industry
                                        </div>
                                        <p className="text-text-primary font-bold">{project.industry}</p>
                                   </div>
                                   <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-widest">
                                             <Rocket size={14} className="text-accent-secondary" /> Solution
                                        </div>
                                        <p className="text-text-primary font-bold">{project.built}</p>
                                   </div>
                                   <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-widest">
                                             <Calendar size={14} className="text-accent" /> Timeline
                                        </div>
                                        <p className="text-text-primary font-bold">{project.timeline}</p>
                                   </div>
                                   <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-widest">
                                             <Zap size={14} className="text-accent-secondary" /> Key Result
                                        </div>
                                        <p className="text-accent-secondary font-black">{project.result}</p>
                                   </div>
                              </div>

                              <button className="flex items-center justify-center gap-4 py-5 px-8 bg-accent text-text-inverse font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-hover transition-all group">
                                   Explore Live Case <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                         </div>
                    </div>
               </motion.div>
          </motion.div>
     );
};

export default ProjectDetail;