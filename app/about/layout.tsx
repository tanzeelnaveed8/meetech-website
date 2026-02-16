import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Company",
  description:
    "Mission, vision, and what makes us #1. Global presence, team philosophy, and client voices. Confident. Precise. Global.",
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
