
"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  PenTool,
  Code2,
  Fingerprint,
  Layers,
  Navigation,
  Smartphone,
  ArrowUpRight
} from "lucide-react";
import { Variants } from "framer-motion";


const CARDS = [
  {
    title: "Product Design",
    description: "Crafting user-friendly, aesthetic, and functional interfaces for web and mobile.",
    icon: <PenTool className="w-8 h-8 md:w-10 md:h-10" />,
    className: "md:col-span-2 md:row-span-1", // Adjusted to span 2 columns
    accent: "primary",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Prototype & Testing",
    description: "Validating design ideas through interactive prototypes and user feedback.",
    icon: <Smartphone className="w-6 h-6" />,
    className: "md:col-span-2 md:row-span-1", // Adjusted to span 2 columns to sit beside Product Design
    accent: "primary",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Webflow Development",
    description: "Turning designs into responsive, interactive, and scalable websites.",
    icon: <Code2 className="w-6 h-6" />,
    className: "md:col-span-2 md:row-span-1",
    accent: "secondary",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Brand Identity",
    description: "Building cohesive visual identities that resonate with your audience.",
    icon: <Fingerprint className="w-6 h-6" />,
    className: "md:col-span-1 md:row-span-1",
    accent: "primary",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Design Systems",
    description: "Creating reusable, scalable systems for consistency across products.",
    icon: <Layers className="w-6 h-6" />,
    className: "md:col-span-1 md:row-span-1",
    accent: "primary",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Product Strategy",
    description: "Aligning design decisions with business goals to create meaningful impact.",
    icon: <Navigation className="w-6 h-6" />,
    className: "md:col-span-4 md:row-span-1", // Spanning full width for balance at the bottom
    accent: "secondary",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
  },
];

const WhatWeBuild = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const }
    },
  };

  return (
    <section className="bg-bg-page py-20 md:py-32 px-4 md:px-8 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.02] dark:opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Our Expertise</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black tracking-tighter text-text-primary leading-[0.9]"
            >
              WE BUILD DIGITAL <br />
              <span className="text-accent">AUTHORITY.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-text-muted max-w-md leading-relaxed"
            >
              High-performance solutions engineered for scalability, interoperability, and long-term business impact.
            </motion.p>
          </div>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[280px]"
        >
          {CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              className={`
                group relative overflow-hidden rounded-[2rem] flex flex-col justify-between
                bg-bg-card border border-border-subtle hover:border-accent/40 transition-all duration-500
                ${card.className}
              `}
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/50 to-transparent" />
              </div>

              {/* Top Section: Icon */}
              <div className="relative z-10 p-8">
                <div className={`
                  inline-flex items-center justify-center p-4 rounded-2xl backdrop-blur-md border border-white/10
                  ${card.accent === "secondary" ? "text-accent-secondary bg-accent-secondary/10" : "text-accent bg-accent/10"}
                `}>
                  {React.cloneElement(card.icon as React.ReactElement<{className?: string}>, { className: "w-6 h-6" })}
                </div>
              </div>

              {/* Bottom Section: Text Content */}
              <div className="relative z-10 p-8 pt-0">
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-[280px]">
                  {card.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  View Detail <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Animated Border/Glow */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/10 rounded-[2rem] transition-colors pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export { WhatWeBuild };