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
     { name: "OpenAI", icon: <Zap className="w-8 h-8" /> },
     { name: "LangChain", icon: <Globe className="w-8 h-8" /> },
     { name: "Python", icon: <Package className="w-8 h-8" /> },
     { name: "TensorFlow", icon: <BarChart3 className="w-8 h-8" /> },
     { name: "PyTorch", icon: <ShieldCheck className="w-8 h-8" /> },
     { name: "FastAPI", icon: <CreditCard className="w-8 h-8" /> },
     { name: "Redis", icon: <Users className="w-8 h-8" /> },
     { name: "Vector DBs", icon: <Search className="w-8 h-8" /> },
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
          title: "AI Strategy & Consulting",
          description:
               "We design intelligent roadmaps that align automation, machine learning, and data systems with your business objectives, ensuring measurable ROI.",
          boldPhrase: "automation, machine learning, and data systems",
          bullets: [
               "AI Opportunity Analysis",
               "Workflow Automation Planning",
               "Use-Case Validation",
               "Architecture Design",
               "Scalability Planning",
          ],
     },
     {
          id: "chatbots",
          title: "AI Assistants & Chatbots",
          description:
               "We build conversational systems that understand users, resolve queries, and automate support using natural language intelligence.",
          boldPhrase: "conversational systems that understand users",
          bullets: [
               "Customer Support Bots",
               "Sales Assistants",
               "Multilingual NLP",
               "Context Memory",
               "CRM Integrations",
          ],
     },
     {
          id: "analytics",
          title: "Predictive Analytics",
          description:
               "Transform raw data into actionable insights with predictive intelligence that forecasts trends and supports smarter decisions.",
          boldPhrase: "predictive intelligence that forecasts trends",
          bullets: [
               "Demand Forecasting",
               "Behavior Prediction",
               "Risk Detection",
               "Data Modeling",
               "Insight Dashboards",
          ],
     },
     {
          id: "vision",
          title: "Computer Vision",
          description:
               "Enable machines to interpret visual data, automate detection, and improve operational efficiency through AI-powered image analysis.",
          boldPhrase: "interpret visual data",
          bullets: [
               "Object Detection",
               "Facial Recognition",
               "Quality Inspection",
               "Image Classification",
               "Video Intelligence",
          ],
     },
     {
          id: "automation",
          title: "Workflow Automation",
          description:
               "We automate repetitive tasks and complex processes using AI agents that reduce costs, increase speed, and improve accuracy.",
          boldPhrase: "AI agents that reduce costs",
          bullets: [
               "Process Automation",
               "Document Parsing",
               "Smart Scheduling",
               "Data Extraction",
               "Decision Engines",
          ],
     },
     {
          id: "deployment",
          title: "Model Deployment & Scaling",
          description:
               "Deploy trained AI models into production environments with high availability, monitoring, and continuous learning pipelines.",
          boldPhrase: "production environments with high availability",
          bullets: [
               "Model Hosting",
               "API Integration",
               "Performance Monitoring",
               "Auto Scaling",
               "Continuous Training",
          ],
     },
];

const HOW_WE_SERVE = [
     {
          title: "Intelligent Automation",
          desc: "We design systems that automate decisions, processes, and workflows using adaptive AI logic.",
          icon: <Zap className="w-6 h-6" />,
     },
     {
          title: "Human-Like Interaction",
          desc: "AI assistants that understand context, intent, and conversation for natural user experiences.",
          icon: <Users className="w-6 h-6" />,
     },
     {
          title: "Scalable AI Infrastructure",
          desc: "Cloud-ready architecture built to scale models, datasets, and workloads without performance loss.",
          icon: <Globe className="w-6 h-6" />,
     },
     {
          title: "Seamless Integrations",
          desc: "We connect AI engines with CRMs, apps, APIs, and databases for unified intelligence.",
          icon: <Smartphone className="w-6 h-6" />,
     },
     {
          title: "Secure AI Systems",
          desc: "Enterprise-grade protection ensures your data, models, and predictions remain safe.",
          icon: <ShieldCheck className="w-6 h-6" />,
     },
     {
          title: "Continuous Learning",
          desc: "Our AI solutions evolve with feedback, improving accuracy and performance over time.",
          icon: <BarChart3 className="w-6 h-6" />,
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
                         AI Tools <span className="text-accent">Excellence</span>                    </motion.h1>

                    <motion.p
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.2 }}
                         className="max-w-2xl text-lg md:text-xl text-text-muted leading-relaxed"
                    >
                         Build intelligent systems that automate processes, analyze data, and enhance decision-making with powerful AI-driven solutions.
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
                         <span className="rounded-lg px-3 py-1.5 font-semibold text-accent">AI Tools</span>
                    </motion.nav>
               </motion.section>

               {/* Scroll Indicator */}
               <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40"
               >
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-text-muted">Explore AI</span>
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
                              AI Technology <span className="text-accent">Stack</span>
                         </h2>
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
                              Why Choose Us For AI Development?                         </h2>
                         <motion.p className="mb-10 max-w-3xl text-text-muted text-base leading-relaxed">
                              We don’t just build models   we engineer intelligent ecosystems. By combining data science, automation, and scalable architecture, we deliver AI systems that drive real business outcomes.
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
                                   Delivering Intelligence Through AI                              </h2>
                              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
                              <p className="mt-6 text-text-muted text-lg">
                                   We handle the full lifecycle of your AI solution, from strategy and training to deployment and continuous optimization.
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
