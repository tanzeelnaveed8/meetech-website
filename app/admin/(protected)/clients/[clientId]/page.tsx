'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Link from 'next/link';
import { use } from 'react';

export default function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const router = useRouter();
  const { clientId } = use(params);
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', isActive: true });

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
    } catch (err) {
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
    try {
      const response = await fetch(`/api/users/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await fetchClient();
        setIsEditing(false);
      } else {
        alert('Failed to update client');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };


  const handleDelete = async () => {
    if (!confirm('Are you sure you want to deactivate this client? They will no longer be able to log in.')) return;

    try {
      const response = await fetch(`/api/users/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/clients');
      } else {
        alert('Failed to deactivate client');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Client not found'}</p>
        <Link href="/admin/clients" className="text-sm text-[#1E293B] hover:underline">
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
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Link>
        <h1 className="text-2xl font-semibold text-[#1E293B] mb-1">Client Details</h1>
      </div>

      {/* Client Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1E293B]">Account Information</h2>
          <div className="flex items-center space-x-2">
            {client.isActive ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="w-3 h-3 mr-1" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <FiXCircle className="w-3 h-3 mr-1" />
                Inactive
              </span>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiUser className="inline w-4 h-4 mr-2" />
                Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiMail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.isActive}
                  onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active Account</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1E293B] rounded-md hover:bg-gray-800"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiUser className="inline w-4 h-4 mr-2" />
                Name
              </label>
              <div className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {client.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiMail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <div className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {client.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Login</label>
              <div className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {client.lastLoginAt ? new Date(client.lastLoginAt).toLocaleString() : 'Never'}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-[#1E293B] border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Edit Information
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Deactivate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Client Projects */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">
          Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No projects assigned yet</p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                  </div>
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
