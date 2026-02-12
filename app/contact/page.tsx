"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, Mail, MessageSquare, Phone, Clock } from "lucide-react";
import NeuralBackground from "@/components/background/NeuralBackground";
import { ContactForm } from "@/components/sections/ContactForm";
import { FloatingCTA } from "@/components/ui/FloatingCTA";

export default function ContactPage() {
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

      {/* Contact Hero Section */}
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
          Let's Build Something <span className="text-accent">Ordinary</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-text-body leading-relaxed"
        >
          Ready to bring your vision to life? Tell us about your project and we'll get back to you within 24 hours with a detailed proposal.
        </motion.p>

        {/* Contact Stats / Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-6"
        >
          {[
            { icon: <Clock />, label: "Response", val: "Within 24 Hours" },
            { icon: <MessageSquare />, label: "Consultation", val: "Free & Detailed" },
            { icon: <Phone />, label: "Support", val: "Direct Access" },
            { icon: <Mail />, label: "Follow-up", val: "Transparent Process" },
          ].map((item, idx) => (
            <div key={idx} className="px-5 py-3  rounded-xl border border-border-default bg-bg-card text-text-primary shadow-sm hover:shadow-md transition">
              <div className="mb-2 p-2 rounded-full bg-accent-muted text-accent w-fit mx-auto">
                {React.cloneElement(item.icon, { size: 20 })}
              </div>
              <p className="text-sm font-medium text-text-muted">{item.label}</p>
              <p className="text-base font-bold text-accent">{item.val}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Infinite Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">
          Connect
        </span>
        <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-full" />
      </div>

      {/* Contact Form */}
      <div id="contact-form" className="relative z-10 mx-auto max-w-4xl px-4 md:px-8 py-16">
        <ContactForm />
      </div>

      <FloatingCTA />
    </div>
  );
}
