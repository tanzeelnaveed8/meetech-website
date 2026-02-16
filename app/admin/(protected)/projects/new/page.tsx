'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [clients, setClients] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    managerId: '',
    expectedEndDate: '',
  });
  const [requirementFile, setRequirementFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [clientsRes, adminRes, editorRes] = await Promise.all([
        fetch('/api/users?role=CLIENT&isActive=true'),
        fetch('/api/users?role=ADMIN'),
        fetch('/api/users?role=EDITOR'),
      ]);

      const clientsData = await clientsRes.json();
      const adminData = await adminRes.json();
      const editorData = await editorRes.json();

      setClients(clientsData.users || []);
      // Combine ADMIN and EDITOR users as managers
      setManagers([...(adminData.users || []), ...(editorData.users || [])]);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      // First, create the project with minimal data
      const projectData = {
        name: formData.name,
        description: requirementFile ? `Project requirements: ${requirementFile.name}` : 'Project requirements to be added',
        scope: 'To be defined based on requirements document',
        clientId: formData.clientId,
        managerId: formData.managerId,
        expectedEndDate: formData.expectedEndDate,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (response.ok) {
        // If there's a file, upload it to the project
        if (requirementFile) {
          const fileFormData = new FormData();
          fileFormData.append('file', requirementFile);

          await fetch(`/api/projects/${data.project.id}/files`, {
            method: 'POST',
            body: fileFormData,
          });
        }

        toastSuccess('Project created successfully');
        router.push(`/admin/projects/${data.project.id}`);
      } else {
        setError(data.error || 'Failed to create project');
        toastError(data.error || 'Failed to create project');
      }
    } catch {
      setError('An error occurred. Please try again.');
      toastError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clientOptions = [
    { value: '', label: 'Select a client' },
    ...clients.map((client) => ({ value: client.id, label: client.name })),
  ];

  const managerOptions = [
    { value: '', label: 'Select a manager' },
    ...managers.map((manager) => ({ value: manager.id, label: manager.name })),
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors duration-200 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Create New Project</h1>
        <p className="text-sm text-text-muted">Set up a new client project</p>
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
            label="Project Name"
            isRequired
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="E-commerce Website Redesign"
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="clientId"
              label="Client Name"
              isRequired
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              options={clientOptions}
              disabled={isLoading}
            />

            <Select
              id="managerId"
              label="Project Manager"
              isRequired
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              options={managerOptions}
              disabled={isLoading}
            />
          </div>

          <Input
            id="expectedEndDate"
            type="date"
            label="Deadline"
            isRequired
            value={formData.expectedEndDate}
            onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
            disabled={isLoading}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-text-primary">
              Requirements Document (PDF)
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-border-default rounded-lg hover:border-border-strong cursor-pointer transition-colors duration-200 bg-bg-surface">
                <FiUpload className="w-5 h-5 text-text-muted mr-2" />
                <span className="text-sm text-text-muted">
                  {requirementFile ? requirementFile.name : 'Upload PDF'}
                </span>
                <input
                  id="requirementFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setRequirementFile(e.target.files?.[0] || null)}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              {requirementFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRequirementFile(null)}
                  disabled={isLoading}
                  className="!text-red-600 hover:!text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-text-muted mt-1.5">Upload project requirements as a PDF document</p>
          </div>

          <div className="pt-4 border-t border-border-default">
            <div className="flex space-x-3">
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
              <Link href="/admin/projects">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
