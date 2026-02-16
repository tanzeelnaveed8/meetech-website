"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import {
  UnderstandIcon,
  PlanIcon,
  DesignIcon,
  ReviewIcon,
  LaunchIcon,
} from "@/components/icons/ProcessIcons";
import { EASE, DURATION, STAGGER_DELAY, STAGGER_DELAY_CHILDREN } from "@/lib/constants";

const PROCESS_STEPS = [
  {
    id: "understand",
    order: 1,
    name: "Understand",
    description:
      "We dive deep into your business goals, target audience, and project requirements to ensure we're aligned from day one.",
    icon: "understand",
  },
  {
    id: "plan",
    order: 2,
    name: "Plan",
    description:
      "We create a detailed roadmap with clear milestones, timelines, and deliverables so you know exactly what to expect.",
    icon: "plan",
  },
  {
    id: "design",
    order: 3,
    name: "Design",
    description:
      "Our designers craft intuitive, beautiful interfaces that reflect your brand and delight your users.",
    icon: "design",
  },
  {
    id: "review",
    order: 4,
    name: "Review",
    description:
      "We iterate based on your feedback, ensuring every detail meets your standards before moving forward.",
    icon: "review",
  },
  {
    id: "launch",
    order: 5,
    name: "Launch",
    description:
      "We deploy your product with confidence, provide training, and ensure a smooth handoff with ongoing support.",
    icon: "launch",
  },
] as const;

const iconComponents = {
  understand: UnderstandIcon,
  plan: PlanIcon,
  design: DesignIcon,
  review: ReviewIcon,
  launch: LaunchIcon,
};

export function ProcessTimeline() {
  const reduce = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="process-timeline-heading"
      className="border-t border-border-default py-16 md:py-24"
    >
      <header className="mb-10 md:mb-14">
        <h2
          id="process-timeline-heading"
          className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-[2rem]"
        >
          Our 5-Step Process
        </h2>
        <p className="mt-4 text-text-body md:text-lg">
          A proven methodology that delivers results, from discovery to launch.
        </p>
      </header>

      {/* Desktop: Horizontal Layout */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={
          reduce
            ? {}
            : {
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: STAGGER_DELAY,
                  delayChildren: STAGGER_DELAY_CHILDREN,
                },
              },
            }
        }
        className="hidden lg:block"
      >
        <div className="relative">
          {/* Connection Line */}
          <div
            className="absolute left-0 right-0 top-[4rem] h-0.5 bg-border-default"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step, index) => {
              const IconComponent = iconComponents[step.icon];
              return (
                <motion.article
                  key={step.id}
                  variants={
                    reduce
                      ? {}
                      : {
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }
                  }
                  transition={{ duration: DURATION, ease: EASE }}
                  className="group relative"
                >
                  {/* Icon Circle */}
                  <div className="relative z-10 mb-6 flex justify-center">
                    <motion.div
                      whileHover={reduce ? {} : { scale: 1.05 }}
                      className="flex h-32 w-32 items-center justify-center rounded-lg border-4 border-bg-page bg-accent/10 text-accent shadow-lg transition-all duration-200 group-hover:bg-accent/15 group-hover:shadow-xl"
                    >
                      <IconComponent />
                    </motion.div>
                  </div>

                  {/* Step Number */}
                  <div className="mb-3 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
                      {step.order}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold tracking-tight text-text-primary">
                      {step.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-body">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (except for last step) */}
                  {index < PROCESS_STEPS.length - 1 && (
                    <div
                      className="absolute right-0 top-[4rem] z-20 -mr-3 flex h-6 w-6 items-center justify-center rounded-lg bg-bg-page"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-4 w-4 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Mobile/Tablet: Vertical Layout */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={
          reduce
            ? {}
            : {
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: STAGGER_DELAY,
                  delayChildren: STAGGER_DELAY_CHILDREN,
                },
              },
            }
        }
        className="lg:hidden"
      >
        <div className="relative space-y-8">
          {/* Connection Line */}
          <div
            className="absolute left-[2rem] top-0 bottom-0 w-0.5 bg-border-default"
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((step) => {
            const IconComponent = iconComponents[step.icon];
            return (
              <motion.article
                key={step.id}
                variants={
                  reduce
                    ? {}
                    : {
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }
                }
                transition={{ duration: DURATION, ease: EASE }}
                className="relative flex gap-6"
              >
                {/* Icon Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border-4 border-bg-page bg-accent/10 text-accent shadow-lg">
                    <IconComponent />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
                      {step.order}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-text-primary">
                      {step.name}
                    </h3>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-text-body">
                    {step.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
