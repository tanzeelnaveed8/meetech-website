"use client";

import React from "react";
import { ArrowRight, ChevronRight, GitBranch, Rocket, CheckCircle, Repeat } from "lucide-react";
import Link from "next/link";
import NeuralBackground from "@/components/background/NeuralBackground";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import ProcessSection from "@/components/sections/ProcessSection";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full bg-bg-page text-text-primary selection:bg-accent selection:text-text-inverse overflow-hidden font-sans transition-colors duration-500">

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Hero Interactive Background */}
      <NeuralBackground />

      {/* Atmospheric Radial Blur */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-accent/5 blur-[140px] rounded-lg pointer-events-none" />

      {/* Process Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
          A Process Built for <span className="text-accent">Predictable Success</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed">
          A proven 5-step methodology that delivers results. From discovery to launch, we're with you every step of the way.
        </p>

        {/* Process Steps Preview */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {[
            { icon: <GitBranch />, label: "Discovery", val: "Week 1" },
            { icon: <Rocket />, label: "Planning", val: "Week 2" },
            { icon: <CheckCircle />, label: "Development", val: "Weeks 3-8" },
            { icon: <Repeat />, label: "Testing", val: "Week 9" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="w-44 px-5 py-3 rounded-xl border border-border-default bg-bg-card text-text-primary shadow-sm hover:shadow-md transition"
            >
              <div className="mb-2 p-2 rounded-lg bg-accent-muted text-accent w-fit mx-auto">
                {React.cloneElement(item.icon, { size: 20 })}
              </div>
              <p className="text-sm font-medium text-text-muted">{item.label}</p>
              <p className="text-base font-bold text-accent">{item.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Timeline & Narrative */}
      <ProcessSection />

      <FloatingCTA />
    </div>
  );
}
