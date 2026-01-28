"use client";

import { useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NeuralBackground from "@/components/background/NeuralBackground";
import { IconBox, TECH_ITEMS } from "@/components/icons/TechIcons";

type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  boldPhrase?: string;
  bullets: string[];
};

const MOBILE_SERVICES: ServiceDetail[] = [
  {
    id: "ios",
    title: "iOS App Development",
    description: "We build native iOS applications using Swift and SwiftUI that deliver exceptional performance and seamless user experiences on iPhone and iPad.",
    boldPhrase: "native iOS applications",
    bullets: [
      "Swift & SwiftUI Development",
      "App Store Optimization",
      "iOS Design Guidelines",
      "Core Data & CloudKit Integration",
      "Push Notifications & Background Tasks",
    ],
  },
  {
    id: "android",
    title: "Android App Development",
    description: "We create powerful Android applications using Kotlin and Jetpack Compose that work flawlessly across all Android devices and versions.",
    boldPhrase: "Android applications",
    bullets: [
      "Kotlin & Jetpack Compose",
      "Material Design Implementation",
      "Google Play Store Publishing",
      "Firebase Integration",
      "Multi-Device Compatibility",
    ],
  },
  {
    id: "crossplatform",
    title: "Cross-Platform Development",
    description: "We develop cross-platform mobile apps using React Native and Flutter that run on both iOS and Android with a single codebase.",
    boldPhrase: "cross-platform mobile apps",
    bullets: [
      "React Native & Flutter",
      "Single Codebase for iOS & Android",
      "Native Performance",
      "Shared Business Logic",
      "Cost-Effective Development",
    ],
  },
  {
    id: "uiux",
    title: "Mobile UI/UX Design",
    description: "We design intuitive and engaging mobile interfaces that follow platform guidelines and provide exceptional user experiences.",
    boldPhrase: "mobile interfaces",
    bullets: [
      "User-Centered Design",
      "Platform-Specific Guidelines",
      "Interactive Prototypes",
      "Usability Testing",
      "Accessibility Standards",
    ],
  },
  {
    id: "backend",
    title: "Mobile Backend & APIs",
    description: "We build robust backend systems and APIs that power your mobile applications with real-time data, authentication, and cloud storage.",
    boldPhrase: "backend systems and APIs",
    bullets: [
      "RESTful & GraphQL APIs",
      "Firebase & AWS Integration",
      "Real-Time Data Sync",
      "User Authentication",
      "Cloud Storage & CDN",
    ],
  },
  {
    id: "maintenance",
    title: "App Maintenance & Updates",
    description: "We provide ongoing maintenance, updates, and support to keep your mobile apps running smoothly and up-to-date with the latest OS versions.",
    boldPhrase: "maintenance, updates, and support",
    bullets: [
      "OS Version Updates",
      "Bug Fixes & Performance",
      "Feature Enhancements",
      "Analytics & Monitoring",
      "App Store Management",
    ],
  },
];

const HOW_WE_SERVE = [
  {
    title: "Native App Development",
    desc: "We build high-performance native apps for iOS and Android that leverage platform-specific features and deliver the best user experience.",
    icon: "native",
  },
  {
    title: "Cross-Platform Solutions",
    desc: "Using React Native and Flutter, we create apps that work seamlessly on both iOS and Android, reducing development time and costs.",
    icon: "crossplatform",
  },
  {
    title: "App Store Optimization",
    desc: "We optimize your app for maximum visibility and downloads on the App Store and Google Play Store with proper metadata and assets.",
    icon: "appstore",
  },
  {
    title: "Push Notifications",
    desc: "We implement push notification systems to keep users engaged with timely updates, reminders, and personalized messages.",
    icon: "notifications",
  },
  {
    title: "Offline Functionality",
    desc: "We build apps that work offline with local data storage and sync capabilities, ensuring users can access content anytime.",
    icon: "offline",
  },
  {
    title: "App Analytics",
    desc: "We integrate analytics tools to track user behavior, app performance, and engagement metrics for data-driven improvements.",
    icon: "analytics",
  },
];

function ServeIcon({ type }: { type: string }) {
  const cn = "h-6 w-6 shrink-0";
  const stroke = "currentColor";
  const strokeWidth = 2;
  const strokeLinecap = "round";
  const strokeLinejoin = "round";
  switch (type) {
    case "native":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      );
    case "crossplatform":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "appstore":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
      );
    case "notifications":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "offline":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
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

export default function MobileAppsPage() {
  const reduce = Boolean(useReducedMotion());
  const ease = [0.25, 0.46, 0.45, 0.94] as const;
  const duration = 0.5;
  const [selectedServiceId, setSelectedServiceId] = useState<string>("ios");
  const selected = MOBILE_SERVICES.find((s) => s.id === selectedServiceId) ?? MOBILE_SERVICES[0];
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
          Mobile App <span className="text-accent">Development</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
        >
          We create native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.
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
            Mobile Apps
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
          Why Choose Us for Mobile App Development?
        </h2>
        <motion.p
          className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-text-body md:text-base"
          variants={reduce ? {} : { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration, ease }}
        >
          We specialize in building high-performance mobile applications for iOS and Android. Whether you need a native app or a cross-platform solution, we deliver apps that users love and businesses rely on.
        </motion.p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <nav
            aria-label="Service categories"
            className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-1 lg:grid-rows-6"
          >
            {MOBILE_SERVICES.map((s) => {
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
            We build mobile applications that combine beautiful design with powerful functionality. From concept to launch, we handle every aspect of mobile app development.
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
