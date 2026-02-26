'use client';

import { useState } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiCopy, FiCheck, FiKey } from 'react-icons/fi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function NewClientPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

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
          role: 'CLIENT',
          isActive: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCode(data.plainCode);
        toastSuccess('Client created! Code sent to email.');
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

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // After code is generated — show success screen
  if (generatedCode) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <Link
            href="/admin/clients"
            className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Client Created!</h1>
          <p className="text-sm text-text-muted">Access code has been sent to the client&apos;s email.</p>
        </div>

        <Card>
          <div className="space-y-6">
            {/* Code display */}
            <div className="rounded-2xl border-2 border-dashed border-accent/40 bg-accent-muted p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <FiKey className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Access Code</span>
              </div>
              <p className="text-4xl font-extrabold tracking-[0.3em] text-accent font-mono mb-4">
                {generatedCode}
              </p>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-text-inverse text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-border-default bg-bg-subtle text-sm text-text-muted space-y-1">
              <p>✅ Client account created for <strong className="text-text-primary">{formData.email}</strong></p>
              <p>✅ Access code emailed to client</p>
              <p>📋 Client should enter this code at the login page — no password needed</p>
            </div>

            <div className="flex gap-3">
              <Link href="/admin/clients" className="flex-1">
                <Button fullWidth variant="outline">Back to Clients</Button>
              </Link>
              <Button
                fullWidth
                onClick={() => {
                  setGeneratedCode('');
                  setFormData({ name: '', email: '' });
                }}
              >
                Create Another
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/clients"
          className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Link>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Create New Client</h1>
        <p className="text-sm text-text-muted">An access code will be generated and emailed to the client — no password needed.</p>
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
            hint="Access code will be sent to this email"
          />

          <div className="pt-4 border-t border-border-default">
            <div className="flex space-x-3">
              <Button type="submit" isLoading={isLoading} className="flex-1" leftIcon={<FiKey className="w-4 h-4" />}>
                {isLoading ? 'Creating...' : 'Create Client & Generate Code'}
              </Button>
              <Link href="/admin/clients">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
