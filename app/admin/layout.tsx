"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth"; // Será implementado posteriormente

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // const { user, isLoading } = useAuth(); // Será implementado posteriormente

  // Verificação temporária de permissões (será melhorada posteriormente)
  useEffect(() => {
    // Temporariamente comentado para não bloquear durante desenvolvimento
    // if (!isLoading && (!user || user.role !== 'admin')) {
    //   router.push('/dashboard');
    //   return;
    // }
  }, [router]);

  // Loading state temporário
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="admin-layout">
      {/* Conteúdo principal sem header */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
