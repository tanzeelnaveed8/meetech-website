"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, Code2, Smartphone, ShoppingBag, Rocket } from "lucide-react";
import NeuralBackground from "@/components/background/NeuralBackground";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";

export default function ServicesPage() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.98]);
  const reduce = Boolean(useReducedMotion());

  return (
    <div className="relative min-h-screen w-full bg-bg-page text-text-primary selection:bg-accent selection:text-text-inverse overflow-hidden font-sans transition-colors duration-500">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Hero Interactive Background */}
      <NeuralBackground />

      {/* Atmospheric Radial Blur */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Services Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center">
        {/* Heading & Subheading only */}
        <motion.div
          style={{ opacity, scale }}
          className="flex flex-col items-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4"
          >
            Engineering Services <span className="text-accent">Built to Scale</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
          >
            We deliver web, mobile, e-commerce, custom software, and startup MVPs. Built to scale, shipped on time. No compromises on quality.
          </motion.p>
        </motion.div>

        {/* Grid of icons (static, always visible) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Code2 />, label: "Web Apps", val: "Next.js & React" },
            { icon: <Smartphone />, label: "Mobile", val: "iOS & Android" },
            { icon: <ShoppingBag />, label: "E-commerce", val: "Scalable Stores" },
            { icon: <Rocket />, label: "MVPs", val: "Launch Fast" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center min-h-[160px] rounded-xl border border-border-default bg-bg-card text-text-primary shadow-sm hover:shadow-md transition p-5"
            >
              <div className="mb-3 p-4 rounded-full bg-accent-muted text-accent w-12 h-12 flex items-center justify-center">
                {React.cloneElement(item.icon, { size: 24 })}
              </div>
              <p className="text-sm font-medium text-text-muted">{item.label}</p>
              <p className="text-base font-bold text-accent">{item.val}</p>
            </div>
          ))}
        </div>

      </section>

      
      
      {/* Infinite Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40"
      >
        <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">
          Explore
        </span>
        <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-full" />
      </motion.div>

      {/* Services Content */}
      <div className="relative z-10">
        <WhatWeBuild />
      </div>
    </div>
  );
}
