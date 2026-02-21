"use client";

import { useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IconBox, TECH_ITEMS } from "@/components/icons/TechIcons";
import NeuralBackground from "@/components/background/NeuralBackground";

type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  boldPhrase?: string;
  bullets: string[];
};

const WHY_FIRST_CHOICE_SERVICES: ServiceDetail[] = [
  {
    id: "frontend",
    title: "Front-End Development",
    description: "We craft stunning, responsive, and user-friendly front-end web applications using modern technologies and best UI/UX practices.",
    boldPhrase: "front-end web applications",
    bullets: [
      "HTML, CSS, JavaScript Development",
      "React, Vue.js & Angular Applications",
      "Responsive & Interactive Design",
      "Cross-Browser Compatibility",
      "Performance Optimization",
    ],
  },
  {
    id: "backend",
    title: "Back-End Development",
    description: "We build robust, scalable back-end systems and APIs that power your applications, ensuring security, performance, and seamless data flow.",
    boldPhrase: "back-end systems and APIs",
    bullets: [
      "Node.js, Python, PHP & Laravel",
      "RESTful & GraphQL API Design",
      "Database Architecture (SQL & NoSQL)",
      "Authentication & Authorization",
      "Server Deployment & DevOps",
    ],
  },
  {
    id: "fullstack",
    title: "Full-Stack Development",
    description: "We deliver end-to-end full-stack solutions that connect your front-end experience with powerful back-end logic and scalable infrastructure.",
    boldPhrase: "full-stack solutions",
    bullets: [
      "Unified Front-End & Back-End Development",
      "Modern Frameworks (Next.js, Remix, etc.)",
      "Cloud-Native & Serverless Options",
      "CI/CD & Automated Testing",
      "End-to-End Ownership",
    ],
  },
  {
    id: "ecommerce",
    title: "E-Commerce Development",
    description: "We create powerful, secure e-commerce platforms and online stores that drive sales, manage inventory, and deliver seamless checkout experiences.",
    boldPhrase: "e-commerce platforms and online stores",
    bullets: [
      "Custom Stores & Marketplaces",
      "Payment Gateway Integration",
      "Inventory & Order Management",
      "SEO & Conversion Optimization",
      "Scalable Architecture",
    ],
  },
  {
    id: "cms",
    title: "CMS Development",
    description: "We build flexible Content Management Systems and integrate platforms like WordPress and Shopify so you can manage, update, and scale content with ease.",
    boldPhrase: "Content Management Systems",
    bullets: [
      "WordPress, Shopify & Custom CMS",
      "Content Modeling & Workflows",
      "Multi-Language & Localization",
      "Media & Asset Management",
      "Editor-Friendly Admin UIs",
    ],
  },
  {
    id: "pwa",
    title: "Progressive Web App (PWA)",
    description: "We develop Progressive Web Apps that work offline, load instantly, and feel like native apps reachable via the web without app store friction.",
    boldPhrase: "Progressive Web Apps",
    bullets: [
      "Offline-First & Service Workers",
      "Fast Load & Caching Strategies",
      "Installable & App-Like UX",
      "Push Notifications",
      "Cross-Device Sync",
    ],
  },
  {
    id: "api",
    title: "API & Integration",
    description: "We design and integrate APIs and third-party systems CRMs, payment gateways, analytics so your product is connected, automated, and future-ready.",
    boldPhrase: "APIs and third-party systems",
    bullets: [
      "REST, GraphQL & Webhook Design",
      "CRM, ERP & Analytics Integration",
      "Payment & Shipping Gateways",
      "Legacy System Modernization",
      "Documentation & Developer Experience",
    ],
  },
  {
    id: "maintenance",
    title: "Website Maintenance & Support",
    description: "We provide ongoing website maintenance and support updates, security, monitoring so your digital presence stays secure, fast, and reliable.",
    boldPhrase: "website maintenance and support",
    bullets: [
      "Security Updates & Patches",
      "Performance Monitoring & Optimization",
      "Backup & Recovery",
      "Content Updates & Minor Features",
      "Dedicated Support & SLAs",
    ],
  },
];

const HOW_WE_SERVE = [
  {
    title: "Custom Website Development",
    desc: "We build websites from scratch that perfectly align with your brand, business goals, and customer needs ensuring uniqueness, flexibility, and long-term scalability.",
    icon: "custom",
  },
  {
    title: "Responsive & Mobile-Friendly Design",
    desc: "Our websites are optimized for all devices and screen sizes, delivering a consistent and engaging user experience across mobile, tablet, and desktop.",
    icon: "responsive",
  },
  {
    title: "E-commerce Development",
    desc: "We create powerful, secure, and scalable e-commerce platforms with custom features, payment gateways, and seamless shopping experiences to boost sales and customer retention.",
    icon: "ecommerce",
  },
  {
    title: "CMS Development",
    desc: "With custom Content Management Systems (CMS) like WordPress, Shopify, and others, we empower you to easily manage, update, and scale your website.",
    icon: "cms",
  },
  {
    title: "API Integration",
    desc: "We integrate third-party tools and APIs such as CRMs, payment gateways, and analytics ensuring your website is powerful, connected, and future-ready.",
    icon: "api",
  },
  {
    title: "Web Application Development",
    desc: "From dashboards to custom portals, we deliver interactive and high-performing web applications tailored to your business requirements.",
    icon: "webapp",
  },
];

function ServeIcon({ type }: { type: string }) {
  const cn = "h-6 w-6 shrink-0";
  const stroke = "currentColor";
  const strokeWidth = 2;
  const strokeLinecap = "round";
  const strokeLinejoin = "round";
  switch (type) {
    case "custom":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path d="M7 8h3l1 2 2-2h2" />
          <circle cx="17" cy="10" r="1.5" />
        </svg>
      );
    case "responsive":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <rect x="2" y="4" width="9" height="14" rx="1" />
          <rect x="13" y="6" width="7" height="10" rx="1" />
          <path d="M5 9h4M5 12h4M5 15h2" />
        </svg>
      );
    case "ecommerce":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case "cms":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      );
    case "api":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      );
    case "webapp":
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
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

export default function WebsitesWebAppsPage() {
  const reduce = Boolean(useReducedMotion());
  const ease = [0.25, 0.46, 0.45, 0.94] as const;
  const duration = 0.5;
  const [selectedServiceId, setSelectedServiceId] = useState<string>("frontend");
  const selected = WHY_FIRST_CHOICE_SERVICES.find((s) => s.id === selectedServiceId) ?? WHY_FIRST_CHOICE_SERVICES[0];
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
          Web Development <span className="text-accent">Services</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
        >
          We create responsive, secure, and high-performing websites tailored to your business needs.
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
            Web Development
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
            aria-labelledby="tech-heading"
            className="border-t border-border-default py-14 md:py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={reduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } } }}
          >
            <h2
              id="tech-heading"
              className="text-center text-2xl font-bold tracking-tight md:text-3xl"
              style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
            >
              <span className="text-text-primary">Web Development</span>
              <span className="text-accent"> Technologies</span>
            </h2>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-4 gap-x-6 gap-y-12 sm:grid-cols-6 md:grid-cols-8 md:gap-x-10 md:gap-y-14">
              {TECH_ITEMS.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  className={`flex justify-center ${i === 8 ? "md:col-start-2" : i === 9 ? "md:col-start-3" : i === 10 ? "md:col-start-4" : i === 11 ? "md:col-start-5" : i === 12 ? "md:col-start-6" : i === 13 ? "md:col-start-7" : ""
                    }`}
                  variants={reduce ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration, ease }}
                >
                  <IconBox {...tech} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            aria-labelledby="why-heading"
            className="border-t border-border-default py-12 md:py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={reduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } } }}
          >
            <h2 id="why-heading" className="text-xl font-bold tracking-tight text-text-primary md:text-2xl">
              Why Are We a First-Choice For Premium Web Development Services?
            </h2>
            <motion.p
              className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-text-body md:text-base"
              variants={reduce ? {} : { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration, ease }}
            >
              We specialize in delivering full-spectrum web development services, creating high-performance, visually appealing websites that drive business success. Whatever your web project needs, we apply industry best practices and modern technologies to build solutions that stand out.
            </motion.p>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
              <nav
                aria-label="Service categories"
                className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-1 lg:grid-rows-8"
              >
                {WHY_FIRST_CHOICE_SERVICES.map((s) => {
                  const isActive = selectedServiceId === s.id;
                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      whileHover={reduce ? undefined : { scale: 1.02 }}
                      whileTap={reduce ? undefined : { scale: 0.98 }}
                      className={`flex items-center justify-center rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page md:py-4 md:text-base ${isActive
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
                We specialize in crafting modern, scalable, and high-performing websites tailored to your business needs. From simple landing pages to complex web applications, we deliver solutions that drive growth, enhance user experience, and strengthen your digital presence.
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
