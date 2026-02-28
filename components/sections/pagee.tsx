
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Shield, Zap, Server, ChevronRight } from 'lucide-react';
import NeuralBackground from '@/components/background/NeuralBackground';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { WhatWeBuild } from '@/components/sections/WhatWeBuild';
import WhyMeetech from '@/components/sections/WhyMeetech';
import ProcessSection from '@/components/sections/ProcessSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
/**
 * MEETECH DESIGN SYSTEM VARIABLES (Extracted from PDF)
 * Primary: #0706F1 (Electric Blue)
 * Slate: #1E293B (Deep Navy)
 * Dark: #0B0B0B (Rich Black)
 * Light: #F8FAFC (Pure Slate)
 */

const MEETECH_THEME = {
  primary: '#0706F1',
  dark: '#0B0B0B',
  slate: '#1E293B',
  light: '#F8FAFC',
};


/* ---------- Motion-safe observer hook ---------- */
function useInView(options = { threshold: 0.15 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}

/* ---------- App ---------- */
export default function App() {
  const badge = useInView();
  const headline = useInView();
  const sub = useInView();
  const cta = useInView();
  const grid = useInView();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg-page text-text-primary font-sans">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <NeuralBackground />

      {/* Ambient Glow */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-125 w-[800px] bg-accent/5 blur-[140px] rounded-lg pointer-events-none" />

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24 text-center md:px-12 lg:px-16">
        <div className="w-full max-w-6xl">

          {/* Trust Badge */}
          <div
            ref={badge.ref}
            className={`mx-auto inline-flex items-center rounded-lg border border-border-default bg-bg-surface/60 backdrop-blur-xl shadow-sm
              transition-all duration-500 ease-out
              motion-reduce:transition-none mb-12 px-6 py-2.5 gap-3
              ${badge.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-lg bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-lg bg-accent" />
            </span>
            <p className="text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase text-text-muted">
              Scaling Innovation · USA · UAE · Global
            </p>
            <ChevronRight className="h-3.5 w-3.5 text-accent" />
          </div>

          {/* Headline */}
          <h1
            ref={headline.ref}
            className={`mb-10 text-5xl font-black tracking-tighter leading-[0.92] md:text-7xl lg:text-8xl
              transition-all duration-500 ease-out
              motion-reduce:transition-none
              ${headline.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Where Ideas <br />
            <span className="text-accent">Meet Technology.</span>
          </h1>

          {/* Subheadline */}
          <p
            ref={sub.ref}
            className={`mx-auto mb-14 max-w-2xl text-lg font-light leading-relaxed text-text-body md:text-xl
              transition-all duration-500 delay-75 ease-out
              motion-reduce:transition-none
              ${sub.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            MEETECH architects high-performance digital ecosystems and
            production-grade products for enterprises requiring absolute
            reliability and global scale.
          </p>

          {/* CTA */}
          <div
            ref={cta.ref}
            className={`flex flex-col items-center justify-center gap-6 sm:flex-row
              transition-all duration-500 delay-100 ease-out
              motion-reduce:transition-none
              ${cta.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <button className="group rounded-xl bg-accent px-10 py-5 font-bold text-text-inverse transition
              hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)]
              active:scale-[0.98]
              motion-reduce:active:scale-100">
              <span className="flex items-center gap-2">
                Explore Solutions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
              </span>
            </button>

            <button className="rounded-xl border border-border-strong px-10 py-5 font-bold transition hover:bg-bg-subtle active:scale-[0.98] motion-reduce:active:scale-100">
              Consult Our Engineers
            </button>
          </div>

          {/* Validation Grid */}
          <div
            ref={grid.ref}
            className={`mt-32 grid grid-cols-2 gap-12 pt-16  border-t border-border-subtle  md:grid-cols-4
              transition-all duration-500 delay-150 ease-out
              motion-reduce:transition-none
              ${grid.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {[
              { icon: <Shield />, label: "Security", val: "Enterprise-Grade" },
              { icon: <Zap />, label: "Performance", val: "Ultra-Low Latency" },
              { icon: <Server />, label: "Infra", val: "Global Architecture" },
              { icon: <Globe />, label: "Compliance", val: "US / MENA" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-4 rounded-2xl bg-accent-muted p-3.5 text-accent transition-colors motion-reduce:transition-none">
                  {React.cloneElement(item.icon, { size: 22 })}
                </div>
                <span className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                  {item.label}
                </span>
                <span className="text-xs font-bold">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Cue (static, accessible) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-40">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">
            Discovery
          </span>
          <div className="h-14 w-[2px] bg-gradient-to-b from-accent to-transparent" />
        </div>
      </div>

      <TrustSignals />
      <WhatWeBuild />
      <WhyMeetech />
      <PortfolioSection />
      <ProcessSection />
    </div>
  );
}
