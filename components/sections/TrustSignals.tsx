"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

const HEADLINE =
  "Trusted by founders & businesses across UAE, USA & beyond";

const SIGNALS = [
  "Delivery across time zones",
  "Clear processes, no surprises",
  "Built to scale with you",
  "Long-term partnerships",
] as const;

const ICONS = [GlobeIcon, CheckIcon, ScaleIcon, HandshakeIcon];

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m11 17 2 2a1 1 0 0 0 1.414 0l2-2" />
      <path d="M15 11h.01" />
      <path d="M9 11h.01" />
      <path d="m7 21-4-4 4-4" />
      <path d="m17 21 4-4-4-4" />
      <path d="M3 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3" />
      <path d="M19 11h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}

export function TrustSignals() {
  const reduce = Boolean(useReducedMotion());

  return (
    <section aria-labelledby="trust-heading" className="relative w-full py-16  md:py-24 mb-20 md:mb-32 z-30">
      {/* Subtle Background */}
      {/* <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-accent/5 via-accent-secondary/5 to-accent/5 rounded-[4rem] blur-[150px]" />
      </div> */}

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Refined Headline */}
        <h2
          id="trust-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.04em] leading-[1.1] text-text-primary mb-12 text-center md:text-left"
        >
          {HEADLINE}
        </h2>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" role="list">
          {SIGNALS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.li
                key={item}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-24px" }}
                transition={{ duration: 0.35, delay: reduce ? 0 : i * 0.06 }}
                whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.2 } }}
                className="group relative z-10"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border-default bg-bg-card p-6 shadow-sm transition-all duration-300 hover:border-border-strong hover:shadow-xl md:p-8">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[1rem] font-bold leading-snug text-text-body md:text-lg tracking-tight">
                    {item}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

