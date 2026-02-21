/**
 * Global navigation configuration.
 * No page-specific logic   structure only.
 */

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
] as const;

export const CTA = {
  label: "Start Your Project",
  href: "/contact",
} as const;
