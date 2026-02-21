
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
     ShoppingBag,
     CreditCard,
     Truck,
     ShieldCheck,
     BarChart3,
     Users,
     Search,
     Smartphone,
     ChevronRight,
     CheckCircle2,
     Package,
     Store,
     Zap,
     Globe,
} from "lucide-react";
import NeuralBackground from "@/components/background/NeuralBackground";
import { cubicBezier } from "framer-motion";


const TECH_ITEMS = [
     { name: "Meta Ads", icon: <BarChart3 className="w-8 h-8" /> },
     { name: "Instagram", icon: <Users className="w-8 h-8" /> },
     { name: "Facebook", icon: <Globe className="w-8 h-8" /> },
     { name: "LinkedIn Ads", icon: <ShoppingBag className="w-8 h-8" /> },
     { name: "TikTok Ads", icon: <Zap className="w-8 h-8" /> },
     { name: "Google Analytics", icon: <Search className="w-8 h-8" /> },
     { name: "Pixel Tracking", icon: <CreditCard className="w-8 h-8" /> },
     { name: "Creative Studio", icon: <Package className="w-8 h-8" /> },
];
type IconBoxProps = {
     name: string;
     icon: React.ReactNode;
};

const IconBox: React.FC<IconBoxProps> = ({ name, icon }) => (
     <div className="flex flex-col items-center gap-3 group">
          <div
               className="w-16 h-16 flex items-center justify-center rounded-2xl
      bg-bg-subtle border border-border-subtle
      group-hover:border-accent group-hover:bg-accent-muted
      transition-all duration-300"
          >
               <div className="text-text-muted group-hover:text-accent transition-colors">
                    {icon}
               </div>
          </div>
          <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors">
               {name}
          </span>
     </div>
);


const WHY_FIRST_CHOICE_SERVICES = [
     {
          id: "strategy",
          title: "Ad Strategy & Funnel Planning",
          description:
               "We craft high-performing paid social strategies focused on audience targeting, creative positioning, and scalable growth campaigns.",
          boldPhrase: "audience targeting and scalable growth",
          bullets: [
               "Competitor Ad Analysis",
               "Audience Persona Mapping",
               "Campaign Funnel Planning",
               "Budget Allocation Strategy",
               "Conversion Optimization",
          ],
     },
     {
          id: "creative",
          title: "Ad Creative Production",
          description:
               "We design scroll-stopping visuals and copy that increase engagement, lower cost-per-click, and drive real conversions.",
          boldPhrase: "scroll-stopping visuals and copy",
          bullets: [
               "High-Converting Ad Creatives",
               "Video & Reel Production",
               "Copywriting & Hooks",
               "Brand Consistency Design",
               "Creative Split Testing",
          ],
     },
     {
          id: "targeting",
          title: "Advanced Audience Targeting",
          description:
               "Precision targeting strategies ensure your ads reach the right people at the right time with maximum ROI efficiency.",
          boldPhrase: "reach the right people at the right time",
          bullets: [
               "Custom Audience Creation",
               "Lookalike Audiences",
               "Behavior & Interest Targeting",
               "Retargeting Campaigns",
               "Geo Targeting",
          ],
     },
     {
          id: "optimization",
          title: "Campaign Optimization",
          description:
               "Continuous monitoring and performance tuning keeps your campaigns profitable and scaling efficiently.",
          boldPhrase: "continuous monitoring and performance tuning",
          bullets: [
               "A/B Testing",
               "CTR Optimization",
               "Conversion Tracking",
               "Bid Strategy Optimization",
               "Cost Reduction Scaling",
          ],
     },
     {
          id: "analytics",
          title: "Analytics & Reporting",
          description:
               "Transparent dashboards and insights show exactly how your campaigns perform and where growth opportunities exist.",
          boldPhrase: "transparent dashboards and insights",
          bullets: [
               "Real-Time Reports",
               "ROI Tracking",
               "Performance Insights",
               "Attribution Analysis",
               "Weekly Optimization Reports",
          ],
     },
     {
          id: "management",
          title: "Full Social Media Management",
          description:
               "We manage your social presence end-to-end, from content planning to engagement and paid growth strategies.",
          boldPhrase: "end-to-end social presence management",
          bullets: [
               "Content Calendar Planning",
               "Post Scheduling",
               "Community Management",
               "Brand Voice Consistency",
               "Growth Campaign Execution",
          ],
     },
];

const HOW_WE_SERVE = [
     {
          title: "Performance-Driven Campaigns",
          desc: "Every campaign is optimized for measurable ROI, conversions, and scalable growth.",
          icon: <BarChart3 className="w-6 h-6" />,
     },
     {
          title: "Cross-Platform Reach",
          desc: "We run synchronized campaigns across Facebook, Instagram, LinkedIn, and emerging platforms.",
          icon: <Smartphone className="w-6 h-6" />,
     },
     {
          title: "Scalable Ad Systems",
          desc: "Campaign frameworks built to scale budgets while maintaining efficiency and performance.",
          icon: <Zap className="w-6 h-6" />,
     },
     {
          title: "Data-Driven Decisions",
          desc: "Every optimization is backed by analytics, testing data, and real audience behavior.",
          icon: <Globe className="w-6 h-6" />,
     },
     {
          title: "Brand-Safe Advertising",
          desc: "We ensure your campaigns meet platform policies and maintain brand credibility.",
          icon: <ShieldCheck className="w-6 h-6" />,
     },
     {
          title: "Ongoing Growth Support",
          desc: "Continuous optimization, testing, and reporting ensure your campaigns keep improving.",
          icon: <Users className="w-6 h-6" />,
     },
];

export default function Ecommerce() {
     const reduce = useReducedMotion();
     const ease = cubicBezier(0.25, 0.46, 0.45, 0.94);
     const duration = 0.5;
     const [selectedServiceId, setSelectedServiceId] = useState("strategy");

     const selected = useMemo(
          () => WHY_FIRST_CHOICE_SERVICES.find((s) => s.id === selectedServiceId) ?? WHY_FIRST_CHOICE_SERVICES[0],
          [selectedServiceId]
     );

     const { scrollY } = useScroll();
     const opacity = useTransform(scrollY, [0, 400], [1, 0]);
     const scale = useTransform(scrollY, [0, 400], [1, 0.98]);

     return (
          <div className="relative min-h-screen w-full bg-bg-page text-text-body selection:bg-accent-muted selection:text-text-inverse overflow-hidden font-sans transition-colors duration-500">
               {/* Decorative Grid */}
               <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),
        linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)]
        bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]
        opacity-30 pointer-events-none"
               />

               {/* Hero Background */}
               <NeuralBackground />

               {/* Atmospheric Radial Blur */}
               <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

               {/* Hero Section */}
               <motion.section
                    style={{ opacity, scale }}
                    className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center"
               >
                    <motion.h1
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8 }}
                         className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 text-text-primary"
                    >
                         Social Media <span className="text-accent">Growth Engine</span>                    </motion.h1>

                    <motion.p
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.2 }}
                         className="max-w-2xl text-lg md:text-xl text-text-muted leading-relaxed"
                    >
                         Scale your brand visibility, engagement, and conversions with high-performance social media management and Meta ad strategies.
                    </motion.p>

                    <motion.nav
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.4 }}
                         className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm"
                    >
                         <span className="rounded-lg px-3 py-1.5 font-medium text-text-muted hover:text-accent cursor-pointer">
                              Home
                         </span>
                         <span className="text-text-muted">/</span>
                         <span className="rounded-lg px-3 py-1.5 font-medium text-text-muted hover:text-accent cursor-pointer">
                              Services
                         </span>
                         <span className="text-text-muted">/</span>
                         <span className="rounded-lg px-3 py-1.5 font-semibold text-accent">Social Media Marketing</span>
                    </motion.nav>
               </motion.section>

               {/* Scroll Indicator */}
               <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40"
               >
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">Explore Services</span>
                    <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-full" />
               </motion.div>

               {/* Content Wrapper */}
               <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
                    {/* Technologies Section */}
                    <motion.section
                         className="border-t border-border-subtle py-14 md:py-20"
                         initial="hidden"
                         whileInView="visible"
                         viewport={{ once: true, margin: "-40px" }}
                         variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                    >
                         <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl text-text-primary">
                              Marketing <span className="text-accent">Stack</span>                         </h2>
                         <div className="mx-auto mt-12 grid grid-cols-4 gap-x-6 gap-y-12 sm:grid-cols-4 md:grid-cols-8">
                              {TECH_ITEMS.map((tech) => (
                                   <motion.div
                                        key={tech.name}
                                        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                                        transition={{ duration, ease }}
                                   >
                                        <IconBox {...tech} />
                                   </motion.div>

                              ))}
                         </div>
                    </motion.section>

                    {/* Why Choice Section */}
                    <motion.section
                         className="border-t border-border-subtle py-12 md:py-16"
                         initial="hidden"
                         whileInView="visible"
                         viewport={{ once: true, margin: "-40px" }}
                    >
                         <h2 className="text-xl font-bold tracking-tight text-text-primary md:text-3xl mb-4">
                              Why Choose Us For Social Growth?                         </h2>
                         <motion.p className="mb-10 max-w-3xl text-text-muted text-base leading-relaxed">
                              We don’t just run ads   we engineer scalable growth systems. By combining creative psychology, performance data, and platform expertise, we ensure your campaigns perform consistently and profitably.
                         </motion.p>

                         <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
                              {/* Sidebar Navigation */}
                              <nav className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                                   {WHY_FIRST_CHOICE_SERVICES.map((s) => {
                                        const isActive = selectedServiceId === s.id;
                                        return (
                                             <motion.button
                                                  key={s.id}
                                                  onClick={() => setSelectedServiceId(s.id)}
                                                  whileHover={{ x: isActive ? 0 : 5 }}
                                                  className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left text-sm font-semibold transition-all duration-300 ${isActive
                                                       ? "border-accent bg-accent text-text-inverse shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                                       : "border-border-subtle bg-bg-subtle text-text-muted hover:border-accent hover:bg-accent-muted"
                                                       }`}
                                             >
                                                  {s.title}
                                                  {isActive && <ChevronRight className="w-4 h-4" />}
                                             </motion.button>
                                        );
                                   })}
                              </nav>

                              {/* Content Display */}
                              <motion.div
                                   layout
                                   className="relative overflow-hidden rounded-2xl border-2 border-border-subtle border-l-accent border-t-accent bg-bg-card"
                              >
                                   <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" aria-hidden />
                                   <div className="relative p-6 md:p-10">
                                        <AnimatePresence mode="wait">
                                             <motion.div
                                                  key={selectedServiceId}
                                                  initial={{ opacity: 0, x: 16 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  exit={{ opacity: 0, x: -12 }}
                                                  transition={{ duration: 0.3, ease }}
                                                  className="space-y-6"
                                             >
                                                  <h3 className="text-2xl font-bold tracking-tight text-text-primary">{selected.title}</h3>
                                                  <p className="text-text-muted leading-relaxed text-base">
                                                       {selected.description.split(selected.boldPhrase).map((part, i, arr) => (
                                                            <React.Fragment key={i}>
                                                                 {part}
                                                                 {i !== arr.length - 1 && (
                                                                      <strong className="text-accent font-semibold">{selected.boldPhrase}</strong>
                                                                 )}
                                                            </React.Fragment>
                                                       ))}
                                                  </p>
                                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3" role="list">
                                                       {selected.bullets.map((item, i) => (
                                                            <motion.li
                                                                 key={item}
                                                                 initial={{ opacity: 0, y: 5 }}
                                                                 animate={{ opacity: 1, y: 0 }}
                                                                 transition={{ delay: i * 0.05 }}
                                                                 className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-subtle px-4 py-3"
                                                            >
                                                                 <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                                                                 <span className="text-sm font-medium text-text-body">{item}</span>
                                                            </motion.li>
                                                       ))}
                                                  </ul>
                                             </motion.div>
                                        </AnimatePresence>
                                   </div>
                              </motion.div>
                         </div>
                    </motion.section>

                    {/* How We Serve Section */}
                    <motion.section
                         className="border-t border-border-subtle py-14 md:py-20"
                         initial="hidden"
                         whileInView="visible"
                         viewport={{ once: true, margin: "-40px" }}
                    >
                         <div className="mx-auto max-w-3xl text-center mb-16">
                              <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-4xl">
                                   Driving Results Through Innovation
                              </h2>
                              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
                              <p className="mt-6 text-text-muted text-lg">
                                   We optimize every stage of your marketing funnel, from audience discovery to conversion scaling and retention.
                              </p>
                         </div>

                         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              {HOW_WE_SERVE.map(({ title, desc, icon }) => (
                                   <motion.article
                                        key={title}
                                        whileHover={{ y: -8 }}
                                        className="group relative flex flex-col rounded-2xl border border-border-subtle bg-bg-subtle p-8 transition-all duration-300"
                                   >
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-text-inverse shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                                             {icon}
                                        </div>
                                        <h3 className="relative text-xl font-bold text-text-primary mb-3">{title}</h3>
                                        <p className="relative text-text-muted text-sm leading-relaxed">{desc}</p>
                                   </motion.article>
                              ))}
                         </div>
                    </motion.section>
               </div>
          </div>
     );
}
