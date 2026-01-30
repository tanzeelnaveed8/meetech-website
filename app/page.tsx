"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Globe, Shield, Zap, Server, ChevronRight, Clock, Award, Briefcase } from 'lucide-react';
import { SiNextdotjs, SiReact, SiTypescript, SiNodedotjs, SiPostgresql, SiAmazon, SiFlutter, SiPython, SiDocker, SiKubernetes, SiGraphql } from "react-icons/si";
import NeuralBackground from '../components/background/NeuralBackground';
import { WhatWeBuild } from '@/components/sections/WhatWeBuild';
import WhyMeetechh from '@/components/sections/WhyMeetech';
import ProcessSection from '@/components/sections/ProcessSection';
import FeaturedInsights from '@/components/sections/FeaturedInsights';
import Project from './work/page';
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
            <Link
              href="/services"
              className="group relative px-10 py-5 bg-accent text-text-inverse font-bold rounded-xl overflow-hidden transition-all hover:bg-accent-hover hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 inline-flex items-center justify-center"
            >
              <span className="relative flex items-center gap-2">
                Explore Solutions <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/contact"
              className="px-10 py-5 bg-transparent border-2 border-border-strong hover:bg-bg-subtle hover:border-accent text-text-primary font-bold rounded-xl transition-all active:scale-95 inline-flex items-center justify-center"
            >
              Consult Our Engineers
            </Link>
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

      {/* Services Section */}
      <WhatWeBuild />

      {/* Technology Stack Section */}
      <section
        aria-labelledby="tech-stack-heading"
        className="relative z-10 mx-auto max-w-7xl border-t border-border-default px-4 py-20 md:px-8 md:py-28"
      >
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="max-w-xl space-y-6 mb-16">
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-12 bg-accent"></span>
              <span className="text-accent text-xs font-black uppercase tracking-[0.4em]">Technology</span>
            </div>
            <h2
              id="tech-stack-heading"
              className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none"
            >
              Built with<br />Modern Tech<span className="text-accent">.</span>
            </h2>
            <p className="text-lg text-text-body md:text-xl leading-relaxed">
              We use battle-tested technologies that ensure performance, scalability, and maintainability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: "Next.js", icon: <SiNextdotjs size={20} />, color: "#000000", bgColor: "#ffffff" },
              { name: "React", icon: <SiReact size={20} />, color: "#61DAFB", bgColor: "#61DAFB20" },
              { name: "TypeScript", icon: <SiTypescript size={20} />, color: "#3178C6", bgColor: "#3178C620" },
              { name: "Node.js", icon: <SiNodedotjs size={20} />, color: "#339933", bgColor: "#33993320" },
              { name: "PostgreSQL", icon: <SiPostgresql size={20} />, color: "#4169E1", bgColor: "#4169E120" },
              { name: "AWS", icon: <SiAmazon size={20} />, color: "#FF9900", bgColor: "#FF990020" },
              { name: "React Native", icon: <SiReact size={20} />, color: "#61DAFB", bgColor: "#61DAFB20" },
              { name: "Flutter", icon: <SiFlutter size={20} />, color: "#02569B", bgColor: "#02569B20" },
              { name: "Python", icon: <SiPython size={20} />, color: "#3776AB", bgColor: "#3776AB20" },
              { name: "Docker", icon: <SiDocker size={20} />, color: "#2496ED", bgColor: "#2496ED20" },
              { name: "Kubernetes", icon: <SiKubernetes size={20} />, color: "#326CE5", bgColor: "#326CE520" },
              { name: "GraphQL", icon: <SiGraphql size={20} />, color: "#E10098", bgColor: "#E1009820" },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.05 }}
                className="group"
              >
                <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-border-subtle bg-bg-card px-4 py-8 text-sm font-bold text-text-primary shadow-sm hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700 hover:border-accent/40">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{
                      backgroundColor: tech.bgColor,
                      color: tech.color
                    }}
                  >
                    {tech.icon}
                  </div>
                  <span>{tech.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust Signals Section */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
        <motion.section
          aria-labelledby="trust-heading"
          className="relative border-t border-border-default py-20 md:py-28"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
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
                viewport={{ once: true, amount: 0.1 }}
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

      {/* Featured Insights Section */}
      <FeaturedInsights />

      {/* Why Meetechh Section */}
      <WhyMeetechh />

      {/* Floating CTA */}
      <FloatingCTA />
    </div>
  );
}
