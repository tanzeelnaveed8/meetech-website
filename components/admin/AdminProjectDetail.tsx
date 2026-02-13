'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FiArrowLeft, FiEdit2, FiTrash2, FiUpload, FiPlus, FiSave } from 'react-icons/fi';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import FileList from '@/components/ui/FileList';

interface AdminProjectDetailProps {
  projectId: string;
}

export default function AdminProjectDetail({ projectId }: AdminProjectDetailProps) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
        setEditData({
          name: data.project.name,
          description: data.project.description,
          scope: data.project.scope,
          status: data.project.status,
          progress: data.project.progress,
        });
      } else {
        setError(data.error || 'Failed to load project');
      }
    } catch (err) {
      setError('An error occurred while loading the project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await fetchProject();
        setIsEditing(false);
      } else {
        alert('Failed to update project');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchProject();
      } else {
        alert('Failed to upload file');
      }
    } catch (err) {
      alert('An error occurred while uploading');
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/files/${fileId}/download`);
      const data = await response.json();

      if (response.ok) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      alert('Failed to download file');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/files?fileId=${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  const handleRespondToChangeRequest = async (requestId: string, status: string, adminResponse: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/change-requests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, adminResponse }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      alert('Failed to update change request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
        <Link href="/admin/projects" className="text-sm text-[#1E293B] hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'files', label: 'Files' },
    { id: 'payments', label: 'Payments' },
    { id: 'change-requests', label: 'Change Requests' },
  ];

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="text-2xl font-semibold text-[#1E293B] mb-2 w-full border border-gray-300 rounded px-2 py-1"
              />
            ) : (
              <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">{project.name}</h1>
            )}
            <p className="text-sm text-gray-600">
              Client: <span className="font-medium">{project.client.name}</span> |
              Manager: <span className="font-medium">{project.manager.name}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={project.status} type="project" />
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdateProject}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                  title="Save changes"
                >
                  <FiSave className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  title="Cancel"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Edit project"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress: {editData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editData.progress}
                onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        <ProgressBar progress={project.progress} showLabel={true} />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-[#1E293B] text-[#1E293B]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-3">Description</h2>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-3">Scope</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.scope}</p>
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1E293B]">Milestones</h2>
              <button className="flex items-center px-3 py-2 text-sm font-medium text-[#1E293B] border border-gray-300 rounded-md hover:bg-gray-50">
                <FiPlus className="w-4 h-4 mr-2" />
                Add Milestone
              </button>
            </div>
            {project.milestones.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No milestones yet</p>
            ) : (
              <div className="space-y-3">
                {project.milestones.map((milestone: any) => (
                  <div key={milestone.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{milestone.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                        {milestone.expectedDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Expected: {format(new Date(milestone.expectedDate), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={milestone.status} type="milestone" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1E293B]">Project Files</h2>
              <label className="flex items-center px-3 py-2 text-sm font-medium text-[#1E293B] border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <FiUpload className="w-4 h-4 mr-2" />
                Upload File
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <FileList
              files={project.files}
              onDownload={handleDownloadFile}
              onDelete={handleDeleteFile}
              showDelete={true}
            />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1E293B]">Payments</h2>
              <button className="flex items-center px-3 py-2 text-sm font-medium text-[#1E293B] border border-gray-300 rounded-md hover:bg-gray-50">
                <FiPlus className="w-4 h-4 mr-2" />
                Add Payment
              </button>
            </div>
            {project.payments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No payments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.payments.map((payment: any) => (
                      <tr key={payment.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{payment.description}</td>
                        <td className="py-3 px-4 text-gray-900">
                          ${payment.amount.toLocaleString()} {payment.currency}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={payment.status} type="payment" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'change-requests' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Change Requests</h2>
            {project.changeRequests.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No change requests yet</p>
            ) : (
              <div className="space-y-4">
                {project.changeRequests.map((request: any) => (
                  <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{request.title}</h3>
                      <StatusBadge status={request.status} type="changeRequest" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.message}</p>
                    <p className="text-xs text-gray-500">
                      From: {request.client.name} | {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                    {request.adminResponse && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-700 mb-1">Admin Response:</p>
                        <p className="text-sm text-gray-600">{request.adminResponse}</p>
                      </div>
                    )}
                    {request.status === 'PENDING' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <textarea
                          placeholder="Enter your response..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-2"
                          rows={2}
                          id={`response-${request.id}`}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const textarea = document.getElementById(`response-${request.id}`) as HTMLTextAreaElement;
                              handleRespondToChangeRequest(request.id, 'APPROVED', textarea.value);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const textarea = document.getElementById(`response-${request.id}`) as HTMLTextAreaElement;
                              handleRespondToChangeRequest(request.id, 'REJECTED', textarea.value);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
