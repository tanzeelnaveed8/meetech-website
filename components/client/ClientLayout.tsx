// 'use client';

// import { signOut } from 'next-auth/react';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import { FiHome, FiUser, FiLogOut, FiMenu, FiX, FiMessageSquare } from 'react-icons/fi';
// import { useState, useCallback, useEffect } from 'react';
// import { ThemeToggle } from '@/components/theme/ThemeToggle';
// import Button from '@/components/ui/Button';

// interface ClientLayoutProps {
//   children: React.ReactNode;
//   user: {
//     name: string;
//     email: string;
//   };
// }

// const navigation = [
//   { name: 'My Projects', href: '/client/dashboard', icon: FiHome },
//   { name: 'Messages', href: '/client/messages', icon: FiMessageSquare },
//   { name: 'Profile', href: '/client/profile', icon: FiUser },
// ] as const;

// export default function ClientLayout({ children, user }: ClientLayoutProps) {
//   const pathname = usePathname();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSigningOut, setIsSigningOut] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // Poll unread message count
//   useEffect(() => {
//     const fetchUnread = async () => {
//       try {
//         const res = await fetch('/api/messages/unread-count');
//         const data = await res.json();
//         if (res.ok) setUnreadCount(data.count);
//       } catch { /* ignore */ }
//     };
//     fetchUnread();
//     const interval = setInterval(fetchUnread, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

//   // Close sidebar on route change
//   useEffect(() => {
//     closeSidebar();
//   }, [pathname, closeSidebar]);

//   // Close sidebar on Escape
//   useEffect(() => {
//     if (!isSidebarOpen) return;
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') closeSidebar();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [isSidebarOpen, closeSidebar]);

//   // Lock body scroll when sidebar open on mobile
//   useEffect(() => {
//     document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
//     return () => { document.body.style.overflow = ''; };
//   }, [isSidebarOpen]);

//   const handleSignOut = async () => {
//     if (isSigningOut) return;
//     setIsSigningOut(true);
//     try {
//       await signOut({ redirect: false });
//       window.location.href = '/client/login';
//     } catch {
//       setIsSigningOut(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-bg-page">
//       {/* Mobile sidebar backdrop */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
//           onClick={closeSidebar}
//           aria-hidden="true"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-50 h-full w-72 bg-bg-surface border-r border-border-default shadow-xl transform transition-transform duration-300 ease-out lg:translate-x-0 ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="flex items-center justify-between h-20 px-6 border-b border-border-default">
//             <Link href="/client/dashboard" className="flex flex-col gap-1">
//               <Image
//                 src="/icon.png"
//                 alt="Meetech"
//                 width={140}
//                 height={40}
//                 className="h-8 w-auto dark-logo"
//               />
//               <Image
//                 src="/iconlight.png"
//                 alt="Meetech"
//                 width={140}
//                 height={40}
//                 className="h-8 w-auto light-logo"
//               />
//               <span className="text-xs font-medium text-text-muted tracking-wide uppercase">
//                 Client Portal
//               </span>
//             </Link>
//             <button
//               onClick={closeSidebar}
//               className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors duration-200"
//               aria-label="Close sidebar"
//             >
//               <FiX className="w-5 h-5" />
//             </button>
//           </div>

//           {/* User Info */}
//           <div className="px-6 py-6 border-b border-border-default">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-text-inverse font-semibold text-lg flex-shrink-0">
//                 {user.name.charAt(0).toUpperCase()}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
//                 <p className="text-xs text-text-muted truncate">{user.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4 py-6 space-y-1.5">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
//               const Icon = item.icon;

//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
//                     isActive
//                       ? 'bg-accent text-text-inverse shadow-sm'
//                       : 'text-text-muted hover:text-text-primary hover:bg-bg-subtle'
//                   }`}
//                   onClick={closeSidebar}
//                 >
//                   <Icon className="w-5 h-5 mr-3" />
//                   {item.name}
//                   {item.name === 'Messages' && unreadCount > 0 && (
//                     <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
//                       {unreadCount > 99 ? '99+' : unreadCount}
//                     </span>
//                   )}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Bottom Actions */}
//           <div className="border-t border-border-default p-4 space-y-3">
//             <div className="flex items-center justify-between px-2">
//               <span className="text-xs text-text-muted">Theme</span>
//               <ThemeToggle />
//             </div>
//             <Button
//               variant="ghost"
//               size="md"
//               fullWidth
//               onClick={handleSignOut}
//               isLoading={isSigningOut}
//               leftIcon={<FiLogOut className="w-5 h-5" />}
//               className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10 justify-start"
//             >
//               Sign Out
//             </Button>
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="lg:pl-72">
//         {/* Mobile header */}
//         <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-bg-surface/95 backdrop-blur-md border-b border-border-default shadow-sm">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors duration-200"
//             aria-label="Open sidebar"
//           >
//             <FiMenu className="w-6 h-6" />
//           </button>
//           <Image
//             src="/icon.png"
//             alt="Meetech"
//             width={100}
//             height={30}
//             className="h-6 w-auto dark-logo"
//           />
//           <Image
//             src="/iconlight.png"
//             alt="Meetech"
//             width={100}
//             height={30}
//             className="h-6 w-auto light-logo"
//           />
//           <ThemeToggle />
//         </header>

//         {/* Page content */}
//         <main className="p-6 lg:p-8">
//           <div className="mx-auto max-w-7xl">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  CalendarPlus,
  MessageSquare,
  UserCircle,
  Plus,
  X,
  FilePlus,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { FiCamera } from "react-icons/fi";
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LucideIcon } from "lucide-react";
import BookMeetingPage from '@/app/client/(protected)/book-meeting/page';
import ClientProfilePage from '@/app/client/(protected)/profile/page';
import MessagesClient from '@/components/client/MessagesClient';

// --- Splash Screen ---
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('exit'), 2600);
    const t3 = setTimeout(onDone, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#000',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.6s ease-out' : 'none',
      }}
    >
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
            style={{
              top: `${15 + i * 14}%`,
              left: '-100%',
              right: '-100%',
              animation: `scanLine 2.4s ease-in-out ${i * 0.18}s infinite`,
              opacity: phase === 'enter' ? 0 : 1,
              transition: 'opacity 0.5s ease',
            }}
          />
        ))}
        {/* Corner accent lines */}
        <div
          className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-blue-500 to-transparent"
          style={{
            transform: phase === 'enter' ? 'scaleX(0)' : 'scaleX(1)',
            transformOrigin: 'left',
            transition: 'transform 0.8s ease 0.3s',
          }}
        />
        <div
          className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-blue-500 to-transparent"
          style={{
            transform: phase === 'enter' ? 'scaleY(0)' : 'scaleY(1)',
            transformOrigin: 'top',
            transition: 'transform 0.8s ease 0.3s',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-blue-500 to-transparent"
          style={{
            transform: phase === 'enter' ? 'scaleX(0)' : 'scaleX(1)',
            transformOrigin: 'right',
            transition: 'transform 0.8s ease 0.5s',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-blue-500 to-transparent"
          style={{
            transform: phase === 'enter' ? 'scaleY(0)' : 'scaleY(1)',
            transformOrigin: 'bottom',
            transition: 'transform 0.8s ease 0.5s',
          }}
        />
      </div>

      {/* Logo */}
      <div
        style={{
          transform: phase === 'enter' ? 'scale(0.6) translateY(20px)' : 'scale(1) translateY(0)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="mb-8 relative"
      >
        {/* Glow behind logo */}
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)',
            transform: 'scale(2)',
          }}
        />
        <Image
          src="/icon.png"
          alt="Meetech"
          width={120}
          height={120}
          className="relative z-10 h-24 w-auto"
          priority
        />
      </div>

      {/* Text block */}
      <div
        style={{
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(16px)' : 'translateY(0)',
          transition: 'all 0.6s ease 0.4s',
        }}
        className="text-center relative z-10"
      >
        <p className="text-white/80 text-xs font-bold uppercase tracking-[0.4em] mb-3">
          Welcome to
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-1" style={{ color: '#fff', textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
          Client Portal
        </h1>
        {/* Animated underline */}
        <div
          className="mx-auto h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-3"
          style={{
            width: phase === 'enter' ? '0%' : '100%',
            transition: 'width 0.8s ease 0.7s',
          }}
        />
        <p className="text-white/70 text-sm font-semibold tracking-[0.2em] uppercase">
          of&nbsp; <span className="text-blue-400">Meetech</span>
        </p>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48">
        <div className="h-px bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
            style={{
              width: phase === 'enter' ? '0%' : phase === 'hold' ? '80%' : '100%',
              transition: phase === 'enter'
                ? 'none'
                : phase === 'hold'
                  ? 'width 1.6s ease'
                  : 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateX(-20%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(20%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// --- Global Nav Item ---
type GlobalNavItemProps = {
  icon: LucideIcon;
  active: boolean;
  label: string;
  onClick: () => void;
};

const GlobalNavItem = ({ icon: Icon, active, label, onClick }: GlobalNavItemProps) => {
  return (
    <button onClick={onClick} type="button" title={label}>
      <div
        className={`relative group p-3 rounded-xl transition-all duration-200 ${
          active
            ? "bg-accent text-text-inverse shadow-lg shadow-accent/20"
            : "text-text-disabled hover:text-text-primary hover:bg-border-subtle"
        }`}
      >
        <Icon size={22} />
        <span className="absolute left-14 text-text-primary bg-bg-surface border border-border-default text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </span>
      </div>
    </button>
  );
};

// --- Action Menu Item ---
type ActionMenuItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const ActionMenuItem = ({ icon: Icon, title, description }: ActionMenuItemProps) => (
  <button className="w-full flex items-center gap-4 p-3 hover:bg-accent/20 transition-colors text-left group">
    <div className="p-2 rounded-lg bg-border-subtle text-accent transition-colors">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-sm font-medium text-text-primary hover:text-accent">{title}</p>
      <p className="text-[11px] text-text-muted">{description}</p>
    </div>
  </button>
);

// --- Main Layout ---
export default function App({ children }: { children: React.ReactNode; user?: { name: string; email: string } }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get('modal');

  const openDashboardModal = (type: 'booking' | 'messages' | 'profile') => {
    router.push(`/client/dashboard?modal=${type}`);
  };

  const closeDashboardModal = () => {
    router.push('/client/dashboard');
  };

  const isDashboard = pathname === '/client/dashboard';

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

  // Apply theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div className="flex h-screen bg-bg-page text-text-body font-sans overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-text-primary border-b border-border-strong flex items-center justify-between px-4">
          <button
            type="button"
            className="flex items-center"
            onClick={() => router.push('/client/dashboard')}
            aria-label="Go to dashboard"
          >
            <Image src="/icon.png" alt="Meetech" width={96} height={28} className="h-7 w-auto light-logo" />
            <Image src="/iconlight.png" alt="Meetech" width={96} height={28} className="h-7 w-auto dark-logo" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-disabled hover:text-text-inverse hover:bg-border-strong transition-all"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>

        {/* 1. GLOBAL NAVIGATION (DARK SIDEBAR) */}
        <aside className="hidden lg:flex w-20 bg-text-primary flex-col items-center py-6 border-r border-border-strong shrink-0 z-20">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-accent/40">
            <Image
              src="/icon.png"
              alt="Meetech"
              width={140}
              height={40}
              className="h-8 w-auto light-logo"
            />
            <Image
              src="/iconlight.png"
              alt="Meetech"
              width={140}
              height={40}
              className="h-8 w-auto dark-logo"
            />
          </div>

          <nav className="flex flex-col gap-4 flex-1">
            <GlobalNavItem
              icon={LayoutDashboard}
              label="My Projects"
              active={isDashboard && !modal}
              onClick={() => router.push('/client/dashboard')}
            />
            <GlobalNavItem
              icon={CalendarPlus}
              label="Book Your Meeting"
              active={isDashboard && modal === 'booking'}
              onClick={() => openDashboardModal('booking')}
            />
            <GlobalNavItem
              icon={MessageSquare}
              label="Messages"
              active={isDashboard && modal === 'messages'}
              onClick={() => openDashboardModal('messages')}
            />
            <GlobalNavItem
              icon={UserCircle}
              label="My Profile"
              active={isDashboard && modal === 'profile'}
              onClick={() => openDashboardModal('profile')}
            />
          </nav>

          <div className="flex flex-col gap-4 mt-auto">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl text-text-disabled hover:text-text-inverse hover:bg-border-strong transition-all"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              title="Sign Out"
              className="p-3 rounded-xl text-text-disabled hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
            >
              <LogOut size={22} />
            </button>
            <button
              type="button"
              onClick={() => openDashboardModal('profile')}
              title="My Profile"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden mb-4 bg-accent text-text-inverse flex items-center justify-center text-lg font-bold">
                {session?.user.name
                  ?.split(" ")
                  .filter(Boolean)
                  .map((n, i, arr) => (i === 0 || i === arr.length - 1 ? n[0] : ""))
                  .join("")
                  .toUpperCase()}
              </div>
            </button>
          </div>
        </aside>

        {/* 2. CONTEXTUAL SIDEBAR (VISIBLE ONLY ON DASHBOARD) */}
        <aside
          className={`w-80 bg-bg-surface border-r border-border-default overflow-y-auto hidden xl:block transition-all duration-300 ${
            pathname !== "/client/dashboard" ? "opacity-50 pointer-events-none grayscale" : ""
          }`}
        >
          <div className="p-6">
            <button className="flex items-center gap-2 text-text-disabled text-sm hover:text-text-muted mb-8">
              <ChevronRight size={16} className="rotate-180" />
              <span>Projects list</span>
            </button>

            <div className="mb-8">
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden mb-4 ring-4 ring-bg-subtle bg-accent flex items-center justify-center text-text-inverse text-3xl font-bold">
                {session?.user.name
                  ?.split(" ")
                  .filter(Boolean)
                  .map((n, i, arr) => (i === 0 || i === arr.length - 1 ? n[0] : ""))
                  .join("")
                  .toUpperCase()}
              </div>
              {/* Camera Icon */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative bottom-10 z-50 -right-12 bg-accent-muted p-2 text-accent rounded-full shadow-md hover:bg-bg-subtle transition"
              >
                <FiCamera size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Placeholder for profile image upload wiring.
                    void file;
                  }
                }}
              />
              <div className="space-y-6">
                <section>
                  <h3 className="text-xs font-bold text-text-disabled uppercase tracking-wider flex items-center gap-2 mb-3">
                    <ChevronDown size={14} /> Client Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-disabled">Email</span>
                      <span className="text-accent font-medium">{session?.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-disabled">Client ID</span>
                      <span className="text-text-body font-medium">{`MT-${session?.user?.id?.toString().slice(0, 6)}XT`}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-text-disabled uppercase tracking-wider flex items-center gap-2 mb-3">
                    <ChevronDown size={14} /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent-muted text-accent rounded-lg text-xs font-medium border border-accent/10 lowercase">
                      {session?.user.role}
                    </span>
                    <span className="px-3 py-1 bg-bg-subtle text-text-muted rounded-lg text-xs font-medium border border-border-subtle">
                      Active Contract
                    </span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col overflow-hidden relative pt-14 lg:pt-0">
          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
            {children}
          </div>

          {/* FLOATING ACTION MENU */}
          <div className="absolute bottom-24 right-4 sm:right-6 lg:bottom-10 lg:right-10 flex flex-col items-end gap-4 z-50">
            {isActionMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                  onClick={() => setIsActionMenuOpen(false)}
                />
                <div className="w-[calc(100vw-2rem)] max-w-64 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 bg-accent-muted text-text-primary border-0 z-50">
                  <div className="p-4 border-b flex justify-between items-center">
                    <p className="text-xs font-bold uppercase tracking-widest">Quick Actions</p>
                    <X
                      size={14}
                      className="cursor-pointer hover:text-text-inverse"
                      style={{ color: "var(--color-text-disabled)" }}
                      onClick={() => setIsActionMenuOpen(false)}
                    />
                  </div>
                  <div className="py-2">
                    <div onClick={() => { openDashboardModal('booking'); setIsActionMenuOpen(false); }}>
                      <ActionMenuItem icon={CalendarPlus} title="Book appointment" description="Request a new slot" />
                    </div>
                    <ActionMenuItem icon={FilePlus} title="Upload documents" description="PDF, PNG, JPG supported" />
                    <ActionMenuItem icon={CheckCircle2} title="Create task" description="Add to your personal list" />
                    <div onClick={() => { openDashboardModal('messages'); setIsActionMenuOpen(false); }}>
                      <ActionMenuItem icon={MessageSquare} title="Send Message" description="Ping the support team" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 bg-accent text-text-inverse"
            >
              <Plus size={24} style={{ transform: isActionMenuOpen ? "rotate(45deg)" : "rotate(0deg)", transition: 'transform 0.3s' }} />
            </button>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-text-primary border-t border-border-strong grid grid-cols-4 px-1">
        <button
          type="button"
          onClick={() => router.push('/client/dashboard')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${
            isDashboard && !modal ? 'text-text-inverse' : 'text-text-disabled'
          }`}
        >
          <LayoutDashboard size={18} />
          Home
        </button>
        <button
          type="button"
          onClick={() => openDashboardModal('booking')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${
            isDashboard && modal === 'booking' ? 'text-text-inverse' : 'text-text-disabled'
          }`}
        >
          <CalendarPlus size={18} />
          Booking
        </button>
        <button
          type="button"
          onClick={() => openDashboardModal('messages')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${
            isDashboard && modal === 'messages' ? 'text-text-inverse' : 'text-text-disabled'
          }`}
        >
          <MessageSquare size={18} />
          Messages
        </button>
        <button
          type="button"
          onClick={() => openDashboardModal('profile')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${
            isDashboard && modal === 'profile' ? 'text-text-inverse' : 'text-text-disabled'
          }`}
        >
          <UserCircle size={18} />
          Profile
        </button>
      </nav>

      {/* Dashboard Popups */}
      {isDashboard && modal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={closeDashboardModal}
          />
          <div className="relative z-10 w-full md:w-1/2 max-h-[94vh] sm:max-h-[90vh] rounded-2xl border border-border-default bg-bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-default bg-bg-surface">
              <h2 className="text-sm sm:text-base font-semibold text-text-primary">
                {modal === 'booking' && 'Book Your Meeting'}
                {modal === 'messages' && 'Messages'}
                {modal === 'profile' && 'My Profile'}
              </h2>
              <button
                onClick={closeDashboardModal}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(94vh-56px)] sm:max-h-[calc(90vh-56px)] p-3 sm:p-6">
              {modal === 'booking' && (
                <div className="mx-auto w-full max-w-4xl">
                  <BookMeetingPage />
                </div>
              )}
              {modal === 'messages' && session?.user?.id && session?.user?.role && (
                <div className="h-[70vh]">
                  <MessagesClient userId={session.user.id} userRole={session.user.role} />
                </div>
              )}
              {modal === 'profile' && (
                <div className="mx-auto w-full max-w-4xl">
                  <ClientProfilePage />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
