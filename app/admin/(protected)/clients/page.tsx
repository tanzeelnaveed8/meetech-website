import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getUsers } from '@/lib/db/queries/users';
import Link from 'next/link';
import { FiPlus, FiUser, FiMail, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default async function ClientsPage() {
  const session = await auth();

  if (!session?.user || !['ADMIN', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  const clients = await getUsers({ role: 'CLIENT' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B] mb-1">Clients</h1>
          <p className="text-sm text-gray-600">Manage client accounts and access</p>
        </div>
        {session.user.role === 'ADMIN' && (
          <Link
            href="/admin/clients/new"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1E293B] rounded-md hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Client
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No clients yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <FiUser className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMail className="w-3.5 h-3.5 mr-2" />
                        {client.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">
                        {client._count.clientProjects}
                      </span>
                    </td>
                    <td className="py-3 px-4">
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
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {client.lastLoginAt
                        ? new Date(client.lastLoginAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/clients/${client.id}`}
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
