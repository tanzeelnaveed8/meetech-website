"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import {CARDS} from "./data";

export function WhatWeBuild() {
  const reduce = Boolean(useReducedMotion());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section
      aria-labelledby="what-we-build-heading"
      className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden py-16 md:py-20 lg:py-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="max-w-xl space-y-6 mb-16">
          <div className="flex items-center gap-4">
            <span className="h-[2px] w-12 bg-accent"></span>
            <span className="text-accent text-xs font-black uppercase tracking-[0.4em]">Services</span>
          </div>
          <h2
            id="what-we-build-heading"
            className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none"
          >
            What we<br />Build<span className="text-accent">.</span>
          </h2>
          <p className="text-lg text-text-body md:text-xl leading-relaxed">
            Modern solutions that drive growth and scale with you.
          </p>
        </div>
        <motion.ul
          className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-40px" }}
          variants={containerVariants}
        >
          {CARDS.map(({ title, description, href, image, accent }) => (
            <motion.li key={title} variants={itemVariants}>
              <Link href={href}>
                <article className="group relative h-[550px] rounded-[3rem] overflow-hidden cursor-pointer border border-border-subtle bg-bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-0 left-0 p-12 w-full space-y-5">
                    <div className="flex gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-accent bg-accent-muted px-3 py-1 rounded">
                        {accent === "accent" ? "Featured" : "Popular"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-3xl font-black text-text-primary uppercase leading-tight">{title}</h3>
                      <p className="text-text-body text-sm mt-3 leading-relaxed">{description}</p>
                    </div>

                    <div className="flex items-center gap-3 text-accent font-black text-[11px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      Learn More <ArrowRight size={16} />
                    </div>
                  </div>

                  <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <div className="bg-accent text-text-inverse p-4 rounded-2xl shadow-2xl shadow-accent/40">
                      <Eye size={24} />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
