
"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import Spinner from "@/components/ui/Spinner"

type InfoTileProps = {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'red';
};

type SecurityMetricProps = {
  label: string;
  value: string;
  status: 'healthy' | 'warning';
};

interface IconProps {
  size?: number;
  className?: string;
}

// Optimized Inline SVG Icons for high-performance rendering without external deps
const Icons = {
  User: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Mail: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  ),
  Lock: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  Shield: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Settings: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  ),
  Key: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z" /></svg>
  ),
  Alert: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  Camera: ({ size = 18, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
  )
};


export default function ClientProfilePage() {
  // Mock session data as requested
  const { data: session } = useSession()
  const { success: toastSuccess, error: toastError } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const securityRef = useRef<HTMLElement>(null);


  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isChangingPassword && securityRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          securityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
    }
  }, [isChangingPassword]);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      // upload logic here
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) 
      return <Spinner title="updating your password" />;
    setFormError('');

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toastSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setIsChangingPassword(false), 500);
      } else {
        setFormError(data.error || 'Failed to change password');
      }
    } catch {
      toastError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  const initials = session?.user.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 p-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 lg:p-10">
      {/* Breadcrumb (unchanged) */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-4">
        <nav className="flex text-text-muted p-2 rounded-lg border border-accent/15 bg-accent/10" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a href="/" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
                <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /></svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" /></svg>
                <a href="#" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">Client</a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" /></svg>
                <span className="inline-flex items-center text-sm font-medium text-body-subtle">Profile</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Hero – unchanged */}
      <div className="relative overflow-hidden my-16">
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-5 sm:gap-8">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-accent/15 backdrop-blur-xl flex items-center justify-center text-3xl sm:text-4xl font-black border-2 border-accent/30 shadow-2xl transition-all duration-700">
              {initials}
            </div>
          </div>
          <div className="text-center md:text-left flex-1 space-y-2">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/15 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.25em] border border-accent/10 mb-4">
              Account Overview
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter leading-none">{session?.user.name}</h1>
            <p className="text-accent/70 text-sm sm:text-base font-medium tracking-tight">{session?.user.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setIsChangingPassword(true) }}
              className="p-3 sm:p-4 bg-accent/10 hover:bg-accent/20 rounded-xl sm:rounded-2xl transition-all border border-accent/10 cursor-pointer group"
              title="Security Settings"
            >
              <div className="group-hover:rotate-45 transition-transform duration-500">
                <Icons.Settings />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Two‑column editorial layout (no cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {/* Identity Section */}
        <section className="space-y-6">
          <div className="border-b border-border-default pb-2">
            <h2 className="text-2xl font-black tracking-tight text-text-primary">Identity</h2>
            <p className="text-sm text-text-muted font-medium">Verified workspace member</p>
          </div>

          <div className="space-y-5">
            {/* Display Name */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/5 text-accent shrink-0 mt-1 flex items-center justify-center border border-accent/60 rounded-full p-2">
                <Icons.User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Display name</p>
                <p className="text-base font-semibold text-text-primary">{session?.user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/5 text-accent shrink-0 mt-1 flex items-center justify-center border border-accent/60 rounded-full p-2">
                <Icons.Mail size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Email address</p>
                <p className="text-base font-semibold text-text-primary break-all">{session?.user.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/5 text-accent shrink-0 mt-1 flex items-center justify-center border border-accent/60 rounded-full p-2">
                <Icons.Shield size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Account role</p>
                <p className="text-base font-semibold text-text-primary">Project Client</p>
              </div>
            </div>

            {/* Client ID with copy button */}
            <div className="flex items-center justify-center gap-4 ">
              <div className="w-10 h-10 bg-accent/5 text-accent shrink-0 mt-1 flex items-center justify-center border border-accent/60 rounded-full p-2 ">
                <Icons.Key size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Client ID</p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-text-primary font-mono">
                    MT-{session?.user?.id?.toString().slice(0, 6)}XT
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(`MT-${session?.user?.id?.toString().slice(0, 6)}XT`)}
                    className="p-1 hover:bg-accent/10 rounded-md transition"
                    title="Copy to clipboard"
                  >
                    {/* <Icons.Copy size={14} className="text-text-muted" /> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section ref={securityRef} id="security-section" className="space-y-6 scroll-mt-40">
          <div className="border-b border-border-default pb-2">
            <h2 className="text-2xl font-black tracking-tight text-text-primary">Access Control</h2>
            <p className="text-sm text-text-muted font-medium">Last updated: 2 days ago</p>
          </div>

          {isChangingPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              {formError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-3">
                  <Icons.Alert />
                  <p className="text-sm font-bold tracking-tight">{formError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1 block">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 bg-bg-page border border-border-default rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1 block">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-bg-page border border-border-default rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none transition"
                    />
                    <p className="text-[10px] text-text-muted mt-1">At least 8 characters</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1 block">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-bg-page border border-border-default rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-accent text-text-inverse rounded-lg text-sm font-medium hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save new password'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsChangingPassword(false); setFormError(''); }}
                  className="px-6 py-2.5 border border-border-default rounded-lg text-sm font-medium hover:bg-bg-subtle transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Message */}
              <div className="flex items-start gap-4 p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                <Icons.Lock size={20} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-text-primary">Your account security</h4>
                  <p className="text-sm text-text-muted mt-1 leading-relaxed">
                    Your data is encrypted. Updating your password regularly helps keep your account secure.
                  </p>
                </div>
              </div>

              {/* Metrics – simple rows with status dots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Login security</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-text-primary">Strong</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Two-step verification</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-text-primary">Off (optional)</span>
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                  </div>
                </div>
              </div>

              {/* Change password link */}
              <div className="pt-2">
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="p-3 sm:p-4 bg-accent/10 hover:bg-accent/20 rounded-xl inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition"
                  title="Security Settings"

                >
                  <Icons.Key size={16} />
                  Change password
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Sub-components for better modularity and UX
function InfoTile({ label, value, icon, color }: InfoTileProps) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-600',
    purple: 'bg-purple-500/10 text-purple-600',
    green: 'bg-green-500/10 text-green-600',
    red: 'bg-red-500/10 text-red-600'
  };

  return (
    <div className="group flex items-center gap-3 sm:gap-5 p-2 sm:p-2.5 bg-bg-subtle rounded-2xl sm:rounded-3xl border border-transparent hover:border-border-default hover:bg-accent-muted hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-500">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5 opacity-60">{label}</p>
        <p className="text-sm sm:text-base font-bold text-text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

function SecurityMetric({ label, value, status }: SecurityMetricProps) {
  return (
    <div className="p-5 bg-bg-subtle rounded-2xl border border-border-default flex flex-col gap-1">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
      <div className="flex items-center justify-between">
        <span className="text-lg font-black text-text-primary">{value}</span>
        <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-orange-400'}`} />
      </div>
    </div>
  );
}
