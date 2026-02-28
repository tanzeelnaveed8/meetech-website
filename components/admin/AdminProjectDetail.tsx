'use client';

import { useState, useEffect } from 'react';
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
  isUnlocked?: boolean;
  milestoneId?: string | null;
  stripeCheckoutUrl?: string;
}

interface ChangeRequest {
  id: string;
  title: string;
  message: string;
  status: string;
  adminResponse?: string;
  createdAt: string;
  client: { name: string };
  priority?: string;
  estimatedCostImpact?: number;
  timelineImpactDays?: number;
  impactSummary?: string;
}

interface LaunchChecklist {
  appStoreAssetsReady: boolean;
  privacyPolicyVerified: boolean;
  paymentGatewayTested: boolean;
  analyticsIntegrated: boolean;
  securityAuditCompleted: boolean;
  notes?: string;
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
  launchChecklist?: LaunchChecklist | null;
  startDate?: string;
  expectedEndDate?: string;
}

interface AdminProjectDetailProps {
  projectId: string;
}

export default function AdminProjectDetail({ projectId }: AdminProjectDetailProps) {
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

  const [launchChecklist, setLaunchChecklist] = useState<LaunchChecklist>({
    appStoreAssetsReady: false,
    privacyPolicyVerified: false,
    paymentGatewayTested: false,
    analyticsIntegrated: false,
    securityAuditCompleted: false,
    notes: '',
  });
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [isCreatingMilestone, setIsCreatingMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    status: 'PENDING',
    expectedDate: '',
  });
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [isUpdatingMilestone, setIsUpdatingMilestone] = useState(false);
  const [milestoneEditForm, setMilestoneEditForm] = useState({
    title: '',
    description: '',
    status: 'PENDING',
    expectedDate: '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [paymentEditForm, setPaymentEditForm] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    dueDate: '',
    status: 'PENDING',
    milestoneId: '',
  });
  const [isAddingSourceLinks, setIsAddingSourceLinks] = useState(false);
  const [sourceCodeLinks, setSourceCodeLinks] = useState(['']);
  const [paymentForm, setPaymentForm] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    dueDate: '',
    status: 'PENDING',
    milestoneId: '',
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
        setLaunchChecklist({
          appStoreAssetsReady: data.project.launchChecklist?.appStoreAssetsReady ?? false,
          privacyPolicyVerified: data.project.launchChecklist?.privacyPolicyVerified ?? false,
          paymentGatewayTested: data.project.launchChecklist?.paymentGatewayTested ?? false,
          analyticsIntegrated: data.project.launchChecklist?.analyticsIntegrated ?? false,
          securityAuditCompleted: data.project.launchChecklist?.securityAuditCompleted ?? false,
          notes: data.project.launchChecklist?.notes ?? '',
        });
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

  const handleAddSourceCodeLinks = async () => {
    const trimmedLinks = sourceCodeLinks.map((link) => link.trim());
    const hasAnyLink = trimmedLinks.some(Boolean);
    if (!hasAnyLink) {
      toastError('Please enter at least one source code link');
      return;
    }

    setIsAddingSourceLinks(true);
    try {
      const existingSourceLinkCount = project?.files.filter((file) => file.fileType === 'text/url').length ?? 0;
      let nextSourceNumber = existingSourceLinkCount + 1;
      let successCount = 0;
      for (const link of trimmedLinks) {
        if (!link) continue;

        const formData = new FormData();
        formData.append('sourceCodeUrl', link);
        formData.append('fileLabel', `Source Code ${nextSourceNumber}`);
        formData.append('category', 'CODE');

        const response = await fetch(`/api/projects/${projectId}/files`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || `Failed to add Source Code ${nextSourceNumber}`);
        }

        successCount += 1;
        nextSourceNumber += 1;
      }

      if (successCount > 0) {
        setSourceCodeLinks(['']);
        await fetchProject();
        toastSuccess(`Added ${successCount} source code link${successCount > 1 ? 's' : ''}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toastError(error.message);
      } else {
        toastError('Failed to add source code links');
      }
    } finally {
      setIsAddingSourceLinks(false);
    }
  };

  const handleAddSourceCodeField = () => {
    setSourceCodeLinks((prev) => [...prev, '']);
  };

  const handleRemoveSourceCodeField = (indexToRemove: number) => {
    setSourceCodeLinks((prev) => {
      if (prev.length === 1) return [''];
      return prev.filter((_, index) => index !== indexToRemove);
    });
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

  const handleSaveLaunchChecklist = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/launch-checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(launchChecklist),
      });
      if (response.ok) {
        await fetchProject();
        toastSuccess('Launch checklist updated');
      } else {
        toastError('Failed to update launch checklist');
      }
    } catch {
      toastError('Failed to update launch checklist');
    }
  };

  const handleCreateMilestone = async () => {
    if (!milestoneForm.title.trim() || !milestoneForm.description.trim()) {
      toastError('Milestone title and description are required');
      return;
    }

    setIsCreatingMilestone(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: milestoneForm.title.trim(),
          description: milestoneForm.description.trim(),
          status: milestoneForm.status,
          order: (project?.milestones.length ?? 0) + 1,
          expectedDate: milestoneForm.expectedDate || undefined,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setMilestoneForm({ title: '', description: '', status: 'PENDING', expectedDate: '' });
        setShowMilestoneForm(false);
        await fetchProject();
        toastSuccess('Milestone added successfully');
      } else {
        toastError(data.error || 'Failed to add milestone');
      }
    } catch {
      toastError('Failed to add milestone');
    } finally {
      setIsCreatingMilestone(false);
    }
  };

  const handleStartEditMilestone = (milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setMilestoneEditForm({
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
      expectedDate: milestone.expectedDate
        ? new Date(milestone.expectedDate).toISOString().split('T')[0]
        : '',
    });
  };

  const handleCancelEditMilestone = () => {
    setEditingMilestoneId(null);
    setMilestoneEditForm({
      title: '',
      description: '',
      status: 'PENDING',
      expectedDate: '',
    });
  };

  const handleUpdateMilestone = async () => {
    if (!editingMilestoneId) return;
    if (!milestoneEditForm.title.trim() || !milestoneEditForm.description.trim()) {
      toastError('Milestone title and description are required');
      return;
    }

    setIsUpdatingMilestone(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId: editingMilestoneId,
          title: milestoneEditForm.title.trim(),
          description: milestoneEditForm.description.trim(),
          status: milestoneEditForm.status,
          expectedDate: milestoneEditForm.expectedDate || undefined,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        handleCancelEditMilestone();
        await fetchProject();
        toastSuccess('Milestone updated successfully');
      } else {
        toastError(data.error || 'Failed to update milestone');
      }
    } catch {
      toastError('Failed to update milestone');
    } finally {
      setIsUpdatingMilestone(false);
    }
  };

  const handleCreatePayment = async () => {
    if (!paymentForm.description.trim() || !paymentForm.amount || !paymentForm.dueDate) {
      toastError('Description, amount, and due date are required');
      return;
    }

    const amount = Number(paymentForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toastError('Enter a valid payment amount');
      return;
    }

    setIsCreatingPayment(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: paymentForm.description.trim(),
          amount,
          currency: paymentForm.currency,
          dueDate: paymentForm.dueDate,
          status: paymentForm.status,
          milestoneId: paymentForm.milestoneId || undefined,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setPaymentForm({
          description: '',
          amount: '',
          currency: 'USD',
          dueDate: '',
          status: 'PENDING',
          milestoneId: '',
        });
        setShowPaymentForm(false);
        await fetchProject();
        toastSuccess('Payment added successfully');
      } else {
        toastError(data.error || 'Failed to add payment');
      }
    } catch {
      toastError('Failed to add payment');
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleStartEditPayment = (payment: Payment) => {
    setEditingPaymentId(payment.id);
    setPaymentEditForm({
      description: payment.description,
      amount: String(payment.amount),
      currency: payment.currency,
      dueDate: new Date(payment.dueDate).toISOString().split('T')[0],
      status: payment.status,
      milestoneId: payment.milestoneId ?? '',
    });
  };

  const handleCancelEditPayment = () => {
    setEditingPaymentId(null);
    setPaymentEditForm({
      description: '',
      amount: '',
      currency: 'USD',
      dueDate: '',
      status: 'PENDING',
      milestoneId: '',
    });
  };

  const handleUpdatePayment = async () => {
    if (!editingPaymentId) return;
    if (!paymentEditForm.description.trim() || !paymentEditForm.amount || !paymentEditForm.dueDate) {
      toastError('Description, amount, and due date are required');
      return;
    }

    const amount = Number(paymentEditForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toastError('Enter a valid payment amount');
      return;
    }

    setIsUpdatingPayment(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/payments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: editingPaymentId,
          description: paymentEditForm.description.trim(),
          amount,
          currency: paymentEditForm.currency.toUpperCase(),
          dueDate: paymentEditForm.dueDate,
          status: paymentEditForm.status,
          milestoneId: paymentEditForm.milestoneId || null,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        handleCancelEditPayment();
        await fetchProject();
        toastSuccess('Payment updated successfully');
      } else {
        toastError(data.error || 'Failed to update payment');
      }
    } catch {
      toastError('Failed to update payment');
    } finally {
      setIsUpdatingPayment(false);
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
    { id: 'launch-readiness', label: 'Launch Readiness' },
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
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FiPlus className="w-4 h-4" />}
                onClick={() => setShowMilestoneForm((prev) => !prev)}
              >
                Add Milestone
              </Button>
            </div>
            {showMilestoneForm && (
              <div className="mb-4 p-4 border border-border-default rounded-lg bg-bg-subtle space-y-3">
                <input
                  type="text"
                  placeholder="Milestone title"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                />
                <textarea
                  placeholder="Milestone description"
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={milestoneForm.status}
                    onChange={(e) => setMilestoneForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                  <input
                    type="date"
                    value={milestoneForm.expectedDate}
                    onChange={(e) => setMilestoneForm((prev) => ({ ...prev, expectedDate: e.target.value }))}
                    className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateMilestone} isLoading={isCreatingMilestone}>
                    Save Milestone
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowMilestoneForm(false)}
                    disabled={isCreatingMilestone}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {project.milestones.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No milestones yet</p>
            ) : (
              <div className="space-y-3">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 border border-border-default rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingMilestoneId === milestone.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={milestoneEditForm.title}
                              onChange={(e) => setMilestoneEditForm((prev) => ({ ...prev, title: e.target.value }))}
                              className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              placeholder="Milestone title"
                            />
                            <textarea
                              rows={3}
                              value={milestoneEditForm.description}
                              onChange={(e) => setMilestoneEditForm((prev) => ({ ...prev, description: e.target.value }))}
                              className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              placeholder="Milestone description"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <select
                                value={milestoneEditForm.status}
                                onChange={(e) => setMilestoneEditForm((prev) => ({ ...prev, status: e.target.value }))}
                                className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="BLOCKED">Blocked</option>
                              </select>
                              <input
                                type="date"
                                value={milestoneEditForm.expectedDate}
                                onChange={(e) => setMilestoneEditForm((prev) => ({ ...prev, expectedDate: e.target.value }))}
                                className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleUpdateMilestone} isLoading={isUpdatingMilestone}>
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEditMilestone}
                                disabled={isUpdatingMilestone}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-sm font-medium text-text-primary">{milestone.title}</h3>
                            <p className="text-sm text-text-muted mt-1">{milestone.description}</p>
                            {milestone.expectedDate && (
                              <p className="text-xs text-text-muted mt-2">
                                Expected: {format(new Date(milestone.expectedDate), 'MMM d, yyyy')}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={milestone.status} type="milestone" />
                        {editingMilestoneId !== milestone.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<FiEdit2 className="w-4 h-4" />}
                            onClick={() => handleStartEditMilestone(milestone)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
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
            <div className="mb-4 p-4 border border-border-default rounded-lg bg-bg-subtle space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-primary">Source Code Links</p>
                <button
                  type="button"
                  onClick={handleAddSourceCodeField}
                  disabled={isAddingSourceLinks}
                  className="inline-flex items-center justify-center p-2 rounded-md border border-border-default text-text-muted hover:text-accent hover:border-accent disabled:opacity-50 transition-colors duration-200"
                  title="Add another source code link"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {sourceCodeLinks.map((link, index) => (
                  <div key={`source-code-${index}`} className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder={index === 0 ? 'Source Code Link (https://...)' : `Source Code Link ${index + 1} (https://...)`}
                      value={link}
                      onChange={(e) => {
                        const nextLinks = [...sourceCodeLinks];
                        nextLinks[index] = e.target.value;
                        setSourceCodeLinks(nextLinks);
                      }}
                      className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                      disabled={isAddingSourceLinks}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSourceCodeField(index)}
                      disabled={isAddingSourceLinks || sourceCodeLinks.length === 1}
                      className="inline-flex items-center justify-center p-2 rounded-md border border-border-default text-text-muted hover:text-red-600 hover:border-red-300 disabled:opacity-40 transition-colors duration-200"
                      title="Remove this source code link field"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={handleAddSourceCodeLinks} isLoading={isAddingSourceLinks}>
                  Add Source Code Links
                </Button>
              </div>
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
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FiPlus className="w-4 h-4" />}
                onClick={() => setShowPaymentForm((prev) => !prev)}
              >
                Add Payment
              </Button>
            </div>
            {showPaymentForm && (
              <div className="mb-4 p-4 border border-border-default rounded-lg bg-bg-subtle space-y-3">
                <input
                  type="text"
                  placeholder="Payment description"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Amount"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                  />
                  <input
                    type="text"
                    placeholder="Currency (USD)"
                    value={paymentForm.currency}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, currency: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={paymentForm.dueDate}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                  />
                  <select
                    value={paymentForm.status}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <select
                  value={paymentForm.milestoneId}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, milestoneId: e.target.value }))}
                  className="w-full px-4 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                >
                  <option value="">General payment (no milestone)</option>
                  {project.milestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      Link to: {m.title}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreatePayment} isLoading={isCreatingPayment}>
                    Save Payment
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPaymentForm(false)}
                    disabled={isCreatingPayment}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
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
                      <th className="text-left py-3 px-4 font-medium text-text-muted">Milestone</th>
                      <th className="text-left py-3 px-4 font-medium text-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border-subtle">
                        {editingPaymentId === payment.id ? (
                          <>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={paymentEditForm.description}
                                onChange={(e) => setPaymentEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  step="0.01"
                                  value={paymentEditForm.amount}
                                  onChange={(e) => setPaymentEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                                  className="w-28 px-3 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                                />
                                <input
                                  type="text"
                                  value={paymentEditForm.currency}
                                  onChange={(e) => setPaymentEditForm((prev) => ({ ...prev, currency: e.target.value.toUpperCase() }))}
                                  className="w-20 px-3 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="date"
                                value={paymentEditForm.dueDate}
                                onChange={(e) => setPaymentEditForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={paymentEditForm.status}
                                onChange={(e) => setPaymentEditForm((prev) => ({ ...prev, status: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="PAID">Paid</option>
                                <option value="OVERDUE">Overdue</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={paymentEditForm.milestoneId}
                                onChange={(e) => setPaymentEditForm((prev) => ({ ...prev, milestoneId: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
                              >
                                <option value="">General</option>
                                {project.milestones.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.title}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button size="sm" onClick={handleUpdatePayment} isLoading={isUpdatingPayment}>
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEditPayment}
                                  disabled={isUpdatingPayment}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
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
                            <td className="py-3 px-4 text-text-muted">
                              {payment.milestoneId ? 'Linked milestone' : 'General'}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<FiEdit2 className="w-4 h-4" />}
                                onClick={() => handleStartEditPayment(payment)}
                                disabled={editingPaymentId !== null}
                              >
                                Edit
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'launch-readiness' && (
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Launch Readiness Checklist</h2>
            <div className="space-y-3 mb-4">
              {[
                ['appStoreAssetsReady', 'App store assets ready'],
                ['privacyPolicyVerified', 'Privacy policy verified'],
                ['paymentGatewayTested', 'Payment gateway tested'],
                ['analyticsIntegrated', 'Analytics integrated'],
                ['securityAuditCompleted', 'Security audit completed'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-text-primary">
                  <input
                    type="checkbox"
                    checked={Boolean(launchChecklist[key as keyof LaunchChecklist])}
                    onChange={(e) => setLaunchChecklist((prev) => ({ ...prev, [key]: e.target.checked }))}
                  />
                  {label}
                </label>
              ))}
            </div>
            <textarea
              placeholder="Checklist notes..."
              rows={4}
              value={launchChecklist.notes ?? ''}
              onChange={(e) => setLaunchChecklist((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full mb-4 px-4 py-3 text-sm border border-border-default rounded-lg bg-bg-surface text-text-primary"
            />
            <Button onClick={handleSaveLaunchChecklist}>Save Checklist</Button>
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
                    {request.impactSummary && (
                      <p className="text-xs text-text-muted mb-1">{request.impactSummary}</p>
                    )}
                    {(request.estimatedCostImpact || request.timelineImpactDays) && (
                      <p className="text-xs text-text-muted mb-2">
                        Impact: +${request.estimatedCostImpact ?? 0} / +{request.timelineImpactDays ?? 0} day(s)
                      </p>
                    )}
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
