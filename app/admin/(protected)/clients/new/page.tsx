'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function NewClientPage() {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'CLIENT',
          isActive: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toastSuccess('Client created successfully');
        router.push('/admin/clients');
      } else {
        setError(data.error || 'Failed to create client');
        toastError(data.error || 'Failed to create client');
      }
    } catch {
      setError('An error occurred. Please try again.');
      toastError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/clients"
          className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors duration-200 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Link>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Create New Client</h1>
        <p className="text-sm text-text-muted">Add a new client account</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <Input
            id="name"
            type="text"
            label="Full Name"
            isRequired
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            disabled={isLoading}
            leftIcon={<FiUser className="h-4 w-4" />}
          />

          <Input
            id="email"
            type="email"
            label="Email Address"
            isRequired
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            disabled={isLoading}
            leftIcon={<FiMail className="h-4 w-4" />}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            isRequired
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password (min 8 characters)"
            disabled={isLoading}
            leftIcon={<FiLock className="h-4 w-4" />}
            hint="Password must be at least 8 characters"
          />

          <div className="pt-4 border-t border-border-default">
            <div className="flex space-x-3">
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Client'}
              </Button>
              <Link href="/admin/clients">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </Card>

      <div className="mt-4 p-4 rounded-xl border border-accent/20 bg-accent-muted">
        <p className="text-sm text-text-body">
          <strong>Note:</strong> A welcome email with login credentials will be sent to the client&apos;s email address.
        </p>
      </div>
    </div>
  );
}
