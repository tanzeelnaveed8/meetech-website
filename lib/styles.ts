/**
 * Button className patterns following MEETECH Development constitution
 * Reusable button styles for consistent UI across all pages
 */

/**
 * Primary button style
 * Use for main CTAs and primary actions
 */
export const PRIMARY_BUTTON_CLASS =
  "inline-flex min-h-[48px] items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-text-inverse shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:bg-accent-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page";

/**
 * Secondary button style (outline)
 * Use for secondary actions and alternative CTAs
 */
export const SECONDARY_BUTTON_CLASS =
  "inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-accent bg-transparent px-6 py-3 text-base font-semibold text-accent transition-colors hover:bg-accent-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page";

/**
 * Card style pattern
 * Use for content cards, process steps, testimonials, etc.
 */
export const CARD_CLASS =
  "rounded-xl border border-border-default bg-bg-card p-6 md:p-8 shadow-sm transition-all duration-200 hover:shadow-md";

/**
 * Section heading style pattern
 * Use for h2 section headings
 */
export const SECTION_HEADING_CLASS =
  "text-2xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-[2rem]";
