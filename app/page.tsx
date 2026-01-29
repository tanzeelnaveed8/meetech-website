"use client";

import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Globe, Shield, Zap, Server, ChevronRight, Clock, Award, Briefcase } from 'lucide-react';
import NeuralBackground from '../components/background/NeuralBackground';
import { WhatWeBuild } from '@/components/sections/WhatWeBuild';
import WhyMeetechh from '@/components/sections/WhyMeetech';
import ProcessSection from '@/components/sections/ProcessSection';
import Project from './work/page';
import PortfolioSection from '@/components/sections/PortfolioSection';
import { FloatingCTA } from '@/components/ui/FloatingCTA';
// Animation constants
const DURATION = 0.6;
const EASE = "easeOut";

// Trust Section Data
const TRUST_HEADLINE = "Trusted by Founders & Businesses Worldwide";

const TRUST_SIGNALS = [
  { label: "Delivery across time zones", icon: "globe" },
  { label: "Clear processes, no surprises", icon: "clock" },
  { label: "Built to scale with you", icon: "award" },
  { label: "Long-term partnerships", icon: "briefcase" },
];

const TRUST_ICONS: Record<string, React.ReactNode> = {
  globe: <Globe className="w-6 h-6" />,
  clock: <Clock className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  briefcase: <Briefcase className="w-6 h-6" />,
};

export default function App() {
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

      {/* Main Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center"
      >
        <div className="max-w-6xl w-full">

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group mb-12 inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-border-default bg-bg-surface/60 backdrop-blur-2xl cursor-default hover:border-accent/40 transition-all shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
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
            MEETECH architects high-performance digital ecosystems and production-grade products for enterprises requiring absolute reliability and global scale.
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
        <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-full" />
      </motion.div>

      {/* Content Sections */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
        {/* Trusted by founders & businesses */}
        <motion.section
          aria-labelledby="trust-heading"
          className="relative border-t border-border-default py-20 md:py-28"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <div className="text-center mb-16">
            <h2
              id="trust-heading"
              className="text-3xl md:text-4xl font-black text-text-primary uppercase mb-6"
            >
              {TRUST_HEADLINE}
            </h2>
            <p className="text-lg text-text-body max-w-2xl mx-auto">
              From startups to enterprises, we deliver production-grade solutions that scale globally.
            </p>
          </div>

          {/* Trust Signals Grid */}
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-4xl mx-auto"
            role="list"
          >
            {TRUST_SIGNALS.map(({ label, icon }, i) => (
              <motion.li
                key={label}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 * i }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                  {TRUST_ICONS[icon]}
                </div>
                <p className="text-base font-semibold text-text-primary">
                  {label}
                </p>
              </motion.li>
            ))}
          </ul>

          {/* Additional Trust Indicators */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-text-muted"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Active in 12+ countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>SOC2 & GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>24/7 Support Coverage</span>
            </div>
          </motion.div>
        </motion.section>
      </div>
<FloatingCTA />
      <WhatWeBuild />
      <WhyMeetechh />
     <PortfolioSection />
      <ProcessSection />
    </div>
  );
}
