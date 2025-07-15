'use client';

import { AuthProvider } from '@/providers/AuthProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-[#0a0e19] dark:to-gray-900">
        {children}
      </div>
    </AuthProvider>
  );
}
