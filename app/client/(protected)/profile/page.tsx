
"use client"
import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiLock, FiShield, FiSettings } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';


// Optimized Inline SVG Icons for high-performance rendering without external deps
const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z" /></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
  )
};




export default function ClientProfilePage() {
  // Mock session data as requested
  const { data: session } = useSession()
  console.log("Session:", session)
  const { success: toastSuccess, error: toastError } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fileRef = useRef(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // upload logic here
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
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
    <div className="max-w-6xl mx-auto space-y-8 p-6 lg:p-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">

      {/* 1. HERO HEADER SECTION */}
      <div className="relative overflow-hidden rounded-[3rem] bg-accent p-8 md:p-14 text-text-inverse shadow-2xl shadow-accent/20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/15 rounded-full -ml-20 -mb-20 blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] bg-white/15 backdrop-blur-xl flex items-center justify-center text-6xl font-black border-2 border-white/30 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-2">
              {initials} {/* Camera Button */}
              <button
                onClick={handleClick}
                className="absolute -bottom-2 -right-2 p-3.5 bg-white text-accent rounded-2xl shadow-xl hover:bg-bg-subtle transition-all transform hover:rotate-12 active:scale-90">

                <Icons.Camera />
              </button>


              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

          </div>

          <div className="text-center md:text-left flex-1 space-y-2">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.25em] border border-white/10 mb-2">
              Account Overview
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{session?.user.name}</h1>
            <p className="text-white/70 text-lg font-medium tracking-tight">{session?.user.email}</p>
          </div>

          <div className="flex gap-3">
            <div className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 cursor-pointer group">
              <div className="group-hover:rotate-45 transition-transform duration-500">
                <Icons.Settings />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Profile Details (Bento Piece 1) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="h-full border-accent/5">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-text-primary tracking-tight">Identity</h3>
                <p className="text-sm text-text-muted font-medium">Verified workspace member</p>
              </div>
              <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center text-accent">
                <Icons.User />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <InfoTile label="Display Name" value={session?.user.name} icon={<Icons.User />} color="blue" />
              <InfoTile label="Email Address" value={session?.user.email} icon={<Icons.Mail />} color="red" />
              <InfoTile label="Account Role" value="Project Client" icon={<Icons.Shield />} color="green" />
              <InfoTile
                label="Client ID"
                value={`MT-${session?.user?.id?.toString().slice(0, 6)}XT`}
                icon={<Icons.Key />}
                color="purple"
              />
            </div>
          </Card>
        </div>

        {/* Security & Password (Bento Piece 2) */}
        <div className="lg:col-span-7">
          <Card className="h-full border-border-default" >
            <div className=" p-6 lg:p-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">Access Control</h3>
                  <p className="text-sm text-text-muted font-medium italic">Last updated: 2 days ago</p>
                </div>
                {!isChangingPassword && (
                  <Button variant="primary" onClick={() => setIsChangingPassword(true)} className="px-8 py-4">
                    <Icons.Key />
                    Rotate Password
                  </Button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  {formError && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 flex items-center gap-3">
                      <Icons.Alert />
                      <p className="text-sm font-bold tracking-tight">{formError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        type="password"
                        label="Current Credentials"
                        isRequired
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Verify your current identity"
                      />
                    </div>
                    <Input
                      type="password"
                      label="New Password"
                      isRequired
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      hint="At least 8 characters"
                      placeholder="••••••••"
                    />
                    <Input
                      type="password"
                      label="Confirm Identity"
                      isRequired
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border-default">
                    <Button type="submit" isLoading={isLoading} className="flex-1 py-4">
                      Update Security Key
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setIsChangingPassword(false); setFormError(''); }}
                    >
                      Keep Current
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-6 bg-accent/5 border border-accent/10 rounded-3xl">
                    <div className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
                      <Icons.Lock />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-lg">Multi-Layer Encryption</h4>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">
                        Your account is protected with enterprise-grade encryption. Change your password frequently to maximize defense.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SecurityMetric label="Login Health" value="Strong" status="healthy" />
                    <SecurityMetric label="2FA Status" value="Inactive" status="warning" />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}

// Sub-components for better modularity and UX
function InfoTile({ label, value, icon, color }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-600',
    purple: 'bg-purple-500/10 text-purple-600',
    green: 'bg-green-500/10 text-green-600',
    red: 'bg-red-500/10 text-red-600'
  };

  return (
    <div className="group flex items-center gap-5 space-y-2 bg-bg-subtle rounded-3xl border border-transparent hover:border-border-default hover:bg-accent-muted hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-500">
      <div className={`w-12 h-12 mt-2 ml-2 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5 opacity-60">{label}</p>
        <p className="text-base font-bold text-text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

function SecurityMetric({ label, value, status }) {
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