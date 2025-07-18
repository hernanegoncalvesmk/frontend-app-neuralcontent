import Navbar from "@/components/landing/Navbar";
import HeroBanner from "@/components/landing/HeroBanner";
import Features from "@/components/landing/Features";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import LightDarkModeButton from "@/components/landing/LightDarkModeButton";
import ApiConnectionTest from "@/components/ApiConnectionTest";
import LanguageSelectorExamples from "@/components/LanguageSelectorExamples";

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

        {/* Exemplos de Seletores de Idioma */}
        <LanguageSelectorExamples />
        
        <Navbar />
        
        <HeroBanner />
        
        <Features />
        
        <Cta />
        
        <Footer />
      </div>
    </>
  );
}
