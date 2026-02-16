import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import MessagesClient from '@/components/client/MessagesClient';

export default async function ClientMessagesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'CLIENT') {
    redirect('/client/login');
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Messages</h1>
        <p className="text-sm text-text-muted">
          Communicate with your project manager
        </p>
      </div>

      <MessagesClient userId={session.user.id} userRole={session.user.role} />
    </div>
  );
}
