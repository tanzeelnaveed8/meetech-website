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
  Settings,
  HelpCircle,
  Plus,
  X,
  FileText,
  FilePlus,
  CheckCircle2,
  Clock,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Tag,
  Mail,
  Phone,
  Search,
  Filter,
  Send,
  Video,
  Edit3,
  ExternalLink,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FiCamera } from "react-icons/fi";
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// --- Global Components ---
type GlobalNavItemProps = {
  icon: LucideIcon;
  href: string;
  label: string;
};

const GlobalNavItem = ({ icon: Icon, href, label }: GlobalNavItemProps) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`relative group p-3 rounded-xl transition-all duration-200 ${active
            ? "bg-accent text-text-inverse shadow-lg shadow-accent/20"
            : "text-text-disabled hover:text-text-primary hover:bg-border-subtle"
          }`}
      >
        <Icon size={22} />
        <span className="absolute left-14 text-text-primary bg-border-subtle text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </span>
      </div>
    </Link>
  );
};
type ActionMenuItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const ActionMenuItem = ({ icon: Icon, title, description }: ActionMenuItemProps) => (
  <button className="w-full flex items-center gap-4 p-3  hover:bg-accent/20 transition-colors text-left group">
    <div className={`p-2 rounded-lg bg-border-subtle text-accent transition-colors`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-sm font-medium text-text-primary hover:text-accent">{title}</p>
      <p className="text-[11px] text-text-muted">{description}</p>
    </div>
  </button>
);

// --- Main Application ---

export default function App({ children }: { children: React.ReactNode }) {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const {data : session} =useSession()
  const [userImage, setUserImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();  
  const router = useRouter()
  // Apply theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const getTitle = () => {
    if (pathname.includes("projects")) return "My Projects";
    if (pathname.includes("appointment")) return "Book Your Meeting";
    if (pathname.includes("messages")) return "Messages";
    if (pathname.includes("profile")) return "My Profile";
    return "Dashboard";
  };
  return (
    <div className="flex h-screen bg-bg-page text-text-body font-sans overflow-hidden">

      {/* 1. GLOBAL NAVIGATION (DARK SIDEBAR) */}
      <aside className="w-20 bg-text-primary flex flex-col items-center py-6 border-r border-border-strong shrink-0 z-20">
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
            href="/client/dashboard"
            label="My Projects"
          />
          <GlobalNavItem
            icon={CalendarPlus}
            href="/client/book-meeting"
            label="Book Your Meeting"
          />
          <GlobalNavItem
            icon={MessageSquare}
            href="/client/messages"
            label="Messages"
          />
          <GlobalNavItem
            icon={UserCircle}
            href="/client/profile"
            label="My Profile"
          />
        </nav>

        <div className="flex flex-col gap-4 mt-auto">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl text-text-disabled hover:text-text-inverse hover:bg-border-strong transition-all"
          >
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          <Link href="/client/profile">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mb-4 bg-accent text-text-inverse flex items-center justify-center  text-lg font-bold">
              {session?.user.name
                ?.split(" ")
                .filter(Boolean)
                .map((n, i, arr) => (i === 0 || i === arr.length - 1 ? n[0] : ""))
                .join("")
                .toUpperCase()}


            </div>
          </Link>
          </div>
      
      </aside>

      {/* 2. CONTEXTUAL SIDEBAR (VISIBLE ONLY ON OVERVIEW/PROJECTS) */}
      <aside
        className={`w-80 bg-bg-surface border-r border-border-default overflow-y-auto hidden xl:block transition-all duration-300 ${pathname !== "/client/dashboard"
            ? "opacity-50 pointer-events-none grayscale"
            : ""
          }`}
      >
        <div className="p-6">
          <button className="flex items-center gap-2 text-text-disabled text-sm hover:text-text-muted mb-8">
            <ChevronRight size={16} className="rotate-180" />
            <span>Projects list</span>
          </button>

          <div className="mb-8">
            <div className="relative w-20 h-20 rounded-3xl overflow-hidden mb-4 ring-4 ring-bg-subtle bg-accent flex items-center justify-center text-text-primary text-3xl font-bold">
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
              className="relative bottom-10 z-50 -right-12 bg-accent-muted p-2 text-accent rounded-full shadow-md hover:bg-bg-primary transition"
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
                if (file) setUserImage(URL.createObjectURL(file));
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
                <span className="px-3 py-1 bg-accent-muted text-accent rounded-lg text-xs font-medium border border-accent/10 lowercase">{session?.user.role}</span>
                <span className="px-3 py-1 bg-bg-subtle text-text-muted rounded-lg text-xs font-medium border border-border-subtle">Active Contract</span>
              </div>
            </section>
          </div>
           </div>
        </div>
      </aside>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        

        {/* Content Router */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>

        {/* --- FLOATING ACTION MENU --- */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end gap-4 z-50">
          {isActionMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={() => setIsActionMenuOpen(false)}
              />

              {/* Action Menu */}
              <div
                className="w-64 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 bg-accent-muted text-text-primary border-0 z-50"
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Quick Actions
                  </p>
                  <X
                    size={14}
                    className="cursor-pointer hover:text-text-inverse"
                    style={{ color: "var(--color-text-disabled)" }}
                    onClick={() => setIsActionMenuOpen(false)}
                  />
                </div>
                <div className="py-2">
                  <div onClick={() => { router.push("/client/book-meeting"); setIsActionMenuOpen(false); }}>
                    <ActionMenuItem
                      icon={CalendarPlus}
                      title="Book appointment"
                      description="Request a new slot"
                    />
                  </div>
                  <ActionMenuItem icon={FilePlus} title="Upload documents" description="PDF, PNG, JPG supported" />
                  <ActionMenuItem icon={CheckCircle2} title="Create task" description="Add to your personal list" />
                  <div onClick={() => { router.push("/client/messages"); setIsActionMenuOpen(false); }}>
                    <ActionMenuItem
                      icon={MessageSquare}
                      title="Send Message"
                      description="Ping the support team"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 bg-accent text-text-inverse"
          >
            <Plus size={28} style={{ transform: isActionMenuOpen ? "rotate(45deg)" : "rotate(0deg)" }} />
          </button>
        </div>
      </main>
    </div>
  );
}