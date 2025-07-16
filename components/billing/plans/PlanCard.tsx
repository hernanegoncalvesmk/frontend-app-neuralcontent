"use client";

import { useTranslation } from 'react-i18next';
import { Plan, BillingPeriod } from '@/types/plans.types';

interface PlanCardProps {
  plan: Plan;
  billingPeriod: BillingPeriod;
  isCurrentPlan?: boolean;
  onSelectPlan: (plan: Plan, billingPeriod: BillingPeriod) => void;
}

export default function PlanCard({ 
  plan, 
  billingPeriod, 
  isCurrentPlan, 
  onSelectPlan 
}: PlanCardProps) {
  const { t: tBilling } = useTranslation('billing');
  
  const getCurrentPrice = () => plan.price[billingPeriod];
  const getOriginalPrice = () => plan.originalPrice?.[billingPeriod];
  const getDiscount = () => {
    if (billingPeriod === 'quarterly') return plan.discount?.quarterly;
    if (billingPeriod === 'annual') return plan.discount?.annual;
    return 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPeriodLabel = () => {
    switch (billingPeriod) {
      case 'monthly': return tBilling('periodLabels.monthly');
      case 'quarterly': return tBilling('periodLabels.quarterly');
      case 'annual': return tBilling('periodLabels.annual');
      default: return tBilling('periodLabels.monthly');
    }
  };

  const getSavingsText = () => {
    if (billingPeriod === 'quarterly') {
      const monthlySavings = (plan.price.monthly * 3) - plan.price.quarterly;
      return `${tBilling('savings.label')}: ${formatPrice(monthlySavings)}`;
    }
    if (billingPeriod === 'annual') {
      const monthlySavings = (plan.price.monthly * 12) - plan.price.annual;
      return `${tBilling('savings.label')}: ${formatPrice(monthlySavings)}`;
    }
    return null;
  };

  return (
    <div className={`
      relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border 
      transition-all duration-300 hover:shadow-lg h-full flex flex-col
      ${plan.isPopular 
        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }
    `}>
      {/* Badge "Mais Popular" - Melhorado com contraste e visual Trezo */}
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg border-2 border-white dark:border-gray-800">
            ⭐ {tBilling('popular')}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        {/* Header do Plano */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {plan.name}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-6 leading-relaxed">
            {plan.description}
          </p>
          
          {/* Preço */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatPrice(getCurrentPrice())}
              </span>
              <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">
                {getPeriodLabel()}
              </span>
            </div>
            
            {/* Preço original e desconto */}
            {getOriginalPrice() && getDiscount() && (
              <div className="text-center mb-2">
                <span className="text-gray-500 dark:text-gray-400 line-through text-lg mr-2">
                  {formatPrice(getOriginalPrice()!)}
                </span>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
                  -{getDiscount()}% OFF
                </span>
              </div>
            )}
            
            {/* Texto de economia */}
            {getSavingsText() && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                {getSavingsText()}
              </p>
            )}
          </div>

          {/* Créditos */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div className="flex justify-center items-center">
              <span className="material-icons text-blue-600 mr-2">auto_awesome</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {plan.credits} créditos mensais
              </span>
            </div>
            {plan.bonusCredits > 0 && (
              <div className="text-center mt-2">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +{plan.bonusCredits} créditos bônus
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Features */}
        <div className="flex-1 mb-8">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Recursos incluídos:
          </h4>
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li key={feature.id} className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {feature.included ? (
                    <span className="material-icons text-green-500 text-lg">check_circle</span>
                  ) : (
                    <span className="material-icons text-gray-400 text-lg">cancel</span>
                  )}
                </div>
                <span className={`
                  ml-3 text-sm leading-relaxed
                  ${feature.included 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-gray-400 dark:text-gray-500 line-through'
                  }
                `}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botão de Seleção - Padronizado com outros botões do sistema */}
        <div className="mt-auto">
          {isCurrentPlan ? (
            <button
              disabled
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-4 rounded-xl font-semibold text-base transition-colors cursor-not-allowed border border-gray-200 dark:border-gray-600"
            >
              <span className="material-icons mr-2 text-lg">check</span>
              {tBilling('buttons.currentPlan')}
            </button>
          ) : (
            <button
              onClick={() => onSelectPlan(plan, billingPeriod)}
              className={`
                w-full px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-105 active:scale-95
                ${plan.isPopular
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }
              `}
            >
              <span className="material-icons mr-2 text-lg">rocket_launch</span>
              {tBilling('buttons.choose')} {plan.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
