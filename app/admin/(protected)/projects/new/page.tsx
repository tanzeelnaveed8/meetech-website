'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
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

        router.push(`/admin/projects/${data.project.id}`);
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-semibold text-[#1E293B] mb-1">Create New Project</h1>
        <p className="text-sm text-gray-600">Set up a new client project</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="E-commerce Website Redesign"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1.5">
                Client Name
              </label>
              <select
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1.5">
                Project Manager
              </label>
              <select
                id="managerId"
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">Select a manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="expectedEndDate" className="block text-sm font-medium text-gray-700 mb-1.5">
              Deadline
            </label>
            <input
              id="expectedEndDate"
              type="date"
              value={formData.expectedEndDate}
              onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="requirementFile" className="block text-sm font-medium text-gray-700 mb-1.5">
              Requirements Document (PDF)
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 cursor-pointer transition-colors">
                <FiUpload className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
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
                <button
                  type="button"
                  onClick={() => setRequirementFile(null)}
                  className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
                  disabled={isLoading}
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">Upload project requirements as a PDF document</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#1E293B] rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
              <Link
                href="/admin/projects"
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
