"use client";

import React from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

type FooterLink = {
  name: string;
  href: string;
};

type FooterGroup = {
  title: string;
  links: FooterLink[];
};

type SocialIconBtnProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const footerLinks: FooterGroup[] = [
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Our Work", href: "/work" },
      { name: "Process", href: "/process" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Web Development", href: "/services" },
      { name: "Mobile Apps", href: "/services" },
      { name: "E-commerce", href: "/services" },
      { name: "Custom Software", href: "/services" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "Enterprise", href: "/solutions" },
      { name: "Startups", href: "/solutions" },
      { name: "MVP Development", href: "/solutions" },
      { name: "Consulting", href: "/solutions" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/legal" },
      { name: "Terms of Service", href: "/legal" },
      { name: "Cookie Policy", href: "/legal" },
    ],
  },
];

const contactInfo = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "hello@meetech.dev",
    href: "mailto:hello@meetech.dev",
  },
  {
    icon: <Phone size={18} />,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: <MapPin size={18} />,
    label: "Location",
    value: "Dubai, UAE & USA",
    href: null,
  },
];

const Footer: React.FC = () => {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-bg-page border-t border-border-default pt-20 pb-8 overflow-hidden">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center group w-fit">
              <img
                src="/icon.png"
                alt="Logo"
                className="h-24 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
              />
            </Link>

            <p className="text-text-body text-sm leading-relaxed max-w-sm">
              We design and engineer scalable digital products with precision, performance, and long-term vision. Building the future, one line of code at a time.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <SocialIconBtn
                href="https://github.com"
                icon={<Github size={18} />}
                label="GitHub"
              />
              <SocialIconBtn
                href="https://linkedin.com"
                icon={<Linkedin size={18} />}
                label="LinkedIn"
              />
              <SocialIconBtn
                href="https://twitter.com"
                icon={<Twitter size={18} />}
                label="Twitter"
              />
              <SocialIconBtn
                href="https://instagram.com"
                icon={<Instagram size={18} />}
                label="Instagram"
              />
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-5">
                <h4 className="text-text-primary text-sm font-bold uppercase tracking-wider">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-text-muted text-sm hover:text-accent transition-colors flex items-center group"
                      >
                        <ChevronRight
                          size={14}
                          className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 mr-1"
                        />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="border-t border-border-default pt-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-text-inverse transition-all duration-300">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-text-primary">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-default pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} MeeTech Development. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/legal"
              className="text-text-muted text-xs font-medium hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal"
              className="text-text-muted text-xs font-medium hover:text-accent transition-colors"
            >
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              className="text-text-muted text-xs font-medium hover:text-accent transition-colors flex items-center gap-1 group"
            >
              Back to Top
              <svg
                className="w-4 h-4 group-hover:-translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
    </footer>
  );
};

export default Footer;

/* -------------------- */

const SocialIconBtn: React.FC<SocialIconBtnProps> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-11 h-11 rounded-xl bg-bg-surface border border-border-default flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
  >
    {icon}
  </a>
);
