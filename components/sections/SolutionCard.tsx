"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Eye, ArrowRight } from "lucide-react";
import type { Solution } from "./solutions-data";

type SolutionCardProps = {
  solution: Solution;
  index: number;
};

export function SolutionCard({ solution, index }: SolutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.article
      id={solution.id}
      className="group relative h-[550px] rounded-[3rem] overflow-hidden cursor-pointer border border-border-subtle bg-bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700"
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
      {/* Full-height Image */}
      <img
        src={solution.image}
        alt={solution.title}
        className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Content at Bottom */}
      <div className="absolute bottom-0 left-0 p-12 w-full space-y-5">
        {/* Technology Tags */}
        <div className="flex gap-2 flex-wrap">
          {solution.technologies.slice(0, 2).map((tech) => (
            <span
              key={tech}
              className="text-[10px] uppercase font-bold tracking-widest text-accent bg-accent-muted px-3 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        <div>
          <h3 className="text-3xl font-black text-text-primary uppercase leading-tight">{solution.title}</h3>
          <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-2">{solution.tagline}</p>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 text-accent font-black text-[11px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500"
        >
          {isExpanded ? "Show Less" : "View Details"} <ArrowRight size={16} />
        </button>
      </div>

      {/* Eye Icon */}
      <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
        <div className="bg-accent text-text-inverse p-4 rounded-2xl shadow-2xl shadow-accent/40">
          <Eye size={24} />
        </div>
      </div>

      {/* Expandable Details Modal Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-bg-page/95 backdrop-blur-sm z-10 overflow-y-auto"
            onClick={() => setIsExpanded(false)}
          >
            <div className="p-8 md:p-12" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-lg bg-accent/10 hover:bg-accent text-accent hover:text-text-inverse flex items-center justify-center transition-all duration-300"
              >
                <ChevronDown className="rotate-180" size={20} />
              </button>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-black text-text-primary uppercase mb-2">
                {solution.title}
              </h3>
              <p className="text-text-muted font-bold text-sm uppercase tracking-wider mb-6">
                {solution.tagline}
              </p>

              {/* Description */}
              <p className="text-base leading-relaxed text-text-body mb-8">
                {solution.description}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h4 className="mb-4 text-sm font-black uppercase tracking-wide text-text-primary">
                  Key Features
                </h4>
                <ul className="space-y-3" role="list">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                      <span className="text-sm text-text-body">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="mb-4 text-sm font-black uppercase tracking-wide text-text-primary">
                  Common Use Cases
                </h4>
                <ul className="space-y-3" role="list">
                  {solution.useCases.map((useCase) => (
                    <li key={useCase} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-lg bg-accent" aria-hidden />
                      <span className="text-sm text-text-body">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* All Technologies */}
              <div className="mt-8 flex flex-wrap gap-2">
                {solution.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1.5 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
