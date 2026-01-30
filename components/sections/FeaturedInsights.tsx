"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface InsightCard {
  type: "Case Study" | "Blog";
  title: string;
  image: string;
  link: string;
  tags?: string[];
}

const insights: InsightCard[] = [
  {
    type: "Case Study",
    title: "US Fashion Resale Platform Scales to 100K Monthly Transactions",
    image: "/images/ecommerce.jpg",
    link: "/work",
    tags: ["Next.js", "PostgreSQL", "AWS"],
  },
  {
    type: "Blog",
    title: "Custom Web Application Development: Everything You Need to Know",
    image: "/images/Websites.jpg",
    link: "/work",
    tags: ["React", "TypeScript"],
  },
  {
    type: "Case Study",
    title: "Hospitality AI Platform Reconciles $300M+ in OTA Commissions",
    image: "/images/software.jpg",
    link: "/work",
    tags: ["Python", "AI", "Cloud"],
  },
  {
    type: "Blog",
    title: "How Cloud Computing Can Transform Small Businesses",
    image: "/images/engineering.jpg",
    link: "/work",
    tags: ["Cloud", "DevOps"],
  },
  {
    type: "Blog",
    title: "Mobile Design Trends: What's Next for Your Business?",
    image: "/images/Mobile.jpg",
    link: "/work",
    tags: ["Mobile", "UI/UX"],
  },
  {
    type: "Case Study",
    title: "US Fintech's AI Financial Modeling Secures $2M+ Funding",
    image: "/images/mvp.jpg",
    link: "/work",
    tags: ["AI", "Fintech", "Node.js"],
  },
  {
    type: "Blog",
    title: "How Generative AI is Transforming Business Operations",
    image: "/images/Deterministic.jpg",
    link: "/work",
    tags: ["AI", "Automation"],
  },
  {
    type: "Case Study",
    title: "Enterprise SaaS Platform Achieves 99.9% Uptime",
    image: "/ecommerce.png",
    link: "/work",
    tags: ["Kubernetes", "Docker"],
  },
  {
    type: "Blog",
    title: "Building Scalable APIs with GraphQL and Node.js",
    image: "/images/engineering.jpg",
    link: "/work",
    tags: ["GraphQL", "Node.js"],
  },
];

const InsightCardComponent = ({ type, title, image, link, tags }: InsightCard) => {
  const isCaseStudy = type === "Case Study";

  return (
    <Link href={link}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="group relative overflow-hidden rounded-[20px] cursor-pointer h-[240px] w-full bg-bg-card border border-border-subtle/50 shadow-lg hover:shadow-2xl hover:shadow-accent/30 transition-all duration-500"
      >
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30" />
        </div>

        {/* Glassmorphism Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          {/* Top Section - Type Badge */}
          <div className="flex items-start justify-between">
            <span
              className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border transition-all duration-300 ${
                isCaseStudy
                  ? "bg-accent/20 text-accent border-accent/40 group-hover:bg-accent/30 group-hover:border-accent/60"
                  : "bg-accent-secondary/20 text-accent-secondary border-accent-secondary/40 group-hover:bg-accent-secondary/30 group-hover:border-accent-secondary/60"
              }`}
            >
              {type}
            </span>
          </div>

          {/* Bottom Section - Title & Tags */}
          <div className="space-y-3">
            {/* Tech Badges */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white/10 text-white/90 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title with Glassmorphism */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
              <h3 className="text-sm font-bold leading-tight text-white line-clamp-2 group-hover:text-accent transition-colors duration-300">
                {title}
              </h3>
            </div>

            {/* Read More Link */}
            <div className="flex items-center gap-2 text-white/80 text-xs font-bold group-hover:text-accent transition-colors duration-300">
              <span>Read More</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent" />
        </div>
      </motion.div>
    </Link>
  );
};

export default function FeaturedInsights() {
  const reduce = Boolean(useReducedMotion());

  // Distribute cards across 3 columns: 2, 3, 3
  const column1Cards = [insights[0], insights[3]]; // Only 2 cards in leftmost column
  const column2Cards = [insights[1], insights[4], insights[7]]; // 3 cards in middle
  const column3Cards = [insights[2], insights[5], insights[6]]; // 3 cards in rightmost

  // Animation variants for smoother scroll animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative z-10 mx-auto max-w-7xl border-t border-border-default px-4 py-20 md:px-8 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px", amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Main Grid Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 mb-16">
          {/* Left Column - Hero Content with Staggered Animations */}
          <motion.div
            className="flex flex-col justify-center space-y-6 lg:pr-8"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              <span className="h-[2px] w-12 bg-accent"></span>
              <span className="text-accent text-xs font-black uppercase tracking-[0.4em]">
                Featured Insights
              </span>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none"
              variants={itemVariants}
            >
              Stories of our<br />
              <span className="text-accent">Transformations</span>
              <span className="text-accent">.</span>
            </motion.h2>

            <motion.p
              className="text-lg text-text-body md:text-xl leading-relaxed"
              variants={itemVariants}
            >
              From concept to completion, explore how we've helped businesses across services and industries achieve their digital transformation goals.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 gap-6 pt-6"
              variants={itemVariants}
            >
              {[
                { value: "50+", label: "Case Studies" },
                { value: "100+", label: "Blog Articles" },
                { value: "20+", label: "Industries" },
                { value: "5+", label: "Countries" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                >
                  <div className="text-4xl font-black text-accent mb-2">{stat.value}</div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              className="pt-4"
              variants={itemVariants}
            >
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-text-inverse font-bold rounded-xl overflow-hidden transition-all hover:bg-accent-hover hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] active:scale-95"
              >
                <span>Explore More</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Staggered 3-Column Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Column 1 - Starts with largest offset (leftmost, only 2 cards) */}
            <div className="space-y-5 lg:mt-48 md:mt-24">
              {column1Cards.map((card, index) => (
                <motion.div
                  key={`col1-${index}`}
                  initial={reduce ? {} : { opacity: 0, y: 100, scale: 0.85, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: true, margin: "-80px", amount: 0.3 }}
                  transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1] as const,
                    delay: index * 0.15
                  }}
                >
                  <InsightCardComponent {...card} />
                </motion.div>
              ))}
            </div>

            {/* Column 2 - Starts with medium offset (middle) */}
            <div className="space-y-5 md:mt-8 lg:mt-16">
              {column2Cards.map((card, index) => (
                <motion.div
                  key={`col2-${index}`}
                  initial={reduce ? {} : { opacity: 0, y: 100, scale: 0.85, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: true, margin: "-80px", amount: 0.3 }}
                  transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3 + index * 0.15
                  }}
                >
                  <InsightCardComponent {...card} />
                </motion.div>
              ))}
            </div>

            {/* Column 3 - Starts from top (rightmost, 3 cards) */}
            <div className="space-y-5 hidden lg:block">
              {column3Cards.map((card, index) => (
                <motion.div
                  key={`col3-${index}`}
                  initial={reduce ? {} : { opacity: 0, y: 100, scale: 0.85, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: true, margin: "-80px", amount: 0.3 }}
                  transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.6 + index * 0.15
                  }}
                >
                  <InsightCardComponent {...card} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
