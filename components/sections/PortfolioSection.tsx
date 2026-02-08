"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, X, ChevronRight, Layout, Monitor, Smartphone, Briefcase, Award, TrendingUp, Users } from 'lucide-react';
import NeuralBackground from '@/components/background/NeuralBackground';
import { DATA } from '@/app/work/data';
import ProjectDetail from "@/app/work/ProjectDetail";

const PortfolioSection = () => {

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
     const [selectedCategory, setSelectedCategory] = useState<CategoryId>('Websites');
     const [selectedProject, setSelectedProject] = useState<any>(null);
     const { scrollY } = useScroll();
     const opacity = useTransform(scrollY, [0, 400], [1, 0]);
     const scale = useTransform(scrollY, [0, 400], [1, 0.98]);
     const reduce = Boolean(useReducedMotion());

     return (
          <div>
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

                              <div className="flex p-0 md:p-2 bg-bg-card border border-border-subtle rounded-3xl shadow-xl overflow-x-auto w-fit">
                                   {categories.map((cat) => (
                                        <button
                                             key={cat.id}
                                             onClick={() => setSelectedCategory(cat.id)}
                                             className={`flex items-center gap-2 px-2 md:px-8 py-4 rounded-2xl text-xs md:text-sm font-black tracking-wider uppercase transition-all duration-500 whitespace-nowrap ${selectedCategory === cat.id
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
                                             <Image
                                                  src={item.imgUrl}
                                                  alt={item.title}
                                                  fill
                                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                  className="object-cover
  grayscale-[0.7]
  brightness-75
  contrast-90
  saturate-75
  transition-all duration-1000"
                                                  priority={false}
                                                  quality={85}
                                             />
                                             <div className="absolute inset-0
  bg-gradient-to-t from-black/90 via-black/60 to-transparent
  opacity-90 group-hover:opacity-95 transition-opacity" />


                                             <div className="absolute bottom-0 left-0 p-12 w-full space-y-5">
                                                  <div className="flex gap-2">
                                                       {item.tags.slice(0, 2).map((tag, i) => (
                                                            <span key={i} className="text-[10px] uppercase font-bold tracking-widest text-[#F8FAFC] bg-accent px-3 py-1 rounded shadow-lg">
                                                                 {tag}
                                                            </span>
                                                       ))}
                                                  </div>

                                                  <div>
                                                       <h3 className="text-3xl font-black text-[#F8FAFC] uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{item.title}</h3>
                                                       <p className="text-gray-200 font-bold text-xs uppercase tracking-widest mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{item.industry}</p>
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


                    {/* Infinite Scroll Indicator */}
                    <motion.div
                         animate={{ y: [0, 8, 0] }}
                         transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                         className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40"
                    >
                         <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">
                              Explore
                         </span>
                         <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-lg" />
                    </motion.div>

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
     )
}

export default PortfolioSection
