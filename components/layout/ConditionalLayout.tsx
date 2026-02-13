"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isClientRoute = pathname.startsWith('/client');
  const isAuthRoute = pathname.startsWith('/auth');
  const [loadChat, setLoadChat] = useState(false);

  useEffect(() => {
    // Don't load chat for admin, client, or auth routes
    if (isAdminRoute || isClientRoute || isAuthRoute) return;

    // Load chat after 5 seconds or on user interaction
    const timer = setTimeout(() => setLoadChat(true), 5000);

    const handleInteraction = () => {
      setLoadChat(true);
      clearTimeout(timer);
    };

    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isAdminRoute, isClientRoute, isAuthRoute]);

  if (isAdminRoute || isClientRoute || isAuthRoute) {
    // Admin, client, and auth routes have their own layout, so just render children
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
      {loadChat && (
        <Script
          src="https://app.livechatai.com/embed.js"
          data-id="cmkz0sdxc0001lg04at8corp0"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
