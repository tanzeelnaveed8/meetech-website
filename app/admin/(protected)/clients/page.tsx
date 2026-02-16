import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getUsers } from '@/lib/db/queries/users';
import Link from 'next/link';
import { FiPlus, FiUser, FiMail, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Card from '@/components/ui/Card';

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
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Clients</h1>
          <p className="text-sm text-text-muted">Manage client accounts and access</p>
        </div>
        {session.user.role === 'ADMIN' && (
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-sm"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Client
          </Link>
        )}
      </div>

      <Card padding="none">
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="w-12 h-12 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-muted">No clients yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle border-b border-border-default">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-bg-subtle transition-colors duration-150">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <FiUser className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium text-text-primary">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-text-muted">
                        <FiMail className="w-3.5 h-3.5 mr-2" />
                        {client.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-text-primary">
                        {client._count.clientProjects}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {client.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400">
                          <FiCheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400">
                          <FiXCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-muted">
                      {client.lastLoginAt
                        ? new Date(client.lastLoginAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/clients/${client.id}`}
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
