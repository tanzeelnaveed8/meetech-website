import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getAllChangeRequests } from '@/lib/db/queries/change-requests';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiMessageSquare } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';

export default async function ChangeRequestsPage() {
  const session = await auth();

  if (!session?.user || !['ADMIN', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  const changeRequests = await getAllChangeRequests();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1E293B] mb-1">Change Requests</h1>
        <p className="text-sm text-gray-600">Review and respond to client change requests</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {changeRequests.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No change requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {changeRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {request.project.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {request.client.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">{request.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate max-w-md">
                        {request.message}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={request.status} type="changeRequest" />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {format(new Date(request.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/projects/${request.project.id}`}
                        className="text-sm text-[#1E293B] hover:text-gray-600 font-medium"
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
      </div>
    </div>
  );
}
