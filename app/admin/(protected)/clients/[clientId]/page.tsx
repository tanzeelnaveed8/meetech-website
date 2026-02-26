'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiTrash2, FiCheckCircle, FiXCircle, FiKey, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { use } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface Client {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt?: string;
}

interface ClientProject {
  id: string;
  name: string;
  description: string;
  progress: number;
}

export default function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const router = useRouter();
  const { clientId } = use(params);
  const { success: toastSuccess, error: toastError } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', isActive: true });
  const [newCode, setNewCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    fetchClient();
    fetchProjects();
  }, [clientId]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/users/${clientId}`);
      const data = await response.json();

      if (response.ok) {
        setClient(data.user);
        setEditData({
          name: data.user.name,
          email: data.user.email,
          isActive: data.user.isActive,
        });
      } else {
        setError(data.error || 'Failed to load client');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/projects?clientId=${clientId}`);
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleUpdate = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await fetchClient();
        setIsEditing(false);
        toastSuccess('Client updated successfully');
      } else {
        toastError('Failed to update client');
      }
    } catch {
      toastError('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateCode = async () => {
    if (isGeneratingCode) return;
    setIsGeneratingCode(true);
    try {
      const response = await fetch(`/api/users/${clientId}/generate-code`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setNewCode(data.plainCode);
        toastSuccess('New code generated and emailed to client');
      } else {
        toastError(data.error || 'Failed to generate code');
      }
    } catch {
      toastError('An error occurred');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(newCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate this client? They will no longer be able to log in.')) return;

    try {
      const response = await fetch(`/api/users/${clientId}`, { method: 'DELETE' });
      if (response.ok) {
        toastSuccess('Client deactivated successfully');
        await fetchClient();
      } else {
        toastError('Failed to deactivate client');
      }
    } catch {
      toastError('An error occurred');
    }
  };

  const handlePermanentDelete = async () => {
    if (!confirm('PERMANENTLY DELETE this client? This cannot be undone and will remove all their data.')) return;
    if (!confirm('Are you absolutely sure? Type OK to confirm.')) return;

    try {
      const response = await fetch(`/api/users/${clientId}?permanent=true`, { method: 'DELETE' });
      if (response.ok) {
        toastSuccess('Client permanently deleted');
        router.push('/admin/clients');
      } else {
        toastError('Failed to delete client');
      }
    } catch {
      toastError('An error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-muted">Loading client...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Client not found'}</p>
        <Link href="/admin/clients" className="text-sm text-accent hover:text-accent-hover transition-colors duration-200">
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/clients"
          className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors duration-200 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Link>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Client Details</h1>
      </div>

      {/* Client Information */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">Account Information</h2>
          <div className="flex items-center space-x-2">
            {client.isActive ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400">
                <FiCheckCircle className="w-3 h-3 mr-1" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400">
                <FiXCircle className="w-3 h-3 mr-1" />
                Inactive
              </span>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              id="edit-name"
              type="text"
              label="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              leftIcon={<FiUser className="h-4 w-4" />}
            />

            <Input
              id="edit-email"
              type="email"
              label="Email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              leftIcon={<FiMail className="h-4 w-4" />}
            />

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.isActive}
                  onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                  className="rounded border-border-default text-accent focus:ring-accent"
                />
                <span className="text-sm text-text-primary">Active Account</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleUpdate}
                isLoading={isSaving}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                <FiUser className="inline w-4 h-4 mr-2" />
                Name
              </label>
              <div className="px-4 py-3 text-sm border border-border-default rounded-lg bg-bg-subtle text-text-primary">
                {client.name}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                <FiMail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <div className="px-4 py-3 text-sm border border-border-default rounded-lg bg-bg-subtle text-text-primary">
                {client.email}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">Last Login</label>
              <div className="px-4 py-3 text-sm border border-border-default rounded-lg bg-bg-subtle text-text-primary">
                {client.lastLoginAt ? new Date(client.lastLoginAt).toLocaleString() : 'Never'}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Information
              </Button>
              {client.isActive && (
                <Button
                  variant="danger"
                  onClick={handleDeactivate}
                  leftIcon={<FiXCircle className="w-4 h-4" />}
                >
                  Deactivate
                </Button>
              )}
              <Button
                variant="danger"
                onClick={handlePermanentDelete}
                leftIcon={<FiTrash2 className="w-4 h-4" />}
                className="!bg-red-700 hover:!bg-red-800"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Access Code */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiKey className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Access Code</h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateCode}
            isLoading={isGeneratingCode}
            leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />}
          >
            {isGeneratingCode ? 'Generating...' : 'Generate New Code'}
          </Button>
        </div>

        {newCode ? (
          <div className="rounded-xl border-2 border-dashed border-accent/40 bg-accent-muted p-5 text-center">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-2">New Access Code</p>
            <p className="text-3xl font-extrabold tracking-[0.3em] text-accent font-mono mb-4">{newCode}</p>
            <div className="flex items-center justify-center gap-3 text-sm text-text-muted mb-3">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-text-inverse rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity"
              >
                {codeCopied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                {codeCopied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <p className="text-xs text-text-muted">Code has been emailed to <strong>{client.email}</strong></p>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            Generate a new access code to send to this client. The old code will be replaced and emailed automatically.
          </p>
        )}
      </Card>

      {/* Client Projects */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No projects assigned yet</p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="block p-4 border border-border-default rounded-lg hover:border-border-strong hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">{project.name}</h3>
                    <p className="text-xs text-text-muted mt-1">{project.description}</p>
                  </div>
                  <span className="text-sm text-text-muted font-medium">{project.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
