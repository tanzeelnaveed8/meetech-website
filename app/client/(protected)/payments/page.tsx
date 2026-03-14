import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import PaymentsClient from '@/components/client/PaymentsClient';

export default async function PaymentsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/client/login');
  }

  return <PaymentsClient />;
}
