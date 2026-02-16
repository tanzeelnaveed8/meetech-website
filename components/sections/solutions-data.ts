/**
 * Solutions data for the Solutions page
 * Defines the 5 core solution categories with detailed information
 */

export type Solution = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string; 
  features: string[];
  technologies: string[];
  useCases: string[];
  accent: "accent" | "secondary";
};

export const SOLUTIONS: Solution[] = [
  {
    id: "mobile",
    title: "Mobile Apps",
    tagline: "Native and cross-platform apps users rely on daily",
    description:
      "Build powerful mobile experiences that engage users and drive business growth. From consumer apps to enterprise mobility solutions, we deliver high-performance applications for iOS and Android that users love.",
    image: "/images/Mobile.webp",
    features: [
      "iOS & Android native development",
      "Cross-platform with React Native & Flutter",
      "Offline-first architecture",
      "Push notifications & real-time sync",
      "App Store optimization & deployment",
      "Biometric authentication & security",
      "In-app purchases & subscriptions",
      "Analytics & crash reporting",
    ],
    technologies: [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "Firebase",
      "GraphQL",
    ],
    useCases: [
      "Consumer mobile apps",
      "Enterprise mobility solutions",
      "IoT companion apps",
      "Social & community platforms",
      "On-demand service apps",
    ],
    accent: "secondary",
  },
  {
    id: "ecommerce",
    title: "E-commerce Platforms",
    tagline: "Scalable online stores that convert browsers into buyers",
    description:
      "Launch and scale your online business with custom e-commerce solutions built for performance and conversion. From product catalogs to checkout flows, we create shopping experiences that drive revenue.",
    image: "/images/ecommerce.webp",
    features: [
      "Custom storefront design",
      "Product catalog management",
      "Secure payment processing",
      "Inventory & order management",
      "Multi-currency & multi-language",
      "SEO optimization",
      "Analytics & reporting dashboards",
      "Third-party integrations (Stripe, Shopify, etc.)",
    ],
    technologies: [
      "Next.js",
      "Shopify",
      "Stripe",
      "PostgreSQL",
      "Redis",
      "Elasticsearch",
    ],
    useCases: [
      "Direct-to-consumer brands",
      "B2B marketplaces",
      "Subscription commerce",
      "Multi-vendor platforms",
      "Digital product stores",
    ],
    accent: "accent",
  },
  {
    id: "custom",
    title: "Custom Software",
    tagline: "Tailored solutions for unique business challenges",
    description:
      "When off-the-shelf software doesn't cut it, we build custom solutions designed specifically for your workflows, processes, and business logic. Scalable, maintainable, and built to evolve with your needs.",
    image: "/images/software.webp",
    features: [
      "Requirements analysis & discovery",
      "Custom business logic implementation",
      "Legacy system modernization",
      "API development & integrations",
      "Database design & optimization",
      "Automated workflows & processes",
      "Role-based access control",
      "Comprehensive documentation",
    ],
    technologies: [
      "Node.js",
      "Python",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "AWS/Azure",
    ],
    useCases: [
      "Internal business tools",
      "Industry-specific platforms",
      "Data processing pipelines",
      "Workflow automation systems",
      "Integration middleware",
    ],
    accent: "secondary",
  },
  {
    id: "mvp",
    title: "Startup MVPs",
    tagline: "Validate your idea fast with a production-ready MVP",
    description:
      "Launch your startup idea in weeks, not months. We help founders build lean, focused MVPs that validate product-market fit while maintaining the quality and architecture needed to scale when you find traction.",
    image: "/images/mvp.webp",
    features: [
      "Rapid prototyping & iteration",
      "Core feature prioritization",
      "User authentication & onboarding",
      "Payment integration",
      "Analytics & user tracking",
      "Scalable architecture from day one",
      "Cloud deployment & hosting",
      "Post-launch support & iteration",
    ],
    technologies: [
      "Next.js",
      "Supabase",
      "Vercel",
      "Stripe",
      "Tailwind CSS",
      "TypeScript",
    ],
    useCases: [
      "SaaS product validation",
      "Marketplace MVPs",
      "Mobile app prototypes",
      "AI-powered tools",
      "Community platforms",
    ],
    accent: "accent",
  },
  {
    id: "web-apps",
    title: "Websites & Web Apps",
    tagline: "Modern web experiences that perform and convert",
    description:
      "From marketing websites to complex web applications, we build fast, accessible, and beautiful web experiences. SEO-optimized, mobile-responsive, and designed to achieve your business goals.",
    image: "/images/Websites.webp",
    features: [
      "Responsive design for all devices",
      "SEO optimization & performance",
      "Content management systems",
      "Progressive Web Apps (PWA)",
      "Server-side rendering",
      "API integrations",
      "Form handling & validation",
      "Analytics & conversion tracking",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
      "Contentful",
    ],
    useCases: [
      "Corporate websites",
      "Landing pages & campaigns",
      "Web applications",
      "Customer portals",
      "Documentation sites",
    ],
    accent: "secondary",
  },
];
