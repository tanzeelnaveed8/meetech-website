"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "./projects-data";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.article
      className={`group flex flex-col overflow-hidden rounded-2xl border-2 bg-bg-card shadow-lg transition-all duration-300 hover:shadow-xl ${
        project.accent === "accent"
          ? "border-accent/30 hover:border-accent/60"
          : "border-accent-secondary/30 hover:border-accent-secondary/60"
      }`}
      style={{ transformOrigin: "50% 30%" }}
      variants={
        reduce
          ? {}
          : {
              hidden: { scale: 0.92, opacity: 0 },
              visible: { scale: 1, opacity: 1 },
            }
      }
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Image Section with Hover Reveal */}
      <div className="relative h-64 w-full shrink-0 overflow-hidden bg-bg-surface">
        <div
          className={`absolute inset-0 w-full transition-transform duration-500 ease-out ${
            reduce ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
          }`}
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
          />
        </div>

        {/* Year Badge */}
        <div className="absolute right-4 top-4 z-10">
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${
              project.accent === "accent"
                ? "bg-accent/90 text-white"
                : "bg-accent-secondary/90 text-white"
            }`}
          >
            {project.year}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Client & Category */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="font-semibold text-text-muted">{project.client}</span>
          <span className="text-border-strong">•</span>
          <span className="capitalize text-text-muted">
            {project.category.replace("-", " ")}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-text-primary md:text-2xl">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-4 flex-1 text-base leading-relaxed text-text-body">
          {project.description}
        </p>

        {/* Technology Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-border-default bg-bg-surface px-3 py-1 text-xs font-medium text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Case Study Link */}
        <div className="mt-6 flex items-center justify-between border-t border-border-default pt-6">
          <Link
            href="/contact"
            className={`group/link inline-flex items-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page ${
              project.accent === "accent"
                ? "text-accent hover:text-accent/80"
                : "text-accent-secondary hover:text-accent-secondary/80"
            }`}
          >
            View case study
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
