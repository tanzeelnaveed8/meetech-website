"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes have their own layout, so just render children
    return <>{children}</>;
  }

  // Public routes get the header and footer
  return (
    <>
      <Header />
      <main
        id="main"
        role="main"
        className="flex flex-1 flex-col"
      >
        <div className="mx-auto w-full max-w-7xl flex-1">
          {children}
        </div>
      </main>
      <Footer />
      <Script
        src="https://app.livechatai.com/embed.js"
        data-id="cmkz0sdxc0001lg04at8corp0"
        strategy="lazyOnload"
      />
    </>
  );
}
