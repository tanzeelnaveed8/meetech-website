"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Globe, Shield, Zap, Server, ChevronRight } from 'lucide-react';
import NeuralBackground from '@/components/background/NeuralBackground';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { WhatWeBuild } from '@/components/sections/WhatWeBuild';
import WhyMeetech from '@/components/sections/WhyMeetech';
import WhyMeetechh from '@/components/sections/WhyMeetechh';
import TechnicalValidationGrid from '@/components/sections/TechnicalValidationGrid';
import ProcessSection from '@/components/sections/ProcessSection';
import { FloatingCTA } from '@/components/ui/FloatingCTA';

type BreadcrumbItem = { label: string; href?: string };

type PageHeroProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
};

export function PageHero() {
  const reduce = Boolean(useReducedMotion());
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.98]);


  return (
    <>
      <div className="relative z-10 h-fit w-full text-text-primary   bg-bg-page selection:bg-accent selection:text-text-inverse overflow-hidden font-sans transition-colors duration-500">

        {/* Decorative Grid: Uses border-default variable for theme-aware lines */}
        < div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none " />
        {/* Hero Interactive Background */}
        <NeuralBackground />



        {/* Atmospheric Radial Blur */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-150 w-225 bg-accent/5 blur-[140px] rounded-lg pointer-events-none" />

        {/* Main Hero Section */}
        <motion.section
          style={{ opacity, scale }}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 md:py-24 mb-20  text-center"
        >
          <div className="max-w-6xl w-full">

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="group mb-12 inline-flex items-center gap-3 px-6 py-2.5 rounded-lg border border-border-default bg-bg-surface/60 backdrop-blur-2xl cursor-default hover:border-accent/40 transition-all shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-lg bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-lg h-2.5 w-2.5 bg-accent"></span>
              </span>
              <p className="text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase text-text-muted">
                Scaling Innovation &middot; USA &middot; UAE &middot; Global
              </p>
              <ChevronRight className="w-3.5 h-3.5 text-accent" />
            </motion.div>

            {/* Core Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92] mb-10 text-text-primary"
            >
              Where Visionary Ideas <br />
              <span className="text-accent bg-clip-text">
                Meet Technology.
              </span>
            </motion.h1>

            {/* Credibility Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto max-w-2xl text-lg md:text-xl text-text-body mb-14 leading-relaxed font-light"
            >
              Meetech Development architects high-performance digital ecosystems and production-grade products for enterprises requiring absolute reliability and global scale.
            </motion.p>

            {/* CTA Hub */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button className="group relative px-10 py-5 bg-accent text-text-inverse font-bold rounded-xl overflow-hidden transition-all hover:bg-accent-hover hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] active:scale-95">
                <span className="relative flex items-center gap-2">
                  Explore Solutions <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              <button className="px-10 py-5 bg-transparent border border-border-strong hover:bg-bg-subtle text-text-primary font-bold rounded-xl transition-all active:scale-95">
                Consult Our Engineers
              </button>
            </motion.div>



          </div>
        </motion.section>


        {/* Infinite Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40"
        >
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">Discovery</span>
          <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-lg" />
        </motion.div>
        <FloatingCTA />
        <TrustSignals />
        <WhatWeBuild />
        {/* <WhyMeetech /> */}
        <WhyMeetechh />
        {/* <Project /> */}
        <ProcessSection />
      </div>
    </>
  );
}
