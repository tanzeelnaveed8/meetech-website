
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CTA, NAV_LINKS } from "@/lib/nav-config";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

const SCROLL_THRESHOLD = 8;

function NavLink({
  href,
  label,
  onClick,
  variant = "desktop",
}: {
  href: string;
  label: string;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const isMobile = variant === "mobile";

  const base =
    "flex font-semibold tracking-tight text-[0.9375rem] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface";
  const activeStyles = isActive
    ? "text-accent"
    : "text-text-secondary hover:text-text-primary";
  const desktopStyles = !isMobile
    ? `nav-link-underline inline-flex min-h-[44px] items-center justify-center px-3 py-2.5 pb-3 md:px-0 ${isActive ? "is-active" : ""}`
    : "";
  const mobileStyles = isMobile
    ? "min-h-[52px] w-full items-center px-5 py-4 hover:bg-bg-subtle rounded-lg"
    : "";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${activeStyles} ${desktopStyles} ${mobileStyles}`}
    >
      {label}
    </Link>
  );
}

function CtaButton({
  onClick,
  fullWidth,
  reduceMotion,
}: {
  onClick?: () => void;
  fullWidth?: boolean;
  reduceMotion?: boolean;
}) {
  const motion = reduceMotion ? "" : "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0";
  return (
    <Link
      href={CTA.href}
      onClick={onClick}
      className={`flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3 text-[0.9375rem] font-bold text-text-inverse shadow-md transition-all duration-200 ease-out hover:shadow-xl active:bg-accent-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface whitespace-nowrap ${motion} ${fullWidth ? "w-full" : "inline-flex"
        }`}
    >
      {CTA.label}
    </Link>
  );
}

function SocialIconBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-200"
      aria-label="Social media link"
    >
      {icon}
    </a>
  );
}

function HamburgerButton({
  open,
  onClick,
  ariaControls,
  reduceMotion,
}: {
  open: boolean;
  onClick: () => void;
  ariaControls: string;
  reduceMotion?: boolean;
}) {
  const transition = reduceMotion ? "" : "transition-all duration-150 ease-out";
  const hoverScale = reduceMotion ? "" : "hover:scale-105 active:scale-95";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={ariaControls}
      aria-label={open ? "Close menu" : "Open menu"}
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-default bg-bg-surface text-text-primary transition-all duration-200 ease-out hover:border-accent hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface md:hidden ${hoverScale}`}
    >
      <span
        className="relative h-5 w-5"
        aria-hidden
      >
        <span
          className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current ${transition} ${open ? "top-[9px] w-0" : ""
            }`}
        />
        <span
          className={`absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-current ${transition} ${open ? "rotate-45" : ""
            }`}
        />
        <span
          className={`absolute left-0 top-[11px] h-0.5 w-5 rounded-full bg-current ${transition} ${open ? "-translate-y-0.5 -rotate-45" : ""
            }`}
        />
      </span>
    </button>
  );
}

const MOBILE_MENU_ID = "mobile-nav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const updateScrolled = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [updateScrolled]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handle = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const first = mobileMenuRef.current?.querySelector<HTMLAnchorElement>(
      'a[href]'
    );
    if (first) requestAnimationFrame(() => first.focus());
  }, [mobileOpen]);

  return (
    <header
      role="banner"
      data-scrolled={scrolled}
      className="sticky top-0 z-50 w-full border-b border-border-default/30 bg-gradient-to-b from-bg-surface/95 via-bg-surface/90 to-bg-surface/80 dark:bg-bg-surface/80 backdrop-blur-2xl transition-all duration-300 ease-out data-[scrolled=true]:border-border-default/60 data-[scrolled=true]:bg-bg-surface/95 data-[scrolled=true]:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] dark:data-[scrolled=true]:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"
    >
      <div className="relative flex h-[80px] w-full items-center justify-between px-5 md:px-10 lg:px-12">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface rounded-lg"
          >
            {/* Dark mode logo */}
            <Image
              src="/icon.png"
              alt="Logo"
              width={64}
              height={64}
              className="h-16 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg dark-logo"
              priority={true}
            />
            {/* Light mode logo */}
            <Image
              src="/iconlight.png"
              alt="Logo"
              width={64}
              height={64}
              className="h-16 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg light-logo"
              priority={true}
            />
          </Link>
        </div>

        {/* Right: Navigation */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 lg:gap-8 ml-auto mr-6"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </nav>

        {/* Right: Social Icons, CTA, Theme Toggle & Hamburger */}
        <div className="flex items-center gap-3">
          {/* Social Icons - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <SocialIconBtn href="https://github.com" icon={<Github size={16} />} />
            <SocialIconBtn href="https://linkedin.com" icon={<Linkedin size={16} />} />
            <SocialIconBtn href="https://twitter.com" icon={<Twitter size={16} />} />
            <SocialIconBtn href="https://instagram.com" icon={<Instagram size={16} />} />
          </div>

          {/* CTA Button - Hidden on mobile */}
          <div className="hidden md:block">
            <CtaButton reduceMotion={reduceMotion} />
          </div>

          <ThemeToggle />

          <HamburgerButton
            open={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            ariaControls={MOBILE_MENU_ID}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id={MOBILE_MENU_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
        className={`grid md:hidden ${reduceMotion
            ? ""
            : "transition-[grid-template-rows] duration-300 ease-out"
          }`}
        style={{
          gridTemplateRows: mobileOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Primary mobile"
            className="border-t border-border-default/40 bg-bg-surface/95 backdrop-blur-2xl"
          >
            <ul className="flex flex-col py-4 px-4 space-y-2">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <NavLink
                    href={href}
                    label={label}
                    onClick={closeMobile}
                    variant="mobile"
                  />
                </li>
              ))}

              {/* Social Icons in Mobile */}
              <li className="pt-4 pb-2">
                <div className="flex items-center justify-center gap-3">
                  <SocialIconBtn href="https://github.com" icon={<Github size={18} />} />
                  <SocialIconBtn href="https://linkedin.com" icon={<Linkedin size={18} />} />
                  <SocialIconBtn href="https://twitter.com" icon={<Twitter size={18} />} />
                  <SocialIconBtn href="https://instagram.com" icon={<Instagram size={18} />} />
                </div>
              </li>

              <li className="pt-2">
                <CtaButton
                  onClick={closeMobile}
                  fullWidth
                  reduceMotion={reduceMotion}
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
