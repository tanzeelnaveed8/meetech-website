"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, GitBranch, Rocket, CheckCircle, Repeat } from "lucide-react";
import Link from "next/link";
import NeuralBackground from "@/components/background/NeuralBackground";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FloatingCTA } from "@/components/ui/FloatingCTA";

export default function ProcessPage() {
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

      {/* Process Hero Section */}
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
          A Process Built for <span className="text-accent">Predictable Success</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
        >
          A proven 5-step methodology that delivers results. From discovery to launch, we're with you every step of the way.
        </motion.p>

        {/* Process Steps Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-6"
        >
          {[
            { icon: <GitBranch />, label: "Discovery", val: "Week 1" },
            { icon: <Rocket />, label: "Planning", val: "Week 2" },
            { icon: <CheckCircle />, label: "Development", val: "Weeks 3-8" },
            { icon: <Repeat />, label: "Testing", val: "Week 9" },
          ].map((item, idx) => (
            <div key={idx} className="px-5 py-3 rounded-xl border border-border-default bg-bg-card text-text-primary shadow-sm hover:shadow-md transition">
              <div className="mb-2 p-2 rounded-full bg-accent-muted text-accent w-fit mx-auto">
                {React.cloneElement(item.icon, { size: 20 })}
              </div>
              <p className="text-sm font-medium text-text-muted">{item.label}</p>
              <p className="text-base font-bold text-accent">{item.val}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Process Timeline & Narrative */}
<div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">

  {/* Narrative Intro */}
  <section className="text-center mb-16 md:mb-24">
    <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
      Our Process, Your Success
    </h2>
    <p className="mx-auto max-w-3xl text-lg md:text-xl text-text-body font-light leading-relaxed">
      Every successful project starts with a clear roadmap. Our tried-and-tested 5-step methodology ensures that every detail is covered—from discovery and planning to execution and launch—so your vision comes to life, efficiently and reliably.
    </p>
  </section>

  {/* Timeline Component */}
  <ProcessTimeline />

  {/* CTA Section */}
  <section
    aria-labelledby="process-cta-heading"
    className="border-t border-border-default py-16 text-center md:py-20"
  >
    <h2
      id="process-cta-heading"
      className="text-2xl md:text-3xl font-bold text-text-primary mb-4"
    >
      Ready to Turn Ideas Into Reality?
    </h2>
    <p className="mx-auto mt-2 max-w-2xl text-lg text-text-body mb-8">
      Let's discuss your project and see how our structured process can accelerate your growth and deliver measurable results.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
      <Link
        href="/contact"
        className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-text-inverse shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:bg-accent-active"
      >
        Start Your Project
      </Link>
      <Link
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border-2 border-accent bg-transparent px-6 py-3 text-base font-semibold text-accent transition-colors hover:bg-accent-muted"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        WhatsApp Us
      </Link>
    </div>
  </section>
</div>

<FloatingCTA />

    </div>
  );
}
