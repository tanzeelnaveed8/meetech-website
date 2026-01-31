"use client";

import React from "react";
import { useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Users, Zap, Shield, Target, Eye } from "lucide-react";
import NeuralBackground from "@/components/background/NeuralBackground";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const DURATION = 0.5;

const PILLARS = [
  {
    title: "Execution",
    body: "We ship on time. Clear milestones, defined deliverables, and no scope creep. Our track record speaks for itself.",
  },
  {
    title: "Systems",
    body: "Rigorous processes from discovery to deployment. Version control, testing, and documentation are non-negotiable.",
  },
  {
    title: "People",
    body: "Senior engineers and designers who care about craft. Low turnover, high accountability, direct communication.",
  },
  {
    title: "Standards",
    body: "Security, accessibility, and performance baked in. We build for production, not demos.",
  },
] as const;
const visionMission = [
  {
    type: "mission",
    title: "Our Mission",
    description:
      "To design and develop reliable web, app, and software solutions that solve real business problems. We deliver modern, secure, and scalable technology by combining creativity, technical expertise, and a future-focused mindset for clients in Dubai, the USA, and beyond."
  },
  {
    type: "vision",
    title: "Our Vision",
    description:
      "To become a globally trusted technology partner that transforms ideas into impactful digital products, empowering businesses worldwide through innovation, quality, and scalable solutions."
  }
];

const icons = {
  mission: Target,
  vision: Eye
};
const TRUST_HEADLINE = "Trusted by founders & businesses across UAE, USA & beyond.";

const TRUST_SIGNALS = [
  { label: "Delivery across time zones", icon: "globe" },
  { label: "Clear processes, no surprises", icon: "check" },
  { label: "Built to scale with you", icon: "scale" },
  { label: "Long-term partnerships", icon: "handshake" },
] as const;

const SCALE = [
  { end: 12, suffix: "+", label: "Countries" },
  { end: 50, suffix: "+", label: "Enterprise clients" },
  { end: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1 },
  { end: 24, suffix: "/7", label: "Support coverage" },
] as const;

const TESTIMONIALS = [
  {
    quote: "They delivered on time, within budget, and the system has run flawlessly since launch. No surprises.",
    author: "Sarah Chen",
    title: "CTO, FinScale",
  },
  {
    quote: "Professional from day one. Clear communication, solid architecture, and a team that actually listens.",
    author: "James Okonkwo",
    title: "Head of Product, TradeFlow",
  },
  {
    quote: "We needed a partner who could scale with us. They did. The platform handles 10x our initial load without a hiccup.",
    author: "Maria Santos",
    title: "CEO, HealthBridge",
  },
] as const;

function SectionHeading({
  title,
  children,
  id,
}: {
  title: string;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <header className="mb-10 md:mb-14">
      <h2 id={id} className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-[2rem]">
        {title}
      </h2>
      {children && <div className="mt-4 text-text-body md:text-lg">{children}</div>}
    </header>
  );
}

const TRUST_ICONS = {
  globe: (
    <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  check: (
    <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  scale: (
    <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  ),
  handshake: (
    <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m11 17 2 2a1 1 0 0 0 1.414 0l2-2" />
      <path d="M15 11h.01" />
      <path d="M9 11h.01" />
      <path d="m7 21-4-4 4-4" />
      <path d="m17 21 4-4-4-4" />
      <path d="M3 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3" />
      <path d="M19 11h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
    </svg>
  ),
} as const;

const COUNT_DURATION = 1800;

function useCountUp(
  active: boolean,
  end: number,
  suffix: string,
  decimals = 0,
  reduce = false
): string {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || reduce) {
      setVal(0);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / COUNT_DURATION, 1);
      setVal(+(t * end).toFixed(decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, decimals, reduce]);
  if (reduce) return decimals ? end.toFixed(decimals) + suffix : Math.round(end) + suffix;
  if (!active) return decimals ? (0).toFixed(decimals) + suffix : "0" + suffix;
  return decimals ? val.toFixed(decimals) + suffix : Math.round(val) + suffix;
}

function ScaleStat({
  end,
  suffix,
  label,
  decimals = 0,
  inView,
  reduce,
}: {
  end: number;
  suffix: string;
  label: string;
  decimals?: number;
  inView: boolean;
  reduce: boolean;
}) {
  const display = useCountUp(inView, end, suffix, decimals, reduce);
  return (
    <motion.div
      variants={reduce ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: DURATION, ease: EASE }}
      className="rounded-xl border border-border-default bg-bg-card px-6 py-8 text-center"
    >
      <p className="text-2xl font-bold tracking-tight text-accent md:text-3xl">{display}</p>
      <p className="mt-2 text-sm font-medium text-text-muted md:text-base">{label}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  const reduce = Boolean(useReducedMotion());
  const scaleRef = useRef<HTMLElement>(null);
  const scaleInView = useInView(scaleRef, { once: false, amount: 0.15 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.98]);

  return (
    <div className="relative min-h-screen w-full bg-bg-page text-text-primary selection:bg-accent selection:text-text-inverse overflow-hidden font-sans transition-colors duration-500">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Hero Interactive Background */}
      <NeuralBackground />

      {/* Atmospheric Radial Blur */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-150 w-225 bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

  {/* About Hero Section */}
<motion.section
  style={{ opacity, scale }}
  className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center"
>
  {/* Heading */}
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4"
  >
    About <span className="text-accent">Meetech Labs</span>
  </motion.h1>

  {/* Subheading */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
  >
    We design and develop modern web, mobile, and software solutions. Our mission is to solve real business problems with scalable, secure, and future-focused technology.
  </motion.p>

  {/* Key Values - Simple Text */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-text-muted"
  >
    {[
      "Founder-led teams",
      "Global clients: UAE & USA",
      "Production-grade systems",
      "No hype, just execution",
    ].map((item, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span>{item}</span>
      </div>
    ))}
  </motion.div>
</motion.section>

      

      {/* Infinite Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40"
      >
        <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">
          Discover
        </span>
        <div className="w-[1.5px] h-12 bg-linear-to-b from-accent via-accent/50 to-transparent rounded-full" />
      </motion.div>

      {/* Content Sections */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">

        <div className="grid gap-8 md:grid-cols-2 my-10">
          {visionMission.map((item) => {
            const Icon = icons[item.type];

            return (
              <div
                key={item.type}
                className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
              >
                {/* Subtle decorative background glow on hover */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5 transition-all duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-muted text-accent ring-4 ring-accent/5 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-text-primary">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-base leading-relaxed text-text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Trusted by founders & businesses - Simplified */}
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

          {/* Simple Grid without heavy boxes */}
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

        {/* What makes us #1 - Simplified */}
        <motion.section
          aria-labelledby="pillars-heading"
          className="relative border-t border-border-default py-20 md:py-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={reduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }}
        >
          <div className="text-center mb-16">
            <h2 id="pillars-heading" className="text-3xl md:text-4xl font-black text-text-primary uppercase mb-6">
              What makes us #1
            </h2>
            <p className="text-lg text-text-body max-w-2xl mx-auto">
              Execution, systems, people, and standards. We don't cut corners.
            </p>
          </div>

          {/* Simple Grid Layout */}
          <div className="grid gap-16 sm:grid-cols-2 max-w-4xl mx-auto">
            {PILLARS.map(({ title, body }, index) => {
              const icons = {
                Execution: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                Systems: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                People: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                Standards: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              };

              return (
                <motion.article
                  key={title}
                  variants={reduce ? {} : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      {icons[title as keyof typeof icons]}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-text-primary uppercase mb-3">
                        {title}
                      </h3>
                      <p className="text-base leading-relaxed text-text-body">
                        {body}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* Global presence & scale - Simplified */}
        <motion.section
          ref={scaleRef}
          aria-labelledby="scale-heading"
          className="relative border-t border-border-default py-20 md:py-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={reduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } } }}
        >
          <div className="text-center mb-16">
            <h2 id="scale-heading" className="text-3xl md:text-4xl font-black text-text-primary uppercase mb-6">
              Global presence & scale
            </h2>
            <p className="text-lg text-text-body max-w-2xl mx-auto">
              We serve clients across regions. Our infrastructure and support reflect that.
            </p>
          </div>

          {/* Simple Stats Grid */}
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4 max-w-4xl mx-auto">
            {SCALE.map((item) => (
              <motion.div
                key={item.label}
                variants={reduce ? {} : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease: EASE }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-black tracking-tight text-accent mb-3">
                  {useCountUp(scaleInView, item.end, item.suffix, "decimals" in item ? item.decimals : 0, reduce)}
                </p>
                <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team & leadership - Simplified */}
        <motion.section
          aria-labelledby="team-heading"
          className="relative border-t border-border-default py-20 md:py-28"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <div className="text-center mb-16">
            <h2 id="team-heading" className="text-3xl md:text-4xl font-black text-text-primary uppercase mb-6">
              Team & leadership philosophy
            </h2>
            <p className="text-lg text-text-body max-w-2xl mx-auto">
              Founder-led. Structured teams. Clear ownership.
            </p>
          </div>

          {/* Simple Grid Layout */}
          <div className="grid gap-16 sm:grid-cols-2 max-w-4xl mx-auto">
            <motion.article
              initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-text-primary uppercase mb-3">
                    Leadership Close to Delivery
                  </h3>
                  <p className="text-base leading-relaxed text-text-body">
                    Our leadership sets direction and stays close to delivery. We don't hide behind layers. Decisions are made by people who understand both the business and the code.
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-text-primary uppercase mb-3">
                    Accountable Cross-Functional Teams
                  </h3>
                  <p className="text-base leading-relaxed text-text-body">
                    Teams are small, cross-functional, and accountable. Everyone knows who owns what. We hire for craft and fit, and we retain by doing work that matters.
                  </p>
                </div>
              </div>
            </motion.article>
          </div>
        </motion.section>

        {/* Testimonials - Simplified */}
        <motion.section
          aria-labelledby="testimonials-heading"
          className="relative border-t border-border-default py-20 md:py-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={reduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } } }}
        >
          <div className="text-center mb-16">
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-black text-text-primary uppercase mb-6">
              What clients say
            </h2>
            <p className="text-lg text-text-body max-w-2xl mx-auto">
              Straight from the people we work with. No hype.
            </p>
          </div>

          {/* Testimonials Grid */}
          <ul className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto" role="list">
            {TESTIMONIALS.map(({ quote, author, title }, index) => (
              <motion.li
                key={author}
                variants={reduce ? {} : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <blockquote className="flex h-full flex-col">
                  {/* Quote Text */}
                  <div className="flex-1 mb-6">
                    <p className="text-base md:text-lg leading-relaxed text-text-body italic">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>

                  {/* Author Info */}
                  <footer className="flex items-center gap-3 border-t border-border-default pt-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                      {author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">
                        {author}
                      </p>
                      <p className="text-xs text-text-muted">
                        {title}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* CTA - Simplified */}
        <motion.section
          aria-labelledby="cta-heading"
          className="relative border-t border-border-default py-20 md:py-28"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="sr-only">
              Get in touch
            </h2>

            {/* Heading */}
            <motion.h3
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-text-primary uppercase mb-6"
            >
              Ready to work with a partner that delivers?
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="text-lg md:text-xl text-text-body max-w-2xl mx-auto mb-10"
            >
              Let's discuss your project and build something exceptional together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >
              <Link
                href="/contact"
                className="group relative inline-flex min-h-14 w-full sm:w-auto items-center justify-center rounded-xl bg-accent px-8 py-4 text-base font-bold text-text-inverse shadow-lg transition-all duration-300 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 active:bg-accent-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                <span className="relative flex items-center gap-2">
                  Start Your Project
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/contact"
                className="group inline-flex min-h-14 w-full sm:w-auto items-center justify-center rounded-xl border-2 border-accent bg-transparent px-8 py-4 text-base font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-text-inverse hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
              >
                <span className="flex items-center gap-2">
                  Talk to Our Team
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-text-muted"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Free consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Response within 24h</span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
