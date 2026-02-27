'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FiCalendar, FiUser, FiCheckCircle, FiClock, FiAlertCircle, FiMessageSquare, FiExternalLink, FiLock } from 'react-icons/fi';
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
  approvalStatus?: string;
  approvalComment?: string;
}

interface Payment {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
  isUnlocked?: boolean;
  stripeCheckoutUrl?: string;
  milestone?: {
    id: string;
    title: string;
    approvalStatus?: string;
  };
}

interface ChangeRequest {
  id: string;
  title: string;
  message: string;
  status: string;
  adminResponse?: string;
  createdAt: string;
  priority?: string;
  estimatedCostImpact?: number;
  timelineImpactDays?: number;
  recommendedPriority?: string;
  impactSummary?: string;
}

interface Approval {
  id: string;
  type: string;
  title: string;
  status: string;
  description?: string;
  decisionComment?: string;
  createdAt: string;
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
  manager: { name: string };
  milestones: Milestone[];
  payments: Payment[];
  changeRequests: ChangeRequest[];
  approvals: Approval[];
  launchChecklist?: LaunchChecklist | null;
  files: FileItem[];
  startDate?: string;
  expectedEndDate?: string;
}

interface ProjectDetailClientProps {
  projectId: string;
}

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [payingPaymentId, setPayingPaymentId] = useState<string | null>(null);
  const [approvalSearch, setApprovalSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED'>('ALL');
  const [requestSearch, setRequestSearch] = useState('');
  const [requestFilter, setRequestFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW'>('ALL');

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

  const handlePayNow = async (payment: Payment) => {
    if (payment.status === 'PAID') return;
    if (!payment.isUnlocked) {
      toastError('This payment is locked until approval');
      return;
    }

    if (payment.stripeCheckoutUrl) {
      window.open(payment.stripeCheckoutUrl, '_blank');
      return;
    }

    setPayingPaymentId(payment.id);
    try {
      const response = await fetch(`/api/projects/${projectId}/payments/${payment.id}/checkout`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok && data.url) {
        toastSuccess('Redirecting to secure checkout');
        window.open(data.url, '_blank');
        await fetchProject();
      } else {
        toastError(data.error || 'Failed to start checkout');
      }
    } catch {
      toastError('Failed to start checkout');
    } finally {
      setPayingPaymentId(null);
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
        <Button onClick={() => router.push('/client/dashboard')} className="!bg-white !text-slate-900 hover:!bg-slate-100">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const completedMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length;
  const approvedMilestones = project.milestones.filter((m) => m.approvalStatus === 'APPROVED').length;
  const totalPayments = project.payments.reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = project.payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const checklistItems = project.launchChecklist
    ? [
      project.launchChecklist.appStoreAssetsReady,
      project.launchChecklist.privacyPolicyVerified,
      project.launchChecklist.paymentGatewayTested,
      project.launchChecklist.analyticsIntegrated,
      project.launchChecklist.securityAuditCompleted,
    ]
    : [];
  const checklistDone = checklistItems.filter(Boolean).length;
  const checklistProgress = checklistItems.length > 0 ? Math.round((checklistDone / checklistItems.length) * 100) : 0;
  const filteredApprovals = project.approvals.filter((approval) => {
    const matchStatus = approvalFilter === 'ALL' || approval.status === approvalFilter;
    const q = approvalSearch.trim().toLowerCase();
    const matchSearch = !q || approval.title.toLowerCase().includes(q) || approval.type.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });
  const filteredRequests = project.changeRequests.filter((request) => {
    const matchStatus = requestFilter === 'ALL' || request.status === requestFilter;
    const q = requestSearch.trim().toLowerCase();
    const matchSearch = !q || request.title.toLowerCase().includes(q) || request.message.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="sticky top-2 z-20 rounded-2xl border border-white/15 bg-slate-900/75 backdrop-blur-xl p-2 shadow-lg">
        <div className="flex flex-wrap gap-2">
          <a href="#overview" className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 transition-colors">Overview</a>
          <a href="#milestones" className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 transition-colors">Milestones</a>
          <a href="#vault" className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 transition-colors">Vault</a>
          <a href="#payments" className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 transition-colors">Payments</a>
          <a href="#approvals" className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 transition-colors">Approvals</a>
          <a href="#launch" className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 transition-colors">Launch</a>
          <a href="#requests" className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 transition-colors">Requests</a>
        </div>
      </div>

      {/* Header */}
      <section id="overview" className="scroll-mt-24">
      <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          <MiniMetric label="Progress" value={`${project.progress}%`} />
          <MiniMetric label="Milestones" value={`${completedMilestones}/${project.milestones.length}`} />
          <MiniMetric label="Paid" value={`$${paidPayments.toLocaleString()}`} />
          <MiniMetric label="Budget" value={`$${totalPayments.toLocaleString()}`} />
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
      </section>

      {/* Project Scope */}
      <section className="scroll-mt-24">
      <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Project Scope</h2>
        <p className="text-xs text-text-muted mb-3">Approved delivery scope and constraints.</p>
        <p className="text-sm text-text-body whitespace-pre-wrap">{project.scope}</p>
      </Card>
      </section>

      {/* Milestones */}
      <section id="milestones" className="scroll-mt-24">
      <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-text-primary">Milestones</h2>
          <span className="text-sm text-text-muted">
            {completedMilestones} completed / {approvedMilestones} approved
          </span>
        </div>
        <p className="text-xs text-text-muted mb-4">Track delivery phases and review approvals.</p>

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
                    <div className="flex items-center gap-2">
                      <StatusBadge status={milestone.status} type="milestone" />
                      {milestone.approvalStatus && <StatusBadge status={milestone.approvalStatus} type="approval" />}
                    </div>
                  </div>
                  <p className="text-sm text-text-muted mb-2">{milestone.description}</p>
                  {milestone.approvalComment && (
                    <p className="text-xs text-text-muted mb-2">Approval note: {milestone.approvalComment}</p>
                  )}
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
      </section>

      {/* Document Vault */}
      <section id="vault" className="scroll-mt-24">
      <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Document Vault</h2>
        <p className="text-xs text-text-muted mb-4">
          Contracts, invoices, designs, builds, and credentials in one place.
        </p>
        <FileList
          files={project.files}
          onDownload={handleDownloadFile}
          showDelete={false}
        />
      </Card>
      </section>

      {/* Payments */}
      <section id="payments" className="scroll-mt-24">
      <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-text-primary">Payments</h2>
          <div className="text-sm text-text-muted">
            <span className="font-medium text-text-primary">${paidPayments.toLocaleString()}</span>
            {' / '}
            <span>${totalPayments.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-xs text-text-muted mb-4">Payments unlock after required approvals.</p>

        {project.payments.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No payment records yet</p>
        ) : (
          <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="text-left py-3 px-4 font-medium text-text-muted">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-text-muted">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-text-muted">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-text-muted">Action</th>
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
                      <StatusBadge status={payment.isUnlocked ? payment.status : 'LOCKED'} type="payment" />
                    </td>
                    <td className="py-3 px-4">
                      {payment.isUnlocked ? (
                        payment.status === 'PAID' ? (
                          <span className="text-xs text-green-600">Paid</span>
                        ) : (
                          <button
                            onClick={() => handlePayNow(payment)}
                            disabled={payingPaymentId === payment.id}
                            className="inline-flex items-center gap-1 text-accent hover:text-accent-hover disabled:opacity-60"
                          >
                            {payingPaymentId === payment.id ? 'Opening...' : 'Pay now'}
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <FiLock className="w-3.5 h-3.5" />
                          Waiting approval
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {project.payments.map((payment) => (
              <div key={payment.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-sm font-semibold text-text-primary">{payment.description}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Due {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-text-primary">${payment.amount.toLocaleString()} {payment.currency}</span>
                  <StatusBadge status={payment.isUnlocked ? payment.status : 'LOCKED'} type="payment" />
                </div>
                <div className="mt-2">
                  {payment.isUnlocked ? (
                    payment.status === 'PAID' ? (
                      <span className="text-xs text-green-500">Paid</span>
                    ) : (
                      <button
                        onClick={() => handlePayNow(payment)}
                        disabled={payingPaymentId === payment.id}
                        className="inline-flex items-center gap-1 text-accent hover:text-accent-hover disabled:opacity-60 text-xs"
                      >
                        {payingPaymentId === payment.id ? 'Opening...' : 'Pay now'}
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <FiLock className="w-3.5 h-3.5" />
                      Waiting approval
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </Card>
      </section>

      {/* Approval Center */}
      <section id="approvals" className="scroll-mt-24">
      <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-text-primary sm:mr-auto">Approval Center</h2>
          <input
            value={approvalSearch}
            onChange={(e) => setApprovalSearch(e.target.value)}
            placeholder="Search approvals..."
            className="px-3 py-2 text-xs rounded-lg border border-white/15 bg-slate-950/70 text-text-primary"
          />
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value as typeof approvalFilter)}
            className="px-3 py-2 text-xs rounded-lg border border-white/15 bg-slate-950/70 text-text-primary"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
          </select>
        </div>
        <p className="text-xs text-text-muted mb-4">Review design, scope, and milestone decisions.</p>
        {filteredApprovals.length ? (
          <div className="space-y-3">
            {filteredApprovals.map((approval) => (
              <div key={approval.id} className="rounded-lg border border-border-default p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-medium text-text-primary">{approval.title}</h3>
                  <StatusBadge status={approval.status} type="approval" />
                </div>
                <p className="text-xs text-text-muted mb-1">{approval.type.replaceAll('_', ' ')}</p>
                {approval.description && (
                  <p className="text-sm text-text-muted mb-2">{approval.description}</p>
                )}
                {approval.decisionComment && (
                  <p className="text-sm text-text-body">Decision note: {approval.decisionComment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted text-center py-6">No approvals for selected filters</p>
        )}
      </Card>
      </section>

      {/* Launch Readiness */}
      <section id="launch" className="scroll-mt-24">
      <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary">Launch Readiness Checklist</h2>
          <span className="text-sm text-text-muted">{checklistProgress}%</span>
        </div>
        <p className="text-xs text-text-muted mb-4">Final pre-launch quality and compliance checks.</p>
        <ProgressBar progress={checklistProgress} showLabel={false} />
        {project.launchChecklist ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm">
            <ChecklistItem label="App store assets" done={project.launchChecklist.appStoreAssetsReady} />
            <ChecklistItem label="Privacy policy" done={project.launchChecklist.privacyPolicyVerified} />
            <ChecklistItem label="Payment gateway testing" done={project.launchChecklist.paymentGatewayTested} />
            <ChecklistItem label="Analytics integration" done={project.launchChecklist.analyticsIntegrated} />
            <ChecklistItem label="Security audit" done={project.launchChecklist.securityAuditCompleted} />
          </div>
        ) : (
          <p className="text-sm text-text-muted mt-4">Checklist will be shared by your manager.</p>
        )}
      </Card>
      </section>

      {/* Change Requests */}
      <section id="requests" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChangeRequestForm projectId={projectId} onSuccess={fetchProject} />

        <Card className="border-white/15 bg-slate-900/60 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-text-primary sm:mr-auto">Request History</h3>
            <input
              value={requestSearch}
              onChange={(e) => setRequestSearch(e.target.value)}
              placeholder="Search requests..."
              className="px-3 py-2 text-xs rounded-lg border border-white/15 bg-slate-950/70 text-text-primary"
            />
            <select
              value={requestFilter}
              onChange={(e) => setRequestFilter(e.target.value as typeof requestFilter)}
              className="px-3 py-2 text-xs rounded-lg border border-white/15 bg-slate-950/70 text-text-primary"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <p className="text-xs text-text-muted mb-4">Scope changes submitted and reviewed over time.</p>

          {filteredRequests.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No change requests for selected filters</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-3 sm:p-4 border border-border-default rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium text-text-primary">{request.title}</h4>
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
      </section>
    </div>
  );
}

function ChecklistItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${done ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span className={done ? 'text-text-primary' : 'text-text-muted'}>{label}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}
