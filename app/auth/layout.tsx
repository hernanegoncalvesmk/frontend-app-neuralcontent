'use client';

import { AuthProvider } from '@/infrastructure/providers/AuthProvider';
import AuthLanguageSelector from '@/domains/auth/components/AuthLanguageSelector';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-[#0a0e19] dark:to-gray-900 relative">
        <AuthLanguageSelector />
        {children}
      </div>
    </AuthProvider>
  );
}
