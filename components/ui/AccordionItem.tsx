"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/constants";

interface AccordionItemProps {
  id: string;
  heading: string;
  content: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export function AccordionItem({
  id,
  heading,
  content,
  isExpanded,
  onToggle,
}: AccordionItemProps) {
  const reduce = Boolean(useReducedMotion());

  return (
    <div className="rounded-xl border border-border-default bg-bg-card shadow-sm">
      <motion.button
        onClick={() => onToggle(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(id);
          }
        }}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${id}`}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 md:p-8"
      >
        <h3 className="text-xl font-bold tracking-tight text-text-primary md:text-[1.35rem]">
          {heading}
        </h3>
        <motion.svg
          animate={reduce ? {} : { rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="h-6 w-6 flex-shrink-0 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`accordion-content-${id}`}
            initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div className="prose prose-slate max-w-none px-6 pb-6 dark:prose-invert md:px-8 md:pb-8">
              <div
                className="text-text-body"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
