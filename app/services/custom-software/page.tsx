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

const SOFTWARE_SERVICES: ServiceDetail[] = [
  {
    id: "enterprise",
    title: "Enterprise Software Solutions",
    description: "We build scalable enterprise software systems that streamline operations, improve efficiency, and support business growth across departments.",
    boldPhrase: "enterprise software systems",
    bullets: [
      "ERP & CRM Systems",
      "Workflow Automation",
      "Multi-Tenant Architecture",
      "Role-Based Access Control",
      "Integration with Legacy Systems",
    ],
  },
  {
    id: "saas",
    title: "SaaS Platform Development",
    description: "We develop Software-as-a-Service platforms with subscription management, multi-tenancy, and scalable cloud infrastructure.",
    boldPhrase: "Software-as-a-Service platforms",
    bullets: [
      "Subscription & Billing Systems",
      "Multi-Tenant Architecture",
      "Cloud-Native Infrastructure",
      "API-First Design",
      "Analytics & Reporting",
    ],
  },
  {
    id: "automation",
    title: "Business Process Automation",
    description: "We automate repetitive tasks and workflows to save time, reduce errors, and improve productivity across your organization.",
    boldPhrase: "automate repetitive tasks and workflows",
    bullets: [
      "Workflow Automation Tools",
      "Document Processing",
      "Data Migration & ETL",
      "Integration with Third-Party Tools",
      "Custom Business Logic",
    ],
  },
  {
    id: "crm",
    title: "Custom CRM Development",
    description: "We build tailored Customer Relationship Management systems that fit your unique sales process, customer journey, and business requirements.",
    boldPhrase: "Customer Relationship Management systems",
    bullets: [
      "Lead & Contact Management",
      "Sales Pipeline Tracking",
      "Email & Communication Tools",
      "Reporting & Analytics",
      "Mobile CRM Access",
    ],
  },
  {
    id: "inventory",
    title: "Inventory Management Systems",
    description: "We create custom inventory and warehouse management solutions that track stock, automate reordering, and optimize supply chain operations.",
    boldPhrase: "inventory and warehouse management solutions",
    bullets: [
      "Real-Time Stock Tracking",
      "Automated Reordering",
      "Barcode & QR Scanning",
      "Multi-Location Support",
      "Supplier Management",
    ],
  },
  {
    id: "integration",
    title: "System Integration",
    description: "We connect your existing systems, databases, and third-party tools to create a unified ecosystem that shares data seamlessly.",
    boldPhrase: "connect your existing systems",
    bullets: [
      "API Development & Integration",
      "Database Synchronization",
      "Legacy System Modernization",
      "Middleware Solutions",
      "Real-Time Data Exchange",
    ],
  },
];

const HOW_WE_SERVE = [
  {
    title: "Requirements Analysis",
    desc: "We work closely with you to understand your business processes, pain points, and goals to design software that solves real problems.",
    icon: "analysis",
  },
  {
    title: "Custom Architecture",
    desc: "We design scalable, secure, and maintainable software architecture tailored to your specific needs and future growth plans.",
    icon: "architecture",
  },
  {
    title: "Agile Development",
    desc: "We use agile methodologies with regular sprints, demos, and feedback loops to ensure the software meets your expectations.",
    icon: "agile",
  },
  {
    title: "Quality Assurance",
    desc: "We implement comprehensive testing strategies including unit tests, integration tests, and user acceptance testing.",
    icon: "qa",
  },
  {
    title: "Deployment & Training",
    desc: "We handle deployment, provide documentation, and train your team to ensure smooth adoption and effective use of the software.",
    icon: "deployment",
  },
  {
    title: "Ongoing Support",
    desc: "We provide maintenance, updates, and technical support to keep your custom software running smoothly and evolving with your business.",
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
    case "analysis":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case "architecture":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "agile":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "qa":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "deployment":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
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

export default function CustomSoftwarePage() {
  const reduce = Boolean(useReducedMotion());
  const ease = [0.25, 0.46, 0.45, 0.94] as const;
  const duration = 0.5;
  const [selectedServiceId, setSelectedServiceId] = useState<string>("enterprise");
  const selected = SOFTWARE_SERVICES.find((s) => s.id === selectedServiceId) ?? SOFTWARE_SERVICES[0];
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
          Custom Software <span className="text-accent">Development</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
        >
          We build tailored software solutions that streamline your workflows, automate processes, and solve unique business challenges.
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
            Custom Software
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
          Why Choose Us for Custom Software Development?
        </h2>
        <motion.p
          className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-text-body md:text-base"
          variants={reduce ? {} : { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration, ease }}
        >
          We specialize in building custom software that fits your exact requirements. From enterprise systems to workflow automation, we create solutions that give you a competitive advantage.
        </motion.p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <nav
            aria-label="Service categories"
            className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-1 lg:grid-rows-6"
          >
            {SOFTWARE_SERVICES.map((s) => {
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
            We follow a proven process to deliver custom software that meets your exact needs and exceeds your expectations.
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
