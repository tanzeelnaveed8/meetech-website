"use client";

import { motion, useReducedMotion } from "framer-motion";

type Category = {
  id: string;
  label: string;
};

type ProjectFilterProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
};

export function ProjectFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  const reduce = Boolean(useReducedMotion());

  return (
    <nav
      aria-label="Filter projects by category"
      className="mb-12 flex justify-center"
    >
      <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border-default bg-bg-card p-2 shadow-sm">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`relative rounded-xl px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card ${
                isActive
                  ? "text-white"
                  : "text-text-muted hover:text-text-primary"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active Background */}
              {isActive && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }
                  }
                  aria-hidden
                />
              )}

              {/* Label */}
              <span className="relative z-10">{category.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
