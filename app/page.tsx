import Navbar from "@/domains/shared/components/Navbar";
import HeroBanner from "@/domains/shared/components/HeroBanner";
import Features from "@/domains/shared/components/Features";
import Cta from "@/domains/shared/components/Cta";
import Footer from "@/domains/shared/components/Footer";
import LightDarkModeButton from "@/domains/shared/components/LightDarkModeButton";
import ApiConnectionTest from "@/domains/shared/components/ApiConnectionTest";

// Desabilitar static rendering para esta página
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <div className="front-page-body overflow-hidden min-h-screen bg-white dark:bg-gray-900">
        <LightDarkModeButton />
        
        {/* Teste de Conexão com API - Remover em produção */}
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <ApiConnectionTest />
        </div>
        
        <Navbar />
        
        <HeroBanner />
        
        <Features />
        
        <Cta />
        
        <Footer />
      </div>
    </>
  );
}
