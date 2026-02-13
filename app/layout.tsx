import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import SessionProvider from "@/components/providers/SessionProvider";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-work-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meetech Development",
  description: "Technology company",
  icons: {
    icon: "/iconlight.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${workSans.variable} ${workSans.variable} min-h-screen antialiased work-sans`}
      >
        <Script
          src="/theme-init.js"
          strategy="beforeInteractive"
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-text-inverse focus:outline-none"
        >
          Skip to main content
        </a>
        <SessionProvider>
          <div className="flex min-h-screen flex-col overflow-x-hidden work-sans">
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
