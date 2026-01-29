import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLeadById } from '@/lib/db/queries/leads';
import LeadDetailView from '@/components/admin/LeadDetailView';

export const metadata: Metadata = {
  title: 'Lead Details | Admin',
};

interface LeadDetailPageProps {
  params: Promise<{
    leadId: string;
  }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params;
  const lead = await getLeadById(leadId);

  if (!lead) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LeadDetailView lead={lead} />
    </div>
  );
}
