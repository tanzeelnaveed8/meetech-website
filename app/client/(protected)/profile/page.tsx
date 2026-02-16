'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function ClientProfilePage() {
  const { data: session } = useSession();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

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
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toastSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsChangingPassword(false);
        }, 500);
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Profile Settings</h1>
        <p className="text-text-muted">Manage your account information and security</p>
      </div>

      {/* User Information Card */}
      <Card padding="none" className="overflow-hidden">
        <div className="bg-accent px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-bg-surface flex items-center justify-center text-3xl font-bold text-text-primary shadow-lg">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-text-inverse">
              <h2 className="text-2xl font-bold">{session.user.name}</h2>
              <p className="text-text-inverse/80">{session.user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-bg-subtle rounded-xl border border-border-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/15 rounded-lg">
                  <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-text-muted">Full Name</span>
              </div>
              <p className="text-lg font-semibold text-text-primary">{session.user.name}</p>
            </div>

            <div className="p-4 bg-bg-subtle rounded-xl border border-border-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/15 rounded-lg">
                  <FiMail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-text-muted">Email Address</span>
              </div>
              <p className="text-lg font-semibold text-text-primary">{session.user.email}</p>
            </div>

            <div className="p-4 bg-bg-subtle rounded-xl border border-border-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-500/15 rounded-lg">
                  <FiShield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-text-muted">Account Type</span>
              </div>
              <p className="text-lg font-semibold text-text-primary">Client</p>
            </div>

            <div className="p-4 bg-bg-subtle rounded-xl border border-border-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/15 rounded-lg">
                  <FiLock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-text-muted">Security</span>
              </div>
              <p className="text-lg font-semibold text-text-primary">Protected</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <FiLock className="w-6 h-6" />
              Change Password
            </h2>
            <p className="text-sm text-text-muted mt-1">Update your password to keep your account secure</p>
          </div>
          {!isChangingPassword && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {formError && (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
                <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
              </div>
            )}

            <Input
              id="currentPassword"
              type="password"
              label="Current Password"
              isRequired
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter current password"
            />

            <Input
              id="newPassword"
              type="password"
              label="New Password"
              isRequired
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter new password"
              hint="Must be at least 8 characters"
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              isRequired
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Confirm new password"
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setFormError('');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-accent-muted border border-accent/20 rounded-xl">
            <FiShield className="w-5 h-5 text-accent" />
            <p className="text-sm text-text-body">
              Your password is encrypted and secure. Change it regularly to maintain account security.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
