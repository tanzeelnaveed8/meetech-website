"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
     ArrowUpRight,
     Zap,
     UserCheck,
     Users2,
     CalendarClock,
     ChevronRight,
     ShieldCheck,
     Cpu,
} from "lucide-react";

import CTA from "./CTA";


// WHY MEETECH DATA
const WHY_MEETECH = [
     {
          title: "Founder-Led Engineering",
          description:
               "Every architectural decision is vetted by leadership. We engineer for ten-year scalability, not six-month stability.",
          icon: <UserCheck className="w-5 h-5" />,
          stat: "100% Oversight",
          image:
               "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
     },
     {
          title: "Sovereign In-House Team",
          description:
               "Zero outsourcing. Internal teams in Dubai and the US ensure accountability and data sovereignty.",
          icon: <Users2 className="w-5 h-5" />,
          stat: "No Freelancers",
          image:
               "https://images.unsplash.com/photo-1522071823991-b9671f903f79?auto=format&fit=crop&q=80&w=800",
     },
     {
          title: "Deterministic Delivery",
          description:
               "Milestone-driven execution with real-time visibility into production pipelines.",
          icon: <CalendarClock className="w-5 h-5" />,
          stat: "98% On-Time",
          image:
               "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
     },
     {
          title: "Enterprise Interoperability",
          description:
               "SOC2 & GDPR-aligned systems engineered for global ecosystems.",
          icon: <ShieldCheck className="w-5 h-5" />,
          stat: "Global Ready",
          image:
               "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
     },
] as const;


// MOTION VARIANTS
export default function WhyMeetech() {
     const reduceMotion = useReducedMotion();

     const fadeIn = {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-100px" },
          transition: {
               duration: 0.6,
               ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
     };


     const stagger = {
          initial: {},
          whileInView: {
               transition: { staggerChildren: 0.12 },
          },
          viewport: { once: true },
     };

     return (
          <div className="bg-bg-page text-text-body">
               {/* WHY MEETECH */}
               <section className="relative py-16 md:py-24 border-t border-border-subtle overflow-hidden">
                    <div
                         className="absolute inset-0 opacity-[0.03] pointer-events-none"
                         style={{
                              backgroundImage:
                                   "radial-gradient(var(--accent-primary) 1px, transparent 1px)",
                              backgroundSize: "40px 40px",
                         }}
                    />

                    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 grid lg:grid-cols-12 gap-12 lg:gap-24">
                         {/* LEFT */}
                         <div className="lg:col-span-5">
                              <div className="lg:sticky lg:top-32 space-y-10">
                                   <motion.div {...fadeIn}>
                                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 mb-6">
                                             <Cpu className="w-4 h-4 text-accent" />
                                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                                                  Engineering Edge
                                             </span>
                                        </div>

                                        <h2 className="text-4xl md:text-6xl font-black text-text-primary uppercase leading-[1.1]">
                                             Technical Authority<span className="text-accent">.</span>
                                        </h2>

                                        <p className="mt-6 text-lg text-text-body/80 max-w-md">
                                             We don’t just build apps — we engineer scalable digital assets.
                                        </p>
                                   </motion.div>
                              </div>
                         </div>

                         {/* RIGHT */}
                         <motion.div
                              className="lg:col-span-7 grid gap-6"
                              variants={stagger}
                              initial="initial"
                              whileInView="whileInView"
                              viewport={{ once: true }}
                         >
                              {WHY_MEETECH.map((item, i) => (
                                   <motion.div
                                        key={i}
                                        variants={fadeIn}
                                        className="group bg-bg-card border border-border-subtle rounded-[2.5rem] overflow-hidden hover:border-accent/30 transition"
                                   >
                                        <div className="flex flex-col md:flex-row h-full">
                                             <div className="flex-1 p-8 md:p-10 space-y-6">
                                                  <div className="flex justify-between items-center">
                                                       <div className="w-10 h-10 rounded-xl bg-bg-surface flex items-center justify-center group-hover:bg-accent group-hover:text-text-inverse transition">
                                                            {item.icon}
                                                       </div>
                                                       <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                                                            {item.stat}
                                                       </span>
                                                  </div>

                                                  <h3 className="text-2xl font-black uppercase text-text-primary">
                                                       {item.title}
                                                  </h3>

                                                  <p className="text-text-muted">{item.description}</p>

                                                  <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition">
                                                       Expertise Details <ChevronRight className="w-4 h-4" />
                                                  </div>
                                             </div>

                                             <div className="md:w-1/3 relative overflow-hidden bg-bg-subtle">
                                                  <img
                                                       src={item.image}
                                                       alt={item.title}
                                                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                  />
                                             </div>
                                        </div>
                                   </motion.div>
                              ))}
                         </motion.div>
                    </div>
               </section>

               {/* CTA */}
              <CTA />
          </div>
     );
}
