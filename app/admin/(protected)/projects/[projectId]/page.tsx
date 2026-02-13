import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import AdminProjectDetail from '@/components/admin/AdminProjectDetail';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();

  if (!session?.user || !['ADMIN', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  const { projectId } = await params;

  return <AdminProjectDetail projectId={projectId} />;
}
