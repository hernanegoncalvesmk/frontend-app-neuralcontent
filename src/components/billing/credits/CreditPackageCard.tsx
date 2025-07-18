// ============================================================================
// NEURAL CONTENT - COMPONENTE DE PACOTE DE CRÉDITOS
// ============================================================================

/**
 * Componente para exibir e comprar pacotes de créditos
 * 
 * @description Card de pacote seguindo padrões visuais dos cards de planos
 * com informações de preço, desconto e recursos inclusos
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { CreditPackage } from '@/types/credits.types';
import { creditsService } from '@/services/credits.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface CreditPackageCardProps {
  package: CreditPackage;
  loading?: boolean;
  onPurchase: (packageId: string) => void;
  className?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function CreditPackageCard({
  package: pkg,
  loading = false,
  onPurchase,
  className = ''
}: CreditPackageCardProps) {
  
  // ============================================================================
  // CÁLCULOS E FORMATAÇÃO
  // ============================================================================

  const hasDiscount = pkg.originalPrice && pkg.originalPrice > pkg.price;
  const discountPercentage = hasDiscount 
    ? creditsService.calculateDiscount(pkg.originalPrice!, pkg.price)
    : 0;

  const pricePerCredit = pkg.price / pkg.credits;
  const totalCredits = pkg.credits + (pkg.bonusCredits || 0);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
        p-6 animate-pulse h-full ${className}
      `}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`
      relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border 
      transition-all duration-300 hover:shadow-lg h-full flex flex-col
      ${pkg.isPopular 
        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }
      ${className}
    `}>
      {/* Badge "Mais Popular" */}
      {pkg.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg border-2 border-white dark:border-gray-800">
            ⭐ Mais Popular
          </div>
        </div>
      )}

      <div className="p-6 lg:p-8 flex-1 flex flex-col">
        {/* Header do Pacote */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-xl p-3 mr-3">
              <span className="material-icons text-blue-600 dark:text-blue-400 text-2xl">
                {pkg.icon || 'account_balance_wallet'}
              </span>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {pkg.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pkg.description}
              </p>
            </div>
          </div>

          {/* Preço */}
          <div className="mb-4">
            {hasDiscount && (
              <div className="text-center mb-2">
                <span className="text-gray-500 dark:text-gray-400 line-through text-lg">
                  {creditsService.formatCurrency(pkg.originalPrice!)}
                </span>
                <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
                  -{discountPercentage}%
                </span>
              </div>
            )}
            
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {creditsService.formatCurrency(pkg.price)}
              </span>
            </div>
            
            <div className="text-center mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {creditsService.formatCurrency(pricePerCredit)} por crédito
              </span>
            </div>
          </div>

          {/* Créditos */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="material-icons text-blue-600 dark:text-blue-400 mr-2">
                auto_awesome
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {creditsService.formatCredits(pkg.credits)}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">
                créditos
              </span>
            </div>
            
            {pkg.bonusCredits && pkg.bonusCredits > 0 && (
              <div className="text-center">
                <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-medium">
                  + {creditsService.formatCredits(pkg.bonusCredits)} créditos bônus
                </span>
              </div>
            )}

            {totalCredits !== pkg.credits && (
              <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                Total: {creditsService.formatCredits(totalCredits)} créditos
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="flex-1 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
            O que está incluído:
          </h4>
          <ul className="space-y-3">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="material-icons text-green-500 text-lg mt-0.5 mr-3 flex-shrink-0">
                  check_circle
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Informações Adicionais */}
        {pkg.validityDays && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              <span className="material-icons text-xs mr-2">schedule</span>
              Validade: {pkg.validityDays} dias
            </div>
          </div>
        )}

        {/* Botão de Compra */}
        <div className="mt-auto">
          <button
            onClick={() => onPurchase(pkg.id)}
            disabled={loading}
            className={`
              w-full px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200 
              transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${pkg.isPopular
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }
            `}
          >
            <span className="material-icons mr-2 text-lg">shopping_cart</span>
            Comprar {pkg.name}
          </button>
        </div>
      </div>

      {/* Ribbon de Economia (se houver desconto significativo) */}
      {hasDiscount && discountPercentage >= 20 && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">
          Economize {discountPercentage}%
        </div>
      )}
    </div>
  );
}
