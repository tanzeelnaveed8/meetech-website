
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
        className={`relative group p-3 rounded-2xl transition-all duration-300 ${
          active
            ? "text-blue-300 border border-blue-400/20 bg-transparent"
            : "text-text-disabled hover:text-text-primary hover:bg-white/10 border border-transparent hover:border-white/10"
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

  // Enforce dark theme in client portal.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div className="relative flex h-screen overflow-hidden bg-[#020617] text-text-body font-sans">
        <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-blue-500/25 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-indigo-500/20 blur-[130px]" />
        {/* Mobile top bar */}
        <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl flex items-center justify-between px-4 shadow-[0_8px_24px_rgba(2,6,23,0.55)]">
          <button
            type="button"
            className="flex items-center"
            onClick={() => router.push('/client/dashboard')}
            aria-label="Go to dashboard"
          >
            <Image src="/icon.png" alt="Meetech" width={96} height={28} className="h-7 w-auto light-logo" />
            <Image src="/iconlight.png" alt="Meetech" width={96} height={28} className="h-7 w-auto dark-logo" />
          </button>
          <span className="text-[11px] uppercase tracking-[0.2em] text-blue-300/90">Always Dark</span>
        </header>

        {/* 1. GLOBAL NAVIGATION (DARK SIDEBAR) */}
        <aside className="hidden lg:flex w-20 bg-slate-950/65 backdrop-blur-2xl flex-col items-center py-6 border-r border-white/10 shrink-0 z-20 shadow-[16px_0_40px_rgba(2,6,23,0.45)]">
          <div className="relative mb-10">
            <Image
              src="/icon.png"
              alt="Meetech"
              width={180}
              height={56}
              className="h-11 w-auto light-logo"
            />
            <Image
              src="/icon.png"
              alt="Meetech"
              width={180}
              height={56}
              className="h-11 w-auto dark-logo"
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
              className="p-3 rounded-xl text-blue-300/90 bg-blue-500/10 border border-blue-400/20"
              title="Dark mode is locked"
            >
              <div className="h-[22px] w-[22px] rounded-full bg-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.7)]" />
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
          className={`w-80 bg-slate-950/45 backdrop-blur-xl border-r border-white/10 overflow-y-auto hidden xl:block transition-all duration-300 ${
            pathname !== "/client/dashboard" ? "opacity-50 pointer-events-none grayscale" : ""
          }`}
        >
          <div className="p-6">
            <button className="flex items-center gap-2 text-text-disabled text-sm hover:text-text-muted mb-8">
              <ChevronRight size={16} className="rotate-180" />
              <span>Projects list</span>
            </button>

            <div className="mb-8">
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden mb-4 ring-4 ring-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-text-inverse text-3xl font-bold shadow-[0_18px_40px_rgba(37,99,235,0.45)]">
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
        <main className="flex-1 flex flex-col overflow-hidden relative pt-14 lg:pt-0 z-10">
          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 md:pb-40 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
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
                <div className="w-[calc(100vw-2rem)] max-w-64 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 bg-slate-900/95 text-text-primary border border-white/10 z-50 backdrop-blur-xl">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
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
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 grid grid-cols-4 px-1 shadow-[0_-10px_30px_rgba(2,6,23,0.65)]">
        <button
          type="button"
          onClick={() => router.push('/client/dashboard')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] transition-all ${
            isDashboard && !modal ? 'bg-blue-600/20 text-blue-200 border border-blue-400/30' : 'text-text-disabled'
          }`}
        >
          <LayoutDashboard size={18} />
          Home
        </button>
        <button
          type="button"
          onClick={() => openDashboardModal('booking')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] transition-all ${
            isDashboard && modal === 'booking' ? 'bg-blue-600/20 text-blue-200 border border-blue-400/30' : 'text-text-disabled'
          }`}
        >
          <CalendarPlus size={18} />
          Booking
        </button>
        <button
          type="button"
          onClick={() => openDashboardModal('messages')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] transition-all ${
            isDashboard && modal === 'messages' ? 'bg-blue-600/20 text-blue-200 border border-blue-400/30' : 'text-text-disabled'
          }`}
        >
          <MessageSquare size={18} />
          Messages
        </button>
        <button
          type="button"
          onClick={() => openDashboardModal('profile')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] transition-all ${
            isDashboard && modal === 'profile' ? 'bg-blue-600/20 text-blue-200 border border-blue-400/30' : 'text-text-disabled'
          }`}
        >
          <UserCircle size={18} />
          Profile
        </button>
      </nav>

      {/* Dashboard Popups */}
      {isDashboard && modal && (
        <div className="fixed inset-0 z-[140]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={closeDashboardModal}
          />
          <div className="relative z-10 flex h-full w-full items-center justify-center p-2 sm:p-5">
            <div className={`w-full rounded-2xl border border-white/15 bg-slate-950/95 shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-xl ${
              modal === 'messages'
                ? 'h-[96vh] sm:h-[94vh] max-w-[1200px]'
                : 'h-[94vh] sm:h-[90vh] max-w-[960px]'
            }`}>
            <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-900/85 backdrop-blur-xl">
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
            <div className={`h-[calc(100%-56px)] overflow-y-auto ${modal === 'messages' ? 'p-0' : 'p-3 sm:p-6'}`}>
              {modal === 'booking' && (
                <div className="mx-auto w-full max-w-4xl">
                  <BookMeetingPage />
                </div>
              )}
              {modal === 'messages' && session?.user?.id && session?.user?.role && (
                <div className="h-full">
                  <MessagesClient userId={session.user.id} userRole={session.user.role} />
                </div>
              )}
              {modal === 'profile' && (
                <div className="mx-auto w-full max-w-5xl">
                  <ClientProfilePage />
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
