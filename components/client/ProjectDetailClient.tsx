'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FiCalendar, FiUser, FiCheckCircle, FiClock, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import FileList from '@/components/ui/FileList';
import ChangeRequestForm from '@/components/client/ChangeRequestForm';
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
  manager: { name: string };
  milestones: Milestone[];
  payments: Payment[];
  changeRequests: ChangeRequest[];
  files: FileItem[];
  startDate?: string;
  expectedEndDate?: string;
}

interface ProjectDetailClientProps {
  projectId: string;
}

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const router = useRouter();
  const { error: toastError } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStartingChat, setIsStartingChat] = useState(false);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
      } else {
        setError(data.error || 'Failed to load project');
      }
    } catch {
      setError('An error occurred while loading the project');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleDownloadFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/files/${fileId}/download`);
      const data = await response.json();

      if (response.ok) {
        window.open(data.url, '_blank');
      } else {
        toastError('Failed to download file');
      }
    } catch {
      toastError('An error occurred while downloading the file');
    }
  };

  const handleMessageManager = async () => {
    setIsStartingChat(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      if (res.ok && data.conversation?.id) {
        router.push(`/client/dashboard?modal=messages&conversationId=${data.conversation.id}`);
      } else {
        toastError('Failed to start conversation');
      }
    } catch {
      toastError('An error occurred');
    } finally {
      setIsStartingChat(false);
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
        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">Error</h3>
        <p className="text-sm text-text-muted mb-4">{error || 'Project not found'}</p>
        <Button onClick={() => router.push('/client/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const completedMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length;
  const totalPayments = project.payments.reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = project.payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
              {project.name}
            </h1>
            <p className="text-text-muted">{project.description}</p>
          </div>
          <StatusBadge status={project.status} type="project" />
        </div>

        {/* Message Manager button */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMessageManager}
            isLoading={isStartingChat}
            leftIcon={<FiMessageSquare className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Message Manager
          </Button>
        </div>

        <div className="mb-4">
          <ProgressBar progress={project.progress} showLabel={true} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-border-default">
          <div className="flex items-center text-sm">
            <FiUser className="w-4 h-4 text-text-disabled mr-2" />
            <span className="text-text-muted">Manager:</span>
            <span className="ml-2 font-medium text-text-primary">{project.manager.name}</span>
          </div>
          {project.startDate && (
            <div className="flex items-center text-sm">
              <FiCalendar className="w-4 h-4 text-text-disabled mr-2" />
              <span className="text-text-muted">Started:</span>
              <span className="ml-2 font-medium text-text-primary">
                {format(new Date(project.startDate), 'MMM d, yyyy')}
              </span>
            </div>
          )}
          {project.expectedEndDate && (
            <div className="flex items-center text-sm">
              <FiClock className="w-4 h-4 text-text-disabled mr-2" />
              <span className="text-text-muted">Expected End:</span>
              <span className="ml-2 font-medium text-text-primary">
                {format(new Date(project.expectedEndDate), 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Project Scope */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Project Scope</h2>
        <p className="text-sm text-text-body whitespace-pre-wrap">{project.scope}</p>
      </Card>

      {/* Milestones */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Milestones</h2>
          <span className="text-sm text-text-muted">
            {completedMilestones} of {project.milestones.length} completed
          </span>
        </div>

        {project.milestones.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No milestones yet</p>
        ) : (
          <div className="space-y-3">
            {project.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start space-x-3 p-3 sm:p-4 border border-border-default rounded-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {milestone.status === 'COMPLETED' ? (
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border-strong" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <h3 className="text-sm font-medium text-text-primary">{milestone.title}</h3>
                    <StatusBadge status={milestone.status} type="milestone" />
                  </div>
                  <p className="text-sm text-text-muted mb-2">{milestone.description}</p>
                  {milestone.expectedDate && (
                    <p className="text-xs text-text-disabled">
                      Expected: {format(new Date(milestone.expectedDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Files */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Project Files</h2>
        <FileList
          files={project.files}
          onDownload={handleDownloadFile}
          showDelete={false}
        />
      </Card>

      {/* Payments */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Payments</h2>
          <div className="text-sm text-text-muted">
            <span className="font-medium text-text-primary">${paidPayments.toLocaleString()}</span>
            {' / '}
            <span>${totalPayments.toLocaleString()}</span>
          </div>
        </div>

        {project.payments.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No payment records yet</p>
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

      {/* Change Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChangeRequestForm projectId={projectId} onSuccess={fetchProject} />

        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Request History</h3>

          {project.changeRequests.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No change requests yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {project.changeRequests.map((request) => (
                <div key={request.id} className="p-3 sm:p-4 border border-border-default rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium text-text-primary">{request.title}</h4>
                    <StatusBadge status={request.status} type="changeRequest" />
                  </div>
                  <p className="text-sm text-text-muted mb-2">{request.message}</p>
                  {request.adminResponse && (
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                      <p className="text-xs font-medium text-text-muted mb-1">Admin Response:</p>
                      <p className="text-sm text-text-body">{request.adminResponse}</p>
                    </div>
                  )}
                  <p className="text-xs text-text-disabled mt-2">
                    {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
