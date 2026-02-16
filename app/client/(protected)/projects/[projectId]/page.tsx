import { auth } from '@/lib/auth/auth';
import ProjectDetailClient from '@/components/client/ProjectDetailClient';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  const { projectId } = await params;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/client/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <ProjectDetailClient projectId={projectId} />
    </div>
  );
}
