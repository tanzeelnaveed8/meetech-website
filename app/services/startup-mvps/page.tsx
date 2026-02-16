"use client";

import { useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NeuralBackground from "@/components/background/NeuralBackground";

type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  boldPhrase?: string;
  bullets: string[];
};

const MVP_SERVICES: ServiceDetail[] = [
  {
    id: "validation",
    title: "Idea Validation & Planning",
    description: "We help you validate your startup idea through market research, competitor analysis, and user interviews to ensure product-market fit.",
    boldPhrase: "validate your startup idea",
    bullets: [
      "Market Research & Analysis",
      "Competitor Benchmarking",
      "User Personal Development",
      "Feature Prioritization",
      "MVP Roadmap Planning",
    ],
  },
  {
    id: "design",
    title: "Rapid Prototyping & Design",
    description: "We create interactive prototypes and user-friendly designs that bring your vision to life and help you test with real users quickly.",
    boldPhrase: "interactive prototypes and user-friendly designs",
    bullets: [
      "Wireframes & Mockups",
      "Interactive Prototypes",
      "User Flow Design",
      "Brand Identity",
      "Design System Creation",
    ],
  },
  {
    id: "development",
    title: "Fast MVP Development",
    description: "We build your Minimum Viable Product quickly using modern frameworks and best practices, focusing on core features that matter most.",
    boldPhrase: "Minimum Viable Product quickly",
    bullets: [
      "Agile Development Sprints",
      "Core Feature Implementation",
      "Cloud-Native Architecture",
      "Scalable Tech Stack",
      "2-8 Week Launch Timeline",
    ],
  },
  {
    id: "testing",
    title: "User Testing & Feedback",
    description: "We help you test your MVP with real users, gather feedback, and analyze data to make informed decisions about next steps.",
    boldPhrase: "test your MVP with real users",
    bullets: [
      "Beta Testing Programs",
      "User Feedback Collection",
      "Analytics Integration",
      "A/B Testing Setup",
      "Performance Monitoring",
    ],
  },
  {
    id: "iteration",
    title: "Iteration & Scaling",
    description: "We iterate based on user feedback and help you scale your product as you gain traction and validate your business model.",
    boldPhrase: "iterate based on user feedback",
    bullets: [
      "Feature Enhancements",
      "Performance Optimization",
      "Infrastructure Scaling",
      "Technical Debt Management",
      "Growth-Focused Updates",
    ],
  },
  {
    id: "fundraising",
    title: "Investor-Ready Product",
    description: "We build MVPs that impress investors with clean code, professional design, and metrics that demonstrate traction and potential.",
    boldPhrase: "MVPs that impress investors",
    bullets: [
      "Professional UI/UX",
      "Demo-Ready Features",
      "Analytics Dashboard",
      "Technical Documentation",
      "Pitch Deck Support",
    ],
  },
];

const HOW_WE_SERVE = [
  {
    title: "Lean Approach",
    desc: "We focus on building only what's essential to test your hypothesis, avoiding feature bloat and keeping costs low.",
    icon: "lean",
  },
  {
    title: "Speed to Market",
    desc: "We use rapid development methodologies to get your MVP in users' hands within weeks, not months.",
    icon: "speed",
  },
  {
    title: "Scalable Foundation",
    desc: "We build MVPs with clean architecture that can scale as your startup grows, avoiding costly rewrites later.",
    icon: "scalable",
  },
  {
    title: "Data-Driven Decisions",
    desc: "We integrate analytics from day one so you can make informed decisions based on real user behavior and metrics.",
    icon: "data",
  },
  {
    title: "Startup Expertise",
    desc: "We understand startup challenges and work with flexible engagement models that fit your budget and timeline.",
    icon: "expertise",
  },
  {
    title: "Post-Launch Support",
    desc: "We provide ongoing support to fix bugs, add features, and help you iterate based on user feedback and market response.",
    icon: "support",
  },
];

function ServeIcon({ type }: { type: string }) {
  const cn = "h-6 w-6 shrink-0";
  const stroke = "currentColor";
  const strokeWidth = 2;
  const strokeLinecap = "round";
  const strokeLinejoin = "round";
  switch (type) {
    case "lean":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "speed":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "scalable":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case "data":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      );
    case "expertise":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "support":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return null;
  }
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function StartupMVPsPage() {
  const reduce = Boolean(useReducedMotion());
  const ease = [0.25, 0.46, 0.45, 0.94] as const;
  const duration = 0.5;
  const [selectedServiceId, setSelectedServiceId] = useState<string>("validation");
  const selected = MVP_SERVICES.find((s) => s.id === selectedServiceId) ?? MVP_SERVICES[0];
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.98]);

  return (
    <div className="relative min-h-screen w-full bg-bg-page text-text-primary selection:bg-accent selection:text-text-inverse overflow-hidden font-sans transition-colors duration-500">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Hero Interactive Background */}
      <NeuralBackground />

      {/* Atmospheric Radial Blur */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Hero Section */}
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
          Startup MVP <span className="text-accent">Development</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
        >
          We build lean, launch-ready MVPs that help startups validate ideas, attract investors, and get to market fast.
        </motion.p>

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 font-medium text-text-muted transition-all hover:text-accent"
          >
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <Link
            href="/services"
            className="rounded-lg px-3 py-1.5 font-medium text-text-muted transition-all hover:text-accent"
          >
            Services
          </Link>
          <span className="text-text-muted">/</span>
          <span className="rounded-lg px-3 py-1.5 font-semibold text-accent">
            Startup MVPs
          </span>
        </motion.nav>
      </motion.section>

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

      {/* Content Sections */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
    <div className="mx-auto max-w-5xl">

      <motion.section
        aria-labelledby="why-heading"
        className="border-t border-border-default py-12 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={reduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } } }}
      >
        <h2 id="why-heading" className="text-xl font-bold tracking-tight text-text-primary md:text-2xl">
          Why Choose Us for Your Startup MVP?
        </h2>
        <motion.p
          className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-text-body md:text-base"
          variants={reduce ? {} : { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration, ease }}
        >
          We specialize in helping startups launch quickly with MVPs that validate ideas and attract early users. Our lean approach focuses on core features while building a foundation that scales.
        </motion.p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <nav
            aria-label="Service categories"
            className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-1 lg:grid-rows-6"
          >
            {MVP_SERVICES.map((s) => {
              const isActive = selectedServiceId === s.id;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedServiceId(s.id)}
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  className={`flex items-center justify-center rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page md:py-4 md:text-base ${
                    isActive
                      ? "border-accent bg-accent text-text-inverse shadow-lg"
                      : "border-border-default bg-bg-card text-text-primary hover:border-accent/40 hover:bg-bg-subtle hover:shadow-md"
                  }`}
                >
                  {s.title}
                </motion.button>
              );
            })}
          </nav>

          <motion.div
            layout
            className="relative overflow-hidden rounded-2xl border-2 border-border-default border-l-4 border-t-4 border-l-accent border-t-accent bg-bg-card"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-accent-secondary/5" aria-hidden />
            <div className="relative p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedServiceId}
                  initial={reduce ? undefined : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.3, ease }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold tracking-tight text-text-primary md:text-2xl">
                    {selected.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-text-body md:text-base">
                    {selected.boldPhrase ? (
                      <>
                        {selected.description.split(selected.boldPhrase)[0]}
                        <strong className="font-semibold text-text-primary">{selected.boldPhrase}</strong>
                        {selected.description.split(selected.boldPhrase)[1]}
                      </>
                    ) : (
                      selected.description
                    )}
                  </p>
                  <ul className="space-y-3" role="list">
                    {selected.bullets.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={reduce ? undefined : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04, ease }}
                        className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-text-inverse">
                          <CheckIcon />
                        </span>
                        <span className="text-[0.9375rem] font-medium text-text-body md:text-base">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        aria-labelledby="serve-heading"
        className="border-t border-border-default py-14 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={reduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } } }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="serve-heading" className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            How We Serve You?
          </h2>
          <motion.div
            className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-accent to-accent-secondary"
            initial={reduce ? undefined : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease }}
            style={{ transformOrigin: "center" }}
          />
          <motion.p
            className="mt-6 text-[0.9375rem] leading-relaxed text-text-body md:text-base"
            initial={reduce ? undefined : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration, ease }}
          >
            We partner with startups to build MVPs that validate ideas quickly and cost-effectively, setting the foundation for long-term success.
          </motion.p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_WE_SERVE.map(({ title, desc, icon }) => (
            <motion.article
              key={title}
              variants={reduce ? {} : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration, ease }}
              className="group relative flex flex-col rounded-2xl border-2 border-border-default bg-bg-card p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-accent/50 hover:shadow-xl md:p-8"
            >
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/8 to-accent-secondary/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative flex flex-col items-center text-center">
                <span className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-text-inverse transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <ServeIcon type={icon} />
                </span>
                <h3 className="text-[1.0625rem] font-bold tracking-tight text-text-primary md:text-lg">{title}</h3>
              </div>
              <p className="relative mt-4 text-left text-[0.9375rem] leading-relaxed text-text-body md:text-base">
                {desc}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.section>
    </div>
      </div>
    </div>
  );
}
