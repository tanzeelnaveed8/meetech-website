"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, Code2, Smartphone, ShoppingBag, Rocket, DollarSign, Store, Heart, GraduationCap, Briefcase, Users } from "lucide-react";
import { SiNextdotjs, SiReact, SiTypescript, SiNodedotjs, SiPostgresql, SiAmazon, SiFlutter, SiPython, SiDocker, SiKubernetes, SiGraphql } from "react-icons/si";
import NeuralBackground from "@/components/background/NeuralBackground";
import { SolutionCard } from "@/components/sections/SolutionCard";
import { SOLUTIONS } from "@/components/sections/solutions-data";
import MeetechCTA from "@/components/sections/CTA";

export default function SolutionsPage() {
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

      {/* Solutions Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 pt-20 text-center">
        {/* Heading & Subheading (animated) */}
        <motion.div style={{ opacity, scale }} className="lg:px-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl  font-extrabold tracking-tight mb-4"
          >
            Solutions Built for <span className="text-accent">Real Business Impact</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-text-body lg:max-w-4xl mx-auto leading-relaxed"
          >
            From mobile apps to enterprise platforms, we deliver production-ready solutions that scale with your business. Choose the solution that fits your needs, or let us build something custom.
          </motion.p>
        </motion.div>

        {/* Technical Validation Grid (static, always visible) */}
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

      {/* Solutions Grid Section */}
      <section
        aria-labelledby="solutions-heading"
        className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
      >
        <div className="max-w-xl space-y-6 mb-16">
          <div className="flex items-center gap-4">
            <span className="h-[2px] w-12 bg-accent"></span>
            <span className="text-accent text-xs font-black uppercase tracking-[0.4em]">Solutions</span>
          </div>
          <h2
            id="solutions-heading"
            className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none"
          >
            Our Core<br />Solutions<span className="text-accent">.</span>
          </h2>
          <p className="text-lg text-text-body md:text-xl leading-relaxed">
            Proven approaches to common business challenges, backed by modern technology and best practices.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-10 lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-40px" }}
          variants={
            reduce
              ? {}
              : {
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.12,
                      delayChildren: 0.08,
                    },
                  },
                }
          }
        >
          {SOLUTIONS.map((solution, index) => (
            <SolutionCard key={solution.id} solution={solution} index={index} />
          ))}
        </motion.div>
      </section>

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
          <div className=" w-full space-y-6 mb-16">
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

      {/* Industries We Serve Section */}
      <section
        aria-labelledby="use-cases-heading"
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
              <span className="text-accent text-xs font-black uppercase tracking-[0.4em]">Industries</span>
            </div>
            <h2
              id="use-cases-heading"
              className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none"
            >
              Industries<br />We Serve<span className="text-accent">.</span>
            </h2>
            <p className="text-lg text-text-body md:text-xl leading-relaxed">
              Our solutions power businesses across diverse industries and verticals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Fintech & Finance",
                description:
                  "Trading platforms, payment systems, and financial dashboards",
                icon: <DollarSign size={24} />,
              },
              {
                title: "E-commerce & Retail",
                description:
                  "Online stores, marketplaces, and inventory management",
                icon: <Store size={24} />,
              },
              {
                title: "Healthcare & Wellness",
                description:
                  "Patient portals, telemedicine, and health tracking apps",
                icon: <Heart size={24} />,
              },
              {
                title: "Education & E-learning",
                description:
                  "Learning platforms, course management, and student portals",
                icon: <GraduationCap size={24} />,
              },
              {
                title: "SaaS & B2B",
                description:
                  "Business tools, analytics platforms, and workflow automation",
                icon: <Briefcase size={24} />,
              },
              {
                title: "Consumer & Social",
                description:
                  "Mobile apps, community platforms, and content sharing",
                icon: <Users size={24} />,
              },
            ].map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-[3rem] border border-border-subtle bg-bg-card p-10 shadow-sm hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-110">
                      {industry.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-text-primary uppercase mb-4">
                    {industry.title}
                  </h3>
                  <p className="text-base leading-relaxed text-text-body">
                    {industry.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <div className="relative z-10 ">
        <MeetechCTA />
      </div>
    </div>
  );
}
