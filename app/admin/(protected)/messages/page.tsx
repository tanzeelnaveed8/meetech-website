import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import AdminMessagesClient from '@/components/admin/AdminMessagesClient';

export default async function AdminMessagesPage() {
  const session = await auth();

  if (!session?.user || !['ADMIN', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Messages</h1>
        <p className="text-sm text-text-muted">
          View and respond to client messages
        </p>
      </div>

      <AdminMessagesClient userId={session.user.id} userRole={session.user.role} />
    </div>
  );
}
