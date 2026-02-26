'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CODE_LENGTH = 8;

export default function ClientLoginPage() {
  const router = useRouter();
  const [chars, setChars] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { setMounted(true); }, []);

  const code = chars.join('');

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-1);
    const next = [...chars];
    next[index] = char;
    setChars(next);
    setError('');
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (chars[index]) {
        const next = [...chars];
        next[index] = '';
        setChars(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...chars];
        next[index - 1] = '';
        setChars(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, CODE_LENGTH);
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setChars(next);
    setError('');
    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    setTimeout(() => inputRefs.current[focusIdx]?.focus(), 0);
  };

  const handleSubmit = async () => {
    if (isLoading || code.length < CODE_LENGTH) return;
    setError('');
    setIsLoading(true);
    try {
      const result = await signIn('credentials', { code, redirect: false });
      if (result?.error) {
        setError('Invalid access code. Please check and try again.');
        setChars(Array(CODE_LENGTH).fill(''));
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      } else if (result?.ok) {
        router.push('/client/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filled = chars.filter(Boolean).length;

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#000' }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 left-20 w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)' }} />
          {/* Horizontal scan lines */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute h-px" style={{
              top: `${20 + i * 20}%`, left: 0, right: 0,
              background: 'linear-gradient(to right, transparent, rgba(37,99,235,0.2), transparent)',
            }} />
          ))}
        </div>

        {/* Logo */}
        <div
          className="relative z-10"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(-10px)', transition: 'all 0.6s ease' }}
        >
          <Image src="/icon.png" alt="Meetech" width={160} height={50} className="h-10 w-auto" />
        </div>

        {/* Center text */}
        <div
          className="relative z-10 space-y-6"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s ease 0.2s' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Secure Access</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight">
            Your Project<br />
            <span className="text-blue-400">Portal</span> Awaits
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-xs">
            Enter your unique access code to view your projects, files, and communicate with your team.
          </p>
        </div>

        {/* Footer */}
        <div
          className="relative z-10"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}
        >
          <p className="text-white/60 text-xs">© {new Date().getFullYear()} Meetech. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-14 relative">
        {/* Right side background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #050510 100%)' }} />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>

        <div
          className="relative z-10 w-full max-w-sm"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease 0.1s' }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-10">
            <Image src="/icon.png" alt="Meetech" width={140} height={45} className="h-9 w-auto" />
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Sign In</h2>
            <p className="text-white/75 text-sm">Enter the 8-character code sent to you</p>
          </div>

          {/* OTP Boxes */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-white/80 uppercase tracking-widest mb-4">
              Access Code
            </label>
            <div className="flex gap-2 justify-between">
              {Array(CODE_LENGTH).fill(null).map((_, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={chars[i]}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  onFocus={e => e.target.select()}
                  disabled={isLoading}
                  className="w-10 h-12 text-center text-lg font-black rounded-xl border-2 outline-none transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: chars[i] ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.04)',
                    borderColor: chars[i] ? 'rgba(37,99,235,0.8)' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    caretColor: '#2563eb',
                  }}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Progress bar under boxes */}
            <div className="mt-3 h-px bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${(filled / CODE_LENGTH) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs text-white/60">
              {filled}/{CODE_LENGTH}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || filled < CODE_LENGTH}
            className="w-full h-13 rounded-xl font-bold text-sm transition-all duration-200 relative overflow-hidden"
            style={{
              background: filled === CODE_LENGTH && !isLoading
                ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                : 'rgba(255,255,255,0.06)',
              color: filled === CODE_LENGTH && !isLoading ? '#fff' : 'rgba(255,255,255,0.25)',
              border: '1px solid',
              borderColor: filled === CODE_LENGTH && !isLoading ? 'rgba(37,99,235,0.6)' : 'rgba(255,255,255,0.08)',
              padding: '14px',
              cursor: filled === CODE_LENGTH && !isLoading ? 'pointer' : 'not-allowed',
              boxShadow: filled === CODE_LENGTH && !isLoading ? '0 0 30px rgba(37,99,235,0.3)' : 'none',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              'Access Portal'
            )}
          </button>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-white/70 leading-relaxed">
            Don&apos;t have a code?<br />
            Contact your project manager at Meetech.
          </p>
        </div>
      </div>
    </div>
  );
}
