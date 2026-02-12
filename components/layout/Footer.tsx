"use client";

import React, { useState, useEffect } from "react";
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
  Facebook,
} from "lucide-react";
import NeuralBackground from "../background/NeuralBackground";

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
      { name: "Web Development", href: "/services/websites-web-apps" },
      { name: "Mobile Apps", href: "/services/mobile-apps" },
      { name: "Startup MVPs", href: "/services/startup-mvps" },
      { name: "Custom Software", href: "/services/custom-software" },
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
      { name: "Privacy Policy", href: "/legal/privacy" },
      { name: "Terms of Service", href: "/legal/terms_of_service" },
      { name: "Cookie Policy", href: "/legal/cookie" },
    ],
  },
];

const contactInfo = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "meetechdevelopment@gmail.com",
    href: "mailto:meetechdevelopment@gmail.com",
  },
  {
    icon: <Phone size={18} />,
    label: "Phone",
    value: "+1 334 926 9060",
    href: "tel:+1 334 926 9060",
  },
  {
    icon: <MapPin size={18} />,
    label: "Location",
    value: "United States",
    href: "https://www.google.com/maps?q=United+States",
  },
];

const Footer: React.FC = () => {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-bg-surface text-text-muted border-t border-border-default pt-20 pb-8 overflow-hidden">
      {/* Decorative gradient line at top */}

      {/* Decorative Grid: Uses border-default variable for theme-aware lines
      < div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none " /> */}

      <NeuralBackground />
      {/* Atmospheric Radial Blur */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="container relative z-20 text-text-muted mx-auto px-3 md:px-8 lg:px-12 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-4 space-y-6 text-text-muted">
            <Link href="/" className="flex items-center group w-fit">
              {/* Dark mode logo */}
              <img
                src="/icon.png"
                alt="Logo"
                className="h-24 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg dark-logo"
              />
              {/* Light mode logo */}
              <img
                src="/iconlight.png"
                alt="Logo"
                className="h-24 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg light-logo"
              />
            </Link>

            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              We design and engineer scalable digital products with precision, performance, and long-term vision. Building the future, one line of code at a time.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-text-muted">
              <SocialIconBtn
                href="#"
                icon={<Github size={18} />}
                label="GitHub"
              />
              <SocialIconBtn
                href="#"
                icon={<Linkedin size={18} />}
                label="LinkedIn"
              />
              <SocialIconBtn
                href="https://www.facebook.com/share/1AXzwMhXZL/?mibextid=wwXIfr"
                icon={<Facebook size={18} />}
                label="Facebook"
              />
              <SocialIconBtn
                href="https://www.instagram.com/meetechdevelopment?igsh=MXV3MDlydmRhczF2Nw%3D%3D&utm_source=qr"
                icon={<Instagram size={18} />}
                label="Instagram"
              />
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-5 ">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-text-muted hover:text-accent hover:cursor-pointer transition-colors"
                    >
                      {item.value}
                    </a>

                  ) : (
                    <p className="text-sm font-medium text-text-muted">
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
            © {new Date().getFullYear()} Meetech Development. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/legal/privacy"
              className="text-text-muted text-xs font-medium hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms_of_service"
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
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 blur-[120px] rounded-lg pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/5 blur-[120px] rounded-lg pointer-events-none" />
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
