import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | MEETECH',
  description: 'Sign in to access the MEETECH admin panel',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
