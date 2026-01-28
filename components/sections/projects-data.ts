/**
 * Projects data for the Work/Portfolio page
 * Representative case studies showcasing different solution types
 */

export type Project = {
  id: string;
  title: string;
  client: string;
  category: "web-app" | "mobile" | "ecommerce" | "custom" | "mvp";
  tags: string[];
  description: string;
  image: string;
  year: string;
  accent: "accent" | "secondary";
};

export const PROJECTS: Project[] = [
  {
    id: "finscale-platform",
    title: "FinScale Trading Platform",
    client: "FinScale",
    category: "web-app",
    tags: ["Next.js", "PostgreSQL", "Real-time", "WebSockets"],
    description:
      "Enterprise trading platform handling 10K+ concurrent users with real-time market data, order execution, and portfolio analytics.",
    image: "/web-app.png",
    year: "2024",
    accent: "accent",
  },
  {
    id: "healthtrack-mobile",
    title: "HealthTrack Mobile App",
    client: "HealthTrack",
    category: "mobile",
    tags: ["React Native", "Firebase", "HealthKit", "Push Notifications"],
    description:
      "Cross-platform health tracking app with wearable integration, personalized insights, and HIPAA-compliant data storage.",
    image: "/mobile app.png",
    year: "2024",
    accent: "secondary",
  },
  {
    id: "luxe-marketplace",
    title: "Luxe Fashion Marketplace",
    client: "Luxe",
    category: "ecommerce",
    tags: ["Shopify", "Next.js", "Stripe", "Algolia"],
    description:
      "Multi-vendor luxury fashion marketplace with advanced search, personalized recommendations, and seamless checkout experience.",
    image: "/ecommerce.png",
    year: "2023",
    accent: "accent",
  },
  {
    id: "workflow-automation",
    title: "Enterprise Workflow Engine",
    client: "TechCorp",
    category: "custom",
    tags: ["Node.js", "PostgreSQL", "Docker", "Kubernetes"],
    description:
      "Custom workflow automation platform replacing legacy systems, reducing processing time by 70% and handling 1M+ tasks monthly.",
    image: "/software.png",
    year: "2024",
    accent: "secondary",
  },
  {
    id: "studybuddy-mvp",
    title: "StudyBuddy Learning Platform",
    client: "StudyBuddy",
    category: "mvp",
    tags: ["Next.js", "Supabase", "OpenAI", "Vercel"],
    description:
      "AI-powered study companion MVP launched in 6 weeks, validated with 5K+ users, and secured seed funding within 3 months.",
    image: "/mvp.png",
    year: "2024",
    accent: "accent",
  },
  {
    id: "foodie-delivery",
    title: "Foodie Delivery App",
    client: "Foodie",
    category: "mobile",
    tags: ["Flutter", "Google Maps", "Stripe", "Firebase"],
    description:
      "On-demand food delivery app with real-time tracking, driver management, and integrated payment processing across iOS and Android.",
    image: "/mobile app.png",
    year: "2023",
    accent: "secondary",
  },
  {
    id: "retail-analytics",
    title: "Retail Analytics Dashboard",
    client: "RetailPro",
    category: "web-app",
    tags: ["React", "Python", "PostgreSQL", "D3.js"],
    description:
      "Real-time analytics dashboard for retail chains, providing insights on inventory, sales trends, and customer behavior across 200+ stores.",
    image: "/web-app.png",
    year: "2023",
    accent: "accent",
  },
  {
    id: "artisan-store",
    title: "Artisan Craft Store",
    client: "Artisan Co",
    category: "ecommerce",
    tags: ["Next.js", "Stripe", "Contentful", "Vercel"],
    description:
      "Direct-to-consumer e-commerce platform for handmade crafts with custom product builder, subscription boxes, and artist profiles.",
    image: "/ecommerce.png",
    year: "2024",
    accent: "secondary",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "web-app", label: "Web Apps" },
  { id: "mobile", label: "Mobile" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "custom", label: "Custom Software" },
  { id: "mvp", label: "MVPs" },
];
