import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import ClientLayout from '@/components/client/ClientLayout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'CLIENT') {
    redirect('/client/login');
  }

  return (
    <ClientLayout user={{ name: session.user.name || '', email: session.user.email || '' }}>
      {children}
    </ClientLayout>
  );
}
