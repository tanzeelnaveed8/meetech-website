'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FiCalendar, FiUser, FiCheckCircle, FiClock, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import FileList from '@/components/ui/FileList';
import ChangeRequestForm from '@/components/client/ChangeRequestForm';

interface ProjectDetailClientProps {
  projectId: string;
}

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
      } else {
        setError(data.error || 'Failed to load project');
      }
    } catch (err) {
      setError('An error occurred while loading the project');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleDownloadFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/files/${fileId}/download`);
      const data = await response.json();

      if (response.ok) {
        window.open(data.url, '_blank');
      } else {
        alert('Failed to download file');
      }
    } catch (err) {
      alert('An error occurred while downloading the file');
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
        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-sm text-gray-500 mb-4">{error || 'Project not found'}</p>
        <button
          onClick={() => router.push('/client/dashboard')}
          className="px-4 py-2 text-sm font-medium text-white bg-[#1E293B] rounded-md hover:bg-gray-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const completedMilestones = project.milestones.filter((m: any) => m.status === 'COMPLETED').length;
  const totalPayments = project.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
  const paidPayments = project.payments
    .filter((p: any) => p.status === 'PAID')
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <StatusBadge status={project.status} type="project" />
        </div>

        <div className="mb-4">
          <ProgressBar progress={project.progress} showLabel={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm">
            <FiUser className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">Manager:</span>
            <span className="ml-2 font-medium text-gray-900">{project.manager.name}</span>
          </div>
          {project.startDate && (
            <div className="flex items-center text-sm">
              <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Started:</span>
              <span className="ml-2 font-medium text-gray-900">
                {format(new Date(project.startDate), 'MMM d, yyyy')}
              </span>
            </div>
          )}
          {project.expectedEndDate && (
            <div className="flex items-center text-sm">
              <FiClock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Expected End:</span>
              <span className="ml-2 font-medium text-gray-900">
                {format(new Date(project.expectedEndDate), 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Project Scope */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-3">Project Scope</h2>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.scope}</p>
      </div>

      {/* Milestones */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">Milestones</h2>
          <span className="text-sm text-gray-600">
            {completedMilestones} of {project.milestones.length} completed
          </span>
        </div>

        {project.milestones.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No milestones yet</p>
        ) : (
          <div className="space-y-3">
            {project.milestones.map((milestone: any) => (
              <div
                key={milestone.id}
                className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {milestone.status === 'COMPLETED' ? (
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">{milestone.title}</h3>
                    <StatusBadge status={milestone.status} type="milestone" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                  {milestone.expectedDate && (
                    <p className="text-xs text-gray-500">
                      Expected: {format(new Date(milestone.expectedDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Files */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Project Files</h2>
        <FileList
          files={project.files}
          onDownload={handleDownloadFile}
          showDelete={false}
        />
      </div>

      {/* Payments */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">Payments</h2>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">${paidPayments.toLocaleString()}</span>
            {' / '}
            <span>${totalPayments.toLocaleString()}</span>
          </div>
        </div>

        {project.payments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No payment records yet</p>
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

      {/* Change Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChangeRequestForm projectId={projectId} onSuccess={fetchProject} />

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-4">Request History</h3>

          {project.changeRequests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No change requests yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {project.changeRequests.map((request: any) => (
                <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{request.title}</h4>
                    <StatusBadge status={request.status} type="changeRequest" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.message}</p>
                  {request.adminResponse && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-700 mb-1">Admin Response:</p>
                      <p className="text-sm text-gray-600">{request.adminResponse}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
