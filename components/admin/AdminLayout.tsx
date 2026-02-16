"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { ADMIN_NAV_ITEMS } from '@/lib/constants-backend';
import { FiLogOut, FiMenu, FiX, FiExternalLink } from 'react-icons/fi';
import { useState, useCallback, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Button from '@/components/ui/Button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll unread message count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/messages/unread-count');
        const data = await res.json();
        if (res.ok) setUnreadCount(data.count);
      } catch { /* ignore */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: '/admin/login' });
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-border-default bg-bg-surface/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-3 group">
                <Image
                  src="/icon.png"
                  alt="Meetech"
                  width={120}
                  height={40}
                  className="h-8 w-auto dark-logo"
                />
                <Image
                  src="/iconlight.png"
                  alt="Meetech"
                  width={120}
                  height={40}
                  className="h-8 w-auto light-logo"
                />
                <div className="hidden sm:block border-l border-border-default pl-3">
                  <span className="block text-xs font-medium text-text-muted tracking-wide uppercase">
                    Admin Panel
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-accent text-text-inverse shadow-sm'
                          : 'text-text-muted hover:text-text-primary hover:bg-bg-subtle'
                      }`}
                    >
                      {item.label}
                      {item.label === 'Messages' && unreadCount > 0 && (
                        <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full ${
                          isActive ? 'bg-white text-accent' : 'bg-red-500 text-white'
                        }`}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-muted border border-border-default rounded-lg hover:text-text-primary hover:border-border-strong hover:bg-bg-subtle transition-all duration-200"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
                View Site
              </Link>

              <Button
                variant="danger"
                size="sm"
                onClick={handleSignOut}
                isLoading={isSigningOut}
                leftIcon={<FiLogOut className="w-4 h-4" />}
                className="hidden sm:inline-flex"
              >
                Sign Out
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors duration-200"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden border-t border-border-default bg-bg-surface overflow-hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-text-inverse'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-subtle'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {item.label}
                    {item.label === 'Messages' && unreadCount > 0 && (
                      <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-white text-accent' : 'bg-red-500 text-white'
                      }`}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border-default space-y-2">
              <Link
                href="/"
                target="_blank"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-text-muted border border-border-default rounded-lg hover:bg-bg-subtle"
              >
                <FiExternalLink className="w-4 h-4" />
                View Site
              </Link>
              <Button
                variant="danger"
                size="md"
                fullWidth
                onClick={handleSignOut}
                isLoading={isSigningOut}
                leftIcon={<FiLogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-border-default bg-bg-surface mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-text-muted text-center">
            © {new Date().getFullYear()} Meetech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
