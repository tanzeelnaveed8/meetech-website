
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
     MessageCircle,
     Bot,
     Zap,
     ShieldCheck,
     BarChart3,
     Users,
     Smartphone,
     ChevronRight,
     CheckCircle2,
     Globe,
     Workflow,
     Plug,
} from "lucide-react";
import NeuralBackground from "@/components/background/NeuralBackground";
import { cubicBezier } from "framer-motion";


const TECH_ITEMS = [
     { name: "WhatsApp API", icon: <MessageCircle className="w-8 h-8" /> },
     { name: "Dialogflow", icon: <Bot className="w-8 h-8" /> },
     { name: "Node.js", icon: <Zap className="w-8 h-8" /> },
     { name: "Twilio", icon: <Plug className="w-8 h-8" /> },
     { name: "Firebase", icon: <BarChart3 className="w-8 h-8" /> },
     { name: "MongoDB", icon: <Globe className="w-8 h-8" /> },
     // { name: "Tailwind", icon: <Smartphone className="w-8 h-8" /> },
];

type IconBoxProps = {
     name: string;
     icon: React.ReactNode;
};

const IconBox: React.FC<IconBoxProps> = ({ name, icon }) => (
     <div className="flex flex-col items-center gap-3 group">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-bg-subtle border border-border-subtle group-hover:border-accent group-hover:bg-accent-muted transition-all duration-300">
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
          title: "Automation Strategy",
          description:
               "We design intelligent messaging systems tailored to your business workflows, ensuring seamless communication and scalable automation with ",
          boldPhrase: "optimized engagement logic",
          bullets: [
               "Conversation Flow Planning",
               "User Journey Mapping",
               "Automation Architecture",
               "Bot Personality Design",
               "Engagement Optimization",
          ],
     },
     {
          id: "sales",
          title: "Sales Automation Bots",
          description:
               "We build AI-powered chat systems that qualify leads, recommend products, and convert conversations into customers through ",
          boldPhrase: "automated conversational funnels",
          bullets: [
               "Lead Qualification Bots",
               "Product Recommendation Logic",
               "Cart Recovery Messages",
               "Instant Replies",
               "CRM Sync",
          ],
     },
     {
          id: "support",
          title: "Customer Support Bots",
          description:
               "Reduce support workload with intelligent assistants that instantly resolve queries and provide real-time responses using ",
          boldPhrase: "smart automated support systems",
          bullets: [
               "FAQ Automation",
               "Ticket Creation",
               "Live Agent Handoff",
               "Order Status Replies",
               "Multilingual Support",
          ],
     },
     {
          id: "integrations",
          title: "System Integrations",
          description:
               "Connect WhatsApp automation with your internal tools to centralize data and streamline operations through ",
          boldPhrase: "fully integrated business ecosystems",
          bullets: [
               "CRM Integrations",
               "Payment Links",
               "ERP Sync",
               "Webhook Triggers",
               "API Automation",
          ],
     },
     {
          id: "security",
          title: "Security & Compliance",
          description:
               "We implement enterprise-grade safeguards to protect conversations and customer data with ",
          boldPhrase: "secure communication architecture",
          bullets: [
               "End-to-End Encryption",
               "Secure Webhooks",
               "Access Control Systems",
               "Compliance Readiness",
               "Spam Prevention Logic",
          ],
     },
     {
          id: "analytics",
          title: "Analytics & Insights",
          description:
               "Measure performance and optimize campaigns using real-time metrics powered by ",
          boldPhrase: "data-driven messaging insights",
          bullets: [
               "Engagement Tracking",
               "Conversion Metrics",
               "Response Analytics",
               "Behavior Insights",
               "Campaign Reports",
          ],
     },
];

const HOW_WE_SERVE = [
     {
          title: "Conversation-First Design",
          desc: "We craft chat experiences optimized for engagement, clarity, and user intent.",
          icon: <MessageCircle className="w-6 h-6" />,
     },
     {
          title: "Omnichannel Messaging",
          desc: "Your automation connects across platforms, ensuring consistent customer communication everywhere.",
          icon: <Smartphone className="w-6 h-6" />,
     },
     {
          title: "Scalable Bot Systems",
          desc: "Infrastructure built to handle thousands of conversations simultaneously without delays.",
          icon: <Zap className="w-6 h-6" />,
     },
     {
          title: "Business Integrations",
          desc: "We sync automation with your tools so your data flows seamlessly across systems.",
          icon: <Globe className="w-6 h-6" />,
     },
     {
          title: "Data Protection",
          desc: "Your customer conversations remain protected with enterprise-level safeguards.",
          icon: <ShieldCheck className="w-6 h-6" />,
     },
     {
          title: "Continuous Optimization",
          desc: "We monitor performance and refine automation flows for ongoing improvement.",
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

               <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

               <NeuralBackground />

               <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

               <motion.section style={{ opacity, scale }} className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center">

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 text-text-primary">
                         WhatsApp <span className="text-accent">Automation</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .2 }} className="max-w-2xl text-lg md:text-xl text-text-muted leading-relaxed">
                         Transform conversations into conversions with intelligent automation systems that engage, assist, and sell 24/7.
                    </motion.p>

                    <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .4 }} className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
                         <span className="rounded-lg px-3 py-1.5 font-medium text-text-muted hover:text-accent cursor-pointer">Home</span>
                         <span className="text-text-muted">/</span>
                         <span className="rounded-lg px-3 py-1.5 font-medium text-text-muted hover:text-accent cursor-pointer">Services</span>
                         <span className="text-text-muted">/</span>
                         <span className="rounded-lg px-3 py-1.5 font-semibold text-accent">WhatsApp Automation</span>
                    </motion.nav>
               </motion.section>

               <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">Explore Automation</span>
                    <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-full" />
               </motion.div>

               <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">

                    <motion.section className=" w-full border-t border-border-subtle py-14 md:py-20">
                         <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl text-text-primary">
                              Automation <span className="text-accent">Stack</span>
                         </h2>
                         <div className=" w-full mx-auto mt-12 grid grid-cols-4 gap-x-6 gap-y-12 sm:grid-cols-4 md:grid-cols-6 justify-center items-center">
                              {TECH_ITEMS.map((tech) => (
                                   <motion.div key={tech.name}>
                                        <IconBox {...tech} />
                                   </motion.div>
                              ))}
                         </div>
                    </motion.section>

                    {/* WHY SECTION */}
                    <motion.section className="border-t border-border-subtle py-12 md:py-16">

                         <h2 className="text-xl font-bold tracking-tight text-text-primary md:text-3xl mb-4">
                              Why Choose Our Automation Systems?
                         </h2>

                         <motion.p className="mb-10 max-w-3xl text-text-muted text-base leading-relaxed">
                              We build intelligent messaging infrastructures that automate communication, increase efficiency, and improve customer experiences while reducing operational workload.
                         </motion.p>

                         <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">

                              <nav className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                                   {WHY_FIRST_CHOICE_SERVICES.map((s) => {
                                        const isActive = selectedServiceId === s.id;
                                        return (
                                             <motion.button key={s.id} onClick={() => setSelectedServiceId(s.id)}
                                                  className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left text-sm font-semibold transition-all duration-300 ${isActive
                                                            ? "border-accent bg-accent text-text-inverse shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                                            : "border-border-subtle bg-bg-subtle text-text-muted hover:border-accent hover:bg-accent-muted"
                                                       }`}>
                                                  {s.title}
                                                  {isActive && <ChevronRight className="w-4 h-4" />}
                                             </motion.button>
                                        );
                                   })}
                              </nav>

                              <motion.div className="relative overflow-hidden rounded-2xl border-2 border-border-subtle border-l-accent border-t-accent bg-bg-card">
                                   <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                                   <div className="relative p-6 md:p-10">
                                        <AnimatePresence mode="wait">
                                             <motion.div key={selectedServiceId} className="space-y-6">

                                                  <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                                                       {selected.title}
                                                  </h3>

                                                  <p className="text-text-muted leading-relaxed text-base">
                                                       {selected.description.split(selected.boldPhrase).map((part, i, arr) => (
                                                            <React.Fragment key={i}>
                                                                 {part}
                                                                 {i !== arr.length - 1 && (
                                                                      <strong className="text-accent font-semibold">
                                                                           {selected.boldPhrase}
                                                                      </strong>
                                                                 )}
                                                            </React.Fragment>
                                                       ))}
                                                  </p>

                                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                       {selected.bullets.map((item, i) => (
                                                            <motion.li key={item} className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-subtle px-4 py-3">
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

                    {/* HOW WE SERVE */}
                    <motion.section className="border-t border-border-subtle py-14 md:py-20">

                         <div className="mx-auto max-w-3xl text-center mb-16">
                              <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-4xl">
                                   Built for Scalable Conversations
                              </h2>
                              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
                              <p className="mt-6 text-text-muted text-lg">
                                   From automation strategy to optimization, we handle the full lifecycle of your messaging systems.
                              </p>
                         </div>

                         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              {HOW_WE_SERVE.map(({ title, desc, icon }) => (
                                   <motion.article key={title} className="group relative flex flex-col rounded-2xl border border-border-subtle bg-bg-subtle p-8 transition-all duration-300">
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-text-inverse shadow-lg shadow-accent/20">
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