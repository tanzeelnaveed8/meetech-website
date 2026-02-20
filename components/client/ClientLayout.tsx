'use client';

import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiUser, FiLogOut, FiMenu, FiX, FiMessageSquare } from 'react-icons/fi';
import { useState, useCallback, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Button from '@/components/ui/Button';

interface ClientLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
}

const navigation = [
  { name: 'My Projects', href: '/client/dashboard', icon: FiHome },
  { name: 'Messages', href: '/client/messages', icon: FiMessageSquare },
  { name: 'Profile', href: '/client/profile', icon: FiUser },
] as const;

export default function ClientLayout({ children, user }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  // Close sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Close sidebar on Escape
  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSidebarOpen, closeSidebar]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut({ redirect: false });
      window.location.href = '/client/login';
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-bg-surface border-r border-border-default shadow-xl transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-border-default">
            <Link href="/client/dashboard" className="flex flex-col gap-1">
              <Image
                src="/icon.png"
                alt="Meetech"
                width={140}
                height={40}
                className="h-8 w-auto dark-logo"
              />
              <Image
                src="/iconlight.png"
                alt="Meetech"
                width={140}
                height={40}
                className="h-8 w-auto light-logo"
              />
              <span className="text-xs font-medium text-text-muted tracking-wide uppercase">
                Client Portal
              </span>
            </Link>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-6 border-b border-border-default">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-text-inverse font-semibold text-lg flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-muted truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-text-inverse shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-subtle'
                  }`}
                  onClick={closeSidebar}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                  {item.name === 'Messages' && unreadCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-border-default p-4 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-text-muted">Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={handleSignOut}
              isLoading={isSigningOut}
              leftIcon={<FiLogOut className="w-5 h-5" />}
              className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10 justify-start"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-bg-surface/95 backdrop-blur-md border-b border-border-default shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors duration-200"
            aria-label="Open sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <Image
            src="/icon.png"
            alt="Meetech"
            width={100}
            height={30}
            className="h-6 w-auto dark-logo"
          />
          <Image
            src="/iconlight.png"
            alt="Meetech"
            width={100}
            height={30}
            className="h-6 w-auto light-logo"
          />
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
