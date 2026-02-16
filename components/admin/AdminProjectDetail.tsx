'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FiArrowLeft, FiEdit2, FiUpload, FiPlus, FiSave, FiX } from 'react-icons/fi';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import FileList from '@/components/ui/FileList';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  expectedDate?: string;
}

interface Payment {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
}

interface ChangeRequest {
  id: string;
  title: string;
  message: string;
  status: string;
  adminResponse?: string;
  createdAt: string;
  client: { name: string };
}

interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  createdAt: string;
  uploadedBy?: { name: string };
}

interface Project {
  name: string;
  description: string;
  scope: string;
  status: string;
  progress: number;
  client: { name: string };
  manager: { name: string };
  milestones: Milestone[];
  payments: Payment[];
  changeRequests: ChangeRequest[];
  files: FileItem[];
  startDate?: string;
  expectedEndDate?: string;
}

interface AdminProjectDetailProps {
  projectId: string;
}

export default function AdminProjectDetail({ projectId }: AdminProjectDetailProps) {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    scope: '',
    status: '',
    progress: 0,
  });

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch {
      setError('An error occurred while loading the project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await fetchProject();
        setIsEditing(false);
        toastSuccess('Project updated successfully');
      } else {
        toastError('Failed to update project');
      }
    } catch {
      toastError('An error occurred');
    } finally {
      setIsSaving(false);
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
        toastSuccess('File uploaded successfully');
      } else {
        toastError('Failed to upload file');
      }
    } catch {
      toastError('An error occurred while uploading');
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/files/${fileId}/download`);
      const data = await response.json();

      if (response.ok) {
        window.open(data.url, '_blank');
      }
    } catch {
      toastError('Failed to download file');
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
        toastSuccess('File deleted successfully');
      }
    } catch {
      toastError('Failed to delete file');
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
        toastSuccess(`Change request ${status.toLowerCase()}`);
      } else {
        toastError('Failed to update change request');
      }
    } catch {
      toastError('Failed to update change request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-muted">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
        <Link href="/admin/projects" className="text-sm text-accent hover:text-accent-hover">
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
          className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors duration-200 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="text-2xl font-semibold text-text-primary mb-2 w-full border border-border-default rounded-lg px-3 py-1.5 bg-bg-surface focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            ) : (
              <h1 className="text-2xl font-semibold text-text-primary mb-2">{project.name}</h1>
            )}
            <p className="text-sm text-text-muted">
              Client: <span className="font-medium text-text-primary">{project.client.name}</span> |
              Manager: <span className="font-medium text-text-primary">{project.manager.name}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={project.status} type="project" />
            {isEditing ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpdateProject}
                  isLoading={isSaving}
                  leftIcon={<FiSave className="w-4 h-4" />}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  leftIcon={<FiX className="w-4 h-4" />}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                leftIcon={<FiEdit2 className="w-4 h-4" />}
              >
                Edit
              </Button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full px-4 py-3 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Progress: {editData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editData.progress}
                onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) })}
                className="w-full accent-accent"
              />
            </div>
          </div>
        )}

        <ProgressBar progress={project.progress} showLabel={true} />
      </Card>

      {/* Tabs */}
      <div className="border-b border-border-default mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-strong'
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
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-3">Description</h2>
              <p className="text-sm text-text-body">{project.description}</p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-3">Scope</h2>
              <p className="text-sm text-text-body whitespace-pre-wrap">{project.scope}</p>
            </Card>
          </div>
        )}

        {activeTab === 'milestones' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Milestones</h2>
              <Button variant="outline" size="sm" leftIcon={<FiPlus className="w-4 h-4" />}>
                Add Milestone
              </Button>
            </div>
            {project.milestones.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No milestones yet</p>
            ) : (
              <div className="space-y-3">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 border border-border-default rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-text-primary">{milestone.title}</h3>
                        <p className="text-sm text-text-muted mt-1">{milestone.description}</p>
                        {milestone.expectedDate && (
                          <p className="text-xs text-text-muted mt-2">
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
          </Card>
        )}

        {activeTab === 'files' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Project Files</h2>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border-default bg-bg-surface text-text-primary hover:bg-bg-subtle transition-colors duration-200">
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
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Payments</h2>
              <Button variant="outline" size="sm" leftIcon={<FiPlus className="w-4 h-4" />}>
                Add Payment
              </Button>
            </div>
            {project.payments.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No payments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-default">
                      <th className="text-left py-3 px-4 font-medium text-text-muted">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-text-muted">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-text-muted">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border-subtle">
                        <td className="py-3 px-4 text-text-primary">{payment.description}</td>
                        <td className="py-3 px-4 text-text-primary">
                          ${payment.amount.toLocaleString()} {payment.currency}
                        </td>
                        <td className="py-3 px-4 text-text-muted">
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
          </Card>
        )}

        {activeTab === 'change-requests' && (
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Change Requests</h2>
            {project.changeRequests.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No change requests yet</p>
            ) : (
              <div className="space-y-4">
                {project.changeRequests.map((request) => (
                  <div key={request.id} className="p-4 border border-border-default rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-text-primary">{request.title}</h3>
                      <StatusBadge status={request.status} type="changeRequest" />
                    </div>
                    <p className="text-sm text-text-muted mb-2">{request.message}</p>
                    <p className="text-xs text-text-disabled">
                      From: {request.client.name} | {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                    {request.adminResponse && (
                      <div className="mt-3 pt-3 border-t border-border-subtle">
                        <p className="text-xs font-medium text-text-muted mb-1">Admin Response:</p>
                        <p className="text-sm text-text-body">{request.adminResponse}</p>
                      </div>
                    )}
                    {request.status === 'PENDING' && (
                      <div className="mt-3 pt-3 border-t border-border-subtle">
                        <textarea
                          placeholder="Enter your response..."
                          className="w-full px-4 py-3 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary placeholder:text-text-disabled mb-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                          rows={2}
                          id={`response-${request.id}`}
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const textarea = document.getElementById(`response-${request.id}`) as HTMLTextAreaElement;
                              handleRespondToChangeRequest(request.id, 'APPROVED', textarea.value);
                            }}
                            className="!bg-green-600 hover:!bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const textarea = document.getElementById(`response-${request.id}`) as HTMLTextAreaElement;
                              handleRespondToChangeRequest(request.id, 'REJECTED', textarea.value);
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
