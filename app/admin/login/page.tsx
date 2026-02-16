'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-4">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <Image
              src="/icon.png"
              alt="Meetech"
              width={180}
              height={60}
              className="h-12 w-auto dark-logo"
            />
            <Image
              src="/iconlight.png"
              alt="Meetech"
              width={180}
              height={60}
              className="h-12 w-auto light-logo"
            />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Admin Portal
          </h1>
          <p className="text-text-muted">
            Sign in to manage projects and clients
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-border-default bg-bg-card shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
                <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <Input
              id="email"
              type="email"
              label="Email Address"
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@meetech.com"
              autoComplete="email"
              disabled={isLoading}
              leftIcon={<FiMail className="h-5 w-5" />}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              leftIcon={<FiLock className="h-5 w-5" />}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-page px-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
