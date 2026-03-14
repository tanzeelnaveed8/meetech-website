'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiCreditCard, FiExternalLink, FiCheckCircle, FiClock, FiAlertTriangle, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/Toast';

interface Payment {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  status: string;
  stripeCheckoutUrl?: string;
  milestone?: {
    id: string;
    title: string;
  };
  project: {
    id: string;
    name: string;
  };
}

interface ProjectWithPayments {
  id: string;
  name: string;
  payments: Payment[];
}

export default function PaymentsClient() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [projects, setProjects] = useState<ProjectWithPayments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingPaymentId, setPayingPaymentId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();

      if (res.ok) {
        const projectsWithPayments: ProjectWithPayments[] = [];

        for (const proj of data.projects) {
          const payRes = await fetch(`/api/projects/${proj.id}/payments`);
          const payData = await payRes.json();

          if (payRes.ok && payData.payments?.length > 0) {
            projectsWithPayments.push({
              id: proj.id,
              name: proj.name,
              payments: payData.payments.map((p: Payment) => ({
                ...p,
                project: { id: proj.id, name: proj.name },
              })),
            });
          }
        }

        setProjects(projectsWithPayments);
      }
    } catch {
      toastError('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async (projectId: string, payment: Payment) => {
    if (payment.status === 'PAID') return;

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
        toastSuccess('Redirecting to secure checkout...');
        window.open(data.url, '_blank');
        await fetchPayments();
      } else {
        toastError(data.error || 'Failed to start checkout');
      }
    } catch {
      toastError('Failed to start checkout');
    } finally {
      setPayingPaymentId(null);
    }
  };

  const allPayments = projects.flatMap(p =>
    p.payments.map(pay => ({ ...pay, project: { id: p.id, name: p.name } }))
  );

  const filteredPayments = allPayments.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  const totalAmount = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = allPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = allPayments.filter(p => p.status !== 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = allPayments.filter(p => p.status === 'OVERDUE').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-muted">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/95 via-blue-950/70 to-indigo-950/70 p-7 sm:p-10 shadow-[0_30px_80px_rgba(30,64,175,0.45)]">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px, 40px 40px' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-text-inverse/70 text-sm font-medium uppercase tracking-wider">
                Payment Center
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-inverse tracking-tight">
              Payments
            </h1>
            <p className="text-text-inverse/80 mt-3 text-sm sm:text-base max-w-md leading-relaxed">
              View invoices, track payment history, and make secure payments via Stripe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <StatCard
              label="Total Budget"
              value={`$${totalAmount.toLocaleString()}`}
              icon={<FiDollarSign className="w-4 h-4 text-blue-400" />}
            />
            <StatCard
              label="Paid"
              value={`$${paidAmount.toLocaleString()}`}
              icon={<FiCheckCircle className="w-4 h-4 text-green-400" />}
            />
            <StatCard
              label="Pending"
              value={`$${pendingAmount.toLocaleString()}`}
              icon={<FiClock className="w-4 h-4 text-yellow-400" />}
            />
            <StatCard
              label="Overdue"
              value={String(overdueCount)}
              icon={<FiAlertTriangle className="w-4 h-4 text-red-400" />}
            />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalAmount > 0 && (
        <div className="rounded-2xl border border-white/15 bg-slate-900/60 backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-text-primary">Payment Progress</span>
            </div>
            <span className="text-sm text-text-muted">
              {Math.round((paidAmount / totalAmount) * 100)}% completed
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-muted">
            <span>${paidAmount.toLocaleString()} paid</span>
            <span>${totalAmount.toLocaleString()} total</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'PAID', 'OVERDUE'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all ${
              filter === f
                ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                : 'bg-slate-900/60 text-text-muted border-white/10 hover:border-white/20 hover:text-text-primary'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({f === 'ALL' ? allPayments.length : allPayments.filter(p => p.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-white/15 bg-slate-900/55 backdrop-blur-xl">
          <div className="w-16 h-16 bg-accent-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCreditCard className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1.5">
            {filter === 'ALL' ? 'No payments yet' : `No ${filter.toLowerCase()} payments`}
          </h3>
          <p className="text-sm text-text-muted max-w-sm mx-auto">
            {filter === 'ALL'
              ? 'Payments will appear here when your project manager creates invoices.'
              : 'No payments match this filter.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-white/15 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-5 font-medium text-text-muted">Description</th>
                  <th className="text-left py-4 px-5 font-medium text-text-muted">Project</th>
                  <th className="text-left py-4 px-5 font-medium text-text-muted">Amount</th>
                  <th className="text-left py-4 px-5 font-medium text-text-muted">Due Date</th>
                  <th className="text-left py-4 px-5 font-medium text-text-muted">Status</th>
                  <th className="text-left py-4 px-5 font-medium text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div>
                        <p className="text-text-primary font-medium">{payment.description}</p>
                        {payment.milestone && (
                          <p className="text-xs text-text-muted mt-0.5">Milestone: {payment.milestone.title}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-text-muted text-xs">{payment.project.name}</td>
                    <td className="py-4 px-5">
                      <span className="text-text-primary font-semibold">
                        ${payment.amount.toLocaleString()}
                      </span>
                      <span className="text-text-muted text-xs ml-1">{payment.currency}</span>
                    </td>
                    <td className="py-4 px-5 text-text-muted">
                      {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={payment.status} type="payment" variant="dark" />
                    </td>
                    <td className="py-4 px-5">
                      {payment.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          {payment.paidDate && format(new Date(payment.paidDate), 'MMM d')}
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePayNow(payment.project.id, payment)}
                          disabled={payingPaymentId === payment.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/15 text-blue-300 text-xs font-medium border border-blue-400/20 hover:bg-blue-500/25 hover:border-blue-400/40 transition-all disabled:opacity-50"
                        >
                          {payingPaymentId === payment.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-300" />
                              Opening...
                            </>
                          ) : (
                            <>
                              <FiCreditCard className="w-3.5 h-3.5" />
                              Pay Now
                              <FiExternalLink className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{payment.description}</p>
                    <p className="text-xs text-text-muted mt-0.5">{payment.project.name}</p>
                  </div>
                  <StatusBadge status={payment.status} type="payment" variant="dark" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-text-primary">
                    ${payment.amount.toLocaleString()}
                    <span className="text-xs text-text-muted ml-1 font-normal">{payment.currency}</span>
                  </span>
                  <span className="text-xs text-text-muted">
                    Due {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                  </span>
                </div>

                {payment.milestone && (
                  <p className="text-xs text-text-muted mb-3">
                    Milestone: {payment.milestone.title}
                  </p>
                )}

                {payment.status === 'PAID' ? (
                  <div className="flex items-center gap-1.5 text-xs text-green-400 py-2">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Paid {payment.paidDate && `on ${format(new Date(payment.paidDate), 'MMM d, yyyy')}`}
                  </div>
                ) : (
                  <button
                    onClick={() => handlePayNow(payment.project.id, payment)}
                    disabled={payingPaymentId === payment.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/15 text-blue-300 text-sm font-medium border border-blue-400/20 hover:bg-blue-500/25 hover:border-blue-400/40 transition-all disabled:opacity-50"
                  >
                    {payingPaymentId === payment.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b border-blue-300" />
                        Opening checkout...
                      </>
                    ) : (
                      <>
                        <FiCreditCard className="w-4 h-4" />
                        Pay Now
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <p className="text-[10px] uppercase tracking-wide text-blue-100/75">{label}</p>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
