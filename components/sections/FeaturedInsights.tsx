"use client";

import React from "react";
import Link from "next/link";
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
      <div className="group relative overflow-hidden rounded-2xl sm:rounded-[20px] cursor-pointer h-[200px] sm:h-[240px] w-full max-w-full bg-bg-card border border-border-subtle/50 shadow-lg hover:shadow-2xl hover:shadow-accent/30 transition-all duration-500"
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
        <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-5">
          {/* Top Section - Type Badge */}
          <div className="flex items-start justify-between">
            <span
              className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] backdrop-blur-md border transition-all duration-300 ${
                isCaseStudy
                  ? "bg-accent/20 text-accent border-accent/40 group-hover:bg-accent/30 group-hover:border-accent/60"
                  : "bg-accent-secondary/20 text-accent-secondary border-accent-secondary/40 group-hover:bg-accent-secondary/30 group-hover:border-accent-secondary/60"
              }`}
            >
              {type}
            </span>
          </div>

          {/* Bottom Section - Title & Tags */}
          <div className="space-y-2 sm:space-y-3">
            {/* Tech Badges */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[7px] sm:text-[9px] font-bold uppercase tracking-wider bg-white/10 text-white/90 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title with Glassmorphism */}
            <div className="backdrop-blur-md bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 overflow-hidden">
              <h3 className="text-xs sm:text-sm font-bold leading-tight text-white line-clamp-2 group-hover:text-accent transition-colors duration-300 break-words">
                {title}
              </h3>
            </div>

            {/* Read More Link */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 text-[10px] sm:text-xs font-bold group-hover:text-accent transition-colors duration-300">
              <span>Read More</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent" />
        </div>
      </div>
    </Link>
  );
};

export default function FeaturedInsights() {
  // Distribute cards across 3 columns: 2, 3, 3
  const column1Cards = [insights[0], insights[3]]; // Only 2 cards in leftmost column
  const column2Cards = [insights[1], insights[4], insights[7]]; // 3 cards in middle
  const column3Cards = [insights[2], insights[5], insights[6]]; // 3 cards in rightmost

  return (
    <section className="relative z-10 mx-auto max-w-7xl border-t border-border-default px-3 sm:px-4 py-20 md:px-8 md:py-28 overflow-hidden">
      <div>
        {/* Main Grid Layout */}
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-10 mb-16">
          {/* Left Column - Hero Content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:pr-8 w-full max-w-full overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="h-[2px] w-8 sm:w-12 bg-accent flex-shrink-0"></span>
              <span className="text-accent text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                Featured Insights
              </span>
            </div>

            <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">
              Stories of our<br />
              <span className="text-accent">Transformations</span>
              <span className="text-accent">.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-body md:text-xl leading-relaxed break-words">
              From concept to completion, explore how we've helped businesses across services and industries achieve their digital transformation goals.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
              {[
                { value: "50+", label: "Case Studies" },
                { value: "100+", label: "Blog Articles" },
                { value: "20+", label: "Industries" },
                { value: "5+", label: "Countries" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl sm:text-4xl font-black text-accent mb-2">{stat.value}</div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-4">
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-text-inverse font-bold rounded-xl overflow-hidden transition-all hover:bg-accent-hover hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] active:scale-95"
              >
                <span>Explore More</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column - Card Grid */}
          {/* Mobile: Simple 2-column grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:hidden w-full max-w-full">
            {insights.slice(0, 8).map((card, index) => (
              <div key={`mobile-${index}`} className="w-full min-w-0 max-w-full overflow-hidden">
                <InsightCardComponent {...card} />
              </div>
            ))}
          </div>

          {/* Desktop: Staggered 3-Column Card Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-5">
            {/* Column 1 - Starts with largest offset (leftmost, only 2 cards) */}
            <div className="space-y-5 mt-48">
              {column1Cards.map((card, index) => (
                <div key={`col1-${index}`}>
                  <InsightCardComponent {...card} />
                </div>
              ))}
            </div>

            {/* Column 2 - Starts with medium offset (middle) */}
            <div className="space-y-5 mt-16">
              {column2Cards.map((card, index) => (
                <div key={`col2-${index}`}>
                  <InsightCardComponent {...card} />
                </div>
              ))}
            </div>

            {/* Column 3 - Starts from top (rightmost, 3 cards) */}
            <div className="space-y-5">
              {column3Cards.map((card, index) => (
                <div key={`col3-${index}`}>
                  <InsightCardComponent {...card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
