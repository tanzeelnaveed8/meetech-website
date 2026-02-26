import { Suspense } from 'react';
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
        <p className="text-sm text-text-muted">Chat directly with your manager</p>
      </div>

      <Suspense fallback={<div className="rounded-xl border border-border-default bg-bg-card shadow-sm overflow-hidden flex items-center justify-center" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" /></div>}>
        <MessagesClient userId={session.user.id} userRole={session.user.role} />
      </Suspense>
    </div>
  );
}
