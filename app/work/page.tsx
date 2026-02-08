"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, X, ChevronRight, Layout, Monitor, Smartphone, Briefcase, Award, TrendingUp, Users } from 'lucide-react';
import NeuralBackground from '@/components/background/NeuralBackground';
import { DATA } from './data';
import ProjectDetail from './ProjectDetail';

const categories = [
     { id: 'Websites', icon: <Layout size={14} /> },
     { id: 'Dashboards', icon: <Monitor size={14} /> },
     { id: 'Mobile Apps', icon: <Smartphone size={14} /> },
] as const;

type CategoryId = typeof categories[number]['id'];

const containerVariants = {
     hidden: { opacity: 0 },
     visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
     hidden: { opacity: 0, y: 30 },
     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function PortfolioPage() {
     const [selectedCategory, setSelectedCategory] = useState<CategoryId>('Websites');
     const [selectedProject, setSelectedProject] = useState<any>(null);
     const { scrollY } = useScroll();
     const opacity = useTransform(scrollY, [0, 400], [1, 0]);
     const scale = useTransform(scrollY, [0, 400], [1, 0.98]);
     const reduce = Boolean(useReducedMotion());

     return (
          <div className="relative z-20 h-[420vh] md:h-full w-full text-text-primary selection:bg-accent selection:text-text-inverse font-sans transition-colors duration-500 ">
               {/* Decorative Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

               <NeuralBackground />
               {/* {/* Atmospheric Radial Blur  */}
               <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-[600px] w-[900px]  blur-[140px] rounded-lg pointer-events-none" />

               {/* Work Hero Section */}
               <motion.section
                    style={{ opacity, scale }}
                    className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-16 text-center"
               >
                    {/* Heading */}
                    <motion.h1
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8 }}
                         className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4"
                    >
                         Showcasing <span className="text-accent">Craft & Innovation</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.2 }}
                         className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
                    >
                         Hand-picked projects showcasing design excellence, performance, and scalable solutions for real businesses.
                    </motion.p>

                    {/* Key Expertise / Stats */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.4 }}
                         className="mt-10 flex flex-wrap justify-center gap-6"
                    >
                         {[
                              { label: "Websites", val: "80+" },
                              { label: "Dashboards", val: "40+" },
                              { label: "Mobile Apps", val: "30+" },
                              { label: "Industries", val: "15+" },
                         ].map((item, idx) => (
                              <div key={idx} className="px-6 py-4 rounded-xl border border-border-default bg-bg-card text-text-primary shadow-sm hover:shadow-md transition-all duration-300">
                                   <p className="text-sm font-semibold text-text-muted mb-1">{item.label}</p>
                                   <p className="text-2xl font-bold text-accent">{item.val}</p>
                              </div>
                         ))}
                    </motion.div>
               </motion.section>



               {/* Portfolio Content */}
               <section className=" overflow-hidden mb-40 md:mb-56 ">

                    <div className="mx-auto max-w-7xl px-6 md:px-8">
                         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                              <div className="max-w-xl space-y-6">
                                   <div className="flex items-center gap-4">
                                        <span className="h-[2px] w-12 bg-accent"></span>
                                        <span className="text-accent text-xs font-black uppercase tracking-[0.4em]">Expertise</span>
                                   </div>
                                   <h2 className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none">
                                        Featured<br />Portfolios
                                   </h2>
                              </div>

                              <div className="flex p-2 bg-bg-card border border-border-subtle rounded-3xl shadow-xl overflow-x-auto w-fit">
                                   {categories.map((cat) => (
                                        <button
                                             key={cat.id}
                                             onClick={() => setSelectedCategory(cat.id)}
                                             className={`flex items-center gap-3 px-4 md:px-8 py-4 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all duration-500 whitespace-nowrap ${selectedCategory === cat.id
                                                  ? 'bg-accent text-text-inverse shadow-xl shadow-accent/30'
                                                  : 'text-text-muted hover:text-text-primary'
                                                  }`}
                                        >
                                             <span className='hidden md:block'>{cat.icon}</span> {cat.id}
                                        </button>
                                   ))}
                              </div>
                         </div>

                         <AnimatePresence mode="wait">
                              <motion.div
                                   key={selectedCategory}
                                   variants={containerVariants}
                                   initial="hidden" animate="visible" exit="hidden"
                                   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                              >
                                   {DATA[selectedCategory].map((item) => (
                                        <motion.div
                                             key={item.id}
                                             variants={itemVariants}
                                             layoutId={`card-${item.id}`}
                                             className="group relative h-[550px] rounded-3xl overflow-hidden cursor-pointer border border-border-subtle bg-bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700"
                                             onClick={() => setSelectedProject(item)}
                                        >
                                             <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                                             <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                                             <div className="absolute bottom-0 left-0 p-12 w-full space-y-5">
                                                  <div className="flex gap-2">
                                                       {item.tags.slice(0, 2).map((tag, i) => (
                                                            <span key={i} className="text-[10px] uppercase font-bold tracking-widest text-[#F8FAFC] bg-accent/50 px-3 py-1 rounded">
                                                                 {tag}
                                                            </span>
                                                       ))}
                                                  </div>

                                                  <div>
                                                       <h3 className="text-3xl font-black text-text-primary uppercase leading-tight">{item.title}</h3>
                                                       <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-2">{item.industry}</p>
                                                  </div>

                                                  <div className="flex items-center gap-3 text-accent font-black text-[11px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                       View Case Study <ArrowRight size={16} />
                                                  </div>
                                             </div>

                                             <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                  <div className="bg-accent text-text-inverse p-4 rounded-2xl shadow-2xl shadow-accent/40">
                                                       <Eye size={24} />
                                                  </div>
                                             </div>
                                        </motion.div>
                                   ))}
                              </motion.div>
                         </AnimatePresence>
                    </div>



               </section>

               {/* Project Detail Modal */}
               <AnimatePresence>
                    {selectedProject && (
                         <ProjectDetail
                              project={selectedProject}
                              category={selectedCategory}
                              close={() => setSelectedProject(null)}
                         />
                    )}
               </AnimatePresence>
          </div>
     );
}
