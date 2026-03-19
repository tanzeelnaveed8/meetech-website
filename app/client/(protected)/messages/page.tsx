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
    <div className='p-4 md:p-10'>
      <div className="mb-6  ">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-4 lg:mb-10">

          <nav className="flex text-text-muted p-2 rounded-lg border border-accent/15 bg-accent/10" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <a href="/" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
                  <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /></svg>
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                  <a href="#" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">Client</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                  <span className="inline-flex items-center text-sm font-medium text-body-subtle">Your Chats</span>
                </div>
              </li>
            </ol>
          </nav>

        </div>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl  font-semibold text-text-primary mb-1">Messages</h1>
        <p className="text-sm text-text-muted">Chat directly with your manager</p>
      </div>

      <Suspense fallback={<div className="rounded-xl border border-border-default bg-bg-card shadow-sm overflow-hidden flex items-center justify-center pb-44" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent " /></div>}>
        <MessagesClient userId={session.user.id} userRole={session.user.role} />
      </Suspense>
    </div>
  );
}
