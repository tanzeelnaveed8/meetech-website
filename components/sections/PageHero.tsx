"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { motion } from "framer-motion";

type BreadcrumbItem = { label: string; href?: string };

type PageHeroProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
};

export function PageHero({ breadcrumbs, title, description }: PageHeroProps) {
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.section
      aria-labelledby="page-hero-heading"
      className="relative mb-10 overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-sm md:mb-12"
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-secondary/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-bl from-transparent via-transparent to-accent-secondary/5"
        aria-hidden
      />
      <div className="relative z-10 px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16">
        <nav
          className="mb-6 flex flex-wrap items-center gap-2 text-sm"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((item, i) => (
            <span key={item.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-border-strong">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="font-medium text-text-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="rounded-lg bg-accent/15 px-3 py-1.5 font-semibold text-accent">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <h1
          id="page-hero-heading"
          className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-[2.5rem]"
        >
          {title}
        </h1>
        <div
          className="mt-2 h-1 w-16 rounded-full bg-accent-secondary"
          aria-hidden
        />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-body md:text-lg">
          {description}
        </p>
      </div>
    </motion.section>
  );
}
