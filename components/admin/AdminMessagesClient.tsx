'use client';

import MessagesClient from '@/components/client/MessagesClient';

interface AdminMessagesClientProps {
  userId: string;
  userRole: string;
}

export default function AdminMessagesClient({
  userId,
  userRole,
}: AdminMessagesClientProps) {
  return <MessagesClient userId={userId} userRole={userRole} />;
}
