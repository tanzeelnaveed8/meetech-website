import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowUpRight, CheckCircle2, Users } from 'lucide-react';

/**
 * MeetechCTA Component
 * * Design Philosophy:
 * 1. Visual Anchoring: Using a dark surface with an accent-glow to draw the eye at the end of a scroll.
 * 2. High-Conversion UX: Reducing friction by adding "No credit card required" / "15-min call" micro-copy.
 * 3. Modern Tech Aesthetic: Utilizing a rounded-3xl container with a subtle background mesh.
 */

const fadeIn = {
     initial: { opacity: 0, y: 30 },
     whileInView: { opacity: 1, y: 0 },
     viewport: { once: true, margin: "-100px" },
     transition: {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
     },
};
const MeetechCTA = () => {
     return (
          <section className="relative py-12 md:py-16 px-6 overflow-hidden">
               {/* Background Ambient Glows */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/20 blur-[120px] rounded-full -z-10" />

               <motion.div
                    {...fadeIn}
                    className="mx-auto max-w-6xl relative group"
               >
                    {/* The Card Container */}
                    <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-slate-950 border border-white/10 p-8 md:p-20 lg:p-24 shadow-2xl">

                         {/* Subtle Mesh Background Overlay */}
                         <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,#3b82f6,transparent_50%)]" />

                         <div className="relative z-10 flex flex-col items-center text-center space-y-10">

                              {/* Badge / Top Icon */}
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                                   <Zap className="w-4 h-4 fill-current" />
                                   <span>Limited Availability for Q1</span>
                              </div>

                              {/* Heading with Fluid Typography */}
                              <div className="space-y-4">
                                   <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                                        Ready to scale your <br className="hidden md:block" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                             Engineering?
                                        </span>
                                   </h2>
                                   <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
                                        Join 50+ high-growth teams dominating their markets with Meetech's managed engineering partnerships.
                                   </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                                   <button className="group w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95">
                                        Book Strategy Call
                                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                   </button>

                                   <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95">
                                        View Case Studies
                                   </button>
                              </div>

                              {/* Trust Markers / Social Proof */}
                              <div className="pt-6 border-t border-white/5 w-full max-w-md">
                                   <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-500 text-sm">
                                        <div className="flex items-center gap-1.5">
                                             <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                             <span>No upfront costs</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                             <Users className="w-4 h-4 text-blue-500" />
                                             <span>100+ Expert Vetted Devs</span>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Decorative Corner Element */}
                         <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/20 to-transparent blur-2xl rounded-full translate-x-10 translate-y-10" />
                    </div>
               </motion.div>
          </section>
     );
};

export default MeetechCTA;