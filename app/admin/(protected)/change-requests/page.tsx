import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getAllChangeRequests } from '@/lib/db/queries/change-requests';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiMessageSquare } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';
import Card from '@/components/ui/Card';

export default async function ChangeRequestsPage() {
  const session = await auth();

  if (!session?.user || !['ADMIN', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  const changeRequests = await getAllChangeRequests();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Change Requests</h1>
        <p className="text-sm text-text-muted">Review and respond to client change requests</p>
      </div>

      <Card padding="none">
        {changeRequests.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-muted">No change requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle border-b border-border-default">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {changeRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-bg-subtle transition-colors duration-150">
                    <td className="py-3 px-4 text-sm font-medium text-text-primary">
                      {request.project.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary">
                      {request.client.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-text-primary">{request.title}</div>
                      <div className="text-xs text-text-muted mt-0.5 truncate max-w-md">
                        {request.message}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={request.status} type="changeRequest" />
                    </td>
                    <td className="py-3 px-4 text-sm text-text-muted">
                      {format(new Date(request.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/projects/${request.project.id}`}
                        className="text-sm text-accent hover:text-accent-hover font-medium transition-colors duration-200"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
