import AdminLayout from '@/components/admin/AdminLayout';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  return <AdminLayout>{children}</AdminLayout>;
}
